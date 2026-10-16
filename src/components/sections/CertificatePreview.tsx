import { motion, useIsPresent } from "motion/react";
import { ShieldCheck, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Certificate } from "../../data/certificates";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useLanguage } from "../../i18n/language";

/** Full-screen view of an award's watermarked certificate preview. */
export function CertificatePreview({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const { t, l } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isPresent = useIsPresent();
  const titleId = `certificate-${cert.id}-title`;

  useScrollLock(true);
  useFocusTrap(panelRef, isPresent, closeRef);

  useEffect(() => {
    if (!isPresent) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPresent, onClose]);

  if (!cert.preview) return null;
  const { src, width, height } = cert.preview;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="relative flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="leading-snug font-semibold text-balance">
              {l(cert.name)}
            </h2>
            <p className="mt-0.5 text-sm text-muted">{cert.issuer}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.a11y.close}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-surface-2 p-3 sm:p-4">
          <img
            src={src}
            width={width}
            height={height}
            alt={`${t.certificates.viewCertificate}: ${l(cert.name)}`}
            draggable={false}
            className="mx-auto block h-auto max-h-[72dvh] w-auto max-w-full rounded-lg shadow-card select-none"
          />
        </div>

        <p className="flex items-start gap-2 border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden />
          {t.certificates.previewNote}
        </p>
      </motion.div>
    </div>
  );
}
