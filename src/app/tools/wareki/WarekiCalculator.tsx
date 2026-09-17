"use client";

import { useEffect, useMemo, useState, type ClipboardEvent } from "react";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { CopyButton } from "@/components/CopyButton";
import { DateYMDField } from "@/components/DateYMDField";
import { sanitizeIntDigits } from "@/lib/numberInput";
import {
  computeS2W,
  computeW2S,
  warekiChartRows,
  wkParseS2W,
  wkSanitizeS2WInput,
  type EraKey,
  type WarekiResult,
  type WkDir,
} from "./lib";

const DEBOUNCE_MS = 180;
const ERA_OPTIONS: { value: EraKey; label: string }[] = [
  { value: "reiwa", label: "令和" },
  { value: "heisei", label: "平成" },
  { value: "showa", label: "昭和" },
  { value: "taisho", label: "大正" },
  { value: "meiji", label: "明治" },
];

export function WarekiCalculator() {
  const [dir, setDir] = useState<WkDir>("w2s");
  const [yDigits, setYDigits] = useState("");
  const [mStr, setMStr] = useState("");
  const [dStr, setDStr] = useState("");
  const [eraSelect, setEraSelect] = useState<EraKey>("reiwa");
  const [nRaw, setNRaw] = useState("");
  const [warekiPasteNotice, setWarekiPasteNotice] = useState<{ text: string; error: boolean } | null>(null);
  // 早見表の「今年」はビルド時刻ではなく閲覧者の今日を使いたいので、
  // マウント後に設定する（静的生成ページでのハイドレーション不一致を避ける）。
  const [nowY, setNowY] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNowY(new Date().getFullYear());
  }, []);
  function onNChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sanitized = wkSanitizeS2WInput(e.target.value);
    setNRaw(sanitized);
    const p = wkParseS2W(sanitized);
    if (p.eraKey && p.eraKey !== eraSelect) setEraSelect(p.eraKey);
    if (p.m != null) {
      const okM = p.m >= 1 && p.m <= 12;
      setMStr(okM ? String(p.m) : "");
      setDStr(okM && p.d != null && p.d >= 1 && p.d <= 31 ? String(p.d) : "");
    }
    setWarekiPasteNotice(null);
  }
  function onNBlur() {
    const p = wkParseS2W(nRaw);
    if (p.y != null && p.y >= 1) setNRaw(String(p.y));
  }

  function onWarekiPaste(e: ClipboardEvent<HTMLInputElement>, part: "y" | "m" | "d") {
    const text = e.clipboardData.getData("text").normalize("NFKC").trim();
    if (!text) return;
    e.preventDefault();

    if (/^\d+$/.test(text)) {
      if (text.length > (part === "y" ? 3 : 2)) {
        setWarekiPasteNotice({ text: "和暦の年は3桁、月・日は2桁までで入力してください。", error: true });
        return;
      }
      if (part === "y") setNRaw(text);
      if (part === "m") setMStr(text);
      if (part === "d") setDStr(text);
      setWarekiPasteNotice(null);
      return;
    }

    const parsed = wkParseS2W(text);
    if (parsed.y == null || parsed.m == null || parsed.d == null
      || parsed.y < 1 || parsed.m < 1 || parsed.m > 12 || parsed.d < 1 || parsed.d > 31) {
      setWarekiPasteNotice({
        text: "和暦の日付を読み取れませんでした。平成12年9月17日、H12.9.17 などの形式で貼り付けてください。",
        error: true,
      });
      return;
    }
    if (parsed.eraKey) setEraSelect(parsed.eraKey);
    setNRaw(String(parsed.y));
    setMStr(String(parsed.m));
    setDStr(String(parsed.d));
    setWarekiPasteNotice({ text: "年月日をまとめて入力しました。", error: false });
  }

  const [debounced, setDebounced] = useState({ dir, yDigits, mStr, dStr, eraSelect, nRaw });
  useEffect(() => {
    const t = setTimeout(() => setDebounced({ dir, yDigits, mStr, dStr, eraSelect, nRaw }), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [dir, yDigits, mStr, dStr, eraSelect, nRaw]);

  const result = useMemo<WarekiResult>(() => {
    if (debounced.dir === "w2s") {
      return computeW2S(debounced.yDigits, debounced.mStr, debounced.dStr);
    }
    return computeS2W(debounced.nRaw, debounced.eraSelect, debounced.mStr, debounced.dStr);
  }, [debounced]);

  const chartRows = useMemo(() => (nowY != null ? warekiChartRows(nowY) : []), [nowY]);

  return (
    <>
      <h2 className="sr-only">和暦と西暦の変換ツール</h2>
      <div className="tool-panel">
        <div className="tool-input">
          <p className="panel-label">
            <span className="step" aria-hidden="true">1</span>変換する年を入力
          </p>
          <div className="fields">
            <div className="field">
              <label id="wareki-dir-label">変換の向き</label>
              <SegRadioGroup
                ariaLabelledBy="wareki-dir-label"
                value={dir}
                onChange={setDir}
                options={[
                  { value: "w2s", label: "西暦 → 和暦" },
                  { value: "s2w", label: "和暦 → 西暦" },
                ]}
              />
            </div>

            {dir === "w2s" && (
              <div className="field">
                <p className="date-field-label">西暦（月・日は任意）</p>
                <DateYMDField
                  idPrefix="wareki"
                  value={{ y: yDigits, m: mStr, d: dStr }}
                  onChange={(value) => {
                    setYDigits(value.y);
                    setMStr(value.m);
                    setDStr(value.d);
                  }}
                  yLabel="西暦の年"
                  mLabel="西暦の月（任意）"
                  dLabel="西暦の日（任意）"
                  yPlaceholder="2024"
                  minYear={1868}
                />
              </div>
            )}

            {dir === "s2w" && (
              <>
                <div className="field">
                  <label htmlFor="wareki-era">元号</label>
                  <div className="input">
                    <select
                      id="wareki-era"
                      aria-label="元号"
                      value={eraSelect}
                      onChange={(e) => setEraSelect(e.target.value as EraKey)}
                    >
                      {ERA_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <p className="date-field-label">和暦（月・日は任意）</p>
                  <div className="date-paste-fields">
                    <div>
                      <label htmlFor="wareki-n">年</label>
                      <div className="input">
                        <input
                          id="wareki-n"
                          type="text"
                          inputMode="text"
                          placeholder="6"
                          autoComplete="off"
                          aria-label="和暦の年（略号入力可）"
                          aria-describedby="wareki-s2w-paste-hint wareki-s2w-paste-notice"
                          value={nRaw}
                          onPaste={(e) => onWarekiPaste(e, "y")}
                          onChange={onNChange}
                          onBlur={onNBlur}
                        />
                      </div>
                    </div>
                    {(["m", "d"] as const).map((part, index) => (
                      <div key={part}>
                        <label htmlFor={`wareki-${part}`}>{part === "m" ? "月" : "日"}</label>
                        <div className="input">
                          <input
                            id={`wareki-${part}`}
                            type="text"
                            inputMode="numeric"
                            placeholder={index === 0 ? "9" : "17"}
                            autoComplete="off"
                            aria-label={part === "m" ? "和暦の月（任意）" : "和暦の日（任意）"}
                            aria-describedby="wareki-s2w-paste-hint wareki-s2w-paste-notice"
                            value={part === "m" ? mStr : dStr}
                            onPaste={(e) => onWarekiPaste(e, part)}
                            onChange={(e) => {
                              const value = sanitizeIntDigits(e.target.value).slice(0, 2);
                              if (part === "m") setMStr(value);
                              else setDStr(value);
                              setWarekiPasteNotice(null);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="field-hint" id="wareki-s2w-paste-hint">
                    どの欄にも和暦の日付をまとめて貼り付けできます。例：平成12年9月17日、H12.9.17
                  </p>
                  <p
                    id="wareki-s2w-paste-notice"
                    className={`date-paste-notice${warekiPasteNotice?.error ? " date-paste-notice--error" : ""}`}
                    role="status"
                    aria-live="polite"
                  >
                    {warekiPasteNotice?.text}
                  </p>
                </div>
              </>
            )}
          </div>
          <p className="field-hint">
            「月・日」も入れると、その日付ごと変換します（生年月日の変換に）。改元があった年（1912・1926・1989・2019）は、月で元号を判定し、日まで入れると改元日の前後もぴったり分かります。和暦→西暦は「元年」を「1」と入れてください。「S60.4.1」「H31」のような略号入力にも対応しています（M＝明治／T＝大正／S＝昭和／H＝平成／R＝令和）。
          </p>
        </div>
        <div className="tool-output">
          <p className="panel-label">
            <span className="step" aria-hidden="true">2</span>結果
          </p>
          <div className="result" aria-live="polite">
            <WarekiResultView result={result} dir={dir} />
          </div>
        </div>
      </div>

      <section className="tool-doc" aria-labelledby="wareki-about-label">
        <p className="doc-eyebrow" id="wareki-about-label">このツールについて</p>
        <h2>和暦早見表（西暦・和暦・年齢）</h2>
        <p>西暦・和暦・今年の年齢の対応表です。生まれ年を書類用に和暦へ直すときの参考にどうぞ。上のツールに入力すると、その行に印がつきます（枠内は上下にスクロールできます）。</p>
        <div className="chart-scroll chart-scroll--tall">
          <table className="age-chart age-chart--eq">
          <caption className="sr-only">西暦・和暦・今年の年齢の早見表</caption>
          <thead>
            <tr>
              <th scope="col">西暦</th>
              <th scope="col">和暦</th>
              <th scope="col">今年で</th>
            </tr>
          </thead>
          <tbody>
            {chartRows.map((row) => (
              <tr key={row.y} className={result.kind === "success" && result.chartYear === row.y ? "is-hit" : undefined}>
                <th scope="row">{row.y}年</th>
                <td>{row.wareki}</td>
                <td className="num">{row.age}歳</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function WarekiResultView({ result, dir }: { result: WarekiResult; dir: WkDir }) {
  if (result.kind === "idle") {
    return (
      <div className="result-row">
        <span className="kc-avatar" aria-hidden="true">
          <KenchanAvatar mood="default" size={44} />
        </span>
        <div className="kc-body">
          {dir === "w2s" ? (
            <>
              <p className="result-need">西暦の年を入力してください。</p>
              <p className="result-eg">例）2024 → 令和6年</p>
            </>
          ) : (
            <>
              <p className="result-need">和暦の年を入力してください。</p>
              <p className="result-eg">例）昭和50年（S50）→ 1975年</p>
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

  const { ak, av, note, seireki, wareki, rowHighlight, msg, srText, copyText } = result;

  return (
    <div className="result-card">
      <div className="tax-answer" aria-hidden="true">
        <span className="tax-answer-k">{ak}</span>
        <span className="tax-answer-v">{av}</span>
        {note && <span className="age-detail">{note}</span>}
      </div>
      <CopyButton text={copyText} />
      <dl className="tax-breakdown" aria-hidden="true">
        <div className={rowHighlight === "seireki" ? "is-answer" : undefined}>
          <dt>西暦</dt>
          <dd>{seireki}</dd>
        </div>
        <div className={rowHighlight === "wareki" ? "is-answer" : undefined}>
          <dt>和暦</dt>
          <dd>{wareki}</dd>
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
