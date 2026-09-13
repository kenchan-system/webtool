// 年齢・学年計算ロジック。プロトタイプの renderAge() 等を純粋関数として移植。
import { JP_DOW, jpDateDow, ymdToDate } from "@/lib/dateUtil";

const ETO: [string, string][] = [
  ["子", "ね"], ["丑", "うし"], ["寅", "とら"], ["卯", "う"],
  ["辰", "たつ"], ["巳", "み"], ["午", "うま"], ["未", "ひつじ"],
  ["申", "さる"], ["酉", "とり"], ["戌", "いぬ"], ["亥", "い"],
];

export function ageEtoOf(y: number): [string, string] {
  return ETO[(((y - 4) % 12) + 12) % 12];
}

export function ageWareki(y: number): string {
  if (y >= 2019) return "令和" + (y === 2019 ? "元" : y - 2018);
  if (y >= 1989) return "平成" + (y === 1989 ? "元" : y - 1988);
  if (y >= 1926) return "昭和" + (y === 1926 ? "元" : y - 1925);
  if (y >= 1912) return "大正" + (y === 1912 ? "元" : y - 1911);
  return "明治" + (y - 1867);
}

function ageSeiza(m: number, d: number): string {
  const s: [number, number, string][] = [
    [1, 20, "みずがめ座"], [2, 19, "うお座"], [3, 21, "おひつじ座"],
    [4, 20, "おうし座"], [5, 21, "ふたご座"], [6, 22, "かに座"],
    [7, 23, "しし座"], [8, 23, "おとめ座"], [9, 23, "てんびん座"],
    [10, 24, "さそり座"], [11, 23, "いて座"], [12, 22, "やぎ座"],
  ];
  for (let i = s.length - 1; i >= 0; i--) {
    if (m > s[i][0] || (m === s[i][0] && d >= s[i][1])) return s[i][2];
  }
  return "やぎ座";
}

function ageFull(y: number, m: number, d: number, base: Date): number {
  let a = base.getFullYear() - y;
  const bm = base.getMonth() + 1;
  if (bm < m || (bm === m && base.getDate() < d)) a--;
  return a;
}

function ageYmd(y: number, m: number, d: number, base: Date): string {
  let yy = base.getFullYear() - y;
  let mm = base.getMonth() + 1 - m;
  let dd = base.getDate() - d;
  if (dd < 0) {
    mm--;
    dd += new Date(base.getFullYear(), base.getMonth(), 0).getDate();
  }
  if (mm < 0) {
    yy--;
    mm += 12;
  }
  return `${yy}歳${mm}か月${dd}日`;
}

function ageEntryApril(y: number, m: number, d: number): number {
  const after = m > 4 || (m === 4 && d >= 2);
  return y + 6 + (after ? 1 : 0);
}

export function ageSchoolYearStart(base: Date): number {
  return base.getMonth() + 1 >= 4 ? base.getFullYear() : base.getFullYear() - 1;
}

export function ageGrade(y: number, m: number, d: number, base: Date): string {
  const gi = ageSchoolYearStart(base) - ageEntryApril(y, m, d);
  if (gi === -1) return "年長";
  if (gi === -2) return "年中";
  if (gi === -3) return "年少";
  if (gi < 0) return `未就園児（あと${-gi - 3}年で年少）`;
  if (gi <= 5) return `小学校 ${gi + 1}年生`;
  if (gi <= 8) return `中学校 ${gi - 5}年生`;
  if (gi <= 11) return `高校 ${gi - 8}年生`;
  if (gi <= 15) return `大学 ${gi - 11}年生`;
  return "社会人";
}

function ageMsg(m: number, d: number, age: number, days: number, grade: string): string {
  let s = `次の誕生日まで：あと${days}日で、${age + 1}歳だね。`;
  const early = m < 4 || (m === 4 && d === 1);
  if (early && /^(小学校|中学校|高校) /.test(grade)) {
    s += "学年のうえでは早生まれ（1〜3月と4月1日生まれ）。同じ学年の中では誕生日が遅いほうだよ。";
  }
  return s;
}

export type AgeResult =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      y: number;
      age: number;
      ymd: string;
      dow: string;
      eto: string;
      seiza: string;
      grade: string;
      nextStr: string;
      isBirthdayToday: boolean;
      msg: string;
      srText: string;
      copyText: string;
    };

