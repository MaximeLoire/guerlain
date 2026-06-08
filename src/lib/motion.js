// Single source of truth for the user's motion preference.
// Used to gracefully disable cinematic animation for prefers-reduced-motion.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
