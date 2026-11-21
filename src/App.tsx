import { AnimatePresence } from "motion/react";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { BackToTop } from "./components/layout/BackToTop";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { About } from "./components/sections/About";
import { Certificates } from "./components/sections/Certificates";
import { Contact } from "./components/sections/Contact";
import { GitHubActivity } from "./components/sections/GitHubActivity";
import { Hero } from "./components/sections/Hero";
import { Journey } from "./components/sections/Journey";
import { Projects } from "./components/sections/Projects";
import { Skills } from "./components/sections/Skills";
import { TechMarquee } from "./components/sections/TechMarquee";
import { YouTube } from "./components/sections/YouTube";
import { projects } from "./data/projects";
import { SECTIONS, type SectionId } from "./data/sections";
import { useActiveSection } from "./hooks/useActiveSection";
import { useProjectRoute } from "./hooks/useProjectRoute";
import { integrations } from "./config/integrations";
import { useLanguage } from "./i18n/language";
import { countPageview } from "./lib/goatcounter";

// Overlays load on demand, so the first visit downloads less JavaScript.
const loadProjectModal = () => import("./components/sections/ProjectModal");
const loadCommandPalette = () => import("./components/layout/CommandPalette");
const ProjectModal = lazy(() => loadProjectModal().then((m) => ({ default: m.ProjectModal })));
const CommandPalette = lazy(() => loadCommandPalette().then((m) => ({ default: m.CommandPalette })));

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

export default function App() {
  const { t } = useLanguage();
  const active = useActiveSection(SECTIONS);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { slug: projectSlug, open: showProject, close: closeProject } = useProjectRoute();

  const openProject = projects.find((p) => p.slug === projectSlug) ?? null;
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  // One privacy-friendly page view per visit, when visitor stats are switched on.
  useEffect(() => {
    if (integrations.goatcounterCode) countPageview(integrations.goatcounterCode);
  }, []);

  // Fetch the overlays once the page is idle, so opening one feels instant.
  useEffect(() => {
    const prefetch = () => {
      loadProjectModal().catch(() => {});
      loadCommandPalette().catch(() => {});
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(prefetch, 2000);
    return () => window.clearTimeout(id);
  }, []);

  // Sections are rendered by JavaScript, so the browser can't jump to
  // `…/#contact` on its own when the page first loads. Do it ourselves.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!SECTIONS.includes(id as SectionId) || id === "home") return;
    const jump = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
    requestAnimationFrame(jump);
    // Re-align once web fonts have settled the layout.
    document.fonts?.ready.then(jump).catch(() => {});
  }, []);

  // Global shortcuts: Ctrl/⌘ + K toggles the palette, "/" opens it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (projectSlug) closeProject();
        setPaletteOpen((open) => !open);
      } else if (e.key === "/" && !isTypingTarget(e.target) && !paletteOpen && !projectSlug) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, projectSlug, closeProject]);

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[90] -translate-y-20 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg transition-transform focus:translate-y-0"
      >
        {t.a11y.skip}
      </a>

      <ScrollProgress />
      <Navbar active={active} onOpenPalette={() => setPaletteOpen(true)} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects onOpen={showProject} />
        <Journey />
        <Certificates />
        <YouTube />
        <GitHubActivity />
        <Contact />
      </main>

      <Footer />
      <BackToTop />

      <AnimatePresence>
        {openProject && (
          <Suspense key="project-modal" fallback={null}>
            <ProjectModal project={openProject} onClose={closeProject} onNavigate={showProject} />
          </Suspense>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {paletteOpen && (
          <Suspense key="palette" fallback={null}>
            <CommandPalette onClose={closePalette} onOpenProject={showProject} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
