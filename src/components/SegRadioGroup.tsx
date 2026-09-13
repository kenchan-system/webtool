"use client";

import { useRef } from "react";

export interface SegOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

/** プロトタイプの `.seg` ラジオグループ（makeRadio/radioSet）の移植。
 *  クリックに加えて矢印キー・Home/End・roving tabindexに対応。
 *  税込税抜の「計算の向き」「税率」、割引率、和暦⇔西暦の向きなど、
 *  複数のツールで再利用する共通コンポーネント。 */
export function SegRadioGroup<T extends string>({
  id,
  ariaLabel,
  ariaLabelledBy,
  options,
  value,
  onChange,
  className = "seg",
  optionClassName,
}: {
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  options: SegOption<T>[];
  value: T;
  onChange: (v: T) => void;
  /** ラッパーdivのクラス（既定は".seg"）。タイマーの選択肢グリッドなど、別デザインで再利用する場合に指定。 */
  className?: string;
  /** 各ボタンのクラス（既定は指定なし＝".seg button"のスタイルに従う）。 */
  optionClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const btns = Array.from(
      wrapRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
    );
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    let n: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % btns.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + btns.length) % btns.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = btns.length - 1;
    if (n === null) return;
    e.preventDefault();
    onChange(options[n].value);
    btns[n].focus();
  }

  return (
    <div
      className={className}
      id={id}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      ref={wrapRef}
      onKeyDown={onKeyDown}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          className={optionClassName}
          aria-checked={opt.value === value}
          tabIndex={opt.value === value ? 0 : -1}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
