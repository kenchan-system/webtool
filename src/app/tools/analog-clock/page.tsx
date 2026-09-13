import Link from "next/link";
import type { Metadata } from "next";
import { AnalogClockApp } from "./AnalogClockApp";

export const metadata: Metadata = {
  title: "アナログ時計｜針が動く大きな文字盤の時計",
  description:
    "針が動く、大きな文字盤のアナログ時計。時針・分針・秒針が現在時刻に合わせて動き、日付・曜日も表示。秒針の表示ON/OFF・大画面表示に対応。無料・登録不要。",
};

const FAQ = [
  {
    q: "時刻がずれています。",
    a: "この時計はお使いの端末（パソコン・スマホ）本体の時計をそのまま表示しています。端末側の時刻設定をご確認ください。",
  },
  {
    q: "秒針を止められますか？",
    a: "「秒針の表示」で「表示しない」を選ぶと、秒針を消せます。",
  },
  {
    q: "デジタル表示に切り替えられますか？",
    a: "右上の「🔢 デジタル時計を見る」から、デジタル時計にすぐ切り替えられます。",
  },
  {
    q: "画面いっぱいに大きく表示できますか？",
    a: "できます。「大画面」ボタンを押すと、文字盤だけを画面いっぱいに表示します。閉じるには右上の「✕」かEscキーを押してください。",
  },
];

export default function AnalogClockPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/time">時間</Link>
        <span aria-hidden="true">›</span>
        <span>アナログ時計</span>
      </nav>

      <div className="tool-head">
        <h1>アナログ時計</h1>
        <p className="lede">針が動くアナログ時計を、大きな文字盤で表示します。</p>
      </div>

      <AnalogClockApp />

      <div className="ad">
        <span className="tag">広告</span>広告スペース（準備中）
      </div>

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            針が動く、大きな文字盤のアナログ時計です。時針・分針・秒針が現在時刻に合わせて動き、日付・曜日もあわせて表示します。
            「大画面」表示にすれば、文字盤だけを画面いっぱいに大きく映すこともできます。デジタル表示がお好みの場合は、右上から<Link href="/tools/clock">デジタル時計</Link>にすぐ切り替えられます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>ページを開くと、現在時刻に合わせて針が自動的に動きます。特別な操作は必要ありません。</li>
            <li>
              「秒針の表示」で、秒針を表示するか消すかを選べます。この設定は<Link href="/tools/clock">デジタル時計</Link>の「秒の表示」と共通です（どちらかで設定すると、もう片方にも反映されます）。
            </li>
          </ol>

          <h2>大画面表示について</h2>
          <p>
            右上の「大画面」ボタンを押すと、設定を隠し、文字盤だけを画面いっぱいに大きく表示します。
            会議室のスクリーンに映す、教室で使う、受付や待合室に置く、といった使い方を想定しています。
            閉じるには右上の「✕」か、キーボードの<kbd>Esc</kbd>キーを押してください。
          </p>

          <h2>正確さについて</h2>
          <p>
            この時計は、お使いのパソコン・スマートフォン本体の時計をもとに表示しています。端末の時刻設定がずれていると、表示される時刻もそのままずれます（自動での補正はしません）。
            秒針は「なめらかに回り続ける」のではなく、実際の時計と同じように1秒ごとに動きます。このページを開いている間は1秒ごとに更新されますが、他のページへ移動すると更新は止まります。
          </p>

          <h2>注意点</h2>
          <ul>
            <li>タブを閉じたり、端末がスリープ状態になると、当然ながら針の動きも止まります。</li>
            <li>12時間表示のみで、24時間表示（1〜24の文字盤）には対応していません。</li>
            <li>
              アラーム機能はありません。時間になったら知らせてほしい場合は<Link href="/tools/timer">タイマー</Link>をご利用ください。
            </li>
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
            <Link className="chip" href="/tools/timer">タイマー</Link>
            <Link className="chip" href="/tools/stopwatch">ストップウォッチ</Link>
            <Link className="chip" href="/tools/world-clock">世界時計</Link>
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
                  { "@type": "ListItem", position: 3, name: "アナログ時計" },
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
