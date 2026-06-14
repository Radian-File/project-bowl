"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

type CountUpProps = {
  /** Raw value string like "2+", "20+", "12+". Non-digits are preserved as suffix/prefix. */
  value: string;
  className?: string;
  durationMs?: number;
};

/**
 * Animates the numeric portion of a stat value from 0 up to its target while
 * preserving any surrounding non-numeric characters (e.g. the "+" in "20+").
 * Falls back to the static value when reduced motion is requested.
 */
export function CountUp({ value, className = "", durationMs = 1200 }: CountUpProps) {
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Derive the numeric portion as a stable primitive string. Using the regex
  // match array directly as an effect dependency caused a new object every
  // render, restarting the animation in a loop (the 0↔1 flicker bug).
  const numStr = value.match(/\d+/)?.[0] ?? null;
  const target = numStr !== null ? parseInt(numStr, 10) : null;

  const [display, setDisplay] = useState(
    target !== null && !reduceMotion ? value.replace(numStr!, "0") : value,
  );

  useEffect(() => {
    if (reduceMotion || numStr === null || target === null || !inView) return;
    const controls = animate(0, target, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(value.replace(numStr, String(Math.round(latest))));
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target, value, durationMs, numStr]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
