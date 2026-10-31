// Pure, locale-independent activity state and transitions.
// Every transition is guarded so the UI can never create negative balances,
// duplicate transactions or money from nowhere. Amounts are integer fils.

import { add, subtract, sum, stepsToReach, type Fils } from './money';

/* ---------- Page 3: meet the dinar ---------- */
export const TOKEN_VALUE: Fils = 100;
export const TOKENS_IN_DINAR = 10;
export const HALF_TOKEN_VALUE: Fils = 50;

export interface TokensState { tray: number; fifties: number }
export const tokensInitial: TokensState = { tray: 0, fifties: 0 };
export type TokensAction = { type: 'add' } | { type: 'remove' } | { type: 'reset' } | { type: 'addFifty' } | { type: 'removeFifty' };

export function tokensReduce(s: TokensState, a: TokensAction): TokensState {
  switch (a.type) {
    case 'add': return s.tray >= TOKENS_IN_DINAR ? s : { ...s, tray: s.tray + 1 };
    case 'remove': return s.tray <= 0 ? s : { ...s, tray: s.tray - 1 };
    case 'addFifty': return s.fifties >= 2 ? s : { ...s, fifties: s.fifties + 1 };
    case 'removeFifty': return s.fifties <= 0 ? s : { ...s, fifties: s.fifties - 1 };
    case 'reset': return tokensInitial;
  }
}
export const tokensTotal = (s: TokensState): Fils => s.tray * TOKEN_VALUE;
export const tokensComplete = (s: TokensState) => tokensTotal(s) === 1000;

/* ---------- Page 4: needs and wants ---------- */
export type NeedItemId = 'pencil' | 'glitterPencil' | 'water' | 'toyCar';
export type NeedAnswer = 'need' | 'want';
export const NEED_ITEMS: { id: NeedItemId; answer: NeedAnswer }[] = [
  { id: 'pencil', answer: 'need' },
  { id: 'glitterPencil', answer: 'want' },
  { id: 'water', answer: 'need' },
  { id: 'toyCar', answer: 'want' },
];
export interface NeedsState { answers: Partial<Record<NeedItemId, NeedAnswer>> }
export const needsInitial: NeedsState = { answers: {} };
export type NeedsAction = { type: 'answer'; item: NeedItemId; answer: NeedAnswer } | { type: 'reset' };
export function needsReduce(s: NeedsState, a: NeedsAction): NeedsState {
  if (a.type === 'reset') return needsInitial;
  if (!NEED_ITEMS.some((i) => i.id === a.item)) return s;
  return { answers: { ...s.answers, [a.item]: a.answer } };
}
export const needIsCorrect = (s: NeedsState, id: NeedItemId) =>
  s.answers[id] !== undefined && s.answers[id] === NEED_ITEMS.find((i) => i.id === id)!.answer;
export const needsComplete = (s: NeedsState) => NEED_ITEMS.every((i) => needIsCorrect(s, i.id));

/* ---------- Page 5: jars ---------- */
export type JarId = 'spend' | 'save' | 'help';
export const JAR_IDS: JarId[] = ['spend', 'save', 'help'];
export interface JarsState { spend: number; save: number; help: number }
export const jarsInitial: JarsState = { spend: 0, save: 0, help: 0 };
export const JAR_SAMPLE: JarsState = { spend: 5, save: 4, help: 1 };
export type JarsAction = { type: 'add'; jar: JarId } | { type: 'remove'; jar: JarId } | { type: 'sample' } | { type: 'reset' };
export const jarsAllocated = (s: JarsState) => s.spend + s.save + s.help;
export const jarsUnallocated = (s: JarsState) => TOKENS_IN_DINAR - jarsAllocated(s);
export function jarsReduce(s: JarsState, a: JarsAction): JarsState {
  switch (a.type) {
    case 'add': return jarsUnallocated(s) <= 0 ? s : { ...s, [a.jar]: s[a.jar] + 1 };
    case 'remove': return s[a.jar] <= 0 ? s : { ...s, [a.jar]: s[a.jar] - 1 };
    case 'sample': return JAR_SAMPLE;
    case 'reset': return jarsInitial;
  }
}
/** Conservation: jars plus the unallocated pool always equal 1000 fils. */
export const jarsTotalWithPool = (s: JarsState): Fils =>
  sum([s.spend, s.save, s.help, jarsUnallocated(s)].map((n) => n * TOKEN_VALUE));
