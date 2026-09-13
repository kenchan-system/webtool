"use client";

import { useState } from "react";

/** 結果をコピーするボタン（.copy-btn）。プロトタイプの各ツールで繰り返し
 *  使われていたコピー処理（Clipboard API→execCommandフォールバック、
 *  1.4秒だけ「コピーしました」表示）をそのまま移植した共通コンポーネント。 */
export function CopyButton({ text, label = "結果をコピー" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    function done() {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
    function fallback() {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) done();
      } catch {
        /* noop */
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        done();
      } catch {
        fallback();
      }
    } else {
      fallback();
    }
  }

  return (
    <button type="button" className={"copy-btn" + (copied ? " copied" : "")} onClick={handleClick}>
      {copied ? "コピーしました" : label}
    </button>
  );
}
