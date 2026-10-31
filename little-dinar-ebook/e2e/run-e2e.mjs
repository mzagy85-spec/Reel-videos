// End-to-end checks against the production build in dist/, served under a sub-path.
// Uses the machine's preinstalled Playwright/Chromium and axe-core from node_modules.
// Run: npm run build && npm run e2e      (results: e2e/out/e2e-results.json)

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const DIST = new URL('../dist/', import.meta.url).pathname;
const SUB = '/kids/money-book/';
const BOOK_PORT = 4301, HOST_PORT = 4300;
const BOOK_ORIGIN = `http://127.0.0.1:${BOOK_PORT}`;
const HOST_ORIGIN = `http://localhost:${HOST_PORT}`;
const OUT = new URL('./out/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };

// Book server: serves dist/ only under the sub-path. index.html gets a test host config (localhost parent allowed).
const book = createServer((req, res) => {
  const url = new URL(req.url, BOOK_ORIGIN);
  if (!url.pathname.startsWith(SUB)) { res.writeHead(404); return res.end('not found'); }
  let rel = url.pathname.slice(SUB.length) || 'index.html';
  let file = join(DIST, rel);
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html');
  let body = readFileSync(file);
  if (file.endsWith('index.html')) {
    body = Buffer.from(body.toString().replace('{ "allowedParentOrigins": [], "showCloseButton": false }', `{ "allowedParentOrigins": ["${HOST_ORIGIN}"], "showCloseButton": true }`));
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'content-security-policy': `frame-ancestors 'self' ${HOST_ORIGIN}` });
  res.end(body);
}).listen(BOOK_PORT, '127.0.0.1');

// Host page on a different origin, embedding the book like the website would.
const host = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><html lang="en"><body>
    <iframe id="book" title="The Little Dinar Journey: interactive money book" src="${BOOK_ORIGIN}${SUB}?lang=ar" style="width:100%;height:800px;border:0" allow="autoplay 'none'"></iframe>
    <script>
      window.received = [];
      window.addEventListener('message', (e) => { if (e.origin === '${BOOK_ORIGIN}') window.received.push(e.data); });
    </script></body></html>`);
}).listen(HOST_PORT, 'localhost');

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: !!ok, detail: String(detail) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`); };
const base = `${BOOK_ORIGIN}${SUB}`;

const browser = await chromium.launch();
async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', (r) => errors.push(`request failed ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  return { ctx, page, errors };
}
// With a language: fresh load. Without: in-session hash navigation, which keeps the reader's state.
const go = async (page, n, lang) => {
  if (lang || !page.url().startsWith(base)) await page.goto(`${base}${lang ? `?lang=${lang}` : ''}#/page/${n}`);
  else { await page.evaluate((x) => { location.hash = `#/page/${x}`; }, n); await page.waitForFunction((x) => document.querySelector('.pager-count')?.textContent?.includes(String(x)), n); }
  await page.waitForSelector('#page-heading');
};
const text = (page) => page.locator('main').innerText();
let sectionNo = 0;
async function section(fn) {
  sectionNo++;
  try { await fn(); } catch (e) { check(`section ${sectionNo} ran to the end`, false, e.message.split('\n')[0]); }
}

