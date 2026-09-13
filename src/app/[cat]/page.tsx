import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { CATEGORIES, CAT_BY_SLUG, toolsIn } from "@/lib/tools";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat } = await params;
  const category = CAT_BY_SLUG[cat];
  if (!category) return {};
  return {
    title: `${category.name}の無料ツール一覧`,
    description: category.intro,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const category = CAT_BY_SLUG[cat];
  if (!category) notFound();

  const tools = toolsIn(category.slug);

  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <span>{category.name}</span>
      </nav>
      <h1>{category.name}のツール</h1>
      <div className="cat-lead">
        <span className="cat-kc" aria-hidden="true">
          <KenchanAvatar mood="default" size={60} />
        </span>
        <p className="cat-intro">{category.intro}</p>
      </div>
      <div className="grid" style={{ marginTop: 20 }}>
        {tools.map((t) => (
          <Link key={t.slug} className="tool-card" href={`/tools/${t.slug}`}>
            <div className="row">
              <h3>{t.name}</h3>
              {t.status === "soon" && <span className="badge">準備中</span>}
            </div>
            <p>{t.tagline}</p>
          </Link>
        ))}
        {category.slug === "date" && (
          <p className="cat-note">
            <Link href="/tools/age?jump=grade">学年（何年生）を調べる →</Link>
          </p>
        )}
      </div>
      <div className="ad">
        <span className="tag">広告</span>広告スペース（準備中）
      </div>
    </div>
  );
}
