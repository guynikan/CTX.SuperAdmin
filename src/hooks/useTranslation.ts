import { useEffect, useState } from 'react';

type Translations = { [key: string]: string };

export default function useTranslation(namespace = 'common') {
  
  const [translations, setTranslations] = useState<Translations>({});
  const [locale, setLocale] = useState('pt'); 

  useEffect(() => {
      const pathLocale = window.location.pathname.split('/')[1];
      setLocale(pathLocale || 'pt');
  }, []);

  useEffect(() => {
     const loadTranslations = async () => {
      try {
        const dict = await import(`../locales/${locale}/${namespace}.json`);
        setTranslations(dict.default);
      } catch (error) {
        console.error(`Erro ao carregar traduções: ${error}`);
        setTranslations({});
      }
    }

    loadTranslations();
  }, [locale, namespace]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value ? value[k] : null;
    }
    return value || key;
  }

  return { t, locale, translations };
}
