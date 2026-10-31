import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { safety as c, diraya } from '../content/copy';
import type { SafetyChoice as Choice } from '../lib/activities';
import { Feedback } from './shared';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';

const OPTIONS: { id: Choice; label: typeof c.shareCode; fb: typeof c.shareCode }[] = [
  { id: 'shareCode', label: c.shareCode, fb: c.shareCodeFeedback },
  { id: 'tapLink', label: c.tapLink, fb: c.tapLinkFeedback },
  { id: 'stopAndTell', label: c.stopAndTell, fb: c.stopAndTellFeedback },
];

export function SafetyChoice(_: ActivityProps) {
  const { t } = useT();
  const { state, dispatch } = useBook();
  const choice = state.act.safety.choice;
  const safe = choice === 'stopAndTell';
  return (
    <div className="safety-activity">
      {/* Deliberately a storybook card, not a phone notification. Nothing in it is a link or a field. */}
      <figure className={`practice-message ${safe ? 'is-closed' : ''}`} aria-label={t(c.practice)}>
        <figcaption className="practice-tag"><Icon name="info" size={16} />{t(c.practice)}</figcaption>
        <div className="practice-body">
          <span className="practice-gift" aria-hidden="true"><Icon name="gift" size={28} /></span>
          <div>
            <p className="practice-from">{t(c.from)}</p>
            <p>{t(c.body)}</p>
            <p className="practice-link" aria-disabled="true">{t(c.fakeLink)}</p>
          </div>
        </div>
      </figure>
      <fieldset className="safety-options">
        <legend className="step-title">{t(c.question)}</legend>
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`btn option-btn ${choice === o.id ? 'is-chosen' : ''} ${o.id === 'stopAndTell' ? 'is-safe-option' : ''}`}
            aria-pressed={choice === o.id}
            onClick={() => { dispatch({ type: 'safety', choice: o.id }); playEffect(o.id === 'stopAndTell' ? 'success' : 'gentle', state.settings.effects); }}
          >
            {o.id === 'stopAndTell' ? <Icon name="shield" size={22} /> : null}
            <span>{t(o.label)}</span>
          </button>
        ))}
      </fieldset>
      <Feedback tone={safe ? 'good' : choice ? 'try' : 'info'}>{choice ? t(OPTIONS.find((o) => o.id === choice)!.fb) : null}</Feedback>
      <p className="muted small">{t(c.calm)}</p>
      <p className="diraya-note"><Icon name="shield" size={18} /> {t(diraya.safety)}</p>
    </div>
  );
}
