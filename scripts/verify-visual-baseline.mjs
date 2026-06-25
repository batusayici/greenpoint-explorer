#!/usr/bin/env node
// Phase 6.2.3 — per-material visual regression gate.
//
// Compares a freshly-captured candidate render against the committed baseline
// PNG for each material family and fails on pixel drift beyond a threshold.
// Today only `brick` exists; the harness is keyed by material so Phase 7 adds
// clapboard/brownstone/modern/roof by dropping in baselines + capture targets.
//
// Capture the candidate first (see scripts/capture-visual-baseline.mjs / the
// procedure in docs/archive/PLAN_6.2.md), then run this. Re-baseline intentionally by
// re-capturing into tests/visual-baselines/<material>.baseline.png and
// committing — never silently overwrite.
//
// Usage:
//   node scripts/verify-visual-baseline.mjs                 # all materials
//   node scripts/verify-visual-baseline.mjs brick           # one material
//   node scripts/verify-visual-baseline.mjs --candidate-dir tests/.candidates

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_DIR = join(ROOT, "tests/visual-baselines");
const args = process.argv.slice(2);
const candDirArg = args.indexOf("--candidate-dir");
const CANDIDATE_DIR = candDirArg >= 0 ? join(ROOT, args[candDirArg + 1]) : join(ROOT, "tests/.candidates");
const materialsArg = args.filter((a) => !a.startsWith("--") && a !== args[candDirArg + 1]);

// Per-material config. mismatchBudget = max fraction of differing pixels.
const MATERIALS = {
  brick: { baseline: "brick-scene.baseline.png", mismatchBudget: 0.02, threshold: 0.1 },
};

const targets = materialsArg.length ? materialsArg : Object.keys(MATERIALS);
mkdirSync(join(ROOT, "tests/.diffs"), { recursive: true });

let failed = false;
let skipped = 0;
console.log("Visual baseline gate (6.2.3)\n");

for (const mat of targets) {
  const cfg = MATERIALS[mat];
  if (!cfg) { console.error(`  ✖ unknown material '${mat}'`); failed = true; continue; }
  const baselinePath = join(BASELINE_DIR, cfg.baseline);
  const candidatePath = join(CANDIDATE_DIR, cfg.baseline);

  if (!existsSync(candidatePath)) {
    console.log(`  • ${mat}: no candidate at ${candidatePath} — SKIP (capture first).`);
    skipped++;
    continue;
  }
  const base = PNG.sync.read(readFileSync(baselinePath));
  const cand = PNG.sync.read(readFileSync(candidatePath));
  if (base.width !== cand.width || base.height !== cand.height) {
    console.error(`  ✖ ${mat}: size mismatch baseline ${base.width}x${base.height} vs candidate ${cand.width}x${cand.height}`);
    failed = true;
    continue;
  }
  const diff = new PNG({ width: base.width, height: base.height });
  const nDiff = pixelmatch(base.data, cand.data, diff.data, base.width, base.height, { threshold: cfg.threshold });
  const frac = nDiff / (base.width * base.height);
  const ok = frac <= cfg.mismatchBudget;
  const pct = (frac * 100).toFixed(3);
  if (ok) {
    console.log(`  ✓ ${mat}: ${nDiff} px (${pct}%) ≤ budget ${(cfg.mismatchBudget * 100).toFixed(1)}%`);
  } else {
    failed = true;
    const out = join(ROOT, "tests/.diffs", `${mat}.diff.png`);
    writeFileSync(out, PNG.sync.write(diff));
    console.error(`  ✖ ${mat}: ${nDiff} px (${pct}%) > budget ${(cfg.mismatchBudget * 100).toFixed(1)}% — diff: ${out}`);
  }
}

if (skipped === targets.length) {
  console.log("\n(no candidates rendered — gate is a no-op until a candidate is captured)");
}
if (failed) process.exit(1);
console.log("\n✓ PASS — renders within baseline budget.");
