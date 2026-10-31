# Crossword authoring

Both grids are stored in `src/content/crossword.ts` and validated by `tests/crossword.test.ts` (connectivity, every word crossing another, no accidental two-letter runs, exact fit, clues present).

## Coordinates

- Rows count from the top. Columns are **logical**: column 0 is the start edge of the reading direction (left in English, right in Arabic).
- An across answer's letter *i* is at `(row, col + i)`; a down answer's letter *i* is at `(row + i, col)`.
- Answers are stored in normal reading order and are never reversed in code. The grid renders in a CSS grid whose `dir` matches the language, so CSS puts logical column 0 on the right in Arabic. That is the single place direction is applied.
- Letter entry moves to the next logical cell of the selected answer; arrow keys map to logical moves (in Arabic, ArrowLeft moves to the next column).

## How the layouts were chosen

An exhaustive placement search (every word order, every crossing, standard crossword adjacency rules) was run for each word set and the most compact valid layout kept:

- English (DINAR, FILS, BANK, ALLOWANCE, SAVE, BUDGET): 10 × 8.
- Arabic (دينار، فلس، بنك، مصروف، ادخار، ميزانية): no valid layout exists within 10 columns. The smallest is 11 × 6 (66 cells), used here. It is smaller in area than the English grid and fits a 360px phone with 24px cells; the clue-list mode remains available for anyone who finds the cells small.

## Validation of answers

- Arabic: diacritics (harakat, superscript alef) and tatweel are ignored; أ إ آ ٱ count as ا; ى counts as ي. Displayed spelling keeps the stored form.
- English: case-insensitive.
- The English grid accepts only Latin letters and the Arabic grid only Arabic letters.

## Changing a word

Edit the word, its position and clue, then run `npm test`. If the validator reports a problem, re-run a search like the one above or move the word by hand until the tests pass. Never ship a grid that fails `validatePuzzle`.
