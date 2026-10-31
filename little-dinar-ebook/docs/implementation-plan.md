# Implementation plan and brand interpretation

## What was inspected first

- **Repository.** `mzagy85-spec/reel-videos` holds Claude Code skills and video kits, with no web app, so the book is a self-contained project in `little-dinar-ebook/`. Stack per the brief's default for an empty project: React 19, TypeScript, Vite 8 with a static build, and CSS/SVG animation with no motion library.
- **Brand guide.** `Brand Guidelines 26.pdf` (46 pages) was read as text, and the logo, colour, arrow and icon spreads (PDF pages 5, 6, 14, 18 and 19) were rendered and looked at.
- **Logo files.** `GB_logo.pdf` holds Illustrator vector artwork: the full-colour logo on page 2 and the approved inverted (white) logo on page 1. Two raster logos came with the chat: a 6555×1157 RGBA PNG with true transparency, and an A4 JPEG with the logo on a white page. The brief named three PNGs; I received the PDF and these two images instead.
- **Fonts.** `Cairo.zip` contains static Cairo weights, the variable font and `OFL.txt`.
- **Brief.** `GB-Childrens-Ebook-Master-Prompt.docx` matches the brief in the conversation.

## Plan, as built

1. Extract brand tokens and assets (logo vectors, arrow artwork, Cairo WOFF2 subsets).
2. Write pure money and activity logic in integer fils, with tests first-class.
3. Build bilingual content files with a typed schema, one record per shared page id.
4. Build the reader shell: hash navigation, drawers, language switch, settings, host adapter, print edition.
5. Build the 14 activities, including the map jigsaw (tap, keyboard, drag) and the crossword (word bank, letter entry, accessible list).
6. Draw an original SVG illustration set: characters, 14 scenes, the neighbourhood map. This ran in parallel with steps 4 and 5.
7. Verify with unit tests, browser end-to-end checks, axe accessibility scans, responsive screenshots and lab performance.
8. Write the docs and handoff.

## Brand interpretation

- **Colour.** The UI uses only the published RGB swatches:
  - red #EF2B2D for the cover band and card header;
  - secondary red #CE0000 for buttons and small red text (white on #EF2B2D fails contrast for small text);
  - blue #00248F for headings, numbers and icons;
  - grey #5F6264 for body copy;
  - #F3F3F3 for reading surfaces;
  - #B7B9BC for graphics.

  Two extra neutral steps darken the body grey for long reading: #4A4D4F and #3F4244. Both are darker than #5F6264, are used for text only, and are listed in brand-notes for approval.
- **Logo.** The supplied vector is used unaltered: colour logo in the header top right in both languages, inverted logo on the red card header. It also appears as signage on the illustrated bank branch and the map's bank building, as an overlay on a blank white panel the illustration leaves for it. It is never drawn into the art.
- **Brand arrows.** These are the real artwork from guide page 18, extracted as images. They point right or up and are not mirrored in Arabic. Page navigation uses ordinary chevrons that do mirror.
- **Icons.** Red-and-blue two-colour line icons in light circles, the website/app style from page 19. The icon drawings are original.
- **AlDanah pattern.** Not used. Sea waves are plain illustrated swells.
- **Sonic logo.** Not supplied, so not used and not imitated. The optional effects are soft synthetic tones, clearly not the bank's jingle.
- **Characters.** Hessa and Hamad are original story characters, not mascots. Neo is not drawn because no approved Neo assets were supplied.
- **Diraya.** Text credits only, in the places the brief lists. No campaign logo was invented and no CBK/KBA artwork is used.

## Assumptions

- **Age range.** 7 to 11 is a reading suggestion only.
- **Host.** The website platform is not confirmed. A Django CMS snippet is provided as an example only.
- **Production domains.** Unknown, so the parent-origin allowlist ships empty and CSP examples use placeholders.
- **Audio.** No narration was recorded or generated. Image-generation and voice tools were available through connectors, but using them would have spent the account's credits and raised licensing questions for a bank deliverable, so the art is hand-authored SVG and narration is listed as pending.
- **Arabic crossword.** The six Arabic answers cannot intersect inside 10 columns (an exhaustive search found no layout), so that grid is 11×6. It is still smaller in area than the English 10×8 grid.
- **Arabic register.** Modern Standard Arabic with selective diacritics on a few words (for example ندّخر, تعلّم) to help early readers.
