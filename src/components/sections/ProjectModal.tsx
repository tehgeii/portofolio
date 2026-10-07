import { motion } from "motion/react";
import { CheckCircle2, ChevronLeft, ChevronRight, Users, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { projectCategories, projects, type Project } from "../../data/projects";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useLanguage } from "../../i18n/language";
import { ProjectCover } from "../ui/ProjectCover";
import { linkIcon } from "../ui/linkIcon";
import { button } from "../ui/styles";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

export function ProjectModal({ project, onClose, onNavigate }: ProjectModalProps) {
  const { t, l } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `project-${project.slug}-title`;

  useScrollLock(true);
  useFocusTrap(panelRef, true, closeRef);

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const category = projectCategories.find((c) => c.key === project.category);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNavigate(prev.slug);
      else if (e.key === "ArrowRight") onNavigate(next.slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, prev.slug, next.slug]);

  // Start each project at the top when navigating between them.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [project.slug]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl border border-line-strong bg-surface shadow-2xl outline-none sm:rounded-3xl"
      >
        <div className="group relative">
          <ProjectCover project={project} size="lg" hideYear />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.a11y.close}
            className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-subtle">
            {category && <span className="rounded-full border border-line px-2.5 py-0.5">{l(category.label)}</span>}
            <span className="rounded-full border border-line px-2.5 py-0.5">{project.year}</span>
            <span className="ml-auto">
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          <h2 id={titleId} className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            {project.title}
          </h2>
          <p className="mt-4 leading-relaxed text-pretty text-muted">{l(project.description)}</p>

          {project.role && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm">
              <Users className="mt-0.5 size-4 shrink-0 text-sky-500" aria-hidden />
              <p>
                <span className="font-semibold">{t.projects.myRole}:</span>{" "}
                <span className="text-muted">{l(project.role)}</span>
              </p>
            </div>
          )}

          {project.stats && (
            <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {project.stats.map((s) => (
                <div key={s.value + l(s.label)} className="flex flex-col-reverse bg-surface-2/70 p-4 text-center">
                  <dt className="mt-1 text-xs text-muted">{l(s.label)}</dt>
                  <dd className="text-xl font-bold tracking-tight sm:text-2xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <h3 className="mt-8 font-mono text-xs font-semibold tracking-[0.15em] text-subtle uppercase">
            {t.projects.highlights}
          </h3>
          <ul className="mt-4 space-y-3">
            {l(project.highlights).map((h) => (
              <li key={h} className="flex gap-3 text-sm leading-relaxed sm:text-[15px]">
                <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-accent" aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-mono text-xs font-semibold tracking-[0.15em] text-subtle uppercase">
            {t.projects.techUsed}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li key={tech} className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 font-mono text-xs">
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link, i) => {
              const Icon = linkIcon(link.kind);
              const label = link.label ? l(link.label) : t.projects.links[link.kind];
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={button(i === 0 ? "gradient" : "secondary", "md")}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                  <span className="sr-only">{t.a11y.opensNewTab}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Prev / next */}
        <nav aria-label={t.projects.navLabel} className="grid grid-cols-2 border-t border-line">
          <button
            type="button"
            onClick={() => onNavigate(prev.slug)}
            className="group flex items-center gap-3 p-5 text-left transition-colors hover:bg-surface-2"
          >
            <ChevronLeft
              className="size-5 shrink-0 text-subtle transition-transform group-hover:-translate-x-1"
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block font-mono text-[10px] tracking-wider text-subtle uppercase">
                {t.projects.prev}
              </span>
              <span className="block truncate text-sm font-semibold">{prev.title}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(next.slug)}
            className="group flex items-center justify-end gap-3 border-l border-line p-5 text-right transition-colors hover:bg-surface-2"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[10px] tracking-wider text-subtle uppercase">
                {t.projects.next}
              </span>
              <span className="block truncate text-sm font-semibold">{next.title}</span>
            </span>
            <ChevronRight
              className="size-5 shrink-0 text-subtle transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </button>
        </nav>
      </motion.div>
    </div>
  );
}
