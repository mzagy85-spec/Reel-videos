/*
 * Illustrated learning map (not a real map or branch locator). 900x600, 3x2 regions of 300x300.
 * Roads cross region borders so the six jigsaw pieces visually connect.
 */
import type { JSX } from 'react';
import { useSvgId } from './ids';
import { Dhow, KuwaitTowers } from './characters';
import { C, CommonDefs } from './common';

export type MapRegion = 'towers' | 'waterfront' | 'park' | 'home' | 'coop' | 'bank';

export const MAP_REGIONS: { id: MapRegion; col: 0 | 1 | 2; row: 0 | 1 }[] = [
  { id: 'towers', col: 0, row: 0 },
  { id: 'waterfront', col: 1, row: 0 },
  { id: 'park', col: 2, row: 0 },
  { id: 'home', col: 0, row: 1 },
  { id: 'coop', col: 1, row: 1 },
  { id: 'bank', col: 2, row: 1 },
];

function MiniPalm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="4" cy="2" rx="16" ry="4" fill="#000" opacity="0.12" />
      <path d="M-3,0 Q0,-30 4,-56 L8,-56 Q4,-30 3,0 Z" fill="#9C7348" />
      {[-150, -105, -60, -20, 20].map((a) => (
        <path key={a} transform={`translate(6 -56) rotate(${a})`} d="M0,0 Q18,-10 34,3 Q18,-3 0,0 Z" fill={C.leaf} />
      ))}
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="4" cy="2" rx="18" ry="5" fill="#000" opacity="0.12" />
      <rect x="-3" y="-20" width="6" height="22" fill="#8A5A33" />
      <circle cx="0" cy="-30" r="18" fill={C.leaf} />
      <circle cx="-6" cy="-36" r="9" fill={C.leafLight} />
    </g>
  );
}

function Trolley({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0,-18 L24,-18 L21,-6 L3,-6 Z" fill="none" stroke="#8B9096" strokeWidth="2.5" />
      <path d="M0,-18 L-6,-24" stroke="#8B9096" strokeWidth="2.5" />
      <circle cx="4" cy="0" r="2.5" fill="#3A3D42" />
      <circle cx="20" cy="0" r="2.5" fill="#3A3D42" />
    </g>
  );
}

