import type { Localized } from "../types";

export type SkillCategoryKey = "languages" | "frameworks" | "data" | "tools";

export interface Skill {
  name: string;
  /** Dot color, using GitHub's language colors where one exists. */
  color: string;
  /** Short note shown on hover/focus. */
  note: Localized;
}

export interface SkillCategory {
  key: SkillCategoryKey;
  title: Localized;
  description: Localized;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    key: "languages",
    title: { id: "Bahasa Pemrograman", en: "Languages" },
    description: {
      id: "Bahasa yang saya pakai untuk kuliah dan project nyata.",
      en: "Languages I use for coursework and real projects.",
    },
    skills: [
      { name: "JavaScript", color: "#f1e05a", note: { id: "Web interaktif & React", en: "Interactive web & React" } },
      {
        name: "TypeScript",
        color: "#3178c6",
        note: { id: "Web yang lebih aman & rapi", en: "Safer, cleaner web code" },
      },
      { name: "Kotlin", color: "#A97BFF", note: { id: "Aplikasi Android (NgiBsen)", en: "Android apps (NgiBsen)" } },
      { name: "Python", color: "#3572A5", note: { id: "Data mining & ML", en: "Data mining & ML" } },
      { name: "Go", color: "#00ADD8", note: { id: "WiFi Speed Tester", en: "WiFi Speed Tester" } },
      { name: "PHP", color: "#4F5D95", note: { id: "Backend web & CodeIgniter", en: "Web backend & CodeIgniter" } },
      { name: "C++", color: "#f34b7d", note: { id: "Algoritma & struktur data", en: "Algorithms & data structures" } },
      { name: "C#", color: "#178600", note: { id: "Aplikasi desktop Windows", en: "Windows desktop apps" } },
      {
        name: "Batch & PowerShell",
        color: "#C1F12E",
        note: { id: "Otomasi & tweak Windows (TGO)", en: "Windows automation & tweaks (TGO)" },
      },
      { name: "HTML & CSS", color: "#e34c26", note: { id: "Fondasi setiap web", en: "The foundation of every site" } },
      { name: "SQL", color: "#e38c00", note: { id: "MySQL & Room (SQLite)", en: "MySQL & Room (SQLite)" } },
    ],
  },
  {
    key: "frameworks",
    title: { id: "Framework & Library", en: "Frameworks & Libraries" },
    description: {
      id: "Alat bantu untuk membangun produk lebih cepat.",
      en: "Tools that help me ship products faster.",
    },
    skills: [
      { name: "React", color: "#61dafb", note: { id: "UI berbasis komponen", en: "Component-based UI" } },
      {
        name: "Tailwind CSS",
        color: "#38bdf8",
        note: { id: "Styling cepat & konsisten", en: "Fast, consistent styling" },
      },
      { name: "Vite", color: "#a855f7", note: { id: "Build tool modern", en: "Modern build tool" } },
      {
        name: "Jetpack Compose",
        color: "#4285F4",
        note: { id: "UI Android deklaratif", en: "Declarative Android UI" },
      },
      { name: "CodeIgniter 4", color: "#ef4223", note: { id: "Framework PHP MVC", en: "PHP MVC framework" } },
      { name: "Streamlit", color: "#ff4b4b", note: { id: "Web app data science", en: "Data science web apps" } },
    ],
  },
  {
    key: "data",
    title: { id: "Data & Machine Learning", en: "Data & Machine Learning" },
    description: {
      id: "Mengolah data menjadi prediksi yang bisa dipercaya.",
      en: "Turning raw data into trustworthy predictions.",
    },
    skills: [
      {
        name: "scikit-learn",
        color: "#f7931e",
        note: { id: "Random Forest, KNN, Naive Bayes", en: "Random Forest, KNN, Naive Bayes" },
      },
      {
        name: "XGBoost",
        color: "#2e86de",
        note: { id: "Akurasi 96.70% di ZZZ Predictor", en: "96.70% accuracy on ZZZ Predictor" },
      },
      { name: "Pandas & NumPy", color: "#e70488", note: { id: "Pengolahan data", en: "Data wrangling" } },
      {
        name: "Markov Chain",
        color: "#10b981",
        note: { id: "Model probabilitas eksak", en: "Exact probability models" },
      },
      {
        name: "Monte Carlo",
        color: "#f59e0b",
        note: { id: "Simulasi 10.000 percobaan", en: "10,000-trial simulations" },
      },
    ],
  },
  {
    key: "tools",
    title: { id: "Tools & Platform", en: "Tools & Platforms" },
    description: {
      id: "Yang menemani saya setiap hari saat ngoding.",
      en: "What I work with every day while coding.",
    },
    skills: [
      {
        name: "Git & GitHub",
        color: "#f05032",
        note: { id: "Version control & kolaborasi", en: "Version control & collaboration" },
      },
      { name: "GitHub Actions", color: "#2088ff", note: { id: "CI & deploy otomatis", en: "CI & automated deploys" } },
      { name: "VS Code", color: "#007acc", note: { id: "Editor utama", en: "Main editor" } },
      { name: "Android Studio", color: "#3ddc84", note: { id: "Pengembangan Android", en: "Android development" } },
      {
        name: "Windows Internals",
        color: "#0078d4",
        note: { id: "Registry, services, power plan", en: "Registry, services, power plans" },
      },
      {
        name: "Telegram Bot API",
        color: "#26a5e4",
        note: { id: "Notifikasi & bukti absen", en: "Notifications & proof delivery" },
      },
      { name: "MySQL", color: "#00758f", note: { id: "Database relasional", en: "Relational database" } },
    ],
  },
];

/** Flat list used by the marquee strip under the hero. */
export const allSkillNames = skillCategories.flatMap((c) => c.skills.map((s) => s.name));
