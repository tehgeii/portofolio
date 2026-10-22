import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Rocket, Smartphone, Sparkles, Wifi } from "lucide-react";
import ngibsenJadwal from "../assets/projects/ngibsen-jadwal.webp";
import ngibsenRiwayat from "../assets/projects/ngibsen-riwayat.webp";
import tgoAppManager from "../assets/projects/tgo-app-manager.webp";
import tgoDashboardCover from "../assets/projects/tgo-dashboard-cover.webp";
import tgoDashboard from "../assets/projects/tgo-dashboard.webp";
import zzzBerandaCover from "../assets/projects/zzz-predictor-beranda-cover.webp";
import zzzBeranda from "../assets/projects/zzz-predictor-beranda.webp";
import zzzKalkulatorCover from "../assets/projects/zzz-predictor-kalkulator-cover.webp";
import zzzKalkulator from "../assets/projects/zzz-predictor-kalkulator.webp";
import wifiHistory from "../assets/projects/wifi-tester-history.webp";
import wifiMainCover from "../assets/projects/wifi-tester-main-cover.webp";
import wifiMain from "../assets/projects/wifi-tester-main.webp";
import type { Localized, LocalizedList } from "../types";

export type ProjectCategory = "web" | "mobile" | "desktop" | "data";

export interface ProjectLink {
  kind: "repo" | "live" | "website";
  url: string;
  /** Optional custom label, e.g. when a project has two repositories. */
  label?: Localized;
}

export interface ProjectStat {
  value: string;
  label: Localized;
}

/**
 * A real screenshot. Personal details (schedules, rooms, class codes,
 * attendance numbers…) must be blurred before an image is added here.
 */
export interface ProjectScreenshot {
  src: string;
  /** Tighter crop for the project card; defaults to `src`. */
  thumb?: string;
  alt: Localized;
  device: "phone" | "desktop";
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  category: ProjectCategory;
  featured?: boolean;
  /** Kept for the CV but not shown on the website. */
  archived?: boolean;
  /** Team projects show the owner's role. */
  role?: Localized;
  summary: Localized;
  description: Localized;
  highlights: LocalizedList;
  tech: string[];
  stats?: ProjectStat[];
  links: ProjectLink[];
  /** Shown on the card and in the details modal when available. */
  screenshots?: ProjectScreenshot[];
  /** Short note above the screenshots, e.g. when they show a version in development. */
  screenshotsNote?: Localized;
  /** Visual identity of the generated cover. */
  icon: LucideIcon;
  file: string;
  gradient: [string, string];
}

export const projectCategories: { key: ProjectCategory | "all"; label: Localized }[] = [
  { key: "all", label: { id: "Semua", en: "All" } },
  { key: "web", label: { id: "Web", en: "Web" } },
  { key: "mobile", label: { id: "Mobile", en: "Mobile" } },
  { key: "desktop", label: { id: "Desktop & Tools", en: "Desktop & Tools" } },
  { key: "data", label: { id: "Data & ML", en: "Data & ML" } },
];

