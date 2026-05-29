/**
 * Builds the app using Vercel's Build Output API v3.
 * This guarantees the API serverless function is detected correctly —
 * no reliance on Vercel's zero-config auto-detection (which only fires for
 * pre-existing files, not files created during the build).
 *
 * Output structure:
 *   .vercel/output/
 *     config.json          ← routing rules
 *     static/              ← React frontend (copied from dist/public)
 *     functions/
 *       api.func/
 *         .vc-config.json  ← Vercel function config
 *         index.js         ← bundled Express app
 *
 * Run via: pnpm --filter @workspace/api-server exec node build-vercel.mjs
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, cpSync, writeFileSync, rmSync } from 'node:fs';

globalThis.require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const vercelOut   = path.join(root, '.vercel/output');
const staticDir   = path.join(vercelOut, 'static');
const funcDir     = path.join(vercelOut, 'functions/api.func');
const distPublic  = path.join(root, 'artifacts/portfolio/dist/public');

// Clean previous output
rmSync(vercelOut, { recursive: true, force: true });
mkdirSync(staticDir, { recursive: true });
mkdirSync(funcDir,   { recursive: true });

// ── 1. Copy static frontend ──────────────────────────────────────────────────
console.log('Copying static files…');
cpSync(distPublic, staticDir, { recursive: true });
console.log('✓ Static files copied');

// ── 2. Bundle Express API ────────────────────────────────────────────────────
const outFile = path.join(funcDir, 'index.js');
console.log(`Building API handler → ${outFile}`);

await build({
  entryPoints: [path.join(root, 'api/_handler.ts')],
  platform: 'node',
  bundle: true,
  format: 'cjs',
  outfile: outFile,
  logLevel: 'info',
  sourcemap: false,
  external: [
    '*.node',
    'pg-native',
    'fsevents',
    'pino-pretty',
    'bcrypt',
    'argon2',
    'canvas',
    'sharp',
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).catch((e) => {
  console.error('esbuild failed:', e.message);
  process.exit(1);
});
console.log('✓ API handler bundled');

// ── 3. Function config ───────────────────────────────────────────────────────
writeFileSync(
  path.join(funcDir, '.vc-config.json'),
  JSON.stringify({
    runtime: 'nodejs20.x',
    handler: 'index.js',
    launcherType: 'Nodejs',
    shouldAddHelpers: true,
  }, null, 2),
);
console.log('✓ Function config written');

// ── 4. Route config ──────────────────────────────────────────────────────────
// Vercel Build Output API v3 routing:
//   /api(.*) → function (Express handles /api/* internally)
//   handle filesystem → serve static files from .vercel/output/static/
//   /(.*) → /index.html  (SPA fallback)
writeFileSync(
  path.join(vercelOut, 'config.json'),
  JSON.stringify({
    version: 3,
    routes: [
      { src: '/api(.*)', dest: '/api' },
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/index.html' },
    ],
  }, null, 2),
);
console.log('✓ Build Output API config written');
console.log('');
console.log('Build complete → .vercel/output/');
