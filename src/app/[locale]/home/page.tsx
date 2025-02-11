"use client";

import { useContext } from "react";
import { DictionaryContext } from "@/i18n/DictionaryProvider";

export default function LocalePageExample() {
  const { dictionary, locale } = useContext(DictionaryContext)!;

  return (
    <div>
      <h1>{dictionary?.greeting}</h1>
      <h1>{dictionary?.footer?.contact}</h1>
      <p>Idioma atual: {locale}</p>

    </div>
  );
}