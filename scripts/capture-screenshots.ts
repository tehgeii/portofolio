/**
 * Takes the screenshots of this website that its own project card shows.
 *
 *   npm run build && npm run screenshots
 *
 * Serves dist/ like GitHub Pages, captures a dark home page and a light
 * projects section at 1280×800, and saves them as WebP (plus a card-sized
 * cover) in src/assets/projects/. External requests are blocked, so the
 * images never depend on live data. Commit the result after checking it.
 * Set PW_CHROMIUM_PATH to use an already installed Chromium.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium, type Page } from "@playwright/test";
import { preview } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = fileURLToPath(new URL("../src/assets/projects/", import.meta.url));
const SIZE = { width: 1280, height: 800 };
/** Same aspect ratio as the other project covers. */
const COVER = { width: 720, height: 483 };

const server = await preview({
  root,
  base: "/portofolio/",
  preview: { port: 4190, strictPort: true },
  logLevel: "error",
});
const base = "http://localhost:4190/portofolio/";

const browser = await chromium.launch(
  process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
);

/** Drops the ICC profile and any EXIF/XMP chunks Chrome adds, so the files carry no metadata. */
function stripMetadata(webpFile: Buffer) {
  if (webpFile.toString("ascii", 0, 4) !== "RIFF" || webpFile.toString("ascii", 8, 12) !== "WEBP") return webpFile;
  const chunks: Buffer[] = [];
  for (let offset = 12; offset + 8 <= webpFile.length;) {
    const id = webpFile.toString("ascii", offset, offset + 4);
    const size = webpFile.readUInt32LE(offset + 4);
    const chunk = Buffer.from(webpFile.subarray(offset, offset + 8 + size + (size & 1)));
    offset += chunk.length;
    if (id === "ICCP" || id === "EXIF" || id === "XMP ") continue;
    if (id === "VP8X") chunk[8] &= ~(0x20 | 0x08 | 0x04); // ICC, EXIF and XMP flags
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(body.length + 4, 4);
  header.write("WEBP", 8, "ascii");
  return Buffer.concat([header, body]);
}

/** Encodes the current viewport as WebP in the page itself, so no image library is needed. */
async function webp(page: Page, crop?: { width: number; height: number; outWidth: number; outHeight: number }) {
  const png = (await page.screenshot()).toString("base64");
  const dataUrl = await page.evaluate(
    async ({ png, crop }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${png}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = crop?.outWidth ?? img.width;
      canvas.height = crop?.outHeight ?? img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      if (crop) ctx.drawImage(img, 0, 0, crop.width, crop.height, 0, 0, crop.outWidth, crop.outHeight);
      else ctx.drawImage(img, 0, 0);
      return canvas.toDataURL("image/webp", 0.82);
    },
    { png, crop },
  );
  return stripMetadata(Buffer.from(dataUrl.split(",")[1], "base64"));
}

async function open(theme: "dark" | "light", hash = "", scrollBy = 0) {
  const context = await browser.newContext({
    viewport: SIZE,
    deviceScaleFactor: 1,
    locale: "en-US",
    reducedMotion: "reduce",
  });
  await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
  // Only our own server: no live GitHub data, analytics or embeds.
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  const page = await context.newPage();
  await page.goto(`${base}${hash}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Skip a section's top padding so the content fills the frame.
  if (scrollBy) await page.evaluate((y) => window.scrollBy(0, y), scrollBy);
  await page.waitForTimeout(600);
  return { page, context };
}

try {
  const dark = await open("dark");
  writeFileSync(`${outDir}portfolio-dark.webp`, await webp(dark.page));
  const coverCrop = { width: Math.round((SIZE.height * COVER.width) / COVER.height), height: SIZE.height };
  writeFileSync(
    `${outDir}portfolio-dark-cover.webp`,
    await webp(dark.page, { ...coverCrop, outWidth: COVER.width, outHeight: COVER.height }),
  );
  await dark.context.close();

  const light = await open("light", "#projects", 120);
  writeFileSync(`${outDir}portfolio-light.webp`, await webp(light.page));
  await light.context.close();

  console.log("✓ src/assets/projects/portfolio-{dark,dark-cover,light}.webp");
} finally {
  await browser.close();
  await new Promise<void>((resolve) => server.httpServer.close(() => resolve()));
}
