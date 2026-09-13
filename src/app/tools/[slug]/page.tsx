import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KenchanFull } from "@/components/KenchanAvatar";
import { CAT_BY_SLUG, findTool } from "@/lib/tools";

// 実ページが存在するツール（例: app/tools/bmi/page.tsx）は、Next.jsのルーティングで
// このcatch-allより優先して一致するため、ここに来るのは「まだ実装していないツール」
// だけになる。カタログに無いslugは404。

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.tagline,
    robots: { index: false, follow: true },
  };
}

export default async function SoonToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) notFound();

  const category = CAT_BY_SLUG[tool.cat];

  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/${tool.cat}`}>{category?.name}</Link>
        <span aria-hidden="true">›</span>
        <span>{tool.name}</span>
      </nav>
      <h1>{tool.name}</h1>
      <p className="lede">{tool.tagline}</p>
      <div className="soon">
        <KenchanFull height={120} />
        <p className="lead">このツールは準備中です</p>
        <p>近日公開予定です。しばらくお待ちください。</p>
        <Link className="chip" href={`/${tool.cat}`}>
          「{category?.name}」の他のツールを見る
        </Link>
      </div>
    </div>
  );
}
