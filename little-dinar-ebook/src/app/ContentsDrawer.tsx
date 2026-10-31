import { Drawer } from './Drawer';
import { useT } from './i18n';
import { useBook } from '../state/store';
import { pages } from '../content/pages';
import { ui } from '../content/copy';
import { Icon } from './Icons';

export function ContentsDrawer({ open, onClose, onGo }: { open: boolean; onClose: () => void; onGo: (n: number) => void }) {
  const { t } = useT();
  const { state } = useBook();
  return (
    <Drawer id="contents" open={open} onClose={onClose} title={t(ui.contents)}>
      <ol className="toc">
        {pages.map((p) => {
          const stamped = p.number > 1 && !!state.concepts[p.concept];
          return (
            <li key={p.pageId}>
              <button type="button" className={`toc-item ${p.number === state.page ? 'is-current' : ''}`} onClick={() => onGo(p.number)} aria-current={p.number === state.page ? 'page' : undefined}>
                <span className="toc-num">{p.number}</span>
                <span className="toc-label">{t(p.navLabel)}</span>
                {stamped ? <span className="toc-stamp"><Icon name="star" size={20} /><span className="visually-hidden">{t(ui.stampEarned)}</span></span> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </Drawer>
  );
}
