// カレンダーのグリッド構築ロジック。プロトタイプの calBuildCells() 等を移植。
// HTML文字列ではなくデータ（セル配列など）を返し、React側で描画する。
import { calHolidayName } from "@/lib/holidays";

export type WeekStart = "sun" | "mon";
export type CalView = "month" | "year";

export interface CalCell {
  y: number;
  m: number;
  d: number;
  inMonth: boolean;
}

export function calDaysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

export function calColIndex(dow: number, start: WeekStart): number {
  return start === "mon" ? (dow + 6) % 7 : dow;
}

export const CAL_DOW_SUN = ["日", "月", "火", "水", "木", "金", "土"];
export const CAL_DOW_MON = ["月", "火", "水", "木", "金", "土", "日"];

export function calDowLabels(start: WeekStart): string[] {
  return start === "mon" ? CAL_DOW_MON : CAL_DOW_SUN;
}

export function calDowClass(start: WeekStart, col: number): "is-sun" | "is-sat" | "" {
  const real = start === "mon" ? (col + 1) % 7 : col; // 0=日〜6=土
  if (real === 0) return "is-sun";
  if (real === 6) return "is-sat";
  return "";
}

/** ISO 8601 週番号（どの曜日を渡しても、その週の木曜基準で正しく算出）。 */
export function calIsoWeek(dt: Date): number {
  const d = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** 6週×7日＝42マスのセル配列（前後月の日を含む）。 */
export function calBuildCells(y: number, m: number, start: WeekStart): CalCell[] {
  const dim = calDaysInMonth(y, m);
  const firstDow = new Date(y, m - 1, 1).getDay();
  const startCol = calColIndex(firstDow, start);
  const py = m === 1 ? y - 1 : y;
  const pm = m === 1 ? 12 : m - 1;
  const prevDim = calDaysInMonth(py, pm);
  const cells: CalCell[] = [];
  for (let i = 0; i < startCol; i++) {
    cells.push({ y: py, m: pm, d: prevDim - startCol + 1 + i, inMonth: false });
  }
  for (let d = 1; d <= dim; d++) cells.push({ y, m, d, inMonth: true });
  while (cells.length < 42) {
    const last = cells[cells.length - 1];
    let ny = last.y;
    let nm = last.m;
    let nd = last.d + 1;
    const ldim = calDaysInMonth(ny, nm);
    if (nd > ldim) {
      nd = 1;
      nm += 1;
      if (nm > 12) {
        nm = 1;
        ny += 1;
      }
    }
    cells.push({ y: ny, m: nm, d: nd, inMonth: false });
  }
  return cells;
}

/** y/mを1900〜2100年の範囲にクランプしつつ、月の繰り上がり／繰り下がりを解決する。 */
export function calNormalizeYM(y: number, m: number): { y: number; m: number } {
  let ny = y;
  let nm = m;
  while (nm > 12) {
    nm -= 12;
    ny += 1;
  }
  while (nm < 1) {
    nm += 12;
    ny -= 1;
  }
  if (ny < 1900) {
    ny = 1900;
    nm = 1;
  }
  if (ny > 2100) {
    ny = 2100;
    nm = 12;
  }
  return { y: ny, m: nm };
}

export interface HolidayEntry {
  y: number;
  m: number;
  d: number;
  name: string;
}

/** ある年の祝日をすべて（月×日を総当たりして）列挙する。 */
export function calYearHolidays(y: number): HolidayEntry[] {
  const out: HolidayEntry[] = [];
  for (let m = 1; m <= 12; m++) {
    const dim = calDaysInMonth(y, m);
    for (let d = 1; d <= dim; d++) {
      const name = calHolidayName(y, m, d);
      if (name) out.push({ y, m, d, name });
    }
  }
  return out;
}
