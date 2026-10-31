# Production media: what exists and what is pending

| Item | Status | Notes |
|---|---|---|
| Scene illustrations (14 scenes, 15 pages) | Done (original SVG) | Hand-authored for this project; no AI image generation, no third-party assets. Optional raster upgrade prompts are in `illustration-manifest.md`. |
| Characters (Hessa, Hamad, Mama, bank employee, cashier, grandmother, cousin) | Done (original SVG) | See `character-sheet.md`. Not official mascots. |
| Money Journey Map art | Done (original SVG) | Illustrated learning map, not a real map. |
| Gulf Bank logo | Supplied, used unaltered | From `GB_logo.pdf`. Colour discrepancy noted in `brand-notes.md`. |
| Brand arrows | Extracted from the guide | Guide p.18 artwork, background keyed out only. |
| Cairo font | Supplied, subset to WOFF2 | OFL licence retained. |
| Arabic narration, 15 pages | **Pending** | Scripts ready in `narration-scripts.md`. Needs an approved human voice or a licensed TTS voice. Add files to `public/audio/` and set `narrationAudio` per page. |
| English narration, 15 pages | **Pending** | As above. |
| Crossword word narration (12 words) | **Pending, optional** | Same rules. Suggested files `public/audio/word-<id>-<lang>.mp3`; would need a small UI hook when supplied. |
| Gulf Bank sonic logo | **Not supplied** | Use only with an authorised file, only after sound opt-in. Nothing in the book imitates it. |
| Diraya campaign artwork | **Not supplied** | Text credits only. Add official artwork only from the approved campaign media kit. |
| CBK / KBA logos | Not used | Must not be added or altered without permission. |
| Neo character | Not supplied | The book does not depict Neo. If approved assets arrive, the guide role can be swapped in without changing the story logic. |
| Real banknote/coin images | Not used | Learning tokens are labelled "Learning token, not a real coin". |
| Sound effects | Done (synthesised on device) | Soft sine tones generated with Web Audio at runtime; off by default; not a brand sound. |
| neo character master (transparent, high resolution, neutral pose) | **Needed** | Interim: cut out of the supplied 880×440 "neo premiere" banner (cinema props, about 290 px tall). Replace `src/assets/neo/neo-character.webp`. |
| neo logo vector master | **Wanted** | Interim: raster from the 2023 presentation, background keyed out. Replace `src/assets/neo/neo-logo.webp`. |
