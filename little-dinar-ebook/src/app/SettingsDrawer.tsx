import { useState } from 'react';
import { Drawer } from './Drawer';
import { useT } from './i18n';
import { useBook } from '../state/store';
import { ui, diraya } from '../content/copy';
import { playEffect } from '../lib/audio';
import { clearSaved } from '../state/persistence';
import type { Settings } from '../state/store';

export function SettingsDrawer({ open, onClose, onOpenParents }: { open: boolean; onClose: () => void; onOpenParents: () => void }) {
  const { t } = useT();
  const { state, dispatch, storage } = useBook();
  const s = state.settings;
  const set = (patch: Partial<Settings>) => dispatch({ type: 'settings', patch });
  return (
    <Drawer id="settings" open={open} onClose={onClose} title={t(ui.settings)} side="end">
      <button type="button" className="btn settings-parents" onClick={onOpenParents}>{t(ui.parents)}</button>
      <section className="setting">
        <h3>{t(ui.sound)}</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={s.effects}
            onChange={(e) => { set({ effects: e.target.checked }); if (e.target.checked) playEffect('tap', true); }}
          />
          <span className="switch-track" aria-hidden="true" />
          <span>{t(ui.effects)}</span>
        </label>
        <h4>{t(ui.narration)}</h4>
        <p className="muted">{t(ui.narrationPending)}</p>
      </section>

      <section className="setting">
        <fieldset>
          <legend><h3>{t(ui.motion)}</h3></legend>
          {(['system', 'reduce', 'full'] as const).map((m) => (
            <label key={m} className="radio">
              <input type="radio" name="motion" checked={s.motion === m} onChange={() => set({ motion: m })} />
              <span>{t(m === 'system' ? ui.motionSystem : m === 'reduce' ? ui.motionReduce : ui.motionFull)}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="setting">
        <fieldset>
          <legend><h3>{t(ui.textSize)}</h3></legend>
          {(['normal', 'large'] as const).map((m) => (
            <label key={m} className="radio">
              <input type="radio" name="textsize" checked={s.textSize === m} onChange={() => set({ textSize: m })} />
              <span>{t(m === 'normal' ? ui.textNormal : ui.textLarge)}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="setting">
        <h3>{t(ui.remember)}</h3>
        <label className="switch">
          <input type="checkbox" checked={s.remember} disabled={storage === 'unavailable'} onChange={(e) => { set({ remember: e.target.checked }); if (!e.target.checked) clearSaved(); }} />
          <span className="switch-track" aria-hidden="true" />
          <span>{t(ui.remember)}</span>
        </label>
        <p className="muted">{t(ui.rememberHelp)}</p>
        {storage === 'unavailable' ? <p className="notice" role="status">{t(ui.storageUnavailable)}</p> : null}
        {storage === 'corrupt' ? <p className="notice" role="status">{t(ui.storageReset)}</p> : null}
      </section>

      <ResetProgress onDone={onClose} />

      <section className="setting about">
        <h3>{t(ui.about)}</h3>
        <p><strong>{t(ui.bookTitle)}</strong>. {t(diraya.presentedBy)}.</p>
        <p className="muted">{t(diraya.short)}</p>
      </section>
    </Drawer>
  );
}

export function ResetProgress({ onDone }: { onDone?: () => void }) {
  const { t } = useT();
  const { dispatch } = useBook();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <section className="setting">
      {!confirm ? (
        <button type="button" className="btn btn-quiet" onClick={() => { setConfirm(true); setDone(false); }}>{t(ui.resetProgress)}</button>
      ) : (
        <div className="confirm" role="group" aria-label={t(ui.resetProgress)}>
          <p>{t(ui.resetConfirm)}</p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={() => { clearSaved(); dispatch({ type: 'resetAll' }); setConfirm(false); setDone(true); onDone?.(); }}>{t(ui.resetYes)}</button>
            <button type="button" className="btn" onClick={() => setConfirm(false)}>{t(ui.resetNo)}</button>
          </div>
        </div>
      )}
      <p role="status" className="muted">{done ? t(ui.resetDone) : ''}</p>
    </section>
  );
}
