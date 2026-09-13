import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "「システムのケンちゃん」へのお問い合わせ窓口のご案内。",
};

export default function ContactPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <span>お問い合わせ</span>
      </nav>
      <h1>お問い合わせ</h1>
      <div className="legal-doc">
        <div className="prose">
          <p>
            お問い合わせ窓口は準備中です。サイトの正式公開に合わせて、お問い合わせフォームまたは連絡用のメールアドレスをこのページに掲載します。
          </p>
        </div>
      </div>
    </div>
  );
}
