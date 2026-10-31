import { useBook } from '../state/store';
import type { L10n, Locale } from '../content/schema';
import { fmt } from '../content/copy';
import { formatFils, formatKwd, formatDinars, type Fils } from '../lib/money';

export function useT() {
  const { state } = useBook();
  const locale: Locale = state.locale;
  return {
    locale,
    dir: locale === 'ar' ? ('rtl' as const) : ('ltr' as const),
    t: (s: L10n, vars?: Record<string, string | number>) => fmt(s[locale], vars),
    kwd: (f: Fils) => formatKwd(f, locale),
    fils: (f: Fils) => formatFils(f, locale),
    dinars: (f: Fils) => formatDinars(f, locale),
  };
}
