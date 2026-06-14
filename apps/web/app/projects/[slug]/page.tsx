import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PortfolioBadge, PortfolioSectionLabel, portfolioButtonClasses } from "@/components/portfolio-ui";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getPublicProjectFromSupabase } from "@/lib/data/projects";
import { normalizeApiProject } from "@/lib/project-view";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProjectForPage(slug: string) {
  try {
    const apiProject = await getPublicProjectFromSupabase(slug);
    return normalizeApiProject(apiProject);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectForPage(slug);

  if (!project) {
    return { title: "Project not found · ricky.dev" };
  }

  return {
    title: `${project.title} · ricky.dev`,
    description: project.summary,
    openGraph: {
      title: `${project.title} · ricky.dev`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectForPage(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-ink-bg text-ink-text">
      <div className="relative">
        <Navbar />
        <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-12 md:pt-16">
          <Link href="/#projects" className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink-text">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>

          <PortfolioSectionLabel>{project.badge}</PortfolioSectionLabel>
          <h1 className="font-editorial text-5xl font-bold leading-[0.95] tracking-tight text-ink-text md:text-7xl">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-ink-muted">{project.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`https://${project.url}`} className={portfolioButtonClasses()}>
              Visit project <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/#contact" className={portfolioButtonClasses({ variant: "secondary" })}>
              Discuss similar work
            </Link>
          </div>

          <dl className="mt-12 grid gap-px overflow-hidden rounded-xl border border-ink-border bg-ink-border sm:grid-cols-3">
            <div className="bg-ink-surface px-6 py-6">
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">Year</dt>
              <dd className="mt-2 font-editorial text-2xl font-semibold text-ink-text">{project.year}</dd>
            </div>
            <div className="bg-ink-surface px-6 py-6">
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">Status</dt>
              <dd className="mt-2 font-editorial text-2xl font-semibold text-ink-text">{project.status}</dd>
            </div>
            <div className="bg-ink-surface px-6 py-6">
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">Link</dt>
              <dd className="mt-2 truncate font-mono text-sm text-ink-muted">{project.url}</dd>
            </div>
          </dl>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-ink-border bg-ink-border lg:grid-cols-[1fr_0.6fr]">
            <div className="bg-ink-surface p-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">Impact notes</h2>
              <ul className="mt-6 flex flex-col">
                {project.impact.map((item, index) => (
                  <li key={item} className="flex items-baseline gap-4 border-t border-ink-border py-4 first:border-t-0">
                    <span className="font-mono text-xs text-ink-accent">{String(index + 1).padStart(2, "0")}</span>
                    <span className="leading-7 text-ink-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-ink-surface p-8">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">Stack</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <PortfolioBadge key={tech}>{tech}</PortfolioBadge>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
