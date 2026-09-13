// デジタル時計の純粋関数。プロトタイプの clkGreeting()/clkRender() の表示部分を移植。
import type { ClockFormat } from "@/lib/clockPrefs";

function pad2(n: number): string {
  return (n < 10 ? "0" : "") + n;
}

export function clkGreeting(h: number): string {
  if (h >= 5 && h < 10) return "おはよう！今日も一日がんばろうね。";
  if (h >= 10 && h < 17) return "こんにちは。今日もいい一日を過ごしてね。";
  if (h >= 17 && h < 22) return "こんばんは。今日もお疲れさま。";
  return "こんな時間まで起きてるんだね。無理はしないでね。";
}

export function formatClockTime(
  now: Date,
  format: ClockFormat,
  showSeconds: boolean,
): { timeStr: string; ampm: string } {
  const h24 = now.getHours();
  let ampm = "";
  let hDisplay: string;
  if (format === "12") {
    ampm = h24 < 12 ? "午前" : "午後";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    hDisplay = String(h12);
  } else {
    hDisplay = pad2(h24);
  }
  let timeStr = `${hDisplay}:${pad2(now.getMinutes())}`;
  if (showSeconds) timeStr += `:${pad2(now.getSeconds())}`;
  return { timeStr, ampm };
}
