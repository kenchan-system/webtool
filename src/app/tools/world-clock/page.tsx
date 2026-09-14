import Link from "next/link";
import type { Metadata } from "next";
import { WorldClockApp } from "./WorldClockApp";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "世界時計｜主要都市の現在時刻を一覧表示",
  description:
    "ニューヨーク・ロンドン・シドニーなど主要都市の現在時刻を一覧表示。現在地を自動判定し、日付が違う都市には前日・翌日バッジ表示。都市の追加・大画面表示に対応。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("世界時計")}&tagline=${encodeURIComponent("主要都市の現在時刻をまとめて表示します。")}`],
  },
};

const FAQ = [
  {
    q: "現在地の判定が間違っています。",
    a: "お使いの端末（パソコン・スマホ）のタイムゾーン設定をご確認ください。この判定は端末の設定をそのまま読み取っています。",
  },
  {
    q: "サマータイム（夏時間）にも対応していますか？",
    a: "対応しています。各都市の時刻はブラウザ内蔵のタイムゾーンデータをもとに計算しているため、サマータイムの切り替えも自動的に反映されます。",
  },
  {
    q: "表示する都市を増やしたり減らしたりできますか？",
    a: "「都市を選ぶ」から、地域別の一覧にチェックを入れて自由に変更できます。設定は次回も記憶されます。",
  },
  {
    q: "日付が違う都市はどうやってわかりますか？",
    a: "現在地と日付が異なる都市には「前日」「翌日」のバッジが表示されます。",
  },
];

export default function WorldClockPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/time">時間</Link>
        <span aria-hidden="true">›</span>
        <span>世界時計</span>
      </nav>

      <div className="tool-head">
        <h1>世界時計</h1>
        <p className="lede">主要都市の現在時刻を一覧で表示します。日付が違う都市もひと目でわかります。</p>
      </div>

      <WorldClockApp />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            ニューヨーク・ロンドン・シドニーなど、主要都市の現在時刻を一覧で表示します。一番上にはお使いの端末の設定から自動で判定した現在地の時刻を固定表示し、他の都市と見比べやすくしています。
            日付が現在地と違う都市には「前日」「翌日」のバッジがつくので、「向こうは今日？明日？」がひと目でわかります。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>ページを開くと、現在地（自動判定）とよく使われる主要4都市の時刻が自動的に表示されます。</li>
            <li>「都市を選ぶ」を開くと、地域別に約30都市からチェックで表示・非表示を切り替えられます。選んだ都市は次回も覚えています。</li>
            <li>時刻はUTC（協定世界時）からの時差つきで表示され、サマータイム（夏時間）の期間も自動で正しく反映されます。</li>
          </ol>

          <h2>大画面表示について</h2>
          <p>
            右上の「大画面」ボタンを押すと、設定を隠し、都市の一覧だけを画面いっぱいに大きく表示します。
            海外拠点とのオンライン会議の前に確認する、複数拠点のオフィスのモニターに映しておく、といった使い方を想定しています。
            閉じるには右上の「✕」か、キーボードの<kbd>Esc</kbd>キーを押してください。
          </p>

          <h2>正確さについて</h2>
          <p>
            各都市の時刻は、お使いのブラウザに内蔵されたタイムゾーン情報（IANA タイムゾーンデータベース）をもとに計算しています。サマータイムの開始・終了日も地域ごとに自動的に反映されるため、手動での時差計算のような間違いが起きません。
            現在地の判定は、端末のタイムゾーン設定を読み取っているだけで、位置情報（GPS）などは一切使用していません。
          </p>

          <h2>注意点</h2>
          <ul>
            <li>このページを離れると更新は止まります。次に開いたときは、そのときの正しい時刻が表示されます。</li>
            <li>都市の一覧は主要な約30都市に絞っています。表示したい都市が見つからない場合は、近い時差の都市で代用してください。</li>
            <li>秒単位の表示はありません（都市間の比較が目的のため、分単位で表示しています）。</li>
          </ul>

          <h2>よくある質問</h2>
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="q">Q. {f.q}</p>
              <p>A. {f.a}</p>
            </div>
          ))}

          <h2>関連ツール</h2>
          <div className="chips">
            <Link className="chip" href="/tools/clock">デジタル時計</Link>
            <Link className="chip" href="/tools/analog-clock">アナログ時計</Link>
            <Link className="chip" href="/tools/timer">タイマー</Link>
            <Link className="chip" href="/tools/stopwatch">ストップウォッチ</Link>
          </div>

          <h3>更新履歴</h3>
          <ul className="doc-history">
            <li>2026年9月　Next.js版として公開</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "トップ" },
                  { "@type": "ListItem", position: 2, name: "時間" },
                  { "@type": "ListItem", position: 3, name: "世界時計" },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: FAQ.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        }}
      />
    </div>
  );
}
