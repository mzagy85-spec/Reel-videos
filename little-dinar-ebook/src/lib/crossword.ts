import type { CrosswordPuzzle, CrosswordWord } from '../content/crossword';

export const cellKey = (row: number, col: number) => `${row},${col}`;

export interface GridCell {
  row: number;
  col: number;
  solution: string;
  number?: number;
  words: string[]; // word ids passing through this cell
}

export function wordCells(w: CrosswordWord): { row: number; col: number; letter: string }[] {
  // Array.from splits by code point, so each Arabic letter is exactly one cell.
  return Array.from(w.answer).map((letter, i) => ({
    row: w.dir === 'down' ? w.row + i : w.row,
    col: w.dir === 'across' ? w.col + i : w.col,
    letter,
  }));
}

export function buildGrid(p: CrosswordPuzzle): Map<string, GridCell> {
  const cells = new Map<string, GridCell>();
  for (const w of p.words) {
    for (const c of wordCells(w)) {
      const k = cellKey(c.row, c.col);
      const existing = cells.get(k);
      if (existing) existing.words.push(w.id);
      else cells.set(k, { row: c.row, col: c.col, solution: c.letter, words: [w.id] });
    }
  }
  // Standard numbering: scan rows top to bottom, logical columns from the start edge.
  let n = 1;
  const starts = new Set(p.words.map((w) => cellKey(w.row, w.col)));
  for (let r = 0; r < p.height; r++) {
    for (let c = 0; c < p.width; c++) {
      const k = cellKey(r, c);
      if (starts.has(k)) cells.get(k)!.number = n++;
    }
  }
  return cells;
}

export function wordNumber(p: CrosswordPuzzle, wordId: string): number {
  const w = p.words.find((x) => x.id === wordId)!;
  return buildGrid(p).get(cellKey(w.row, w.col))!.number!;
}

const ARABIC_MARKS = /[ً-ٰٟۖ-ۭـ]/g; // harakat, superscript alef, Quranic marks, tatweel

