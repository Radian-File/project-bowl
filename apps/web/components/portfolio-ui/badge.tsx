import type { HTMLAttributes, ReactNode } from "react";

export type PortfolioBadgeTone = "default" | "accent" | "outline";

export interface PortfolioBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: PortfolioBadgeTone;
}

const tones: Record<PortfolioBadgeTone, string> = {
  default: "border-ink-border bg-ink-surfaceHover text-ink-muted",
  accent: "border-ink-accent/30 bg-ink-accent/10 text-ink-accent",
  outline: "border-ink-border bg-transparent text-ink-muted",
};

export function PortfolioBadge({ children, className = "", tone = "default", ...props }: PortfolioBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
