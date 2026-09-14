import Link from "next/link";
import type { Metadata } from "next";
import { TaxCalculator } from "./TaxCalculator";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "消費税計算（税込・税抜）｜10%・8%・軽減税率に対応",
  description:
    "税抜から税込、税込から税抜をすぐに計算。消費税10%・8%（軽減税率）や任意の税率に対応し、消費税額の内訳・税込早見表・軽減税率の解説つき。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("税込・税抜計算")}&tagline=${encodeURIComponent("税抜から税込を、税込から税抜をすばやく計算します。")}`],
  },
};

const FAQ = [
  {
    q: "税抜価格から税込価格を出す計算式は？",
    a: "税抜価格 × 1.1（軽減税率なら × 1.08）です。税抜1,000円なら税込1,100円になります。",
  },
  {
    q: "税込価格から税抜価格を出すには？",
    a: "税込価格 ÷ 1.1（軽減税率なら ÷ 1.08）です。税込1,100円なら税抜1,000円になります。",
  },
  {
    q: "消費税の端数は切り上げですか、切り捨てですか？",
    a: "法律上はどちらでもよく、事業者が継続適用を条件に「切り捨て・四捨五入・切り上げ」から選べます。実務では切り捨てが多く、当ツールも切り捨てで計算しています。",
  },
  {
    q: "軽減税率8%の対象は？",
    a: "酒類と外食を除く飲食料品、週2回以上発行される定期購読の新聞などです。",
  },
];

const RATE_CHART_ROWS = [
  { ex: "100円", r10: "110円", r8: "108円" },
  { ex: "300円", r10: "330円", r8: "324円" },
  { ex: "500円", r10: "550円", r8: "540円" },
  { ex: "800円", r10: "880円", r8: "864円" },
  { ex: "980円", r10: "1,078円", r8: "1,058円" },
  { ex: "1,000円", r10: "1,100円", r8: "1,080円" },
  { ex: "1,500円", r10: "1,650円", r8: "1,620円" },
  { ex: "2,000円", r10: "2,200円", r8: "2,160円" },
  { ex: "2,980円", r10: "3,278円", r8: "3,218円" },
  { ex: "3,000円", r10: "3,300円", r8: "3,240円" },
  { ex: "5,000円", r10: "5,500円", r8: "5,400円" },
  { ex: "8,000円", r10: "8,800円", r8: "8,640円" },
  { ex: "10,000円", r10: "11,000円", r8: "10,800円" },
];

export default function TaxPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/calc">計算</Link>
        <span aria-hidden="true">›</span>
        <span>税込・税抜計算</span>
      </nav>

      <div className="tool-head">
        <h1>税込・税抜計算</h1>
        <p className="lede">税抜から税込を、税込から税抜をすばやく計算します。</p>
      </div>

      <TaxCalculator />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            税抜価格から税込価格を、税込価格から税抜価格を計算します。消費税額の内訳（税抜・消費税・税込）もあわせて表示します。
            税率は10%・8%（軽減税率）のほか、任意の税率も指定できます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>計算の向き（税抜→税込／税込→税抜）を選びます。</li>
            <li>金額（円）を入力します。</li>
            <li>税率を選びます（「その他」で任意の税率を入力できます）。</li>
          </ol>
          <p>入力するとその場で結果が表示されます（ボタン操作は不要です）。</p>

          <h2>計算方法</h2>
          <p>
            税込価格 ＝ 税抜価格 ×（1 ＋ 税率）／ 税抜価格 ＝ 税込価格 ÷（1 ＋ 税率）。
            当ツールは1円未満を切り捨てて計算します（税抜→税込は消費税額を、税込→税抜は税抜価格を切り捨て、内訳が一致するよう消費税額は差額で求めます）。
          </p>
          <p>たとえば税抜105円の商品を税率10%で計算すると、消費税は 105 × 0.1 ＝ 10.5円。1円未満を切り捨てて10円となり、税込価格は115円です。</p>
          <p>消費税額の端数処理（1円未満の切り捨て・四捨五入・切り上げ）は、事業者が継続適用を条件に選べます。そのため、実際のレシートの金額とは扱いが異なる場合があります。</p>

          <h2>軽減税率（8%）とは</h2>
          <p>
            軽減税率は、2019年10月に消費税が10%へ引き上げられたときに導入された制度で、対象品目の税率を8%に据え置くものです。
            計算のしかたは通常と同じで、選ぶ税率が8%になるだけです。
          </p>
          <h3>8%（軽減税率）の対象</h3>
          <ul>
            <li>酒類・外食を除く飲食料品（スーパーやコンビニでの食品、テイクアウト、宅配など）</li>
            <li>週2回以上発行される、定期購読契約の新聞</li>
          </ul>
          <h3>10%（標準税率）のままのもの</h3>
          <ul>
            <li>外食・ケータリング（店内での飲食、いわゆる「イートイン」）</li>
            <li>酒類</li>
            <li>医薬品・日用品など、飲食料品以外のもの</li>
          </ul>
          <p>同じ弁当でも「テイクアウトは8%、店内で食べると10%」というように、提供のされ方で税率が変わることがあります。</p>
          <h3>総額表示について</h3>
          <p>2021年4月からは、消費者向けの価格表示は消費税を含めた「総額表示」が原則として義務づけられています。値札・メニュー・広告などで示す価格は、原則として税込価格になります。</p>

          <h2>税込・税抜早見表</h2>
          <p>よく使う税抜金額の税込価格の早見表です。上のツールに入力すると、近い行に印がつきます。</p>
          <div className="chart-scroll">
            <table className="rate-chart">
              <caption className="sr-only">税抜金額ごとの税込価格（消費税10%・8%）の早見表</caption>
              <thead>
                <tr>
                  <th scope="col">税抜</th>
                  <th scope="col">税込（10%）</th>
                  <th scope="col">税込（8%）</th>
                </tr>
              </thead>
              <tbody>
                {RATE_CHART_ROWS.map((row) => (
                  <tr key={row.ex}>
                    <th scope="row">{row.ex}</th>
                    <td>{row.r10}</td>
                    <td>{row.r8}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>注意点</h2>
          <ul>
            <li>消費税額の端数処理は事業者ごとに異なるため、実際のレシートと1円程度ずれることがあります。</li>
            <li>軽減税率（8%）の対象は限られます（酒類・外食を除く飲食料品、週2回以上発行される定期購読の新聞など）。</li>
            <li>当ツールは2019年10月以降の税率（標準10%／軽減8%）を前提としています。</li>
          </ul>
          <p>本ツールの結果は一般的な計算による目安です。税務の判断は、所轄の税務署または税理士にご相談ください。結果のご利用によって生じたいかなる損害についても、当サイトは責任を負いかねます。</p>

          <h2>よくある質問</h2>
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="q">Q. {f.q}</p>
              <p>A. {f.a}</p>
            </div>
          ))}

          <h2>関連ツール</h2>
          <div className="chips">
            <Link className="chip" href="/tools/discount">割引計算</Link>
            <Link className="chip" href="/tools/bmi">BMI計算</Link>
          </div>

          <h3>参考</h3>
          <p>税率および軽減税率の区分は、国税庁が公表する消費税の情報にもとづいています（2019年10月以降の税率）。</p>

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
                  { "@type": "ListItem", position: 2, name: "計算" },
                  { "@type": "ListItem", position: 3, name: "税込・税抜計算" },
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
