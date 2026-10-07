import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Extra content placed at the right of the heading on large screens. */
  aside?: ReactNode;
}

export function Section({ id, eyebrow, title, subtitle, children, className = "", aside }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`relative py-24 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-3 font-mono text-xs font-medium tracking-[0.2em] text-accent uppercase">
              <span className="h-px w-8 bg-gradient-accent" aria-hidden />
              {eyebrow}
            </p>
            <h2 id={headingId} className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              {title}
            </h2>
            {subtitle && <p className="mt-4 text-base leading-relaxed text-pretty text-muted sm:text-lg">{subtitle}</p>}
          </div>
          {aside}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
