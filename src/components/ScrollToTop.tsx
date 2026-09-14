"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Next.jsのLinkは「遷移先が今のスクロール位置から見えていれば、
// スクロール位置を維持する」仕様（ヘッダーが sticky でないと、結果的に
// ヘッダー分ずれた中途半端な位置に着地したり、前のページのスクロール量が
// そのまま引き継がれたりする）。ページ遷移のたびに必ず先頭へ戻す。
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
