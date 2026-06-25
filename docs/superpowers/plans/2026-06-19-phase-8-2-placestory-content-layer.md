# Phase 8.2 — PlaceStory Content Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the PlaceStory content layer — a source-backed, truth-gated editorial story attached to a place and surfaced as a featured-story section in the place card — proven end-to-end with the 137 Oak St "Haunted House" audio story.

**Architecture:** Editorial truth lives in its own data files + loader, separate from geometry/business truth, and is gated like place records (`sources` / `verificationStatus` / `approvalStatus`). A pure loader selects one featured story per place; `PlaceCard` renders it (text + image + audio); 137 Oak St is promoted to a hero record (render deferred, mirroring Brouwerij Lane). All tested logic is pure `.mjs`; the card change is presentational (build + preview verified, matching existing UI conventions — the repo has no React test harness).

**Tech Stack:** Node ESM (`node --test "src/**/*.test.mjs"`), React 19 + Three.js + Vite, JSON imports via `with { type: "json" }`, truth verifiers (`scripts/verify-*.mjs`).

## Global Constraints

- **Editorial truth is separate + gated.** PlaceStory data lives in its own file/loader, never mixed into geometry or business records. Every story cites `sources: [{label,url}]` and carries `verificationStatus` + `approvalStatus`. (spec §Purpose, decision 2)
- **Enum vocab matches the codebase** (from `scripts/verify-place-data.mjs`): `verificationStatus ∈ {verified, partial, unresolved}`, `approvalStatus ∈ {proposed, approved}`, place `status ∈ {active, unknown, closed, placeholder}`. The spec's "unverified" maps to **`unresolved`**.
- **One featured story per card.** Selection = explicit `featured` flag, deterministic fallback. No multi-story UI. (spec decision 3)
- **A story is audio, image, and/or text** — all optional. (spec decision 4)
- **Card omits the section entirely when there is no surfacing story.** (spec decision 5)
- **Public gate:** in `publicMode`, only `approvalStatus === "approved"` stories surface; dev default shows `proposed`. (spec §Loader)
- **137 Oak St = hero now, render deferred.** Promote via registry + place record with `buildStatus: "data-missing"` (Brouwerij Lane precedent); geometry/facade/map-pin are out of scope. (spec decision 7)
- **No new scene-color tokens.** The card section reuses PlaceCard's existing DOM ink/paper styling. (spec §Card)
- **Frequent commits**; pure logic is TDD; `npm run verify` stays green.

---

## File Structure

**New:**
- `src/data/places/landmark-heroes.v0.1.json` — off-spine hero place records (137 Oak St).
- `src/data/stories/place-stories.v0.1.json` — PlaceStory records (ships the one seed story).
- `src/placeStories.js` — pure loader: `selectFeaturedStory`, `getFeaturedStoryForPlace`, `allStories`.
- `src/placeStories.test.mjs` — loader tests (fixtures).
- `scripts/verify-place-stories.mjs` — truth verifier for landmark-heroes + stories.

**Modified:**
- `src/data/curation/building-tiers.v0.1.json` — add 137 Oak St hero entry.
- `src/placeData.js` — merge `landmark-heroes` with the Franklin heroes file.
- `src/placeData.test.mjs` — assert 137 Oak resolves.
- `src/components/PlaceCard.jsx` — add the featured-story section.
- `src/SceneView.jsx` — resolve the featured story and pass it to `PlaceCard`.
- `package.json` — add `verify:stories`; chain into `verify`.

---

## Task 1: Promote 137 Oak St to a hero record

**Files:**
- Modify: `src/data/curation/building-tiers.v0.1.json` (add one entry to `entries`)
- Create: `src/data/places/landmark-heroes.v0.1.json`
- Modify: `src/placeData.js`
- Test: `src/placeData.test.mjs`

**Interfaces:**
- Produces: place record resolvable via `getPlaceByPlaceId("137-oak-haunted-house")`; curation entry resolvable via `tierEntryFor({ placeId: "137-oak-haunted-house" })` with `visualTier: "hero"`.
- Consumes: existing `placeData.js` loader, `curationTiers.js` registry.

