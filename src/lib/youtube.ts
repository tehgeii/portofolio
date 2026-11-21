/**
 * YouTube channel stats and highlighted videos, fetched while building the
 * site (scripts/fetch-youtube.ts) with the YouTube Data API v3. The browser
 * never talks to YouTube: it only gets the generated JSON and thumbnails.
 * Keep this file free of runtime imports so Node can run it directly.
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  views: number;
  /** ISO 8601 duration, e.g. "PT12M3S". */
  duration: string;
  /** File names of the downloaded thumbnails, or null when none could be saved. */
  thumb: { sm: string; lg: string } | null;
}

export interface YouTubeSnapshot {
  schema: 1;
  fetchedAt: string;
  channel: {
    id: string;
    title: string;
    handle: string;
    url: string;
    /** Null when the channel hides its subscriber count. YouTube rounds it to 3 significant digits. */
    subscribers: number | null;
    videoCount: number;
    viewCount: number;
  };
  /** The most viewed regular video (no Shorts, no live streams). */
  popular: YouTubeVideo | null;
  /** The newest regular videos, without the most viewed one. */
  latest: YouTubeVideo[];
}

/** The parts of the API responses we use. */
export interface ApiChannel {
  id: string;
  snippet: { title: string; customUrl?: string };
  statistics: { subscriberCount?: string; hiddenSubscriberCount?: boolean; videoCount?: string; viewCount?: string };
  contentDetails: { relatedPlaylists: { uploads: string } };
}

export interface ApiVideo {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    liveBroadcastContent?: string;
    thumbnails?: Record<string, { url: string; width?: number; height?: number } | undefined>;
  };
  statistics?: { viewCount?: string };
  contentDetails?: { duration?: string };
  status?: { privacyStatus?: string; uploadStatus?: string };
}

/** "PT1H2M3S" → 3723 seconds. */
export function durationSeconds(iso: string) {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return 0;
  const [, d, h, min, s] = m.map((v) => Number(v ?? 0));
  return ((d * 24 + h) * 60 + min) * 60 + s;
}

/** Public, finished uploads that are not (or no longer) live broadcasts. */
export function isRegularUpload(v: ApiVideo) {
  return (
    v.status?.privacyStatus === "public" &&
    (v.status.uploadStatus ?? "processed") === "processed" &&
    (v.snippet.liveBroadcastContent ?? "none") === "none" &&
    durationSeconds(v.contentDetails?.duration ?? "") > 0
  );
}

/**
 * Picks the most viewed video and the newest ones, skipping Shorts.
 * `isShort` is asked lazily, only about candidates that could be shown.
 */
export async function pickVideos(
  videos: ApiVideo[],
  isShort: (v: ApiVideo) => Promise<boolean>,
  latestCount = 2,
): Promise<{ popular: ApiVideo | null; latest: ApiVideo[] }> {
  const candidates = videos.filter(isRegularUpload);
  const verdicts = new Map<string, Promise<boolean>>();
  const short = (v: ApiVideo) => {
    if (!verdicts.has(v.id)) verdicts.set(v.id, isShort(v));
    return verdicts.get(v.id)!;
  };

  let popular: ApiVideo | null = null;
  for (const v of [...candidates].sort((a, b) => views(b) - views(a))) {
    if (!(await short(v))) {
      popular = v;
      break;
    }
  }

  const latest: ApiVideo[] = [];
  for (const v of [...candidates].sort(
    (a, b) => Date.parse(b.snippet.publishedAt) - Date.parse(a.snippet.publishedAt),
  )) {
    if (latest.length >= latestCount) break;
    if (v.id !== popular?.id && !(await short(v))) latest.push(v);
  }
  return { popular, latest };
}

function views(v: ApiVideo) {
  return Number(v.statistics?.viewCount ?? 0);
}

/** Best 16:9 thumbnails (YouTube's "high" and "standard" sizes are 4:3 with black bars). */
export function thumbnailUrls(v: ApiVideo) {
  const t = v.snippet.thumbnails ?? {};
  const sm = t.medium?.url ?? t.default?.url;
  const lg = t.maxres?.url ?? t.medium?.url;
  return sm && lg ? { sm, lg } : null;
}

export function toSnapshotVideo(v: ApiVideo, thumb: YouTubeVideo["thumb"]): YouTubeVideo {
  return {
    id: v.id,
    title: v.snippet.title,
    publishedAt: v.snippet.publishedAt,
    views: views(v),
    duration: v.contentDetails?.duration ?? "",
    thumb,
  };
}

export function channelSummary(c: ApiChannel, handle: string): YouTubeSnapshot["channel"] {
  const subscribers = c.statistics.hiddenSubscriberCount ? null : Number(c.statistics.subscriberCount ?? NaN);
  return {
    id: c.id,
    title: c.snippet.title,
    handle,
    url: `https://www.youtube.com/${handle}`,
    subscribers: Number.isFinite(subscribers) ? subscribers : null,
    videoCount: Number(c.statistics.videoCount ?? 0),
    viewCount: Number(c.statistics.viewCount ?? 0),
  };
}
