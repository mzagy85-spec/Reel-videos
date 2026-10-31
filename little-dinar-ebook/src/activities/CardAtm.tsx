import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { card as c, ui } from '../content/copy';
import { ATM_AMOUNT, CARD_PRICE, CARD_START } from '../lib/activities';
import { Amount, Feedback, ResetButton } from './shared';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';

export function CardAtm(_: ActivityProps) {
  const { t, kwd } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.card;
  const fx = state.settings.effects;
  return (
    <div className="card-activity">
      <p className="sim-label"><Icon name="info" size={18} />{t(ui.learningSimulation)} · {t(c.separate)}</p>

      <section className="example-box" aria-labelledby="ex1">
        <h3 id="ex1"><Icon name="card" size={24} /> {t(c.example1)}</h3>
        <div className="example-row">
          <div className="mini-stat"><span>{t(c.balance)}</span><strong><Amount>{kwd(s.balance)}</Amount></strong></div>
          <div className="mini-stat"><span>{t(c.price, { amount: '' })}</span><strong><Amount>{kwd(CARD_PRICE)}</Amount></strong></div>
        </div>
        <button type="button" className="btn btn-primary" disabled={s.paid} onClick={() => { dispatch({ type: 'card', a: { type: 'pay' } }); playEffect('success', fx); }}>
          {t(c.pay, { amount: kwd(CARD_PRICE) })}
        </button>
        <Feedback tone={s.paid ? 'good' : 'info'}>{s.paid ? t(c.paid, { from: kwd(CARD_START), to: kwd(s.balance) }) : null}</Feedback>
      </section>

      <details className="example-box optional" open={s.atmDone || undefined}>
        <summary><Icon name="atm" size={24} /> <span>{t(c.example2)}</span></summary>
        <div className="example-row">
          <div className="mini-stat"><span>{t(c.balance)}</span><strong><Amount>{kwd(s.atmAccount)}</Amount></strong></div>
          <div className="mini-stat"><span>{t(c.cash)}</span><strong><Amount>{kwd(s.atmCash)}</Amount></strong></div>
        </div>
        <button type="button" className="btn btn-primary" disabled={s.atmDone} onClick={() => { dispatch({ type: 'card', a: { type: 'atm' } }); playEffect('success', fx); }}>
          {t(c.withdraw, { amount: kwd(ATM_AMOUNT) })}
        </button>
        <Feedback tone={s.atmDone ? 'good' : 'info'}>{s.atmDone ? t(c.withdrawn, { amount: kwd(ATM_AMOUNT), left: kwd(s.atmAccount) }) : null}</Feedback>
      </details>

      <p className="muted small"><Icon name="shield" size={18} /> {t(c.noPin)}</p>
      <ResetButton label={t(ui.reset)} onClick={() => dispatch({ type: 'card', a: { type: 'reset' } })} />
    </div>
  );
}
