import test from "node:test";
import assert from "node:assert/strict";
import { splitBlocks, carryForwardBlocks } from "./persistedBlocks.js";

test("splitBlocks separates the fetched body from marked blocks", () => {
  const { body, blocks } = splitBlocks(
    "line one\nline two\n## [DETAIL] https://a/1\ndetail one\n## [IMAGE READ 12 August 2026] poster\nwhat the poster says",
  );
  assert.equal(body, "line one\nline two");
  assert.deepEqual(blocks.map((b) => b.header), [
    "## [DETAIL] https://a/1",
    "## [IMAGE READ 12 August 2026] poster",
  ]);
  assert.equal(blocks[0].lines.length, 2);
});

test("a snapshot with no marked blocks promotes unchanged", () => {
  const { text, carried } = carryForwardBlocks("fresh listing\nsecond line\n", "old listing\n");
  assert.equal(text, "fresh listing\nsecond line\n");
  assert.deepEqual(carried, []);
});

test("a detail block lost to a FAILED fetch is carried forward, not deleted", () => {
  // The 2026-08-13 failure exactly: the run logged "detail: 0 page(s)
  // persisted for kettl-tea, 1 failed", so the fresh snapshot has no [DETAIL]
  // block — and the card quoting it would lose its evidence at promotion.
  const old = "listing v1\n## [DETAIL] https://kettl.co/collections/subscriptions\n$28 per month, ships monthly\n";
  const fresh = "listing v2\n";
  const { text, carried } = carryForwardBlocks(fresh, old);
  assert.match(text, /listing v2/);
  assert.match(text, /\$28 per month, ships monthly/);
  assert.deepEqual(carried, ["## [DETAIL] https://kettl.co/collections/subscriptions"]);
});

test("a block the new fetch DID return wins — no stale duplicate", () => {
  const old = "listing v1\n## [DETAIL] https://a/1\nold price $10\n";
  const fresh = "listing v2\n## [DETAIL] https://a/1\nnew price $12\n";
  const { text, carried } = carryForwardBlocks(fresh, old);
  assert.deepEqual(carried, []);
  assert.match(text, /new price \$12/);
  assert.doesNotMatch(text, /old price \$10/);
});

test("hand-persisted evidence with no URL to re-fetch survives promotion", () => {
  // [R1 PERSISTED] and [IMAGE READ] blocks are produced by no fetch at all, so
  // every promotion would drop them. Six greenpointers cards and the whole
  // macha-studio card depended on exactly this on 2026-08-13.
  const old = [
    "feed item\n",
    "## [R1 PERSISTED 2026-08-12] eventbrite listing\n",
    "Buffalo Firefly, 55 Nassau Ave, 2E\n",
    "## [IMAGE READ 12 August 2026] event posters\n",
    "Summer Fridays After Hours, every Friday\n",
  ].join("");
  const { text, carried } = carryForwardBlocks("feed item, rolled\n", old);
  assert.equal(carried.length, 2);
  assert.match(text, /55 Nassau Ave, 2E/);
  assert.match(text, /Summer Fridays After Hours, every Friday/);
});

test("promotion is idempotent — carrying forward twice adds nothing", () => {
  const old = "v1\n## [DETAIL] https://a/1\nevidence\n";
  const once = carryForwardBlocks("v2\n", old);
  const twice = carryForwardBlocks(once.text, old);
  assert.deepEqual(twice.carried, []);
  assert.equal(twice.text, once.text);
});

// 2026-08-14 — THE SIBLING CALLER. The 2026-08-13 fix wired carryForwardBlocks
// into PROMOTION only, which is where the loss was observed. The FETCH path
// still did `writeFileSync(snapPath, text + "\n")`, overwriting `<id>.txt`
// wholesale — so a block persisted into a WORKING snapshot (the only place a
// newsletter or flyer read can go before the run promotes) was destroyed by
// that source's next fetch, before it ever reached a baseline. Marianella's
// anniversary email lived in exactly that window. Same rule, second caller:
// A SNAPSHOT WRITE MAY ADD EVIDENCE, NEVER REMOVE IT.
test("a re-fetch preserves evidence persisted into the working snapshot", async () => {
  const { mkdtempSync, writeFileSync, readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { writeSnapshotPreservingBlocks } = await import("./persistedBlocks.js");

  const dir = mkdtempSync(join(tmpdir(), "snap-"));
  const snap = join(dir, "marianella-subscription-box.txt");
  writeFileSync(
    snap,
    "UP TO 50% OFF\n19 YEAR ANNIVERSARY SALE\n" +
      "## [NEWSLETTER PERSISTED 2026-08-14] messages+fqhkbz0zmpz0x@squaremktg.com, 2026-08-13\n" +
      "Closing this week. Once it's gone, it's gone until next year.\n",
  );

  const carried = writeSnapshotPreservingBlocks(snap, "UP TO 50% OFF\n19 YEAR ANNIVERSARY SALE\nNEW BANNER LINE\n");

  const after = readFileSync(snap, "utf8");
  assert.match(after, /NEW BANNER LINE/, "the fresh fetch must win for live listing content");
  assert.match(after, /Closing this week\./, "the persisted email must survive the re-fetch");
  assert.deepEqual(carried, [
    "## [NEWSLETTER PERSISTED 2026-08-14] messages+fqhkbz0zmpz0x@squaremktg.com, 2026-08-13",
  ]);
});
