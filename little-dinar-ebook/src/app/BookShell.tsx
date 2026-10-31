import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBook } from '../state/store';
import { useT } from './i18n';
import { pages, TOTAL_PAGES } from '../content/pages';
import { ui } from '../content/copy';
import { Icon } from './Icons';
import { PageRenderer } from './PageRenderer';
import { ContentsDrawer } from './ContentsDrawer';
import { SettingsDrawer } from './SettingsDrawer';
import { ParentDrawer } from './ParentDrawer';
import { LanguageSwitch } from './LanguageSwitch';
import { Logo } from './Brand';
import { listenToHost, readHostConfig, sendToHost } from '../lib/host';
import { playEffect, stopNarration, suspendAll } from '../lib/audio';
import { PrintEdition } from './PrintEdition';

export type DrawerId = 'contents' | 'settings' | 'parents' | null;

function pageFromHash(): number | null {
  const m = /^#\/page\/(\d{1,2})$/.exec(window.location.hash);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= TOTAL_PAGES ? n : null;
}

export function BookShell() {
  const { state, dispatch } = useBook();
  const { t, locale, dir } = useT();
  const [drawer, setDrawer] = useState<DrawerId>(null);
  const [announce, setAnnounce] = useState('');
  const userNavigated = useRef(false);
  const host = useMemo(() => readHostConfig(), []);
  const page = pages[state.page - 1];

  // Document language, direction and display preferences.
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = dir;
    html.dataset.text = state.settings.textSize;
    document.title = `${t(ui.bookTitle)} · ${t(page.title)}`;
  }, [locale, dir, state.settings.textSize, page, t]);

  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const reduce = state.settings.motion === 'reduce' || (state.settings.motion === 'system' && !!mq?.matches);
      html.dataset.motion = reduce ? 'reduce' : 'full';
    };
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, [state.settings.motion]);

  // Refresh-safe navigation: the page lives in the URL hash (#/page/7), so it works under any sub-path
  // without server rewrites. replaceState keeps the host app's back button from stepping through 15 pages.
  useEffect(() => {
    const fromHash = pageFromHash();
    if (fromHash && fromHash !== state.page) dispatch({ type: 'goto', page: fromHash });
    const onHash = () => {
      const n = pageFromHash();
      if (n) { userNavigated.current = true; dispatch({ type: 'goto', page: n }); }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const want = `#/page/${state.page}`;
    if (window.location.hash !== want) {
      try { history.replaceState(null, '', want); } catch { window.location.hash = want; }
    }
    stopNarration();
    sendToHost(host, { type: 'ld:page-change', pageId: page.pageId, pageNumber: page.number, locale });
    if (userNavigated.current) {
      setAnnounce(t(ui.pageLoaded, { n: page.number, title: t(page.title) }));
      window.scrollTo({ top: 0, behavior: 'auto' });
      requestAnimationFrame(() => document.getElementById('page-heading')?.focus({ preventScroll: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.page]);

  useEffect(() => { stopNarration(); }, [locale]);

  // Host integration: ready event, inbound locale/motion, pause when hidden.
  useEffect(() => {
    sendToHost(host, { type: 'ld:ready', version: 1, locale });
    const off = listenToHost(host, (m) => {
      if (m.type === 'ld:set-locale') dispatch({ type: 'locale', locale: m.locale });
      if (m.type === 'ld:set-motion') dispatch({ type: 'settings', patch: { motion: m.motion } });
    });
    const onVis = () => {
      document.documentElement.dataset.hidden = document.hidden ? 'true' : 'false';
      if (document.hidden) suspendAll();
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', suspendAll);
    return () => { off(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('pagehide', suspendAll); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback((n: number) => {
    if (n < 1 || n > TOTAL_PAGES) return;
    userNavigated.current = true;
    playEffect('page', state.settings.effects);
    dispatch({ type: 'goto', page: n });
  }, [dispatch, state.settings.effects]);

  // Keyboard page turning only when focus is not inside an input or activity control.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (drawer || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [role="grid"], .no-page-keys')) return;
      if (e.key === 'PageDown') { e.preventDefault(); go(state.page + 1); }
      if (e.key === 'PageUp') { e.preventDefault(); go(state.page - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer, go, state.page]);

  const stampCount = Object.keys(state.concepts).length;

  return (
    <div className={`book page-${page.pageId}`} data-page={page.number}>
      <a className="skip-link" href="#page-heading" onClick={(e) => { e.preventDefault(); document.getElementById('page-heading')?.focus(); }}>{t(ui.skipToContent)}</a>
      <header className="topbar">
        <div className="topbar-tools">
          <button type="button" className="tool-btn" onClick={() => setDrawer('contents')} aria-haspopup="dialog">
            <Icon name="contents" /><span>{t(ui.contents)}</span>
          </button>
          <LanguageSwitch />
          <button type="button" className="tool-btn" onClick={() => setDrawer('settings')} aria-haspopup="dialog">
            <Icon name={state.settings.effects ? 'soundOn' : 'settings'} /><span>{t(ui.settings)}</span>
          </button>
          <button type="button" className="tool-btn tool-parents" onClick={() => setDrawer('parents')} aria-haspopup="dialog">
            <Icon name="parents" /><span>{t(ui.parents)}</span>
          </button>
          {host.showCloseButton ? (
            <button type="button" className="tool-btn" onClick={() => sendToHost(host, { type: 'ld:close-request' })}>
              <Icon name="close" /><span>{t(ui.closeBook)}</span>
            </button>
          ) : null}
        </div>
        <div className="topbar-brand">
          <Logo variant="colour" />
        </div>
      </header>

      <main className="book-main" id="main">
        <PageRenderer key={page.pageId} page={page} onGo={go} />
      </main>

      <nav className="pager" aria-label={locale === 'ar' ? 'التنقل بين الصفحات' : 'Page navigation'}>
        <button type="button" className="pager-btn" onClick={() => go(state.page - 1)} disabled={state.page === 1} aria-label={t(ui.previous)}>
          <Icon name={dir === 'rtl' ? 'next' : 'prev'} /><span>{t(ui.prevShort)}</span>
        </button>
        <div className="pager-status">
          <span className="pager-count">{t(ui.pageOf, { n: state.page, total: TOTAL_PAGES })}</span>
          <span className="pager-dots" aria-hidden="true">
            {pages.map((p) => <span key={p.pageId} className={`dot ${p.number === state.page ? 'is-current' : ''} ${state.concepts[p.concept] && p.number !== 1 ? 'is-stamped' : ''}`} />)}
          </span>
          <span className="visually-hidden">{t(ui.stamps)}: {t(ui.stampsCount, { n: stampCount, total: 14 })}</span>
        </div>
        <button type="button" className="pager-btn pager-next" onClick={() => go(state.page + 1)} disabled={state.page === TOTAL_PAGES} aria-label={t(ui.next)}>
          <span>{t(ui.nextShort)}</span><Icon name={dir === 'rtl' ? 'prev' : 'next'} />
        </button>
      </nav>

      <div className="visually-hidden" aria-live="polite" aria-atomic="true">{announce}</div>

      <ContentsDrawer open={drawer === 'contents'} onClose={() => setDrawer(null)} onGo={(n) => { setDrawer(null); go(n); }} />
      <SettingsDrawer open={drawer === 'settings'} onClose={() => setDrawer(null)} onOpenParents={() => setDrawer('parents')} />
      <ParentDrawer open={drawer === 'parents'} onClose={() => setDrawer(null)} />
      <PrintEdition />
    </div>
  );
}
