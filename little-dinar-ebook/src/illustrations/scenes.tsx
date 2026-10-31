/*
 * Scene illustrations for the 15-page book. Each scene is drawn on a 1200x900 canvas.
 * 'wide' crop shows the whole canvas; 'tall' crop (phones) shows x150..1050, y60..780.
 * Original hand-authored SVG; no text, digits, logos or currency artwork in the art.
 */
import type { JSX } from 'react';
import { useSvgId } from './ids';
import { Adult, Cousin, Dhow, Hamad, Hessa, HeldItem, KuwaitTowers } from './characters';
import {
  BlankTag, Bookshelf, C, Cloud, CommonDefs, Floor, Grain, Lantern, Palm, Plant, Room,
  SaduCushion, Sea, Skyline, Sparkle, Table, Window,
} from './common';

export type SceneId =
  | 'waterfront-day' | 'reading-corner' | 'tabletop' | 'school-bag' | 'souq-goal' | 'coop-store'
  | 'compare-shelf' | 'bank-branch' | 'bank-counter' | 'card-atm' | 'message-home' | 'helping-home'
  | 'notebook-desk' | 'waterfront-sunset';

export const SCENE_IDS: SceneId[] = [
  'waterfront-day', 'reading-corner', 'tabletop', 'school-bag', 'souq-goal', 'coop-store', 'compare-shelf',
  'bank-branch', 'bank-counter', 'card-atm', 'message-home', 'helping-home', 'notebook-desk', 'waterfront-sunset',
];

type SceneFn = (p: { id: string }) => JSX.Element;

/* ------------------------------------------------------------ 1 & 14: corniche */

function Corniche({ id, sunset }: { id: string; sunset: boolean }) {
  return (
    <>
      <g className="layer-bg">
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            {sunset ? (
              <>
                <stop offset="0" stopColor="#3F2D63" />
                <stop offset="0.45" stopColor="#B4527A" />
                <stop offset="0.8" stopColor="#F08A5D" />
                <stop offset="1" stopColor="#FBC77A" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#8FCBE6" />
                <stop offset="0.7" stopColor="#CFEAF3" />
                <stop offset="1" stopColor="#F2F4EC" />
              </>
            )}
          </linearGradient>
          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor={sunset ? '#FFE3A1' : '#FFFBE8'} />
            <stop offset="0.35" stopColor={sunset ? '#FFB45E' : '#FFF4C8'} stopOpacity="0.8" />
            <stop offset="1" stopColor={sunset ? '#FF8A50' : '#FFF4C8'} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="500" fill={`url(#${id}-sky)`} />
        <circle cx={sunset ? 860 : 980} cy={sunset ? 470 : 130} r={sunset ? 230 : 180} fill={`url(#${id}-sun)`} />
        {sunset && <circle cx="860" cy="470" r="46" fill="#FFD98F" />}
        {sunset ? (
          <>
            <Cloud x={240} y={150} s={1.1} o={0.35} />
            <Cloud x={700} y={110} s={0.8} o={0.3} />
          </>
        ) : (
          <>
            <Cloud x={200} y={140} s={1} />
            <Cloud x={720} y={90} s={0.75} o={0.85} />
            <Cloud x={1050} y={220} s={0.6} o={0.8} />
          </>
        )}
        <Skyline y={492} color={sunset ? '#7C4F78' : '#B9CFD9'} />
        <KuwaitTowers x={330} y={492} scale={0.74} silhouette={sunset} />
        <Sea id={id} y={490} top={sunset ? '#D7837A' : '#6BB8CB'} deep={sunset ? '#5C3F6E' : '#2C7894'} />
        {sunset && <rect x="820" y="490" width="80" height="150" fill="#FFD98F" opacity="0.35" />}
        <g className="amb-bob">
          <Dhow x={sunset ? 1000 : 860} y={590} scale={0.62} />
        </g>
      </g>
      <g className="layer-mid">
        {/* promenade */}
        <rect x="0" y="630" width="1200" height="270" fill={sunset ? '#D9A88A' : '#EADCC2'} />
        <path d="M0,700 L1200,700 M0,790 L1200,790" stroke={sunset ? '#C08F75' : '#D8C6A4'} strokeWidth="3" />
        {[...Array(13)].map((_, i) => (
          <path key={i} d={`M${i * 100},630 L${i * 100 - 60},900`} stroke={sunset ? '#C08F75' : '#D8C6A4'} strokeWidth="2" opacity="0.7" />
        ))}
        {/* railing */}
        <rect x="0" y="618" width="1200" height="12" fill={sunset ? '#7E5A6A' : '#5F6264'} />
        <rect x="0" y="570" width="1200" height="6" fill={sunset ? '#8E6878' : '#7C8084'} />
        {[...Array(25)].map((_, i) => (
          <rect key={i} x={i * 50 + 10} y="574" width="5" height="46" fill={sunset ? '#8E6878' : '#7C8084'} />
        ))}
        <Palm x={150} y={720} s={1.05} id={id} />
        <Palm x={1060} y={700} s={0.95} id={id} />
      </g>
      <g className="layer-chars">
        {sunset && <Adult who="mama" x={860} y={800} scale={0.74} facing="left" expression="happy" holding="bag" pose="hold" />}
        <Hessa x={520} y={850} scale={0.92} pose={sunset ? 'cheer' : 'wave'} expression="happy" />
        <Hamad x={690} y={850} scale={0.92} pose={sunset ? 'cheer' : 'hold'} holding={sunset ? 'none' : 'jar'} expression={sunset ? 'happy' : 'smile'} facing="left" />
      </g>
      <g className="layer-fg">
        {sunset && (
          <>
            <Sparkle x={420} y={300} s={1.2} />
            <Sparkle x={620} y={220} s={0.9} />
            <Sparkle x={760} y={330} s={1.1} />
            <Sparkle x={980} y={260} s={0.8} />
          </>
        )}
        <Plant x={300} y={880} s={0.9} id={id} pot={sunset ? '#B9826C' : '#E2D2B8'} />
      </g>
    </>
  );
}

const waterfrontDay: SceneFn = ({ id }) => <Corniche id={id} sunset={false} />;
const waterfrontSunset: SceneFn = ({ id }) => <Corniche id={id} sunset />;

