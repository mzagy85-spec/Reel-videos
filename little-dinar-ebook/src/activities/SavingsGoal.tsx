import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { goal as c, ui } from '../content/copy';
import { GOAL_PRICE, GOAL_START, WEEKLY_OPTIONS, goalReached, goalRemaining, goalWeeksNeeded, type GoalId } from '../lib/activities';
import { Amount, Feedback, ResetButton } from './shared';
import { CircleIcon } from '../app/Icons';
import { playEffect } from '../lib/audio';

const GOALS: { id: GoalId; icon: 'book' | 'art' | 'ball' }[] = [
  { id: 'book', icon: 'book' },
  { id: 'art', icon: 'art' },
  { id: 'ball', icon: 'ball' },
];

export function SavingsGoal(_: ActivityProps) {
  const { t, kwd, fils, dinars } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.goal;
  const fx = state.settings.effects;
  const reached = goalReached(s);
  const needed = goalWeeksNeeded(s);
  // The path shows 1000-fils steps from the 5 KWD start to the 10 KWD goal; half steps fill half a stone.
  const STEPS = (GOAL_PRICE - GOAL_START) / 1000;
  const progressSteps = (s.saved - GOAL_START) / 1000;

  return (
    <div className="goal-activity">
      <fieldset className="goal-cards">
        <legend>{t(c.pick)}</legend>
        {GOALS.map((g) => (
          <label key={g.id} className={`goal-card ${s.goal === g.id ? 'is-selected' : ''}`}>
            <input type="radio" name="goal" checked={s.goal === g.id} onChange={() => { dispatch({ type: 'goal', a: { type: 'choose', goal: g.id } }); playEffect('tap', fx); }} />
            <CircleIcon name={g.icon} size={56} />
            <span className="goal-name">{t(c[g.id])}</span>
            <span className="goal-price"><Amount>{dinars(GOAL_PRICE)}</Amount></span>
          </label>
        ))}
      </fieldset>

      {s.goal ? (
        <>
          <fieldset className="weekly">
            <legend>{t(c.weekly)}</legend>
            <div className="seg">
              {WEEKLY_OPTIONS.map((w) => (
                <button key={w} type="button" aria-pressed={s.weekly === w} onClick={() => dispatch({ type: 'goal', a: { type: 'setWeekly', weekly: w } })}>
                  <Amount>{w >= 1000 ? kwd(w) : fils(w)}</Amount>
                </button>
              ))}
            </div>
            <p className="muted small">{t(c.challenge)}</p>
          </fieldset>

          <div className="savings-path" role="img" aria-label={`${t(c.progressLabel)}: ${t(c.saved, { amount: kwd(s.saved) })}, ${t(c.goalPrice, { amount: kwd(GOAL_PRICE) })}`}>
            <span className="path-start"><Amount>{kwd(GOAL_START)}</Amount></span>
            {Array.from({ length: STEPS }, (_, i) => {
              const fill = Math.max(0, Math.min(1, progressSteps - i));
              return <span key={i} className={`path-stone ${fill >= 1 ? 'is-full' : fill > 0 ? 'is-half' : ''}`} />;
            })}
            <span className={`path-goal ${reached ? 'is-reached' : ''}`}><CircleIcon name={GOALS.find((g) => g.id === s.goal)!.icon} size={44} /></span>
          </div>

          <dl className="goal-stats">
            <div><dt>{t(c.goalPrice, { amount: '' })}</dt><dd><Amount>{kwd(GOAL_PRICE)}</Amount></dd></div>
            <div><dt>{t(c.saved, { amount: '' })}</dt><dd><Amount>{kwd(s.saved)}</Amount></dd></div>
            <div><dt>{t(c.remaining, { amount: '' })}</dt><dd><Amount>{kwd(goalRemaining(s))}</Amount></dd></div>
            <div><dt>{t(c.weeksSoFar, { n: '' })}</dt><dd>{s.weeks}</dd></div>
          </dl>

          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary"
              disabled={reached || s.weekly <= 0}
              onClick={() => { dispatch({ type: 'goal', a: { type: 'addWeek' } }); playEffect(s.saved + s.weekly >= GOAL_PRICE ? 'success' : 'place', fx); }}
            >
              {t(c.addWeek, { amount: s.weekly >= 1000 ? kwd(s.weekly) : fils(s.weekly) })}
            </button>
            <ResetButton label={t(ui.reset)} onClick={() => dispatch({ type: 'goal', a: { type: 'reset' } })} />
          </div>

          <Feedback tone={reached ? 'good' : s.weekly <= 0 ? 'try' : 'info'}>
            {reached
              ? t(c.reached, { n: s.weeks })
              : needed === null
                ? t(c.zero)
                : needed === 1 ? t(c.weeksNeededOne) : t(c.weeksNeeded, { n: needed })}
          </Feedback>
          <p className="muted small">{t(c.assumption)}</p>
        </>
      ) : (
        <p className="muted">{t(c.pickFirst)}</p>
      )}
    </div>
  );
}
