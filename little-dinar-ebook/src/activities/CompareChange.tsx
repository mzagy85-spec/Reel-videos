import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { compare as c, ui } from '../content/copy';
import { CHANGE_OPTIONS, COMPARE_A, COMPARE_B, COMPARE_PAID, correctChange } from '../lib/activities';
import { Amount, Feedback, ResetButton } from './shared';
import { playEffect } from '../lib/audio';

function Notebook({ tag }: { tag: string }) {
  return (
    <svg viewBox="0 0 90 110" width="78" height="96" aria-hidden="true" focusable="false" className="notebook-art">
      <rect x="10" y="6" width="70" height="96" rx="6" fill="#00248F" />
      <rect x="10" y="6" width="12" height="96" rx="4" fill="#0B2F9E" />
      <rect x="32" y="26" width="38" height="20" rx="3" fill="#F3F3F3" />
      <circle cx="16" cy="22" r="2" fill="#B7B9BC" /><circle cx="16" cy="42" r="2" fill="#B7B9BC" /><circle cx="16" cy="62" r="2" fill="#B7B9BC" /><circle cx="16" cy="82" r="2" fill="#B7B9BC" />
      <text x="51" y="41" textAnchor="middle" fontSize="13" fontWeight="700" fill="#00248F" fontFamily="Cairo, sans-serif">{tag}</text>
    </svg>
  );
}

export function CompareChange(_: ActivityProps) {
  const { t, kwd, fils } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.compare;
  const fx = state.settings.effects;
  const items = [
    { id: 'A' as const, label: c.itemA, price: COMPARE_A, tag: t({ ar: 'أ', en: 'A' }) },
    { id: 'B' as const, label: c.itemB, price: COMPARE_B, tag: t({ ar: 'ب', en: 'B' }) },
  ];
  const right = correctChange();
  const changeOk = s.change === right;

  return (
    <div className="compare-activity">
      <p className="muted small">{t(c.same)}</p>
      <p className="step-title">{t(c.step1)}</p>
      <div className="compare-row">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className={`compare-card ${s.choice === it.id ? 'is-selected' : ''}`}
            aria-pressed={s.choice === it.id}
            onClick={() => { dispatch({ type: 'compare', a: { type: 'choose', item: it.id } }); playEffect(it.id === 'B' ? 'place' : 'gentle', fx); }}
          >
            <Notebook tag={it.tag} />
            <span className="compare-name">{t(it.label)}</span>
            <span className="price-tag big"><Amount>{kwd(it.price)}</Amount></span>
          </button>
        ))}
      </div>
      {s.choice ? <Feedback tone={s.choice === 'B' ? 'good' : 'try'}>{t(s.choice === 'B' ? c.choseB : c.choseA)}</Feedback> : <Feedback tone="info" />}

      {s.choice === 'B' ? (
        <fieldset className="change-step">
          <legend className="step-title">{t(c.step2, { paid: kwd(COMPARE_PAID) })}</legend>
          <div className="change-options">
            {CHANGE_OPTIONS.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`btn change-btn ${s.change === amt ? (amt === right ? 'is-right' : 'is-wrong') : ''}`}
                aria-pressed={s.change === amt}
                onClick={() => { dispatch({ type: 'compare', a: { type: 'change', amount: amt } }); playEffect(amt === right ? 'success' : 'gentle', fx); }}
              >
                <Amount>{t(c.changeOption, { amount: fils(amt) })}</Amount>
              </button>
            ))}
          </div>
          {s.change !== null ? (
            <p className="change-explain" role="status">
              <Amount>{changeOk
                ? t(c.changeRight, { paid: kwd(COMPARE_PAID), price: kwd(COMPARE_B), change: kwd(right) })
                : t(c.changeWrong, { paid: kwd(COMPARE_PAID), price: kwd(COMPARE_B) })}</Amount>
            </p>
          ) : null}
        </fieldset>
      ) : null}
      <p className="muted small">{t(c.note)}</p>
      <ResetButton label={t(ui.reset)} onClick={() => dispatch({ type: 'compare', a: { type: 'reset' } })} />
    </div>
  );
}
