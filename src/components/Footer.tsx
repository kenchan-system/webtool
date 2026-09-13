import Link from "next/link";
import { CATEGORIES, catHasLiveTools } from "@/lib/tools";

/** 稼働ツールが1つもないカテゴリ（＝中身が「準備中」だけ）はリンクを出さない。
 *  プロトタイプではHTMLコメントで対応していたのと同じ意図を、データ駆動で
 *  常に正しく保つ（カテゴリの最初の1本を live にした瞬間、自動的に出てくる）。 */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page">
        <nav aria-label="フッター">
          {CATEGORIES.filter((c) => catHasLiveTools(c.slug)).map((c) => (
            <Link key={c.slug} href={`/${c.slug}`}>
              {c.name}
            </Link>
          ))}
          <span className="footer-right">
            <Link href="/about">運営者情報</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/terms">利用規約</Link>
            <Link href="/contact">お問い合わせ</Link>
          </span>
        </nav>
        <small>&copy; 2026 システムのケンちゃん</small>
      </div>
    </footer>
  );
}
