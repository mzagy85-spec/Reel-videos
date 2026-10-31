# رحلة الدينار الصغير · The Little Dinar Journey

An interactive, bilingual (Arabic/English) financial-literacy e-book for children aged about 7 to 11, prepared for Gulf Bank in support of the Diraya financial awareness campaign («لنكن على دراية»).

Status: integration-ready build for a bank-controlled staging environment. It is **not** live, not integrated into the website or apps, and not yet reviewed or approved by Gulf Bank, CBK or KBA. See [docs/handoff.md](docs/handoff.md) for the release reviews still needed.

- 15 numbered pages, one shared set of page ids, one language shown at a time (Arabic by default).
- Every page has an illustrated scene and an activity; page 9 holds the Money Journey Map puzzle and page 14 the Money Words crossword.
- All money is integer fils (1 KWD = 1000 fils). All prices and balances are fictional learning examples.
- Includes neo, Gulf Bank's children's savings account: the neo character as a guide on four pages, a child-level panel on page 9, and account information for parents (`src/content/neo.ts`; product facts pending Compliance check).
- Works with touch, mouse, keyboard and screen readers, with sound and motion off. No login, no personal data, no trackers, no external requests at runtime.

## Quick start

Requirements: Node.js 20 or later (tested with Node 22.23).

```bash
npm ci                 # install the exact versions in package-lock.json
npm run dev            # local development server
npm test               # unit tests (money logic, crossword grids, content completeness, contrast, state)
npm run build          # type-check, then production build into dist/
npm run preview        # serve dist/ at http://localhost:4173/
npm run e2e            # browser checks against dist/ served under /kids/money-book/ (needs Playwright + Chromium on the machine)
npm run scripts:export # regenerate docs/narration-scripts.md and docs/source-registry.md from the content files
```

The built book is fully static: `dist/index.html` plus `dist/assets/`. The production build is committed in `dist/` for handoff.

## Hosting under a sub-path

The default build uses relative asset URLs (`base: './'`), so `dist/` can be copied to any folder, for example `https://<bank-domain>/kids/money-book/`, without rebuilding. To build with an absolute base instead:

```bash
BASE_PATH=/kids/money-book/ npm run build
```

Navigation lives in the URL hash (`#/page/7`), so refreshing any page works with no server rewrite rules. `npm run e2e` serves `dist/` under `/kids/money-book/` and checks refresh, assets, navigation, iframe messaging and print.

Server requirements (set by the bank's web team, see [docs/integration.md](docs/integration.md)):

- HTTPS only; serve `.woff2` as `font/woff2`, `.webp` as `image/webp`, `.svg` as `image/svg+xml`.
- Send a Content-Security-Policy header including `frame-ancestors` for the approved embedding origins.
- Cache `assets/*` long term (file names are content-hashed); keep `index.html` short-lived.

## Editing content

All copy lives in typed files that marketing and editors can change without touching components:

| File | What it holds |
|---|---|
| `src/content/pages.ts` | The 15 page records: titles, story text, instructions, "Tell me more", scene id, alt text, narration audio slots, sources |
| `src/content/copy.ts` | Every button label, hint and feedback message, the Diraya credits, the parent guide and the glossary |
| `src/content/crossword.ts` | The two validated crossword grids and their clues |
| `src/content/sources.ts` | The source registry shown in the parent drawer |

Rules the tests enforce (`npm test`): every string exists in both languages, exactly 15 pages, Western digits only, no other currencies, story text stays short, the Diraya wording keeps the correct CBK/KBA roles. If you move a crossword word, `tests/crossword.test.ts` re-validates crossings, connectivity and accidental words.

Money amounts in activities come from `src/lib/activities.ts`. Change them there and the UI, feedback and tests follow; the arithmetic tests will tell you if a story sentence no longer matches.

Replacing illustrations: scenes are original layered SVG components in `src/illustrations/`. To swap one for commissioned raster art, keep the scene id and render an `<img>` (WebP/AVIF with a fallback) inside `SceneArt` for that id. See [docs/illustration-manifest.md](docs/illustration-manifest.md) for crops and safe areas.

Adding narration: put approved recordings in `public/audio/` and set `narrationAudio` for the page, for example `{ ar: 'audio/3-meet-dinar-ar.mp3', en: 'audio/3-meet-dinar-en.mp3' }`. The read-aloud button then appears on that page only. Scripts are in [docs/narration-scripts.md](docs/narration-scripts.md).

## Website embed and app WebView

- Website iframe: [embed/iframe-example.html](embed/iframe-example.html), plus a Django CMS snippet in [embed/django-cms-snippet.html](embed/django-cms-snippet.html).
- iOS WKWebView and Android WebView notes, the optional host adapter (postMessage and native bridge), CSP and frame-ancestors: [docs/integration.md](docs/integration.md).

The book runs with no host at all. The adapter only adds locale/motion settings from the host, and ready, page-change and close events. Parent messaging is off until origins are listed in the `ld-host-config` block in `index.html`.

## Project layout

```
src/app/            reader shell: BookShell, PageRenderer, drawers, language switch, narration, print edition
src/activities/     one component per page activity (MoneyTokens, JarPlanner, MapPuzzle, CrosswordActivity, ...)
src/lib/            money (integer fils), activity state machines, crossword engine, host adapter, audio
src/state/          locale-independent store and opt-in device storage
src/content/        bilingual content, crossword grids, sources (edit these)
src/illustrations/  original SVG characters, scenes and the neighbourhood map
src/assets/         supplied brand assets (logo vectors from GB_logo.pdf, arrow artwork from the guide, Cairo WOFF2)
tests/              vitest unit tests
e2e/                browser checks, screenshots and performance measurement
docs/               plan, brand notes, integration, verification report, handoff, scripts, manifests
```

## Documents

- [Implementation plan and brand interpretation](docs/implementation-plan.md)
- [Brand notes: tokens, logo use, arrows, icons, font licence](docs/brand-notes.md)
- [Character sheet](docs/character-sheet.md) and [illustration manifest](docs/illustration-manifest.md)
- [Crossword authoring](docs/crossword-authoring.md)
- [Narration scripts](docs/narration-scripts.md) and [pending media](docs/media-pending.md)
- [Integration: website, WebView, CSP](docs/integration.md)
- [Verification report](docs/verification-report.md)
- [Release handoff](docs/handoff.md)
- [Source registry](docs/source-registry.md)

## Licences

Cairo is licensed under the SIL Open Font License 1.1 ([licenses/Cairo-OFL.txt](licenses/Cairo-OFL.txt)). The Gulf Bank logo and brand-arrow artwork are Gulf Bank property, used here as supplied. Illustrations and code were written for this project.
