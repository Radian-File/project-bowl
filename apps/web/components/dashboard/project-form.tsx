"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Github, ImagePlus, Loader2, Plus, Save, ToggleLeft, WandSparkles } from "lucide-react";
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
  generateProjectFromGitHub,
  listTechStacks,
  updateProject,
} from "@/lib/api";
import { getCoverImage, getTechIds } from "@/lib/project-view";
import { buildStackOptions, findMatchingTechStack, isStackOptionSelected, suggestStackOptionsFromHints, techStackCategories } from "@/lib/tech-stack-presets";

const statuses: ProjectStatus[] = ["IDEA", "PLANNING", "IN_PROGRESS", "SHIPPED", "ARCHIVED"];
const visibilities: ProjectVisibility[] = ["PRIVATE", "PUBLIC", "UNLISTED"];
const categories = techStackCategories;

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
};

export function ProjectForm({ mode, initialProject }: { mode: "create" | "edit"; initialProject?: ApiProject }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toFormState(initialProject));
  const [techStacks, setTechStacks] = useState<ApiTechStack[]>([]);
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState<TechStackCategory>("FRONTEND");
  const [githubRepoUrl, setGithubRepoUrl] = useState(initialProject?.repositoryUrl?.includes("github.com") ? initialProject.repositoryUrl : "");
  const [githubNotes, setGithubNotes] = useState("");
  const [isGeneratingGithub, setIsGeneratingGithub] = useState(false);
  const [isAddingStack, setIsAddingStack] = useState(false);
  const [githubMessage, setGithubMessage] = useState<string | null>(null);
  const [techMessage, setTechMessage] = useState<string | null>(null);
  const [techError, setTechError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stackCategoryFilter, setStackCategoryFilter] = useState<TechStackCategory | "ALL">("FRONTEND");
  const [stackSearch, setStackSearch] = useState("");
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

  const selectedTechItems = useMemo(() => techStacks.filter((tech) => form.techStackIds.includes(tech.id)), [form.techStackIds, techStacks]);

  const stackOptions = useMemo(
    () => buildStackOptions(techStacks, stackCategoryFilter, stackSearch),
    [stackCategoryFilter, stackSearch, techStacks],
  );

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTech(id: string) {
    setForm((current) => ({
      ...current,
      techStackIds: current.techStackIds.includes(id) ? current.techStackIds.filter((item) => item !== id) : [...current.techStackIds, id],
    }));
  }

  async function applyGitHubStackHints(rawHints: string[]) {
    setTechError(null);
    setTechMessage(null);

    const suggestions = suggestStackOptionsFromHints(rawHints, techStacks);
    if (suggestions.length === 0) return { selected: [] as string[], created: [] as string[] };

    let nextTechStacks = [...techStacks];
    const selectedIds: string[] = [];
    const selectedNames: string[] = [];
    const createdNames: string[] = [];

    for (const suggestion of suggestions) {
      let stack = suggestion.id ? nextTechStacks.find((item) => item.id === suggestion.id) : findMatchingTechStack(nextTechStacks, suggestion.name);

      if (!stack) {
        try {
          stack = await createTechStack({ name: suggestion.name, category: suggestion.category });
          nextTechStacks = [...nextTechStacks, stack];
          createdNames.push(stack.name);
        } catch (err) {
          const latestStacks = await listTechStacks().catch(() => nextTechStacks);
          nextTechStacks = latestStacks;
          stack = findMatchingTechStack(nextTechStacks, suggestion.name);
          if (!stack) throw err;
        }
      }

      if (!selectedIds.includes(stack.id)) {
        selectedIds.push(stack.id);
        selectedNames.push(stack.name);
      }
    }

    setTechStacks(nextTechStacks.sort((a, b) => a.name.localeCompare(b.name)));
    setForm((current) => ({
      ...current,
      techStackIds: Array.from(new Set([...current.techStackIds, ...selectedIds])),
    }));

    if (selectedNames.length > 0) {
      setTechMessage(`GitHub stack: ${selectedNames.length} stack otomatis dipilih${createdNames.length ? `, ${createdNames.length} stack baru dibuat` : ""}.`);
    }

    return { selected: selectedNames, created: createdNames };
  }

  async function selectStackOption(optionKey: string) {
    const option = stackOptions.find((item) => item.key === optionKey);
    if (!option) return;

    setIsAddingStack(true);
    setTechError(null);
    setTechMessage(null);

    try {
      let stack = option.id ? techStacks.find((item) => item.id === option.id) : findMatchingTechStack(techStacks, option.name);
      let wasCreated = false;

      if (!stack) {
        try {
          stack = await createTechStack({ name: option.name, category: option.category });
          wasCreated = true;
        } catch (err) {
          const latestStacks = await listTechStacks().catch(() => techStacks);
          setTechStacks(latestStacks);
          stack = findMatchingTechStack(latestStacks, option.name);
          if (!stack) throw err;
        }
      }

      setTechStacks((current) => {
        const exists = current.some((item) => item.id === stack.id);
        return (exists ? current : [...current, stack]).sort((a, b) => a.name.localeCompare(b.name));
      });
      setForm((current) => ({
        ...current,
        techStackIds: current.techStackIds.includes(stack.id) ? current.techStackIds : [...current.techStackIds, stack.id],
      }));
      setTechMessage(`${stack.name} ditambahkan${wasCreated ? " ke master stack dan" : ""} ke project.`);
    } catch (err) {
      setTechError(err instanceof Error ? err.message : "Could not add tech stack.");
    } finally {
      setIsAddingStack(false);
    }
  }

  async function handleGenerateWithGithub() {
    setError(null);
    setGithubMessage(null);

    if (!githubRepoUrl.trim()) {
      setError("Masukkan GitHub repository URL dulu, contoh: https://github.com/username/repo.");
      return;
    }

    setIsGeneratingGithub(true);
    try {
      const result = await generateProjectFromGitHub(githubRepoUrl.trim(), githubNotes.trim(), "Bahasa Indonesia yang fun, confident, dan profesional; boleh mix English untuk tech/product terms.");
      if (!result.fields) {
        throw new Error("AI belum mengembalikan structured fields. Coba tambahkan notes yang lebih jelas atau retry.");
      }

      const github = result.github as { htmlUrl?: string; languages?: string[]; topics?: string[]; techHints?: string[] } | undefined;

      setForm((current) => ({
        ...current,
        title: result.fields?.title || current.title,
        slug: result.fields?.slug || current.slug,
        summary: result.fields?.summary || current.summary,
        description: result.fields?.description || current.description,
        problem: result.fields?.problem || current.problem,
        solution: result.fields?.solution || current.solution,
        repositoryUrl: github?.htmlUrl ?? githubRepoUrl.trim(),
      }));

      let stackMessage = "";
      const stackHints = [
        ...(github?.techHints ?? []),
        ...(github?.languages ?? []),
        ...(github?.topics ?? []),
      ];

      if (stackHints.length > 0) {
        try {
          const applied = await applyGitHubStackHints(stackHints);
          if (applied.selected.length > 0) {
            stackMessage = ` ${applied.selected.length} tech stack juga otomatis dipilih.`;
          }
        } catch (stackError) {
          setTechError(stackError instanceof Error ? `Draft berhasil, tapi auto-fill stack gagal: ${stackError.message}` : "Draft berhasil, tapi auto-fill stack gagal.");
        }
      }

      setGithubMessage(`Draft dari GitHub berhasil dibuat.${stackMessage} Review dulu field-nya sebelum save.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generate with GitHub gagal.");
    } finally {
      setIsGeneratingGithub(false);
    }
  }

  async function handleCreateTech() {
    setTechError(null);
    setTechMessage(null);
    if (!newTechName.trim()) {
      setTechError("Enter a tech stack name first.");
      return;
    }

    setIsAddingStack(true);
    try {
      const existing = findMatchingTechStack(techStacks, newTechName.trim());
      const stack = existing ?? await createTechStack({ name: newTechName.trim(), category: newTechCategory });
      setTechStacks((current) => {
        const exists = current.some((item) => item.id === stack.id);
        return (exists ? current : [...current, stack]).sort((a, b) => a.name.localeCompare(b.name));
      });
      setForm((current) => ({
        ...current,
        techStackIds: current.techStackIds.includes(stack.id) ? current.techStackIds : [...current.techStackIds, stack.id],
      }));
      setNewTechName("");
      setTechMessage(existing ? `${stack.name} sudah ada dan dipilih untuk project.` : `${stack.name} dibuat dan dipilih untuk project.`);
    } catch (err) {
      setTechError(err instanceof Error ? err.message : "Could not create tech stack.");
    } finally {
      setIsAddingStack(false);
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
            <div className="space-y-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4 md:col-span-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">AI Assist</p>
                  <h3 className="font-display text-xl font-semibold text-white">Generate with GitHub</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">Paste public GitHub repo URL, lalu AI akan isi title, slug, summary, description, problem, solution, repo URL, dan tech hints.</p>
                </div>
                <Github className="h-5 w-5 shrink-0 text-cyan-200" />
              </div>
              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <Input value={githubRepoUrl} onChange={(event) => setGithubRepoUrl(event.target.value)} placeholder="https://github.com/username/repo" />
                <button type="button" className={buttonClasses({ variant: "secondary", className: "shrink-0" })} onClick={handleGenerateWithGithub} disabled={isGeneratingGithub}>
                  {isGeneratingGithub ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />} Generate with GitHub
                </button>
              </div>
              <Input value={githubNotes} onChange={(event) => setGithubNotes(event.target.value)} placeholder="Optional notes: highlight AI workflow, dashboard, Supabase, clean UI..." />
              {githubMessage ? <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-3 text-sm text-lime-100">{githubMessage}</div> : null}
            </div>
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
            {techMessage ? <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-3 text-sm text-lime-100">{techMessage}</div> : null}

            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Selected stacks</p>
              {selectedTechItems.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedTechItems.map((tech) => (
                    <button key={tech.id} type="button" onClick={() => toggleTech(tech.id)} className="rounded-full border border-cyan-300/40 bg-cyan-300/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-rose-300/40 hover:bg-rose-300/10 hover:text-rose-100" title="Click to remove">
                      {tech.name} ×
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Belum ada stack dipilih.</p>
              )}
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Category</span>
                <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={stackCategoryFilter} onChange={(event) => setStackCategoryFilter(event.target.value as TechStackCategory | "ALL")}>
                  <option value="ALL">ALL</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Search</span>
                <Input value={stackSearch} onChange={(event) => setStackSearch(event.target.value)} placeholder="Search stack: TypeScript, Vue, Supabase..." />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Add from preset</span>
                <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value="" onChange={(event) => selectStackOption(event.target.value)} disabled={isAddingStack || isLoadingTech}>
                  <option value="">{isAddingStack ? "Adding stack..." : "Choose a stack"}</option>
                  {stackOptions.map((option) => {
                    const selected = isStackOptionSelected(option, form.techStackIds, techStacks);
                    return <option key={option.key} value={option.key} disabled={selected}>{option.name}{selected ? " ✓" : option.id ? "" : " · preset"}</option>;
                  })}
                </select>
              </label>
              {stackOptions.length === 0 ? <p className="text-xs text-slate-500">No stack found. Create it manually below.</p> : null}
            </div>

            <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Create custom stack</p>
              <Input value={newTechName} onChange={(event) => setNewTechName(event.target.value)} placeholder="Create tech stack" />
              <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={newTechCategory} onChange={(event) => setNewTechCategory(event.target.value as TechStackCategory)}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <button type="button" className={buttonClasses({ variant: "secondary", size: "sm" })} onClick={handleCreateTech} disabled={isAddingStack}>
                {isAddingStack ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add stack
              </button>
            </div>
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
