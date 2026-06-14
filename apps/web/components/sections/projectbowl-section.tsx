"use client";

import { PortfolioBadge, PortfolioSectionLabel, portfolioButtonClasses } from "@/components/portfolio-ui";
import { Reveal } from "@/components/motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/language-provider";

export function ProjectBowlSection() {
  const { t } = useLanguage();

  return (
    <section id="projectbowl" className="mx-auto w-full max-w-5xl px-6 py-24">
      <Reveal className="overflow-hidden rounded-xl border border-ink-border bg-ink-surface">
        <div className="grid gap-px bg-ink-border lg:grid-cols-2">
          <div className="bg-ink-surface p-8 md:p-10">
            <PortfolioSectionLabel index="03">{t.projectbowl.label}</PortfolioSectionLabel>
            <h2 className="font-editorial text-4xl font-bold tracking-tight text-ink-text md:text-5xl">{t.projectbowl.title}</h2>
            <p className="mt-5 text-lg leading-8 text-ink-muted">{t.projectbowl.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className={portfolioButtonClasses()}>
                {t.projectbowl.open} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#ai" className={portfolioButtonClasses({ variant: "secondary" })}>
                <Play className="h-4 w-4" /> {t.projectbowl.demo}
              </Link>
            </div>
          </div>

          <div className="bg-ink-surface p-8 md:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">{t.projectbowl.progress}</p>
            <ul className="mt-6 flex flex-col">
              {t.projectbowl.benefits.map((benefit, index) => (
                <li key={benefit} className="flex items-baseline gap-4 border-t border-ink-border py-4 first:border-t-0">
                  <span className="font-mono text-xs text-ink-accent">{String(index + 1).padStart(2, "0")}</span>
                  <span className="leading-7 text-ink-text">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-3 rounded-md border border-ink-border bg-ink-bg p-4">
              <PortfolioBadge tone="accent">AI</PortfolioBadge>
              <span className="text-sm leading-6 text-ink-muted">{t.projectbowl.suggestion}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
