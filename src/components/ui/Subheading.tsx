import type { ReactNode } from "react";

/** Small code-comment style heading ("// Awards") used inside sections. */
export function Subheading({ children, className = "mb-5" }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`font-mono text-sm text-subtle ${className}`}>
      <span aria-hidden>// </span>
      {children}
    </h3>
  );
}
