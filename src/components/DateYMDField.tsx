"use client";

import { useState, type ClipboardEvent } from "react";
import { parsePastedDate } from "@/lib/datePaste";
import { sanitizeIntDigits } from "@/lib/numberInput";

/** 年月日の各欄への手入力と、日付全体の貼り付けに対応した共通入力。 */
export interface YMD {
  y: string;
  m: string;
  d: string;
}

export function DateYMDField({
  idPrefix,
  value,
  onChange,
  yLabel,
  mLabel = "月",
  dLabel = "日",
  yPlaceholder = "2000",
  minYear = 1900,
  maxYear = 2200,
}: {
  idPrefix: string;
  value: YMD;
  onChange: (v: YMD) => void;
  yLabel: string;
  mLabel?: string;
  dLabel?: string;
  yPlaceholder?: string;
  minYear?: number;
  maxYear?: number;
}) {
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);

  function onPaste(e: ClipboardEvent<HTMLInputElement>, part: keyof YMD) {
    const text = e.clipboardData.getData("text").normalize("NFKC").trim();
    if (!text) return;
    e.preventDefault();
    if (/^\d+$/.test(text)) {
      if (text.length > (part === "y" ? 4 : 2)) {
        setNotice({
          text: "年は4桁、月・日は2桁までで入力してください。日付全体は 2000/9/17 の形式で貼り付けできます。",
          error: true,
        });
        return;
      }
      onChange({ ...value, [part]: text });
      setNotice(null);
      return;
    }

    const parsed = parsePastedDate(text, { minYear, maxYear });
    if (!parsed) {
      setNotice({
        text: `日付を読み取れませんでした。${minYear}〜${maxYear}年の正しい日付を、2000/9/17 などの形式で貼り付けてください。`,
        error: true,
      });
      return;
    }
    onChange(parsed);
    setNotice({ text: "年月日をまとめて入力しました。", error: false });
  }

  return (
    <div>
      <div className="date-paste-fields">
        {(["y", "m", "d"] as const).map((part, index) => (
          <div key={part}>
            <label htmlFor={`${idPrefix}-${part}`}>{["年", "月", "日"][index]}</label>
            <div className="input">
              <input
                id={`${idPrefix}-${part}`}
                type="text"
                inputMode="numeric"
                placeholder={[yPlaceholder, "9", "17"][index]}
                autoComplete="off"
                aria-label={[yLabel, mLabel, dLabel][index]}
                aria-describedby={`${idPrefix}-paste-hint ${idPrefix}-paste-notice`}
                value={value[part]}
                onPaste={(e) => onPaste(e, part)}
                onChange={(e) => {
                  onChange({
                    ...value,
                    [part]: sanitizeIntDigits(e.target.value).slice(0, part === "y" ? 4 : 2),
                  });
                  setNotice(null);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="field-hint" id={`${idPrefix}-paste-hint`}>
        どの欄にも日付をまとめて貼り付けできます。例：2000/9/17、2000年9月17日、平成12年9月17日
      </p>
      <p
        id={`${idPrefix}-paste-notice`}
        className={`date-paste-notice${notice?.error ? " date-paste-notice--error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice?.text}
      </p>
    </div>
  );
}
