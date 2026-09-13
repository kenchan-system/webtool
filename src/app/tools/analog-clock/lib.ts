// アナログ時計の純粋関数（文字盤の目盛り・数字の座標、針の角度）。
// プロトタイプの aclkBuildFace()/aclkRender() を移植。12時の位置を0度、
// 時計回りに角度が増える。

export interface TickMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  major: boolean;
}

function buildTicks(): TickMark[] {
  const cx = 100;
  const cy = 100;
  const ticks: TickMark[] = [];
  for (let m = 0; m < 60; m++) {
    const theta = (m * 6 * Math.PI) / 180;
    const isMajor = m % 5 === 0;
    const rOuter = 92;
    const rInner = isMajor ? 80 : 86;
    ticks.push({
      x1: cx + rOuter * Math.sin(theta),
      y1: cy - rOuter * Math.cos(theta),
      x2: cx + rInner * Math.sin(theta),
      y2: cy - rInner * Math.cos(theta),
      major: isMajor,
    });
  }
  return ticks;
}

export interface Numeral {
  x: number;
  y: number;
  label: string;
}

function buildNumerals(): Numeral[] {
  const cx = 100;
  const cy = 100;
  const r = 68;
  const out: Numeral[] = [];
  for (let i = 1; i <= 12; i++) {
    const theta = (i * 30 * Math.PI) / 180;
    out.push({ x: cx + r * Math.sin(theta), y: cy - r * Math.cos(theta), label: String(i) });
  }
  return out;
}

// 目盛り・数字の座標は現在時刻に依存しない固定値なので、モジュール読み込み時に一度だけ計算する。
export const TICKS = buildTicks();
export const NUMERALS = buildNumerals();

export function handAngles(now: Date): { hourDeg: number; minDeg: number; secDeg: number } {
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourDeg = ((h % 12) + m / 60 + s / 3600) * 30;
  const minDeg = (m + s / 60) * 6;
  const secDeg = s * 6;
  return { hourDeg, minDeg, secDeg };
}
