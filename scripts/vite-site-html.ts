/**
 * Build-time additions to index.html and the output folder:
 *
 * - JSON-LD "Person" data for search engines, generated from src/data/site.ts
 *   so it can never drift from what the website shows.
 * - A Content-Security-Policy (production build only): scripts only from this
 *   site plus the inline theme script by hash, network requests only to the
 *   services the site really uses, no plugins, no foreign <base>.
 * - sitemap.xml with the date of the latest commit.
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import type { Plugin } from "vite";
import { site } from "../src/data/site.ts";

/** Hosts the page may contact: GitHub stats, the contact form and the visitor counter. */
const CONNECT = ["https://api.github.com", "https://api.web3forms.com", "https://*.goatcounter.com"];

function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: ["Dafi", site.username],
    url: site.url,
    image: `${site.url}og-image.png`,
    jobTitle: site.jobTitle,
    email: `mailto:${site.email}`,
    affiliation: { "@type": "CollegeOrUniversity", name: site.campus.name, url: site.campus.url },
    address: { "@type": "PostalAddress", addressRegion: site.region, addressCountry: "ID" },
    knowsAbout: site.knowsAbout,
    sameAs: [...site.socials.map((s) => s.url), site.website],
  };
}

function contentSecurityPolicy(html: string) {
  // Classic inline scripts (the theme/language bootstrap) are allowed by their exact hash.
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    ([, code]) => `'sha256-${createHash("sha256").update(code).digest("base64")}'`,
  );
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self' ${CONNECT.join(" ")}`,
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

function lastCommitDate() {
  try {
    return execSync("git log -1 --format=%cs", { encoding: "utf8" }).trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function siteHtml(): Plugin {
  let isBuild = false;
  return {
    name: "site-html",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const jsonLd = `<script type="application/ld+json">${JSON.stringify(personJsonLd())}</script>`;
        html = html.replace("</head>", `  ${jsonLd}\n  </head>`);
        if (!isBuild) return html;
        const csp = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(html)}" />`;
        // The policy must come before anything it governs.
        return html.replace(/<meta charset="UTF-8" \/>/i, (m) => `${m}\n    ${csp}`);
      },
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}</loc>
    <lastmod>${lastCommitDate()}</lastmod>
  </url>
</urlset>
`,
      });
    },
  };
}
