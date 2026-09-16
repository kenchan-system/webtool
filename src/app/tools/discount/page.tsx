import Link from "next/link";
import type { Metadata } from "next";
import { DiscountCalculator } from "./DiscountCalculator";
import { AdSlot } from "@/components/AdSlot";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "割引計算｜定価と割引率から割引後の価格をすぐ計算",
  description:
    "定価と割引率から、割引後の価格と割引額をすぐに計算。10%・20%・30%・半額や任意の割引率に対応し、「○割引」と「○％OFF」の対応・二重割引の計算方法・割引早見表つき。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("割引計算")}&tagline=${encodeURIComponent("定価と割引率から、割引後の価格と割引額を出します。")}`],
  },
};

const FAQ = [
  {
    q: "30％OFFの値段の出し方は？",
    a: "定価 × 0.7 です。定価1,000円なら割引後は700円になります（定価 − 定価×0.3 と同じ）。",
  },
  {
    q: "何割引か（割引率）を知りたいときは？",
    a: "割引額（定価 − 割引後価格）を定価で割って100をかけます。例：定価1,000円が700円なら、300 ÷ 1,000 × 100 ＝ 30％引きです。",
  },
  {
    q: "半額は何％OFFですか？",
    a: "50％OFFです。「○割引」で言うと5割引です。",
  },
  {
    q: "二重割引はどう計算しますか？",
    a: "1回目の割引後価格に、2回目の割引率をかけます。例：定価1,000円の20％OFF（＝800円）にさらに10％OFFなら 800 × 0.9 ＝ 720円です。",
  },
];

const RATE_CHART_ROWS = [
  { list: "500円", r10: "450円", r20: "400円", r30: "350円", r50: "250円" },
  { list: "800円", r10: "720円", r20: "640円", r30: "560円", r50: "400円" },
  { list: "1,000円", r10: "900円", r20: "800円", r30: "700円", r50: "500円" },
  { list: "1,500円", r10: "1,350円", r20: "1,200円", r30: "1,050円", r50: "750円" },
  { list: "1,980円", r10: "1,782円", r20: "1,584円", r30: "1,386円", r50: "990円" },
  { list: "3,000円", r10: "2,700円", r20: "2,400円", r30: "2,100円", r50: "1,500円" },
  { list: "5,000円", r10: "4,500円", r20: "4,000円", r30: "3,500円", r50: "2,500円" },
  { list: "8,000円", r10: "7,200円", r20: "6,400円", r30: "5,600円", r50: "4,000円" },
  { list: "10,000円", r10: "9,000円", r20: "8,000円", r30: "7,000円", r50: "5,000円" },
];

export default function DiscountPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/calc">計算</Link>
        <span aria-hidden="true">›</span>
        <span>割引計算</span>
      </nav>

      <div className="tool-head">
        <h1>割引計算</h1>
        <p className="lede">定価と割引率から、割引後の価格と割引額を計算します。</p>
      </div>

      <DiscountCalculator />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            定価と割引率から、割引後の価格と割引額を計算します。割引率は10・20・30％・半額から選ぶか、「その他」で任意の割合を指定できます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>定価（円）を入力します。</li>
            <li>割引率を選びます（「その他」で任意の％も指定できます）。</li>
          </ol>
          <p>入力するとその場で結果が表示されます（ボタン操作は不要です）。</p>

          <h2>計算方法</h2>
          <p>
            割引額 ＝ 定価 × 割引率 ／ 割引後価格 ＝ 定価 − 割引額。
            当ツールは割引額の1円未満を切り捨てて計算します。
          </p>
          <p>たとえば定価1,780円の15％引きなら、割引額は 1,780 × 0.15 ＝ 267円。割引後価格は 1,780 − 267 ＝ 1,513円です。</p>

          <h2>「○割引」と「○％OFF」の対応</h2>
          <p>
            「○割引」の○に10をかけると割引率（％）になります。3割引＝30％OFF、半額＝50％OFF、7割引＝70％OFFです。
            二重割引（割引後にさらに割引）は、1回目の割引後価格に2回目の割引率をかけて計算します。
          </p>

          <h2>割引早見表</h2>
          <p>よく使う定価の割引後価格の早見表です。上のツールに入力すると、近い行に印がつきます。</p>
          <div className="chart-scroll">
            <table className="rate-chart">
              <caption className="sr-only">定価ごとの割引後価格（10・20・30・50％OFF）の早見表</caption>
              <thead>
                <tr>
                  <th scope="col">定価</th>
                  <th scope="col">10％OFF</th>
                  <th scope="col">20％OFF</th>
                  <th scope="col">30％OFF</th>
                  <th scope="col">50％OFF</th>
                </tr>
              </thead>
              <tbody>
                {RATE_CHART_ROWS.map((row) => (
                  <tr key={row.list}>
                    <th scope="row">{row.list}</th>
                    <td>{row.r10}</td>
                    <td>{row.r20}</td>
                    <td>{row.r30}</td>
                    <td>{row.r50}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>注意点</h2>
          <ul>
            <li>割引額の端数処理（1円未満の扱い）は店舗により異なるため、実際のレジ金額と数円ずれることがあります。</li>
            <li>二重割引・クーポン併用などの複雑な割引には対応していません。</li>
            <li>
              定価が税込か税抜かは区別せず、入力した金額に対して割引を計算します。税込価格を知りたいときは
              <Link href="/tools/tax">税込・税抜計算</Link>をご利用ください。
            </li>
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
            <Link className="chip" href="/tools/tax">税込・税抜計算</Link>
            <Link className="chip" href="/tools/bmi">BMI計算</Link>
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
                  { name: "計算", path: "/calc" },
                  { name: "割引計算", path: "/tools/discount" },
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
