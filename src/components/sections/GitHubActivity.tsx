import { motion } from "motion/react";
import { ArrowUpRight, BookMarked, CalendarDays, Star, Users, type LucideIcon } from "lucide-react";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import { useGitHubStats, type GitHubStatus, type RepoSummary } from "../../hooks/useGitHubStats";
import { useLanguage } from "../../i18n/language";
import { languageColor, monthYear, shortDate, timeAgo } from "../../lib/format";
import { GitHubIcon } from "../ui/BrandIcons";
import { CountUp } from "../ui/CountUp";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SpotlightCard } from "../ui/SpotlightCard";
import { button } from "../ui/styles";

const normalize = (url: string) => url.replace(/\/$/, "").toLowerCase();

/**
 * Many repos have an empty description (or just a URL). When a repo belongs
 * to one of the showcased projects, use that project's summary instead.
 */
function useRepoDescription() {
  const { t, l } = useLanguage();
  return (repo: RepoSummary) => {
    const project = projects.find((p) => p.links.some((link) => normalize(link.url) === normalize(repo.url)));
    const raw = repo.description?.trim();
    if (raw && !/^https?:\/\//.test(raw)) return raw;
    if (project) return l(project.summary);
    return raw || t.github.noDescription;
  };
}

export function GitHubActivity() {
  const { t, lang } = useLanguage();
  const describe = useRepoDescription();
  const { stats, status } = useGitHubStats(profile.username);

  const tiles: { icon: LucideIcon; label: string; value: number | string }[] = [
    { icon: BookMarked, label: t.github.repos, value: stats.publicRepos },
    { icon: Star, label: t.github.stars, value: stats.totalStars },
    { icon: Users, label: t.github.followers, value: stats.followers },
    { icon: CalendarDays, label: t.github.since, value: monthYear(stats.createdAt, lang) },
  ];

  const totalLang = stats.languages.reduce((sum, [, n]) => sum + n, 0) || 1;
  // Top 5 languages plus an "other" bucket so the bar always adds up to 100%.
  const top = stats.languages.slice(0, 5);
  const otherCount = stats.languages.slice(5).reduce((sum, [, n]) => sum + n, 0);
  const topLanguages: [string, number][] = otherCount > 0 ? [...top, [t.github.other, otherCount]] : top;

  return (
    <Section
      id="github"
      eyebrow={t.github.eyebrow}
      title={t.github.title}
      subtitle={t.github.subtitle}
      aside={<StatusPill status={status} fetchedAt={stats.fetchedAt} />}
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-5">
          <ul className="grid grid-cols-2 gap-5">
            {tiles.map(({ icon: Icon, label, value }, i) => (
              <Reveal as="li" key={label} delay={i * 0.06}>
                <SpotlightCard className="h-full p-5 sm:p-6">
                  <Icon className="size-5 text-accent" aria-hidden />
                  <p className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                    {typeof value === "number" ? (
                      <CountUp value={value} />
                    ) : (
                      <span className="text-xl sm:text-2xl">{value}</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted">{label}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <SpotlightCard className="p-5 sm:p-6">
              <h3 className="text-sm font-semibold">{t.github.languages}</h3>
              <div
                className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-surface-2"
                role="img"
                aria-label={topLanguages.map(([name, n]) => `${name} ${Math.round((n / totalLang) * 100)}%`).join(", ")}
              >
                {topLanguages.map(([name, n], i) => (
                  <motion.span
                    key={name}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    style={{ backgroundColor: languageColor(name) }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(n / totalLang) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-hidden>
                {topLanguages.map(([name, n]) => (
                  <li key={name} className="flex items-center gap-2 text-sm">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: languageColor(name) }} />
                    <span className="font-medium">{name}</span>
                    <span className="text-subtle">{Math.round((n / totalLang) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <SpotlightCard className="flex h-full flex-col p-5 sm:p-6">
            <h3 className="text-sm font-semibold">{t.github.recent}</h3>
            <ul className="mt-4 flex flex-1 flex-col gap-3">
              {stats.recent.map((repo) => (
                <li key={repo.name}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/repo block rounded-xl border border-line bg-surface-2/40 p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="truncate font-mono text-sm font-semibold">{repo.name}</span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-subtle transition-transform group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5 group-hover/repo:text-fg"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-1.5 line-clamp-1 text-sm text-muted">{describe(repo)}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-subtle">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: languageColor(repo.language) }}
                            aria-hidden
                          />
                          {repo.language}
                        </span>
                      )}
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="size-3" aria-hidden />
                          {repo.stars}
                        </span>
                      )}
                      <span>
                        {t.github.updated} {timeAgo(repo.pushedAt, lang)}
                      </span>
                    </div>
                    <span className="sr-only">{t.a11y.opensNewTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noreferrer noopener"
              className={`${button("primary", "md")} mt-5 w-full`}
            >
              <GitHubIcon className="size-4" />
              {t.github.viewProfile}
              <span className="sr-only">{t.a11y.opensNewTab}</span>
            </a>
          </SpotlightCard>
        </Reveal>
      </div>

      {status === "fallback" && <p className="mt-5 text-center text-xs text-subtle">{t.github.offline}</p>}
    </Section>
  );
}

function StatusPill({ status, fetchedAt }: { status: GitHubStatus; fetchedAt: string }) {
  const { t, lang } = useLanguage();
  const styles: Record<GitHubStatus, { dot: string; label: string }> = {
    loading: { dot: "bg-amber-400 animate-pulse", label: t.github.loading },
    live: { dot: "bg-emerald-500", label: "Live · api.github.com" },
    fallback: { dot: "bg-zinc-400", label: `Snapshot · ${shortDate(fetchedAt, lang)}` },
  };
  const s = styles[status];
  return (
    <span
      role="status"
      className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-muted"
    >
      <span className="relative flex size-2">
        {status === "live" && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}
