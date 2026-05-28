export type ProjectStatus = "IDEA" | "PLANNING" | "IN_PROGRESS" | "SHIPPED" | "ARCHIVED";
export type ProjectVisibility = "PRIVATE" | "PUBLIC" | "UNLISTED";
export type TechStackCategory = "FRONTEND" | "BACKEND" | "DATABASE" | "AI" | "DEVOPS" | "DESIGN" | "OTHER";

export type ApiImage = {
  id?: string;
  type?: "COVER" | "GALLERY" | "LOGO" | "SCREENSHOT";
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  sortOrder?: number;
};

export type ApiTechStack = {
  id: string;
  name: string;
  slug?: string;
  category?: TechStackCategory;
  iconUrl?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
};

export type ProjectTechStackLink = {
  techStackId?: string;
  sortOrder?: number;
  techStack?: ApiTechStack;
};

export type ApiProject = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  problem?: string | null;
  solution?: string | null;
  status?: ProjectStatus | string;
  visibility?: ProjectVisibility | string;
  isFeatured?: boolean;
  repositoryUrl?: string | null;
  liveUrl?: string | null;
  caseStudyUrl?: string | null;
  publishedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  ownerId?: string | null;
  techStacks?: ProjectTechStackLink[] | ApiTechStack[] | string[];
  tech?: string[];
  images?: ApiImage[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectPayload = {
  title: string;
  slug?: string;
  summary: string;
  description?: string;
  problem?: string;
  solution?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  isFeatured?: boolean;
  repositoryUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  publishedAt?: string;
  startedAt?: string;
  completedAt?: string;
  techStackIds?: string[];
  images?: ApiImage[];
};

export type ApiTask = {
  id: string;
  projectId?: string;
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiMilestone = {
  id: string;
  projectId?: string;
  title: string;
  description?: string | null;
  status?: string;
  progress?: number;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiActivityLog = {
  id: string;
  projectId?: string;
  type?: string;
  action?: string;
  message?: string;
  actorName?: string | null;
  createdAt?: string;
};

export type AiGenerationKind = "description" | "readme" | "case-study" | "rewrite";

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const TOKEN_KEY = "projectbowl.authToken";
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export function isApiConfigured() {
  return Boolean(API_URL);
}

export function getApiUrl() {
  return API_URL;
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function readMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message = record.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof record.error === "string") return record.error;
  }
  return fallback;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured. Using local fallback UI where available.");
  }

  const { auth = true, headers, body, ...init } = options;
  const requestHeaders = new Headers(headers);
  if (body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const token = auth ? getAuthToken() : null;
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    body,
    headers: requestHeaders,
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(readMessage(payload, `Request failed with status ${response.status}`), response.status, payload);
  }

  return payload as T;
}

async function requestFirst<T>(paths: string[], options: ApiRequestOptions = {}): Promise<T> {
  let lastError: unknown;
  for (const path of paths) {
    try {
      return await apiRequest<T>(path, options);
    } catch (error) {
      lastError = error;
      if (error instanceof ApiError && error.status && ![404, 405].includes(error.status)) {
        throw error;
      }
    }
  }
  if (lastError instanceof Error) throw lastError;
  throw new ApiError("No compatible endpoint responded.");
}

export async function login(email: string, password: string) {
  const response = await apiRequest<Record<string, unknown>>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  const token =
    typeof response.accessToken === "string"
      ? response.accessToken
      : typeof response.token === "string"
        ? response.token
        : typeof response.access_token === "string"
          ? response.access_token
          : null;

  if (!token) {
    throw new ApiError("Login succeeded but the response did not include an access token.");
  }

  setAuthToken(token);
  return response;
}

export async function logout() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {
    // Auth is still evolving; clear the local token even when the endpoint is not available yet.
  } finally {
    clearAuthToken();
  }
}

export function listPublicProjects() {
  return apiRequest<ApiProject[]>("/public/projects", { auth: false });
}

export function getPublicProject(slug: string) {
  return apiRequest<ApiProject>(`/public/projects/${encodeURIComponent(slug)}`, { auth: false });
}

