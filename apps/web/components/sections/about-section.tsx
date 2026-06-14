"use client";

import { PortfolioBadge, PortfolioSectionLabel } from "@/components/portfolio-ui";
import { useLanguage } from "@/components/i18n/language-provider";
import { profile } from "@/lib/portfolio-data";

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="mx-auto w-full max-w-5xl px-6 py-24">
      <div className="max-w-2xl">
        <PortfolioSectionLabel index="01">{t.about.label}</PortfolioSectionLabel>
        <h2 className="font-editorial text-4xl font-bold tracking-tight text-ink-text md:text-6xl">{t.about.title}</h2>
        <p className="mt-5 text-lg leading-8 text-ink-muted">{t.about.intro}</p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-ink-border bg-ink-border lg:grid-cols-3">
        <div className="bg-ink-surface p-8 lg:col-span-2">
          <PortfolioBadge tone="accent">{t.about.badge}</PortfolioBadge>
          <h3 className="mt-6 font-editorial text-2xl font-semibold text-ink-text md:text-3xl">{t.about.headline}</h3>
          <p className="mt-4 leading-8 text-ink-muted">{t.about.body}</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
            <span>{profile.location}</span>
            <span className="text-ink-accent">/</span>
            <span>{t.about.spotify}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-ink-surface p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">{t.about.currentWork}</p>
          <div className="mt-6">
            <h3 className="font-editorial text-xl font-semibold text-ink-text">{t.about.currentTitle}</h3>
            <p className="mt-3 font-mono text-sm text-ink-muted">Next.js · Supabase · Claude</p>
          </div>
        </div>

        {t.about.tiles.map((tile) => (
          <div key={tile.title} className="bg-ink-surface p-8">
            <h3 className="font-editorial text-lg font-semibold text-ink-text">{tile.title}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-muted">{tile.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
