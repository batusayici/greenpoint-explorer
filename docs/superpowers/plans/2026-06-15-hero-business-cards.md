# Hero Business Cards (feedback vehicle) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Clicking a hero corner opens a paper II-C "place card" — tethered to the building by a pin — showing real, sourced business data for the three heroes (Premier/Franklin Organic, Sonny's Corner, Sereneco). Display-only, with an unofficial-prototype disclaimer, so Batu can demo it to local businesses and collect feedback while the rest of Phase 3 is built.

**Architecture:** Static local place data (JSON, no scraping/APIs — per `PLACE_SOURCE_POLICY.md`) loaded by a small `placeData.js` module. A presentational React `PlaceCard.jsx` renders the trimmed information architecture. `SceneView.jsx` gains click-to-select (raycast → `userData.placeId`), projects the selected building's anchor world→screen for a DOM pin, draws an SVG tether from pin to the card panel, and renders the card. Everything is DOM over the existing Three.js canvas (matches the "DOM paper-card UI" spine).

**Tech Stack:** React 19 + Three.js + Vite. Tests: `node:test` + `node:assert/strict` via `node --test`. The card/anchoring is verified visually via the preview tools (controller-driven) plus a Node data-integrity test.

**Reference & rules (read before building):**
- `docs/reference/art/II-B-place-card-marker-hover-state.png` — the card look + tether/pin.
- `docs/ART_DIRECTION.md` §8 (marker states) / §9 (place cards: paper caption panels with tether).
- `docs/reference/PLACE_SCHEMA.md` — field vocabulary (we use a trimmed subset).
- `docs/reference/PLACE_SOURCE_POLICY.md` — **truth gate**: public factual info only, source-backed, `lastVerified`, uncertainty visible, unofficial-map disclaimer, **Batu approves any public use of real business cards**.

**Trimmed IA (per 2026-06-15 decisions):** label "SELECTED PLACE" → name → category → tag row → address → neutral description → disclaimer/verification footer → close (X). **No Save/Share, no hours/OPEN-NOW** in v0.

---

## File Structure

- **Create** `src/data/places/franklin-greenpoint-heroes.v0.1.json` — the three proposed place records (sourced, `approvalStatus: "proposed"`).
- **Create** `src/placeData.js` — loader: `getPlaceByPlaceId`, `allPlaces`, `PLACE_DISCLAIMER`. Pure, Node-runnable.
- **Create** `src/placeData.test.mjs` — data-integrity test (required fields, sources, the three placeIds).
- **Create** `src/components/PlaceCard.jsx` — presentational card (trimmed IA, II-C styling, disclaimer, close).
- **Modify** `src/SceneView.jsx` — selection (raycast → placeId), anchor world→screen, pin + SVG tether, render `<PlaceCard>`; tag hero groups with `userData.placeId` for reliable hit resolution.

The three hero `placeId`s (from `wrapFixture.placeMappings`): `premier-franklin-organic`, `sonnys-corner`, `sereneco`.

---

## Task 1: Proposed place data (research + author) — BATU-GATED

This task does documented public-source research and authors the three records. It is the truth-sensitive step: every field must trace to a cited public source or be marked uncertain. The output is **proposed** data; Batu approves before any demo.

**Files:**
- Create: `src/data/places/franklin-greenpoint-heroes.v0.1.json`

- [ ] **Step 1: Research each hero from public sources (record sources as you go)**

For each of the three businesses, use the source hierarchy in `PLACE_SOURCE_POLICY.md` (official site/profile first, then official records, then public directories as cross-check; NYC Open Data / MapPLUTO for address). Capture only neutral public facts: **name, broad category, address, 1–2 tags, a neutral factual one-line description**, plus the **source URL(s)/label(s)** and today's date as `lastVerified`. Do NOT capture hours (omitted in v0), promotional claims, or quality/popularity judgments. If current status can't be confidently sourced, set `status: "unknown"` and `verificationStatus: "partial"` or `"unresolved"`.

