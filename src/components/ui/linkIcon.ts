import { ArrowUpRight, Globe } from "lucide-react";
import type { ProjectLink } from "../../data/projects";
import { GitHubIcon } from "./BrandIcons";

export function linkIcon(kind: ProjectLink["kind"]) {
  if (kind === "repo") return GitHubIcon;
  if (kind === "live") return ArrowUpRight;
  return Globe;
}
