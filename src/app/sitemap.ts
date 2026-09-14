import type { MetadataRoute } from "next";
import { CATEGORIES_PUBLISHED, TOOLS } from "@/lib/tools";
import { SITE_URL } from "@/lib/siteConfig";

// ツールを1件liveにするだけでサイトマップにも自動反映される（手動更新不要）。
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/contact", "/privacy", "/terms"];
  const staticEntries = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
  }));

  const categoryEntries = CATEGORIES_PUBLISHED.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: new Date(),
  }));

  const toolEntries = TOOLS.filter((t) => t.status === "live").map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...categoryEntries, ...toolEntries];
}
