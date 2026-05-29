#!/usr/bin/env node
/**
 * Push workspace to GitHub via REST API (no git CLI needed)
 * Handles empty repo bootstrap then full tree push.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'synterlab';
const REPO = 'portfolioos';
const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}`;

if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN not set');

const HEADERS = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'portfolioos-deploy',
};

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', 'dist', '.local', '.cache',
  '.pnpm-store', 'coverage', '.turbo', 'scripts',
]);
const EXCLUDE_EXTENSIONS = new Set(['.tsbuildinfo', '.map', '.log']);
const EXCLUDE_FILES = new Set(['push-github.mjs']);

function shouldExclude(relPath) {
  const parts = relPath.split('/');
  for (const part of parts) {
    if (EXCLUDE_DIRS.has(part)) return true;
  }
  const ext = relPath.match(/\.[^./]+$/)?.[0] || '';
  if (EXCLUDE_EXTENSIONS.has(ext)) return true;
  if (EXCLUDE_FILES.has(parts[parts.length - 1])) return true;
  return false;
}

function collectFiles(dir, root) {
  const files = [];
  let entries;
  try { entries = readdirSync(dir); } catch { return files; }
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const relPath = relative(root, fullPath);
    if (shouldExclude(relPath)) continue;
    let stat;
    try { stat = statSync(fullPath); } catch { continue; }
    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath, root));
    } else if (stat.isFile() && stat.size < 5 * 1024 * 1024) {
      files.push({ path: relPath, fullPath, size: stat.size });
    }
  }
  return files;
}

async function ghFetch(url, method = 'GET', body = null) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const opts = { method, headers: HEADERS };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(fullUrl, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(`GitHub API ${res.status} at ${fullUrl}: ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

function isBinary(buf) {
  // Check first 512 bytes for null bytes
  const check = buf.slice(0, 512);
  for (let i = 0; i < check.length; i++) {
    if (check[i] === 0) return true;
  }
  return false;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const root = process.cwd();

  // Step 1: Bootstrap empty repo by creating README via Contents API
  console.log('Bootstrapping empty repo...');
  const readmeContent = Buffer.from('# PortfolioOS\n\nCinematic retro portfolio builder.\n').toString('base64');
  const initResp = await ghFetch('/contents/README.md', 'PUT', {
    message: 'chore: init repo',
    content: readmeContent,
    branch: 'main',
  });
  const baseCommitSha = initResp.commit.sha;
  const baseTreeSha = initResp.commit.tree ? initResp.commit.tree.sha : initResp.commit.parents?.[0]?.sha;
  console.log('Base commit SHA:', baseCommitSha);

  // Get the tree SHA from the commit
  const commitData = await ghFetch(`/git/commits/${baseCommitSha}`);
  const treeSha = commitData.tree.sha;
  console.log('Base tree SHA:', treeSha);

  // Step 2: Collect files
  console.log('Collecting files...');
  const files = collectFiles(root, root);
  console.log(`Found ${files.length} files to push`);

  // Step 3: Split into text and binary
  const textFiles = [];
  const binaryFiles = [];

  for (const file of files) {
    try {
      const buf = readFileSync(file.fullPath);
      if (isBinary(buf)) {
        binaryFiles.push({ path: file.path, content: buf.toString('base64') });
      } else {
        textFiles.push({ path: file.path, content: buf.toString('utf8') });
      }
    } catch (e) {
      console.warn(`Skipping ${file.path}: ${e.message}`);
    }
  }
  console.log(`Text: ${textFiles.length}, Binary: ${binaryFiles.length}`);

  // Step 4: Create blobs for binary files in batches (repo is now initialized)
  const BATCH = 10;
  const binaryTreeEntries = [];
  for (let i = 0; i < binaryFiles.length; i += BATCH) {
    const batch = binaryFiles.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(f =>
        ghFetch('/git/blobs', 'POST', { content: f.content, encoding: 'base64' })
          .then(r => ({ path: f.path, sha: r.sha }))
      )
    );
    for (const r of results) {
      binaryTreeEntries.push({ path: r.path, mode: '100644', type: 'blob', sha: r.sha });
    }
    process.stdout.write(`  Binary blobs: ${Math.min(i + BATCH, binaryFiles.length)}/${binaryFiles.length}\r`);
    await sleep(100);
  }
  console.log('');

  // Step 5: Build full tree — text files inline, binary files by SHA
  const textTreeEntries = textFiles.map(f => ({
    path: f.path,
    mode: '100644',
    type: 'blob',
    content: f.content,
  }));

  // Also include README.md override with proper content
  const allEntries = [...textTreeEntries, ...binaryTreeEntries];

  // Create tree in batches (GitHub limits tree size)
  console.log(`Creating tree with ${allEntries.length} entries...`);
  const tree = await ghFetch('/git/trees', 'POST', {
    base_tree: treeSha,
    tree: allEntries,
  });
  console.log('Tree SHA:', tree.sha);

  // Step 6: Create commit
  console.log('Creating commit...');
  const commit = await ghFetch('/git/commits', 'POST', {
    message: 'feat: initial PortfolioOS deployment\n\nCinematic retro portfolio builder:\n- React + Vite + Clerk auth frontend\n- Express 5 API + Drizzle ORM + PostgreSQL\n- Windows 95 retro OS public portfolio at /p/:username\n- Vercel serverless deployment config',
    tree: tree.sha,
    parents: [baseCommitSha],
    author: { name: 'synterlab', email: 'dev@synterlab.com' },
  });
  console.log('Commit SHA:', commit.sha);

  // Step 7: Update main branch ref
  console.log('Updating main branch...');
  await ghFetch('/git/refs/heads/main', 'PATCH', {
    sha: commit.sha,
    force: false,
  });

  console.log('\n✓ Code pushed to https://github.com/synterlab/portfolioos');
  console.log(`  Commit: ${commit.sha.slice(0, 7)}`);
}

main().catch(e => { console.error('\nFAILED:', e.message); process.exit(1); });
