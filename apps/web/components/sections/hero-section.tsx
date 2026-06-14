"use client";

import { PortfolioSectionLabel, portfolioButtonClasses } from "@/components/portfolio-ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/language-provider";
import { profile, stats } from "@/lib/portfolio-data";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-16 lg:pt-24">
      <PortfolioSectionLabel>{t.hero.availability}</PortfolioSectionLabel>

      <h1 className="font-editorial text-5xl font-bold leading-[0.95] tracking-tight text-ink-text md:text-7xl lg:text-[5.5rem]">
        {t.hero.title}
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-muted md:text-xl">{t.hero.intro}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="#projects" className={portfolioButtonClasses({ size: "lg" })}>
          {t.hero.projects} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="#projectbowl" className={portfolioButtonClasses({ variant: "secondary", size: "lg" })}>
          {t.hero.projectbowl}
        </Link>
        <Link href="/cv" className={portfolioButtonClasses({ variant: "ghost", size: "lg" })}>
          {t.hero.cv} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <dl className="mt-16 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink-border bg-ink-border sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={stat.label} className="bg-ink-surface px-6 py-7">
            <dt className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">{t.hero.stats[index] ?? stat.label}</dt>
            <dd className="mt-2 font-editorial text-4xl font-bold text-ink-text">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
        <span>{profile.role}</span>
        <span className="text-ink-accent">/</span>
        <span>{profile.location}</span>
      </div>
    </section>
  );
}
