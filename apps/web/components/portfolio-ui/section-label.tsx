import type { HTMLAttributes, ReactNode } from "react";

export interface PortfolioSectionLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  index?: string;
}

export function PortfolioSectionLabel({ children, index, className = "", ...props }: PortfolioSectionLabelProps) {
  return (
    <div
      className={`mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted ${className}`}
      {...props}
    >
      {index ? <span className="text-ink-accent">{index}</span> : <span className="h-px w-6 bg-ink-borderStrong" />}
      <span>{children}</span>
    </div>
  );
}
