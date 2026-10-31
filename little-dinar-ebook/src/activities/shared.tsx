import type { ReactNode } from 'react';
import { Icon } from '../app/Icons';
import { useT } from '../app/i18n';
import { tokens as tokenCopy } from '../content/copy';

/** One polite status region per activity. Tone is shown with an icon and words, never colour alone. */
export function Feedback({ tone, children, id }: { tone: 'good' | 'try' | 'info'; children?: ReactNode; id?: string }) {
  return (
    <div className={`feedback tone-${tone} ${children ? 'has-text' : ''}`} role="status" aria-live="polite" id={id}>
      {children ? (
        <>
          <span className="feedback-icon" aria-hidden="true">
            <Icon name={tone === 'good' ? 'check' : tone === 'try' ? 'bulb' : 'info'} size={20} />
          </span>
          <span>{children}</span>
        </>
      ) : null}
    </div>
  );
}

/** Isolates an amount so digits and currency read correctly inside Arabic or English text. */
export function Amount({ children }: { children: ReactNode }) {
  return <bdi className="amount">{children}</bdi>;
}

/** Educational value token. Clearly labelled; deliberately not a picture of a real coin. */
export function Token({ value, size = 'md', ghost = false }: { value: 100 | 50; size?: 'sm' | 'md'; ghost?: boolean }) {
  const { t } = useT();
  return (
    <span className={`token token-${value} token-${size} ${ghost ? 'is-ghost' : ''}`} aria-hidden="true">
      <span className="token-face">
        <span className="token-num">{value}</span>{' '}
        <span className="token-unit">{t({ ar: 'فلس', en: 'fils' })}</span>
      </span>
    </span>
  );
}

export function TokenLegend() {
  const { t } = useT();
  return <p className="token-legend"><Icon name="info" size={16} /> {t(tokenCopy.tokenNote)}</p>;
}

export function ResetButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="btn btn-quiet btn-small" onClick={onClick}>
      <Icon name="reset" size={18} />
      <span>{label}</span>
    </button>
  );
}
