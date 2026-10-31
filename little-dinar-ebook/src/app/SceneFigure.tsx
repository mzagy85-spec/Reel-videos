import { Component, lazy, memo, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import type { SceneRef } from '../content/schema';
import { useT } from './i18n';
import { ui } from '../content/copy';
import { LogoOverlay, BRANCH_SIGN } from './LogoOverlay';

const VIEWBOX = { wide: '0 0 1200 900', tall: '150 100 900 800' };

// Scene art is a separate chunk so the reader is usable before illustrations arrive.
const SceneArt = lazy(() => import('../illustrations/scenes').then((m) => ({ default: m.SceneArt })));
let preloaded = false;
export function preloadScenes() {
  if (preloaded) return;
  preloaded = true;
  void import('../illustrations/scenes');
}

export function useIsNarrow() {
  const q = '(max-width: 760px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(q);
    if (!mq) return;
    const on = () => setNarrow(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return narrow;
}

class ArtBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/** Illustration with text alternative. Ambient motion pauses when the figure is off screen. */
/** crop 'auto': portrait 9:8 crop (used in the reading spread at every width). 'cover': 4:3 on wide screens. */
export const SceneFigure = memo(function SceneFigure({ scene, alt, className, crop = 'auto' }: { scene: SceneRef; alt: string; className?: string; crop?: 'auto' | 'cover' }) {
  // Every view shows the full 4:3 canvas: the portrait crop cut characters off at the edges in some scenes.
  void crop;
  const narrow = false;
  const ref = useRef<HTMLElement>(null);
  const { t } = useT();
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => { el.dataset.visible = e.isIntersecting ? 'true' : 'false'; }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} className={`scene ${narrow ? 'crop-tall' : 'crop-wide'} ${className ?? ''}`} role="img" aria-label={alt} data-visible="true">
      <ArtBoundary fallback={<div className="scene-fallback"><p>{t(ui.imageMissing)}</p></div>}>
        <Suspense fallback={<div className="scene-placeholder" aria-hidden="true" />}>
          <SceneArt id={scene} crop={narrow ? 'tall' : 'wide'} />
          {scene === 'bank-branch' ? <LogoOverlay slice viewBox={narrow ? VIEWBOX.tall : VIEWBOX.wide} {...BRANCH_SIGN} /> : null}
        </Suspense>
      </ArtBoundary>
    </figure>
  );
});
