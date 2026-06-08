import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import styles from "./Cursor.module.css";

/**
 * Minimal luxury cursor: a small gold dot that tracks precisely,
 * trailed by a softer ring that lags and swells over interactive elements.
 * Driven entirely by gsap.quickTo (outside React's render cycle) for 60fps.
 * Disabled on coarse / touch pointers.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
      if (!fine.matches) return;

      const dot = dotRef.current;
      const ring = ringRef.current;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

      const xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
      const yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
      const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

      let visible = false;
      const reveal = contextSafe(() =>
        gsap.to([dot, ring], { opacity: 1, duration: 0.5 })
      );
      const hide = contextSafe(() =>
        gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
      );
      const grow = contextSafe(() =>
        gsap.to(ring, {
          scale: 2.5,
          opacity: 0.6,
          borderColor: "rgba(227, 201, 143, 0.9)",
          duration: 0.45,
          ease: "power3.out",
        })
      );
      const shrink = contextSafe(() =>
        gsap.to(ring, {
          scale: 1,
          opacity: 1,
          borderColor: "rgba(201, 169, 110, 0.4)",
          duration: 0.45,
          ease: "power3.out",
        })
      );

      const interactive = "a, button, [data-cursor='hover']";

      const onMove = (e) => {
        if (!visible) {
          visible = true;
          reveal();
        }
        xDot(e.clientX);
        yDot(e.clientY);
        xRing(e.clientX);
        yRing(e.clientY);
      };
      const onOver = (e) => {
        if (e.target.closest?.(interactive)) grow();
      };
      const onOut = (e) => {
        if (e.target.closest?.(interactive)) shrink();
      };
      const onLeave = () => {
        visible = false;
        hide();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver);
      document.addEventListener("pointerout", onOut);
      document.documentElement.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [] }
  );

  return (
    <>
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
    </>
  );
}
