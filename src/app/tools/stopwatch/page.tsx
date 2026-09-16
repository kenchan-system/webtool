import Link from "next/link";
import type { Metadata } from "next";
import { StopwatchApp } from "./StopwatchApp";
import { AdSlot } from "@/components/AdSlot";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ストップウォッチ｜ラップ計測対応のシンプルなストップウォッチ",
  description:
    "「開始」を押すだけの経過時間計測。1/100秒まで表示し、ラップ（区間）タイムを何度でも記録。ラップのコピー・大画面表示・キーボード操作にも対応。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("ストップウォッチ")}&tagline=${encodeURIComponent("経過時間を計測します。ラップ（区間）計測にも対応。")}`],
  },
};

const FAQ = [
  {
    q: "ラップは何件まで記録できますか？",
    a: "件数の上限は設けていません。ただしラップ一覧はスクロールで確認する形になります。",
  },
  {
    q: "タブを切り替えても大丈夫ですか？",
    a: "大丈夫です。経過時間は時刻をもとに計算しているので、他のタブを見ていてもずれず、タブのタイトルにも経過時間が表示されます。",
  },
  {
    q: "1時間より長く計測できますか？",
    a: "できます。1時間以上は「時:分:秒」表示に切り替わります（1/100秒の表示は1時間未満のときだけです）。",
  },
  {
    q: "ラップの記録を保存できますか？",
    a: "「ラップをコピー」でテキストとしてコピーできます。ファイルへの保存やページの再読み込み後の復元には対応していません。",
  },
  {
    q: "画面いっぱいに大きく表示できますか？",
    a: "できます。「大画面」ボタンを押すと、経過時間と操作ボタンだけを画面いっぱいに表示します。閉じるには右上の「✕」かEscキーを押してください。",
  },
];

export default function StopwatchPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/time">時間</Link>
        <span aria-hidden="true">›</span>
        <span>ストップウォッチ</span>
      </nav>

      <div className="tool-head">
        <h1>ストップウォッチ</h1>
        <p className="lede">経過時間を計測するストップウォッチです。ラップ（区間）計測にも対応。</p>
      </div>

      <StopwatchApp />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            「開始」を押すだけで経過時間の計測が始まるシンプルなストップウォッチです。1/100秒まで表示し、計測中は「ラップ」で区間タイムを何度でも記録できます。
            「大画面」表示にすれば、経過時間だけを画面いっぱいに大きく映すこともできます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>「開始」を押すと計測がはじまります。</li>
            <li>「一時停止」でいつでも止められます。「再開」で続きから計測できます。</li>
            <li>計測中に「ラップ」を押すと、そのときまでの区間タイムと合計タイムを記録します。新しいラップほどリストの上に表示されます。</li>
            <li>「リセット」を押すと、経過時間とラップの記録がすべて消え、最初の状態に戻ります（確認は挟みません。押すとすぐに消えるのでご注意ください）。</li>
          </ol>

          <h2>ラップ機能について</h2>
          <p>ラップは3件以上記録すると、区間タイムがいちばん短いラップと長いラップに色をつけて表示します。「ラップをコピー」を押すと、記録した区間タイム・合計タイムをテキストとしてコピーできます。メモやSNSでの共有にお使いください。</p>

          <h2>大画面表示について</h2>
          <p>
            右上の「大画面」ボタンを押すと、設定やラップ一覧を隠し、経過時間と操作ボタンだけを画面いっぱいに大きく表示します。
            スポーツの計測、プレゼンや発表の練習、会議室のスクリーンに映す、といった使い方を想定しています。
            閉じるには右上の「✕」か、キーボードの<kbd>Esc</kbd>キーを押してください。
          </p>

          <h2>正確さについて</h2>
          <p>
            計測開始・再開のたびに「そのときの時刻」を記録し、そこからの経過を計算し続ける方式です。
            そのため、別のタブを見ていたり、ブラウザを最小化していても、経過時間がずれることはありません。
            ページを移動しても計測は止まらず、タブのタイトルにも経過時間を表示します（他のツールを使いながら計測を続けられます）。
          </p>

          <h2>キーボード操作</h2>
          <p>
            パソコンでは、キーボードでも操作できます：<kbd>Space</kbd>キーで開始・一時停止・再開、<kbd>L</kbd>キーでラップ、<kbd>R</kbd>キーでリセット（計測中はリセットされないよう無効にしています）。
          </p>

          <h2>注意点</h2>
          <ul>
            <li>タブを閉じる、またはブラウザを終了すると、計測は止まります（記録は保存されません）。</li>
            <li>ページを再読み込みすると、経過時間とラップの記録はリセットされます。</li>
            <li>端末がスリープ状態になった場合、正しく動作しないことがあります。</li>
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
            <Link className="chip" href="/tools/timer">タイマー</Link>
            <Link className="chip" href="/tools/clock">デジタル時計</Link>
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
                  { name: "ストップウォッチ", path: "/tools/stopwatch" },
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
