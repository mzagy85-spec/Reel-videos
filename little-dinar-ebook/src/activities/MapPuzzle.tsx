import { useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { map as c, ui } from '../content/copy';
import { MAP_PIECES, MISSIONS, mapAssembled, missionCorrect, missionsComplete, missionsUnlocked, type HotspotId, type MapRegion, type MissionId } from '../lib/activities';
import { MapArt, MAP_REGIONS } from '../illustrations/MapArt';
import { LogoOverlay, MAP_BANK_SIGN } from '../app/LogoOverlay';
import { Feedback, ResetButton } from './shared';
import { CircleIcon, Icon, type IconName } from '../app/Icons';
import { playEffect } from '../lib/audio';

const TRAY_ORDER: MapRegion[] = ['bank', 'towers', 'home', 'park', 'coop', 'waterfront'];
const PLACE_ICON: Record<MapRegion, IconName> = { towers: 'towers', waterfront: 'waterfront', park: 'park', home: 'home', coop: 'store', bank: 'bank' };
const MISSION_ICON: Record<MissionId, IconName> = { planGoal: 'target', comparePrices: 'receipt', deposit: 'account' };

function regionOf(id: MapRegion) { return MAP_REGIONS.find((r) => r.id === id)!; }

function Piece({ id, label }: { id: MapRegion; label?: string }) {
  const r = regionOf(id);
  return (
    <span className="map-piece-art">
      <MapArt region={id} />
      {id === 'bank' ? <LogoOverlay viewBox={`${r.col * 300} ${r.row * 300} 300 300`} {...MAP_BANK_SIGN} /> : null}
      {label ? <span className="map-label">{label}</span> : null}
    </span>
  );
}

export function MapPuzzle(_: ActivityProps) {
  const { t } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.map;
  const fx = state.settings.effects;
  const [selected, setSelected] = useState<MapRegion | null>(null);
  const [hint, setHint] = useState(false);
  const [listMode, setListMode] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'good' | 'try' | 'info'; text: string } | null>(null);
  const [missionMsg, setMissionMsg] = useState<{ id: MissionId; ok: boolean } | null>(null);
  const [openHotspot, setOpenHotspot] = useState<HotspotId | null>(null);
  const drag = useRef<{ id: MapRegion; startX: number; startY: number; moved: boolean; ghost: HTMLElement | null } | null>(null);
  const name = (id: MapRegion) => t(c[id]);
  const unlocked = missionsUnlocked(s);
  const assembled = mapAssembled(s);
  const remaining = MAP_PIECES.length - s.placed.length;

  const tryPlace = (piece: MapRegion, slot: MapRegion) => {
    if (piece === slot) {
      dispatch({ type: 'map', a: { type: 'place', piece, slot } });
      setSelected(null);
      const nowDone = s.placed.length + 1 === MAP_PIECES.length;
      setMsg({ tone: 'good', text: nowDone ? t(c.assembled) : t(c.placed, { name: name(piece) }) });
      playEffect(nowDone ? 'success' : 'place', fx);
      // Move focus to the next tray piece so keyboard users keep their place.
      requestAnimationFrame(() => (document.querySelector('.map-tray .tray-piece') as HTMLElement | null)?.focus());
    } else {
      setMsg({ tone: 'try', text: t(c.wrong) });
      playEffect('gentle', fx);
    }
  };

  // Optional dragging. Tap-then-tap and keyboard do the same job without dragging.
  const onPointerDown = (id: MapRegion) => (e: RPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { id, startX: e.clientX, startY: e.clientY, moved: false, ghost: null };
  };
  const onPointerMove = (e: RPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 10) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      const src = e.currentTarget.querySelector('.map-piece-art') as HTMLElement | null;
      if (src) {
        const g = src.cloneNode(true) as HTMLElement;
        g.className = 'drag-ghost';
        document.body.appendChild(g);
        d.ghost = g;
      }
      setSelected(d.id);
    }
    if (d.moved && d.ghost) {
      d.ghost.style.transform = `translate(${e.clientX - 50}px, ${e.clientY - 50}px)`;
    }
  };
  const onPointerUp = (e: RPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    d.ghost?.remove();
    if (!d.moved) return; // a plain tap is handled by onClick
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-slot]') as HTMLElement | null;
    if (target?.dataset.slot) tryPlace(d.id, target.dataset.slot as MapRegion);
  };

  const matchMission = (mission: MissionId, place: MapRegion) => {
    dispatch({ type: 'map', a: { type: 'match', mission, place } });
    const ok = MISSIONS.find((m) => m.id === mission)!.place === place;
    setMissionMsg({ id: mission, ok });
    playEffect(ok ? 'success' : 'gentle', fx);
  };

  return (
    <div className="map-activity">
      <div className="map-head">
        <h2 className="map-title"><Icon name="map" size={22} /> {t(c.mapTitle)}</h2>
        <p className="map-badge">{t(c.mapLabel)}</p>
      </div>
      <p className="muted small">{t(c.mapDisclaimer)}</p>
      <div className="btn-row">
        <button type="button" className="btn btn-small" aria-pressed={listMode} onClick={() => setListMode((v) => !v)}>
          <Icon name={listMode ? 'map' : 'list'} size={18} />{listMode ? t(c.mapMode) : t(c.listMode)}
        </button>
      </div>

      {!listMode ? (
        <>
          <div className="map-stage">
            {/* The map is a picture of a place, so it keeps the same layout in both languages. */}
            <div className={`map-board ${hint ? 'show-hint' : ''}`} dir="ltr" role="group" aria-label={t(c.board)}>
              {hint ? <div className="map-hint" aria-hidden="true"><MapArt ghost /></div> : null}
              {MAP_REGIONS.map((r) => {
                const placed = s.placed.includes(r.id);
                return placed ? (
                  <div key={r.id} className="map-slot is-placed" style={{ gridColumn: r.col + 1, gridRow: r.row + 1 }} aria-label={t(c.slotFilled, { name: name(r.id) })} role="img">
                    <Piece id={r.id} label={name(r.id)} />
                  </div>
                ) : (
                  <button
                    key={r.id}
                    type="button"
                    data-slot={r.id}
                    className={`map-slot ${selected ? 'is-target' : ''}`}
                    style={{ gridColumn: r.col + 1, gridRow: r.row + 1 }}
                    aria-label={t(c.slot, { row: r.row + 1, col: r.col + 1 })}
                    onClick={() => { if (selected) tryPlace(selected, r.id); else setMsg({ tone: 'info', text: t(c.pickPiece) }); }}
                  >
                    <span className="slot-ghost" aria-hidden="true"><MapArt region={r.id} ghost /></span>
                  </button>
                );
              })}
            </div>
            {!assembled ? (
              <div className="map-tray" role="group" aria-label={`${t(c.pieces)} · ${t(c.piecesLeft, { n: remaining })}`}>
                {TRAY_ORDER.filter((id) => !s.placed.includes(id)).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`tray-piece ${selected === id ? 'is-selected' : ''}`}
                    aria-pressed={selected === id}
                    aria-label={t(c.piece, { name: name(id) })}
                    onClick={() => { setSelected(id); setMsg({ tone: 'info', text: t(c.selected, { name: name(id) }) }); playEffect('tap', fx); }}
                    onPointerDown={onPointerDown(id)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={() => { drag.current?.ghost?.remove(); drag.current = null; }}
                  >
                    <Piece id={id} />
                    <span className="tray-label"><Icon name={PLACE_ICON[id]} size={18} />{name(id)}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          {!assembled ? (
            <>
              <p className="muted small">{t(c.pickPiece)}</p>
              <div className="btn-row">
                <button type="button" className="btn btn-small" aria-pressed={hint} onClick={() => setHint((h) => !h)}>
                  <Icon name="bulb" size={18} />{hint ? t(c.hidePicture) : t(c.showPicture)}
                </button>
                <button type="button" className="btn btn-small" onClick={() => { dispatch({ type: 'map', a: { type: 'autoPlace' } }); setSelected(null); playEffect('place', fx); }}>
                  {t(c.placeOne)}
                </button>
                {!s.skipped ? <button type="button" className="btn btn-small btn-quiet" onClick={() => dispatch({ type: 'map', a: { type: 'skip' } })}>{t(c.skip)}</button> : null}
              </div>
            </>
          ) : null}
          <Feedback tone={msg?.tone ?? 'info'}>{msg?.text}</Feedback>
        </>
      ) : (
        <ul className="place-list" role="list">
          {MAP_REGIONS.map((r) => (
            <li key={r.id}><CircleIcon name={PLACE_ICON[r.id]} size={36} /> <span>{name(r.id)}</span></li>
          ))}
        </ul>
      )}

      {unlocked || listMode ? (
        <section className="missions" aria-labelledby="missions-title">
          <h3 id="missions-title">{t(c.missionsTitle)}</h3>
          <p className="muted small">{t(c.missionsHelp)}</p>
          <ol className="mission-list">
            {MISSIONS.map((m) => {
              const ok = missionCorrect(s, m.id);
              return (
                <li key={m.id} className={`mission ${ok ? 'is-done' : ''}`}>
                  <p className="mission-name"><Icon name={MISSION_ICON[m.id]} size={22} /> {t(c[m.id])} {ok ? <span className="mission-done"><Icon name="check" size={18} /><span className="visually-hidden">✓</span></span> : null}</p>
                  <div className="mission-places" role="group" aria-label={t(c.chooseLocation, { mission: t(c[m.id]) })}>
                    {(['home', 'coop', 'bank', 'park'] as MapRegion[]).map((p) => (
                      <button key={p} type="button" className={`btn btn-small ${s.missions[m.id] === p ? (ok ? 'is-right' : 'is-wrong') : ''}`} aria-pressed={s.missions[m.id] === p} onClick={() => matchMission(m.id, p)}>
                        <Icon name={PLACE_ICON[p]} size={18} />{name(p)}
                      </button>
                    ))}
                  </div>
                  {missionMsg?.id === m.id ? (
                    <p className={`mission-feedback ${missionMsg.ok ? 'tone-good' : 'tone-try'}`} role="status">
                      <Icon name={missionMsg.ok ? 'check' : 'bulb'} size={18} /> {missionMsg.ok ? t(c[`${m.id}Right` as const]) : t(c.missionWrong)}
                    </p>
                  ) : ok ? <p className="mission-feedback tone-good"><Icon name="check" size={18} /> {t(c[`${m.id}Right` as const])}</p> : null}
                </li>
              );
            })}
          </ol>
          {missionsComplete(s) ? <Feedback tone="good">{t(c.missionsDone)}</Feedback> : null}
        </section>
      ) : null}

      <section className="hotspots" aria-labelledby="hotspots-title">
        <h3 id="hotspots-title">{t(c.hotspotsTitle)}</h3>
        <div className="hotspot-row">
          {(['account', 'balance', 'payment'] as HotspotId[]).map((h) => (
            <button key={h} type="button" className={`hotspot ${s.hotspots.includes(h) ? 'is-seen' : ''}`} aria-expanded={openHotspot === h} aria-controls="hotspot-info" onClick={() => { setOpenHotspot(h); dispatch({ type: 'map', a: { type: 'hotspot', id: h } }); playEffect('tap', fx); }}>
              <CircleIcon name={h} size={40} />
              <span>{t(c[h])}</span>
            </button>
          ))}
        </div>
        <p id="hotspot-info" className="hotspot-info">{openHotspot ? t(c[`${openHotspot}Info` as const]) : ''}</p>
      </section>

      <ResetButton label={t(ui.reset)} onClick={() => { dispatch({ type: 'map', a: { type: 'reset' } }); setMsg(null); setMissionMsg(null); setSelected(null); setHint(false); }} />
    </div>
  );
}
