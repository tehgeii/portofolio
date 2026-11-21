/**
 * Fetches the YouTube channel's stats and highlighted videos into
 * src/data/generated/ (git-ignored), together with the video thumbnails, so
 * the site can show them without contacting YouTube from the browser.
 *
 *   YOUTUBE_API_KEY=… npm run youtube
 *
 * Runs in CI before `vite build`; the key is a GitHub Actions secret. Without
 * a key nothing is written and the YouTube section stays hidden. If the API
 * fails, the previous copy (restored from the CI cache) is kept.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  channelSummary,
  durationSeconds,
  pickVideos,
  thumbnailUrls,
  toSnapshotVideo,
  type ApiChannel,
  type ApiVideo,
  type YouTubeSnapshot,
} from "../src/lib/youtube.ts";

const HANDLE = "@techgameplayindonesia";
const API = "https://www.googleapis.com/youtube/v3";
const MAX_PAGES = 10; // 500 uploads is plenty to find the most viewed one
const outDir = fileURLToPath(new URL("../src/data/generated/", import.meta.url));
const thumbDir = `${outDir}youtube/`;
const ci = !!process.env.GITHUB_ACTIONS;

const key = process.env.YOUTUBE_API_KEY?.trim();
if (!key) {
  console.log(`${ci ? "::notice title=YouTube::" : ""}YOUTUBE_API_KEY is not set; the YouTube section stays hidden.`);
  process.exit(0);
}

async function api<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = `${API}/${path}?${new URLSearchParams({ ...params, key: key! })}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`YouTube API ${path} ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Shorts can't be told apart through the API. youtube.com/shorts/<id> answers
 * 200 for a Short and redirects to /watch for a regular video. Only short
 * videos are checked; if YouTube's answer is unclear, ≤ 60 s counts as a Short.
 */
async function isShort(v: ApiVideo) {
  const seconds = durationSeconds(v.contentDetails?.duration ?? "");
  if (seconds > 180) return false;
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${v.id}`, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    if (res.status === 200) return true;
    if (res.status >= 300 && res.status < 400 && /\/watch/.test(res.headers.get("location") ?? "")) return false;
  } catch {
    /* fall through */
  }
  return seconds <= 60;
}

async function download(url: string, file: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`thumbnail ${res.status}`);
  writeFileSync(`${thumbDir}${file}`, Buffer.from(await res.arrayBuffer()));
}

try {
  const { items: channels = [] } = await api<{ items?: ApiChannel[] }>("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: HANDLE,
  });
  const channel = channels[0];
  if (!channel) throw new Error(`channel ${HANDLE} not found`);

  // All uploads (newest first), then their details in batches of 50.
  const ids: string[] = [];
  let pageToken = "";
  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await api<{ items?: { contentDetails: { videoId: string } }[]; nextPageToken?: string }>(
      "playlistItems",
      {
        part: "contentDetails",
        playlistId: channel.contentDetails.relatedPlaylists.uploads,
        maxResults: "50",
        ...(pageToken ? { pageToken } : {}),
      },
    );
    ids.push(...(res.items ?? []).map((i) => i.contentDetails.videoId));
    if (!res.nextPageToken) break;
    pageToken = res.nextPageToken;
  }
  const videos: ApiVideo[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const res = await api<{ items?: ApiVideo[] }>("videos", {
      part: "snippet,statistics,contentDetails,status",
      id: ids.slice(i, i + 50).join(","),
    });
    videos.push(...(res.items ?? []));
  }

  const { popular, latest } = await pickVideos(videos, isShort);

  // Fresh thumbnail folder: only the videos shown now.
  rmSync(thumbDir, { recursive: true, force: true });
  mkdirSync(thumbDir, { recursive: true });
  const withThumb = async (v: ApiVideo) => {
    const urls = thumbnailUrls(v);
    if (!urls) return toSnapshotVideo(v, null);
    try {
      await download(urls.sm, `${v.id}-sm.jpg`);
      await download(urls.lg, `${v.id}-lg.jpg`);
      return toSnapshotVideo(v, { sm: `${v.id}-sm.jpg`, lg: `${v.id}-lg.jpg` });
    } catch {
      return toSnapshotVideo(v, null);
    }
  };

  const snapshot: YouTubeSnapshot = {
    schema: 1,
    fetchedAt: new Date().toISOString(),
    channel: channelSummary(channel, HANDLE),
    popular: popular ? await withThumb(popular) : null,
    latest: await Promise.all(latest.map(withThumb)),
  };
  writeFileSync(`${outDir}youtube.json`, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `YouTube snapshot updated: ${snapshot.channel.subscribers ?? "hidden"} subscribers, ` +
      `${snapshot.channel.videoCount} videos, ${[snapshot.popular, ...snapshot.latest].filter(Boolean).length} highlighted`,
  );
} catch (error) {
  const kept = existsSync(`${outDir}youtube.json`);
  console.warn(
    `${ci ? "::warning title=YouTube::" : ""}Could not refresh YouTube data` +
      `${kept ? ", keeping the previous copy" : ""}. (${(error as Error).message})`,
  );
}
