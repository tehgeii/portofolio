import { useEffect, useState } from "react";

export interface RepoSummary {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  createdAt: string;
  /** [language, repoCount], most used first. */
  languages: [string, number][];
  recent: RepoSummary[];
}

export type GitHubStatus = "loading" | "live" | "fallback";

/** Last known snapshot, shown instantly and used if the API is unreachable. */
export const FALLBACK_STATS: GitHubStats = {
  publicRepos: 17,
  followers: 8,
  totalStars: 6,
  createdAt: "2022-12-21T15:14:24Z",
  languages: [
    ["PHP", 3],
    ["Python", 2],
    ["C++", 2],
    ["Batchfile", 2],
    ["Kotlin", 1],
    ["Go", 1],
    ["JavaScript", 1],
    ["HTML", 1],
  ],
  recent: [
    {
      name: "sistem-bot-otomatis",
      description: "NgiBsen UDINUS: Android attendance reminder",
      url: "https://github.com/tehgeii/sistem-bot-otomatis",
      language: "Kotlin",
      stars: 0,
      pushedAt: "2026-10-07T03:25:14Z",
    },
    {
      name: "project-data-mining",
      description: "https://project-data-mining-zzz.streamlit.app/",
      url: "https://github.com/tehgeii/project-data-mining",
      language: "Python",
      stars: 0,
      pushedAt: "2026-10-06T03:13:13Z",
    },
    {
      name: "wifi-speed-tester",
      description: "WiFi Speed + Ping Tester for Windows",
      url: "https://github.com/tehgeii/wifi-speed-tester",
      language: "Go",
      stars: 0,
      pushedAt: "2026-10-05T08:55:27Z",
    },
    {
      name: "zzz-gacha-mining",
      description: "https://zzz-gacha-mining.streamlit.app/",
      url: "https://github.com/tehgeii/zzz-gacha-mining",
      language: "Python",
      stars: 0,
      pushedAt: "2026-09-29T12:27:22Z",
    },
  ],
};

const CACHE_KEY = "gh-stats-v1";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes keeps us far below the API rate limit

interface ApiUser {
  public_repos: number;
  followers: number;
  created_at: string;
}

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

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

async function fetchStats(username: string): Promise<GitHubStats> {
  const headers = { Accept: "application/vnd.github+json" };
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
  ]);
  if (!userRes.ok || !reposRes.ok) throw new Error(`GitHub API ${userRes.status}/${reposRes.status}`);

  const user = (await userRes.json()) as ApiUser;
  const repos = ((await reposRes.json()) as ApiRepo[]).filter((r) => !r.fork);

  const langCount = new Map<string, number>();
  for (const r of repos) {
    if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
  }

  return {
    publicRepos: user.public_repos,
    followers: user.followers,
    createdAt: user.created_at,
    totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    languages: [...langCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    recent: repos
      .filter((r) => r.name !== "portofolio")
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .slice(0, 4)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
      })),
  };
}

// Several components read these stats; share one request between them.
const inflight = new Map<string, Promise<GitHubStats>>();

function loadStats(username: string) {
  let promise = inflight.get(username);
  if (!promise) {
    promise = fetchStats(username).then((data) => {
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
  const [stats, setStats] = useState<GitHubStats>(cached ?? FALLBACK_STATS);
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
