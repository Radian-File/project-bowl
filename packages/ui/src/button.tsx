import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_0_40px_rgba(124,58,237,0.35)] hover:opacity-95",
  secondary:
    "border-white/10 bg-white/10 text-white hover:bg-white/15",
  ghost: "border-transparent bg-transparent text-slate-300 hover:bg-white/10 hover:text-white",
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
