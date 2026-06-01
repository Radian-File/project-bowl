"use client";

import { Badge, Card, SectionLabel } from "@projectbowl/ui";
import { WandSparkles } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { aiFeatures } from "@/lib/portfolio-data";

export function AiFeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="ai" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-3xl">
        <SectionLabel>{t.ai.label}</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">{t.ai.title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-400">{t.ai.body}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {t.ai.features.map((feature, index) => (
          <Card key={feature.title} className="p-6" hover>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                <WandSparkles className="h-5 w-5" />
              </div>
              <Badge tone="cyan">{aiFeatures[index]?.endpoint ?? "AI"}</Badge>
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{feature.copy}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
