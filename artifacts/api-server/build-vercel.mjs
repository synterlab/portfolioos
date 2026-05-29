/**
 * Bundles the Express API handler to api/index.js so Vercel auto-detects it
 * as a serverless function. Static frontend files are served via vercel.json
 * outputDirectory pointing at the Vite build output.
 *
 * Run via: pnpm --filter @workspace/api-server exec node build-vercel.mjs
 * (Runs from artifacts/api-server/, so ../../ = workspace root)
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

globalThis.require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

// Build to api/index.js at the project root.
// Vercel auto-detects api/*.js as serverless functions.
const outDir = path.join(root, 'api');
const outFile = path.join(outDir, 'index.js');

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

console.log('✓ api/index.js built');
