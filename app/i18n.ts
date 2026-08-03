export const locales = ["tr", "en", "de", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";
export const localeNames: Record<Locale, string> = { tr: "Türkçe", en: "English", de: "Deutsch", ar: "العربية" };
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
