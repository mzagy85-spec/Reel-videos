// Generates docs that must never drift from the content files:
//   docs/narration-scripts.md  (per-page scripts, transcripts and audio slots, both languages)
//   docs/source-registry.md    (claim, reference, review date, owner)
// Run: npm run scripts:export
import { writeFileSync } from 'node:fs';
import { pages } from '../src/content/pages';
import { sources } from '../src/content/sources';
import { diraya } from '../src/content/copy';

const lines: string[] = [];
lines.push('# Narration scripts and transcripts', '');
lines.push('Generated from `src/content/pages.ts` by `npm run scripts:export`. Do not edit by hand.', '');
lines.push('Status: **recordings pending**. No audio has been recorded or generated. The read-aloud button appears automatically on a page once its file is added to `public/audio/` and its path is set in `narrationAudio` for that page and language.', '');
lines.push('Delivery notes for the voice talent: warm, unhurried, about 120 words per minute in English and a natural Modern Standard Arabic pace for children. Pronounce الكويت، دينار، فلس، ادخار clearly. Read numbers as written amounts (for example "1.000 KWD" as "one dinar", "0.250 KWD" as "two hundred and fifty fils"; "1.000 د.ك." as "دينار واحد", "0.250 د.ك." as "مئتان وخمسون فلسًا").', '');
lines.push('Suggested file names: `public/audio/<pageNumber>-<pageId>-<lang>.mp3` (mono, 48 kHz, -16 LUFS, with an AAC `.m4a` alternative for older WebViews if needed).', '');
for (const p of pages) {
  lines.push(`## Page ${p.number}: ${p.title.en} / ${p.title.ar}`, '');
  lines.push(`Page id: \`${p.pageId}\` · Audio slots: \`audio/${p.number}-${p.pageId}-ar.mp3\` (${p.narrationAudio.ar ? 'supplied' : 'pending'}), \`audio/${p.number}-${p.pageId}-en.mp3\` (${p.narrationAudio.en ? 'supplied' : 'pending'})`, '');
  lines.push('**العربية**', '', `<div dir="rtl" lang="ar">`, '', `${p.title.ar}.`, '', p.story.ar, '', p.instruction.ar, '', `</div>`, '');
  lines.push('**English**', '', `${p.title.en}.`, '', p.story.en, '', p.instruction.en, '');
  if (p.explain) lines.push(`Optional "Tell me more" (not narrated by default): ${p.explain.en} / <span dir="rtl" lang="ar">${p.explain.ar}</span>`, '');
}
lines.push('## Campaign credit (closing information, optional reading for adults)', '', `<div dir="rtl" lang="ar">${diraya.full.ar}</div>`, '', diraya.full.en, '');
writeFileSync('docs/narration-scripts.md', lines.join('\n'));

const s: string[] = ['# Source registry', '', 'Generated from `src/content/sources.ts`. Reader-facing sources are shown in the parent drawer, not in the story text. Recheck mutable claims before release.', '', '| Claim | Reference | Reviewed | Owner |', '|---|---|---|---|'];
for (const x of sources) s.push(`| ${x.claim.en} | ${x.ref} | ${x.reviewed} | ${x.owner} |`);
writeFileSync('docs/source-registry.md', s.join('\n') + '\n');
console.log('wrote docs/narration-scripts.md and docs/source-registry.md');
