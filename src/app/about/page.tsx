import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営者情報",
  description: "無料ツール集「システムのケンちゃん」の運営者情報・サイトの目的・お問い合わせ・更新履歴。",
};

export default function AboutPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <span>運営者情報</span>
      </nav>
      <h1>運営者情報</h1>
      <div className="legal-doc">
        <p className="legal-date">最終更新日：2026年9月11日</p>
        <div className="prose">
          <h2>サイトについて</h2>
          <p>
            「システムのケンちゃん」は、身のまわりのちょっとした計算・変換・作業を、その場で片づけるための無料ツール集です。
            会員登録もインストールも不要で、ページを開いて入力するだけで結果が出ることを目指しています。
            各ツールには計算方法・注意点・よくある質問を添え、出典があるものは明記しています。
          </p>

          <h2>運営者</h2>
          <p>
            個人で企画・制作・運営しています（運営者名：ケンちゃん運営）。
            正式公開に合わせて、この欄に運営者の情報を追記する予定です。
          </p>

          <h2>開設</h2>
          <p>2026年（試作・準備中）</p>

          <h2>お問い合わせ</h2>
          <p>
            ご意見・ご指摘・掲載内容の誤りのご連絡は、<Link href="/contact">お問い合わせ</Link>ページよりお願いします。
          </p>

          <h2>免責</h2>
          <p>
            各ツールの結果は一般的な計算・変換による目安であり、専門的な判断（健康・医療、税務、法務、金銭など）の代替となるものではありません。
            詳しくは<Link href="/terms">利用規約</Link>および<Link href="/privacy">プライバシーポリシー</Link>をご確認ください。
          </p>

          <h2>更新履歴</h2>
          <ul>
            <li>2026年9月　Next.js版の開発を開始</li>
            <li>2026年　サイト開設（試作）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
