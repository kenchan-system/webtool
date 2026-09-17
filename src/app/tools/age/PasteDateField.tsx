"use client";

import { useState, type ClipboardEvent } from "react";
import type { YMD } from "@/components/DateYMDField";
import { parsePastedDate } from "@/lib/datePaste";
import { sanitizeIntDigits } from "@/lib/numberInput";

/** 年齢計算で先行導入する、各欄への日付全体の貼り付けに対応した入力。 */
export function PasteDateField({ idPrefix, value, onChange, label }: {
  idPrefix: string;
  value: YMD;
  onChange: (value: YMD) => void;
  label: string;
}) {
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);

  function paste(e: ClipboardEvent<HTMLInputElement>, part: keyof YMD) {
    const text = e.clipboardData.getData("text").normalize("NFKC").trim();
    if (!text) return;
    e.preventDefault();
    if (/^\d+$/.test(text)) {
      if (text.length > (part === "y" ? 4 : 2)) {
        setNotice({ text: "年は4桁、月・日は2桁までで入力してください。日付全体は 2000/9/17 の形式で貼り付けできます。", error: true });
        return;
      }
      onChange({ ...value, [part]: text });
      setNotice(null);
      return;
    }
    const parsed = parsePastedDate(text);
    if (!parsed) {
      setNotice({ text: "日付を読み取れませんでした。1900〜2200年の正しい日付を、2000/9/17 などの形式で貼り付けてください。", error: true });
      return;
    }
    onChange(parsed);
    setNotice({ text: "年月日をまとめて入力しました。", error: false });
  }

  return (
    <div>
      <div className="age-date-fields">
        {(["y", "m", "d"] as const).map((part, i) => (
          <div key={part}>
            <label htmlFor={`${idPrefix}-${part}`}>{["年", "月", "日"][i]}</label>
            <div className="input">
              <input
                id={`${idPrefix}-${part}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                aria-label={`${label}の${["年（西暦）", "月", "日"][i]}`}
                aria-describedby={`${idPrefix}-hint ${idPrefix}-notice`}
                placeholder={["2000", "9", "17"][i]}
                value={value[part]}
                onPaste={(e) => paste(e, part)}
                onChange={(e) => {
                  onChange({ ...value, [part]: sanitizeIntDigits(e.target.value).slice(0, part === "y" ? 4 : 2) });
                  setNotice(null);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="field-hint" id={`${idPrefix}-hint`}>どの欄にも日付をまとめて貼り付けできます。例：2000/9/17、2000年9月17日、平成12年9月17日</p>
      <p id={`${idPrefix}-notice`} className={`age-date-notice${notice?.error ? " age-date-notice--error" : ""}`} role="status" aria-live="polite">{notice?.text}</p>
    </div>
  );
}
