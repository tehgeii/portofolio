import type { Localized, LocalizedList } from "../types";

/**
 * CV-only content. Everything else (name, contacts, projects, skills) comes
 * from the same data files as the website, so both always stay in sync.
 *
 * `null` means "not filled in yet": the CV shows a yellow "Fill in" marker
 * there, and `npm run cv:pdf` lists every marker that is still left.
 */

export interface CvEducation {
  school: string;
  degree: Localized;
  location: string;
  start: string;
  /** Expected graduation, e.g. "2028". */
  end: string | null;
  /** Leave null to fill in later; set to "" to hide it on purpose. */
  gpa: string | null;
  courses: LocalizedList;
}

export interface CvEntry {
  role: Localized;
  org: string;
  period: Localized;
  bullets: LocalizedList;
}

export interface CvLanguage {
  name: Localized;
  level: Localized | null;
}

export const cv = {
  /** Optional. Leave "" to hide the phone number. */
  phone: "" as string,

  headline: {
    id: "Mahasiswa Teknik Informatika & Software Developer",
    en: "Informatics Student & Software Developer",
  } satisfies Localized,

  summary: {
    id: "Mahasiswa Teknik Informatika UDINUS yang senang membangun software yang benar-benar dipakai orang. Berpengalaman membuat tool desktop open-source (TGO), aplikasi Android dengan Kotlin & Jetpack Compose, web dengan React dan CodeIgniter, serta aplikasi data mining berbasis machine learning. Terbiasa bekerja mandiri dari ide sampai rilis, dan aktif berbagi lewat kanal YouTube Tech Gameplay Indonesia.",
    en: "Informatics Engineering student at UDINUS who loves building software people actually use. Experienced in shipping an open-source desktop tool (TGO), Android apps with Kotlin & Jetpack Compose, web apps with React and CodeIgniter, and machine-learning powered data mining apps. Comfortable taking work from idea to release, and actively sharing knowledge on the Tech Gameplay Indonesia YouTube channel.",
  } satisfies Localized,

  education: [
    {
      school: "Universitas Dian Nuswantoro (UDINUS)",
      degree: { id: "S1 Teknik Informatika", en: "B.Sc. in Informatics Engineering" },
      location: "Semarang",
      start: "2024",
      end: null,
      gpa: null,
      courses: {
        id: ["Algoritma & Struktur Data", "Pemrograman Web Lanjut", "Pemrograman Berbasis Web", "Penambangan Data"],
        en: ["Algorithms & Data Structures", "Advanced Web Programming", "Web-Based Programming", "Data Mining"],
      },
    },
  ] satisfies CvEducation[],

  experience: [
    {
      role: { id: "Kreator & Developer", en: "Creator & Developer" },
      org: "TGO · Tech Gameplay Indonesia",
      period: { id: "2025 – Sekarang", en: "2025 – Present" },
      bullets: {
        id: [
          "Membangun dan memelihara TGO (Tech Gameplay Optimizer), tool optimasi Windows open-source yang dirilis hingga v3.1 dan didistribusikan lewat tgopremium.my.id.",
          "Mengembangkan TGOpti (C#), aplikasi desktop untuk membersihkan dan mempercepat PC.",
          "Mengelola kanal YouTube Tech Gameplay Indonesia dan merangkum 58 part kumpulan aplikasi serta 33 part tweak Registry untuk penonton lewat GitHub Releases.",
        ],
        en: [
          "Built and maintain TGO (Tech Gameplay Optimizer), an open-source Windows optimization tool released up to v3.1 and distributed via tgopremium.my.id.",
          "Developed TGOpti (C#), a desktop app that cleans up and speeds up PCs.",
          "Run the Tech Gameplay Indonesia YouTube channel and curated 58 parts of useful apps and 33 parts of Registry tweaks for viewers via GitHub Releases.",
        ],
      },
    },
  ] satisfies CvEntry[],

  /** Organisations, committees, lab assistant roles, internships… */
  organizations: [] as CvEntry[],

  /** Projects shown on the CV, in this order (slugs from projects.ts). */
  projectSlugs: ["ngibsen", "zzz-gacha-mining", "wifi-speed-tester", "laundry-app"],

  languages: [
    { name: { id: "Bahasa Indonesia", en: "Indonesian" }, level: { id: "Bahasa ibu", en: "Native" } },
    { name: { id: "Bahasa Inggris", en: "English" }, level: null },
  ] satisfies CvLanguage[],
};
