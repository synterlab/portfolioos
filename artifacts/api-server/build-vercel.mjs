/**
 * Bundles the Express API handler and writes it to the Vercel Build Output API
 * structure so it's properly registered as a serverless function.
 *
 * Run via: pnpm --filter @workspace/api-server exec node build-vercel.mjs
 * (Runs from artifacts/api-server/, so ../../ = workspace root)
 *
 * Vercel Build Output API docs:
 *   https://vercel.com/docs/build-output-api/v3
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync, existsSync, cpSync } from 'node:fs';

globalThis.require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

// Vercel Build Output API: functions go in /vercel/output/functions/<route>.func/
// Fallback: write to project root api/ for local/non-Vercel builds
const vercelOutput = process.env.VERCEL_OUTPUT || '/vercel/output';
const isVercel = existsSync(vercelOutput);

let outDir;
let outFile;

if (isVercel) {
  outDir = path.join(vercelOutput, 'functions/api/index.func');
  outFile = path.join(outDir, 'index.js');
} else {
  // Local fallback: write to api/index.js in repo root
  outDir = path.join(root, 'api');
  outFile = path.join(outDir, 'index.js');
}

mkdirSync(outDir, { recursive: true });

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

if (isVercel) {
  // Write Vercel function config
  const vcConfig = {
    runtime: 'nodejs22.x',
    handler: 'index.js',
    launcherType: 'Nodejs',
    shouldAddHelpers: true,
  };
  writeFileSync(path.join(outDir, '.vc-config.json'), JSON.stringify(vcConfig, null, 2));

  // Copy frontend static files into /vercel/output/static/
  // This is required when using the Build Output API — Vercel won't pick up
  // outputDirectory from vercel.json when Build Output API files are present.
  const staticDir = path.join(vercelOutput, 'static');
  const frontendDist = path.join(root, 'artifacts/portfolio/dist/public');
  mkdirSync(staticDir, { recursive: true });
  cpSync(frontendDist, staticDir, { recursive: true });
  console.log(`✓ Frontend static files copied → ${staticDir}`);

  // Write the top-level routes config so Vercel knows how to route requests
  const configPath = path.join(vercelOutput, 'config.json');
  const config = {
    version: 3,
    routes: [
      { src: '/api/(.*)', dest: '/api/index' },
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/index.html' },
    ],
  };
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✓ Vercel Build Output API: function + config written');
} else {
  console.log('✓ api/index.js built (local mode)');
}
