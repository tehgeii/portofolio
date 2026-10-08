import type { Localized } from "../types";

/**
 * Certificates, newest first. Used by the CV (and later by the website).
 * Only list the strongest, most relevant ones: 3–5 in the CV is plenty.
 */
export interface Certificate {
  name: string;
  issuer: string;
  /** e.g. "2026-03" */
  date: string;
  /** Verification link or credential ID, if the certificate has one. */
  credentialUrl?: string;
  credentialId?: string;
  /** Short note on what it covered (optional). */
  note?: Localized;
}

export const certificates: Certificate[] = [
  // Example:
  // {
  //   name: "Belajar Dasar Pemrograman Web",
  //   issuer: "Dicoding Indonesia",
  //   date: "2026-03",
  //   credentialUrl: "https://www.dicoding.com/certificates/XXXXXXX",
  // },
];
