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
