import { gsap } from "gsap";
import { prefersReducedMotion } from "./motion.js";

/**
 * Cinematic, controlled scroll to a section.
 *
 * Drives the scroll entirely through GSAP (ScrollToPlugin) and momentarily
 * disables CSS scroll-snap during the tween — otherwise the snap engine and
 * the tween fight each other and ScrollToPlugin's autoKill aborts the motion.
 */
export function smoothScrollTo(target) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  if (prefersReducedMotion()) {
    el.scrollIntoView();
    return;
  }

  const html = document.documentElement;
  const previousSnap = html.style.scrollSnapType;
  html.style.scrollSnapType = "none";
  const restore = () => {
    html.style.scrollSnapType = previousSnap;
  };

  gsap.to(window, {
    duration: 1.3,
    ease: "power3.inOut",
    scrollTo: { y: el, autoKill: false },
    onComplete: restore,
    onInterrupt: restore,
  });
}
