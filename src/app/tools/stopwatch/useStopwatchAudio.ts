"use client";

// ラップ記録時の短いクリック音（Web Audio APIでオシレーターを都度合成）。
// プロトタイプの swEnsureAudio/swBeep を移植。
import { useCallback, useRef } from "react";

const SOUND_KEY = "kenchan-stopwatch-sound";

export function loadSoundPref(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}
export function saveSoundPref(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    /* noop */
  }
}

export function useStopwatchAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback(() => {
    if (!ctxRef.current) {
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC) ctxRef.current = new AC();
      } catch {
        ctxRef.current = null;
      }
    }
    if (ctxRef.current && ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
  }, []);

  const beep = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    try {
      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.15);
    } catch {
      /* noop */
    }
  }, []);

  return { ensureAudio, beep };
}