- [ ] **Step 1: Add the curation registry entry**

In `src/data/curation/building-tiers.v0.1.json`, append to the `entries` array (mirror the Brouwerij Lane shape):

```json
    {
      "key": "137-oak-haunted-house",
      "placeId": "137-oak-haunted-house",
      "name": "137 Oak Street",
      "address": "137 Oak St, Brooklyn, NY 11222",
      "visualTier": "hero",
      "landmarkTier": "tier2",
      "buildStatus": "data-missing",
      "verificationStatus": "unresolved",
      "note": "Off-spine hero — locally known as the 'Haunted House'. Promoted to hero record now; massing/facade render + map placement deferred (buildStatus data-missing, mirrors Brouwerij Lane). Carries the first PlaceStory (8.2)."
    }
```

- [ ] **Step 2: Create the off-spine hero place record**

`src/data/places/landmark-heroes.v0.1.json`:

```json
[
  {
    "id": "137-oak-haunted-house",
    "placeId": "137-oak-haunted-house",
    "name": "137 Oak Street",
    "category": "Landmark",
    "tags": ["local lore", "hidden greenpoint"],
    "address": "137 Oak St, Brooklyn, NY 11222",
    "description": "A residential building on Oak Street, locally known as the \"Haunted House.\" Identity and history are under review.",
    "status": "unknown",
    "verificationStatus": "unresolved",
    "lastVerified": "2026-06-19",
    "sources": [
      {
        "label": "Local resident knowledge (Greenpoint, June 2026) — pending documentary confirmation",
        "url": "https://www.openstreetmap.org/search?query=137%20Oak%20St%20Brooklyn"
      }
    ],
    "approvalStatus": "proposed"
  }
]
```

- [ ] **Step 3: Write the failing test**

Add to `src/placeData.test.mjs` (a new test; keep existing ones):

```js
test("resolves the off-spine 137 Oak St landmark hero", () => {
  const p = getPlaceByPlaceId("137-oak-haunted-house");
  assert.ok(p, "137 Oak record present");
  assert.equal(p.name, "137 Oak Street");
  assert.equal(p.approvalStatus, "proposed");
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `node --test src/placeData.test.mjs`
Expected: FAIL — `137 Oak record present` (record not yet merged into the loader).

- [ ] **Step 5: Merge landmark-heroes into the place loader**

Edit `src/placeData.js` — add the import and concat the records:

```js
import records from "./data/places/franklin-greenpoint-heroes.v0.1.json" with { type: "json" };
import landmarkRecords from "./data/places/landmark-heroes.v0.1.json" with { type: "json" };

export const PLACE_DISCLAIMER =
  "Unofficial prototype — not an official map or business directory. Details are under review; corrections welcome.";

const allRecords = [...records, ...landmarkRecords];
const byPlaceId = new Map(allRecords.map((r) => [r.placeId, r]));

export function getPlaceByPlaceId(placeId) {
  return byPlaceId.get(placeId) ?? null;
}

