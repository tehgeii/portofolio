import { useEffect, useState } from "react";
import snapshot from "../data/github-snapshot.json";
import { fetchGitHubStats, type GitHubStats } from "../lib/github";

export type { GitHubStats, RepoSummary } from "../lib/github";

export type GitHubStatus = "loading" | "live" | "fallback";

/**
 * Stats baked in at deploy time (scripts/fetch-github-stats.ts). Shown
 * instantly, and kept if the visitor's browser can't reach the GitHub API.
 */
export const SNAPSHOT_STATS = snapshot as unknown as GitHubStats;

const CACHE_KEY = "gh-stats-v3";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes keeps us far below the API rate limit
/** After a failure (offline, rate-limited) wait this long before asking again. */
const FAILURE_TTL = 10 * 60 * 1000;
const TIMEOUT = 8000;

type CacheEntry = { at: number; data: GitHubStats } | { at: number; failed: true };

/** localStorage survives new tabs, so a visitor costs at most one request per half hour. */
function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    const ttl = "failed" in entry ? FAILURE_TTL : CACHE_TTL;
    return Date.now() - entry.at < ttl ? entry : null;
  } catch {
    return null;
  }
}

function writeCache(entry: CacheEntry) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* ignore */
  }
}

// Several components read these stats; share one request between them.
const inflight = new Map<string, Promise<GitHubStats>>();

function loadStats(username: string) {
  let promise = inflight.get(username);
  if (!promise) {
    promise = fetchGitHubStats(username, { signal: AbortSignal.timeout(TIMEOUT) }).then(
      (data) => {
        writeCache({ at: Date.now(), data });
        return data;
      },
      (error: unknown) => {
        writeCache({ at: Date.now(), failed: true });
        inflight.delete(username);
        throw error;
      },
    );
    inflight.set(username, promise);
  }
  return promise;
}

/** Live GitHub profile stats with caching and a graceful offline fallback. */
export function useGitHubStats(username: string) {
  const [cached] = useState(readCache);
  const cachedData = cached && "data" in cached ? cached.data : null;
  const [stats, setStats] = useState<GitHubStats>(cachedData ?? SNAPSHOT_STATS);
  const [status, setStatus] = useState<GitHubStatus>(cachedData ? "live" : cached ? "fallback" : "loading");

  useEffect(() => {
    if (cached) return;
    let alive = true;
    loadStats(username)
      .then((data) => {
        if (!alive) return;
        setStats(data);
        setStatus("live");
      })
      .catch(() => {
        if (alive) setStatus("fallback");
      });
    return () => {
      alive = false;
    };
  }, [username, cached]);

  return { stats, status };
}
