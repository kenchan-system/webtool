import Link from "next/link";
import Image from "next/image";
import { CATEGORIES_PUBLISHED } from "@/lib/tools";

export function Header() {
  return (
    <header className="site-header">
      <div className="page brand-row">
        <Link className="brand" href="/">
          <span className="brand-tagline">無料で使える便利ツール集</span>
          <Image
            className="brand-logo"
            src="/kenchan/logo.png"
            alt="システムのケンちゃん"
            width={450}
            height={99}
            style={{ height: 72, width: "auto" }}
            priority
          />
        </Link>
      </div>
      <nav className="gnav" aria-label="カテゴリ">
        <div className="page gnav-inner">
          {CATEGORIES_PUBLISHED.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
