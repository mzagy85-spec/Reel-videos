import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { help as c } from '../content/copy';
import type { HelpChoice as Choice } from '../lib/activities';
import { Feedback } from './shared';
import { CircleIcon } from '../app/Icons';
import { playEffect } from '../lib/audio';

const OPTIONS: { id: Choice; icon: 'tool' | 'book' | 'tea'; label: typeof c.repair; fb: typeof c.repair }[] = [
  { id: 'repair', icon: 'tool', label: c.repair, fb: c.repairFeedback },
  { id: 'shareBook', icon: 'book', label: c.shareBook, fb: c.shareBookFeedback },
  { id: 'helpFamily', icon: 'tea', label: c.helpFamily, fb: c.helpFamilyFeedback },
];

export function HelpChoice(_: ActivityProps) {
  const { t } = useT();
  const { state, dispatch } = useBook();
  const choice = state.act.help.choice;
  return (
    <div className="help-activity">
      <div className="help-options" role="group" aria-label={t({ ar: 'طرق المساعدة', en: 'Ways to help' })}>
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`help-card ${choice === o.id ? 'is-chosen' : ''}`}
            aria-pressed={choice === o.id}
            onClick={() => { dispatch({ type: 'help', choice: o.id }); playEffect('success', state.settings.effects); }}
          >
            <CircleIcon name={o.icon} size={56} />
            <span>{t(o.label)}</span>
          </button>
        ))}
      </div>
      <Feedback tone="good">{choice ? `${t(OPTIONS.find((o) => o.id === choice)!.fb)} ${t(c.allEqual)}` : null}</Feedback>
    </div>
  );
}
