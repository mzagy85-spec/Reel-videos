import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from 'react';
import * as A from '../lib/activities';
import type { ConceptId, Locale } from '../content/schema';
import { crosswords } from '../content/crossword';
import { solvedWords } from '../lib/crossword';
import { TOTAL_PAGES } from '../content/pages';
import { loadSaved, clearSaved, writeSaved, type StorageStatus } from './persistence';

export interface Settings {
  effects: boolean;
  motion: 'system' | 'reduce' | 'full';
  textSize: 'normal' | 'large';
  remember: boolean;
}

export interface CrosswordLocaleState { entries: Record<string, string>; revealed: string[] }

export interface Activities {
  choices: ('spend' | 'save' | 'help')[];
  tokens: A.TokensState;
  needs: A.NeedsState;
  jars: A.JarsState;
  goal: A.GoalState;
  shop: A.ShopState;
  compare: A.CompareState;
  map: A.MapState;
  ledger: A.LedgerState;
  card: A.CardState;
  safety: A.SafetyState;
  help: A.HelpState;
  habit: A.HabitState;
  crossword: Record<Locale, CrosswordLocaleState>;
  quiz: Record<string, string>;
}

export interface BookState {
  version: 1;
  page: number;
  locale: Locale;
  settings: Settings;
  /** Discovery stamps. Set once, never removed by replaying or resetting an activity. */
  concepts: Partial<Record<ConceptId, true>>;
  /** Quiz questions answered correctly at least once (counted once). */
  quizMastered: string[];
  act: Activities;
}

export const initialActivities: Activities = {
  choices: [],
  tokens: A.tokensInitial,
  needs: A.needsInitial,
  jars: A.jarsInitial,
  goal: A.goalInitial,
  shop: A.shopInitial,
  compare: A.compareInitial,
  map: A.mapInitial,
  ledger: A.ledgerInitial,
  card: A.cardInitial,
  safety: A.safetyInitial,
  help: A.helpInitial,
  habit: A.habitInitial,
  crossword: { ar: { entries: {}, revealed: [] }, en: { entries: {}, revealed: [] } },
  quiz: {},
};

export const defaultSettings: Settings = { effects: false, motion: 'system', textSize: 'normal', remember: false };

export function createInitialState(locale: Locale = 'ar'): BookState {
  return { version: 1, page: 1, locale, settings: defaultSettings, concepts: {}, quizMastered: [], act: initialActivities };
}

export const QUIZ_ANSWERS: Record<string, string> = { q1: 'b', q2: 'a', q3: 'b', q4: 'b' };

export type Action =
  | { type: 'goto'; page: number }
  | { type: 'locale'; locale: Locale }
  | { type: 'settings'; patch: Partial<Settings> }
  | { type: 'choices'; choice: 'spend' | 'save' | 'help' }
  | { type: 'tokens'; a: A.TokensAction }
  | { type: 'needs'; a: A.NeedsAction }
  | { type: 'jars'; a: A.JarsAction }
  | { type: 'goal'; a: A.GoalAction }
  | { type: 'shop'; a: A.ShopAction }
  | { type: 'compare'; a: A.CompareAction }
  | { type: 'map'; a: A.MapAction }
  | { type: 'ledger'; a: A.LedgerAction }
  | { type: 'card'; a: A.CardAction }
  | { type: 'safety'; choice: A.SafetyChoice | null }
  | { type: 'help'; choice: A.HelpChoice | null }
  | { type: 'habit'; choice: A.HabitChoice | null }
  | { type: 'crossword'; locale: Locale; entries: Record<string, string>; revealed?: string }
  | { type: 'crosswordReset'; locale: Locale }
  | { type: 'quiz'; q: string; answer: string }
  | { type: 'resetAll' }
  | { type: 'hydrate'; state: BookState };

