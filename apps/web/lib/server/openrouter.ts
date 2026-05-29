import type { AiGenerationKind, ApiProject } from "@/lib/api";
import type { GitHubRepoContext } from "@/lib/server/github";

export type AiPayload = {
  projectId?: string;
  prompt?: string;
  notes?: string;
  tone?: string;
  text?: string;
  existingText?: string;
  project?: ApiProject;
  github?: GitHubRepoContext;
};

export type ProjectAiFields = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
};

export async function generateWithOpenRouter(kind: AiGenerationKind, payload: AiPayload) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

  if (!apiKey || apiKey === "replace-me") {
    throw new Error("OpenRouter is not configured. Set OPENROUTER_API_KEY and OPENROUTER_MODEL in Vercel/Supabase environment settings.");
  }

  const messages = [
    {
      role: "system",
      content:
        kind === "description"
          ? "You are ProjectBowl's AI project copywriter. Always write primarily in Bahasa Indonesia that feels fun, fresh, confident, and professional. Use English only for common tech/product terms like fullstack, dashboard, workflow, API, deployment, and AI. Never answer fully in English. Return ONLY valid JSON when asked for JSON."
          : "You are ProjectBowl's portfolio writing assistant. Always write primarily in Bahasa Indonesia yang fun, fresh, confident, dan profesional. English hanya boleh untuk istilah tech/product umum seperti fullstack, dashboard, workflow, API, deployment, dan AI. Jangan jawab full English. Return markdown-friendly plain text only.",
    },
    {
      role: "user",
      content: buildPrompt(kind, payload),
    },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-Title": "ProjectBowl",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.72,
    }),
  });

  const body = (await response.json().catch(() => null)) as any;
  if (!response.ok) {
    throw new Error(body?.error?.message ?? `OpenRouter request failed with status ${response.status}`);
  }

  const text = body?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("OpenRouter returned an empty response.");
  }

  const fields = kind === "description" ? parseProjectFields(text, payload) : null;

  return {
    text: fields ? formatProjectFields(fields) : text.trim(),
    fields,
    model,
    provider: "openrouter",
    raw: body,
  };
}

function buildPrompt(kind: AiGenerationKind, payload: AiPayload) {
  const context = buildContext(payload);
  const defaultTone = "Mayoritas Bahasa Indonesia yang fun, confident, clean, dan profesional; English hanya untuk istilah teknis/product seperti fullstack, dashboard, workflow, AI-ready, shipping";
  const tone = payload.tone || defaultTone;
  const notes = payload.prompt || payload.notes || "";

  if (kind === "rewrite") {
    return `Rewrite text berikut dengan tone: ${tone}. Pertahankan makna, bikin lebih clear, natural, dan portfolio-ready.\n\nText:\n${payload.text || payload.existingText || ""}\n\nExtra notes:\n${notes}`;
  }

  if (kind === "readme") {
    return `Buat draft README yang rapi dan developer-friendly. Include overview, features, tech stack, setup, commands, dan roadmap. Tone: ${tone}.\n\n${context}\n\nExtra notes:\n${notes}`;
  }

  if (kind === "case-study") {
    return `Buat portfolio case study dengan section: Problem, Approach, Implementation, Impact, Lessons. Tone: ${tone}.\n\n${context}\n\nExtra notes:\n${notes}`;
  }

  return `Generate lengkap field project untuk form ProjectBowl.

Output HARUS valid JSON saja, tanpa markdown fence, tanpa penjelasan tambahan.

JSON shape wajib:
{
  "title": "project title yang clean dan portfolio-ready",
  "slug": "lowercase-kebab-case-slug",
  "summary": "1-2 kalimat singkat untuk card portfolio, maksimal 220 karakter",
  "description": "deskripsi portfolio yang lebih lengkap, 2-4 kalimat",
  "problem": "masalah utama yang diselesaikan project, 1-3 kalimat",
  "solution": "solusi yang dibangun dan kenapa menarik, 1-3 kalimat"
}

Language/tone:
- Mayoritas Bahasa Indonesia yang fun tapi tetap profesional.
- English hanya untuk tech/product terms yang natural.
- Jangan full English.
- Hindari gaya terlalu kaku atau terlalu lebay.
- Terdengar seperti portfolio builder yang confident dan modern.
- Slug wajib lowercase kebab-case, hanya a-z, 0-9, dan hyphen.

Context:
${context}

Extra notes/user prompt:
${notes || "Buat versi yang polished untuk portfolio developer."}`;
}

