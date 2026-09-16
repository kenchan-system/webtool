import Link from "next/link";
import type { Metadata } from "next";
import { BmiCalculator } from "./BmiCalculator";
import { AdSlot } from "@/components/AdSlot";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "BMI計算｜身長と体重で自動計算・適正体重と早見表",
  description:
    "身長と体重を入れるだけでBMIと肥満度、BMI22基準の適正体重、差を自動計算。判定の目安がわかるバンド表示と、身長×体重の早見表つき。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("BMI計算")}&tagline=${encodeURIComponent("身長と体重から、BMIと適正体重を計算します。")}`],
  },
};

const FAQ = [
  {
    q: "入力した数値は保存されますか？",
    a: "保存されません。計算はすべてお使いのブラウザ内で行われます。",
  },
  {
    q: "適正体重の「22」とは何ですか？",
    a: "統計的に病気になりにくいとされるBMIの値です。これを基準に体重を逆算しています。",
  },
  {
    q: "男性と女性でBMIの基準は違いますか？",
    a: "いいえ。BMIの計算式も、判定の区分（18.5未満／18.5〜25／25以上など）も男女共通です。ただし同じBMIでも体脂肪の割合は女性のほうが高めになる傾向があり、BMIはあくまで体格の目安とお考えください。",
  },
];

const BMI_CHART_ROWS: Array<{ h: number; cells: Array<{ v: number; band: "b-low" | "b-normal" | "b-over1" | "b-over2" }> }> = (() => {
  const heights = [145, 150, 155, 160, 165, 170, 175, 180, 185, 190];
  const weights = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  function band(bmi: number): "b-low" | "b-normal" | "b-over1" | "b-over2" {
    if (bmi < 18.5) return "b-low";
    if (bmi < 25) return "b-normal";
    if (bmi < 30) return "b-over1";
    return "b-over2";
  }
  return heights.map((h) => ({
    h,
    cells: weights.map((w) => {
      const m = h / 100;
      const bmi = w / (m * m);
      return { v: Math.round(bmi * 10) / 10, band: band(bmi) };
    }),
  }));
})();

export default function BmiPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/calc">計算</Link>
        <span aria-hidden="true">›</span>
        <span>BMI計算</span>
      </nav>

      <div className="tool-head">
        <h1>BMI計算</h1>
        <p className="lede">身長と体重から、BMIと適正体重を計算します。</p>
      </div>

      <BmiCalculator />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>身長と体重から、BMI（体格指数）と肥満度の判定、BMI22を基準にした適正体重、適正体重との差がすぐに分かります。</p>

          <h2>使い方</h2>
          <ol>
            <li>身長（cm）を入力します。</li>
            <li>体重（kg）を入力します。</li>
            <li>入力するとその場で結果が表示されます（ボタン操作は不要です）。</li>
          </ol>

          <h2>計算方法</h2>
          <p>BMI ＝ 体重(kg) ÷ ( 身長(m) × 身長(m) )。 適正体重 ＝ 身長(m) × 身長(m) × 22 で求めています。</p>

          <h2>BMI早見表</h2>
          <p>身長と体重の組み合わせから、おおよそのBMIと肥満度の判定を確認できる早見表です。ピンポイントの数値は、上のツールで計算できます。</p>

          <h3>判定の区分</h3>
          <p>日本肥満学会による肥満度の分類です。</p>
          <table className="band-table">
            <tbody>
              <tr><th scope="row">18.5未満</th><td>低体重（やせ）</td></tr>
              <tr><th scope="row">18.5〜25未満</th><td>普通体重</td></tr>
              <tr><th scope="row">25〜30未満</th><td>肥満（1度）</td></tr>
              <tr><th scope="row">30〜35未満</th><td>肥満（2度）</td></tr>
              <tr><th scope="row">35〜40未満</th><td>肥満（3度）</td></tr>
              <tr><th scope="row">40以上</th><td>肥満（4度）</td></tr>
            </tbody>
          </table>

          <h3>身長と体重の早見表</h3>
          <p>数値はBMI、色は肥満度の判定です。</p>
          <div className="chart-scroll">
            <table className="bmi-chart">
              <caption className="sr-only">身長と体重からBMIのおおよその値を求める早見表</caption>
              <thead>
                <tr>
                  <th scope="col">身長＼体重</th>
                  {[40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95].map((w) => (
                    <th scope="col" key={w}>{w}kg</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BMI_CHART_ROWS.map((row) => (
                  <tr key={row.h}>
                    <th scope="row">{row.h}cm</th>
                    {row.cells.map((c, i) => (
                      <td className={c.band} key={i}>{c.v.toFixed(1)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="chart-legend">
            <span className="k b-low">低体重</span>
            <span className="k b-normal">普通体重</span>
            <span className="k b-over1">肥満（1度）</span>
            <span className="k b-over2">肥満（2度以上）</span>
          </p>

          <h2>注意点</h2>
          <ul>
            <li>BMIは体格の目安です。筋肉量や体組成は反映されません。</li>
            <li>成長期のお子さま・妊娠中の方などには当てはまらないことがあります。</li>
            <li>健康状態の判断は自己判断せず、医療機関にご相談ください。</li>
          </ul>
          <p>このツールの計算結果は一般的な目安であり、医学的な診断ではありません。結果のご利用によって生じたいかなる損害についても、当サイトは責任を負いかねます。</p>

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
            <Link className="chip" href="/tools/days">日数計算</Link>
          </div>

          <h3>参考</h3>
          <p>判定の区分および早見表は、日本肥満学会の肥満度分類にもとづいています。</p>

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
                  { name: "BMI計算", path: "/tools/bmi" },
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
