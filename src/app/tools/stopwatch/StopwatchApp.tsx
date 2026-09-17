"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BigModeOverlay } from "@/components/BigModeOverlay";
import { CopyButton } from "@/components/CopyButton";
import { KenchanBubble } from "@/components/KenchanBubble";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { SW_TICK_MS, fastestSlowestIndex, lapsToText, swFormat, swFormatShort, type Lap, type SwState } from "./lib";
import { loadSoundPref, saveSoundPref, useStopwatchAudio } from "./useStopwatchAudio";

function digitsSpans(str: string) {
  return str.split("").map((ch, i) => {
    if (ch === ":") {
      return (
        <span key={i} className="sw-time-colon">
          :
        </span>
      );
    }
    if (ch === ".") {
      return (
        <span key={i} className="sw-time-dot">
          .
        </span>
      );
    }
    return (
      <span key={i} className="sw-time-digit">
        {ch}
      </span>
    );
  });
}

export function StopwatchApp() {
  const [state, setState] = useState<SwState>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [bigMode, setBigMode] = useState(false);

  const [soundOn, setSoundOn] = useState(false);
  useEffect(() => {
    // SSR時の既定値から、閲覧者が保存した設定へマウント後に切り替える。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSoundOn(loadSoundPref());
  }, []);

  const { ensureAudio, beep } = useStopwatchAudio();

  const runningRef = useRef(false);
  const elapsedBeforePauseMsRef = useRef(0);
  const segmentStartAtRef = useRef<number | null>(null);
  const tickHandleRef = useRef<number | null>(null);
  const baseTitleRef = useRef<string | null>(null);
  const lastTitleStrRef = useRef<string | null>(null);

  function elapsedMsNow(): number {
    if (runningRef.current && segmentStartAtRef.current != null) {
      return elapsedBeforePauseMsRef.current + (Date.now() - segmentStartAtRef.current);
    }
    return elapsedBeforePauseMsRef.current;
  }

  function updateTitle(ms: number) {
    const str = swFormatShort(ms);
    if (baseTitleRef.current === null) baseTitleRef.current = document.title;
    if (str === lastTitleStrRef.current) return;
    lastTitleStrRef.current = str;
    document.title = `${str} - ${baseTitleRef.current}`;
  }
  function restoreTitle() {
    if (baseTitleRef.current !== null) {
      document.title = baseTitleRef.current;
      baseTitleRef.current = null;
    }
    lastTitleStrRef.current = null;
  }

  function stopTicking() {
    if (tickHandleRef.current != null) {
      clearInterval(tickHandleRef.current);
      tickHandleRef.current = null;
    }
  }
  function tick() {
    if (!runningRef.current) {
      stopTicking();
      return;
    }
    const ms = elapsedMsNow();
    setElapsedMs(ms);
    updateTitle(ms);
  }
  function startTicking() {
    stopTicking();
    tickHandleRef.current = window.setInterval(tick, SW_TICK_MS);
    tick();
  }

  function start() {
    ensureAudio();
    elapsedBeforePauseMsRef.current = 0;
    segmentStartAtRef.current = Date.now();
    runningRef.current = true;
    setLaps([]);
    setState("running");
    startTicking();
  }
  function pause() {
    if (state !== "running") return;
    elapsedBeforePauseMsRef.current += Date.now() - (segmentStartAtRef.current ?? Date.now());
    segmentStartAtRef.current = null;
    runningRef.current = false;
    stopTicking();
    restoreTitle();
    setState("paused");
    setElapsedMs(elapsedBeforePauseMsRef.current);
  }
  function resume() {
    if (state !== "paused") return;
    ensureAudio();
    segmentStartAtRef.current = Date.now();
    runningRef.current = true;
    setState("running");
    startTicking();
  }
  function lap() {
    if (state !== "running") return;
    const total = elapsedMsNow();
    setLaps((prev) => {
      const prevTotal = prev.length ? prev[prev.length - 1].totalMs : 0;
      return [...prev, { n: prev.length + 1, totalMs: total, splitMs: total - prevTotal }];
    });
    if (soundOn) {
      ensureAudio();
      beep();
    }
  }
  function reset() {
    stopTicking();
    runningRef.current = false;
    restoreTitle();
    elapsedBeforePauseMsRef.current = 0;
    segmentStartAtRef.current = null;
    setLaps([]);
    setState("idle");
    setElapsedMs(0);
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
  }, [bigMode]);

  useEffect(() => {
    function onFsChange() {
      if (!document.fullscreenElement && bigMode) exitBigMode();
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [bigMode]);

  // キーボード操作：Space=開始/一時停止/再開、L=ラップ、R=リセット（一時停止中のみ）。
  // 入力欄・ボタン・リンクにフォーカスがあるときは無効にする。
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (state === "idle") start();
        else if (state === "running") pause();
        else if (state === "paused") resume();
      } else if (e.key === "l" || e.key === "L") {
        if (state === "running") lap();
      } else if (e.key === "r" || e.key === "R") {
        if (state === "paused") reset();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    return () => stopTicking();
  }, []);

  const hasHours = swFormat(elapsedMs).split(":").length === 3;
  const { fastestIdx, slowestIdx } = useMemo(() => fastestSlowestIndex(laps), [laps]);
  const lapsText = useMemo(() => lapsToText(laps), [laps]);

  const kcMsg =
    state === "running"
      ? laps.length > 0
        ? `計測中だよ。ここまでラップを${laps.length}件記録したよ。`
        : "計測中だよ。「ラップ」を押すと区間タイムを記録できるよ。"
      : state === "paused"
        ? "一時停止中だよ。「再開」でつづきから計測できるよ。"
        : "「開始」を押すと計測がはじまるよ。";

  const core = (
    <div id="sw-core">
      <div className={"sw-display" + (state === "running" ? " is-running" : "") + (state === "paused" ? " is-paused" : "")}>
        <div className={"sw-time" + (hasHours ? " has-hours" : "")}>{digitsSpans(swFormat(elapsedMs))}</div>
        <p className="sw-state-label">{state === "paused" ? "一時停止中" : ""}</p>
      </div>

      <div className="sw-controls">
        {state === "idle" && (
          <button type="button" className="sw-btn sw-btn-primary" onClick={start}>
            開始
          </button>
        )}
        {state !== "idle" && (
          <button type="button" className="sw-btn" onClick={() => (state === "running" ? pause() : resume())}>
            {state === "paused" ? "再開" : "一時停止"}
          </button>
        )}
        {state === "running" && (
          <button type="button" className="sw-btn" onClick={lap}>
            ラップ
          </button>
        )}
        {state !== "idle" && (
          <button type="button" className="sw-btn" onClick={reset}>
            リセット
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <KenchanBubble className="sw-kc">{kcMsg}</KenchanBubble>

      <div className="sw-panel">
        <Link href="/tools/timer" className="clock-switch-link">
          ⏲ タイマーを見る
        </Link>
        <button type="button" className="sw-bigmode-btn" onClick={enterBigMode}>
          大画面
        </button>
        {!bigMode && core}

        <div className="sw-settings">
          <p className="sw-settings-label">ラップ音</p>
          <SegRadioGroup
            ariaLabel="ラップ音"
            className="sw-opt-grid"
            optionClassName="sw-opt"
            value={soundOn ? "on" : "off"}
            onChange={(v) => {
              const on = v === "on";
              setSoundOn(on);
              saveSoundPref(on);
            }}
            options={[
              { value: "off", label: "オフ" },
              { value: "on", label: "オン" },
            ]}
          />
        </div>

        <div className="sw-laps">
          <div className="sw-laps-head">
            <p className="sw-settings-label">ラップタイム</p>
            {laps.length > 0 && <CopyButton text={lapsText} label="ラップをコピー" />}
          </div>
          <ol className="sw-lap-list">
            {laps.length === 0 ? (
              <li className="sw-lap-empty">まだラップはありません</li>
            ) : (
              [...laps].reverse().map((l, i) => {
                const idx = laps.length - 1 - i;
                const cls =
                  "sw-lap" + (idx === fastestIdx ? " is-fastest" : "") + (idx === slowestIdx ? " is-slowest" : "");
                return (
                  <li key={l.n} className={cls}>
                    <span className="sw-lap-n">Lap {l.n}</span>
                    <span className="sw-lap-split">{swFormat(l.splitMs)}</span>
                    <span className="sw-lap-total">合計 {swFormat(l.totalMs)}</span>
                  </li>
                );
              })
            )}
          </ol>
        </div>
      </div>

      {bigMode && (
        <BigModeOverlay className="sw-bigmode" ariaLabel="ストップウォッチ（大画面表示）">
          <button type="button" className="sw-bigmode-close" aria-label="閉じる" onClick={exitBigMode}>
            ✕
          </button>
          <div className="sw-bigmode-body">{core}</div>
        </BigModeOverlay>
      )}
    </>
  );
}
