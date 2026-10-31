/*
 * Original story characters for "The Little Dinar Journey".
 * Hand-authored SVG. Hessa and Hamad are story characters, not Gulf Bank mascots.
 * Kids are drawn in a local 0..200 x 0..400 box (feet at y=400),
 * adults in a local 0..220 x 0..520 box (feet at y=520).
 */
import type { JSX } from 'react';
import { useSvgId } from './ids';

export type Pose = 'stand' | 'wave' | 'point' | 'hold' | 'cheer' | 'think' | 'sit';
export type Expression = 'smile' | 'wow' | 'think' | 'happy';
export type Holding = 'jar' | 'book' | 'none' | 'notebook' | 'phone' | 'bag' | 'ball' | 'pencilcase' | 'basket' | 'card' | 'tablet';

export interface FigureProps {
  x: number;
  y: number;
  scale?: number;
  pose?: Pose;
  expression?: Expression;
  facing?: 'left' | 'right';
  className?: string;
  holding?: Holding;
}

type Pt = [number, number];
interface ArmSet { l: [Pt, Pt, Pt]; r: [Pt, Pt, Pt] }

/* ---------------------------------------------------------------- shared bits */

const INK = '#2B2420';

function place(x: number, y: number, s: number, w: number, h: number, facing: 'left' | 'right') {
  const half = w / 2;
  return facing === 'left'
    ? `translate(${x + half * s} ${y - h * s}) scale(${-s} ${s})`
    : `translate(${x - half * s} ${y - h * s}) scale(${s})`;
}

