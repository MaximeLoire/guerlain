import { useEffect, useMemo } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Grain from "./components/Grain.jsx";
import Cursor from "./components/Cursor.jsx";
import ChapterNav from "./components/ChapterNav.jsx";
import Hero from "./components/Hero.jsx";
import SectionIntro from "./components/SectionIntro.jsx";
import FragranceFamily from "./components/FragranceFamily.jsx";
import Closing from "./components/Closing.jsx";
import styles from "./App.module.css";

// All region JSON files are bundled at build time — works offline & on file://
const regionModules = import.meta.glob("./content/regions/*.json", { eager: true });

function getContent() {
  const param = new URLSearchParams(window.location.search).get("region") || "bangkok";
  const safe = param.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const key = `./content/regions/${safe}.json`;
  const mod = regionModules[key] ?? regionModules["./content/regions/bangkok.json"];
  return mod.default ?? mod;
}

export default function App() {
  const content = useMemo(getContent, []);

  useEffect(() => {
    if (!document.fonts?.ready) return;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const chapters = [
    { id: "hero", label: content.nav.opening },
    { id: "intro", label: content.nav.collection },
    ...content.families.map((f) => ({ id: f.id, label: f.name })),
    { id: "closing", label: content.nav.closing },
  ];

  return (
    <>
      <Grain />
      <Cursor />
      <ChapterNav chapters={chapters} />

      <main className={styles.main}>
        <Hero data={content.hero} />
        <SectionIntro data={content.intro} />
        {content.families.map((family) => (
          <FragranceFamily key={family.id} family={family} />
        ))}
        <Closing data={content.closing} />
      </main>
    </>
  );
}
