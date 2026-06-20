# Greenpoint Explorer — Plan v2

Status: Active roadmap
Reset date: 2026-06-11
Owner: Batu (taste, product, approvals) / Agent (execution)

## Product Goal

**Greenpoint Explorer is a neighborhood exploration platform** — it helps people discover Greenpoint through stories, landmarks, events, history, and curated routes, not through search. The lifelike, hand-inked 3D map is the **recognition layer / container**; the location-linked context attached to places is the product. (Core belief: people don't travel to browse business listings — they travel to discover places; businesses benefit when discovery happens. See the Product Frame below.)

The container is: a 3D, isometric, interactive, explorable, browser-based Greenpoint that is lifelike — every building and business located exactly where it is in real life and recognizably itself. Art-directed and stylized, not hyperrealistic. The recognition bar ("yes, that's *my* neighborhood") is real and load-bearing, but it serves the platform; it is not the end in itself.

- **Multi-angle (firm requirement):** the scene is viewable from **all four orthogonal isometric angles** (90° rotation steps), with pan/zoom. A single fixed angle shows only two of every building's four sides, structurally hiding ~half of all street frontages — and the businesses on them. Four rotations make every street frontage visible from at least one angle. This is not free-cam (which stays debug-only); it is four discrete, composed iso viewpoints. **Implication:** a building's street frontages must be treated for whichever angle(s) reveal them, and scene completeness is judged from all four angles, not one.
- **Primary look:** II-C Inked Indie Visual System (hand-inked editorial illustration). See `docs/ART_DIRECTION.md`.
- **Fallback look:** GPT-5.5 photo-render fidelity (the Premier Organic benchmark image) if II-C proves infeasible in-engine. Decided at the Phase 2 gate.
- **Geometry truth:** NYC Open Data (footprints, BINs). **Likeness truth:** field photos in `src/data/facade-evidence/`.

## Product Frame (adopted 2026-06-17)

The strategy below was previously held only in `docs/context/` and the session memory, footed "not yet in PLAN.md." It is now adopted here as the strategic spine. Full sources: `docs/context/strategy-blueprint.md` (master), `docs/context/resident-feedback-michael-2026-06.md`, `docs/context/greenpoint-editorial-context.md`, `docs/context/landmark-strategy-v1.md`.

**Six V1 content layers:** 1. Places · 2. Stories · 3. History · 4. Events · 5. Curated Routes · 6. Neighborhood Layers.

**Why people use it (ordering matters):** Stories → Local knowledge → Exploration → Events → History → Businesses. *Stories generate attention; events create urgency; businesses monetize the resulting discovery.*

**Growth loop:** stories make the map worth exploring → events bring people in → visitors discover businesses → businesses promote the platform → more content added → the map gets more useful and more defensible.

**North-Star metric — Verified Local Exploration:** visitor journeys that produce meaningful engagement (route starts, story views/listens, event saves, profile views, check-ins, multi-stop visits, signups, intent).

**Defensibility:** a neighborhood knowledge graph. *Google Maps knows where places are; we aim to know why they matter.*

**Core hypotheses (what the build must validate):**
- **H1 — Stories drive engagement** (vs. directory-style info).
- **H2 — Routes drive exploration** (multi-stop + business discovery).
- **H3 — Events drive acquisition** (fastest path to new + repeat visitors and business adoption).
- **H4 — Businesses pay after attention exists.**
- **H5 — The model is repeatable** to other neighborhoods.

**Landmark strategy — curated density, not coverage:** V1 does not map all of Greenpoint. It is a dense, memorable set of ~10–15 story-rich anchors on a story-dense spine (Franklin/Greenpoint corridor, Manhattan Ave, Transmitter Park/WNYC, Eberhard Faber, Bushwick Inlet, St. Anthony's, McGolrick/Monitor, Newtown Creek). Each anchor is a tappable **story object**, not a static POI. The `Landmark` and `PlaceStory` schemas (in the context docs) carry verification gates — lore stays unverified until address + photo + archival confirmation.

**Resident signal (Michael, n=1, June 2026):** the map is the container, hyperlocal context is the product; people attach to *people, not listings*; owner/origin stories and on-location audio validated; stoop sales / local news drive recurring traffic; community orgs (Greenpointers, Save the Inlet, historians) are the better *early* content + distribution partners. Acquisition sequence: visitors → engagement → businesses. This is n=1 — widening it is itself part of the work.

## Locked Decisions (2026-06-11)

Recorded in `docs/DECISION_LOG.md`:

1. Audience: public community demo. Real names/likenesses used freely in development; factual-claims review happens at publish time.
2. Likeness bar: heroes exact (corners, landmarks, storefronts), infill typological (correct massing, floors, material family, rhythm).
3. Production means: agent-built procedural/parametric kit + AI asset generation. The code-built-art prohibition is retired.
4. Camera: isometric + pan/zoom with **four fixed 90° rotation steps (firm — see Product Goal)**. Free-cam is debug-only. (Revised 2026-06-15: the rotation steps are a requirement, not optional, so no street frontage is permanently hidden.)
5. Real-faithful supersedes fictional-safe storefront identity.

## Architecture Spine

```
NYC footprints (BIN-mapped, WGS84)
  → local scene frame projection            [proven: R10E/R10G]
  → extruded massing + facade planes
  → II-style facade textures                [AI image-to-image from evidence photos;
                                             heroes bespoke, infill from kit]
  → II prop/ground layer                    [sidewalks, crosswalks, street furniture]
  → NPR post pass                           [outline, paper grain, palette grade]
  → DOM paper-card UI                       [II-C marker states + place cards]
```

Stack stays React + Three.js + Vite. No renderer replacement. PixiJS retained only if the 2D overlay earns its keep.

## Phases

> **Track A — Layer 1: Place / The Container.** Everything in Phases 1–5 below builds the render engine: geometry truth, massing, the II-C inked look, facades, ground/props, multi-angle camera, hero place cards, and block scaling. This is *one layer* of the platform (Places + recognition), not the whole product. The phase records are kept intact as the execution history. The **content & exploration layers (Track B)** that test H1–H5 are a separate section below.

### Phase 1: Reset & Clean Baseline — DONE (this commit)

1.1 Plan v2 (this file)
1.2 AGENTS.md rewritten as one-page contract
1.3 Decision log updated with the five reversals
1.4 ART_DIRECTION.md rewritten around II-C system + fallback
1.5 CLAUDE.md updated
1.6 Repo cleanup: phase docs and stale verifiers archived, capture middleware reverted

### Phase 2: Style Feasibility Spike (Franklin x Greenpoint)

Goal: prove the II-C inked look is achievable in real-time 3D — or fall back deliberately.

2.1 Runtime simplification: collapse QA-mode maze to **Scene** (fixed-iso art view) and **Debug** (free-cam truth overlays, footprint IDs)
2.2 Style anchor kit: assemble II-C reference boards + per-corner evidence photos into a generation prompt scaffold
2.3 Generate II-style facade textures for the three heroes (Premier/Franklin Organic, Sonny's Corner, Sereneco) via image-to-image from evidence photos
2.4 Apply to the proven Franklin geometry: facade planes, ground tiles, 2–3 props, fixed-iso camera
2.5 NPR post pass v0: outline, paper grain, palette grade
2.6 **Gate (Batu):** side-by-side — II-C in-engine vs II-C reference boards vs GPT-render fallback. Pick the look.

Known risks this phase exists to answer: AI texture style drift between buildings; seam/perspective artifacts; whether 3D massing shading and 2D inked textures unify or fight.

### Phase 3: Vertical Slice — Franklin corner at full quality (chosen style)

MVP corner (Premier, Sonny's, Sereneco heroes) facades/massing/cornices/awnings: **DONE**. Remaining: the ground layer and corner props (3.1), then composition/interaction.

**3.1 Street layer + corner props** — design + decisions in `DECISION_LOG.md` (2026-06-15). Procedural inked, in-engine. New deep modules `groundLayer.js` / `streetFurniture.js` (pure geometry, Node-runnable like `sceneFrame.js`) + thin `buildGround` / `buildFurniture` renderers in `SceneView.jsx`, replacing the ad-hoc per-building strips in `addRecordContactGrounding`.

  **b1 — Intersection ground system**
  - 3.1b1.1 `groundLayer.js`: project `sidewalkLineRecords` (Greenpoint ×1, Franklin ×3) into the R10E frame → real curb edges. Greenpoint roadbed from real centerline ± width (50); reconstruct Franklin curb edges + derived centerline from its sidewalk-line pair. Output `{ roadbeds, sidewalks, crosswalks, curbs, derived[] }`. Fallback: frontage-offset-by-width if projection noisy.
  - 3.1b1.2 Sidewalk polygon between frontage and curb, wrapping the corner return; crosswalk bands at the intersection mouth; thin raised curb lip catching II-C edge-ink + cast shadow.
  - 3.1b1.3 `buildGround(three, groundLayer)` renderer: asphalt + paper grain + restrained typological lane hint; concrete sidewalk with inked slab score-lines; ivory crosswalk stripes. Remove per-building sidewalk strips. Derived geometry uses `II_PALETTE.streetDerived`.
  - 3.1b1.4 Node verifier: curbs outside frontages, sidewalk width ∈ ~3–6 m, crosswalks inside curb returns, roadbed widths match recorded widths. + `npm run build` + iso screenshot.

  **b2 — Corner signals**
  - 3.1b2.1 `streetFurniture.js`: `placeCornerSignals({ curbReturns })` → mast-arm traffic + pedestrian signals at curb-return points, marked typological.
  - 3.1b2.2 `buildFurniture` renderer: restrained II-C massing (dark ink poles, small signal heads, muted R/A/G). Hydrant/signs/tree-pits deferred.
  - 3.1b2.3 Verifier: signal count + within-curb placement. + screenshot.

  **Status:** b1 (ground) and b2 (corner signals) **DONE** — merged to `main`, modules `groundLayer.js` / `streetFurniture.js` + verifiers. Signal look is a typological first pass (refine later).

**Remaining Phase-3 order:** ~~3.15 (business cards)~~ → ~~3.2 (camera)~~ → **3.3 (all-angle) → 3.4 (lighting) → 3.5 (interaction generalize) → 3.6 (acceptance).**

**3.15 Hero Business Cards (feedback vehicle) — DONE (2026-06-15).** Merged to `main`. Place cards for Premier/Sonny's/Sereneco: sourced JSON data (`franklin-greenpoint-heroes.v0.1.json`), `placeData.js` loader, `PlaceCard.jsx` paper card, click-to-select with gold teardrop pin + SVG tether anchored at storefront level. Truth-gated via `scripts/verify-place-data.mjs`; all records `approvalStatus: "proposed"` (Batu approval required before public demo). 14/14 tests passing.

**3.2 Multi-angle camera rig (the enabler) — DONE (2026-06-15).** Four fixed iso rotation steps (90°) with eased animated snap, keeping pan/zoom; free-cam stays debug-only. Contained to `SceneView.jsx`: `currentAzimuth` tweens between four steps; pan axes recompute from it; rotate via on-screen ↺/↻ buttons + Q/E (or `[`/`]`/arrow) keys, with an "angle N/4" indicator. **Found + handled (plan hadn't anticipated):** the hero back-face cull was azimuth-locked at build time, which would leave see-through holes once the camera rotated behind a building. Fixed by building every wall and toggling visibility per current view via its outward normal (real back-face culling that follows the camera) — no geometry change, no rebuild, NE view byte-identical. Verified by rotating through all four angles (build green, 14/14 tests). **Known gap → 3.3.1:** Premier is a multi-BIN *facade flat* with no rear walls, so it vanishes from the full-rear angle; the solid heroes (Sonny's, Sereneco) stay clean from all four. **Acceptance met:** rotates through all four; framing and pan stay coherent at each.

**3.3 All-angle corner completion** (raises the corner to the multi-angle bar — what 3.2 exposes):
  - 3.3.1 Hero non-street faces: party walls, rears, and exposed sides for Premier, Sonny's, Sereneco get at least typological treatment (brick party wall, sparse rear windows) so rotated views are never blank boxes.
    - **Structural blank-box fix DONE (2026-06-16, `4b95624`).** Premier (the multi-BIN facade flat) was a see-through hole from the rear angles; its uncovered edges are now split interior-vs-exterior by a point-in-sibling-polygon test — interior lot-line wall stays dropped, real rears/sides render as muted typological walls + cullables. No hero is a blank box from any of the four angles. Verified in-engine across all four.
    - **Craft pass DONE (2026-06-16, `2a225ee`).** Every non-textured hero exterior face (Premier rears/sides, Sonny's, Sereneco) now gets a restrained II-C back-wall treatment — faint storey score-lines + a sparse grid of portrait dark "punched" windows + thin ink lintels, drawn a hair proud of the brick (flat-inked idiom). Decoration parented under the wall mesh so it inherits per-view culling. Verified at angles 2–3; reads as real building backs. `decorateTypologicalWall()` in SceneView.jsx.
    - **3.3.1 complete.** No hero is a blank box or a flat slab from any of the four angles.
  - 3.3.2 The other intersection corners: bring the currently-rough corner buildings up to street-frontage treatment (hero-exact where a corner carries a notable storefront, typological otherwise) so every frontage revealed by rotation reads as a real building.
    - **DONE (2026-06-16, `ce42f59`).** Clarified: all four corners are already heroes (Premier, Sonny's, Sereneco, 144 Franklin) — the rough masses are the *context buildings framing the intersection*. Every non-hero building within ~48m (`CONTEXT_TREATMENT_RADIUS_UNITS`) now gets the typological brick/window treatment (`footprintEdges()` + `decorateTypologicalWall(..., lit=true)`); beyond the radius they stay cheap graybox. Verified all angles. **Possible refinement:** skip shared party walls (probe-into-neighbor test, like the Premier interior split) so abutting buildings don't show windows on a hidden lot line — not visible at the corner, deferred.
  - 3.3.3 Corner wraps + exact signage/awnings on the heroes (the old 3.2 scope), now validated from all four angles.
    - **Largely pre-built + validated (2026-06-16).** Corner-wrap awnings/signage on the heroes were built in prior sessions and hold at all four angles (Premier's "premier ORGANIC" awning wraps the corner cleanly; all heroes carry textured Greenpoint+Franklin frontages). Validation surfaced one real item, now resolved: **Azure Gourmet** — a real, Batu-verified deli sharing Sereneco's 113 Franklin building — got its own place card (`azure-gourmet`, active/verified, `bf73bba`) and per-storefront click selection (`3fce782`): tagging a storefront spec entry with `placeId` makes it resolve to its own card. **3.3.3 effectively complete** (remaining signage exactness folds into the Phase 5.4 pre-publish truth pass).

3.4 Lighting, shadow shapes, and composition pass — composed at each of the four angles.
3.5 Interaction v0: hover/select highlight + paper place card (II-C sections 8–9).
3.6 **Acceptance (Batu):** would a Greenpoint local recognize this corner instantly, **from any of the four angles**? Does it hold against the reference boards?

### Phase 4: MVP Scene — Greenpoint x Manhattan Ave + corridor

**4.1 (c) Franklin block-face extension — Greenpoint Ave → Milton St** — **DONE** via the procedural block recipe (worktree `procedural-block-scaling`). 53 buildings (Block A: Franklin→Milton) + 39 buildings (Block B: east-Greenpoint) pulled, typed, and rendered with OSM storefronts. New artifacts: `scripts/pull-footprints.mjs`, `scripts/pull-storefronts.mjs`, `src/buildingTypology.js`, `src/storefrontRoster.js`, `src/data/blocks/*.block.json`, `docs/SCALING_LOG.md`. Block B required only 1 src file touched (6 net-new lines in `src/SceneView.jsx`); all modules reused unchanged. See `docs/SCALING_LOG.md` for the full scorecard + verdict.
  - 4.1c.0 ~~Data pull~~: done — `pull-footprints.mjs` + `pull-storefronts.mjs` are descriptor-driven; bounded NYC Open Data + PLUTO pull surfaces and enriches the Franklin/Greenpoint footprints (they were present in the 291-record set but radius-culled and lacking PLUTO).
  - 4.1c.1 ~~Extrude typological massing~~: done — `buildingTypology.js` classifies all footprints; walls + windows rendered via existing pipeline.
  - 4.1c.2 ~~Extend groundLayer~~: done — block loop in `sceneFrame.js` extended the ground run to cover both blocks.
  - 4.1c.3 ~~Verifier~~: `score-block-build.mjs` scorecard; both blocks verified.

4.1b Second intersection built entirely through the pipeline; measure hours-per-corner and what needed hand-tuning
4.2 Kit-ify what repeated: texture prompt templates, prop placement rules, facade parameter schema. **Substantially realized** — the descriptor+registry pattern is the kit; a third block is pure data + 2 array entries. **Sign system landed (2026-06-16, `feat/storefront-sign-system`):** the `storefrontSigns.js` system replaces real-name bands with an enlarged **category-label band** — signs default to category labels ("Barbershop", "Café", "Deli") for unclaimed businesses, and a `claimed`-flag + `brandName` path attaches real branding (the monetization experiment — businesses pay to claim their location). Existing heroes are the seeded claimed showcase. **Projecting blade signs were trialled and dropped** (didn't read at the fixed iso angles). Remaining 4.2 polish: (a) ~~sign legibility at iso~~ **DONE (2026-06-16, 4.2a)** — the **awning-valance name** idiom shipped for food trades (cafe/deli/restaurant/convenience): a projecting canopy + vertical valance carrying the label, perpendicular to the wall band so it reads front-on at whichever iso angle flattens the band. Pure planner (`storefrontSigns.js` emits `kind:"awning"` with `variant:"canopy"|"flat"`; non-food keep the legacy coplanar strip); renderer `buildStorefrontAwnings()` in SceneView.jsx + `makeStorefrontValanceTexture()` (cream serif on category fabric tint + hem lines). 15/15 planner tests; verified in-engine — 5 food-trade survivors (RESTAURANT×2, CAFÉ, DELI×2) render correct category-label valances. (b) ~~OSM dedup-by-proximity (4.2b)~~ **DONE (2026-06-16)** — pure `dedupeByProximity()` in `storefrontRoster.js` (proximity + fuzzy-name match, higher-ranked record wins) wired into `buildBlockStorefronts` after projection (~4m radius). Collapses the same business surfaced by overlapping block bboxes; verified in-engine — `Land of Barbers` and `Big Night` (the two exact-point cross-roster duplicates) now resolve once each (`The Land of Barbers`, ~37m away, correctly kept distinct). 7/7 roster tests.
4.3 Corridor infill v0: typological block faces connecting the two corners
4.4 **MVP review (Batu)**

### Phase 5: Block → Neighborhood → Publish

5.1 Typological infill kit driven by NYC data (massing, floors, material family)
5.2 Batch generation workflow + texture caching/atlasing
5.3 Performance pass (instancing, draw-call budget, zoom-range texture resolution)
5.4 **Pre-launch truth pass:** verify names/placements, fix misattributions, optional goodwill outreach to featured businesses
5.5 Public community demo

## Track B — Content & Exploration Layers + Instrumentation

This is the half of the platform that tests the hypotheses. None of it is built yet; the schemas are designed (in the context docs). **Sequencing is intentionally OPEN — see "Priority Re-decision" below.** Each layer is listed with the hypothesis it exercises:

- **B1 — Story layer (H1).** Implement the `PlaceStory` schema as structured, source-backed JSON (editorial truth kept separate from geometry/business truth). Author a small set of *real* story objects on existing places (owner/origin stories, lore, hidden-gem). Surface them in the place-card UI (a "story" section). Tests whether story/context out-pulls directory info.
- **B2 — History / Then·Now·Lost (H1, defensibility).** Historical photos + former uses anchored to locations (OLDNYC-sourced). Populatable *without* businesses or UGC → candidate lead acquisition vector.
- **B3 — Landmark anchors (curated density).** The ~15-pin story-object set via the `Landmark` schema + verification gates. The spine the other layers hang on.
- **B4 — Curated Routes (H2).** Thematic multi-stop trails across the anchors (e.g. First-Time Greenpoint, Vintage Trail, Polish Greenpoint). Tests multi-stop exploration + discovery.
- **B5 — Events / What's-Happening-Now (H3).** Time-bound pins (markets, open studios, stoop sales). Tests urgency, repeat visitation, acquisition.
- **B6 — Instrumentation toward the North Star.** Lightweight event logging (story opens, pin clicks, dwell, route starts, multi-stop) so demos and pilots produce Verified-Local-Exploration signal instead of anecdote. Cross-cutting; likely a prerequisite for *measuring* any of H1–H3.
- **B7 — Business participation & monetization (H4).** Builds on the existing claim-to-brand hook (the `storefrontSigns.js` `claimed`/`brandName` path; see Phase 4.2). Sequenced *after* attention is demonstrated.
- **B8 — Repeatability (H5).** Generalize the playbook to a second neighborhood. Last.

## Sequenced Roadmap — LOCKED 2026-06-18

Resolves the (formerly open) priority re-decision. **Principle:** don't fill the neighborhood and *then* add content. Build out the **story-dense spine** and dress it with both craft and content at once — curated density, not coverage. Container and content stop competing, because the spine is exactly where the landmarks and stories live. Phase numbering continues Track A (1–5); where a new phase absorbs an older Track-A or Track-B item, it's noted.

**Deferred for now (explicit):** roof *detail*, pavement/sidewalk detail, business-claim monetization, second neighborhood. *(Watchout: a flat roof **tone** is NOT deferred — see 7.4 — because the four-angle camera shows rooftops.)*

### Phase 6 — Curation & Visual-System Lock — DONE (2026-06-18)

Cheap, decision-shaped, and gates everything downstream. Nothing scales until this lands.

- **6.1 Hero + Landmark tiering (one pass) — APPROVED 2026-06-18.** A single curation producing two views of the same set: the **hero visual tier** and the **landmark story-object tier**. Output landed in **`docs/CURATION_TIERS.md`** (the authoritative list): 11 v1 heroes (within the ~10–12 budget), the typological default, the landmark spine, and locked decisions (Black Rabbit + Brouwerij Lane + Eberhard Faber building promoted to hero; Franklin-north spine first; Manhattan Ave a later node). **6.1 execution complete (2026-06-18):** tiers encoded as data in `src/data/curation/building-tiers.v0.1.json` + pure loader `src/curationTiers.js` (`visualTierFor`/`landmarkTierFor`/`isHero`, default = typological) + `curationTiers.test.mjs` (7 tests); stale closed-bar "The Pencil Factory" record removed from the east roster (6→5); Brouwerij Lane tracked as `buildStatus:data-missing, verificationStatus:pending` (not rendered, truth gate). Also fixed a pre-existing stale `placeData.test.mjs` (azure-gourmet hero). 62/62 tests, build green. **Deferred to 6.2:** wiring the renderer/kit to *read* `visualTier` from the registry for treatment selection (belongs with the component inventory).
- **6.2 Visual-system contract (the consistency engine).** Codify `ART_DIRECTION.md` into machine-checkable form so styling can't drift as we scale. This is the concrete answer to the consistency watchout.
  - 6.2.1 **Palette token module** — single source for every color; enforces the "palette is a no-miss" rule in code.
  - 6.2.2 **Component inventory** — kit pieces × material families × variants × tiers, mapped to the modules that render them.
  - 6.2.3 **Conformance gate** — fails on any out-of-token color + a per-material regression screenshot. All building rendering routes through the kit; ad-hoc per-building tuning (the recent cornice churn) ends here.

### Phase 7 — Asset Kit Completion — IN PROGRESS (clapboard anchor shipped; fan-out next)

Each family: components generated tintable-neutral (dark ink on warm grey) → keyed to alpha → composed via `inkedFacadeCompose.js` → passes the 6.2.3 gate. Full scope/plan in `docs/superpowers/` (2026-06-18). **Foundation done (Tasks 1–5):** 6-family taxonomy + valid-cell matrix (`src/materialFamilies.js`), `nearestPaletteToken` color contract, roof-tone tokens, headless component verifier (`scripts/verify-inked-component.mjs`, chained into `npm run verify`), reference-intake manifest. 56-photo reference corpus organized in `docs/reference/asset-reference/`.

**Clapboard vertical-slice pilot — SHIPPED (2026-06-20).** Gate A (contact-sheet board) + Gate B (isolation scene proof composed at real-meter dimensions — ~6 m × 8.5 m 3-storey rowhouse) both built and approved by Batu. 5 components through both taste gates: `clapboard-{wall,cornice,window,door-stoop,weathering}.v1.png`. This is now the consistency anchor for all subsequent families — the generation recipe, alpha-key workflow, and real-meter compose harness (`src/dev/AssetKitProof.js`) are proven.

**Carryover (fan-out to remaining families):**
- Fan out to have-refs families using the proven recipe (brownstone, modern/flat; warehouse pending gather photos).
- Gather-dependent columns: bay-frame / awning / roll-gate — pending field photos.
- BUILD the signature layer (recognizable-silhouette model) — defined in contract only today; wiring into the renderer is Phase 7+/8.

- **7.1 Clapboard / wood-frame — SHIPPED.** (horizontal-lap; shingle sub-type is carry-over)
- **7.2 Brownstone.**
- **7.3 Modern / flat.**
- **7.4 Typological roof tone** — flat, quiet, multi-angle-safe (NOT detailed roofs). Closes the rotated-view rooftop gap.

### Phase 8 — Spine Expansion + Story Attachment — NOW (8.2 done; 8.1 / 8.3 / 8.4 live)

Absorbs Track-A 4.3 (corridor infill) and 5.1 (typological infill kit), and Track-B B1.

- **8.1 Expand along the story-dense spine** — extend the procedural scene down the curated corridor (not all of Greenpoint). Hero treatment only on the 6.1 set; everything else typological through the completed kit.
- **8.2 `PlaceStory` schema in code — DONE (2026-06-19).** Structured, source-backed JSON in its own file (`src/data/stories/place-stories.v0.1.json`) + pure loader (`src/placeStories.js`, `getFeaturedStoryForPlace`/`selectFeaturedStory`, one featured story per place, `publicMode` gate). Editorial truth kept separate from geometry/business truth; gated like place records (`sources`/`verificationStatus`/`approvalStatus`) and enforced by `scripts/verify-place-stories.mjs` (incl. `approved⇒verified` + FK), chained into `npm run verify`. Featured-story section added to `PlaceCard.jsx` (text/image/audio + lore badge). **137 Oak St promoted to off-spine hero record** (`landmark-heroes.v0.1.json` + registry, `buildStatus:data-missing`, render/map-placement deferred, Brouwerij Lane precedent) carrying the first seed story ("Haunted House", unverified lore). Spec/plan in `docs/superpowers/`. Open: Batu supplies the audio file; 137 Oak in-scene clickability is the deferred hero build.
- **8.3 Attach 3–5 real story objects to built landmarks** and surface them in the place card (a "story" section). Starts testing **H1** with residents/orgs *during* expansion, not after — the insurance against polishing an empty container.
- **8.4 Lightweight instrumentation hooks** (Track-B B6 seed) — log story opens / pin clicks / dwell so demos produce signal, not anecdote.

### Phase 9 — Validate & Scale — LATER

Track-B B3–B8 + remaining Track-A 5.x: landmark-set completion, curated routes (H2), events (H3), instrumentation toward the North-Star metric, business-claim monetization (H4), roof/pavement/sidewalk detail, pre-launch truth pass, public demo, repeatability (H5).

## Deferred (vision-compatible, not in scope)

Dynamic life (people, pets, vehicles — sprites/cel-shaded fit the II look), ambient audio, business interaction features.

## Known Data Gaps

- Franklin Ave centerline missing from the source packet (R10E finding); current cross-street slab is derived, review-only.
- Footprint confidence classes from 4D-1: 126 safe / 14 uncertain / 2 blocked across the 142 corridor buildings.
- ~~"291-record buffer has crossAxisOffset≈0 ⇒ no Franklin coverage"~~ — corrected: the Franklin/Greenpoint block footprints were present in the 291-record set but radius-culled and lacking PLUTO storey data. The procedural recipe surfaces and enriches them via a bounded NYC Open Data + PLUTO pull (`pull-footprints.mjs`).

## What Survives From v1

- Franklin-local scene frame projection + BIN target mapping (R10B/R10E/R10G fixtures + verifiers in `scripts/`)
- Evidence photo library (`src/data/facade-evidence/`)
- Corridor scaffold fixtures (`src/data/corridor-scaffold/`) as typological input data
- Approved reference corpus (`docs/reference/approved-reference-corpus/`) and II-C reference boards (paths in `docs/ART_DIRECTION.md`)
- QA/Debug vs Scene mode separation principle
