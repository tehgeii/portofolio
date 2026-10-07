import avatar from "../assets/avatar.jpg";
import type { Localized, LocalizedList } from "../types";

/**
 * Everything personal about the site owner lives here.
 * Edit this file to update name, bio, links and contact details.
 */

export type SocialKey = "github" | "linkedin" | "instagram" | "youtube";

export interface SocialLink {
  key: SocialKey;
  label: string;
  handle: string;
  url: string;
}

export const profile = {
  name: "Dafi Hauzan Atsillah Hoenarko",
  shortName: "Dafi",
  username: "tehgeii",
  email: "antsters9@gmail.com",
  /** Profile photo, cropped to face & chest. Replace src/assets/avatar.jpg to change it. */
  avatar,
  website: "https://tgopremium.my.id",
  siteUrl: "https://tehgeii.github.io/portofolio/",

  location: { id: "Jawa Tengah, Indonesia", en: "Central Java, Indonesia" } satisfies Localized,
  campus: "Universitas Dian Nuswantoro",
  campusShort: "UDINUS",
  major: { id: "S1 Teknik Informatika", en: "B.Sc. Informatics Engineering" } satisfies Localized,

  roles: {
    id: ["Mahasiswa Informatika", "Web Developer", "Android Developer", "Kreator TGO"],
    en: ["Informatics Student", "Web Developer", "Android Developer", "Creator of TGO"],
  } satisfies LocalizedList,

  tagline: {
    id: "Saya membangun aplikasi yang benar-benar dipakai: dari tool optimasi Windows untuk para gamer, aplikasi Android untuk teman kuliah, sampai web data mining berbasis machine learning.",
    en: "I build software people actually use: from a Windows optimization tool for gamers and an Android app for fellow students, to a machine-learning powered data mining web app.",
  } satisfies Localized,

  about: {
    id: [
      "Halo! Saya Dafi, mahasiswa S1 Teknik Informatika di Universitas Dian Nuswantoro (UDINUS). Saya senang mengubah masalah sehari-hari menjadi aplikasi yang rapi, cepat, dan nyaman dipakai.",
      "Perjalanan saya dimulai dari dunia PC & gaming. Rasa penasaran tentang cara kerja Windows melahirkan TGO (Tech Gameplay Optimizer), tool open-source untuk membuat PC lebih responsif. Dari situ saya merambah ke web, Android, sampai data mining & machine learning.",
      "Saat ini saya fokus memperdalam pengembangan web modern dan aplikasi Android, sambil terus berbagi lewat kanal YouTube Tech Gameplay Indonesia.",
    ],
    en: [
      "Hi! I'm Dafi, an Informatics Engineering undergraduate at Universitas Dian Nuswantoro (UDINUS). I love turning everyday problems into apps that are clean, fast, and pleasant to use.",
      "My journey started in the world of PCs & gaming. Curiosity about how Windows works led me to build TGO (Tech Gameplay Optimizer), an open-source tool that makes PCs feel snappier. From there I expanded into web, Android, and data mining & machine learning.",
      "Right now I'm focused on deepening my skills in modern web and Android development, while sharing what I learn on my YouTube channel, Tech Gameplay Indonesia.",
    ],
  } satisfies LocalizedList,

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
