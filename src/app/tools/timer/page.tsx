import Link from "next/link";
import type { Metadata } from "next";
import { TimerApp } from "./TimerApp";

export const metadata: Metadata = {
  title: "タイマー｜シンプルなカウントダウンタイマー",
  description:
    "時間を決めて「開始」を押すだけのシンプルなカウントダウンタイマー。よく使う時間をワンタップで、音の種類・音量・大画面表示にも対応。無料・登録不要。",
};

const FAQ = [
  {
    q: "スマホでも音は鳴りますか？",
    a: "鳴ります。ただし端末がマナーモード（サイレント）の場合、機種によっては鳴らないことがあります。",
  },
  {
    q: "タブを切り替えても大丈夫ですか？",
    a: "大丈夫です。残り時間は「終わる時刻」から計算しているので、他のタブを見ていてもずれにくく、時間になれば音が鳴ります。",
  },
  {
    q: "60分より長い時間は設定できますか？",
    a: "「時間を自由に設定」のスライダーで、23時間59分59秒まで設定できます。",
  },
  {
    q: "音が長く鳴り続けて止まりません。",
    a: "「音を止める」ボタンでいつでも止められます。何もしなくても約30秒で自動的に止まります。",
  },
  {
    q: "画面いっぱいに大きく表示できますか？",
    a: "できます。「大画面」ボタンを押すと、残り時間だけを画面いっぱいに表示します。閉じるには右上の「✕」かEscキーを押してください。",
  },
  {
    q: "音の種類は選べますか？",
    a: "「シンプル」「ベル」「メロディ」の3種類から選べます。選ぶとその場で鳴るので、試してから決められます。音量スライダーで大きさも調整できます。",
  },
];

export default function TimerPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/time">時間</Link>
        <span aria-hidden="true">›</span>
        <span>タイマー</span>
      </nav>

      <div className="tool-head">
        <h1>タイマー</h1>
        <p className="lede">指定した時間でお知らせするカウントダウンタイマーです。</p>
      </div>

      <TimerApp />

      <div className="ad">
        <span className="tag">広告</span>広告スペース（準備中）
      </div>

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            時間を決めて「開始」を押すだけのシンプルなカウントダウンタイマーです。よく使う時間はワンタップで、それ以外はスライダーで時間・分・秒を自由に調整できます。
            時間になると音でお知らせします。「大画面」表示にすれば、数字だけを画面いっぱいに大きく映すこともできます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>よく使う時間（10秒〜60分）はチップをタップすると選べます。それ以外の時間にしたいときは「時間を自由に設定」を開き、スライダーで時間・分・秒を調整します。</li>
            <li>時間が決まったら「開始」を押すとカウントダウンが始まります。</li>
            <li>「一時停止」「−1分」「+1分」でいつでも微調整できます。「リセット」を押すと、これらの調整は反映されず、最初に設定した時間に戻ります。</li>
            <li>時間になったら音が鳴ります。「音を止める」でいつでも止められます（鳴りっぱなしにならないよう、約30秒で自動的に止まります）。</li>
          </ol>

          <h2>大画面表示について</h2>
          <p>
            右上の「大画面」ボタンを押すと、プリセットや入力欄を隠し、残り時間だけを画面いっぱいに大きく表示します。
            会議室のスクリーンに映す、教室で使う、ワークアウトや調理中に離れた場所からでも見える大きさにする、といった使い方を想定しています。
            閉じるには右上の「✕」か、キーボードの<kbd>Esc</kbd>キーを押してください。
          </p>

          <h2>正確さについて</h2>
          <p>
            このタイマーは「1秒ずつ数える」のではなく、開始した瞬間に「終わる時刻」を記録し、そこからの残り時間を計算し続ける方式です。
            そのため、別のタブを見ていたり、ブラウザを最小化していても、残り時間がずれにくく、時間になれば正しく音が鳴ります
            （ブラウザがバックグラウンドのタブを間引く関係で、鳴るタイミングが数十秒ほど遅れる場合があります）。
            タイマーはページを移動しても動き続けるので、他のツールを使いながら待つこともできます。
          </p>

          <h2>音の種類・鳴らないときは</h2>
          <p>「シンプル」「ベル」「メロディ」の3種類から音を選べます（選ぶとその場で鳴るので、試してから決められます）。音量スライダーで大きさも調整できます。選んだ音・音量は次に使うときも覚えています。</p>
          <p>
            ブラウザは「ユーザーの操作なしに音を鳴らす」ことを制限していますが、このツールは「開始」ボタンを押した時点で音の準備をするため、
            通常は問題なく鳴ります。鳴らない場合は、端末の音量やマナーモード（サイレントモード）をご確認ください。
          </p>

          <h2>注意点</h2>
          <ul>
            <li>タブを閉じる、またはブラウザを終了すると、タイマーは止まります。</li>
            <li>端末がスリープ状態になった場合、正しく動作しないことがあります。</li>
            <li>複数のタイマーを同時に動かすことはできません（新しく開始すると、それまでのタイマーは置き換わります）。</li>
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
            <Link className="chip" href="/tools/stopwatch">ストップウォッチ</Link>
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
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "トップ" },
                  { "@type": "ListItem", position: 2, name: "時間" },
                  { "@type": "ListItem", position: 3, name: "タイマー" },
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
