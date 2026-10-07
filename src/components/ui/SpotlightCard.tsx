import { useRef, type HTMLAttributes, type PointerEvent } from "react";

/**
 * A card with a soft light that follows the pointer, plus a glowing border.
 * Purely decorative; it never changes layout or content.
 */
export function SpotlightCard({ className = "", children, onPointerMove, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--y", `${e.clientY - rect.top}px`);
    }
    onPointerMove?.(e);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={`group/spot relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-[border-color,transform,box-shadow] duration-300 hover:border-line-strong ${className}`}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), var(--glow), transparent 45%)",
        }}
      />
      {children}
    </div>
  );
}
