import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Globe from "react-globe.gl";
import Grain from "../components/Grain.jsx";
import Cursor from "../components/Cursor.jsx";
import styles from "./GlobeHome.module.css";

const CITIES = [
  { name: "Paris",       flag: "🇫🇷", lat:  48.8566, lng:   2.3522, region: "paris",       labelOffset: { x: 0, y:   30 } },
  { name: "Milan",       flag: "🇮🇹", lat:  45.4642, lng:   9.1900, region: "milan",       labelOffset: { x:  0, y:  30 } },
  { name: "New York",    flag: "🇺🇸", lat:  40.7128, lng: -74.0060, region: "new-york",    labelOffset: { x:   0, y:   0 } },
  { name: "Londres",     flag: "🇬🇧", lat:  51.5074, lng:  -0.1278, region: "london",      labelOffset: { x: 0, y: 5 } },
  { name: "Tokyo",       flag: "🇯🇵", lat:  35.6762, lng: 139.6503, region: "tokyo",       labelOffset: { x:   0, y:   0 } },
  { name: "Shanghai",    flag: "🇨🇳", lat:  31.2304, lng: 121.4737, region: "shanghai",    labelOffset: { x:   0, y:   0 } },
  { name: "Séoul",       flag: "🇰🇷", lat:  37.5665, lng: 126.9780, region: "seoul",       labelOffset: { x:   0, y:   0 } },
  { name: "Los Angeles", flag: "🇺🇸", lat:  34.0522, lng: -118.2437, region: "los-angeles", labelOffset: { x:   0, y:   0 } },
  { name: "Dubaï",       flag: "🇦🇪", lat:  25.2048, lng:  55.2708, region: "dubai",       labelOffset: { x:   0, y:   0 } },
  { name: "Bangkok",     flag: "🇹🇭", lat:  13.7563, lng: 100.5018, region: "bangkok",     labelOffset: { x:   0, y:   0 } },
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

    globe.pointOfView({ lat: 28, lng: 55, altitude: 2.55 }, 0);

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
      const ox = d.labelOffset?.x ?? 0;
      const oy = d.labelOffset?.y ?? 0;

      // Zero-size anchor: top-left = exact geo point on globe
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:relative;width:0;height:0;pointer-events:none;";

      // Dot centered at exact geo point
      const dot = document.createElement("div");
      dot.style.cssText =
        "position:absolute;width:7px;height:7px;border-radius:50%;background:#c9a96e;" +
        "box-shadow:0 0 9px 3px rgba(201,169,110,0.55);" +
        "transform:translate(-50%,-50%);" +
        "transition:transform 0.22s ease,box-shadow 0.22s ease;" +
        "pointer-events:auto;cursor:pointer;";

      // Label floats above the dot, offset applies only here
      const label = document.createElement("span");
      label.textContent = d.name;
      label.style.cssText =
        "position:absolute;display:block;" +
        "font-family:'Jost',sans-serif;font-size:8px;font-weight:600;" +
        "letter-spacing:0.32em;text-transform:uppercase;" +
        "color:rgba(240,237,232,0.55);white-space:nowrap;" +
        "transition:color 0.22s ease;pointer-events:auto;cursor:pointer;" +
        `transform:translate(calc(-50% + ${ox}px),calc(-100% - 12px + ${oy}px));`;

      const hoverIn = () => {
        dot.style.transform = "translate(-50%,-50%) scale(1.7)";
        dot.style.boxShadow = "0 0 16px 5px rgba(201,169,110,0.85)";
        label.style.color = "#c9a96e";
      };
      const hoverOut = () => {
        dot.style.transform = "translate(-50%,-50%) scale(1)";
        dot.style.boxShadow = "0 0 9px 3px rgba(201,169,110,0.55)";
        label.style.color = "rgba(240,237,232,0.55)";
      };
      const onClick = (e) => {
        e.stopPropagation();
        navigate(`/${d.region}`);
      };

      dot.addEventListener("mouseenter", hoverIn);
      dot.addEventListener("mouseleave", hoverOut);
      dot.addEventListener("click", onClick);
      label.addEventListener("mouseenter", hoverIn);
      label.addEventListener("mouseleave", hoverOut);
      label.addEventListener("click", onClick);

      wrap.appendChild(dot);
      wrap.appendChild(label);
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
