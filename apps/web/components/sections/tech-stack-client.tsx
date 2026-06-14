"use client";

import { PortfolioSectionLabel } from "@/components/portfolio-ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { useLanguage } from "@/components/i18n/language-provider";

type DisplayStackGroup = {
  title: string;
  items: string[];
};

export function TechStackClient({ groups }: { groups: DisplayStackGroup[] }) {
  const { t } = useLanguage();

  return (
    <section id="stack" className="mx-auto w-full max-w-5xl px-6 py-24">
      <Reveal className="mb-12 max-w-2xl">
        <PortfolioSectionLabel index="05">{t.stack.label}</PortfolioSectionLabel>
        <h2 className="font-editorial text-4xl font-bold tracking-tight text-ink-text md:text-6xl">{t.stack.title}</h2>
      </Reveal>

      <Stagger className="grid gap-px overflow-hidden rounded-xl border border-ink-border bg-ink-border md:grid-cols-2">
        {groups.map((group) => (
          <StaggerItem key={group.title} className="bg-ink-surface p-7">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">{group.title}</h3>
            <ul className="mt-5 flex flex-col gap-px">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-1.5 text-ink-text transition-colors hover:text-ink-accent"
                >
                  <span className="h-1 w-1 rounded-full bg-ink-borderStrong" />
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
