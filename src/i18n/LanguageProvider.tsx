import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "../types";
import { LanguageContext, type LanguageContextValue } from "./language";
import { translations } from "./translations";

const STORAGE_KEY = "lang";

function getInitialLang(): Lang {
  // index.html already resolved the language before first paint.
  const fromDom = document.documentElement.lang;
  return fromDom === "en" ? "en" : "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang].meta.title;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage may be blocked (private mode); the toggle still works */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(() => setLangState((prev) => (prev === "id" ? "en" : "id")), []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: translations[lang],
      l: (localized) => localized[lang],
    }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
