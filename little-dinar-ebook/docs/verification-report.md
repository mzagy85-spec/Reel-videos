# Verification report

Date: 2026-10-31. Build: `npm run build` on Node 22.23, Vite 8.3.5, React 19.2.0. Browser checks ran on Playwright's Chromium (headless, Linux).

How to reproduce: run `npm test`, then `npm run build && npm run e2e`. For performance, run `npm run preview` and then `node e2e/perf.mjs http://localhost:4173/`.

## Summary

| Area | Result |
|---|---|
| Unit tests (vitest) | **82 passed**, 0 failed (includes 11 neo checks) |
| Browser end-to-end checks (`e2e/run-e2e.mjs`) | **89 passed**, 0 failed (includes 15 neo checks) |
| axe-core WCAG 2.0/2.1/2.2 A and AA rules, 15 pages × 2 languages | **0 violations** |
| Native iOS WKWebView / Android WebView | **Not tested**: no access to the bank's apps or test harness |
| Safari (desktop and iOS) | **Not tested**: only Chromium is available in this environment |
| Real screen readers (VoiceOver, TalkBack, NVDA) | **Not tested**: automated semantics checks only |

## Passed: unit tests

- **Money.** Integer fils only, so floats are rejected. Three-decimal KWD formatting and Western digits in both languages. The arithmetic examples are all checked:
  - 10 × 100 fils = 1,000
  - 350 + 250 = 600, leaving 400
  - 600 + 500 = 1,100, which is 100 over a 1,000 budget
  - 1,000 − 750 = 250
  - 3,000 + 1,000 = 4,000
  - 3,000 − 1,000 = 2,000
- **Activity guards.**
  - Tokens are capped at 10 and never go negative.
  - Jar totals stay at 1.000 KWD through 40 random moves. The sample plan is 500/400/100, and an empty Help jar is valid.
  - The goal takes 5 weeks at 1 KWD and 10 weeks at 500 fils. Zero saving returns "never" with no division by zero.
  - Shopping pays once only, blocks payment over budget, and requires the list items.
  - Change can only be chosen after picking notebook B.
  - The bank ledger keeps a 5.000 total, ignores a stale double-tap, and never goes negative.
  - The card and ATM examples are separate and conserve money.
  - Every reset restores the documented starting state.
- **Crossword.** Both grids pass full validation: crossings, connectivity, no accidental words, clues present. The answer banks are exact, Arabic coordinates are logical, numbering is checked, and normalisation ignores diacritics, tatweel and hamza forms. Fill, clear (keeping solved crossings) and reveal all work.
- **Content.**
  - Exactly 15 pages, numbered 1 to 15, with unique ids.
  - Every string exists in both languages, with no crossed-language text.
  - Story length is within limits and scene ids exist.
  - Fictional amounts carry the learning-example flag.
  - No Eastern Arabic digits and no other currencies.
  - The Diraya wording keeps the correct CBK/KBA roles, makes no approval claim, and appears in all the required places. No campaign artwork is shipped.
  - No personal-data fields, trackers, network calls or `postMessage(..., '*')`.
- **Contrast.** Every text pairing in use is at least 4.5:1. White on #EF2B2D (3.9:1) is limited to large text.
- **State.**
  - Switching language keeps the page, activity state, settings and stamps.
  - Crossword state is kept separately per language.
  - Stamps are awarded once and survive replays and resets.
  - Quiz mastery counts once per question.
  - Page bounds are enforced, and Reset all keeps settings.
  - Host messages are validated against an exact schema.

## Passed: browser end-to-end (production build served under `/kids/money-book/`)

- **Structure.**
  - Arabic and RTL by default; the cover is page 1 of 15; the contents drawer lists 15 pages.
  - `#/page/16` is ignored.
  - Refresh keeps the current page, and all assets load under the sub-path with no errors.
  - No dead narration control is shown.
- **Activities.** Every activity from page 3 to page 13 was driven in English, and the UI text and values were checked:
  - double-tap protection on deposits;
  - payment blocked over budget;
  - the zero-saving message;
  - calm feedback for the unsafe choice on page 12;
  - the practice message contains no links or inputs.
- **Language switch mid-activity** on page 10 keeps the page, balances and history, and flips direction.
- **Map puzzle.**
  - A wrong slot keeps the piece. Tap-then-slot, keyboard (Enter) and pointer dragging all place pieces.
  - The hint toggles; auto-place completes the board.
  - Mission feedback works for wrong and right answers, and all three missions can be completed.
  - Map state is unchanged after a language switch.
  - List mode completes a mission for equal credit.
- **Crossword.**
  - Arabic word-bank mode explains a wrong-length word, fills the answer and repeats its meaning.
  - Typing Arabic letters solves a down answer.
  - An across answer runs right to left (the first letter is in the right-most cell).
  - Backspace clears; reveal-a-letter works.
  - Switching to English shows a separate empty grid, and Arabic letters are rejected there. Lower-case English typing solves BANK.
  - Switching back restores the Arabic grid. List mode works.
  - The extra challenge is collapsed at first.
