import type { SVGProps } from "react";
import type { SocialKey } from "../../data/profile";
import { GitHubIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "./BrandIcons";

export const socialIcons: Record<SocialKey, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};
