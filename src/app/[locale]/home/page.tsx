"use client";

import useTranslation from '@/hooks/useTranslation';

export default function LocalePageExample() {
  const { t } = useTranslation('commom');

  return (
    <div>
      <h1>{t('greeting')}</h1>
      <h1>{t('header.title')}</h1>
      <h2>{t('header.subtitle')}</h2>
      <p>{t('footer.copyright')}</p>

    </div>
  );
}