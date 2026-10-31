import { useBook } from '../state/store';
import { useT } from './i18n';
import { ui } from '../content/copy';
import { Icon } from './Icons';

/** Switches language in place. Page, activity state, settings and progress are shared, so nothing resets. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { state, dispatch } = useBook();
  const { t } = useT();
  const other = state.locale === 'ar' ? 'en' : 'ar';
  return (
    <button
      type="button"
      className={`tool-btn lang-btn ${className ?? ''}`}
      onClick={() => dispatch({ type: 'locale', locale: other })}
      aria-label={t(ui.switchToOtherLabel)}
      lang={other}
    >
      <Icon name="globe" />
      <span lang={other} className="lang-long">{t(ui.switchToOther)}</span>
      <span lang={other} className="lang-short" aria-hidden="true">{other === 'en' ? 'EN' : 'ع'}</span>
    </button>
  );
}

/** Explicit two-option selector used on the cover. */
export function LanguageSelector() {
  const { state, dispatch } = useBook();
  const { t } = useT();
  return (
    <fieldset className="lang-selector">
      <legend>{t(ui.language)}</legend>
      <div className="seg">
        <button type="button" lang="ar" aria-pressed={state.locale === 'ar'} onClick={() => dispatch({ type: 'locale', locale: 'ar' })}>العربية</button>
        <button type="button" lang="en" aria-pressed={state.locale === 'en'} onClick={() => dispatch({ type: 'locale', locale: 'en' })}>English</button>
      </div>
    </fieldset>
  );
}