Cross-check the address against the building BIN where possible (Premier `3322608`, Sonny's `3064811`, Sereneco `3337033`).

- [ ] **Step 2: Author the records file**

Write `src/data/places/franklin-greenpoint-heroes.v0.1.json` as an array of three records in this exact shape (fill values from research; example structure shown with placeholder-but-typed fields the executor replaces with sourced facts):

```json
[
  {
    "id": "premier-franklin-organic",
    "placeId": "premier-franklin-organic",
    "name": "<sourced public name>",
    "category": "<broad neutral category>",
    "tags": ["<tag>", "<tag>"],
    "address": "<sourced address>",
    "description": "<one neutral factual sentence>",
    "status": "active | unknown | closed",
    "verificationStatus": "verified | partial | unresolved",
    "lastVerified": "2026-06-15",
    "sources": [{ "label": "<source name>", "url": "<public url>" }],
    "approvalStatus": "proposed"
  },
  { "id": "sonnys-corner", "placeId": "sonnys-corner", "...": "..." },
  { "id": "sereneco", "placeId": "sereneco", "...": "..." }
]
```

Rules enforced by this task:
- Every record MUST have a non-empty `sources` array and a `lastVerified` date.
- `approvalStatus` is `"proposed"` for all three (Batu flips to `"approved"`).
- No `hours` field. No promotional language in `description`.
- If a fact is uncertain, prefer `status:"unknown"` / `verificationStatus:"partial"` over guessing.

- [ ] **Step 3: Commit the proposed data**

```bash
git add src/data/places/franklin-greenpoint-heroes.v0.1.json
git commit -m "data(cards): proposed sourced place data for the three heroes (BATU-GATED)"
```

- [ ] **Step 4: STOP — present the proposed data to Batu for approval.**

Surface each record's facts + sources in chat. Do not proceed to demo/screenshots-for-sharing until Batu approves (flips `approvalStatus` to `approved`, or requests edits). Building the UI (Tasks 2–5) may proceed in parallel against the proposed data — only the *public representation* is gated.

---

## Task 2: `placeData.js` loader + test

**Files:**
- Create: `src/placeData.js`
- Test: `src/placeData.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// src/placeData.test.mjs
// Run: node --test src/placeData.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { getPlaceByPlaceId, allPlaces, PLACE_DISCLAIMER } from "./placeData.js";

const HERO_IDS = ["premier-franklin-organic", "sonnys-corner", "sereneco"];

test("exposes the three hero places", () => {
  const ids = allPlaces().map((p) => p.placeId).sort();
  assert.deepEqual(ids, [...HERO_IDS].sort());
});

test("each record has the required sourced fields", () => {
  for (const id of HERO_IDS) {
    const p = getPlaceByPlaceId(id);
    assert.ok(p, `${id} present`);
    for (const f of ["name", "category", "address", "status", "verificationStatus", "lastVerified", "approvalStatus"]) {
      assert.ok(p[f] !== undefined && p[f] !== "", `${id}.${f} set`);
    }
    assert.ok(Array.isArray(p.tags), `${id}.tags is an array`);
    assert.ok(Array.isArray(p.sources) && p.sources.length > 0, `${id} has at least one source`);
    for (const s of p.sources) assert.ok(s.label && s.url, `${id} source has label+url`);
    assert.ok(!("hours" in p), `${id} has no hours field (omitted in v0)`);
  }
});

test("unknown placeId returns null; disclaimer is non-empty", () => {
  assert.equal(getPlaceByPlaceId("nope"), null);
  assert.ok(PLACE_DISCLAIMER.length > 0);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test src/placeData.test.mjs`
Expected: FAIL — `Cannot find module './placeData.js'`.

- [ ] **Step 3: Write the implementation**

```js
// src/placeData.js
// Static local place data for the hero business cards. No scraping, no APIs,
// no live status — per docs/reference/PLACE_SOURCE_POLICY.md. Public factual
// info only; every record cites sources and carries lastVerified. Real-place
// public representation is Batu-gated (approvalStatus).
import records from "./data/places/franklin-greenpoint-heroes.v0.1.json";

export const PLACE_DISCLAIMER =
  "Unofficial prototype — not an official map or business directory. Details are under review; corrections welcome.";

const byPlaceId = new Map(records.map((r) => [r.placeId, r]));

export function getPlaceByPlaceId(placeId) {
  return byPlaceId.get(placeId) ?? null;
}

export function allPlaces() {
  return records;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test src/placeData.test.mjs`
Expected: PASS — 3 tests. (Requires Task 1's JSON to exist and be well-formed.)

- [ ] **Step 5: Commit**

```bash
git add src/placeData.js src/placeData.test.mjs
git commit -m "feat(cards): static place-data loader + integrity test"
```

---

## Task 3: `PlaceCard.jsx` presentational component

A paper II-C card rendering the trimmed IA. Pure presentational — props in, no data fetching, no scene knowledge.

**Files:**
- Create: `src/components/PlaceCard.jsx`

- [ ] **Step 1: Write the component**

```jsx
// src/components/PlaceCard.jsx
// Presentational II-C "place card" — paper caption panel (ART_DIRECTION §9).
// Trimmed IA: SELECTED PLACE -> name -> category -> tags -> address ->
// description -> verification/disclaimer footer -> close. No Save/Share, no
// hours (v0). Display-only; all data comes from props.
const PAPER = "#eae1ce";
const INK = "#2a241c";

export default function PlaceCard({ place, disclaimer, onClose }) {
  if (!place) return null;
  const unverified = place.verificationStatus && place.verificationStatus !== "verified";
  const closed = place.status === "closed";
  const unknown = place.status === "unknown";

  return (
    <div
      style={{
        width: 300,
        background: PAPER,
        color: INK,
        border: `1.5px solid ${INK}`,
        boxShadow: "0 6px 22px rgba(28,22,14,0.32)",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "14px 16px 12px",
        position: "relative",
        borderRadius: 2,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute", top: 8, right: 8, width: 22, height: 22,
          background: "transparent", border: `1px solid ${INK}`, color: INK,
          cursor: "pointer", lineHeight: "18px", fontSize: 13, borderRadius: 2,
        }}
      >×</button>

      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>
        Selected place
      </div>
      <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.1, marginTop: 4 }}>
        {place.name}
      </div>
      <div style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", opacity: 0.75, marginTop: 2 }}>
        {place.category}
      </div>

      {Array.isArray(place.tags) && place.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {place.tags.map((t) => (
            <span key={t} style={{ fontSize: 11, border: `1px solid ${INK}`, padding: "2px 7px", borderRadius: 2, opacity: 0.85 }}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div style={{ fontSize: 12.5, marginTop: 10, display: "flex", gap: 6 }}>
        <span aria-hidden>📍</span><span>{place.address}</span>
      </div>

      {place.description && (
        <div style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.45, opacity: 0.9 }}>
          {place.description}
        </div>
      )}

      {(unverified || closed || unknown) && (
        <div style={{ fontSize: 10.5, marginTop: 10, padding: "4px 7px", border: `1px dashed ${INK}`, opacity: 0.85, borderRadius: 2 }}>
          {closed ? "Reported closed — unconfirmed." : unknown ? "Current status unconfirmed." : "Details under review — unverified."}
        </div>
      )}

      <div style={{ fontSize: 10, marginTop: 10, paddingTop: 8, borderTop: `1px solid rgba(42,36,28,0.25)`, opacity: 0.7, lineHeight: 1.4 }}>
        {disclaimer}
        {place.lastVerified && <> · Reviewed {place.lastVerified}</>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: success (the ~46 MB GLB warning is fine). This confirms the JSX compiles; the component is rendered for real in Task 4.

- [ ] **Step 3: Commit**

```bash
git add src/components/PlaceCard.jsx
git commit -m "feat(cards): II-C place card component (trimmed IA, display-only)"
```

---

## Task 4: Selection, anchor, pin + tether in `SceneView.jsx`

Click a hero → select it → render the card panel with a DOM pin on the building and an SVG tether between them. Only heroes (placeIds present in `placeData`) are selectable; clicking elsewhere deselects.

**Files:**
- Modify: `src/SceneView.jsx`

Key facts: building bodies already set `userData = { bin, placeId }` (≈ line 568). The effect already has `raycaster`, `camera`, `renderer`, `mount`, the pan/zoom handlers (`applyCamera`/`render`), and the no-drag click path in `onPointerUp`. Scene buildings (`scene.buildings`) carry `centroid {x,z}` and `height`.

- [ ] **Step 1: Imports + state**

At the top imports of `src/SceneView.jsx` add:

```js
import PlaceCard from "./components/PlaceCard.jsx";
import { getPlaceByPlaceId, PLACE_DISCLAIMER } from "./placeData.js";
```

In the component body, near the other `useState` calls, add:

```js
  const [selectedPlace, setSelectedPlace] = useState(null); // place record or null
  const [anchor, setAnchor] = useState(null); // {x, y} screen px of the pin, or null
```

- [ ] **Step 2: Tag hero groups + add a placeId raycast resolver**

So any hit on a hero resolves to its placeId, ensure hero meshes live under a group carrying `userData.placeId`. In `buildBuildings` (where a hero body/group is created), set on the group that holds the hero's meshes:

```js
    group.userData.placeId = building.placeId;
```

(If the hero meshes aren't already under one group, wrap them in a `THREE.Group()` whose `userData.placeId` is set and add that group to `three`. The plain body mesh already carries `placeId`, so at minimum tagging the group is additive.)

Inside the effect, alongside `faceKeyAt`, add:

```js
    function placeIdAt(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      for (const hit of raycaster.intersectObjects(three.children, true)) {
        let object = hit.object;
        while (object) {
          if (object.userData?.placeId) return object.userData.placeId;
          object = object.parent;
        }
      }
      return null;
    }
```

- [ ] **Step 3: World anchor + project-to-screen helper**

Add inside the effect (after `applyCamera` is defined). The anchor is the hero's storefront point — its centroid at ~⅓ height:

```js
    const anchorWorld = new Map(
      scene.buildings
        .filter((b) => b.placeId)
        .map((b) => [b.placeId, new THREE.Vector3(b.centroid.x, Math.max(b.height * 0.32, 0.3), b.centroid.z)]),
    );

    function projectAnchor(placeId) {
      const w = anchorWorld.get(placeId);
      if (!w) return null;
      const v = w.clone().project(camera);
      return {
        x: (v.x * 0.5 + 0.5) * mount.clientWidth,
        y: (-v.y * 0.5 + 0.5) * mount.clientHeight,
      };
    }
    // Exposed so React can recompute the pin after camera moves.
    updateAnchorRef.current = (placeId) => setAnchor(placeId ? projectAnchor(placeId) : null);
```

Add a ref near the component state to bridge the imperative effect and React:

```js
  const updateAnchorRef = useRef(() => {});
  const selectedPlaceIdRef = useRef(null);
```

- [ ] **Step 4: Wire selection into the existing click handler, and update the pin on camera moves**

In `onPointerUp`, after the existing drag/move guard (the part that returns early on a real pan), add — BEFORE the `facadeEdit` editor branch so selection works in normal mode:

```js
      const moved2 = Math.hypot(event.clientX - down.x, event.clientY - down.y);
      if (wasCanvas && moved2 <= 4) {
        const placeId = placeIdAt(event);
        const place = placeId ? getPlaceByPlaceId(placeId) : null;
        if (place) {
          selectedPlaceIdRef.current = place.placeId;
          setSelectedPlace(place);
          setAnchor(projectAnchor(place.placeId));
        } else if (!facadeEdit) {
          selectedPlaceIdRef.current = null;
          setSelectedPlace(null);
          setAnchor(null);
        }
      }
```

(Keep the existing `facadeEdit` editor-opening branch after this; in edit mode a face click still opens the editor.)

Then make pan/zoom/resize move the pin. In `applyCamera` (or right after each `render()` triggered by pan/zoom/resize), append:

```js
      updateAnchorRef.current(selectedPlaceIdRef.current);
```

Specifically add that line at the end of `applyCamera`, so every `applyCamera()` (pan, zoom, resize) refreshes the pin position from the current camera.

- [ ] **Step 5: Render the card, pin, and tether (DOM overlay)**

In the component's returned JSX, after the existing overlay `<div>`s (inside the root `position:fixed` container), add:

```jsx
      {selectedPlace && (
        <>
          {anchor && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <line
                x1={anchor.x} y1={anchor.y}
                x2={typeof window !== "undefined" ? window.innerWidth - 340 : anchor.x}
                y2={Math.min(Math.max(anchor.y, 120), 360)}
                stroke="#2a241c" strokeWidth="1.5" strokeDasharray="3 3"
              />
            </svg>
          )}
          {anchor && (
            <div style={{
              position: "absolute", left: anchor.x - 7, top: anchor.y - 20,
              width: 14, height: 14, background: "#d9a43b",
              border: "1.5px solid #2a241c", borderRadius: "50% 50% 50% 0",
              transform: "rotate(45deg)", pointerEvents: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }} />
          )}
          <div style={{ position: "absolute", top: 120, right: 24 }}>
            <PlaceCard
              place={selectedPlace}
              disclaimer={PLACE_DISCLAIMER}
              onClose={() => { selectedPlaceIdRef.current = null; setSelectedPlace(null); setAnchor(null); }}
            />
          </div>
        </>
      )}
```

(The card sits as a stable top-right panel; the pin tracks the building; the tether links them — matching the reference. Pixel constants are first-pass and tunable.)

- [ ] **Step 6: Build + controller visual verification**

Run: `npm run build` — expect success.
The controller (not this subagent) then: reloads the preview, clicks each of the three heroes, screenshots, and confirms: card shows the right business with the trimmed IA + disclaimer; pin sits on the building; tether connects; pan/zoom keeps the pin attached; clicking empty space closes the card.

- [ ] **Step 7: Commit**

```bash
git add src/SceneView.jsx
git commit -m "feat(cards): click-to-select heroes, anchored place card with pin + tether"
```

---

## Task 5: Truth-treatment pass + data-integrity verifier

**Files:**
- Create: `scripts/verify-place-data.mjs`
- (Possibly touch) `src/components/PlaceCard.jsx`, `src/data/places/franklin-greenpoint-heroes.v0.1.json`

- [ ] **Step 1: Confirm the disclaimer + verification surfacing**

Verify in the running preview that: the disclaimer line shows on every card; any record with `verificationStatus !== "verified"` shows the dashed "under review" note; a `status:"closed"|"unknown"` record shows the right caution line and is never presented as plainly active. If a hero's data is uncertain, ensure its record reflects that (Task 1) rather than the UI hiding it.

- [ ] **Step 2: Write the durable data verifier**

```js
// scripts/verify-place-data.mjs
// Durable truth-gate check for hero place data (PLACE_SOURCE_POLICY.md).
// Run: node scripts/verify-place-data.mjs
import fs from "node:fs";

const records = JSON.parse(fs.readFileSync("src/data/places/franklin-greenpoint-heroes.v0.1.json", "utf8"));
const HERO_IDS = ["premier-franklin-organic", "sonnys-corner", "sereneco"];
const failures = [];
const assert = (c, m) => { if (!c) failures.push(m); };

assert(records.length === 3, "Expected exactly 3 hero records.");
assert(HERO_IDS.every((id) => records.some((r) => r.placeId === id)), "All three hero placeIds present.");

for (const r of records) {
  assert(r.name && r.category && r.address, `${r.placeId}: name/category/address required.`);
  assert(Array.isArray(r.sources) && r.sources.length > 0, `${r.placeId}: must cite at least one source.`);
  for (const s of r.sources || []) assert(s.label && s.url, `${r.placeId}: each source needs label + url.`);
  assert(typeof r.lastVerified === "string" && r.lastVerified.length >= 8, `${r.placeId}: lastVerified date required.`);
  assert(["active", "unknown", "closed", "placeholder"].includes(r.status), `${r.placeId}: status must be a known value.`);
  assert(["verified", "partial", "unresolved"].includes(r.verificationStatus), `${r.placeId}: verificationStatus must be known.`);
  assert(["proposed", "approved"].includes(r.approvalStatus), `${r.placeId}: approvalStatus must be proposed|approved.`);
  assert(!("hours" in r), `${r.placeId}: no hours field in v0.`);
}

if (failures.length) {
  console.error("FAIL place-data verifier:\n - " + failures.join("\n - "));
  process.exit(1);
}
console.log(`PASS place-data verifier: 3 sourced hero records. Approval states: ${records.map((r) => `${r.placeId}=${r.approvalStatus}`).join(", ")}`);
```

- [ ] **Step 3: Run it**

Run: `node scripts/verify-place-data.mjs`
Expected: `PASS place-data verifier: ...` listing each record's approval state (so the Batu gate is visible: all `proposed` until approved).

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-place-data.mjs
git commit -m "test(cards): durable place-data truth-gate verifier"
```

---

## Self-Review Notes

- **Truth gate is the spine.** The whole point of Task 1's `approvalStatus: "proposed"` + the verifier surfacing it is that **nothing real ships to a business demo without Batu's approval**. The UI is built in parallel, but public representation waits on the gate. Do not flip `approved` on Batu's behalf.
- **No live data.** No hours, no "OPEN NOW", no fetch/scrape/API anywhere — `PLACE_SOURCE_POLICY.md` forbids it for the MVP. The card is static-data only.
- **Scope discipline (YAGNI):** three heroes only; no Save/Share/Details actions; no marker legend; no hover mini-labels; no per-place sprites. Those are later (the generalized interaction in Phase 3.5). This phase is the smallest lovable thing that lets Batu start conversations.
- **Selection vs facade editor:** in `?facadeedit=1` mode the face-click still opens the recess editor; normal mode uses the click for place selection. Keep both paths working.
- **Anchoring is first-pass:** the card is a fixed top-right panel with a tracking pin + tether (cheaper and matches the reference). If Batu wants the card to float beside each building instead, that's a later tuning, not a v0 requirement.
