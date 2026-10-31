/* Shared scene-building helpers for the hand-authored SVG illustrations. */
import type { JSX, ReactNode } from 'react';

export const C = {
  red: '#EF2B2D',
  red2: '#CE0000',
  blue: '#00248F',
  grey: '#5F6264',
  grey2: '#B7B9BC',
  light: '#F3F3F3',
  sand: '#E9D8B8',
  sandDeep: '#D7BF93',
  wood: '#B57F4E',
  woodDeep: '#8A5A33',
  woodLight: '#D3A273',
  wall: '#F4EBDD',
  wallShade: '#E6D7C1',
  leaf: '#4F8A5B',
  leafDeep: '#356B44',
  leafLight: '#79B07A',
  sea: '#4EA3B8',
  seaDeep: '#2C7894',
  sky: '#BFE3F0',
};

/** Standard gradient defs used by most scenes; ids are prefixed by the scene's unique id. */
export function CommonDefs({ id }: { id: string }): JSX.Element {
  return (
    <defs>
      <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.woodLight} />
        <stop offset="1" stopColor={C.wood} />
      </linearGradient>
      <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FBF4E8" />
        <stop offset="1" stopColor={C.wallShade} />
      </linearGradient>
      <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#D9B98C" />
        <stop offset="1" stopColor="#C49D6B" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.25" cy="0.15" r="0.9">
        <stop offset="0" stopColor="#FFF6DD" stopOpacity="0.7" />
        <stop offset="1" stopColor="#FFF6DD" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.leafLight} />
        <stop offset="1" stopColor={C.leafDeep} />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E8F4F8" />
        <stop offset="1" stopColor="#B9D7E2" />
      </linearGradient>
      <pattern id={`${id}-grain`} width="23" height="19" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="4" r="0.9" fill="#5a4630" />
        <circle cx="14" cy="11" r="0.7" fill="#5a4630" />
        <circle cx="19" cy="2" r="0.6" fill="#fff" />
        <circle cx="8" cy="15" r="0.8" fill="#fff" />
      </pattern>
    </defs>
  );
}

/** Very light paper grain overlay (cheap pattern, no filters). */
export function Grain({ id }: { id: string }): JSX.Element {
  return <rect x="0" y="0" width="1200" height="900" fill={`url(#${id}-grain)`} opacity="0.07" pointerEvents="none" />;
}

/** Warm light wash from upper-left. */
export function LightWash({ id }: { id: string }): JSX.Element {
  return <rect x="0" y="0" width="1200" height="900" fill={`url(#${id}-glow)`} pointerEvents="none" />;
}

export function Cloud({ x, y, s = 1, o = 0.95 }: { x: number; y: number; s?: number; o?: number }): JSX.Element {
  return (
    <g className="amb-drift" transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx="0" cy="0" rx="70" ry="26" fill="#ffffff" />
      <circle cx="-26" cy="-14" r="26" fill="#ffffff" />
      <circle cx="16" cy="-22" r="32" fill="#ffffff" />
      <ellipse cx="0" cy="10" rx="66" ry="10" fill="#DCEFF6" />
    </g>
  );
}

export function Palm({ x, y, s = 1, id }: { x: number; y: number; s?: number; id: string }): JSX.Element {
  const fronds = [-150, -115, -80, -45, -10, 25];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="6" cy="2" rx="40" ry="7" fill="#3a2a1a" opacity="0.15" />
      <path d="M-8,0 Q-2,-120 14,-250 L26,-250 Q10,-120 10,0 Z" fill="#9C7348" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <path key={i} d={`M${-6 + i * 1.6},${-20 - i * 26} l16,-4`} stroke="#7A5634" strokeWidth="3" strokeLinecap="round" />
      ))}
      <g className="amb-sway" style={{ transformOrigin: '20px -250px' }}>
        {fronds.map((a, i) => (
          <path
            key={i}
            transform={`translate(20 -250) rotate(${a})`}
            d="M0,0 Q60,-30 120,10 Q60,-8 0,0 Z"
            fill={i % 2 ? `url(#${id}-leaf)` : C.leaf}
          />
        ))}
        <circle cx="16" cy="-244" r="7" fill="#C2852F" />
        <circle cx="26" cy="-240" r="6" fill="#A8691F" />
      </g>
    </g>
  );
}

