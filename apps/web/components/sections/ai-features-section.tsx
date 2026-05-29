import { Badge, Card, SectionLabel } from "@projectbowl/ui";
import { WandSparkles } from "lucide-react";
import { aiFeatures } from "@/lib/portfolio-data";

export function AiFeaturesSection() {
  return (
    <section id="ai" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-3xl">
        <SectionLabel>AI Studio</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Satu prompt. Banyak copy siap pakai.</h2>
        <p className="mt-4 text-lg leading-8 text-slate-400">
          ProjectBowl punya AI flow yang bantu mengubah bahan mentah project jadi launch assets yang rapi, fun, dan profesional.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {aiFeatures.map((feature) => (
          <Card key={feature.title} className="p-6" hover>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                <WandSparkles className="h-5 w-5" />
              </div>
              <Badge tone="cyan">{feature.endpoint}</Badge>
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{feature.copy}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
