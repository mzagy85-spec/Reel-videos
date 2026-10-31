// neo brand elements. All artwork is supplied material used as is:
//  - neo-logo: "neo / من بنك الخليج" logo from the 2023 neo presentation (white background keyed out, not redrawn)
//  - neo-shapes: the geometric shape pattern from the same presentation (brand element, option 1)
//  - neo-character: the neo character cut out of the supplied "neo premiere" banner (background removed only)
// Do not recolour, redraw or animate parts of these. Replace neo-character with the approved master file
// when available (see docs/media-pending.md); the components need no change.

import neoLogo from '../assets/neo/neo-logo.webp';
import neoShapes from '../assets/neo/neo-shapes.webp';
import neoCharacter from '../assets/neo/neo-character.webp';
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
  return <img className={`neo-character ${className ?? ''}`} src={neoCharacter} width={288} height={293} alt={t(neoCopy.characterAlt)} decoding="async" />;
}

/** neo with a speech bubble. Renders nothing on pages without a guide line or when neo is switched off. */
export function NeoGuide({ pageId }: { pageId: PageId }) {
  const { t } = useT();
  const line = neoGuide[pageId];
  if (!neoConfig.enabled || !line) return null;
  return (
    <aside className="neo-guide" aria-label={t(neoCopy.says)}>
      <NeoCharacter />
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
      {neoConfig.showAccountFacts ? <p className="neo-intro-note">{t(neoIntro.note)}</p> : null}
    </section>
  );
}
