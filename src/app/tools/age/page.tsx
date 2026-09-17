import Link from "next/link";
import type { Metadata } from "next";
import { AgeCalculator } from "./AgeCalculator";
import { AdSlot } from "@/components/AdSlot";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "年齢・学年計算｜生年月日から満年齢といまの学年をすぐ計算",
  description:
    "生年月日から、満年齢といまの学年をすぐに計算。生まれた曜日・干支・星座、次の誕生日までの日数もあわせて表示。基準日を指定して過去・未来の年齢も計算できます。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("年齢・学年計算")}&tagline=${encodeURIComponent("生年月日から、満年齢といまの学年を調べます。")}`],
  },
};

const FAQ = [
  {
    q: "4月1日生まれは何年生になりますか？",
    a: "「早生まれ」として、4月2日〜翌年3月31日生まれの人と同じ学年（1つ上）になります。法律上、誕生日の前日に歳をとる扱いのためです。",
  },
  {
    q: "早生まれとは？",
    a: "1月1日〜4月1日に生まれた人のことです。同じ学年でいちばん誕生日が遅くなります。",
  },
  {
    q: "年齢から生まれ年を調べるには？",
    a: "誕生日を迎えていれば「今年 − 年齢」、まだなら「今年 − 年齢 − 1」が生まれ年です。",
  },
];

export default function AgePage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/date">日付</Link>
        <span aria-hidden="true">›</span>
        <span>年齢・学年計算</span>
      </nav>

      <div className="tool-head">
        <h1>年齢・学年計算</h1>
        <p className="lede">生年月日から、満年齢・学年・生まれた曜日などを計算します。</p>
      </div>

      <AgeCalculator />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            生年月日を入れるだけで、<strong>満年齢</strong>（何歳何か月何日）と<strong>いまの学年</strong>が一度にわかります。
            生まれた曜日・干支・星座、次の誕生日までの日数もあわせて表示します。
            「基準日」を変えれば、特定の日に何歳・何年生だったかも計算できます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>生まれた年（西暦）・月・日を入力します。どの欄にも「2000/9/17」などの日付を貼り付けると、年月日がまとめて入ります。</li>
            <li>ふだんは「今日」の基準日でOK。特定の日で調べたいときは「日付を指定」に切り替えます。</li>
          </ol>
          <p>入力するとその場で結果が表示されます（ボタン操作は不要です）。</p>
          <p>貼り付けは「2000-09-17」「2000年9月17日」、全角数字、「平成12年9月17日」「H12.9.17」などに対応しています。数字だけを貼り付けた場合は、その欄だけを更新します。</p>

          <h2>年齢の計算について</h2>
          <p>
            <strong>満年齢</strong>は、基準日の年から生まれ年を引き、その年の誕生日をまだ迎えていなければ1を引いた数です。
            「年齢計算ニ関スル法律」では誕生日の前日に歳をとる扱いのため、誕生日の前日と当日は同じ年齢になります。
          </p>
          <p className="q">Q. いま◯歳です。生まれ年は？</p>
          <p>A. 誕生日を迎えていれば「今年 − 年齢」、まだなら「今年 − 年齢 − 1」が生まれ年です。下の年齢早見表からも探せます。</p>

          <h2>学年（何年生）の調べ方</h2>
          <p>
            <strong>学年</strong>は、4月2日〜翌年4月1日生まれを1つのまとまりとし、6歳になった後の最初の4月に小学1年生になります。
            以降は小学6年→中学3年→高校3年と進み、その先は標準的な進学として大学1〜4年生、それ以降は「社会人」と表示します。
            小学校に上がる前は、その年度に4歳・5歳・6歳になる子をそれぞれ<strong>年少・年中・年長</strong>（幼稚園・保育園共通）として表示し、それより小さいうちは「未就園児」とします。
          </p>

          <h3>「早生まれ」と「遅生まれ」</h3>
          <p>
            <strong>早生まれ</strong>は1月1日〜4月1日に生まれた人のことで、同じ学年の中でいちばん誕生日が遅く、年度の切り替わり（4月1日）ぎりぎりで前の学年に入ります。
            <strong>遅生まれ</strong>は4月2日〜12月31日生まれで、その学年でいちばん誕生日が早くなります。
            4月1日生まれが早生まれになるのは、法律上その前日（3月31日）に歳をとる扱いのためです。
          </p>
          {FAQ.slice(0, 2).map((f) => (
            <div key={f.q}>
              <p className="q">Q. {f.q}</p>
              <p>A. {f.a}</p>
            </div>
          ))}

          <h2>注意点</h2>
          <ul>
            <li>学年は標準的な進度の目安です。大学は4年制として計算し、その先は「社会人」と表示します。浪人・留年・飛び級・海外の学校などは考慮していません。</li>
            <li>2月29日生まれの「次の誕生日」は、平年は3月1日として扱います。</li>
            <li>改元があった年（1989年・2019年）は、年の途中で元号が変わります。早見表は年単位で新しい元号にしています。</li>
          </ul>
          <p>本ツールの結果は一般的な計算による目安です。結果のご利用によって生じたいかなる損害についても、当サイトは責任を負いかねます。</p>

          <h2>よくある質問</h2>
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="q">Q. {f.q}</p>
              <p>A. {f.a}</p>
            </div>
          ))}

          <h2>関連ツール</h2>
          <div className="chips">
            <Link className="chip" href="/tools/days">日数計算</Link>
            <Link className="chip" href="/tools/wareki">和暦・西暦変換</Link>
          </div>

          <h3>参考</h3>
          <p>学年の区切りは学校教育法、4月1日生まれの扱いは「年齢計算ニ関スル法律」にもとづいています。</p>

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
                  { name: "日付", path: "/date" },
                  { name: "年齢・学年計算", path: "/tools/age" },
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
