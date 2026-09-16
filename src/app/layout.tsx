import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GA_MEASUREMENT_ID, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

// 見出し（--font-display）だけnext/font/googleでセルフホストする。
// 本文（--font-body）はWebフォントをやめ、globals.cssの:rootでOS標準の
// 日本語フォントスタックを指定している。日本語Webフォントはウェイトごとに
// Unicode範囲別の分割ファイルが大量に生成され、本文のように広い漢字を使う
// 箇所ではページあたり150件超のフォントリクエストが発生していたため。
const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-display",
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
    <html lang="ja" className={zenMaruGothic.variable}>
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
