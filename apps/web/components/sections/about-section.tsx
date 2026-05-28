import { Badge, Card, SectionLabel } from "@projectbowl/ui";
import { Code2, Coffee, Globe2, Infinity, Rocket, Sparkles } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

const tiles = [
  { icon: Rocket, title: "Idea → Deploy", copy: "in days, not months" },
  { icon: Sparkles, title: "AI-native", copy: "LLMs, embeddings, agents" },
  { icon: Code2, title: "Open source", copy: "contributor & maintainer" },
  { icon: Infinity, title: "∞ cups of coffee", copy: "and a bias for shipping" },
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <SectionLabel>About</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">A little about me.</h2>
        <p className="mt-4 text-lg leading-8 text-slate-400">
          Bento snapshot — what I do, what I love, and how I turn product ideas into polished experiences.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
        <Card className="p-7 lg:col-span-2 lg:row-span-2" hover>
          <Badge tone="cyan">Fullstack engineer</Badge>
          <h3 className="mt-6 font-display text-3xl font-semibold text-white">Focused on shipping clean, fast, useful software.</h3>
          <p className="mt-4 leading-8 text-slate-300">
            I love the whole loop — designing the UI, modelling data, building APIs, and polishing the details until the product feels effortless.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
              <Globe2 className="h-4 w-4 text-cyan-300" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
              <Coffee className="h-4 w-4 text-violet-300" /> Lo-fi · Synthwave · Tame Impala
            </span>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2" hover>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Current work</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-white">Building ProjectBowl — an AI-powered portfolio CMS.</h3>
          <p className="mt-3 text-slate-400">Next.js · Supabase · Claude</p>
        </Card>

        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card key={tile.title} className="p-6" hover>
              <Icon className="h-6 w-6 text-cyan-300" />
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{tile.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{tile.copy}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
