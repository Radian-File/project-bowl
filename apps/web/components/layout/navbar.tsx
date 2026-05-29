import { buttonClasses } from "@projectbowl/ui";
import Link from "next/link";

const navItems = [
  { href: "/#about", label: "Tentang" },
  { href: "/#projects", label: "Projects" },
  { href: "/#projectbowl", label: "ProjectBowl" },
  { href: "/#stack", label: "Stack" },
  { href: "/#contact", label: "Kontak" },
];

export function Navbar() {
  return (
    <>
      <header className="fixed left-1/2 top-3 z-50 w-full max-w-6xl -translate-x-1/2 px-4 sm:top-4 sm:px-6">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-[#0B0D14]/85 px-4 py-3 shadow-[0_12px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:px-5">
          <Link href="/" className="font-display text-base font-bold tracking-tight text-white md:text-lg">
            ricky.dev
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <Link href="/#contact" className={buttonClasses({ variant: "secondary", size: "sm" })}>
            Let&apos;s talk
          </Link>
        </nav>
      </header>
      <div className="h-20 sm:h-24" aria-hidden="true" />
    </>
  );
}
