"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, Edit3, Filter, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { Badge, Card, Input, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { ApiProject, ProjectStatus, ProjectVisibility, deleteProject, listProjects, updateProject } from "@/lib/api";
import { getTechNames, normalizeApiProject } from "@/lib/project-view";

const statuses: (ProjectStatus | "ALL")[] = ["ALL", "IDEA", "PLANNING", "IN_PROGRESS", "SHIPPED", "ARCHIVED"];
const visibilities: (ProjectVisibility | "ALL")[] = ["ALL", "PRIVATE", "PUBLIC", "UNLISTED"];

export default function DashboardProjectsPage() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "ALL">("ALL");
  const [visibility, setVisibility] = useState<ProjectVisibility | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshProjects();
  }, []);

  async function refreshProjects() {
    setIsLoading(true);
    setError(null);
    try {
      setProjects(await listProjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load projects.");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery = !normalizedQuery || [project.title, project.summary, project.slug, ...getTechNames(project)].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "ALL" || project.status === status;
      const matchesVisibility = visibility === "ALL" || project.visibility === visibility;
      return matchesQuery && matchesStatus && matchesVisibility;
    });
  }, [projects, query, status, visibility]);

  async function patchProject(id: string | undefined, payload: { status?: ProjectStatus; visibility?: ProjectVisibility }) {
    if (!id) return;
    setMutatingId(id);
    setError(null);
    try {
      const updated = await updateProject(id, payload);
      setProjects((current) => current.map((project) => (project.id === id ? updated : project)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setMutatingId(null);
    }
  }

  async function handleDelete(project: ApiProject) {
    if (!project.id) return;
    const confirmed = window.confirm(`Delete ${project.title}? This cannot be undone.`);
    if (!confirmed) return;

    setMutatingId(project.id);
    setError(null);
    try {
      await deleteProject(project.id);
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setMutatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Project CMS</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Manage portfolio projects.</h2>
          <p className="mt-3 max-w-2xl text-slate-400">Search, filter, publish, update status, delete, or jump into project management views.</p>
        </div>
        <Link href="/dashboard/projects/new" className={buttonClasses()}><Plus className="h-4 w-4" /> Create project</Link>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input className="pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, slug, summary, stack..." />
          </div>
          <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | "ALL")}>
            {statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
          </select>
          <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={visibility} onChange={(event) => setVisibility(event.target.value as ProjectVisibility | "ALL")}>
            {visibilities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className={buttonClasses({ variant: "secondary" })} type="button" onClick={() => { setQuery(""); setStatus("ALL"); setVisibility("ALL"); }}>
            <Filter className="h-4 w-4" /> Reset
          </button>
        </div>
      </Card>

      {error ? <div className="flex gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100"><AlertCircle className="h-5 w-5 shrink-0" /> {error}</div> : null}
      {isLoading ? <Card className="flex items-center gap-3 p-6 text-slate-300"><Loader2 className="h-5 w-5 animate-spin text-cyan-200" /> Loading projects...</Card> : null}

      {!isLoading && filteredProjects.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="font-display text-2xl font-semibold text-white">No matching projects</p>
          <p className="mt-2 text-slate-500">Adjust filters or create a new project.</p>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {filteredProjects.map((project) => {
          const view = normalizeApiProject(project);
          return (
            <Card key={project.id ?? project.slug} className="overflow-hidden p-0" hover>
              <div className="grid gap-0 xl:grid-cols-[260px_1fr]">
                <div className="relative min-h-52 border-b border-white/10 bg-[#0D111B] p-5 xl:border-b-0 xl:border-r">
                  {view.coverImage?.url ? <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: `url(${view.coverImage.url})` }} /> : null}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.32),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.22),transparent_35%)]" />
                  <div className="relative flex h-full min-h-40 flex-col justify-between rounded-[1.25rem] border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
                    <span className="truncate text-sm text-slate-300">/{project.slug}</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={project.visibility === "PUBLIC" ? "lime" : "purple"}>{project.visibility ?? "PRIVATE"}</Badge>
                      {project.isFeatured ? <Badge tone="lime">Featured</Badge> : null}
                    </div>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-semibold text-white">{project.title}</h3>
                      <p className="mt-2 max-w-3xl leading-7 text-slate-400">{project.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">{view.tech.map((tech) => <Badge key={tech} tone="slate">{tech}</Badge>)}</div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link href={`/dashboard/projects/${project.id}/edit`} className={buttonClasses({ variant: "secondary", size: "sm" })}><Edit3 className="h-4 w-4" /> Edit</Link>
                      <Link href={`/dashboard/projects/${project.id}/workspace`} className={buttonClasses({ variant: "outline", size: "sm" })}><ArrowUpRight className="h-4 w-4" /> Manage</Link>
                      <button type="button" onClick={() => handleDelete(project)} disabled={mutatingId === project.id} className={buttonClasses({ variant: "ghost", size: "sm", className: "text-rose-200 hover:text-rose-100" })}><Trash2 className="h-4 w-4" /> Delete</button>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</span>
                      <select disabled={mutatingId === project.id} className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={(project.status as ProjectStatus | undefined) ?? "IDEA"} onChange={(event) => patchProject(project.id, { status: event.target.value as ProjectStatus })}>
                        {statuses.filter((item) => item !== "ALL").map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Visibility</span>
                      <select disabled={mutatingId === project.id} className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={(project.visibility as ProjectVisibility | undefined) ?? "PRIVATE"} onChange={(event) => patchProject(project.id, { visibility: event.target.value as ProjectVisibility })}>
                        {visibilities.filter((item) => item !== "ALL").map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-400">
                      Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
