import type { Lang } from "../types";

const LOCALES: Record<Lang, string> = { id: "id-ID", en: "en-US" };

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 hari yang lalu" / "3 days ago". */
export function timeAgo(iso: string, lang: Lang, now = Date.now()) {
  const seconds = (Date.parse(iso) - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat(LOCALES[lang], { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(0, "minute");
}

/** "Desember 2022" / "December 2022". */
export function monthYear(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(LOCALES[lang], { month: "long", year: "numeric" }).format(new Date(iso));
}

/** GitHub's own language colors for the languages that appear on the profile. */
const LANGUAGE_COLORS: Record<string, string> = {
  PHP: "#4F5D95",
  Python: "#3572A5",
  "C++": "#f34b7d",
  Batchfile: "#C1F12E",
  Kotlin: "#A97BFF",
  Go: "#00ADD8",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C#": "#178600",
  Java: "#b07219",
  PowerShell: "#012456",
  Shell: "#89e051",
};

export function languageColor(language: string | null) {
  return (language && LANGUAGE_COLORS[language]) || "#8b8b94";
}