/** yStr/mStr/dStr は生年月日フィールドの生の文字列（年は数字のみ、月日は "1"〜"31"）。 */
export function computeAge(yStr: string, mStr: string, dStr: string, base: Date): AgeResult {
  if (yStr.length < 4 || !mStr || !dStr) return { kind: "idle" };

  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);

  if (!(y >= 1900 && y <= base.getFullYear() + 1) || !ymdToDate(y, m, d)) {
    return { kind: "error", message: "西暦（1900年〜）で正しい生年月日を入力してください。" };
  }

  const birth = new Date(y, m - 1, d);
  birth.setHours(0, 0, 0, 0);
  if (birth.getTime() > base.getTime()) {
    return { kind: "error", message: "生年月日が基準日より後になっています。" };
  }

  const age = ageFull(y, m, d, base);
  const ymd = ageYmd(y, m, d, base);
  const dow = JP_DOW[birth.getDay()] + "曜日";
  const eto = ageEtoOf(y);
  const etoLabel = `${eto[0]}（${eto[1]}）`;
  const seiza = ageSeiza(m, d);
  const grade = ageGrade(y, m, d, base);
  const isBirthdayToday = base.getMonth() === m - 1 && base.getDate() === d;
  let nb = new Date(base.getFullYear(), m - 1, d);
  nb.setHours(0, 0, 0, 0);
  if (nb.getTime() <= base.getTime()) nb = new Date(base.getFullYear() + 1, m - 1, d);
  const days = Math.round((nb.getTime() - base.getTime()) / 86400000);
  const nextStr = isBirthdayToday ? "今日！" : `${jpDateDow(nb)}（あと${days}日）`;

  const msg = isBirthdayToday ? "今日が誕生日だね。おめでとう！" : ageMsg(m, d, age, days, grade);

  const srText =
    `${y}年${m}月${d}日生まれの満年齢は${age}歳（${ymd}）、学年は${grade}、生まれた曜日は${dow}です。` +
    (isBirthdayToday ? "今日が誕生日です。" : `次の誕生日は${nextStr}。`);

  const copyText = `${y}年${m}月${d}日生まれ → 満${age}歳（${grade}）`;

  return {
    kind: "success",
    y,
    age,
    ymd,
    dow,
    eto: etoLabel,
    seiza,
    grade,
    nextStr,
    isBirthdayToday,
    msg,
    srText,
    copyText,
  };
}

export interface AgeChartRow {
  y: number;
  wareki: string;
  age: number;
  eto: string;
}

/** 年齢早見表（基準日の年〜1930年）。 */
export function ageChartRows(baseY: number): AgeChartRow[] {
  const rows: AgeChartRow[] = [];
  for (let yy = baseY; yy >= 1930; yy--) {
    rows.push({ y: yy, wareki: ageWareki(yy), age: baseY - yy, eto: ageEtoOf(yy)[0] });
  }
  return rows;
}

export interface GradeChartRow {
  period: string;
  label: string;
}

const GRADE_LABELS = [
  "小学1年", "小学2年", "小学3年", "小学4年", "小学5年", "小学6年",
  "中学1年", "中学2年", "中学3年", "高校1年", "高校2年", "高校3年",
];

/** 学年早見表（基準年度）。表示は下（高3）→上（小1）の順（プロトタイプ準拠）。 */
export function gradeChartRows(base: Date): GradeChartRow[] {
  const sy = ageSchoolYearStart(base);
  const rows: GradeChartRow[] = [];
  for (let gi = 11; gi >= 0; gi--) {
    const ea = sy - gi;
    rows.push({
      period: `${ea - 7}年4月2日〜${ea - 6}年4月1日`,
      label: GRADE_LABELS[gi],
    });
  }
  return rows;
}

/** 学年早見表内でハイライトすべき行index（0-based、対象外なら-1）。 */
export function gradeChartHitIndex(y: number, m: number, d: number, base: Date): number {
  const gi = ageSchoolYearStart(base) - ageEntryApril(y, m, d);
  if (gi < 0 || gi > 11) return -1;
  return 11 - gi;
}
