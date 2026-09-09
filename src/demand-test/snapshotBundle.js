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

export function buildManifest({ now, includeMonthly, rosterHash: roster, productCommit, report, fetcher = "unknown" }) {
  const sources = Array.isArray(report?.sources) ? report.sources : [];
  let fetchedAt = now;
  if (!fetchedAt) {
    const generated = report?.generatedAt ? new Date(report.generatedAt) : null;
    fetchedAt = generated && !Number.isNaN(generated.getTime()) ? generated : new Date();
  }
  // When the caller doesn't say, derive it from the report itself: any
  // skipped_monthly entry means this run didn't cover monthly sources.
  const resolvedIncludeMonthly =
    includeMonthly === undefined ? !sources.some((s) => s.status === "skipped_monthly") : !!includeMonthly;
  return {
    fetchedAt: fetchedAt.toISOString(),
    includeMonthly: resolvedIncludeMonthly,
    rosterHash: roster,
    productCommit: productCommit ?? null,
    fetcher,
    sourceCount: sources.length,
    errorCount: sources.filter((s) => s.status === "error").length,
  };
}

// Two fetchers write the same bundle: the GitHub runner every morning, and
// the home Mac on top of it when awake, because a residential address reads
// the eight Cloudflare/Imperva-fronted sources a datacenter cannot (measured
// 2026-09-08). GitHub's cron can slip past the home run, so it must not
// overwrite a fresher, fuller read. Only a DIFFERENT fetcher's recent bundle
// is yielded to; a fetcher always replaces its own.
export function shouldYield({ existing, fetcher, now = new Date(), yieldHours }) {
  if (!(yieldHours > 0)) return { yield: false, reason: "no yield window" };
  if (!existing?.fetcher || existing.fetcher === fetcher) return { yield: false, reason: "no other fetcher's bundle" };
  const at = new Date(existing.fetchedAt ?? NaN);
  if (Number.isNaN(at.getTime())) return { yield: false, reason: "existing bundle has no usable fetchedAt" };
  const ageHours = (now - at) / 36e5;
  if (ageHours < yieldHours) {
    return { yield: true, reason: `${existing.fetcher} bundle is ${ageHours.toFixed(1)}h old (window ${yieldHours}h)` };
  }
  return { yield: false, reason: `${existing.fetcher} bundle is ${ageHours.toFixed(1)}h old, past the ${yieldHours}h window` };
}

// Stale halts (exit 1 upstream, the same roster-unreadable contract as the 15%
// ceiling). A roster mismatch only warns: the sources added since the fetch
// surface as errors one by one through resolveOfflineSource, which is the
// honest count, and the fix is to dispatch the workflow again.
export function assessBundle({ manifest, rosterHash: roster, now = new Date(), maxAgeHours = 6 }) {
  const reasons = [];
  const fetchedAt = manifest?.fetchedAt ? new Date(manifest.fetchedAt) : null;
  const parsed = !!fetchedAt && !Number.isNaN(fetchedAt.getTime());
  // A missing/unparseable fetchedAt is a malformed manifest, not an old one:
  // ageHours stays null rather than a stale-reading Infinity.
  const ageHours = parsed ? (now - fetchedAt) / 36e5 : null;
  if (!parsed) reasons.push("manifest has no usable fetchedAt");
  const stale = parsed && ageHours > maxAgeHours;
  if (stale) reasons.push(`snapshots are ${ageHours.toFixed(1)}h old (limit ${maxAgeHours}h)`);
  const rosterMismatch = !!roster && manifest?.rosterHash !== roster;
  return { ok: reasons.length === 0, stale, ageHours, rosterMismatch, reasons };
}

// What --offline does for one roster source, given the runner's report entry
// for it and whether its snapshot file arrived in the bundle.
export function resolveOfflineSource(src, reportEntry, hasSnapshot) {
  if (!reportEntry) {
    return {
      kind: "error",
      message: `${src.id}: not in the runner's fetch report — added to the roster after the fetch? re-dispatch ingest-fetch`,
    };
  }
  if (reportEntry.status === "error") return { kind: "error", message: `runner: ${reportEntry.error ?? "unknown error"}` };
  if (reportEntry.status === "skipped_monthly") {
    return { kind: "error", message: "runner skipped this monthly source — dispatch ingest-fetch with include_monthly" };
  }
  if (!hasSnapshot) return { kind: "error", message: "runner reported a read but the bundle has no snapshot for it" };
  return { kind: "text", method: reportEntry.method };
}
