import type { Localized } from "../types";

/**
 * UDINUS academic calendar: odd semesters run September–January, even
 * semesters February–July (August is the break after an even semester).
 */
export const STUDY_START_YEAR = 2024;
export const LAST_SEMESTER = 8;

/** The semester running on `date`, or null before the start / after the last one. */
export function semesterAt(date: Date, startYear = STUDY_START_YEAR): number | null {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const semester =
    month >= 9
      ? 2 * (year - startYear) + 1
      : month === 1
        ? 2 * (year - 1 - startYear) + 1
        : 2 * (year - 1 - startYear) + 2;
  return semester >= 1 && semester <= LAST_SEMESTER ? semester : null;
}

const MONTHS = {
  id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** "Feb – Jul 2026", "Sep 2025 – Jan 2026", or "Sep 2026 – Sekarang" for the running semester. */
export function semesterPeriod(semester: number, current: boolean, startYear = STUDY_START_YEAR): Localized {
  const odd = semester % 2 === 1;
  const year = startYear + Math.floor((semester - 1) / 2) + (odd ? 0 : 1);
  const label = (lang: "id" | "en") => {
    const m = MONTHS[lang];
    if (current) return `${odd ? m[8] : m[1]} ${year} – ${lang === "id" ? "Sekarang" : "Present"}`;
    return odd ? `${m[8]} ${year} – ${m[0]} ${year + 1}` : `${m[1]} – ${m[6]} ${year}`;
  };
  return { id: label("id"), en: label("en") };
}
