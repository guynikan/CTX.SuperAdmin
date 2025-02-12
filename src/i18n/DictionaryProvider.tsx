"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getDictionary, Dictionary } from "./dictionary";
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

export function DictionaryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const locale = (pathname.split("/")[1] as Locale) || i18n.defaultLocale; 

  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    getDictionary(locale, "common").then(setDictionary);
  }, [locale]);

  if (!dictionary) return <p>Carregando traduções...</p>;

  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}
