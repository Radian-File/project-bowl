import { Badge, Button, Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { ArrowDownToLine, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { profile, stats } from "@/lib/portfolio-data";

export function HeroSection() {
  return (
    <section className="relative mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-6xl items-center gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
      <div>
        <SectionLabel>{profile.availability}</SectionLabel>
        <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight text-white md:text-7xl lg:text-8xl">
          Dari ide mentah jadi produk digital yang siap launch.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">{profile.intro}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="#projects" className={buttonClasses({ size: "lg" })}>
            Lihat Projects <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#projectbowl" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            Buka ProjectBowl
          </Link>
          <Button variant="ghost" size="lg" title="CV file will be connected later">
            Download CV <ArrowDownToLine className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid max-w-2xl gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-5">
              <div className="font-display text-3xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="relative overflow-hidden p-4 shadow-glow" hover>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.26),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.18),transparent_30%)]" />
        <div className="relative rounded-[1.25rem] border border-white/10 bg-black/35 p-5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">projectbowl.app</p>
              <h2 className="font-display text-2xl font-semibold text-white">Workspace Portfolio</h2>
            </div>
            <Badge tone="lime">Online</Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              {['Dashboard', 'Projects', 'AI Studio', 'Publish'].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    index === 1 ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.04] text-slate-300'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI suggestion</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">Card siap publish</h3>
                </div>
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="space-y-3">
                {['ProjectBowl', 'Lumen Analytics', 'Drafty'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-[#101624] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-white">{item}</span>
                      <Badge tone="purple">AI-ready</Badge>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
