# Guerlain — Exceptional Piece · PEX Bangkok 2026

A private, cinematic web presentation of Guerlain's Exceptional Piece
selection. Dark, editorial, LVMH-Maison register.

## Stack

- **Vite + React** (JavaScript, no UI framework)
- **GSAP** with **ScrollTrigger**, **ScrollToPlugin** and **SplitText**
- **Pure CSS Modules** — full visual control, zero utility framework

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in /dist
npm run preview    # serve the built bundle
```

Render targets: **1920×1080 fullscreen** (primary) and **iPad Pro landscape**.

## Structure

```
src/
  main.jsx                 # entry; registers all GSAP plugins once
  App.jsx                  # composition + chapter list
  data/collection.js       # all product data (from the official memo)
  lib/motion.js            # prefers-reduced-motion helper
  styles/global.css        # design tokens, reset, scroll-snap, cursor
  components/
    Cursor / Grain         # custom gold cursor + film grain overlays
    Hero                   # GSAP timeline + SplitText letter reveal
    SectionIntro           # editorial opening copy
    FragranceFamily        # chapter header + self-drawing gold line
    ProductCard            # editorial spread, parallax, notes, meta
    Closing                # final logotype scene
    ChapterNav             # right-side chapter navigator
    Emblem                 # line-art bee motif
```

## Replacing the placeholder visuals

Each piece currently shows a dark placeholder plate (`ProductCard.jsx`,
`.visual`). When the HD Maison photography arrives, drop the image into the
`.visual` block (e.g. an `<img>` as the first child of `.visualInner`); the
parallax, hover glow and reveal already target that layer.

## Notes

- Full-page scroll uses **CSS `scroll-snap` proximity** so sections settle
  gently without fighting the parallax/scrub. Set `scroll-snap-type: none`
  in `global.css` to disable.
- All animation respects **`prefers-reduced-motion`**.
- The custom cursor is disabled on touch / coarse-pointer devices.
