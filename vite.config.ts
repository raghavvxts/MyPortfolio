import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }

          if (id.includes("gsap")) {
            return "gsap-vendor";
          }

          if (
            id.includes("@react-three/fiber") ||
            id.includes("@react-three/drei")
          ) {
            return "r3f-core";
          }

          if (
            id.includes("@react-three/postprocessing") ||
            id.includes("/postprocessing/")
          ) {
            return "postprocessing-vendor";
          }

          if (id.includes("three-stdlib") || id.includes("three/examples")) {
            return "three-stdlib-vendor";
          }

          if (id.includes("/node_modules/three/")) {
            return "three-core-vendor";
          }
        },
      },
    },
  },
});
