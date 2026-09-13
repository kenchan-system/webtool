// 数値入力欄まわりの共通ロジック（プロトタイプの sanitizeNumField /
// formatAmountField の移植）。複数のツール（BMI・税込税抜・割引など）で使う。
import { useState, type ChangeEvent } from "react";

/** 全角数字・全角ピリオドを半角に変換し、数字とピリオド以外を除去。
 *  ピリオドは1つだけ残す（小数OKな入力欄向け：身長・体重・税率など）。 */
export function sanitizeDigits(value: string): string {
  let s = value.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  s = s.replace(/[．。]/g, ".");
  s = s.replace(/[^0-9.]/g, "");
  const i = s.indexOf(".");
  if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, "");
  return s;
}

export function formatThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 小数OKな数値入力欄。キャレット位置をできるだけ保ちながらサニタイズする。 */
export function useSanitizedNumberField(initial = "") {
  const [value, setValue] = useState(initial);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const raw = el.value;
    const sanitized = sanitizeDigits(raw);
    if (sanitized === raw) {
      setValue(sanitized);
      return;
    }
    const caret = (el.selectionStart ?? raw.length) - (raw.length - sanitized.length);
    setValue(sanitized);
    requestAnimationFrame(() => {
      const pos = Math.max(0, caret);
      try {
        el.setSelectionRange(pos, pos);
      } catch {
        /* 一部のinputmodeではselectionRangeが使えないことがある */
      }
    });
  }

  return { value, onChange, setValue };
}

/** 整数のみ・入力しながら3桁区切りのカンマが自動で付く金額欄
 *  （税込税抜・割引などの「金額」入力向け）。状態は常にカンマ抜きの数字文字列。 */
export function useThousandsAmountField(initial = "") {
  const [digits, setDigits] = useState(initial);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const raw = el.value;
    const caret = el.selectionStart ?? raw.length;
    const halfWidth = raw.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
    const digitsBefore = (halfWidth.slice(0, caret).match(/\d/g) || []).length;
    const newDigits = halfWidth.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    setDigits(newDigits);
    const out = formatThousands(newDigits);
    requestAnimationFrame(() => {
      let pos = 0;
      let seen = 0;
      while (pos < out.length && seen < digitsBefore) {
        if (/\d/.test(out[pos])) seen++;
        pos++;
      }
      try {
        el.setSelectionRange(pos, pos);
      } catch {
        /* noop */
      }
    });
  }

  return { digits, display: formatThousands(digits), onChange, setDigits };
}
