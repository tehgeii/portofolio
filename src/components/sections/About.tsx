import {
  BrainCircuit,
  GraduationCap,
  Laptop,
  MapPin,
  Monitor,
  Rocket,
  Smartphone,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { profile } from "../../data/profile";
import { useLanguage } from "../../i18n/language";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SpotlightCard } from "../ui/SpotlightCard";

const SERVICE_ICONS: LucideIcon[] = [Laptop, Smartphone, Monitor, BrainCircuit];

export function About() {
  const { t, l } = useLanguage();

  const facts: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
    { icon: GraduationCap, label: t.about.facts.campus, value: `${profile.campus} (${profile.campusShort})` },
    { icon: Code2, label: t.about.facts.major, value: l(profile.major) },
    { icon: MapPin, label: t.about.facts.location, value: l(profile.location) },
    { icon: Rocket, label: t.about.facts.creator, value: "TGO · Tech Gameplay Indonesia", href: profile.website },
  ];

  const [lead, ...paragraphs] = l(profile.about);

  return (
    <Section id="about" eyebrow={t.about.eyebrow} title={t.about.title}>
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <Reveal className="space-y-5 text-base leading-relaxed text-pretty text-muted sm:text-lg">
          <p className="text-lg text-fg sm:text-xl">{lead}</p>
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            {facts.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium tracking-wide text-subtle uppercase">{label}</dt>
                  <dd className="mt-0.5 font-semibold">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <h3 className="mb-6 font-mono text-sm font-medium tracking-wide text-subtle">// {t.about.whatIDo}</h3>
      </Reveal>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.about.services.map((service, i) => {
          const Icon = SERVICE_ICONS[i];
          return (
            <Reveal as="li" key={service.title} delay={i * 0.08} className="h-full">
              <SpotlightCard className="h-full p-6 hover:-translate-y-1">
                <span className="mb-5 grid size-11 place-items-center rounded-xl bg-gradient-accent text-white shadow-[0_8px_24px_-8px_var(--glow)] dark:text-zinc-950">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h4 className="text-lg font-semibold">{service.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.body}</p>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
