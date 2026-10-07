import { motion } from "motion/react";
import {
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  Globe,
  Hash,
  Languages,
  Mail,
  Moon,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type ComponentType, type SVGProps } from "react";
import { useTheme } from "../../context/theme";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import { SECTIONS, scrollToSection } from "../../data/sections";
import { useCopyEmail } from "../../hooks/useCopyEmail";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useLanguage } from "../../i18n/language";
import { translations } from "../../i18n/translations";
import { socialIcons } from "../ui/socialIcons";
import { Kbd } from "../ui/Kbd";

type Group = "navigation" | "projects" | "actions" | "links";

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  keywords?: string;
  run: () => void;
}

interface CommandPaletteProps {
  onClose: () => void;
  onOpenProject: (slug: string) => void;
}

const GROUP_ORDER: Group[] = ["navigation", "projects", "actions", "links"];

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function CommandPalette({ onClose, onOpenProject }: CommandPaletteProps) {
  const { t, l, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { copy } = useCopyEmail();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();

  useScrollLock(true);
  useFocusTrap(panelRef, true, inputRef);

  const commands = useMemo<Command[]>(
    () => [
      ...SECTIONS.map((id) => ({
        id: `nav-${id}`,
        group: "navigation" as const,
        label: t.nav[id],
        hint: `#${id}`,
        icon: Hash,
        // Match section names in both languages ("kontak" finds Contact).
        keywords: `${id} ${translations.id.nav[id]} ${translations.en.nav[id]}`,
        run: () => scrollToSection(id),
      })),
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        group: "projects" as const,
        label: p.title,
        hint: p.year,
        icon: p.icon,
        keywords: `${p.tech.join(" ")} ${p.category} ${l(p.summary)}`,
        run: () => onOpenProject(p.slug),
      })),
      {
        id: "action-theme",
        group: "actions",
        label: t.palette.actions.theme,
        icon: theme === "dark" ? Sun : Moon,
        keywords: "theme dark light tema gelap terang mode",
        run: () => toggleTheme(),
      },
      {
        id: "action-lang",
        group: "actions",
        label: t.palette.actions.lang,
        icon: Languages,
        keywords: "language bahasa english indonesia",
        run: toggleLang,
      },
      {
        id: "action-copy",
        group: "actions",
        label: t.palette.actions.copyEmail,
        hint: profile.email,
        icon: Copy,
        keywords: "email copy salin",
        run: copy,
      },
      {
        id: "action-mail",
        group: "actions",
        label: t.palette.actions.sendEmail,
        icon: Mail,
        keywords: "email mail kirim contact kontak",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      ...profile.socials.map((s) => ({
        id: `link-${s.key}`,
        group: "links" as const,
        label: s.label,
        hint: s.handle,
        icon: socialIcons[s.key],
        keywords: s.handle,
        run: () => openExternal(s.url),
      })),
      {
        id: "link-website",
        group: "links",
        label: "TGO Website",
        hint: "tgopremium.my.id",
        icon: Globe,
        keywords: "tgo premium website",
        run: () => openExternal(profile.website),
      },
    ],
    [t, l, theme, toggleTheme, toggleLang, copy, onOpenProject],
  );

  const filtered = useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = tokens.length
      ? commands.filter((c) => {
          const haystack = `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""}`.toLowerCase();
          return tokens.every((tok) => haystack.includes(tok));
        })
      : commands;
    // Keep results grouped in a stable order so arrow keys feel natural.
    return GROUP_ORDER.flatMap((g) => matches.filter((c) => c.group === g));
  }, [commands, query]);

  // Reset the highlight whenever the query changes.
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const runCommand = (command: Command | undefined) => {
    if (!command) return;
    onClose();
    // Let the palette unmount (and restore focus/scroll) before acting.
    window.setTimeout(command.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(Math.max(filtered.length - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const listboxId = `${uid}-listbox`;
  const optionId = (i: number) => `${uid}-option-${i}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.search}
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-[18px] shrink-0 text-subtle" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.palette.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={filtered.length ? optionId(activeIndex) : undefined}
            className="h-14 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-subtle"
            autoComplete="off"
            spellCheck={false}
          />
          <Kbd className="shrink-0">Esc</Kbd>
        </div>

        <ul ref={listRef} id={listboxId} role="listbox" className="max-h-[min(420px,55vh)] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-10 text-center text-sm text-muted">{t.palette.empty}</li>}
          {filtered.map((command, i) => {
            const showHeader = i === 0 || filtered[i - 1].group !== command.group;
            const Icon = command.icon;
            const active = i === activeIndex;
            return (
              <li key={command.id} role="presentation">
                {showHeader && (
                  <p role="presentation" className="px-3 pt-3 pb-1.5 text-[11px] font-semibold tracking-wider text-subtle uppercase">
                    {t.palette.groups[command.group]}
                  </p>
                )}
                <div
                  id={optionId(i)}
                  role="option"
                  aria-selected={active}
                  data-index={i}
                  onMouseMove={() => !active && setActiveIndex(i)}
                  onClick={() => runCommand(command)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-surface-2 text-fg" : "text-muted"
                  }`}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg border transition-colors ${
                      active ? "border-line-strong bg-surface text-accent" : "border-line"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{command.label}</span>
                  {command.hint && <span className="hidden truncate font-mono text-xs text-subtle sm:block">{command.hint}</span>}
                  {command.group === "links" ? (
                    <ArrowUpRight className={`size-4 shrink-0 ${active ? "opacity-100" : "opacity-0"}`} aria-hidden />
                  ) : (
                    <CornerDownLeft className={`size-4 shrink-0 ${active ? "opacity-100" : "opacity-0"}`} aria-hidden />
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-subtle">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            {t.palette.hint.navigate}
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            {t.palette.hint.select}
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Esc</Kbd>
            {t.palette.hint.close}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
