"use client";

// タイマーの音（Web Audio APIでオシレーターを都度合成、音源ファイルは使わない）。
// プロトタイプの tmrEnsureAudio/tmrPlayTone/tmrBeepOnce を移植。
import { useCallback, useRef } from "react";

export type SoundType = "simple" | "bell" | "melody";

const SOUND_KEY = "kenchan-timer-sound";
const VOLUME_KEY = "kenchan-timer-volume";

export function loadSoundPref(): SoundType {
  try {
    const v = localStorage.getItem(SOUND_KEY);
    if (v === "simple" || v === "bell" || v === "melody") return v;
  } catch {
    /* noop */
  }
  return "simple";
}
export function saveSoundPref(v: SoundType) {
  try {
    localStorage.setItem(SOUND_KEY, v);
  } catch {
    /* noop */
  }
}
export function loadVolumePref(): number {
  try {
    const v = parseInt(localStorage.getItem(VOLUME_KEY) ?? "", 10);
    if (v >= 0 && v <= 100) return v;
  } catch {
    /* noop */
  }
  return 80;
}
export function saveVolumePref(v: number) {
  try {
    localStorage.setItem(VOLUME_KEY, String(v));
  } catch {
    /* noop */
  }
}

export function useTimerAudio(soundType: SoundType, volumePct: number) {
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

  const playTone = useCallback(
    (freq: number, offset: number, dur: number, waveform: OscillatorType, peakGain: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      try {
        const t0 = ctx.currentTime + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = waveform;
        osc.frequency.value = freq;
        const peak = Math.max(0.0001, peakGain * (volumePct / 100));
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
      } catch {
        /* noop */
      }
    },
    [volumePct],
  );

  const beepOnce = useCallback(() => {
    if (!ctxRef.current) return;
    if (soundType === "bell") {
      playTone(1046, 0, 0.5, "triangle", 0.3);
      playTone(784, 0.15, 0.5, "triangle", 0.3);
    } else if (soundType === "melody") {
      playTone(523, 0, 0.18, "sine", 0.3);
      playTone(659, 0.16, 0.18, "sine", 0.3);
      playTone(784, 0.32, 0.3, "sine", 0.3);
    } else {
      playTone(880, 0, 0.35, "sine", 0.3);
    }
  }, [soundType, playTone]);

  return { ensureAudio, beepOnce };
}
