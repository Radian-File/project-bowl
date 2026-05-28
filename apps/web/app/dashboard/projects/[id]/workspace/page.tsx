"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Activity, AlertCircle, ArrowLeft, CheckCircle2, Circle, Clock3, Flag, Loader2, Plus, Search } from "lucide-react";
import { Badge, Button, Card, Input, SectionLabel, Textarea, buttonClasses } from "@projectbowl/ui";
import { ApiActivityLog, ApiMilestone, ApiProject, ApiTask, createProjectTask, getProjectById, listProjectActivity, listProjectMilestones, listProjectTasks } from "@/lib/api";

const taskStatuses = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];

export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ApiProject | null>(null);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [milestones, setMilestones] = useState<ApiMilestone[]>([]);
  const [activity, setActivity] = useState<ApiActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endpointNotice, setEndpointNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    Promise.allSettled([
      getProjectById(params.id),
      listProjectTasks(params.id),
      listProjectMilestones(params.id),
      listProjectActivity(params.id),
    ])
      .then(([projectResult, taskResult, milestoneResult, activityResult]) => {
        if (!active) return;
        if (projectResult.status === "fulfilled") setProject(projectResult.value);
        else setError(projectResult.reason instanceof Error ? projectResult.reason.message : "Could not load project.");

        const missing: string[] = [];
        if (taskResult.status === "fulfilled") setTasks(taskResult.value);
        else missing.push("tasks");
        if (milestoneResult.status === "fulfilled") setMilestones(milestoneResult.value);
        else missing.push("milestones");
        if (activityResult.status === "fulfilled") setActivity(activityResult.value);
        else missing.push("activity logs");
        setEndpointNotice(missing.length > 0 ? `Backend endpoints pending: ${missing.join(", ")}. Showing graceful placeholders.` : null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  const displayedTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesQuery = !normalized || [task.title, task.description].join(" ").toLowerCase().includes(normalized);
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, tasks]);

  const completion = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter((task) => task.status === "DONE" || task.status === "COMPLETED").length / tasks.length) * 100);
  }, [tasks]);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newTaskTitle.trim().length < 3) return;
    setIsCreatingTask(true);
    setError(null);
    try {
      const task = await createProjectTask(params.id, { title: newTaskTitle.trim(), description: newTaskDescription.trim(), status: "TODO" });
      setTasks((current) => [task, ...current]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Task create endpoint is not ready yet.");
    } finally {
      setIsCreatingTask(false);
    }
  }

  const fallbackMilestones: ApiMilestone[] = milestones.length > 0 ? milestones : [
    { id: "placeholder-1", title: "Discovery & scope", status: "DONE", progress: 100 },
    { id: "placeholder-2", title: "Build dashboard MVP", status: "IN_PROGRESS", progress: 65 },
    { id: "placeholder-3", title: "Publish portfolio API", status: "PLANNING", progress: 20 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/projects" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
        <SectionLabel>Project workspace</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">{project?.title ?? "Project management"}</h2>
        <p className="mt-3 max-w-2xl text-slate-400">Tasks, milestones, status tracking, progress, and activity logs for Phase 11 frontend.</p>
      </div>

      {isLoading ? <Card className="flex items-center gap-3 p-6 text-slate-300"><Loader2 className="h-5 w-5 animate-spin text-cyan-200" /> Loading workspace...</Card> : null}
      {error ? <Notice tone="rose" message={error} /> : null}
      {endpointNotice ? <Notice tone="amber" message={endpointNotice} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Project status</p>
          <div className="mt-3 flex items-center justify-between gap-3"><p className="font-display text-2xl font-semibold text-white">{project?.status?.replaceAll("_", " ") ?? "—"}</p><Flag className="h-5 w-5 text-cyan-200" /></div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Task completion</p>
          <div className="mt-3 flex items-center justify-between gap-3"><p className="font-display text-2xl font-semibold text-white">{completion}%</p><CheckCircle2 className="h-5 w-5 text-lime-200" /></div>
          <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${completion}%` }} /></div>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Visibility</p>
          <div className="mt-3 flex items-center justify-between gap-3"><p className="font-display text-2xl font-semibold text-white">{project?.visibility ?? "—"}</p><Badge tone={project?.visibility === "PUBLIC" ? "lime" : "purple"}>{project?.visibility ?? "Private"}</Badge></div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.72fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">Tasks</h3>
                <p className="text-sm text-slate-500">Search and filter project tasks. Create attempts flexible nested/global endpoints.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_170px]">
                <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input className="pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" /></div>
                <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="ALL">All statuses</option>
                  {taskStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="mb-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:grid-cols-[1fr_1fr_auto]">
              <Input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="New task title" />
              <Input value={newTaskDescription} onChange={(event) => setNewTaskDescription(event.target.value)} placeholder="Short description" />
              <Button type="submit" disabled={isCreatingTask || newTaskTitle.trim().length < 3}>{isCreatingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add</Button>
            </form>

            {displayedTasks.length === 0 ? (
              <EmptyState title="No tasks yet" copy="Tasks will appear here when /tasks or nested project task endpoints are available." />
            ) : (
              <div className="space-y-3">
                {displayedTasks.map((task) => <TaskRow key={task.id} task={task} />)}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-2xl font-semibold text-white">Milestones & progress</h3>
            <div className="mt-5 space-y-4">
              {fallbackMilestones.map((milestone) => (
                <div key={milestone.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-white">{milestone.title}</p><p className="text-xs text-slate-500">{milestone.status ?? "PLANNING"}</p></div><Badge tone={(milestone.progress ?? 0) >= 100 ? "lime" : "purple"}>{milestone.progress ?? 0}%</Badge></div>
                  <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${milestone.progress ?? 0}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3"><Activity className="h-5 w-5 text-cyan-200" /><h3 className="font-display text-2xl font-semibold text-white">Activity logs</h3></div>
            {activity.length === 0 ? <EmptyState title="No activity recorded" copy="Activity log display is ready for /activity-logs or nested project endpoints." /> : (
              <div className="space-y-3">
                {activity.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                    <p>{item.message ?? item.action ?? item.type ?? "Project activity"}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.actorName ? `${item.actorName} · ` : ""}{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now"}</p>
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

function TaskRow({ task }: { task: ApiTask }) {
  const done = task.status === "DONE" || task.status === "COMPLETED";
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-start md:justify-between">
      <div className="flex gap-3">
        {done ? <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-lime-300" /> : <Circle className="mt-1 h-5 w-5 shrink-0 text-slate-500" />}
        <div><p className="font-semibold text-white">{task.title}</p>{task.description ? <p className="mt-1 text-sm text-slate-400">{task.description}</p> : null}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2"><Badge tone={done ? "lime" : "purple"}>{task.status ?? "TODO"}</Badge>{task.dueDate ? <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" /> {new Date(task.dueDate).toLocaleDateString()}</span> : null}</div>
    </div>
  );
}

function Notice({ tone, message }: { tone: "amber" | "rose"; message: string }) {
  const classes = tone === "amber" ? "border-amber-300/20 bg-amber-300/10 text-amber-100" : "border-rose-300/20 bg-rose-300/10 text-rose-100";
  return <div className={`flex gap-2 rounded-2xl border p-4 text-sm ${classes}`}><AlertCircle className="h-5 w-5 shrink-0" /> {message}</div>;
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center"><p className="font-display text-lg font-semibold text-white">{title}</p><p className="mt-2 text-sm text-slate-500">{copy}</p></div>;
}
