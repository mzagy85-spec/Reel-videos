import { useState } from 'react';
import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { needs as c, ui } from '../content/copy';
import { NEED_ITEMS, needIsCorrect, needsComplete, type NeedAnswer, type NeedItemId } from '../lib/activities';
import { Feedback, ResetButton } from './shared';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';

const COPY: Record<NeedItemId, { name: typeof c.pencil; context: typeof c.pencil; feedback: typeof c.pencil; art: string }> = {
  pencil: { name: c.pencil, context: c.pencilContext, feedback: c.pencilFeedback, art: 'pencil' },
  glitterPencil: { name: c.glitterPencil, context: c.glitterPencilContext, feedback: c.glitterPencilFeedback, art: 'glitter' },
  water: { name: c.water, context: c.waterContext, feedback: c.waterFeedback, art: 'water' },
  toyCar: { name: c.toyCar, context: c.toyCarContext, feedback: c.toyCarFeedback, art: 'car' },
};

function ItemArt({ kind }: { kind: string }) {
  // Small object drawings for the item cards (decorative; the card text names the object).
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false" className="item-art">
      {kind === 'pencil' && (<g transform="rotate(-35 32 32)"><rect x="12" y="27" width="34" height="10" rx="2" fill="#F2B233" /><path d="M46 27l10 5-10 5z" fill="#E9C9A0" /><path d="M53 30.5l3 1.5-3 1.5z" fill="#3A3A3A" /><rect x="8" y="27" width="6" height="10" rx="2" fill="#E8838A" /></g>)}
      {kind === 'glitter' && (<g transform="rotate(-35 32 32)"><rect x="12" y="27" width="34" height="10" rx="2" fill="#B28AE0" /><circle cx="20" cy="31" r="1.4" fill="#fff" /><circle cx="28" cy="34" r="1.2" fill="#fff" /><circle cx="37" cy="30" r="1.4" fill="#fff" /><path d="M46 27l10 5-10 5z" fill="#E9C9A0" /><path d="M53 30.5l3 1.5-3 1.5z" fill="#3A3A3A" /><path d="M6 32l3-6 3 6-3 6z" fill="#F4C542" /></g>)}
      {kind === 'water' && (<g><rect x="22" y="14" width="20" height="40" rx="7" fill="#9FD3F0" /><rect x="25" y="8" width="14" height="8" rx="2" fill="#00248F" /><rect x="22" y="28" width="20" height="12" fill="#5FB3E3" /><rect x="26" y="18" width="3" height="30" rx="1.5" fill="#fff" opacity=".5" /></g>)}
      {kind === 'car' && (<g><path d="M10 38h44v8H10z" fill="#EF2B2D" /><path d="M18 38l6-10h16l8 10z" fill="#EF2B2D" /><path d="M26 30h6v8h-10zM34 30h5l5 8h-10z" fill="#CFE8F7" /><circle cx="20" cy="47" r="5" fill="#333" /><circle cx="44" cy="47" r="5" fill="#333" /><circle cx="20" cy="47" r="2" fill="#B7B9BC" /><circle cx="44" cy="47" r="2" fill="#B7B9BC" /></g>)}
    </svg>
  );
}

export function NeedsWantsActivity(_: ActivityProps) {
  const { t } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.needs;
  const [active, setActive] = useState<NeedItemId>(() => NEED_ITEMS.find((i) => !needIsCorrect(s, i.id))?.id ?? 'pencil');
  const [last, setLast] = useState<{ item: NeedItemId; ok: boolean } | null>(null);
  const sorted = NEED_ITEMS.filter((i) => needIsCorrect(s, i.id)).length;

  const answer = (item: NeedItemId, a: NeedAnswer) => {
    dispatch({ type: 'needs', a: { type: 'answer', item, answer: a } });
    const ok = NEED_ITEMS.find((i) => i.id === item)!.answer === a;
    setLast({ item, ok });
    playEffect(ok ? 'place' : 'gentle', state.settings.effects);
    if (ok) {
      const nextItem = NEED_ITEMS.find((i) => i.id !== item && !needIsCorrect(s, i.id));
      if (nextItem) setActive(nextItem.id);
    }
  };

  const feedback = (() => {
    if (needsComplete(s) && last?.ok) return { tone: 'good' as const, text: `${t(COPY[last.item].feedback)} ${t(c.done)}` };
    if (!last) return null;
    return last.ok
      ? { tone: 'good' as const, text: t(COPY[last.item].feedback) }
      : { tone: 'try' as const, text: t(c.retry, { context: t(COPY[last.item].context) }) };
  })();

  return (
    <div className="needs">
      <ul className="item-cards" role="list">
        {NEED_ITEMS.map((item) => {
          const cp = COPY[item.id];
          const chosen = s.answers[item.id];
          const correct = needIsCorrect(s, item.id);
          return (
            <li key={item.id} className={`item-card ${active === item.id ? 'is-active' : ''} ${correct ? 'is-done' : ''}`}>
              <button type="button" className="item-select" onClick={() => setActive(item.id)} aria-pressed={active === item.id}>
                <ItemArt kind={cp.art} />
                <span className="item-name">{t(cp.name)}</span>
                <span className="item-context">{t(cp.context)}</span>
                {correct ? (
                  <span className="item-tag"><Icon name="check" size={16} />{t(chosen === 'need' ? c.need : c.want)}</span>
                ) : null}
              </button>
              {active === item.id ? (
                <div className="sort-buttons" role="group" aria-label={t(c.choose, { item: t(cp.name) })}>
                  <button type="button" className="btn btn-sort need" onClick={() => answer(item.id, 'need')} aria-pressed={chosen === 'need'}>{t(c.need)}</button>
                  <button type="button" className="btn btn-sort want" onClick={() => answer(item.id, 'want')} aria-pressed={chosen === 'want'}>{t(c.want)}</button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="muted small">{t(c.progress, { n: sorted })}</p>
      <Feedback tone={feedback?.tone ?? 'info'}>{feedback?.text}</Feedback>
      <ResetButton label={t(ui.reset)} onClick={() => { dispatch({ type: 'needs', a: { type: 'reset' } }); setLast(null); setActive('pencil'); }} />
    </div>
  );
}
