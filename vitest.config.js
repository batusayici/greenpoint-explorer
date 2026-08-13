import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Rendering tests only (2026-08-13). Deliberately a SEPARATE runner from
// `npm test`, which stays 600+ pure-logic `.test.mjs` files under `node --test`
// — fast, dependency-free, and the right tool for everything that doesn't need
// a DOM. This config exists for the one class of thing that suite structurally
// cannot check: that a component failure stays contained instead of taking the
// page down.
//
// It does NOT reuse vite.config.js on purpose — that config carries the parked
// 3D track's facade-spec writer plugins, which touch the filesystem on
// transform and have no business running during tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // `.test.jsx`, so this can never collide with the node --test suite's
    // `.test.mjs` glob — the two runners must not fight over the same files.
    include: ["src/**/*.test.jsx"],
    setupFiles: ["./src/demand-test/testSetup.dom.js"],
    restoreMocks: true,
  },
});
