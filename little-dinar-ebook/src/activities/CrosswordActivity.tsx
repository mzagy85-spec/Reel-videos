import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { crossword as c } from '../content/copy';
import { crosswords, type CrosswordWord } from '../content/crossword';
import { buildGrid, cellKey, clearWord, fillWord, isWordSolved, normalizeLetter, normalizeWord, revealOne, solvedWords, wordCells } from '../lib/crossword';
import { Feedback, ResetButton } from './shared';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';
import { RecapQuiz } from './RecapQuiz';

type Mode = 'bank' | 'letters' | 'list';

const ARABIC_LETTER = /^[ء-غف-ي]$/;
const LATIN_LETTER = /^[A-Za-z]$/;

export function CrosswordPage(props: ActivityProps) {
  return (
    <>
      <CrosswordActivity {...props} />
      <RecapQuiz />
    </>
  );
}

export function CrosswordActivity(_: ActivityProps) {
  const { t, locale, dir } = useT();
  const { state, dispatch } = useBook();
  const puzzle = crosswords[locale];
  const grid = useMemo(() => buildGrid(puzzle), [puzzle]);
  const cw = state.act.crossword[locale];
  const entries = cw.entries;
  const solved = solvedWords(puzzle, entries);
  const fx = state.settings.effects;
  const [mode, setMode] = useState<Mode>('bank');
  // Selection is per language so switching back restores the same clue.
  const [selectedByLocale, setSelectedByLocale] = useState<Record<string, string>>({});
  const selectedId = selectedByLocale[locale] ?? puzzle.words.find((w) => !solved.includes(w.id))?.id ?? puzzle.words[0].id;
  const selected = puzzle.words.find((w) => w.id === selectedId)!;
  const [msg, setMsg] = useState<{ tone: 'good' | 'try' | 'info'; text: string } | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const numberOf = (w: CrosswordWord) => grid.get(cellKey(w.row, w.col))!.number!;
  const dirLabel = (w: CrosswordWord) => t(w.dir === 'across' ? c.across : c.down);
  const select = (id: string) => setSelectedByLocale((m) => ({ ...m, [locale]: id }));

  const commit = (next: Record<string, string>, revealed?: string) => {
    const before = new Set(solvedWords(puzzle, entries));
    dispatch({ type: 'crossword', locale, entries: next, revealed });
    const newly = puzzle.words.filter((w) => !before.has(w.id) && isWordSolved(puzzle, next, w.id));
    if (newly.length) {
      const w = newly[newly.length - 1];
      const all = solvedWords(puzzle, next).length === puzzle.words.length;
      setMsg({ tone: 'good', text: `${t(c.solved, { word: w.answer, meaning: w.meaning })}${all ? ` ${t(c.allDone)}` : ''}` });
      playEffect(all ? 'success' : 'place', fx);
      const nextWord = puzzle.words.find((x) => !isWordSolved(puzzle, next, x.id));
      if (nextWord && mode !== 'letters') select(nextWord.id);
    }
  };

  const chooseFromBank = (answer: string) => {
    const got = Array.from(answer).length;
    const need = Array.from(selected.answer).length;
    if (got !== need) {
      setMsg({ tone: 'try', text: t(c.lengthWrong, { got, need }) });
      playEffect('gentle', fx);
      return;
    }
    if (normalizeWord(answer, locale) !== normalizeWord(selected.answer, locale)) {
      setMsg({ tone: 'try', text: t(c.notThis, { clue: selected.clue }) });
      playEffect('gentle', fx);
      return;
    }
    commit(fillWord(puzzle, entries, selected.id));
  };

  // Letter entry. Movement follows the logical order of the selected answer, so RTL needs no reversal.
  const cellsOf = (w: CrosswordWord) => wordCells(w).map((x) => cellKey(x.row, x.col));
  const focusCell = (k: string | undefined) => { if (k) inputs.current[k]?.focus(); };
  // Clicking a clue selects it first and focuses its first square on the next frame, so the focus handler
  // sees the new selection and does not switch to the crossing word.
  const focusAfterRender = (k: string) => requestAnimationFrame(() => requestAnimationFrame(() => focusCell(k)));
  const onLetter = (k: string, raw: string) => {
    const ch = Array.from(raw.replace(/[ً-ٰٟـ]/g, '')).pop() ?? '';
    if (!ch) return;
    const ok = locale === 'en' ? LATIN_LETTER.test(ch) : ARABIC_LETTER.test(normalizeLetter(ch, 'ar'));
    if (!ok) return; // e.g. Arabic letters never enter the English grid
    const letter = locale === 'en' ? ch.toUpperCase() : normalizeLetter(ch, 'ar');
    commit({ ...entries, [k]: letter });
    const keys = cellsOf(selected);
    const i = keys.indexOf(k);
    if (i >= 0 && i < keys.length - 1) focusCell(keys[i + 1]);
  };
  const onKey = (k: string, row: number, col: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    const keys = cellsOf(selected);
    const i = keys.indexOf(k);
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (entries[k]) { const next = { ...entries }; delete next[k]; commit(next); }
      else if (i > 0) { const prev = keys[i - 1]; const next = { ...entries }; delete next[prev]; commit(next); focusCell(prev); }
      return;
    }
    const logicalStep: Record<string, [number, number]> = {
      ArrowUp: [-1, 0], ArrowDown: [1, 0],
      ArrowRight: [0, dir === 'rtl' ? -1 : 1], ArrowLeft: [0, dir === 'rtl' ? 1 : -1],
    };
    const step = logicalStep[e.key];
    if (step) {
      e.preventDefault();
      let r = row + step[0], cc = col + step[1];
      while (r >= 0 && r < puzzle.height && cc >= 0 && cc < puzzle.width) {
        const nk = cellKey(r, cc);
        if (grid.has(nk)) {
          const cell = grid.get(nk)!;
          if (!cell.words.includes(selected.id)) {
            const w = puzzle.words.find((x) => cell.words.includes(x.id) && x.dir === (step[0] !== 0 ? 'down' : 'across')) ?? puzzle.words.find((x) => cell.words.includes(x.id));
            if (w) select(w.id);
          }
          focusCell(nk);
          return;
        }
        r += step[0]; cc += step[1];
      }
    }
  };
  const onCellFocus = (k: string) => {
    const cell = grid.get(k)!;
    if (!cell.words.includes(selected.id)) select(cell.words[0]);
  };
  const onCellClick = (k: string) => {
    const cell = grid.get(k)!;
    if (cell.words.length > 1 && cell.words.includes(selected.id)) {
      select(cell.words.find((id) => id !== selected.id)!);
    } else if (!cell.words.includes(selected.id)) {
      select(cell.words[0]);
    }
  };

  const selectedCells = new Set(cellsOf(selected));
  const bank = useMemo(() => [...puzzle.words].sort((a, b) => a.id.localeCompare(b.id)).map((w) => w.answer), [puzzle]);
  const len = (w: CrosswordWord) => Array.from(w.answer).length;

  return (
    <div className="crossword-activity">
      <fieldset className="xw-mode">
        <legend className="visually-hidden">{t(c.modeLabel)}</legend>
        <div className="seg">
          {(['bank', 'letters', 'list'] as Mode[]).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              <Icon name={m === 'bank' ? 'grid' : m === 'letters' ? 'book' : 'list'} size={18} />
              {t(m === 'bank' ? c.modeBank : m === 'letters' ? c.modeLetters : c.modeList)}
            </button>
          ))}
        </div>
      </fieldset>

      {mode !== 'list' ? (
        <div className="xw-layout">
          <div className="xw-board-wrap">
            <div
              className={`xw-grid ${mode === 'letters' ? 'is-typing' : ''}`}
              dir={dir}
              lang={locale}
              style={{ gridTemplateColumns: `repeat(${puzzle.width}, var(--xw-cell))`, gridTemplateRows: `repeat(${puzzle.height}, var(--xw-cell))` }}
            >
              {[...grid.values()].map((cell) => {
                const k = cellKey(cell.row, cell.col);
                const w = puzzle.words.find((x) => x.id === cell.words[0])!;
                const pos = cellsOf(w).indexOf(k) + 1;
                const inSel = selectedCells.has(k);
                const isSolvedCell = cell.words.some((id) => solved.includes(id));
                return (
                  <div key={k} className={`xw-cell ${inSel ? 'in-selection' : ''} ${isSolvedCell ? 'is-solved' : ''} ${cw.revealed.includes(k) ? 'was-revealed' : ''}`} style={{ gridColumn: cell.col + 1, gridRow: cell.row + 1 }}>
                    {cell.number ? <span className="xw-num" aria-hidden="true">{cell.number}</span> : null}
                    <input
                      ref={(el) => { inputs.current[k] = el; }}
                      className="xw-input"
                      value={entries[k] ?? ''}
                      readOnly={mode !== 'letters'}
                      inputMode={mode === 'letters' ? 'text' : 'none'}
                      autoComplete="off"
                      autoCapitalize={locale === 'en' ? 'characters' : 'off'}
                      spellCheck={false}
                      maxLength={2}
                      lang={locale}
                      aria-label={t(c.cellLabel, { n: numberOf(w), dir: dirLabel(w), i: pos, len: len(w) })}
                      onFocus={() => onCellFocus(k)}
                      onClick={() => onCellClick(k)}
                      onChange={(e) => onLetter(k, e.target.value)}
                      onKeyDown={mode === 'letters' ? onKey(k, cell.row, cell.col) : undefined}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xw-side">
            <p className="xw-current" aria-live="polite">
              <strong>{numberOf(selected)} {dirLabel(selected)}:</strong> {selected.clue} <span className="muted">({len(selected)})</span>
            </p>
            {mode === 'bank' ? (
              <div className="word-bank" role="group" aria-label={t(c.wordBank)}>
                {bank.map((ans) => {
                  const used = puzzle.words.some((w) => w.answer === ans && solved.includes(w.id));
                  return (
                    <button key={ans} type="button" className={`word-chip ${used ? 'is-used' : ''}`} disabled={used} onClick={() => chooseFromBank(ans)} lang={locale}>
                      {ans}{used ? <span className="visually-hidden"> ({t(c.wordUsed)})</span> : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="muted small">{t(c.letterInputHint)}</p>
            )}
            <div className="btn-row">
              <button type="button" className="btn btn-small" disabled={solved.includes(selected.id)} onClick={() => { const r = revealOne(puzzle, entries, selected.id); if (r.key) { commit(r.entries, r.key); setMsg((m) => m?.tone === 'good' ? m : { tone: 'info', text: t(c.hintDone) }); } }}>
                <Icon name="bulb" size={18} />{t(c.hint)}
              </button>
              <button type="button" className="btn btn-small btn-quiet" onClick={() => dispatch({ type: 'crossword', locale, entries: clearWord(puzzle, entries, selected.id) })}>{t(c.clear)}</button>
            </div>
            <ClueList puzzle={puzzle} selectedId={selected.id} solved={solved} onSelect={(id) => { select(id); if (mode === 'letters') { const w = puzzle.words.find((x) => x.id === id)!; focusAfterRender(cellKey(w.row, w.col)); } }} numberOf={numberOf} />
          </div>
        </div>
      ) : (
        <ListMode puzzle={puzzle} entries={entries} solved={solved} numberOf={numberOf} onChoose={(w, ans) => {
          if (normalizeWord(ans, locale) === normalizeWord(w.answer, locale)) commit(fillWord(puzzle, entries, w.id));
          else { setMsg({ tone: 'try', text: t(c.notThis, { clue: w.clue }) }); playEffect('gentle', fx); }
        }} bank={bank} />
      )}

      <p className="muted small">{t(c.progress, { n: solved.length })}</p>
      <Feedback tone={msg?.tone ?? 'info'}>{msg?.text}</Feedback>
      <ResetButton label={t(c.resetGrid)} onClick={() => { dispatch({ type: 'crosswordReset', locale }); setMsg(null); }} />
    </div>
  );
}

function ClueList({ puzzle, selectedId, solved, onSelect, numberOf }: { puzzle: typeof crosswords.en; selectedId: string; solved: string[]; onSelect: (id: string) => void; numberOf: (w: CrosswordWord) => number }) {
  const { t } = useT();
  return (
    <div className="clues">
      {(['across', 'down'] as const).map((d) => (
        <div key={d}>
          <h3>{t(d === 'across' ? c.across : c.down)}</h3>
          <ul role="list">
            {puzzle.words.filter((w) => w.dir === d).sort((a, b) => numberOf(a) - numberOf(b)).map((w) => (
              <li key={w.id}>
                <button type="button" className={`clue ${w.id === selectedId ? 'is-selected' : ''} ${solved.includes(w.id) ? 'is-solved' : ''}`} aria-pressed={w.id === selectedId} onClick={() => onSelect(w.id)}>
                  <span className="clue-num">{numberOf(w)}</span>
                  <span>{w.clue}</span>
                  {solved.includes(w.id) ? <Icon name="check" size={18} /> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ListMode({ puzzle, entries, solved, numberOf, onChoose, bank }: { puzzle: typeof crosswords.en; entries: Record<string, string>; solved: string[]; numberOf: (w: CrosswordWord) => number; onChoose: (w: CrosswordWord, ans: string) => void; bank: string[] }) {
  const { t, locale } = useT();
  return (
    <div className="xw-list">
      <p className="muted small">{t(c.listHint)}</p>
      <ol role="list">
        {[...puzzle.words].sort((a, b) => numberOf(a) - numberOf(b) || a.dir.localeCompare(b.dir)).map((w) => {
          const isSolved = solved.includes(w.id);
          const current = wordCells(w).map((x) => entries[cellKey(x.row, x.col)] ?? '').join('');
          const id = `xw-list-${w.id}`;
          return (
            <li key={w.id} className={isSolved ? 'is-solved' : ''}>
              <label htmlFor={id}>
                <strong>{numberOf(w)} {t(w.dir === 'across' ? c.across : c.down)}</strong>: {w.clue} ({Array.from(w.answer).length})
              </label>
              {isSolved ? (
                <p className="list-solved"><Icon name="check" size={18} /> <span lang={locale}>{w.answer}</span> · {w.meaning}</p>
              ) : (
                <select id={id} value="" onChange={(e) => { if (e.target.value) onChoose(w, e.target.value); }} lang={locale} aria-describedby={current ? `${id}-cur` : undefined}>
                  <option value="">{t(c.chooseAnswer)}</option>
                  {bank.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