export function MapArt({ region, ghost = false, className }: { region?: MapRegion; ghost?: boolean; className?: string }): JSX.Element {
  const id = useSvgId('map');
  const r = region ? MAP_REGIONS.find((m) => m.id === region) : undefined;
  const vb = r ? `${r.col * 300} ${r.row * 300} 300 300` : '0 0 900 600';
  return (
    <svg
      className={`map-art ${ghost ? 'map-ghost' : ''} ${className ?? ''}`}
      viewBox={vb}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <CommonDefs id={id} />
      <defs>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7CC3D3" />
          <stop offset="1" stopColor="#3F8FA8" />
        </linearGradient>
        <filter id={`${id}-ghost`}>
          <feColorMatrix type="saturate" values="0.1" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.38" />
          </feComponentTransfer>
        </filter>
      </defs>
      <g filter={ghost ? `url(#${id}-ghost)` : undefined}>
        {/* ground */}
        <rect x="0" y="0" width="900" height="600" fill="#EFE3CB" />
        {/* sea along the top-left, curving coastline */}
        <path d="M0,0 L560,0 Q520,60 470,90 Q380,140 300,150 Q200,170 120,230 Q60,270 0,280 Z" fill={`url(#${id}-sea)`} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${30 + i * 60},${60 + i * 45} q30,-8 60,0 t60,0 t60,0`} fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
        ))}
        {/* corniche promenade along the coast */}
        <path d="M0,280 Q60,270 120,230 Q200,170 300,150 Q380,140 470,90 Q520,60 560,0" fill="none" stroke="#E6D3AF" strokeWidth="20" />
        <path d="M0,280 Q60,270 120,230 Q200,170 300,150 Q380,140 470,90 Q520,60 560,0" fill="none" stroke="#5F6264" strokeWidth="2" strokeDasharray="5 6" opacity="0.5" transform="translate(4 8)" />

        {/* roads crossing all region borders */}
        <path d="M0,330 L900,330" stroke="#C9C3B6" strokeWidth="34" />
        <path d="M0,330 L900,330" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="14 12" />
        <path d="M330,180 Q330,260 330,600" stroke="#C9C3B6" strokeWidth="26" fill="none" />
        <path d="M640,60 L640,600" stroke="#C9C3B6" strokeWidth="26" />
        <path d="M330,180 Q330,260 330,600 M640,60 L640,600" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10 10" fill="none" />
        <path d="M640,160 L900,160" stroke="#D9D2C2" strokeWidth="16" />

        {/* towers region */}
        <g transform="translate(112 246) scale(0.4)">
          <KuwaitTowers x={0} y={0} />
        </g>
        <ellipse cx="112" cy="252" rx="54" ry="11" fill="#D8C9A8" />

        {/* waterfront region: palms + dhow */}
        <g className="amb-bob">
          <Dhow x={390} y={118} scale={0.26} />
        </g>
        {[[360, 200], [420, 170], [480, 140], [540, 110]].map(([x, y]) => <MiniPalm key={x} x={x} y={y} s={0.9} />)}
        <rect x="380" y="232" width="150" height="40" rx="10" fill="#E9DEC8" />
        {[396, 436, 476].map((x) => <rect key={x} x={x} y="244" width="26" height="12" rx="4" fill="#B7B9BC" />)}

        {/* park / community space */}
        <rect x="670" y="20" width="210" height="125" rx="26" fill="#A6CE8F" />
        <rect x="670" y="180" width="210" height="120" rx="26" fill="#A6CE8F" />
        <path d="M690,90 Q760,60 860,90" fill="none" stroke="#E9DEC8" strokeWidth="10" />
        <Tree x={700} y={70} />
        <Tree x={850} y={60} s={1.1} />
        <Tree x={860} y={280} />
        <Tree x={690} y={290} s={0.9} />
        {/* playground */}
        <g transform="translate(760 270)">
          <path d="M-30,0 L-14,-40 L2,0" fill="none" stroke={C.red} strokeWidth="4" />
          <path d="M-14,-40 L30,-40" stroke={C.red} strokeWidth="4" />
          <path d="M20,-40 L20,-16 M30,-40 L30,-16" stroke="#5F6264" strokeWidth="2" />
          <rect x="16" y="-18" width="18" height="5" rx="2" fill={C.blue} />
          <path d="M-40,0 L-60,-24 L-48,-24 L-28,0 Z" fill="#F2C14E" />
        </g>
        {/* shaded benches + small library kiosk */}
        <g transform="translate(790 120)">
          <path d="M-30,-30 L30,-30 L20,-42 L-20,-42 Z" fill="#F3F3F3" />
          <rect x="-26" y="-30" width="52" height="34" rx="4" fill="#F7F1E6" />
          <rect x="-8" y="-18" width="16" height="22" rx="2" fill="#8A5A33" />
          <rect x="-22" y="-24" width="10" height="10" rx="2" fill="#BFE0EC" />
          <rect x="12" y="-24" width="10" height="10" rx="2" fill="#BFE0EC" />
        </g>
        <rect x="700" y="210" width="40" height="8" rx="3" fill="#8A5A33" />
        <rect x="810" y="210" width="40" height="8" rx="3" fill="#8A5A33" />

        {/* home region: house with courtyard and palm */}
        <g transform="translate(150 470)">
          <ellipse cx="0" cy="80" rx="120" ry="14" fill="#000" opacity="0.1" />
          <rect x="-110" y="-60" width="220" height="140" rx="8" fill="#E9D9BC" />
          <rect x="-96" y="-46" width="110" height="112" rx="6" fill="#D9C7A4" />
          <rect x="30" y="-90" width="80" height="110" rx="6" fill="#F7EFE0" />
          <rect x="30" y="-96" width="80" height="12" rx="4" fill="#E2D3B6" />
          <rect x="44" y="-70" width="20" height="24" rx="3" fill="#8FC3D6" />
          <rect x="76" y="-70" width="20" height="24" rx="3" fill="#8FC3D6" />
          <rect x="58" y="-26" width="26" height="46" rx="10" fill="#8A5A33" />
          <MiniPalm x={-50} y={40} s={1.1} />
          <circle cx="-20" cy="30" r="10" fill={C.leafLight} />
        </g>

        {/* coop region */}
        <g transform="translate(490 470)">
          <ellipse cx="0" cy="82" rx="120" ry="14" fill="#000" opacity="0.1" />
          <rect x="-110" y="-70" width="220" height="140" rx="8" fill="#F5F5F3" />
          <rect x="-110" y="-70" width="220" height="24" rx="6" fill={C.red} />
          <path d="M-110,-46 L110,-46" stroke="#CE0000" strokeWidth="3" />
          <rect x="-90" y="-28" width="180" height="60" rx="4" fill="#BFDCE6" />
          <path d="M-30,-28 L-30,32 M30,-28 L30,32" stroke="#FFFFFF" strokeWidth="4" />
          <rect x="-20" y="10" width="40" height="60" rx="3" fill="#9FC7DB" stroke="#FFFFFF" strokeWidth="3" />
          {[-80, -60, -40, 50, 70].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? -4 : 0} r="5" fill={['#F29A2E', '#8DBE55', '#C8463B'][i % 3]} />)}
          <Trolley x={70} y={92} />
          <Trolley x={95} y={92} />
        </g>

        {/* bank region (blank sign panel at local x80..220,y60..100 of the cell) */}
        <g>
          <ellipse cx="770" cy="582" rx="120" ry="12" fill="#000" opacity="0.1" />
          <rect x="665" y="350" width="210" height="226" rx="8" fill="#F5F5F3" />
          <rect x="665" y="350" width="210" height="8" fill={C.red} />
          <rect x="676" y="356" width="148" height="48" rx="6" fill="#E9EAEB" />
          <rect x="680" y="360" width="140" height="40" rx="4" fill="#FFFFFF" />
          <rect x="680" y="414" width="180" height="140" rx="4" fill="#CFE3EC" />
          <path d="M725,414 L725,554 M770,414 L770,554 M815,414 L815,554" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M690,424 L730,424 L700,490 Z" fill="#fff" opacity="0.3" />
          <rect x="748" y="494" width="44" height="60" rx="3" fill="#9FC7DB" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="680" y="554" width="180" height="14" fill="#D7DADE" />
          <Tree x={856} y={590} s={0.8} />
          <Tree x={684} y={592} s={0.7} />
        </g>
      </g>
    </svg>
  );
}
