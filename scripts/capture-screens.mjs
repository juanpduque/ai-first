/**
 * Capturas de todas las pantallas (paneles .h-panel en #hScroll).
 * Uso: npm run screenshots
 *
 * Chromium en ./.playwright-browsers (evita conflicto con PLAYWRIGHT_BROWSERS_PATH del entorno).
 * Primera vez: npm run screenshots:setup
 */
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const srcDir = join(projectRoot, 'src');
const outDir = join(projectRoot, 'screenshots');

function slug(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'pantalla';
}

function startStaticServer(port) {
  return new Promise((resolve, reject) => {
    const proc = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
      cwd: srcDir,
      stdio: 'ignore',
    });
    proc.on('error', reject);
    setTimeout(() => resolve(proc), 400);
  });
}

/** Pantalla diagrama: setView(1–3) + captura; si hay scroll horizontal en el área, segunda toma a la derecha. */
async function captureDiagramScreenshots(page, outDir) {
  const levels = [
    { n: 1, slug: 'nivel-1-capacidades' },
    { n: 2, slug: 'nivel-2-roles' },
    { n: 3, slug: 'nivel-3-artefactos' },
  ];

  for (const { n, slug } of levels) {
    await page.evaluate((viewNum) => {
      if (typeof window.setView === 'function') window.setView(viewNum);
    }, n);
    await delay(600);

    await page.evaluate(() => {
      const root = document.getElementById('pantalla-18');
      const el = root && root.querySelector('.flex-grow.overflow-auto');
      if (el) {
        el.scrollLeft = 0;
        el.scrollTop = 0;
      }
    });
    await delay(200);

    let pathPng = join(outDir, `18-diagrama-${slug}.png`);
    await page.screenshot({ path: pathPng, type: 'png' });
    console.log('  ✓', pathPng);

    const maxLeft = await page.evaluate(() => {
      const root = document.getElementById('pantalla-18');
      const el = root && root.querySelector('.flex-grow.overflow-auto');
      if (!el) return 0;
      return Math.max(0, el.scrollWidth - el.clientWidth);
    });

    if (maxLeft > 48) {
      await page.evaluate((left) => {
        const root = document.getElementById('pantalla-18');
        const el = root && root.querySelector('.flex-grow.overflow-auto');
        if (el) el.scrollLeft = left;
      }, maxLeft);
      await delay(350);
      pathPng = join(outDir, `18-diagrama-${slug}-scroll-derecha.png`);
      await page.screenshot({ path: pathPng, type: 'png' });
      console.log('  ✓', pathPng);
    }

    const maxTop = await page.evaluate(() => {
      const root = document.getElementById('pantalla-18');
      const el = root && root.querySelector('.flex-grow.overflow-auto');
      if (!el) return 0;
      return Math.max(0, el.scrollHeight - el.clientHeight);
    });

    if (maxTop > 80) {
      await page.evaluate((top) => {
        const root = document.getElementById('pantalla-18');
        const el = root && root.querySelector('.flex-grow.overflow-auto');
        if (el) {
          el.scrollLeft = 0;
          el.scrollTop = top;
        }
      }, maxTop);
      await delay(350);
      pathPng = join(outDir, `18-diagrama-${slug}-scroll-abajo.png`);
      await page.screenshot({ path: pathPng, type: 'png' });
      console.log('  ✓', pathPng);
    }
  }
}

async function main() {
  process.env.PLAYWRIGHT_BROWSERS_PATH = join(projectRoot, '.playwright-browsers');
  const { chromium } = await import('playwright');

  if (!existsSync(join(srcDir, 'index.html'))) {
    console.error('No existe src/index.html. Ejecuta: npm run build');
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  const port = 9876 + Math.floor(Math.random() * 200);
  let serverProc;
  try {
    serverProc = await startStaticServer(port);
  } catch (e) {
    console.error('No se pudo iniciar python3 -m http.server. ¿Tienes Python 3?');
    process.exit(1);
  }

  const base = `http://127.0.0.1:${port}/`;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#hScroll');
    await delay(800);

    const meta = await page.evaluate(() => {
      const h = document.getElementById('hScroll');
      if (!h) return [];
      return Array.from(h.querySelectorAll(':scope > .h-panel')).map((el, i) => ({
        index: i + 1,
        id: el.id || `panel-${i + 1}`,
        title: el.getAttribute('data-screen-title') || el.id || `Pantalla ${i + 1}`,
        left: el.offsetLeft,
      }));
    });

    if (!meta.length) {
      console.error('No se encontraron paneles .h-panel en #hScroll');
      process.exit(1);
    }

    const diagramCount = meta.filter((m) => m.id === 'pantalla-18').length;
    const extraDiag = diagramCount ? ' (+ diagrama: 3 niveles y scroll si aplica)' : '';
    console.log(`Capturando ${meta.length} pantallas${extraDiag} → ${outDir}`);

    for (const m of meta) {
      await page.evaluate((left) => {
        const h = document.getElementById('hScroll');
        if (h) h.scrollTo({ left, behavior: 'instant' });
      }, m.left);
      await delay(500);

      if (m.id === 'pantalla-18') {
        await captureDiagramScreenshots(page, outDir);
        continue;
      }

      const fileBase = `${String(m.index).padStart(2, '0')}-${slug(m.title)}`;
      const pathPng = join(outDir, `${fileBase}.png`);
      await page.screenshot({ path: pathPng, type: 'png' });
      console.log('  ✓', pathPng);
    }

    console.log('Listo.');
  } finally {
    await browser.close();
    serverProc.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
