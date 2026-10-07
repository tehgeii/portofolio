import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `base: "./"` makes the build work on any static host, including
// GitHub Pages under https://tehgeii.github.io/portofolio/.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