/* ------------------------------------------------------------ 2: reading corner */

const readingCorner: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <Room id={id} floorY={640} />
      <Window x={150} y={130} w={240} h={270} id={id} />
      <Bookshelf x={880} y={210} id={id} />
      <Plant x={820} y={640} s={1} id={id} />
    </g>
    <g className="layer-mid">
      {/* majlis seating */}
      <rect x="300" y="470" width="560" height="110" rx="26" fill="#C9B79A" />
      <rect x="300" y="560" width="560" height="70" rx="20" fill="#B9A585" />
      <rect x="300" y="560" width="560" height="12" rx="6" fill="#fff" opacity="0.15" />
      <SaduCushion x={390} y={520} w={130} h={86} r={-6} />
      <SaduCushion x={770} y={520} w={130} h={86} r={5} />
      {/* rug with three stepping stones: spend (bag), save (jar), help (heart) */}
      <ellipse cx="600" cy="790" rx="430" ry="90" fill="#E7D3B2" />
      <ellipse cx="600" cy="790" rx="400" ry="74" fill="none" stroke={C.red} strokeWidth="5" opacity="0.65" />
      <path d="M300,800 Q450,760 600,800 T900,790" fill="none" stroke="#C7A979" strokeWidth="8" strokeDasharray="2 20" strokeLinecap="round" />
      {[[420, 800], [600, 806], [780, 796]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <ellipse cx="0" cy="6" rx="58" ry="22" fill="#000" opacity="0.08" />
          <ellipse cx="0" cy="0" rx="58" ry="22" fill="#FBF6EC" stroke="#D8C6A4" strokeWidth="2" />
          {i === 0 && <g transform="translate(0 -6)"><path d="M-10,-6 Q0,-18 10,-6" fill="none" stroke={C.blue} strokeWidth="3" /><rect x="-15" y="-6" width="30" height="20" rx="4" fill={C.red} /></g>}
          {i === 1 && <g transform="translate(0 -4)"><rect x="-12" y="-14" width="24" height="26" rx="6" fill="#DCEFF3" stroke={C.blue} strokeWidth="2.5" /><rect x="-13" y="-18" width="26" height="6" rx="2" fill={C.blue} /><circle cx="0" cy="4" r="5" fill="#E0AE45" /></g>}
          {i === 2 && <path transform="translate(0 -4)" d="M0,12 C-22,-2 -12,-18 0,-8 C12,-18 22,-2 0,12 Z" fill={C.red} />}
        </g>
      ))}
    </g>
    <g className="layer-chars">
      <Adult who="mama" x={590} y={660} scale={0.86} pose="sit" holding="book" expression="smile" />
      <Hamad x={800} y={630} scale={0.78} pose="sit" holding="book" expression="happy" facing="left" />
      <Hessa x={270} y={850} scale={0.86} pose="point" expression="wow" />
    </g>
    <g className="layer-fg">
    </g>
  </>
);

/* ------------------------------------------------------------ 3: tabletop */

const tabletop: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <rect x="0" y="0" width="1200" height="560" fill={`url(#${id}-wall)`} />
      <rect x="0" y="540" width="1200" height="360" fill="#BFA27C" />
      <Window x={520} y={60} w={200} h={210} id={id} />
      <Plant x={1040} y={548} s={0.9} id={id} />
    </g>
    <g className="layer-chars">
      <Hessa x={360} y={770} scale={1} pose="think" expression="think" />
      <Hamad x={850} y={770} scale={1} pose="point" expression="smile" facing="left" />
    </g>
    <g className="layer-fg">
      {/* big wooden tabletop in gentle perspective */}
      <path d="M60,540 L1140,540 L1200,900 L0,900 Z" fill={`url(#${id}-wood)`} />
      <path d="M60,540 L1140,540 L1144,556 L56,556 Z" fill="#fff" opacity="0.2" />
      {[610, 700, 790, 870].map((y, i) => (
        <path key={i} d={`M${40 - i * 8},${y} Q600,${y - 12} ${1160 + i * 8},${y}`} fill="none" stroke={C.woodDeep} strokeWidth="2" opacity="0.18" />
      ))}
      {/* resting hands */}
      <ellipse cx="420" cy="562" rx="20" ry="13" fill="#B07550" />
      <ellipse cx="780" cy="562" rx="20" ry="13" fill="#C99570" />
      {/* felt tray */}
      <g transform="translate(170 620) rotate(-6)">
        <rect x="0" y="0" width="190" height="130" rx="20" fill="#2E4B7E" />
        <rect x="12" y="12" width="166" height="106" rx="14" fill="#3B5E99" />
        <rect x="12" y="12" width="166" height="20" rx="10" fill="#fff" opacity="0.08" />
      </g>
      {/* notebook and pencil */}
      <g transform="translate(900 610) rotate(8)">
        <rect x="0" y="0" width="150" height="190" rx="8" fill="#F7F3EA" />
        <rect x="0" y="0" width="150" height="190" rx="8" fill="none" stroke="#D8CDB6" strokeWidth="3" />
        {[30, 60, 90, 120, 150].map((y) => <path key={y} d={`M18,${y} L132,${y}`} stroke="#B9CDE0" strokeWidth="2" />)}
        <rect x="0" y="0" width="22" height="190" rx="6" fill={C.red} />
      </g>
      <g transform="translate(830 860) rotate(-18)">
        <rect x="0" y="0" width="170" height="14" rx="4" fill="#F2C14E" />
        <path d="M170,0 L196,7 L170,14 Z" fill="#E7C9A0" />
        <path d="M188,4 L196,7 L188,10 Z" fill="#3A3A3A" />
        <rect x="-14" y="0" width="16" height="14" rx="4" fill="#E79AA0" />
      </g>
      {/* ceramic bowl */}
      <g transform="translate(300 830)">
        <ellipse cx="0" cy="18" rx="88" ry="20" fill="#000" opacity="0.12" />
        <path d="M-84,-8 Q-80,40 0,46 Q80,40 84,-8 Z" fill="#E8EEF0" />
        <ellipse cx="0" cy="-8" rx="84" ry="20" fill="#F7FAFB" />
        <ellipse cx="0" cy="-6" rx="70" ry="14" fill="#D7E3E7" />
        <path d="M-80,6 Q0,24 80,6" fill="none" stroke={C.blue} strokeWidth="4" opacity="0.6" />
      </g>
    </g>
  </>
);

