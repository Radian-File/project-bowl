export type Project = {
  slug: string;
  title: string;
  badge: string;
  url: string;
  summary: string;
  description: string;
  impact: string[];
  tech: string[];
  status: string;
  year: string;
};

export const profile = {
  name: "Achmad Ricky Radhiansyah Putra",
  shortName: "Achmad Ricky R.P.",
  role: "Fullstack developer",
  location: "Bandung, Indonesia · GMT+7",
  email: "hi@ricky.dev",
  headline: "Building digital products from idea to deployment.",
  intro:
    "Hi, I’m Achmad Ricky Radhiansyah Putra — a software engineering enthusiast focused on clean interfaces, pragmatic backends, and AI-native product workflows.",
  availability: "Available for fullstack opportunities",
  socials: [
    { label: "GitHub", href: "https://github.com/rickyrp", handle: "@rickyrp" },
    { label: "LinkedIn", href: "https://linkedin.com/in/rickyrp", handle: "/rickyrp" },
    { label: "X", href: "https://x.com/rickyrp", handle: "@rickyrp" },
  ],
};

export const stats = [
  { value: "4+", label: "Years coding" },
  { value: "20+", label: "Projects shipped" },
  { value: "12+", label: "Stack tools" },
];

export const projects: Project[] = [
  {
    slug: "projectbowl",
    title: "ProjectBowl",
    badge: "Flagship",
    url: "projectbowl.app",
    summary: "AI-powered project management and portfolio CMS for developers shipping in public.",
    description:
      "ProjectBowl centralizes project planning, AI-generated documentation, case studies, and one-click portfolio publishing in a single workspace.",
    impact: ["Kanban and portfolio publishing in one hub", "AI-generated project descriptions, READMEs, and case studies", "Embeddable project API for personal sites"],
    tech: ["Next.js", "Supabase", "Claude", "tRPC"],
    status: "In progress",
    year: "2026",
  },
  {
    slug: "lumen-analytics",
    title: "Lumen Analytics",
    badge: "SaaS",
    url: "lumen-analytics.app",
    summary: "Privacy-first product analytics dashboard with realtime funnels and retention views.",
    description:
      "A lightweight analytics workspace for founders who want fast answers without invasive tracking scripts or bloated reporting.",
    impact: ["Realtime event stream mockups", "Conversion and retention dashboard patterns", "Privacy-first data model exploration"],
    tech: ["Remix", "Postgres", "ClickHouse", "tRPC"],
    status: "Concept",
    year: "2025",
  },
  {
    slug: "drafty",
    title: "Drafty",
    badge: "AI",
    url: "drafty.app",
    summary: "Long-form AI writing companion with versioned drafts, citations, and local model support.",
    description:
      "Drafty helps writers iterate on articles, docs, and research notes with explainable AI suggestions and edit history.",
    impact: ["Versioned draft timeline", "LLM rewrite and critique flows", "Local-first AI experimentation"],
    tech: ["React", "FastAPI", "pgvector", "Ollama"],
    status: "Prototype",
    year: "2025",
  },
  {
    slug: "pondok-stack",
    title: "Pondok Stack",
    badge: "Open source",
    url: "pondok-stack.app",
    summary: "Opinionated fullstack starter with auth, billing, dashboards, docs, and deployment defaults.",
    description:
      "A reusable starter kit for quickly validating SaaS ideas with production-minded conventions and a polished UI foundation.",
    impact: ["Reusable auth and billing shell", "Dashboard bento components", "Documented deployment recipes"],
    tech: ["Next.js", "Drizzle", "Stripe", "Tailwind"],
    status: "Maintained",
    year: "2024",
  },
];

export const aiFeatures = [
  {
    title: "Generate Project Description",
    endpoint: "POST /api/generate/description",
    copy: "Turn rough notes, repo metadata, and goals into polished portfolio copy.",
  },
  {
    title: "Generate README",
    endpoint: "POST /api/generate/readme",
    copy: "Create structured READMEs with setup steps, architecture notes, and roadmap sections.",
  },
  {
    title: "Generate Case Study",
    endpoint: "POST /api/generate/case-study",
    copy: "Shape a shipped project into a concise narrative with problem, process, and outcomes.",
  },
  {
    title: "Improve Existing Text",
    endpoint: "POST /api/rewrite",
    copy: "Rewrite descriptions for clarity, tone, SEO, or recruiter-friendly summaries.",
  },
];

export const stackGroups = [
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Motion", "Remix"] },
  { title: "Backend", items: ["Node.js", "tRPC", "FastAPI", "Go", "GraphQL", "Postgres"] },
  { title: "Data & AI", items: ["Claude", "OpenAI", "pgvector", "Drizzle", "Prisma", "ClickHouse"] },
  { title: "Cloud & DevX", items: ["Vercel", "Supabase", "Docker", "GitHub Actions", "Cloudflare", "Sentry"] },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
