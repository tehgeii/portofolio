import { durationSeconds, type YouTubeSnapshot, type YouTubeVideo } from "../lib/youtube";

/**
 * The YouTube snapshot written in CI by scripts/fetch-youtube.ts, if any.
 * Without it (no API key, or a local checkout) `youtube` is null and the
 * section, its nav link and its search entries are left out.
 */
const snapshots = import.meta.glob<YouTubeSnapshot>("@generated/youtube.json", { eager: true, import: "default" });
const thumbFiles = import.meta.glob<string>("@generated/youtube/*.{jpg,svg}", { eager: true, import: "default" });

const thumbs = new Map(Object.entries(thumbFiles).map(([path, url]) => [path.split("/").pop()!, url]));

export interface ShownVideo extends Omit<YouTubeVideo, "thumb"> {
  url: string;
  seconds: number;
  /** Bundled thumbnail URLs, or null to show a placeholder. */
  thumb: { sm: string; lg: string } | null;
  kind: "popular" | "latest";
}

function show(video: YouTubeVideo, kind: ShownVideo["kind"]): ShownVideo {
  const sm = video.thumb && thumbs.get(video.thumb.sm);
  const lg = video.thumb && thumbs.get(video.thumb.lg);
  return {
    ...video,
    kind,
    url: `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`,
    seconds: durationSeconds(video.duration),
    thumb: sm && lg ? { sm, lg } : null,
  };
}

function load() {
  const snapshot = Object.values(snapshots)[0];
  if (!snapshot || snapshot.schema !== 1 || !snapshot.channel) return null;
  const videos = [
    ...(snapshot.popular ? [show(snapshot.popular, "popular")] : []),
    ...snapshot.latest.map((v) => show(v, "latest")),
  ];
  return { channel: snapshot.channel, fetchedAt: snapshot.fetchedAt, videos };
}

export const youtube = load();
