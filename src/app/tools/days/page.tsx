import Link from "next/link";
import type { Metadata } from "next";
import { DaysCalculator } from "./DaysCalculator";
import { AdSlot } from "@/components/AdSlot";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "日数計算｜2つの日付の間の日数・◯日後の日付をすぐ計算",
  description:
    "2つの日付の間の日数や、◯日後・◯日前の日付をすぐに計算。初日を含める・含めない数え方の違い、「◯年◯か月◯日」の期間の長さもあわせて表示。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("日数計算")}&tagline=${encodeURIComponent("2つの日付の間の日数や、◯日後の日付を計算します。")}`],
  },
};

const FAQ = [
  {
    q: "2つの日付の間の日数の出し方は？",
    a: "「終了日 − 開始日」で求めます（初日を含めない数え方）。期間の長さとして数えるときは、それに1を足します（初日を含める）。",
  },
  {
    q: "今日から100日後はいつ？",
    a: "「◯日後・◯日前」に切り替えて、起点日を今日、日数を100にすると計算できます（過去なら日数の左の「−」を押します）。",
  },
  {
    q: "「100日後」と「100日目」は違いますか？",
    a: "はい。起点日を1日目と数える「100日目」は、起点日の99日後にあたります。当ツールの「◯日後」は起点日を0として数えるため、1つずれます（たとえば「生後100日目」＝生まれた日の99日後）。",
  },
];

export default function DaysPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/date">日付</Link>
        <span aria-hidden="true">›</span>
        <span>日数計算</span>
      </nav>

      <div className="tool-head">
        <h1>日数計算</h1>
        <p className="lede">2つの日付の間の日数や、◯日後・◯日前の日付を計算します。</p>
      </div>

      <DaysCalculator />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            2つの日付を入れると、その間が何日かがわかります。おおよその「◯年◯か月◯日」もあわせて表示します。
            「◯日後・◯日前」に切り替えると、ある日付から数えた日付が曜日つきでわかります。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>「期間の日数」か「◯日後・◯日前」を選びます。</li>
            <li>期間の日数：開始日と終了日を入れます。</li>
            <li>◯日後・◯日前：起点日と日数を入れます。過去を計算するときは日数の左の「−」を押します。</li>
          </ol>
          <p>入力するとその場で結果が表示されます（ボタン操作は不要です）。開始日・起点日は今日が初期表示です。「今日にする」でいつでも戻せます。</p>
          <p>年月日のどの欄にも「2026/9/17」などの日付を貼り付けると、3つの欄へまとめて入力できます。全角数字・西暦の年月日表記・和暦にも対応しています。</p>

          <h2>初日を含める・含めないとは</h2>
          <p>
            期間の日数には数え方が2通りあります。当ツールの答えは<strong>単純な差（終了日 − 開始日）＝初日を含めない</strong>数え方で、「何日後か」を知りたいときの形です。
            大きい数字の下に、<strong>初日も含めた日数（差＋1）</strong>を添えています。こちらは、レンタルや契約、入院日数、旅行の「◯泊◯日」のように期間の長さそのものを数えるときの形です。
          </p>

          <h2>◯週間・◯か月は何日？</h2>
          <ul>
            <li>1週間＝7日、2週間＝14日、4週間＝28日</li>
            <li>ひと月は28〜31日（月による）、1年＝365日（うるう年は366日）</li>
          </ul>
          <p>「期間の長さ」の「◯年◯か月◯日」は、カレンダー上の年・月・日の差で求めています。短い期間のときは「約◯週間」も添えます。</p>

          <h2>注意点</h2>
          <ul>
            <li>時刻は考慮しません。日付だけで計算します。</li>
            <li>祝日・休業日は数えません。土日を除いた「営業日」や、納期の計算には対応していません（別ツールで対応予定です）。</li>
            <li>「◯年◯か月◯日」は月の日数の違いで、単純な日数からは前後することがあります。</li>
          </ul>
          <p>本ツールの結果は一般的な計算による目安です。契約・行政手続などの期間計算は、各制度の定義に従ってください。結果のご利用によって生じたいかなる損害についても、当サイトは責任を負いかねます。</p>

          <h2>よくある質問</h2>
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="q">Q. {f.q}</p>
              <p>A. {f.a}</p>
            </div>
          ))}

          <h2>関連ツール</h2>
          <div className="chips">
            <Link className="chip" href="/tools/age">年齢・学年計算</Link>
            <Link className="chip" href="/tools/wareki">和暦・西暦変換</Link>
          </div>

          <h3>更新履歴</h3>
          <ul className="doc-history">
            <li>2026年9月　Next.js版として公開</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              breadcrumbJsonLd([
                  { name: "トップ", path: "/" },
                  { name: "日付", path: "/date" },
                  { name: "日数計算", path: "/tools/days" },
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
