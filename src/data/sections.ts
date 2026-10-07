/** Page sections in scroll order. Keys match `t.nav`. */
export const SECTIONS = ["home", "about", "skills", "projects", "journey", "github", "contact"] as const;

export type SectionId = (typeof SECTIONS)[number];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", id === "home" ? location.pathname : `#${id}`);
}
