import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { diffAgainstBaseline, resolveIngestedHash } from "./sourceDiff.js";

const hash = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);

// --- diffAgainstBaseline ---------------------------------------------------

test("added lines are the ones the baseline never had", () => {
  const d = diffAgainstBaseline("a\nb", "a\nb\nc");
  assert.deepEqual(d.added, ["c"]);
  assert.equal(d.addedLines, 1);
  assert.equal(d.removedLines, 0);
});

test("removals are counted, not swallowed — the bpl-north-brooklyn case", () => {
  // 12 events fell off the calendar and nothing replaced them. Under the old
  // report this read as "changed, +0 lines" and looked like noise.
  const baseline = Array.from({ length: 12 }, (_, i) => `event ${i}`).join("\n") + "\nheader";
  const d = diffAgainstBaseline(baseline, "header");
  assert.equal(d.addedLines, 0);
  assert.equal(d.removedLines, 12);
  assert.equal(d.reorderedOnly, false, "a source that emptied out is not churn");
});

test("identical text: nothing added, nothing removed, not reordered", () => {
  const d = diffAgainstBaseline("a\nb", "a\nb");
  assert.equal(d.addedLines, 0);
  assert.equal(d.removedLines, 0);
  assert.equal(d.reorderedOnly, false);
});

test("reorderedOnly: same line set, different bytes", () => {
  const d = diffAgainstBaseline("a\nb", "b\na");
  assert.equal(d.addedLines, 0);
  assert.equal(d.removedLines, 0);
  assert.equal(d.reorderedOnly, true);
});

test("duplicate new listings both count", () => {
  const d = diffAgainstBaseline("a", "a\nnew\nnew");
  assert.equal(d.addedLines, 2);
});

// --- resolveIngestedHash ---------------------------------------------------
// The committed baseline outranks the gitignored state cache. A pull brings a
// new baseline next to a stale state.ingestedHash; trusting state made four
// sources report "changed" against text they matched byte for byte.

test("baseline file wins over a stale state hash", () => {
  const baselineText = "a\nb\n";
  const h = resolveIngestedHash({ baselineText, stateIngestedHash: "staleeeeeeeeeeee", hash });
  assert.equal(h, hash("a\nb"), "trailing newline is stripped, as snapshots are written text + \\n");
  assert.notEqual(h, "staleeeeeeeeeeee");
});

test("state is used only when there is no baseline file", () => {
  assert.equal(resolveIngestedHash({ baselineText: null, stateIngestedHash: "abc", hash }), "abc");
});

test("no baseline and no state: a genuinely new source", () => {
  assert.equal(resolveIngestedHash({ baselineText: null, stateIngestedHash: undefined, hash }), null);
});

test("a source matching its baseline resolves to the same hash the fetch produces", () => {
  const text = "line one\nline two";
  const resolved = resolveIngestedHash({ baselineText: text + "\n", stateIngestedHash: "whatever", hash });
  assert.equal(resolved, hash(text), "this equality is what makes the source report unchanged");
});
