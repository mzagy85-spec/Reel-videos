import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { neoConfig, neoCopy, neoGuide, neoSources } from '../src/content/neo';
import { pages } from '../src/content/pages';
import { sources } from '../src/content/sources';

const both = (x: { ar: string; en: string }) => x.ar.trim().length > 0 && x.en.trim().length > 0;

describe('neo', () => {
  it('guide lines exist for real pages, in both languages, without product terms', () => {
    for (const [id, line] of Object.entries(neoGuide)) {
      expect(pages.some((p) => p.pageId === id), id).toBe(true);
      expect(both(line!)).toBe(true);
      expect(`${line!.ar} ${line!.en}`).not.toMatch(/\d|KWD|د\.ك|interest|فوائد|افتح|open an account|apply|اطلب/i);
    }
  });
  it('the child-level page 9 panel has no terms and no call to open', () => {
    const kid = [neoCopy.meetTitle, neoCopy.meetText, neoCopy.meetAsk].map((x) => `${x.ar} ${x.en}`).join(' ');
    expect(kid).not.toMatch(/\d|KWD|د\.ك|interest|فوائد|app|تطبيق|open now|افتح/i);
  });
  it('all neo copy is bilingual', () => {
    for (const v of Object.values(neoCopy)) {
      if (Array.isArray(v)) v.forEach((f) => expect(both(f)).toBe(true));
      else if (typeof v === 'object') expect(both(v as { ar: string; en: string })).toBe(true);
    }
  });
  it('product facts match the 2023 presentation and carry a check-current-terms note', () => {
    const facts = neoCopy.facts.map((f) => f.en).join(' | ');
    expect(facts).toContain('aged 0 to 14');
    expect(facts).toContain('10 KWD');
    expect(neoCopy.facts.map((f) => f.ar).join(' ')).toContain('10 د.ك.');
    expect(neoCopy.factsNote.en).toMatch(/check the current terms/);
    expect(neoCopy.optional.en).toMatch(/optional/i);
  });
  it('sources are registered, and the live page is marked as not yet checked', () => {
    for (const id of neoSources) expect(sources.some((s) => s.id === id)).toBe(true);
    expect(sources.find((s) => s.id === 'gb-neo-page')!.reviewed).toBe('pending');
  });
  it('neo artwork is supplied material only (logo, shapes, official character, card animation, card designs)', () => {
    expect(readdirSync('src/assets/neo').sort()).toEqual(['neo-card-blue.webp', 'neo-card-red.webp', 'neo-card-show-still.webp', 'neo-card-show.webp', 'neo-character.webp', 'neo-logo.webp', 'neo-shapes.webp']);
  });
  it('the URL is shown as text, not a live link', () => {
    const src = readFileSync(join('src', 'app', 'Neo.tsx'), 'utf8');
    expect(src).not.toMatch(/<a\s/);
  });
  it('is switched on for this build', () => expect(neoConfig.enabled).toBe(true));
});

import { neoIntro } from '../src/content/neo';
describe('neo animation', () => {
  it('plays once (loop count 1) and has a still frame for reduced motion', () => {
    const buf = readFileSync('src/assets/neo/neo-card-show.webp');
    const i = buf.indexOf('ANIM');
    expect(i).toBeGreaterThan(0);
    expect(buf.readUInt16LE(i + 8 + 4)).toBe(1); // ANIM chunk: background colour (4 bytes) then loop count
    expect(readdirSync('src/assets/neo')).toContain('neo-card-show-still.webp');
  });
});

describe('neo cover introduction', () => {
  it('is bilingual, explains interest in plain words, has a change note and no call to open', () => {
    for (const f of neoIntro.features) expect(both(f.text)).toBe(true);
    expect(both(neoIntro.title) && both(neoIntro.lead) && both(neoIntro.note)).toBe(true);
    expect(neoIntro.features.some((f) => /interest: a small extra amount/.test(f.text.en))).toBe(true);
    expect(neoIntro.note.en).toMatch(/may change/);
    const all = JSON.stringify(neoIntro);
    expect(all).not.toMatch(/open (it )?now|افتح الآن|افتح حساب/i);
  });
  it('facts match the parent information', () => {
    const intro = neoIntro.features.map((f) => f.text.en).join(' ');
    expect(intro).toContain('aged 0 to 14');
    expect(intro).toContain('10 KWD');
    expect(intro).toContain('debit card');
  });
});
