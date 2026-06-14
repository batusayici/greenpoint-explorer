import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import facadeSpecWriter from "./vite-plugin-facade-spec-writer.js";

export default defineConfig({
  plugins: [react(), facadeSpecWriter()],
});
