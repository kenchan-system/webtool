// 和暦・西暦変換ロジック。プロトタイプの renderWk() 等を純粋関数として移植。

export type WkDir = "w2s" | "s2w";
export type EraKey = "meiji" | "taisho" | "showa" | "heisei" | "reiwa";

interface Era {
  key: EraKey;
  name: string;
  start: number;
  len: number | null;
  startText: string;
}

export const WK_ERAS: Era[] = [
  { key: "meiji", name: "明治", start: 1868, len: 45, startText: "1868年" },
  { key: "taisho", name: "大正", start: 1912, len: 15, startText: "1912年7月" },
  { key: "showa", name: "昭和", start: 1926, len: 64, startText: "1926年12月" },
  { key: "heisei", name: "平成", start: 1989, len: 31, startText: "1989年1月" },
  { key: "reiwa", name: "令和", start: 2019, len: null, startText: "2019年5月" },
];

interface Transition {
  old: string;
  neu: string;
  oldEnd: string;
  neuStart: string;
  splitM: number;
  oldMaxM: number;
}

// 改元年ごと（新元号キー）：旧元号最終年名・新元号元年名・境界日・またぐ月・旧の最終“完全月”
const WK_TR: Record<string, Transition> = {
  taisho: { old: "明治45年", neu: "大正元年", oldEnd: "7月29日", neuStart: "7月30日", splitM: 7, oldMaxM: 6 },
  showa: { old: "大正15年", neu: "昭和元年", oldEnd: "12月24日", neuStart: "12月25日", splitM: 12, oldMaxM: 11 },
  heisei: { old: "昭和64年", neu: "平成元年", oldEnd: "1月7日", neuStart: "1月8日", splitM: 1, oldMaxM: 0 },
  reiwa: { old: "平成31年", neu: "令和元年", oldEnd: "4月30日", neuStart: "5月1日", splitM: 0, oldMaxM: 4 },
};
const WK_NEXT: Record<string, EraKey> = { meiji: "taisho", taisho: "showa", showa: "heisei", heisei: "reiwa" };
const WK_MAXY = 2200;

const WK_ABBR: Record<string, EraKey> = {
  m: "meiji", t: "taisho", s: "showa", h: "heisei", r: "reiwa",
  "明": "meiji", "大": "taisho", "昭": "showa", "平": "heisei", "令": "reiwa",
};
const WK_NAME2KEY: Record<string, EraKey> = {
  "明治": "meiji", "大正": "taisho", "昭和": "showa", "平成": "heisei", "令和": "reiwa",
};

/** 全角英数字・全角記号を半角に変換する（和暦の略号入力向け）。 */
export function wkNormalize(str: string): string {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９．／　]/g, (ch) => {
    if (ch === "　") return " ";
    if (ch === "．") return ".";
    if (ch === "／") return "/";
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
  });
}

/** 和暦の入力欄で許容する文字だけに絞り込む（略号・区切り・「元年」を含む）。 */
export function wkSanitizeS2WInput(raw: string): string {
  return wkNormalize(raw).replace(/[^0-9MTSHRmtshr明大昭平令治正和成元年月日.\/\- ]/g, "");
}

export interface ParsedS2W {
  eraKey: EraKey | null;
  y: number | null;
  m: number | null;
  d: number | null;
}

/** 生テキストを {eraKey, y, m, d} に解釈（略号 S/H/R・区切り . / - 年月日・「元年」に対応）。 */
export function wkParseS2W(rawInput: string): ParsedS2W {
  let raw = wkNormalize(rawInput).trim();
  let eraKey: EraKey | null = null;
  const mm = raw.match(/^(明治|大正|昭和|平成|令和|[MTSHRmtshr]|[明大昭平令])/);
  if (mm) {
    const tok = mm[1];
    eraKey = tok.length >= 2 ? (WK_NAME2KEY[tok] ?? null) : (WK_ABBR[tok.toLowerCase()] ?? WK_ABBR[tok] ?? null);
    raw = raw.slice(mm[0].length);
  }
  raw = raw.replace(/元年?/, "1");
  const nums = raw.match(/\d+/g) || [];
  return {
    eraKey,
    y: nums[0] != null ? parseInt(nums[0], 10) : null,
    m: nums[1] != null ? parseInt(nums[1], 10) : null,
    d: nums[2] != null ? parseInt(nums[2], 10) : null,
  };
}

