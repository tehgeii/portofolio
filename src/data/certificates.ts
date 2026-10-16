import type { Localized } from "../types";

/**
 * Awards and certifications, newest first within each kind.
 * Used by the website ("Prestasi & Sertifikat") and the CV.
 *
 * Privacy: only text and public verification links are published, never
 * the certificate files themselves, school names or certificate numbers.
 */
export interface Certificate {
  /** Short stable id, used e.g. to pick which certificates go on the CV. */
  id: string;
  kind: "award" | "certification";
  name: Localized;
  issuer: string;
  /** "YYYY-MM" */
  date: string;
  /** Public verification page, if the issuer offers one. */
  credentialUrl?: string;
  /** Number of courses in a Coursera programme. */
  courses?: number;
  /** One or two sentences on what it was for. */
  note?: Localized;
  skills?: string[];
}

export const certificates: Certificate[] = [
  // ---------------------------------------------------------------- awards
  {
    id: "isif-2023",
    kind: "award",
    name: {
      id: "Medali Perak · International Science and Invention Fair 2023",
      en: "Silver Medal · International Science and Invention Fair 2023",
    },
    issuer: "Indonesian Young Scientist Association (IYSA)",
    date: "2023-11",
    note: {
      id: "Kategori Education untuk project “Voyage of Digestion” pada kompetisi sains & inovasi internasional (daring), Bali.",
      en: "Education category for the project “Voyage of Digestion” at an international science & invention fair (online), Bali.",
    },
  },
  {
    id: "samsung-sft-2023",
    kind: "award",
    name: {
      id: "Semifinalis · Samsung Solve for Tomorrow 2023",
      en: "Semifinalist · Samsung Solve for Tomorrow 2023",
    },
    issuer: "Samsung",
    date: "2023-09",
    note: {
      id: "Terpilih dari 309 tim pada kompetisi STEM nasional, termasuk program pelatihan selama setengah tahun.",
      en: "Selected from 309 teams in a national STEM competition that included a six-month training programme.",
    },
  },

  // -------------------------------------------------------- certifications
  {
    id: "unity-ai-game-dev",
    kind: "certification",
    name: {
      id: "AI Game Development Essentials with Unity 6 Specialization",
      en: "AI Game Development Essentials with Unity 6 Specialization",
    },
    issuer: "Packt · Coursera",
    date: "2026-10",
    courses: 3,
    credentialUrl: "https://coursera.org/verify/specialization/P5KB6H6Y4QR1",
    skills: ["Unity 6", "Game AI", "Pathfinding", "NPC Behavior"],
  },
  {
    id: "ibm-systems-analyst",
    kind: "certification",
    name: { id: "IBM Systems Analyst Professional Certificate", en: "IBM Systems Analyst Professional Certificate" },
    issuer: "IBM · Coursera",
    date: "2026-10",
    courses: 9,
    credentialUrl: "https://coursera.org/verify/professional-cert/1I9CPSBRCJKJ",
    skills: ["Systems Analysis", "Requirements", "Process Modeling", "Software Testing"],
  },
  {
    id: "hpc",
    kind: "certification",
    name: {
      id: "High-Performance and Parallel Computing Specialization",
      en: "High-Performance and Parallel Computing Specialization",
    },
    issuer: "University of Colorado Boulder · Coursera",
    date: "2026-09",
    courses: 3,
    credentialUrl: "https://coursera.org/verify/specialization/205I0SDWUT4P",
    skills: ["C++", "Parallel Computing", "MPI"],
  },
  {
    id: "data-mining-uiuc",
    kind: "certification",
    name: { id: "Data Mining Specialization", en: "Data Mining Specialization" },
    issuer: "University of Illinois Urbana-Champaign · Coursera",
    date: "2026-09",
    courses: 6,
    credentialUrl: "https://coursera.org/verify/specialization/QLATSUWBUFLA",
    skills: ["Pattern Discovery", "Clustering", "Text Mining", "Data Visualization"],
  },
  {
    id: "applied-cryptography",
    kind: "certification",
    name: { id: "Applied Cryptography Specialization", en: "Applied Cryptography Specialization" },
    issuer: "University of Colorado · Coursera",
    date: "2026-09",
    courses: 4,
    credentialUrl: "https://coursera.org/verify/specialization/JJERLQHTRVXS",
    skills: ["Symmetric Crypto", "Public-Key Crypto", "Hash Functions", "Key Management"],
  },
  {
    id: "google-project-management",
    kind: "certification",
    name: {
      id: "Google Project Management Professional Certificate",
      en: "Google Project Management Professional Certificate",
    },
    issuer: "Google · Coursera",
    date: "2026-09",
    courses: 7,
    credentialUrl: "https://coursera.org/verify/professional-cert/JS0WHUAA3HC2",
    skills: ["Project Planning", "Agile", "Scrum", "Stakeholders"],
  },
  {
    id: "ibm-machine-learning",
    kind: "certification",
    name: { id: "IBM Machine Learning Professional Certificate", en: "IBM Machine Learning Professional Certificate" },
    issuer: "IBM · Coursera",
    date: "2026-09",
    courses: 6,
    credentialUrl: "https://coursera.org/verify/professional-cert/8323XWJLIG4F",
    skills: ["Supervised Learning", "Unsupervised Learning", "Deep Learning", "Reinforcement Learning"],
  },
  {
    id: "ibm-ai-foundations",
    kind: "certification",
    name: { id: "AI Foundations for Everyone Specialization", en: "AI Foundations for Everyone Specialization" },
    issuer: "IBM · Coursera",
    date: "2026-09",
    courses: 4,
    credentialUrl: "https://coursera.org/verify/specialization/TCW0Q7NLFV3C",
    skills: ["Generative AI", "Prompt Engineering", "Chatbots", "IBM Watson"],
  },
];

export const awards = certificates.filter((c) => c.kind === "award");
export const certifications = certificates.filter((c) => c.kind === "certification");
