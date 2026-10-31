import { useState } from 'react';
import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { completion as c, diraya, ui } from '../content/copy';
import type { HabitChoice } from '../lib/activities';
import { CircleIcon, Icon } from '../app/Icons';
import { Feedback } from './shared';
import { BrandArrow, Logo } from '../app/Brand';
import { ResetProgress } from '../app/SettingsDrawer';
import { exportCardImage } from './cardExport';
import { printCard } from '../app/PrintEdition';
import { playEffect } from '../lib/audio';

const HABITS: { id: HabitChoice; icon: 'target' | 'save' | 'receipt' }[] = [
  { id: 'setGoal', icon: 'target' },
  { id: 'saveSmall', icon: 'save' },
  { id: 'reviewPurchases', icon: 'receipt' },
];

export function CompletionPage({ onGo }: ActivityProps) {
  const { t, locale } = useT();
  const { state, dispatch } = useBook();
  const habit = state.act.habit.choice;
  const [status, setStatus] = useState('');
  const habitText = habit ? t(c[habit]) : '';
  const stamps = Object.keys(state.concepts).length;

  return (
    <div className="completion">
      <fieldset className="habits">
        <legend className="step-title">{t(c.chooseHabit)}</legend>
        {HABITS.map((h) => (
          <label key={h.id} className={`habit ${habit === h.id ? 'is-selected' : ''}`}>
            <input type="radio" name="habit" checked={habit === h.id} onChange={() => { dispatch({ type: 'habit', choice: h.id }); playEffect('success', state.settings.effects); }} />
            <CircleIcon name={h.icon} size={44} />
            <span>{t(c[h.id])}</span>
          </label>
        ))}
      </fieldset>
      <Feedback tone="good">{habit ? t(c.habitChosen, { habit: habitText }) : null}</Feedback>

      <div className="completion-card" id="completion-card" lang={locale}>
        <div className="cc-top">
          <Logo variant="white" className="cc-logo" />
        </div>
        <BrandArrow kind="red" className="cc-arrow" />
        <div className="cc-body">
          <p className="cc-title">{t(c.cardTitle)}</p>
          <p className="cc-line">{t(c.cardLine)}</p>
          <p className="cc-habit">{habit ? t(c.cardHabit, { habit: habitText }) : t(c.cardHabitNone)}</p>
          <p className="cc-stamps"><Icon name="star" size={18} /> {t(ui.stamps)}: <bdi>{t(ui.stampsCount, { n: stamps, total: 14 })}</bdi></p>
          <p className="cc-credit">{t(diraya.cardCredit)}</p>
          <p className="cc-note">{t(c.cardNote)}</p>
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={async () => {
          const r = await exportCardImage({ locale, title: t(c.cardTitle), line: t(c.cardLine), habit: habit ? t(c.cardHabit, { habit: habitText }) : t(c.cardHabitNone), credit: t(diraya.cardCredit), note: t(c.cardNote) });
          setStatus(r ? t(c.saved) : t(c.saveUnavailable));
        }}>
          <Icon name="download" size={20} />{t(c.saveCard)}
        </button>
        <button type="button" className="btn" onClick={() => { if (!printCard()) setStatus(t(ui.printUnavailable)); }}>
          <Icon name="print" size={20} />{t(c.printCard)}
        </button>
      </div>
      <p role="status" className="muted small">{status}</p>

      <section className="replay" aria-labelledby="replay-title">
        <h3 id="replay-title">{t(c.replay)}</h3>
        <div className="btn-row">
          <button type="button" className="btn btn-small" onClick={() => onGo(9)}><Icon name="map" size={18} />{t(c.replayMap)}</button>
          <button type="button" className="btn btn-small" onClick={() => onGo(14)}><Icon name="grid" size={18} />{t(c.replayCrossword)}</button>
          <button type="button" className="btn btn-small btn-quiet" onClick={() => onGo(1)}>{t(c.backToStart)}</button>
        </div>
      </section>

      <aside className="closing-info" aria-labelledby="closing-title">
        <h3 id="closing-title">{t(c.infoTitle)}</h3>
        <p>{t(diraya.full)}</p>
      </aside>

      <ResetProgress />
    </div>
  );
}