try {
  /* ---------- Structure, sub-path hosting, refresh ---------- */
  await section(async () => {
    const { ctx, page, errors } = await newPage();
    await page.goto(base);
    await page.waitForSelector('#page-heading');
    check('Arabic is the default (lang/dir)', (await page.getAttribute('html', 'lang')) === 'ar' && (await page.getAttribute('html', 'dir')) === 'rtl');
    check('Cover is page 1 of 15', (await page.locator('.pager-count').innerText()).includes('1') && (await page.locator('.pager-count').innerText()).includes('15'));
    check('Cover shows short Diraya attribution', (await text(page)).includes('ضمن دعم بنك الخليج لحملة «لنكن على دراية»'));
    await page.getByRole('button', { name: 'المحتويات' }).click();
    const tocCount = await page.locator('.toc li').count();
    check('Contents lists exactly 15 pages', tocCount === 15, tocCount);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'ابدأ الرحلة' }).click();
    await page.waitForFunction(() => location.hash === '#/page/2');
    check('Start the journey goes to page 2', true);
    await go(page, 7);
    await page.reload();
    await page.waitForSelector('#page-heading');
    check('Refresh under /kids/money-book/ stays on the same page', (await page.locator('.pager-count').innerText()).includes('7'));
    for (let n = 1; n <= 15; n++) { await go(page, n); }
    await page.waitForTimeout(300);
    check('All assets load under the sub-path with no errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await page.goto(`${base}#/page/16`);
    await page.waitForSelector('#page-heading');
    check('No hidden 16th page (#/page/16 is ignored)', (await page.locator('.pager-count').innerText()).includes('1'));
    const narr = await page.locator('.narration-btn').count();
    check('No dead narration control while recordings are pending', narr === 0);
    await ctx.close();
  });

  /* ---------- Activities and money logic in the UI ---------- */
  await section(async () => {
    const { ctx, page, errors } = await newPage();
    await go(page, 3, 'en');
    for (let i = 0; i < 12; i++) await page.getByRole('button', { name: 'Add 100 fils', exact: true }).last().click({ force: true }).catch(() => {});
    check('Page 3: ten tokens show 1,000 fils = 1.000 KWD', (await text(page)).includes('1.000 KWD') && (await page.locator('.tray-slot.is-filled').count()) === 10);
    check('Page 3: discovery stamp shown', await page.locator('.stamp-note').isVisible());

    await go(page, 5);
    await page.getByRole('button', { name: 'Try a sample plan' }).click();
    const t5 = await text(page);
    check('Page 5: sample plan 500/400/100 and total still 1.000 KWD', t5.includes('The total is still 1.000 KWD') && t5.includes('400 fils'));

    await go(page, 6);
    await page.locator('.goal-card').first().click();
    for (let i = 0; i < 7; i++) { const b = page.getByRole('button', { name: /Add one week/ }); if (await b.isEnabled()) await b.click(); }
    check('Page 6: goal reached after 5 weeks', (await text(page)).includes('after 5 weeks'));
    await page.getByRole('button', { name: '0 fils', exact: true }).click();
    check('Page 6: zero saving explained, no crash', (await text(page)).includes('savings do not grow'));

    await go(page, 7);
    await page.getByRole('button', { name: 'Add School notebook to basket' }).click();
    await page.getByRole('button', { name: 'Add Pencil to basket' }).click();
    await page.getByRole('button', { name: 'Add Stickers to basket' }).click();
    const t7 = await text(page);
    check('Page 7: 1.100 KWD is 100 fils over budget', t7.includes('1.100 KWD') && t7.includes('100 fils more'));
    check('Page 7: pay is blocked while over budget', await page.getByRole('button', { name: /^Pay/ }).isDisabled());
    await page.getByRole('button', { name: 'Put Stickers back' }).click();
    await page.getByRole('button', { name: /^Pay/ }).click();
    await page.getByRole('button', { name: /^Pay/ }).click({ force: true }).catch(() => {});
    check('Page 7: paid 0.600, 0.400 left, no double spend', (await text(page)).includes('You paid 0.600 KWD and have 0.400 KWD left'));

    await go(page, 8);
    await page.locator('.compare-card', { hasText: 'Notebook B' }).click();
    await page.getByRole('button', { name: '250 fils change' }).click();
    check('Page 8: 1.000 − 0.750 = 0.250', (await text(page)).includes('1.000 KWD − 0.750 KWD = 0.250 KWD'));

    await go(page, 10);
    await page.getByRole('button', { name: 'Deposit 1.000 KWD' }).dblclick();
    await page.waitForTimeout(400);
    const hist1 = await page.locator('.history li').count();
    check('Page 10: double tap makes one deposit', hist1 === 1, hist1);
    const v = await page.locator('.ledger-value').allInnerTexts();
    check('Page 10: wallet 1.000, account 4.000', v[0].includes('1.000') && v[1].includes('4.000'), v.join(' / '));
    await page.getByRole('button', { name: 'Withdraw 1.000 KWD' }).click();
    const v2 = await page.locator('.ledger-value').allInnerTexts();
    check('Page 10: withdraw back to 2.000 / 3.000, total 5.000', v2[0].includes('2.000') && v2[1].includes('3.000') && (await text(page)).includes('Total: 5.000 KWD'));

    // Language switch mid-activity keeps page and state.
    await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
    const v3 = await page.locator('.ledger-value').allInnerTexts();
    check('Language switch keeps page 10 and ledger state', (await page.getAttribute('html', 'dir')) === 'rtl' && v3[0].includes('2.000') && (await page.locator('.history li').count()) === 2 && (await page.locator('.pager-count').innerText()).includes('10'));
    await page.getByRole('button', { name: 'Switch to English' }).click();

    await go(page, 11);
    await page.getByRole('button', { name: /^Pay 1.000 KWD by card/ }).click();
    await page.locator('details.example-box summary').click();
    await page.getByRole('button', { name: 'Withdraw 5.000 KWD from the ATM' }).click();
    const t11 = await text(page);
    check('Page 11: card 3.000 → 2.000; ATM 10.000 → 5.000 + 5.000 cash', t11.includes('from 3.000 KWD to 2.000 KWD') && t11.includes('went down to 5.000 KWD'));

    await go(page, 12);
    await page.getByRole('button', { name: 'Send the code' }).click();
    check('Page 12: unsafe choice gets calm retry feedback', (await text(page)).includes('only practice'));
    await page.getByRole('button', { name: /Stop, close the message/ }).click();
    check('Page 12: safe choice confirmed; Diraya safety note', (await text(page)).includes('That is the safe thing to do') && (await text(page)).includes('Diraya: keeping our information safe'));
    check('Page 12: practice message has no links or inputs', (await page.locator('.practice-message a, .practice-message input').count()) === 0);

    await go(page, 13);
    await page.getByRole('button', { name: /Share my book/ }).click();
    check('Page 13: warm feedback about the action', (await text(page)).includes('Sharing makes someone else happy'));
    check('No page errors during activities', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  });

  /* ---------- Map puzzle: pointer, keyboard, drag, missions, list mode ---------- */
  await section(async () => {
    const { ctx, page } = await newPage();
    await go(page, 9, 'en');
    await page.getByRole('button', { name: 'Piece: Bank' }).click();
    await page.getByRole('button', { name: /row 1, position 1/ }).click();
    check('Map: wrong slot keeps the piece in the tray', (await page.locator('.tray-piece').count()) === 6 && (await text(page)).includes('belongs somewhere else'));
    await page.getByRole('button', { name: /row 2, position 3/ }).click();
    check('Map: tap piece then slot places it', (await page.locator('.tray-piece').count()) === 5);
    // Keyboard: focus a piece, Enter, Tab to its slot, Enter.
    await page.getByRole('button', { name: 'Piece: Kuwait Towers' }).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: /row 1, position 1/ }).focus();
    await page.keyboard.press('Enter');
    check('Map: keyboard placement works', (await page.locator('.tray-piece').count()) === 4);
    // Drag with a pointer.
    const piece = page.getByRole('button', { name: 'Piece: Home' });
    const slot = page.getByRole('button', { name: /row 2, position 1/ });
    const pb = await piece.boundingBox(), sb = await slot.boundingBox();
    await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
    await page.mouse.down();
    await page.mouse.move(pb.x + pb.width / 2 + 20, pb.y + pb.height / 2 + 20, { steps: 3 });
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 8 });
    await page.mouse.up();
    check('Map: optional drag places a piece', (await page.locator('.tray-piece').count()) === 3);
    await page.getByRole('button', { name: 'Show the finished picture' }).click();
    check('Map: completed-picture hint toggles', await page.locator('.map-hint').isVisible());
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Place one for me' }).click();
    check('Map: auto-place finishes the board; missions appear', (await page.locator('.map-slot.is-placed').count()) === 6 && (await text(page)).includes('Money missions'));
    await page.getByRole('group', { name: /Choose the place for: Deposit/ }).getByRole('button', { name: 'Park' }).click().catch(async () => {
      await page.getByRole('group', { name: /Choose the place for: Deposit/ }).getByRole('button', { name: 'Community park' }).click();
    });
    check('Map: wrong mission place gets gentle feedback', (await text(page)).includes('happened somewhere else'));
    await page.getByRole('group', { name: /Plan a savings goal/ }).getByRole('button', { name: 'Home' }).click();
    await page.getByRole('group', { name: /Compare prices/ }).getByRole('button', { name: 'Cooperative store' }).click();
    await page.getByRole('group', { name: /Deposit money/ }).getByRole('button', { name: 'Bank' }).click();
    check('Map: all missions matched with explanations', (await text(page)).includes('You finished every mission'));
    // Map placement is shared across languages.
    await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
    check('Map state unchanged after language switch', (await page.locator('.map-slot.is-placed').count()) === 6 && (await page.locator('.mission.is-done').count()) === 3);
    await page.getByRole('button', { name: /ابدأ النشاط من جديد/ }).click();
    await page.getByRole('button', { name: /عرض القائمة/ }).click();
    await page.getByRole('group', { name: /نودع المال/ }).getByRole('button', { name: 'البنك' }).click();
    check('Map: list mode gives the same missions (screen-reader route)', (await page.locator('.place-list li').count()) === 6 && (await page.locator('.mission.is-done').count()) === 1);
    await ctx.close();
  });

  /* ---------- Crossword: Arabic RTL typing, bank mode, per-language state ---------- */
  await section(async () => {
    const { ctx, page } = await newPage();
    await go(page, 14, 'ar');
    // Word-bank mode: pick clue 5 (فلس), try a wrong word, then the right one.
    await page.locator('.clue', { hasText: 'ألف منه يساوي' }).click();
    await page.locator('.word-chip', { hasText: 'دينار' }).click();
    check('Crossword AR: wrong-length word explained', (await text(page)).includes('هذه الكلمة فيها 5 حروف'));
    await page.locator('.word-chip', { hasText: 'فلس' }).click();
    check('Crossword AR: bank mode fills فلس and repeats its meaning', (await text(page)).includes('كل 1000 فلس تساوي'));
    // Letter mode: type بنك into 3 down; logical order, RTL layout.
    await page.getByRole('button', { name: 'كتابة الحروف' }).click();
    await page.locator('.clue', { hasText: 'الحسابات والخدمات' }).click();
    await page.waitForTimeout(100);
    await page.keyboard.type('بنك');
    check('Crossword AR: typed Arabic letters solve بنك (top to bottom)', (await page.locator('.clue.is-solved').count()) === 2);
    // Across in RTL: type دينار; first letter must sit in the right-most cell of the word.
    await page.locator('.clue', { hasText: 'عملة الكويت' }).click();
    await page.waitForTimeout(100);
    await page.keyboard.type('دينار');
    const boxes = await page.evaluate(() => {
      const cells = [...document.querySelectorAll('.xw-cell')].map((c) => ({ v: c.querySelector('input').value, x: c.getBoundingClientRect().x, y: c.getBoundingClientRect().y }));
      return cells;
    });
    const dal = boxes.filter((b) => b.v === 'د').sort((a, b) => b.x - a.x)[0];
    const ra = boxes.filter((b) => b.v === 'ر' && Math.abs(b.y - dal.y) < 2).sort((a, b) => a.x - b.x)[0];
    check('Crossword AR: across answer runs right to left (د right of ر)', dal && ra && dal.x > ra.x);
    // Backspace clears and moves back.
    await page.keyboard.press('Backspace');
    check('Crossword AR: backspace clears the current letter', !(await page.locator('.clue.is-solved', { hasText: 'عملة الكويت' }).count()));
    await page.keyboard.type('ر');
    // Reveal a letter in another word.
    await page.locator('.clue', { hasText: 'خطة لاستخدام المال' }).click();
    await page.getByRole('button', { name: 'اكشف حرفًا' }).click();
    check('Crossword AR: hint reveals one letter without penalty', (await page.locator('.xw-cell.was-revealed').count()) === 1);
    const arSolved = await page.locator('.clue.is-solved').count();
    // Switch to English mid-puzzle.
    await page.getByRole('button', { name: 'Switch to English' }).click();
    check('Crossword EN: separate empty grid after switching', (await page.locator('.clue.is-solved').count()) === 0 && (await page.locator('.xw-cell').count()) === 27);
    await page.getByRole('button', { name: 'Type letters' }).click();
    await page.locator('.clue', { hasText: 'banking services' }).click();
    await page.waitForTimeout(100);
    await page.keyboard.type('بنك');
    const afterArabic = await page.evaluate(() => [...document.querySelectorAll('.xw-input')].map((i) => i.value).join(''));
    check('Crossword EN: Arabic letters never enter the English grid', afterArabic === '');
    await page.keyboard.type('bank');
    check('Crossword EN: lower-case typing solves BANK', (await page.locator('.clue.is-solved').count()) === 1);
    await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
    check('Crossword AR: Arabic grid restored after switching back', (await page.locator('.clue.is-solved').count()) === arSolved);
    // List mode.
    await page.getByRole('button', { name: /قائمة التلميحات/ }).click();
    await page.locator('.xw-list select').first().selectOption('ميزانية');
    check('Crossword AR: list mode answers count the same', (await page.locator('.xw-list li.is-solved').count()) >= arSolved);
    // Extra challenge collapsed by default.
    check('Extra challenge is collapsed initially', !(await page.locator('details.quiz').getAttribute('open')));
    await ctx.close();
  });

  /* ---------- Completion, persistence and storage edge cases ---------- */
  await section(async () => {
    const { ctx, page } = await newPage();
    await go(page, 15, 'en');
    await page.locator('.habit', { hasText: 'Save a small amount' }).click();
    const t15 = await text(page);
    check('Page 15: habit chosen; full Diraya attribution in closing info', t15.includes('My habit: Save a small amount') && t15.includes('overseen by the Central Bank of Kuwait and managed by the Kuwait Banking Association'));
    check('Page 15: no name/email/phone fields', (await page.locator('input[type=text], input[type=email], input[type=tel]').count()) === 0);
    await page.getByRole('button', { name: 'For parents' }).click();
    const drawer = await page.locator('dialog[open]').innerText();
    check('Parent drawer: full attribution, privacy, glossary, sources', drawer.includes('Kuwait Banking Association') && drawer.includes('never asks for a name') && drawer.includes('Credit card') && drawer.includes('cbk.gov.kw'));
    await page.keyboard.press('Escape');
    // Opt-in persistence.
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByText('Remember my progress on this device').last().click();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await page.reload();
    await page.waitForSelector('#page-heading');
    check('Remembered progress restores page and answers after reload', (await page.locator('.pager-count').innerText()).includes('15') && (await text(page)).includes('My habit: Save a small amount'));
    const stored = await page.evaluate(() => localStorage.getItem('little-dinar-ebook:v1'));
    check('Stored data has no personal fields', stored && !/name|email|phone|account(Number|No)/i.test(stored.replace(/"account":/g, '')));
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByText('Remember my progress on this device').last().click();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    check('Opting out deletes saved progress', (await page.evaluate(() => localStorage.getItem('little-dinar-ebook:v1'))) === null);
    // Corrupt storage.
    await page.evaluate(() => localStorage.setItem('little-dinar-ebook:v1', '{broken'));
    await page.reload();
    await page.waitForSelector('#page-heading');
    check('Corrupt saved data is discarded without breaking', (await page.evaluate(() => localStorage.getItem('little-dinar-ebook:v1'))) === null);
    await ctx.close();

    const blocked = await newPage();
    await blocked.ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
    await go(blocked.page, 3, 'en');
    await blocked.page.getByRole('button', { name: 'Add 100 fils', exact: true }).last().click();
    check('Book works with storage disabled', (await blocked.page.locator('.tray-slot.is-filled').count()) === 1 && blocked.errors.length === 0, blocked.errors.join(' | '));
    await blocked.ctx.close();

    const noArt = await newPage();
    await noArt.ctx.route(/scenes-.*\.js$/, (r) => r.abort());
    await go(noArt.page, 4, 'en');
    await noArt.page.waitForTimeout(500);
    check('Missing illustration chunk shows a text fallback, page still usable', (await noArt.page.locator('.scene-fallback').count()) >= 1 && (await noArt.page.getByRole('button', { name: 'Need' }).count()) >= 1);
    await noArt.ctx.close();
  });

  /* ---------- neo ---------- */
  await section(async () => {
    const { ctx, page, errors } = await newPage();
    for (const [n, lang] of [[1, 'ar'], [4, 'en'], [6, 'ar'], [15, 'en']]) {
      await go(page, n, lang);
      check(`neo guide with speech bubble on page ${n} (${lang})`, (await page.locator('.neo-guide .neo-character').count()) === 1 && (await page.locator('.neo-bubble').innerText()).length > 10);
    }
    await go(page, 1, 'en');
    const intro = await page.locator('.neo-intro').innerText();
    check('Cover: "What is the neo account?" section with features and change note', intro.includes('What is the neo account?') && intro.includes('earns interest') && intro.includes('may change') && (await page.locator('.neo-features li').count()) === 6);
    await go(page, 1, 'ar');
    check('Cover (ar): neo section in Arabic', (await page.locator('.neo-intro').innerText()).includes('ما هو حساب neo؟'));
    await go(page, 11, 'en');
    check('Page 11: neo presents the cards (still frame under reduced motion, no replay button)', (await page.locator('.neo-guide-card img').getAttribute('src')).includes('still') && (await page.locator('.neo-replay').count()) === 0 && (await page.locator('.neo-bubble').innerText()).includes('neo debit card'));
    await go(page, 1, 'en');
    check('Cover: official red and blue neo card designs shown', (await page.locator('.neo-intro .neo-cards img').count()) === 2 && (await page.evaluate(() => [...document.querySelectorAll('.neo-cards img')].every((i) => i.complete && i.naturalWidth > 0))));
    await go(page, 2, 'en');
    check('neo guide is not on every page', (await page.locator('.neo-guide').count()) === 0);
    await go(page, 9, 'en');
    const panel = await page.locator('.neo-panel').innerText();
    check('Page 9: Meet the neo account panel, child-level, no terms', panel.includes('Meet the neo account') && !/KWD|interest|\d/.test(panel));
    await go(page, 9, 'ar');
    check('Page 9 (ar): neo tagline in Arabic', (await page.locator('.neo-tagline').innerText()).includes('دوم نكبر مع بعض'));
    await go(page, 15, 'en');
    const closing = await page.locator('.closing-info').innerText();
    check('Page 15: neo parent information with facts and check-terms note', closing.includes('For children aged 0 to 14') && closing.includes('10 KWD') && closing.includes('check the current terms'));
    await page.getByRole('button', { name: 'For parents' }).click();
    const drawer = await page.locator('dialog[open]').innerText();
    check('Parent drawer: neo account information and glossary entry', drawer.includes('The neo account from Gulf Bank') && drawer.includes('neo account') && drawer.includes('Apart from optional information'));
    check('neo images load without errors', errors.length === 0 && (await page.evaluate(() => [...document.querySelectorAll('img.neo-logo, img.neo-character')].every((i) => i.complete && i.naturalWidth > 0))), errors.join(' | '));
    await ctx.close();
  });

  /* ---------- Motion ---------- */
  await section(async () => {
    const { ctx, page } = await newPage({ reducedMotion: 'reduce' });
    await go(page, 1, 'en');
    await page.waitForTimeout(800);
    const anim = await page.evaluate(() => [...document.querySelectorAll('.amb-drift, .amb-bob, .char')].map((e) => getComputedStyle(e).animationName).filter((n) => n !== 'none').length);
    check('Reduced motion: no ambient animation runs', anim === 0, anim);
    await ctx.close();
    const full = await newPage({ reducedMotion: 'no-preference' });
    await go(full.page, 11, 'en');
    await full.page.waitForTimeout(500);
    const animSrc = await full.page.locator('.neo-guide-card img').getAttribute('src');
    await full.page.locator('.neo-replay').click();
    const replaySrc = await full.page.locator('.neo-guide-card img').getAttribute('src');
    check('Full motion: neo card animation plays and can be replayed', !animSrc.includes('still') && animSrc !== replaySrc);
    await go(full.page, 1, 'en');
    await full.page.waitForTimeout(800);
    const anim2 = await full.page.evaluate(() => [...document.querySelectorAll('.amb-drift, .amb-bob')].map((e) => getComputedStyle(e).animationName).filter((n) => n !== 'none').length);
    check('Full motion: gentle ambient animation present', anim2 > 0, anim2);
    await full.ctx.close();
  });

  /* ---------- Accessibility (axe-core) on every page in both languages ---------- */
  await section(async () => {
    const { ctx, page } = await newPage();
    const all = [];
    for (const lang of ['ar', 'en']) {
      for (let n = 1; n <= 15; n++) {
        await go(page, n, lang);
        await page.waitForTimeout(250);
        await page.evaluate(AXE);
        const r = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(' ') })));
        for (const v of r) all.push({ lang, page: n, ...v });
      }
    }
    writeFileSync(join(OUT, 'axe.json'), JSON.stringify(all, null, 2));
    check('axe: no WCAG 2.2 A/AA violations on 30 page views', all.length === 0, all.slice(0, 4).map((v) => `${v.lang}${v.page}:${v.id}`).join(', '));
    // Touch targets.
    const small = [];
    for (const lang of ['ar', 'en']) for (const n of [1, 2, 5, 7, 9, 10, 15]) {
      await go(page, n, lang);
      const s = await page.evaluate(() => [...document.querySelectorAll('main button, .pager button, .topbar button')].filter((b) => b.offsetParent).map((b) => { const r = b.getBoundingClientRect(); return { t: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; }).filter((x) => x.w < 44 || x.h < 44));
      small.push(...s.map((x) => `${lang}${n}:${x.t}(${x.w}x${x.h})`));
    }
    check('Major controls are at least 44x44 CSS px (most 48+)', small.length === 0, small.slice(0, 5).join(', '));
    await ctx.close();
  });

  /* ---------- Reflow and responsive widths ---------- */
  await section(async () => {
    for (const width of [320, 360, 390, 768, 1024]) {
      const { ctx, page } = await newPage({ viewport: { width, height: 800 } });
      const over = [];
      for (const lang of ['ar', 'en']) for (let n = 1; n <= 15; n++) {
        await go(page, n, lang);
        const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (o > 1) over.push(`${lang}${n}:+${o}`);
      }
      check(`No horizontal page scroll at ${width}px (both languages, all pages)`, over.length === 0, over.join(' '));
      await ctx.close();
    }
  });

  /* ---------- iframe embed and postMessage ---------- */
  await section(async () => {
    const { ctx, page } = await newPage();
    await page.goto(`${HOST_ORIGIN}/`);
    const frame = page.frameLocator('#book');
    await frame.locator('#page-heading').waitFor();
    await frame.getByRole('button', { name: 'ابدأ الرحلة' }).click();
    await page.waitForTimeout(300);
    const got = await page.evaluate(() => window.received);
    check('iframe: book posts ld:ready and ld:page-change to the allowed parent', got.some((m) => m.type === 'ld:ready') && got.some((m) => m.type === 'ld:page-change' && m.pageNumber === 2), JSON.stringify(got).slice(0, 160));
    await page.evaluate((o) => document.getElementById('book').contentWindow.postMessage({ type: 'ld:set-locale', locale: 'en' }, o), BOOK_ORIGIN);
    await page.waitForTimeout(200);
    check('iframe: parent can set the locale with a valid message', (await frame.locator('html').getAttribute('lang')) === 'en');
    await page.evaluate((o) => document.getElementById('book').contentWindow.postMessage({ type: 'ld:set-locale', locale: 'ar', extra: 'x' }, o), BOOK_ORIGIN);
    await page.waitForTimeout(200);
    check('iframe: malformed message is ignored', (await frame.locator('html').getAttribute('lang')) === 'en');
    await frame.getByRole('button', { name: 'Close the book' }).click();
    await page.waitForTimeout(200);
    check('iframe: close button sends ld:close-request', (await page.evaluate(() => window.received)).some((m) => m.type === 'ld:close-request'));
    await ctx.close();

    // A page from a non-allowed origin receives nothing.
    const other = await newPage();
    await other.page.setContent(`<iframe id="b" src="${BOOK_ORIGIN}${SUB}"></iframe><script>window.r=[];addEventListener('message',e=>r.push(e.data))</script>`);
    await other.page.waitForTimeout(1500);
    check('iframe: non-allowed parent origin gets no messages', (await other.page.evaluate(() => window.r.length)) === 0);
    await other.ctx.close();
  });

  /* ---------- Print edition ---------- */
  await section(async () => {
    const { ctx, page } = await newPage();
    await go(page, 1, 'en');
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
    await page.emulateMedia({ media: 'print' });
    const sections = await page.locator('.print-page').count();
    const pdf = await page.pdf({ format: 'A4' });
    const pdfPages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    writeFileSync(join(OUT, 'print-en.pdf'), pdf);
    check('Print edition: 15 sections, one book page per printed page', sections === 15 && pdfPages === 15, `${sections} sections, ${pdfPages} PDF pages`);
    await ctx.close();
  });
} catch (e) {
  check('e2e run completed without exceptions', false, e.stack?.split('\n').slice(0, 3).join(' '));
} finally {
  await browser.close();
  book.close();
  host.close();
  writeFileSync(join(OUT, 'e2e-results.json'), JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exitCode = failed.length ? 1 : 0;
}
