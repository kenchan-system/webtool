// 「システムのケンちゃん」のカテゴリ・ツールのカタログ。
// プロトタイプ（scratchpadのkenchan-front.html）のCATEGORIES/TOOLS配列を
// そのまま移植したもの。ここでの status:"live" は「このNext.jsアプリに
// 実際のページが存在する」ことを意味する（プロトタイプでの完成度とは別）。
// 段階的に移植していく方針のため、移植したツールから順に "live" にする。

export type CategorySlug = "calc" | "date" | "time" | "text" | "image" | "misc";
export type ToolStatus = "live" | "soon";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  intro: string;
}

export interface Tool {
  slug: string;
  name: string;
  cat: CategorySlug;
  status: ToolStatus;
  /** 公開順（新着ツール表示のソート用）。配列内の位置に依存しないための数値。 */
  live?: number;
  tagline: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "calc",
    name: "計算",
    tagline: "毎日のこまかい計算をサッと。",
    intro:
      "「計算」カテゴリには、税込・税抜の変換、割引後の値段、BMIなど、電卓だと少し面倒な金額や割合の計算をまとめています。",
  },
  {
    slug: "date",
    name: "日付",
    tagline: "日付・期間・こよみの計算。",
    intro:
      "「日付」カテゴリには、満年齢や学年、2つの日付の間の日数、和暦と西暦の変換など、指を折って数えると間違えやすい日付の計算をまとめています。",
  },
  {
    slug: "time",
    name: "時間",
    tagline: "時間をはかる・時刻を見る。",
    intro:
      "「時間」カテゴリには、カウントダウンのタイマー、ストップウォッチ、見やすいデジタル時計、世界時計など、時間をはかる・時刻を確認する道具をまとめています。",
  },
  {
    slug: "text",
    name: "文字",
    tagline: "文章の文字数や、表記の変換。",
    intro:
      "「文字」カテゴリには、文字数カウント、余分な改行・空白の削除、全角・半角の変換、英単語数カウントなど、文章の集計と表記の変換ツールをまとめています。",
  },
  {
    slug: "image",
    name: "画像",
    tagline: "画像のサイズ・形式をととのえる。",
    intro:
      "「画像」カテゴリには、幅・高さのリサイズ、ファイルサイズの圧縮、JPGとPNGの変換、切り出しなど、画像のサイズや形式をととのえる道具をまとめています。",
  },
  {
    slug: "misc",
    name: "便利",
    tagline: "ちょっとした作業を助ける道具。",
    intro:
      "「便利」カテゴリには、QRコード作成、パスワード生成、マイクからの録音、メモなど、ちょっとした作業を助ける道具をまとめています。",
  },
];

export const TOOLS: Tool[] = [
  // ---- 計算 ----
  { slug: "bmi", name: "BMI計算", cat: "calc", status: "live", live: 1, tagline: "身長と体重から、BMIと適正体重を計算します。" },
  { slug: "tax", name: "税込・税抜計算", cat: "calc", status: "live", live: 2, tagline: "税抜から税込を、税込から税抜をすばやく計算します。" },
  { slug: "discount", name: "割引計算", cat: "calc", status: "live", live: 3, tagline: "定価と割引率から、割引後の価格と割引額を出します。" },

  // ---- 日付 ----
  { slug: "age", name: "年齢・学年計算", cat: "date", status: "live", live: 4, tagline: "生年月日から、満年齢といまの学年を調べます。" },
  { slug: "days", name: "日数計算", cat: "date", status: "live", live: 5, tagline: "2つの日付の間の日数や、◯日後の日付を計算します。" },
  { slug: "wareki", name: "和暦・西暦変換", cat: "date", status: "live", live: 6, tagline: "令和・平成・昭和と西暦を相互に変換します。" },
  { slug: "calendar", name: "カレンダー", cat: "date", status: "live", live: 7, tagline: "祝日つきの月間・年間カレンダーを表示・印刷できます。" },

  // ---- 時間 ----
  { slug: "timer", name: "タイマー", cat: "time", status: "live", live: 8, tagline: "指定した時間でお知らせするカウントダウンタイマー。" },
  { slug: "stopwatch", name: "ストップウォッチ", cat: "time", status: "live", live: 9, tagline: "経過時間を計測します。ラップ（区間）計測にも対応。" },
  { slug: "clock", name: "デジタル時計", cat: "time", status: "live", live: 10, tagline: "大きな数字で現在時刻を表示します。" },
  { slug: "analog-clock", name: "アナログ時計", cat: "time", status: "live", live: 11, tagline: "針が動くアナログ時計を、大きな文字盤で表示します。" },
  { slug: "world-clock", name: "世界時計", cat: "time", status: "live", live: 12, tagline: "主要都市の現在時刻をまとめて表示します。" },

  // ---- 文字 ----
  { slug: "char-count", name: "文字数カウント", cat: "text", status: "soon", tagline: "文章の文字数・行数を数えます。空白ありなしも切替。" },
  { slug: "trim", name: "改行・空白削除", cat: "text", status: "soon", tagline: "貼り付けた文章から、余分な改行・空白をまとめて削除。" },
  { slug: "zenhan", name: "全角・半角変換", cat: "text", status: "soon", tagline: "英数字・記号・カタカナを全角⇔半角で変換します。" },
  { slug: "word-count", name: "英単語数カウント", cat: "text", status: "soon", tagline: "英文の単語数をカウントします。" },

  // ---- 画像 ----
  { slug: "img-resize", name: "画像リサイズ", cat: "image", status: "soon", tagline: "画像の幅・高さを指定してリサイズします。" },
  { slug: "img-compress", name: "画像圧縮", cat: "image", status: "soon", tagline: "画質を保ちながら画像のファイルサイズを小さくします。" },
  { slug: "img-convert", name: "JPG・PNG変換", cat: "image", status: "soon", tagline: "JPGとPNGを相互に変換します。" },
  { slug: "img-crop", name: "画像トリミング", cat: "image", status: "soon", tagline: "画像の必要な部分だけを切り出します。" },

  // ---- 便利 ----
  { slug: "qr", name: "QRコード生成", cat: "misc", status: "soon", tagline: "テキストやURLからQRコードを作成します。" },
  { slug: "password", name: "パスワード生成", cat: "misc", status: "soon", tagline: "条件を指定して安全なパスワードを生成します。" },
  { slug: "voice-recorder", name: "ボイスレコーダー", cat: "misc", status: "soon", tagline: "マイクからの音声をその場で録音します。" },
  { slug: "memo", name: "メモ", cat: "misc", status: "soon", tagline: "ちょっとしたメモをブラウザに残しておけます。" },
];

export const CAT_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

export function toolsIn(catSlug: string): Tool[] {
  return TOOLS.filter((t) => t.cat === catSlug);
}

export function findTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

/** カテゴリに稼働中（＝実ページがある）ツールが1つでもあるか。
 *  ナビゲーション・トップページ・サイトマップの出し分けに使う。 */
export function catHasLiveTools(catSlug: string): boolean {
  return TOOLS.some((t) => t.cat === catSlug && t.status === "live");
}

export const CATEGORIES_PUBLISHED: Category[] = CATEGORIES.filter((c) =>
  catHasLiveTools(c.slug),
);

const QUICK_TOOLS_COUNT = 3;

/** トップページの「新着ツール」。live番号（公開順）の降順で新しい順。 */
export function newestTools(count: number = QUICK_TOOLS_COUNT): Tool[] {
  return TOOLS.filter((t) => t.status === "live")
    .sort((a, b) => (b.live ?? 0) - (a.live ?? 0))
    .slice(0, count);
}