- **Completion and adults.**
  - The habit appears on the card, and the full Diraya credit is in the closing information. There are no name, email or phone fields.
  - The parent drawer has the full attribution, privacy note, glossary (including the credit-card note) and sources.
- **Storage.**
  - With opt-in, progress survives a reload, and the stored data has no personal fields.
  - Opting out deletes the saved data.
  - Corrupt data is discarded.
  - The book works with `localStorage` blocked.
- **Missing media.** If the illustration chunk is blocked, a text fallback appears and the page still works.
- **Motion.** With reduced motion, no ambient animation runs; with full motion, gentle animation is present.
- **Accessibility.**
  - axe found 0 violations on 30 page views.
  - All visible buttons in the shell and on the sampled pages are at least 44×44 CSS px. Major controls are 48px or more; crossword squares can be 24px on small phones, and list mode is the alternative.
- **Reflow.** There is no horizontal page scroll at 320, 360, 390, 768 or 1024px, on all pages in both languages. 320px matches 400% zoom of a 1280px window.
- **iframe on another origin.**
  - The book sends `ld:ready` and `ld:page-change` to the allowed parent.
  - The parent can set the locale; a malformed message is ignored.
  - The close button sends `ld:close-request`.
  - A non-allowed parent origin receives nothing.
- **Print.** The book edition prints 15 sections onto exactly 15 PDF pages (A4).

## Visual review

I looked at screenshots of every page in both languages:

- at 390px and 1280px;
- at a 360px phone, a 768×1024 tablet, 1024×768 and an 844×390 phone in landscape;
- the art crop of every scene with full motion on.

Problems found and fixed during review:

- a duplicate logo on the cover;
- arrow artwork that turned semi-transparent after keying;
- toolbar overflow at 320px in Arabic;
- the crossword layout in the narrow column;
- the landscape-phone layout;
- the portrait crop cutting characters;
- an animation that moved characters out of place when full motion was on.

## Performance (lab, not field)

Profile: Chromium headless, 390×844 at 2x, network throttled to about 1.6 Mbps down, 750 Kbps up and 150 ms RTT, with 4x CPU slowdown.

| Metric | Target | Arabic | English |
|---|---|---|---|
| Initial route transfer (to network idle, incl. fonts, cover art chunk, preloaded scene chunk) | ≈ 2 MB or less | 225 KB | 225 KB |
| Initial JavaScript (main chunk, gzip) | < 250 KB | 106 KB | 106 KB |
| LCP | ≤ 2.5 s | 1.26 s | 1.30 s |
| CLS | ≤ 0.1 | 0.005 | 0.031 |
| Slowest interaction, first tap 0.5 s after load | ≤ 200 ms | 312 ms | 320 ms |
| Steady-state taps (token, page turn, deposit, contents drawer) | ≤ 200 ms | 64–176 ms | similar |

Notes:

- The INP proxy fails only for a tap made while later chunks are still parsing on a 4x-slowed CPU. Normal interactions are under 200 ms.
- Real INP needs field data from the bank's analytics or RUM after an approved release.
- Total `dist/` size is 660 KB.

## Not tested, or pending

- Real iOS WKWebView and Android WebView in the bank's apps: back/close, safe areas, downloads, print and audio policies. **Pending the bank's test harness.**
- Safari on macOS and iOS, and Firefox. The code uses standard APIs (`<dialog>`, `:has()`, logical properties, the CSS `translate` property). Safari 15.4+ should work, but this has not been checked.
- Manual screen-reader passes with VoiceOver (iOS), TalkBack (Android) and NVDA/JAWS (desktop) in Arabic and English.
- Usability with children aged 7 to 11, and with Arabic-reading children in particular.
- Narration audio: none exists yet, so there is no audio playback test beyond "no dead control" and stop-on-page-change wiring.
- Field Web Vitals.
- Editorial and compliance review of all copy (see handoff).

## neo additions (second pass)

- **Browser checks.**
  - The neo guide and speech bubble appear on pages 1, 4, 6 and 15 in both languages, and not on other pages.
  - The page 9 panel shows no terms or numbers, and the Arabic tagline appears in Arabic.
  - The page 15 closing area and the parent drawer show the facts, the check-terms note and the glossary entry.
  - The neo images load.
  - axe still reports 0 violations on all 30 page views.
- **Not verified.** The neo product facts have not been checked against the live Gulf Bank page, which was blocked by the build environment's network policy.

## Official neo visuals (third pass)

- Page 11 shows neo presenting the cards: the still frame under reduced motion, or the animation with a working "Watch neo again" button under full motion.
- The cover shows the red and blue card designs, and all neo images load.
- axe still reports 0 violations on all 30 page views.
