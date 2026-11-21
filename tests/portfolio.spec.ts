import { expect, test, type Page } from "@playwright/test";

/** True when the page can be scrolled by the visitor (no overlay lock left behind). */
async function pageIsScrollable(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).overflow !== "hidden");
}

const dialog = (page: Page) => page.getByRole("dialog");
const palette = (page: Page) => page.getByRole("combobox");

test.beforeEach(async ({ page }) => {
  // Keep tests deterministic: use the baked-in GitHub snapshot.
  await page.route("https://api.github.com/**", (route) => route.abort());
});

test("loads without errors, in Indonesian by default for Indonesian browsers", async ({ browser }) => {
  const context = await browser.newContext({ locale: "id-ID", reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Dafi Hauzan");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page).toHaveTitle(/Mahasiswa Informatika/);

  const overflowsX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflowsX).toBe(false);
  expect(errors).toEqual([]);
  await context.close();
});

test("theme choice survives a reload", async ({ page }) => {
  await page.goto("./");
  const html = page.locator("html");
  const wasDark = ((await html.getAttribute("class")) ?? "").includes("dark");

  await page.getByRole("button", { name: /Switch to (light|dark) mode/ }).click();
  await expect(html).toHaveClass(wasDark ? /^(?!.*dark)/ : /dark/);

  await page.reload();
  await expect(html).toHaveClass(wasDark ? /^(?!.*dark)/ : /dark/);
});

test("language toggle switches the copy and is remembered", async ({ page, isMobile }) => {
  test.skip(isMobile, "The toggle lives in the mobile menu; covered on desktop.");
  await page.goto("./");
  await page
    .getByRole("group", { name: /language|bahasa/i })
    .getByRole("button", { name: "id" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.getByRole("link", { name: "Tentang" }).first()).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});

test("a link to a section lands on that section", async ({ page }) => {
  await page.goto("./#contact");
  await expect
    .poll(() => page.evaluate(() => Math.round(document.getElementById("contact")!.getBoundingClientRect().top)))
    .toBeLessThan(150);
});

test("a shared project link opens its details, and closing returns to the list", async ({ page }) => {
  await page.goto("./#project/tgo");
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page).getByRole("heading", { level: 2 })).toHaveText(/TGO/);

  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
  await expect(page).toHaveURL(/#projects$/);
  expect(await pageIsScrollable(page)).toBe(true);
});

test("Back closes a project opened from the grid instead of leaving the site", async ({ page }) => {
  await page.goto("./");
  await page.locator("#projects article h3 button").first().click();
  await expect(dialog(page)).toBeVisible();
  await expect(page).toHaveURL(/#project\/tgo$/);

  // Browsing to the next project keeps a single history entry.
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/#project\/ngibsen$/);

  await page.goBack();
  await expect(dialog(page)).toHaveCount(0);
  await expect(page).not.toHaveURL(/#project\//);
  expect(await pageIsScrollable(page)).toBe(true);
});

test("project filter shows only the chosen category", async ({ page }) => {
  await page.goto("./#projects");
  await page.getByRole("button", { name: /^Mobile/ }).click();
  await expect(page.locator("#projects article")).toHaveCount(1);
  await expect(page.locator("#projects article h3")).toHaveText("NgiBsen UDINUS");
});

test.describe("overlays never leave the page stuck", () => {
  test.skip(({ isMobile }) => isMobile, "Keyboard shortcuts are a desktop feature.");

  test("palette → open project → close keeps scrolling", async ({ page }) => {
    await page.goto("./");
    await page.keyboard.press("Control+k");
    await palette(page).fill("ngibsen");
    await page.keyboard.press("Enter");
    await expect(dialog(page).getByRole("heading", { level: 2 })).toHaveText("NgiBsen UDINUS");

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toHaveCount(0);
    expect(await pageIsScrollable(page)).toBe(true);
  });

  test("palette opened over a project still closes with Escape", async ({ page }) => {
    await page.goto("./");
    await page.locator("#projects article h3 button").first().click();
    await expect(dialog(page)).toBeVisible();

    await page.keyboard.press("Control+k");
    await expect(palette(page)).toBeFocused();
    expect(await pageIsScrollable(page)).toBe(false);

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toHaveCount(0);
    expect(await pageIsScrollable(page)).toBe(true);
  });

  test("palette finds sections in both languages", async ({ page }) => {
    await page.goto("./");
    await page.keyboard.press("Control+k");
    await palette(page).fill("kontak");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contact$/);
  });
});

test("mobile: menu → search → close keeps scrolling", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only menu.");
  await page.goto("./");
  await page.getByRole("button", { name: /open menu|buka menu/i }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();

  await page
    .getByRole("button", { name: /search|cari/i })
    .first()
    .click();
  await expect(palette(page)).toBeVisible();
  await expect(page.locator("#mobile-menu")).toBeHidden();

  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
  expect(await pageIsScrollable(page)).toBe(true);
});

test("contact form explains what's missing", async ({ page }) => {
  await page.goto("./#contact");
  await page.getByRole("button", { name: /send message|kirim pesan/i }).click();
  await expect(page.locator("#contact [aria-invalid=true]")).toHaveCount(3);
  await expect(page.locator("#contact input[name=name]")).toBeFocused();
});

for (const slug of ["ngibsen", "tgo"]) {
  test(`${slug} screenshots load in the details modal`, async ({ page }) => {
    await page.goto(`./#project/${slug}`);
    const shots = page.getByRole("dialog").locator("figure img");
    await expect(shots).toHaveCount(2);
    for (const img of await shots.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute("alt", /.+/);
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      // The declared size must match the file, or the layout jumps while it loads.
      const [declared, natural] = await img.evaluate((el: HTMLImageElement) => [
        `${el.getAttribute("width")}x${el.getAttribute("height")}`,
        `${el.naturalWidth}x${el.naturalHeight}`,
      ]);
      expect(declared).toBe(natural);
    }
  });
}

test("awards & certifications show text and verification links, never certificate images", async ({ page }) => {
  await page.goto("./#certificates");
  const section = page.locator("#certificates");
  await expect(section.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(section.locator("h4")).not.toHaveCount(0);

  const verifyLinks = section.locator('a[href^="https://coursera.org/verify/"]');
  await expect(verifyLinks).not.toHaveCount(0);
  for (const link of await verifyLinks.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }

  // Privacy guard: cards never show certificate images…
  await expect(section.locator("img")).toHaveCount(0);

  // …only the watermarked award previews, and only inside the dialog.
  await section
    .getByRole("button", { name: /lihat sertifikat|view certificate/i })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  const preview = dialog.locator("img");
  await expect(preview).toHaveCount(1);
  await expect(preview).toHaveAttribute("src", /-preview[^/]*\.webp$/);
  await expect(preview).toHaveAttribute("alt", /.+/);
  await expect.poll(() => preview.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
});

test("certifications can be expanded and collapsed", async ({ page }) => {
  await page.goto("./#certificates");
  const cards = page.locator("#certifications-list > li");
  const toggle = page.locator("#certificates button[aria-controls='certifications-list']");
  await expect(cards).toHaveCount(6);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(await cards.count()).toBeGreaterThan(6);

  await toggle.click();
  await expect(cards).toHaveCount(6);
  await expect(toggle).toBeInViewport();
});

test("privacy: no CV details on the site and no third-party requests", async ({ page }) => {
  const hosts = new Set<string>();
  page.on("request", (req) => hosts.add(new URL(req.url()).hostname));

  await page.goto("./");
  // Scroll through the page so every lazy image and section has loaded.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
  });
  await page.waitForLoadState("networkidle");

  const html = await page.content();
  expect(html).not.toMatch(/\bIPK\b|\bGPA\b|cv\.html|cv-output/);

  // Only our own server, plus the public GitHub API for live stats.
  expect([...hosts].filter((h) => h !== "localhost" && h !== "api.github.com")).toEqual([]);
});

test("project grid: only TGO is featured and no empty category is offered", async ({ page }) => {
  await page.goto("./#projects");
  const cards = page.locator("#projects article");
  await expect(cards).toHaveCount(5);
  // This website itself is the web project, so the Web filter is offered.
  await expect(page.getByRole("button", { name: /^Web/ })).toBeVisible();

  const featured = page.locator("#projects article", { hasText: /Unggulan|Featured/ });
  await expect(featured).toHaveCount(1);
  await expect(featured.locator("h3")).toContainText("TGO");

  // Every filter button shows a count above zero.
  const filters = page.getByRole("group", { name: /filter/i }).getByRole("button");
  for (const btn of await filters.all()) {
    const count = Number((await btn.locator("span").last().textContent())?.trim());
    expect(count).toBeGreaterThan(0);
  }
});

test("small phones (360px): nothing sticks out of the screen", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 740 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("https://api.github.com/**", (route) => route.abort());
  await page.goto("./");
  // Visit every section so lazy content is rendered.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 20));
    }
  });

  const overflowsX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflowsX).toBe(false);

  // Links and buttons must sit fully inside the viewport, except in deliberate sideways scrollers.
  const outside = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main a, main button")]
      .filter((el) => el.offsetParent !== null && !el.closest("[data-scroll-x], [aria-hidden='true']"))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > window.innerWidth + 1);
      })
      .map((el) => el.textContent?.trim().slice(0, 40) || el.getAttribute("aria-label")),
  );
  expect(outside).toEqual([]);

  // No text spilling out of its box (e.g. a label squeezed into a narrow card).
  const spilling = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main a, main button, main p, main span, main li")]
      .filter((el) => el.offsetParent !== null && !el.closest("[data-scroll-x], [aria-hidden='true']"))
      .filter((el) => el.textContent?.trim() && el.clientWidth > 0 && getComputedStyle(el).overflow === "visible")
      .filter((el) => el.scrollWidth > el.clientWidth + 2)
      .map((el) => el.textContent?.trim().slice(0, 40)),
  );
  expect(spilling).toEqual([]);
  await context.close();
});

