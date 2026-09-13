"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { computeBmi, gaugePct, sanitizeDigits } from "./lib";

/** 全角数字などをその場でサニタイズしつつ、キャレット位置をできるだけ保つ
 *  入力欄。プロトタイプの sanitizeNumField の移植（コントロールド入力版）。 */
function useSanitizedNumberField(initial = "") {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  return { value, onChange, ref };
}

const DEBOUNCE_MS = 180;

export function BmiCalculator() {
  const hField = useSanitizedNumberField("");
  const wField = useSanitizedNumberField("");

  // 計算はほぼ一瞬で終わるので、debounceは「正直な読み込み中表示」のためではなく、
  // 入力中に結果がちらつかないようにするための実時間のディレイ。
  // 空欄になった場合は即座に（ディレイなしで）idle表示に戻す。
  const [debounced, setDebounced] = useState({ h: "", w: "" });
  useEffect(() => {
    if (hField.value.trim() === "" || wField.value.trim() === "") {
      setDebounced({ h: hField.value, w: wField.value });
      return;
    }
    const t = setTimeout(() => {
      setDebounced({ h: hField.value, w: wField.value });
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hField.value, wField.value]);

  const result = useMemo(() => computeBmi(debounced.h, debounced.w), [debounced]);

  return (
    <>
      <h2 className="sr-only">計算ツール</h2>
      <div className="tool-panel">
        <div className="tool-input">
          <p className="panel-label">
            <span className="step" aria-hidden="true">1</span>身長と体重を入力
          </p>
          <div className="fields">
            <div className="field">
              <label htmlFor="bmi-h">身長</label>
              <div className="input">
                <input
                  id="bmi-h"
                  type="text"
                  inputMode="decimal"
                  placeholder="170"
                  autoComplete="off"
                  ref={hField.ref}
                  value={hField.value}
                  onChange={hField.onChange}
                />
                <span>cm</span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="bmi-w">体重</label>
              <div className="input">
                <input
                  id="bmi-w"
                  type="text"
                  inputMode="decimal"
                  placeholder="63"
                  autoComplete="off"
                  ref={wField.ref}
                  value={wField.value}
                  onChange={wField.onChange}
                />
                <span>kg</span>
              </div>
            </div>
          </div>
          <p className="field-hint">半角の数字で入力できます（小数点もOK）。</p>
        </div>
        <div className="tool-output">
          <p className="panel-label">
            <span className="step" aria-hidden="true">2</span>結果
          </p>
          <div className="result" aria-live="polite">
            <BmiResultView result={result} />
          </div>
        </div>
      </div>
      {/* 早見表への「近いマスに印をつける」連動は BmiChartHighlighter が担当 */}
      <BmiChartHighlighter h={hField.value} w={wField.value} />
    </>
  );
}

function BmiResultView({ result }: { result: ReturnType<typeof computeBmi> }) {
  if (result.kind === "idle") {
    const need =
      result.need === "both"
        ? "身長と体重を入力してください。"
        : result.need === "h"
          ? "身長を入力してください。"
          : "体重を入力してください。";
    return (
      <div className="result-row">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="default" size={44} />
        </span>
        <div className="kc-body">
          <p className="result-need">{need}</p>
          <p className="result-eg">BMI ＝ 体重 ÷ 身長(m)²　／　例）170cm・63kg → 21.8</p>
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

  const { bmi, cat, zone, mood, msg, ideal, diff } = result;
  const absd = Math.abs(diff).toFixed(1);
  const weightHtml =
    diff === 0 ? (
      <>
        適正体重は <b>{ideal.toFixed(1)}kg</b>。いまは <b>ほぼ適正</b>です。
      </>
    ) : diff > 0 ? (
      <>
        適正体重は <b>{ideal.toFixed(1)}kg</b>。いまは <b>{absd}kg 多め</b>です。
      </>
    ) : (
      <>
        適正体重は <b>{ideal.toFixed(1)}kg</b>。いまは <b>{absd}kg 少なめ</b>です。
      </>
    );

  return (
    <div className="result-card">
      <div className="bmi-headline" aria-hidden="true">
        <span className="bmi-headline-k">あなたのBMI</span>
        <span className="bmi-headline-v">{bmi.toFixed(1)}</span>
        <span className={`bmi-zone bmi-zone--${zone}`}>{cat}</span>
      </div>
      <div className="bmi-gauge" aria-hidden="true">
        <div className="bmi-gauge-zones">
          <span className="z-low">低体重</span>
          <span className="z-normal">普通</span>
          <span className="z-over">肥満</span>
        </div>
        <div className="bmi-gauge-track">
          <span className="bmi-seg b-low" />
          <span className="bmi-seg b-normal" />
          <span className="bmi-seg b-over1" />
          <span className="bmi-seg b-over2" />
          <span className="bmi-marker" style={{ left: `${gaugePct(bmi).toFixed(2)}%` }} />
        </div>
        <div className="bmi-gauge-scale">
          <span className="lo">18.5</span>
          <span className="mid">25</span>
          <span className="hi">30</span>
        </div>
      </div>
      <p className="bmi-weight" aria-hidden="true">
        {weightHtml}
      </p>
      <div className="kc">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood={mood} size={52} />
        </span>
        <span className="kc-bubble">
          <span className="kc-name">ケンちゃんのひとこと</span>
          <span className="kc-text">{msg}</span>
        </span>
      </div>
      <p className="sr-only">
        BMIは {bmi.toFixed(1)}、{cat}。適正体重は {ideal.toFixed(1)} キログラムで、いまの体重は
        {diff === 0 ? "ほぼ適正です。" : `${absd} キログラム${diff > 0 ? "多めです。" : "少なめです。"}`}
      </p>
    </div>
  );
}

const CHART_HEIGHTS = [145, 150, 155, 160, 165, 170, 175, 180, 185, 190];
const CHART_WEIGHTS = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

function nearestIndex(v: number, arr: number[]): number {
  let bi = 0;
  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(arr[i] - v) < Math.abs(arr[bi] - v)) bi = i;
  }
  return Math.abs(arr[bi] - v) <= 3 ? bi : -1;
}

/** 早見表（下のドキュメント内）の、入力値に近いマスへ薄く印をつける連動。
 *  無くても早見表自体は成立する補助機能なので、独立したコンポーネントにしている。 */
function BmiChartHighlighter({ h, w }: { h: string; w: string }) {
  useEffect(() => {
    const chart = document.querySelector(".bmi-chart");
    if (!chart) return;
    const prev = chart.querySelector("td.is-hit");
    if (prev) prev.classList.remove("is-hit");
    const hv = parseFloat(h);
    const wv = parseFloat(w);
    if (!isFinite(hv) || !isFinite(wv)) return;
    const ri = nearestIndex(hv, CHART_HEIGHTS);
    const ci = nearestIndex(wv, CHART_WEIGHTS);
    if (ri < 0 || ci < 0) return;
    const row = chart.querySelectorAll("tbody tr")[ri];
    const cell = row?.querySelectorAll("td")[ci];
    cell?.classList.add("is-hit");
  }, [h, w]);
  return null;
}
