// src/demand-test/snapshotBundle.js
// The ingest's fetch runs on a GitHub Actions runner since 2026-09-08 and hands
// the routine a bundle: manifest.json, fetch-report.json, snapshots/<id>.txt.
// Everything that decides whether a bundle is usable lives here, tested, so the
// two scripts that move files (publish-snapshots.mjs, pull-snapshots.mjs) and
// the --offline mode of fetch-sources.mjs carry no judgment of their own.
import { createHash } from "node:crypto";

// Identity of the roster as the runner saw it: id, url and fetch strategy per
// source, order-free. Notes and per-source config are deliberately excluded —
// editing a note must not make the routine think the runner read a different
// roster.
export function rosterHash(sources) {
  const lines = sources.map((s) => `${s.id}\t${s.url}\t${s.fetch ?? "auto"}`).sort();
  return createHash("sha256").update(lines.join("\n")).digest("hex").slice(0, 16);
}

export function buildManifest({ now = new Date(), includeMonthly, rosterHash, productCommit, report }) {
  const sources = Array.isArray(report?.sources) ? report.sources : [];
  return {
    fetchedAt: now.toISOString(),
    includeMonthly: !!includeMonthly,
    rosterHash,
    productCommit: productCommit ?? null,
    sourceCount: sources.length,
    errorCount: sources.filter((s) => s.status === "error").length,
  };
}

// Stale halts (exit 1 upstream, the same roster-unreadable contract as the 15%
// ceiling). A roster mismatch only warns: the sources added since the fetch
// surface as errors one by one through resolveOfflineSource, which is the
// honest count, and the fix is to dispatch the workflow again.
export function assessBundle({ manifest, rosterHash, now = new Date(), maxAgeHours = 6 }) {
  const reasons = [];
  const fetchedAt = manifest?.fetchedAt ? new Date(manifest.fetchedAt) : null;
  const ageHours = fetchedAt && !Number.isNaN(fetchedAt.getTime()) ? (now - fetchedAt) / 36e5 : Infinity;
  if (ageHours === Infinity) reasons.push("manifest has no usable fetchedAt");
  const stale = ageHours > maxAgeHours;
  if (stale && ageHours !== Infinity) reasons.push(`snapshots are ${ageHours.toFixed(1)}h old (limit ${maxAgeHours}h)`);
  const rosterMismatch = !!rosterHash && manifest?.rosterHash !== rosterHash;
  return { ok: reasons.length === 0, stale, ageHours, rosterMismatch, reasons };
}

// What --offline does for one roster source, given the runner's report entry
// for it and whether its snapshot file arrived in the bundle.
export function resolveOfflineSource(src, reportEntry, hasSnapshot) {
  if (!reportEntry) {
    return {
      kind: "error",
      message: `not in the runner's fetch report — added to the roster after the fetch? re-dispatch ingest-fetch`,
    };
  }
  if (reportEntry.status === "error") return { kind: "error", message: `runner: ${reportEntry.error}` };
  if (reportEntry.status === "skipped_monthly") {
    return { kind: "error", message: "runner skipped this monthly source — dispatch ingest-fetch with include_monthly" };
  }
  if (!hasSnapshot) return { kind: "error", message: "runner reported a read but the bundle has no snapshot for it" };
  return { kind: "text", method: reportEntry.method };
}
