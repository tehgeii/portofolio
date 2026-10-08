import { useEffect, useState } from "react";
import snapshot from "../data/github-snapshot.json";
import { fetchGitHubStats, type GitHubStats } from "../lib/github";

export type { GitHubStats, RepoSummary } from "../lib/github";

export type GitHubStatus = "loading" | "live" | "fallback";

/**
 * Stats baked in at deploy time (scripts/fetch-github-stats.ts). Shown
 * instantly, and kept if the visitor's browser can't reach the GitHub API.
 */
export const SNAPSHOT_STATS = snapshot as GitHubStats;

const CACHE_KEY = "gh-stats-v2";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes keeps us far below the API rate limit

function readCache(): GitHubStats | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: GitHubStats };
    return Date.now() - at < CACHE_TTL ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: GitHubStats) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* ignore */
  }
}

// Several components read these stats; share one request between them.
const inflight = new Map<string, Promise<GitHubStats>>();

function loadStats(username: string) {
  let promise = inflight.get(username);
  if (!promise) {
    promise = fetchGitHubStats(username).then((data) => {
      writeCache(data);
      return data;
    });
    promise.catch(() => inflight.delete(username));
    inflight.set(username, promise);
  }
  return promise;
}

/** Live GitHub profile stats with caching and a graceful offline fallback. */
export function useGitHubStats(username: string) {
  const [cached] = useState(readCache);
  const [stats, setStats] = useState<GitHubStats>(cached ?? SNAPSHOT_STATS);
  const [status, setStatus] = useState<GitHubStatus>(cached ? "live" : "loading");

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
