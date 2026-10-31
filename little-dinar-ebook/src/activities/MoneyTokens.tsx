import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { tokens as c, ui } from '../content/copy';
import { TOKENS_IN_DINAR, tokensTotal, HALF_TOKEN_VALUE } from '../lib/activities';
import { Amount, Feedback, ResetButton, Token, TokenLegend } from './shared';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';

export function MoneyTokens(_: ActivityProps) {
  const { t, fils, kwd } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.tokens;
  const total = tokensTotal(s);
  const fx = state.settings.effects;
  const add = () => { if (s.tray < TOKENS_IN_DINAR) { dispatch({ type: 'tokens', a: { type: 'add' } }); playEffect(s.tray === 9 ? 'success' : 'place', fx); } };
  const remove = () => { dispatch({ type: 'tokens', a: { type: 'remove' } }); playEffect('tap', fx); };
  const poolLeft = TOKENS_IN_DINAR - s.tray;

  return (
    <div className="tokens-activity">
      <div className="token-board">
        <div className="token-pool" role="group" aria-label={t(c.pool)}>
          <p className="board-label">{t(c.pool)}</p>
          <div className="token-row">
            {Array.from({ length: poolLeft }, (_, i) => (
              <button key={i} type="button" className="token-btn" onClick={add} aria-label={t(c.add)} tabIndex={i === 0 ? 0 : -1}>
                <Token value={100} />
              </button>
            ))}
            {poolLeft === 0 ? <span className="muted small">{t(c.full)}</span> : null}
          </div>
        </div>
        <div className="token-tray" role="group" aria-label={t(c.tray)}>
          <p className="board-label">{t(c.tray)}</p>
          <div className="tray-slots">
            {Array.from({ length: TOKENS_IN_DINAR }, (_, i) => (
              <span key={i} className={`tray-slot ${i < s.tray ? 'is-filled' : ''}`}>
                {i < s.tray ? (
                  <button type="button" className="token-btn in-tray" onClick={remove} aria-label={t(c.remove)} tabIndex={i === s.tray - 1 ? 0 : -1}>
                    <Token value={100} />
                  </button>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="counter">
        <div className="counter-total" aria-hidden="true">
          <span className="counter-label">{t(c.total)}</span>
          <Amount><span className="counter-value">{fils(total)}</span></Amount>
          {total === 1000 ? <Amount><span className="counter-kwd">= {kwd(total)}</span></Amount> : null}
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={add} disabled={s.tray >= TOKENS_IN_DINAR}>
            <Icon name="save" size={20} /><span>{t(c.add)}</span>
          </button>
          <button type="button" className="btn" onClick={remove} disabled={s.tray === 0}>
            <span>{t(c.remove)}</span>
          </button>
          <ResetButton label={t(ui.reset)} onClick={() => dispatch({ type: 'tokens', a: { type: 'reset' } })} />
        </div>
      </div>

      <Feedback tone={total === 1000 ? 'good' : 'info'}>
        {total === 1000
          ? t(c.oneDinar, { kwd: kwd(total) })
          : `${t(c.inTray, { count: s.tray, total: fils(total) })} ${s.tray > 0 ? t(c.keepGoing, { more: fils(1000 - total) }) : ''}`}
      </Feedback>

      <details className="challenge">
        <summary><Icon name="target" size={20} /><span>{t(c.challenge)}</span></summary>
        <p>{t(c.challengeHelp)}</p>
        <div className="token-row fifty-row" aria-hidden="true">
          {Array.from({ length: 2 }, (_, i) => <Token key={i} value={50} size="sm" ghost={i >= s.fifties} />)}
        </div>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => { dispatch({ type: 'tokens', a: { type: 'addFifty' } }); playEffect('place', fx); }} disabled={s.fifties >= 2}>{t(c.addFifty)}</button>
          <button type="button" className="btn btn-quiet" onClick={() => dispatch({ type: 'tokens', a: { type: 'removeFifty' } })} disabled={s.fifties === 0}>{t(c.removeFifty)}</button>
        </div>
        <Feedback tone={s.fifties === 2 ? 'good' : 'info'}>
          {s.fifties === 2 ? t(c.fiftyDone) : s.fifties > 0 ? t(c.fiftyStatus, { count: s.fifties, total: fils(s.fifties * HALF_TOKEN_VALUE) }) : null}
        </Feedback>
      </details>
      <TokenLegend />
    </div>
  );
}
