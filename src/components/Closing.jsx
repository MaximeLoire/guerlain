import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Emblem from "./Emblem.jsx";
import { prefersReducedMotion } from "../lib/motion.js";
import styles from "./Closing.module.css";

export default function Closing({ data }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: root.current, start: "top 58%" },
      });

      tl.from(`.${styles.emblem}`, {
        opacity: 0,
        scale: 0.6,
        duration: 1.6,
        ease: "power3.out",
      })
        .from(`.${styles.eyebrow}`, { yPercent: 120, opacity: 0, duration: 1 }, "-=1.0")
        .from(`.${styles.wordmark}`, { yPercent: 110, opacity: 0, duration: 1.4 }, "-=0.7")
        .from(`.${styles.paris}`, { yPercent: 120, opacity: 0, duration: 1 }, "-=1.0")
        .from(`.${styles.rule}`, { scaleX: 0, duration: 1.5, ease: "power3.inOut" }, "-=0.8")
        .from(`.${styles.tagline}`, { opacity: 0, y: 24, duration: 1.2 }, "-=0.9");

      gsap.to(`.${styles.glow}`, {
        opacity: 0.85,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="closing" className={`${styles.closing} snap-section`}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <Emblem className={styles.emblem} />
        <p className={`${styles.eyebrow} eyebrow`}>{data.eyebrow}</p>
        <h2 className={styles.wordmark}>{data.heading}</h2>
        <p className={styles.paris}>{data.subheading}</p>
        <div className={styles.rule} aria-hidden="true" />
        <p className={styles.tagline}>{data.tagline}</p>
      </div>

      <footer className={styles.foot}>
        <span>{data.footer_left}</span>
        <span>{data.footer_right}</span>
      </footer>
    </section>
  );
}
