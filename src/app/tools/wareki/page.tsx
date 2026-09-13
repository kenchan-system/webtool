import Link from "next/link";
import type { Metadata } from "next";
import { WarekiCalculator } from "./WarekiCalculator";

export const metadata: Metadata = {
  title: "和暦・西暦変換｜令和・平成・昭和と西暦をすぐ変換",
  description:
    "令和・平成・昭和・大正・明治と西暦をすぐに相互変換。生年月日の変換、改元があった年の元号判定、「S60.4.1」のような略号入力にも対応。和暦早見表つき。無料・登録不要。",
};

const FAQ = [
  {
    q: "令和6年は西暦何年ですか？",
    a: "2024年です。令和は2019年5月1日に始まりました（令和元年＝2019年）。",
  },
  {
    q: "昭和64年はいつまでですか？",
    a: "1989年1月7日までです。翌1月8日から平成元年になりました。",
  },
  {
    q: "生年月日を和暦に直すには？",
    a: "「西暦 → 和暦」で西暦の年に加えて「月・日」も入れると、その日付ごと和暦に変換します（例：1985年4月1日 → 昭和60年4月1日）。改元があった年の生まれでも、日付から正しい元号を判定します。",
  },
  {
    q: "履歴書は「昭和」と「S」どちらで書きますか？",
    a: "指定がなければ「昭和」「平成」など正式名称で書くのが無難です。様式に略号（S・H・R）の欄があるときはそれに従います。",
  },
];

const ERA_ROWS = [
  { name: "明治", span: "1868年〜1912年", years: "45年" },
  { name: "大正", span: "1912年〜1926年", years: "15年" },
  { name: "昭和", span: "1926年〜1989年", years: "64年" },
  { name: "平成", span: "1989年〜2019年", years: "31年" },
  { name: "令和", span: "2019年〜", years: "継続中" },
];

export default function WarekiPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/date">日付</Link>
        <span aria-hidden="true">›</span>
        <span>和暦・西暦変換</span>
      </nav>

      <div className="tool-head">
        <h1>和暦・西暦変換</h1>
        <p className="lede">令和・平成・昭和・大正・明治と西暦を相互に変換します。</p>
      </div>

      <WarekiCalculator />

      <div className="ad">
        <span className="tag">広告</span>広告スペース（準備中）
      </div>

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            西暦から和暦、和暦から西暦へ変換します。年だけでも、月・日まで入れて日付ごと（生年月日など）でも変換できます。
            改元があった年は、月で元号を判定し、日まで入れると改元日の前後もぴったり分かります。
            和暦早見表では、その年に生まれた場合の今年の年齢もあわせて確認できます。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>「西暦 → 和暦」か「和暦 → 西暦」を選びます。</li>
            <li>西暦 → 和暦：西暦の年を入れます。生年月日を変換したいときは「月・日」も入れます。</li>
            <li>和暦 → 西暦：元号を選び、年を入れます（元年は「1」）。「月・日」を入れると日付ごと変換します。年の欄に「S60.4.1」のような略号でまとめて入力することもできます。</li>
          </ol>
          <p>入力するとその場で結果が表示されます（ボタン操作は不要です）。</p>

          <h2>元号の一覧</h2>
          <div className="chart-scroll">
            <table className="rate-chart">
              <caption className="sr-only">元号ごとの期間と年数</caption>
              <thead>
                <tr>
                  <th scope="col">元号</th>
                  <th scope="col">期間（西暦）</th>
                  <th scope="col">年数</th>
                </tr>
              </thead>
              <tbody>
                {ERA_ROWS.map((row) => (
                  <tr key={row.name}>
                    <th scope="row">{row.name}</th>
                    <td>{row.span}</td>
                    <td>{row.years}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>改元があった年の数え方</h2>
          <p>改元の年は、前の元号の最終年と新しい元号の元年（1年）が、同じ西暦の年に重なります。</p>
          <ul>
            <li>1912年：明治45年（7月29日まで）／大正元年（7月30日から）</li>
            <li>1926年：大正15年（12月24日まで）／昭和元年（12月25日から）</li>
            <li>1989年：昭和64年（1月7日まで）／平成元年（1月8日から）</li>
            <li>2019年：平成31年（4月30日まで）／令和元年（5月1日から）</li>
          </ul>

          <h2>履歴書・書類での和暦の書き方</h2>
          <p>
            履歴書・公的書類の生年月日は、和暦で書く欄が多くあります。指定がなければ「昭和」「平成」など<strong>正式名称</strong>で書くのが無難です。
            様式に「S・H・R」などの略号欄があるときは、それに合わせます（明治＝M、大正＝T、昭和＝S、平成＝H、令和＝R）。
            上のツールの「和暦 → 西暦」でも、年の欄にこの略号で「S60.4.1」のように入力できます。
          </p>
          <p>
            書き方の例：<strong>昭和60年4月1日生</strong> ／ <strong>平成10年12月3日生</strong>。
            元号の1年目は「元年」と書くのが正式です（公文書では「令和元年」。実務では「令和1年」も広く使われます）。
          </p>
          <p>
            改元があった年に生まれた人は、<strong>誕生日（出生届の日付）で元号が分かれます</strong>。
            たとえば1989年1月生まれなら、1月7日までが「昭和64年」、1月8日以降が「平成元年」。
            上のツールで「月・日」まで入れると、この境目も正しく判定できます。
          </p>

          <h2>注意点</h2>
          <ul>
            <li>対応は明治以降です（明治元年＝1868年）。それ以前の元号には対応していません。</li>
            <li>明治5年（1872年）以前は旧暦（太陰太陽暦）のため、西暦の年・月日とは正確には一致しません。当ツールは年単位の対応で表示します。</li>
            <li>「今年で◯歳」は、その年に生まれた場合の満年齢の目安です（誕生日前は1つ下がります）。</li>
          </ul>
          <p>本ツールの結果は一般的な変換による目安です。公的書類は各機関の様式に従ってください。結果のご利用によって生じたいかなる損害についても、当サイトは責任を負いかねます。</p>

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
                  { "@type": "ListItem", position: 2, name: "日付" },
                  { "@type": "ListItem", position: 3, name: "和暦・西暦変換" },
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
