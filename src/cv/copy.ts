import type { Lang } from "../types";

/** Labels used only on the CV. */
export const cvCopy: Record<
  Lang,
  {
    summary: string;
    education: string;
    experience: string;
    organizations: string;
    projects: string;
    skills: string;
    certificates: string;
    languages: string;
    courses: string;
    gpa: string;
    present: string;
    skillGroups: Record<"languages" | "frameworks" | "data" | "tools", string>;
    qr: string;
    todo: {
      label: string;
      graduation: string;
      gpa: string;
      english: string;
      certificates: string;
      organizations: string;
    };
    toolbar: { photo: string; print: string; hint: string; todos: (n: number) => string };
  }
> = {
  id: {
    summary: "Ringkasan",
    education: "Pendidikan",
    experience: "Pengalaman",
    organizations: "Organisasi & Kegiatan",
    projects: "Project Pilihan",
    skills: "Keahlian",
    certificates: "Sertifikat",
    languages: "Bahasa",
    courses: "Mata kuliah relevan",
    gpa: "IPK",
    present: "Sekarang",
    skillGroups: { languages: "Bahasa", frameworks: "Framework", data: "Data & ML", tools: "Tools" },
    qr: "Scan untuk melihat portofolio & semua project",
    todo: {
      label: "Isi",
      graduation: "perkiraan tahun lulus",
      gpa: "IPK (opsional)",
      english: "level, mis. Menengah / TOEFL 5xx",
      certificates: "3–5 sertifikat terbaik di src/data/certificates.ts",
      organizations: "organisasi / kepanitiaan / asisten lab (opsional)",
    },
    toolbar: {
      photo: "Foto",
      print: "Simpan PDF",
      hint: "Kotak kuning = data yang belum diisi",
      todos: (n) => `${n} bagian belum diisi`,
    },
  },
  en: {
    summary: "Summary",
    education: "Education",
    experience: "Experience",
    organizations: "Organizations & Activities",
    projects: "Selected Projects",
    skills: "Skills",
    certificates: "Certifications",
    languages: "Languages",
    courses: "Relevant courses",
    gpa: "GPA",
    present: "Present",
    skillGroups: { languages: "Languages", frameworks: "Frameworks", data: "Data & ML", tools: "Tools" },
    qr: "Scan to see the full portfolio & every project",
    todo: {
      label: "Fill in",
      graduation: "expected graduation year",
      gpa: "GPA (optional)",
      english: "level, e.g. Intermediate / TOEFL 5xx",
      certificates: "3–5 best certificates in src/data/certificates.ts",
      organizations: "organizations / committees / lab assistant (optional)",
    },
    toolbar: {
      photo: "Photo",
      print: "Save PDF",
      hint: "Yellow boxes = details still to fill in",
      todos: (n) => `${n} item${n === 1 ? "" : "s"} left to fill in`,
    },
  },
};
