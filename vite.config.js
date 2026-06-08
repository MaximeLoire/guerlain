import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the production build can be served from any path
// (USB kiosk, sub-folder, file://-style static hosting for the showroom).
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
