import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sitemapPlugin } from "./scripts/sitemap-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    sitemapPlugin(loadEnv(mode, process.cwd(), "VITE_").VITE_API_BASE_URL),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "mui-vendor": [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          animation: ["framer-motion", "gsap", "lottie-react"],
          maps: ["@react-google-maps/api"],
        },
      },
      // Suppress the lottie-web eval warning (it's in the library's source code, not ours)
      onwarn(warning, warn) {
        if (warning.code === "EVAL" && warning.id?.includes("lottie-web")) {
          return; // Suppress this specific warning
        }
        warn(warning); // Let other warnings through
      },
    },
    // Reasonable chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
}));
