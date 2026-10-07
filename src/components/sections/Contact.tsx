import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail, Send } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useToast } from "../../context/toast";
import { profile } from "../../data/profile";
import { useCopyEmail } from "../../hooks/useCopyEmail";
import { useLanguage } from "../../i18n/language";
import { socialIcons } from "../ui/socialIcons";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SpotlightCard } from "../ui/SpotlightCard";
import { button } from "../ui/styles";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Contact() {
  const { t } = useLanguage();
  const { copy, copied } = useCopyEmail();

  return (
    <Section id="contact" eyebrow={t.contact.eyebrow} title={t.contact.title} subtitle={t.contact.subtitle}>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-5">
          {/* Email */}
          <Reveal>
            <SpotlightCard className="p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="bg-gradient-accent grid size-11 place-items-center rounded-xl text-white dark:text-zinc-950">
                  <Mail className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-muted">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="block truncate text-lg font-semibold transition-colors hover:text-accent"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <a href={`mailto:${profile.email}`} className={button("primary", "md")}>
                  <Send className="size-4" aria-hidden />
                  {t.contact.emailMe}
                </a>
                <button type="button" onClick={copy} className={button("secondary", "md")}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "done" : "copy"}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex"
                    >
                      {copied ? (
                        <Check className="size-4 text-emerald-500" aria-hidden />
                      ) : (
                        <Copy className="size-4" aria-hidden />
                      )}
                    </motion.span>
                  </AnimatePresence>
                  {t.contact.copy}
                </button>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Socials */}
          <Reveal delay={0.08}>
            <h3 className="mb-3 font-mono text-sm text-subtle">// {t.contact.findMe}</h3>
            <ul className="grid grid-cols-2 gap-3">
              {profile.socials.map((s) => {
                const Icon = socialIcons[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-line-strong"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 transition-colors group-hover:text-accent">
                        <Icon className="size-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{s.label}</span>
                        <span className="block truncate text-xs text-muted">{s.handle}</span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                        aria-hidden
                      />
                      <span className="sr-only">{t.a11y.opensNewTab}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}

function ContactForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const uid = useId();
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});

  const validate = (v: Record<Field, string>): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = t.contact.form.errors.name;
    if (!EMAIL_RE.test(v.email.trim())) e.email = t.contact.form.errors.email;
    if (v.message.trim().length < 10) e.message = t.contact.form.errors.message;
    return e;
  };

  const update = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    // Clear an error as soon as the field becomes valid.
    if (errors[field] && !validate(next)[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[]).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }

    const subject = t.contact.form.subject(values.name.trim());
    const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast(t.contact.form.opening, "info");
  };

  const fields: { key: Field; label: string; placeholder: string; type?: string; autoComplete: string }[] = [
    { key: "name", label: t.contact.form.name, placeholder: t.contact.form.namePh, autoComplete: "name" },
    { key: "email", label: t.contact.form.email, placeholder: t.contact.form.emailPh, type: "email", autoComplete: "email" },
  ];

  const inputClass = (invalid: boolean) =>
    `w-full rounded-xl border bg-surface-2/50 px-4 py-3 text-[15px] text-fg transition-[border-color,box-shadow] outline-none placeholder:text-subtle focus:bg-surface focus:shadow-[0_0_0_4px_var(--glow)] ${
      invalid ? "border-rose-500/70 focus:border-rose-500" : "border-line focus:border-accent"
    }`;

  return (
    <SpotlightCard className="h-full p-6 sm:p-8">
      <h3 className="text-xl font-semibold">{t.contact.form.title}</h3>
      <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={`${uid}-${f.key}`} className="mb-2 block text-sm font-medium">
                {f.label}
              </label>
              <input
                id={`${uid}-${f.key}`}
                name={f.key}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                value={values[f.key]}
                onChange={update(f.key)}
                aria-invalid={!!errors[f.key]}
                aria-describedby={errors[f.key] ? `${uid}-${f.key}-error` : undefined}
                className={inputClass(!!errors[f.key])}
              />
              <FieldError id={`${uid}-${f.key}-error`} message={errors[f.key]} />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor={`${uid}-message`} className="mb-2 block text-sm font-medium">
            {t.contact.form.message}
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={6}
            placeholder={t.contact.form.messagePh}
            value={values.message}
            onChange={update("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${uid}-message-error` : undefined}
            className={`${inputClass(!!errors.message)} resize-y`}
          />
          <FieldError id={`${uid}-message-error`} message={errors.message} />
        </div>

        <button type="submit" className={`${button("gradient", "lg")} group w-full`}>
          {t.contact.form.submit}
          <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </button>
        <p className="text-center text-xs text-subtle">{t.contact.form.note}</p>
      </form>
    </SpotlightCard>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden pt-1.5 text-sm text-rose-500"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