export function wkEraByKey(k: string): Era | null {
  return WK_ERAS.find((e) => e.key === k) ?? null;
}
function wkEraForYear(Y: number): Era {
  for (let i = WK_ERAS.length - 1; i >= 0; i--) if (Y >= WK_ERAS[i].start) return WK_ERAS[i];
  return WK_ERAS[0];
}
function wkTransitionEra(Y: number): Era | null {
  for (let i = 1; i < WK_ERAS.length; i++) if (WK_ERAS[i].start === Y) return WK_ERAS[i];
  return null;
}
function wkYearName(era: Era, wy: number): string {
  return era.name + (wy === 1 ? "元" : String(wy)) + "年";
}
function wkMD(mi: number, di: number): string {
  return (mi ? mi + "月" : "") + (mi && di ? di + "日" : "");
}
function wkFull(era: Era, Y: number, mi: number, di: number): string {
  return wkYearName(era, Y - era.start + 1) + wkMD(mi, di);
}
function wkDayValid(y: number, m: number, d: number): boolean {
  if (!(m >= 1 && m <= 12 && d >= 1 && d <= 31)) return false;
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const dim = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return d <= dim[m - 1];
}
// 月日つき（改元年）に、その日付が新元号側なら true
function wkOnOrAfterTransition(eraKey: string, m: number, d: number): boolean {
  const b: Record<string, [number, number]> = { taisho: [7, 30], showa: [12, 25], heisei: [1, 8], reiwa: [5, 1] };
  const bb = b[eraKey];
  return m > bb[0] || (m === bb[0] && d >= bb[1]);
}

export type WarekiResult =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      ak: string;
      av: string;
      note: string;
      seireki: string;
      wareki: string;
      rowHighlight: "wareki" | "seireki";
      msg: string;
      srText: string;
      copyText: string;
      chartYear: number;
    };

/** 西暦 → 和暦。yDigits はカンマ抜きの数字文字列（3桁未満はidle）。 */
export function computeW2S(yDigits: string, mStr: string, dStr: string): WarekiResult {
  if (yDigits.length < 3) return { kind: "idle" };
  const Y = parseInt(yDigits, 10);
  if (Y < 1868) {
    return { kind: "error", message: "明治より前の元号には対応していません。西暦1868年以降で入力してください。" };
  }
  if (Y > WK_MAXY) {
    return { kind: "error", message: `西暦${WK_MAXY}年までで入力してください。` };
  }
  const mi = mStr === "" ? 0 : parseInt(mStr, 10);
  const di = mi && dStr ? parseInt(dStr, 10) : 0;
  if (di && !wkDayValid(Y, mi, di)) {
    return { kind: "error", message: `${mi}月に${di}日はありません。日付を確認してください。` };
  }

  const seireki = `${Y}年${wkMD(mi, di)}`;
  const trEra = wkTransitionEra(Y);
  let big: string;
  let note: string;
  let primaryEra: Era;

  if (trEra && di) {
    primaryEra = wkOnOrAfterTransition(trEra.key, mi, di) ? trEra : WK_ERAS[WK_ERAS.indexOf(trEra) - 1];
    big = wkFull(primaryEra, Y, mi, di);
    note = "";
  } else if (trEra) {
    const tr = WK_TR[trEra.key];
    primaryEra = trEra;
    if (mi === 0) {
      big = `${tr.old}／${tr.neu}`;
      note = `（${tr.old}は${tr.oldEnd}まで、${tr.neu}は${tr.neuStart}から）`;
    } else if (tr.splitM && mi === tr.splitM) {
      big = `${tr.old}／${tr.neu}`;
      note = `（${mi}月は${tr.oldEnd}まで${tr.old}、${tr.neuStart}から${tr.neu}。日まで入れると確定します）`;
    } else if (mi <= tr.oldMaxM) {
      primaryEra = WK_ERAS[WK_ERAS.indexOf(trEra) - 1];
      big = wkFull(primaryEra, Y, mi, 0);
      note = "";
    } else {
      big = wkFull(trEra, Y, mi, 0);
      note = "";
    }
  } else {
    primaryEra = wkEraForYear(Y);
    big = wkFull(primaryEra, Y, mi, di);
    note = "";
  }

  const dualDisplay = !!trEra && !di && (mi === 0 || mi === WK_TR[trEra.key].splitM);

  const msg = dualDisplay
    ? `${Y}年は${WK_TR[trEra!.key].old}と${WK_TR[trEra!.key].neu}にまたがる年。${WK_TR[trEra!.key].neuStart}から${trEra!.name}だよ。`
    : di
      ? `${seireki}は${big}。書類にはこの形で書けばOK。`
      : `${seireki}は${big}。${primaryEra.name}のはじまりは${primaryEra.startText}だよ。`;

  return {
    kind: "success",
    ak: "和暦",
    av: big,
    note,
    seireki,
    wareki: big,
    rowHighlight: "wareki",
    msg,
    srText: `西暦${seireki}は${big}です。`,
    copyText: `${seireki} → ${big}`,
    chartYear: Y,
  };
}

