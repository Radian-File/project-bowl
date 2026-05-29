import { getGitHubRepoContext } from "@/lib/server/github";
import { generateWithOpenRouter } from "@/lib/server/openrouter";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

type GitHubGeneratePayload = {
  repoUrl?: string;
  notes?: string;
  tone?: string;
};

export async function POST(request: Request) {
  try {
    const payload = await readJson<GitHubGeneratePayload>(request);
    if (!payload.repoUrl) {
      return jsonError(new Error("GitHub repository URL wajib diisi."), 400);
    }

    const github = await getGitHubRepoContext(payload.repoUrl);
    const result = await generateWithOpenRouter("description", {
      github,
      prompt: payload.notes,
      notes: payload.notes,
      tone: payload.tone,
    });

    return jsonOk({
      ...result,
      github: {
        fullName: github.fullName,
        htmlUrl: github.htmlUrl,
        primaryLanguage: github.primaryLanguage,
        languages: github.languages,
        topics: github.topics,
      },
    });
  } catch (error) {
    return jsonError(error, 503);
  }
}
