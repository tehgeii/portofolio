import { ArrowUpRight, Clock, Eye, Flame, Play, Sparkles } from "lucide-react";
import { youtube, type ShownVideo } from "../../data/youtube";
import { useLanguage } from "../../i18n/language";
import { compactNumber, shortDate, timeAgo, videoLength } from "../../lib/format";
import type { Lang } from "../../types";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { socialIcons } from "../ui/socialIcons";
import { button } from "../ui/styles";

/** The YouTube channel: stats and three highlighted videos, refreshed in CI. */
export function YouTube() {
  const { t, lang } = useLanguage();
  if (!youtube) return null;
  const { channel, videos, fetchedAt } = youtube;
  const YouTubeIcon = socialIcons.youtube;

  const stats = [
    ...(channel.subscribers !== null ? [{ label: t.youtube.subscribers, value: channel.subscribers }] : []),
    { label: t.youtube.videos, value: channel.videoCount },
    { label: t.youtube.views, value: channel.viewCount },
  ];

  return (
    <Section
      id="youtube"
      eyebrow={t.youtube.eyebrow}
      title={t.youtube.title}
      subtitle={t.youtube.subtitle}
      aside={
        <a
          href={channel.url}
          target="_blank"
          rel="noreferrer noopener"
          className={`${button("secondary", "md")} group shrink-0 self-start lg:self-auto`}
        >
          <YouTubeIcon className="size-4" />
          {t.youtube.visit}
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
          <span className="sr-only">{t.a11y.opensNewTab}</span>
        </a>
      }
    >
      <Reveal>
        <dl className="mb-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 bg-surface px-4 py-5 sm:px-6">
              <dt className="text-xs text-muted sm:text-sm">{s.label}</dt>
              <dd className="text-2xl font-bold tracking-tight sm:text-3xl">{compactNumber(s.value, lang)}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {videos.length > 0 && (
        <ul className="grid gap-5 md:grid-cols-3">
          {videos.map((video, i) => (
            <Reveal as="li" key={video.id} delay={i * 0.08} className="h-full">
              <VideoCard video={video} lang={lang} />
            </Reveal>
          ))}
        </ul>
      )}

      <p className="mt-6 text-center text-xs text-subtle">{t.youtube.updated(shortDate(fetchedAt, lang))}</p>
    </Section>
  );
}

function VideoCard({ video, lang }: { video: ShownVideo; lang: Lang }) {
  const { t } = useLanguage();
  const Badge = video.kind === "popular" ? Flame : Sparkles;

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_48px_-24px_var(--glow)] focus-visible:-translate-y-1"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-rose-500 to-violet-600">
        {video.thumb ? (
          <img
            src={video.thumb.lg}
            srcSet={`${video.thumb.sm} 320w, ${video.thumb.lg} 1280w`}
            sizes="(min-width: 768px) 33vw, 100vw"
            width={1280}
            height={720}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-white/80" aria-hidden>
            <Play className="size-10" />
          </div>
        )}
        <span
          className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <span className="grid size-14 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
            <Play className="ml-0.5 size-6 fill-current" />
          </span>
        </span>
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Badge className="size-3" aria-hidden />
          {video.kind === "popular" ? t.youtube.popular : t.youtube.latest}
        </span>
        {video.seconds > 0 && (
          <span className="absolute right-3 bottom-3 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white">
            {videoLength(video.seconds)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 leading-snug font-semibold text-balance">{video.title}</h3>
        <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" aria-hidden />
            {t.youtube.viewCount(compactNumber(video.views, lang))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {timeAgo(video.publishedAt, lang)}
          </span>
        </p>
      </div>
      <span className="sr-only">{t.a11y.opensNewTab}</span>
    </a>
  );
}
