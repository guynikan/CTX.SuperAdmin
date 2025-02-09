import { useEffect, useState } from 'react';

type Translations = { [key: string]: string };

export default function useTranslation(namespace = 'common') {
  
  const [translations, setTranslations] = useState<Translations>({});
  const [locale, setLocale] = useState('pt'); 

  useEffect(() => {
 
    if (typeof window !== 'undefined') {
      const pathLocale = window.location.pathname.split('/')[1];
      setLocale(pathLocale || 'en');
    }
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

  const t = (key: string)  => {
    const value = key.split('.').reduce((acc: any, part: string) => {
      return acc && acc[part] !== undefined ? acc[part] : null;
    }, translations);
    return value ?? key;
  }
  return { t, locale, translations };
}
