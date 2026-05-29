import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Badge, Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
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
    <main className="relative min-h-screen overflow-hidden bg-bowl-background text-bowl-text">
      <div className="pointer-events-none fixed left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-bowl-purple/25 blur-3xl" />
      <div className="pointer-events-none fixed right-[-12rem] top-24 h-[34rem] w-[34rem] rounded-full bg-bowl-cyan/20 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />

      <div className="relative">
        <Navbar />
        <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <Link href="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel>{project.badge}</SectionLabel>
              <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-white md:text-7xl">{project.title}</h1>
              <p className="mt-6 text-xl leading-9 text-slate-300">{project.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`https://${project.url}`} className={buttonClasses()}>
                  Visit placeholder <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/#contact" className={buttonClasses({ variant: "secondary" })}>
                  Discuss similar work
                </Link>
              </div>
            </div>

            <Card className="overflow-hidden p-0" hover>
              <div className="relative h-72 border-b border-white/10 bg-[#0D111B] p-5">
                {project.coverImage?.url ? (
                  <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${project.coverImage.url})` }} />
                ) : null}
                <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35 p-5 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.34),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.24),transparent_35%)]" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between gap-4">
                      <span className="truncate text-sm text-slate-300">{project.url}</span>
                      <Badge tone="lime">{project.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="h-16 rounded-2xl border border-white/10 bg-white/[0.06]" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Year</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-white">{project.year}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-white">{project.status}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
            <Card className="p-6 md:p-8">
              <h2 className="font-display text-3xl font-semibold text-white">Impact notes</h2>
              <div className="mt-6 grid gap-4">
                {project.impact.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="font-display text-3xl font-semibold text-white">Stack</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} tone="purple">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
