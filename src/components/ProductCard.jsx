import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Emblem from "./Emblem.jsx";
import { prefersReducedMotion } from "../lib/motion.js";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product, reverse }) {
  const root = useRef(null);
  const visualInner = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // Reveal — visual settles, copy rises in sequence.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
      tl.from(q(`.${styles.visual}`), {
        y: 60,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        // Drop the inline transform afterwards so the CSS :hover scale wins.
        clearProps: "transform",
      }).from(
        q(`[data-stagger]`),
        {
          yPercent: 70,
          opacity: 0,
          stagger: 0.09,
          duration: 1,
          ease: "power3.out",
        },
        "-=1.05"
      );

      // Subtle parallax drift on the placeholder's contents.
      gsap.fromTo(
        visualInner.current,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: root }
  );

  const hasNotes = product.notes?.length || product.notesPyramid?.length;
  const hasMeta = product.price || product.edition || product.volume;

  return (
    <article
      ref={root}
      className={`${styles.card} ${reverse ? styles.reverse : ""}`}
    >
      {/* Maison visual — HD photography, with a graceful placeholder fallback */}
      <div className={styles.visual} data-cursor="hover" aria-hidden="true">
        <div className={styles.visualInner} ref={visualInner}>
          {product.image ? (
            <img
              className={styles.photo}
              src={product.image}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <>
              <span className={styles.watermark}>{product.name}</span>
              <span className={styles.emblemWrap}>
                <Emblem className={styles.emblem} />
              </span>
            </>
          )}
        </div>
        <span className={`${styles.frameLabel} ${styles.labelTop}`}>
          PEX · Bangkok
        </span>
        <span className={`${styles.frameLabel} ${styles.labelTopRight}`}>
          {product.year}
        </span>
        {!product.image && (
          <span className={styles.placeholderNote}>Maison photography to follow</span>
        )}
        <span className={`${styles.frameLabel} ${styles.labelBottom}`}>
          Guerlain Paris
        </span>
      </div>

      {/* Copy */}
      <div className={styles.body}>
        <div className={styles.bodyHead} data-stagger>
          <span className={styles.artist}>{product.artist}</span>
          <span className={styles.year}>{product.year}</span>
        </div>

        <h3 className={styles.name} data-stagger>
          {product.name}
        </h3>

        {product.specialty && (
          <p className={styles.specialty} data-stagger>
            ({product.specialty})
          </p>
        )}

        <p className={styles.description} data-stagger>
          {product.description}
        </p>

        {hasNotes ? (
          <div className={styles.notes} data-stagger>
            <span className={styles.notesLabel}>Olfactory Notes</span>
            {product.notesPyramid ? (
              <div className={styles.pyramid}>
                {product.notesPyramid.map((t) => (
                  <div key={t.tier} className={styles.tier}>
                    <span className={styles.tierLabel}>{t.tier}</span>
                    <span className={styles.tierItems}>{t.items.join(" · ")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noteList}>
                {product.notes.map((n, i) => (
                  <span key={i} className={styles.note}>
                    {i > 0 && <span className={styles.sep}>·</span>}
                    {n}
                  </span>
                ))}
              </p>
            )}
          </div>
        ) : null}

        <dl className={styles.meta} data-stagger>
          {product.price && (
            <div className={styles.metaRow}>
              <dt className={styles.metaLabel}>Value</dt>
              <dd className={styles.price}>{product.price}</dd>
            </div>
          )}
          {product.edition && (
            <div className={styles.metaRow}>
              <dt className={styles.metaLabel}>Edition</dt>
              <dd className={styles.metaValue}>{product.edition}</dd>
            </div>
          )}
          {product.volume && (
            <div className={styles.metaRow}>
              <dt className={styles.metaLabel}>Volume</dt>
              <dd className={styles.metaValue}>{product.volume}</dd>
            </div>
          )}
          {!hasMeta && (
            <div className={styles.metaRow}>
              <dt className={styles.metaLabel}>Acquisition</dt>
              <dd className={styles.metaValue}>Upon request</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}
