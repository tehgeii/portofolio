# Portofolio · Dafi Hauzan Atsillah Hoenarko

Website portofolio pribadi **Dafi Hauzan Atsillah Hoenarko** ([@tehgeii](https://github.com/tehgeii)), mahasiswa Teknik Informatika Universitas Dian Nuswantoro (UDINUS) dan kreator **TGO (Tech Gameplay Optimizer)**.

🌐 **Live:** <https://tehgeii.github.io/portofolio/>

![Preview](public/og-image.png)

## ✨ Fitur

| Fitur                     | Keterangan                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 🌗 **Dark / Light mode**  | Mengikuti pengaturan perangkat, bisa diganti manual dengan animasi _circular reveal_, pilihan tersimpan.      |
| 🇮🇩🇬🇧 **Dua bahasa**       | Bahasa Indonesia & English, terdeteksi otomatis dari browser dan bisa diganti kapan saja.                     |
| ⌘ **Command palette**     | Tekan `Ctrl + K` / `⌘ + K` atau `/` untuk lompat ke section, membuka project, ganti tema/bahasa, salin email. |
| 🧭 **Navigasi pintar**    | Navbar dengan _scroll-spy_, progress bar baca, tombol kembali ke atas, menu mobile layar penuh.               |
| 🗂️ **Project interaktif** | Filter kategori beranimasi, modal detail (Esc untuk tutup, ← → untuk pindah project), link share per project. |
| 🧠 **Skill kontekstual**  | Arahkan/tap sebuah skill untuk melihat di mana skill itu dipakai.                                             |
| 📈 **GitHub live**        | Statistik GitHub diambil saat deploy (update otomatis tiap Senin) lalu diperbarui live di browser.            |
| ✉️ **Kontak**             | Salin email sekali klik dan form tervalidasi yang membuka aplikasi email.                                     |
| ♿ **Aksesibel**          | Skip link, fokus keyboard jelas, focus trap di dialog, label ARIA, dan menghormati _reduced motion_.          |
| ⚡ **Ringan & cepat**     | Font di-host sendiri, tanpa backend, siap di-deploy sebagai situs statis.                                     |
| 🔎 **SEO**                | Open Graph, data terstruktur JSON-LD, sitemap, robots.txt, dan halaman 404 khusus.                            |
| 🧪 **Teruji**             | Test end-to-end Playwright (desktop & mobile) berjalan otomatis di setiap push.                               |

## 🛠️ Teknologi

[React 19](https://react.dev) · [TypeScript](https://www.typescriptlang.org) · [Vite](https://vite.dev) · [Tailwind CSS v4](https://tailwindcss.com) · [Motion](https://motion.dev) · [Lucide](https://lucide.dev) · Plus Jakarta Sans & JetBrains Mono

## 🚀 Menjalankan di komputer

Butuh **Node.js 20+**.

```bash
npm install       # pasang dependency
npm run dev       # buka http://localhost:5173
npm run build     # build produksi ke folder dist/
npm run preview   # coba hasil build
npm run lint      # cek kualitas kode
npm run format    # rapikan format kode
npm run stats     # perbarui snapshot statistik GitHub
npm run test:e2e  # jalankan test end-to-end (setelah npm run build)
```

Sebelum test pertama kali, pasang browser-nya dengan `npx playwright install chromium`.

### 🔗 Link langsung

- Ke section: `https://tehgeii.github.io/portofolio/#contact` (juga `#about`, `#skills`, `#projects`, `#journey`, `#github`)
- Ke satu project: `https://tehgeii.github.io/portofolio/#project/tgo` (slug ada di [`projects.ts`](src/data/projects.ts))

## ✏️ Mengubah konten

Semua isi website ada di folder [`src/data`](src/data), jadi tidak perlu menyentuh komponen:

| File                                          | Isi                                                   |
| --------------------------------------------- | ----------------------------------------------------- |
| [`profile.ts`](src/data/profile.ts)           | Nama, foto, bio, lokasi, email, dan link sosial media |
| [`projects.ts`](src/data/projects.ts)         | Daftar project, deskripsi, fitur, teknologi, dan link |
| [`skills.ts`](src/data/skills.ts)             | Kategori skill beserta keterangan penggunaannya       |
| [`journey.ts`](src/data/journey.ts)           | Timeline perjalanan kuliah & project                  |
| [`translations.ts`](src/i18n/translations.ts) | Semua teks antarmuka dalam Bahasa Indonesia & English |

Setiap teks punya versi `id` dan `en`. TypeScript akan memberi tahu kalau ada terjemahan yang terlewat.

Foto profil ada di [`src/assets/avatar.jpg`](src/assets/avatar.jpg) (rasio 1:1, fokus wajah & dada). Untuk menggantinya, timpa file tersebut dengan foto persegi baru dengan nama yang sama.

## 📄 CV

Template CV ada di [`cv.html`](cv.html) + [`src/cv/`](src/cv). Datanya diambil dari file yang sama dengan website (profil, project, skill), ditambah data khusus CV di [`src/data/cv.ts`](src/data/cv.ts) dan sertifikat di [`src/data/certificates.ts`](src/data/certificates.ts).

- A4, satu halaman, ATS-friendly (teks bisa dibaca sistem rekrutmen), dua bahasa, foto opsional, plus QR code ke portofolio.
- Bagian yang belum diisi ditandai kotak kuning **"Isi: …"**.

```bash
npm run cv        # buka pratinjau CV di browser (bisa ganti ID/EN & foto)
npm run cv:pdf    # buat PDF ke folder cv-output/ (ID dengan foto, EN tanpa foto)
```

`npm run cv:pdf` memberi tahu bagian mana yang masih kosong dan memastikan CV tetap satu halaman. Selama masih ada yang kosong, nama file diberi akhiran `-DRAFT`. CV **belum ikut dipublikasikan** di website; folder `cv-output/` juga tidak ikut ke Git.

## 🌍 Deploy ke GitHub Pages

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) menjalankan format check, lint, typecheck, build, dan test end-to-end di setiap pull request, lalu men-deploy ke GitHub Pages setiap ada push ke `main`. Setiap Senin pagi workflow ini juga berjalan otomatis supaya statistik GitHub tetap segar.

Pengaturan sekali saja (sudah dilakukan):

1. **Settings → Pages → Source: GitHub Actions**
2. **Settings → Environments → github-pages → Deployment branches**: izinkan `main`

## 📁 Struktur

```
src/
├── components/
│   ├── layout/     Navbar, Footer, CommandPalette, ScrollProgress, BackToTop
│   ├── sections/   Hero, About, Skills, Projects, Journey, GitHubActivity, Contact
│   └── ui/         Komponen kecil yang dipakai ulang (Section, Reveal, SpotlightCard, …)
├── context/        Tema & toast
├── cv/             Template CV (halaman A4 siap cetak)
├── data/           Konten website
├── hooks/          Scroll-spy, typewriter, GitHub stats, focus trap, …
├── i18n/           Bahasa & terjemahan
└── lib/            Helper (statistik GitHub, format tanggal, clipboard, platform)
scripts/            Script build (snapshot statistik GitHub, ekspor CV ke PDF)
tests/              Test end-to-end Playwright
```

## 👤 Author & Kontributor

**Dafi Hauzan Atsillah Hoenarko**, pemilik, perancang, dan kontributor utama website ini.

- GitHub: [@tehgeii](https://github.com/tehgeii)
- LinkedIn: [in/dafi-hauzan](https://www.linkedin.com/in/dafi-hauzan)
- Instagram: [@kokohpasarsenen](https://www.instagram.com/kokohpasarsenen)
- YouTube: [Tech Gameplay Indonesia](https://www.youtube.com/@techgameplayindonesia)
- Email: [antsters9@gmail.com](mailto:antsters9@gmail.com)
- Website TGO: [tgopremium.my.id](https://tgopremium.my.id)

Dibantu oleh Claude (Anthropic) dalam penulisan kode.

## 📄 Lisensi

© 2026 Dafi Hauzan Atsillah Hoenarko. Hak cipta dilindungi. Konten (teks, data project, dan identitas pribadi) tidak boleh digunakan ulang tanpa izin.
