import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, Mail } from "lucide-react";
import { Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { Navbar } from "@/components/layout/navbar";
import { profile } from "@/lib/portfolio-data";

const cvPath = "/achmad-ricky-radhiansyah-putra-cv.pdf";
const whatsappUrl = "https://wa.me/6281295248513";

export const metadata: Metadata = {
  title: "CV · Achmad Ricky R.P.",
  description: "Preview dan download CV Achmad Ricky Radhiansyah Putra.",
};

export default function CvPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bowl-background text-bowl-text">
      <div className="pointer-events-none fixed left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-bowl-purple/25 blur-3xl" />
      <div className="pointer-events-none fixed right-[-12rem] top-24 h-[34rem] w-[34rem] rounded-full bg-bowl-cyan/20 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />

      <div className="relative">
        <Navbar />
        <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:pt-16">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <SectionLabel>Curriculum Vitae</SectionLabel>
              <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-white md:text-7xl">CV Achmad Ricky Radhiansyah Putra</h1>
              <p className="mt-5 text-lg leading-8 text-slate-400">
                Preview CV terbaru saya. Kalau preview PDF tidak tampil di browser kamu, buka di tab baru atau download langsung.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Link href={cvPath} download className={buttonClasses({ className: "justify-center" })}>
                Download CV <Download className="h-4 w-4" />
              </Link>
              <Link href={cvPath} target="_blank" rel="noreferrer" className={buttonClasses({ variant: "secondary", className: "justify-center" })}>
                Open in new tab <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <Card className="overflow-hidden p-0">
            <iframe src={cvPath} title="CV Achmad Ricky Radhiansyah Putra" className="h-[80vh] w-full bg-white" />
          </Card>

          <Card className="mt-6 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-white">Tertarik ngobrol?</h2>
                <p className="mt-1 text-sm text-slate-500">Email saya di {profile.email} atau langsung chat WhatsApp untuk diskusi project.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={`mailto:${profile.email}`} className={buttonClasses({ variant: "outline", size: "sm", className: "justify-center" })}>
                  <Mail className="h-4 w-4" /> Email
                </Link>
                <Link href={whatsappUrl} target="_blank" rel="noreferrer" className={buttonClasses({ variant: "secondary", size: "sm", className: "justify-center" })}>
                  WhatsApp
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
