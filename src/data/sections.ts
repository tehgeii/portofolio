import { youtube } from "./youtube";

/** Every possible page section in scroll order. Keys match `t.nav`. */
const ALL_SECTIONS = [
  "home",
  "about",
  "skills",
  "projects",
  "journey",
  "certificates",
  "youtube",
  "github",
  "contact",
] as const;

export type SectionId = (typeof ALL_SECTIONS)[number];

/** The sections on this build of the page: YouTube only when its data was fetched. */
export const SECTIONS: readonly SectionId[] = ALL_SECTIONS.filter((id) => id !== "youtube" || youtube !== null);

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", id === "home" ? location.pathname : `#${id}`);
}