export const jarsComplete = (s: JarsState) => jarsUnallocated(s) === 0;

/* ---------- Page 6: savings goal ---------- */
export type GoalId = 'book' | 'art' | 'ball';
export const GOAL_PRICE: Fils = 10_000;
export const GOAL_START: Fils = 5_000;
export const WEEKLY_OPTIONS: Fils[] = [1_000, 500, 0];
export interface GoalState { goal: GoalId | null; saved: Fils; weekly: Fils; weeks: number }
export const goalInitial: GoalState = { goal: null, saved: GOAL_START, weekly: 1_000, weeks: 0 };
export type GoalAction = { type: 'choose'; goal: GoalId } | { type: 'setWeekly'; weekly: Fils } | { type: 'addWeek' } | { type: 'reset' };
export function goalReduce(s: GoalState, a: GoalAction): GoalState {
  switch (a.type) {
    case 'choose': return { ...s, goal: a.goal };
    case 'setWeekly':
      if (!WEEKLY_OPTIONS.includes(a.weekly)) return s;
      // Changing the weekly plan restarts the simulation from the same starting balance.
      return { ...s, weekly: a.weekly, saved: GOAL_START, weeks: 0 };
    case 'addWeek': {
      if (s.weekly <= 0 || s.saved >= GOAL_PRICE) return s;
      const next = Math.min(add(s.saved, s.weekly), GOAL_PRICE);
      return { ...s, saved: next, weeks: s.weeks + 1 };
    }
    case 'reset': return { ...goalInitial, goal: s.goal };
  }
}
export const goalRemaining = (s: GoalState): Fils => Math.max(0, subtract(GOAL_PRICE, s.saved));
export const goalWeeksNeeded = (s: GoalState) => stepsToReach(subtract(GOAL_PRICE, GOAL_START), s.weekly);
export const goalReached = (s: GoalState) => s.saved >= GOAL_PRICE;

/* ---------- Page 7: shopping budget ---------- */
export type ShopItemId = 'notebook' | 'pencil' | 'stickers';
export const SHOP_WALLET: Fils = 1_000;
export const SHOP_ITEMS: { id: ShopItemId; price: Fils; required: boolean }[] = [
  { id: 'notebook', price: 350, required: true },
  { id: 'pencil', price: 250, required: true },
  { id: 'stickers', price: 500, required: false },
];
export interface ShopState { basket: Record<ShopItemId, boolean>; paid: boolean; wallet: Fils; paidTotal: Fils }
export const shopInitial: ShopState = { basket: { notebook: false, pencil: false, stickers: false }, paid: false, wallet: SHOP_WALLET, paidTotal: 0 };
export type ShopAction = { type: 'toggle'; item: ShopItemId } | { type: 'pay' } | { type: 'reset' };
export const shopTotal = (s: ShopState): Fils => sum(SHOP_ITEMS.filter((i) => s.basket[i.id]).map((i) => i.price));
export const shopOverBy = (s: ShopState): Fils => Math.max(0, subtract(shopTotal(s), s.wallet));
export const shopHasRequired = (s: ShopState) => SHOP_ITEMS.filter((i) => i.required).every((i) => s.basket[i.id]);
export const shopCanPay = (s: ShopState) => !s.paid && shopHasRequired(s) && shopTotal(s) <= s.wallet;
export function shopReduce(s: ShopState, a: ShopAction): ShopState {
  switch (a.type) {
    case 'toggle': return s.paid ? s : { ...s, basket: { ...s.basket, [a.item]: !s.basket[a.item] } };
    case 'pay': {
      if (!shopCanPay(s)) return s;
      const total = shopTotal(s);
      return { ...s, paid: true, paidTotal: total, wallet: subtract(s.wallet, total) };
    }
    case 'reset': return shopInitial;
  }
}

