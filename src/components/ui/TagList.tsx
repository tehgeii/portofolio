import { tag } from "./styles";

interface TagListProps {
  tags: readonly string[];
  size?: "sm" | "md";
  /** Show at most this many, followed by a "+N" tag. */
  max?: number;
  label?: string;
  className?: string;
}

/** A wrapping row of technology / skill tags, styled the same everywhere. */
export function TagList({ tags, size = "sm", max, label, className = "" }: TagListProps) {
  if (tags.length === 0) return null;
  const shown = max ? tags.slice(0, max) : tags;
  const hidden = tags.length - shown.length;
  return (
    <ul className={`flex flex-wrap ${size === "md" ? "gap-2" : "gap-1.5"} ${className}`} aria-label={label}>
      {shown.map((t) => (
        <li key={t} className={tag(size)}>
          {t}
        </li>
      ))}
      {hidden > 0 && <li className={`${tag(size)} text-subtle`}>+{hidden}</li>}
    </ul>
  );
}
