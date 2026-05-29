import { Badge, Card, SectionLabel } from "@projectbowl/ui";
import { stackGroups } from "@/lib/portfolio-data";

export function TechStackSection() {
  return (
    <section id="stack" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-2xl">
        <SectionLabel>Tech Stack</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Tools yang sering saya pakai buat shipping.</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stackGroups.map((group) => (
          <Card key={group.title} className="p-6" hover>
            <h3 className="font-display text-2xl font-semibold text-white">{group.title}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item, index) => (
                <Badge key={item} tone={index % 2 === 0 ? "purple" : "cyan"}>
                  {item}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
