# Design Spec — Full-Block Hero Frontage-Plane Model (Astral)

Status: **Designed 2026-06-23**, build deferred to next session (Batu: checkpoint here).
Owner: Batu (taste/approvals) / Agent (execution).
Context: `docs/PLAN.md` Track R (2026-06-23 reprioritization), `docs/reference/hero-evidence/astral/FACADE_GRAMMAR.md`, `docs/reference/art/HERO_FACADE_LOG.md`.

## Problem

Astral (BIN 3064408, 184 Franklin) is the first **full-block hero**. Its footprint is a **59-vertex polygon**: ~5 long edges (39 / 22 / 20 / 19 / 18 m) plus ~49 short facets (the projecting oriel bays). Every prior hero (Premier, Sonny's, Sereneco, 144 Franklin) was a corner with **1–2 clean street edges**.

`buildHeroBuilding` (`src/SceneView.jsx:1845–1852`) maps a composite face onto **"the single longest edge per role."** On a segmented frontage that places the texture on one ~10–39 m edge and leaves the rest as bare typological wall — it cannot span the ~65 m frontage, cannot place a *segment* of it, and ignores the oriels. This is a capability gap, not a tuning issue.

The render is in hand and accepted: `assets/textures/franklin/astral-apartments--franklin-center.png` (1161×1355), the center entrance pavilion (flat: "No 184" round-arch + "THE ASTRAL" band + gable cartouche + round-arch top windows). Two flank segments will follow.

## Goal

A faithful, **reusable full-block-hero** rendering path: a long segmented street frontage carries one or more high-res texture segments across its full extent, with projecting oriel bays folding out and arched openings carved in. Reusable for every future block-front (the H5 repeatability story), not Astral-specific.

## Design — single frontage-plane + segment u-mapping + oriel folds

**1. Frontage chord + extent (new pure helper).** From the building's `franklin`-role edges (classified by the real `sceneFrame.js` classifier, not an ad-hoc test), compute the frontage's straight **chord**: project the franklin-facing edge endpoints onto the Franklin axis → `[uMinM, uMaxM]` extent (≈65 m for Astral) at the chord's average cross-axis offset. This is the flat plane the texture lives on; the literal 59 vertices are not used for the texture surface.

**2. Multi-segment texture mapping (composite schema bump).** Extend the `FACADE_COMPOSITES` face descriptor from a single `key` to an ordered **segment list**, each segment = `{ key, fromM, toM }` (meters along the frontage chord from a named left end). The frontage plane is built once and each segment samples its PNG across its `[fromM,toM]` sub-range. Segment boundaries share datums (the render prompt already runs ground/cornice/string-courses off both cut edges → seamless stitch). v1 Astral: one segment (`franklin-center`) covering the central ~18 m; flanks added later. Backward-compatible: a lone `key` (every existing hero) = one segment spanning the whole edge — keep those byte-identical.

**3. Oriel bays = folds off the plane (`oriel3`, already built).** The polygon facets that deviate outward from the chord beyond a threshold are the projecting bays. Each becomes an `oriel3` fold popping out of the plane at its real chord position, sampling its u-slice of the underlying segment texture (the proven Premier texture-fold; see `HERO_FACADE_LOG` "faceted projection is a texture fold"). v1 center segment is **flat** (no oriels) — oriels arrive with the flank segments. A pure `orielPlacementsFromPolygon(polygon, chord)` helper detects facet runs.

**4. Curved recesses (`shape:"arch"`, already built on 144).** Derive each segment's spec on the FLAT texture (`derive-facade-spec.mjs` + 2× overlay gate); tag the round-arch entrance + top-floor windows `shape:"arch"`, seed `springY`, register curves in the recess editor (`?facadeedit=1`). Carve into the plane.

**5. Ends + back = typological returns.** The cross-street ends (Java/India) and rear are plainer brick → `decorateTypologicalWall`; blank-box + cornice-notch checks at all four angles (per `HERO_FACADE_LOG`).

## Build phasing (next session)

Per the project's new-primitive pattern (design → pure unit-tested module → wire → verify; cf. `facadeProfiles.js`):
1. **Pure module + tests:** `frontageChord(edges, axis)` → chord + extent; segment u-mapping; `orielPlacementsFromPolygon`. Unit-tested before any render/wiring (chord projection, segment range clamping, oriel-facet detection).
2. **Composite schema bump:** segment-list face descriptor, backward-compatible with single-`key`. Update `FACADE_COMPOSITES` consumption in `buildHeroBuilding`.
3. **Register Astral + wire the center segment:** `FACADE_GROUP_BINS["3064408"]="astral-apartments"`, composite with one `franklin-center` segment, `II_PALETTE.heroes` hue, derive + arched recesses.
4. **Verify** center segment in-engine at all four angles. Append a `HERO_FACADE_LOG` entry.
5. **Phase D/E:** flank segment renders (with oriels) → typological end returns.

## Open questions (resolve during build)
- Segment range as meters (`fromM/toM`) vs normalized `u` — meters is more robust to chord-length estimation; lean meters.
- Oriel-facet detection threshold (outward deviation from chord) — derive empirically from Astral's polygon; expose as a constant.
- Does the frontage plane replace the literal franklin edges entirely, or sit a hair proud of them? (Proud, like the inked skin, to avoid z-fighting with any retained massing.)
- Real-meter chord vs the render's drawn proportions — settle the segment `fromM/toM` against the photos + derive overlay, per the playbook (drawn fold wins, measured not assumed).
