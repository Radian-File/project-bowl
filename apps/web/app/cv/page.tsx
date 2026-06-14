import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, Mail } from "lucide-react";
import { PortfolioSectionLabel, portfolioButtonClasses } from "@/components/portfolio-ui";
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
    <main className="relative min-h-screen bg-ink-bg text-ink-text">
      <div className="relative">
        <Navbar />
        <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-12 md:pt-16">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink-text">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <PortfolioSectionLabel>Curriculum Vitae</PortfolioSectionLabel>
              <h1 className="font-editorial text-5xl font-bold leading-[0.95] tracking-tight text-ink-text md:text-7xl">CV Achmad Ricky Radhiansyah Putra</h1>
              <p className="mt-5 text-lg leading-8 text-ink-muted">
                Preview CV terbaru saya. Kalau preview PDF tidak tampil di browser kamu, buka di tab baru atau download langsung.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Link href={cvPath} download className={portfolioButtonClasses({ className: "justify-center" })}>
                Download CV <Download className="h-4 w-4" />
              </Link>
              <Link href={cvPath} target="_blank" rel="noreferrer" className={portfolioButtonClasses({ variant: "secondary", className: "justify-center" })}>
                Open in new tab <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-ink-border">
            <iframe src={cvPath} title="CV Achmad Ricky Radhiansyah Putra" className="h-[80vh] w-full bg-white" />
          </div>

          <div className="mt-6 rounded-xl border border-ink-border bg-ink-surface p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-ink-text">Tertarik ngobrol?</h2>
                <p className="mt-1 text-sm text-ink-muted">Email saya di {profile.email} atau langsung chat WhatsApp untuk diskusi project.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={`mailto:${profile.email}`} className={portfolioButtonClasses({ variant: "secondary", size: "sm", className: "justify-center" })}>
                  <Mail className="h-4 w-4" /> Email
                </Link>
                <Link href={whatsappUrl} target="_blank" rel="noreferrer" className={portfolioButtonClasses({ variant: "secondary", size: "sm", className: "justify-center" })}>
                  WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
