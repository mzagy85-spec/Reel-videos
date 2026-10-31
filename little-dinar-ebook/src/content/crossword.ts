// Deterministic, pre-validated crossword grids. One separate grid per language.
//
// COORDINATES ARE LOGICAL, NOT VISUAL.
//   row 0 is the top row; rows grow downwards.
//   col 0 is the START edge of the reading direction: the LEFT edge in English and the RIGHT edge in Arabic.
//   An "across" answer's letter i sits at (row, col + i); a "down" answer's letter i sits at (row + i, col).
// The grid is rendered with CSS grid inside an element whose `dir` matches the locale, so CSS places
// logical col 0 on the right in Arabic. The answer strings are stored in normal reading order and are never
// reversed in code. That avoids reversing an Arabic answer twice.
//
// The layouts were found with an exhaustive search (see docs/crossword-authoring.md) and are re-validated by
// tests/crossword.test.ts. The six Arabic answers cannot intersect inside 10 columns; the smallest valid layout
// is 11 x 6 (66 cells), which is still smaller in area than the English 10 x 8 board.

import type { L10n } from './schema';

export type Direction = 'across' | 'down';

export interface CrosswordWord {
  id: string;
  answer: string;
  row: number;
  col: number;
  dir: Direction;
  clue: string;
  /** Short reminder of the meaning, repeated in feedback. */
  meaning: string;
}

export interface CrosswordPuzzle {
  locale: 'ar' | 'en';
  width: number;
  height: number;
  words: CrosswordWord[];
}

export const crosswordEn: CrosswordPuzzle = {
  locale: 'en',
  width: 10,
  height: 8,
  words: [
    { id: 'save', answer: 'SAVE', row: 0, col: 8, dir: 'down', clue: 'Keep some money for later.', meaning: 'To save is to keep some money for something later.' },
    { id: 'fils', answer: 'FILS', row: 3, col: 2, dir: 'down', clue: 'One thousand of these make one dinar.', meaning: '1,000 fils make 1 Kuwaiti dinar.' },
    { id: 'budget', answer: 'BUDGET', row: 3, col: 4, dir: 'across', clue: 'A plan for using money.', meaning: 'A budget is a plan for the money you can use.' },
    { id: 'dinar', answer: 'DINAR', row: 3, col: 6, dir: 'down', clue: "Kuwait's currency.", meaning: 'The Kuwaiti dinar is the money we use in Kuwait.' },
    { id: 'bank', answer: 'BANK', row: 4, col: 0, dir: 'down', clue: 'A place that provides accounts and banking services.', meaning: 'A bank keeps accounts and helps people pay and move money.' },
    { id: 'allowance', answer: 'ALLOWANCE', row: 5, col: 0, dir: 'across', clue: 'Money you may receive to use according to a plan.', meaning: 'Some children get an allowance. A plan helps it go further.' },
  ],
};

export const crosswordAr: CrosswordPuzzle = {
  locale: 'ar',
  width: 11,
  height: 6,
  words: [
    { id: 'budget', answer: 'ميزانية', row: 0, col: 4, dir: 'across', clue: 'خطة لاستخدام المال.', meaning: 'الميزانية خطة للمال الذي نستطيع استخدامه.' },
    { id: 'allowance', answer: 'مصروف', row: 0, col: 4, dir: 'down', clue: 'مبلغ قد أحصل عليه لأستخدمه وفق خطة.', meaning: 'بعض الأطفال يحصلون على مصروف، والخطة تساعدنا على استخدامه جيدًا.' },
    { id: 'save', answer: 'ادخار', row: 1, col: 0, dir: 'down', clue: 'نحتفظ بجزء من المال لهدف قادم.', meaning: 'الادخار أن نحتفظ بجزء من المال لهدف نحبه.' },
    { id: 'bank', answer: 'بنك', row: 1, col: 2, dir: 'down', clue: 'يساعدنا على استخدام الحسابات والخدمات المصرفية.', meaning: 'البنك يحفظ الحسابات ويساعدنا على الدفع والتحويل.' },
    { id: 'dinar', answer: 'دينار', row: 2, col: 0, dir: 'across', clue: 'عملة الكويت.', meaning: 'الدينار الكويتي هو المال الذي نستخدمه في الكويت.' },
    { id: 'fils', answer: 'فلس', row: 4, col: 4, dir: 'across', clue: 'ألف منه يساوي دينارًا واحدًا.', meaning: 'كل 1000 فلس تساوي دينارًا كويتيًا واحدًا.' },
  ],
};

export const crosswords: Record<'ar' | 'en', CrosswordPuzzle> = { ar: crosswordAr, en: crosswordEn };

/** Concept ids shared by both grids, so mastery is counted once whichever language solves it. */
export const crosswordConceptLabel: Record<string, L10n> = {
  dinar: { ar: 'دينار', en: 'Dinar' },
  fils: { ar: 'فلس', en: 'Fils' },
  bank: { ar: 'بنك', en: 'Bank' },
  allowance: { ar: 'مصروف', en: 'Allowance' },
  save: { ar: 'ادخار', en: 'Save' },
  budget: { ar: 'ميزانية', en: 'Budget' },
};
