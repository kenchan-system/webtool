import { SITE_URL } from "./siteConfig";

export interface BreadcrumbEntry {
  name: string;
  /** SITE_URLからの絶対パス（例："/", "/calc", "/tools/bmi"） */
  path: string;
}

/** BreadcrumbList構造化データを組み立てる。各itemListElementに絶対URLの
 *  itemを付与する（Search Consoleの「項目『item』がありません」エラー対策）。 */
export function breadcrumbJsonLd(entries: BreadcrumbEntry[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: `${SITE_URL}${entry.path}`,
    })),
  };
}
