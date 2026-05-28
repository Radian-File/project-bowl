import type { HTMLAttributes, ReactNode } from "react";

export interface SectionLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SectionLabel({ children, className = "", ...props }: SectionLabelProps) {
  return (
    <div
      className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl ${className}`}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.8)]" />
      {children}
    </div>
  );
}
