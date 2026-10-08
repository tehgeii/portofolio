import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the production build served under
 * /portofolio/, exactly like GitHub Pages.
 *
 *   npm run build && npm run test:e2e
 *
 * Set PW_CHROMIUM_PATH to use an already installed Chromium instead of
 * `npx playwright install chromium`.
 */
const executablePath = process.env.PW_CHROMIUM_PATH;
const baseURL = "http://localhost:4173/portofolio/";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npx vite preview --port 4173 --strictPort --base /portofolio/",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
