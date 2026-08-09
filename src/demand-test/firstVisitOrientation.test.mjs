import test from "node:test";
import assert from "node:assert/strict";
import { shouldShowOrientation, ORIENTATION_SEEN_KEY } from "./firstVisitOrientation.js";

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

test("first ever call: shows the line and marks it seen", () => {
  const storage = fakeStorage();
  assert.equal(shouldShowOrientation(storage), true);
  assert.equal(storage.map.get(ORIENTATION_SEEN_KEY), "1");
});

test("second call on the same device: never shows again", () => {
  const storage = fakeStorage();
  shouldShowOrientation(storage);
  assert.equal(shouldShowOrientation(storage), false);
});

test("pre-existing flag (any truthy value) suppresses the line", () => {
  const storage = fakeStorage({ [ORIENTATION_SEEN_KEY]: "1" });
  assert.equal(shouldShowOrientation(storage), false);
});

test("unavailable storage (private mode) fails closed — never shows, never throws", () => {
  assert.equal(shouldShowOrientation(throwingStorage), false);
});
