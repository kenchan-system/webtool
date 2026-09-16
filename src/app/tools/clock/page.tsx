import Link from "next/link";
import type { Metadata } from "next";
import { ClockApp } from "./ClockApp";
import { AdSlot } from "@/components/AdSlot";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "デジタル時計｜大きな数字で見やすい現在時刻表示",
  description:
    "大きな数字で現在時刻を表示するシンプルなデジタル時計。日付・曜日つき、12時間/24時間表示・秒の表示ON/OFF・大画面表示に対応。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("デジタル時計")}&tagline=${encodeURIComponent("大きな数字で現在時刻を表示します。")}`],
  },
};

const FAQ = [
  {
    q: "時刻がずれています。",
    a: "この時計はお使いの端末（パソコン・スマホ）本体の時計をそのまま表示しています。端末側の時刻設定をご確認ください。",
  },
  {
    q: "秒を表示しないようにできますか？",
    a: "「秒の表示」で「表示しない」を選ぶと、時:分だけのすっきりした表示になります。",
  },
  {
    q: "12時間表示にできますか？",
    a: "「時刻表示」から切り替えられます。「午前」「午後」の表示つきです。",
  },
  {
    q: "画面いっぱいに大きく表示できますか？",
    a: "できます。「大画面」ボタンを押すと、時刻と日付だけを画面いっぱいに表示します。閉じるには右上の「✕」かEscキーを押してください。",
  },
];

export default function ClockPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/time">時間</Link>
        <span aria-hidden="true">›</span>
        <span>デジタル時計</span>
      </nav>

      <div className="tool-head">
        <h1>デジタル時計</h1>
        <p className="lede">大きな数字で現在時刻を表示します。</p>
      </div>

      <ClockApp />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            大きな数字で現在時刻を表示するだけの、シンプルなデジタル時計です。日付・曜日もあわせて表示します。
            12時間表示・24時間表示の切り替え、秒の表示のON/OFFにも対応。「大画面」表示にすれば、時刻だけを画面いっぱいに大きく映すこともできます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>ページを開くと、現在時刻が自動的に表示されます。特別な操作は必要ありません。</li>
            <li>「時刻表示」で12時間表示・24時間表示を切り替えられます（12時間表示では「午前」「午後」がつきます）。</li>
            <li>「秒の表示」で、秒まで表示するか、時:分だけのすっきりした表示にするかを選べます。</li>
            <li>設定は次にこのページを開いたときも覚えています。</li>
          </ol>

          <h2>大画面表示について</h2>
          <p>
            右上の「大画面」ボタンを押すと、設定を隠し、時刻と日付だけを画面いっぱいに大きく表示します。
            会議室のスクリーンに映す、教室で使う、受付や待合室に置く、といった使い方を想定しています。
            閉じるには右上の「✕」か、キーボードの<kbd>Esc</kbd>キーを押してください。
          </p>

          <h2>正確さについて</h2>
          <p>
            この時計は、お使いのパソコン・スマートフォン本体の時計をもとに表示しています。端末の時刻設定がずれていると、表示される時刻もそのままずれます（自動での補正はしません）。
            このページを開いている間は1秒ごとに更新されますが、他のページへ移動すると更新は止まります。次にこのページを開いたときは、そのときの正しい時刻が表示されます。
          </p>

          <h2>注意点</h2>
          <ul>
            <li>タブを閉じたり、端末がスリープ状態になると、当然ながら表示の更新は止まります。</li>
            <li>
              アラーム（指定した時刻に音で知らせる）機能はありません。時間になったら知らせてほしい場合は<Link href="/tools/timer">タイマー</Link>をご利用ください。
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
            <Link className="chip" href="/tools/analog-clock">アナログ時計</Link>
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
              breadcrumbJsonLd([
                  { name: "トップ", path: "/" },
                  { name: "時間", path: "/time" },
                  { name: "デジタル時計", path: "/tools/clock" },
                ]),
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
