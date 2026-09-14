import test from "node:test";
import assert from "node:assert/strict";

import { digestSegments, LENS_EDITION_THRESHOLD } from "./digestSegments.js";

const sub = (email, follow, submittedAt = "2026-09-11T16:00:00.000Z") => ({
  submittedAt,
  email,
  follow,
  src: null,
});

const family = (n) => Array.from({ length: n }, (_, i) => sub(`f${i}@x.com`, "lens:family_kids"));

test("a lens with enough subscribers gets its own edition; everyone else rides Greenpoint", () => {
  const out = digestSegments([
    ...family(LENS_EDITION_THRESHOLD),
    sub("a@x.com", "all"),
    sub("b@x.com", null), // July signup, before the follow field existed
    sub("d@x.com", "lens:deals_memberships"),
  ]);
  assert.deepEqual(
    out.editions.map((e) => [e.id, e.recipients.length]),
    [["family_kids", LENS_EDITION_THRESHOLD], ["greenpoint", 3]],
  );
  const kids = out.editions[0];
  assert.equal(kids.src, "follow-family-kids");
  assert.equal(kids.link, "https://stoopwise.com/kids?src=follow-family-kids");
  assert.equal(kids.label, "Family & Kids");
  const gp = out.editions[1];
  assert.equal(gp.src, "digest");
  assert.equal(gp.link, "https://stoopwise.com/?src=digest");
  assert.deepEqual(out.folded, [{ lens: "deals_memberships", count: 1 }]);
});

test("a lens below the threshold rides Greenpoint and is reported as folded", () => {
  const out = digestSegments([...family(LENS_EDITION_THRESHOLD - 1), sub("a@x.com", "all")]);
  assert.deepEqual(out.editions.map((e) => e.id), ["greenpoint"]);
  assert.equal(out.editions[0].recipients.length, LENS_EDITION_THRESHOLD);
  assert.deepEqual(out.folded, [{ lens: "family_kids", count: LENS_EDITION_THRESHOLD - 1 }]);
});

test("one person, several submissions: a lens choice beats 'all', and nobody is emailed twice", () => {
  const out = digestSegments([
    ...family(LENS_EDITION_THRESHOLD),
    sub("dup@x.com", "lens:family_kids", "2026-09-11T16:36:00.000Z"),
    sub("dup@x.com", "all", "2026-09-11T16:36:53.000Z"),
    sub("Dup@X.com", "all", "2026-09-12T10:00:00.000Z"),
  ]);
  const all = out.editions.flatMap((e) => e.recipients);
  assert.equal(all.filter((e) => e === "dup@x.com").length, 1);
  assert.ok(out.editions[0].recipients.includes("dup@x.com"), "the lens choice wins");
  assert.equal(out.duplicates, 2);
});

test("two lens choices from one person: the latest lens wins", () => {
  const out = digestSegments([
    ...family(LENS_EDITION_THRESHOLD),
    sub("p@x.com", "lens:family_kids", "2026-09-11T16:00:00.000Z"),
    sub("p@x.com", "lens:civic", "2026-09-12T16:00:00.000Z"),
  ]);
  assert.deepEqual(out.folded, [{ lens: "civic", count: 1 }]);
  assert.ok(!out.editions[0].recipients.includes("p@x.com"));
});

test("unsubscribed addresses are dropped, case-insensitively, and counted", () => {
  const out = digestSegments([...family(LENS_EDITION_THRESHOLD), sub("a@x.com", "all")], {
    unsubscribed: ["F0@X.COM", "a@x.com", "never-signed-up@x.com"],
  });
  const all = out.editions.flatMap((e) => e.recipients);
  assert.ok(!all.includes("f0@x.com"));
  assert.ok(!all.includes("a@x.com"));
  assert.equal(out.unsubscribed, 2);
});

test("submissions without an email are dropped and counted", () => {
  const out = digestSegments([sub(null, "all"), sub("a@x.com", "all")]);
  assert.equal(out.dropped, 1);
  assert.equal(out.editions[0].recipients.length, 1);
});

test("an unknown lens id never becomes an edition", () => {
  const out = digestSegments(Array.from({ length: 6 }, (_, i) => sub(`u${i}@x.com`, "lens:nope")));
  assert.deepEqual(out.editions.map((e) => e.id), ["greenpoint"]);
  assert.deepEqual(out.folded, [{ lens: "nope", count: 6 }]);
});

test("recipients come out sorted, so two runs print the same list", () => {
  const out = digestSegments([sub("b@x.com", "all"), sub("a@x.com", "all")]);
  assert.deepEqual(out.editions[0].recipients, ["a@x.com", "b@x.com"]);
});
