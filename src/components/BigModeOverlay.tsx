"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** 大画面表示のフルスクリーン・オーバーレイ。document.body直下にポータルで
 *  描画する（.screenの外）。.screenには表示アニメーション（transformを使う）が
 *  付いており、animation-fill-modeのせいでアニメーション終了後も祖先要素の
 *  computed transformが「none」でなく単位行列のままになることがあり、その場合
 *  position:fixedの子要素のcontaining blockがviewportでなく祖先になってしまう
 *  （＝画面いっぱいに広がらない）。プロトタイプも同じ理由でbody直下に置いていた
 *  ため、タイマー・ストップウォッチ・デジタル時計など複数ツールの大画面表示で
 *  共通して使う。 */
export function BigModeOverlay({
  className,
  ariaLabel,
  children,
}: {
  className: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className={className} role="dialog" aria-modal="true" aria-label={ariaLabel}>
      {children}
    </div>,
    document.body,
  );
}