export function listProjects() {
  return apiRequest<ApiProject[]>("/projects");
}

export function getProjectById(id: string) {
  return apiRequest<ApiProject>(`/projects/${encodeURIComponent(id)}`);
}

export function createProject(payload: ProjectPayload) {
  return apiRequest<ApiProject>("/projects", {
    method: "POST",
    body: JSON.stringify(compactPayload(payload)),
  });
}

export function updateProject(id: string, payload: Partial<ProjectPayload>) {
  return apiRequest<ApiProject>(`/projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(compactPayload(payload)),
  });
}

export function deleteProject(id: string) {
  return apiRequest<{ id: string; deleted: boolean }>(`/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function listTechStacks() {
  return apiRequest<ApiTechStack[]>("/tech-stacks");
}

export function createTechStack(payload: Partial<ApiTechStack> & { name: string }) {
  return apiRequest<ApiTechStack>("/tech-stacks", {
    method: "POST",
    body: JSON.stringify(compactPayload(payload)),
  });
}

export async function generateAiContent(kind: AiGenerationKind, payload: Record<string, unknown>) {
  const endpoint =
    kind === "description"
      ? "/ai/generate/description"
      : kind === "readme"
        ? "/ai/generate/readme"
        : kind === "case-study"
          ? "/ai/generate/case-study"
          : "/ai/rewrite";

  const response = await apiRequest<Record<string, unknown>>(endpoint, {
    method: "POST",
    body: JSON.stringify(compactPayload(payload)),
  });

  return {
    raw: response,
    text: extractGeneratedText(response),
  };
}

export function listProjectTasks(projectId: string) {
  return requestFirst<ApiTask[]>([
    `/projects/${encodeURIComponent(projectId)}/tasks`,
    `/tasks?projectId=${encodeURIComponent(projectId)}`,
    `/tasks/project/${encodeURIComponent(projectId)}`,
  ]);
}

export function createProjectTask(projectId: string, payload: Partial<ApiTask> & { title: string }) {
  return requestFirst<ApiTask>([
    `/projects/${encodeURIComponent(projectId)}/tasks`,
    "/tasks",
  ], {
    method: "POST",
    body: JSON.stringify(compactPayload({ ...payload, projectId })),
  });
}

export function updateProjectTask(taskId: string, payload: Partial<ApiTask>) {
  return apiRequest<ApiTask>(`/tasks/${encodeURIComponent(taskId)}`, {
    method: "PATCH",
    body: JSON.stringify(compactPayload(payload)),
  });
}

export function listProjectMilestones(projectId: string) {
  return requestFirst<ApiMilestone[]>([
    `/projects/${encodeURIComponent(projectId)}/milestones`,
    `/milestones?projectId=${encodeURIComponent(projectId)}`,
    `/milestones/project/${encodeURIComponent(projectId)}`,
  ]);
}

export function listProjectActivity(projectId: string) {
  return requestFirst<ApiActivityLog[]>([
    `/projects/${encodeURIComponent(projectId)}/activity-logs`,
    `/activity-logs?projectId=${encodeURIComponent(projectId)}`,
    `/activity?projectId=${encodeURIComponent(projectId)}`,
  ]);
}

export function listActivity() {
  return requestFirst<ApiActivityLog[]>(["/activity-logs", "/activity"]);
}

export function isConfigurationError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return message.includes("openrouter") || message.includes("api key") || message.includes("not configured") || message.includes("missing");
}

export function compactPayload<T extends object>(payload: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ""),
  ) as Partial<T>;
}

function extractGeneratedText(response: Record<string, unknown>) {
  const keys = ["text", "content", "output", "response", "description", "readme", "caseStudy", "case_study"];
  for (const key of keys) {
    const value = response[key];
    if (typeof value === "string") return value;
  }

  const data = response.data;
  if (data && typeof data === "object") {
    return extractGeneratedText(data as Record<string, unknown>);
  }

  return JSON.stringify(response, null, 2);
}
