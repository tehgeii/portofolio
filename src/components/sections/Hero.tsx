import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRight, BrainCircuit, Rocket, Smartphone } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import { scrollToSection } from "../../data/sections";
import { skillCategories } from "../../data/skills";
import { useGitHubStats } from "../../hooks/useGitHubStats";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useLanguage } from "../../i18n/language";
import { socialIcons } from "../ui/BrandIcons";
import { CountUp } from "../ui/CountUp";
import { button } from "../ui/styles";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const languageCount = skillCategories.find((c) => c.key === "languages")?.skills.length ?? 0;

export function Hero() {
  const { t, l } = useLanguage();
  const reduce = useReducedMotion() ?? false;
  const role = useTypewriter(l(profile.roles), { disabled: reduce });
  const { stats } = useGitHubStats(profile.username);
  const sectionRef = useRef<HTMLElement>(null);

  // Soft spotlight that follows the pointer across the hero.
  const handlePointer = (e: PointerEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const [first, ...rest] = profile.name.split(" ");
  const nameLines = [`${first} ${rest[0]}`, rest.slice(1).join(" ")];

  const heroStats = [
    { value: stats.publicRepos, suffix: "+", label: t.hero.stats.repos },
    { value: projects.length, suffix: "", label: t.hero.stats.projects },
    { value: languageCount, suffix: "", label: t.hero.stats.languages },
    { value: stats.totalStars, suffix: "★", label: t.hero.stats.stars },
  ];

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={handlePointer}
      aria-label={profile.name}
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16"
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
        <div className="absolute top-[-10%] left-[-10%] size-[520px] rounded-full bg-violet-500/20 blur-[120px] dark:bg-violet-600/20" />
        <div className="absolute right-[-10%] bottom-[0%] size-[480px] rounded-full bg-cyan-400/20 blur-[120px] dark:bg-cyan-500/10" />
        <div
          className="absolute inset-0 hidden opacity-100 [@media(hover:hover)]:block"
          style={{
            background: "radial-gradient(600px circle at var(--mx, 70%) var(--my, 30%), var(--glow), transparent 40%)",
          }}
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1.5 pr-4 pl-2 text-xs font-medium text-muted backdrop-blur sm:text-sm"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            {t.hero.badge}
            <span className="text-subtle">·</span>
            <span className="text-subtle">{l(profile.location)}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-3 text-lg font-medium text-muted sm:text-xl"
          >
            {t.hero.greeting}{" "}
            <motion.span
              className="inline-block origin-[70%_70%]"
              animate={reduce ? undefined : { rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.2, delay: 0.8, repeat: Infinity, repeatDelay: 3 }}
              aria-hidden
            >
              👋
            </motion.span>
          </motion.p>

          <h1 className="text-[2.6rem] leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]">
            {nameLines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 1 ? "text-gradient" : ""}`}
                  initial={reduce ? { opacity: 0 } : { y: "105%" }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  transition={{ duration: 0.8, delay: 0.12 + i * 0.1, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-5 flex h-8 items-center font-mono text-base text-fg sm:text-lg"
          >
            <span className="mr-2 text-accent" aria-hidden>
              &gt;
            </span>
            <span className="sr-only">{l(profile.roles).join(", ")}</span>
            <span aria-hidden>{role}</span>
            <span aria-hidden className="ml-0.5 inline-block h-5 w-[2px] animate-blink bg-accent sm:h-6" />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg"
          >
            {l(profile.tagline)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("projects");
              }}
              className={`${button("gradient", "lg")} group`}
            >
              {t.hero.ctaProjects}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className={button("secondary", "lg")}
            >
              {t.hero.ctaContact}
            </a>
            <div className="flex items-center gap-1 sm:ml-2">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${s.label} ${t.a11y.opensNewTab}`}
                    title={s.label}
                    className={`${button("ghost", "icon")} hover:-translate-y-0.5 hover:text-accent`}
                  >
                    <Icon className="size-[18px]" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-none"
        >
          <Portrait reduce={reduce} />
        </motion.div>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-16 w-full max-w-6xl px-5 sm:px-8 lg:mt-20">
        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4"
        >
          {heroStats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 bg-bg/80 px-5 py-5 backdrop-blur sm:px-6">
              <dt className="text-xs text-muted sm:text-sm">{s.label}</dt>
              <dd className="text-3xl font-bold tracking-tight sm:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

    </section>
  );
}

/** Avatar with a 3D tilt on hover and floating highlight chips. */
function Portrait({ reduce }: { reduce: boolean }) {
  const { lang } = useLanguage();
  const [imgFailed, setImgFailed] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const chips = [
    {
      icon: Rocket,
      title: "TGO",
      sub: lang === "id" ? "Optimizer Windows" : "Windows optimizer",
      className: "-left-4 top-[8%] sm:-left-10",
      delay: "0s",
    },
    {
      icon: Smartphone,
      title: "NgiBsen",
      sub: "Android · Kotlin",
      className: "-right-4 top-[42%] sm:-right-10",
      delay: "-2s",
    },
    {
      icon: BrainCircuit,
      title: "96.7%",
      sub: lang === "id" ? "Akurasi XGBoost" : "XGBoost accuracy",
      className: "-left-2 bottom-[10%] sm:-left-8",
      delay: "-4s",
    },
  ];

  return (
    <div className="relative [perspective:1000px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative aspect-square">
        {/* Rotating gradient ring */}
        <div aria-hidden className="absolute -inset-[2px] overflow-hidden rounded-[2.1rem]">
          <div className="absolute inset-[-50%] animate-spin-slow bg-[conic-gradient(from_0deg,var(--accent),var(--accent-2),transparent_40%,transparent_60%,var(--accent))]" />
        </div>
        <div className="relative size-full overflow-hidden rounded-[2rem] border border-line bg-surface">
          {imgFailed ? (
            <div className="bg-gradient-accent grid size-full place-items-center text-8xl font-extrabold text-white">D</div>
          ) : (
            <img
              src={profile.avatar}
              alt={profile.name}
              width={460}
              height={460}
              fetchPriority="high"
              onError={() => setImgFailed(true)}
              className="size-full object-cover"
            />
          )}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />@{profile.username}
          </div>
        </div>

        {chips.map(({ icon: Icon, title, sub, className, delay }) => (
          <div key={title} className={`absolute ${className}`} style={{ transform: "translateZ(40px)" }} aria-hidden>
            <div
              className="flex animate-float items-center gap-2.5 rounded-2xl border border-line-strong bg-surface/85 py-2 pr-3.5 pl-2 shadow-card backdrop-blur-md"
              style={{ animationDelay: delay }}
            >
              <span className="bg-gradient-accent grid size-8 place-items-center rounded-xl text-white dark:text-zinc-950">
                <Icon className="size-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold">{title}</span>
                <span className="block text-[11px] text-muted">{sub}</span>
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
