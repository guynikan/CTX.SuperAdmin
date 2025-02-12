export const i18n = {
  defaultLocale: "pt_BR",
  locales: ["pt_BR", "en_US"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