/** Adds stamps for any activity that is now complete. Stamps are never removed. */
export function awardConcepts(s: BookState): BookState {
  const a = s.act;
  const done: Record<ConceptId, boolean> = {
    choices: a.choices.length === 3,
    dinar: A.tokensComplete(a.tokens),
    needs: A.needsComplete(a.needs),
    plan: A.jarsComplete(a.jars),
    goal: A.goalReached(a.goal),
    budget: a.shop.paid,
    compare: A.compareComplete(a.compare),
    map: A.missionsComplete(a.map),
    balance: A.ledgerComplete(a.ledger),
    card: a.card.paid,
    safety: a.safety.choice === 'stopAndTell',
    helping: a.help.choice !== null,
    crossword: (['ar', 'en'] as Locale[]).some((l) => solvedWords(crosswords[l], a.crossword[l].entries).length === crosswords[l].words.length),
    habit: a.habit.choice !== null,
  };
  let concepts = s.concepts;
  for (const [k, v] of Object.entries(done) as [ConceptId, boolean][]) {
    if (v && !concepts[k]) concepts = { ...concepts, [k]: true };
  }
  return concepts === s.concepts ? s : { ...s, concepts };
}

function withAct<K extends keyof Activities>(s: BookState, key: K, value: Activities[K]): BookState {
  if (s.act[key] === value) return s;
  return awardConcepts({ ...s, act: { ...s.act, [key]: value } });
}

export function reducer(s: BookState, action: Action): BookState {
  switch (action.type) {
    case 'goto': {
      const page = Math.min(TOTAL_PAGES, Math.max(1, Math.round(action.page)));
      return page === s.page ? s : { ...s, page };
    }
    case 'locale': return action.locale === s.locale ? s : { ...s, locale: action.locale };
    case 'settings': return { ...s, settings: { ...s.settings, ...action.patch } };
    case 'choices': return s.act.choices.includes(action.choice) ? s : withAct(s, 'choices', [...s.act.choices, action.choice]);
    case 'tokens': return withAct(s, 'tokens', A.tokensReduce(s.act.tokens, action.a));
    case 'needs': return withAct(s, 'needs', A.needsReduce(s.act.needs, action.a));
    case 'jars': return withAct(s, 'jars', A.jarsReduce(s.act.jars, action.a));
    case 'goal': return withAct(s, 'goal', A.goalReduce(s.act.goal, action.a));
    case 'shop': return withAct(s, 'shop', A.shopReduce(s.act.shop, action.a));
    case 'compare': return withAct(s, 'compare', A.compareReduce(s.act.compare, action.a));
    case 'map': return withAct(s, 'map', A.mapReduce(s.act.map, action.a));
    case 'ledger': return withAct(s, 'ledger', A.ledgerReduce(s.act.ledger, action.a));
    case 'card': return withAct(s, 'card', A.cardReduce(s.act.card, action.a));
    case 'safety': return withAct(s, 'safety', { choice: action.choice });
    case 'help': return withAct(s, 'help', { choice: action.choice });
    case 'habit': return withAct(s, 'habit', { choice: action.choice });
    case 'crossword': {
      const prev = s.act.crossword[action.locale];
      const revealed = action.revealed && !prev.revealed.includes(action.revealed) ? [...prev.revealed, action.revealed] : prev.revealed;
      return withAct(s, 'crossword', { ...s.act.crossword, [action.locale]: { entries: action.entries, revealed } });
    }
    case 'crosswordReset':
      return withAct(s, 'crossword', { ...s.act.crossword, [action.locale]: { entries: {}, revealed: [] } });
    case 'quiz': {
      const next = withAct(s, 'quiz', { ...s.act.quiz, [action.q]: action.answer });
      const correct = QUIZ_ANSWERS[action.q] === action.answer;
      return correct && !next.quizMastered.includes(action.q) ? { ...next, quizMastered: [...next.quizMastered, action.q] } : next;
    }
    case 'resetAll': return { ...createInitialState(s.locale), settings: { ...s.settings } };
    case 'hydrate': return action.state;
  }
}

interface Ctx { state: BookState; dispatch: Dispatch<Action>; storage: StorageStatus }
const BookContext = createContext<Ctx | null>(null);

export function BookProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const loaded = useMemo(() => loadSaved(), []);
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    if (loaded.state) return awardConcepts(loaded.state);
    return createInitialState(initialLocale);
  });
  const storageRef = useRef<StorageStatus>(loaded.status);

  useEffect(() => {
    if (!state.settings.remember) {
      clearSaved();
      return;
    }
    const t = window.setTimeout(() => {
      storageRef.current = writeSaved(state);
    }, 250);
    return () => window.clearTimeout(t);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch, storage: storageRef.current }), [state]);
  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBook() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBook outside BookProvider');
  return ctx;
}
