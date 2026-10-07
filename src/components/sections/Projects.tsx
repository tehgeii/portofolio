import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { profile } from "../../data/profile";
import { projectCategories, projects, type Project, type ProjectCategory } from "../../data/projects";
import { useLanguage } from "../../i18n/language";
import { GitHubIcon } from "../ui/BrandIcons";
import { linkIcon } from "../ui/linkIcon";
import { ProjectCover } from "../ui/ProjectCover";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { button } from "../ui/styles";

type Filter = ProjectCategory | "all";

export function Projects({ onOpen }: { onOpen: (slug: string) => void }) {
  const { t, l } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const map: Record<Filter, number> = { all: projects.length, web: 0, mobile: 0, desktop: 0, data: 0 };
    for (const p of projects) map[p.category]++;
    return map;
  }, []);

  return (
    <Section id="projects" eyebrow={t.projects.eyebrow} title={t.projects.title} subtitle={t.projects.subtitle}>
      {/* Filters */}
      <Reveal className="-mx-5 mb-10 no-scrollbar overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div
          role="group"
          aria-label={t.projects.filterLabel}
          className="flex w-max gap-1.5 rounded-full border border-line bg-surface p-1.5"
        >
          {projectCategories.map((c) => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                aria-pressed={active}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? "text-bg" : "text-muted hover:text-fg"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-fg"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{l(c.label)}</span>
                <span
                  className={`relative rounded-full px-1.5 font-mono text-[10px] ${
                    active ? "bg-bg/20 text-bg" : "bg-surface-2 text-subtle"
                  }`}
                >
                  {counts[c.key]}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <p className="sr-only" aria-live="polite">
        {t.projects.count(visible.length)}
      </p>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <ProjectCard project={project} onOpen={onOpen} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Reveal className="mt-12 flex justify-center">
        <a
          href={`https://github.com/${profile.username}?tab=repositories`}
          target="_blank"
          rel="noreferrer noopener"
          className={`${button("secondary", "md")} group`}
        >
          <GitHubIcon className="size-4" />
          {t.projects.more}
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </a>
      </Reveal>
    </Section>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const { t, l } = useLanguage();
  const shownTech = project.tech.slice(0, 4);
  const hiddenTech = project.tech.length - shownTech.length;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_24px_48px_-24px_var(--glow)]">
      <ProjectCover project={project} />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <Star className="size-3 fill-current" aria-hidden />
              {t.projects.featured}
            </span>
          )}
          {project.role && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
              <Users className="size-3" aria-hidden />
              {t.projects.team}
            </span>
          )}
        </div>

        <h3 className="text-lg leading-snug font-semibold">
          {/* The ::after makes the whole card clickable while links stay focusable. */}
          <button
            type="button"
            onClick={() => onOpen(project.slug)}
            className="text-left after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{l(project.summary)}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={t.projects.techUsed}>
          {shownTech.map((tech) => (
            <li key={tech} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted">
              {tech}
            </li>
          ))}
          {hiddenTech > 0 && (
            <li className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-subtle">+{hiddenTech}</li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent" aria-hidden>
            {t.projects.details}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <div className="relative z-10 flex gap-1">
            {project.links.map((link) => {
              const Icon = linkIcon(link.kind);
              const label = link.label ? l(link.label) : t.projects.links[link.kind];
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={label}
                  aria-label={`${label}: ${project.title} ${t.a11y.opensNewTab}`}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-fg"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
