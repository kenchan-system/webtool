import Link from "next/link";
import type { Metadata } from "next";
import { CalendarClient } from "./CalendarClient";
import { AdSlot } from "@/components/AdSlot";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "カレンダー｜祝日つきの月間・年間カレンダーを表示・印刷",
  description:
    "祝日つきの月間・年間カレンダーを表示・印刷できます。週の始まり（日曜／月曜）や週番号、六曜（大安・仏滅など）の表示切り替えにも対応。無料・登録不要。",
  openGraph: {
    images: [`/og?title=${encodeURIComponent("カレンダー")}&tagline=${encodeURIComponent("祝日つきの月間・年間カレンダーを表示・印刷できます。")}`],
  },
};

const FAQ = [
  {
    q: "今年の祝日はいくつありますか？",
    a: "「祝日一覧」に、表示中の年の祝日をすべて挙げています。年月を移動すると、その年の一覧に切り替わります。",
  },
  {
    q: "来年のカレンダーを印刷できますか？",
    a: "できます。年・月を来年に移動してから「印刷」を押してください。1年ぶんまとめて印刷したいときは「年表示」に切り替えてください。",
  },
  {
    q: "週の始まりを月曜に変えられますか？",
    a: "「週の始まり」で日曜始まり・月曜始まりを切り替えられます。",
  },
  {
    q: "六曜（大安・仏滅など）は表示できますか？",
    a: "「六曜」をオンにすると、日付ごとに先勝・友引・先負・仏滅・大安・赤口を表示します。",
  },
];

export default function CalendarPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/date">日付</Link>
        <span aria-hidden="true">›</span>
        <span>カレンダー</span>
      </nav>

      <div className="tool-head">
        <h1>カレンダー</h1>
        <p className="lede">祝日つきの月間・年間カレンダーを表示・印刷できます。</p>
      </div>

      <CalendarClient />

      <AdSlot />

      <div className="tool-doc">
        <p className="doc-eyebrow">このツールについて</p>
        <p className="doc-updated">最終更新：2026年9月</p>
        <div className="prose">
          <h2>このツールでできること</h2>
          <p>
            月間・年間のカレンダーを、祝日つきで表示します。週の始まり（日曜／月曜）や週番号、六曜（大安・仏滅など）の表示を切り替えられ、そのまま印刷にも対応しています。
          </p>

          <h2>使い方</h2>
          <ol>
            <li>「‹」「›」または年・月の欄で、見たい年月に移動します。</li>
            <li>「月表示」「年表示」で、1か月ぶんか、1年ぶん（12か月）かを切り替えます。</li>
            <li>週の始まり・週番号・六曜の表示は、お好みで切り替えられます。</li>
            <li>「印刷」から、そのまま印刷できます。</li>
          </ol>

          <h2>祝日について</h2>
          <p>
            「国民の祝日に関する法律」にもとづき、固定の祝日（元日・憲法記念日など）とハッピーマンデー制度の祝日（成人の日・海の日・敬老の日・スポーツの日）、春分の日・秋分の日（計算式による近似）、振替休日、国民の休日を自動で計算しています。
            2019年の即位にともなう祝日や、2020・2021年のオリンピックにともなう祝日移動など、法律による一時的な変更も反映しています。
          </p>

          <h2>六曜について</h2>
          <p>
            「六曜」をオンにすると、各日に先勝・友引・先負・仏滅・大安・赤口を表示します（大安は太字で目立たせています）。
            六曜は旧暦の月日から「（月＋日）÷6の余り」で機械的に決まるもので、冠婚葬祭の日取りの参考によく使われます。占いや吉凶を保証するものではありません。
          </p>

          <h2>週番号について</h2>
          <p>「週番号」をオンにすると、各週の左にISO 8601にもとづく通し番号（1年を通じて1〜52／53）を表示します。納期管理や製造業の帳票などで使われる表記です。</p>

          <h2>印刷のコツ</h2>
          <p>
            「印刷」ボタン、またはブラウザの印刷機能（Ctrl+P／Cmd+P）で、ナビゲーションや広告を除いたカレンダーだけをきれいに印刷できます。年表示は用紙を横向きにすると収まりやすくなります。
          </p>

          <h2>注意点</h2>
          <ul>
            <li>春分の日・秋分の日は計算式による近似です（実際の日付は前年2月ごろ、国立天文台の発表で確定します）。1980〜2099年の範囲でおおむね正確です。</li>
            <li>特例法による一時的な祝日の移動（オリンピック・即位関連など）は、判明している分のみ反映しています。将来、新たな特例が決まった場合はこの限りではありません。</li>
            <li>六曜は旧暦（太陰太陽暦）への変換にもとづきます。1900〜2100年の範囲でおおむね正確ですが、旧暦の計算方法の違いにより、ごくまれに他のカレンダーと1日ずれることがあります。</li>
          </ul>
          <p>本ツールの祝日情報は一般的な目安です。正式な祝日は内閣府の発表をご確認ください。六曜も参考情報であり、日取りの最終判断は各家庭や地域の慣習・寺社仏閣などにご確認ください。</p>

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
                  { name: "カレンダー", path: "/tools/calendar" },
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
