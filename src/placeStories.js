// src/placeStories.js
// PlaceStory content layer (Phase 8.2). Editorial truth, kept SEPARATE from
// geometry/business truth, gated like place records (sources + verification +
// approval). Pure + Node-importable (JSON import attribute works in Node ESM
// and the Vite bundle). One featured story per place.
import stories from "./data/stories/place-stories.v0.1.json" with { type: "json" };

// Pick the single story to surface from a candidate array.
//   publicMode: drop anything not approvalStatus === "approved".
//   selection : first `featured`; else first verified+approved; else first by order.
export function selectFeaturedStory(candidates, { publicMode = false } = {}) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const visible = publicMode
    ? candidates.filter((s) => s.approvalStatus === "approved")
    : candidates;
  if (visible.length === 0) return null;
  return (
    visible.find((s) => s.featured === true) ??
    visible.find((s) => s.verificationStatus === "verified" && s.approvalStatus === "approved") ??
    visible[0]
  );
}

export function getFeaturedStoryForPlace(placeId, opts = {}) {
  if (!placeId) return null;
  return selectFeaturedStory(stories.filter((s) => s.placeId === placeId), opts);
}

export function allStories() {
  return stories;
}
