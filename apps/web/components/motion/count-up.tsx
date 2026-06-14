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
  const match = value.match(/(\d+)/);
  const target = match ? parseInt(match[1], 10) : null;
  const [display, setDisplay] = useState(target !== null && !reduceMotion ? value.replace(match![1], "0") : value);

  useEffect(() => {
    if (reduceMotion || target === null || !inView) return;
    const controls = animate(0, target, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(value.replace(match![1], String(Math.round(latest))));
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target, value, durationMs, match]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
