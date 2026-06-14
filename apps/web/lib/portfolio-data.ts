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

export const featuredProjectSlugs = [
  "rrs-project-marketplace-portofolio-freelance",
  "projectbowl-cms-portofolio-developer-ai-dashboard",
  "fintrack-pengelola-keuangan-whatsapp-ai",
  "rrs-pay-sistem-payroll-desktop-wpf-sqlite",
];

export const projects: Project[] = [
  {
    slug: "rrs-project-marketplace-portofolio-freelance",
    title: "RRS Project",
    badge: "Flagship",
    url: "rrs-porto.vercel.app",
    summary: "Marketplace portofolio freelance full-stack: portfolio publik, katalog layanan, order klien, dan dashboard owner.",
    description:
      "Marketplace freelance production-oriented dengan portfolio publik, service catalog, client ordering, dan owner dashboard. Dibangun pakai Next.js, TypeScript, PostgreSQL, Prisma, dan Supabase Storage.",
    impact: [
      "8+ modul: auth 2 role, order management, Midtrans payment gateway",
      "File delivery dengan signed URLs, messaging, invoice generation",
      "Business analytics dashboard untuk owner",
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Supabase", "Midtrans"],
    status: "Shipped",
    year: "2025",
  },
  {
    slug: "projectbowl-cms-portofolio-developer-ai-dashboard",
    title: "ProjectBowl",
    badge: "AI",
    url: "projectbowl.app",
    summary: "CMS portofolio developer berbasis AI dengan dashboard manajemen proyek dalam satu monorepo.",
    description:
      "Monorepo CMS dan project management dashboard pakai Next.js fullstack, TypeScript, Supabase Auth, PostgreSQL, dan Turborepo dengan shared packages architecture.",
    impact: [
      "OpenRouter AI untuk generate description, README, dan case study",
      "15+ internal REST API routes: projects, tasks, milestones, tech stacks, activity logs",
      "Shared packages architecture lewat Turborepo monorepo",
    ],
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Turborepo", "OpenRouter"],
    status: "In progress",
    year: "2025",
  },
  {
    slug: "fintrack-pengelola-keuangan-whatsapp-ai",
    title: "FinTrack",
    badge: "AI",
    url: "github.com/Radian-File",
    summary: "Personal finance tracker Android berbasis AI yang parse bahasa natural Indonesia jadi transaksi terstruktur.",
    description:
      "Cross-platform finance tracker dengan backend Express.js dan Android app Kotlin/Jetpack Compose. Integrasi OpenRouter + DeepSeek untuk parsing natural language Indonesia ke transaction records.",
    impact: [
      "11 fase: transaction CRUD, budget management dengan usage tracking",
      "AI monthly insights + JWT authentication",
      "WhatsApp Cloud API webhook integration",
    ],
    tech: ["Express.js", "Kotlin", "Jetpack Compose", "OpenRouter", "DeepSeek"],
    status: "Shipped",
    year: "2025",
  },
  {
    slug: "rrs-pay-sistem-payroll-desktop-wpf-sqlite",
    title: "RRS Pay",
    badge: "Desktop",
    url: "github.com/Radian-File",
    summary: "Sistem payroll desktop WPF dengan arsitektur local-first: employee, attendance, payroll runs, dan audit logging.",
    description:
      "WPF desktop payroll MVP di .NET 10 dengan SQLite. Mencakup manajemen employee/department/position, attendance, payroll runs, dan audit logging dengan CSV export.",
    impact: [
      "Local-first data architecture dengan backup/restore utilities",
      "QuestPDF payslip generation",
      "ClosedXML spreadsheet export untuk payroll reporting",
    ],
    tech: [".NET", "WPF", "SQLite", "QuestPDF", "ClosedXML"],
    status: "In progress",
    year: "2026",
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
