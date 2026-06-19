// Run: node --test src/placeStories.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { selectFeaturedStory, getFeaturedStoryForPlace, allStories } from "./placeStories.js";

const fx = [
  { id: "a", placeId: "p1", title: "A", verificationStatus: "unresolved", approvalStatus: "proposed" },
  { id: "b", placeId: "p1", title: "B", verificationStatus: "verified", approvalStatus: "approved", featured: true },
  { id: "c", placeId: "p2", title: "C", verificationStatus: "verified", approvalStatus: "approved" },
];

test("selectFeaturedStory prefers the featured flag", () => {
  assert.equal(selectFeaturedStory(fx.filter((s) => s.placeId === "p1")).id, "b");
});

test("selectFeaturedStory falls back to first verified+approved", () => {
  const stories = [
    { id: "x", verificationStatus: "unresolved", approvalStatus: "proposed" },
    { id: "y", verificationStatus: "verified", approvalStatus: "approved" },
  ];
  assert.equal(selectFeaturedStory(stories).id, "y");
});

test("selectFeaturedStory falls back to first by order when none featured/verified", () => {
  const stories = [
    { id: "x", verificationStatus: "unresolved", approvalStatus: "proposed" },
    { id: "z", verificationStatus: "partial", approvalStatus: "proposed" },
  ];
  assert.equal(selectFeaturedStory(stories).id, "x");
});

test("publicMode drops proposed stories", () => {
  const stories = [{ id: "x", verificationStatus: "unresolved", approvalStatus: "proposed" }];
  assert.equal(selectFeaturedStory(stories, { publicMode: true }), null);
});

test("empty / no input returns null", () => {
  assert.equal(selectFeaturedStory([]), null);
  assert.equal(selectFeaturedStory(undefined), null);
});

test("getFeaturedStoryForPlace returns null for an unknown place", () => {
  assert.equal(getFeaturedStoryForPlace("nope"), null);
});

test("the seed 137 Oak story is loaded and featured (dev mode)", () => {
  const s = getFeaturedStoryForPlace("137-oak-haunted-house");
  assert.ok(s, "seed story present");
  assert.equal(s.id, "137-oak-haunted-house-lore");
  assert.equal(s.featured, true);
});

test("the seed story is hidden in publicMode (proposed)", () => {
  assert.equal(getFeaturedStoryForPlace("137-oak-haunted-house", { publicMode: true }), null);
});

test("allStories returns the corpus", () => {
  assert.ok(allStories().some((s) => s.id === "137-oak-haunted-house-lore"));
});
