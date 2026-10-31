// Lab measurement of the initial route. Profile: Chromium headless, 390x844, throttled network
// (~1.6 Mbps down, 750 Kbps up, 150 ms RTT, i.e. "Slow 4G") and 4x CPU slowdown.
// Run against a static server of dist/: node e2e/perf.mjs http://localhost:4173/
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] ?? 'http://localhost:4173/';
const browser = await chromium.launch();
const runs = [];
for (const lang of ['ar', 'en']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0; const byType = {};
  cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; });
  cdp.on('Network.responseReceived', (e) => { byType[e.response.url.split('/').pop()] = e.response.mimeType; });
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0; window.__inp = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__inp = Math.max(window.__inp, e.duration); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  });
  const t0 = Date.now();
  await page.goto(`${base}?lang=${lang}`, { waitUntil: 'networkidle' });
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(500);
  // Interaction: open contents, then go to page 3 and add a token (event timing gives INP-like duration).
  await page.locator('.topbar .tool-btn').first().tap();
  await page.keyboard.press('Escape');
  await page.evaluate(() => { location.hash = '#/page/3'; });
  await page.waitForSelector('.token-btn');
  await page.locator('.token-pool .token-btn').first().tap();
  await page.waitForTimeout(300);
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), inp: Math.round(window.__inp) }));
  runs.push({ lang, initialTransferKB: Math.round(bytes / 1024), loadToNetworkIdleMs: loadMs, ...m });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(runs, null, 2));
