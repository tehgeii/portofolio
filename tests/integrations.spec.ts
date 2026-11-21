import { expect, test, type Page, type Request } from "@playwright/test";

/**
 * Optional services, tested against dist-e2e/ (built with the dummy keys in
 * .env.e2e). Every request to a third party is mocked or blocked here, so
 * these tests never send real mail or count real visits.
 */

const WEB3FORMS = "https://api.web3forms.com/submit";

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/**", (route) => route.abort());
  await page.route(/goatcounter\.com/, (route) => route.abort());
});

async function fillContactForm(page: Page) {
  await page.goto("./#contact");
  const form = page.locator("#contact form");
  await expect(form).toHaveAttribute("data-mode", "web3forms");
  await form.getByLabel(/^(Nama|Name)$/).fill("Budi Tester");
  await form.getByLabel(/^Email$/).fill("budi@example.com");
  await form.getByLabel(/^(Pesan|Message)$/).fill("Halo Dafi, ini pesan uji coba dari tes otomatis.");
  return form;
}

test("contact form sends the message directly and thanks the visitor", async ({ page }) => {
  const requests: Request[] = [];
  await page.route(WEB3FORMS, async (route) => {
    requests.push(route.request());
    await route.fulfill({ json: { success: true, message: "Email sent successfully!" } });
  });

  const form = await fillContactForm(page);
  await form.getByRole("button", { name: /kirim pesan|send message/i }).click();

  await expect(page.getByRole("status").filter({ hasText: /Pesan terkirim|Message sent/ })).toBeVisible();
  expect(requests).toHaveLength(1);
  const body = requests[0].postDataJSON();
  expect(body).toMatchObject({
    access_key: "e2e-dummy-access-key",
    name: "Budi Tester",
    email: "budi@example.com",
    message: "Halo Dafi, ini pesan uji coba dari tes otomatis.",
  });

  // "Send another message" brings back an empty form.
  await page.getByRole("button", { name: /kirim pesan lain|send another/i }).click();
  await expect(page.locator("#contact textarea")).toHaveValue("");
});

test("when sending fails, the visitor can retry or use their email app", async ({ page }) => {
  let attempts = 0;
  await page.route(WEB3FORMS, async (route) => {
    attempts++;
    await route.fulfill({ status: 500, json: { success: false, message: "Server error" } });
  });

  const form = await fillContactForm(page);
  await form.getByRole("button", { name: /kirim pesan|send message/i }).click();

  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  // The fallback keeps everything the visitor typed.
  const mailto = await alert.getByRole("link", { name: /aplikasi email|email app/i }).getAttribute("href");
  expect(mailto).toMatch(/^mailto:/);
  expect(decodeURIComponent(mailto!)).toContain("ini pesan uji coba dari tes otomatis");
  await expect(form.locator("textarea")).toHaveValue(/ini pesan uji coba/);

  await alert.getByRole("button", { name: /coba lagi|try again/i }).click();
  await expect.poll(() => attempts).toBe(2);
});

test("spam bots that fill the hidden field are ignored", async ({ page }) => {
  let sent = 0;
  await page.route(WEB3FORMS, async (route) => {
    sent++;
    await route.fulfill({ json: { success: true } });
  });

  const form = await fillContactForm(page);
  await form.locator('input[name="botcheck"]').evaluate((el: HTMLInputElement) => {
    el.value = "https://spam.example";
  });
  await form.getByRole("button", { name: /kirim pesan|send message/i }).click();

  await expect(page.getByRole("status").filter({ hasText: /Pesan terkirim|Message sent/ })).toBeVisible();
  expect(sent).toBe(0);
});

const COUNTER = "https://e2e-dummy.goatcounter.com/counter/TOTAL.json";

test("the footer shows the total number of visits", async ({ page }) => {
  await page.route(COUNTER, (route) => route.fulfill({ json: { count: "1,234" } }));
  await page.goto("./");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("visits")).toHaveText(/1[.,]234 (kunjungan|visits)/);
});

test("the visit counter stays hidden when GoatCounter refuses", async ({ page }) => {
  let asked = false;
  await page.route(COUNTER, (route) => {
    asked = true;
    return route.fulfill({ status: 403, body: "Forbidden" });
  });
  await page.goto("./");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect.poll(() => asked).toBe(true);
  await expect(page.getByTestId("visits")).toHaveCount(0);
});

test("automated browsers are never counted as visitors", async ({ page }) => {
  const hits: string[] = [];
  page.on("request", (req) => {
    const url = new URL(req.url());
    if (url.hostname.endsWith("goatcounter.com") && url.pathname === "/count") hits.push(req.url());
  });
  await page.route(COUNTER, (route) => route.fulfill({ json: { count: "10" } }));
  await page.goto("./");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("visits")).toBeVisible();
  expect(hits).toEqual([]);
});
