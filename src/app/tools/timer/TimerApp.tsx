"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import { BigModeOverlay } from "@/components/BigModeOverlay";
import { KenchanBubble } from "@/components/KenchanBubble";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import {
  DEFAULT_DURATION_SEC,
  PRESETS,
  TMR_MAX_SEC,
  TMR_TICK_MS,
  presetLabel,
  tmrFormat,
  type TimerState,
} from "./lib";
import { loadSoundPref, loadVolumePref, saveSoundPref, saveVolumePref, useTimerAudio, type SoundType } from "./useTimerAudio";

function sliderFillStyle(value: number, min: number, max: number): CSSProperties {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return { background: `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)` };
}

function digitsSpans(str: string) {
  return str.split("").map((ch, i) =>
    ch === ":" ? (
      <span key={i} className="timer-time-colon">
        :
      </span>
    ) : (
      <span key={i} className="timer-time-digit">
        {ch}
      </span>
    ),
  );
}

export function TimerApp() {
  const [state, setState] = useState<TimerState>("idle");
  const [durationSec, setDurationSec] = useState(DEFAULT_DURATION_SEC);
  const [displaySec, setDisplaySec] = useState(DEFAULT_DURATION_SEC);
  const [runningTotalSec, setRunningTotalSec] = useState(0);
  const [alarmActive, setAlarmActive] = useState(false);
  const [bigMode, setBigMode] = useState(false);

  // 音の種類・音量は前回の選択をlocalStorageから復元する。SSRとの不一致を
  // 避けるため、既定値でまず描画し、マウント後に読み込む。
  const [soundType, setSoundType] = useState<SoundType>("simple");
  const [volumePct, setVolumePct] = useState(80);
  useEffect(() => {
    setSoundType(loadSoundPref());
    setVolumePct(loadVolumePref());
  }, []);

  const { ensureAudio, beepOnce } = useTimerAudio(soundType, volumePct);

  const runningRef = useRef(false);
  const endAtRef = useRef<number | null>(null);
  const remainingAtPauseRef = useRef<number | null>(null);
  const startedSecRef = useRef(0);
  const tickHandleRef = useRef<number | null>(null);
  const alarmIntervalRef = useRef<number | null>(null);
  const alarmTimeoutRef = useRef<number | null>(null);
  const baseTitleRef = useRef<string | null>(null);

  function restoreTitle() {
    if (baseTitleRef.current !== null) {
      document.title = baseTitleRef.current;
      baseTitleRef.current = null;
    }
  }

  function stopTicking() {
    if (tickHandleRef.current != null) {
      clearInterval(tickHandleRef.current);
      tickHandleRef.current = null;
    }
  }

  function tick() {
    if (!runningRef.current || endAtRef.current == null) {
      stopTicking();
      return;
    }
    const remaining = (endAtRef.current - Date.now()) / 1000;
    if (remaining <= 0) {
      finish();
      return;
    }
    setDisplaySec(remaining);
    if (baseTitleRef.current === null) baseTitleRef.current = document.title;
    document.title = `${tmrFormat(remaining)} - ${baseTitleRef.current}`;
  }

  function startTicking() {
    stopTicking();
    runningRef.current = true;
    tickHandleRef.current = window.setInterval(tick, TMR_TICK_MS);
    tick();
  }

  function stopAlarm() {
    if (alarmIntervalRef.current != null) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (alarmTimeoutRef.current != null) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    setAlarmActive(false);
    restoreTitle();
  }

  function playAlarm() {
    beepOnce();
    let count = 1;
    alarmIntervalRef.current = window.setInterval(() => {
      beepOnce();
      count++;
      if (count >= 20) stopAlarm();
    }, 700);
    alarmTimeoutRef.current = window.setTimeout(stopAlarm, 30000);
    setAlarmActive(true);
    if (baseTitleRef.current === null) baseTitleRef.current = document.title;
    document.title = "タイマー終了！";
  }

  function finish() {
    stopTicking();
    runningRef.current = false;
    setState("done");
    setDisplaySec(0);
    playAlarm();
  }

  function start(sec: number) {
    if (!(sec > 0)) return;
    ensureAudio();
    setDurationSec(sec);
    setRunningTotalSec(sec);
    startedSecRef.current = sec;
    endAtRef.current = Date.now() + sec * 1000;
    remainingAtPauseRef.current = null;
    setState("running");
    startTicking();
  }

  function pause() {
    if (state !== "running") return;
    remainingAtPauseRef.current = Math.max(0, (endAtRef.current! - Date.now()) / 1000);
    runningRef.current = false;
    stopTicking();
    restoreTitle();
    setState("paused");
    setDisplaySec(remainingAtPauseRef.current);
  }

  function resume() {
    if (state !== "paused") return;
    ensureAudio();
    endAtRef.current = Date.now() + (remainingAtPauseRef.current ?? 0) * 1000;
    remainingAtPauseRef.current = null;
    setState("running");
    startTicking();
  }

  function addMinute() {
    if (state === "running") {
      endAtRef.current = (endAtRef.current ?? Date.now()) + 60 * 1000;
      setRunningTotalSec((v) => v + 60);
    } else if (state === "paused") {
      const next = (remainingAtPauseRef.current ?? 0) + 60;
      remainingAtPauseRef.current = next;
      setRunningTotalSec((v) => v + 60);
      setDisplaySec(next);
    }
  }

  function subMinute() {
    if (state === "running") {
      endAtRef.current = Math.max((endAtRef.current ?? Date.now()) - 60 * 1000, Date.now());
      setRunningTotalSec((v) => Math.max(0, v - 60));
      tick();
    } else if (state === "paused") {
      const next = Math.max(0, (remainingAtPauseRef.current ?? 0) - 60);
      remainingAtPauseRef.current = next;
      setRunningTotalSec((v) => Math.max(0, v - 60));
      setDisplaySec(next);
    }
  }

  function reset() {
    stopTicking();
    runningRef.current = false;
    stopAlarm();
    restoreTitle();
    const target = startedSecRef.current > 0 ? startedSecRef.current : durationSec;
    setDurationSec(target);
    endAtRef.current = null;
    remainingAtPauseRef.current = null;
    setRunningTotalSec(0);
    startedSecRef.current = 0;
    setState("idle");
  }

  // 実行中・一時停止中・終了直後でも、新しい時間（プリセット／カスタム入力）を
  // 選んだらその場で打ち切ってidleに戻す。
  function interruptToIdle() {
    if (state === "idle") return;
    stopTicking();
    runningRef.current = false;
    stopAlarm();
    endAtRef.current = null;
    remainingAtPauseRef.current = null;
    setRunningTotalSec(0);
    startedSecRef.current = 0;
    setState("idle");
  }

  function onPresetChange(sec: number) {
    interruptToIdle();
    setDurationSec(sec);
  }

  function onCustomChange(h: number, m: number, s: number) {
    interruptToIdle();
    setDurationSec(Math.min(TMR_MAX_SEC, h * 3600 + m * 60 + s));
  }

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
    function onVis() {
      if (!document.hidden && runningRef.current) tick();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    return () => {
      stopTicking();
      if (alarmIntervalRef.current != null) clearInterval(alarmIntervalRef.current);
      if (alarmTimeoutRef.current != null) clearTimeout(alarmTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shownSec = state === "idle" ? durationSec : displaySec;
  const total = state === "running" || state === "paused" ? runningTotalSec : durationSec;
  const pct = total > 0 ? Math.max(0, Math.min(100, (shownSec / total) * 100)) : 0;
  const hasHours = tmrFormat(shownSec).split(":").length === 3;

  const kcMsg =
    state === "running"
      ? `${tmrFormat(runningTotalSec)}のタイマーを動かしているよ。他のページを見ていても、時間になったら音で知らせるね。`
      : state === "paused"
        ? "一時停止中だよ。「再開」でつづきから始められるよ。"
        : state === "done"
          ? "時間になったよ！お疲れさま。"
          : "時間を選ぶか入力して、「開始」を押してね。";

  const customH = Math.floor(durationSec / 3600);
  const customM = Math.floor((durationSec % 3600) / 60);
  const customS = durationSec % 60;

  const core = (
    <div id="timer-core">
      <div
        className={
          "timer-display" +
          (state === "running" ? " is-running" : "") +
          (state === "paused" ? " is-paused" : "") +
          (state === "done" ? " is-done" : "")
        }
      >
        <div className="timer-progress-track">
          <div className="timer-progress-bar" style={{ width: pct + "%" }} />
        </div>
        <div className={"timer-time" + (hasHours ? " has-hours" : "")}>{digitsSpans(tmrFormat(shownSec))}</div>
        <p className="timer-state-label">{state === "paused" ? "一時停止中" : state === "done" ? "終了！" : ""}</p>
      </div>

      <div className="timer-controls">
        {state === "idle" && (
          <button type="button" className="timer-btn timer-btn-primary" onClick={() => start(durationSec > 0 ? durationSec : 300)}>
            開始
          </button>
        )}
        {(state === "running" || state === "paused") && (
          <button type="button" className="timer-btn" onClick={() => (state === "running" ? pause() : resume())}>
            {state === "paused" ? "再開" : "一時停止"}
          </button>
        )}
        {(state === "running" || state === "paused") && (
          <button type="button" className="timer-btn" onClick={subMinute}>
            −1分
          </button>
        )}
        {(state === "running" || state === "paused") && (
          <button type="button" className="timer-btn" onClick={addMinute}>
            +1分
          </button>
        )}
        {state !== "idle" && (
          <button type="button" className="timer-btn" onClick={reset}>
            リセット
          </button>
        )}
        {alarmActive && (
          <button type="button" className="timer-btn" onClick={stopAlarm}>
            音を止める
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <KenchanBubble className="timer-kc">{kcMsg}</KenchanBubble>

      <div className={"timer-panel" + (state === "done" ? " is-done" : "")}>
        <Link href="/tools/stopwatch" className="clock-switch-link">
          ⏱ ストップウォッチを見る
        </Link>
        <button type="button" className="timer-bigmode-btn" onClick={enterBigMode}>
          大画面
        </button>
        {!bigMode && core}

        <div className="timer-settings">
          <p className="timer-settings-label">時間を選ぶ</p>
          <SegRadioGroup
            ariaLabel="よく使う時間"
            className="timer-opt-grid"
            optionClassName="timer-opt"
            value={String(total)}
            onChange={(v) => onPresetChange(parseInt(v, 10))}
            options={PRESETS.map((sec) => ({ value: String(sec), label: presetLabel(sec) }))}
          />

          <details className="chart-details timer-custom">
            <summary>時間を自由に設定</summary>
            <div className="timer-slider-fields">
              <div className="timer-slider-field">
                <label htmlFor="timer-h">
                  時間<span className="timer-slider-val">{customH}</span>
                </label>
                <input
                  id="timer-h"
                  type="range"
                  min={0}
                  max={23}
                  step={1}
                  value={customH}
                  style={sliderFillStyle(customH, 0, 23)}
                  onChange={(e) => onCustomChange(parseInt(e.target.value, 10), customM, customS)}
                />
              </div>
              <div className="timer-slider-field">
                <label htmlFor="timer-m">
                  分<span className="timer-slider-val">{customM}</span>
                </label>
                <input
                  id="timer-m"
                  type="range"
                  min={0}
                  max={59}
                  step={1}
                  value={customM}
                  style={sliderFillStyle(customM, 0, 59)}
                  onChange={(e) => onCustomChange(customH, parseInt(e.target.value, 10), customS)}
                />
              </div>
              <div className="timer-slider-field">
                <label htmlFor="timer-s">
                  秒<span className="timer-slider-val">{customS}</span>
                </label>
                <input
                  id="timer-s"
                  type="range"
                  min={0}
                  max={59}
                  step={1}
                  value={customS}
                  style={sliderFillStyle(customS, 0, 59)}
                  onChange={(e) => onCustomChange(customH, customM, parseInt(e.target.value, 10))}
                />
              </div>
            </div>
            <p className="field-hint">スライダーを動かすと上の時間表示に反映されます。「開始」を押すとこの時間で始まります（23時間59分59秒まで）。</p>
          </details>

          <p className="timer-settings-label">音の種類（選ぶとその場で鳴ります）</p>
          <SegRadioGroup
            ariaLabel="音の種類"
            className="timer-opt-grid"
            optionClassName="timer-opt"
            value={soundType}
            onChange={(v) => {
              setSoundType(v);
              saveSoundPref(v);
              ensureAudio();
              beepOnce();
            }}
            options={[
              { value: "simple", label: "シンプル" },
              { value: "bell", label: "ベル" },
              { value: "melody", label: "メロディ" },
            ]}
          />
          <div className="timer-slider-field timer-volume-field">
            <label htmlFor="timer-volume">
              音量<span className="timer-slider-val">{volumePct}</span>
            </label>
            <input
              id="timer-volume"
              type="range"
              min={0}
              max={100}
              step={5}
              value={volumePct}
              style={sliderFillStyle(volumePct, 0, 100)}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setVolumePct(v);
                saveVolumePref(v);
              }}
              onMouseUp={() => {
                ensureAudio();
                beepOnce();
              }}
              onTouchEnd={() => {
                ensureAudio();
                beepOnce();
              }}
              onKeyUp={(e: ReactKeyboardEvent<HTMLInputElement>) => {
                if (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End") {
                  ensureAudio();
                  beepOnce();
                }
              }}
            />
          </div>
        </div>
      </div>

      {bigMode && (
        <BigModeOverlay className="timer-bigmode" ariaLabel="タイマー（大画面表示）">
          <button type="button" className="timer-bigmode-close" aria-label="閉じる" onClick={exitBigMode}>
            ✕
          </button>
          <div className="timer-bigmode-body">{core}</div>
        </BigModeOverlay>
      )}
    </>
  );
}
