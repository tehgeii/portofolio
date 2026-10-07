import type { Project } from "../../data/projects";

/**
 * Generated artwork for a project: its gradient, a dotted texture, the
 * project icon and an editor-style file tab. No screenshots needed.
 */
interface ProjectCoverProps {
  project: Project;
  size?: "md" | "lg";
  /** Hide the year badge (the modal shows it elsewhere and needs the corner). */
  hideYear?: boolean;
}

export function ProjectCover({ project, size = "md", hideYear = false }: ProjectCoverProps) {
  const Icon = project.icon;
  const [from, to] = project.gradient;
  const large = size === "lg";

  return (
    <div
      aria-hidden
      className={`relative isolate overflow-hidden ${large ? "h-44 sm:h-56" : "h-44"}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -right-10 -bottom-16 size-56 rounded-full bg-white/15 blur-2xl transition-transform duration-700 group-hover:scale-125" />
      <div className="absolute -top-12 -left-12 size-40 rounded-full bg-black/20 blur-2xl" />

      {/* Editor tab */}
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-black/25 px-2.5 py-1 font-mono text-[11px] text-white/90 backdrop-blur-sm">
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-white/70" />
          <span className="size-1.5 rounded-full bg-white/40" />
          <span className="size-1.5 rounded-full bg-white/25" />
        </span>
        {project.file}
      </div>
      {!hideYear && (
        <span className="absolute top-4 right-4 rounded-lg bg-black/25 px-2.5 py-1 font-mono text-[11px] text-white/90 backdrop-blur-sm">
          {project.year}
        </span>
      )}

      <div className="absolute inset-0 grid place-items-center">
        <div
          className={`grid place-items-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${
            large ? "size-20" : "size-16"
          }`}
        >
          <Icon className={large ? "size-10" : "size-8"} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
