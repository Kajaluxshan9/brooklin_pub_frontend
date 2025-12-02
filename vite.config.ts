import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      // Suppress the lottie-web eval warning (it's in the library's source code, not ours)
      onwarn(warning, warn) {
        if (warning.code === "EVAL" && warning.id?.includes("lottie-web")) {
          return; // Suppress this specific warning
        }
        warn(warning); // Let other warnings through
      },
      output: {
        manualChunks(id) {
          // Core React libraries
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/") ||
            id.includes("node_modules/react-router/") ||
            id.includes("node_modules/@remix-run/")
          ) {
            return "react-vendor";
          }

          // MUI Core
          if (
            id.includes("node_modules/@mui/material/") ||
            id.includes("node_modules/@mui/system/") ||
            id.includes("node_modules/@mui/styled-engine/") ||
            id.includes("node_modules/@mui/private-theming/") ||
            id.includes("node_modules/@mui/utils/") ||
            id.includes("node_modules/@emotion/")
          ) {
            return "mui-core";
          }

          // MUI Icons - separate chunk due to size
          if (id.includes("node_modules/@mui/icons-material/")) {
            return "mui-icons";
          }

          // Date pickers and dayjs
          if (
            id.includes("node_modules/@mui/x-date-pickers/") ||
            id.includes("node_modules/dayjs/")
          ) {
            return "date-picker";
          }

          // Framer Motion
          if (id.includes("node_modules/framer-motion/")) {
            return "animation-framer";
          }

          // GSAP
          if (id.includes("node_modules/gsap/")) {
            return "animation-gsap";
          }

          // Lottie (contains eval, keep separate)
          if (
            id.includes("node_modules/lottie-react/") ||
            id.includes("node_modules/lottie-web/")
          ) {
            return "animation-lottie";
          }

          // React Helmet for SEO
          if (id.includes("node_modules/react-helmet-async/")) {
            return "seo-vendor";
          }

          // FontAwesome icons (commonly large)
          if (id.includes("node_modules/@fortawesome/")) {
            return "icons-fontawesome";
          }

          // Google Maps
          if (id.includes("node_modules/@react-google-maps/")) {
            return "maps-vendor";
          }

          // Other node_modules
          if (id.includes("node_modules/")) {
            return "vendor-misc";
          }
        },
      },
    },
    // Reasonable chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
});
