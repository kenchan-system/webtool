// 日本の祝日エンジン。プロトタイプの calHolidayName() 等を移植。
// 「国民の祝日に関する法律」にもとづく固定祝日・ハッピーマンデー・
// 春分秋分（近似式）・振替休日・国民の休日を計算する。特例法による
// 一時的な祝日移動（即位・オリンピック関連）は判明している分のみ反映。

function calNthWeekday(y: number, m: number, dow: number, n: number): number {
  const first = new Date(y, m - 1, 1);
  const offset = (dow - first.getDay() + 7) % 7;
  return 1 + offset + (n - 1) * 7;
}

/** 春分・秋分の日（近似式、1980〜2099年でおおむね正確）。 */
function calEquinoxDay(y: number, spring: boolean): number {
  const base = spring ? 20.8431 : 23.2488;
  return Math.floor(base + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
}

function calKey(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// 特例法による一時的な祝日の新設・移動（判明している分のみ）
const CAL_OVERRIDE_ADD: Record<string, string> = {
  "2019-05-01": "即位の日",
  "2019-10-22": "即位礼正殿の儀の行われる日",
  "2020-07-23": "海の日",
  "2020-07-24": "スポーツの日",
  "2020-08-10": "山の日",
  "2021-07-22": "海の日",
  "2021-07-23": "スポーツの日",
  "2021-08-08": "山の日",
};
const CAL_OVERRIDE_SUPPRESS: Record<string, boolean> = {
  "2020-07-20": true,
  "2020-10-12": true,
  "2020-08-11": true,
  "2021-07-19": true,
  "2021-10-11": true,
  "2021-08-11": true,
};

/** 振替休日・国民の休日を含まない「素」の祝日名。 */
function calBaseHolidayName(y: number, m: number, d: number): string | null {
  const key = calKey(y, m, d);
  if (CAL_OVERRIDE_SUPPRESS[key]) return null;
  if (CAL_OVERRIDE_ADD[key]) return CAL_OVERRIDE_ADD[key];
  if (y < 1948) return null;
  if (m === 1 && d === 1) return "元日";
  if (m === 1) {
    if (y >= 2000) {
      if (d === calNthWeekday(y, 1, 1, 2)) return "成人の日";
    } else if (d === 15) return "成人の日";
  }
  if (m === 2) {
    if (y >= 1967 && d === 11) return "建国記念の日";
    if (y >= 2020 && d === 23) return "天皇誕生日";
  }
  if (m === 3 && d === calEquinoxDay(y, true)) return "春分の日";
  if (m === 4 && d === 29) {
    if (y >= 2007) return "昭和の日";
    if (y >= 1989) return "みどりの日";
    return "天皇誕生日";
  }
  if (m === 5) {
    if (d === 3) return "憲法記念日";
    if (d === 4 && y >= 2007) return "みどりの日";
    if (d === 5) return "こどもの日";
  }
  if (m === 7) {
    if (y >= 2003) {
      if (d === calNthWeekday(y, 7, 1, 3)) return "海の日";
    } else if (y >= 1996 && d === 20) return "海の日";
  }
  if (m === 8 && y >= 2016 && d === 11) return "山の日";
  if (m === 9) {
    if (y >= 2003) {
      if (d === calNthWeekday(y, 9, 1, 3)) return "敬老の日";
    } else if (y >= 1966 && d === 15) return "敬老の日";
    if (d === calEquinoxDay(y, false)) return "秋分の日";
  }
  if (m === 10) {
    if (y >= 2000) {
      if (d === calNthWeekday(y, 10, 1, 2)) return y >= 2020 ? "スポーツの日" : "体育の日";
    } else if (y >= 1966 && d === 10) return "体育の日";
  }
  if (m === 11) {
    if (d === 3) return "文化の日";
    if (d === 23) return "勤労感謝の日";
  }
  if (m === 12 && y >= 1989 && y <= 2018 && d === 23) return "天皇誕生日";
  return null;
}

/** 振替休日（1973年〜）：日曜起点の祝日の連鎖のあと、最初に祝日でなくなる日。 */
function calIsSubstitute(y: number, m: number, d: number): boolean {
  if (y < 1973) return false;
  if (calBaseHolidayName(y, m, d)) return false;
  const back = new Date(y, m - 1, d - 1);
  while (back.getDay() !== 0) back.setDate(back.getDate() - 1);
  if (!calBaseHolidayName(back.getFullYear(), back.getMonth() + 1, back.getDate())) return false;
  const p = new Date(back);
  p.setDate(p.getDate() + 1);
  const target = new Date(y, m - 1, d);
  while (p.getTime() < target.getTime()) {
    if (!calBaseHolidayName(p.getFullYear(), p.getMonth() + 1, p.getDate())) return false;
    p.setDate(p.getDate() + 1);
  }
  return true;
}

/** 国民の休日（1986年〜）：前後を祝日に挟まれた、祝日でない平日を含む、最終的な祝日名。 */
export function calHolidayName(y: number, m: number, d: number): string | null {
  const base = calBaseHolidayName(y, m, d);
  if (base) return base;
  if (calIsSubstitute(y, m, d)) return "振替休日";
  const dow = new Date(y, m - 1, d).getDay();
  if (y >= 1986 && dow !== 0 && dow !== 6) {
    const prevD = new Date(y, m - 1, d - 1);
    const nextD = new Date(y, m - 1, d + 1);
    const prevName = calBaseHolidayName(prevD.getFullYear(), prevD.getMonth() + 1, prevD.getDate());
    const nextName = calBaseHolidayName(nextD.getFullYear(), nextD.getMonth() + 1, nextD.getDate());
    if (prevName && nextName) return "国民の休日";
  }
  return null;
}

export interface NextHoliday {
  date: Date;
  name: string;
}

/** fromDt以降で最初に来る祝日（400日先まで探索）。 */
export function calNextHoliday(fromDt: Date): NextHoliday | null {
  const d = new Date(fromDt.getFullYear(), fromDt.getMonth(), fromDt.getDate());
  for (let i = 0; i < 400; i++) {
    const name = calHolidayName(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (name) return { date: new Date(d), name };
    d.setDate(d.getDate() + 1);
  }
  return null;
}
