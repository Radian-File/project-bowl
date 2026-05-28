import type { ApiImage, ApiProject, ApiTechStack, ProjectTechStackLink } from "@/lib/api";
import type { Project } from "@/lib/portfolio-data";

function titleCase(value?: string | null) {
  if (!value) return "Project";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stripProtocol(value?: string | null) {
  return value?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? "projectbowl.local";
}

function isTechStack(value: unknown): value is ApiTechStack {
  return Boolean(value && typeof value === "object" && "name" in value);
}

function isTechStackLink(value: unknown): value is ProjectTechStackLink {
  return Boolean(value && typeof value === "object" && "techStack" in value);
}

export function getTechNames(project: ApiProject) {
  if (Array.isArray(project.tech) && project.tech.length > 0) return project.tech;

  const techStacks = project.techStacks ?? [];
  return techStacks
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (isTechStackLink(entry)) return entry.techStack?.name;
      if (isTechStack(entry)) return entry.name;
      return undefined;
    })
    .filter((value): value is string => Boolean(value));
}

export function getTechIds(project: ApiProject) {
  const techStacks = project.techStacks ?? [];
  return techStacks
    .map((entry) => {
      if (typeof entry === "string") return undefined;
      if (isTechStackLink(entry)) return entry.techStackId ?? entry.techStack?.id;
      if (isTechStack(entry)) return entry.id;
      return undefined;
    })
    .filter((value): value is string => Boolean(value));
}

export function getCoverImage(project: ApiProject) {
  const images = project.images ?? [];
  return images.find((image) => image.type === "COVER") ?? images[0];
}

export function normalizeApiProject(project: ApiProject): Project & { id?: string; visibility?: string; isFeatured?: boolean; coverImage?: ApiImage } {
  const tech = getTechNames(project);
  const year = project.completedAt ?? project.startedAt ?? project.publishedAt ?? project.createdAt;
  const status = titleCase(project.status ?? "IDEA");
  const impact = [project.problem, project.solution]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.length > 150 ? `${value.slice(0, 147)}...` : value);

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    badge: project.isFeatured ? "Flagship" : status,
    url: stripProtocol(project.liveUrl ?? project.repositoryUrl ?? project.caseStudyUrl),
    summary: project.summary,
    description: project.description ?? project.summary,
    impact: impact.length > 0 ? impact : [project.summary, project.description ?? "Published from ProjectBowl CMS"],
    tech: tech.length > 0 ? tech : ["ProjectBowl"],
    status,
    year: year ? new Date(year).getFullYear().toString() : "2026",
    visibility: project.visibility,
    isFeatured: project.isFeatured,
    coverImage: getCoverImage(project),
  };
}