/* ---------- Page 8: compare and check change ---------- */
export const COMPARE_A: Fils = 1_000;
export const COMPARE_B: Fils = 750;
export const COMPARE_PAID: Fils = 1_000;
export const CHANGE_OPTIONS: Fils[] = [150, 250, 350];
export interface CompareState { choice: 'A' | 'B' | null; change: Fils | null }
export const compareInitial: CompareState = { choice: null, change: null };
export type CompareAction = { type: 'choose'; item: 'A' | 'B' } | { type: 'change'; amount: Fils } | { type: 'reset' };
export const correctChange = (): Fils => subtract(COMPARE_PAID, COMPARE_B);
export function compareReduce(s: CompareState, a: CompareAction): CompareState {
  switch (a.type) {
    case 'choose': return { choice: a.item, change: null };
    case 'change': return s.choice !== 'B' || !CHANGE_OPTIONS.includes(a.amount) ? s : { ...s, change: a.amount };
    case 'reset': return compareInitial;
  }
}
export const compareComplete = (s: CompareState) => s.choice === 'B' && s.change === correctChange();

/* ---------- Page 9: money journey map ---------- */
export type MapRegion = 'towers' | 'waterfront' | 'park' | 'home' | 'coop' | 'bank';
export const MAP_PIECES: MapRegion[] = ['towers', 'waterfront', 'park', 'home', 'coop', 'bank'];
export type MissionId = 'planGoal' | 'comparePrices' | 'deposit';
export const MISSIONS: { id: MissionId; place: MapRegion }[] = [
  { id: 'planGoal', place: 'home' },
  { id: 'comparePrices', place: 'coop' },
  { id: 'deposit', place: 'bank' },
];
export type HotspotId = 'account' | 'balance' | 'payment';
export interface MapState {
  placed: MapRegion[];
  skipped: boolean;
  missions: Partial<Record<MissionId, MapRegion>>;
  hotspots: HotspotId[];
}
export const mapInitial: MapState = { placed: [], skipped: false, missions: {}, hotspots: [] };
export type MapAction =
  | { type: 'place'; piece: MapRegion; slot: MapRegion }
  | { type: 'autoPlace' }
  | { type: 'skip' }
  | { type: 'match'; mission: MissionId; place: MapRegion }
  | { type: 'hotspot'; id: HotspotId }
  | { type: 'reset' };
export function mapReduce(s: MapState, a: MapAction): MapState {
  switch (a.type) {
    case 'place':
      // Pieces only snap into their own slot; a wrong slot leaves state untouched.
      if (a.piece !== a.slot || s.placed.includes(a.piece)) return s;
      return { ...s, placed: [...s.placed, a.piece] };
    case 'autoPlace': {
      const next = MAP_PIECES.find((p) => !s.placed.includes(p));
      return next ? { ...s, placed: [...s.placed, next] } : s;
    }
    case 'skip': return { ...s, skipped: true };
    case 'match': return { ...s, missions: { ...s.missions, [a.mission]: a.place } };
    case 'hotspot': return s.hotspots.includes(a.id) ? s : { ...s, hotspots: [...s.hotspots, a.id] };
    case 'reset': return mapInitial;
  }
}
export const mapAssembled = (s: MapState) => MAP_PIECES.every((p) => s.placed.includes(p));
export const missionsUnlocked = (s: MapState) => mapAssembled(s) || s.skipped;
export const missionCorrect = (s: MapState, id: MissionId) => s.missions[id] === MISSIONS.find((m) => m.id === id)!.place;
export const missionsComplete = (s: MapState) => MISSIONS.every((m) => missionCorrect(s, m.id));

