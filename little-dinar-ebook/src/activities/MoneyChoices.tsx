import { useState } from 'react';
import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { moneyChoices as c } from '../content/copy';
import { CircleIcon } from '../app/Icons';
import { Feedback } from './shared';
import { playEffect } from '../lib/audio';

const CHOICES = [
  { id: 'spend', label: c.spend, example: c.spendExample, icon: 'spend' },
  { id: 'save', label: c.save, example: c.saveExample, icon: 'save' },
  { id: 'help', label: c.help, example: c.helpExample, icon: 'help' },
] as const;

export function MoneyChoices(_: ActivityProps) {
  const { t } = useT();
  const { state, dispatch } = useBook();
  const seen = state.act.choices;
  const [open, setOpen] = useState<(typeof CHOICES)[number]['id'] | null>(seen[seen.length - 1] ?? null);
  const current = CHOICES.find((x) => x.id === open);
  return (
    <div className="choices">
      <div className="choice-path" role="group" aria-label={t({ ar: 'خيارات المال', en: 'Money choices' })}>
        {CHOICES.map((ch, i) => (
          <button
            key={ch.id}
            type="button"
            className={`choice-stone ${open === ch.id ? 'is-open' : ''} ${seen.includes(ch.id) ? 'is-seen' : ''}`}
            aria-expanded={open === ch.id}
            aria-controls="choice-example"
            onClick={() => { setOpen(ch.id); dispatch({ type: 'choices', choice: ch.id }); playEffect('tap', state.settings.effects); }}
            style={{ ['--i' as string]: i }}
          >
            <CircleIcon name={ch.icon} size={64} />
            <span className="choice-label">{t(ch.label)}</span>
          </button>
        ))}
      </div>
      <div id="choice-example" className={`choice-example ${current ? 'is-filled' : ''}`}>
        {current ? <p key={current.id} className="pop-in">{t(current.example)}</p> : null}
      </div>
      <Feedback tone={seen.length === 3 ? 'good' : 'info'}>
        {seen.length === 3 ? t(c.done) : seen.length > 0 ? t(c.progress, { n: seen.length }) : null}
      </Feedback>
    </div>
  );
}
