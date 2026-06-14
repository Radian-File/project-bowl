"use client";

import { PortfolioSectionLabel } from "@/components/portfolio-ui";
import { useLanguage } from "@/components/i18n/language-provider";
import { aiFeatures } from "@/lib/portfolio-data";

export function AiFeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="ai" className="mx-auto w-full max-w-5xl px-6 py-24">
      <div className="mb-12 max-w-3xl">
        <PortfolioSectionLabel index="04">{t.ai.label}</PortfolioSectionLabel>
        <h2 className="font-editorial text-4xl font-bold tracking-tight text-ink-text md:text-6xl">{t.ai.title}</h2>
        <p className="mt-5 text-lg leading-8 text-ink-muted">{t.ai.body}</p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-xl border border-ink-border bg-ink-border md:grid-cols-2">
        {t.ai.features.map((feature, index) => (
          <div key={feature.title} className="bg-ink-surface p-7">
            <p className="font-mono text-xs text-ink-accent">{aiFeatures[index]?.endpoint ?? "AI"}</p>
            <h3 className="mt-4 font-editorial text-xl font-semibold text-ink-text">{feature.title}</h3>
            <p className="mt-3 leading-7 text-ink-muted">{feature.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
