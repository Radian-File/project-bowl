import { Button } from "@projectbowl/ui";
import { ArrowRight, Sparkles } from "lucide-react";

const stack = ["Next.js", "TypeScript", "Tailwind", "NestJS", "OpenRouter", "PostgreSQL"];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bowl-background text-bowl-text">
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-bowl-purple/30 blur-3xl" />
      <div className="absolute right-[-10%] top-20 h-96 w-96 rounded-full bg-bowl-cyan/20 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-xl">
          <div className="font-display text-lg font-bold tracking-tight">projectbowl.dev</div>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#planning" className="hover:text-white">Planning</a>
            <a href="#stack" className="hover:text-white">Stack</a>
            <a href="#api" className="hover:text-white">API</a>
          </div>
          <Button variant="secondary" className="px-4 py-2">Phase 2</Button>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-bowl-success" />
              Monorepo foundation · Figma-aligned dark system
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Build projects from idea to polished portfolio.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-bowl-muted">
              ProjectBowl is being prepared as an AI-powered project management and portfolio CMS. This Phase 2 starter sets up the monorepo, apps, shared packages, and Figma-inspired design foundation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button>
                Open dashboard shell <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="secondary">View docs</Button>
            </div>
          </div>

          <div id="planning" className="rounded-[2rem] border border-white/10 bg-bowl-card/70 p-5 shadow-glow backdrop-blur-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-bowl-muted">projectbowl.app/dashboard</p>
                  <h2 className="font-display text-2xl font-semibold">Workspace setup</h2>
                </div>
                <span className="rounded-full bg-bowl-success/15 px-3 py-1 text-xs font-semibold text-bowl-success">Online</span>
              </div>

              <div className="grid gap-3">
                {["apps/web — Next.js App Router", "apps/api — NestJS API", "packages/ui — shared UI", "packages/types — shared contracts"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="stack" className="grid gap-3 pb-10 md:grid-cols-6">
          {stack.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-slate-300 backdrop-blur-xl">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
