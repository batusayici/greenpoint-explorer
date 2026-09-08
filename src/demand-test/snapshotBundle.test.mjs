// src/demand-test/snapshotBundle.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { rosterHash, buildManifest, assessBundle, resolveOfflineSource } from "./snapshotBundle.js";

// The fetch moved off the sandbox proxy on 2026-09-08 (spec in docs/superpowers/specs).
// These are the decisions the pull and offline paths make; the scripts only move files.

const SOURCES = [
  { id: "b", url: "https://b.example/", fetch: "browser", notes: "x" },
  { id: "a", url: "https://a.example/feed/", fetch: "feed" },
];

test("rosterHash ignores notes and order, changes on id/url/fetch", () => {
  const h = rosterHash(SOURCES);
  assert.equal(h.length, 16);
  assert.equal(rosterHash([...SOURCES].reverse()), h);
  assert.equal(rosterHash(SOURCES.map((s) => ({ ...s, notes: "different" }))), h);
  assert.notEqual(rosterHash([...SOURCES, { id: "c", url: "https://c.example/" }]), h);
  assert.notEqual(rosterHash(SOURCES.map((s) => (s.id === "a" ? { ...s, fetch: "json" } : s))), h);
});

test("buildManifest counts sources and errors from the runner report", () => {
  const now = new Date("2026-09-09T11:40:00Z");
  const m = buildManifest({
    now,
    includeMonthly: true,
    rosterHash: "abc",
    productCommit: "d431329",
    report: { sources: [{ status: "changed" }, { status: "error" }, { status: "unchanged" }] },
  });
  assert.deepEqual(m, {
    fetchedAt: "2026-09-09T11:40:00.000Z",
    includeMonthly: true,
    rosterHash: "abc",
    productCommit: "d431329",
    sourceCount: 3,
    errorCount: 1,
  });
});

test("buildManifest: with no now, fetchedAt comes from the report's generatedAt", () => {
  const m = buildManifest({
    includeMonthly: false,
    rosterHash: "abc",
    productCommit: "d431329",
    report: { generatedAt: "2026-09-09T11:32:10.000Z", sources: [] },
  });
  assert.equal(m.fetchedAt, "2026-09-09T11:32:10.000Z");
});

test("buildManifest: an unparseable generatedAt still yields a valid ISO fetchedAt", () => {
  const m = buildManifest({
    includeMonthly: false,
    rosterHash: "abc",
    productCommit: "d431329",
    report: { generatedAt: "not-a-date", sources: [] },
  });
  assert.equal(Number.isNaN(Date.parse(m.fetchedAt)), false);
});

test("buildManifest: an explicit now wins over the report's generatedAt", () => {
  const now = new Date("2026-09-09T12:00:00Z");
  const m = buildManifest({
    now,
    includeMonthly: false,
    rosterHash: "abc",
    productCommit: "d431329",
    report: { generatedAt: "2026-09-09T11:32:10.000Z", sources: [] },
  });
  assert.equal(m.fetchedAt, "2026-09-09T12:00:00.000Z");
});

test("assessBundle: fresh and matching is ok", () => {
  const a = assessBundle({
    manifest: { fetchedAt: "2026-09-09T11:40:00Z", rosterHash: "abc" },
    rosterHash: "abc",
    now: new Date("2026-09-09T13:00:00Z"),
  });
  assert.equal(a.ok, true);
  assert.equal(a.stale, false);
  assert.equal(a.rosterMismatch, false);
  assert.deepEqual(a.reasons, []);
});

test("assessBundle: older than the limit halts, with the age in the reason", () => {
  const a = assessBundle({
    manifest: { fetchedAt: "2026-09-08T11:40:00Z", rosterHash: "abc" },
    rosterHash: "abc",
    now: new Date("2026-09-09T13:00:00Z"),
  });
  assert.equal(a.ok, false);
  assert.equal(a.stale, true);
  assert.match(a.reasons[0], /25\.3h old \(limit 6h\)/);
});

test("assessBundle: missing fetchedAt halts", () => {
  const a = assessBundle({ manifest: {}, rosterHash: "abc", now: new Date() });
  assert.equal(a.ok, false);
  assert.match(a.reasons[0], /fetchedAt/);
});

test("assessBundle: a roster mismatch is a warning, not a halt", () => {
  const a = assessBundle({
    manifest: { fetchedAt: "2026-09-09T11:40:00Z", rosterHash: "old" },
    rosterHash: "new",
    now: new Date("2026-09-09T12:00:00Z"),
  });
  assert.equal(a.ok, true);
  assert.equal(a.rosterMismatch, true);
});

test("resolveOfflineSource: a read source with a snapshot yields its method", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "changed", method: "feed" }, true);
  assert.deepEqual(r, { kind: "text", method: "feed" });
});

test("resolveOfflineSource: a runner error is surfaced verbatim, prefixed", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "error", error: "HTTP 403" }, false);
  assert.equal(r.kind, "error");
  assert.equal(r.message, "runner: HTTP 403");
});

test("resolveOfflineSource: absent from the report means the roster moved after the fetch", () => {
  const r = resolveOfflineSource({ id: "zzz" }, undefined, false);
  assert.equal(r.kind, "error");
  assert.match(r.message, /not in the runner's fetch report/);
  assert.match(r.message, /re-dispatch/);
});

test("resolveOfflineSource: a read without a snapshot file is an error", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "unchanged", method: "plain" }, false);
  assert.equal(r.kind, "error");
  assert.match(r.message, /no snapshot/);
});

test("resolveOfflineSource: a runner-skipped monthly source is an error naming the fix", () => {
  const r = resolveOfflineSource({ id: "a" }, { id: "a", status: "skipped_monthly" }, false);
  assert.equal(r.kind, "error");
  assert.match(r.message, /include_monthly/);
});
