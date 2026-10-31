# Brand notes

Source: Gulf Bank Brand Guidelines 2026 (supplied as `Brand Guidelines 26.pdf`). PDF viewer pages are cited; printed spread numbers differ.

## Tokens (`src/styles/tokens.css`)

| Token | Value | Guide | Use in the book |
|---|---|---|---|
| `--gb-red` | #EF2B2D (239, 43, 45) | p.14 primary | Cover band, card header, large white text only |
| `--gb-red-2` | #CE0000 (206, 0, 0) | p.14 secondary | Primary buttons, current-page marker, small red text |
| `--gb-blue` | #00248F (0, 36, 143) | p.14 secondary | Headings, key numbers, icons, focus ring |
| `--gb-grey` | #5F6264 (95, 98, 100) | p.15 | Body copy, sub-headlines |
| `--gb-grey-bg` | #F3F3F3 (243, 243, 243) | p.15 | Reading surfaces, panels |
| `--gb-grey-graphic` | #B7B9BC (183, 185, 188) | p.15 | Dividers, empty states, decorative borders |
| white | #FFFFFF | applications | Page and card surfaces |

**For brand review.** Two text-only steps darker than the body grey are used for long passages: #4A4D4F for story text (8.6:1) and #3F4244 for feedback text. Two pale tints serve as hover and selected backgrounds: #EEF1FA (blue tint) and #DCDDDE (hairlines). Please approve them or name replacements.

## Contrast (checked in `tests/contrast.test.ts`)

| Pairing | Ratio | Allowed use |
|---|---|---|
| Blue on white | 14.0:1 | any text |
| Body grey on white / on #F3F3F3 | 6.2:1 / 5.6:1 | any text |
| White on #CE0000 | 5.9:1 | any text (buttons) |
| #CE0000 on white | 5.9:1 | any text |
| White on #EF2B2D | 3.9:1 | large text only (title 37px+, subtitle and kicker 18.7px bold) |
| #B7B9BC on white | 2.1:1 | decoration only, never the only cue |

## Logo use

The guide covers logo use on PDF pages 5 and 6. What the book does:

- **Files.** `src/assets/brand/gb-logo-colour.svg` and `gb-logo-white.svg` come from pages 2 and 1 of the supplied `GB_logo.pdf` (Adobe Illustrator). They were cropped to the artwork bounds by changing the viewBox only. Paths and colours are unchanged, and the aspect ratio is 5.645:1.
- **Raster alternatives inspected.** The 6555×1157 PNG has real alpha and no built-in background, so it is suitable as a raster fallback. The A4 JPEG has a white page around the logo and is not used.
- **Placement.** The colour logo sits in the header at the top right in both languages, 30px high (24px on phones, 22px under 360px). Clear space is at least the height of the "N", per the safe-zone spread. It is never mirrored, rotated, stretched, animated, filtered or put inside a badge.
- **Inverted logo.** The white logo appears only on the primary-red card header. That pairing matches page 1 of the supplied PDF.
- **Signage in illustrations.** The bank branch scene (page 9) and the map's bank building show the colour logo file as an overlay on a blank white panel the art leaves for it.

### Colour discrepancy to review

The supplied logo artwork colours are about #224985 (blue) and #E02333 (red). They differ from the published UI swatches (#00248F, #EF2B2D). The logo is kept exactly as supplied and has not been recoloured. Please confirm which logo master is current for digital.

## Brand arrows (PDF page 18)

The book uses the actual arrow artwork from the guide, which is embedded there as 300 ppi images. The extraction steps:

1. Extract the images with `pdfimages`.
2. Key out the white paper so only the anti-aliased rim becomes transparent. Every artwork colour, including graphic grey, stays fully opaque.
3. Crop to the artwork bounds.

Files are `src/assets/brand/arrows-*.webp` (PNG originals alongside).

Where they appear:

- the cover band, using the double blue/grey chevron;
- the keepsake card, using the double red chevron.

They point right in both languages and are never mirrored in Arabic. Reading navigation uses separate plain chevrons, which do follow the reading direction.

**Note for brand.** The arrow artwork colours also differ slightly from the swatches. They are kept as supplied.

## Icons (PDF page 19)

The guide asks for two-colour icons in corporate red and blue for website and app use. The book's set is `src/app/Icons.tsx`: original line drawings with blue strokes and red accents, shown in light circles and always paired with a text label. Bank icons from the guide were not copied.

## Typography (PDF page 10)

- **Typeface.** Cairo is used for both scripts.
- **Weights.** Regular 400 for body, SemiBold 600 for emphasis, Bold 700 for headings.
- **Files.** Subset with fontTools to Arabic, Arabic Presentation Forms A/B, Latin and punctuation, then converted to WOFF2 (about 26 KB per weight).
- **Shaping check.** Arabic shaping was checked visually after conversion in Chromium screenshots of every page.
- **Hosting.** Fonts are self-hosted with no external font requests. The licence is in `licenses/Cairo-OFL.txt`.
- **The logo.** Its lettering stays the logo artwork and is never set in Cairo.

## Not used, by design

- **AlDanah wave pattern (PDF page 17).** It belongs to AlDanah materials.
- **Sonic logo (PDF page 12).** No authorised audio was supplied. Nothing imitates it.
- **Diraya, CBK and KBA artwork.** None was supplied, so there are text credits only.

## neo (Gulf Bank's children's savings account)

Sources:
- the supplied `NEO_presentation_202309_07.pdf` (BPG, July 2023), for the logo, palette, brand elements and copy;
- the supplied "neo premiere" banner, for the character.

**Logo.**
- File: `src/assets/neo/neo-logo.webp`, the "neo / من بنك الخليج" version, taken from the presentation's final-logo page.
- Processing: background keyed out and cropped to the coloured artwork. Nothing was redrawn or recoloured.
- The presentation states its colours are #CE0000 and #00248F, used only for the logo. Both match the Gulf Bank UI tokens.
- The source is a raster at about 220 ppi. Please supply the vector master.

**Palette.**
- Navy #020266, blue #00248F, royal #0000BC, teal #40C1AC, yellow #FFCA36, red #CE0000 and #EF2B2D, grey #E9E9E9, white.
- Defined as `--neo-*` tokens and used only inside neo elements: the guide bubble, the page 9 panel and the parent information.
- Gulf Bank stays the presenting brand everywhere else.

**Brand elements.**
- The geometric shape pattern ("option 1") is used as a small decorative band in the page 9 panel (`neo-shapes.webp`).
- The doodle pattern ("option 2") is not used.

**Character.**
- File: `neo-character.webp`, cut out of the 880×440 banner with only the background removed.
- The floating cup and cinema seat were dropped. The 3D glasses, popcorn and tickets are part of the character's pose, so they stay.
- It is about 290 px tall, so it is shown at 96 to 110 CSS px and looks slightly soft on high-density screens.
- It is the cinema ("neo premiere") version of neo. Please supply a neutral, high-resolution transparent master; the components pick it up with no code change.

**Not used.**
- The presentation's "Mascot" slide shows an earlier proposal that differs from the banner character.
- The presentation's lifestyle photography, social posts and card visuals.

**Dialogue.** neo's guide lines are draft copy written for this book (`src/content/neo.ts`). They restate the lessons and make no product claims. Marketing must approve or replace them.
