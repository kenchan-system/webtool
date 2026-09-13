// デジタル時計・アナログ時計で共有する表示設定（localStorage）。
// プロトタイプでは同じ2つのキーを両ツールが読み書きしていた。

export type ClockFormat = "24" | "12";

const FORMAT_KEY = "kenchan-clock-format";
const SECONDS_KEY = "kenchan-clock-seconds";

export function loadClockFormatPref(): ClockFormat {
  try {
    const v = localStorage.getItem(FORMAT_KEY);
    if (v === "12" || v === "24") return v;
  } catch {
    /* noop */
  }
  return "24";
}
export function saveClockFormatPref(v: ClockFormat) {
  try {
    localStorage.setItem(FORMAT_KEY, v);
  } catch {
    /* noop */
  }
}
export function loadClockSecondsPref(): boolean {
  try {
    return localStorage.getItem(SECONDS_KEY) !== "off";
  } catch {
    return true;
  }
}
export function saveClockSecondsPref(on: boolean) {
  try {
    localStorage.setItem(SECONDS_KEY, on ? "on" : "off");
  } catch {
    /* noop */
  }
}
