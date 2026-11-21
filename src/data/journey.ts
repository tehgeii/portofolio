import type { LucideIcon } from "lucide-react";
import { BookOpen, Code2, GraduationCap, Rocket, Sparkles } from "lucide-react";
import { semesterAt, semesterPeriod } from "../lib/semester";
import type { Localized } from "../types";

export interface JourneyItem {
  period: Localized;
  /** Semester entries get their dates and "now" badge from the calendar. */
  semester?: number;
  title: Localized;
  place?: string;
  description: Localized;
  tags: string[];
  icon: LucideIcon;
  current?: boolean;
}

/** Newest first. */
const entries: JourneyItem[] = [
  {
    period: { id: "", en: "" },
    semester: 5,
    title: { id: "Semester 5 · Data Mining & Android", en: "Semester 5 · Data Mining & Android" },
    place: "UDINUS",
    description: {
      id: "Membangun ZZZ Gacha Predictor bersama tim untuk membandingkan 6 algoritma data mining, merilis NgiBsen untuk membantu teman-teman kuliah absen tepat waktu, dan membuat WiFi Speed Tester dengan Go.",
      en: "Built the ZZZ Gacha Predictor with my team to compare 6 data mining algorithms, shipped NgiBsen to help classmates check in on time, and created a WiFi Speed Tester in Go.",
    },
    tags: ["Python", "Kotlin", "Go", "Machine Learning"],
    icon: Sparkles,
  },
  {
    period: { id: "", en: "" },
    semester: 4,
    title: { id: "Semester 4 · Pemrograman Web Lanjut", en: "Semester 4 · Advanced Web Programming" },
    place: "UDINUS",
    description: {
      id: "Mendalami arsitektur MVC dengan CodeIgniter 4 dan membangun Laundry App sebagai project UAS, serta bereksperimen dengan React + Tailwind untuk dashboard admin.",
      en: "Dug into MVC architecture with CodeIgniter 4 and built the Laundry App as my final project, while experimenting with React + Tailwind for an admin dashboard.",
    },
    tags: ["PHP", "CodeIgniter 4", "MySQL", "React"],
    icon: Code2,
  },
  {
    period: { id: "Sep – Nov 2025", en: "Sep – Nov 2025" },
    title: { id: "Meluncurkan TGO", en: "Launched TGO" },
    place: "Tech Gameplay",
    description: {
      id: "Merilis TGO (Tech Gameplay Optimizer) sebagai project open-source untuk komunitas gamer, serta merapikan koleksi aplikasi & regedit untuk penonton YouTube.",
      en: "Released TGO (Tech Gameplay Optimizer) as an open-source project for the gaming community, and organized app & regedit collections for YouTube viewers.",
    },
    tags: ["Batch", "PowerShell", "Windows", "Open Source"],
    icon: Rocket,
  },
  {
    period: { id: "2025", en: "2025" },
    title: { id: "Semester 2–3 · Algoritma & Web", en: "Semesters 2–3 · Algorithms & Web" },
    place: "UDINUS",
    description: {
      id: "Memperkuat dasar algoritma dan struktur data dengan C++, lalu mulai membangun website dinamis pertama dengan PHP di mata kuliah Pemrograman Berbasis Web.",
      en: "Strengthened my algorithms and data structures foundation in C++, then built my first dynamic websites with PHP in the Web-Based Programming course.",
    },
    tags: ["C++", "PHP", "HTML & CSS"],
    icon: BookOpen,
  },
  {
    period: { id: "2024", en: "2024" },
    title: { id: "Mulai Kuliah Teknik Informatika", en: "Started Informatics Engineering" },
    place: "Universitas Dian Nuswantoro",
    description: {
      id: "Memulai studi S1 Teknik Informatika di UDINUS, Semarang. Belajar dasar pemrograman dengan C++ dan mulai rutin menyimpan kode di GitHub.",
      en: "Began my B.Sc. in Informatics Engineering at UDINUS, Semarang. Learned programming fundamentals in C++ and started keeping my code on GitHub.",
    },
    tags: ["C++", "Git", "GitHub"],
    icon: GraduationCap,
  },
];

/**
 * The timeline with semester dates filled in and the running semester marked
 * "now". If a new semester has started before it has its own entry, a short
 * placeholder keeps the timeline honest until the entry is written.
 */
export function journeyAt(date: Date): JourneyItem[] {
  const now = semesterAt(date);
  const items = entries.map((item) =>
    item.semester
      ? { ...item, period: semesterPeriod(item.semester, item.semester === now), current: item.semester === now }
      : item,
  );
  const newest = Math.max(...entries.map((e) => e.semester ?? 0));
  if (now && now > newest) {
    items.unshift({
      semester: now,
      period: semesterPeriod(now, true),
      title: { id: `Semester ${now}`, en: `Semester ${now}` },
      place: "UDINUS",
      description: {
        id: `Sedang menjalani semester ${now} Teknik Informatika di UDINUS.`,
        en: `Currently in semester ${now} of Informatics Engineering at UDINUS.`,
      },
      tags: [],
      icon: GraduationCap,
      current: true,
    });
  }
  return items;
}

export const journey = journeyAt(new Date());
