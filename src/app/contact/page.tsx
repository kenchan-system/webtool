import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

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
          <p>ツールの不具合、ご意見・ご要望、掲載内容の誤りのご指摘などは、下記のフォームよりご連絡ください。</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
