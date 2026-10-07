import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastContext, type ToastVariant } from "./toast";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const ICONS = {
  success: <CheckCircle2 className="size-4 text-emerald-500" aria-hidden />,
  error: <XCircle className="size-4 text-rose-500" aria-hidden />,
  info: <Info className="size-4 text-accent" aria-hidden />,
};

const DURATION = 2800;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = nextId.current++;
    // Keep at most 3 on screen so they never pile up.
    setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), DURATION);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              role="status"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium shadow-card"
            >
              {ICONS[t.variant]}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
