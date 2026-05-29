export type GitHubRepoContext = {
  owner: string;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  primaryLanguage: string | null;
  languages: string[];
  stars: number;
  forks: number;
  pushedAt: string | null;
  readme: string | null;
  packageJson: {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  } | null;
};

export async function getGitHubRepoContext(repoUrl: string): Promise<GitHubRepoContext> {
  const { owner, repo } = parseGitHubRepoUrl(repoUrl);
  const headers = githubHeaders();

  const repoData = await fetchGitHubJson<any>(`https://api.github.com/repos/${owner}/${repo}`, headers);
  const [languagesData, readme, packageJson] = await Promise.all([
    fetchGitHubJson<Record<string, number>>(`https://api.github.com/repos/${owner}/${repo}/languages`, headers).catch(() => ({})),
    fetchGitHubReadme(owner, repo, headers).catch(() => null),
    fetchGitHubPackageJson(owner, repo, headers).catch(() => null),
  ]);

  return {
    owner,
    name: repoData.name ?? repo,
    fullName: repoData.full_name ?? `${owner}/${repo}`,
    htmlUrl: repoData.html_url ?? `https://github.com/${owner}/${repo}`,
    description: repoData.description ?? null,
    homepage: repoData.homepage || null,
    topics: Array.isArray(repoData.topics) ? repoData.topics.slice(0, 16) : [],
    primaryLanguage: repoData.language ?? null,
    languages: Object.keys(languagesData).slice(0, 12),
    stars: typeof repoData.stargazers_count === "number" ? repoData.stargazers_count : 0,
    forks: typeof repoData.forks_count === "number" ? repoData.forks_count : 0,
    pushedAt: repoData.pushed_at ?? null,
    readme: readme ? readme.slice(0, 12000) : null,
    packageJson: packageJson ? sanitizePackageJson(packageJson) : null,
  };
}

function parseGitHubRepoUrl(repoUrl: string) {
  let url: URL;
  try {
    url = new URL(repoUrl.trim());
  } catch {
    throw new Error("Masukkan GitHub repository URL yang valid, contoh: https://github.com/username/repo.");
  }

  if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
    throw new Error("Untuk sekarang hanya support public repository dari github.com.");
  }

  const [owner, rawRepo] = url.pathname.split("/").filter(Boolean);
  const repo = rawRepo?.replace(/\.git$/, "");

  if (!owner || !repo || owner.length > 100 || repo.length > 100) {
    throw new Error("GitHub URL harus berbentuk https://github.com/owner/repo.");
  }

  return { owner, repo };
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ProjectBowl-AI-Generator",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchGitHubJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const response = await fetch(url, { headers, next: { revalidate: 60 } });
  if (!response.ok) {
    if (response.status === 404) throw new Error("GitHub repository tidak ditemukan atau bukan public repo.");
    if (response.status === 403) throw new Error("GitHub rate limit tercapai. Coba lagi nanti atau set GITHUB_TOKEN server-side.");
    throw new Error(`GitHub API error ${response.status}.`);
  }
  return (await response.json()) as T;
}

async function fetchGitHubReadme(owner: string, repo: string, headers: Record<string, string>) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    headers: {
      ...headers,
      Accept: "application/vnd.github.raw",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) return null;
  return response.text();
}

async function fetchGitHubPackageJson(owner: string, repo: string, headers: Record<string, string>) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
    headers: {
      ...headers,
      Accept: "application/vnd.github.raw",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) return null;
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function sanitizePackageJson(packageJson: Record<string, unknown>) {
  return {
    scripts: pickStringRecord(packageJson.scripts),
    dependencies: pickStringRecord(packageJson.dependencies),
    devDependencies: pickStringRecord(packageJson.devDependencies),
  };
}

function pickStringRecord(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => typeof item === "string")
    .slice(0, 40) as [string, string][];
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
