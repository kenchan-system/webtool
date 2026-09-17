"use client";

import { useEffect, useMemo, useState } from "react";
import { BigModeOverlay } from "@/components/BigModeOverlay";
import { KenchanBubble } from "@/components/KenchanBubble";
import { WC_CITIES, WC_DEFAULT_TZS, WC_REGION_LABEL, WC_REGION_ORDER, wcCoordFor, wcNameFor } from "./cities";
import {
  WC_GRID_HLINES,
  WC_GRID_VLINES,
  WC_MAP_H,
  WC_MAP_W,
  detectHomeTz,
  loadSelectedTzs,
  saveSelectedTzs,
  wcDayDiff,
  wcHomeHour,
  wcOffsetLabel,
  wcOffsetMinutes,
  wcProject,
  wcTerminatorPathD,
  wcTimeStr,
} from "./lib";
import { WC_LAND_PATH_D } from "./mapData";
import { clkGreeting } from "../clock/lib";

export function WorldClockApp() {
  const [homeTz, setHomeTz] = useState<string | null>(null);
  const [selectedTzs, setSelectedTzs] = useState<string[] | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [bigMode, setBigMode] = useState(false);

  // ビルド時刻・サーバー環境のタイムゾーンをHTMLに焼き込まないよう、
  // 現在地の判定・現在時刻はマウント後に設定する（他の時間系ツールと同じ方針）。
  useEffect(() => {
    // SSR環境に依存させず、閲覧者のタイムゾーンと保存設定を使用する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHomeTz(detectHomeTz());
    setSelectedTzs(loadSelectedTzs(WC_DEFAULT_TZS));
    setNow(new Date());
    const handle = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(handle);
  }, []);

  function enterBigMode() {
    setBigMode(true);
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    } catch {
      /* noop */
    }
  }
  function exitBigMode() {
    setBigMode(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    } catch {
      /* noop */
    }
  }
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && bigMode) exitBigMode();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bigMode]);
  useEffect(() => {
    function onFsChange() {
      if (!document.fullscreenElement && bigMode) exitBigMode();
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [bigMode]);

  const others = useMemo(() => {
    if (!selectedTzs || !now || !homeTz) return [];
    return WC_CITIES.filter((c) => selectedTzs.includes(c.tz) && c.tz !== homeTz).sort(
      (a, b) => wcOffsetMinutes(a.tz, now) - wcOffsetMinutes(b.tz, now),
    );
  }, [selectedTzs, homeTz, now]);

  const mapPins = useMemo(() => {
    if (!selectedTzs || !homeTz || !now) return [];
    const homeCoord = wcCoordFor(homeTz) ?? ([0, (wcOffsetMinutes(homeTz, now) / 60) * 15] as [number, number]);
    const items: { coord: [number, number]; isHome: boolean; name: string }[] = [
      { coord: homeCoord, isHome: true, name: wcNameFor(homeTz) ?? "現在地" },
    ];
    WC_CITIES.filter((c) => selectedTzs.includes(c.tz) && c.tz !== homeTz).forEach((c) => {
      if (c.coord) items.push({ coord: c.coord, isHome: false, name: c.name });
    });
    return items;
  }, [selectedTzs, homeTz, now]);

  const terminatorD = useMemo(() => (now ? wcTerminatorPathD(now) : ""), [now]);

  function toggleCity(tz: string, checked: boolean) {
    setSelectedTzs((prev) => {
      if (!prev) return prev;
      const next = checked ? [...prev, tz] : prev.filter((t) => t !== tz);
      saveSelectedTzs(next);
      return next;
    });
  }

  if (!now || !homeTz || !selectedTzs) return null;

  const kcMsg = clkGreeting(wcHomeHour(homeTz, now));
  const homeName = wcNameFor(homeTz) ?? "現在地";

  const core = (
    <div id="wc-core">
      <div className="wc-map-wrap" aria-hidden="true">
        <svg className="wc-map" viewBox={`0 0 ${WC_MAP_W} ${WC_MAP_H}`} preserveAspectRatio="xMidYMid meet">
          <rect className="wc-map-ocean" x={0} y={0} width={WC_MAP_W} height={WC_MAP_H} />
          <g>
            {WC_GRID_VLINES.map((x, i) => (
              <line key={`v${i}`} x1={x} y1={0} x2={x} y2={WC_MAP_H} className="wc-map-gridline" />
            ))}
            {WC_GRID_HLINES.map((y, i) => (
              <line key={`h${i}`} x1={0} y1={y} x2={WC_MAP_W} y2={y} className="wc-map-gridline" />
            ))}
          </g>
          <g>
            <path d={WC_LAND_PATH_D} className="wc-map-land" />
          </g>
          <path className="wc-map-night" fillRule="evenodd" d={terminatorD} />
          <g>
            {mapPins.map((p, i) => {
              const xy = wcProject(p.coord[0], p.coord[1]);
              return (
                <g
                  key={i}
                  className={"wc-map-pin" + (p.isHome ? " wc-map-pin-home" : "")}
                  transform={`translate(${xy[0].toFixed(1)},${xy[1].toFixed(1)})`}
                >
                  <circle r={p.isHome ? 7 : 5} />
                  <text y={-10} textAnchor="middle">
                    {p.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="wc-list" aria-label="世界時計一覧">
        <WcRow name={homeName} tz={homeTz} homeTz={homeTz} now={now} isHome />
        {others.length === 0 ? (
          <p className="wc-empty">「都市を選ぶ」から比較したい都市を追加できます。</p>
        ) : (
          others.map((c) => <WcRow key={c.tz} name={c.name} tz={c.tz} homeTz={homeTz} now={now} isHome={false} />)
        )}
      </div>
    </div>
  );

  return (
    <>
      <KenchanBubble className="wc-kc">{kcMsg}</KenchanBubble>

      <div className="wc-panel">
        <button type="button" className="wc-bigmode-btn" onClick={enterBigMode}>
          大画面
        </button>
        {!bigMode && core}

        <div className="wc-settings">
          <details className="chart-details wc-picker">
            <summary>都市を選ぶ</summary>
            <div className="wc-picker-body">
              {WC_REGION_ORDER.map((region) => (
                <div key={region} className="wc-picker-group">
                  <p className="wc-picker-group-label">{WC_REGION_LABEL[region]}</p>
                  <div className="wc-picker-grid">
                    {WC_CITIES.filter((c) => c.region === region).map((c) => (
                      <label key={c.tz} className="wc-picker-item">
                        <input
                          type="checkbox"
                          checked={selectedTzs.includes(c.tz)}
                          onChange={(e) => toggleCity(c.tz, e.target.checked)}
                        />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {bigMode && (
        <BigModeOverlay className="wc-bigmode" ariaLabel="世界時計（大画面表示）">
          <button type="button" className="wc-bigmode-close" aria-label="閉じる" onClick={exitBigMode}>
            ✕
          </button>
          <div className="wc-bigmode-body">{core}</div>
        </BigModeOverlay>
      )}
    </>
  );
}

function WcRow({
  name,
  tz,
  homeTz,
  now,
  isHome,
}: {
  name: string;
  tz: string;
  homeTz: string;
  now: Date;
  isHome: boolean;
}) {
  const timeStr = wcTimeStr(tz, now);
  const offset = wcOffsetLabel(tz, now);
  const diff = isHome ? 0 : wcDayDiff(tz, homeTz, now);
  const badge = diff > 0 ? "翌日" : diff < 0 ? "前日" : "";
  return (
    <div className={"wc-row" + (isHome ? " wc-row-home" : "")}>
      <div className="wc-row-city">
        <span className="wc-row-name">{name}</span>
        <span className="wc-row-offset">{offset}</span>
      </div>
      <div className="wc-row-time">
        {badge && <span className="wc-daybadge">{badge}</span>}
        <span className="wc-time-text">{timeStr}</span>
      </div>
    </div>
  );
}