export function allPlaces() {
  return allRecords;
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `node --test src/placeData.test.mjs`
Expected: PASS (existing tests + the new 137 Oak test).

- [ ] **Step 7: Verify curation + conformance still green**

Run: `node --test src/curationTiers.test.mjs && npm run verify:conformance`
Expected: PASS (the new registry entry resolves as a hero; JSON data is exempt from the color gate).

- [ ] **Step 8: Commit**

```bash
git add src/data/curation/building-tiers.v0.1.json src/data/places/landmark-heroes.v0.1.json src/placeData.js src/placeData.test.mjs
git commit -m "feat(8.2): promote 137 Oak St to off-spine hero record (render deferred)"
```

---

## Task 2: PlaceStory schema + loader + seed story

**Files:**
- Create: `src/data/stories/place-stories.v0.1.json`
- Create: `src/placeStories.js`
- Test: `src/placeStories.test.mjs`

**Interfaces:**
- Consumes: place record `"137-oak-haunted-house"` (Task 1).
- Produces:
  - `selectFeaturedStory(stories, { publicMode = false }) -> story | null` — pure selection over an array.
  - `getFeaturedStoryForPlace(placeId, { publicMode = false }) -> story | null` — over the loaded corpus.
  - `allStories() -> story[]`.

- [ ] **Step 1: Create the stories data file with the seed story**

`src/data/stories/place-stories.v0.1.json`:

```json
[
  {
    "id": "137-oak-haunted-house-lore",
    "placeId": "137-oak-haunted-house",
    "title": "The \"Haunted House\" of Oak Street",
    "storyType": "local_memory",
    "summary": "Neighbors have long called this Oak Street building the \"Haunted House.\" The lore is local memory — its documented history is still being confirmed.",
    "audioUrl": "/assets/audio/137-oak-haunted-house.m4a",
    "sources": [
      {
        "label": "Resident oral account (Greenpoint, June 2026) — audio",
        "url": "/assets/audio/137-oak-haunted-house.m4a"
      }
    ],
    "verificationStatus": "unresolved",
    "approvalStatus": "proposed",
    "featured": true,
    "locationConfidence": "exact",
    "editorialTags": ["hidden_greenpoint", "local_ritual"]
  }
]
```

- [ ] **Step 2: Write the failing test**

`src/placeStories.test.mjs`:

```js
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test src/placeStories.test.mjs`
Expected: FAIL — `Cannot find module './placeStories.js'`.

- [ ] **Step 4: Write the loader**

`src/placeStories.js`:

```js
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test src/placeStories.test.mjs`
Expected: PASS (9 tests).

- [ ] **Step 6: Commit**

```bash
git add src/data/stories/place-stories.v0.1.json src/placeStories.js src/placeStories.test.mjs
git commit -m "feat(8.2): PlaceStory schema + loader + 137 Oak seed story"
```

---

## Task 3: Featured-story section in the place card

**Files:**
- Modify: `src/components/PlaceCard.jsx`
- Modify: `src/SceneView.jsx`

**Interfaces:**
- Consumes: `getFeaturedStoryForPlace` (Task 2); a `story` prop on `PlaceCard`.
- Produces: rendered story section (badge → title → summary → body → image → audio), omitted when `story` is null.

**Note:** Presentational — no unit test (the repo has no React test harness; all UI is build + preview verified). Verified by `npm run build` and a preview screenshot.

- [ ] **Step 1: Add the story section to PlaceCard**

In `src/components/PlaceCard.jsx`, add a `story` prop and render the section between the description block and the footer disclaimer. Insert this block immediately before the closing footer `<div style={{ fontSize: 10, marginTop: 10, paddingTop: 8, ...`:

```jsx
      {story && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid rgba(42,36,28,0.25)` }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>
            Story · {String(story.storyType || "").replace(/_/g, " ")}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.15, marginTop: 4 }}>
            {story.title}
          </div>
          {story.summary && (
            <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.45, opacity: 0.9 }}>
              {story.summary}
            </div>
          )}
          {story.body && (
            <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.45, opacity: 0.9 }}>
              {story.body}
            </div>
          )}
          {Array.isArray(story.imageUrls) && story.imageUrls[0] && (
            <img
              src={story.imageUrls[0]}
              alt={story.title}
              style={{ width: "100%", marginTop: 8, border: `1px solid ${INK}`, borderRadius: 2, display: "block" }}
            />
          )}
          {story.audioUrl && (
            <audio controls src={story.audioUrl} style={{ width: "100%", marginTop: 8 }} />
          )}
          {story.verificationStatus && story.verificationStatus !== "verified" && (
            <div style={{ fontSize: 10.5, marginTop: 8, padding: "4px 7px", border: `1px dashed ${INK}`, opacity: 0.85, borderRadius: 2 }}>
              Local lore — unverified.
            </div>
          )}
        </div>
      )}
