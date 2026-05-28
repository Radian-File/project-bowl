import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-cyan-300/15 ${className}`}
      {...props}
    />
  );
}
