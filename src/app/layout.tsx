import type { Metadata } from "next";
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GA_MEASUREMENT_ID, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import "./globals.css";

// プロトタイプではGoogle Fontsの<link>で読み込んでいたが、Next.jsでは
// next/font/googleでセルフホスト化する（レイアウトシフト対策・配信の安定性向上）。
// CSS変数名（--font-display / --font-body）はプロトタイプのCSSとそろえてある。
const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
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
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
