import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "「システムのケンちゃん」のプライバシーポリシー。アクセス解析・広告配信・Cookieの取り扱いについて。",
};

export default function PrivacyPage() {
  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <span>プライバシーポリシー</span>
      </nav>
      <h1>プライバシーポリシー</h1>
      <div className="legal-doc">
        <p className="legal-date">最終更新日：2026年9月8日</p>
        <div className="prose">
          <h2>1. 基本方針</h2>
          <p>
            当サイト「システムのケンちゃん」（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報および閲覧情報を適切に取り扱います。
            本ポリシーは、当サイトが提供するすべてのツールおよびページに適用されます。
          </p>

          <h2>2. 取得する情報</h2>
          <h3>ツールに入力された内容</h3>
          <p>
            各ツールに入力された数値・文章・画像などは、原則として利用者のブラウザ内で処理され、当サイトのサーバーへ送信・保存されることはありません。
          </p>
          <h3>アクセス情報</h3>
          <p>
            当サイトはアクセス状況を把握するため、Cookie などを利用して、閲覧されたページ、参照元、ブラウザの種類、IPアドレス、滞在時間などの情報を収集します。
            これらは統計的に利用され、個人を特定するものではありません。
          </p>

          <h2>3. Cookie について</h2>
          <p>当サイトでは、次の目的で Cookie を使用します。</p>
          <ul>
            <li>アクセス解析（利用状況の把握とサイト改善）</li>
            <li>広告配信（利用者に合わせた広告の表示）</li>
            <li>一部ツールでの設定や入力内容の一時的な保持（利用者の端末内のみ）</li>
          </ul>
          <p>利用者はブラウザの設定により Cookie を無効化できます。その場合、一部の機能が正しく動作しないことがあります。</p>

          <h2>4. アクセス解析ツールについて</h2>
          <p>
            当サイトは、アクセス解析ツールとして Google LLC が提供する「Google アナリティクス（GA4）」を利用します。
            Google アナリティクスは Cookie を使用して情報を収集します。収集される情報の取り扱いは、Google のプライバシーポリシー
            （
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>
            ）に従います。利用者は、ブラウザアドオン等により Google アナリティクスによる計測を無効化できます。
          </p>

          <h2>5. 広告配信について</h2>
          <p>
            当サイトは、第三者配信の広告サービス「Google AdSense」を利用する場合があります。
            Google を含む第三者配信事業者は、Cookie を使用して、利用者の当サイトや他サイトへの過去のアクセス情報に基づいた広告を表示することがあります。
          </p>
          <p>
            パーソナライズド広告は、Google の広告設定（
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
              adssettings.google.com
            </a>
            ）で無効にできます。また、第三者配信事業者による Cookie の使用は（
            <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
              optout.aboutads.info
            </a>
            ／英語）でオプトアウトできます。
          </p>

          <h2>6. 同意の管理（EEA・英国等の利用者）</h2>
          <p>
            欧州経済領域（EEA）、英国、スイスなどからアクセスした利用者に対しては、Cookie の使用および広告のパーソナライズについて同意を確認するメッセージを表示し、
            利用者の選択に従って Cookie の利用を制御します。
          </p>

          <h2>7. 第三者への提供</h2>
          <p>
            当サイトは、法令に基づく場合を除き、取得した情報を第三者に提供しません。
            ただし、上記のアクセス解析・広告配信に必要な範囲で、各サービス提供者に情報が送信されることがあります。
          </p>

          <h2>8. 免責事項</h2>
          <p>
            当サイトの各ツールが表示する結果の正確性・完全性・有用性について、当サイトは保証しません。
            当サイトの利用によって生じたいかなる損害についても、当サイトは責任を負いかねます。
          </p>
          <p>当サイトからリンクする外部サイトの内容やプライバシーの取り扱いについて、当サイトは責任を負いません。</p>

          <h2>9. 本ポリシーの変更</h2>
          <p>当サイトは、必要に応じて本ポリシーを変更することがあります。変更後の内容は、当ページに掲載した時点で効力を生じます。</p>

          <h2>10. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、<Link href="/contact">お問い合わせ</Link>ページよりご連絡ください。
          </p>
        </div>
      </div>
    </div>
  );
}
