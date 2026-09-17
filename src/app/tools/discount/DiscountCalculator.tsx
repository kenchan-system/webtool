"use client";

import { useEffect, useMemo, useState } from "react";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { CopyButton } from "@/components/CopyButton";
import { useSanitizedNumberField, useThousandsAmountField } from "@/lib/numberInput";
import { computeDiscount, discFmt, nearestDiscChartIndex, type DiscRateChoice } from "./lib";

const DEBOUNCE_MS = 180;

export function DiscountCalculator() {
  const [rateChoice, setRateChoice] = useState<DiscRateChoice>("10");
  const customRate = useSanitizedNumberField("");
  const list = useThousandsAmountField("");

  const [debounced, setDebounced] = useState({ digits: "", rateChoice, custom: "" });
  useEffect(() => {
    const delay = list.digits === "" ? 0 : DEBOUNCE_MS;
    const t = setTimeout(() => {
      setDebounced({ digits: list.digits, rateChoice, custom: customRate.value });
    }, delay);
    return () => clearTimeout(t);
  }, [list.digits, rateChoice, customRate.value]);

  const result = useMemo(
    () => computeDiscount(debounced.digits, debounced.rateChoice, debounced.custom),
    [debounced],
  );

  return (
    <>
      <h2 className="sr-only">割引の計算ツール</h2>
      <div className="tool-panel">
        <div className="tool-input">
          <p className="panel-label">
            <span className="step" aria-hidden="true">1</span>定価と割引率を入力
          </p>
          <div className="fields">
            <div className="field">
              <label htmlFor="disc-list">定価</label>
              <div className="input">
                <input
                  id="disc-list"
                  type="text"
                  inputMode="numeric"
                  placeholder="1,000"
                  autoComplete="off"
                  value={list.display}
                  onChange={list.onChange}
                />
                <span>円</span>
              </div>
            </div>
            <div className="field">
              <label id="disc-rate-label">割引率</label>
              <SegRadioGroup
                ariaLabelledBy="disc-rate-label"
                value={rateChoice}
                onChange={setRateChoice}
                options={[
                  { value: "10", label: "10%" },
                  { value: "20", label: "20%" },
                  { value: "30", label: "30%" },
                  { value: "50", label: "半額" },
                  { value: "custom", label: "その他" },
                ]}
              />
              {rateChoice === "custom" && (
                <div className="input" style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="15"
                    autoComplete="off"
                    aria-label="任意の割引率（パーセント）"
                    value={customRate.value}
                    onChange={customRate.onChange}
                  />
                  <span>%</span>
                </div>
              )}
            </div>
          </div>
          <p className="field-hint">数字を入力すると桁区切りが自動で付きます。割引額の1円未満は切り捨てです。</p>
        </div>
        <div className="tool-output">
          <p className="panel-label">
            <span className="step" aria-hidden="true">2</span>結果
          </p>
          <div className="result" aria-live="polite">
            <DiscountResultView result={result} />
          </div>
        </div>
      </div>
      <RateChartHighlighter result={result} />
    </>
  );
}

function DiscountResultView({ result }: { result: ReturnType<typeof computeDiscount> }) {
  if (result.kind === "idle") {
    return (
      <div className="result-row">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="default" size={44} />
        </span>
        <div className="kc-body">
          <p className="result-need">定価を入力してください。</p>
          <p className="result-eg">例）定価1,000円 × 10％OFF → 割引後900円</p>
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

  const { list, disc, final, pctLabel, msg, srText, copyText } = result;

  return (
    <div className="result-card">
      <div className="tax-answer" aria-hidden="true">
        <span className="tax-answer-k">割引後価格</span>
        <span className="tax-answer-v">{discFmt(final)}円</span>
      </div>
      <CopyButton text={copyText} />
      <dl className="tax-breakdown" aria-hidden="true">
        <div>
          <dt>定価</dt>
          <dd>{discFmt(list)}円</dd>
        </div>
        <div>
          <dt>割引額（{pctLabel}）</dt>
          <dd>{discFmt(disc)}円</dd>
        </div>
        <div className="is-answer">
          <dt>割引後価格</dt>
          <dd>{discFmt(final)}円</dd>
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

/** 早見表（ドキュメント内）の、計算結果に近い行へ薄く印をつける連動。 */
function RateChartHighlighter({ result }: { result: ReturnType<typeof computeDiscount> }) {
  useEffect(() => {
    const chart = document.querySelector(".rate-chart");
    if (!chart) return;
    const prev = chart.querySelector("tr.is-hit");
    prev?.classList.remove("is-hit");
    if (result.kind !== "success") return;
    const idx = nearestDiscChartIndex(result.list);
    if (idx < 0) return;
    const row = chart.querySelectorAll("tbody tr")[idx];
    row?.classList.add("is-hit");
  }, [result]);
  return null;
}
