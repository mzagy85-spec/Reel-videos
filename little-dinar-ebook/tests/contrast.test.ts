import { describe, expect, it } from 'vitest';

// WCAG relative luminance contrast for the brand pairings actually used in the CSS.
function lum(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

describe('contrast of the colour pairings in use', () => {
  const normal: [string, string, string][] = [
    ['headings/links blue on white', '#00248F', '#FFFFFF'],
    ['blue on light blue tint', '#00248F', '#EEF1FA'],
    ['blue on light grey', '#00248F', '#F3F3F3'],
    ['body grey on white', '#5F6264', '#FFFFFF'],
    ['body grey on light grey', '#5F6264', '#F3F3F3'],
    ['story ink on white', '#4A4D4F', '#FFFFFF'],
    ['feedback ink on light grey', '#3F4244', '#F3F3F3'],
    ['white on secondary red buttons', '#FFFFFF', '#CE0000'],
    ['secondary red text on white', '#CE0000', '#FFFFFF'],
    ['white on blue pressed buttons', '#FFFFFF', '#00248F'],
  ];
  for (const [name, fg, bg] of normal) it(`${name} >= 4.5:1`, () => expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5));

  it('white on primary red is only used for large/bold text (>= 3:1) and fails small text', () => {
    expect(ratio('#FFFFFF', '#EF2B2D')).toBeGreaterThanOrEqual(3);
    expect(ratio('#FFFFFF', '#EF2B2D')).toBeLessThan(4.5);
  });
  it('non-text: control borders and focus ring >= 3:1', () => {
    expect(ratio('#00248F', '#FFFFFF')).toBeGreaterThanOrEqual(3);
    expect(ratio('#CE0000', '#FFFFFF')).toBeGreaterThanOrEqual(3);
  });
  it('disabled grey border is decorative only (documented)', () => {
    expect(ratio('#B7B9BC', '#FFFFFF')).toBeLessThan(3);
  });
});
