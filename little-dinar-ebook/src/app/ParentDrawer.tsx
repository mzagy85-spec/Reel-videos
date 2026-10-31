import { Drawer } from './Drawer';
import { useT } from './i18n';
import { parent, glossary, diraya, ui } from '../content/copy';
import { sources } from '../content/sources';
import { ResetProgress } from './SettingsDrawer';
import { printBook } from './PrintEdition';
import { useState } from 'react';
import { NeoParentInfo } from './Neo';
import { neoConfig, neoCopy } from '../content/neo';

export function ParentDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useT();
  const [printMsg, setPrintMsg] = useState('');
  return (
    <Drawer id="parents" open={open} onClose={onClose} title={t(parent.title)} side="end">
      <p>{t(parent.intro)}</p>

      <h3>{t(parent.howTo)}</h3>
      <ul className="bullets">
        <li>{t(parent.tip1)}</li>
        <li>{t(parent.tip2)}</li>
        <li>{t(parent.tip3)}</li>
        <li>{t(parent.tip4)}</li>
      </ul>
      <p className="muted">{t(parent.notEndorsed)}</p>

      <h3>{t(parent.campaignTitle)}</h3>
      <p className="diraya-full">{t(diraya.full)}</p>

      <NeoParentInfo />

      <h3>{t(parent.privacyTitle)}</h3>
      <p>{t(parent.privacy)}</p>

      <h3>{t(parent.accessibilityTitle)}</h3>
      <p>{t(parent.accessibility)}</p>

      <h3>{t(parent.audioTitle)}</h3>
      <p>{t(parent.audio)}</p>

      <h3>{t(parent.glossaryTitle)}</h3>
      <dl className="glossary">
        {[...glossary, ...(neoConfig.enabled ? [{ term: neoCopy.glossaryTerm, def: neoCopy.glossaryDef }] : [])].map((g) => (
          <div key={g.term.en}>
            <dt>{t(g.term)}</dt>
            <dd>{t(g.def)}</dd>
          </div>
        ))}
      </dl>

      <h3>{t(parent.printTitle)}</h3>
      <p className="muted">{t(ui.printNote)}</p>
      <button type="button" className="btn" onClick={() => { const ok = printBook(); setPrintMsg(ok ? '' : t(ui.printUnavailable)); }}>{t(ui.print)}</button>
      <p role="status" className="muted">{printMsg}</p>

      <h3>{t(parent.sourcesTitle)}</h3>
      <p className="muted">{t(parent.sourcesNote)}</p>
      <ul className="sources">
        {sources.map((s) => (
          <li key={s.id}>
            <span>{t(s.claim)}</span>
            <bdi className="source-ref" dir="ltr" lang="en">{s.ref}</bdi>
            <span className="muted"> · {locale === 'ar' ? 'المراجعة' : 'Reviewed'}: <bdi dir="ltr">{s.reviewed}</bdi></span>
          </li>
        ))}
      </ul>

      <ResetProgress onDone={onClose} />
    </Drawer>
  );
}
