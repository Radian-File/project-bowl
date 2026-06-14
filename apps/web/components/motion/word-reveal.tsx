"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

type WordRevealProps = {
  text: string;
  className?: string;
};

/**
 * Reveals a heading word-by-word with a small upward fade. Each word is a
 * span so wrapping stays natural. Falls back to static text under reduced motion.
 */
export function WordReveal({ text, className = "" }: WordRevealProps) {
  const reduceMotion = usePrefersReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              show: { y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
