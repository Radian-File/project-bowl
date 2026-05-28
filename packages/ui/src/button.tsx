import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-[#080A0F] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white shadow-[0_0_40px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(6,182,212,0.24)]",
  secondary:
    "border-white/10 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/15",
  ghost: "border-transparent bg-transparent text-slate-300 hover:bg-white/10 hover:text-white",
  outline:
    "border-white/15 bg-transparent text-white hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
