import { allSkillNames } from "../../data/skills";

/** Endless strip of technologies between the hero and the about section. */
export function TechMarquee() {
  const items = [...allSkillNames, ...allSkillNames];
  return (
    <div aria-hidden className="relative border-y border-line bg-surface/40 py-5">
      <div className="group flex overflow-hidden mask-fade-x">
        <ul
          className="flex shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
          style={{ "--marquee-duration": "60s" } as React.CSSProperties}
        >
          {items.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-muted"
            >
              {name}
              <span className="text-accent">✦</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
