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
            ツールの不具合、ご意見・ご要望、掲載内容の誤りのご指摘などは、下記のメールアドレスまでご連絡ください。
          </p>
          <p>
            <a href="mailto:info@kenchan-system.com">info@kenchan-system.com</a>
          </p>
          <p>内容を確認のうえ、順次対応いたします。返信までお時間をいただく場合がありますので、あらかじめご了承ください。</p>
        </div>
      </div>
    </div>
  );
}
