import { describe, expect, it } from 'vitest';
import * as A from '../src/lib/activities';

const run = <S, Act>(reduce: (s: S, a: Act) => S, s: S, acts: Act[]) => acts.reduce(reduce, s);

describe('page 3 tokens', () => {
  it('ten 100-fils tokens = 1000 fils, never more than ten', () => {
    const s = run(A.tokensReduce, A.tokensInitial, Array(12).fill({ type: 'add' }));
    expect(s.tray).toBe(10);
    expect(A.tokensTotal(s)).toBe(1000);
    expect(A.tokensComplete(s)).toBe(true);
  });
  it('cannot go below zero; two 50s max', () => {
    const s = run(A.tokensReduce, A.tokensInitial, [{ type: 'remove' }, { type: 'addFifty' }, { type: 'addFifty' }, { type: 'addFifty' }]);
    expect(s.tray).toBe(0);
    expect(s.fifties * A.HALF_TOKEN_VALUE).toBe(100);
  });
  it('reset restores the documented start', () => {
    expect(run(A.tokensReduce, A.tokensInitial, [{ type: 'add' }, { type: 'reset' }])).toEqual(A.tokensInitial);
  });
});

describe('page 4 needs and wants', () => {
  it('scenario answers', () => {
    const s = run(A.needsReduce, A.needsInitial, [
      { type: 'answer', item: 'pencil', answer: 'need' },
      { type: 'answer', item: 'glitterPencil', answer: 'want' },
      { type: 'answer', item: 'water', answer: 'need' },
      { type: 'answer', item: 'toyCar', answer: 'want' },
    ] as A.NeedsAction[]);
    expect(A.needsComplete(s)).toBe(true);
    const wrong = A.needsReduce(A.needsInitial, { type: 'answer', item: 'pencil', answer: 'want' });
    expect(A.needIsCorrect(wrong, 'pencil')).toBe(false);
  });
});

describe('page 5 jars', () => {
  it('conserves 1.000 KWD for every allocation and caps at ten tokens', () => {
    let s = A.jarsInitial;
    const jars: A.JarId[] = ['spend', 'save', 'help'];
    for (let i = 0; i < 40; i++) {
      s = A.jarsReduce(s, { type: i % 3 === 2 ? 'remove' : 'add', jar: jars[(i * 7) % 3] });
      expect(A.jarsTotalWithPool(s)).toBe(1000);
      expect(A.jarsAllocated(s)).toBeLessThanOrEqual(10);
      expect(Math.min(s.spend, s.save, s.help)).toBeGreaterThanOrEqual(0);
    }
  });
  it('sample plan 500/400/100, and zero Help is valid', () => {
    const s = A.jarsReduce(A.jarsInitial, { type: 'sample' });
    expect([s.spend, s.save, s.help].map((n) => n * 100)).toEqual([500, 400, 100]);
    const noHelp = run(A.jarsReduce, A.jarsInitial, Array(10).fill({ type: 'add', jar: 'save' }));
    expect(A.jarsComplete(noHelp)).toBe(true);
    expect(noHelp.help).toBe(0);
  });
});

describe('page 6 savings goal', () => {
  it('10 KWD goal minus 5 KWD at 1 KWD per week = 5 weeks', () => {
    let s = A.goalReduce(A.goalInitial, { type: 'choose', goal: 'book' });
    expect(A.goalWeeksNeeded(s)).toBe(5);
    for (let i = 0; i < 8; i++) s = A.goalReduce(s, { type: 'addWeek' });
    expect(s.weeks).toBe(5);
    expect(s.saved).toBe(10000);
    expect(A.goalReached(s)).toBe(true);
  });
  it('500 fils per week takes ten weeks', () => {
    let s = A.goalReduce(A.goalInitial, { type: 'setWeekly', weekly: 500 });
    expect(A.goalWeeksNeeded(s)).toBe(10);
    for (let i = 0; i < 20; i++) s = A.goalReduce(s, { type: 'addWeek' });
    expect(s.weeks).toBe(10);
  });
  it('zero saving: no division by zero, no progress', () => {
    let s = A.goalReduce(A.goalInitial, { type: 'setWeekly', weekly: 0 });
    expect(A.goalWeeksNeeded(s)).toBeNull();
    s = A.goalReduce(s, { type: 'addWeek' });
    expect(s.saved).toBe(5000);
    expect(s.weeks).toBe(0);
  });
  it('rejects invented weekly amounts', () => {
    expect(A.goalReduce(A.goalInitial, { type: 'setWeekly', weekly: 333 }).weekly).toBe(1000);
  });
});