/* ------------------------------------------------------------ 4: school bag */

const schoolBag: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <Room id={id} floorY={660} />
      <Window x={170} y={120} w={220} h={250} id={id} />
      {/* pinboard (no text) */}
      <rect x="520" y="140" width="220" height="150" rx="10" fill="#D9B88A" stroke="#B48A57" strokeWidth="6" />
      <rect x="545" y="165" width="70" height="52" rx="4" fill="#BFE0EC" />
      <rect x="635" y="170" width="80" height="60" rx="4" fill="#F7D6D0" />
      <circle cx="580" cy="250" r="16" fill="#F2C14E" />
    </g>
    <g className="layer-mid">
      {/* bed */}
      <rect x="600" y="430" width="40" height="260" rx="10" fill={C.woodDeep} />
      <rect x="610" y="520" width="480" height="140" rx="24" fill="#F6F1E7" />
      <path d="M700,520 L1090,520 L1090,660 L700,660 Q680,600 700,520 Z" fill="#4A6FA8" />
      <path d="M700,520 L1090,520 L1090,540 L700,540 Z" fill="#fff" opacity="0.18" />
      <rect x="626" y="490" width="110" height="60" rx="26" fill="#FFFFFF" />
      <rect x="600" y="650" width="500" height="30" rx="10" fill={C.wood} />
      {/* open school bag */}
      <g transform="translate(800 520)">
        <path d="M-70,0 L70,0 L60,-110 Q0,-130 -60,-110 Z" fill={C.blue} />
        <path d="M-56,-100 Q0,-150 56,-100 L60,-110 Q0,-130 -60,-110 Z" fill="#1A3D9E" />
        <rect x="-44" y="-62" width="88" height="44" rx="10" fill="#2D52B5" />
        <rect x="-10" y="-58" width="20" height="8" rx="3" fill={C.red} />
        <rect x="-30" y="-150" width="12" height="44" rx="3" fill="#F2C14E" />
        <rect x="-14" y="-160" width="40" height="52" rx="3" fill="#F7F3EA" />
      </g>
      {/* water bottle */}
      <g transform="translate(690 520)">
        <rect x="-18" y="-100" width="36" height="100" rx="14" fill="#7FC3D4" />
        <rect x="-18" y="-100" width="36" height="100" rx="14" fill="#fff" opacity="0.15" />
        <rect x="-12" y="-120" width="24" height="24" rx="6" fill={C.grey} />
        <rect x="-10" y="-80" width="6" height="60" rx="3" fill="#fff" opacity="0.5" />
      </g>
      {/* plain pencil and glitter pencil */}
      <g transform="translate(900 506) rotate(-8)">
        <rect x="0" y="0" width="110" height="10" rx="3" fill="#F2C14E" />
        <path d="M110,0 L128,5 L110,10 Z" fill="#E7C9A0" />
      </g>
      <g transform="translate(910 486) rotate(-14)">
        <rect x="0" y="0" width="110" height="11" rx="3" fill="#C88FD1" />
        {[8, 26, 44, 62, 80, 98].map((x) => <circle key={x} cx={x} cy="5.5" r="2.2" fill="#FFF3B0" />)}
        <path d="M110,0 L128,5.5 L110,11 Z" fill="#E7C9A0" />
        <path d="M-12,-8 L0,5 M-12,18 L0,5" stroke="#FFD9F0" strokeWidth="3" />
      </g>
      <Sparkle x={1040} y={470} s={0.8} color="#FFF3B0" />
      {/* small toy car */}
      <g transform="translate(1000 620)">
        <path d="M-40,-10 L-30,-30 L20,-30 L34,-10 L44,-10 L44,8 L-44,8 L-44,-10 Z" fill={C.red} />
        <path d="M-24,-26 L-4,-26 L-4,-12 L-30,-12 Z M2,-26 L16,-26 L26,-12 L2,-12 Z" fill="#CFE9F3" />
        <circle cx="-24" cy="10" r="10" fill="#2B2B2E" />
        <circle cx="24" cy="10" r="10" fill="#2B2B2E" />
        <circle cx="-24" cy="10" r="4" fill="#B7B9BC" />
        <circle cx="24" cy="10" r="4" fill="#B7B9BC" />
      </g>
    </g>
    <g className="layer-chars">
      <Hessa x={260} y={860} scale={0.9} pose="point" expression="smile" />
      <Hamad x={450} y={860} scale={0.9} pose="think" expression="think" />
    </g>
    <g className="layer-fg">
      <ellipse cx="380" cy="860" rx="260" ry="22" fill="#B98F5A" opacity="0.3" />
    </g>
  </>
);

/* ------------------------------------------------------------ 5: souq goal */

