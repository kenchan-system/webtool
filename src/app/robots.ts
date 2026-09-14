import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

// 「準備中」ツールページはDisallowにしない。noindexメタタグに任せる方針
// （Disallowにするとクローラーがページ自体を読めず、noindexタグも認識できないため）。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