function Face({ cx, cy, r, expression, skin, shade, gid }: {
  cx: number; cy: number; r: number; expression: Expression; skin: string; shade: string; gid: string;
}) {
  const k = r / 50;
  const ex = 18 * k;
  const ey = cy + 6 * k;
  const eyeRy = (expression === 'wow' ? 8.2 : 7) * k;
  const look = expression === 'think' ? -2.2 * k : 0;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gid}-face)`} />
      <defs>
        <radialGradient id={`${gid}-face`} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor={skin} stopOpacity="1" />
          <stop offset="0.7" stopColor={skin} />
          <stop offset="1" stopColor={shade} />
        </radialGradient>
      </defs>
      {/* cheeks */}
      <circle cx={cx - 28 * k} cy={cy + 22 * k} r={8 * k} fill="#E77E6F" opacity="0.35" />
      <circle cx={cx + 28 * k} cy={cy + 22 * k} r={8 * k} fill="#E77E6F" opacity="0.35" />
      {/* eyes */}
      {expression === 'happy' ? (
        <g fill="none" stroke={INK} strokeWidth={3.2 * k} strokeLinecap="round">
          <path d={`M${cx - ex - 6 * k},${ey + 2 * k} Q${cx - ex},${ey - 6 * k} ${cx - ex + 6 * k},${ey + 2 * k}`} />
          <path d={`M${cx + ex - 6 * k},${ey + 2 * k} Q${cx + ex},${ey - 6 * k} ${cx + ex + 6 * k},${ey + 2 * k}`} />
        </g>
      ) : (
        <g>
          <ellipse cx={cx - ex} cy={ey} rx={5.6 * k} ry={eyeRy} fill={INK} />
          <ellipse cx={cx + ex} cy={ey} rx={5.6 * k} ry={eyeRy} fill={INK} />
          <circle cx={cx - ex + 1.8 * k} cy={ey - 2.6 * k + look} r={1.9 * k} fill="#fff" />
          <circle cx={cx + ex + 1.8 * k} cy={ey - 2.6 * k + look} r={1.9 * k} fill="#fff" />
        </g>
      )}
      {/* brows */}
      <g fill="none" stroke={INK} strokeWidth={2.6 * k} strokeLinecap="round" opacity="0.85">
        {expression === 'think' ? (
          <>
            <path d={`M${cx - ex - 7 * k},${ey - 13 * k} Q${cx - ex},${ey - 15 * k} ${cx - ex + 7 * k},${ey - 12 * k}`} />
            <path d={`M${cx + ex - 7 * k},${ey - 15 * k} Q${cx + ex},${ey - 21 * k} ${cx + ex + 7 * k},${ey - 17 * k}`} />
          </>
        ) : expression === 'wow' ? (
          <>
            <path d={`M${cx - ex - 7 * k},${ey - 16 * k} Q${cx - ex},${ey - 22 * k} ${cx - ex + 7 * k},${ey - 17 * k}`} />
            <path d={`M${cx + ex - 7 * k},${ey - 17 * k} Q${cx + ex},${ey - 22 * k} ${cx + ex + 7 * k},${ey - 16 * k}`} />
          </>
        ) : (
          <>
            <path d={`M${cx - ex - 7 * k},${ey - 13 * k} Q${cx - ex},${ey - 18 * k} ${cx - ex + 7 * k},${ey - 14 * k}`} />
            <path d={`M${cx + ex - 7 * k},${ey - 14 * k} Q${cx + ex},${ey - 18 * k} ${cx + ex + 7 * k},${ey - 13 * k}`} />
          </>
        )}
      </g>
      {/* nose */}
      <path d={`M${cx - 3 * k},${cy + 17 * k} Q${cx},${cy + 21 * k} ${cx + 3 * k},${cy + 17 * k}`} fill="none" stroke={shade} strokeWidth={2.4 * k} strokeLinecap="round" />
      {/* mouth */}
      {expression === 'smile' && (
        <path d={`M${cx - 11 * k},${cy + 29 * k} Q${cx},${cy + 39 * k} ${cx + 11 * k},${cy + 29 * k}`} fill="none" stroke={INK} strokeWidth={3 * k} strokeLinecap="round" />
      )}
      {expression === 'happy' && (
        <g>
          <path d={`M${cx - 13 * k},${cy + 27 * k} Q${cx},${cy + 45 * k} ${cx + 13 * k},${cy + 27 * k} Z`} fill="#7A2B2B" />
          <path d={`M${cx - 7 * k},${cy + 35 * k} Q${cx},${cy + 41 * k} ${cx + 7 * k},${cy + 35 * k} Q${cx},${cy + 32 * k} ${cx - 7 * k},${cy + 35 * k}`} fill="#E07A70" />
        </g>
      )}
      {expression === 'wow' && <ellipse cx={cx} cy={cy + 33 * k} rx={5.5 * k} ry={6.5 * k} fill="#7A2B2B" />}
      {expression === 'think' && (
        <path d={`M${cx - 7 * k},${cy + 33 * k} Q${cx + 2 * k},${cy + 30 * k} ${cx + 9 * k},${cy + 34 * k}`} fill="none" stroke={INK} strokeWidth={3 * k} strokeLinecap="round" />
      )}
    </g>
  );
}

function Arm({ pts, sleeve, sleeveShade, skin, w, handR, bare }: {
  pts: [Pt, Pt, Pt]; sleeve: string; sleeveShade: string; skin: string; w: number; handR: number; bare?: boolean;
}) {
  const [s, e, h] = pts;
  const d = `M${s[0]},${s[1]} L${e[0]},${e[1]} L${h[0]},${h[1]}`;
  return (
    <g>
      {bare ? (
        <>
          <path d={d} fill="none" stroke={skin} strokeWidth={w * 0.82} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={s[0]} cy={s[1]} r={w * 0.62} fill={sleeve} />
        </>
      ) : (
        <>
          <path d={d} fill="none" stroke={sleeveShade} strokeWidth={w + 2} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke={sleeve} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      <circle cx={h[0]} cy={h[1]} r={handR} fill={skin} />
      <circle cx={h[0] - handR * 0.3} cy={h[1] - handR * 0.3} r={handR * 0.45} fill="#fff" opacity="0.12" />
    </g>
  );
}

/* ---------------------------------------------------------------- held items */

export function HeldItem({ kind, x, y, s = 1 }: { kind: Holding; x: number; y: number; s?: number }) {
  if (kind === 'none') return null;
  const t = `translate(${x} ${y}) scale(${s})`;
  switch (kind) {
    case 'jar':
      return <SavingsJar x={x} y={y + 30 * s} scale={0.42 * s} fill={0.4} />;
    case 'book':
      return (
        <g transform={t}>
          <rect x="-22" y="-28" width="44" height="54" rx="4" fill="#C8463B" />
          <rect x="-22" y="-28" width="8" height="54" rx="3" fill="#9E3029" />
          <rect x="-10" y="-16" width="24" height="14" rx="3" fill="#F6E7C8" opacity="0.9" />
        </g>
      );
    case 'notebook':
      return (
        <g transform={t}>
          <rect x="-20" y="-26" width="40" height="50" rx="4" fill="#2F6FB0" />
          <rect x="-20" y="-26" width="40" height="50" rx="4" fill="none" stroke="#1F4E80" strokeWidth="2" />
          <g fill="#E9EEF5">{[-18, -10, -2, 6, 14].map((yy) => <circle key={yy} cx="-20" cy={yy} r="2" />)}</g>
        </g>
      );
    case 'phone':
      return (
        <g transform={t}>
          <rect x="-10" y="-18" width="20" height="36" rx="4" fill="#2A2C33" />
          <rect x="-7.5" y="-14" width="15" height="27" rx="2" fill="#8FB5D9" />
        </g>
      );
    case 'bag':
      return (
        <g transform={t}>
          <path d="M-12,-10 Q0,-30 12,-10" fill="none" stroke="#6B4A32" strokeWidth="4" />
          <rect x="-22" y="-12" width="44" height="34" rx="7" fill="#8C6446" />
          <rect x="-22" y="-12" width="44" height="10" rx="5" fill="#A87B58" />
        </g>
      );
    case 'ball':
      return (
        <g transform={t}>
          <circle r="22" fill="#FAFAF7" />
          <circle r="22" fill="none" stroke="#D5D5D0" strokeWidth="2" />
          <path d="M0,-8 L8,-2 L5,8 L-5,8 L-8,-2 Z" fill="#2B2B2E" />
          <path d="M-20,-8 L-14,-4 M14,-4 L20,-8 M-8,18 L-5,8 M5,8 L8,18 M0,-8 L0,-20" stroke="#2B2B2E" strokeWidth="2" />
        </g>
      );
    case 'pencilcase':
      return (
        <g transform={t}>
          <rect x="-30" y="-12" width="60" height="26" rx="12" fill="#3F8F7E" />
          <path d="M-26,-2 L26,-2" stroke="#E7D9A8" strokeWidth="2.5" strokeDasharray="4 3" />
          <rect x="-6" y="-14" width="12" height="30" fill="#F2EAD3" opacity="0.85" />
        </g>
      );
    case 'basket':
      return (
        <g transform={t}>
          <path d="M-22,-6 Q0,-40 22,-6" fill="none" stroke="#B7B9BC" strokeWidth="4" />
          <path d="M-30,-6 L30,-6 L24,26 L-24,26 Z" fill="#EF2B2D" />
          <path d="M-30,-6 L30,-6 L29,0 L-29,0 Z" fill="#CE0000" />
          <g stroke="#CE0000" strokeWidth="2">{[-16, -6, 4, 14].map((xx) => <path key={xx} d={`M${xx},4 L${xx + 2},22`} />)}</g>
          <rect x="-12" y="-16" width="9" height="14" rx="2" fill="#2F6FB0" />
          <rect x="2" y="-20" width="4" height="18" rx="1" fill="#E2B04A" />
        </g>
      );
    case 'card':
      return (
        <g transform={t}>
          <rect x="-16" y="-11" width="32" height="22" rx="3.5" fill="#2E3A6B" />
          <rect x="-16" y="-5" width="32" height="5" fill="#1C254A" />
          <rect x="-11" y="3" width="8" height="5" rx="1" fill="#D8B860" />
        </g>
      );
    case 'tablet':
      return (
        <g transform={t}>
          <rect x="-34" y="-24" width="68" height="48" rx="6" fill="#2A2C33" />
          <rect x="-29" y="-19" width="58" height="38" rx="3" fill="#BFD9EE" />
          <rect x="-29" y="-19" width="58" height="38" rx="3" fill="#fff" opacity="0.2" />
        </g>
      );
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- kids */

type KidLookId = 'hessa' | 'hamad' | 'cousin';
interface KidLook {
  skin: string; shade: string; hair: string; hairStyle: 'braid' | 'short' | 'curly';
  outfit: 'dress' | 'dishdasha' | 'tee'; main: string; mainShade: string; legs: string; shoe: string; backpack?: boolean;
}
const KID_LOOKS: Record<KidLookId, KidLook> = {
  hessa: { skin: '#B07550', shade: '#8E5838', hair: '#3A2318', hairStyle: 'braid', outfit: 'dress', main: '#22356A', mainShade: '#16244B', legs: '#CDD0D6', shoe: '#FBFBF8' },
  hamad: { skin: '#C99570', shade: '#A6744F', hair: '#24180F', hairStyle: 'short', outfit: 'dishdasha', main: '#F8F6F1', mainShade: '#D9D4CA', legs: '#E9E5DC', shoe: '#4A4D53' },
  cousin: { skin: '#BC8159', shade: '#9A6240', hair: '#2E1E15', hairStyle: 'curly', outfit: 'tee', main: '#F0BC4C', mainShade: '#CF9A2E', legs: '#5E78A8', shoe: '#EF2B2D' },
};

const KID_ARMS: Record<Pose, ArmSet> = {
  stand: { l: [[70, 168], [60, 218], [62, 262]], r: [[130, 168], [140, 218], [138, 262]] },
  wave: { l: [[70, 168], [60, 218], [62, 262]], r: [[130, 168], [162, 138], [170, 88]] },
  point: { l: [[70, 168], [60, 218], [62, 262]], r: [[130, 168], [162, 186], [196, 172]] },
  hold: { l: [[70, 168], [62, 214], [90, 236]], r: [[130, 168], [138, 214], [110, 236]] },
  cheer: { l: [[70, 168], [40, 136], [34, 90]], r: [[130, 168], [160, 136], [166, 90]] },
  think: { l: [[70, 168], [66, 216], [104, 212]], r: [[130, 168], [146, 206], [118, 150]] },
  sit: { l: [[70, 168], [62, 214], [92, 238]], r: [[130, 168], [140, 214], [114, 240]] },
};

function Kid({ look: id, x, y, scale = 1, pose = 'stand', expression = 'smile', facing = 'right', className, holding = 'none' }: FigureProps & { look: KidLookId }): JSX.Element {
  const L = KID_LOOKS[id];
  const g = useSvgId(`k${id}`);
  const arms = KID_ARMS[pose];
  const sitting = pose === 'sit';
  const bodyShift = sitting ? 46 : 0;
  const longSleeve = L.outfit !== 'tee';
  const holdAt: Pt = pose === 'hold' || pose === 'sit' ? [100, 240] : arms.r[2];
  return (
    <g className={`char ${className ?? ''}`} transform={place(x, y, scale, 200, 400, facing)}>
      <defs>
        <linearGradient id={`${g}-cloth`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={L.main} />
          <stop offset="0.6" stopColor={L.main} />
          <stop offset="1" stopColor={L.mainShade} />
        </linearGradient>
      </defs>
      {/* contact shadow */}
      <ellipse cx={sitting ? 125 : 100} cy="398" rx="58" ry="9" fill="#3a2a1a" opacity="0.18" />

      {/* legs and shoes */}
      {sitting ? (
        <g>
          {/* thighs forward, shins down, feet forward */}
          <rect x="70" y="300" width="100" height="40" rx="20" fill={L.outfit === 'tee' ? L.legs : L.main} />
          <rect x="70" y="326" width="100" height="14" rx="7" fill={L.outfit === 'tee' ? L.legs : L.mainShade} opacity="0.6" />
          <rect x="140" y="320" width="26" height="70" rx="12" fill={L.outfit === 'dishdasha' ? L.main : L.legs} />
          <rect x="150" y="320" width="16" height="70" rx="8" fill="#000" opacity="0.06" />
          <path d="M140,394 Q140,382 156,382 Q178,382 180,394 Q180,400 174,400 L146,400 Q140,400 140,394 Z" fill={L.shoe} />
          <path d="M141,398 L179,398" stroke="#00000030" strokeWidth="3" />
        </g>
      ) : (
        <g>
          <rect x="79" y="270" width="18" height="118" rx="9" fill={L.legs} />
          <rect x="103" y="270" width="18" height="118" rx="9" fill={L.legs} />
          <rect x="112" y="270" width="9" height="118" rx="4" fill="#000" opacity="0.06" />
          <path d="M72,394 Q72,382 88,382 Q100,382 101,394 Q101,400 88,400 L76,400 Q72,400 72,394 Z" fill={L.shoe} />
          <path d="M99,394 Q99,382 113,382 Q128,382 128,394 Q128,400 124,400 L111,400 Q99,400 99,394 Z" fill={L.shoe} />
          <path d="M73,398 L100,398 M100,398 L127,398" stroke="#00000030" strokeWidth="3" />
        </g>
      )}

      <g transform={`translate(0 ${bodyShift})`}>
        {/* backpack straps / pack */}
        {L.backpack && <rect x="58" y="170" width="84" height="90" rx="22" fill="#2B4E9A" />}
        {/* neck */}
        <rect x="90" y="132" width="20" height="26" rx="8" fill={L.shade} />

        {/* torso */}
        {L.outfit === 'dress' && (
          <g>
            <path d={sitting ? 'M70,160 Q100,146 130,160 L138,204 L144,262 Q100,272 56,262 L62,204 Z' : 'M70,160 Q100,146 130,160 L138,204 L152,298 Q100,312 48,298 L62,204 Z'} fill={`url(#${g}-cloth)`} />
            <path d={sitting ? 'M56,262 Q100,272 144,262' : 'M48,298 Q100,312 152,298'} fill="none" stroke={L.mainShade} strokeWidth="3" />
            <path d="M86,152 Q92,166 100,160 Q108,166 114,152" fill="#F4F1EA" />
            <path d="M62,232 Q100,240 140,232" fill="none" stroke={L.mainShade} strokeWidth="2" opacity="0.5" />
          </g>
        )}
        {L.outfit === 'dishdasha' && (
          <g>
            <path d={sitting ? 'M70,158 Q100,146 130,158 L138,210 L142,270 Q100,278 58,270 L62,210 Z' : 'M70,158 Q100,146 130,158 L138,210 L146,372 Q100,382 54,372 L62,210 Z'} fill={`url(#${g}-cloth)`} />
            <path d="M92,150 L92,156 Q100,162 108,156 L108,150" fill="none" stroke={L.mainShade} strokeWidth="3" />
            <path d="M100,160 L100,214" stroke={L.mainShade} strokeWidth="2" />
            <circle cx="100" cy="176" r="2.4" fill={L.mainShade} />
            <circle cx="100" cy="194" r="2.4" fill={L.mainShade} />
            {!sitting && <path d="M120,220 Q126,300 122,370" fill="none" stroke={L.mainShade} strokeWidth="2" opacity="0.6" />}
          </g>
        )}
        {L.outfit === 'tee' && (
          <g>
            <rect x="76" y="250" width="48" height="40" rx="12" fill={L.legs} />
            <path d="M70,160 Q100,148 130,160 L134,258 Q100,266 66,258 Z" fill={`url(#${g}-cloth)`} />
            <circle cx="100" cy="210" r="11" fill="#fff" opacity="0.5" />
          </g>
        )}

        {/* head */}
        {L.hairStyle === 'braid' && (
          <path d="M138,104 C150,130 152,150 148,176" fill="none" stroke={L.hair} strokeWidth="1" />
        )}
        <circle cx="52" cy="98" r="9" fill={L.skin} />
        <circle cx="148" cy="98" r="9" fill={L.skin} />
        <Face cx={100} cy={92} r={50} expression={expression} skin={L.skin} shade={L.shade} gid={g} />

        {/* hair */}
        {L.hairStyle === 'braid' && (
          <g>
            <path d="M48,100 C40,40 92,24 118,34 C150,44 160,74 152,104 C146,80 130,64 112,62 C100,74 74,80 54,82 C50,88 48,94 48,100 Z" fill={L.hair} />
            <path d="M62,58 C80,44 104,40 120,46" fill="none" stroke="#6B4632" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx={150 + (i % 2 ? 3 : -2)} cy={112 + i * 17} rx="10" ry="11" fill={L.hair} />
            ))}
            <rect x="142" y="196" width="16" height="7" rx="3" fill="#EF2B2D" />
            <path d="M144,203 Q150,222 156,203 Z" fill={L.hair} />
          </g>
        )}
        {L.hairStyle === 'short' && (
          <g>
            <path d="M50,96 C44,46 82,30 104,32 C140,34 158,60 150,96 C146,76 136,64 120,60 C108,70 86,66 70,62 C58,70 52,82 50,96 Z" fill={L.hair} />
            <path d="M72,48 C92,38 116,38 134,48" fill="none" stroke="#4E3a2c" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
          </g>
        )}
        {L.hairStyle === 'curly' && (
          <g fill={L.hair}>
            {[[56, 70], [66, 52], [84, 40], [104, 36], [124, 42], [140, 56], [148, 74], [76, 58], [118, 52]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="16" />
            ))}
          </g>
        )}

        {/* left arm (behind held item) */}
        <Arm pts={arms.l} sleeve={L.main} sleeveShade={L.mainShade} skin={L.skin} w={18} handR={10} bare={!longSleeve} />
        <HeldItem kind={holding} x={holdAt[0]} y={holdAt[1]} />
        <Arm pts={arms.r} sleeve={L.main} sleeveShade={L.mainShade} skin={L.skin} w={18} handR={10} bare={!longSleeve} />
      </g>
    </g>
  );
}

