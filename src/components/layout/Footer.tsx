import { Heart } from "lucide-react";
import { profile } from "../../data/profile";
import { SECTIONS, scrollToSection } from "../../data/sections";
import { useLanguage } from "../../i18n/language";
import { socialIcons } from "../ui/socialIcons";
import { isMac } from "../../lib/platform";
import { Kbd } from "../ui/Kbd";
import { Logo } from "./Navbar";

export function Footer() {
  const { t, l } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{l(profile.tagline)}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-xs font-semibold tracking-[0.15em] text-subtle uppercase">{t.footer.navigation}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {SECTIONS.filter((id) => id !== "home").map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    className="text-muted transition-colors hover:text-fg"
                  >
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs font-semibold tracking-[0.15em] text-subtle uppercase">
              {t.contact.findMe}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-fg"
                    >
                      <Icon className="size-4" />
                      {s.label}
                      <span className="sr-only">{t.a11y.opensNewTab}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>{t.footer.builtBy}</span>
            <Heart className="size-3.5 fill-rose-500 text-rose-500" aria-hidden />
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {profile.name}
            </a>
            <span className="text-subtle">(@{profile.username})</span>
          </p>
          <p className="hidden items-center gap-1.5 text-xs text-subtle sm:flex">
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
            <span>{t.footer.palette}</span>
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-1 text-xs text-subtle md:flex-row md:justify-between">
          <p>
            © {year} {profile.name}. {t.footer.rights}
          </p>
          <p>{t.footer.stack}</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] text-center text-[26vw] leading-none font-extrabold tracking-tighter text-transparent select-none [background-clip:text] [-webkit-background-clip:text] bg-gradient-to-b from-line-strong to-transparent md:text-[20vw]"
      >
        DAFI
      </p>
    </footer>
  );
}
