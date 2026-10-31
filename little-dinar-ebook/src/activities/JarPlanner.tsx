import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { jars as c, ui } from '../content/copy';
import { JAR_IDS, TOKEN_VALUE, TOKENS_IN_DINAR, jarsComplete, jarsTotalWithPool, jarsUnallocated, type JarId } from '../lib/activities';
import { Amount, Feedback, ResetButton, Token, TokenLegend } from './shared';
import { CircleIcon } from '../app/Icons';
import { playEffect } from '../lib/audio';

const ICON: Record<JarId, 'spend' | 'save' | 'help'> = { spend: 'spend', save: 'save', help: 'help' };

function JarGlass({ count, jar }: { count: number; jar: JarId }) {
  const level = count / TOKENS_IN_DINAR;
  return (
    <svg viewBox="0 0 120 150" className={`jar-glass jar-${jar}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`jg-${jar}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".5" stopColor="#E9F1F8" stopOpacity=".25" />
          <stop offset="1" stopColor="#fff" stopOpacity=".5" />
        </linearGradient>
        <clipPath id={`jc-${jar}`}><path d="M22 30h76v100a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14z" /></clipPath>
      </defs>
      <rect x="30" y="14" width="60" height="14" rx="5" className="jar-lid" />
      <g clipPath={`url(#jc-${jar})`}>
        <rect className="jar-fill" x="22" y={144 - level * 112} width="76" height={level * 112 + 2} />
        {Array.from({ length: count }, (_, i) => (
          <ellipse key={i} cx={38 + ((i * 17) % 46)} cy={136 - Math.floor(i / 3) * 11} rx="10" ry="4.5" className="jar-coin" />
        ))}
      </g>
      <path d="M22 30h76v100a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14z" fill={`url(#jg-${jar})`} className="jar-outline" />
      <path d="M32 40v84" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}

export function JarPlanner(_: ActivityProps) {
  const { t, fils, kwd } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.jars;
  const fx = state.settings.effects;
  const left = jarsUnallocated(s);
  const label = (j: JarId) => t(c[j]);

  let doneText = '';
  if (jarsComplete(s)) {
    const save = fils(s.save * TOKEN_VALUE);
    doneText = s.save === 0 ? t(c.doneSaveNone) : s.save >= 5 ? t(c.doneSaveMore, { save }) : t(c.doneSaveSome, { save });
  }

  return (
    <div className="jars-activity">
      <div className="jar-pool" aria-hidden="true">
        {Array.from({ length: left }, (_, i) => <Token key={i} value={100} size="sm" />)}
      </div>
      <p className="jar-pool-text"><Amount>{t(c.unallocated, { amount: fils(left * TOKEN_VALUE) })}</Amount></p>
      <ul className="jars" role="list">
        {JAR_IDS.map((j) => (
          <li key={j} className="jar">
            <JarGlass count={s[j]} jar={j} />
            <div className="jar-label">
              <CircleIcon name={ICON[j]} size={36} />
              <span className="jar-name">{label(j)}</span>
            </div>
            <p className="jar-amount"><Amount>{fils(s[j] * TOKEN_VALUE)}</Amount></p>
            <div className="stepper">
              <button type="button" className="btn btn-step" onClick={() => { dispatch({ type: 'jars', a: { type: 'remove', jar: j } }); playEffect('tap', fx); }} disabled={s[j] === 0} aria-label={t(c.removeFrom, { jar: label(j) })}>−</button>
              <button type="button" className="btn btn-step btn-primary" onClick={() => { dispatch({ type: 'jars', a: { type: 'add', jar: j } }); playEffect(left === 1 ? 'success' : 'place', fx); }} disabled={left === 0} aria-label={t(c.addTo, { jar: label(j) })}>+</button>
            </div>
          </li>
        ))}
      </ul>
      <p className="conservation"><Amount>{t(c.totalCheck, { total: kwd(jarsTotalWithPool(s)) })}</Amount></p>
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => dispatch({ type: 'jars', a: { type: 'sample' } })}>{t(c.sample)}</button>
        <ResetButton label={t(ui.reset)} onClick={() => dispatch({ type: 'jars', a: { type: 'reset' } })} />
      </div>
      {s.spend === 5 && s.save === 4 && s.help === 1 ? <p className="muted small">{t(c.sampleNote)}</p> : null}
      <Feedback tone={jarsComplete(s) ? 'good' : 'info'}>{jarsComplete(s) ? doneText : left < 10 ? t(c.notReady) : null}</Feedback>
      <TokenLegend />
    </div>
  );
}
