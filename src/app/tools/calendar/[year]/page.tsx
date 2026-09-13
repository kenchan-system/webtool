import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClient } from "../CalendarClient";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

export function generateStaticParams() {
  const nowY = new Date().getFullYear();
  const years = [];
  for (let y = nowY - 1; y <= nowY + 3; y++) years.push({ year: String(y) });
  return years;
}

function parseYear(param: string): number | null {
  if (!/^\d{4}$/.test(param)) return null;
  const y = parseInt(param, 10);
  if (y < MIN_YEAR || y > MAX_YEAR) return null;
  return y;
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `${y}年のカレンダー｜祝日一覧・印刷対応`,
    description: `${y}年の祝日つきカレンダーを表示・印刷。${y}年の祝日をすべて掲載し、週の始まりや週番号の表示も切り替えられます。無料・登録不要。`,
  };
}

export default async function CalendarYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  return (
    <div className="screen">
      <nav className="crumbs">
        <Link href="/">トップ</Link>
        <span aria-hidden="true">›</span>
        <Link href="/date">日付</Link>
        <span aria-hidden="true">›</span>
        <Link href="/tools/calendar">カレンダー</Link>
        <span aria-hidden="true">›</span>
        <span>{y}年</span>
      </nav>

      <div className="tool-head">
        <h1>カレンダー</h1>
        <p className="lede">祝日つきの月間・年間カレンダーを表示・印刷できます。</p>
      </div>

      <CalendarClient initialY={y} initialView="year" />
    </div>
  );
}
