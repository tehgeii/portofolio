/**
 * GitHub profile stats, shared by the browser (live refresh) and by
 * scripts/fetch-github-stats.ts (snapshot baked in at deploy time).
 * Keep this file free of runtime imports so Node can run it directly.
 */

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
  /** When the data was fetched (ISO string). */
  fetchedAt: string;
}

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

/** The portfolio's own repo is left out of "recently updated". */
const HIDDEN_FROM_RECENT = new Set(["portofolio"]);

export function summarize(user: ApiUser, allRepos: ApiRepo[], fetchedAt = new Date().toISOString()): GitHubStats {
  const repos = allRepos.filter((r) => !r.fork);

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
      .filter((r) => !HIDDEN_FROM_RECENT.has(r.name))
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
    fetchedAt,
  };
}

export async function fetchGitHubStats(username: string, token?: string): Promise<GitHubStats> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
  ]);
  if (!userRes.ok || !reposRes.ok) throw new Error(`GitHub API ${userRes.status}/${reposRes.status}`);
  return summarize((await userRes.json()) as ApiUser, (await reposRes.json()) as ApiRepo[]);
}
