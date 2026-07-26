import test from "node:test";
import assert from "node:assert/strict";
import { recordReturnVisit, RETURN_VISIT_KEYS, WEEK_MS } from "./returnVisit.js";

// Storage-shaped fake (getItem/setItem) so the sensor runs under node --test
// with no DOM, same seam as bindTransport for the analytics vendor.
function fakeStorage(init = {}) {
  const map = new Map(Object.entries(init));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    map,
  };
}

const throwingStorage = {
  getItem() {
    throw new Error("storage disabled");
  },
  setItem() {
    throw new Error("storage disabled");
  },
};

const T0 = 1753500000000; // fixed epoch so week math is deterministic

test("first ever visit: count 1, week 0, first-seen persisted", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  const visit = recordReturnVisit({ local, session, now: T0 });
  assert.deepEqual(visit, { visitCount: 1, weekIndex: 0 });
  assert.equal(local.map.get(RETURN_VISIT_KEYS.firstSeen), String(T0));
  assert.equal(local.map.get(RETURN_VISIT_KEYS.visitCount), "1");
});

test("same browser session records only once (reloads don't inflate the count)", () => {
  const local = fakeStorage();
  const session = fakeStorage();
  recordReturnVisit({ local, session, now: T0 });
  const again = recordReturnVisit({ local, session, now: T0 + 1000 });
  assert.equal(again, null);
  assert.equal(local.map.get(RETURN_VISIT_KEYS.visitCount), "1");
});

test("a new session two weeks later: count 2, week index 2", () => {
  const local = fakeStorage();
  recordReturnVisit({ local, session: fakeStorage(), now: T0 });
  const visit = recordReturnVisit({
    local,
    session: fakeStorage(),
    now: T0 + 2 * WEEK_MS + 1000,
  });
  assert.deepEqual(visit, { visitCount: 2, weekIndex: 2 });
  assert.equal(local.map.get(RETURN_VISIT_KEYS.visitCount), "2");
  assert.equal(
    local.map.get(RETURN_VISIT_KEYS.firstSeen),
    String(T0),
    "first-seen never moves after the first visit",
  );
});

test("corrupted stored values reset to a fresh first visit instead of NaN", () => {
  const local = fakeStorage({
    [RETURN_VISIT_KEYS.firstSeen]: "garbage",
    [RETURN_VISIT_KEYS.visitCount]: "not-a-number",
  });
  const visit = recordReturnVisit({ local, session: fakeStorage(), now: T0 });
  assert.deepEqual(visit, { visitCount: 1, weekIndex: 0 });
  assert.equal(local.map.get(RETURN_VISIT_KEYS.firstSeen), String(T0));
});

test("a clock that moved backwards clamps the week index to 0", () => {
  const local = fakeStorage();
  recordReturnVisit({ local, session: fakeStorage(), now: T0 });
  const visit = recordReturnVisit({
    local,
    session: fakeStorage(),
    now: T0 - 3 * WEEK_MS,
  });
  assert.equal(visit.weekIndex, 0);
});

test("unavailable storage (private mode) returns null and never throws", () => {
  const visit = recordReturnVisit({
    local: throwingStorage,
    session: throwingStorage,
    now: T0,
  });
  assert.equal(visit, null);
});
