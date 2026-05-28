"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Lock, Mail, Sparkles } from "lucide-react";
import { Button, Card, Input, SectionLabel, buttonClasses } from "@projectbowl/ui";
import { ApiError, isApiConfigured, login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bowl-background text-bowl-text">
      <div className="pointer-events-none fixed left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-bowl-purple/25 blur-3xl" />
      <div className="pointer-events-none fixed right-[-12rem] top-24 h-[34rem] w-[34rem] rounded-full bg-bowl-cyan/20 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />

      <section className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>
          <SectionLabel>Admin access</SectionLabel>
          <h1 className="font-display text-5xl font-bold leading-none tracking-tight text-white md:text-7xl">Ship the portfolio from one neon cockpit.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Sign in to manage ProjectBowl projects, publish portfolio updates, draft AI content, and track tasks/milestones.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">ProjectBowl Login</h2>
              <p className="text-sm text-slate-500">Bearer token stored in localStorage for Wave 2.</p>
            </div>
          </div>

          {!isApiConfigured() ? (
            <div className="mb-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
              <div className="flex gap-2"><AlertCircle className="h-5 w-5 shrink-0" /> NEXT_PUBLIC_API_URL is missing. Login will work after the API URL is configured.</div>
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input className="pl-11" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@projectbowl.dev" type="email" autoComplete="email" />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-300">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input className="pl-11" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" type="password" autoComplete="current-password" />
              </div>
            </label>

            {error ? <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100">{error}</div> : null}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !isApiConfigured()}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-400">
            Auth endpoints are evolving in Wave 2. If backend auth is not merged yet, use the public portfolio while this page remains ready for POST /auth/login.
          </div>
          <Link href="/dashboard" className={buttonClasses({ variant: "ghost", className: "mt-4 w-full" })}>
            Continue to dashboard shell
          </Link>
        </Card>
      </section>
    </main>
  );
}
