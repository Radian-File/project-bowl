"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import type { Locale } from "@/lib/i18n";

const locales: Locale[] = ["id", "en"];

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.06] p-1 text-xs font-semibold text-slate-400">
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`rounded-full px-2.5 py-1 transition ${locale === item ? "bg-cyan-300/15 text-cyan-100" : "hover:text-white"}`}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
