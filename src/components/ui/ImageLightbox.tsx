import { motion, useIsPresent } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useLanguage } from "../../i18n/language";

export interface LightboxImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: ReactNode;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number;
  onIndexChange?: (index: number) => void;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Shown under the image, e.g. a privacy note. */
  footer?: ReactNode;
}

/**
 * Full-screen image viewer used for project screenshots and certificate
 * previews. Rendered into <body> so it sits above any other overlay; render
 * it inside <AnimatePresence> for the closing animation.
 */
export function ImageLightbox({ images, index, onIndexChange, onClose, title, subtitle, footer }: ImageLightboxProps) {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isPresent = useIsPresent();
  const image = images[index];
  const many = images.length > 1 && !!onIndexChange;
  const go = (step: number) => onIndexChange?.((index + step + images.length) % images.length);

  useScrollLock(true);
  useFocusTrap(panelRef, isPresent, closeRef);

  useEffect(() => {
    if (!isPresent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (many && e.key === "ArrowLeft") onIndexChange?.((index - 1 + images.length) % images.length);
      else if (many && e.key === "ArrowRight") onIndexChange?.((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPresent, onClose, many, onIndexChange, index, images.length]);

  if (!image) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="leading-snug font-semibold text-balance">{title}</h2>
            {(subtitle || many) && (
              <p className="mt-0.5 text-sm text-muted">
                {subtitle}
                {subtitle && many && " · "}
                {many && <span className="tabular-nums">{`${index + 1}/${images.length}`}</span>}
              </p>
            )}
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

        <div className="relative min-h-0 flex-1 overflow-auto bg-surface-2 p-3 sm:p-4">
          <img
            key={image.src}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            draggable={false}
            className="mx-auto block h-auto max-h-[72dvh] w-auto max-w-full rounded-lg shadow-card select-none"
          />
          {many && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t.projects.prev}
                className="absolute top-1/2 left-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65 sm:left-4"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t.projects.next}
                className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65 sm:right-4"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </>
          )}
        </div>

        {(image.caption || footer) && (
          <div className="space-y-2 border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
            {image.caption && <p>{image.caption}</p>}
            {footer}
          </div>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}
