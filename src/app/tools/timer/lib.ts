// タイマーの純粋関数（表示フォーマット・定数）。プロトタイプの tmrFormat() 等を移植。

export type TimerState = "idle" | "running" | "paused" | "done";

export const TMR_TICK_MS = 250;
export const TMR_MAX_SEC = 99 * 3600 + 59 * 60 + 59;

export const PRESETS = [10, 30, 60, 180, 300, 600, 900, 1800, 3600];
export const DEFAULT_DURATION_SEC = 300;

export function tmrFormat(totalSecRaw: number): string {
  const totalSec = Math.max(0, Math.round(totalSecRaw));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => (n < 10 ? "0" : "") + n;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function presetLabel(sec: number): string {
  if (sec < 60) return `${sec}秒`;
  return `${sec / 60}分`;
}
