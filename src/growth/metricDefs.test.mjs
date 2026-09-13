import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
  METRIC_DEFS,
  QUERIES,
  PROD_HOSTS,
  TEST_SRC_TAGS,
  hashDef,
  bindQuery,
  ROW_LIMIT,
} from "./metricDefs.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const flat = (s) => s.replace(/\s+/g, " ").trim();

test("every definition is complete and its id is unique", () => {
  const seen = new Set();
  for (const d of METRIC_DEFS) {
    assert.ok(d.id, "a definition has no id");
    assert.ok(!seen.has(d.id), `duplicate id: ${d.id}`);
    seen.add(d.id);
    assert.ok(d.label, `${d.id} has no label`);
    assert.ok(d.role, `${d.id} has no role`);
    assert.equal(typeof d.compute, "function", `${d.id} has no compute`);
    assert.match(d.defVersion, /^[0-9a-f]{8}$/, `${d.id} has no defVersion`);
    assert.ok(
      ["posthog", "tally", "gsc", "repo"].includes(d.source),
      `${d.id} has an unknown source: ${d.source}`,
    );
    if (d.query) assert.ok(QUERIES[d.query], `${d.id} names a query that does not exist`);
  }
});

// This is the test that would have caught activation drifting from the doc. The
// script computed it lifetime while growth-engine.md §3 said first session, for
// two months, and nothing compared the two.
test("each quoted definition still appears in growth-engine.md", () => {
  const doc = flat(readFileSync(resolve(ROOT, "docs/growth/growth-engine.md"), "utf8"));
  for (const d of METRIC_DEFS) {
    if (!d.docRef) continue;
    assert.ok(
      doc.includes(flat(d.docRef)),
      `${d.id}: growth-engine.md no longer contains "${d.docRef}". ` +
        `Either the doc changed and the code must follow, or the quote is wrong. ` +
        `Do not delete the docRef to make this pass.`,
    );
  }
});

// Editing a query or a compute function without bumping defVersion would let a
// trend be computed across a definition change. The activation switch alone
// moves 50/634 to 44/641, which renders as a 12% fall that means nothing.
test("defVersion matches the query and compute function it names", () => {
  for (const d of METRIC_DEFS) {
    assert.equal(
      hashDef(d),
      d.defVersion,
      `${d.id}: the definition changed but defVersion did not. ` +
        `Set defVersion to "${hashDef(d)}" and restate the history the change breaks.`,
    );
  }
});

test("every query carries the production-host filter and the test-tag exclusion", () => {
  for (const [name, sql] of Object.entries(QUERIES)) {
    for (const host of PROD_HOSTS) {
      assert.ok(sql.includes(`'${host}'`), `${name} is missing host ${host}`);
    }
    for (const tag of TEST_SRC_TAGS) {
      assert.ok(sql.includes(`'${tag}'`), `${name} is missing test tag ${tag}`);
    }
  }
});

// Unbounded queries return different numbers for the same calendar date
// depending on the hour they ran, which makes a rerun disagree with the run it
// was meant to reproduce.
test("every query is bounded above, and refuses to run unbound", () => {
  for (const [name, sql] of Object.entries(QUERIES)) {
    assert.ok(sql.includes("{{upperBound}}"), `${name} has no upper bound`);
    const bound = bindQuery(sql, "2026-09-14 04:00:00");
    assert.ok(!bound.includes("{{upperBound}}"), `${name} left a placeholder behind`);
    assert.ok(bound.includes("2026-09-14 04:00:00"));
    assert.throws(() => bindQuery(bound, "x"), /no upper bound/, `${name} bound twice`);
  }
});

// Day arithmetic belongs in days.js, where the test runner can reach it. HogQL's
// toDate() resolves in the PostHog project timezone — UTC here — which put the
// product's busiest hours on the following day.
test("no query does its own date bucketing", () => {
  for (const [name, sql] of Object.entries(QUERIES)) {
    assert.ok(
      !/\btoDate\s*\(/i.test(sql),
      `${name} calls toDate(); bucket days in days.js instead, in America/New_York`,
    );
    assert.ok(!/\btoStartOfWeek\s*\(/i.test(sql), `${name} calls toStartOfWeek()`);
  }
});

// HogQL applies its own LIMIT when a query omits one, and the default is 100
// rows. Unlimited, the session roll-up returned 95 of 1,418 rows on 2026-09-13
// and every rate computed off it would have described the last hundred sessions
// while reading like all of them. Nothing in the response says it was cut.
test("every query sets its own row limit", () => {
  for (const [name, sql] of Object.entries(QUERIES)) {
    assert.match(
      sql,
      new RegExp(`LIMIT\\s+${ROW_LIMIT}\\b`),
      `${name} has no explicit LIMIT — HogQL will silently cap it at 100 rows`,
    );
  }
});

test("the dropped-host audit stays, and stays outside the metrics", () => {
  assert.ok(QUERIES.droppedHosts, "the non-production audit was removed");
  assert.ok(
    !METRIC_DEFS.some((d) => d.query === "droppedHosts"),
    "dropped traffic is an audit, never a metric",
  );
});
