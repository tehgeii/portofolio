import type { Project, ProjectScreenshot } from "../../data/projects";

/**
 * Artwork for a project: its gradient, a dotted texture and an editor-style
 * file tab, plus either real screenshots in a phone / browser frame or, when
 * there are none yet, the project icon.
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
      <div className="absolute inset-0 -z-10 [background-image:radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
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

      {project.screenshots?.length ? (
        <Mockup shots={project.screenshots} large={large} />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div
            className={`grid place-items-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${
              large ? "size-20" : "size-16"
            }`}
          >
            <Icon className={large ? "size-10" : "size-8"} strokeWidth={1.75} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Screenshots peeking out of the bottom of the cover, inside device frames. */
function Mockup({ shots, large }: { shots: ProjectScreenshot[]; large: boolean }) {
  if (shots[0].device === "desktop") {
    const shot = shots[0];
    return (
      <div
        className={`absolute left-1/2 w-[80%] -translate-x-1/2 overflow-hidden rounded-t-lg border border-b-0 border-white/25 bg-zinc-900 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 ${
          large ? "top-16 sm:top-20" : "top-14"
        }`}
      >
        <div className="flex h-5 items-center gap-1 bg-zinc-800 px-2">
          <span className="size-1.5 rounded-full bg-rose-400/80" />
          <span className="size-1.5 rounded-full bg-amber-400/80" />
          <span className="size-1.5 rounded-full bg-emerald-400/80" />
        </div>
        <img src={shot.thumb ?? shot.src} alt="" loading="lazy" decoding="async" className="block w-full" />
      </div>
    );
  }

  const phones = shots.filter((s) => s.device === "phone").slice(0, 2);
  // Two phones fan out from the centre; a single phone sits upright.
  const tilt = phones.length > 1 ? ["-rotate-6", "rotate-6"] : [""];
  return (
    <>
      {phones.map((shot, i) => (
        <div
          key={shot.src}
          className={`absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-[18px] border-[3px] border-zinc-900 bg-zinc-900 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 ${
            tilt[i] ?? ""
          } ${large ? "top-14 w-[108px] sm:top-16 sm:w-[124px]" : "top-12 w-[92px]"} ${i === 0 ? "z-10" : ""}`}
          style={phones.length > 1 ? { marginLeft: i === 0 ? "-38px" : "38px" } : undefined}
        >
          <img src={shot.src} alt="" loading="lazy" decoding="async" className="block w-full" />
        </div>
      ))}
    </>
  );
}
