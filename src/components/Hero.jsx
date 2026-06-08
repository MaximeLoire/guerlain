import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "../lib/motion.js";
import { smoothScrollTo } from "../lib/scroll.js";
import styles from "./Hero.module.css";

export default function Hero({ data }) {
  const root = useRef(null);
  const titleRef = useRef(null);
  const innerRef = useRef(null);
  const footerRef = useRef(null);
  const [fontsReady, setFontsReady] = useState(false);

  // Gate the SplitText timeline until the display face has loaded, otherwise
  // characters are measured against a fallback font and jump on swap.
  useEffect(() => {
    let active = true;
    const ready = () => active && setFontsReady(true);
    if (document.fonts?.ready) document.fonts.ready.then(ready);
    else ready();
    const fallback = setTimeout(ready, 1800); // never hang on the splash
    return () => {
      active = false;
      clearTimeout(fallback);
    };
  }, []);

  // Phase 1 — hide the composition before first paint (motion users only),
  // so the font-load gap reads as an intentional dark, glowing splash.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set([innerRef.current, footerRef.current], { autoAlpha: 0 });
    },
    { scope: root }
  );

  // Phase 2 — once fonts are in, run the cinematic entrance.
  useGSAP(
    () => {
      if (!fontsReady || prefersReducedMotion()) return;

      // Split each word on its own line so they can be choreographed apart.
      const lines = Array.from(titleRef.current.children);
      const splits = lines.map((line) =>
        SplitText.create(line, {
          type: "chars",
          charsClass: styles.char,
          aria: "none", // the <h1> already exposes the accessible label
        })
      );
      const [word1, word2] = splits;

      gsap.set([innerRef.current, footerRef.current], { autoAlpha: 1 });

      const tl = gsap.timeline();

      // The gold light swells open behind the name.
      tl.from(
        `.${styles.glow}`,
        { opacity: 0, scale: 1.5, duration: 2.8, ease: "power2.out" },
        0
      );

      // Eyebrow rises from its own mask.
      tl.from(
        `.${styles.eyebrow}`,
        { yPercent: 140, opacity: 0, duration: 1.2, ease: "power3.out" },
        0.5
      );

      // "Exceptional" — each letter resolves out of a soft focus and lifts on
      // a long, overlapping tide (stagger far shorter than the duration, so it
      // reads as one continuous wave rather than discrete pops).
      tl.from(
        word1.chars,
        {
          yPercent: 115,
          opacity: 0,
          filter: "blur(14px)",
          scale: 1.07,
          transformOrigin: "50% 100%",
          duration: 1.5,
          ease: "expo.out",
          stagger: { each: 0.05, from: "start" },
        },
        0.85
      );

      // "Piece" (italic) — a slower flourish in counter-time, settling
      // outward from the centre with a touch more depth.
      tl.from(
        word2.chars,
        {
          yPercent: 130,
          opacity: 0,
          filter: "blur(18px)",
          scaleY: 1.3,
          transformOrigin: "50% 100%",
          duration: 1.9,
          ease: "expo.out",
          stagger: { each: 0.075, from: "center" },
        },
        "-=1.2"
      );

      // The light blooms as the name lands.
      tl.to(
        `.${styles.glow}`,
        { scale: 1.16, opacity: 1, duration: 1.4, ease: "power2.out" },
        "-=1.05"
      );

      // Gold rule draws itself.
      tl.from(
        `.${styles.rule}`,
        { scaleX: 0, opacity: 0, duration: 1.6, ease: "power3.inOut" },
        "-=0.7"
      );

      // Subtitle.
      tl.from(
        `.${styles.subtitle}`,
        { yPercent: 140, opacity: 0, duration: 1.2, ease: "power3.out" },
        "-=1.2"
      );

      // Bottom bar.
      tl.from(
        `.${styles.footerItem}`,
        { y: 26, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out" },
        "-=0.95"
      );

      // Perpetual breathing of the gold light, once everything has settled.
      tl.to(
        `.${styles.glow}`,
        {
          scale: 1.1,
          opacity: 0.9,
          duration: 7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
        ">-0.1"
      );

      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [fontsReady] }
  );

  return (
    <section ref={root} id="hero" className={`${styles.hero} snap-section`}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner} ref={innerRef}>
        <p className={`${styles.eyebrow} eyebrow`}>{data.eyebrow}</p>

        <h1 className={styles.title} ref={titleRef}>
          <span className={styles.line}>{data.title1}</span>
          <span className={styles.line}>{data.title2}</span>
        </h1>

        <div className={styles.rule} aria-hidden="true" />

        <p className={styles.subtitle}>
          {data.event} <span className={styles.dot}>·</span> {data.year}
        </p>
      </div>

      <div className={styles.footer} ref={footerRef}>
        <span className={styles.footerItem}>{data.tagline}</span>
        <a
          className={`${styles.footerItem} ${styles.scrollCue}`}
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo("#intro");
          }}
          data-cursor="hover"
          aria-label="Scroll to the collection"
        >
          <span className={styles.scrollTrack} aria-hidden="true">
            <span className={styles.scrollDot} />
          </span>
          Scroll
        </a>
        <span className={styles.footerItem}>{data.footer_right}</span>
      </div>
    </section>
  );
}
