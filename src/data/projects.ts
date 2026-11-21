import type { LucideIcon } from "lucide-react";
import { BrainCircuit, LayoutTemplate, Rocket, Smartphone, Sparkles, Wifi } from "lucide-react";
import ngibsenJadwalThumb from "../assets/projects/ngibsen-jadwal-thumb.webp";
import ngibsenJadwal from "../assets/projects/ngibsen-jadwal.webp";
import ngibsenRiwayatThumb from "../assets/projects/ngibsen-riwayat-thumb.webp";
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
import portfolioDarkCover from "../assets/projects/portfolio-dark-cover.webp";
import portfolioDark from "../assets/projects/portfolio-dark.webp";
import portfolioLight from "../assets/projects/portfolio-light.webp";
import type { Localized, LocalizedList } from "../types";

export type ProjectCategory = "web" | "mobile" | "desktop" | "data";

export interface ProjectLink {
  kind: "repo" | "live" | "website";
  url: string;
  /** Optional custom label, e.g. when a project has two repositories. */
  label?: Localized;
  /** An older version kept for reference; its repo summary isn't the project's. */
  legacy?: boolean;
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
  /** Width and height of `src` in pixels, so the page doesn't jump while it loads. */
  size: [number, number];
  /** Smaller image or tighter crop for the project card; defaults to `src`. */
  thumb?: string;
  thumbSize?: [number, number];
  alt: Localized;
  device: "phone" | "desktop";
}

