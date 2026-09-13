// 六曜（先勝・友引・先負・仏滅・大安・赤口）。lunar-javascriptの旧暦変換＋
// getLiuYao()を利用する（六曜の並びの判定式が、このライブラリの実装と
// 伝統的な算出式「（月＋日）mod 6」で一致することをプロトタイプ段階で確認済み）。
// getLiuYao()は簡体字で返るため、日本の表記（新字体）に変換する。
import { Lunar } from "lunar-javascript";

const CAL_LIUYAO_JA: Record<string, string> = {
  "先胜": "先勝",
  "友引": "友引",
  "先负": "先負",
  "佛灭": "仏滅",
  "大安": "大安",
  "赤口": "赤口",
};

/** 六曜（対応範囲外や変換失敗時はnull）。 */
export function calLiuYao(y: number, m: number, d: number): string | null {
  if (y < 1900 || y > 2100) return null;
  try {
    const lunar = Lunar.fromDate(new Date(y, m - 1, d));
    return CAL_LIUYAO_JA[lunar.getLiuYao()] ?? null;
  } catch {
    return null;
  }
}
