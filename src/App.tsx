import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { About } from "./components/sections/About";
import { Hero } from "./components/sections/Hero";
import { ProjectModal } from "./components/sections/ProjectModal";
import { Projects } from "./components/sections/Projects";
import { Skills } from "./components/sections/Skills";
import { TechMarquee } from "./components/sections/TechMarquee";
import { projects } from "./data/projects";
import { SECTIONS } from "./data/sections";
import { useActiveSection } from "./hooks/useActiveSection";

export default function App() {
  const active = useActiveSection(SECTIONS);
  const [, setPaletteOpen] = useState(false);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const openProject = projects.find((p) => p.slug === projectSlug) ?? null;
  const closeProject = useCallback(() => setProjectSlug(null), []);

  return (
    <>
      <Navbar active={active} onOpenPalette={() => setPaletteOpen(true)} />
      <main id="main">
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects onOpen={setProjectSlug} />
      </main>

      <AnimatePresence>
        {openProject && (
          <ProjectModal key="project-modal" project={openProject} onClose={closeProject} onNavigate={setProjectSlug} />
        )}
      </AnimatePresence>
    </>
  );
}
