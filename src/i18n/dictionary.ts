import { i18n } from "./config";
import type { Locale } from "./config";

export const dictionaries = {
  pt_BR: {
    common: () => import("@/locales/pt_BR/common.json").then((mod) => mod.default),
    auth: () => import("@/locales/pt_BR/auth.json").then((mod) => mod.default),
    segments: () => import("@/locales/pt_BR/segments.json").then((mod) => mod.default),
  },
  en_US: {
    common: () => import("@/locales/en_US/common.json").then((mod) => mod.default),
    auth: () => import("@/locales/en_US/auth.json").then((mod) => mod.default),
    segments: () => import("@/locales/en_US/segments.json").then((mod) => mod.default),
  },
} as const;

export const getDictionary = async (locale: Locale, namespace: keyof typeof dictionaries[Locale]) => {
  const defaultDictionary = await dictionaries[locale]?.[namespace]?.() ?? dictionaries[i18n.defaultLocale][namespace]();
  return defaultDictionary;
};


export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
