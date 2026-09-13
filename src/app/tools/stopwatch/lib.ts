// ストップウォッチの純粋関数（表示フォーマット）。プロトタイプの swFormat() 等を移植。

export type SwState = "idle" | "running" | "paused";

export interface Lap {
  n: number;
  totalMs: number;
  splitMs: number;
}

export const SW_TICK_MS = 30;

function pad2(n: number): string {
  return (n < 10 ? "0" : "") + n;
}

/** 1/100秒まで表示。1時間以上は百分の一秒の桁を落として時:分:秒表示にする。 */
export function swFormat(ms: number): string {
  const totalCs = Math.floor(Math.max(0, ms) / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const s = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m = totalMin % 60;
  const h = Math.floor(totalMin / 60);
  return h > 0 ? `${h}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
}

/** タブタイトル用の短い表記（秒までのみ）。 */
export function swFormatShort(ms: number): string {
  const totalSec = Math.floor(Math.max(0, ms) / 1000);
  const s = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m = totalMin % 60;
  const h = Math.floor(totalMin / 60);
  return h > 0 ? `${h}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}`;
}

/** 3件以上たまったら、最速・最遅の区間タイムのindexを返す（対象外は-1）。 */
export function fastestSlowestIndex(laps: Lap[]): { fastestIdx: number; slowestIdx: number } {
  if (laps.length < 3) return { fastestIdx: -1, slowestIdx: -1 };
  let minSplit = Infinity;
  let maxSplit = -Infinity;
  let fastestIdx = -1;
  let slowestIdx = -1;
  laps.forEach((l, i) => {
    if (l.splitMs < minSplit) {
      minSplit = l.splitMs;
      fastestIdx = i;
    }
    if (l.splitMs > maxSplit) {
      maxSplit = l.splitMs;
      slowestIdx = i;
    }
  });
  return { fastestIdx, slowestIdx };
}

export function lapsToText(laps: Lap[]): string {
  if (!laps.length) return "";
  const lines = ["ストップウォッチ ラップタイム"];
  laps.forEach((l) => lines.push(`Lap ${l.n}\t${swFormat(l.splitMs)}\t(合計 ${swFormat(l.totalMs)})`));
  return lines.join("\n");
}
