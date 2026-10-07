import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { SECTIONS } from "./data/sections";
import { useActiveSection } from "./hooks/useActiveSection";

export default function App() {
  const active = useActiveSection(SECTIONS);
  const [, setPaletteOpen] = useState(false);

  return (
    <>
      <Navbar active={active} onOpenPalette={() => setPaletteOpen(true)} />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
