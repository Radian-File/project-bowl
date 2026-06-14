"use client";

import { PortfolioSectionLabel } from "@/components/portfolio-ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Star, GitFork } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/language-provider";
import type { GitHubRepoSummary } from "@/lib/server/github-profile";

function relativeTime(iso: string | null, locale: "id" | "en") {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (locale === "id") {
    if (days <= 0) return "hari ini";
    if (days === 1) return "kemarin";
    if (days < 30) return `${days} hari lalu`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} bulan lalu`;
    return `${Math.floor(months / 12)} tahun lalu`;
  }
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  return `${Math.floor(months / 12)} years ago`;
}

export function GithubSectionClient({ repos }: { repos: GitHubRepoSummary[] }) {
  const { locale } = useLanguage();

  if (repos.length === 0) return null;

  const labelText = locale === "id" ? "Aktivitas GitHub Terbaru" : "Latest GitHub Activity";
  const titleText = locale === "id" ? "Yang sedang saya kerjakan." : "What I'm building right now.";

  return (
    <section id="github" className="mx-auto w-full max-w-5xl px-6 py-24">
      <Reveal className="mb-12 max-w-2xl">
        <PortfolioSectionLabel index="06">{labelText}</PortfolioSectionLabel>
        <h2 className="font-editorial text-4xl font-bold tracking-tight text-ink-text md:text-6xl">{titleText}</h2>
      </Reveal>

      <Stagger className="grid gap-px overflow-hidden rounded-xl border border-ink-border bg-ink-border md:grid-cols-3">
        {repos.map((repo) => (
          <StaggerItem key={repo.fullName}>
            <Link
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col bg-ink-surface p-6 transition-colors hover:bg-ink-surfaceHover"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="truncate font-mono text-sm font-semibold text-ink-text group-hover:text-ink-accent">{repo.name}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{relativeTime(repo.pushedAt, locale)}</span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted line-clamp-3">
                {repo.description ?? (locale === "id" ? "Tanpa deskripsi." : "No description.")}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-faint">
                {repo.language ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-ink-accent" />
                    {repo.language}
                  </span>
                ) : null}
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" /> {repo.forks}
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
