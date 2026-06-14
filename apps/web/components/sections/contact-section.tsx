"use client";

import { PortfolioBadge, PortfolioSectionLabel, portfolioButtonClasses } from "@/components/portfolio-ui";
import { Reveal } from "@/components/motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/language-provider";
import { profile } from "@/lib/portfolio-data";

const serviceUrl = "https://rrs-website.vercel.app";
const phoneNumber = "+62 812 9524 8513";
const whatsappUrl = "https://wa.me/6281295248513";

export function ContactSection() {
  const { t } = useLanguage();

  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, help: t.contact.emailHelp },
    { label: t.contact.phoneTitle, value: phoneNumber, href: whatsappUrl, help: t.contact.phoneHelp },
    { label: t.contact.locationTitle, value: t.contact.location, href: null, help: t.contact.remote },
  ];

  return (
    <section id="contact" className="mx-auto w-full max-w-5xl px-6 py-24">
      <Reveal className="overflow-hidden rounded-xl border border-ink-border">
        <div className="grid gap-px bg-ink-border lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-ink-surface p-8 md:p-10">
            <PortfolioSectionLabel index="06">{t.contact.label}</PortfolioSectionLabel>
            <h2 className="font-editorial text-4xl font-bold tracking-tight text-ink-text md:text-6xl">{t.contact.title}</h2>
            <p className="mt-4 text-lg leading-8 text-ink-muted">{t.contact.body}</p>

            <p className="mt-8 text-sm leading-6 text-ink-muted">{t.contact.ctaBody}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={serviceUrl} target="_blank" rel="noreferrer" className={portfolioButtonClasses({ className: "justify-center" })}>
                {t.contact.service} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={whatsappUrl} target="_blank" rel="noreferrer" className={portfolioButtonClasses({ variant: "secondary", className: "justify-center" })}>
                {t.contact.whatsapp}
              </Link>
            </div>
          </div>

          <div className="grid gap-px bg-ink-border">
            {channels.map((channel) => (
              <div key={channel.label} className="bg-ink-surface p-7">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">{channel.label}</p>
                {channel.href ? (
                  <Link href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="mt-2 block text-ink-text transition-colors hover:text-ink-accent">
                    {channel.value}
                  </Link>
                ) : (
                  <p className="mt-2 text-ink-text">{channel.value}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {channel.label === t.contact.locationTitle ? <PortfolioBadge tone="accent">Online</PortfolioBadge> : null}
                  <span className="text-xs text-ink-faint">{channel.help}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
