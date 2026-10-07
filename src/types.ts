export type Lang = "id" | "en";

/** A piece of text available in every supported language. */
export type Localized = Record<Lang, string>;

/** A list of texts available in every supported language. */
export type LocalizedList = Record<Lang, string[]>;
