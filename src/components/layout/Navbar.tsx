import { AnimatePresence, motion } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "../../data/profile";
import { SECTIONS, scrollToSection, type SectionId } from "../../data/sections";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useLanguage } from "../../i18n/language";
import { socialIcons } from "../ui/socialIcons";
import { isMac } from "../../lib/platform";
import { Kbd } from "../ui/Kbd";
import { LanguageToggle } from "../ui/LanguageToggle";
import { ThemeToggle } from "../ui/ThemeToggle";
import { button } from "../ui/styles";

interface NavbarProps {
  active: SectionId;
  onOpenPalette: () => void;
}

const NAV_ITEMS = SECTIONS.filter((id) => id !== "home");

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center rounded-xl bg-fg font-mono text-sm font-bold text-bg shadow-card">
        D
        <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-bg bg-gradient-accent" />
      </span>
      <span className="font-mono text-[15px] font-semibold tracking-tight">
        dafi<span className="text-gradient">.dev</span>
      </span>
    </span>
  );
}

export function Navbar({ active, onOpenPalette }: NavbarProps) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Let the mobile sheet start closing before scrolling.
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open ? "border-b border-line glass" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#home" onClick={go("home")} aria-label={`${profile.shortName}, ${t.nav.home}`} className="rounded-xl">
          <Logo />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((id) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-line bg-surface-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.nav[id]}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden h-9 items-center gap-2 rounded-full border border-line bg-surface/60 pr-1.5 pl-3 text-sm text-subtle transition-colors hover:border-line-strong hover:text-fg sm:flex"
          >
            <Search className="size-3.5" aria-hidden />
            <span className="pr-4">{t.nav.search}</span>
            <span className="flex gap-0.5">
              <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenPalette}
            className={`${button("ghost", "icon")} sm:hidden`}
            aria-label={t.nav.search}
          >
            <Search className="size-[18px]" aria-hidden />
          </button>
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`${button("ghost", "icon")} lg:hidden`}
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-y-auto border-t border-line bg-bg lg:hidden"
          >
            <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 pt-6 pb-10 sm:px-8">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={go(id)}
                      aria-current={active === id ? "true" : undefined}
                      className={`flex items-center justify-between border-b border-line py-4 text-2xl font-semibold tracking-tight transition-colors ${
                        active === id ? "text-fg" : "text-muted hover:text-fg"
                      }`}
                    >
                      {t.nav[id]}
                      <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-between gap-4">
                <LanguageToggle layoutId="lang-pill-mobile" />
                <div className="flex gap-1">
                  {profile.socials.map((s) => {
                    const Icon = socialIcons[s.key];
                    return (
                      <a
                        key={s.key}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${s.label} ${t.a11y.opensNewTab}`}
                        className={button("ghost", "icon")}
                      >
                        <Icon className="size-[18px]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
