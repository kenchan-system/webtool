// 世界時計の都市カタログ。coordは[緯度, 経度]で、地図上に都市をプロットする
// 用途のみに使う（時刻・時差の計算はすべてIntl.DateTimeFormatのtimeZoneで
// 行っており、この座標データには一切依存しない）。

export type Region = "asia" | "eu" | "us";

export interface City {
  tz: string;
  name: string;
  region: Region;
  coord: [number, number];
}

export const WC_CITIES: City[] = [
  { tz: "Asia/Tokyo", name: "東京", region: "asia", coord: [35.68, 139.69] },
  { tz: "Asia/Seoul", name: "ソウル", region: "asia", coord: [37.57, 126.98] },
  { tz: "Asia/Shanghai", name: "北京", region: "asia", coord: [39.9, 116.41] },
  { tz: "Asia/Hong_Kong", name: "香港", region: "asia", coord: [22.32, 114.17] },
  { tz: "Asia/Taipei", name: "台北", region: "asia", coord: [25.03, 121.57] },
  { tz: "Asia/Singapore", name: "シンガポール", region: "asia", coord: [1.35, 103.82] },
  { tz: "Asia/Bangkok", name: "バンコク", region: "asia", coord: [13.76, 100.5] },
  { tz: "Asia/Jakarta", name: "ジャカルタ", region: "asia", coord: [-6.21, 106.85] },
  { tz: "Asia/Kolkata", name: "ニューデリー", region: "asia", coord: [28.61, 77.21] },
  { tz: "Asia/Tehran", name: "テヘラン", region: "asia", coord: [35.69, 51.39] },
  { tz: "Asia/Dubai", name: "ドバイ", region: "asia", coord: [25.2, 55.27] },
  { tz: "Australia/Sydney", name: "シドニー", region: "asia", coord: [-33.87, 151.21] },
  { tz: "Pacific/Auckland", name: "オークランド", region: "asia", coord: [-36.85, 174.76] },
  { tz: "Europe/Istanbul", name: "イスタンブール", region: "eu", coord: [41.01, 28.98] },
  { tz: "Europe/London", name: "ロンドン", region: "eu", coord: [51.51, -0.13] },
  { tz: "Europe/Paris", name: "パリ", region: "eu", coord: [48.86, 2.35] },
  { tz: "Europe/Berlin", name: "ベルリン", region: "eu", coord: [52.52, 13.4] },
  { tz: "Europe/Rome", name: "ローマ", region: "eu", coord: [41.9, 12.5] },
  { tz: "Europe/Moscow", name: "モスクワ", region: "eu", coord: [55.76, 37.62] },
  { tz: "Africa/Cairo", name: "カイロ", region: "eu", coord: [30.04, 31.24] },
  { tz: "Africa/Johannesburg", name: "ヨハネスブルグ", region: "eu", coord: [-26.2, 28.05] },
  { tz: "America/New_York", name: "ニューヨーク", region: "us", coord: [40.71, -74.01] },
  { tz: "America/Toronto", name: "トロント", region: "us", coord: [43.65, -79.38] },
  { tz: "America/Chicago", name: "シカゴ", region: "us", coord: [41.88, -87.63] },
  { tz: "America/Denver", name: "デンバー", region: "us", coord: [39.74, -104.99] },
  { tz: "America/Los_Angeles", name: "ロサンゼルス", region: "us", coord: [34.05, -118.24] },
  { tz: "America/Anchorage", name: "アンカレジ", region: "us", coord: [61.22, -149.9] },
  { tz: "Pacific/Honolulu", name: "ホノルル", region: "us", coord: [21.31, -157.86] },
  { tz: "America/Mexico_City", name: "メキシコシティ", region: "us", coord: [19.43, -99.13] },
  { tz: "America/Sao_Paulo", name: "サンパウロ", region: "us", coord: [-23.55, -46.63] },
  { tz: "America/Argentina/Buenos_Aires", name: "ブエノスアイレス", region: "us", coord: [-34.6, -58.38] },
];

export const WC_REGION_LABEL: Record<Region, string> = {
  asia: "アジア・オセアニア",
  eu: "ヨーロッパ・アフリカ",
  us: "南北アメリカ",
};
export const WC_REGION_ORDER: Region[] = ["asia", "eu", "us"];

// デフォルト4都市：時差が重複せず、日付バッジの「前日」「翌日」両方が見える組み合わせ。
export const WC_DEFAULT_TZS = ["America/New_York", "Europe/London", "Asia/Dubai", "Australia/Sydney"];

export function wcNameFor(tz: string): string | null {
  return WC_CITIES.find((c) => c.tz === tz)?.name ?? null;
}
export function wcCoordFor(tz: string): [number, number] | null {
  return WC_CITIES.find((c) => c.tz === tz)?.coord ?? null;
}
