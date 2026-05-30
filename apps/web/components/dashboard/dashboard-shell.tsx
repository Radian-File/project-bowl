"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge, buttonClasses } from "@projectbowl/ui";
import { Bot, FolderKanban, Gauge, Home, Layers3, LogOut, Menu, Plus, Sparkles, X } from "lucide-react";
import { isApiConfigured, logout } from "@/lib/api";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Gauge },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/projects/new", label: "Create", icon: Plus },
  { href: "/dashboard/tech", label: "Tech", icon: Layers3 },
  { href: "/dashboard/ai", label: "AI Studio", icon: Bot },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeLabel = useMemo(() => navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Dashboard", [pathname]);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Ignore logout failures and return to login.
    }
    router.push("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bowl-background text-bowl-text">
      <div className="pointer-events-none fixed left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-bowl-purple/25 blur-3xl" />
      <div className="pointer-events-none fixed right-[-10rem] top-20 h-[34rem] w-[34rem] rounded-full bg-bowl-cyan/20 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />

      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl lg:block">
          <DashboardBrand />
          <nav className="mt-8 grid gap-2">
            {navItems.map((item) => (
              <DashboardNavItem key={item.href} href={item.href} label={item.label} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} icon={item.icon} />
            ))}
          </nav>
          <div className="absolute bottom-5 left-5 right-5 space-y-3 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Supabase</span>
              <Badge tone={isApiConfigured() ? "lime" : "slate"}>{isApiConfigured() ? "Configured" : "Missing"}</Badge>
            </div>
            <p className="truncate text-xs text-slate-400">Vercel + Supabase fullstack</p>
            <button onClick={handleLogout} className={buttonClasses({ variant: "ghost", size: "sm", className: "w-full" })}>
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-bowl-background/70 px-4 py-4 backdrop-blur-2xl md:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">ProjectBowl Admin</p>
                <h1 className="font-display text-2xl font-semibold text-white">{activeLabel}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/" className={buttonClasses({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
                  <Home className="h-4 w-4" /> Portfolio
                </Link>
                <button className={buttonClasses({ variant: "secondary", size: "sm", className: "lg:hidden" })} onClick={() => setMenuOpen(true)}>
                  <Menu className="h-4 w-4" /> Menu
                </button>
              </div>
            </div>
          </header>

          {menuOpen ? (
            <div className="fixed inset-0 z-40 bg-black/70 p-4 backdrop-blur-sm lg:hidden">
              <div className="ml-auto h-full max-w-sm rounded-[2rem] border border-white/10 bg-[#0D111B] p-5 shadow-glow">
                <div className="flex items-center justify-between">
                  <DashboardBrand compact />
                  <button className={buttonClasses({ variant: "ghost", size: "sm" })} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <nav className="mt-8 grid gap-2">
                  {navItems.map((item) => (
                    <DashboardNavItem key={item.href} href={item.href} label={item.label} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} icon={item.icon} onClick={() => setMenuOpen(false)} />
                  ))}
                </nav>
              </div>
            </div>
          ) : null}

          <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</section>
        </div>
      </div>
    </main>
  );
}

function DashboardBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.22)]">
        <Sparkles className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-white">ProjectBowl</p>
        {!compact ? <p className="text-xs text-slate-500">Portfolio CMS</p> : null}
      </div>
    </Link>
  );
}

function DashboardNavItem({ href, label, active, icon: Icon, onClick }: { href: string; label: string; active: boolean; icon: typeof Gauge; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-cyan-300/30 bg-cyan-300/10 text-white shadow-[0_0_28px_rgba(6,182,212,0.15)]"
          : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
