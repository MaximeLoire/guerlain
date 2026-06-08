import styles from "./Grain.module.css";

/**
 * Fixed, pointer-events-none film grain overlay.
 * Animated via GPU-composited transform (never background-position) per
 * the performance guardrails, so it never repaints the scrolling content.
 */
export default function Grain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
