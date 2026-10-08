/**
 * Exports the CV to PDF (A4, one page) in both languages.
 *
 *   npm run cv:pdf
 *
 * Output goes to cv-output/ (git-ignored) so drafts never get published by
 * accident. Files are suffixed with -DRAFT while yellow "fill in" markers
 * remain. Set PW_CHROMIUM_PATH to use an already installed Chromium.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = fileURLToPath(new URL("../cv-output/", import.meta.url));
const variants = [
  { lang: "id", photo: "1", file: "CV-Dafi-Hauzan-Atsillah-Hoenarko-ID" },
  { lang: "en", photo: "0", file: "CV-Dafi-Hauzan-Atsillah-Hoenarko-EN" },
];

const server = await createServer({ root, server: { port: 5199, strictPort: false }, logLevel: "error" });
await server.listen();
const base = server.resolvedUrls?.local[0] ?? "http://localhost:5199/";

const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);

let problems = 0;
try {
  mkdirSync(outDir, { recursive: true });
  for (const v of variants) {
    const page = await browser.newPage();
    await page.goto(`${base}cv.html?lang=${v.lang}&photo=${v.photo}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const todos = await page.locator("[data-cv-todo]").allTextContents();
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;

    const name = `${v.file}${todos.length ? "-DRAFT" : ""}.pdf`;
    writeFileSync(`${outDir}${name}`, pdf);
    console.log(`✓ cv-output/${name} (${pages} page${pages === 1 ? "" : "s"})`);

    if (pages !== 1) {
      problems++;
      console.warn(`  ⚠ The CV should fit on one page; trim some content.`);
    }
    for (const todo of todos) console.warn(`  • still to fill in: ${todo}`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}

process.exitCode = problems ? 1 : 0;
