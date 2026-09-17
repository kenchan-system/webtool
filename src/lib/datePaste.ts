// 曖昧な月日順や数字だけの8桁は推測しない。和暦は改元日も検証する。
const ERAS = [
  { names: ["令和", "R"], start: 20190501, end: 22001231 },
  { names: ["平成", "H"], start: 19890108, end: 20190430 },
  { names: ["昭和", "S"], start: 19261225, end: 19890107 },
  { names: ["大正", "T"], start: 19120730, end: 19261224 },
  { names: ["明治", "M"], start: 18680101, end: 19120729 },
];

export function parsePastedDate(
  text: string,
  { minYear = 1900, maxYear = 2200 }: { minYear?: number; maxYear?: number } = {},
): { y: string; m: string; d: string } | null {
  let source = text.normalize("NFKC").trim().toUpperCase();
  const era = ERAS.find((item) => item.names.some((name) => source.startsWith(name)));
  if (era) {
    const prefix = era.names.find((name) => source.startsWith(name))!;
    source = source.slice(prefix.length).trim();
  }
  const match = source.match(/^(\d{1,4}|元)\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日$/)
    ?? source.match(/^(\d{1,4})([\/.-])\s*(\d{1,2})\2\s*(\d{1,2})$/)?.filter((_, i) => i !== 2);
  if (!match || (!era && !/^\d{4}$/.test(match[1]))) return null;

  let y = match[1] === "元" ? 1 : Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (era) {
    if (y < 1) return null;
    y += Math.floor(era.start / 10000) - 1;
    const date = y * 10000 + m * 100 + d;
    if (date < era.start || date > era.end) return null;
  }
  if (y < minYear || y > maxYear || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return { y: String(y), m: String(m), d: String(d) };
}