/** Letter comparison ignores diacritics and tatweel, folds hamza-alef forms, and ignores English case. */
export function normalizeLetter(s: string, locale: 'ar' | 'en'): string {
  if (locale === 'en') return s.trim().toUpperCase();
  return s
    .replace(ARABIC_MARKS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .trim();
}

export function normalizeWord(s: string, locale: 'ar' | 'en'): string {
  return Array.from(normalizeLetter(s.replace(/\s+/g, ''), locale)).join('');
}

export function isWordSolved(p: CrosswordPuzzle, entries: Record<string, string>, wordId: string): boolean {
  const w = p.words.find((x) => x.id === wordId);
  if (!w) return false;
  return wordCells(w).every((c) => normalizeLetter(entries[cellKey(c.row, c.col)] ?? '', p.locale) === normalizeLetter(c.letter, p.locale));
}

export function solvedWords(p: CrosswordPuzzle, entries: Record<string, string>): string[] {
  return p.words.filter((w) => isWordSolved(p, entries, w.id)).map((w) => w.id);
}

export function fillWord(p: CrosswordPuzzle, entries: Record<string, string>, wordId: string): Record<string, string> {
  const w = p.words.find((x) => x.id === wordId)!;
  const next = { ...entries };
  for (const c of wordCells(w)) next[cellKey(c.row, c.col)] = c.letter;
  return next;
}

export function clearWord(p: CrosswordPuzzle, entries: Record<string, string>, wordId: string): Record<string, string> {
  const next = { ...entries };
  const others = p.words.filter((x) => x.id !== wordId && isWordSolved(p, entries, x.id));
  const keep = new Set(others.flatMap((o) => wordCells(o).map((c) => cellKey(c.row, c.col))));
  const w = p.words.find((x) => x.id === wordId)!;
  for (const c of wordCells(w)) {
    const k = cellKey(c.row, c.col);
    if (!keep.has(k)) delete next[k];
  }
  return next;
}

/** Reveals the first empty or wrong letter of a word. Returns the key revealed, or null if the word is complete. */
export function revealOne(p: CrosswordPuzzle, entries: Record<string, string>, wordId: string): { entries: Record<string, string>; key: string | null } {
  const w = p.words.find((x) => x.id === wordId)!;
  for (const c of wordCells(w)) {
    const k = cellKey(c.row, c.col);
    if (normalizeLetter(entries[k] ?? '', p.locale) !== normalizeLetter(c.letter, p.locale)) {
      return { entries: { ...entries, [k]: c.letter }, key: k };
    }
  }
  return { entries, key: null };
}

/** Full structural validation. Returns a list of problems; empty means the puzzle is valid. */
export function validatePuzzle(p: CrosswordPuzzle): string[] {
  const errors: string[] = [];
  const letters = new Map<string, string>();
  for (const w of p.words) {
    if (!w.clue.trim()) errors.push(`${w.id}: missing clue`);
    if (!w.meaning.trim()) errors.push(`${w.id}: missing meaning`);
    for (const c of wordCells(w)) {
      if (c.row < 0 || c.col < 0 || c.row >= p.height || c.col >= p.width) errors.push(`${w.id}: cell ${c.row},${c.col} outside ${p.width}x${p.height}`);
      const k = cellKey(c.row, c.col);
      const prev = letters.get(k);
      if (prev !== undefined && prev !== c.letter) errors.push(`${w.id}: conflict at ${k} (${prev} vs ${c.letter})`);
      letters.set(k, c.letter);
    }
  }
  // Every maximal run of 2+ letters, across and down, must be exactly one answer (no accidental words).
  const runs: { dir: 'across' | 'down'; row: number; col: number; text: string }[] = [];
  for (let r = 0; r < p.height; r++) {
    let c = 0;
    while (c < p.width) {
      if (!letters.has(cellKey(r, c))) { c++; continue; }
      const start = c; let text = '';
      while (c < p.width && letters.has(cellKey(r, c))) { text += letters.get(cellKey(r, c)); c++; }
      if (Array.from(text).length > 1) runs.push({ dir: 'across', row: r, col: start, text });
    }
  }
  for (let c = 0; c < p.width; c++) {
    let r = 0;
    while (r < p.height) {
      if (!letters.has(cellKey(r, c))) { r++; continue; }
      const start = r; let text = '';
      while (r < p.height && letters.has(cellKey(r, c))) { text += letters.get(cellKey(r, c)); r++; }
      if (Array.from(text).length > 1) runs.push({ dir: 'down', row: start, col: c, text });
    }
  }
  for (const run of runs) {
    const match = p.words.find((w) => w.dir === run.dir && w.row === run.row && w.col === run.col && w.answer === run.text);
    if (!match) errors.push(`unexpected ${run.dir} run "${run.text}" at ${run.row},${run.col}`);
  }
  if (runs.length !== p.words.length) errors.push(`expected ${p.words.length} runs, found ${runs.length}`);
  // Every word must cross another, and the whole grid must be one connected component.
  for (const w of p.words) {
    const mine = new Set(wordCells(w).map((c) => cellKey(c.row, c.col)));
    const crosses = p.words.some((o) => o.id !== w.id && wordCells(o).some((c) => mine.has(cellKey(c.row, c.col))));
    if (!crosses) errors.push(`${w.id}: does not intersect any other word`);
  }
  const keys = [...letters.keys()];
  const seen = new Set<string>([keys[0]]);
  const stack = [keys[0]];
  while (stack.length) {
    const [r, c] = stack.pop()!.split(',').map(Number);
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = cellKey(r + dr, c + dc);
      if (letters.has(k) && !seen.has(k)) { seen.add(k); stack.push(k); }
    }
  }
  if (seen.size !== letters.size) errors.push('grid is not connected');
  const ids = new Set(p.words.map((w) => w.id));
  if (ids.size !== p.words.length) errors.push('duplicate word ids');
  return errors;
}
