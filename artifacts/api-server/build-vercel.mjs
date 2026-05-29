/**
 * Bundles the Express API handler into api/index.js for Vercel serverless.
 * Run via: pnpm --filter @workspace/api-server exec node build-vercel.mjs
 * (Runs from artifacts/api-server/, so ../../api/ = workspace root api/)
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

globalThis.require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

await build({
  entryPoints: [path.join(root, 'api/_handler.ts')],
  platform: 'node',
  bundle: true,
  format: 'cjs',
  outfile: path.join(root, 'api/index.js'),
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
  // CJS interop for ESM-only packages bundled into CJS output
  banner: {
    js: `
const { createRequire: __cjsCrReq } = require('module');
const __cjsRequire = __cjsCrReq(typeof __filename !== 'undefined' ? 'file://' + __filename : import.meta.url);
`,
  },
}).catch((e) => {
  console.error('esbuild failed:', e.message);
  process.exit(1);
});

console.log('✓ api/index.js built for Vercel serverless');
