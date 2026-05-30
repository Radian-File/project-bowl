import type { ApiTechStack, TechStackCategory } from "@/lib/api";

export const techStackCategories: TechStackCategory[] = ["FRONTEND", "BACKEND", "DATABASE", "AI", "DEVOPS", "DESIGN", "OTHER"];

export type StackPreset = {
  name: string;
  category: TechStackCategory;
};

export type StackOption = StackPreset & {
  key: string;
  id?: string;
  source: "preset" | "saved";
};

export type SiteStackGroupName = "Frontend" | "Backend" | "Data & AI" | "Cloud & DevX";

export const siteStackGroups: SiteStackGroupName[] = ["Frontend", "Backend", "Data & AI", "Cloud & DevX"];

export const presetTechStacks: StackPreset[] = [
  // Frontend
  { name: "HTML", category: "FRONTEND" },
  { name: "CSS", category: "FRONTEND" },
  { name: "JavaScript", category: "FRONTEND" },
  { name: "TypeScript", category: "FRONTEND" },
  { name: "React", category: "FRONTEND" },
  { name: "Next.js", category: "FRONTEND" },
  { name: "Vue", category: "FRONTEND" },
  { name: "Nuxt", category: "FRONTEND" },
  { name: "Svelte", category: "FRONTEND" },
  { name: "SvelteKit", category: "FRONTEND" },
  { name: "Angular", category: "FRONTEND" },
  { name: "Astro", category: "FRONTEND" },
  { name: "Remix", category: "FRONTEND" },
  { name: "Vite", category: "FRONTEND" },
  { name: "Tailwind CSS", category: "FRONTEND" },
  { name: "Bootstrap", category: "FRONTEND" },
  { name: "Sass", category: "FRONTEND" },
  { name: "Framer Motion", category: "FRONTEND" },
  { name: "Motion", category: "FRONTEND" },
  { name: "Zustand", category: "FRONTEND" },
  { name: "Redux", category: "FRONTEND" },
  { name: "shadcn/ui", category: "FRONTEND" },
  { name: "Radix UI", category: "FRONTEND" },

  // Backend
  { name: "Node.js", category: "BACKEND" },
  { name: "Express", category: "BACKEND" },
  { name: "NestJS", category: "BACKEND" },
  { name: "Hono", category: "BACKEND" },
  { name: "Fastify", category: "BACKEND" },
  { name: "Bun", category: "BACKEND" },
  { name: "Deno", category: "BACKEND" },
  { name: "Python", category: "BACKEND" },
  { name: "FastAPI", category: "BACKEND" },
  { name: "Django", category: "BACKEND" },
  { name: "Flask", category: "BACKEND" },
  { name: "Go", category: "BACKEND" },
  { name: "Gin", category: "BACKEND" },
  { name: "Java", category: "BACKEND" },
  { name: "Spring Boot", category: "BACKEND" },
  { name: "PHP", category: "BACKEND" },
  { name: "Laravel", category: "BACKEND" },
  { name: "Ruby on Rails", category: "BACKEND" },
  { name: "GraphQL", category: "BACKEND" },
  { name: "tRPC", category: "BACKEND" },
  { name: "REST API", category: "BACKEND" },

  // Database / Data
  { name: "Supabase", category: "DATABASE" },
  { name: "PostgreSQL", category: "DATABASE" },
  { name: "Postgres", category: "DATABASE" },
  { name: "MySQL", category: "DATABASE" },
  { name: "SQLite", category: "DATABASE" },
  { name: "MongoDB", category: "DATABASE" },
  { name: "Redis", category: "DATABASE" },
  { name: "Prisma", category: "DATABASE" },
  { name: "Drizzle", category: "DATABASE" },
  { name: "Neon", category: "DATABASE" },
  { name: "PlanetScale", category: "DATABASE" },
  { name: "Firebase", category: "DATABASE" },
  { name: "Firestore", category: "DATABASE" },
  { name: "ClickHouse", category: "DATABASE" },
  { name: "pgvector", category: "DATABASE" },

  // AI
  { name: "OpenRouter", category: "AI" },
  { name: "OpenAI", category: "AI" },
  { name: "Anthropic", category: "AI" },
  { name: "Claude", category: "AI" },
  { name: "Gemini", category: "AI" },
  { name: "AI SDK", category: "AI" },
  { name: "LangChain", category: "AI" },
  { name: "LlamaIndex", category: "AI" },
  { name: "Ollama", category: "AI" },
  { name: "Hugging Face", category: "AI" },
  { name: "Pinecone", category: "AI" },
  { name: "Weaviate", category: "AI" },

  // DevOps / Cloud
  { name: "Vercel", category: "DEVOPS" },
  { name: "Netlify", category: "DEVOPS" },
  { name: "Cloudflare", category: "DEVOPS" },
  { name: "AWS", category: "DEVOPS" },
  { name: "GCP", category: "DEVOPS" },
  { name: "Azure", category: "DEVOPS" },
  { name: "Docker", category: "DEVOPS" },
  { name: "Kubernetes", category: "DEVOPS" },
  { name: "GitHub Actions", category: "DEVOPS" },
  { name: "GitLab CI", category: "DEVOPS" },
  { name: "Railway", category: "DEVOPS" },
  { name: "Render", category: "DEVOPS" },
  { name: "Fly.io", category: "DEVOPS" },
  { name: "Nginx", category: "DEVOPS" },
  { name: "Cloudinary", category: "DEVOPS" },
  { name: "Sentry", category: "DEVOPS" },

  // Design / Tools
  { name: "Figma", category: "DESIGN" },
  { name: "Storybook", category: "DESIGN" },
  { name: "Playwright", category: "DESIGN" },
  { name: "Cypress", category: "DESIGN" },
  { name: "Jest", category: "DESIGN" },
  { name: "Vitest", category: "DESIGN" },
  { name: "ESLint", category: "DESIGN" },
  { name: "Prettier", category: "DESIGN" },
  { name: "Turborepo", category: "DESIGN" },
  { name: "pnpm", category: "DESIGN" },
];

