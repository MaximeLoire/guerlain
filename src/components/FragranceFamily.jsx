import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/motion.js";
import ProductCard from "./ProductCard.jsx";
import styles from "./FragranceFamily.module.css";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];
const COUNT = [
  "",
  "One creation",
  "Two creations",
  "Three creations",
  "Four creations",
];

export default function FragranceFamily({ family }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        // Bind to this instance's own element — a shared CSS-module class
        // would match all seven family headers and fire them as one.
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });

      tl.from(q(`[data-head]`), {
        yPercent: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
      }).from(
        q(`.${styles.rule}`),
        { scaleX: 0, duration: 1.6, ease: "power3.inOut" },
        "-=0.9"
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id={family.id} className={`${styles.family} snap-section`}>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <span className={styles.chapter} data-head>
            <span className={styles.chapterLabel}>Chapter</span>
            <span className={styles.chapterNo}>{ROMAN[family.index]}</span>
          </span>
          <span className={styles.count} data-head>
            {COUNT[family.products.length] || `${family.products.length} creations`}
          </span>
        </div>

        <h2 className={styles.name} data-head>
          {family.name}
        </h2>

        <p className={styles.tagline} data-head>
          {family.tagline}
        </p>

        <div className={styles.rule} aria-hidden="true" />
      </header>

      <div className={styles.products}>
        {family.products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            reverse={i % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
