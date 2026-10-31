import { useRef, useState } from 'react';
import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { ledger as c, ui } from '../content/copy';
import { LEDGER_STEP, ledgerTotal } from '../lib/activities';
import { Amount, Feedback, ResetButton } from './shared';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';

export function BankLedger(_: ActivityProps) {
  const { t, kwd } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.ledger;
  const fx = state.settings.effects;
  const [flash, setFlash] = useState<'deposit' | 'withdraw' | null>(null);
  const busy = useRef(false);

  const act = (kind: 'deposit' | 'withdraw') => {
    // Two guards against accidental double taps: a short UI lock, and the reducer's expectId check.
    if (busy.current) return;
    busy.current = true;
    window.setTimeout(() => { busy.current = false; }, 350);
    dispatch({ type: 'ledger', a: { type: kind, expectId: s.nextId } });
    setFlash(kind);
    playEffect('place', fx);
  };
  const last = s.history[s.history.length - 1];

  return (
    <div className="ledger-activity">
      <p className="sim-label"><Icon name="info" size={18} />{t(ui.learningSimulation)}</p>
      <div className={`ledger-boxes flash-${flash ?? 'none'}`} key={s.nextId}>
        <div className="ledger-box wallet">
          <Icon name="wallet" size={32} />
          <span className="ledger-name">{t(c.wallet)}</span>
          <strong className="ledger-value"><Amount>{kwd(s.wallet)}</Amount></strong>
        </div>
        <div className="ledger-flow" aria-hidden="true">
          <span className="flow-arrow" />
        </div>
        <div className="ledger-box account">
          <Icon name="account" size={32} />
          <span className="ledger-name">{t(c.account)}</span>
          <strong className="ledger-value"><Amount>{kwd(s.account)}</Amount></strong>
        </div>
      </div>
      <p className="ledger-total"><span>{t(c.total)}:</span> <strong><Amount>{kwd(ledgerTotal(s))}</Amount></strong></p>
      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={() => act('deposit')} disabled={s.wallet < LEDGER_STEP}>{t(c.deposit, { amount: kwd(LEDGER_STEP) })}</button>
        <button type="button" className="btn btn-primary" onClick={() => act('withdraw')} disabled={s.account < LEDGER_STEP}>{t(c.withdraw, { amount: kwd(LEDGER_STEP) })}</button>
        <ResetButton label={t(ui.reset)} onClick={() => { dispatch({ type: 'ledger', a: { type: 'reset' } }); setFlash(null); }} />
      </div>
      <Feedback tone={last ? 'good' : 'info'}>
        {last
          ? t(last.kind === 'deposit' ? c.afterDeposit : c.afterWithdraw, { amount: kwd(last.amount), total: kwd(ledgerTotal(s)) })
          : null}
      </Feedback>
      {s.wallet < LEDGER_STEP ? <p className="muted small">{t(c.walletEmpty)}</p> : null}
      {s.account < LEDGER_STEP ? <p className="muted small">{t(c.accountEmpty)}</p> : null}
      <div className="history">
        <h3>{t(c.history)}</h3>
        {s.history.length === 0 ? <p className="muted small">{t(c.noHistory)}</p> : (
          <ol>
            {s.history.map((h) => (
              <li key={h.id}><Amount>{t(h.kind === 'deposit' ? c.depositRow : c.withdrawRow, { amount: kwd(h.amount), wallet: kwd(h.wallet), account: kwd(h.account) })}</Amount></li>
            ))}
          </ol>
        )}
      </div>
      <p className="muted small">{t(c.note)}</p>
    </div>
  );
}
