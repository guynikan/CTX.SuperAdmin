// DictionaryProvider.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { getDictionary, Dictionary, dictionaries } from "./dictionary";
import { i18n, Locale, Module } from "./config";
import { usePathname } from "next/navigation";

type DictionaryMap = Partial<Record<Module, Dictionary>>;

interface DictionaryContextProps {
  dictionary: DictionaryMap;
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
  namespaces = ["common"],
}: {
  children: React.ReactNode;
  namespaces?: Module[];
}) {
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] as Locale) || i18n.defaultLocale;

  const [dictionary, setDictionary] = useState<DictionaryMap>({});

  useEffect(() => {
    async function loadDictionaries() {
      try {
        const entries = await Promise.all(
          namespaces.map(async (ns) => [ns, await getDictionary(locale, ns)] as const)
        );

        const dict = Object.fromEntries(entries);
        setDictionary(dict);
      } catch (error) {
        console.error(`Erro ao carregar dicionários:`, error);
        setDictionary({});
      }
    }

    loadDictionaries();
  }, [locale, namespaces.join(",")]);

  if (Object.keys(dictionary).length === 0) {
    return <p>Carregando traduções...</p>;
  }

  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}
