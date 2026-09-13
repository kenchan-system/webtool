"use client";

import type { ChangeEvent } from "react";
import { sanitizeDigits } from "@/lib/numberInput";

/** 年(text)＋月(select)＋日(select) の日付入力。プロトタイプの
 *  dateFieldHTML() を移植した共通コンポーネント（年齢・日数計算などで再利用）。 */
export interface YMD {
  y: string;
  m: string;
  d: string;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function DateYMDField({
  idPrefix,
  value,
  onChange,
  yLabel,
  mLabel = "月",
  dLabel = "日",
  yPlaceholder = "2000",
}: {
  idPrefix: string;
  value: YMD;
  onChange: (v: YMD) => void;
  yLabel: string;
  mLabel?: string;
  dLabel?: string;
  yPlaceholder?: string;
}) {
  function onYChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = sanitizeDigits(e.target.value).replace(/\./g, "").slice(0, 4);
    onChange({ ...value, y: digits });
  }

  return (
    <div className="input date-input">
      <input
        id={`${idPrefix}-y`}
        type="text"
        inputMode="numeric"
        placeholder={yPlaceholder}
        autoComplete="off"
        aria-label={yLabel}
        value={value.y}
        onChange={onYChange}
      />
      <span>年</span>
      <select
        id={`${idPrefix}-m`}
        aria-label={mLabel}
        value={value.m}
        onChange={(e) => onChange({ ...value, m: e.target.value })}
      >
        <option value="">–月</option>
        {MONTHS.map((mm) => (
          <option key={mm} value={mm}>
            {mm}月
          </option>
        ))}
      </select>
      <select
        id={`${idPrefix}-d`}
        aria-label={dLabel}
        value={value.d}
        onChange={(e) => onChange({ ...value, d: e.target.value })}
      >
        <option value="">–日</option>
        {DAYS.map((dd) => (
          <option key={dd} value={dd}>
            {dd}日
          </option>
        ))}
      </select>
    </div>
  );
}
