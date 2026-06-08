import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion.js";
import styles from "./SectionIntro.module.css";

export default function SectionIntro({ data }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.from(q(`[data-reveal]`), {
        yPercent: 70,
        opacity: 0,
        duration: 1.3,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 68%" },
      });

      gsap.from(q(`.${styles.rule}`), {
        scaleX: 0,
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: { trigger: root.current, start: "top 62%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="intro" className={`${styles.intro} snap-section`}>
      <div className={styles.block}>
        <p className={`${styles.eyebrow} eyebrow`} data-reveal>
          {data.eyebrow}
        </p>
        <div className={styles.rule} aria-hidden="true" />
        <p className={styles.copy}>
          {data.lines.map((line, i) => (
            <span
              key={i}
              data-reveal
              className={`${styles.copyLine} ${i === 0 ? styles.lead : ""}`}
            >
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
