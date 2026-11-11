import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [src, out] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto('file://' + src, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
const over = await p.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => {
  if (i === 0) return null;
  const r = s.getBoundingClientRect(); let max = 0;
  s.querySelectorAll('*:not(.footer):not(.footer *)').forEach((e) => { const b = e.getBoundingClientRect(); if (b.height) max = Math.max(max, b.bottom - r.top); });
  return max > 690 ? `slide ${i + 1}: ${Math.round(max)}px` : null;
}).filter(Boolean));
console.log('overflow:', over.length ? over.join(', ') : 'none');
await p.pdf({ path: out, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true });
await b.close();