const souqGoal: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <defs>
        <linearGradient id={`${id}-lane`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9E3B8" />
          <stop offset="1" stopColor="#E8C690" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1200" height="900" fill="#C99A62" />
      {/* lane opening with light */}
      <path d="M470,240 L730,240 L730,640 L470,640 Z" fill={`url(#${id}-lane)`} />
      <path d="M470,240 Q600,170 730,240 Z" fill="#F9E3B8" />
      {/* side arches */}
      {[0, 1].map((side) => (
        <g key={side}>
          {[0, 1, 2].map((i) => {
            const x = side ? 760 + i * 150 : 300 - i * 150;
            return (
              <g key={i}>
                <rect x={x - 60} y={220 - i * 30} width="120" height={420 + i * 40} fill="#B98656" />
                <path d={`M${x - 46},${640} L${x - 46},${320 - i * 20} Q${x},${250 - i * 30} ${x + 46},${320 - i * 20} L${x + 46},640 Z`} fill="#7A5232" />
                <path d={`M${x - 46},${640} L${x - 46},${320 - i * 20} Q${x},${250 - i * 30} ${x + 46},${320 - i * 20}`} fill="none" stroke="#E2B97E" strokeWidth="5" />
              </g>
            );
          })}
        </g>
      ))}
      {/* wooden ceiling beams */}
      <rect x="0" y="0" width="1200" height="130" fill="#6E4628" />
      {[...Array(16)].map((_, i) => (
        <rect key={i} x={i * 80 - 10} y="0" width="34" height="150" fill="#8A5A33" />
      ))}
      <rect x="0" y="130" width="1200" height="22" fill="#5B3A22" />
      <Lantern x={300} y={210} s={1} />
      <Lantern x={600} y={190} s={0.8} />
      <Lantern x={900} y={210} s={1} />
      {/* hanging fabric */}
      <path d="M90,152 L90,420 Q120,440 150,420 L150,152 Z" fill="#B8262A" />
      <path d="M150,152 L150,380 Q175,396 200,380 L200,152 Z" fill="#2E4B7E" />
      <path d="M100,200 L140,200 M100,260 L140,260 M100,320 L140,320" stroke="#F3E6CC" strokeWidth="5" />
    </g>
    <g className="layer-mid">
      <Floor id={id} y={640} color="#D6B07A" />
      {/* spice sacks */}
      {[[200, '#C6492F'], [290, '#E2A93B'], [380, '#7B8F3E']].map(([x, col], i) => (
        <g key={i} transform={`translate(${x} 700)`}>
          <path d="M-46,0 Q-54,-70 -36,-90 L36,-90 Q54,-70 46,0 Z" fill="#E6D2AA" />
          <path d="M-36,-90 Q0,-70 36,-90 L36,-96 L-36,-96 Z" fill="#CDB385" />
          <ellipse cx="0" cy="-92" rx="34" ry="12" fill={col as string} />
          <path d="M-20,-96 Q0,-120 20,-96 Z" fill={col as string} />
        </g>
      ))}
      {/* goal stall */}
      <rect x="650" y="520" width="410" height="140" rx="10" fill={`url(#${id}-wood)`} />
      <rect x="650" y="520" width="410" height="16" rx="8" fill="#fff" opacity="0.18" />
      <rect x="640" y="508" width="430" height="18" rx="6" fill={C.woodDeep} />
      {/* storybook */}
      <g transform="translate(730 506)">
        <path d="M-50,0 L0,-12 L50,0 L50,-70 L0,-82 L-50,-70 Z" fill="#F7F3EA" />
        <path d="M-56,4 L0,-8 L56,4 L56,-66 L0,-78 L-56,-66 Z" fill="none" stroke="#2E4B7E" strokeWidth="6" />
        <path d="M0,-12 L0,-82" stroke="#D8CDB6" strokeWidth="3" />
        <path d="M-38,-50 L-12,-56 M-38,-36 L-12,-42 M12,-56 L38,-50 M12,-42 L38,-36" stroke="#B9CDE0" strokeWidth="3" />
      </g>
      {/* art kit */}
      <g transform="translate(860 506)">
        <rect x="-60" y="-50" width="120" height="50" rx="6" fill="#F4EFE4" stroke="#C9B994" strokeWidth="3" />
        {['#EF2B2D', '#F2C14E', '#3F8F7E', '#2F6FB0', '#7C5BA6'].map((c, i) => <circle key={c} cx={-44 + i * 22} cy="-25" r="8" fill={c} />)}
        <g transform="translate(-34 -60) rotate(-20)"><rect x="0" y="0" width="70" height="7" rx="3" fill={C.woodDeep} /><path d="M70,0 L86,3.5 L70,7 Z" fill={C.red} /></g>
      </g>
      {/* football */}
      <HeldItem kind="ball" x={985} y={478} s={1.25} />
    </g>
    <g className="layer-chars">
      <Adult who="mama" x={480} y={860} scale={0.84} pose="hold" holding="bag" expression="smile" />
      <Hamad x={330} y={870} scale={0.86} pose="stand" expression="wow" />
      <Hessa x={640} y={880} scale={0.86} pose="point" expression="happy" />
    </g>
    <g className="layer-fg">
    </g>
  </>
);

/* ------------------------------------------------------------ 6: coop store */

function ProductShelf({ x, y, w, rows = 3, seed = 0 }: { x: number; y: number; w: number; rows?: number; seed?: number }) {
  const cols = ['#EF2B2D', '#F2C14E', '#3F8F7E', '#2F6FB0', '#E07A50', '#F7F3EA', '#7C5BA6'];
  return (
    <g>
      <rect x={x} y={y} width={w} height={rows * 90 + 20} rx="8" fill="#E9ECEF" />
      {[...Array(rows)].map((_, r) => (
        <g key={r}>
          {[...Array(Math.floor(w / 38))].map((__, i) => {
            const h = 40 + ((i * 13 + r * 7 + seed) % 28);
            return <rect key={i} x={x + 10 + i * 38} y={y + 96 + r * 90 - h} width="30" height={h} rx="4" fill={cols[(i + r * 2 + seed) % cols.length]} />;
          })}
          <rect x={x} y={y + 96 + r * 90} width={w} height="10" fill="#B7B9BC" />
        </g>
      ))}
    </g>
  );
}

