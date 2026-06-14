"use client";

import { PortfolioBadge, PortfolioSectionLabel } from "@/components/portfolio-ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/language-provider";
import type { Project } from "@/lib/portfolio-data";

type FeaturedProjectsClientProps = {
  projects: Array<Project & { id?: string; visibility?: string; isFeatured?: boolean }>;
  error: string | null;
};

export function FeaturedProjectsClient({ projects, error }: FeaturedProjectsClientProps) {
  const { t } = useLanguage();

  return (
    <section id="projects" className="mx-auto w-full max-w-5xl px-6 py-24">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-2xl">
          <PortfolioSectionLabel index="02">{t.projects.label}</PortfolioSectionLabel>
          <h2 className="font-editorial text-4xl font-bold tracking-tight text-ink-text md:text-6xl">{t.projects.title}</h2>
          {error ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-ink-border bg-ink-surface px-3 py-1 font-mono text-xs text-ink-muted">
              <AlertCircle className="h-3.5 w-3.5" /> {t.projects.api}: {error}
            </div>
          ) : null}
        </Reveal>
        <Link href="#contact" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink-text">
          {t.projects.all} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-ink-border bg-ink-surface p-8 text-center text-ink-muted">{t.projects.empty}</div>
      ) : (
        <Stagger className="border-t border-ink-border">
          {projects.map((project, index) => (
            <StaggerItem key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-3 border-b border-ink-border py-8 transition-colors hover:bg-ink-surface/40 md:gap-x-8 md:py-10"
              >
                <span className="font-mono text-sm text-ink-faint transition-colors group-hover:text-ink-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-editorial text-2xl font-semibold text-ink-text transition-colors group-hover:text-ink-text md:text-3xl">
                      {project.title}
                    </h3>
                    <PortfolioBadge tone={project.badge === "Flagship" ? "accent" : "default"}>{project.badge}</PortfolioBadge>
                  </div>
                  <p className="mt-2 max-w-xl leading-7 text-ink-muted">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint">
                    <span>{project.tech.join(" · ")}</span>
                    <span className="text-ink-border">|</span>
                    <span>{project.status}</span>
                    <span className="text-ink-border">|</span>
                    <span>{project.year}</span>
                  </div>
                </div>

                <ArrowUpRight className="hidden h-6 w-6 translate-y-1 text-ink-faint transition-all group-hover:-translate-y-0 group-hover:text-ink-text md:block" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </section>
  );
}
