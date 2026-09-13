// 日付まわりの共通ロジック（プロトタイプの ymdToDate / jpDate 等の移植）。
// 年齢・日数・和暦・カレンダーなど、複数の日付系ツールで使う。

export function ymdToDate(y: number, m: number, d: number): Date | null {
  if (!(y >= 1900 && y <= 2200 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return null;
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

export const JP_DOW = ["日", "月", "火", "水", "木", "金", "土"];

export function jpDate(dt: Date): string {
  return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日`;
}

export function jpDateDow(dt: Date): string {
  return `${jpDate(dt)}（${JP_DOW[dt.getDay()]}）`;
}

export function isoDate(dt: Date): string {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export function todayAtMidnight(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/** 日数の差（b - a、時刻は考慮しない）。 */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** a<=b 前提で、差を「Y年Mか月D日」形式で返す。 */
export function ymdDiff(a: Date, b: Date): string {
  let y = b.getFullYear() - a.getFullYear();
  let mo = b.getMonth() - a.getMonth();
  let da = b.getDate() - a.getDate();
  if (da < 0) {
    mo--;
    da += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (mo < 0) {
    y--;
    mo += 12;
  }
  return `${y}年${mo}か月${da}日`;
}

/** dt からカレンダー上でn日進めた（負なら戻した）日付。 */
export function addCalendarDays(dt: Date, n: number): Date {
  const r = new Date(dt.getTime());
  r.setDate(r.getDate() + n);
  r.setHours(0, 0, 0, 0);
  return r;
}
