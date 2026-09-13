// BMI計算ロジック。プロトタイプ（kenchan-front.html）の render()/bmiSay() 等を
// 純粋関数として移植したもの（DOM操作を含まない）。
import type { KenchanMood } from "@/components/KenchanAvatar";

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** gauge maps BMI 14..40 onto 0..100%; values outside clamp to the ends */
export function gaugePct(bmi: number): number {
  const lo = 14;
  const hi = 40;
  const b = Math.max(lo, Math.min(hi, bmi));
  return ((b - lo) / (hi - lo)) * 100;
}

export function bmiSay(bmi: number): string {
  if (bmi < 16) return "かなりやせ型の範囲です。体調がすぐれないときは、無理せず医療機関にご相談を。";
  if (bmi < 18.5) return "少しやせ気味です。3食しっかり、たんぱく質も意識してみましょう。";
  if (bmi < 25) return "標準の範囲です。いまのペースを大切に、この調子でいきましょう。";
  if (bmi < 30) return "標準より少し多めです。まずは腹八分目と軽い運動から始めてみましょう。";
  return "肥満度は高めです。減量は自己流より、医療機関や管理栄養士に相談すると安全なペースで進められます。";
}

export type BmiZone = "low" | "normal" | "over1" | "over2";

export type BmiResult =
  | { kind: "idle"; need: "both" | "h" | "w" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      bmi: number;
      cat: string;
      zone: BmiZone;
      mood: KenchanMood;
      msg: string;
      ideal: number;
      diff: number;
    };

export function computeBmi(hStr: string, wStr: string): BmiResult {
  const hTrim = hStr.trim();
  const wTrim = wStr.trim();
  if (hTrim === "" && wTrim === "") return { kind: "idle", need: "both" };
  if (hTrim === "") return { kind: "idle", need: "h" };
  if (wTrim === "") return { kind: "idle", need: "w" };

  const h = parseFloat(hTrim);
  const w = parseFloat(wTrim);
  if (!(h > 0) || !(w > 0)) {
    return { kind: "error", message: "身長と体重には 0 より大きい値を入力してください。" };
  }
  if (h < 100 || h > 250) {
    return { kind: "error", message: "身長は 100〜250cm の範囲で入力してください。" };
  }
  if (w < 20 || w > 300) {
    return { kind: "error", message: "体重は 20〜300kg の範囲で入力してください。" };
  }

  const m = h / 100;
  const bmi = w / (m * m);
  const ideal = 22 * m * m;
  const diff = round1(w - round1(ideal));

  let cat: string;
  let zone: BmiZone;
  if (bmi < 18.5) {
    cat = "低体重（やせ）";
    zone = "low";
  } else if (bmi < 25) {
    cat = "普通体重";
    zone = "normal";
  } else if (bmi < 30) {
    cat = "肥満（1度）";
    zone = "over1";
  } else if (bmi < 35) {
    cat = "肥満（2度）";
    zone = "over2";
  } else if (bmi < 40) {
    cat = "肥満（3度）";
    zone = "over2";
  } else {
    cat = "肥満（4度）";
    zone = "over2";
  }
  const mood: KenchanMood = zone === "normal" ? "happy" : "think";

  return { kind: "success", bmi, cat, zone, mood, msg: bmiSay(bmi), ideal, diff };
}