export function Hessa(p: FigureProps): JSX.Element {
  return <Kid {...p} look="hessa" />;
}
export function Hamad(p: FigureProps): JSX.Element {
  return <Kid {...p} look="hamad" />;
}
/** Younger cousin used in the helping scene (internal story extra). */
export function Cousin(p: FigureProps): JSX.Element {
  return <Kid {...p} look="cousin" />;
}

/* ---------------------------------------------------------------- adults */

type AdultWho = 'mama' | 'banker' | 'cashier' | 'grandma';
const ADULT_ARMS: Record<Pose, ArmSet> = {
  stand: { l: [[76, 156], [66, 240], [70, 312]], r: [[144, 156], [154, 240], [150, 312]] },
  wave: { l: [[76, 156], [66, 240], [70, 312]], r: [[144, 156], [184, 116], [190, 62]] },
  point: { l: [[76, 156], [66, 240], [70, 312]], r: [[144, 156], [182, 196], [218, 186]] },
  hold: { l: [[76, 156], [68, 230], [100, 256]], r: [[144, 156], [152, 230], [122, 256]] },
  cheer: { l: [[76, 156], [42, 118], [36, 64]], r: [[144, 156], [178, 118], [184, 64]] },
  think: { l: [[76, 156], [70, 232], [114, 228]], r: [[144, 156], [160, 220], [128, 140]] },
  sit: { l: [[76, 156], [70, 228], [100, 254]], r: [[144, 156], [152, 228], [122, 256]] },
};

