"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ImagePlus, Loader2, Plus, Save, ToggleLeft, WandSparkles } from "lucide-react";
import { Badge, Button, Card, Input, Textarea, buttonClasses } from "@projectbowl/ui";
import {
  ApiProject,
  ApiTechStack,
  ProjectPayload,
  ProjectStatus,
  ProjectVisibility,
  TechStackCategory,
  createProject,
  createTechStack,
  listTechStacks,
  updateProject,
} from "@/lib/api";
import { getCoverImage, getTechIds, getTechNames } from "@/lib/project-view";

const statuses: ProjectStatus[] = ["IDEA", "PLANNING", "IN_PROGRESS", "SHIPPED", "ARCHIVED"];
const visibilities: ProjectVisibility[] = ["PRIVATE", "PUBLIC", "UNLISTED"];
const categories: TechStackCategory[] = ["FRONTEND", "BACKEND", "DATABASE", "AI", "DEVOPS", "DESIGN", "OTHER"];

type FormState = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  isFeatured: boolean;
  repositoryUrl: string;
  liveUrl: string;
  caseStudyUrl: string;
  startedAt: string;
  completedAt: string;
  coverImageUrl: string;
  techStackIds: string[];
  quickTech: string;
};

export function ProjectForm({ mode, initialProject }: { mode: "create" | "edit"; initialProject?: ApiProject }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(initialProject));
  const [techStacks, setTechStacks] = useState<ApiTechStack[]>([]);
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState<TechStackCategory>("FRONTEND");
  const [techError, setTechError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingTech, setIsLoadingTech] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    listTechStacks()
      .then((items) => {
        if (active) setTechStacks(items);
      })
      .catch((err: unknown) => {
        if (active) setTechError(err instanceof Error ? err.message : "Tech stacks endpoint unavailable.");
      })
      .finally(() => {
        if (active) setIsLoadingTech(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedTechNames = useMemo(() => {
    const selected = techStacks.filter((tech) => form.techStackIds.includes(tech.id)).map((tech) => tech.name);
    const quick = form.quickTech.split(",").map((item) => item.trim()).filter(Boolean);
    return [...selected, ...quick];
  }, [form.quickTech, form.techStackIds, techStacks]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTech(id: string) {
    setForm((current) => ({
      ...current,
      techStackIds: current.techStackIds.includes(id) ? current.techStackIds.filter((item) => item !== id) : [...current.techStackIds, id],
    }));
  }

  async function handleCreateTech() {
    setTechError(null);
    if (!newTechName.trim()) {
      setTechError("Enter a tech stack name first.");
      return;
    }

    try {
      const created = await createTechStack({ name: newTechName.trim(), category: newTechCategory });
      setTechStacks((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setForm((current) => ({ ...current, techStackIds: [...current.techStackIds, created.id] }));
      setNewTechName("");
    } catch (err) {
      setTechError(err instanceof Error ? err.message : "Could not create tech stack.");
    }
  }

  function validate() {
    if (form.title.trim().length < 3) return "Title must be at least 3 characters.";
    if (form.summary.trim().length < 10) return "Summary must be at least 10 characters.";
    if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) return "Slug must be lowercase kebab-case.";
    const urls = [form.repositoryUrl, form.liveUrl, form.caseStudyUrl, form.coverImageUrl].filter(Boolean);
    if (urls.some((url) => !/^https?:\/\//.test(url))) return "URLs must start with http:// or https://.";
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = toPayload(form);
      const saved = mode === "create" ? await createProject(payload) : await updateProject(initialProject?.id ?? "", payload);
      setSuccess(mode === "create" ? "Project created. Redirecting to edit screen..." : "Project updated.");
      if (mode === "create" && saved.id) {
        router.push(`/dashboard/projects/${saved.id}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Project save failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_0.45fr]">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Core details</p>
              <h2 className="font-display text-2xl font-semibold text-white">Project identity</h2>
            </div>
            <Badge tone={form.visibility === "PUBLIC" ? "lime" : "purple"}>{form.visibility}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-300">Title</span>
              <Input value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="ProjectBowl" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-300">Slug</span>
              <div className="flex gap-2">
                <Input value={form.slug} onChange={(event) => updateField("slug", event.target.value)} placeholder="projectbowl" />
                <button
                  type="button"
                  className={buttonClasses({ variant: "secondary", size: "sm", className: "shrink-0" })}
                  onClick={() => updateField("slug", slugify(form.title))}
                >
                  <WandSparkles className="h-4 w-4" /> Generate
                </button>
              </div>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-300">Summary</span>
              <Textarea className="min-h-28" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} placeholder="Short portfolio card copy..." maxLength={500} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-300">Description</span>
              <Textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Long-form case study intro..." />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-300">Problem</span>
              <Textarea value={form.problem} onChange={(event) => updateField("problem", event.target.value)} placeholder="What problem does this solve?" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-300">Solution</span>
              <Textarea value={form.solution} onChange={(event) => updateField("solution", event.target.value)} placeholder="How did you solve it?" />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <ImagePlus className="h-5 w-5 text-cyan-200" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Thumbnail / upload</h2>
              <p className="text-sm text-slate-500">Cloudinary env is prepared for future uploads. Paste a hosted image URL for now.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-300">Cover image URL</span>
              <Input value={form.coverImageUrl} onChange={(event) => updateField("coverImageUrl", event.target.value)} placeholder="https://..." />
            </label>
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-4 text-center text-sm text-slate-500">
              <ImagePlus className="mx-auto mb-2 h-8 w-8 text-slate-600" />
              Upload endpoint pending. Use a hosted Cloudinary image URL for now.
            </div>
          </div>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold text-white">Publishing controls</h2>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Status</span>
              <select className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={form.status} onChange={(event) => updateField("status", event.target.value as ProjectStatus)}>
                {statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Visibility</span>
              <select className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={form.visibility} onChange={(event) => updateField("visibility", event.target.value as ProjectVisibility)}>
                {visibilities.map((visibility) => <option key={visibility} value={visibility}>{visibility}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => updateField("isFeatured", !form.isFeatured)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/[0.07]">
              <span className="font-semibold">Featured on homepage</span>
              <span className={form.isFeatured ? "text-lime-300" : "text-slate-500"}><ToggleLeft className="h-5 w-5" /> {form.isFeatured ? "Yes" : "No"}</span>
            </button>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Started at</span>
              <Input value={form.startedAt} type="date" onChange={(event) => updateField("startedAt", event.target.value)} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Completed at</span>
              <Input value={form.completedAt} type="date" onChange={(event) => updateField("completedAt", event.target.value)} />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold text-white">Links</h2>
          <div className="mt-5 space-y-4">
            <Input value={form.liveUrl} onChange={(event) => updateField("liveUrl", event.target.value)} placeholder="Live URL" />
            <Input value={form.repositoryUrl} onChange={(event) => updateField("repositoryUrl", event.target.value)} placeholder="Repository URL" />
            <Input value={form.caseStudyUrl} onChange={(event) => updateField("caseStudyUrl", event.target.value)} placeholder="Case study URL" />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold text-white">Tech stack manager</h2>
          <div className="mt-5 space-y-4">
            {isLoadingTech ? <div className="flex items-center gap-2 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Loading stacks...</div> : null}
            {techError ? <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100"><AlertCircle className="mr-2 inline h-4 w-4" />{techError}</div> : null}
            <div className="flex flex-wrap gap-2">
              {techStacks.map((tech) => (
                <button key={tech.id} type="button" onClick={() => toggleTech(tech.id)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${form.techStackIds.includes(tech.id) ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"}`}>
                  {tech.name}
                </button>
              ))}
            </div>
            <div className="grid gap-2">
              <Input value={form.quickTech} onChange={(event) => updateField("quickTech", event.target.value)} placeholder="Fallback display tags: Next.js, Prisma" />
              <p className="text-xs text-slate-500">Fallback tags are client-only helpers until inline project tech creation is finalized.</p>
            </div>
            <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <Input value={newTechName} onChange={(event) => setNewTechName(event.target.value)} placeholder="Create tech stack" />
              <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={newTechCategory} onChange={(event) => setNewTechCategory(event.target.value as TechStackCategory)}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <button type="button" className={buttonClasses({ variant: "secondary", size: "sm" })} onClick={handleCreateTech}>
                <Plus className="h-4 w-4" /> Add stack
              </button>
            </div>
            {selectedTechNames.length > 0 ? <div className="flex flex-wrap gap-2">{selectedTechNames.map((name) => <Badge key={name} tone="slate">{name}</Badge>)}</div> : null}
          </div>
        </Card>

        {error ? <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100">{error}</div> : null}
        {success ? <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-sm text-lime-100">{success}</div> : null}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || (mode === "edit" && !initialProject?.id)}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {mode === "create" ? "Create project" : "Save changes"}
        </Button>
      </aside>
    </form>
  );
}

function toFormState(project?: ApiProject): FormState {
  const coverImage = project ? getCoverImage(project) : undefined;
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    summary: project?.summary ?? "",
    description: project?.description ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    status: (project?.status as ProjectStatus | undefined) ?? "IDEA",
    visibility: (project?.visibility as ProjectVisibility | undefined) ?? "PRIVATE",
    isFeatured: project?.isFeatured ?? false,
    repositoryUrl: project?.repositoryUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    caseStudyUrl: project?.caseStudyUrl ?? "",
    startedAt: toDateInput(project?.startedAt),
    completedAt: toDateInput(project?.completedAt),
    coverImageUrl: coverImage?.url ?? "",
    techStackIds: project ? getTechIds(project) : [],
    quickTech: project ? getTechNames(project).join(", ") : "",
  };
}

function toPayload(form: FormState): ProjectPayload {
  return {
    title: form.title.trim(),
    slug: form.slug.trim() || undefined,
    summary: form.summary.trim(),
    description: form.description.trim(),
    problem: form.problem.trim(),
    solution: form.solution.trim(),
    status: form.status,
    visibility: form.visibility,
    isFeatured: form.isFeatured,
    repositoryUrl: form.repositoryUrl.trim(),
    liveUrl: form.liveUrl.trim(),
    caseStudyUrl: form.caseStudyUrl.trim(),
    startedAt: form.startedAt ? new Date(form.startedAt).toISOString() : undefined,
    completedAt: form.completedAt ? new Date(form.completedAt).toISOString() : undefined,
    techStackIds: form.techStackIds,
    images: form.coverImageUrl.trim()
      ? [{ type: "COVER", url: form.coverImageUrl.trim(), altText: `${form.title} cover`, sortOrder: 0 }]
      : [],
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toDateInput(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}
