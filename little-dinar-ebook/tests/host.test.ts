import { describe, expect, it } from 'vitest';
import { parseInbound } from '../src/lib/host';
import { reducer, createInitialState, awardConcepts } from '../src/state/store';
import { fillWord } from '../src/lib/crossword';
import { crosswords } from '../src/content/crossword';

describe('host message schema', () => {
  it('accepts only exact, known messages', () => {
    expect(parseInbound({ type: 'ld:set-locale', locale: 'en' })).toEqual({ type: 'ld:set-locale', locale: 'en' });
    expect(parseInbound({ type: 'ld:set-locale', locale: 'fr' })).toBeNull();
    expect(parseInbound({ type: 'ld:set-locale', locale: 'en', url: 'https://x' })).toBeNull();
    expect(parseInbound({ type: 'ld:open-url', url: 'https://x' })).toBeNull();
    expect(parseInbound('ld:set-locale')).toBeNull();
    expect(parseInbound(null)).toBeNull();
  });
});

describe('book state', () => {
  it('language switch keeps page, activity state, settings and progress', () => {
    let s = createInitialState('ar');
    s = reducer(s, { type: 'goto', page: 10 });
    s = reducer(s, { type: 'settings', patch: { effects: true } });
    s = reducer(s, { type: 'ledger', a: { type: 'deposit', expectId: 1 } });
    const before = s;
    s = reducer(s, { type: 'locale', locale: 'en' });
    expect(s.page).toBe(10);
    expect(s.act).toBe(before.act);
    expect(s.settings.effects).toBe(true);
    expect(s.concepts).toBe(before.concepts);
  });
  it('crossword state is kept per language', () => {
    let s = createInitialState('ar');
    s = reducer(s, { type: 'crossword', locale: 'ar', entries: fillWord(crosswords.ar, {}, 'fils') });
    s = reducer(s, { type: 'locale', locale: 'en' });
    s = reducer(s, { type: 'crossword', locale: 'en', entries: fillWord(crosswords.en, {}, 'bank') });
    expect(Object.values(s.act.crossword.ar.entries).join('')).toBe('فلس');
    expect(Object.values(s.act.crossword.en.entries).join('')).toBe('BANK');
  });
  it('stamps are awarded once and survive activity resets', () => {
    let s = createInitialState('en');
    for (let i = 0; i < 10; i++) s = reducer(s, { type: 'tokens', a: { type: 'add' } });
    expect(s.concepts.dinar).toBe(true);
    const keys = Object.keys(s.concepts).length;
    s = reducer(s, { type: 'tokens', a: { type: 'reset' } });
    for (let i = 0; i < 10; i++) s = reducer(s, { type: 'tokens', a: { type: 'add' } });
    expect(Object.keys(s.concepts).length).toBe(keys);
    expect(awardConcepts(s)).toBe(s);
  });
  it('quiz mastery counts once per question', () => {
    let s = createInitialState('en');
    s = reducer(s, { type: 'quiz', q: 'q3', answer: 'b' });
    s = reducer(s, { type: 'quiz', q: 'q3', answer: 'a' });
    s = reducer(s, { type: 'quiz', q: 'q3', answer: 'b' });
    expect(s.quizMastered).toEqual(['q3']);
  });
  it('page bounds are enforced', () => {
    let s = createInitialState('ar');
    s = reducer(s, { type: 'goto', page: 16 });
    expect(s.page).toBe(15);
    s = reducer(s, { type: 'goto', page: 0 });
    expect(s.page).toBe(1);
  });
  it('reset all keeps settings and language but clears progress', () => {
    let s = createInitialState('ar');
    s = reducer(s, { type: 'settings', patch: { textSize: 'large' } });
    s = reducer(s, { type: 'help', choice: 'repair' });
    s = reducer(s, { type: 'goto', page: 13 });
    s = reducer(s, { type: 'resetAll' });
    expect(s.page).toBe(1);
    expect(s.concepts).toEqual({});
    expect(s.settings.textSize).toBe('large');
    expect(s.locale).toBe('ar');
  });
});