export function Plant({ x, y, s = 1, id, pot = '#E2D2B8' }: { x: number; y: number; s?: number; id: string; pot?: string }): JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="40" ry="7" fill="#3a2a1a" opacity="0.15" />
      <g className="amb-sway" style={{ transformOrigin: '0px -50px' }}>
        {[-60, -35, -12, 12, 35, 60].map((a, i) => (
          <ellipse key={i} transform={`translate(0 -60) rotate(${a}) translate(0 -38)`} cx="0" cy="0" rx="13" ry="40" fill={i % 2 ? `url(#${id}-leaf)` : C.leaf} />
        ))}
      </g>
      <path d="M-30,-60 L30,-60 L22,0 L-22,0 Z" fill={pot} />
      <path d="M-30,-60 L30,-60 L29,-52 L-29,-52 Z" fill="#000" opacity="0.08" />
    </g>
  );
}

export function Window({ x, y, w, h, sky = '#CFE9F3', id }: { x: number; y: number; w: number; h: number; sky?: string; id: string }): JSX.Element {
  return (
    <g>
      <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} rx="8" fill="#FFFDF8" />
      <rect x={x} y={y} width={w} height={h} rx="4" fill={sky} />
      <rect x={x} y={y} width={w} height={h} rx="4" fill={`url(#${id}-glow)`} />
      <path d={`M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}`} stroke="#FFFDF8" strokeWidth="8" />
      <rect x={x - 16} y={y + h + 8} width={w + 32} height="12" rx="4" fill="#E6D7C1" />
    </g>
  );
}

/** Sadu-inspired cushion: geometric stripes and diamonds, no text. */
export function SaduCushion({ x, y, w = 140, h = 90, r = 0 }: { x: number; y: number; w?: number; h?: number; r?: number }): JSX.Element {
  const dx = w / 6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="18" fill="#B8262A" />
      <rect x={-w / 2} y={-h / 2 + h * 0.18} width={w} height={h * 0.12} fill="#F3E6CC" />
      <rect x={-w / 2} y={h / 2 - h * 0.3} width={w} height={h * 0.12} fill="#F3E6CC" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${-w / 2 + dx * (i + 0.5)},${-h * 0.12} l${dx / 2},${h * 0.12} l${-dx / 2},${h * 0.12} l${-dx / 2},${-h * 0.12} Z`} fill={i % 2 ? '#1E1A18' : '#F3E6CC'} />
      ))}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="18" fill="none" stroke="#7E1719" strokeWidth="3" />
      <ellipse cx={-w * 0.22} cy={-h * 0.3} rx={w * 0.2} ry={h * 0.1} fill="#fff" opacity="0.12" />
    </g>
  );
}

export function Book({ x, y, w = 30, h = 120, color, r = 0 }: { x: number; y: number; w?: number; h?: number; color: string; r?: number }): JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x="0" y={-h} width={w} height={h} rx="3" fill={color} />
      <rect x="0" y={-h} width={w * 0.25} height={h} rx="2" fill="#fff" opacity="0.14" />
      <rect x={w * 0.2} y={-h * 0.8} width={w * 0.6} height="5" rx="2" fill="#fff" opacity="0.4" />
      <rect x={w * 0.2} y={-h * 0.25} width={w * 0.6} height="5" rx="2" fill="#fff" opacity="0.4" />
    </g>
  );
}

export function Bookshelf({ x, y, id }: { x: number; y: number; id: string }): JSX.Element {
  const colors = ['#C8463B', '#2F6FB0', '#E2B04A', '#3F8F7E', '#7C5BA6', '#E07A50', '#22356A', '#9C7348'];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="240" height="420" rx="8" fill={`url(#${id}-wood)`} />
      <rect x="14" y="14" width="212" height="392" rx="4" fill="#8A5A33" />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect x="14" y={130 + row * 130} width="212" height="12" fill="#C49264" />
          {colors.slice(0, 6 + (row % 2)).map((c, i) => (
            <Book key={i} x={22 + i * 30} y={130 + row * 130} w={26} h={90 + ((i * 17 + row * 11) % 26)} color={colors[(i + row * 3) % colors.length] ?? c} r={i === 5 ? 10 : 0} />
          ))}
        </g>
      ))}
      <rect x="0" y="0" width="240" height="420" rx="8" fill="none" stroke="#6E4021" strokeWidth="3" />
    </g>
  );
}

export function Floor({ id, y = 640, color }: { id: string; y?: number; color?: string }): JSX.Element {
  return (
    <g>
      <rect x="0" y={y} width="1200" height={900 - y} fill={color ?? `url(#${id}-floor)`} />
      <rect x="0" y={y} width="1200" height="10" fill="#000" opacity="0.06" />
    </g>
  );
}

