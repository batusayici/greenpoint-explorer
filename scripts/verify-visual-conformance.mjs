#!/usr/bin/env node
// Phase 6.2.3 — visual-system conformance gate (color-token half).
//
// Scans every file under src/ for color literals and accounts for each one:
//   - token definitions (palette.js)         → OK (the source)
//   - token references (no raw literal)       → OK
//   - authored-data regions (allowlisted)     → OK, with reason
//   - exempt files (debug / dev / data / css) → OK, with reason
//   - raw 0x color in a PRODUCT file          → FAIL (loud)
//   - #rrggbb strings in a PRODUCT file       → tracked debt (loud, non-fatal)
//
// Nothing is silently skipped: the run prints a full census. Exit 1 on any
// product-path 0x violation (or on debt when hexStringDebt.fatal is true).
//
// Usage: node scripts/verify-visual-conformance.mjs [--strict]

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const allow = JSON.parse(readFileSync(join(ROOT, "scripts/visual-conformance-allowlist.json"), "utf8"));
const STRICT = process.argv.includes("--strict");

const HEX_INT = /0x[0-9a-fA-F]{3,8}\b/g; // 0xRGB..0xRRGGBBAA
const HEX_STR = /#[0-9a-fA-F]{3,8}\b/g; // "#rrggbb"

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const rel = (p) => relative(ROOT, p).split("\\").join("/");
const matchesGlob = (relPath, glob) =>
  glob.endsWith("/") ? relPath.startsWith(glob)
  : glob.startsWith(".") ? relPath.endsWith(glob)
  : relPath === glob || relPath.startsWith(glob);

const exemptReason = (relPath) => {
  for (const e of allow.exemptGlobs) if (matchesGlob(relPath, e.glob)) return e.reason;
  return null;
};
const isTokenSource = (relPath) => allow.tokenSource.includes(relPath);
const isProduct = (relPath) => allow.productFiles.includes(relPath);

// Resolve the brace-delimited region of a top-level `const NAME = {` so we can
// allowlist authored-data colors inside it without pinning exact hex values.
function regionLines(text, constName) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => new RegExp(`\\bconst\\s+${constName}\\s*=`).test(l));
  if (start < 0) return null;
  let depth = 0, started = false;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === "{") { depth++; started = true; }
      else if (ch === "}") depth--;
    }
    if (started && depth <= 0) return [start, i];
  }
  return [start, lines.length - 1];
}

const isColorIntLiteral = (lit) => {
  // 0xRRGGBB / 0xRGB / 0xRRGGBBAA are colors; ignore obvious masks/bounds.
  const hex = lit.slice(2);
  return hex.length === 3 || hex.length === 6 || hex.length === 8;
};

const violations = [];
const debt = [];
const census = { tokenSource: 0, exempt: 0, authoredData: 0, productClean: 0 };

for (const file of walk(SRC)) {
  if (!/\.(jsx?|mjs|css)$/.test(file)) continue;
  const relPath = rel(file);
  const text = readFileSync(file, "utf8");

  if (isTokenSource(relPath)) { census.tokenSource++; continue; }

  const reason = exemptReason(relPath);
  if (reason && !isProduct(relPath)) { census.exempt++; continue; }

  // Product (or unclassified) file: scan literals.
  const lines = text.split("\n");
  const authored = (allow.authoredDataRegions[relPath] ?? [])
    .map((r) => ({ ...r, range: regionLines(text, r.const) }))
    .filter((r) => r.range);

  lines.forEach((line, idx) => {
    const inAuthored = authored.find((r) => idx >= r.range[0] && idx <= r.range[1]);
    for (const m of line.matchAll(HEX_INT)) {
      if (!isColorIntLiteral(m[0])) continue;
      if (inAuthored) { census.authoredData++; continue; }
      if (isProduct(relPath)) violations.push({ relPath, line: idx + 1, lit: m[0], code: line.trim() });
      else violations.push({ relPath, line: idx + 1, lit: m[0], code: line.trim(), note: "UNCLASSIFIED file — add to allowlist (product/exempt)" });
    }
    for (const m of line.matchAll(HEX_STR)) {
      if (isProduct(relPath)) debt.push({ relPath, line: idx + 1, lit: m[0] });
    }
  });
  if (isProduct(relPath)) census.productClean++;
}

// ---- report ----
console.log("Visual-system conformance gate (6.2.3)\n");
console.log(`  token source files : ${census.tokenSource}`);
console.log(`  exempt files       : ${census.exempt} (debug / dev / data / css — allowlisted)`);
console.log(`  product files      : ${allow.productFiles.length} scanned`);
console.log(`  authored-data 0x   : ${census.authoredData} (allowlisted regions)`);

if (debt.length) {
  console.log(`\n  TRACKED DEBT — #hex string colors in product files (canvas/CSS registry, non-fatal): ${debt.length}`);
  const byFile = {};
  for (const d of debt) byFile[d.relPath] = (byFile[d.relPath] ?? 0) + 1;
  for (const [f, n] of Object.entries(byFile)) console.log(`      ${f}: ${n}`);
}

if (violations.length) {
  console.error(`\n✖ FAIL — ${violations.length} raw color literal(s) outside the token registry:\n`);
  for (const v of violations) {
    console.error(`    ${v.relPath}:${v.line}  ${v.lit}${v.note ? `  [${v.note}]` : ""}`);
    console.error(`        ${v.code}`);
  }
  console.error("\n  Fix: move the color into src/visualSystem/palette.js and reference the token,");
  console.error("  or add the file/region to scripts/visual-conformance-allowlist.json with a reason.");
  process.exit(1);
}

const debtFatal = allow.hexStringDebt.fatal || STRICT;
if (debt.length && debtFatal) {
  console.error(`\n✖ FAIL (strict) — ${debt.length} #hex string color(s) in product files.`);
  process.exit(1);
}

console.log("\n✓ PASS — every scene color resolves to a token (or an allowlisted region).");
