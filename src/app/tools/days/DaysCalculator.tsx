"use client";

import { useEffect, useMemo, useState } from "react";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { CopyButton } from "@/components/CopyButton";
import { DateYMDField, type YMD } from "@/components/DateYMDField";
import { useDigitsField } from "@/lib/numberInput";
import { ymdToDate } from "@/lib/dateUtil";
import { computeDaysAdd, computeDaysSpan, type DaysDir, type DaysMode, type DaysResult } from "./lib";

const DEBOUNCE_MS = 180;

function todayYmd(): YMD {
  const t = new Date();
  return { y: String(t.getFullYear()), m: String(t.getMonth() + 1), d: String(t.getDate()) };
}

const EMPTY_YMD: YMD = { y: "", m: "", d: "" };

function toDate(v: YMD): Date | null {
  const y = parseInt(v.y, 10);
  const m = parseInt(v.m, 10);
  const d = parseInt(v.d, 10);
  return ymdToDate(y, m, d);
}

export function DaysCalculator() {
  const [mode, setMode] = useState<DaysMode>("span");
  const [dir, setDir] = useState<DaysDir>("after");
  // 開始日・終了日・起点日は「今日」を初期値にしたいが、このページは静的生成
  // されるためレンダー中に new Date() を使うとビルド時刻がHTMLに焼き込まれ、
  // 閲覧者の実際の「今日」とズレる（ハイドレーション不一致にもなる）。
  // 空で初期描画し、マウント後のエフェクトでクライアントの今日を入れる。
  const [from, setFrom] = useState<YMD>(EMPTY_YMD);
  const [to, setTo] = useState<YMD>(EMPTY_YMD);
  const [base, setBase] = useState<YMD>(EMPTY_YMD);
  const n = useDigitsField("");

  useEffect(() => {
    const t = todayYmd();
    // 閲覧者側の「今日」を、静的生成後の初回マウント時にだけ反映する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrom(t);
    setTo(t);
    setBase(t);
  }, []);

  const [debounced, setDebounced] = useState({ mode, dir, from, to, base, n: n.value });
  useEffect(() => {
    const t = setTimeout(() => setDebounced({ mode, dir, from, to, base, n: n.value }), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [mode, dir, from, to, base, n.value]);

  const result = useMemo<DaysResult>(() => {
    if (debounced.mode === "span") {
      return computeDaysSpan(toDate(debounced.from), toDate(debounced.to));
    }
    return computeDaysAdd(toDate(debounced.base), debounced.n, debounced.dir);
  }, [debounced]);

  return (
    <>
      <h2 className="sr-only">日数と日付の計算ツール</h2>
      <div className="tool-panel">
        <div className="tool-input">
          <p className="panel-label">
            <span className="step" aria-hidden="true">1</span>日付を入力
          </p>
          <div className="fields">
            <div className="field">
              <label id="days-mode-label">計算の種類</label>
              <SegRadioGroup
                ariaLabelledBy="days-mode-label"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "span", label: "期間の日数" },
                  { value: "add", label: "◯日後・◯日前" },
                ]}
              />
            </div>

            {mode === "span" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="field">
                  <label htmlFor="days-from-y">開始日</label>
                  <DateYMDField idPrefix="days-from" value={from} onChange={setFrom} yLabel="開始日の年（西暦）" yPlaceholder="2026" />
                  <button type="button" className="days-today-btn" onClick={() => setFrom(todayYmd())}>
                    今日にする
                  </button>
                </div>
                <div className="field">
                  <label htmlFor="days-to-y">終了日</label>
                  <DateYMDField idPrefix="days-to" value={to} onChange={setTo} yLabel="終了日の年（西暦）" yPlaceholder="2026" />
                  <button type="button" className="days-today-btn" onClick={() => setTo(todayYmd())}>
                    今日にする
                  </button>
                </div>
              </div>
            )}

            {mode === "add" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="field">
                  <label htmlFor="days-base-y">起点日</label>
                  <DateYMDField idPrefix="days-base" value={base} onChange={setBase} yLabel="起点日の年（西暦）" yPlaceholder="2026" />
                  <button type="button" className="days-today-btn" onClick={() => setBase(todayYmd())}>
                    今日にする
                  </button>
                </div>
                <div className="field">
                  <label htmlFor="days-n">日数</label>
                  <div className="input">
                    <button
                      type="button"
                      className="sign-btn"
                      aria-pressed={dir === "before"}
                      title="向きを切り替え（＋は後・−は前）"
                      onClick={() => setDir((d) => (d === "before" ? "after" : "before"))}
                    >
                      {dir === "before" ? "−" : "＋"}
                    </button>
                    <input
                      id="days-n"
                      type="text"
                      inputMode="numeric"
                      placeholder="100"
                      autoComplete="off"
                      value={n.value}
                      onChange={n.onChange}
                    />
                    <span>日</span>
                    <span className="sign-word">{dir === "before" ? "前" : "後"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="field-hint">
            過去・未来どちらも指定できます。「◯日後・◯日前」では日数の左の「＋／−」で向き（＋＝後／−＝前）を切り替えます。
          </p>
        </div>
        <div className="tool-output">
          <p className="panel-label">
            <span className="step" aria-hidden="true">2</span>結果
          </p>
          <div className="result" aria-live="polite">
            <DaysResultView result={result} mode={mode} />
          </div>
        </div>
      </div>
    </>
  );
}

function DaysResultView({ result, mode }: { result: DaysResult; mode: DaysMode }) {
  if (result.kind === "idle") {
    return (
      <div className="result-row">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="default" size={44} />
        </span>
        <div className="kc-body">
          {mode === "span" ? (
            <>
              <p className="result-need">開始日と終了日を入力してください。</p>
              <p className="result-eg">例）2026年1月1日 〜 2026年12月31日 → 364日</p>
            </>
          ) : (
            <>
              <p className="result-need">日数を入力してください。</p>
              <p className="result-eg">例）今日から100日後 → 日付と曜日がわかります</p>
            </>
          )}
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

  if (result.mode === "span") {
    const { excl, incl, period, approx, msg, srText, copyText } = result;
    return (
      <div className="result-card">
        <div className="tax-answer" aria-hidden="true">
          <span className="tax-answer-k">日数</span>
          <span className="tax-answer-v">{excl.toLocaleString("ja-JP")}日</span>
          <span className="age-detail">（初日も含めると {incl.toLocaleString("ja-JP")}日）</span>
        </div>
        <CopyButton text={copyText} />
        <dl className="tax-breakdown" aria-hidden="true">
          <div>
            <dt>期間</dt>
            <dd>{period}</dd>
          </div>
          {approx && (
            <div>
              <dt>期間の長さ</dt>
              <dd>{approx}</dd>
            </div>
          )}
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

  const { resultStr, baseStr, midStr, msg, srText, copyText } = result;
  return (
    <div className="result-card">
      <div className="tax-answer" aria-hidden="true">
        <span className="tax-answer-k">日付</span>
        <span className="tax-answer-v">{resultStr}</span>
      </div>
      <CopyButton text={copyText} />
      <dl className="tax-breakdown" aria-hidden="true">
        <div>
          <dt>起点</dt>
          <dd>{baseStr}</dd>
        </div>
        <div>
          <dt>計算</dt>
          <dd>{midStr}</dd>
        </div>
        <div className="is-answer">
          <dt>結果</dt>
          <dd>{resultStr}</dd>
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
