// Typed content schema. Every child-facing string exists in Arabic and English.
// tests/content.test.ts walks every record and fails on any missing or empty translation.

export type Locale = 'ar' | 'en';
export interface L10n<T = string> { ar: T; en: T }

export type PageId =
  | 'cover'
  | 'money-choices'
  | 'meet-dinar'
  | 'needs-wants'
  | 'money-plan'
  | 'savings-goal'
  | 'budget-shop'
  | 'compare-change'
  | 'bank-map'
  | 'balance'
  | 'card-atm'
  | 'stay-safe'
  | 'help-care'
  | 'crossword'
  | 'my-step';

export type InteractionKind =
  | 'cover'
  | 'moneyChoices'
  | 'moneyTokens'
  | 'needsWants'
  | 'jarPlanner'
  | 'savingsGoal'
  | 'shoppingBudget'
  | 'compareChange'
  | 'mapPuzzle'
  | 'bankLedger'
  | 'cardAtm'
  | 'safetyChoice'
  | 'helpChoice'
  | 'crossword'
  | 'completion';

/** Must match SceneId in src/illustrations/scenes.tsx. */
export type SceneRef =
  | 'waterfront-day' | 'reading-corner' | 'tabletop' | 'school-bag' | 'souq-goal' | 'coop-store'
  | 'compare-shelf' | 'bank-branch' | 'bank-counter' | 'card-atm' | 'message-home' | 'helping-home'
  | 'notebook-desk' | 'waterfront-sunset';

export type ConceptId =
  | 'choices' | 'dinar' | 'needs' | 'plan' | 'goal' | 'budget' | 'compare' | 'map'
  | 'balance' | 'card' | 'safety' | 'helping' | 'crossword' | 'habit';

export type SourceId =
  | 'brand-guide' | 'cbk-banknotes' | 'cbk-coins' | 'gb-phishing' | 'gb-diraya-2025'
  | 'cbk-diraya-2021' | 'diraya-about' | 'cfpb-youth' | 'wcag22';

export interface PageRecord {
  pageId: PageId;
  number: number;
  /** Short contents-drawer label. */
  navLabel: L10n;
  title: L10n;
  /** Main story text: short sentences, roughly 20 to 40 words. */
  story: L10n;
  /** One short activity instruction. */
  instruction: L10n;
  /** Optional "Tell me more" explanation, shown on demand. */
  explain?: L10n;
  scene: { id: SceneRef; alt: L10n };
  interaction: InteractionKind;
  concept: ConceptId;
  /** Set when the page shows fictional prices, balances or goals. */
  learningExamples: boolean;
  /** Narration audio files per locale. null = recording pending (control is hidden, script still shipped). */
  narrationAudio: L10n<string | null>;
  sources: SourceId[];
}

export interface SourceRecord {
  id: SourceId;
  claim: L10n;
  ref: string;
  reviewed: string;
  owner: string;
}
