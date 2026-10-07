import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { MapPin } from "lucide-react";
import { useRef } from "react";
import { journey } from "../../data/journey";
import { useLanguage } from "../../i18n/language";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SpotlightCard } from "../ui/SpotlightCard";

export function Journey() {
  const { t, l } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // The accent line "draws" itself as the timeline scrolls through view.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <Section id="journey" eyebrow={t.journey.eyebrow} title={t.journey.title} subtitle={t.journey.subtitle}>
      <div ref={listRef} className="relative">
        {/* Track + animated progress */}
        <div aria-hidden className="absolute top-2 bottom-2 left-5 w-px -translate-x-1/2 bg-line lg:left-[224px]">
          <motion.div
            className="absolute inset-0 origin-top bg-gradient-accent"
            style={{ scaleY: reduce ? 1 : progress }}
          />
        </div>

        <ol className="relative space-y-6 sm:space-y-8">
          {journey.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal
                as="li"
                key={l(item.title)}
                delay={0.05}
                className="relative grid grid-cols-[40px_1fr] gap-x-4 lg:grid-cols-[180px_40px_1fr] lg:gap-x-6"
              >
                <p className="hidden pt-2.5 text-right font-mono text-sm text-muted lg:block">{l(item.period)}</p>

                <div className="relative z-10 flex justify-center pt-1">
                  <span
                    className={`grid size-10 place-items-center rounded-full border-4 border-bg ${
                      item.current
                        ? "bg-gradient-accent text-white shadow-[0_0_0_6px_var(--glow)] dark:text-zinc-950"
                        : "bg-surface-2 text-muted ring-1 ring-line-strong"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                </div>

                <SpotlightCard className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-mono text-xs text-muted lg:hidden">{l(item.period)}</p>
                    {item.current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 animate-pulse rounded-full bg-current" aria-hidden />
                        {t.journey.now}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold sm:text-xl lg:mt-0">{l(item.title)}</h3>
                  {item.place && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-subtle">
                      <MapPin className="size-3.5" aria-hidden />
                      {item.place}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-muted sm:text-[15px]">
                    {l(item.description)}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <li key={tag} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