/* ---------- Page 10: deposit, withdraw, balance ---------- */
export const LEDGER_STEP: Fils = 1_000;
export const LEDGER_START = { wallet: 2_000 as Fils, account: 3_000 as Fils };
export interface LedgerEntry { id: number; kind: 'deposit' | 'withdraw'; amount: Fils; wallet: Fils; account: Fils }
export interface LedgerState { wallet: Fils; account: Fils; history: LedgerEntry[]; nextId: number }
export const ledgerInitial: LedgerState = { ...LEDGER_START, history: [], nextId: 1 };
/** `expectId` must equal state.nextId; a stale double-tap carries an old id and is ignored. */
export type LedgerAction = { type: 'deposit'; expectId: number } | { type: 'withdraw'; expectId: number } | { type: 'reset' };
export function ledgerReduce(s: LedgerState, a: LedgerAction): LedgerState {
  if (a.type === 'reset') return ledgerInitial;
  if (a.expectId !== s.nextId) return s;
  if (a.type === 'deposit') {
    if (s.wallet < LEDGER_STEP) return s;
    const wallet = subtract(s.wallet, LEDGER_STEP);
    const account = add(s.account, LEDGER_STEP);
    return { wallet, account, nextId: s.nextId + 1, history: [...s.history, { id: s.nextId, kind: 'deposit' as const, amount: LEDGER_STEP, wallet, account }].slice(-6) };
  }
  if (s.account < LEDGER_STEP) return s;
  const wallet = add(s.wallet, LEDGER_STEP);
  const account = subtract(s.account, LEDGER_STEP);
  return { wallet, account, nextId: s.nextId + 1, history: [...s.history, { id: s.nextId, kind: 'withdraw' as const, amount: LEDGER_STEP, wallet, account }].slice(-6) };
}
export const ledgerTotal = (s: LedgerState): Fils => add(s.wallet, s.account);
export const ledgerComplete = (s: LedgerState) =>
  s.history.some((h) => h.kind === 'deposit') && s.history.some((h) => h.kind === 'withdraw');

/* ---------- Page 11: card and ATM (two separate examples) ---------- */
export const CARD_START: Fils = 3_000;
export const CARD_PRICE: Fils = 1_000;
export const ATM_START: Fils = 10_000;
export const ATM_AMOUNT: Fils = 5_000;
export interface CardState { balance: Fils; paid: boolean; atmAccount: Fils; atmCash: Fils; atmDone: boolean }
export const cardInitial: CardState = { balance: CARD_START, paid: false, atmAccount: ATM_START, atmCash: 0, atmDone: false };
export type CardAction = { type: 'pay' } | { type: 'atm' } | { type: 'reset' };
export function cardReduce(s: CardState, a: CardAction): CardState {
  switch (a.type) {
    case 'pay':
      if (s.paid || s.balance < CARD_PRICE) return s;
      return { ...s, paid: true, balance: subtract(s.balance, CARD_PRICE) };
    case 'atm':
      if (s.atmDone || s.atmAccount < ATM_AMOUNT) return s;
      return { ...s, atmDone: true, atmAccount: subtract(s.atmAccount, ATM_AMOUNT), atmCash: add(s.atmCash, ATM_AMOUNT) };
    case 'reset': return cardInitial;
  }
}

/* ---------- Page 12: safety ---------- */
export type SafetyChoice = 'shareCode' | 'tapLink' | 'stopAndTell';
export interface SafetyState { choice: SafetyChoice | null }
export const safetyInitial: SafetyState = { choice: null };

/* ---------- Page 13: help ---------- */
export type HelpChoice = 'repair' | 'shareBook' | 'helpFamily';
export interface HelpState { choice: HelpChoice | null }
export const helpInitial: HelpState = { choice: null };

/* ---------- Page 15: habit ---------- */
export type HabitChoice = 'setGoal' | 'saveSmall' | 'reviewPurchases';
export interface HabitState { choice: HabitChoice | null }
export const habitInitial: HabitState = { choice: null };
