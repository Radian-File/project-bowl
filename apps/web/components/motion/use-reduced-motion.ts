"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Thin wrapper around framer-motion's useReducedMotion so all portfolio
 * motion components share one accessibility guard. Returns true when the
 * user has requested reduced motion at the OS level.
 */
export function usePrefersReducedMotion() {
  return useFramerReducedMotion() ?? false;
}
