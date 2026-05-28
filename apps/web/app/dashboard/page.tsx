"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, AlertCircle, ArrowUpRight, Bot, FolderKanban, Globe2, Loader2, Lock, Plus, Rocket } from "lucide-react";
import { Badge, Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { ApiActivityLog, ApiProject, listActivity, listProjects } from "@/lib/api";
import { normalizeApiProject } from "@/lib/project-view";

export default function DashboardOverviewPage() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [activity, setActivity] = useState<ApiActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([listProjects(), listActivity()])
      .then(([projectResult, activityResult]) => {
        if (!active) return;
        if (projectResult.status === "fulfilled") setProjects(projectResult.value);
        else setError(projectResult.reason instanceof Error ? projectResult.reason.message : "Could not load projects.");
        if (activityResult.status === "fulfilled") setActivity(activityResult.value);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const published = projects.filter((project) => project.visibility === "PUBLIC").length;
    const privateCount = projects.filter((project) => project.visibility !== "PUBLIC").length;
    const shipped = projects.filter((project) => project.status === "SHIPPED").length;
    return [
      { label: "Total projects", value: projects.length, icon: FolderKanban, tone: "text-cyan-200" },
      { label: "Public", value: published, icon: Globe2, tone: "text-lime-200" },
      { label: "Private / unlisted", value: privateCount, icon: Lock, tone: "text-purple-200" },
      { label: "Shipped", value: shipped, icon: Rocket, tone: "text-amber-200" },
    ];
  }, [projects]);

  const recentProjects = projects.slice(0, 4).map(normalizeApiProject);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Wave 2 control center</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Portfolio operations dashboard.</h2>
          <p className="mt-3 max-w-2xl text-slate-400">Manage public/private projects, AI writing workflows, tasks, milestones, and activity logs from one responsive cockpit.</p>
        </div>
        <Link href="/dashboard/projects/new" className={buttonClasses()}>
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      {error ? <Notice message={error} /> : null}
      {isLoading ? <LoadingCard label="Loading dashboard data..." /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-2 font-display text-4xl font-bold text-white">{metric.value}</p>
                </div>
                <div className={`rounded-2xl border border-white/10 bg-white/[0.06] p-3 ${metric.tone}`}><Icon className="h-5 w-5" /></div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">Recent projects</h3>
              <p className="text-sm text-slate-500">Latest API records with public fallback states handled elsewhere.</p>
            </div>
            <Link href="/dashboard/projects" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">View all</Link>
          </div>
          {recentProjects.length === 0 && !isLoading ? (
            <EmptyState title="No projects found" copy="Create your first ProjectBowl record or wait for the backend projects endpoint." />
          ) : (
            <div className="grid gap-3">
              {recentProjects.map((project) => (
                <Link key={project.id ?? project.slug} href={project.id ? `/dashboard/projects/${project.id}/edit` : "/dashboard/projects"} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.07]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-display text-lg font-semibold text-white">{project.title}</h4>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-400">{project.summary}</p>
                    </div>
                    <Badge tone={project.visibility === "PUBLIC" ? "lime" : "purple"}>{project.status}</Badge>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 group-hover:text-cyan-100">Edit project <ArrowUpRight className="h-3.5 w-3.5" /></div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-3 text-purple-200"><Bot className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">AI Studio</h3>
                <p className="text-sm text-slate-500">Generate descriptions, READMEs, case studies, and rewrites.</p>
              </div>
            </div>
            <Link href="/dashboard/ai" className={buttonClasses({ variant: "secondary", className: "mt-5 w-full" })}>Open AI Studio</Link>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <Activity className="h-5 w-5 text-cyan-200" />
              <h3 className="font-display text-2xl font-semibold text-white">Activity log</h3>
            </div>
            {activity.length === 0 ? (
              <EmptyState title="No activity yet" copy="Activity logs will appear when the backend Phase 11 endpoints are available." />
            ) : (
              <div className="space-y-3">
                {activity.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                    <p>{item.message ?? item.action ?? item.type ?? "Project activity"}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now"}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Notice({ message }: { message: string }) {
  return <div className="flex gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100"><AlertCircle className="h-5 w-5 shrink-0" /> {message}</div>;
}

function LoadingCard({ label }: { label: string }) {
  return <Card className="flex items-center gap-3 p-6 text-slate-300"><Loader2 className="h-5 w-5 animate-spin text-cyan-200" /> {label}</Card>;
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center"><p className="font-display text-lg font-semibold text-white">{title}</p><p className="mt-2 text-sm text-slate-500">{copy}</p></div>;
}
