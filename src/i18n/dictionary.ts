import type { Locale } from "./config";

export const dictionaries = {
  pt_BR: {
    common: () => import("@/locales/pt_BR/common.json").then((mod) => mod.default),
    login: () => import("@/locales/pt_BR/login.json").then((mod) => mod.default),

  },
  en_US: {
    common: () => import("@/locales/en_US/common.json").then((mod) => mod.default),
    login: () => import("@/locales/en_US/login.json").then((mod) => mod.default), 
  },
} as const;

export const getDictionary = async (locale: Locale, namespace: keyof typeof dictionaries[Locale]) => {
  const defaultDictionary = await dictionaries[locale]?.[namespace]?.() ?? dictionaries[i18n.defaultLocale][namespace]();
  return defaultDictionary;
};



export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
