import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Search-engine data, security policy, themes, languages and accessibility of the real build. */

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/**", (route) => route.abort());
  await page.route("https://api.web3forms.com/**", (route) => route.abort());
  await page.route(/goatcounter\.com/, (route) => route.abort());
});

/** Serious and critical accessibility problems on the current page. */
async function seriousA11yIssues(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map(
      (v) =>
        `${v.id}: ${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 3)
          .join(" | ")}`,
    );
}

async function visitWholePage(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 25));
    }
    window.scrollTo(0, 0);
  });
  await animationsSettled(page);
}

/**
 * Sections fade in as they scroll into view (opacity still animates with
 * reduced motion). Contrast must be measured after the fades, not halfway.
 * Endless decorative animations (marquee, pulsing dots) are ignored.
 */
async function animationsSettled(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((a) => a.playState !== "running" || !Number.isFinite(Number(a.effect?.getComputedTiming().endTime))),
  );
}

for (const colorScheme of ["dark", "light"] as const) {
  test(`no serious accessibility issues (${colorScheme} theme)`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
    await page.goto("./");
    await expect(page.locator("html")).toHaveClass(colorScheme === "dark" ? /dark/ : /^(?!.*dark)/);
    await visitWholePage(page);
    expect(await seriousA11yIssues(page)).toEqual([]);

    await page.goto("./#project/tgo");
    await expect(page.getByRole("dialog")).toBeVisible();
    await animationsSettled(page);
    expect(await seriousA11yIssues(page)).toEqual([]);
    await context.close();
  });
}

test("light theme from the OS setting, with a matching browser colour", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#fafafa");
  await context.close();
});

test("English browsers get English title, language and description", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/Informatics Student/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /^Portfolio of /);
  await context.close();
});

test("the security policy is never violated while using the site", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { cspViolations: string[] };
    w.cspViolations = [];
    document.addEventListener("securitypolicyviolation", (e) =>
      w.cspViolations.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  await page.goto("./");
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1);
  await visitWholePage(page);

  await page.locator("#projects article h3 button").first().click();
  await page.getByRole("dialog").locator("figure button").first().click();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: /ganti tema|toggle theme|mode/i })
    .first()
    .click();

  const violations = await page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations);
  expect(violations).toEqual([]);
});

test("search engines get structured data, a sitemap and an app manifest", async ({ page, request }) => {
  await page.goto("./");
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(jsonLd).toMatchObject({ "@type": "Person", name: "Dafi Hauzan Atsillah Hoenarko" });
  expect(jsonLd.sameAs).toContain("https://github.com/tehgeii");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /.+/);

  const sitemap = await request.get("./sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);

  const manifest = await request.get("./manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  for (const icon of (await manifest.json()).icons as { src: string }[]) {
    expect((await request.get(`./${icon.src}`)).ok()).toBe(true);
  }
});
