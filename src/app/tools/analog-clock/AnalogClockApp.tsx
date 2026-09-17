"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BigModeOverlay } from "@/components/BigModeOverlay";
import { KenchanBubble } from "@/components/KenchanBubble";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { jpDateDow } from "@/lib/dateUtil";
import { loadClockSecondsPref, saveClockSecondsPref } from "@/lib/clockPrefs";
import { clkGreeting } from "../clock/lib";
import { NUMERALS, TICKS, handAngles } from "./lib";

function pad2(n: number): string {
  return (n < 10 ? "0" : "") + n;
}

export function AnalogClockApp() {
  const [showSeconds, setShowSeconds] = useState(true);
  useEffect(() => {
    // SSR時の既定値から、閲覧者が保存した表示設定へマウント後に切り替える。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowSeconds(loadClockSecondsPref());
  }, []);

  // ビルド時刻をHTMLに焼き込まないよう、現在時刻はマウント後に設定する
  // （デジタル時計と同じ方針）。
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // 静的HTMLにビルド時刻を含めないため、初期時刻はマウント後に設定する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const handle = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(handle);
  }, []);

  const [bigMode, setBigMode] = useState(false);
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

  if (!now) return null;

  const { hourDeg, minDeg, secDeg } = handAngles(now);
  const dateStr = jpDateDow(now);
  const kcMsg = clkGreeting(now.getHours());
  const ariaLabel = `現在時刻 ${now.getHours()}時${pad2(now.getMinutes())}分`;

  const core = (
    <div id="aclk-core">
      <svg className="aclk-face" viewBox="0 0 200 200" role="img" aria-label={ariaLabel}>
        <circle className="aclk-face-circle" cx={100} cy={100} r={96} />
        <g>
          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              className={"aclk-tick" + (t.major ? " aclk-tick-major" : "")}
            />
          ))}
        </g>
        <g>
          {NUMERALS.map((n, i) => (
            <text key={i} x={n.x} y={n.y} className="aclk-numeral" textAnchor="middle" dominantBaseline="central">
              {n.label}
            </text>
          ))}
        </g>
        <line
          className="aclk-hand aclk-hand-hour"
          x1={100}
          y1={100}
          x2={100}
          y2={58}
          transform={`rotate(${hourDeg.toFixed(2)} 100 100)`}
        />
        <line
          className="aclk-hand aclk-hand-minute"
          x1={100}
          y1={100}
          x2={100}
          y2={32}
          transform={`rotate(${minDeg.toFixed(2)} 100 100)`}
        />
        {showSeconds && (
          <line
            className="aclk-hand aclk-hand-second"
            x1={100}
            y1={100}
            x2={100}
            y2={24}
            transform={`rotate(${secDeg.toFixed(2)} 100 100)`}
          />
        )}
        <circle className="aclk-hub" cx={100} cy={100} r={4} />
      </svg>
      <p className="aclk-date">{dateStr}</p>
    </div>
  );

  return (
    <>
      <KenchanBubble className="aclk-kc">{kcMsg}</KenchanBubble>

      <div className="aclk-panel">
        <Link href="/tools/clock" className="clock-switch-link">
          🔢 デジタル時計を見る
        </Link>
        <button type="button" className="aclk-bigmode-btn" onClick={enterBigMode}>
          大画面
        </button>
        {!bigMode && core}

        <div className="aclk-settings">
          <p className="aclk-settings-label">秒針の表示</p>
          <SegRadioGroup
            ariaLabel="秒針の表示"
            className="aclk-opt-grid"
            optionClassName="aclk-opt"
            value={showSeconds ? "on" : "off"}
            onChange={(v) => {
              const on = v === "on";
              setShowSeconds(on);
              saveClockSecondsPref(on);
            }}
            options={[
              { value: "on", label: "表示する" },
              { value: "off", label: "表示しない" },
            ]}
          />
        </div>
      </div>

      {bigMode && (
        <BigModeOverlay className="aclk-bigmode" ariaLabel="アナログ時計（大画面表示）">
          <button type="button" className="aclk-bigmode-close" aria-label="閉じる" onClick={exitBigMode}>
            ✕
          </button>
          <div className="aclk-bigmode-body">{core}</div>
        </BigModeOverlay>
      )}
    </>
  );
}