describe('page 7 shopping', () => {
  it('required items 350 + 250 = 600, leaving 400', () => {
    let s = run(A.shopReduce, A.shopInitial, [{ type: 'toggle', item: 'notebook' }, { type: 'toggle', item: 'pencil' }] as A.ShopAction[]);
    expect(A.shopTotal(s)).toBe(600);
    s = A.shopReduce(s, { type: 'pay' });
    expect(s.wallet).toBe(400);
    expect(s.paid).toBe(true);
    const again = A.shopReduce(s, { type: 'pay' });
    expect(again.wallet).toBe(400); // no double spending
  });
  it('adding stickers makes 1.100 and is 100 fils over; payment is blocked', () => {
    let s = run(A.shopReduce, A.shopInitial, [{ type: 'toggle', item: 'notebook' }, { type: 'toggle', item: 'pencil' }, { type: 'toggle', item: 'stickers' }] as A.ShopAction[]);
    expect(A.shopTotal(s)).toBe(1100);
    expect(A.shopOverBy(s)).toBe(100);
    s = A.shopReduce(s, { type: 'pay' });
    expect(s.paid).toBe(false);
    expect(s.wallet).toBe(1000);
    s = A.shopReduce(s, { type: 'toggle', item: 'stickers' });
    expect(A.shopCanPay(s)).toBe(true);
  });
  it('cannot pay without the required items', () => {
    const s = A.shopReduce(A.shopReduce(A.shopInitial, { type: 'toggle', item: 'stickers' }), { type: 'pay' });
    expect(s.paid).toBe(false);
  });
});

describe('page 8 compare', () => {
  it('B at 0.750 from 1.000 leaves 0.250', () => {
    expect(A.correctChange()).toBe(250);
    let s = A.compareReduce(A.compareInitial, { type: 'choose', item: 'B' });
    s = A.compareReduce(s, { type: 'change', amount: 250 });
    expect(A.compareComplete(s)).toBe(true);
  });
  it('change only after choosing B and only from offered tokens', () => {
    expect(A.compareReduce(A.compareInitial, { type: 'change', amount: 250 }).change).toBeNull();
    const b = A.compareReduce(A.compareInitial, { type: 'choose', item: 'B' });
    expect(A.compareReduce(b, { type: 'change', amount: 999 }).change).toBeNull();
  });
});

describe('page 9 map', () => {
  it('each piece fits only its own slot; wrong placement keeps progress', () => {
    let s = A.mapReduce(A.mapInitial, { type: 'place', piece: 'bank', slot: 'bank' });
    s = A.mapReduce(s, { type: 'place', piece: 'home', slot: 'coop' });
    expect(s.placed).toEqual(['bank']);
    for (const p of A.MAP_PIECES) s = A.mapReduce(s, { type: 'place', piece: p, slot: p });
    expect(A.mapAssembled(s)).toBe(true);
    expect(s.placed.length).toBe(6);
  });
  it('auto place, skip and missions', () => {
    let s = A.mapReduce(A.mapInitial, { type: 'autoPlace' });
    expect(s.placed.length).toBe(1);
    expect(A.missionsUnlocked(s)).toBe(false);
    s = A.mapReduce(s, { type: 'skip' });
    expect(A.missionsUnlocked(s)).toBe(true);
    for (const m of A.MISSIONS) s = A.mapReduce(s, { type: 'match', mission: m.id, place: m.place });
    expect(A.missionsComplete(s)).toBe(true);
    s = A.mapReduce(s, { type: 'match', mission: 'deposit', place: 'park' });
    expect(A.missionsComplete(s)).toBe(false);
  });
});

describe('page 10 ledger', () => {
  it('deposit then withdraw keeps 5.000 total', () => {
    let s = A.ledgerInitial;
    expect(A.ledgerTotal(s)).toBe(5000);
    s = A.ledgerReduce(s, { type: 'deposit', expectId: s.nextId });
    expect([s.wallet, s.account]).toEqual([1000, 4000]);
    s = A.ledgerReduce(s, { type: 'withdraw', expectId: s.nextId });
    expect([s.wallet, s.account]).toEqual([2000, 3000]);
    expect(A.ledgerTotal(s)).toBe(5000);
    expect(A.ledgerComplete(s)).toBe(true);
  });
  it('ignores a stale double tap and never goes negative', () => {
    let s = A.ledgerInitial;
    const id = s.nextId;
    s = A.ledgerReduce(s, { type: 'deposit', expectId: id });
    s = A.ledgerReduce(s, { type: 'deposit', expectId: id });
    expect(s.wallet).toBe(1000);
    for (let i = 0; i < 10; i++) {
      s = A.ledgerReduce(s, { type: 'deposit', expectId: s.nextId });
      expect(s.wallet).toBeGreaterThanOrEqual(0);
      expect(A.ledgerTotal(s)).toBe(5000);
    }
    for (let i = 0; i < 10; i++) {
      s = A.ledgerReduce(s, { type: 'withdraw', expectId: s.nextId });
      expect(s.account).toBeGreaterThanOrEqual(0);
      expect(A.ledgerTotal(s)).toBe(5000);
    }
    expect(A.ledgerReduce(s, { type: 'reset' })).toEqual(A.ledgerInitial);
  });
});

describe('page 11 card and ATM', () => {
  it('debit 3.000 - 1.000 = 2.000 once; ATM 10.000 -> 5.000 + 5.000 cash; separate', () => {
    let s = A.cardReduce(A.cardInitial, { type: 'pay' });
    s = A.cardReduce(s, { type: 'pay' });
    expect(s.balance).toBe(2000);
    expect(s.atmAccount).toBe(10000);
    s = A.cardReduce(s, { type: 'atm' });
    s = A.cardReduce(s, { type: 'atm' });
    expect([s.atmAccount, s.atmCash]).toEqual([5000, 5000]);
    expect(s.atmAccount + s.atmCash).toBe(10000);
    expect(s.balance).toBe(2000);
  });
});