test("screenshots open in an in-page viewer; Escape closes it before the project", async ({ page }) => {
  await page.goto("./#project/tgo");
  const project = page.getByRole("dialog", { name: /TGO/ }).first();
  await expect(project).toBeVisible();

  await project.locator("figure button").first().click();
  const viewer = page.getByRole("dialog", { name: /TGO/ }).last();
  await expect(viewer.locator("img")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(2);
  await expect(viewer.getByRole("button", { name: /close|tutup/i })).toBeFocused();

  // Arrow keys move between screenshots inside the viewer, not between projects.
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toContainText("2/2");
  await expect(page).toHaveURL(/#project\/tgo$/);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await pageIsScrollable(page)).toBe(true);
});

test("palette lists certificates and closes with its own button", async ({ page }) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: /search|cari/i })
    .first()
    .click();
  await palette(page).fill("nginx");
  await expect(page.getByRole("group", { name: /sertifikat|certificates/i }).getByRole("option")).toHaveCount(1);

  await dialog(page)
    .getByRole("button", { name: /close|tutup/i })
    .click();
  await expect(dialog(page)).toHaveCount(0);
  expect(await pageIsScrollable(page)).toBe(true);
});

test("mobile menu keeps keyboard focus inside while open", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only menu.");
  await page.goto("./");
  await page.getByRole("button", { name: /open menu|buka menu/i }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  for (let i = 0; i < 20; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("header"))).toBe(true);
});

test("project details tell the story and label the old TGO repository", async ({ page }) => {
  await page.goto("./#project/tgo");
  const details = page.getByRole("dialog");
  await expect(details.locator("ol > li")).toHaveCount(3);
  await expect(details.locator("ol > li").first()).toContainText(/Masalah|Problem/);
  await expect(details.getByRole("link", { name: /Versi lama|Legacy version/ })).toHaveAttribute(
    "href",
    "https://github.com/tehgeii/TGO",
  );
  await expect(details).not.toContainText(/open-source tool|tool open-source/i);
});
