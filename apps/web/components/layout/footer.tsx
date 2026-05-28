import { profile } from "@/lib/portfolio-data";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-10 pt-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
      <p>© 2026 {profile.name}. All rights reserved.</p>
      <div className="flex flex-wrap items-center gap-4">
        {profile.socials.map((social) => (
          <Link key={social.label} href={social.href} className="transition hover:text-white">
            {social.label}
          </Link>
        ))}
        <span className="text-slate-600">•</span>
        <span>Built with React, Tailwind &amp; a little bit of magic.</span>
      </div>
    </footer>
  );
}
