// Gulf Bank identity elements. The logo files are the supplied vector artwork (GB_logo.pdf) cropped to their
// bounds with paths and colours untouched. Never recolour, filter, rotate, mirror, animate or box the logo.

import logoColour from '../assets/brand/gb-logo-colour.svg';
import logoWhite from '../assets/brand/gb-logo-white.svg';
import arrowsBlueGrey from '../assets/brand/arrows-double-blue-grey.webp';
import arrowsRed from '../assets/brand/arrows-double-red.webp';
import arrowUpRed from '../assets/brand/arrow-up-red.webp';
import arrowsRedBlue from '../assets/brand/arrows-red-blue.webp';
import { useT } from './i18n';

export function Logo({ variant, className }: { variant: 'colour' | 'white'; className?: string }) {
  const { locale } = useT();
  return (
    <img
      className={`gb-logo ${className ?? ''}`}
      src={variant === 'colour' ? logoColour : logoWhite}
      alt={locale === 'ar' ? 'بنك الخليج' : 'Gulf Bank'}
      width={566}
      height={100}
      decoding="async"
    />
  );
}

const ARROWS = {
  'blue-grey': { src: arrowsBlueGrey, w: 358, h: 304 },
  red: { src: arrowsRed, w: 228, h: 244 },
  'up-red': { src: arrowUpRed, w: 486, h: 197 },
  'red-blue': { src: arrowsRedBlue, w: 238, h: 415 },
} as const;

/** Approved brand-arrow artwork (extracted from Brand Guidelines PDF page 18). Points right or up only,
 *  in both languages: it is decoration, not navigation, so it is never mirrored in Arabic. */
export function BrandArrow({ kind, className }: { kind: keyof typeof ARROWS; className?: string }) {
  const a = ARROWS[kind];
  return <img className={`brand-arrow ${className ?? ''}`} src={a.src} width={a.w} height={a.h} alt="" aria-hidden="true" decoding="async" />;
}
