"use client";

import { Badge, Card, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/language-provider";
import { profile } from "@/lib/portfolio-data";

const serviceUrl = "https://rrs-website.vercel.app";
const phoneNumber = "+62 812 9524 8513";
const whatsappUrl = "https://wa.me/6281295248513";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 md:p-8" hover>
          <SectionLabel>{t.contact.label}</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">{t.contact.title}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">{t.contact.body}</p>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm leading-6 text-slate-400">{t.contact.ctaBody}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={serviceUrl} target="_blank" rel="noreferrer" className={buttonClasses({ className: "justify-center" })}>
                {t.contact.service} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={whatsappUrl} target="_blank" rel="noreferrer" className={buttonClasses({ variant: "secondary", className: "justify-center" })}>
                {t.contact.whatsapp}
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
            <p className="mt-2 text-sm text-slate-500">{t.contact.emailHelp}</p>
          </Card>
          <Card className="p-6" hover>
            <Phone className="h-5 w-5 text-violet-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">{t.contact.phoneTitle}</h3>
            <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-2 block text-cyan-100 hover:text-white">
              {phoneNumber}
            </Link>
            <p className="mt-2 text-sm text-slate-500">{t.contact.phoneHelp}</p>
          </Card>
          <Card className="p-6" hover>
            <MapPin className="h-5 w-5 text-lime-300" />
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">{t.contact.locationTitle}</h3>
            <p className="mt-2 text-slate-300">{t.contact.location}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="lime">Online now</Badge>
              <span className="text-sm text-slate-500">{t.contact.remote}</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