const coopStore: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <rect x="0" y="0" width="1200" height="660" fill="#F7F4EE" />
      <rect x="0" y="0" width="1200" height="70" fill="#FFFFFF" />
      {[100, 400, 700, 1000].map((x) => <rect key={x} x={x} y="20" width="200" height="16" rx="8" fill="#FFF8E2" />)}
      <rect x="0" y="70" width="1200" height="14" fill={C.red} opacity="0.85" />
      <ProductShelf x={130} y={250} w={420} rows={4} seed={1} />
      <ProductShelf x={600} y={250} w={260} rows={4} seed={4} />
      <Floor id={id} y={660} color="#E7E3DA" />
      {[...Array(9)].map((_, i) => <path key={i} d={`M${i * 150},660 L${i * 150 - 120},900`} stroke="#D6D1C6" strokeWidth="2" />)}
      <path d="M0,760 L1200,760" stroke="#D6D1C6" strokeWidth="2" />
    </g>
    <g className="layer-mid">
      {/* produce bins */}
      <g transform="translate(120 700)">
        <path d="M0,0 L230,0 L210,110 L20,110 Z" fill={C.woodLight} />
        {[...Array(9)].map((_, i) => <circle key={i} cx={30 + i * 22} cy={-6 - (i % 2) * 10} r="16" fill={i < 5 ? '#F29A2E' : '#C8463B'} />)}
        {[...Array(8)].map((_, i) => <circle key={`b${i}`} cx={40 + i * 22} cy={-24 - (i % 2) * 8} r="14" fill={i < 4 ? '#F5B04A' : '#8DBE55'} />)}
      </g>
      {/* trolley */}
      <g transform="translate(400 820)">
        <path d="M0,-150 L190,-150 L170,-40 L20,-40 Z" fill="none" stroke="#8B9096" strokeWidth="6" />
        <path d="M30,-120 L170,-120 M40,-90 L165,-90 M50,-60 L160,-60" stroke="#B7B9BC" strokeWidth="3" />
        <path d="M0,-150 L-40,-190" stroke="#8B9096" strokeWidth="6" strokeLinecap="round" />
        <rect x="-60" y="-200" width="34" height="12" rx="6" fill={C.red} />
        <path d="M20,-40 L20,0 M170,-40 L170,0" stroke="#8B9096" strokeWidth="5" />
        <circle cx="20" cy="6" r="10" fill="#3A3D42" />
        <circle cx="170" cy="6" r="10" fill="#3A3D42" />
      </g>
      <Adult who="cashier" x={1000} y={720} scale={0.82} pose="stand" expression="smile" facing="left" />
      {/* checkout counter with terminal */}
      <rect x="880" y="560" width="250" height="200" rx="12" fill="#D9DCDF" />
      <rect x="870" y="548" width="270" height="22" rx="8" fill="#5F6264" />
      <rect x="880" y="590" width="250" height="10" fill={C.red} opacity="0.8" />
      <g transform="translate(940 548)">
        <rect x="-18" y="-46" width="40" height="48" rx="6" fill="#2A2C33" />
        <rect x="-12" y="-40" width="28" height="18" rx="2" fill="#9FC7DB" />
        <g fill="#5F6264">{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={-8 + c * 10} cy={-14 + r * 5} r="1.8" />))}</g>
      </g>
    </g>
    <g className="layer-chars">
      <Hessa x={560} y={870} scale={0.88} pose="point" expression="smile" />
      <Hamad x={720} y={870} scale={0.88} pose="hold" holding="basket" expression="happy" facing="left" />
    </g>
    <g className="layer-fg">
    </g>
  </>
);

/* ------------------------------------------------------------ 7: compare shelf */

function Notebook({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="60" cy="152" rx="66" ry="8" fill="#000" opacity="0.12" />
      <rect x="0" y="0" width="120" height="150" rx="8" fill="#2F6FB0" />
      <rect x="0" y="0" width="120" height="150" rx="8" fill="none" stroke="#1F4E80" strokeWidth="3" />
      <rect x="0" y="0" width="16" height="150" rx="6" fill="#1F4E80" />
      <rect x="34" y="34" width="66" height="34" rx="6" fill="#E9EEF5" />
      <circle cx="96" cy="118" r="12" fill="#F2C14E" />
      <path d="M8,10 L8,140" stroke="#ffffff" strokeWidth="3" opacity="0.25" />
    </g>
  );
}

const compareShelf: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <rect x="0" y="0" width="1200" height="900" fill="#F4F0E8" />
      <rect x="160" y="110" width="880" height="560" rx="16" fill="#E2E5E8" />
      <rect x="180" y="130" width="840" height="520" rx="10" fill="#F7F8F9" />
      {[300, 470, 640].map((y) => <rect key={y} x="180" y={y} width="840" height="16" fill="#B7B9BC" />)}
      {/* top shelf: pencil cups and boxes */}
      {[230, 330, 860, 950].map((x, i) => <rect key={x} x={x} y={300 - 90 - (i % 2) * 20} width="60" height={90 + (i % 2) * 20} rx="6" fill={['#F2C14E', '#3F8F7E', '#E07A50', '#7C5BA6'][i]} />)}
      {[440, 520, 600, 680, 760].map((x, i) => (
        <g key={x}>
          <rect x={x} y="240" width="46" height="60" rx="8" fill="#D8DCE0" />
          {[0, 1, 2].map((k) => <rect key={k} x={x + 8 + k * 11} y={210 - k * 6} width="7" height="40" rx="2" fill={['#EF2B2D', '#2F6FB0', '#F2C14E'][(k + i) % 3]} />)}
        </g>
      ))}
      {/* bottom shelf */}
      {[220, 300, 380, 760, 850, 940].map((x, i) => <rect key={x} x={x} y={640 - 110} width="64" height="110" rx="6" fill={['#F7F3EA', '#E9C46A', '#BFD9EE'][i % 3]} stroke="#D0C7B5" strokeWidth="2" />)}
      <Floor id={id} y={720} color="#E7E1D4" />
    </g>
    <g className="layer-mid">
      {/* two identical notebooks with blank tags */}
      <Notebook x={430} y={318} />
      <Notebook x={650} y={318} />
      <BlankTag x={445} y={480} />
      <BlankTag x={665} y={480} />
    </g>
    <g className="layer-chars">
      <Hessa x={330} y={880} scale={0.92} pose="think" expression="think" />
      <Hamad x={880} y={880} scale={0.92} pose="hold" holding="basket" expression="smile" facing="left" />
    </g>
    <g className="layer-fg">
    </g>
  </>
);

/* ------------------------------------------------------------ 8: bank branch */

