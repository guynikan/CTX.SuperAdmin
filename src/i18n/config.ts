export const i18n = {
  defaultLocale: "pt_BR",
  modules: ['common', 'login'],
  locales: ["pt_BR", "en_US"],
} as const;


export type Locale = (typeof i18n)["locales"][number];

export type Module = (typeof i18n)["modules"][number];

