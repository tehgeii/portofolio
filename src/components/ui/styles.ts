/** Shared class recipes so buttons & chips look identical everywhere. */

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";

const variants = {
  primary:
    "bg-fg text-bg shadow-card hover:shadow-[0_8px_30px_-6px_var(--glow)] hover:-translate-y-0.5 hover:opacity-90",
  gradient:
    "bg-gradient-accent text-white shadow-[0_8px_30px_-8px_var(--glow)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_var(--glow)] dark:text-zinc-950",
  secondary: "border border-line-strong bg-surface/60 text-fg backdrop-blur hover:-translate-y-0.5 hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface-2 hover:text-fg",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "size-10",
} as const;

export function button(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-3 py-1 text-xs font-medium text-muted";
