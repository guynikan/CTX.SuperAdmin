import { useEffect, useState } from "react";
import { i18n, Locale } from "@/i18n/config";

type Dictionary = Record<string, string>;


export default function useTranslation(namespace = "common") {
  const [locale, setLocale] = useState<Locale>(i18n.defaultLocale);
  const [dictionary, setDictionary] = useState<Dictionary>({});

  useEffect(() => {
    async function loadDictionary() {
      try {
        let dict;
        try {
          dict = await import(`../locales/${locale}/${namespace}.json`);
        } catch (error) {
          console.warn(`⚠️ Tradução não encontrada para ${locale}, usando fallback.`);
          dict = await import(`../locales/${i18n.defaultLocale}/${namespace}.json`);
        }

        setDictionary(dict.default);
      } catch (error) {
        console.error(`Erro ao carregar traduções: ${error}`);
        setDictionary({});
      }
    }

    loadDictionary();
  }, [locale, namespace]);

  function getTranslation(key: string, dict: Dictionary): string {
    const keys = key.split(".");
    let value: any = dict;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  const t = async (key: string) => {
    const translation = getTranslation(key, dictionary);
    if (translation !== key) return translation; 

    if (locale !== i18n.defaultLocale) {

      return getTranslation(key, await import(`../locales/${i18n.defaultLocale}/${namespace}.json`));
    }

    return key;
  }

  return { t, locale, dictionary };
}
