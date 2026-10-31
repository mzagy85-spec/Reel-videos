import { useEffect, useState, type JSX } from 'react';
import { flushSync } from 'react-dom';
import { pages } from '../content/pages';
import { useT } from './i18n';
import { ui, diraya } from '../content/copy';
import { Logo } from './Brand';
import type { SceneRef } from '../content/schema';

// Static 15-page print edition in the current language: one numbered book page per printed page.
// Activities become their written instruction. Print cannot keep the interactions; the note says so.

type SceneComp = (p: { id: SceneRef; crop: 'wide' | 'tall' }) => JSX.Element;
let requestPrint: ((withArt: boolean) => void) | null = null;

export function printBook(): boolean {
  if (typeof window.print !== 'function' || !requestPrint) return false;
  requestPrint(true);
  return true;
}

export function printCard(): boolean {
  if (typeof window.print !== 'function') return false;
  document.documentElement.dataset.print = 'card';
  const done = () => { delete document.documentElement.dataset.print; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  window.setTimeout(done, 1500);
  return true;
}

export function PrintEdition() {
  const { t, dir, locale } = useT();
  const [active, setActive] = useState(false);
  const [Scene, setScene] = useState<SceneComp | null>(null);

  useEffect(() => {
    requestPrint = (withArt) => {
      const run = () => {
        flushSync(() => setActive(true));
        document.documentElement.dataset.print = 'book';
        requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
      };
      if (withArt && !Scene) {
        import('../illustrations/scenes').then((m) => { flushSync(() => setScene(() => m.SceneArt as SceneComp)); run(); }).catch(run);
      } else run();
    };
    // Browser menu printing (Ctrl/Cmd+P) also gets the book edition, text-first.
    const before = () => {
      if (document.documentElement.dataset.print === 'card') return;
      document.documentElement.dataset.print = 'book';
      flushSync(() => setActive(true));
    };
    const after = () => { if (document.documentElement.dataset.print === 'book') delete document.documentElement.dataset.print; };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => { requestPrint = null; window.removeEventListener('beforeprint', before); window.removeEventListener('afterprint', after); };
  }, [Scene]);

  if (!active) return null;
  return (
    <div className="print-edition" dir={dir} lang={locale} aria-hidden="true">
      {pages.map((p) => (
        <section key={p.pageId} className="print-page">
          <header className="print-head">
            <span className="print-num">{t(ui.pageOf, { n: p.number, total: 15 })}</span>
            <Logo variant="colour" className="print-logo" />
          </header>
          <h2>{t(p.title)}</h2>
          {Scene ? <div className="print-art"><Scene id={p.scene.id} crop="wide" /></div> : <p className="print-alt">{t(p.scene.alt)}</p>}
          <p className="print-story">{t(p.story)}</p>
          {p.explain ? <p className="print-explain">{t(p.explain)}</p> : null}
          <p className="print-activity"><strong>{t(ui.printActivity)}:</strong> {t(p.instruction)}</p>
          {p.learningExamples ? <p className="print-small">{t(ui.learningExamplesNote)}</p> : null}
          {p.number === 1 ? <p className="print-small">{t(diraya.short)}</p> : null}
          {p.number === 15 ? <p className="print-small">{t(diraya.full)}</p> : null}
          <p className="print-small">{t(ui.printNote)}</p>
        </section>
      ))}
    </div>
  );
}
