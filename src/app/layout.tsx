import type { Metadata } from "next";
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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

export const metadata: Metadata = {
  title: {
    default: "システムのケンちゃん｜無料で使える便利ツール集",
    template: "%s - システムのケンちゃん",
  },
  description:
    "身のまわりのちょっとした計算や変換をその場で片づける無料ツール集。BMI・消費税・日付計算など、1ページ1ツールでまとめています。登録不要・すべて無料。",
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
      </body>
    </html>
  );
}
