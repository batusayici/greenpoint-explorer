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
        // Greenpoint Life — the product (2D map + feed)
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        // Parked 3D isometric prototype (kept runnable, not the product)
        explorer: fileURLToPath(new URL("./explorer.html", import.meta.url)),
      },
    },
  },
});
