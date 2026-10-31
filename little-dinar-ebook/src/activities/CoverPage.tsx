import { useEffect, useState } from 'react';
import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { ui, diraya } from '../content/copy';
import { SceneFigure, preloadScenes } from '../app/SceneFigure';
import { LanguageSelector } from '../app/LanguageSwitch';
import { BrandArrow } from '../app/Brand';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';
import { NeoGuide, NeoIntro } from '../app/Neo';

/** Page 1 of 15. Not a splash screen: it is a numbered page with the real controls. */
export function CoverPage({ page, onGo }: ActivityProps) {
  const { t, dir } = useT();
  const { state, dispatch } = useBook();
  const [revealing, setRevealing] = useState(true);
  useEffect(() => {
    preloadScenes();
    const id = window.setTimeout(() => setRevealing(false), 1100);
    return () => window.clearTimeout(id);
  }, []);
  const effects = state.settings.effects;
  return (
    <article className={`page cover ${revealing ? 'is-revealing' : 'is-revealed'}`} aria-labelledby="page-heading">
      <div className="cover-band">
        <BrandArrow kind="blue-grey" className="cover-arrow cover-arrow-a" />
        <div className="cover-title-block">
          <p className="cover-kicker"><span className="visually-hidden">{t(ui.pageOf, { n: 1, total: 15 })}. </span>{t(diraya.short)}</p>
          <h1 id="page-heading" tabIndex={-1}>{t(page.title)}</h1>
          <p className="cover-subtitle">{t(ui.subtitle)}</p>
        </div>
      </div>
      <div className="cover-body">
        <div className="cover-art">
          <SceneFigure scene={page.scene.id} alt={t(page.scene.alt)} crop="cover" />
        </div>
        <div className="cover-panel">
          <p className="story">{t(page.story)}</p>
          <NeoGuide pageId="cover" />
          <LanguageSelector />
          <div className="cover-actions">
            <button type="button" className="btn btn-primary btn-large" onClick={() => onGo(2)}>
              <span>{t(ui.start)}</span>
              <Icon name={dir === 'rtl' ? 'prev' : 'next'} />
            </button>
            <button
              type="button"
              className="btn sound-toggle"
              aria-pressed={effects}
              onClick={() => { dispatch({ type: 'settings', patch: { effects: !effects } }); if (!effects) playEffect('tap', true); }}
            >
              <Icon name={effects ? 'soundOn' : 'soundOff'} />
              <span>{effects ? t(ui.soundOn) : t(ui.soundOff)}</span>
            </button>
          </div>
          <p className="muted small">{t(page.instruction)}</p>
          <NeoIntro />
        </div>
      </div>
      {revealing ? (
        <button type="button" className="skip-reveal btn btn-small" onClick={() => setRevealing(false)}>{t(ui.skipReveal)}</button>
      ) : null}
    </article>
  );
}
