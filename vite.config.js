import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import facadeSpecWriter from "./vite-plugin-facade-spec-writer.js";
import facadeOverrideWriter from "./vite-plugin-facade-override-writer.js";

export default defineConfig({
  plugins: [react(), facadeSpecWriter(), facadeOverrideWriter()],
  build: {
    rollupOptions: {
      input: {
        // 3D explorer (existing product)
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        // Track V demand test — standalone 2D map page, zero Three.js
        july: fileURLToPath(new URL("./july.html", import.meta.url)),
      },
    },
  },
});
