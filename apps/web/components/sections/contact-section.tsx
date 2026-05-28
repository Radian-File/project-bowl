import { Badge, Button, Card, Input, SectionLabel, Textarea } from "@projectbowl/ui";
import { Calendar, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { profile } from "@/lib/portfolio-data";

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 md:p-8" hover>
          <SectionLabel>Open to opportunities</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            Got an idea? Let&apos;s build it together.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Whether it&apos;s a SaaS, an AI tool, or a portfolio site, send the rough version. I read every message and reply within 24 hours.
          </p>

          <form className="mt-8 grid gap-4" aria-label="Contact form placeholder">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input aria-label="Your name" placeholder="Jane Doe" />
              <Input aria-label="Email" type="email" placeholder="jane@company.com" />
            </div>
            <Input aria-label="Company or project" placeholder="Acme Inc. — optional" />
            <Textarea aria-label="Message" placeholder="What are you building? What does success look like? Any links, mockups or rough ideas welcome…" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Replies within 24h · Mon–Fri</p>
              <Button type="button">Send message</Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4">
          <Card className="p-6" hover>
            <Mail className="h-5 w-5 text-cyan-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">Email</h3>
            <Link href={`mailto:${profile.email}`} className="mt-2 block text-cyan-100 hover:text-white">
              {profile.email}
            </Link>
            <p className="mt-2 text-sm text-slate-500">Best for project briefs.</p>
          </Card>
          <Card className="p-6" hover>
            <Calendar className="h-5 w-5 text-violet-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">Book a call</h3>
            <p className="mt-2 text-cyan-100">cal.com/rickyrp</p>
            <p className="mt-2 text-sm text-slate-500">30 min · free intro chat.</p>
          </Card>
          <Card className="p-6" hover>
            <MapPin className="h-5 w-5 text-lime-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">Where I work</h3>
            <p className="mt-2 text-slate-300">Bandung, Indonesia</p>
            <div className="mt-3 flex items-center gap-2">
              <Badge tone="lime">Online now</Badge>
              <span className="text-sm text-slate-500">Remote, worldwide</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
