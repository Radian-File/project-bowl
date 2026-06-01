"use client";

import { Badge, Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
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
    <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <SectionLabel>{t.projects.label}</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">{t.projects.title}</h2>
          {error ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
              <AlertCircle className="h-3.5 w-3.5" /> {t.projects.api}: {error}
            </div>
          ) : null}
        </div>
        <Link href="#contact" className={buttonClasses({ variant: "outline" })}>
          {t.projects.all} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center text-slate-400">{t.projects.empty}</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group block">
              <Card className="h-full overflow-hidden p-0" hover>
                <div className="relative h-52 border-b border-white/10 bg-[#0D111B] p-5">
                  {project.coverImage?.url ? (
                    <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: `url(${project.coverImage.url})` }} />
                  ) : null}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.28),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.22),transparent_35%)]" />
                  <div className="relative flex h-full flex-col justify-between rounded-[1.25rem] border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
                    <span className="text-sm text-slate-300">{project.url}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="h-16 rounded-2xl border border-white/10 bg-white/[0.06]" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl font-semibold text-white">{project.title}</h3>
                    <Badge tone={project.badge === "Flagship" ? "lime" : "purple"}>{project.badge}</Badge>
                  </div>
                  <p className="mt-3 leading-7 text-slate-400">{project.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} tone="slate">{tech}</Badge>
                    ))}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition group-hover:text-cyan-100">
                    {t.projects.view} <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
