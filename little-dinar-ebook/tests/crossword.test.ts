import { describe, expect, it } from 'vitest';
import { crosswords, crosswordAr, crosswordEn } from '../src/content/crossword';
import { buildGrid, cellKey, clearWord, fillWord, isWordSolved, normalizeLetter, normalizeWord, revealOne, solvedWords, validatePuzzle, wordCells, wordNumber } from '../src/lib/crossword';

describe('crossword grids', () => {
  for (const p of [crosswordEn, crosswordAr]) {
    it(`${p.locale}: valid, connected, every answer has a clue`, () => {
      expect(validatePuzzle(p)).toEqual([]);
      expect(p.words).toHaveLength(6);
    });
    it(`${p.locale}: compact for phones`, () => {
      expect(p.height).toBeLessThanOrEqual(10);
      expect(p.width).toBeLessThanOrEqual(11);
      expect(p.width * p.height).toBeLessThanOrEqual(100);
    });
  }
  it('English answer bank is exact', () => {
    expect(crosswordEn.words.map((w) => w.answer).sort()).toEqual(['ALLOWANCE', 'BANK', 'BUDGET', 'DINAR', 'FILS', 'SAVE']);
    for (const w of crosswordEn.words) expect(w.answer).toMatch(/^[A-Z]+$/);
  });
  it('Arabic answer bank is exact and has no Latin letters', () => {
    expect(crosswordAr.words.map((w) => w.answer).sort()).toEqual(['ادخار', 'بنك', 'دينار', 'فلس', 'مصروف', 'ميزانية'].sort());
    for (const w of crosswordAr.words) expect(w.answer).not.toMatch(/[A-Za-z]/);
  });
  it('both grids cover the same six concepts', () => {
    expect(crosswordAr.words.map((w) => w.id).sort()).toEqual(crosswordEn.words.map((w) => w.id).sort());
  });
  it('Arabic coordinates are logical: across letters run in reading order from the start column', () => {
    const budget = crosswordAr.words.find((w) => w.id === 'budget')!;
    const cells = wordCells(budget);
    expect(cells[0]).toEqual({ row: 0, col: 4, letter: 'م' });
    expect(cells.map((c) => c.letter).join('')).toBe('ميزانية');
    expect(cells.map((c) => c.col)).toEqual([4, 5, 6, 7, 8, 9, 10]);
  });
  it('known crossings', () => {
    const g = buildGrid(crosswordAr);
    expect(g.get(cellKey(0, 4))!.words.sort()).toEqual(['allowance', 'budget']);
    expect(g.get(cellKey(2, 2))!.solution).toBe('ن'); // دينار x بنك
    const e = buildGrid(crosswordEn);
    expect(e.get(cellKey(5, 0))!.solution).toBe('A'); // BANK x ALLOWANCE
    expect(e.get(cellKey(3, 8))!.solution).toBe('E'); // SAVE x BUDGET
  });
  it('numbering', () => {
    expect(wordNumber(crosswordEn, 'save')).toBe(1);
    expect(wordNumber(crosswordEn, 'allowance')).toBe(6);
    expect(wordNumber(crosswordAr, 'budget')).toBe(1);
    expect(wordNumber(crosswordAr, 'allowance')).toBe(1);
    expect(wordNumber(crosswordAr, 'fils')).toBe(5);
  });
});

describe('answer handling', () => {
  it('ignores diacritics, tatweel and hamza forms in Arabic; case in English', () => {
    expect(normalizeWord('ادِّخار', 'ar')).toBe('ادخار');
    expect(normalizeWord('ميـزانية', 'ar')).toBe('ميزانية');
    expect(normalizeLetter('أ', 'ar')).toBe('ا');
    expect(normalizeWord('dinar', 'en')).toBe('DINAR');
  });
  it('fill, solve, clear (keeping solved crossings), reveal', () => {
    const p = crosswordAr;
    let e = fillWord(p, {}, 'budget');
    expect(isWordSolved(p, e, 'budget')).toBe(true);
    e = fillWord(p, e, 'allowance');
    e = clearWord(p, e, 'allowance');
    expect(isWordSolved(p, e, 'budget')).toBe(true); // shared cell kept
    expect(isWordSolved(p, e, 'allowance')).toBe(false);
    const r = revealOne(p, e, 'allowance');
    expect(r.key).toBe(cellKey(1, 4));
    let all = {};
    for (const w of p.words) all = fillWord(p, all, w.id);
    expect(solvedWords(p, all)).toHaveLength(6);
    expect(revealOne(p, all, 'fils').key).toBeNull();
  });
  it('per-language puzzles are independent objects', () => {
    expect(crosswords.ar).not.toBe(crosswords.en);
  });
});
