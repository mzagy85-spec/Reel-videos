import { useEffect, useState } from 'react';
import type { PageRecord } from '../content/schema';
import { useT } from './i18n';
import { ui } from '../content/copy';
import { Icon } from './Icons';
import { playNarration, stopNarration } from '../lib/audio';

/**
 * Read-aloud for the current page. Rendered only when an approved recording exists for this page and
 * language (content: narrationAudio). Until recordings are supplied there is no dead control; the
 * Settings drawer explains that narration is pending.
 */
export function NarrationControls({ page }: { page: PageRecord }) {
  const { t, locale } = useT();
  const [playing, setPlaying] = useState(false);
  const src = page.narrationAudio[locale];
  useEffect(() => () => stopNarration(), []);
  useEffect(() => { setPlaying(false); stopNarration(); }, [locale, page.pageId]);
  if (!src) return null;
  const url = `${import.meta.env.BASE_URL}${src}`;
  return (
    <button
      type="button"
      className="btn btn-small narration-btn"
      aria-pressed={playing}
      onClick={() => {
        if (playing) { stopNarration(); setPlaying(false); }
        else { setPlaying(true); playNarration(url, () => setPlaying(false)); }
      }}
    >
      <Icon name={playing ? 'stop' : 'play'} size={20} />
      <span>{playing ? t(ui.narrationStop) : t(ui.narrationPlay)}</span>
    </button>
  );
}