const bankBranch: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <defs>
        <linearGradient id={`${id}-bsky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9BD0E6" />
          <stop offset="1" stopColor="#E7F4F7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1200" height="720" fill={`url(#${id}-bsky)`} />
      <Cloud x={100} y={110} s={0.8} />
      <Cloud x={1120} y={80} s={0.7} />
      {/* facade */}
      <rect x="150" y="80" width="900" height="640" rx="6" fill="#F5F5F3" />
      <rect x="150" y="80" width="900" height="640" rx="6" fill={`url(#${id}-glow)`} />
      <rect x="150" y="80" width="900" height="10" fill={C.red} />
      <rect x="150" y="230" width="900" height="8" fill="#E1E2E3" />
      {/* blank sign panel (official logo is overlaid by the app) */}
      <rect x="410" y="104" width="380" height="96" rx="10" fill="#E9EAEB" />
      <rect x="420" y="110" width="360" height="80" rx="6" fill="#FFFFFF" />
      {/* glass frontage with interior */}
      <rect x="190" y="270" width="820" height="450" rx="4" fill={`url(#${id}-glass)`} />
      <rect x="190" y="560" width="820" height="160" fill="#E8E1D4" opacity="0.75" />
      {/* interior: greeter desk, seating, plants */}
      <rect x="250" y="520" width="170" height="80" rx="10" fill="#FFFFFF" />
      <rect x="250" y="520" width="170" height="10" rx="5" fill={C.blue} />
      <rect x="820" y="540" width="140" height="44" rx="18" fill="#A9B6C9" />
      <rect x="820" y="520" width="140" height="30" rx="12" fill="#BCC7D6" />
      <Plant x={300} y={720} s={0.9} id={id} />
      <Plant x={900} y={720} s={0.9} id={id} />
      {[400, 600, 800].map((x) => <path key={x} d={`M${x},270 L${x},720`} stroke="#FFFFFF" strokeWidth="8" />)}
      <path d="M210,300 L330,300 L250,460 Z" fill="#fff" opacity="0.28" />
      <path d="M640,300 L720,300 L660,420 Z" fill="#fff" opacity="0.22" />
      {/* doors */}
      <rect x="500" y="420" width="200" height="300" fill="#DCEBF1" stroke="#9AA5AD" strokeWidth="4" />
      <path d="M600,420 L600,720" stroke="#9AA5AD" strokeWidth="4" />
      <rect x="586" y="540" width="6" height="60" rx="3" fill="#5F6264" />
      <rect x="608" y="540" width="6" height="60" rx="3" fill="#5F6264" />
    </g>
    <g className="layer-mid">
      <rect x="0" y="720" width="1200" height="180" fill="#E3DACB" />
      <rect x="120" y="720" width="960" height="20" fill="#CFC5B4" />
      <path d="M440,740 L760,740 L800,900 L400,900 Z" fill="#D6CCBB" />
    </g>
    <g className="layer-chars">
      <Adult who="banker" x={790} y={800} scale={0.8} pose="wave" expression="happy" facing="left" />
      <Adult who="mama" x={420} y={850} scale={0.84} pose="hold" holding="bag" expression="smile" />
      <Hamad x={270} y={870} scale={0.84} pose="stand" expression="smile" />
      <Hessa x={560} y={880} scale={0.84} pose="wave" expression="happy" />
    </g>
    <g className="layer-fg">
      <Plant x={1080} y={890} s={1.1} id={id} />
    </g>
  </>
);

/* ------------------------------------------------------------ 9: bank counter */

const bankCounter: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <rect x="0" y="0" width="1200" height="900" fill="#F1F2F4" />
      <rect x="0" y="0" width="1200" height="900" fill={`url(#${id}-glow)`} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={60 + i * 190} y="90" width="160" height="300" rx="14" fill="#E6E8EC" />)}
      <rect x="0" y="420" width="1200" height="14" fill={C.blue} opacity="0.85" />
      <rect x="430" y="140" width="340" height="190" rx="16" fill="#FFFFFF" />
      {/* a friendly abstract up-and-right graphic on the wall (no text) */}
      <path d="M480,290 L560,240 L620,262 L720,180" fill="none" stroke={C.red} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="720" cy="180" r="10" fill={C.red} />
      <Plant x={140} y={600} s={1} id={id} />
      <Plant x={1070} y={600} s={1} id={id} />
      <Floor id={id} y={600} color="#E4E1DA" />
    </g>
    <g className="layer-mid">
      <Adult who="banker" x={600} y={700} scale={0.86} pose="hold" expression="happy" />
      {/* counter */}
      <rect x="230" y="540" width="740" height="200" rx="14" fill="#FFFFFF" />
      <rect x="220" y="528" width="760" height="26" rx="10" fill="#D7DADE" />
      <rect x="230" y="600" width="740" height="10" fill={C.red} opacity="0.85" />
      {/* wallet and account folder */}
      <g transform="translate(450 528)">
        <rect x="-44" y="-36" width="88" height="40" rx="8" fill="#8C6446" />
        <rect x="-44" y="-36" width="88" height="14" rx="7" fill="#A87B58" />
        <circle cx="30" cy="-16" r="5" fill="#E0AE45" />
      </g>
      <g transform="translate(760 528)">
        <path d="M-48,0 L-48,-50 L-14,-50 L-6,-58 L48,-58 L48,0 Z" fill="#7FA6CC" />
        <rect x="-48" y="-44" width="96" height="44" rx="4" fill="#9FC3E6" />
        <path d="M-30,-26 L30,-26 M-30,-14 L14,-14" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>
    <g className="layer-chars">
      <Adult who="mama" x={250} y={880} scale={0.84} pose="stand" expression="smile" />
      <Hessa x={430} y={890} scale={0.86} pose="point" expression="wow" />
      <Hamad x={820} y={890} scale={0.86} pose="stand" expression="happy" facing="left" />
    </g>
    <g className="layer-fg" />
  </>
);

/* ------------------------------------------------------------ 10: card and ATM */

