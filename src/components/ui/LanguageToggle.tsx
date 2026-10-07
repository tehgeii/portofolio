import { motion } from "motion/react";
import { useLanguage } from "../../i18n/language";
import type { Lang } from "../../types";

const OPTIONS: Lang[] = ["id", "en"];

/** Segmented ID / EN switch with a sliding indicator. */
export function LanguageToggle({ layoutId = "lang-pill" }: { layoutId?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.a11y.switchLang}
      className="flex h-9 items-center rounded-full border border-line p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = option === lang;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            lang={option}
            className={`relative h-full rounded-full px-2.5 font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors ${
              active ? "text-bg" : "text-muted hover:text-fg"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-fg"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
