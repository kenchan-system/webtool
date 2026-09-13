"use client";

import { useEffect, useMemo, useState } from "react";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { CopyButton } from "@/components/CopyButton";
import { DateYMDField, type YMD } from "@/components/DateYMDField";
import { todayAtMidnight, ymdToDate } from "@/lib/dateUtil";
import {
  ageChartRows,
  ageSchoolYearStart,
  computeAge,
  gradeChartHitIndex,
  gradeChartRows,
  type AgeResult,
} from "./lib";

const DEBOUNCE_MS = 180;
type Base = "today" | "custom";

function baseDate(base: Base, customYmd: YMD): Date {
  if (base === "custom") {
    const dt = ymdToDate(parseInt(customYmd.y, 10), parseInt(customYmd.m, 10), parseInt(customYmd.d, 10));
    if (dt) return dt;
  }
  return todayAtMidnight();
}

export function AgeCalculator() {
  const [birth, setBirth] = useState<YMD>({ y: "", m: "", d: "" });
  const [base, setBase] = useState<Base>("today");
  const [customBase, setCustomBase] = useState<YMD>({ y: "", m: "", d: "" });

  const [debounced, setDebounced] = useState({ birth, base, customBase });
  useEffect(() => {
    const t = setTimeout(() => setDebounced({ birth, base, customBase }), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [birth, base, customBase]);

  const base_ = useMemo(() => baseDate(debounced.base, debounced.customBase), [debounced.base, debounced.customBase]);
  const result = useMemo(
    () => computeAge(debounced.birth.y, debounced.birth.m, debounced.birth.d, base_),
    [debounced.birth, base_],
  );

  const baseY = base_.getFullYear();
  const ageRows = useMemo(() => ageChartRows(baseY), [baseY]);
  const gradeRows = useMemo(() => gradeChartRows(base_), [base_]);
  const gradeHitIdx =
    result.kind === "success" ? gradeChartHitIndex(result.y, parseInt(debounced.birth.m, 10), parseInt(debounced.birth.d, 10), base_) : -1;

  function handleBaseChange(v: Base) {
    setBase(v);
    if (v === "custom" && !customBase.y) {
      const t = new Date();
      setCustomBase({ y: String(t.getFullYear()), m: String(t.getMonth() + 1), d: String(t.getDate()) });
    }
  }

  return (
    <>
      <h2 className="sr-only">年齢と学年の計算ツール</h2>
      <div className="tool-panel">
        <div className="tool-input">
          <p className="panel-label">
            <span className="step" aria-hidden="true">1</span>生年月日を入力
          </p>
          <div className="fields">
            <div className="field">
              <label htmlFor="age-y">生年月日</label>
              <DateYMDField idPrefix="age" value={birth} onChange={setBirth} yLabel="生まれた年（西暦）" yPlaceholder="2000" />
            </div>
            <div className="field">
              <label id="age-base-label">基準日</label>
              <SegRadioGroup
                ariaLabelledBy="age-base-label"
                value={base}
                onChange={handleBaseChange}
                options={[
                  { value: "today", label: "今日" },
                  { value: "custom", label: "日付を指定" },
                ]}
              />
              {base === "custom" && (
                <div style={{ marginTop: 8 }}>
                  <DateYMDField
                    idPrefix="age-base"
                    value={customBase}
                    onChange={setCustomBase}
                    yLabel="基準日の年（西暦）"
                    yPlaceholder="2026"
                  />
                </div>
              )}
              <p className="field-hint">年は半角の数字、月・日はリストから。過去も未来も指定できます。その日に何歳・何年生になるかを計算します。</p>
            </div>
          </div>
          <p className="field-hint">生まれた年は半角の数字で入力できます。西暦（例：2000）で入れてください。</p>
        </div>
        <div className="tool-output">
          <p className="panel-label">
            <span className="step" aria-hidden="true">2</span>結果
          </p>
          <div className="result" aria-live="polite">
            <AgeResultView result={result} />
          </div>
        </div>
      </div>

      <h3>
        年齢早見表（{baseY}年版）
      </h3>
      <details className="chart-details">
        <summary>表を開く</summary>
        <p>生まれ年（西暦）ごとの、基準日の年に迎える満年齢の早見表です。上のツールに入力すると、その行に印がつきます。</p>
        <div className="chart-scroll chart-scroll--tall">
          <table className="age-chart age-chart--eq">
            <caption className="sr-only">生まれ年ごとの今年の満年齢・和暦・干支の早見表</caption>
            <thead>
              <tr>
                <th scope="col">生まれ年</th>
                <th scope="col">和暦</th>
                <th scope="col">今年で</th>
                <th scope="col">干支</th>
              </tr>
            </thead>
            <tbody>
              {ageRows.map((row) => (
                <tr key={row.y} className={result.kind === "success" && result.y === row.y ? "is-hit" : undefined}>
                  <th scope="row">{row.y}年</th>
                  <td>{row.wareki}年</td>
                  <td className="num">{row.age}歳</td>
                  <td>{row.eto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <h3>学年早見表（{ageSchoolYearStart(base_)}年度版）</h3>
      <p>生まれた期間ごとの、基準日の年度の学年です。上のツールに入力すると、その行に印がつきます。</p>
      <div className="chart-scroll">
        <table className="age-chart">
          <caption className="sr-only">生まれた期間ごとの今年度の学年の早見表</caption>
          <thead>
            <tr>
              <th scope="col">生まれた期間</th>
              <th scope="col">学年</th>
            </tr>
          </thead>
          <tbody>
            {gradeRows.map((row, i) => (
              <tr key={row.period} className={i === gradeHitIdx ? "is-hit" : undefined}>
                <th scope="row">{row.period}</th>
                <td>{row.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AgeResultView({ result }: { result: AgeResult }) {
  if (result.kind === "idle") {
    return (
      <div className="result-row">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="default" size={44} />
        </span>
        <div className="kc-body">
          <p className="result-need">生年月日を入力してください。</p>
          <p className="result-eg">例）2000年5月3日 → 満年齢・学年などがわかります</p>
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

  const { age, ymd, grade, dow, eto, seiza, nextStr, isBirthdayToday, msg, srText, copyText } = result;

  return (
    <div className="result-card">
      <div className="tax-answer" aria-hidden="true">
        <span className="tax-answer-k">満年齢</span>
        <span className="tax-answer-v">{age}歳</span>
        <span className="age-detail">（{ymd}）</span>
      </div>
      <CopyButton text={copyText} />
      <dl className="tax-breakdown" aria-hidden="true">
        <div className="is-answer">
          <dt>学年</dt>
          <dd>{grade}</dd>
        </div>
        <div>
          <dt>次の誕生日</dt>
          <dd>{nextStr}</dd>
        </div>
      </dl>
      <details className="chart-details age-extra" aria-hidden="true">
        <summary>そのほかの豆知識</summary>
        <dl className="tax-breakdown">
          <div>
            <dt>生まれた曜日</dt>
            <dd>{dow}</dd>
          </div>
          <div>
            <dt>干支</dt>
            <dd>{eto}</dd>
          </div>
          <div>
            <dt>星座</dt>
            <dd>{seiza}</dd>
          </div>
        </dl>
      </details>
      <div className="kc">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood={isBirthdayToday ? "happy" : "default"} size={52} />
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
