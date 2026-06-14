export type GitHubRepoSummary = {
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string | null;
};

const DEFAULT_USERNAME = "Radian-File";

/**
 * Fetches the N most recently pushed public repositories for a user.
 * Works without a token (public data); a GITHUB_TOKEN, when present,
 * raises the rate limit. Never throws to the caller — returns [] on error.
 */
export async function getLatestRepos(limit = 3): Promise<GitHubRepoSummary[]> {
  const username = process.env.GITHUB_USERNAME?.trim() || DEFAULT_USERNAME;
  const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&direction=desc&per_page=${limit}&type=owner`;

  try {
    const response = await fetch(url, {
      headers: githubHeaders(),
      next: { revalidate: 1800 },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return [];

    return data.slice(0, limit).map((repo) => normalizeRepo(repo as Record<string, unknown>));
  } catch {
    return [];
  }
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ProjectBowl-Portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function normalizeRepo(repo: Record<string, unknown>): GitHubRepoSummary {
  return {
    name: typeof repo.name === "string" ? repo.name : "",
    fullName: typeof repo.full_name === "string" ? repo.full_name : "",
    htmlUrl: typeof repo.html_url === "string" ? repo.html_url : "",
    description: typeof repo.description === "string" ? repo.description : null,
    language: typeof repo.language === "string" ? repo.language : null,
    stars: typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0,
    forks: typeof repo.forks_count === "number" ? repo.forks_count : 0,
    pushedAt: typeof repo.pushed_at === "string" ? repo.pushed_at : null,
  };
}
