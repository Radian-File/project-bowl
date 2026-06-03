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

export function suggestStackOptionsFromHints(hints: string[], techStacks: ApiTechStack[]) {
  const options = buildStackOptions(techStacks, "ALL", "");
  const optionsByKey = new Map(options.map((option) => [normalizeTechKey(option.name), option]));
  const suggestions = new Map<string, StackOption>();

  for (const hint of hints) {
    const key = normalizeTechKey(hint);
    if (!key) continue;

    const canonicalName = stackHintAliases[key] ?? hint;
    const option = optionsByKey.get(normalizeTechKey(canonicalName));
    if (option) suggestions.set(normalizeTechKey(option.name), option);
  }

  return Array.from(suggestions.values());
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

const stackHintAliases: Record<string, string> = Object.fromEntries(
  Object.entries({
    next: "Next.js",
    nextjs: "Next.js",
    "next.js": "Next.js",
    react: "React",
    "react-dom": "React",
    typescript: "TypeScript",
    ts: "TypeScript",
    javascript: "JavaScript",
    js: "JavaScript",
    tailwind: "Tailwind CSS",
    tailwindcss: "Tailwind CSS",
    "@tailwindcss/postcss": "Tailwind CSS",
    "framer-motion": "Framer Motion",
    motion: "Motion",
    vue: "Vue",
    nuxt: "Nuxt",
    svelte: "Svelte",
    sveltekit: "SvelteKit",
    angular: "Angular",
    astro: "Astro",
    remix: "Remix",
    vite: "Vite",
    zustand: "Zustand",
    redux: "Redux",
    "@reduxjs/toolkit": "Redux",
    "shadcn/ui": "shadcn/ui",
    "@radix-ui/react-dialog": "Radix UI",
    "@radix-ui/react-dropdown-menu": "Radix UI",
    node: "Node.js",
    nodejs: "Node.js",
    "node.js": "Node.js",
    express: "Express",
    nestjs: "NestJS",
    "@nestjs/core": "NestJS",
    hono: "Hono",
    fastify: "Fastify",
    bun: "Bun",
    deno: "Deno",
    python: "Python",
    fastapi: "FastAPI",
    django: "Django",
    flask: "Flask",
    go: "Go",
    golang: "Go",
    gin: "Gin",
    java: "Java",
    "spring-boot": "Spring Boot",
    php: "PHP",
    laravel: "Laravel",
    graphql: "GraphQL",
    trpc: "tRPC",
    "@trpc/server": "tRPC",
    "@trpc/client": "tRPC",
    supabase: "Supabase",
    "@supabase/supabase-js": "Supabase",
    "@supabase/ssr": "Supabase",
    postgresql: "PostgreSQL",
    postgres: "PostgreSQL",
    pg: "PostgreSQL",
    mysql: "MySQL",
    sqlite: "SQLite",
    mongodb: "MongoDB",
    mongoose: "MongoDB",
    redis: "Redis",
    prisma: "Prisma",
    "@prisma/client": "Prisma",
    drizzle: "Drizzle",
    "drizzle-orm": "Drizzle",
    neon: "Neon",
    "@neondatabase/serverless": "Neon",
    firebase: "Firebase",
    firestore: "Firestore",
    clickhouse: "ClickHouse",
    "@clickhouse/client": "ClickHouse",
    pgvector: "pgvector",
    openrouter: "OpenRouter",
    openai: "OpenAI",
    "@anthropic-ai/sdk": "Anthropic",
    anthropic: "Anthropic",
    claude: "Claude",
    gemini: "Gemini",
    "@google/generative-ai": "Gemini",
    ai: "AI SDK",
    "ai-sdk": "AI SDK",
    "@ai-sdk/openai": "AI SDK",
    "@ai-sdk/anthropic": "AI SDK",
    "@ai-sdk/google": "AI SDK",
    langchain: "LangChain",
    "@langchain/core": "LangChain",
    llamaindex: "LlamaIndex",
    ollama: "Ollama",
    "hugging-face": "Hugging Face",
    huggingface: "Hugging Face",
    pinecone: "Pinecone",
    weaviate: "Weaviate",
    vercel: "Vercel",
    "@vercel/analytics": "Vercel",
    "@vercel/speed-insights": "Vercel",
    netlify: "Netlify",
    cloudflare: "Cloudflare",
    aws: "AWS",
    gcp: "GCP",
    azure: "Azure",
    docker: "Docker",
    kubernetes: "Kubernetes",
    githubactions: "GitHub Actions",
    "github-actions": "GitHub Actions",
    railway: "Railway",
    render: "Render",
    flyio: "Fly.io",
    nginx: "Nginx",
    cloudinary: "Cloudinary",
    sentry: "Sentry",
    "@sentry/nextjs": "Sentry",
    figma: "Figma",
    storybook: "Storybook",
    playwright: "Playwright",
    cypress: "Cypress",
    jest: "Jest",
    vitest: "Vitest",
    eslint: "ESLint",
    prettier: "Prettier",
    turborepo: "Turborepo",
    turbo: "Turborepo",
    pnpm: "pnpm",
  }).map(([key, value]) => [normalizeTechKey(key), value]),
);

export function normalizeTechKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/^@/, "")
    .replace(/[^a-z0-9+#]+/g, "");
}
