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
