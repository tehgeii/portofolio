/**
 * Bakes the latest GitHub stats into src/data/github-snapshot.json.
 *
 * Runs in CI right before `vite build` (with GITHUB_TOKEN for a higher rate
 * limit), so the deployed site always starts from fresh numbers, even for
 * visitors whose browser can't reach the GitHub API. If the API is
 * unreachable the existing snapshot is kept and the build continues.
 *
 *   npm run stats
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fetchGitHubStats } from "../src/lib/github.ts";

const USERNAME = "tehgeii";
const target = fileURLToPath(new URL("../src/data/github-snapshot.json", import.meta.url));

try {
  const stats = await fetchGitHubStats(USERNAME, process.env.GITHUB_TOKEN);
  writeFileSync(target, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(
    `GitHub snapshot updated: ${stats.publicRepos} repos, ${stats.totalStars} stars, ${stats.followers} followers`,
  );
} catch (error) {
  console.warn(`Could not refresh GitHub snapshot, keeping the existing one. (${(error as Error).message})`);
}
