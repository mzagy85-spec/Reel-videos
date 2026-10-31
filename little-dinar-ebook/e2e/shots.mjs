// Screenshot every page in both languages at a phone and a desktop width.
// Usage: node e2e/shots.mjs <baseUrl> <outDir> [pages] [widths]
import { createRequire } from 'node:module';
// Uses the machine's preinstalled Playwright (not a project dependency).
const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdirSync } from 'node:fs';
const [base = 'http://localhost:4173/', out = 'e2e/out', pagesArg = '1-15', widthsArg = '390,1280'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const [a, b] = pagesArg.split('-').map(Number);
const pages = Array.from({ length: (b ?? a) - a + 1 }, (_, i) => a + i);
const widths = widthsArg.split(',').map(Number);
const browser = await chromium.launch();
const errors = [];
for (const w of widths) {
  for (const lang of ['ar', 'en']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 860 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${lang} ${w}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${lang} ${w} console: ${m.text()}`); });
    for (const n of pages) {
      await page.goto(`${base}?lang=${lang}#/page/${n}`);
      await page.waitForSelector('#page-heading');
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${out}/${lang}-${w}-p${String(n).padStart(2, '0')}.png`, fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(errors.length ? errors.join('\n') : 'no page errors');