const cardAtm: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      {/* left zone: shop */}
      <rect x="0" y="0" width="600" height="660" fill="#F7F1E6" />
      <ProductShelf x={60} y={170} w={340} rows={3} seed={2} />
      {/* right zone: ATM wall */}
      <rect x="600" y="0" width="600" height="660" fill="#E6E9EE" />
      {[...Array(6)].map((_, i) => <path key={i} d={`M600,${i * 110} L1200,${i * 110}`} stroke="#D7DCE3" strokeWidth="3" />)}
      <rect x="760" y="230" width="240" height="430" rx="16" fill="#C8CDD4" />
      <rect x="776" y="246" width="208" height="414" rx="10" fill="#5F6264" />
      <rect x="800" y="276" width="160" height="110" rx="6" fill="#9FC7DB" />
      <rect x="800" y="276" width="160" height="110" rx="6" fill="#fff" opacity="0.2" />
      <g fill="#B7B9BC">{[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={836 + c * 30} y={420 + r * 24} width="22" height="16" rx="3" />))}</g>
      <rect x="820" y="540" width="120" height="12" rx="6" fill="#2A2C33" />
      <rect x="840" y="582" width="80" height="8" rx="4" fill="#2A2C33" />
      <rect x="760" y="210" width="240" height="22" rx="8" fill={C.blue} />
      {/* soft divider: pillar */}
      <rect x="578" y="0" width="44" height="660" fill="#D9D3C7" />
      <Floor id={id} y={660} color="#E2DCD0" />
      <path d="M600,660 L600,900" stroke="#CFC7B8" strokeWidth="4" />
    </g>
    <g className="layer-mid">
      {/* shop counter + terminal */}
      <rect x="150" y="560" width="350" height="190" rx="12" fill={`url(#${id}-wood)`} />
      <rect x="140" y="548" width="370" height="22" rx="8" fill={C.woodDeep} />
      <g transform="translate(450 548)">
        <rect x="-22" y="-60" width="48" height="62" rx="8" fill="#2A2C33" />
        <rect x="-15" y="-52" width="34" height="22" rx="2" fill="#9FC7DB" />
        <g fill="#5F6264">{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={-8 + c * 12} cy={-22 + r * 7} r="2.2" />))}</g>
      </g>
      <Plant x={600} y={780} s={1.1} id={id} />
    </g>
    <g className="layer-chars">
      <Hessa x={300} y={880} scale={0.86} pose="stand" expression="wow" />
      <Adult who="mama" x={560} y={860} scale={0.86} pose="point" holding="card" expression="smile" facing="left" />
      <Hamad x={860} y={880} scale={0.86} pose="point" expression="think" />
    </g>
    <g className="layer-fg">
    </g>
  </>
);

/* ------------------------------------------------------------ 11: message at home */

const messageHome: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <Room id={id} floorY={660} />
      <Window x={110} y={120} w={200} h={240} id={id} />
      <Plant x={1080} y={660} s={1} id={id} />
    </g>
    <g className="layer-mid">
      {/* sofa */}
      <rect x="290" y="470" width="620" height="130" rx="40" fill="#8AA0BC" />
      <rect x="260" y="540" width="680" height="120" rx="34" fill="#9DB2CC" />
      <rect x="250" y="520" width="70" height="170" rx="30" fill="#7F96B3" />
      <rect x="880" y="520" width="70" height="170" rx="30" fill="#7F96B3" />
      <rect x="290" y="470" width="620" height="16" rx="8" fill="#fff" opacity="0.15" />
      {/* friendly fictional message bubble: gift shape + blank lines, clearly not a real notification */}
      <g transform="translate(600 210)">
        <path d="M-190,-110 L190,-110 Q220,-110 220,-80 L220,70 Q220,100 190,100 L20,100 L-10,150 L-20,100 L-190,100 Q-220,100 -220,70 L-220,-80 Q-220,-110 -190,-110 Z" fill="#FFFFFF" stroke="#B7B9BC" strokeWidth="3" strokeDasharray="10 8" />
        <circle cx="-140" cy="-20" r="54" fill="#FFF1D6" />
        <rect x="-174" y="-34" width="68" height="52" rx="6" fill={C.red} />
        <rect x="-180" y="-50" width="80" height="20" rx="5" fill="#CE0000" />
        <rect x="-146" y="-50" width="12" height="68" fill="#F2C14E" />
        <path d="M-140,-50 Q-160,-76 -150,-56 M-140,-50 Q-120,-76 -130,-56" fill="none" stroke="#F2C14E" strokeWidth="6" strokeLinecap="round" />
        <rect x="-60" y="-56" width="230" height="16" rx="8" fill="#E3E5E8" />
        <rect x="-60" y="-24" width="190" height="16" rx="8" fill="#E3E5E8" />
        <rect x="-60" y="8" width="210" height="16" rx="8" fill="#E3E5E8" />
        <rect x="-60" y="44" width="110" height="30" rx="15" fill="#F2C14E" opacity="0.6" />
        <g transform="translate(176 -82)">
          <circle r="24" fill="#FFB547" />
          <path d="M0,-12 L0,4" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <circle cx="0" cy="12" r="3.6" fill="#fff" />
        </g>
      </g>
    </g>
    <g className="layer-chars">
      <Hessa x={470} y={672} scale={0.82} pose="sit" expression="think" />
      <Hamad x={700} y={672} scale={0.82} pose="sit" expression="wow" facing="left" />
      <HeldItem kind="tablet" x={590} y={520} s={1.3} />
      <Adult who="mama" x={990} y={870} scale={0.84} pose="wave" expression="smile" facing="left" />
    </g>
    <g className="layer-fg">
    </g>
  </>
);

/* ------------------------------------------------------------ 12: helping at home */

const helpingHome: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <Room id={id} floorY={650} />
      <Window x={460} y={110} w={260} h={230} id={id} />
      <SaduCushion x={980} y={590} w={170} h={110} r={0} />
      <Bookshelf x={60} y={260} id={id} />
    </g>
    <g className="layer-mid">
      <ellipse cx="620" cy="800" rx="520" ry="80" fill="#E7D3B2" />
      <ellipse cx="620" cy="800" rx="490" ry="64" fill="none" stroke="#B8262A" strokeWidth="5" opacity="0.5" />
      {/* low table with tea tray and dates */}
      <Table x={400} y={660} w={200} h={24} legs={60} id={id} />
      <ellipse cx="500" cy="656" rx="84" ry="16" fill="#C9A24A" />
      <ellipse cx="500" cy="652" rx="78" ry="13" fill="#E3BE62" />
      <g transform="translate(470 650)">
        <path d="M-16,0 Q-20,-40 0,-46 Q20,-40 16,0 Z" fill="#D9A93B" />
        <path d="M0,-46 L0,-56" stroke="#B3862A" strokeWidth="5" />
        <path d="M16,-28 Q34,-34 36,-48" fill="none" stroke="#B3862A" strokeWidth="5" strokeLinecap="round" />
      </g>
      {[530, 552].map((x) => <rect key={x} x={x} y="636" width="14" height="16" rx="3" fill="#FFFFFF" />)}
      <ellipse cx="515" cy="660" rx="18" ry="6" fill="#6B3A22" />
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={505 + i * 7} cy={656 - (i % 2) * 3} rx="6" ry="4" fill="#5A2E19" />)}
    </g>
    <g className="layer-chars">
      <Adult who="grandma" x={950} y={760} scale={0.72} pose="sit" expression="happy" facing="left" />
      <Cousin x={800} y={850} scale={0.62} pose="stand" expression="happy" facing="left" />
      <g transform="translate(680 790)">
        <ellipse cx="0" cy="16" rx="90" ry="14" fill="#3a2a1a" opacity="0.15" />
        <rect x="-86" y="-30" width="172" height="46" rx="20" fill="#2E4B7E" />
        <rect x="-86" y="-30" width="172" height="12" rx="6" fill="#fff" opacity="0.15" />
      </g>
      <Hamad x={640} y={830} scale={0.82} pose="sit" holding="book" expression="smile" />
      <Hessa x={270} y={870} scale={0.88} pose="hold" holding="pencilcase" expression="happy" />
      {/* tape roll beside Hessa */}
      <g transform="translate(380 850)">
        <circle r="18" fill="#D9E4EA" />
        <circle r="8" fill="#F4EBDD" />
      </g>
    </g>
    <g className="layer-fg">
    </g>
  </>
);

