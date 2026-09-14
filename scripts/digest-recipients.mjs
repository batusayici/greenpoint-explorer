#!/usr/bin/env node
// The Thursday BCC lists — who gets which edition of the weekly digest.
//
//   npm run digest:recipients
//
// Reads the signup form through the same Tally client the growth pull uses
// (GETs only), applies the edition rules in src/growth/digestSegments.js, and
// prints each edition's recipients to the terminal. It writes nothing:
// addresses never enter the repo, a snapshot, or a log. Copy the BCC line into
// the Gmail draft and nothing else (docs/growth/digest.md, Thursday checklist).
//
// Someone who replies "stop" goes into .digest-unsubscribed at the repo root
// (gitignored, one address per line) and disappears from the next run.
//
// Always via npm run — the script sets NODE_USE_ENV_PROXY=1, without which a
// proxied environment intercepts the call instead of failing it (2026-08-10).

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { assertProxyAware } from "../src/demand-test/proxyDiagnosis.js";
import { digestSegments, LENS_EDITION_THRESHOLD } from "../src/growth/digestSegments.js";
import { ROOT, loadEnvLocal, SourceError } from "./growth/env.mjs";
import { pullTally } from "./growth/sources/tally.mjs";

assertProxyAware();
loadEnvLocal();

const stopFile = resolve(ROOT, ".digest-unsubscribed");
const unsubscribed = existsSync(stopFile)
  ? readFileSync(stopFile, "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  : [];

let forms;
try {
  ({ forms } = await pullTally({}));
} catch (error) {
  if (error instanceof SourceError) {
    console.error(`SENSOR DOWN (${error.status}): ${error.message}`);
    process.exit(error.exitCode);
  }
  throw error;
}
if (!forms.signup) {
  console.error("Tally returned no signup form — nothing to send to. Check the pull before sending.");
  process.exit(6);
}

const out = digestSegments(forms.signup, { unsubscribed });

console.log(`Signup form: ${forms.signup.length} submissions → ${out.editions.reduce((n, e) => n + e.recipients.length, 0)} people`);
console.log(
  `  duplicates ${out.duplicates} · unsubscribed ${out.unsubscribed} · no email ${out.dropped}` +
    ` · lens edition threshold ${LENS_EDITION_THRESHOLD}`,
);
for (const f of out.folded) {
  console.log(`  folded into Greenpoint: ${f.lens} (${f.count} — needs ${LENS_EDITION_THRESHOLD} for its own edition)`);
}
for (const e of out.editions) {
  console.log(`\n=== ${e.label} edition — ${e.recipients.length} recipients — src=${e.src}`);
  console.log(`  link (copy exactly): ${e.link}`);
  console.log(`  BCC:`);
  console.log(`  ${e.recipients.join(", ")}`);
}
