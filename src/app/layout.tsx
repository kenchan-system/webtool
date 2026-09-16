import type { Metadata } from "next";
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GA_MEASUREMENT_ID, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

// プロトタイプではGoogle Fontsの<link>で読み込んでいたが、Next.jsでは
// next/font/googleでセルフホスト化する（レイアウトシフト対策・配信の安定性向上）。
// CSS変数名（--font-display / --font-body）はプロトタイプのCSSとそろえてある。
//
// ウェイトは実際にCSSで使われているものだけに絞っている（軽量化）。
// 日本語グリフを含む書体はウェイトごとにUnicode範囲別の分割ファイルが
// 大量に生成されるため、使っていないウェイトを1つ削るだけでも転送量への
// 影響が大きい。実測（全ページの computed font-weight を確認）の結果：
// - Zen Maru Gothic（--font-display）は 700 のみ使用（500は未使用）
// - Zen Kaku Gothic New（--font-body）は 400・700 が主。500はヘッダーの
//   .brand-tagline 1箇所のみだったため、そちらを400に変更して500ごと削減した
const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const DEFAULT_TITLE = "システムのケンちゃん｜無料で使える便利ツール集";
const DEFAULT_DESCRIPTION =
  "身のまわりのちょっとした計算や変換をその場で片づける無料ツール集。BMI・消費税・日付計算など、1ページ1ツールでまとめています。登録不要・すべて無料。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s - システムのケンちゃん",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [`/og?title=${encodeURIComponent(SITE_NAME)}&tagline=${encodeURIComponent("無料で使える便利ツール集")}`],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenMaruGothic.variable} ${zenKakuGothicNew.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          メインコンテンツへスキップ
        </a>
        <ScrollToTop />
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
