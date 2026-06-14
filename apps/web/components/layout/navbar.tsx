"use client";

import { portfolioButtonClasses } from "@/components/portfolio-ui";
import { CommandPalette } from "@/components/command/command-palette";
import Link from "next/link";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useLanguage } from "@/components/i18n/language-provider";

export function Navbar() {
  const { t } = useLanguage();
  const navItems = [
    { href: "/#about", label: t.nav.about },
    { href: "/#projects", label: t.nav.projects },
    { href: "/#projectbowl", label: t.nav.projectbowl },
    { href: "/#stack", label: t.nav.stack },
    { href: "/#contact", label: t.nav.contact },
  ];

  const openPalette = () => window.dispatchEvent(new Event("open-command-palette"));

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b border-ink-border bg-ink-bg/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="font-mono text-sm font-semibold tracking-tight text-ink-text">
            ricky.dev
          </Link>
          <div className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-ink-text">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-md border border-ink-border px-2.5 py-1.5 font-mono text-xs text-ink-faint transition-colors hover:border-ink-borderStrong hover:text-ink-muted sm:flex"
            >
              <span>Search</span>
              <kbd className="rounded border border-ink-border px-1 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            <LanguageToggle />
            <Link href="/#contact" className={portfolioButtonClasses({ variant: "secondary", size: "sm" })}>
              {t.nav.cta}
            </Link>
          </div>
        </nav>
      </header>
      <div className="h-16" aria-hidden="true" />
      <CommandPalette />
    </>
  );
}
