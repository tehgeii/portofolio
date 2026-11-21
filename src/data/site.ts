/**
 * Who the site belongs to and where to find them. Plain data with no imports,
 * so both the website (via profile.ts) and the build (search-engine data in
 * vite.config.ts) read the same values.
 */

export type SocialKey = "github" | "linkedin" | "instagram" | "youtube";

export interface SocialLink {
  key: SocialKey;
  label: string;
  handle: string;
  url: string;
}

export const site = {
  name: "Dafi Hauzan Atsillah Hoenarko",
  username: "tehgeii",
  email: "antsters9@gmail.com",
  url: "https://tehgeii.github.io/portofolio/",
  /** TGO's official website. */
  website: "https://tgopremium.my.id",
  jobTitle: "Informatics Student & Developer",
  campus: { name: "Universitas Dian Nuswantoro", url: "https://dinus.ac.id" },
  region: "Jawa Tengah",
  knowsAbout: [
    "Web Development",
    "Android Development",
    "Windows Desktop Apps",
    "React",
    "TypeScript",
    "Kotlin",
    "C#",
    "Python",
    "Data Mining",
    "Machine Learning",
  ],
  socials: [
    { key: "github", label: "GitHub", handle: "@tehgeii", url: "https://github.com/tehgeii" },
    { key: "linkedin", label: "LinkedIn", handle: "in/dafi-hauzan", url: "https://www.linkedin.com/in/dafi-hauzan" },
    {
      key: "instagram",
      label: "Instagram",
      handle: "@kokohpasarsenen",
      url: "https://www.instagram.com/kokohpasarsenen",
    },
    {
      key: "youtube",
      label: "YouTube",
      handle: "@techgameplayindonesia",
      url: "https://www.youtube.com/@techgameplayindonesia",
    },
  ] satisfies SocialLink[],
} as const;
