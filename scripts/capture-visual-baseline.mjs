#!/usr/bin/env node
// Phase 6.2.3 — candidate capture for the visual baseline gate.
//
// Renders the running Scene to a PNG via Playwright (headless Chromium) at a
// fixed viewport, so verify-visual-baseline.mjs has a deterministic candidate
// to diff against the committed baseline.
//
// Requires a dev server already running and `playwright` installed. Playwright
// is intentionally NOT a hard dependency yet — with a single material the
// committed baseline + manual capture suffice. Phase 7 (4 material families)
// is when wiring this into CI pays for itself; until then this script is the
// documented capture path and degrades with a clear message if playwright is
// absent.
//
// Usage:
//   node scripts/capture-visual-baseline.mjs [--url http://127.0.0.1:5173] [--material brick] [--rebaseline]
//
// --rebaseline writes straight into tests/visual-baselines/ (deliberate
// re-approval). Otherwise writes a candidate into tests/.candidates/.

import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const URL = opt("--url", "http://127.0.0.1:5173");
const MATERIAL = opt("--material", "brick");
const REBASELINE = args.includes("--rebaseline");

const FILES = { brick: "brick-scene.baseline.png" };
const file = FILES[MATERIAL];
if (!file) { console.error(`unknown material '${MATERIAL}'`); process.exit(1); }

const outDir = REBASELINE ? join(ROOT, "tests/visual-baselines") : join(ROOT, "tests/.candidates");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, file);

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("playwright not installed. Install it (npm i -D playwright && npx playwright install chromium)");
  console.error("or capture manually: open the Scene at 1000x1000 and save to", outPath);
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2500); // let async facade textures settle
await page.screenshot({ path: outPath, type: "png" });
await browser.close();
console.log(`captured ${MATERIAL} → ${outPath}${REBASELINE ? "  (RE-BASELINED)" : ""}`);
