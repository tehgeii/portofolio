import { Globe, Mail, MapPin, Phone, Printer, type LucideIcon } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState, type ReactNode } from "react";
import { GitHubIcon, LinkedInIcon } from "../components/ui/BrandIcons";
import { certificates } from "../data/certificates";
import { cv, type CvEntry } from "../data/cv";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { skillCategories } from "../data/skills";
import type { Lang, Localized } from "../types";
import { cvCopy } from "./copy";

/** Visible "fill me in" marker. `npm run cv:pdf` counts these. */
function Todo({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span className="cv-todo" data-cv-todo>
      {label}: {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-[3.4mm] break-inside-avoid">
      <h2 className="mb-[1.6mm] flex items-center gap-3 text-[10px] font-bold tracking-[0.1em] text-accent uppercase">
        {title}
        <span className="h-px flex-1 bg-line-strong" aria-hidden />
      </h2>
      {children}
    </section>
  );
}

/** Date column on the left, content on the right. */
function Row({ aside, children }: { aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid break-inside-avoid grid-cols-[21mm_1fr] gap-x-[4mm] [&+&]:mt-[2mm]">
      <div className="pt-px font-mono text-[9.5px] leading-[1.55] text-subtle">{aside}</div>
      <div>{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-[0.6mm] space-y-[0.3mm]">
      {items.map((item) => (
        <li key={item} className="relative pl-[3.5mm]">
          <span className="absolute top-[0.62em] left-0 size-[3px] rounded-full bg-accent" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

function monthYear(date: string, lang: Lang) {
  const [y, m] = date.split("-").map(Number);
  if (!m) return String(y);
  return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", { month: "short", year: "numeric" }).format(
    new Date(y, m - 1),
  );
}

const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Same rules as the yellow markers rendered below. */
function countTodos() {
  return (
    cv.education.filter((e) => e.end === null).length +
    cv.education.filter((e) => e.gpa === null).length +
    cv.languages.filter((language) => language.level === null).length +
    (certificates.length === 0 ? 1 : 0) +
    (cv.organizations.length === 0 ? 1 : 0)
  );
}

function readParams(): { lang: Lang; photo: boolean } {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang") === "en" ? "en" : "id";
  // Indonesian CVs usually include a photo; international ones usually don't.
  const photoParam = params.get("photo");
  const photo = photoParam === null ? lang === "id" : photoParam === "1";
  return { lang, photo };
}

export function CvPage() {
  const [{ lang, photo }, setOptions] = useState(readParams);
  const [qrSvg, setQrSvg] = useState("");
  const c = cvCopy[lang];
  const todoCount = countTodos();
  const l = <T,>(value: Record<Lang, T>) => value[lang];

  useEffect(() => {
    const params = new URLSearchParams({ lang, photo: photo ? "1" : "0" });
    window.history.replaceState(null, "", `?${params}`);
    document.documentElement.lang = lang;
    document.title = `CV · ${profile.name}`;
  }, [lang, photo]);

  useEffect(() => {
    QRCode.toString(profile.siteUrl, { type: "svg", margin: 0, color: { dark: "#18181b", light: "#0000" } })
      .then(setQrSvg)
      .catch(() => setQrSvg(""));
  }, []);

  const contacts: { icon: LucideIcon | typeof GitHubIcon; text: string; href?: string }[] = [
    { icon: Mail, text: profile.email, href: `mailto:${profile.email}` },
    ...(cv.phone ? [{ icon: Phone, text: cv.phone, href: `tel:${cv.phone.replace(/[^\d+]/g, "")}` }] : []),
    { icon: Globe, text: stripProtocol(profile.siteUrl), href: profile.siteUrl },
    { icon: GitHubIcon, text: `github.com/${profile.username}`, href: `https://github.com/${profile.username}` },
    ...profile.socials
      .filter((s) => s.key === "linkedin")
      .map((s) => ({ icon: LinkedInIcon, text: stripProtocol(s.url), href: s.url })),
    { icon: MapPin, text: l(profile.location) },
  ];

  const cvProjects = cv.projectSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is (typeof projects)[number] => !!p);

  const renderEntry = (entry: CvEntry) => (
    <Row key={entry.org + l(entry.role)} aside={l(entry.period)}>
      <p className="font-semibold text-fg">
        {l(entry.role)} <span className="font-normal text-muted">· {entry.org}</span>
      </p>
      <Bullets items={l(entry.bullets)} />
    </Row>
  );

  return (
    <div className="min-h-screen bg-zinc-200 py-10 print:bg-white print:p-0">
      {/* Toolbar (screen only) */}
      <div className="mx-auto mb-6 flex w-[210mm] max-w-full flex-wrap items-center justify-between gap-3 px-2 font-sans text-sm print:hidden">
        <div className="flex items-center gap-2">
          {(["id", "en"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setOptions((o) => ({ ...o, lang: option }))}
              aria-pressed={lang === option}
              className={`rounded-full px-3 py-1.5 font-mono text-xs font-semibold uppercase ${
                lang === option ? "bg-zinc-900 text-white" : "bg-white text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {option}
            </button>
          ))}
          <label className="ml-2 flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
            <input
              type="checkbox"
              checked={photo}
              onChange={(e) => setOptions((o) => ({ ...o, photo: e.target.checked }))}
              className="accent-violet-600"
            />
            {c.toolbar.photo}
          </label>
        </div>
        <div className="flex items-center gap-3">
          {todoCount > 0 && (
            <span
              className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800"
              title={c.toolbar.hint}
            >
              {c.toolbar.todos(todoCount)}
            </span>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700"
          >
            <Printer className="size-3.5" aria-hidden />
            {c.toolbar.print}
          </button>
        </div>
      </div>

      {/* A4 sheet */}
      <article className="relative mx-auto flex min-h-[297mm] w-[210mm] flex-col overflow-hidden bg-white px-[14mm] pt-[12mm] pb-[9mm] text-[10.8px] leading-[1.45] text-zinc-700 shadow-2xl print:shadow-none">
        <div className="absolute inset-x-0 top-0 h-[2.2mm] bg-gradient-accent" aria-hidden />

        {/* Header */}
        <header className="flex items-start justify-between gap-[6mm]">
          <div className="min-w-0 flex-1">
            <h1 className="text-[25px] leading-[1.1] font-extrabold tracking-tight text-zinc-900">{profile.name}</h1>
            <p className="mt-[1.2mm] text-[12.5px] font-semibold text-accent">{l(cv.headline)}</p>
            <ul className="mt-[2.4mm] flex flex-wrap gap-x-[4mm] gap-y-[0.8mm] text-[10px] text-muted">
              {contacts.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-center gap-[1.5mm]">
                  <Icon className="size-[11px] shrink-0 text-accent" aria-hidden />
                  {href ? (
                    <a href={href} className="text-inherit no-underline">
                      {text}
                    </a>
                  ) : (
                    text
                  )}
                </li>
              ))}
            </ul>
          </div>
          {photo && (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="size-[26mm] shrink-0 rounded-[3mm] object-cover object-top ring-1 ring-black/10"
            />
          )}
        </header>

        <Section title={c.summary}>
          <p className="text-pretty">{l(cv.summary)}</p>
        </Section>

        <Section title={c.education}>
          {cv.education.map((edu) => (
            <Row
              key={edu.school}
              aside={
                <>
                  {edu.start} – {edu.end ?? <Todo label={c.todo.label}>{c.todo.graduation}</Todo>}
                </>
              }
            >
              <p className="font-semibold text-fg">
                {l(edu.degree)}{" "}
                <span className="font-normal text-muted">
                  · {edu.school}, {edu.location}
                </span>
              </p>
              {edu.gpa !== "" && (
                <p>
                  {c.gpa}: {edu.gpa ?? <Todo label={c.todo.label}>{c.todo.gpa}</Todo>}
                </p>
              )}
              <p>
                <span className="text-muted">{c.courses}:</span> {l(edu.courses).join(", ")}
              </p>
            </Row>
          ))}
        </Section>

        <Section title={c.experience}>{cv.experience.map(renderEntry)}</Section>

        <Section title={c.projects}>
          {cvProjects.map((project) => (
            <Row key={project.slug} aside={project.year}>
              <p className="font-semibold text-fg">
                {project.title} <span className="font-normal text-muted">· {project.tech.slice(0, 4).join(", ")}</span>
              </p>
              <p className="text-pretty">{l(project.summary)}</p>
              {project.role && (
                <p className="text-muted">
                  {lang === "id" ? "Peran" : "Role"}: {l(project.role)}
                </p>
              )}
            </Row>
          ))}
        </Section>

        <Section title={c.skills}>
          <dl className="space-y-[0.4mm]">
            {skillCategories.map((category) => (
              <div key={category.key} className="grid grid-cols-[21mm_1fr] gap-x-[4mm]">
                <dt className="font-semibold text-fg">{c.skillGroups[category.key]}</dt>
                <dd>{category.skills.map((s) => s.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={c.certificates}>
          {certificates.length === 0 ? (
            <Todo label={c.todo.label}>{c.todo.certificates}</Todo>
          ) : (
            <ul className="grid grid-cols-2 gap-x-[6mm] gap-y-[1mm]">
              {certificates.map((cert) => (
                <li key={cert.name} className="break-inside-avoid">
                  <span className="font-semibold text-fg">{cert.name}</span>
                  <span className="block text-[10px] text-muted">
                    {cert.issuer} · {monthYear(cert.date, lang)}
                    {(cert.credentialId || cert.credentialUrl) && (
                      <> · {cert.credentialId ?? stripProtocol(cert.credentialUrl ?? "")}</>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={c.organizations}>
          {cv.organizations.length === 0 ? (
            <Todo label={c.todo.label}>{c.todo.organizations}</Todo>
          ) : (
            cv.organizations.map(renderEntry)
          )}
        </Section>

        <Section title={c.languages}>
          <p>
            {cv.languages.map((language, i) => (
              <span key={l(language.name)}>
                {i > 0 && <span className="mx-2 text-subtle">·</span>}
                <span className="font-semibold text-fg">{l(language.name)}</span> (
                {language.level ? l(language.level as Localized) : <Todo label={c.todo.label}>{c.todo.english}</Todo>})
              </span>
            ))}
          </p>
        </Section>

        {/* Footer with QR code to the live portfolio */}
        <footer className="mt-auto flex items-center justify-between gap-6 border-t border-line pt-[2.4mm]">
          <p className="text-[10px] text-subtle">
            {c.qr}
            <br />
            <a href={profile.siteUrl} className="font-semibold text-accent no-underline">
              {stripProtocol(profile.siteUrl)}
            </a>
          </p>
          {qrSvg && <div className="size-[13mm] shrink-0" aria-hidden dangerouslySetInnerHTML={{ __html: qrSvg }} />}
        </footer>
      </article>
    </div>
  );
}
