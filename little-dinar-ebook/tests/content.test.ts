import { describe, expect, it } from 'vitest';
import { pages, TOTAL_PAGES } from '../src/content/pages';
import { allCopyGroups, diraya, glossary } from '../src/content/copy';
import { sources } from '../src/content/sources';
import { SCENE_IDS } from '../src/illustrations/scenes';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function walk(v: unknown, path: string, out: string[]) {
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if ('ar' in o && 'en' in o && Object.keys(o).length === 2 && (typeof o.ar === 'string' || o.ar === null)) {
      if (o.ar !== null && (!String(o.ar).trim() || !String(o.en).trim())) out.push(`${path}: empty translation`);
      if (typeof o.ar === 'string' && /[A-Za-z]{3,}/.test(o.ar.replace(/\{\w+\}|Switch to English|English|KWD|OTP|PIN|WCAG/g, ''))) out.push(`${path}: Latin text inside Arabic`);
      if (typeof o.en === 'string' && /[؀-ۿ]/.test(o.en) && !/العربية|التبديل/.test(o.en)) out.push(`${path}: Arabic text inside English`);
      return;
    }
    for (const [k, x] of Object.entries(o)) walk(x, `${path}.${k}`, out);
  }
}

describe('15 shared pages', () => {
  it('exactly 15 pages, numbered 1..15, unique ids', () => {
    expect(TOTAL_PAGES).toBe(15);
    expect(pages.map((p) => p.number)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
    expect(new Set(pages.map((p) => p.pageId)).size).toBe(15);
  });
  it('page 1 is the cover, 9 the map, 14 the crossword, 15 completion', () => {
    expect(pages[0].interaction).toBe('cover');
    expect(pages[8].interaction).toBe('mapPuzzle');
    expect(pages[13].interaction).toBe('crossword');
    expect(pages[14].interaction).toBe('completion');
  });
  it('every page record is complete in both languages', () => {
    const problems: string[] = [];
    for (const p of pages) walk(p, p.pageId, problems);
    expect(problems).toEqual([]);
  });
  it('story text stays short (about 20-40 words; max 45 English words)', () => {
    for (const p of pages) {
      const words = p.story.en.split(/\s+/).length;
      expect(words, p.pageId).toBeLessThanOrEqual(45);
      expect(words, p.pageId).toBeGreaterThanOrEqual(15);
    }
  });
  it('scene ids exist in the illustration set', () => {
    for (const p of pages) expect(SCENE_IDS).toContain(p.scene.id);
  });
  it('fictional amounts are flagged as learning examples', () => {
    for (const id of ['money-plan', 'savings-goal', 'budget-shop', 'compare-change', 'balance', 'card-atm']) {
      expect(pages.find((p) => p.pageId === id)!.learningExamples).toBe(true);
    }
  });
  it('no Eastern Arabic digits and no other currencies in child copy', () => {
    const text = JSON.stringify([pages, allCopyGroups, glossary]);
    expect(text).not.toMatch(/[٠-٩]/);
    expect(text).not.toMatch(/\$|dollar|cent\b|riyal|ريال|دولار/i);
  });
});

describe('all interface copy is bilingual', () => {
  it('no missing or crossed translations', () => {
    const problems: string[] = [];
    walk(allCopyGroups, 'copy', problems);
    for (const g of glossary) walk(g, `glossary.${g.term.en}`, problems);
    for (const s of sources) walk(s.claim, `source.${s.id}`, problems);
    expect(problems).toEqual([]);
  });
});

describe('Diraya attribution', () => {
  it('uses the official names and correct CBK/KBA roles', () => {
    expect(diraya.short.ar).toContain('«لنكن على دراية»');
    expect(diraya.short.en).toContain('Diraya');
    expect(diraya.full.ar).toContain('بإشراف بنك الكويت المركزي');
    expect(diraya.full.ar).toContain('وإدارة اتحاد مصارف الكويت');
    expect(diraya.full.en).toContain('overseen by the Central Bank of Kuwait');
    expect(diraya.full.en).toContain('managed by the Kuwait Banking Association');
    expect(JSON.stringify(diraya)).not.toMatch(/approved|endorsed|معتمد/i);
  });
  it('appears in the cover, page 15 closing info, parent drawer and About', () => {
    const src = (f: string) => readFileSync(join('src', f), 'utf8');
    expect(src('activities/CoverPage.tsx')).toContain('diraya.short');
    expect(src('activities/CompletionPage.tsx')).toContain('diraya.full');
    expect(src('activities/CompletionPage.tsx')).toContain('diraya.cardCredit');
    expect(src('app/ParentDrawer.tsx')).toContain('diraya.full');
    expect(src('app/SettingsDrawer.tsx')).toContain('diraya.short');
    expect(src('activities/SafetyChoice.tsx')).toContain('diraya.safety');
  });
  it('ships no invented campaign artwork', () => {
    const assets = readdirSync('src/assets/brand');
    expect(assets.some((f) => /diraya|cbk|kba/i.test(f))).toBe(false);
  });
});

describe('privacy', () => {
  it('no personal-data fields, trackers or external runtime requests in source', () => {
    const files: string[] = [];
    const scan = (d: string) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) scan(p); else if (/\.(tsx?|css|html)$/.test(f.name)) files.push(p); } };
    scan('src');
    const all = files.map((f) => readFileSync(f, 'utf8')).join('\n') + readFileSync('index.html', 'utf8');
    expect(all).not.toMatch(/type="(email|tel|password)"/);
    expect(all).not.toMatch(/googletagmanager|google-analytics|facebook\.net|fonts\.googleapis|hotjar/i);
    expect(all).not.toMatch(/fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
    expect(all).not.toMatch(/postMessage\([^)]*,\s*['"]\*['"]/);
  });
});
