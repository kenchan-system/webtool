// 税込・税抜計算ロジック。プロトタイプの renderTax() 等を純粋関数として移植。
export type TaxDir = "add" | "sub"; // add: 税抜→税込 / sub: 税込→税抜
export type TaxRateChoice = "10" | "8" | "custom";

export function taxFmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

export function taxRatePct(rateChoice: TaxRateChoice, customStr: string): number {
  if (rateChoice === "custom") {
    const v = parseFloat(customStr);
    return isFinite(v) ? v : NaN;
  }
  return rateChoice === "8" ? 8 : 10;
}

export type TaxResult =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      ex: number;
      tax: number;
      inc: number;
      rateLabel: string;
      ansK: string;
      ansV: number;
      msg: string;
      srText: string;
      copyText: string;
      isAdd: boolean;
    };

/** amountDigits はカンマ抜きの数字文字列（空文字ならidle）。 */
export function computeTax(
  amountDigits: string,
  dir: TaxDir,
  rateChoice: TaxRateChoice,
  customStr: string,
): TaxResult {
  if (amountDigits.trim() === "") return { kind: "idle" };

  const amtRaw = parseFloat(amountDigits);
  const pct = taxRatePct(rateChoice, customStr);

  if (!(amtRaw > 0)) {
    return { kind: "error", message: "金額には 0 より大きい数字を入力してください。" };
  }
  if (rateChoice === "custom" && !(pct >= 0 && pct <= 100)) {
    return { kind: "error", message: "税率は 0〜100 の範囲で入力してください。" };
  }
  if (amtRaw > 1e12) {
    return { kind: "error", message: "金額が大きすぎます。1兆円以内で入力してください。" };
  }

  const amt = Math.floor(amtRaw);
  // integer math: 1100 / 1.1 in floating point is 999.999… and would floor to
  // 999. work in scaled integers so 税込1,100円 → 税抜ちょうど1,000円になる。
  const pctX10 = Math.round(pct * 10); // 10% -> 100, 8% -> 80, 8.5% -> 85

  let ex: number, tax: number, inc: number;
  if (dir === "add") {
    ex = amt;
    tax = Math.floor((ex * pctX10) / 1000);
    inc = ex + tax;
  } else {
    inc = amt;
    ex = Math.floor((inc * 1000) / (1000 + pctX10));
    tax = inc - ex;
  }

  const rateLabel = pctX10 / 10 + "%";
  const ansK = dir === "add" ? "税込" : "税抜";
  const ansV = dir === "add" ? inc : ex;
  const reducedNote = pctX10 === 80 ? "8%は軽減税率だよ。" : "";

  const msg =
    (dir === "add"
      ? `税抜${taxFmt(ex)}円に消費税${rateLabel}で、税込${taxFmt(inc)}円だね。`
      : `税込${taxFmt(inc)}円の中身は、税抜${taxFmt(ex)}円＋消費税${taxFmt(tax)}円だよ。`) +
    reducedNote;

  const srText =
    dir === "add"
      ? `税抜${taxFmt(ex)}円に消費税${rateLabel}を加えると、税込は${taxFmt(inc)}円です。消費税額は${taxFmt(tax)}円です。`
      : `税込${taxFmt(inc)}円から消費税${rateLabel}を除くと、税抜は${taxFmt(ex)}円です。消費税額は${taxFmt(tax)}円です。`;

  const copyText = `${ansK} ${taxFmt(ansV)}円（税抜 ${taxFmt(ex)}円 ＋ 消費税 ${taxFmt(tax)}円）`;

  return { kind: "success", ex, tax, inc, rateLabel, ansK, ansV, msg, srText, copyText, isAdd: dir === "add" };
}

export const RATE_CHART_EX = [100, 300, 500, 800, 980, 1000, 1500, 2000, 2980, 3000, 5000, 8000, 10000];

/** 早見表で一番近い行のindex（対象外なら-1）。 */
export function nearestRateChartIndex(exVal: number): number {
  if (!isFinite(exVal) || exVal < 50 || exVal > 20000) return -1;
  let bi = 0;
  for (let i = 1; i < RATE_CHART_EX.length; i++) {
    if (Math.abs(RATE_CHART_EX[i] - exVal) < Math.abs(RATE_CHART_EX[bi] - exVal)) bi = i;
  }
  return bi;
}
