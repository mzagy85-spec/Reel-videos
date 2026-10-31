// Development-only gallery of every illustration. Not part of the production build input.
import { createRoot } from 'react-dom/client';
import { SceneArt, SCENE_IDS } from './illustrations/scenes';
import { Adult, Hamad, Hessa, SavingsJar, Dhow, KuwaitTowers, type Pose, type Expression } from './illustrations/characters';
import { MapArt, MAP_REGIONS } from './illustrations/MapArt';

const POSES: Pose[] = ['stand', 'wave', 'point', 'hold', 'cheer', 'think', 'sit'];
const EXPR: Expression[] = ['smile', 'wow', 'think', 'happy'];
const only = new URLSearchParams(location.search).get('only');

function Gallery() {
  return (
    <div>
      {(!only || only === 'scenes') && (
        <>
          <h2>Scenes (wide + tall)</h2>
          {SCENE_IDS.map((id) => (
            <div key={id} className="row" id={`scene-${id}`}>
              <div className="cell wide"><SceneArt id={id} crop="wide" /></div>
              <div className="cell tall"><SceneArt id={id} crop="tall" /></div>
              <div style={{ alignSelf: 'center' }}>{id}</div>
            </div>
          ))}
        </>
      )}
      {(!only || only === 'chars') && (
        <>
          <h2>Characters</h2>
          <div className="row chars">
            <svg width="1400" height="1100" viewBox="0 0 1400 1100">
              {POSES.map((p, i) => (
                <g key={p}>
                  <Hessa x={100 + i * 190} y={420} pose={p} expression={EXPR[i % 4]} holding={p === 'hold' ? 'jar' : 'none'} />
                  <Hamad x={100 + i * 190} y={860} pose={p} expression={EXPR[(i + 1) % 4]} holding={p === 'hold' ? 'basket' : 'none'} facing={i % 2 ? 'left' : 'right'} />
                </g>
              ))}
            </svg>
            <svg width="1400" height="620" viewBox="0 0 1400 620">
              <Adult who="mama" x={130} y={560} pose="hold" holding="bag" />
              <Adult who="mama" x={360} y={560} pose="sit" holding="book" />
              <Adult who="banker" x={600} y={560} pose="wave" expression="happy" />
              <Adult who="cashier" x={830} y={560} pose="point" holding="card" />
              <Adult who="mama" x={1060} y={560} pose="think" expression="think" />
              <SavingsJar x={1250} y={560} fill={0.6} />
            </svg>
            <svg width="900" height="640" viewBox="-200 -620 900 660">
              <KuwaitTowers x={0} y={0} />
              <Dhow x={400} y={-40} />
            </svg>
          </div>
        </>
      )}
      {(!only || only === 'map') && (
        <>
          <h2>Map</h2>
          <div className="row">
            <div className="map"><MapArt /></div>
            <div className="map"><MapArt ghost /></div>
          </div>
          <div className="row">
            {MAP_REGIONS.map((r) => (
              <div key={r.id} className="piece"><MapArt region={r.id} /></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Gallery />);
