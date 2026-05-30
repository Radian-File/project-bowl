import { Badge, Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { profile } from "@/lib/portfolio-data";

const serviceUrl = "https://rrs-website.vercel.app";
const phoneNumber = "+62 812 9524 8513";
const whatsappUrl = "https://wa.me/6281295248513";

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 md:p-8" hover>
          <SectionLabel>Mau bikin website?</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            Mau bikin website? Saya bantu dari ide sampai online.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Butuh landing page, company profile, portfolio, dashboard, atau website custom? Saya bisa bantu bikin tampilan yang clean, responsive, dan siap dipakai untuk jualan, promosi, atau validasi ide.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm leading-6 text-slate-400">
              Langsung lihat layanan, contoh paket, dan cara mulai project di RRS Website. Kalau cocok, kamu bisa lanjut diskusi kebutuhan tanpa harus isi form panjang di sini.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={serviceUrl} target="_blank" rel="noreferrer" className={buttonClasses({ className: "justify-center" })}>
                Lihat jasa website <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={whatsappUrl} target="_blank" rel="noreferrer" className={buttonClasses({ variant: "secondary", className: "justify-center" })}>
                Chat WhatsApp
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="p-6" hover>
            <Mail className="h-5 w-5 text-cyan-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">Email</h3>
            <Link href={`mailto:${profile.email}`} className="mt-2 block text-cyan-100 hover:text-white">
              {profile.email}
            </Link>
            <p className="mt-2 text-sm text-slate-500">Paling enak untuk brief project dan kerja sama.</p>
          </Card>
          <Card className="p-6" hover>
            <Phone className="h-5 w-5 text-violet-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">WhatsApp / Telepon</h3>
            <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-2 block text-cyan-100 hover:text-white">
              {phoneNumber}
            </Link>
            <p className="mt-2 text-sm text-slate-500">Chat dulu untuk diskusi kebutuhan website.</p>
          </Card>
          <Card className="p-6" hover>
            <MapPin className="h-5 w-5 text-lime-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">Lokasi kerja</h3>
            <p className="mt-2 text-slate-300">Bandung & Bekasi, Indonesia</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="lime">Online now</Badge>
              <span className="text-sm text-slate-500">Remote · Bandung/Bekasi available</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
