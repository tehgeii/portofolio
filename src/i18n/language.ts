import { createContext, useContext } from "react";
import type { Lang } from "../types";
import type { Translation } from "./translations";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** UI copy for the active language. */
  t: Translation;
  /** Pick the active language from a localized value. */
  l: <T>(value: Record<Lang, T>) => T;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
