import type { HTMLAttributes, ReactNode } from "react";

export interface PortfolioCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function PortfolioCard({ children, className = "", hover = false, ...props }: PortfolioCardProps) {
  return (
    <div
      className={`rounded-xl border border-ink-border bg-ink-surface ${
        hover ? "transition-colors duration-200 hover:border-ink-borderStrong hover:bg-ink-surfaceHover" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
