// Two-colour line icons (corporate blue strokes with red accents) following the website/app icon style
// on Brand Guidelines PDF page 19. Original drawings for this book; they are not copies of bank icons.
// Decorative by default (aria-hidden); every icon is always paired with a visible text label.

import type { ReactNode } from 'react';

export type IconName =
  | 'spend' | 'save' | 'help' | 'home' | 'store' | 'bank' | 'towers' | 'waterfront' | 'park'
  | 'account' | 'balance' | 'payment' | 'card' | 'atm' | 'shield' | 'book' | 'art' | 'ball'
  | 'contents' | 'settings' | 'parents' | 'soundOn' | 'soundOff' | 'globe' | 'next' | 'prev'
  | 'close' | 'check' | 'star' | 'print' | 'download' | 'bulb' | 'reset' | 'wallet' | 'list'
  | 'grid' | 'map' | 'play' | 'stop' | 'gift' | 'hands' | 'tool' | 'tea' | 'target' | 'receipt' | 'info';

const B = 'var(--icon-blue, #00248F)';
const R = 'var(--icon-red, #CE0000)';

const paths: Record<IconName, ReactNode> = {
  spend: (<><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" stroke={B} /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke={R} /></>),
  save: (<><rect x="6" y="7" width="12" height="13" rx="3" stroke={B} /><path d="M8 4.5h8M9.5 12h5M12 9.5v5" stroke={R} /></>),
  help: (<><path d="M12 19s-6.5-3.8-6.5-8.6A3.4 3.4 0 0 1 12 8.6a3.4 3.4 0 0 1 6.5 1.8C18.5 15.2 12 19 12 19z" stroke={R} /><path d="M3 20h18" stroke={B} /></>),
  home: (<><path d="M4 11 12 4l8 7" stroke={R} /><path d="M6 10v10h12V10M10 20v-5h4v5" stroke={B} /></>),
  store: (<><path d="M4 9h16l-1-4H5z" stroke={R} /><path d="M5 9v11h14V9M9 20v-6h6v6" stroke={B} /></>),
  bank: (<><path d="M3 9 12 4l9 5" stroke={R} /><path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20h18" stroke={B} /></>),
  towers: (<><path d="M8 21V4M16 21V8" stroke={B} /><circle cx="8" cy="11" r="2.6" stroke={R} /><circle cx="16" cy="13" r="2" stroke={R} /><path d="M3 21h18" stroke={B} /></>),
  waterfront: (<><path d="M3 15c2 0 2-1.5 4.5-1.5S10 15 12 15s2.5-1.5 4.5-1.5S19 15 21 15M3 19c2 0 2-1.5 4.5-1.5S10 19 12 19s2.5-1.5 4.5-1.5S19 19 21 19" stroke={B} /><path d="M12 4v8M12 5l5 6h-5" stroke={R} /></>),
  park: (<><circle cx="12" cy="9" r="5" stroke={R} /><path d="M12 14v7M8 21h8" stroke={B} /></>),
  account: (<><rect x="4" y="5" width="16" height="14" rx="2" stroke={B} /><path d="M8 10h8M8 14h5" stroke={R} /></>),
  balance: (<><path d="M12 4v16M6 20h12" stroke={B} /><path d="M5 8h14M5 8l-2 5h4zM19 8l-2 5h4z" stroke={R} /></>),
  payment: (<><path d="M5 12h11M12 8l4 4-4 4" stroke={R} /><rect x="3" y="4" width="18" height="16" rx="3" stroke={B} /></>),
  card: (<><rect x="3" y="6" width="18" height="12" rx="2" stroke={B} /><path d="M3 10h18" stroke={R} /><path d="M6 14h4" stroke={B} /></>),
  atm: (<><rect x="4" y="3" width="16" height="12" rx="2" stroke={B} /><path d="M8 18h8v3H8z" stroke={R} /><path d="M8 7h8M8 10h5" stroke={B} /></>),
  shield: (<><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" stroke={B} /><path d="m9 12 2 2 4-4" stroke={R} /></>),
  book: (<><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z" stroke={B} /><path d="M12 6v13.5" stroke={R} /></>),
  art: (<><path d="M12 4a8 8 0 1 0 0 16c1.5 0 1.8-1.2 1-2.2-.8-1-.3-2.3 1.2-2.3H17a3 3 0 0 0 3-3C20 7.5 16.4 4 12 4z" stroke={B} /><circle cx="8" cy="11" r="1" stroke={R} /><circle cx="11" cy="8" r="1" stroke={R} /><circle cx="15" cy="8.5" r="1" stroke={R} /></>),
  ball: (<><circle cx="12" cy="12" r="8" stroke={B} /><path d="m12 8 3 2.2-1.1 3.6h-3.8L9 10.2z" stroke={R} /></>),
  contents: (<><path d="M9 6h11M9 12h11M9 18h11" stroke={B} /><path d="M4 6h1M4 12h1M4 18h1" stroke={R} /></>),
  settings: (<><circle cx="12" cy="12" r="3" stroke={R} /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke={B} /></>),
  parents: (<><circle cx="8.5" cy="7.5" r="2.5" stroke={B} /><circle cx="16" cy="9.5" r="2" stroke={R} /><path d="M4 19c0-3 2-5 4.5-5s4.5 2 4.5 5M13 19c0-2.4 1.3-4 3-4s3 1.6 3 4" stroke={B} /></>),
  soundOn: (<><path d="M4 10v4h4l5 4V6L8 10z" stroke={B} /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" stroke={R} /></>),
  soundOff: (<><path d="M4 10v4h4l5 4V6L8 10z" stroke={B} /><path d="m16 10 4 4M20 10l-4 4" stroke={R} /></>),
  globe: (<><circle cx="12" cy="12" r="8.5" stroke={B} /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.3 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.3-3.5-8.5s1-6 3.5-8.5z" stroke={R} /></>),
  next: (<path d="m9 5 7 7-7 7" stroke={B} />),
  prev: (<path d="m15 5-7 7 7 7" stroke={B} />),
  close: (<path d="M6 6l12 12M18 6 6 18" stroke={B} />),
  check: (<path d="m5 12.5 4.5 4.5L19 7.5" stroke={B} />),
  star: (<><path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6L12 16.7l-5 2.6.9-5.6-4-4 5.6-.8z" stroke={R} /></>),
  print: (<><path d="M7 9V4h10v5" stroke={B} /><rect x="4" y="9" width="16" height="7" rx="2" stroke={B} /><path d="M7 14h10v6H7z" stroke={R} /></>),
  download: (<><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" stroke={R} /><path d="M5 19h14" stroke={B} /></>),
  bulb: (<><path d="M9 17h6M10 20h4" stroke={B} /><path d="M12 3.5a5.5 5.5 0 0 0-3.2 10c.6.5 1 1.2 1 2V16h4.4v-.5c0-.8.4-1.5 1-2A5.5 5.5 0 0 0 12 3.5z" stroke={R} /></>),
  reset: (<><path d="M5 12a7 7 0 1 0 2.1-5" stroke={B} /><path d="M5 4v4h4" stroke={R} /></>),
  wallet: (<><path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" stroke={B} /><path d="M4 7l11-3v3M15 13h5" stroke={R} /></>),
  list: (<><path d="M9 7h10M9 12h10M9 17h10" stroke={B} /><path d="m4 7 1 1 2-2M4 12l1 1 2-2M4 17l1 1 2-2" stroke={R} /></>),
  grid: (<><rect x="4" y="4" width="16" height="16" rx="1.5" stroke={B} /><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16" stroke={R} /></>),
  map: (<><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z" stroke={B} /><path d="M9 4v14M15 6v14" stroke={R} /></>),
  play: (<path d="M8 5v14l11-7z" stroke={B} />),
  stop: (<rect x="6.5" y="6.5" width="11" height="11" rx="1.5" stroke={B} />),
  gift: (<><rect x="4" y="9" width="16" height="11" rx="1.5" stroke={B} /><path d="M12 9v11M3.5 9h17M12 9c-1-3-5-4-5-1.5S12 9 12 9zm0 0c1-3 5-4 5-1.5S12 9 12 9z" stroke={R} /></>),
  hands: (<><path d="M4 14c2 0 3-1 5-1h3a1.5 1.5 0 0 1 0 3h-2.5M4 19h10l6-4a1.6 1.6 0 0 0-2-2.5L14 15" stroke={B} /><path d="M14 4.5a2 2 0 0 1 3 0 2 2 0 0 1 3 0c1 1.2 0 3-3 5-3-2-4-3.8-3-5z" stroke={R} /></>),
  tool: (<><path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5L16 12l-4-4z" stroke={B} /><path d="M6 18l1-1" stroke={R} /></>),
  tea: (<><path d="M5 10h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" stroke={B} /><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H15M9 4c0 1.5 1.5 1.5 1.5 3M12.5 4c0 1.5 1.5 1.5 1.5 3" stroke={R} /></>),
  target: (<><circle cx="12" cy="12" r="8" stroke={B} /><circle cx="12" cy="12" r="4" stroke={R} /><circle cx="12" cy="12" r="0.8" stroke={R} /></>),
  receipt: (<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" stroke={B} /><path d="M9 8h6M9 12h6M9 16h3" stroke={R} /></>),
  info: (<><circle cx="12" cy="12" r="8.5" stroke={B} /><path d="M12 11v6M12 7.5v.5" stroke={R} /></>),
};

export function Icon({ name, size = 24, className, title }: { name: IconName; size?: number; className?: string; title?: string }) {
  return (
    <svg
      className={`icon ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}

/** Icon inside a light circle, the website/app "two colour icon" treatment. */
export function CircleIcon({ name, size = 56, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <span className={`circle-icon ${className ?? ''}`} style={{ width: size, height: size }} aria-hidden="true">
      <Icon name={name} size={Math.round(size * 0.56)} />
    </span>
  );
}
