import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoothScrollTo } from "../lib/scroll.js";
import styles from "./ChapterNav.module.css";

export default function ChapterNav({ chapters }) {
  const root = useRef(null);
  const [active, setActive] = useState(chapters[0].id);

  useGSAP(
    () => {
      // These sections live OUTSIDE the <nav>, so resolve real elements rather
      // than selector strings (a scoped selector would never find them, which
      // left one item permanently flagged active).
      const triggers = chapters
        .map((c) => {
          const el = document.getElementById(c.id);
          if (!el) return null;
          return ScrollTrigger.create({
            trigger: el,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (self) => self.isActive && setActive(c.id),
          });
        })
        .filter(Boolean);

      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [] }
  );

  const go = (event, id) => {
    event.preventDefault();
    smoothScrollTo(`#${id}`);
  };

  return (
    <nav ref={root} className={styles.nav} aria-label="Chapters">
      <ul className={styles.list}>
        {chapters.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              onClick={(e) => go(e, c.id)}
              className={`${styles.item} ${active === c.id ? styles.active : ""}`}
              aria-current={active === c.id ? "true" : undefined}
            >
              <span className={styles.label}>{c.label}</span>
              <span className={styles.tick} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
