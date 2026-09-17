"use client";

import { useEffect, useMemo, useState } from "react";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { CopyButton } from "@/components/CopyButton";
import { useSanitizedNumberField, useThousandsAmountField } from "@/lib/numberInput";
import { computeTax, nearestRateChartIndex, type TaxDir, type TaxRateChoice } from "./lib";

const DEBOUNCE_MS = 180;

export function TaxCalculator() {
  const [dir, setDir] = useState<TaxDir>("add");
  const [rateChoice, setRateChoice] = useState<TaxRateChoice>("10");
  const customRate = useSanitizedNumberField("");
  const amount = useThousandsAmountField("");

  const [debounced, setDebounced] = useState({ digits: "", dir, rateChoice, custom: "" });
  useEffect(() => {
    const delay = amount.digits === "" ? 0 : DEBOUNCE_MS;
    const t = setTimeout(() => {
      setDebounced({ digits: amount.digits, dir, rateChoice, custom: customRate.value });
    }, delay);
    return () => clearTimeout(t);
  }, [amount.digits, dir, rateChoice, customRate.value]);

  const result = useMemo(
    () => computeTax(debounced.digits, debounced.dir, debounced.rateChoice, debounced.custom),
    [debounced],
  );

  const amountLabel = dir === "add" ? "税抜金額" : "税込金額";
  const amountPlaceholder = dir === "add" ? "1,000" : "1,100";

  return (
    <>
      <h2 className="sr-only">消費税の計算ツール</h2>
      <div className="tool-panel">
        <div className="tool-input">
          <p className="panel-label">
            <span className="step" aria-hidden="true">1</span>金額と条件を入力
          </p>
          <div className="fields">
            <div className="field">
              <label id="tax-dir-label">計算の向き</label>
              <SegRadioGroup
                ariaLabelledBy="tax-dir-label"
                value={dir}
                onChange={setDir}
                options={[
                  { value: "add", label: "税抜 → 税込" },
                  { value: "sub", label: "税込 → 税抜" },
                ]}
              />
            </div>
            <div className="field">
              <label htmlFor="tax-amount">{amountLabel}</label>
              <div className="input">
                <input
                  id="tax-amount"
                  type="text"
                  inputMode="numeric"
                  placeholder={amountPlaceholder}
                  autoComplete="off"
                  value={amount.display}
                  onChange={amount.onChange}
                />
                <span>円</span>
              </div>
            </div>
            <div className="field">
              <label id="tax-rate-label">税率</label>
              <SegRadioGroup
                ariaLabelledBy="tax-rate-label"
                value={rateChoice}
                onChange={setRateChoice}
                options={[
                  { value: "10", label: "10%" },
                  { value: "8", label: "8%（軽減）" },
                  { value: "custom", label: "その他" },
                ]}
              />
              {rateChoice === "custom" && (
                <div className="input" style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="5"
                    autoComplete="off"
                    aria-label="任意の税率（パーセント）"
                    value={customRate.value}
                    onChange={customRate.onChange}
                  />
                  <span>%</span>
                </div>
              )}
            </div>
          </div>
          <p className="field-hint">数字を入力すると桁区切りが自動で付きます。消費税額の1円未満は切り捨てです。</p>
        </div>
        <div className="tool-output">
          <p className="panel-label">
            <span className="step" aria-hidden="true">2</span>結果
          </p>
          <div className="result" aria-live="polite">
            <TaxResultView result={result} />
          </div>
        </div>
      </div>
      <RateChartHighlighter result={result} />
    </>
  );
}

function TaxResultView({ result }: { result: ReturnType<typeof computeTax> }) {
  if (result.kind === "idle") {
    return (
      <div className="result-row">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="default" size={44} />
        </span>
        <div className="kc-body">
          <p className="result-need">金額を入力してください。</p>
          <p className="result-eg">例）税抜1,000円 ×1.10 → 税込1,100円</p>
        </div>
      </div>
    );
  }

  if (result.kind === "error") {
    return (
      <div className="result-row">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="error" size={44} />
        </span>
        <div className="kc-body">
          <p className="result-warn">{result.message}</p>
        </div>
      </div>
    );
  }

  const { ex, tax, inc, rateLabel, ansK, ansV, msg, srText, copyText, isAdd } = result;

  return (
    <div className="result-card">
      <div className="tax-answer" aria-hidden="true">
        <span className="tax-answer-k">{ansK}</span>
        <span className="tax-answer-v">{taxFmtDisplay(ansV)}円</span>
      </div>
      <CopyButton text={copyText} />
      <dl className="tax-breakdown" aria-hidden="true">
        <div className={isAdd ? "" : "is-answer"}>
          <dt>税抜</dt>
          <dd>{taxFmtDisplay(ex)}円</dd>
        </div>
        <div>
          <dt>消費税（{rateLabel}）</dt>
          <dd>{taxFmtDisplay(tax)}円</dd>
        </div>
        <div className={isAdd ? "is-answer" : ""}>
          <dt>税込</dt>
          <dd>{taxFmtDisplay(inc)}円</dd>
        </div>
      </dl>
      <div className="kc">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="default" size={52} />
        </span>
        <span className="kc-bubble">
          <span className="kc-name">ケンちゃんのひとこと</span>
          <span className="kc-text">{msg}</span>
        </span>
      </div>
      <p className="sr-only">{srText}</p>
    </div>
  );
}

function taxFmtDisplay(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

/** 早見表（ドキュメント内）の、計算結果に近い行へ薄く印をつける連動。 */
function RateChartHighlighter({ result }: { result: ReturnType<typeof computeTax> }) {
  useEffect(() => {
    const chart = document.querySelector(".rate-chart");
    if (!chart) return;
    const prev = chart.querySelector("tr.is-hit");
    prev?.classList.remove("is-hit");
    if (result.kind !== "success") return;
    const idx = nearestRateChartIndex(result.ex);
    if (idx < 0) return;
    const row = chart.querySelectorAll("tbody tr")[idx];
    row?.classList.add("is-hit");
  }, [result]);
  return null;
}