function buildContext(payload: AiPayload) {
  const sections: string[] = [];

  if (payload.project) {
    const project = payload.project;
    sections.push([
      "Existing Project Context:",
      `Project: ${project.title}`,
      `Current slug: ${project.slug}`,
      `Current summary: ${project.summary}`,
      project.description ? `Current description: ${project.description}` : null,
      project.problem ? `Current problem: ${project.problem}` : null,
      project.solution ? `Current solution: ${project.solution}` : null,
      project.status ? `Status: ${project.status}` : null,
    ].filter(Boolean).join("\n"));
  }

  if (payload.github) {
    const github = payload.github;
    const packageHints = github.packageJson
      ? [
          github.packageJson.scripts ? `Scripts: ${Object.keys(github.packageJson.scripts).join(", ")}` : null,
          github.packageJson.dependencies ? `Dependencies: ${Object.keys(github.packageJson.dependencies).join(", ")}` : null,
          github.packageJson.devDependencies ? `DevDependencies: ${Object.keys(github.packageJson.devDependencies).join(", ")}` : null,
        ].filter(Boolean).join("\n")
      : "No package.json found.";

    sections.push([
      "GitHub Repository Context:",
      `Full name: ${github.fullName}`,
      `Repo URL: ${github.htmlUrl}`,
      `Repo name: ${github.name}`,
      github.description ? `GitHub description: ${github.description}` : null,
      github.homepage ? `Homepage: ${github.homepage}` : null,
      github.primaryLanguage ? `Primary language: ${github.primaryLanguage}` : null,
      github.languages.length ? `Languages: ${github.languages.join(", ")}` : null,
      github.topics.length ? `Topics: ${github.topics.join(", ")}` : null,
      `Stars: ${github.stars}`,
      `Forks: ${github.forks}`,
      github.pushedAt ? `Last pushed: ${github.pushedAt}` : null,
      packageHints,
      github.readme ? `README excerpt:\n${github.readme}` : "No README found.",
    ].filter(Boolean).join("\n"));
  }

  return sections.length ? sections.join("\n\n---\n\n") : "No project selected.";
}

function parseProjectFields(text: string, payload: AiPayload): ProjectAiFields | null {
  const trimmed = text.trim();
  const jsonCandidate = trimmed.startsWith("{") ? trimmed : trimmed.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonCandidate) return null;

  try {
    const parsed = JSON.parse(jsonCandidate) as Partial<ProjectAiFields>;
    const fallbackTitle = payload.github?.name ?? payload.project?.title ?? "Untitled Project";
    const title = String(parsed.title ?? fallbackTitle).trim();
    const fields = {
      title,
      slug: sanitizeSlug(parsed.slug ?? title),
      summary: String(parsed.summary ?? "").trim(),
      description: String(parsed.description ?? "").trim(),
      problem: String(parsed.problem ?? "").trim(),
      solution: String(parsed.solution ?? "").trim(),
    };

    if (!fields.title || !fields.summary || !fields.description || !fields.problem || !fields.solution) {
      return null;
    }

    return fields;
  } catch {
    return null;
  }
}

function formatProjectFields(fields: ProjectAiFields) {
  return [
    `Title:\n${fields.title}`,
    `Slug:\n${fields.slug}`,
    `Summary:\n${fields.summary}`,
    `Description:\n${fields.description}`,
    `Problem:\n${fields.problem}`,
    `Solution:\n${fields.solution}`,
  ].join("\n\n");
}

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