export function Adult({ who, x, y, scale = 1, pose = 'stand', expression = 'smile', facing = 'right', className, holding = 'none' }: FigureProps & { who: AdultWho | 'mama' | 'banker' | 'cashier' }): JSX.Element {
  const g = useSvgId(`a${who}`);
  const sitting = pose === 'sit';
  const shift = sitting ? 110 : 0;
  const arms = ADULT_ARMS[pose];
  const skin = who === 'cashier' ? '#7E4C2F' : who === 'banker' ? '#C38F6B' : who === 'grandma' ? '#B98462' : '#B98060';
  const shade = who === 'cashier' ? '#633820' : who === 'banker' ? '#A06E4C' : '#97613F';
  const robe = who === 'mama' ? '#24252C' : who === 'grandma' ? '#2F5C5A' : who === 'banker' ? '#22305E' : '#9FC3E6';
  const robeShade = who === 'mama' ? '#14151A' : who === 'grandma' ? '#204241' : who === 'banker' ? '#161F40' : '#7FA6CC';
  const scarf = who === 'mama' ? '#A7A9B2' : who === 'banker' ? '#1D2A52' : who === 'grandma' ? '#F2EEE6' : '';
  const holdAt: Pt = pose === 'hold' || pose === 'sit' ? [111, 258] : arms.r[2];
  const hasScarf = who !== 'cashier';
  return (
    <g className={`char ${className ?? ''}`} transform={place(x, y, scale, 220, 520, facing)}>
      <defs>
        <linearGradient id={`${g}-robe`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor={robe} />
          <stop offset="0.55" stopColor={robe} />
          <stop offset="1" stopColor={robeShade} />
        </linearGradient>
      </defs>
      <ellipse cx={sitting ? 140 : 110} cy="517" rx="66" ry="10" fill="#3a2a1a" opacity="0.18" />

      {/* lower body */}
      {sitting ? (
        <g>
          <rect x="88" y="380" width="110" height="38" rx="19" fill={who === 'cashier' ? '#4B4F57' : robe} />
          <rect x="166" y="400" width="30" height="110" rx="14" fill={who === 'cashier' ? '#4B4F57' : robeShade} />
          <ellipse cx="186" cy="512" rx="20" ry="8" fill="#2E2A28" />
        </g>
      ) : who === 'cashier' ? (
        <g>
          <rect x="84" y="300" width="24" height="210" rx="10" fill="#4B4F57" />
          <rect x="112" y="300" width="24" height="210" rx="10" fill="#41454C" />
          <ellipse cx="94" cy="513" rx="18" ry="8" fill="#2A2420" />
          <ellipse cx="126" cy="513" rx="18" ry="8" fill="#2A2420" />
        </g>
      ) : (
        <g>
          <ellipse cx="94" cy="512" rx="16" ry="7" fill="#2A2420" />
          <ellipse cx="128" cy="512" rx="16" ry="7" fill="#2A2420" />
        </g>
      )}

      <g transform={`translate(0 ${shift})`}>
        {/* body */}
        {who === 'cashier' ? (
          <g>
            <path d="M74,150 Q110,134 146,150 L150,310 Q110,318 70,310 Z" fill={`url(#${g}-robe)`} />
            <path d="M96,140 L110,170 L124,140" fill="#BFD7EE" stroke={robeShade} strokeWidth="2" />
            <circle cx="110" cy="182" r="2.4" fill={robeShade} />
          </g>
        ) : who === 'banker' ? (
          <g>
            <path d={sitting ? 'M74,150 Q110,136 146,150 L152,300 Q110,308 68,300 Z' : 'M70,150 Q110,136 150,150 L162,505 Q110,514 58,505 Z'} fill={`url(#${g}-robe)`} />
            <path d="M92,148 L110,214 L128,148 Z" fill="#F7F5F0" />
            <path d="M92,148 L110,214 M128,148 L110,214" stroke="#0F1733" strokeWidth="2" />
            <path d="M98,150 L104,236" stroke="#EF2B2D" strokeWidth="2" />
            <rect x="96" y="234" width="16" height="22" rx="3" fill="#F3F3F3" stroke="#B7B9BC" />
          </g>
        ) : (
          <g>
            <path d={sitting ? 'M72,150 Q110,134 148,150 L158,300 Q110,310 62,300 Z' : 'M72,150 Q110,134 148,150 L170,505 Q110,516 50,505 Z'} fill={`url(#${g}-robe)`} />
            {!sitting && <path d="M110,170 L110,500" stroke={robeShade} strokeWidth="2" opacity="0.7" />}
            {!sitting && <path d="M130,220 Q150,360 156,500" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.07" />}
          </g>
        )}

        {/* head & scarf */}
        {hasScarf && <path d="M58,92 C56,30 164,30 162,92 C166,130 158,150 150,162 Q110,180 70,162 C62,150 54,130 58,92 Z" fill={scarf} />}
        {hasScarf && <path d="M64,86 C66,40 154,40 156,86" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.18" />}
        {!hasScarf && <rect x="100" y="120" width="20" height="26" rx="8" fill={shade} />}
        {!hasScarf && <circle cx="72" cy="94" r="8" fill={skin} />}
        {!hasScarf && <circle cx="148" cy="94" r="8" fill={skin} />}
        <Face cx={110} cy={hasScarf ? 92 : 88} r={hasScarf ? 36 : 40} expression={expression} skin={skin} shade={shade} gid={g} />
        {who === 'cashier' && (
          <g>
            <path d="M72,84 C66,44 96,32 112,34 C140,36 154,56 148,84 C142,66 128,58 110,58 C94,58 80,66 72,84 Z" fill="#1E1611" />
            <path d="M74,96 C76,128 92,134 110,134 C128,134 144,128 146,96 C142,116 132,120 124,118 Q110,114 96,118 C88,120 78,116 74,96 Z" fill="#1E1611" opacity="0.92" />
          </g>
        )}
        {who === 'grandma' && <path d="M88,74 L132,74" stroke="#d9d3c6" strokeWidth="2" />}

        {/* arms */}
        <Arm pts={arms.l} sleeve={robe} sleeveShade={robeShade} skin={skin} w={22} handR={11} />
        <HeldItem kind={holding} x={holdAt[0]} y={holdAt[1]} s={1.15} />
        <Arm pts={arms.r} sleeve={robe} sleeveShade={robeShade} skin={skin} w={22} handR={11} />
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- props */

/** Glass savings jar. Local origin at the base centre; ~100 x 130 at scale 1. */
export function SavingsJar({ x, y, scale = 1, fill = 0.5 }: { x: number; y: number; scale?: number; fill?: number }): JSX.Element {
  const g = useSvgId('jar');
  const f = Math.max(0, Math.min(1, fill));
  const rows = Math.round(f * 7);
  const coins: JSX.Element[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < 4; c++) {
      const cx = -30 + c * 20 + (r % 2 ? 9 : 0);
      if (cx > 34) continue;
      coins.push(
        <g key={`${r}-${c}`}>
          <ellipse cx={cx} cy={-10 - r * 13} rx="10" ry="6" fill="#C9962F" />
          <ellipse cx={cx} cy={-12 - r * 13} rx="10" ry="6" fill={`url(#${g}-coin)`} />
        </g>,
      );
    }
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={`${g}-coin`} cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#FFE9A6" />
          <stop offset="1" stopColor="#E0AE45" />
        </radialGradient>
        <linearGradient id={`${g}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.25" stopColor="#E7F3F6" stopOpacity="0.2" />
          <stop offset="0.85" stopColor="#CFE4EA" stopOpacity="0.25" />
          <stop offset="1" stopColor="#9DBFC8" stopOpacity="0.5" />
        </linearGradient>
        <clipPath id={`${g}-clip`}>
          <path d="M-40,-100 Q-48,-96 -48,-80 L-48,-12 Q-48,0 -34,0 L34,0 Q48,0 48,-12 L48,-80 Q48,-96 40,-100 Z" />
        </clipPath>
      </defs>
      <ellipse cx="0" cy="2" rx="52" ry="8" fill="#3a2a1a" opacity="0.16" />
      <g clipPath={`url(#${g}-clip)`}>{coins}</g>
      <path d="M-40,-100 Q-48,-96 -48,-80 L-48,-12 Q-48,0 -34,0 L34,0 Q48,0 48,-12 L48,-80 Q48,-96 40,-100 Z" fill={`url(#${g}-glass)`} stroke="#9CB8C0" strokeWidth="2" />
      <path d="M-36,-84 L-36,-18" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <rect x="-42" y="-120" width="84" height="22" rx="6" fill="#B7B9BC" />
      <rect x="-42" y="-120" width="84" height="8" rx="4" fill="#D8DADC" />
      <rect x="-14" y="-118" width="28" height="4" rx="2" fill="#5F6264" />
    </g>
  );
}

/** Traditional wooden dhow (boom) with a cream lateen sail. Origin at waterline centre, ~260 wide. */
export function Dhow({ x, y, scale = 1 }: { x: number; y: number; scale?: number }): JSX.Element {
  const g = useSvgId('dhow');
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${g}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A4693C" />
          <stop offset="1" stopColor="#6E4021" />
        </linearGradient>
        <linearGradient id={`${g}-sail`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBF3E0" />
          <stop offset="1" stopColor="#E3D2AE" />
        </linearGradient>
      </defs>
      <path d="M-6,-20 L-4,-190" stroke="#5B3A22" strokeWidth="5" strokeLinecap="round" />
      <path d="M-110,-58 L70,-214" stroke="#5B3A22" strokeWidth="4" strokeLinecap="round" />
      <path d="M-104,-62 L66,-208 Q40,-120 -2,-28 Q-50,-44 -104,-62 Z" fill={`url(#${g}-sail)`} />
      <path d="M-40,-82 Q-6,-90 22,-150" fill="none" stroke="#D6C29A" strokeWidth="2" />
      <path d="M-130,-34 L130,-44 Q118,-6 92,4 L-80,6 Q-112,-6 -130,-34 Z" fill={`url(#${g}-hull)`} />
      <path d="M-124,-28 L126,-38" stroke="#C99A62" strokeWidth="3" />
      <path d="M-104,-14 L112,-22" stroke="#5B3A22" strokeWidth="2" opacity="0.5" />
      <path d="M118,-44 L146,-66" stroke="#6E4021" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/** Kuwait Towers. Origin at the base of the main tower; main tower ~560 tall at scale 1. */
export function KuwaitTowers({ x, y, scale = 1, silhouette = false }: { x: number; y: number; scale?: number; silhouette?: boolean }): JSX.Element {
  const g = useSvgId('kt');
  const shaft = silhouette ? '#3B2A4A' : `url(#${g}-shaft)`;
  const sphereFill = silhouette ? '#3E2C4E' : `url(#${g}-sphere)`;
  const Sphere = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={sphereFill} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${g}-seq)`} clipPath={`url(#${g}-c${r})`} opacity={silhouette ? 0.25 : 0.85} />
      <clipPath id={`${g}-c${r}`}><circle cx={cx} cy={cy} r={r - 1} /></clipPath>
      {!silhouette && <ellipse cx={cx - r * 0.35} cy={cy - r * 0.4} rx={r * 0.32} ry={r * 0.2} fill="#fff" opacity="0.35" />}
      {silhouette && <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx},${cy - r}`} fill="none" stroke="#FFB36B" strokeWidth="3" opacity="0.9" />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${g}-shaft`} x1="0" x2="1">
          <stop offset="0" stopColor="#F4F2EC" />
          <stop offset="0.6" stopColor="#D9D6CE" />
          <stop offset="1" stopColor="#A9A79F" />
        </linearGradient>
        <radialGradient id={`${g}-sphere`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#7FC2C0" />
          <stop offset="0.6" stopColor="#2F7C86" />
          <stop offset="1" stopColor="#1B4F60" />
        </radialGradient>
        <pattern id={`${g}-seq`} width="9" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="2.1" fill="#A8E0DA" opacity="0.55" />
          <circle cx="7" cy="6.5" r="2.1" fill="#103A48" opacity="0.45" />
        </pattern>
      </defs>
      {/* third (smallest) tower: plain needle */}
      <path d="M83,0 L95,0 L90.5,-300 L87.5,-300 Z" fill={shaft} />
      <path d="M86,0 L92,0 L91.4,-60 L86.6,-60 Z" fill={silhouette ? shaft : '#CFCBC1'} />
      {/* second tower: one sphere */}
      <path d="M-96,0 L-76,0 L-84,-410 L-88,-410 Z" fill={shaft} />
      <Sphere cx={-86} cy={-250} r={38} />
      {/* main tower: two spheres */}
      <path d="M-13,0 L13,0 L2.5,-560 L-2.5,-560 Z" fill={shaft} />
      <Sphere cx={0} cy={-330} r={52} />
      <Sphere cx={0} cy={-440} r={24} />
      <circle cx="0" cy="-560" r="3" fill={silhouette ? '#3B2A4A' : '#EF2B2D'} />
      {/* base */}
      <path d="M-110,0 L110,0 L100,12 L-100,12 Z" fill={silhouette ? '#2E2140' : '#BDB7A8'} />
    </g>
  );
}
