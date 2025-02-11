import { i18n, Locale } from "./config";

export function getPreferredLocale(headers?: Headers): Locale {
  if (!headers) return i18n.defaultLocale;

  const acceptLanguage = headers.get("accept-language") || "";
  const languages = acceptLanguage
    .split(",")
    .map(lang => lang.split(";")[0].replace("-", "_")); // Transforma 'pt-BR' em 'pt_BR'

  for (const lang of languages) {
    if (i18n.locales.includes(lang as Locale)) {
      return lang as Locale;
    }
  }

  return i18n.defaultLocale;
}
