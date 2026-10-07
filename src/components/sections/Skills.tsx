import { AnimatePresence, motion } from "motion/react";
import { BrainCircuit, Code2, Layers, Wrench, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { skillCategories, type Skill, type SkillCategory, type SkillCategoryKey } from "../../data/skills";
import { useLanguage } from "../../i18n/language";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SpotlightCard } from "../ui/SpotlightCard";

const CATEGORY_ICONS: Record<SkillCategoryKey, LucideIcon> = {
  languages: Code2,
  frameworks: Layers,
  data: BrainCircuit,
  tools: Wrench,
};

export function Skills() {
  const { t } = useLanguage();

  return (
    <Section id="skills" eyebrow={t.skills.eyebrow} title={t.skills.title} subtitle={t.skills.subtitle}>
      <ul className="grid gap-5 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <Reveal as="li" key={category.key} delay={(i % 2) * 0.08} className="h-full">
            <SkillCard category={category} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  const { l } = useLanguage();
  const [active, setActive] = useState<Skill | null>(null);
  const Icon = CATEGORY_ICONS[category.key];
  const titleId = `skills-${category.key}`;

  return (
    <SpotlightCard className="flex h-full flex-col p-6 sm:p-7" onMouseLeave={() => setActive(null)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
            <Icon className="size-5" aria-hidden />
          </span>
          <h3 id={titleId} className="text-lg font-semibold">
            {l(category.title)}
          </h3>
        </div>
        <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-subtle">
          {String(category.skills.length).padStart(2, "0")}
        </span>
      </div>

      <ul aria-labelledby={titleId} className="mb-6 flex flex-1 flex-wrap content-start gap-2">
        {category.skills.map((skill) => {
          const isActive = active?.name === skill.name;
          return (
            <li key={skill.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(skill)}
                onFocus={() => setActive(skill)}
                onClick={() => setActive(skill)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "-translate-y-0.5 border-line-strong bg-fg text-bg shadow-card"
                    : "border-line bg-surface-2/60 text-fg hover:border-line-strong"
                }`}
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full ring-2 ring-black/5 dark:ring-white/10"
                  style={{ backgroundColor: skill.color }}
                />
                {skill.name}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Context line: where the hovered skill is used, or the category blurb */}
      <div
        id={`${titleId}-note`}
        aria-live="polite"
        className="flex min-h-12 items-end border-t border-dashed border-line pt-4 text-sm text-muted"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active?.name ?? "description"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2"
          >
            {active ? (
              <>
                <span className="font-mono text-accent">→</span>
                <span>
                  <span className="font-semibold text-fg">{active.name}</span> · {l(active.note)}
                </span>
              </>
            ) : (
              l(category.description)
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </SpotlightCard>
  );
}
