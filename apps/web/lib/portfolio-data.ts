export type Project = {
  id?: string;
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
  visibility?: string;
  isFeatured?: boolean;
  coverImage?: { url: string; altText?: string | null };
};

export const profile = {
  name: "Achmad Ricky Radhiansyah Putra",
  shortName: "Achmad Ricky R.P.",
  role: "Fullstack developer",
  location: "Bandung & Bekasi, Indonesia · GMT+7",
  email: "radianp02@gmail.com",
  headline: "Dari ide mentah jadi produk digital yang siap launch.",
  intro:
    "Hi, saya Achmad Ricky Radhiansyah Putra — software engineering enthusiast yang suka bikin interface clean, backend yang pragmatic, dan workflow produk yang AI-ready.",
  availability: "Available untuk fullstack opportunities",
  socials: [
    { label: "GitHub", href: "https://github.com/Radian-File", handle: "@Radian-File" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/achmad-putra-934a4b313/", handle: "/achmad-putra" },
  ],
};

export const stats = [
  { value: "2+", label: "Tahun ngoding" },
  { value: "20+", label: "Project shipped" },
  { value: "12+", label: "Tools favorit" },
];

export const projects: Project[] = [
  {
    slug: "projectbowl",
    title: "ProjectBowl",
    badge: "Flagship",
    url: "projectbowl.app",
    summary: "AI-powered portfolio CMS untuk developer yang mau ngatur project, bikin copy, dan publish karya dengan lebih smooth.",
    description:
      "ProjectBowl bantu developer mengubah ide, repo, dan catatan project jadi portfolio story yang rapi, lengkap dengan dashboard, AI draft, dan workflow publish yang lebih sat-set.",
    impact: ["Dashboard project + portfolio publishing dalam satu workspace", "AI generate slug, summary, description, problem, dan solution", "Data project siap dipakai untuk portfolio public"],
    tech: ["Next.js", "Supabase", "OpenRouter", "Vercel"],
    status: "In progress",
    year: "2026",
  },
  {
    slug: "lumen-analytics",
    title: "Lumen Analytics",
    badge: "SaaS",
    url: "lumen-analytics.app",
    summary: "Dashboard analytics privacy-first untuk founder yang butuh insight cepat tanpa tracking yang ribet.",
    description:
      "Lumen Analytics dirancang sebagai analytics workspace yang ringan, realtime, dan mudah dibaca — cocok untuk validasi produk tanpa tenggelam di reporting yang terlalu noisy.",
    impact: ["Mockup realtime event stream", "Pattern funnel dan retention dashboard", "Eksplorasi data model yang privacy-first"],
    tech: ["Remix", "Postgres", "ClickHouse", "tRPC"],
    status: "Concept",
    year: "2025",
  },
  {
    slug: "drafty",
    title: "Drafty",
    badge: "AI",
    url: "drafty.app",
    summary: "AI writing companion untuk draft panjang, versioning, dan rewrite yang lebih terarah.",
    description:
      "Drafty membantu writer dan builder mengolah artikel, docs, dan research notes dengan suggestion AI yang explainable, editable, dan tetap terasa human.",
    impact: ["Versioned draft timeline", "Flow rewrite dan critique berbasis LLM", "Eksperimen local-first AI"],
    tech: ["React", "FastAPI", "pgvector", "Ollama"],
    status: "Prototype",
    year: "2025",
  },
  {
    slug: "pondok-stack",
    title: "Pondok Stack",
    badge: "Open source",
    url: "pondok-stack.app",
    summary: "Fullstack starter opinionated untuk validasi SaaS lebih cepat: auth, dashboard, docs, dan deploy-ready defaults.",
    description:
      "Pondok Stack adalah starter kit yang fokus ke speed tanpa mengorbankan struktur — cocok untuk ngebangun MVP yang tetap kelihatan polished dari hari pertama.",
    impact: ["Reusable auth dan billing shell", "Dashboard bento components", "Deployment recipes yang documented"],
    tech: ["Next.js", "Drizzle", "Stripe", "Tailwind"],
    status: "Maintained",
    year: "2024",
  },
];

export const aiFeatures = [
  {
    title: "Generate Draft Project Lengkap",
    endpoint: "POST /api/ai/generate/description",
    copy: "Ubah catatan kasar jadi slug, summary, description, problem, dan solution yang siap masuk portfolio.",
  },
  {
    title: "Generate README",
    endpoint: "POST /api/ai/generate/readme",
    copy: "Bikin README yang rapi: setup steps, architecture notes, commands, dan roadmap.",
  },
  {
    title: "Generate Case Study",
    endpoint: "POST /api/ai/generate/case-study",
    copy: "Ubah project yang sudah shipped jadi cerita portfolio yang punya problem, process, dan impact.",
  },
  {
    title: "Improve Existing Text",
    endpoint: "POST /api/ai/rewrite",
    copy: "Rewrite copy biar lebih clear, fun-professional, SEO-friendly, dan enak dibaca recruiter/client.",
  },
];

export const stackGroups = [
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Motion", "Remix"] },
  { title: "Backend", items: ["Node.js", "tRPC", "FastAPI", "Go", "GraphQL", "Postgres"] },
  { title: "Data & AI", items: ["OpenRouter", "Claude", "pgvector", "Drizzle", "Prisma", "ClickHouse"] },
  { title: "Cloud & DevX", items: ["Vercel", "Supabase", "Docker", "GitHub Actions", "Cloudflare", "Sentry"] },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
