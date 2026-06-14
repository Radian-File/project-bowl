"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import type { Locale } from "@/lib/i18n";

const locales: Locale[] = ["id", "en"];

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex rounded-md border border-ink-border bg-ink-surface p-0.5 font-mono text-xs text-ink-muted">
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`rounded px-2 py-1 transition-colors ${locale === item ? "bg-ink-text text-ink-bg" : "hover:text-ink-text"}`}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
