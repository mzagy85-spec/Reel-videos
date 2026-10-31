// neo brand elements. All artwork is supplied material used as is (backgrounds removed, nothing redrawn):
//  - neo-logo: "neo / من بنك الخليج" logo from the 2023 neo presentation
//  - neo-shapes: the geometric shape pattern from the same presentation (brand element, option 1)
//  - neo-character: the official standing neo supplied by Gulf Bank
//  - neo-card-red / neo-card-blue: the official neo debit card designs supplied by Gulf Bank
//  - neo-card-show: the official animation of neo presenting the cards (played once; still frame with reduced motion)
// Do not recolour, redraw, crop into or animate parts of these.

import neoLogo from '../assets/neo/neo-logo.webp';
import neoShapes from '../assets/neo/neo-shapes.webp';
import neoCharacter from '../assets/neo/neo-character.webp';
import neoCardRed from '../assets/neo/neo-card-red.webp';
import neoCardBlue from '../assets/neo/neo-card-blue.webp';
import neoCardShow from '../assets/neo/neo-card-show.webp';
import neoCardShowStill from '../assets/neo/neo-card-show-still.webp';
import { useEffect, useState } from 'react';
import { useBook } from '../state/store';
import { useT } from './i18n';
import { neoConfig, neoCopy, neoGuide, neoIntro } from '../content/neo';
import { CircleIcon } from './Icons';
import type { PageId } from '../content/schema';

export function NeoLogo({ className }: { className?: string }) {
  const { t } = useT();
  return <img className={`neo-logo ${className ?? ''}`} src={neoLogo} width={480} height={305} alt={t(neoCopy.logoAlt)} decoding="async" />;
}

export function NeoShapes({ className }: { className?: string }) {
  return <img className={`neo-shapes ${className ?? ''}`} src={neoShapes} width={900} height={264} alt="" aria-hidden="true" decoding="async" />;
}

export function NeoCharacter({ className }: { className?: string }) {
  const { t } = useT();
  return <img className={`neo-character ${className ?? ''}`} src={neoCharacter} width={373} height={480} alt={t(neoCopy.characterAlt)} decoding="async" />;
}

/** The two official neo debit card designs, side by side. */
export function NeoCards({ className }: { className?: string }) {
  const { t } = useT();
  return (
    <span className={`neo-cards ${className ?? ''}`} role="img" aria-label={t(neoCopy.cardsAlt)}>
      <img src={neoCardRed} width={240} height={378} alt="" decoding="async" />
      <img src={neoCardBlue} width={240} height={378} alt="" decoding="async" />
    </span>
  );
}

function useReducedMotion() {
  const { state } = useBook();
  const [sys, setSys] = useState(() => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const on = () => setSys(!!mq?.matches);
    mq?.addEventListener?.('change', on);
    return () => mq?.removeEventListener?.('change', on);
  }, []);
  return state.settings.motion === 'reduce' || (state.settings.motion === 'system' && sys);
}

/** neo presenting the cards. The 4-second animation plays once (no endless loop) and can be replayed.
 *  With reduced motion, or when the page is hidden, only the still frame is shown. */
export function NeoCardShow() {
  const { t } = useT();
  const reduce = useReducedMotion();
  const [play, setPlay] = useState(1);
  const animated = !reduce;
  return (
    <span className="neo-card-show">
      <img
        className="neo-character neo-character-card"
        src={animated ? `${neoCardShow}?play=${play}` : neoCardShowStill}
        width={340}
        height={285}
        alt={t(neoCopy.cardShowAlt)}
        decoding="async"
      />
      {animated ? (
        <button type="button" className="btn btn-small btn-quiet neo-replay" onClick={() => setPlay((n) => n + 1)}>{t(neoCopy.replay)}</button>
      ) : null}
    </span>
  );
}

/** neo with a speech bubble. Renders nothing on pages without a guide line or when neo is switched off. */
export function NeoGuide({ pageId }: { pageId: PageId }) {
  const { t } = useT();
  const line = neoGuide[pageId];
  if (!neoConfig.enabled || !line) return null;
  return (
    <aside className={`neo-guide ${pageId === 'card-atm' ? 'neo-guide-card' : ''}`} aria-label={t(neoCopy.says)}>
      {pageId === 'card-atm' ? <NeoCardShow /> : <NeoCharacter />}
      <p className="neo-bubble">{t(line)}</p>
    </aside>
  );
}

/** Page 9: a child-level introduction to the neo account. No terms and no call to open. */
export function NeoMeetPanel() {
  const { t, locale } = useT();
  if (!neoConfig.enabled) return null;
  return (
    <section className="neo-panel" aria-labelledby="neo-meet-title">
      <NeoShapes className="neo-panel-shapes" />
      <div className="neo-panel-body">
        <NeoCharacter className="neo-panel-character" />
        <div>
          <NeoLogo className="neo-panel-logo" />
          <h3 id="neo-meet-title">{t(neoCopy.meetTitle)}</h3>
          <p>{t(neoCopy.meetText)}</p>
          <p className="neo-ask">{t(neoCopy.meetAsk)}</p>
          {locale === 'ar' ? <p className="neo-tagline" lang="ar">{neoCopy.taglineAr}</p> : null}
        </div>
      </div>
    </section>
  );
}

/** Parent-facing product information. Shown in the parent drawer and the page 15 closing area. */
export function NeoParentInfo({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const { t } = useT();
  if (!neoConfig.enabled) return null;
  const H = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <section className="neo-parent" aria-label={t(neoCopy.parentTitle)}>
      <div className="neo-parent-head">
        <NeoLogo className="neo-parent-logo" />
        <H>{t(neoCopy.parentTitle)}</H>
      </div>
      <p>{t(neoCopy.parentIntro)}</p>
      {neoConfig.showAccountFacts ? (
        <>
          <p className="neo-facts-title"><strong>{t(neoCopy.factsTitle)}</strong></p>
          <ul className="neo-facts">
            {neoCopy.facts.map((f) => <li key={f.en}><bdi>{t(f)}</bdi></li>)}
          </ul>
          <NeoCards className="neo-parent-cards" />
          <p className="muted small">{t(neoCopy.factsNote)}</p>
        </>
      ) : null}
      <p className="muted small">{t(neoCopy.optional)}</p>
      <p className="small">{t(neoCopy.moreInfo)}: <bdi className="source-ref" dir="ltr" lang="en">{neoCopy.url}</bdi></p>
    </section>
  );
}

/** Cover introduction: what the neo account is and its features, in plain language. No call to open. */
export function NeoIntro() {
  const { t } = useT();
  if (!neoConfig.enabled) return null;
  const items = neoIntro.features.filter((f) => neoConfig.showAccountFacts || !f.fact);
  return (
    <section className="neo-intro" aria-labelledby="neo-intro-title">
      <div className="neo-intro-head">
        <NeoLogo className="neo-intro-logo" />
        <div>
          <h2 id="neo-intro-title">{t(neoIntro.title)}</h2>
          <p className="neo-intro-lead">{t(neoIntro.lead)}</p>
        </div>
      </div>
      <ul className="neo-features" role="list">
        {items.map((f) => (
          <li key={f.text.en}>
            <CircleIcon name={f.icon} size={36} />
            <span><bdi>{t(f.text)}</bdi></span>
          </li>
        ))}
      </ul>
      {neoConfig.showAccountFacts ? <NeoCards className="neo-intro-cards" /> : null}
      {neoConfig.showAccountFacts ? <p className="neo-intro-note">{t(neoIntro.note)}</p> : null}
    </section>
  );
}