```

Update the function signature: `export default function PlaceCard({ place, story, disclaimer, onClose }) {`.

- [ ] **Step 2: Wire the story through SceneView**

In `src/SceneView.jsx`, add the import near the existing place import (line ~19):

```js
import { getFeaturedStoryForPlace } from "./placeStories.js";
```

Then update the `<PlaceCard ... />` usage (around line 570) to resolve and pass the story:

```jsx
            <PlaceCard
              place={selectedPlace}
              story={selectedPlace ? getFeaturedStoryForPlace(selectedPlace.placeId) : null}
              disclaimer={PLACE_DISCLAIMER}
              onClose={() => { selectedPlaceIdRef.current = null; setSelectedPlace(null); setAnchor(null); }}
            />
```

- [ ] **Step 3: Build to verify no errors**

Run: `npm run build`
Expected: build succeeds (no syntax/import errors).

- [ ] **Step 4: Preview-verify the card section**

Start the dev server and select 137 Oak St's card (or temporarily point a known hero's placeId at the seed story to view it). Confirm: the story section renders title + summary + audio player, and shows the "Local lore — unverified." badge. Capture a screenshot for the user.

(If 137 Oak is not yet clickable in-scene — its map placement is deferred — verify by rendering `PlaceCard` with `place={getPlaceByPlaceId("137-oak-haunted-house")}` and `story={getFeaturedStoryForPlace("137-oak-haunted-house")}` via a scratch route or by selecting any place whose placeId you temporarily set to the seed. Revert any scratch wiring before commit.)

- [ ] **Step 5: Commit**

```bash
git add src/components/PlaceCard.jsx src/SceneView.jsx
git commit -m "feat(8.2): featured-story section in place card (text/image/audio, lore badge)"
```

---

## Task 4: PlaceStory truth verifier

**Files:**
- Create: `scripts/verify-place-stories.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/data/stories/place-stories.v0.1.json`, `src/data/places/landmark-heroes.v0.1.json`, `src/placeData.js`.
- Produces: `npm run verify:stories`; chained into `npm run verify`.

- [ ] **Step 1: Write the verifier**

`scripts/verify-place-stories.mjs`:

```js
// scripts/verify-place-stories.mjs
// Truth gate for the PlaceStory content layer (Phase 8.2). Editorial lore is
// gated like business facts: every story cites a source, enums are known, an
// approved story must also be verified (no approved-but-unverified lore), and
// every story's placeId resolves to a known place. Off-spine landmark heroes
// are validated to the same record shape as franklin heroes.
// Run: node scripts/verify-place-stories.mjs
import fs from "node:fs";
import { getPlaceByPlaceId } from "../src/placeData.js";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const stories = read("src/data/stories/place-stories.v0.1.json");
const landmarks = read("src/data/places/landmark-heroes.v0.1.json");

const VERIF = ["verified", "partial", "unresolved"];
const APPROVAL = ["proposed", "approved"];
const STATUS = ["active", "unknown", "closed", "placeholder"];
const STORY_TYPES = [
  "history", "lost_business", "local_memory", "industrial_history",
  "polish_greenpoint", "environmental_history", "hidden_greenpoint",
  "then_now", "event_or_ritual", "business_owner_story",
];

const failures = [];
const assert = (c, m) => { if (!c) failures.push(m); };

for (const r of landmarks) {
  assert(r.id && r.placeId && r.name && r.category && r.address, `${r.placeId}: id/placeId/name/category/address required.`);
  assert(Array.isArray(r.sources) && r.sources.length > 0, `${r.placeId}: must cite at least one source.`);
  for (const s of r.sources || []) assert(s.label && s.url, `${r.placeId}: each source needs label + url.`);
  assert(STATUS.includes(r.status), `${r.placeId}: status must be known.`);
  assert(VERIF.includes(r.verificationStatus), `${r.placeId}: verificationStatus must be known.`);
  assert(APPROVAL.includes(r.approvalStatus), `${r.placeId}: approvalStatus must be proposed|approved.`);
}

for (const s of stories) {
  assert(s.id && s.placeId && s.title && s.summary, `${s.id}: id/placeId/title/summary required.`);
  assert(STORY_TYPES.includes(s.storyType), `${s.id}: storyType must be a known value.`);
  assert(Array.isArray(s.sources) && s.sources.length > 0, `${s.id}: must cite at least one source.`);
  for (const src of s.sources || []) assert(src.label && src.url, `${s.id}: each source needs label + url.`);
  assert(VERIF.includes(s.verificationStatus), `${s.id}: verificationStatus must be known.`);
  assert(APPROVAL.includes(s.approvalStatus), `${s.id}: approvalStatus must be proposed|approved.`);
  assert(!(s.approvalStatus === "approved" && s.verificationStatus !== "verified"),
    `${s.id}: an approved story must also be verified (no approved-but-unverified lore).`);
  assert(getPlaceByPlaceId(s.placeId) !== null, `${s.id}: placeId "${s.placeId}" does not resolve to a known place.`);
}

if (failures.length) {
  console.error("FAIL place-stories verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log(`PASS place-stories verifier: ${stories.length} story(ies), ${landmarks.length} landmark hero(es). States: ${stories.map((s) => `${s.id}=${s.verificationStatus}/${s.approvalStatus}`).join(", ")}`);
```

- [ ] **Step 2: Run the verifier**

Run: `node scripts/verify-place-stories.mjs`
Expected: PASS — `1 story(ies), 1 landmark hero(es)`, the seed reported `unresolved/proposed`, and its placeId resolves (Task 1 merged the record).

- [ ] **Step 3: Chain into npm run verify**

In `package.json` scripts, add `verify:stories` and include it in `verify`:

```json
    "verify:stories": "node scripts/verify-place-stories.mjs",
    "verify": "npm run test && npm run verify:conformance && npm run verify:visual && npm run verify:components && npm run verify:stories",
```

- [ ] **Step 4: Run the full gate**

Run: `npm run verify`
Expected: PASS — tests (incl. new placeStories + placeData), conformance, visual, components, stories.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-place-stories.mjs package.json
git commit -m "feat(8.2): PlaceStory truth verifier (sources, enums, approved⇒verified, FK) + verify chain"
```

---

## Self-Review

**Spec coverage:**
- Schema (reconciled, sources/verification/approval, audio/image/text) → Task 2 data file + §Global vocab note. ✓
- Loader (`getFeaturedStoryForPlace`, featured selection, public gate, null) → Task 2. ✓
- 137 Oak hero promotion (registry + off-spine record + placeData merge; render deferred via `data-missing`) → Task 1. ✓
- Card story section (badge/title/summary/body/image/audio, omit-when-null, lore badge) → Task 3. ✓
- Independent gating (place vs story) → Task 1 record (`unresolved/proposed`) + Task 2 story (`unresolved/proposed`) + Task 4 `approved⇒verified` rule. ✓
- Seed story + audio handoff → Task 2 (`audioUrl` to Batu-supplied file under `/assets/audio/`). ✓
- Tests + `npm run verify` green → Task 2 loader tests, Task 1 placeData test, Task 4 verifier + chain. ✓
- Out of scope (corpus, multi-story UI, 137 Oak geometry/pin, instrumentation, asset production) → not in any task. ✓

**Placeholder scan:** No TBD/TODO; all code steps carry full code; the one human dependency (audio file) is explicit, and the card still renders without it (the `<audio>` element simply has no playable source). ✓

**Type consistency:** `selectFeaturedStory(candidates, {publicMode})` / `getFeaturedStoryForPlace(placeId, {publicMode})` / `allStories()` consistent across Tasks 2–4. `story` prop name consistent between PlaceCard (Task 3 Step 1) and SceneView (Task 3 Step 2). placeId `"137-oak-haunted-house"` identical across registry, place record, story, and tests. Enum vocab (`unresolved`/`proposed`) consistent across record, story, and verifier. ✓
