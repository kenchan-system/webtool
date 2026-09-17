import assert from "node:assert/strict";
import test from "node:test";

import { computeAge } from "../src/app/tools/age/lib";
import { computeBmi } from "../src/app/tools/bmi/lib";
import { calDaysInMonth, calNormalizeYM } from "../src/app/tools/calendar/lib";
import { formatClockTime } from "../src/app/tools/clock/lib";
import { computeDaysAdd, computeDaysSpan } from "../src/app/tools/days/lib";
import { computeDiscount } from "../src/app/tools/discount/lib";
import { fastestSlowestIndex, swFormat } from "../src/app/tools/stopwatch/lib";
import { computeTax } from "../src/app/tools/tax/lib";
import { tmrFormat } from "../src/app/tools/timer/lib";
import { computeS2W, computeW2S } from "../src/app/tools/wareki/lib";
import { wcDayDiff, wcOffsetMinutes, wcTimeStr } from "../src/app/tools/world-clock/lib";
import { parsePastedDate } from "../src/lib/datePaste";

test("消費税は加算・内税の逆算で端数を正しく扱う", () => {
  const added = computeTax("1000", "add", "10", "");
  assert.equal(added.kind, "success");
  if (added.kind !== "success") return;
  assert.deepEqual({ ex: added.ex, tax: added.tax, inc: added.inc }, { ex: 1000, tax: 100, inc: 1100 });

  const removed = computeTax("1100", "sub", "10", "");
  assert.equal(removed.kind, "success");
  if (removed.kind !== "success") return;
  assert.deepEqual({ ex: removed.ex, tax: removed.tax, inc: removed.inc }, { ex: 1000, tax: 100, inc: 1100 });
  assert.equal(computeTax("1000", "add", "custom", "101").kind, "error");
});

test("割引額は1円未満を切り捨て、半額も計算する", () => {
  const thirty = computeDiscount("1980", "30", "");
  assert.equal(thirty.kind, "success");
  if (thirty.kind !== "success") return;
  assert.deepEqual({ discount: thirty.disc, final: thirty.final }, { discount: 594, final: 1386 });

  const half = computeDiscount("999", "50", "");
  assert.equal(half.kind, "success");
  if (half.kind !== "success") return;
  assert.deepEqual({ discount: half.disc, final: half.final }, { discount: 499, final: 500 });
});

test("BMIは標準例と入力範囲を判定する", () => {
  const result = computeBmi("170", "63");
  assert.equal(result.kind, "success");
  if (result.kind !== "success") return;
  assert.equal(result.cat, "普通体重");
  assert.equal(Math.round(result.bmi * 10) / 10, 21.8);
  assert.equal(computeBmi("99", "63").kind, "error");
});

test("4月1日と4月2日の学年境界を区別する", () => {
  const base = new Date(2026, 8, 17);
  const aprilFirst = computeAge("2016", "4", "1", base);
  const aprilSecond = computeAge("2016", "4", "2", base);
  assert.equal(aprilFirst.kind, "success");
  assert.equal(aprilSecond.kind, "success");
  if (aprilFirst.kind !== "success" || aprilSecond.kind !== "success") return;
  assert.equal(aprilFirst.grade, "小学校 5年生");
  assert.equal(aprilSecond.grade, "小学校 4年生");
});

test("日数計算はうるう日と日付の前後入れ替えを扱う", () => {
  const feb28 = new Date(2024, 1, 28);
  const mar1 = new Date(2024, 2, 1);
  const span = computeDaysSpan(mar1, feb28);
  assert.equal(span.kind, "success");
  if (span.kind !== "success" || span.mode !== "span") return;
  assert.equal(span.excl, 2);
  assert.equal(span.incl, 3);

  const next = computeDaysAdd(feb28, "1", "after");
  assert.equal(next.kind, "success");
  if (next.kind !== "success" || next.mode !== "add") return;
  assert.match(next.resultStr, /2024年2月29日/);
});

test("貼り付け日付は全角・和暦・改元日を検証する", () => {
  assert.deepEqual(parsePastedDate("２０００年９月１７日"), { y: "2000", m: "9", d: "17" });
  assert.deepEqual(parsePastedDate("平成元年1月8日"), { y: "1989", m: "1", d: "8" });
  assert.equal(parsePastedDate("平成元年1月7日"), null);
  assert.deepEqual(parsePastedDate("1868/9/8", { minYear: 1868 }), { y: "1868", m: "9", d: "8" });
});

test("西暦から和暦への変換は2019年の改元日を区別する", () => {
  const heisei = computeW2S("2019", "4", "30");
  const reiwa = computeW2S("2019", "5", "1");
  assert.equal(heisei.kind, "success");
  assert.equal(reiwa.kind, "success");
  if (heisei.kind !== "success" || reiwa.kind !== "success") return;
  assert.equal(heisei.av, "平成31年4月30日");
  assert.equal(reiwa.av, "令和元年5月1日");
});

test("和暦から西暦への変換は存在しない改元境界日を拒否する", () => {
  const valid = computeS2W("1", "reiwa", "5", "1");
  assert.equal(valid.kind, "success");
  if (valid.kind === "success") assert.equal(valid.seireki, "2019年5月1日");
  assert.equal(computeS2W("1", "reiwa", "4", "30").kind, "error");
  assert.equal(computeS2W("31", "heisei", "5", "1").kind, "error");
});

test("カレンダーはうるう年と年越しの月移動を扱う", () => {
  assert.equal(calDaysInMonth(2024, 2), 29);
  assert.equal(calDaysInMonth(2023, 2), 28);
  assert.deepEqual(calNormalizeYM(2026, 13), { y: 2027, m: 1 });
  assert.deepEqual(calNormalizeYM(2026, 0), { y: 2025, m: 12 });
});

test("時計・タイマー・ストップウォッチの表示境界を整形する", () => {
  const midnight = new Date(2024, 0, 1, 0, 5, 9);
  assert.deepEqual(formatClockTime(midnight, "12", true), { timeStr: "12:05:09", ampm: "午前" });
  assert.equal(tmrFormat(3599.6), "1:00:00");
  assert.equal(swFormat(3_661_000), "1:01:01");
  assert.deepEqual(
    fastestSlowestIndex([
      { n: 1, totalMs: 1000, splitMs: 1000 },
      { n: 2, totalMs: 1800, splitMs: 800 },
      { n: 3, totalMs: 3000, splitMs: 1200 },
    ]),
    { fastestIdx: 1, slowestIdx: 2 },
  );
});

test("世界時計は固定時刻のタイムゾーンと日付差を計算する", () => {
  const now = new Date("2024-01-01T00:00:00Z");
  assert.equal(wcTimeStr("Asia/Tokyo", now), "09:00");
  assert.equal(wcOffsetMinutes("Asia/Tokyo", now), 540);
  assert.equal(wcOffsetMinutes("America/New_York", now), -300);
  assert.equal(wcDayDiff("America/New_York", "Asia/Tokyo", now), -1);
});
