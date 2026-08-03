"use client";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "./i18n";

export default function LanguageSwitcher({ locale = "tr" }: { locale?: Locale }) {
  const pathname = usePathname();
  const choose = (next: Locale) => {
    document.cookie = `USER_LOCALE=${next}; Path=/; Max-Age=31536000; Secure; SameSite=Lax`;
    const parts = pathname.split("/");
    if (locales.includes(parts[1] as Locale)) parts[1] = next;
    else parts.splice(1, 0, next);
    location.assign(parts.join("/") || `/${next}`);
  };
  return <label className="language-switcher"><span className="sr-only">Dil</span><select value={locale} onChange={(event) => choose(event.target.value as Locale)} aria-label="Dil seçin">{locales.map((item) => <option key={item} value={item}>{localeNames[item]}</option>)}</select></label>;
}
