import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against production builds served under /portofolio/,
 * exactly like GitHub Pages:
 *
 *   npm run build && npm run build:e2e && npm run test:e2e
 *
 * - dist/ is the real site (optional services off unless their keys are set).
 * - dist-e2e/ switches the optional services on with dummy keys (.env.e2e);
 *   tests/integrations.spec.ts runs against it with every request mocked.
 *
 * Set PW_CHROMIUM_PATH to use an already installed Chromium instead of
 * `npx playwright install chromium`.
 */
const executablePath = process.env.PW_CHROMIUM_PATH;
const baseURL = "http://localhost:4173/portofolio/";
const integrationsURL = "http://localhost:4174/portofolio/";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry in CI; a test that only passes on retry is still flagged as flaky in the report.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] }, testIgnore: /integrations\.spec\.ts/ },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
      // Page-wide checks (accessibility, metadata, security policy) don't depend on the screen.
      testIgnore: /(integrations|quality)\.spec\.ts/,
    },
    {
      name: "integrations",
      use: { ...devices["Desktop Chrome"], baseURL: integrationsURL },
      testMatch: /integrations\.spec\.ts/,
    },
  ],
  webServer: [
    {
      command: "npx vite preview --port 4173 --strictPort --base /portofolio/",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npx vite preview --port 4174 --strictPort --base /portofolio/ --outDir dist-e2e",
      url: integrationsURL,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
