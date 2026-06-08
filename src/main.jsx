import React from "react";
import ReactDOM from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import App from "./App.jsx";
import "./styles/global.css";

// Register every GSAP plugin once, at the app root, before any component runs.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText);

// Global motion defaults — a slow, deliberate, cinematic cadence.
gsap.defaults({ ease: "power3.out", duration: 1.1 });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
