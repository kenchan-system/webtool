// 割引計算ロジック。プロトタイプの renderDisc() 等を純粋関数として移植。
export type DiscRateChoice = "10" | "20" | "30" | "50" | "custom";

export function discFmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

export function discRatePct(rateChoice: DiscRateChoice, customStr: string): number {
  if (rateChoice === "custom") {
    return customStr.trim() === "" ? NaN : parseFloat(customStr);
  }
  return Number(rateChoice);
}

export function discRateLabel(pct: number): string {
  const r = Math.round(pct * 10) / 10;
  return (r === Math.floor(r) ? String(r) : r.toFixed(1)) + "%";
}

export type DiscResult =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      list: number;
      disc: number;
      final: number;
      pctLabel: string;
      msg: string;
      srText: string;
      copyText: string;
    };

/** listDigits はカンマ抜きの数字文字列（空文字ならidle）。 */
export function computeDiscount(
  listDigits: string,
  rateChoice: DiscRateChoice,
  customStr: string,
): DiscResult {
  if (listDigits.trim() === "") return { kind: "idle" };

  const listRaw = parseFloat(listDigits);
  if (!(listRaw > 0)) {
    return { kind: "error", message: "定価には 0 より大きい数字を入力してください。" };
  }
  if (listRaw > 1e12) {
    return { kind: "error", message: "金額が大きすぎます。1兆円以内で入力してください。" };
  }

  const pct = discRatePct(rateChoice, customStr);
  if (!(pct >= 0 && pct <= 100)) {
    return { kind: "error", message: "割引率は 0〜100 の範囲で入力してください。" };
  }

  const listI = Math.floor(listRaw);
  const disc = Math.floor((listI * pct) / 100);
  const final = listI - disc;
  const pctLabel = discRateLabel(pct);

  const msg =
    `定価${discFmt(listI)}円の${pct === 50 ? "半額" : pctLabel + "OFF"}。` +
    `${discFmt(disc)}円引きで、${discFmt(final)}円になるね。`;

  const srText =
    `定価${discFmt(listI)}円の${pctLabel}引きは、割引後価格が${discFmt(final)}円です。` +
    `割引額は${discFmt(disc)}円です。`;

  const copyText = `定価 ${discFmt(listI)}円 → ${pctLabel}引きで 割引後 ${discFmt(final)}円（割引額 ${discFmt(disc)}円）`;

  return { kind: "success", list: listI, disc, final, pctLabel, msg, srText, copyText };
}

export const DISC_CHART_LIST = [500, 800, 1000, 1500, 1980, 3000, 5000, 8000, 10000];

/** 早見表で一番近い行のindex（対象外なら-1）。 */
export function nearestDiscChartIndex(listVal: number): number {
  if (!isFinite(listVal) || listVal < 200 || listVal > 20000) return -1;
  let bi = 0;
  for (let i = 1; i < DISC_CHART_LIST.length; i++) {
    if (Math.abs(DISC_CHART_LIST[i] - listVal) < Math.abs(DISC_CHART_LIST[bi] - listVal)) bi = i;
  }
  return bi;
}
