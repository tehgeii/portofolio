import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteHtml } from "./scripts/vite-site-html.ts";

// `base: "./"` makes the build work on any static host, including
// GitHub Pages under https://tehgeii.github.io/portofolio/.
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), tailwindcss(), siteHtml()],
  resolve: {
    alias: {
      // Data generated in CI (YouTube). The e2e test build uses fixed fixtures instead.
      "@generated": fileURLToPath(
        new URL(mode === "e2e" ? "./tests/fixtures/generated" : "./src/data/generated", import.meta.url),
      ),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Libraries rarely change, while data (GitHub stats) is rebuilt every
        // week: keep them in their own files so browsers keep them cached.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 2 },
            {
              name: "motion",
              test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
}));
