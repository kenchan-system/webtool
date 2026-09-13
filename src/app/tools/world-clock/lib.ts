// 世界時計の純粋関数。都市の時差・サマータイムは自前で計算せず、すべて
// Intl.DateTimeFormatにタイムゾーン名（IANA）を渡して算出する（手計算だと
// サマータイムの反映漏れなどを起こしやすいため）。プロトタイプの
// wcTimeStr()/wcOffsetLabel()/wcDayDiff()/wcTerminatorPathD() 等を移植。

export const WC_MAP_W = 1000;
export const WC_MAP_H = 500;
const WC_CITY_KEY = "kenchan-worldclock-cities";

export function wcProject(lat: number, lon: number): [number, number] {
  return [((lon + 180) / 360) * WC_MAP_W, ((90 - lat) / 180) * WC_MAP_H];
}

// 経度30度おき・緯度30度おきの補助グリッド線の座標（固定値なのでモジュール読み込み時に一度だけ計算）。
export const WC_GRID_VLINES: number[] = (() => {
  const out: number[] = [];
  for (let lon = -180; lon <= 180; lon += 30) out.push(wcProject(0, lon)[0]);
  return out;
})();
export const WC_GRID_HLINES: number[] = (() => {
  const out: number[] = [];
  for (let lat = -60; lat <= 60; lat += 30) out.push(wcProject(lat, 0)[1]);
  return out;
})();

/** 昼夜の境界線（ターミネーター）。太陽赤緯・南中経度から簡易計算し、夜側の半球を覆うポリゴンを作る。 */
export function wcTerminatorPathD(now: Date): string {
  const dayMs = Date.UTC(now.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - dayMs) / 86400000);
  const declDeg = -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));
  const declRad = (declDeg * Math.PI) / 180;
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
  let subsolarLon = (12 - utcHours) * 15;
  while (subsolarLon > 180) subsolarLon -= 360;
  while (subsolarLon < -180) subsolarLon += 360;
  let tanDecl = Math.tan(declRad);
  if (Math.abs(tanDecl) < 0.0001) tanDecl = tanDecl < 0 ? -0.0001 : 0.0001;
  let d = "";
  for (let lon = -180; lon <= 180; lon += 6) {
    const h = ((lon - subsolarLon) * Math.PI) / 180;
    const latRad = Math.atan(-Math.cos(h) / tanDecl);
    const latDeg = (latRad * 180) / Math.PI;
    const xy = wcProject(latDeg, lon);
    d += (lon === -180 ? "M" : "L") + xy[0].toFixed(1) + "," + xy[1].toFixed(1);
  }
  // 夜側が南極寄りか北極寄りかは、太陽赤緯の符号（＝季節）で決まる
  const poleLat = declDeg >= 0 ? -90 : 90;
  const poleY = wcProject(poleLat, 0)[1];
  d += "L" + WC_MAP_W.toFixed(1) + "," + poleY.toFixed(1);
  d += "L0.0," + poleY.toFixed(1) + "Z";
  return d;
}

const timeFmtCache: Record<string, Intl.DateTimeFormat | null> = {};
const offsetFmtCache: Record<string, Intl.DateTimeFormat | null> = {};
const dateFmtCache: Record<string, Intl.DateTimeFormat | null> = {};

function timeFmt(tz: string): Intl.DateTimeFormat | null {
  if (!(tz in timeFmtCache)) {
    try {
      timeFmtCache[tz] = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", hour: "2-digit", minute: "2-digit" });
    } catch {
      timeFmtCache[tz] = null;
    }
  }
  return timeFmtCache[tz];
}
function offsetFmt(tz: string): Intl.DateTimeFormat | null {
  if (!(tz in offsetFmtCache)) {
    try {
      offsetFmtCache[tz] = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" });
    } catch {
      offsetFmtCache[tz] = null;
    }
  }
  return offsetFmtCache[tz];
}
function dateFmt(tz: string): Intl.DateTimeFormat | null {
  if (!(tz in dateFmtCache)) {
    try {
      dateFmtCache[tz] = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
    } catch {
      dateFmtCache[tz] = null;
    }
  }
  return dateFmtCache[tz];
}
function partsMap(fmt: Intl.DateTimeFormat | null, now: Date): Record<string, string> {
  const map: Record<string, string> = {};
  if (!fmt) return map;
  fmt.formatToParts(now).forEach((p) => {
    map[p.type] = p.value;
  });
  return map;
}

export function wcTimeStr(tz: string, now: Date): string {
  const m = partsMap(timeFmt(tz), now);
  if (!m.hour) return "--:--";
  return `${m.hour}:${m.minute}`;
}
export function wcHomeHour(tz: string, now: Date): number {
  const m = partsMap(timeFmt(tz), now);
  return m.hour ? parseInt(m.hour, 10) : now.getHours();
}
export function wcOffsetLabel(tz: string, now: Date): string {
  const m = partsMap(offsetFmt(tz), now);
  const raw = m.timeZoneName;
  if (!raw) return "";
  if (raw === "GMT") return "UTC+0";
  return raw.replace("GMT", "UTC");
}
export function wcOffsetMinutes(tz: string, now: Date): number {
  const label = wcOffsetLabel(tz, now);
  const m = label.match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (parseInt(m[2], 10) * 60 + (m[3] ? parseInt(m[3], 10) : 0));
}
export function wcDateNum(tz: string, now: Date): number {
  const m = partsMap(dateFmt(tz), now);
  if (!m.year) return 0;
  return Date.UTC(parseInt(m.year, 10), parseInt(m.month, 10) - 1, parseInt(m.day, 10));
}
export function wcDayDiff(tz: string, homeTz: string, now: Date): number {
  return Math.round((wcDateNum(tz, now) - wcDateNum(homeTz, now)) / 86400000);
}

export function loadSelectedTzs(defaultTzs: string[]): string[] {
  try {
    const raw = localStorage.getItem(WC_CITY_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch {
    /* noop */
  }
  return [...defaultTzs];
}
export function saveSelectedTzs(tzs: string[]) {
  try {
    localStorage.setItem(WC_CITY_KEY, JSON.stringify(tzs));
  } catch {
    /* noop */
  }
}
export function detectHomeTz(): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) return detected;
  } catch {
    /* noop */
  }
  return "Asia/Tokyo";
}
