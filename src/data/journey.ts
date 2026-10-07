import type { LucideIcon } from "lucide-react";
import { BookOpen, Code2, GraduationCap, Rocket, Sparkles } from "lucide-react";
import type { Localized } from "../types";

export interface JourneyItem {
  period: Localized;
  title: Localized;
  place?: string;
  description: Localized;
  tags: string[];
  icon: LucideIcon;
  current?: boolean;
}

/** Newest first. */
export const journey: JourneyItem[] = [
  {
    period: { id: "Sep 2026 – Sekarang", en: "Sep 2026 – Present" },
    title: { id: "Semester 5 · Data Mining & Android", en: "Semester 5 · Data Mining & Android" },
    place: "UDINUS",
    description: {
      id: "Membangun ZZZ Gacha Predictor dengan XGBoost (akurasi 96.70%), merilis NgiBsen untuk membantu teman-teman kuliah absen tepat waktu, dan membuat WiFi Speed Tester dengan Go.",
      en: "Built the ZZZ Gacha Predictor with XGBoost (96.70% accuracy), shipped NgiBsen to help classmates check in on time, and created a WiFi Speed Tester in Go.",
    },
    tags: ["Python", "Kotlin", "Go", "Machine Learning"],
    icon: Sparkles,
    current: true,
  },
  {
    period: { id: "Feb – Jul 2026", en: "Feb – Jul 2026" },
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
      id: "Merilis TGO (Tech Gameplay Optimizer) sebagai project open-source untuk komunitas gamer, mengembangkan TGOpti dengan C#, dan merapikan koleksi aplikasi & regedit untuk penonton YouTube.",
      en: "Released TGO (Tech Gameplay Optimizer) as an open-source project for the gaming community, developed TGOpti in C#, and organized app & regedit collections for YouTube viewers.",
    },
    tags: ["Batch", "C#", "Windows", "Open Source"],
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
