import { useEffect, useRef, type ReactNode } from 'react';
import { useT } from './i18n';
import { ui } from '../content/copy';
import { Icon } from './Icons';

/** Modal drawer built on <dialog>, which gives focus containment, Escape to close and focus return. */
export function Drawer({ open, onClose, title, children, side = 'start', id }: { open: boolean; onClose: () => void; title: string; children: ReactNode; side?: 'start' | 'end'; id: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useT();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      try { d.showModal(); } catch { d.setAttribute('open', ''); }
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`drawer drawer-${side}`}
      aria-labelledby={`${id}-title`}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="drawer-inner">
        <div className="drawer-head">
          <h2 id={`${id}-title`}>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t(ui.close)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">{open ? children : null}</div>
      </div>
    </dialog>
  );
}
