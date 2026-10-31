# Release handoff

The book is built and tested as far as this environment allows (see `verification-report.md`). These reviews belong to Gulf Bank teams before any staging or public release. None of them has happened yet.

## Marketing
- **Story and characters.** Check the story, the characters (Hessa, Hamad, Mama) and the tone against campaign plans.
- **Diraya credits.** Confirm they appear in the right places: the cover (short), page 15 and the parent drawer (full), Settings › About, and the page 12 safety note.
- **Campaign artwork.** If official Diraya artwork is wanted, supply it from the approved media kit along with its co-branding rules.
- **Narration.** Decide on a human voice or a licensed TTS voice. Scripts are in `narration-scripts.md`.

## Brand
- **Logo colours.** The supplied logo master uses about #224985 and #E02333, while the published swatches are #00248F and #EF2B2D. Confirm which digital master is current. The logo has not been recoloured.
- **Extra greys and tints.** Approve or replace the two darker text greys (#4A4D4F, #3F4244) and the pale tints (#EEF1FA, #DCDDDE).
- **Logo placements.** Check the header (top right in both languages), the inverted logo on the card header, and the signage overlay in the bank-branch illustration and on the map.
- **Arrows and icons.** Check the arrow artwork extracted from guide page 18, and the original two-colour icon set.
- **Illustration style.** Check `character-sheet.md` and `illustration-manifest.md`. Optional prompts are provided for commissioned raster art.

## neo (added after the first handoff)
- **Marketing.** Approve neo's draft guide lines on pages 1, 4, 6 and 15 as neo's voice. Approve the child-level "Meet the neo account" panel on page 9, and the use of the cinema-pose character.
- **Brand.** Supply a neutral, high-resolution transparent neo character and the vector logo. Confirm the neo palette is used only inside neo elements.
- **Compliance.** The neo facts shown to parents come from the July 2023 presentation, not from the live product page:
  - ages 0 to 14;
  - opening the account: 10 KWD;
  - a savings account with interest;
  - opened by a parent through the Gulf Bank app.

  The live page `e-gulfbank.com/.../youth-programs/neo-account/` could not be reached from the build environment, so these must be checked against current terms. Two switches in `src/content/neo.ts` control what appears: `showAccountFacts: false` hides the facts, and `enabled: false` removes neo entirely.
- **Policy.** Earlier the brief excluded product details unless Gulf Bank requested them; this was requested. Children see only a plain description and "Ask your parent or guardian". Facts and the URL are in parent-facing areas only, and the URL is plain text, not a link.

## Arabic and English editorial
- **Copy.** Read every string in `src/content/pages.ts` and `src/content/copy.ts`. Check that the Arabic is natural Modern Standard Arabic for Kuwaiti children, that the selective diacritics are right, and that the English matches in meaning.
- **Crossword clues.** Check the clues in `src/content/crossword.ts`. The Arabic grid is 11×6, for the reason given in `crossword-authoring.md`.
- **Number reading.** Confirm how amounts are read aloud, for example "1.000 د.ك." read as «دينار واحد».

## Accessibility
- **Screen readers.** Do manual passes with VoiceOver, TalkBack and NVDA in both languages.
- **Children's usability.** Run a session with children, including the crossword on small phones.
- **Crossword squares.** These are 24px on 360px phones, which is above the 24px WCAG minimum but below the project's 48px target for major controls. Confirm that the list mode is an acceptable alternative.

## Information Security
- **Headers.** Review the CSP and other headers in `integration.md`, and fill in the real origins.
- **Origin allowlist.** Fill in `allowedParentOrigins` in `index.html`. It ships empty, which means no messaging.
- **Native bridge.** If one is used, review it; only three outbound message types are allowed.
- **Banking-session isolation.** Confirm the WebView keeps the book separate from banking sessions.
- **Storage.** Opt-in device storage holds only page, settings, stamps and fictional values. There are no service workers, analytics or external requests.

## Compliance
- **Facts.** Confirm the currency facts against CBK pages: 1 KWD = 1,000 fils; coins of 5, 10, 20, 50 and 100 fils; notes from ¼ to 20 KWD.
- **Campaign wording.** Confirm the Diraya roles (overseen by CBK, managed by KBA, banks participating). The book claims no CBK or KBA approval.
- **What the book leaves out.** It contains no products, rates, fees, eligibility rules, prize draws or account-opening calls to action.
- **Keepsake card.** The completion card is labelled as a keepsake, not a certificate.
- **Sources.** Recheck the registry in `source-registry.md` before release.

## Website team
- **Deploy.** Put `dist/` under a bank-controlled HTTPS path, for example `/kids/money-book/`, and set the headers.
- **Embed.** Use the iframe example in `embed/`, adding the page origin to `frame-ancestors` and to `allowedParentOrigins`.
- **Django CMS.** Adapt `embed/django-cms-snippet.html` only once the platform is confirmed.

## App teams (iOS / Android)
- **WebView guidance.** Follow `integration.md` §3 for origin restriction, data-store isolation, safe areas, back/close, sound and the download/print fallbacks.
- **Close button.** To show an in-book close button, set `showCloseButton: true` and handle `ld:close-request`.
- **Release process.** Test in the real apps through your normal process; a static bundle does not update the native apps.
