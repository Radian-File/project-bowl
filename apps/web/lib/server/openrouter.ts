import type { AiGenerationKind, ApiProject } from "@/lib/api";

export type AiPayload = {
  projectId?: string;
  prompt?: string;
  notes?: string;
  tone?: string;
  text?: string;
  existingText?: string;
  project?: ApiProject;
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
      content: "You are ProjectBowl's portfolio writing assistant. Write concise, polished, developer-portfolio-ready content. Return markdown-friendly plain text only.",
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
      temperature: 0.7,
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

  return {
    text: text.trim(),
    model,
    provider: "openrouter",
    raw: body,
  };
}

function buildPrompt(kind: AiGenerationKind, payload: AiPayload) {
  const project = payload.project;
  const context = project
    ? [
        `Project: ${project.title}`,
        `Slug: ${project.slug}`,
        `Summary: ${project.summary}`,
        project.description ? `Description: ${project.description}` : null,
        project.problem ? `Problem: ${project.problem}` : null,
        project.solution ? `Solution: ${project.solution}` : null,
        project.status ? `Status: ${project.status}` : null,
      ].filter(Boolean).join("\n")
    : "No project selected.";

  const tone = payload.tone || "polished developer portfolio";
  const notes = payload.prompt || payload.notes || "";

  if (kind === "rewrite") {
    return `Rewrite the following text in a ${tone} tone. Preserve meaning, improve clarity and flow.\n\nText:\n${payload.text || payload.existingText || ""}\n\nExtra notes:\n${notes}`;
  }

  if (kind === "readme") {
    return `Create a structured README draft for this project. Include overview, features, tech stack, setup, commands, and roadmap. Tone: ${tone}.\n\n${context}\n\nExtra notes:\n${notes}`;
  }

  if (kind === "case-study") {
    return `Create a portfolio case study with sections: Problem, Approach, Implementation, Impact, Lessons. Tone: ${tone}.\n\n${context}\n\nExtra notes:\n${notes}`;
  }

  return `Create a polished project description. Include a short summary and a longer portfolio-ready description. Tone: ${tone}.\n\n${context}\n\nExtra notes:\n${notes}`;
}
