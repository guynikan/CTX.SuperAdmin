"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getDictionary, Dictionary, dictionaries } from "./dictionary";
import { i18n, Locale } from "./config";
import { usePathname } from "next/navigation";

interface DictionaryContextProps {
  dictionary: Dictionary | null;
  locale: Locale;
}

export const DictionaryContext = createContext<DictionaryContextProps | undefined>(undefined);

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) throw new Error("useDictionary deve ser usado dentro de um DictionaryProvider");
  return context;
}

export function DictionaryProvider({
  children,
  namespace = "common", 
}: {
  children: React.ReactNode;
  namespace?: keyof typeof dictionaries[Locale];
}) {
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] as Locale) || i18n.defaultLocale;

  const [dictionary, setDictionary] = useState<Dictionary>();

  useEffect(() => {
    async function loadDictionary() {
      try {
        const dict = await getDictionary(locale, namespace);
        setDictionary(dict);
      } catch (error) {
        console.error(`Erro ao carregar o dicionário (${namespace}): ${error}`);
        setDictionary({});
      }
    }

    loadDictionary();
  }, [locale, namespace]);

  if (!dictionary) return <p>Carregando traduções...</p>;

  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}
