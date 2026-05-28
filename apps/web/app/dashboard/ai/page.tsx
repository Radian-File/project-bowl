"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, Bot, CheckCircle2, Loader2, Save, Sparkles } from "lucide-react";
import { Badge, Button, Card, Input, SectionLabel, Textarea } from "@projectbowl/ui";
import { AiGenerationKind, ApiProject, generateAiContent, isConfigurationError, listProjects } from "@/lib/api";

const generationTypes: { value: AiGenerationKind; label: string; help: string }[] = [
  { value: "description", label: "Project description", help: "Portfolio-ready summary and long description." },
  { value: "readme", label: "README", help: "Setup, architecture, commands, and roadmap." },
  { value: "case-study", label: "Case study", help: "Problem, approach, implementation, and impact." },
  { value: "rewrite", label: "Rewrite", help: "Improve existing copy for clarity, tone, or SEO." },
];

export default function AiStudioPage() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [kind, setKind] = useState<AiGenerationKind>("description");
  const [projectId, setProjectId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [tone, setTone] = useState("polished developer portfolio");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    listProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  const selectedProject = useMemo(() => projects.find((project) => project.id === projectId), [projectId, projects]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setConfigError(false);
    setSaved(false);

    if (kind === "rewrite" && sourceText.trim().length < 10) {
      setError("Paste at least 10 characters of source text to rewrite.");
      return;
    }
    if (kind !== "rewrite" && prompt.trim().length < 8 && !selectedProject) {
      setError("Add a prompt or select a project for context.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateAiContent(kind, {
        projectId: projectId || undefined,
        prompt,
        notes: prompt,
        tone,
        text: sourceText,
        existingText: sourceText,
        project: selectedProject,
      });
      setOutput(result.text);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI generation failed.";
      if (isConfigurationError(err)) {
        setConfigError(true);
        setError("OpenRouter is not configured on the backend yet. Add OPENROUTER_API_KEY and model settings to enable generation.");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>AI Studio</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Generate, review, then publish better project copy.</h2>
          <p className="mt-3 max-w-2xl text-slate-400">Calls the Wave 2 AI endpoints with your bearer token and keeps generated output editable before any save workflow is finalized.</p>
        </div>
        <Badge tone="purple">OpenRouter-backed</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-3 text-purple-200"><Bot className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">Generator controls</h3>
              <p className="text-sm text-slate-500">Select an output type and provide project context.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Generation type</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {generationTypes.map((item) => (
                  <button key={item.value} type="button" onClick={() => setKind(item.value)} className={`rounded-2xl border p-4 text-left transition ${kind === item.value ? "border-cyan-300/40 bg-cyan-300/10 text-white" : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"}`}>
                    <span className="font-semibold">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{item.help}</span>
                  </button>
                ))}
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Project context</span>
              <select className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                <option value="">No project selected</option>
                {projects.map((project) => <option key={project.id ?? project.slug} value={project.id ?? ""}>{project.title}</option>)}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Tone / instructions</span>
              <Input value={tone} onChange={(event) => setTone(event.target.value)} placeholder="concise, recruiter-friendly, premium SaaS" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Prompt / notes</span>
              <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="What should the AI emphasize? Outcomes, architecture, lessons, metrics..." />
            </label>

            {kind === "rewrite" ? (
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-300">Text to rewrite</span>
                <Textarea value={sourceText} onChange={(event) => setSourceText(event.target.value)} placeholder="Paste copy to improve..." />
              </label>
            ) : null}

            {configError ? (
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                <div className="mb-2 flex items-center gap-2 font-semibold"><AlertCircle className="h-5 w-5" /> AI configuration needed</div>
                Backend responded as if OpenRouter is unavailable. Configure OPENROUTER_API_KEY / OPENROUTER_MODEL, then retry.
              </div>
            ) : null}
            {error && !configError ? <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100">{error}</div> : null}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
            </Button>
          </form>
        </Card>

        <Card className="flex min-h-[720px] flex-col p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">Review output</h3>
              <p className="text-sm text-slate-500">Editable textarea. Save is a placeholder until a backend persistence endpoint is finalized.</p>
            </div>
            {output ? <Badge tone="lime">Generated</Badge> : <Badge tone="slate">Empty</Badge>}
          </div>

          {output ? (
            <Textarea className="min-h-[520px] flex-1 font-mono text-sm leading-6" value={output} onChange={(event) => setOutput(event.target.value)} />
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <div>
                <Sparkles className="mx-auto mb-4 h-10 w-10 text-slate-600" />
                <p className="font-display text-2xl font-semibold text-white">No generated copy yet</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Choose a type, add context, and generate. Config errors will be shown without breaking the UI.</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">Manual save needed: copy the reviewed output into the project form until backend save endpoints are available.</p>
            <button type="button" onClick={() => setSaved(true)} disabled={!output} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-50">
              {saved ? <CheckCircle2 className="h-4 w-4 text-lime-300" /> : <Save className="h-4 w-4" />} {saved ? "Marked reviewed" : "Mark reviewed"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
