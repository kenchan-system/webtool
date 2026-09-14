import Link from "next/link";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { CATEGORIES_PUBLISHED, toolsIn, newestTools } from "@/lib/tools";
import { AdSlot } from "@/components/AdSlot";

export default function TopPage() {
  const quick = newestTools();

  return (
    <div className="screen screen-top">
      <div className="top-intro">
        <h1 id="top-h1">無料で使える便利ツール集</h1>
        <div className="top-intro-row">
          <span className="top-kc" aria-hidden="true">
            <KenchanAvatar mood="default" size={96} />
          </span>
          <div className="top-intro-body">
            <p className="lede">
              「システムのケンちゃん」は、身のまわりのちょっとした作業をその場で片づけるツール集です。
              会員登録もインストールも不要。ページを開いて入力するだけで、案内役のケンちゃんが結果をわかりやすく教えてくれます。
              BMIや消費税、日数計算など、よく使うものをそろえています。
            </p>
            {quick.length > 0 && (
              <div className="quick-tools">
                <span className="quick-tools-label">新着ツール</span>
                {quick.map((t) => (
                  <Link key={t.slug} className="quick-tool" href={`/tools/${t.slug}`}>
                    {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="top-cats">
        {CATEGORIES_PUBLISHED.map((c) => (
          <div key={c.slug} className={`cat-block cat-${c.slug}`}>
            <div className="cat-head">
              <h2>
                <Link href={`/${c.slug}`}>{c.name}</Link>
              </h2>
              <p>{c.tagline}</p>
            </div>
            <div className="grid">
              {toolsIn(c.slug).map((t) => (
                <Link key={t.slug} className="tool-card" href={`/tools/${t.slug}`}>
                  <div className="row">
                    <h3>{t.name}</h3>
                    {t.status === "soon" && <span className="badge">準備中</span>}
                  </div>
                  <p>{t.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AdSlot />

      <section className="about-block" aria-labelledby="about-h2">
        <h2 id="about-h2">このサイトについて</h2>
        <p>
          日常でよくある「これ、いくら？」「何日ある？」といった小さな困りごとを、専門知識なしで解決できることを目指しています。
          各ツールには計算方法・注意点・よくある質問を添え、出典があるものは明記しています。
          運営方針や更新履歴は<Link href="/about">運営者情報</Link>に、ご利用にあたっては
          <Link href="/terms">利用規約</Link>・<Link href="/privacy">プライバシーポリシー</Link>もあわせてご確認ください。
        </p>
      </section>
    </div>
  );
}
