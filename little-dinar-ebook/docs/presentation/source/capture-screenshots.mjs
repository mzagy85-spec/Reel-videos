import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2];
const B = 'http://localhost:4173/';
const b = await chromium.launch();
async function ctx(w, h, rm = 'reduce') { const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, reducedMotion: rm }); return [c, await c.newPage()]; }
const settle = (p, ms = 900) => p.waitForTimeout(ms);
const hidePager = (p) => p.addStyleTag({ content: '.pager{display:none!important} .book{padding-bottom:0!important}' });

// Desktop covers
for (const l of ['en', 'ar']) {
  const [c, p] = await ctx(1280, 800);
  await p.goto(`${B}?lang=${l}#/page/1`); await p.waitForSelector('.scene-art'); await settle(p, 1400);
  await p.screenshot({ path: `${out}/cover-${l}.png` });
  await c.close();
}
// Desktop page thumbnails 2..15 (viewport only, pager hidden)
{
  const [c, p] = await ctx(1280, 720);
  for (let n = 2; n <= 15; n++) {
    await p.goto(`${B}?lang=en#/page/${n}`); await p.waitForSelector('.scene-art'); await hidePager(p); await settle(p);
    await p.screenshot({ path: `${out}/en-p${String(n).padStart(2, '0')}.png` });
  }
  await c.close();
}
// Phone frames
for (const [n, l] of [[2, 'ar'], [3, 'en'], [7, 'ar'], [9, 'en'], [11, 'ar'], [14, 'en'], [15, 'ar']]) {
  const [c, p] = await ctx(390, 844);
  await p.goto(`${B}?lang=${l}#/page/${n}`); await p.waitForSelector('.scene-art'); await settle(p);
  await p.screenshot({ path: `${out}/phone-${l}-p${n}.png` });
  await c.close();
}
// Activities mid-play (element shots)
{
  const [c, p] = await ctx(1280, 900);
  await p.goto(`${B}?lang=en#/page/3`); await p.waitForSelector('.token-btn');
  for (let i = 0; i < 10; i++) await p.locator('.token-pool .token-btn').first().click();
  await settle(p, 400); await p.locator('.tokens-activity').screenshot({ path: `${out}/act-tokens.png` });

  await p.evaluate(() => { location.hash = '#/page/5'; }); await p.waitForSelector('.jars');
  await p.getByRole('button', { name: 'Try a sample plan' }).click(); await settle(p, 400);
  await p.locator('.jars-activity').screenshot({ path: `${out}/act-jars.png` });

  await p.evaluate(() => { location.hash = '#/page/7'; }); await p.waitForSelector('.shelf');
  for (const n of ['School notebook', 'Pencil', 'Stickers']) await p.getByRole('button', { name: `Add ${n} to basket` }).click();
  await settle(p, 400); await p.locator('.shop-activity').screenshot({ path: `${out}/act-shop.png` });

  await p.evaluate(() => { location.hash = '#/page/9'; }); await p.waitForSelector('.map-board');
  await p.getByRole('button', { name: 'Piece: Bank' }).click(); await p.getByRole('button', { name: /row 2, position 3/ }).click();
  await p.getByRole('button', { name: 'Piece: Kuwait Towers' }).click(); await p.getByRole('button', { name: /row 1, position 1/ }).click();
  await p.getByRole('button', { name: 'Piece: Home' }).click(); await p.getByRole('button', { name: /row 2, position 1/ }).click();
  await settle(p, 500); await p.locator('.map-stage').screenshot({ path: `${out}/act-map.png` });
  for (let i = 0; i < 3; i++) await p.getByRole('button', { name: 'Place one for me' }).click();
  await p.getByRole('group', { name: /Plan a savings goal/ }).getByRole('button', { name: 'Home' }).click();
  await settle(p, 400); await p.locator('.missions').screenshot({ path: `${out}/act-missions.png` });

  await p.evaluate(() => { location.hash = '#/page/10'; }); await p.waitForSelector('.ledger-boxes');
  await p.getByRole('button', { name: 'Deposit 1.000 KWD' }).click(); await settle(p, 500);
  await p.locator('.ledger-activity').screenshot({ path: `${out}/act-ledger.png` });

  await p.evaluate(() => { location.hash = '#/page/12'; }); await p.waitForSelector('.practice-message');
  await p.getByRole('button', { name: /Stop, close the message/ }).click(); await settle(p, 400);
  await p.locator('.safety-activity').screenshot({ path: `${out}/act-safety.png` });
  await c.close();
}
// Crossword in Arabic, partly solved
{
  const [c, p] = await ctx(1280, 1000);
  await p.goto(`${B}?lang=ar#/page/14`); await p.waitForSelector('.xw-grid');
  await p.locator('.clue', { hasText: 'ألف منه يساوي' }).click(); await p.locator('.word-chip', { hasText: 'فلس' }).click();
  await p.locator('.clue', { hasText: 'خطة لاستخدام المال' }).click(); await p.locator('.word-chip', { hasText: 'ميزانية' }).click();
  await p.locator('.clue', { hasText: 'عملة الكويت' }).click(); await p.locator('.word-chip', { hasText: 'دينار' }).click();
  await settle(p, 500); await p.locator('.xw-board-wrap').screenshot({ path: `${out}/act-crossword-ar.png` });
  await c.close();
}
// neo placements
{
  const [c, p] = await ctx(1280, 900);
  await p.goto(`${B}?lang=en#/page/1`); await p.waitForSelector('.neo-intro'); await settle(p, 1400);
  await p.locator('.neo-intro').screenshot({ path: `${out}/neo-intro-en.png` });
  await p.locator('.cover-panel .neo-guide').screenshot({ path: `${out}/neo-guide-cover.png` });
  await p.evaluate(() => { location.hash = '#/page/9'; }); await p.waitForSelector('.neo-panel'); await settle(p);
  await p.locator('.neo-panel').screenshot({ path: `${out}/neo-panel-en.png` });
  await p.evaluate(() => { location.hash = '#/page/11'; }); await p.waitForSelector('.neo-guide-card'); await settle(p);
  await p.locator('.neo-guide-card').screenshot({ path: `${out}/neo-card-guide-en.png` });
  await p.goto(`${B}?lang=ar#/page/1`); await p.waitForSelector('.neo-intro'); await settle(p, 1400);
  await p.locator('.neo-intro').screenshot({ path: `${out}/neo-intro-ar.png` });
  await p.goto(`${B}?lang=en#/page/15`); await p.waitForSelector('.closing-info');
  await p.getByRole('button', { name: 'For parents' }).click(); await settle(p, 600);
  await p.locator('dialog[open]').screenshot({ path: `${out}/parent-drawer.png` });
  await c.close();
}
await b.close();
console.log('done');
