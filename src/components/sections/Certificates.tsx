import { ArrowUpRight, Award, BadgeCheck, ChevronDown, Medal, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { awards, certifications, type Certificate } from "../../data/certificates";
import { useLanguage } from "../../i18n/language";
import { monthYear } from "../../lib/format";
import type { Lang } from "../../types";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SpotlightCard } from "../ui/SpotlightCard";
import { button } from "../ui/styles";

/** "2026-10" → "Oktober 2026" / "October 2026". */
function formatDate(date: string, lang: Lang) {
  return monthYear(`${date}-01T00:00:00`, lang);
}

/** Medals get a metallic badge, other awards the accent gradient. */
function awardStyle(cert: Certificate): { icon: LucideIcon; badge: string } {
  if (/silver|perak/i.test(cert.name.en)) {
    return { icon: Medal, badge: "bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-800" };
  }
  return { icon: Award, badge: "bg-gradient-accent text-white dark:text-zinc-950" };
}

/** How many certifications are shown before "Show all". */
const INITIAL_COUNT = 6;

export function Certificates() {
  const { t, l, lang } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const visible = showAll ? certifications : certifications.slice(0, INITIAL_COUNT);
  const hiddenCount = certifications.length - INITIAL_COUNT;

  return (
    <Section
      id="certificates"
      eyebrow={t.certificates.eyebrow}
      title={t.certificates.title}
      subtitle={t.certificates.subtitle}
    >
      {awards.length > 0 && (
        <>
          <Reveal>
            <h3 className="mb-5 font-mono text-sm text-subtle">// {t.certificates.awards}</h3>
          </Reveal>
          <ul className="grid gap-5 md:grid-cols-2">
            {awards.map((cert, i) => {
              const { icon: Icon, badge } = awardStyle(cert);
              return (
                <Reveal as="li" key={cert.name.en} delay={i * 0.08} className="h-full">
                  <SpotlightCard className="flex h-full gap-5 p-6 sm:p-7">
                    <span
                      className={`grid size-14 shrink-0 place-items-center rounded-2xl shadow-card ${badge}`}
                      aria-hidden
                    >
                      <Icon className="size-7" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-subtle">{formatDate(cert.date, lang)}</p>
                      <h4 className="mt-1 text-lg leading-snug font-semibold text-balance">{l(cert.name)}</h4>
                      <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
                      {cert.note && (
                        <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">{l(cert.note)}</p>
                      )}
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </ul>
        </>
      )}

      {certifications.length > 0 && (
        <>
          <Reveal className={awards.length > 0 ? "mt-14" : ""}>
            <h3 className="mb-5 font-mono text-sm text-subtle">// {t.certificates.certifications}</h3>
          </Reveal>
          <ul id="certifications-list" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((cert, i) => (
              <Reveal as="li" key={cert.name.en} delay={(i % 3) * 0.08} className="h-full">
                <SpotlightCard className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                      <BadgeCheck className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-xs text-subtle">{formatDate(cert.date, lang)}</span>
                  </div>
                  <h4 className="mt-4 leading-snug font-semibold text-balance">{l(cert.name)}</h4>
                  <p className="mt-1 text-sm text-muted">
                    {cert.issuer}
                    {cert.courses ? (
                      <span className="whitespace-nowrap text-subtle"> · {t.certificates.courses(cert.courses)}</span>
                    ) : null}
                  </p>
                  {cert.skills && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {cert.skills.map((skill) => (
                        <li key={skill} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-accent"
                    >
                      {t.certificates.verify}
                      <ArrowUpRight
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                      <span className="sr-only">
                        {l(cert.name)} {t.a11y.opensNewTab}
                      </span>
                    </a>
                  )}
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
          {hiddenCount > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                ref={toggleRef}
                type="button"
                onClick={() => {
                  setShowAll((v) => !v);
                  // When collapsing, the list shrinks above the button: keep the button in view.
                  if (showAll) requestAnimationFrame(() => toggleRef.current?.scrollIntoView({ block: "center" }));
                }}
                aria-expanded={showAll}
                aria-controls="certifications-list"
                className={`${button("secondary", "md")} group`}
              >
                {showAll ? t.certificates.showLess : t.certificates.showAll(certifications.length)}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
