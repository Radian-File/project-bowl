import type { ButtonHTMLAttributes, ReactNode } from "react";

export type PortfolioButtonVariant = "primary" | "secondary" | "ghost";
export type PortfolioButtonSize = "sm" | "md" | "lg";

export interface PortfolioButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: PortfolioButtonVariant;
  size?: PortfolioButtonSize;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ink-accent/50 focus:ring-offset-2 focus:ring-offset-ink-bg disabled:pointer-events-none disabled:opacity-50";

const variants: Record<PortfolioButtonVariant, string> = {
  primary: "border-ink-text bg-ink-text text-ink-bg hover:bg-transparent hover:text-ink-text",
  secondary: "border-ink-border bg-transparent text-ink-text hover:border-ink-borderStrong hover:bg-ink-surface",
  ghost: "border-transparent bg-transparent text-ink-muted hover:text-ink-text",
};

const sizes: Record<PortfolioButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export function portfolioButtonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: PortfolioButtonVariant;
  size?: PortfolioButtonSize;
  className?: string;
} = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

export function PortfolioButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: PortfolioButtonProps) {
  return (
    <button className={portfolioButtonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