export function buildStackOptions(techStacks: ApiTechStack[], categoryFilter: TechStackCategory | "ALL", search: string): StackOption[] {
  const options = new Map<string, StackOption>();

  for (const preset of presetTechStacks) {
    options.set(normalizeTechKey(preset.name), {
      ...preset,
      key: normalizeTechKey(preset.name),
      source: "preset",
    });
  }

  for (const stack of techStacks) {
    const key = normalizeTechKey(stack.name);
    const existing = options.get(key);
    options.set(key, {
      name: stack.name,
      category: (stack.category as TechStackCategory | undefined) ?? existing?.category ?? "OTHER",
      key,
      id: stack.id,
      source: "saved",
    });
  }

  const query = normalizeTechKey(search);
  return Array.from(options.values())
    .filter((option) => categoryFilter === "ALL" || option.category === categoryFilter)
    .filter((option) => !query || normalizeTechKey(`${option.name} ${option.category}`).includes(query))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

export function isStackOptionSelected(option: StackOption, selectedIds: string[], techStacks: ApiTechStack[]) {
  if (option.id && selectedIds.includes(option.id)) return true;
  const matchingStack = findMatchingTechStack(techStacks, option.name);
  return matchingStack ? selectedIds.includes(matchingStack.id) : false;
}

export function findMatchingTechStack(techStacks: ApiTechStack[], name: string) {
  const targetKey = normalizeTechKey(name);
  return techStacks.find((tech) => normalizeTechKey(tech.name) === targetKey || normalizeTechKey(tech.slug ?? "") === targetKey);
}

export function normalizeTechKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/^@/, "")
    .replace(/[^a-z0-9+#]+/g, "");
}
