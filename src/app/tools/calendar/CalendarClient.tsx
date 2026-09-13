"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KenchanAvatar } from "@/components/KenchanAvatar";
import { SegRadioGroup } from "@/components/SegRadioGroup";
import { calHolidayName, calNextHoliday } from "@/lib/holidays";
import { calLiuYao } from "@/lib/rokuyo";
import { JP_DOW, isoDate, jpDateDow, todayAtMidnight } from "@/lib/dateUtil";
import { sanitizeIntDigits } from "@/lib/numberInput";
import {
  calBuildCells,
  calDowClass,
  calDowLabels,
  calIsoWeek,
  calNormalizeYM,
  calYearHolidays,
  type CalCell,
  type CalView,
  type WeekStart,
} from "./lib";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export function CalendarClient({
  initialY,
  initialM,
  initialView = "month",
}: {
  /** 指定すると表示年をその年に固定する（年別ページ用。マウントを待たず確定できる）。 */
  initialY?: number;
  /** 省略時はマウント後に「今月」を設定する（プロトタイプの年別ページと同じ挙動）。 */
  initialM?: number;
  initialView?: CalView;
}) {
  // 「今日」はビルド時刻ではなく閲覧者の今日を使いたいので、マウント後に
  // 設定する（静的生成ページでのハイドレーション不一致を避ける。日数計算・
  // 和暦早見表と同じ方針）。
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(todayAtMidnight()), []);

  const [y, setY] = useState<number | null>(initialY ?? null);
  const [m, setM] = useState<number | null>(initialM ?? null);
  useEffect(() => {
    if (!today) return;
    if (y == null) setY(today.getFullYear());
    if (m == null) setM(today.getMonth() + 1);
  }, [today, y, m]);

  const [view, setView] = useState<CalView>(initialView);
  const [weekStart, setWeekStart] = useState<WeekStart>("sun");
  const [showWeek, setShowWeek] = useState(false);
  const [showLiuYao, setShowLiuYao] = useState(false);

  const [yDraft, setYDraft] = useState("");
  useEffect(() => {
    if (y != null) setYDraft(String(y));
  }, [y]);

  const todayISO = today ? isoDate(today) : null;
  const nextHoliday = useMemo(() => (today ? calNextHoliday(today) : null), [today]);
  const kcMsg = useMemo(() => {
    if (!today) return "";
    let msg = `${jpDateDow(today)}だよ。`;
    if (nextHoliday) {
      msg +=
        isoDate(nextHoliday.date) === isoDate(today)
          ? `今日は${nextHoliday.name}だよ。`
          : `次の祝日は${jpDateDow(nextHoliday.date)} ${nextHoliday.name}だよ。`;
    }
    return msg;
  }, [today, nextHoliday]);

  const holidays = useMemo(() => (y != null ? calYearHolidays(y) : []), [y]);

  if (y == null || m == null) return null;
  const curY = y;
  const curM = m;

  const goto = (ny: number, nm: number) => {
    const norm = calNormalizeYM(ny, nm);
    setY(norm.y);
    setM(norm.m);
  };

  const onYDraftChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = sanitizeIntDigits(e.target.value).slice(0, 4);
    setYDraft(digits);
    if (digits.length === 4) goto(parseInt(digits, 10), curM);
  };

  return (
    <>
      {today && (
        <div className="cal-kc">
          <span className="cal-kc-avatar" aria-hidden="true">
            <KenchanAvatar mood="default" size={56} />
          </span>
          <p>{kcMsg}</p>
        </div>
      )}

      <div className="cal-controls">
        <div className="cal-nav">
          <button
            type="button"
            className="cal-arrow"
            aria-label="前へ"
            onClick={() => (view === "year" ? goto(curY - 1, curM) : goto(curY, curM - 1))}
          >
            ‹
          </button>
          <div className="cal-jump">
            <input type="text" inputMode="numeric" aria-label="表示する年" value={yDraft} onChange={onYDraftChange} />
            <span>年</span>
            <select aria-label="表示する月" value={curM} onChange={(e) => goto(curY, parseInt(e.target.value, 10))}>
              {MONTHS.map((mm) => (
                <option key={mm} value={mm}>
                  {mm}月
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="cal-arrow"
            aria-label="次へ"
            onClick={() => (view === "year" ? goto(curY + 1, curM) : goto(curY, curM + 1))}
          >
            ›
          </button>
          <button
            type="button"
            className="cal-today-btn"
            onClick={() => today && goto(today.getFullYear(), today.getMonth() + 1)}
          >
            今日
          </button>
        </div>
        <div className="cal-opts">
          <span id="cal-view-label" className="sr-only">
            表示切替
          </span>
          <SegRadioGroup
            ariaLabelledBy="cal-view-label"
            value={view}
            onChange={setView}
            options={[
              { value: "month", label: "月表示" },
              { value: "year", label: "年表示" },
            ]}
          />
          <span id="cal-start-label" className="sr-only">
            週の始まり
          </span>
          <SegRadioGroup
            ariaLabelledBy="cal-start-label"
            value={weekStart}
            onChange={setWeekStart}
            options={[
              { value: "sun", label: "日曜始まり" },
              { value: "mon", label: "月曜始まり" },
            ]}
          />
          <button type="button" className="cal-toggle-btn" aria-pressed={showWeek} onClick={() => setShowWeek((v) => !v)}>
            週番号
          </button>
          <button
            type="button"
            className="cal-toggle-btn"
            aria-pressed={showLiuYao}
            onClick={() => setShowLiuYao((v) => !v)}
          >
            六曜
          </button>
          <button type="button" className="cal-toggle-btn" onClick={() => window.print()}>
            印刷
          </button>
        </div>
      </div>

      <h2 className="cal-title">{view === "month" ? `${curY}年${curM}月` : `${curY}年`}</h2>

      {view === "month" ? (
        <MonthTable y={curY} m={curM} start={weekStart} showWeek={showWeek} showLiuYao={showLiuYao} todayISO={todayISO} />
      ) : (
        <div className="cal-grid-year">
          {MONTHS.map((mm) => (
            <MiniTable
              key={mm}
              y={curY}
              m={mm}
              start={weekStart}
              todayISO={todayISO}
              onTitleClick={(clickedM) => {
                setView("month");
                goto(curY, clickedM);
              }}
            />
          ))}
        </div>
      )}

      <h2>祝日一覧</h2>
      <p className="cal-hol-sub">表示中は{curY}年です。</p>
      <ul className="cal-holiday-list">
        {holidays.length === 0 ? (
          <li>
            <span className="cal-holiday-date">—</span>
            <span className="cal-holiday-name">該当なし</span>
          </li>
        ) : (
          holidays.map((h) => {
            const dt = new Date(h.y, h.m - 1, h.d);
            const hit = todayISO != null && isoDate(dt) === todayISO;
            return (
              <li key={`${h.m}-${h.d}`} className={hit ? "is-hit" : undefined}>
                <span className="cal-holiday-date">
                  {h.m}月{h.d}日（{JP_DOW[dt.getDay()]}）
                </span>
                <span className="cal-holiday-name">{h.name}</span>
              </li>
            );
          })
        )}
      </ul>

      {today && (
        <>
          <h2>年別カレンダー</h2>
          <div className="chips">
            {Array.from({ length: 5 }, (_, i) => today.getFullYear() - 1 + i).map((yy) => (
              <Link key={yy} className="chip" href={`/tools/calendar/${yy}`}>
                {yy}年のカレンダー
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function MonthTable({
  y,
  m,
  start,
  showWeek,
  showLiuYao,
  todayISO,
}: {
  y: number;
  m: number;
  start: WeekStart;
  showWeek: boolean;
  showLiuYao: boolean;
  todayISO: string | null;
}) {
  const cells = calBuildCells(y, m, start);
  const labels = calDowLabels(start);
  const rows: CalCell[][] = [];
  for (let r = 0; r < 6; r++) rows.push(cells.slice(r * 7, r * 7 + 7));

  return (
    <table className="cal-table">
      <caption className="sr-only">
        {y}年{m}月のカレンダー
      </caption>
      <thead>
        <tr>
          {showWeek && (
            <th scope="col" className="cal-weeknum-th">
              週
            </th>
          )}
          {labels.map((label, c) => (
            <th key={c} scope="col" className={calDowClass(start, c) || undefined}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            {showWeek && (
              <td className="cal-weeknum-td">{calIsoWeek(new Date(row[0].y, row[0].m - 1, row[0].d))}</td>
            )}
            {row.map((cell, ci) => {
              const cellDt = new Date(cell.y, cell.m - 1, cell.d);
              const dow = cellDt.getDay();
              const holName = cell.inMonth ? calHolidayName(cell.y, cell.m, cell.d) : null;
              const cls: string[] = [];
              if (!cell.inMonth) {
                cls.push("is-out");
              } else {
                if (holName) cls.push("is-holiday");
                else if (dow === 0) cls.push("is-sun");
                else if (dow === 6) cls.push("is-sat");
                if (todayISO != null && isoDate(cellDt) === todayISO) cls.push("is-today");
              }
              const ly = cell.inMonth && showLiuYao ? calLiuYao(cell.y, cell.m, cell.d) : null;
              return (
                <td key={ci} className={cls.join(" ") || undefined}>
                  <span className="cal-day-num">{cell.d}</span>
                  {cell.inMonth && holName && <span className="cal-hol-name">{holName}</span>}
                  {ly && <span className={"cal-liuyao" + (ly === "大安" ? " is-taian" : "")}>{ly}</span>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MiniTable({
  y,
  m,
  start,
  todayISO,
  onTitleClick,
}: {
  y: number;
  m: number;
  start: WeekStart;
  todayISO: string | null;
  onTitleClick: (m: number) => void;
}) {
  const cells = calBuildCells(y, m, start);
  const labels = calDowLabels(start);
  const rows: CalCell[][] = [];
  for (let r = 0; r < 6; r++) rows.push(cells.slice(r * 7, r * 7 + 7));

  return (
    <div className="cal-mini">
      <button type="button" className="cal-mini-title" onClick={() => onTitleClick(m)}>
        {m}月
      </button>
      <table className="cal-mini-table">
        <caption className="sr-only">
          {y}年{m}月
        </caption>
        <thead>
          <tr>
            {labels.map((label, c) => (
              <th key={c} className={calDowClass(start, c) || undefined}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, ci) => {
                const cls: string[] = [];
                if (!cell.inMonth) {
                  cls.push("is-out");
                } else {
                  const cellDt = new Date(cell.y, cell.m - 1, cell.d);
                  const dow = cellDt.getDay();
                  const holName = calHolidayName(cell.y, cell.m, cell.d);
                  if (holName) cls.push("is-holiday");
                  else if (dow === 0) cls.push("is-sun");
                  else if (dow === 6) cls.push("is-sat");
                  if (todayISO != null && isoDate(cellDt) === todayISO) cls.push("is-today");
                }
                return (
                  <td key={ci} className={cls.join(" ") || undefined}>
                    {cell.d}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
