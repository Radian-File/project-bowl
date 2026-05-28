import type { HTMLAttributes, ReactNode } from "react";

type BadgeTone = "default" | "purple" | "cyan" | "lime" | "slate";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  default: "border-white/10 bg-white/10 text-slate-200",
  purple: "border-violet-300/20 bg-violet-500/15 text-violet-100",
  cyan: "border-cyan-300/20 bg-cyan-400/15 text-cyan-100",
  lime: "border-lime-300/20 bg-lime-300/15 text-lime-100",
  slate: "border-slate-200/10 bg-slate-400/10 text-slate-300",
};

export function Badge({ children, className = "", tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
