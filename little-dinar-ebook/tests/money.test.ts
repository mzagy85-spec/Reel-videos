import { describe, expect, it } from 'vitest';
import { add, formatFils, formatKwd, formatKwdNumber, kwd, stepsToReach, subtract, sum, assertFils } from '../src/lib/money';

describe('money (integer fils)', () => {
  it('1 KWD = 1000 fils', () => expect(kwd(1)).toBe(1000));
  it('formats three decimals without floats', () => {
    expect(formatKwdNumber(1000)).toBe('1.000');
    expect(formatKwdNumber(750)).toBe('0.750');
    expect(formatKwdNumber(250)).toBe('0.250');
    expect(formatKwdNumber(10000)).toBe('10.000');
    expect(formatKwdNumber(1100)).toBe('1.100');
    expect(formatKwdNumber(5)).toBe('0.005');
  });
  it('formats both locales with Western digits', () => {
    expect(formatKwd(5000, 'en')).toBe('5.000 KWD');
    expect(formatKwd(5000, 'ar')).toBe('5.000 د.ك.');
    expect(formatFils(1000, 'en')).toBe('1,000 fils');
    expect(formatFils(250, 'ar')).toBe('250 فلس');
    expect(formatKwd(1234, 'ar')).not.toMatch(/[٠-٩]/);
  });
  it('rejects non-integer money', () => {
    expect(() => assertFils(0.1)).toThrow();
    expect(() => add(0.1 as number, 0.2 as number)).toThrow();
  });
  it('arithmetic examples from the brief', () => {
    expect(sum(Array(10).fill(100))).toBe(1000);
    expect(add(350, 250)).toBe(600);
    expect(subtract(1000, 600)).toBe(400);
    expect(subtract(add(600, 500), 1000)).toBe(100);
    expect(subtract(1000, 750)).toBe(250);
    expect(subtract(3000, 1000)).toBe(2000);
    expect(add(3000, 1000)).toBe(4000);
  });
  it('steps to reach a goal, with zero handled', () => {
    expect(stepsToReach(5000, 1000)).toBe(5);
    expect(stepsToReach(5000, 500)).toBe(10);
    expect(stepsToReach(5000, 0)).toBeNull();
    expect(stepsToReach(0, 0)).toBe(0);
  });
});