/** 和暦 → 西暦。rawN は入力欄の生テキスト（略号・元年対応）。 */
export function computeS2W(rawN: string, eraSelect: EraKey, mStr: string, dStr: string): WarekiResult {
  const ps = wkParseS2W(rawN);
  const k = ps.eraKey ?? eraSelect;
  const era2 = wkEraByKey(k);
  if (!era2) return { kind: "idle" };
  const N = ps.y;
  if (!(N != null && N >= 1)) return { kind: "idle" };
  if (era2.len && N > era2.len) {
    return { kind: "error", message: `${era2.name}は${era2.len}年（${era2.start + era2.len - 1}年）までです。` };
  }
  const Y2 = era2.start + N - 1;
  if (Y2 > WK_MAXY) {
    return { kind: "error", message: `西暦${WK_MAXY}年を超えます。年を小さくしてください。` };
  }
  const mi2 = mStr === "" ? 0 : parseInt(mStr, 10);
  const di2 = mi2 && dStr ? parseInt(dStr, 10) : 0;
  if (di2 && !wkDayValid(Y2, mi2, di2)) {
    return { kind: "error", message: `${mi2}月に${di2}日はありません。日付を確認してください。` };
  }
  if (di2 && N === 1 && k !== "meiji" && !wkOnOrAfterTransition(k, mi2, di2)) {
    const transition = WK_TR[k];
    return { kind: "error", message: `${transition.neu}は${transition.neuStart}からです。日付を確認してください。` };
  }
  if (di2 && era2.len && N === era2.len) {
    const nextKey = WK_NEXT[k];
    if (nextKey && wkOnOrAfterTransition(nextKey, mi2, di2)) {
      const transition = WK_TR[nextKey];
      return { kind: "error", message: `${transition.old}は${transition.oldEnd}までです。日付を確認してください。` };
    }
  }

  const md2 = wkMD(mi2, di2);
  const waName = wkYearName(era2, N) + md2;
  const seireki2 = `${Y2}年${md2}`;
  let note2 = "";
  if (N === 1 && k !== "meiji") {
    const t1 = WK_TR[k];
    note2 = `（${t1.neu}は${t1.neuStart}から。${t1.oldEnd}までは${t1.old}＝同じ${Y2}年）`;
  } else if (era2.len && N === era2.len) {
    const t2 = WK_TR[WK_NEXT[k]];
    note2 = `（${t2.old}は${t2.oldEnd}まで。${t2.neuStart}から${t2.neu}＝同じ${Y2}年）`;
  }

  const msg = di2
    ? `${waName}は西暦${seireki2}だね。`
    : `${waName}は西暦${seireki2}。${
        era2.len
          ? `${era2.name}は${era2.start}〜${era2.start + era2.len - 1}年の${era2.len}年間だよ。`
          : `${era2.name}は${era2.start}年から続いているよ。`
      }`;

  return {
    kind: "success",
    ak: "西暦",
    av: seireki2,
    note: note2,
    seireki: seireki2,
    wareki: waName,
    rowHighlight: "seireki",
    msg,
    srText: `${waName}は西暦${seireki2}です。`,
    copyText: `${waName} → ${seireki2}`,
    chartYear: Y2,
  };
}

export interface WkChartRow {
  y: number;
  wareki: string;
  age: number;
}

/** 和暦早見表（今年〜1868年）。 */
export function warekiChartRows(nowY: number): WkChartRow[] {
  const rows: WkChartRow[] = [];
  for (let Y = nowY; Y >= 1868; Y--) {
    const trEra = wkTransitionEra(Y);
    let wa: string;
    if (trEra) {
      wa = `${WK_TR[trEra.key].old}／${WK_TR[trEra.key].neu}`;
    } else {
      const era = wkEraForYear(Y);
      wa = wkYearName(era, Y - era.start + 1);
    }
    rows.push({ y: Y, wareki: wa, age: nowY - Y });
  }
  return rows;
}
