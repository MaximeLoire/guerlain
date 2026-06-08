import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Globe from "react-globe.gl";
import Grain from "../components/Grain.jsx";
import Cursor from "../components/Cursor.jsx";
import styles from "./GlobeHome.module.css";

const CITIES = [
  { name: "Paris",       flag: "🇫🇷", lat:  48.8566, lng:   2.3522, region: "paris"       },
  { name: "Milan",       flag: "🇮🇹", lat:  45.4642, lng:   9.1900, region: "milan"       },
  { name: "New York",    flag: "🇺🇸", lat:  40.7128, lng: -74.0060, region: "new-york"    },
  { name: "Londres",     flag: "🇬🇧", lat:  51.5074, lng:  -0.1278, region: "london"      },
  { name: "Tokyo",       flag: "🇯🇵", lat:  35.6762, lng: 139.6503, region: "tokyo"       },
  { name: "Shanghai",    flag: "🇨🇳", lat:  31.2304, lng: 121.4737, region: "shanghai"    },
  { name: "Séoul",       flag: "🇰🇷", lat:  37.5665, lng: 126.9780, region: "seoul"       },
  { name: "Los Angeles", flag: "🇺🇸", lat:  34.0522, lng: -118.2437, region: "los-angeles" },
  { name: "Dubaï",       flag: "🇦🇪", lat:  25.2048, lng:  55.2708, region: "dubai"       },
  { name: "Bangkok",     flag: "🇹🇭", lat:  13.7563, lng: 100.5018, region: "bangkok"     },
];

export default function GlobeHome() {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const rootRef = useRef(null);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Globe camera + controls, runs once after mount
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView({ lat: 28, lng: 55, altitude: 2.1 }, 0);

    const ctrl = globe.controls();
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.38;
    ctrl.enableZoom = false;
    ctrl.enablePan = false;
    ctrl.minPolarAngle = Math.PI * 0.22;
    ctrl.maxPolarAngle = Math.PI * 0.78;

    const stop = () => { ctrl.autoRotate = false; };
    ctrl.addEventListener("start", stop);
    return () => ctrl.removeEventListener("start", stop);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(`.${styles.header}`, { yPercent: -40, opacity: 0, duration: 1.5 }, 0);
      tl.from(containerRef.current, { scale: 0.84, opacity: 0, duration: 2.2, ease: "power2.out" }, 0.15);
      tl.from(`.${styles.hint}`, { opacity: 0, duration: 1.4 }, 1.4);
    },
    { scope: rootRef }
  );

  const makeLabel = useCallback(
    (d) => {
      const wrap = document.createElement("div");
      wrap.style.cssText =
        "display:flex;flex-direction:column;align-items:center;gap:6px;" +
        "cursor:pointer;pointer-events:auto;" +
        "transform:translate(-50%,calc(-100% - 8px));";

      const dot = document.createElement("div");
      dot.style.cssText =
        "width:7px;height:7px;border-radius:50%;background:#c9a96e;" +
        "box-shadow:0 0 9px 3px rgba(201,169,110,0.55);" +
        "transition:transform 0.22s ease,box-shadow 0.22s ease;";

      const label = document.createElement("span");
      label.textContent = d.name;
      label.style.cssText =
        "font-family:'Jost',sans-serif;font-size:8px;font-weight:400;" +
        "letter-spacing:0.32em;text-transform:uppercase;" +
        "color:rgba(240,237,232,0.55);white-space:nowrap;" +
        "transition:color 0.22s ease;";

      wrap.appendChild(dot);
      wrap.appendChild(label);

      wrap.addEventListener("mouseenter", () => {
        dot.style.transform = "scale(1.7)";
        dot.style.boxShadow = "0 0 16px 5px rgba(201,169,110,0.85)";
        label.style.color = "#c9a96e";
      });
      wrap.addEventListener("mouseleave", () => {
        dot.style.transform = "scale(1)";
        dot.style.boxShadow = "0 0 9px 3px rgba(201,169,110,0.55)";
        label.style.color = "rgba(240,237,232,0.55)";
      });
      wrap.addEventListener("click", (e) => {
        e.stopPropagation();
        navigate(`/${d.region}`);
      });

      return wrap;
    },
    [navigate]
  );

  return (
    <div ref={rootRef} className={styles.root}>
      <Grain />
      <Cursor />

      <header className={styles.header}>
        <p className={`${styles.eyebrow} eyebrow`}>Maison Guerlain — Paris</p>
        <h1 className={styles.wordmark}>Exceptional Piece</h1>
        <div className={styles.rule} aria-hidden="true" />
        <p className={styles.subtitle}>Private Collection · 2026</p>
      </header>

      <div ref={containerRef} className={styles.globeWrap}>
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#c9a96e"
          atmosphereAltitude={0.14}
          htmlElementsData={CITIES}
          htmlLat={(d) => d.lat}
          htmlLng={(d) => d.lng}
          htmlAltitude={0.01}
          htmlElement={makeLabel}
          animateIn={false}
        />
      </div>

      <p className={styles.hint}>Sélectionnez une ville pour découvrir sa collection</p>
    </div>
  );
}
