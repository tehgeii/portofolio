import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";
import { scrollToSection } from "../data/sections";

const PREFIX = "#project/";

/** Reads `#project/<slug>` from the URL, ignoring unknown slugs. */
function projectFromHash(hash = window.location.hash): string | null {
  if (!hash.startsWith(PREFIX)) return null;
  const slug = decodeURIComponent(hash.slice(PREFIX.length));
  return projects.some((p) => p.slug === slug) ? slug : null;
}

/** Marks history entries this hook pushed, so closing can simply go back. */
const STATE_KEY = "portfolioProject";

function pushedByUs() {
  return (window.history.state as Record<string, unknown> | null)?.[STATE_KEY] === true;
}

/**
 * Keeps the open project in the URL (`…/#project/tgo`) so a single project can
 * be shared, and so the phone's Back button closes the modal instead of
 * leaving the site.
 */
export function useProjectRoute() {
  const [slug, setSlug] = useState<string | null>(() => projectFromHash());
  // history.back() is asynchronous; never queue a second one meanwhile.
  const goingBack = useRef(false);

  useEffect(() => {
    const onPop = () => {
      goingBack.current = false;
      setSlug(projectFromHash());
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const open = useCallback((next: string) => {
    const url = `${PREFIX}${encodeURIComponent(next)}`;
    if (projectFromHash()) {
      // Browsing between projects replaces the entry: Back still closes.
      window.history.replaceState(window.history.state, "", url);
    } else {
      window.history.pushState({ [STATE_KEY]: true }, "", url);
    }
    setSlug(next);
  }, []);

  const close = useCallback(() => {
    if (goingBack.current) return;
    if (!projectFromHash()) {
      setSlug(null);
      return;
    }
    if (pushedByUs()) {
      // popstate will clear the slug.
      goingBack.current = true;
      window.history.back();
      return;
    }
    // Opened straight from a shared link: land on the project list.
    setSlug(null);
    requestAnimationFrame(() => scrollToSection("projects"));
  }, []);

  return { slug, open, close };
}
