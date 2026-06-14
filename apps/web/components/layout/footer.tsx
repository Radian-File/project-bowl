"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { profile } from "@/lib/portfolio-data";
import Link from "next/link";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mx-auto w-full max-w-5xl border-t border-ink-border px-6 py-10">
      <div className="flex flex-col gap-6 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint md:flex-row md:items-center md:justify-between">
        <p>© 2026 {profile.name}</p>
        <div className="flex flex-wrap items-center gap-5">
          {profile.socials.map((social) => (
            <Link key={social.label} href={social.href} className="transition-colors hover:text-ink-text">
              {social.label}
            </Link>
          ))}
          <span className="text-ink-border">/</span>
          <span className="normal-case tracking-normal">{t.footer}</span>
        </div>
      </div>
    </footer>
  );
}
