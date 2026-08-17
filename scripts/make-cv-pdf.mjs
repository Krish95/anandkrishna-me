/**
 * Renders /cv through the print stylesheet into public/anand-krishna-cv.pdf.
 *
 *   npm run cv:pdf
 *
 * Run it after editing src/data/cv.ts, so the PDF and the web CV can't drift.
 *
 * Two deliberate choices:
 *
 * - It serves `dist/` with the tiny static server below instead of shelling out
 *   to `astro preview`. Astro 7's preview is a managed singleton daemon: if one
 *   is already running (say from `npm run preview`), a second invocation refuses
 *   to start and just reports the existing one, so a script that spawns it is
 *   unreliable.
 * - It uses `playwright-core` driving your locally installed Chrome rather than
 *   `playwright`, which downloads its own ~300MB browser. This is an authoring
 *   tool, not part of `npm run build`, and it is the only script here that needs
 *   a browser on the machine.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const ROOT = resolve('dist');
const OUT = 'public/anand-krishna-cv.pdf';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

/** Chrome install locations, most likely first. */
const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

/**
 * Resolves a request path to a file in dist/, mirroring how Cloudflare Pages
 * serves this site: `build.format: 'file'` emits `/cv.html`, reachable at `/cv`.
 */
function resolveFile(urlPath) {
  // normalize + the prefix check keep `..` from escaping dist/.
  const rel = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, rel);
  if (!base.startsWith(ROOT)) return null;

  for (const candidate of [base, `${base}.html`, join(base, 'index.html')]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

if (!existsSync(join(ROOT, 'cv.html'))) {
  console.error('dist/cv.html is missing — run `npx astro build` first (or use `npm run cv:pdf`).');
  process.exit(1);
}

const executablePath = CHROME_PATHS.find((p) => existsSync(p));
if (!executablePath) {
  console.error(
    'No Chrome or Chromium found. Install Chrome, or open /cv in any browser\n' +
      'and use Print → Save as PDF — it uses the very same stylesheet.',
  );
  process.exit(1);
}

const server = createServer((req, res) => {
  const file = resolveFile(req.url ?? '/');
  if (!file) {
    res.writeHead(404).end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});

let browser;
try {
  // Port 0 lets the OS pick a free one, so this never collides with a running
  // dev or preview server.
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const { port } = server.address();

  browser = await chromium.launch({ executablePath });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/cv`, { waitUntil: 'networkidle' });
  // Without this the self-hosted fonts can miss the first paint.
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: OUT,
    format: 'A4',
    // Margins come from the @page rule in src/styles/global.css.
    preferCSSPageSize: true,
    printBackground: false,
    displayHeaderFooter: false,
  });

  console.log(`Wrote ${OUT}`);
} catch (error) {
  console.error(`Failed to render the CV: ${error.message}`);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.close();
}
