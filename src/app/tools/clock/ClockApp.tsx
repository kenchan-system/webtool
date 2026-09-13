"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BigModeOverlay } from "@/components/BigModeOverlay";
import { KenchanBubble } from "@/components/KenchanBubble";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { jpDateDow } from "@/lib/dateUtil";
import {
  loadClockFormatPref,
  loadClockSecondsPref,
  saveClockFormatPref,
  saveClockSecondsPref,
  type ClockFormat,
} from "@/lib/clockPrefs";
import { clkGreeting, formatClockTime } from "./lib";

function digitsSpans(str: string) {
  return str.split("").map((ch, i) =>
    ch === ":" ? (
      <span key={i} className="clk-time-colon">
        :
      </span>
    ) : (
      <span key={i} className="clk-time-digit">
        {ch}
      </span>
    ),
  );
}

export function ClockApp() {
  const [format, setFormat] = useState<ClockFormat>("24");
  const [showSeconds, setShowSeconds] = useState(true);
  useEffect(() => {
    setFormat(loadClockFormatPref());
    setShowSeconds(loadClockSecondsPref());
  }, []);

  // ビルド時刻をHTMLに焼き込まないよう、現在時刻はマウント後に設定する
  // （日数計算・和暦変換・カレンダーと同じ方針）。
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bigMode]);
  useEffect(() => {
    function onFsChange() {
      if (!document.fullscreenElement && bigMode) exitBigMode();
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bigMode]);

  if (!now) return null;

  const { timeStr, ampm } = formatClockTime(now, format, showSeconds);
  const dateStr = jpDateDow(now);
  const kcMsg = clkGreeting(now.getHours());

  const core = (
    <div id="clk-core">
      <div className="clk-display">
        <div className="clk-time-row">
          {ampm && <span className="clk-ampm">{ampm}</span>}
          <div className="clk-time">{digitsSpans(timeStr)}</div>
        </div>
        <p className="clk-date">{dateStr}</p>
      </div>
    </div>
  );

  return (
    <>
      <KenchanBubble className="clk-kc">{kcMsg}</KenchanBubble>

      <div className="clk-panel">
        <Link href="/tools/analog-clock" className="clock-switch-link">
          🕐 アナログ時計を見る
        </Link>
        <button type="button" className="clk-bigmode-btn" onClick={enterBigMode}>
          大画面
        </button>
        {!bigMode && core}

        <div className="clk-settings">
          <p className="clk-settings-label">時刻表示</p>
          <SegRadioGroup
            ariaLabel="12時間・24時間表示"
            className="clk-opt-grid"
            optionClassName="clk-opt"
            value={format}
            onChange={(v) => {
              setFormat(v);
              saveClockFormatPref(v);
            }}
            options={[
              { value: "24", label: "24時間表示" },
              { value: "12", label: "12時間表示" },
            ]}
          />
          <p className="clk-settings-label">秒の表示</p>
          <SegRadioGroup
            ariaLabel="秒の表示"
            className="clk-opt-grid"
            optionClassName="clk-opt"
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
        <BigModeOverlay className="clk-bigmode" ariaLabel="デジタル時計（大画面表示）">
          <button type="button" className="clk-bigmode-close" aria-label="閉じる" onClick={exitBigMode}>
            ✕
          </button>
          <div className="clk-bigmode-body">{core}</div>
        </BigModeOverlay>
      )}
    </>
  );
}