export function Room({ id, floorY = 640, children }: { id: string; floorY?: number; children?: ReactNode }): JSX.Element {
  return (
    <g>
      <rect x="0" y="0" width="1200" height={floorY} fill={`url(#${id}-wall)`} />
      <rect x="0" y={floorY - 26} width="1200" height="26" fill="#EADCC6" />
      <Floor id={id} y={floorY} />
      {children}
    </g>
  );
}

export function Sparkle({ x, y, s = 1, color = '#FFE7A8' }: { x: number; y: number; s?: number; color?: string }): JSX.Element {
  return (
    <g className="amb-twinkle" transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0,-14 Q2,-2 14,0 Q2,2 0,14 Q-2,2 -14,0 Q-2,-2 0,-14 Z" fill={color} />
    </g>
  );
}

/** Kid-scale table with soft top highlight; origin top-left of the tabletop. */
export function Table({ x, y, w, h = 30, legs = 140, id }: { x: number; y: number; w: number; h?: number; legs?: number; id: string }): JSX.Element {
  return (
    <g>
      <ellipse cx={x + w / 2} cy={y + h + legs + 4} rx={w * 0.5} ry="14" fill="#3a2a1a" opacity="0.14" />
      <rect x={x + 30} y={y + h - 4} width="18" height={legs} rx="6" fill={C.woodDeep} />
      <rect x={x + w - 48} y={y + h - 4} width="18" height={legs} rx="6" fill={C.woodDeep} />
      <rect x={x} y={y} width={w} height={h} rx="10" fill={`url(#${id}-wood)`} />
      <rect x={x} y={y} width={w} height="8" rx="4" fill="#fff" opacity="0.18" />
    </g>
  );
}

/** Blank price tag (prices are rendered by the app in HTML). */
export function BlankTag({ x, y, s = 1 }: { x: number; y: number; s?: number }): JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0,0 L70,0 L86,18 L70,36 L0,36 Q-6,36 -6,30 L-6,6 Q-6,0 0,0 Z" fill="#FFFDF7" stroke="#C9B994" strokeWidth="2" />
      <circle cx="70" cy="18" r="4" fill="#C9B994" />
    </g>
  );
}

export function Lantern({ x, y, s = 1 }: { x: number; y: number; s?: number }): JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0,-60 L0,-20" stroke="#5B3A22" strokeWidth="3" />
      <circle cx="0" cy="18" r="56" fill="#FFD27A" opacity="0.18" className="amb-twinkle" />
      <path d="M-16,-20 L16,-20 L22,0 L14,36 L-14,36 L-22,0 Z" fill="#E7A33D" />
      <path d="M-16,-20 L16,-20 L22,0 L14,36 L-14,36 L-22,0 Z" fill="none" stroke="#7A4B1F" strokeWidth="3" />
      <path d="M0,-20 L0,36 M-22,0 L22,0" stroke="#7A4B1F" strokeWidth="2" />
      <path d="M-8,36 L8,36 L0,48 Z" fill="#7A4B1F" />
    </g>
  );
}

export function Sea({ id, y, deep = C.seaDeep, top = C.sea }: { id: string; y: number; deep?: string; top?: string }): JSX.Element {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
      </defs>
      <rect x="0" y={y} width="1200" height={900 - y} fill={`url(#${id}-sea)`} />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          className="amb-drift"
          d={`M${-40 + i * 37},${y + 24 + i * 28} q60,-12 120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={0.25 - i * 0.04}
        />
      ))}
    </g>
  );
}

/** Low-rise city skyline far away, atmospheric colour. */
export function Skyline({ y, color = '#B8CCD6' }: { y: number; color?: string }): JSX.Element {
  const blocks = [
    [700, 60, 48], [750, 42, 70], [822, 54, 52], [880, 38, 96], [920, 60, 60], [985, 46, 82],
    [1035, 70, 50], [1108, 52, 74], [1162, 60, 46], [60, 50, 40], [112, 38, 62], [152, 56, 44],
  ];
  return (
    <g fill={color}>
      {blocks.map(([x, w, h], i) => (
        <rect key={i} x={x} y={y - h} width={w} height={h} rx="2" />
      ))}
      <path d={`M906,${y - 96} L910,${y - 150} L914,${y - 96} Z`} />
    </g>
  );
}
