// Opt-in, anonymous, device-only progress storage.
// Stores only: page, language, settings, discovery stamps and fictional activity values.
// Disabled, full or corrupt storage never breaks the book.

import type { BookState } from './store';

export const STORAGE_KEY = 'little-dinar-ebook:v1';
export type StorageStatus = 'ok' | 'none' | 'unavailable' | 'corrupt';

function storage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = '__ld_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function looksValid(x: unknown): x is BookState {
  if (!x || typeof x !== 'object') return false;
  const s = x as Partial<BookState>;
  return (
    s.version === 1 &&
    typeof s.page === 'number' && s.page >= 1 && s.page <= 15 &&
    (s.locale === 'ar' || s.locale === 'en') &&
    !!s.settings && typeof s.settings === 'object' &&
    !!s.act && typeof s.act === 'object' &&
    !!s.act.crossword && !!s.act.ledger && Number.isInteger(s.act.ledger.wallet) && Number.isInteger(s.act.ledger.account) &&
    s.act.ledger.wallet + s.act.ledger.account === 5000 &&
    !!s.concepts && Array.isArray(s.quizMastered)
  );
}

export function loadSaved(): { state: BookState | null; status: StorageStatus } {
  const s = storage();
  if (!s) return { state: null, status: 'unavailable' };
  let raw: string | null = null;
  try {
    raw = s.getItem(STORAGE_KEY);
  } catch {
    return { state: null, status: 'unavailable' };
  }
  if (!raw) return { state: null, status: 'none' };
  try {
    const parsed = JSON.parse(raw);
    if (looksValid(parsed) && parsed.settings.remember) return { state: parsed, status: 'ok' };
  } catch {
    /* fall through */
  }
  try { s.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  return { state: null, status: 'corrupt' };
}

export function writeSaved(state: BookState): StorageStatus {
  const s = storage();
  if (!s) return 'unavailable';
  try {
    s.setItem(STORAGE_KEY, JSON.stringify(state));
    return 'ok';
  } catch {
    return 'unavailable';
  }
}

export function clearSaved() {
  const s = storage();
  try { s?.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}
