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
    },
    // Reasonable chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
});