/* ------------------------------------------------------------ 13: notebook desk */

const notebookDesk: SceneFn = ({ id }) => (
  <>
    <g className="layer-bg">
      <rect x="0" y="0" width="1200" height="550" fill={`url(#${id}-wall)`} />
      <rect x="0" y="540" width="1200" height="360" fill="#BFA27C" />
      <Window x={500} y={60} w={200} h={180} id={id} />
      {[180, 1000].map((x) => (
        <g key={x} transform={`translate(${x} 120)`}>
          <rect x="-50" y="-40" width="100" height="80" rx="6" fill="#FFFDF8" stroke="#E0D2B8" strokeWidth="4" />
          <circle cx="-14" cy="0" r="14" fill={x < 600 ? '#BFE0EC' : '#F7D6D0'} />
          <path d="M-40,30 L-10,4 L10,20 L30,0 L40,30 Z" fill={x < 600 ? '#79B07A' : '#E9B07A'} />
        </g>
      ))}
    </g>
    <g className="layer-chars">
      <Hessa x={360} y={790} scale={1} pose="cheer" expression="happy" />
      <Hamad x={840} y={790} scale={1} pose="point" expression="happy" facing="left" />
    </g>
    <g className="layer-fg">
      <path d="M40,540 L1160,540 L1200,900 L0,900 Z" fill={`url(#${id}-wood)`} />
      <path d="M40,540 L1160,540 L1162,554 L38,554 Z" fill="#fff" opacity="0.2" />
      {/* open grid notebook */}
      <g transform="translate(600 720)">
        <ellipse cx="0" cy="130" rx="300" ry="20" fill="#000" opacity="0.12" />
        <path d="M-280,-160 L-6,-150 L-6,150 L-290,140 Z" fill="#FBFAF6" />
        <path d="M6,-150 L280,-160 L290,140 L6,150 Z" fill="#FFFFFF" />
        <defs>
          <pattern id={`${id}-grid`} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22,0 L0,0 L0,22" fill="none" stroke="#C9DBEA" strokeWidth="1.5" />
          </pattern>
        </defs>
        <path d="M-266,-144 L-20,-136 L-20,136 L-274,128 Z" fill={`url(#${id}-grid)`} />
        <path d="M20,-136 L266,-144 L274,128 L20,136 Z" fill={`url(#${id}-grid)`} />
        <path d="M0,-152 L0,152" stroke="#D8CDB6" strokeWidth="6" />
        <g fill={C.red} opacity="0.85">
          <rect x="-200" y="-96" width="22" height="22" />
          <rect x="-178" y="-96" width="22" height="22" opacity="0.6" />
          <rect x="-156" y="-96" width="22" height="22" />
          <rect x="-178" y="-74" width="22" height="22" opacity="0.6" />
        </g>
        <g fill={C.blue} opacity="0.7">
          <rect x="80" y="-30" width="22" height="22" />
          <rect x="80" y="-8" width="22" height="22" />
          <rect x="102" y="-8" width="22" height="22" />
        </g>
      </g>
      {/* pencils and pencil cup */}
      <g transform="translate(220 700)">
        <path d="M-50,-90 L50,-90 L42,20 L-42,20 Z" fill="#3F8F7E" />
        {[-30, -10, 10, 30].map((x, i) => (
          <g key={x} transform={`translate(${x} -90) rotate(${-8 + i * 5})`}>
            <rect x="-5" y="-70" width="10" height="70" rx="2" fill={['#F2C14E', C.red, '#2F6FB0', '#7C5BA6'][i]} />
            <path d="M-5,-70 L0,-84 L5,-70 Z" fill="#E7C9A0" />
          </g>
        ))}
      </g>
      <g transform="translate(880 860) rotate(-10)">
        <rect x="0" y="0" width="150" height="12" rx="3" fill="#F2C14E" />
        <path d="M150,0 L172,6 L150,12 Z" fill="#E7C9A0" />
      </g>
      <Plant x={1000} y={680} s={1} id={id} />
    </g>
  </>
);

/* ------------------------------------------------------------ registry */

const SCENES: Record<SceneId, SceneFn> = {
  'waterfront-day': waterfrontDay,
  'reading-corner': readingCorner,
  tabletop,
  'school-bag': schoolBag,
  'souq-goal': souqGoal,
  'coop-store': coopStore,
  'compare-shelf': compareShelf,
  'bank-branch': bankBranch,
  'bank-counter': bankCounter,
  'card-atm': cardAtm,
  'message-home': messageHome,
  'helping-home': helpingHome,
  'notebook-desk': notebookDesk,
  'waterfront-sunset': waterfrontSunset,
};

/** Desktop and portrait crops. The portrait crop keeps the children's feet (y up to ~880). */
export const SCENE_VIEWBOX = { wide: '0 0 1200 900', tall: '150 100 900 800' } as const;

export function SceneArt({ id, crop, className }: { id: SceneId; crop: 'wide' | 'tall'; className?: string }): JSX.Element {
  const sid = useSvgId('sc');
  const Scene = SCENES[id];
  return (
    <svg
      className={`scene-art ${className ?? ''}`}
      viewBox={crop === 'wide' ? SCENE_VIEWBOX.wide : SCENE_VIEWBOX.tall}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      data-scene={id}
    >
      <CommonDefs id={sid} />
      <Scene id={sid} />
      <Grain id={sid} />
    </svg>
  );
}