/** Problem → approach → result, shown in the project details. */
export interface ProjectStory {
  problem: Localized;
  approach: Localized;
  result: Localized;
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
  story?: ProjectStory;
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
      id: "Aplikasi desktop Windows untuk memantau dan mengoptimalkan PC agar lebih responsif dan input lag lebih rendah saat gaming.",
      en: "A Windows desktop app that monitors and tunes your PC for a snappier system and lower input latency while gaming.",
    },
    description: {
      id: "TGO lahir dari keresahan saya sebagai gamer: PC terasa berat padahal spesifikasinya cukup. Berawal dari script batch open-source, TGO kini menjadi aplikasi desktop C#/.NET dengan dashboard yang menampilkan kondisi perangkat secara real-time dan modul optimasi untuk tiap komponen. TGO bisa dipakai gratis, dengan fitur tambahan lewat lisensi Premium, dan didistribusikan melalui tgopremium.my.id.",
      en: "TGO was born from my frustration as a gamer: PCs felt sluggish even with decent specs. It started as an open-source batch script and is now a C#/.NET desktop app with a real-time dashboard of the device and optimization modules for each component. TGO is free to use, with extra features through a Premium license, and is distributed through tgopremium.my.id.",
    },
    story: {
      problem: {
        id: "PC gaming sering terasa berat dan input lag-nya tinggi padahal spesifikasinya cukup, sementara tweak Windows tersebar di banyak forum dan berisiko kalau diterapkan sembarangan.",
        en: "Gaming PCs often feel sluggish with high input lag despite decent specs, while Windows tweaks are scattered across forums and risky to apply by hand.",
      },
      approach: {
        id: "Mengumpulkan tweak yang teruji ke dalam satu aplikasi. Awalnya berupa script batch open-source, lalu saya bangun ulang dengan C#/.NET menjadi aplikasi desktop dengan dashboard real-time, modul per komponen, dan restore point sebelum mengubah sistem.",
        en: "Bring proven tweaks together in one app. It began as an open-source batch script, which I rebuilt in C#/.NET as a desktop app with a real-time dashboard, per-component modules, and a restore point before changing anything.",
      },
      result: {
        id: "TGO tersedia untuk Windows 10 & 11 dalam versi Free dan Premium di tgopremium.my.id, sementara versi script lamanya tetap terbuka di GitHub.",
        en: "TGO is available for Windows 10 & 11 in Free and Premium editions at tgopremium.my.id, while the original script version stays open on GitHub.",
      },
    },
    highlights: {
      id: [
        "Dashboard real-time: spesifikasi CPU, GPU, RAM, dan storage, plus pemantauan CPU, RAM, disk, GPU, jaringan, dan uptime",
        "Modul optimasi per komponen: CPU & Power, GPU, RAM & Disk, Network, Mouse & Keyboard, dan Boot",
        "Gaming Mode, Memory Optimizer, Deep Cleaner, pengatur Startup, dan App Manager untuk memasang atau menghapus aplikasi beserta sisa filenya",
        "Pengaturan lanjutan untuk Services, Windows Update, Windows Security, dan Device Manager, dengan Restore & Backup serta Activity Log",
        "Tampilan dua bahasa (EN/ID) untuk Windows 10 & 11, tersedia versi Free dan Premium",
      ],
      en: [
        "Real-time dashboard: CPU, GPU, RAM and storage specs, plus live CPU, RAM, disk, GPU, network and uptime monitoring",
        "Optimization modules per component: CPU & Power, GPU, RAM & Disk, Network, Mouse & Keyboard, and Boot",
        "Gaming Mode, Memory Optimizer, Deep Cleaner, a Startup manager, and an App Manager that installs or removes apps and their leftovers",
        "Advanced settings for Services, Windows Update, Windows Security and Device Manager, with Restore & Backup and an Activity Log",
        "Bilingual interface (EN/ID) for Windows 10 & 11, in Free and Premium editions",
      ],
    },
    tech: ["C#", ".NET", "Windows"],
    stats: [
      { value: "Free", label: { id: "+ versi Premium", en: "+ Premium edition" } },
      { value: "10 · 11", label: { id: "Windows", en: "Windows" } },
      { value: "EN · ID", label: { id: "Bahasa aplikasi", en: "App languages" } },
    ],
    links: [
      { kind: "website", url: "https://tgopremium.my.id" },
      {
        kind: "repo",
        url: "https://github.com/tehgeii/TGO",
        label: { id: "Versi lama (open-source)", en: "Legacy version (open source)" },
        legacy: true,
      },
    ],
    screenshots: [
      {
        src: tgoDashboard,
        size: [1180, 760],
        thumb: tgoDashboardCover,
        thumbSize: [720, 483],
        device: "desktop",
        alt: {
          id: "Dashboard TGO: spesifikasi perangkat dan pemantauan CPU, RAM, disk, GPU, jaringan secara real-time",
          en: "TGO dashboard: device specs and real-time CPU, RAM, disk, GPU and network monitoring",
        },
      },
      {
        src: tgoAppManager,
        size: [1180, 760],
        device: "desktop",
        alt: {
          id: "App Manager TGO: pasang aplikasi populer atau hapus aplikasi desktop & Microsoft Store beserta sisa filenya",
          en: "TGO App Manager: install popular apps, or uninstall desktop & Microsoft Store apps and their leftovers",
        },
      },
    ],
    icon: Rocket,
    file: "Program.cs",
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
    story: {
      problem: {
        id: "Jam presensi online tiap mata kuliah berbeda-beda, sehingga mahasiswa mudah lupa absen tepat waktu.",
        en: "Online attendance opens at a different time for every course, so students easily miss checking in on time.",
      },
      approach: {
        id: "Aplikasi Android dengan Kotlin dan Jetpack Compose yang menjadwalkan notifikasi tepat waktu lewat AlarmManager, membuka halaman SiAdin dengan login otomatis, dan mengirim bukti ke Telegram. Tombol presensi tetap ditekan sendiri oleh mahasiswa.",
        en: "An Android app in Kotlin and Jetpack Compose that schedules on-time notifications with AlarmManager, opens SiAdin with auto-login, and sends proof to Telegram. Students always press the attendance button themselves.",
      },
      result: {
        id: "Pengingat yang tetap jalan saat Doze dan setelah HP restart, dari Android 8 sampai 16, lengkap dengan riwayat dan bukti absen yang tersimpan rapi.",
        en: "Reminders that keep working through Doze and reboots, from Android 8 to 16, with a tidy history of attendance and proof.",
      },
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
        size: [540, 1176],
        thumb: ngibsenJadwalThumb,
        thumbSize: [270, 588],
        device: "phone",
        alt: {
          id: "Halaman Jadwal NgiBsen: daftar mata kuliah per hari dan status absen hari ini",
          en: "NgiBsen schedule screen: courses per day and today's attendance status",
        },
      },
      {
        src: ngibsenRiwayat,
        size: [540, 1176],
        thumb: ngibsenRiwayatThumb,
        thumbSize: [270, 588],
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
    story: {
      problem: {
        id: "Tes kecepatan biasa hanya menampilkan angka bandwidth, padahal untuk gaming yang lebih penting adalah stabilitas ping, jitter, dan packet loss.",
        en: "Typical speed tests only show bandwidth, while for gaming the stability of ping, jitter, and packet loss matters more.",
      },
      approach: {
        id: "Utility Windows portable dengan Go dan WebView2 yang menguji download/upload multi-koneksi, mengukur ping saat jaringan dibebani untuk mendeteksi bufferbloat, dan menilai koneksi dengan bahasa yang mudah dipahami.",
        en: "A portable Windows utility in Go and WebView2 that runs multi-connection download/upload tests, samples ping under load to spot bufferbloat, and rates the connection in plain language.",
      },
      result: {
        id: "Cukup ekstrak dan jalankan tanpa installer, untuk x64 dan ARM64. Hasil bisa diekspor ke TXT, JSON, CSV, atau kartu PNG dengan data sensitif disamarkan.",
        en: "Just extract and run, no installer, on x64 and ARM64. Results export to TXT, JSON, CSV, or a PNG card with sensitive data masked.",
      },
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
        size: [1046, 798],
        thumb: wifiMainCover,
        thumbSize: [720, 483],
        device: "desktop",
        alt: {
          id: "Hasil tes WiFi Speed + Ping Tester: download, upload, ping, jitter, packet loss dan rating koneksi",
          en: "WiFi Speed + Ping Tester results: download, upload, ping, jitter, packet loss and connection rating",
        },
      },
      {
        src: wifiHistory,
        size: [1046, 813],
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
    story: {
      problem: {
        id: "Peluang mendapat S-Rank di sistem gacha Zenless Zone Zero (pity dan 50:50) sulit dihitung secara manual.",
        en: "The odds of an S-Rank in Zenless Zone Zero's gacha (pity and 50:50) are hard to work out by hand.",
      },
      approach: {
        id: "Kami berlima membandingkan 6 algoritma data mining dengan metrik lengkap, memakai Markov Chain sebagai acuan teori. Saya membangun aplikasinya serta mengumpulkan dan menguji data asli.",
        en: "Five of us compared 6 data mining algorithms with full metrics, using a Markov Chain as the theoretical baseline. I built the app and collected and tested the real data.",
      },
      result: {
        id: "Aplikasi Streamlit yang bisa dibuka di HP maupun laptop, dengan tiga cara impor data dan kalkulator peluang eksak.",
        en: "A Streamlit app that works on phones and laptops, with three ways to import data and an exact odds calculator.",
      },
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
        size: [1440, 697],
        thumb: zzzBerandaCover,
        thumbSize: [720, 483],
        device: "desktop",
        alt: {
          id: "Beranda ZZZ Gacha Predictor dengan menu dan aturan banner yang dipakai",
          en: "ZZZ Gacha Predictor home page with navigation and the banner rules used",
        },
      },
      {
        src: zzzKalkulator,
        size: [1440, 697],
        thumb: zzzKalkulatorCover,
        thumbSize: [720, 483],
        device: "desktop",
        alt: {
          id: "Kalkulator peluang S-Rank berbasis Markov Chain",
          en: "Markov Chain based S-Rank odds calculator",
        },
      },
    ],
    gradient: ["#8b5cf6", "#06b6d4"],
  },
  {
    slug: "portofolio",
    title: "dafi. · Portfolio Website",
    year: "2026",
    category: "web",
    summary: {
      id: "Website portofolio yang sedang kamu buka: dua bahasa, mode terang/gelap, dan data GitHub yang diperbarui otomatis.",
      en: "The portfolio you're looking at: bilingual, light and dark themes, and GitHub data that keeps itself up to date.",
    },
    description: {
      id: "Saya bangun dari nol dengan React, TypeScript, dan Tailwind CSS. Semua isi diambil dari file data, jadi menambah project atau sertifikat tidak perlu menyentuh komponen. Setiap perubahan diuji otomatis, lalu di-deploy ke GitHub Pages lewat GitHub Actions.",
      en: "Built from scratch with React, TypeScript, and Tailwind CSS. All content comes from data files, so adding a project or certificate never touches the components. Every change is tested automatically and then deployed to GitHub Pages with GitHub Actions.",
    },
    story: {
      problem: {
        id: "Saya butuh satu tempat yang rapi untuk menunjukkan project, sertifikat, dan aktivitas GitHub, yang mudah diperbarui tanpa harus mengubah tampilan.",
        en: "I needed one tidy place to show my projects, certificates, and GitHub activity that is easy to update without touching the design.",
      },
      approach: {
        id: "Memisahkan data dari tampilan, menulis semua teks dalam dua bahasa, dan menyiapkan CI yang menjalankan lint, tes end-to-end, dan build di setiap perubahan.",
        en: "Keep data separate from the UI, write every text in two languages, and set up CI that runs linting, end-to-end tests, and the build on every change.",
      },
      result: {
        id: "Website cepat dan mudah diakses yang diperbarui cukup dengan mengubah file data; setiap update tayang otomatis setelah lolos tes.",
        en: "A fast, accessible site that updates by editing data files; every change goes live automatically once the tests pass.",
      },
    },
    highlights: {
      id: [
        "Dua bahasa (Indonesia/English) dan mode terang/gelap tanpa kedipan saat halaman dimuat",
        "Pencarian cepat dengan Ctrl+K, plus link langsung ke setiap section dan project",
        "Statistik GitHub yang dipanggang saat deploy dan diperbarui langsung di browser",
        "Ramah aksesibilitas: navigasi keyboard, focus trap, dan mengikuti pengaturan kurangi gerakan",
        "Tes end-to-end Playwright (desktop & mobile) di setiap push sebelum deploy otomatis",
      ],
      en: [
        "Bilingual (Indonesian/English) with light and dark themes that never flash on load",
        "Ctrl+K quick search, plus direct links to every section and project",
        "GitHub stats baked in at deploy time and refreshed live in the browser",
        "Accessible: keyboard navigation, focus traps, and respect for reduced-motion settings",
        "Playwright end-to-end tests (desktop & mobile) on every push before automatic deploys",
      ],
    },
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite", "Motion", "Playwright", "GitHub Actions"],
    stats: [
      { value: "ID · EN", label: { id: "Bahasa", en: "Languages" } },
      { value: "2", label: { id: "Tema", en: "Themes" } },
      { value: "CI/CD", label: { id: "Deploy otomatis", en: "Automatic deploys" } },
    ],
    links: [
      { kind: "live", url: "https://tehgeii.github.io/portofolio/" },
      { kind: "repo", url: "https://github.com/tehgeii/portofolio" },
    ],
    icon: LayoutTemplate,
    file: "App.tsx",
    screenshots: [
      {
        src: portfolioDark,
        size: [1280, 800],
        thumb: portfolioDarkCover,
        thumbSize: [720, 483],
        device: "desktop",
        alt: {
          id: "Halaman utama portofolio dalam mode gelap",
          en: "The portfolio's home page in dark mode",
        },
      },
      {
        src: portfolioLight,
        size: [1280, 800],
        device: "desktop",
        alt: {
          id: "Bagian project dalam mode terang, dengan filter kategori",
          en: "The projects section in light mode, with category filters",
        },
      },
    ],
    gradient: ["#6366f1", "#14b8a6"],
  },
];

/** Projects shown on the website, in this order. */
export const projects = allProjects.filter((p) => !p.archived);
