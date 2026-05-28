export type ProjectStatus = "IDEA" | "PLANNING" | "IN_PROGRESS" | "SHIPPED" | "ARCHIVED";

export type ProjectVisibility = "PRIVATE" | "PUBLIC" | "UNLISTED";

export type TechStackCategory =
  | "FRONTEND"
  | "BACKEND"
  | "DATABASE"
  | "AI"
  | "DEVOPS"
  | "DESIGN"
  | "OTHER";

export interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  isFeatured: boolean;
  techStacks: string[];
}

export interface ApiHealthResponse {
  status: "ok";
  service: "projectbowl-api";
  timestamp: string;
}
