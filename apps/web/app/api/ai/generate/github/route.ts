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
        techHints: collectGitHubTechHints(github),
      },
    });
  } catch (error) {
    return jsonError(error, 503);
  }
}

function collectGitHubTechHints(github: Awaited<ReturnType<typeof getGitHubRepoContext>>) {
  const packageJson = github.packageJson;
  const packageNames = packageJson
    ? [
        ...Object.keys(packageJson.dependencies ?? {}),
        ...Object.keys(packageJson.devDependencies ?? {}),
      ]
    : [];

  return Array.from(new Set([
    github.primaryLanguage,
    ...github.languages,
    ...github.topics,
    ...packageNames,
  ].filter((item): item is string => Boolean(item)))).slice(0, 40);
}
