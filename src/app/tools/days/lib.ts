// 日数計算ロジック。プロトタイプの renderDys() 等を純粋関数として移植。
import { addCalendarDays, daysBetween, jpDate, jpDateDow, ymdDiff } from "@/lib/dateUtil";

export type DaysMode = "span" | "add";
export type DaysDir = "after" | "before";

export type DaysResult =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      mode: "span";
      excl: number;
      incl: number;
      period: string;
      approx: string | null;
      msg: string;
      srText: string;
      copyText: string;
    }
  | {
      kind: "success";
      mode: "add";
      resultStr: string;
      baseStr: string;
      midStr: string;
      msg: string;
      srText: string;
      copyText: string;
    };

/** 期間の日数モード。from/toの前後は問わず、差の絶対値で計算する。 */
export function computeDaysSpan(from: Date | null, to: Date | null): DaysResult {
  if (!from || !to) return { kind: "idle" };

  const lo = from.getTime() <= to.getTime() ? from : to;
  const hi = from.getTime() <= to.getTime() ? to : from;
  const excl = daysBetween(lo, hi);
  const incl = excl + 1;
  const ymd = ymdDiff(lo, hi);
  let approx: string | null = /^0年0か月/.test(ymd) ? null : ymd;
  if (approx && excl >= 7 && excl <= 62) {
    approx += `（約${Math.round(excl / 7)}週間）`;
  }

  const roughMonths = Math.round(excl / 30.44);
  const msg =
    excl === 0
      ? "同じ日だね。0日だよ。"
      : `${excl.toLocaleString("ja-JP")}日。` +
        (excl < 7
          ? "1週間かからないね。"
          : excl < 60
            ? `だいたい${Math.round(excl / 7)}週間ぶんだね。`
            : roughMonths <= 11
              ? `だいたい${roughMonths}か月ぶんだね。`
              : `だいたい${Math.round(excl / 365.25)}年ぶんだね。`);

  const period = `${jpDateDow(lo)} 〜 ${jpDateDow(hi)}`;
  const copyText = `${period} → ${excl.toLocaleString("ja-JP")}日（初日を含めると ${incl.toLocaleString("ja-JP")}日）`;
  const srText = `${jpDate(lo)}から${jpDate(hi)}までは${excl.toLocaleString("ja-JP")}日です（初日を含めると${incl.toLocaleString("ja-JP")}日）。`;

  return { kind: "success", mode: "span", excl, incl, period, approx, msg, srText, copyText };
}

/** ◯日後・◯日前モード。 */
export function computeDaysAdd(base: Date | null, nStr: string, dir: DaysDir): DaysResult {
  if (!base || nStr.trim() === "") return { kind: "idle" };

  let n = parseInt(nStr, 10);
  if (!isFinite(n)) return { kind: "idle" };
  if (n < 0) n = 0;
  if (n > 3650000) {
    return { kind: "error", message: "日数が大きすぎます。もう少し小さい値を入れてください。" };
  }

  const sign = dir === "before" ? -1 : 1;
  const res = addCalendarDays(base, sign * n);
  const dirWord = dir === "before" ? "前" : "後";

  const resultStr = jpDateDow(res);
  const baseStr = jpDateDow(base);
  const midStr = `${n.toLocaleString("ja-JP")}日${dirWord}`;
  const msg = `${midStr}は ${resultStr}${dir === "before" ? "だよ。" : "だね。"}`;
  const copyText = `${baseStr} の ${midStr} → ${resultStr}`;
  const srText = `${jpDate(base)}の${midStr}は${resultStr}です。`;

  return { kind: "success", mode: "add", resultStr, baseStr, midStr, msg, srText, copyText };
}
