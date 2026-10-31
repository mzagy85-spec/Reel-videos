// All money in this book is held as integer fils. 1 KWD = 1000 fils.
// Never store or calculate dinar values as floating point numbers.

export type Fils = number;
export const FILS_PER_KWD = 1000;

export function assertFils(value: number): Fils {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Money must be an integer number of fils, got ${value}`);
  }
  return value;
}

export function kwd(whole: number): Fils {
  return assertFils(whole * FILS_PER_KWD);
}

/** Formats fils as a KWD amount with exactly three decimals, using integer maths only. */
export function formatKwdNumber(fils: Fils): string {
  assertFils(fils);
  const sign = fils < 0 ? '-' : '';
  const abs = Math.abs(fils);
  const dinars = Math.floor(abs / FILS_PER_KWD);
  const rest = abs % FILS_PER_KWD;
  return `${sign}${dinars.toLocaleString('en-US')}.${String(rest).padStart(3, '0')}`;
}

export type Locale = 'ar' | 'en';

/** "1.000 KWD" / "1.000 د.ك." with Western digits in both languages. */
export function formatKwd(fils: Fils, locale: Locale): string {
  const n = formatKwdNumber(fils);
  return locale === 'ar' ? `${n} د.ك.` : `${n} KWD`;
}

/** "250 fils" / "250 فلس". Thousands separators keep large values readable. */
export function formatFils(fils: Fils, locale: Locale): string {
  assertFils(fils);
  const n = fils.toLocaleString('en-US');
  return locale === 'ar' ? `${n} فلس` : `${n} fils`;
}

/** Whole dinars in story copy, e.g. "10 dinars" / "10 دنانير". */
export function formatDinars(fils: Fils, locale: Locale): string {
  assertFils(fils);
  if (fils % FILS_PER_KWD !== 0) return formatKwd(fils, locale);
  const d = fils / FILS_PER_KWD;
  if (locale === 'en') return `${d} ${d === 1 ? 'dinar' : 'dinars'}`;
  if (d === 1) return 'دينار واحد';
  if (d === 2) return 'ديناران';
  if (d >= 3 && d <= 10) return `${d} دنانير`;
  return `${d} دينارًا`;
}

export function add(a: Fils, b: Fils): Fils {
  return assertFils(assertFils(a) + assertFils(b));
}

export function subtract(a: Fils, b: Fils): Fils {
  return assertFils(assertFils(a) - assertFils(b));
}

export function sum(values: Fils[]): Fils {
  return values.reduce((acc, v) => add(acc, v), 0);
}

/**
 * Number of equal saving steps needed to cover `remaining`.
 * Returns null when the step is zero or negative, because the goal can never be reached that way.
 */
export function stepsToReach(remaining: Fils, perStep: Fils): number | null {
  assertFils(remaining);
  assertFils(perStep);
  if (remaining <= 0) return 0;
  if (perStep <= 0) return null;
  return Math.ceil(remaining / perStep);
}