export const allProjects: Project[] = [
  {
    slug: "tgo",
    title: "TGO · Tech Gameplay Optimizer",
    year: "2025",
    category: "desktop",
    featured: true,
    summary: {
      id: "Tool open-source untuk membersihkan dan men-tweak Windows agar lebih responsif dan input lag lebih rendah saat gaming.",
      en: "An open-source tool that cleans and tweaks Windows for a snappier system and lower input latency while gaming.",
    },
    description: {
      id: "TGO lahir dari keresahan saya sebagai gamer: PC terasa berat padahal spesifikasinya cukup. TGO merangkum puluhan tweak Windows (registry, services, power plan, disk, hingga input device) ke dalam satu menu interaktif yang mudah dipakai, lengkap dengan opsi revert untuk keamanan. Versi terbarunya kini didistribusikan lewat website resmi tgopremium.my.id.",
      en: "TGO was born from my frustration as a gamer: PCs felt sluggish even with decent specs. It bundles dozens of Windows tweaks (registry, services, power plans, disk, and input devices) into one easy interactive menu, with revert options for safety. The latest version is now distributed through the official website, tgopremium.my.id.",
    },
    highlights: {
      id: [
        "Preset Mouse & Keyboard (Low / Medium / High) untuk menurunkan input latency, lengkap dengan revert",
        "Optimasi berbeda untuk HDD dan SSD, pembersihan temp, cache update, dan TRIM",
        "Pengaturan RAM, power saving, dan startup (via Sysinternals Autoruns)",
        "Membuat System Restore point langsung dari menu sebelum mengubah sistem",
        "Otomatis meminta hak Administrator, mendukung Windows 10 & 11",
      ],
      en: [
        "Mouse & Keyboard presets (Low / Medium / High) to reduce input latency, with revert",
        "Separate HDD and SSD optimizations, temp & update-cache cleanup, and TRIM",
        "RAM, power-saving, and startup tuning (via Sysinternals Autoruns)",
        "Creates a System Restore point right from the menu before changing anything",
        "Auto-elevates to Administrator, supports Windows 10 & 11",
      ],
    },
    tech: ["Batch", "Windows Registry", "PowerShell", "fsutil"],
    stats: [
      { value: "v3.1", label: { id: "Versi rilis", en: "Release" } },
      { value: "6★", label: { id: "Bintang GitHub", en: "GitHub stars" } },
      { value: "10/11", label: { id: "Windows", en: "Windows" } },
    ],
    links: [
      { kind: "website", url: "https://tgopremium.my.id" },
      { kind: "repo", url: "https://github.com/tehgeii/TGO" },
    ],
    screenshots: [
      {
        src: tgoDashboard,
        thumb: tgoDashboardCover,
        device: "desktop",
        alt: {
          id: "Dashboard TGO: spesifikasi perangkat dan pemantauan CPU, RAM, disk, GPU, jaringan secara real-time",
          en: "TGO dashboard: device specs and real-time CPU, RAM, disk, GPU and network monitoring",
        },
      },
      {
        src: tgoAppManager,
        device: "desktop",
        alt: {
          id: "App Manager TGO: pasang aplikasi populer atau hapus aplikasi desktop & Microsoft Store beserta sisa filenya",
          en: "TGO App Manager: install popular apps, or uninstall desktop & Microsoft Store apps and their leftovers",
        },
      },
    ],
    screenshotsNote: {
      id: "Pratinjau tampilan baru TGO yang masih dalam pengembangan.",
      en: "A preview of TGO's new interface, still in development.",
    },
    icon: Rocket,
    file: "TGO.bat",
    gradient: ["#7c3aed", "#ec4899"],
  },
  {
    slug: "ngibsen",
    title: "NgiBsen UDINUS",
    year: "2026",
    category: "mobile",
    summary: {
      id: "Aplikasi Android pengingat absen kuliah untuk mahasiswa UDINUS, dengan bukti absen yang terkirim otomatis ke Telegram.",
      en: "An Android app that reminds UDINUS students to take class attendance, sending proof straight to Telegram.",
    },
    description: {
      id: "NgiBsen (peNGIngat aBSEN) memastikan mahasiswa tidak lupa presensi. Saat jam absen dibuka, HP bergetar dengan nama mata kuliah; satu tap membuka halaman presensi SiAdin (dengan login otomatis) atau Dinusverse. Tombol presensi tetap ditekan sendiri oleh pemilik HP. Aplikasi hanya mengingatkan, membuka halaman, mencatat, dan mengirim bukti ke Telegram.",
      en: 'NgiBsen ("attendance reminder" in Indonesian slang) makes sure students never forget to check in. When attendance opens, the phone vibrates with the course name; one tap opens the SiAdin attendance page (with auto-login) or Dinusverse. The student always presses the attendance button themselves. The app only reminds, opens the page, logs, and sends proof to Telegram.',
    },
    highlights: {
      id: [
        "Notifikasi tepat waktu dengan AlarmManager, tetap jalan saat Doze & setelah reboot",
        "Browser mini dengan login otomatis ke Presensi Online SiAdin",
        "Kirim screenshot / bukti absen ke Telegram dalam satu tap, dengan retry offline",
        "Pengingat ulang berkala sampai absen ditandai selesai",
        "Mendukung Android 8.0 hingga Android 16",
      ],
      en: [
        "Precise notifications via AlarmManager that survive Doze and reboots",
        "Mini browser with auto-login to SiAdin Online Attendance",
        "One-tap screenshot / proof delivery to Telegram, with offline retry",
        "Recurring reminders until attendance is marked done",
        "Supports Android 8.0 up to Android 16",
      ],
    },
    tech: ["Kotlin", "Jetpack Compose", "Material 3", "Room", "WorkManager", "OkHttp", "Telegram Bot API"],
    stats: [
      { value: "v2.3", label: { id: "Versi", en: "Version" } },
      { value: "8–16", label: { id: "Android", en: "Android" } },
      { value: "1 tap", label: { id: "Kirim bukti", en: "Send proof" } },
    ],
    links: [{ kind: "repo", url: "https://github.com/tehgeii/sistem-bot-otomatis" }],
    icon: Smartphone,
    file: "MainActivity.kt",
    screenshots: [
      {
        src: ngibsenJadwal,
        device: "phone",
        alt: {
          id: "Halaman Jadwal NgiBsen: daftar mata kuliah per hari dan status absen hari ini",
          en: "NgiBsen schedule screen: courses per day and today's attendance status",
        },
      },
      {
        src: ngibsenRiwayat,
        device: "phone",
        alt: {
          id: "Halaman Riwayat NgiBsen: grafik kehadiran per minggu dan bukti absen yang terkirim",
          en: "NgiBsen history screen: weekly attendance chart and sent attendance proofs",
        },
      },
    ],
    gradient: ["#10b981", "#0ea5e9"],
  },
  {
    slug: "zzz-gacha-mining",
    title: "ZZZ Gacha Mining & Predictor",
    year: "2026",
    category: "data",
    archived: true,
    summary: {
      id: "Web app data mining untuk menganalisis riwayat gacha Zenless Zone Zero dan memprediksi S-Rank dengan Markov Chain, Random Forest, dan XGBoost.",
      en: "A data mining web app that analyzes Zenless Zone Zero gacha history and predicts S-Ranks with Markov Chains, Random Forest, and XGBoost.",
    },
    description: {
      id: "Tugas besar mata kuliah Penambangan Data semester 5. Pengguna cukup menjalankan satu baris perintah PowerShell untuk mengekstrak URL riwayat tarikan, lalu aplikasi menampilkan statistik akun, pity real-time, simulasi Monte Carlo, dan prediksi dari tiga pendekatan yang dibandingkan secara akademik.",
      en: "My semester-5 Data Mining capstone. Users run a single PowerShell command to extract their pull-history URL, and the app shows account stats, real-time pity, Monte Carlo simulations, and predictions from three approaches compared side by side.",
    },
    highlights: {
      id: [
        "XGBoost dengan akurasi 96.70% dan MAE ±4.37 pull",
        "Absorbing Markov Chain dengan matriks fundamental N = (I − Q)⁻¹ untuk peluang eksak",
        "Simulasi Monte Carlo 10.000 percobaan secara real-time",
        "Pipeline ekstraksi otomatis via PowerShell 1-liner (deteksi registry & cache game)",
        "Dashboard statistik akun, winrate 50:50 / 75:25, dan riwayat S-Rank",
      ],
      en: [
        "XGBoost reaching 96.70% accuracy with a ±4.37 pull MAE",
        "Absorbing Markov Chain with fundamental matrix N = (I − Q)⁻¹ for exact odds",
        "Real-time 10,000-trial Monte Carlo simulation",
        "Auto-extraction pipeline via a PowerShell one-liner (registry & game cache detection)",
        "Account dashboard with 50:50 / 75:25 win rates and S-Rank history",
      ],
    },
    tech: ["Python", "Streamlit", "XGBoost", "Random Forest", "Markov Chain", "PowerShell"],
    stats: [
      { value: "96.7%", label: { id: "Akurasi", en: "Accuracy" } },
      { value: "10K", label: { id: "Simulasi", en: "Simulations" } },
      { value: "3", label: { id: "Algoritma", en: "Algorithms" } },
    ],
    links: [
      { kind: "live", url: "https://zzz-gacha-mining.streamlit.app/" },
      { kind: "repo", url: "https://github.com/tehgeii/zzz-gacha-mining" },
    ],
    icon: BrainCircuit,
    file: "predictor.py",
    gradient: ["#f59e0b", "#ef4444"],
  },
  {
    slug: "wifi-speed-tester",
    title: "WiFi Speed + Ping Tester",
    year: "2026",
    category: "desktop",
    summary: {
      id: "Utility Windows portable untuk mengukur download, upload, ping, jitter, packet loss, dan latency under load.",
      en: "A portable Windows utility that measures download, upload, ping, jitter, packet loss, and latency under load.",
    },
    description: {
      id: "Tanpa installer, tanpa background service: cukup ekstrak dan jalankan. Aplikasi mendeteksi jaringan aktif, menampilkan detail Wi-Fi, lalu memberi rating koneksi dengan bahasa yang mudah dipahami, termasuk mode khusus gaming yang menilai stabilitas ping.",
      en: "No installer, no background service: just extract and run. It detects the active network, shows Wi-Fi details, and rates the connection in plain language, including a gaming mode that scores ping stability.",
    },
    highlights: {
      id: [
        "Tes download/upload multi-koneksi dengan gauge & grafik live",
        "Deteksi bufferbloat lewat ping saat jaringan sedang dibebani",
        "Gaming mode: menilai ping, jitter, dan loss, bukan sekadar bandwidth",
        "Ekspor ke TXT, JSON, CSV, dan kartu hasil PNG (data sensitif disamarkan)",
        "Pure Go, mendukung x64 & ARM64, dengan CI di GitHub Actions",
      ],
      en: [
        "Multi-connection download/upload tests with a live gauge & chart",
        "Bufferbloat hints by sampling ping while the link is loaded",
        "Gaming mode that rates ping, jitter, and loss instead of bandwidth",
        "Export to TXT, JSON, CSV, and a PNG result card (sensitive data masked)",
        "Pure Go, x64 & ARM64 builds, with CI on GitHub Actions",
      ],
    },
    tech: ["Go", "WebView2", "JavaScript", "GitHub Actions"],
    stats: [
      { value: "0", label: { id: "Installer", en: "Installers" } },
      { value: "4", label: { id: "Format ekspor", en: "Export formats" } },
      { value: "2", label: { id: "Arsitektur", en: "Architectures" } },
    ],
    links: [{ kind: "repo", url: "https://github.com/tehgeii/wifi-speed-tester" }],
    icon: Wifi,
    file: "main.go",
    screenshots: [
      {
        src: wifiMain,
        thumb: wifiMainCover,
        device: "desktop",
        alt: {
          id: "Hasil tes WiFi Speed + Ping Tester: download, upload, ping, jitter, packet loss dan rating koneksi",
          en: "WiFi Speed + Ping Tester results: download, upload, ping, jitter, packet loss and connection rating",
        },
      },
      {
        src: wifiHistory,
        device: "desktop",
        alt: {
          id: "Riwayat tes dengan grafik kecepatan & ping serta rata-rata per koneksi",
          en: "Test history with speed & ping charts and averages per connection",
        },
      },
    ],
    gradient: ["#06b6d4", "#3b82f6"],
  },
  {
    slug: "zzz-predictor-team",
    title: "ZZZ Gacha Predictor (Team)",
    year: "2026",
    category: "data",
    role: {
      id: "Pengembang aplikasi, pengumpulan & pengujian data asli",
      en: "App developer, real-data collection & testing",
    },
    summary: {
      id: "Project kelompok yang membandingkan 6 algoritma data mining untuk memprediksi peluang S-Rank, dengan Markov Chain sebagai acuan teori.",
      en: "A team project comparing 6 data mining algorithms to predict S-Rank odds, using a Markov Chain as the theoretical baseline.",
    },
    description: {
      id: "Dikerjakan bersama 4 rekan satu kelas. Saya bertanggung jawab membangun aplikasinya serta mengumpulkan dan menguji data asli. Aplikasi bisa dibuka di HP maupun laptop dan mendukung tiga cara impor data.",
      en: "Built with four classmates. I was responsible for developing the app and for collecting and testing the real data. It runs on phones and laptops and supports three ways to import data.",
    },
    highlights: {
      id: [
        "Perbandingan Naive Bayes, KNN, Logistic Regression, Decision Tree, Random Forest, dan XGBoost",
        "Metrik lengkap: Accuracy, F1, ROC-AUC, Log Loss, Brier, dan cross-validation",
        "Impor data via URL PowerShell, file UIGF, atau input manual",
        "Kalkulator peluang eksak dan konversi Polychrome",
      ],
      en: [
        "Compares Naive Bayes, KNN, Logistic Regression, Decision Tree, Random Forest, and XGBoost",
        "Full metrics: Accuracy, F1, ROC-AUC, Log Loss, Brier, and cross-validation",
        "Import via PowerShell URL, UIGF file, or manual input",
        "Exact odds calculator and Polychrome conversion",
      ],
    },
    tech: ["Python", "Streamlit", "scikit-learn", "XGBoost", "pytest"],
    stats: [
      { value: "6", label: { id: "Algoritma", en: "Algorithms" } },
      { value: "5", label: { id: "Anggota tim", en: "Team members" } },
      { value: "3", label: { id: "Cara impor", en: "Import modes" } },
    ],
    links: [
      { kind: "live", url: "https://project-data-mining-zzz.streamlit.app/" },
      { kind: "repo", url: "https://github.com/tehgeii/project-data-mining" },
    ],
    icon: Sparkles,
    file: "streamlit_app.py",
    screenshots: [
      {
        src: zzzBeranda,
        thumb: zzzBerandaCover,
        device: "desktop",
        alt: {
          id: "Beranda ZZZ Gacha Predictor dengan menu dan aturan banner yang dipakai",
          en: "ZZZ Gacha Predictor home page with navigation and the banner rules used",
        },
      },
      {
        src: zzzKalkulator,
        thumb: zzzKalkulatorCover,
        device: "desktop",
        alt: {
          id: "Kalkulator peluang S-Rank berbasis Markov Chain",
          en: "Markov Chain based S-Rank odds calculator",
        },
      },
    ],
    gradient: ["#8b5cf6", "#06b6d4"],
  },
];

/** Projects shown on the website, in this order. */
export const projects = allProjects.filter((p) => !p.archived);
