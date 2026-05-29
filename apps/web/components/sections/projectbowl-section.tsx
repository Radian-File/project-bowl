import { Badge, Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Project hub terpusat — dashboard + portfolio dalam satu flow",
  "AI bantu generate slug, summary, description, problem, dan solution",
  "Publish-ready content untuk portfolio site",
  "Data project siap dipakai ulang di mana pun",
];

export function ProjectBowlSection() {
  return (
    <section id="projectbowl" className="mx-auto w-full max-w-6xl px-6 py-20">
      <Card className="relative overflow-hidden p-6 md:p-10" hover>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(124,58,237,0.32),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(6,182,212,0.22),transparent_35%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionLabel>Flagship product</SectionLabel>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
              Kenalan dengan ProjectBowl — AI portfolio CMS buat developer.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              ProjectBowl bantu developer mengubah repo, catatan, dan ide mentah jadi portfolio story yang rapi, reusable, dan siap dipublish.
            </p>
            <div className="mt-7 grid gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-slate-200">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects/projectbowl" className={buttonClasses()}>
                Buka ProjectBowl <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#ai" className={buttonClasses({ variant: "secondary" })}>
                <Play className="h-4 w-4" /> Lihat demo
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#080A0F]/70 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">projectbowl.app/dashboard</p>
                  <h3 className="font-display text-xl font-semibold text-white">8 in progress · 2 siap publish</h3>
                </div>
                <Badge tone="purple">Generate</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["Backlog", "3"],
                  ["In progress", "2"],
                  ["Shipped", "4"],
                ].map(([column, count]) => (
                  <div key={column} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{column}</span>
                      <span className="text-slate-500">({count})</span>
                    </div>
                    <div className="space-y-3">
                      {["AI-ready", "Draft", "Review"].map((label) => (
                        <div key={`${column}-${label}`} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                          <Badge tone={label === "AI-ready" ? "cyan" : "slate"}>{label}</Badge>
                          <div className="mt-3 h-2 rounded-full bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
                AI suggestion: Tambahkan case study untuk Lumen Analytics, lalu publish bareng update portfolio berikutnya.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
