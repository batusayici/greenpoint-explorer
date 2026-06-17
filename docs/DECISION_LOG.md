# Decision Log

## Current Use Note

This is a historical decision log. Older entries may contain status language that was current on the entry date only; use the source-of-truth order in `AGENTS.md` for current execution authority.

## 2026-06-16 - Inked Look Gate + Modular Component Kit (spike: conditional GO)

Decision (Batu-approved in session, after the in-engine feasibility spike on branch `feat/inked-facade-look`):

1. **Look gate:** the whole scene speaks **one II-C inked language** (`docs/ART_DIRECTION.md`). Heroes/landmarks get bespoke renders but *in the inked style* (re-rendered over time); everything else is procedurally rendered in the inked system. Heroes and infill differ in **craft tier, not style**. This ends the drift into the documented fallback (photo-real heroes + flat-color typological infill).

2. **Non-hero facades = a modular inked COMPONENT KIT, not whole-building tiles.** Batu's domain fact: ~80% of Greenpoint is four facade systems (brick, wood-frame/clapboard, brownstone, modern) recolored/recombined. Whole-building tiles are combinatorially explosive and stretch wrong on the next building; a small library of inked components (wall/window/cornice/ground/etc.) recombines infinitely, driven by `buildingTypology.js`, reusing the `facadeAssembly.js` composition idea.

3. **Tintable-neutral components + shader tint.** Components are generated dark-ink on light warm-grey (~#EDE8E0), no saturated color; material color is applied in-engine as a `MeshBasicMaterial.color` multiply. Collapses "4 systems × many colors" from dozens of renders to ~4 material renders + a color parameter.

4. **Technique order: AI inked assets (#3) first; NPR screen-space post-pass (#1) is the fallback.** Modular components are what make #3 worth it (generate once, recombine forever).

**Spike result — conditional GO.** Generated a brick component set (wall/window/cornice/ground), composed two adjacent 1855 rowhouses in-engine via a pure `inkedFacadeCompose.js` + a gated `buildInkedFacadeTest` in `SceneView.jsx`, and recolored to two tints.
- ✅ Components **compose** into a facade. ✅ **Shader-tint recolor works** — same neutral brick texture × two tints, ink stays dark (this validates the mechanism the whole Tier-B color pipeline depends on). ✅ Brick wall + ground-floor stoop **read as hand-inked**; no ugly wall seams.
- ❌ **Window component washes to bright white blocks** at building scale (near-white glass/frame, untinted) — finding #1 for the full kit: re-render the window darker/bolder (and consider a faint tint).
- Engineering notes: GPT returned "transparent" window/cornice as a **baked checkerboard** (no alpha) → keyed to real alpha with `scripts/key_inked_alpha.py` (border-seeded flood, stops at ink). Spike also forced camera-facing edge selection, polygon-offset decal bias, and frustum-cull disable in `buildInkedFacadeTest`.

**Next:** brainstorm the **full inked component kit spec** — the other 3 materials (clapboard/brownstone/modern), more component variants, typology-driven composition across the block, and the hero inked re-render track. Re-render the brick window component (bolder ink) as the first concrete fix. The facade-truth/recognizability pipeline (per-BIN parameter vector grounded by tiered evidence; Mapillary-primary, Street-View-extract-only; spine-first) is the data half that feeds this kit. The throwaway spike wiring is gated by `INKED_FACADE_TEST` and trivially removable; keep for now as a working reference.

Spec/plan: `docs/superpowers/specs/2026-06-16-ai-inked-component-kit-spike-design.md`, `docs/superpowers/plans/2026-06-16-ai-inked-component-kit-spike.md`. Owner: Batu (taste/approval) / Agent (execution).

## 2026-06-15 - Multi-Angle Camera Rig Shipped; Hero Culling Now Follows the Camera (Phase 3.2)

Decision (execution, within the approved 3.2 scope): Scene mode now rotates through **four fixed iso steps** (90°) with an eased snap, retaining pan/zoom; free-cam stays debug-only. Rotation via ↺/↻ buttons + Q/E/`[`/`]`/arrow keys, with an "angle N/4" indicator. Contained to `SceneView.jsx`.

Implementation note worth recording (the plan's "no geometry change" assumption was incomplete): the hero back-face cull was computed once at build time against the single fixed `ISO_AZIMUTH`. With a rotating camera that left **see-through holes** when viewing a building's back. Chosen fix: build every (non-party) wall and **toggle `.visible` per current view** from each wall's outward normal — true back-face culling that tracks the live azimuth, recomputed each snap frame. No geometry/rebuild; the step-0 NE composition is byte-identical to before.

Known limitation, explicitly deferred to **3.3.1**: Premier is a multi-BIN *facade flat* (only its two street faces exist; uncovered edges are interior party walls), so it disappears from the full-rear angle. Single-BIN solid heroes (Sonny's, Sereneco) read correctly from all four angles. Giving Premier party walls/rears is 3.3.1's job.

Owner: Agent (execution). Verified: `npm run build` green, 14/14 node tests, four-angle rotation screenshotted.

## 2026-06-15 - Hero Business Cards Inserted as the Next Phase (feedback vehicle)

Decision (Batu-approved in session): insert a **business-card demo phase (3.15) ahead of the camera rig (3.2)**, so Batu can start collecting feedback and ideas from local businesses while the rest of Phase 3 is built. Objective: clicking a hero corner opens a paper II-C place card with real, sourced business data for the three heroes (Premier/Franklin Organic, Sonny's, Sereneco).

Decisions on shape:
1. **Reference:** build to `docs/reference/art/II-B-place-card-marker-hover-state.png` + ART_DIRECTION §9 (paper card, pin + tether), with a **trimmed IA** — name, category, tag row, address, neutral description, disclaimer. **No Save/Share/Details, no hours/OPEN-NOW** in v0 (avoids implying app features we won't build and dodges the staleness-prone hours field).
2. **Data:** agent does documented public-source research and **proposes** static local records (per `PLACE_SOURCE_POLICY.md`: public facts only, cited sources, `lastVerified`, no scraping/APIs/live data). **Batu approves before any public/demo use** — records carry `approvalStatus: proposed` until then.
3. **Hours/status:** omitted in v0; uncertain status surfaces as `unknown`/under-review, never as a live claim.
4. **Feedback mechanism:** display-only card with an unofficial-prototype disclaimer; Batu demos in person and captures reactions (no in-app submissions, per policy).

Detailed plan: `docs/superpowers/plans/2026-06-15-hero-business-cards.md`. This pulls forward and focuses the place-card half of the old Phase 3.5 onto the three heroes with real data.

Owner: Batu (public representation + data approval). Agent proposes.

## 2026-06-15 - Multi-Angle Viewing Is a Firm Requirement (revises the camera decision)

Decision (Batu-approved in session): the scene must be **viewable from all four orthogonal isometric angles** (90° rotation steps), with pan/zoom. This revises the 2026-06-11 camera decision (item 4), which left rotation as "possibly 2–4 steps" — it is now a requirement, not optional.

Why:
- A single fixed iso angle renders only **two of every building's four sides**. Every street frontage that faces away is permanently invisible — and that is structurally ~half of all frontages once the scene extends past a corner. Those hidden frontages are **businesses that would never be seen**. Four orthogonal rotations make every street frontage visible from at least one angle.
- This is **not** free-cam (which stays debug-only). It is four discrete, composed isometric viewpoints.

Scope implications:
- A building's street frontages must be treated for whichever angle(s) reveal them (hero-exact where notable, typological otherwise). "All visible faces" now means all four angles.
- Scene/corner completeness and the Phase-3 acceptance gate are judged **from all four angles**, not one.
- Existing work is unaffected: b1 ground is symmetric; hero facade textures live on world-space faces (corner fold, kinks, etc. are geometric), so rotation views them correctly rather than breaking them.

Sequencing consequence (PLAN.md): the **multi-angle camera rig (Phase 3.2)** and **all-angle corner completion (Phase 3.3)** come before the Franklin→Milton extension (Phase 4.1 / c) — complete the template corner from all angles before replicating it down the block.

Owner: Batu.

## 2026-06-15 - Street Layer + Franklin Extension Direction (Phase 3.1 / Phase 4.1)

Context: MVP corner (Franklin × Greenpoint heroes — Premier, Sonny's, Sereneco) is complete. Next work is the ground/street layer (b1), corner signals (b2), then a Franklin block-face extension (c). Decisions (Batu-approved in session):

1. **Ground render = procedural inked, in-engine.** Roadbed, sidewalk, curbs, and crosswalks are built as geometry with II-C inked treatment (asphalt/concrete tones, paper grain, slab score-lines, painted-stripe geometry). No AI ground textures in v0; reserve image-to-image upgrade only if the surface reads flat next to the textured facades.
2. **Curb/sidewalk geometry = hybrid (real where present, derived where not).** Project the existing `sidewalkLineRecords` into the R10E frame for real curb edges — these exist for **Greenpoint Ave (×1) and Franklin St (×3)** in `geometry-source/...phase-3b.json`. Greenpoint roadbed from its real centerline + recorded width (50). Franklin has no source centerline (known gap), so reconstruct its curb edges + a derived centerline from its sidewalk-line pair. Anything derived renders under the existing `II_PALETTE.streetDerived` flag. Fallback to frontage-offset-by-width only if projection proves noisy.
3. **Street furniture = typological-standard, signals first.** Standard NYC mast-arm traffic + pedestrian signals at curb-return positions, marked typological (infill truth rule). Hydrant/signs/tree-pits deferred. Exact placement deferred to the pre-publish truth pass.
4. **Franklin extension (c) scope = full block face, Greenpoint Ave → Milton St**, typological massing (correct floors/height/material family, no hero facades). Heroes deferred.
5. **Prerequisite for c:** the Greenpoint→Milton Franklin block face is **not in the current footprint set** (the existing 291 records are a Greenpoint-Ave-axis buffer; `crossAxisOffset` ≈ 0 across all — no up-Franklin coverage). c is gated on a bounded NYC Open Data footprint pull (step c.0) before massing.

Sequencing: b1 → b2 → c. b1 is load-bearing — b2's signals sit on b1's curb returns, and c extends b1's Franklin ground run. b1+b2 complete Phase 3.1; c opens Phase 4.1.

Owner: Batu.

## 2026-06-12 - Premier Corner Fold Fixed at PREMIER_KINK = 0.478

Decision (Batu-approved in session):
- `PREMIER_KINK` stays **0.478**. The Premier facade fold (Franklin↔Greenpoint boundary in the v4 corner texture) is settled; do not move it to ~0.52.

Evidence:
- Resolved against the likeness-truth photos, not the commissioned contour. In `franklin-southwest-zoom.jpeg` the real building corner is the storefront sign break — the vertical seam between green "ORGANIC" (Franklin face) and the right-hand "premier" (Greenpoint face), sitting on the corner post. The bay oriel is a Greenpoint feature set *just past* the corner, not the corner itself.
- That sign break maps to whole-u ≈ 0.48–0.50 in `premier-franklin-organic--corner-v4.png` — i.e. the current 0.478. Content right of ~0.50 ("premier" word → bay → fire escapes) is Greenpoint in both photo and texture.
- Moving to 0.52 would push the fold right of the real storefront corner, dragging the corner storefront onto the receding Greenpoint plane — contradicted by the evidence.

Known minor artifact (accepted): the window column at whole-u ≈ 0.477–0.511 physically straddles the corner, so no kink value renders it cleanly frontal. It is currently assigned to the Greenpoint face at local-x [0, 0.063]. If revisited, fix it *locally* (tighten that one window's assignment/recess) — never by relocating the fold.

Supersedes the git-history oscillation ("true drawn corner at u=0.52" → v4 "proportional corner at 0.478"). The fold is closed; reopen only with new photo evidence.

Owner: Batu.

## 2026-06-11 - Project Reset: Goal, Gates, Production Means, Camera

Decisions (all Batu-approved in direct session):

1. **Product goal restated:** a 3D, isometric, interactive, explorable, browser-based Greenpoint that is lifelike — buildings/businesses located exactly where they are in real life and recognizably themselves. Art-directed (II-C Inked Indie), not hyperreal.
2. **Real-faithful supersedes fictional-safe.** The fictional-safe storefront identity clause of the 2026-05-28 visual approval is retired. Real business names, signage, and likenesses are the goal.
3. **Audience: public community demo.** Real names/likenesses are used freely during development; factual-claims discipline moves to a pre-launch review pass (verify names/placements, fix misattributions, optional business outreach).
4. **Likeness bar: heroes exact, infill typological.** Corners, landmarks, and storefronts get exact treatment; rowhouse infill gets correct massing, floor count, material family, and rhythm.
5. **Production means: agent-built procedural kit + AI asset generation.** The Visual Asset Responsibility Rule (prohibition on code-built primary art) is retired. AI image generation (GPT-5.5 class) and image-to-3D are authorized lanes.
6. **Camera: fixed isometric + pan/zoom** (possibly 2–4 rotation steps). Free-cam becomes debug-only. This is the controlling assumption for asset cost.
7. **Look hierarchy:** II-C Inked Indie Visual System is primary; the GPT-5.5 photo-render benchmark (Premier Organic image) is the fallback, decided at the Phase 2 style-feasibility gate — not by drift.
8. **Governance collapse:** the v1 multi-party batch/gate contract, per-batch briefs, ledger reconciliation, and claim ladders are retired. AGENTS.md v2 (one page), PLAN.md v2, and this log are the living docs.

Rationale:
- Seven sub-batches (R10A–R10G) were needed to place three buildings; process mass exceeded product output.
- The art pillar — the product's core value — had produced only voxel massing studies because every art-production path was gate-blocked.
- Ecosystem evidence (June 2026) shows procedural Three.js city art is now cheap; the project's moat is its truth pipeline plus Batu's taste.

Benchmark provenance: the Premier Organic benchmark image was rendered by GPT-5.5 from a reference photo, establishing the AI image-to-image lane as proven.

Owner: Batu (all eight decisions). Agent executes inside them per AGENTS.md v2.

## 2026-06-04 - Phase 3 Real Corridor Direction Approved

Decision:
- Batu rejected the current Phase 3 placeholder/scaffold review surface as product-direction evidence.
- The Phase 6 fictional storefront raster, arbitrary storefront names, and SVG/code-native diagramming may support scaffold mechanics or QA only; they must not be presented as the Phase 3 product/visual review target.
- Phase 3 is approved as the real Greenpoint Ave corridor expansion from the accepted Manhattan Ave / Greenpoint Ave west anchor toward the Greenpoint Ave / Franklin Ave corner.
- Users should eventually explore Greenpoint Ave between those intersections using real geometry, real business addresses, real business information, and Batu-supplied or Batu-approved facade imagery.
- Missing corridor data or facade imagery must be represented as blocked/intake state, not replaced with invented storefronts or fictional names.

Rationale:
- The project already has an accepted, rastered Manhattan Ave / Greenpoint Ave corner at the end of Phase 2.
- Re-reviewing an arbitrary placeholder raster with made-up storefronts does not advance the Phase 3 goal and creates confusion about whether the app is showing real Greenpoint.
- The next useful proof must move toward the real street, real buildings, and real stores, with claim discipline preserved.

Constraints preserved:
- Review-only.
- No production/public factual claims.
- No production visual assets, production asset direction, or production asset pipeline approval.
- No live retrieval, scraping, Google/Street View/3D Tiles extraction, source-vendor integration, backend, CMS, persistence, analytics, CI, deployment, package/tooling changes, or public-interface changes.
- No exact tenant frontage, exact entrance placement, exact building geometry, exact station geometry, or raster readiness without supporting evidence and Batu approval.

Owner:
- Phase 3 product/scope correction: Batu
- Control-doc reconciliation: Codex
- Critical review/brief support when requested: ChatGPT

Status:
- Active orientation / next implementation brief redirects Phase 3 toward real corridor reset and evidence-backed scene foundation

## 2026-06-03 - DTR-8 Geometry-First Raster Readiness Policies

Decision:
- For Phase 2DTR-9, the JSON geometry adapter is the source of truth for styled raster layout.
- Prose prompt text is secondary and must not replace, reinterpret, or invent geometry outside the structured adapter.
- In-scene address text is disabled for the controlled styled raster attempt; exact address strings are QA-only unless Batu explicitly reopens in-scene address labels.
- The Dunkin address cue must not be generated as freeform in-scene text. The fixture/source context is `893 Manhattan Ave`; any exact address display remains QA-only.
- One primary Greenpoint G subway cue is allowed from the geometry adapter. Additional G circles, signs, or entrance hints must be omitted unless explicitly marked `secondary_symbolic` or `context_only`.

Rationale:
- Phase 2DTR-6 showed that polished raster generation can hide layout drift and produce wrong or ambiguous text/cues.
- Phase 2DTR-7 showed the fixture could control target layout but lacked hard road/pedestrian primitives.
- Phase 2DTR-8 completes the geometry-first adapter so DTR-9 can test styled rendering without returning to prose-driven layout.

Constraints preserved:
- Review-only.
- No production/public exact-geometry claims.
- No production assets or production asset pipeline approval.
- No live scraping, Google/Street View/3D Tiles extraction, texture extraction, tracing, or training use.
- No app/source/package/tooling changes.
- No normal-mode raster replacement.

Owner:
- DTR-8 policy direction: Batu
- Geometry adapter and documentation execution: Codex

Status:
- Active DTR-9 review-only adapter policy / production and public-readiness gates still blocked

## 2026-06-03 - Exact MVP Geometry Review Gate Opened

Decision:
- Batu unblocked exact MVP review work for storefront/facade/frontage/order/entrance/window geometry.
- Batu unblocked exact MVP review work for exact address placement and exact Greenpoint G station/entrance geometry.
- These fields may now be pursued, represented, and evaluated in review-only MVP artifacts when backed by structured source/reference evidence, provenance, and explicit truth/status labels.
- This does not approve unsupported exact claims, product/public exact-geometry claims, production assets, production asset pipeline, public factual readiness, live data, scraping, Google/Street View/3D Tiles extraction, broad coverage, package/tooling changes, or normal-mode raster replacement.
- NYC Open Data/building footprints remain scaffold geometry context only and must not by themselves be treated as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or exact station/entrance geometry.

Rationale:
- The MVP data-to-raster proof now needs a path for evidence-backed exact geometry fields instead of treating all exact geometry as categorically blocked.
- The unblock lets the review pipeline test whether stronger source/reference evidence can support exact MVP geometry while preserving production/public-readiness gates.

Constraints preserved:
- Docs-only gate recording for this batch.
- No app/source edits.
- No new package/tooling, CI, live data, scraping, source-vendor integration, production assets, or normal-mode behavior changes.
- No automatic product/public readiness or production/public exact-geometry claims.

Owner:
- Exact-geometry gate unblock: Batu
- Documentation reconciliation: Codex

Status:
- Active orientation / exact MVP geometry review lane opened / production and public-readiness gates still blocked

## 2026-05-31 - MVP-29C Batu Decision Revision Recorded

Decision:
- Batu confirmed the active NW candidate is `Grillpoint Deli`.
- `Greenpoint Deli` is archival / prior conflicting language only and is not the current public label.
- Batu approved a narrow MVP-only SW Dunkin visual-reference exception because scaffolding prevents usable current field photos.
- The Dunkin exception applies only to the SW Dunkin reference gap for human-reviewed, stylized, truth-safe, non-production review/demo-scale visual approximation.
- The exception does not approve a general Google/Street View/3D Tiles policy change, production use, texture extraction, tracing, stored facade asset reuse, training input, generation input, or exact trade-dress reproduction.
- Greenpoint G exact cue placement may be allowed where supplied/approved reference photos clearly verify the cue's corner/orientation relationship.
- If a specific subway cue cannot be verified from reference photos, it remains symbolic, context-only, omitted, or blocked.
- Do not infer exact station geometry from MTA text alone.
- MVP-29C revised verdict is `revise-after-jpg-reference-supply`; MVP-29D remains closed until JPG reference review is accepted or remaining gaps are explicitly accepted.

Rationale:
- The four-corner MVP path needs a realistic way to handle the scaffolded SW Dunkin corner without turning a temporary reference gap into a permanent blocker.
- The subway cue rule allows exactness only where photo evidence supports it while preserving the no-false-geometry standard.

Constraints preserved:
- Docs-only revision.
- No app/source changes.
- No rendering, raster regeneration, screenshots, target additions, staging, or commit.
- No MVP-29D opening before the MVP-29C JPG reference review is accepted.
- No production assets, production asset pipeline, exact facade/address/station geometry claims, real-card finality, public-release claims, trademark/logo/trade-dress reproduction, or QA/demo freeze.

Owner:
- Scope, exception, and cue-placement decisions: Batu
- Critical review and decision-support when requested: ChatGPT
- Docs-only reconciliation: Codex

Status:
- Active orientation / MVP-29C revised / JPG reference review needed before MVP-29D

## 2026-05-31 - MVP-29A / MVP-29B Four-Corner Scope Supersession Recorded

Decision:
- Batu rejected the immediate one-corner MVP-22 QA/demo-freeze path.
- MVP completion is now framed around the full Manhattan Ave x Greenpoint Ave four-corner authored diorama.
- MVP-22 / MVP-22C remains accepted as successful one-corner proof evidence, but it is not sufficient for revised MVP completion.
- Batu accepted MVP-29B with the active NW label resolved to `Grillpoint Deli`.
- `Greenpoint Deli` is historical / archival / prior conflicting candidate language only and is not the current active public label.
- MVP-29C is complete as a docs-only visual-reference completeness gate.
- Superseded by the MVP-29C Batu decision revision above: MVP-29C revised verdict is `revise-after-jpg-reference-supply`; JPG reference review is needed before MVP-29D.

Rationale:
- Freezing the one-corner Grillpoint slice would evaluate the wrong target after Batu changed the MVP completion definition.
- The current risk is JPG reference review, truth-safe treatment, approved exception handling, and exact-claim blocking before any translation/composition or implementation work.

Constraints preserved:
- No app/source changes.
- No rendering, raster regeneration, screenshots, target additions, staging, or commit.
- No MVP-29D opening before MVP-29C reference gaps are resolved, cut, or explicitly downgraded by Batu.
- No production assets, production asset pipeline, exact facade/address/station geometry claims, real-card finality, public-release claims, or QA/demo freeze.

Owner:
- Scope and acceptance decisions: Batu
- Critical review and decision-support when requested: ChatGPT
- Docs-only cleanup and reconciliation: Codex

Status:
- Active orientation / MVP-29C complete / reference recovery needed before MVP-29D

## 2026-05-29 - Direct Repo-Docs Operating Model Adopted

Decision:
- Adopted a direct repo-docs execution model for Codex.
- Codex executes from `AGENTS.md`, `docs/CURRENT_EXECUTION_BRIEF.md`, `docs/PLAN.md`, `docs/MVP_EXECUTION_LEDGER.md`, and relevant topic-specific docs.
- ChatGPT is no longer required as a repetitive handoff step after every Codex batch.
- ChatGPT remains available for critical planning, review, ambiguity, and gate-decision support when Batu or repo governance calls for it.
- Batu remains the decision owner for visual direction, scope, architecture gates, public interfaces, approval states, and final approvals.
- Codex must stop when repo docs conflict in decision-relevant ways, approval is missing, the current brief does not authorize the requested edits, or another listed stop condition is reached.
- Codex must use repo docs instead of ChatGPT conversation memory when repo docs answer the question.

Rationale:
- The previous repetitive ChatGPT / Codex handoff loop created too much friction, repeated decision churn, and context loss.
- The repo governance and current project docs are now the stable source of execution truth.

Constraints preserved:
- Docs-only governance reconciliation.
- No app/source files.
- No visual assets.
- No MVP/prototype implementation.
- No art-direction change.
- No MVP gate completion.
- No staging or commit.

Owner:
- Operating-model decision: Batu
- Governance reconciliation: Codex
- Critical review and decision-support when requested: ChatGPT

Status:
- Active operating model / MVP-16B remains pending Batu review / no next implementation task approved

## 2026-05-28 - Visual Direction Approved And Phase 4 Completed

Decision:
- Batu approved the visual direction.
- Phase 4 Fictional-Safe Storefront Identity + UI Integration Proof is complete.
- The approved visual direction is Inked Indie / Compact Corner with fictional-safe storefront identity and integrated paper/card UI direction.
- Phase 4.5 Reusable-System Scalability Proof is accepted as supporting evidence that the direction appears promising as a reusable storefront system.
- Phase 4.5 does not approve production scalability, production buildability, production assets, production asset direction, production asset pipeline, app implementation, architecture, public interfaces, real-place cards, exact real-place representation, live data, CI, deployment, or package/build tooling.

Rationale:
- The Phase 4 proof supplied concrete high-fidelity raster evidence for fictional-safe identity and UI/world integration.
- The Phase 4.5 proof supplied concrete high-fidelity raster evidence that the visual language can be decomposed and recombined at small proof scale without immediately losing fidelity or fictional-safe identity.
- Batu's approval clears the visual-direction gate while preserving implementation, architecture, production asset, and truth/source gates.

Constraints preserved:
- No app/source/package/config/tooling/CI/deployment/public-interface changes.
- No architecture decisions.
- No production assets or production pipeline approval.
- No real-place cards, factual card copy, exact real facades, exact addresses, exact station geometry, or live data.
- Real-place placement and production representation remain subject to source verification and Batu approval.

Owner:
- Visual-direction approval: Batu
- Critique, decision-support framing, and next-brief authoring: ChatGPT
- Documentation alignment inside the current brief: Codex

Status:
- Visual direction approved / Phase 4 complete / Phase 4.5 supporting evidence complete / implementation and production gates remain blocked

## 2026-05-28 - Codex / ChatGPT / Batu Handoff Workflow Aligned

Decision:
- Adopted `docs/CURRENT_EXECUTION_BRIEF.md` as the canonical source for Codex's next executable task.
- Consolidated the operating loop in `AGENTS.md`: Codex produces an output packet, Batu brings the report and relevant artifacts to ChatGPT, ChatGPT critiques and writes or updates the current brief, Codex reads the brief, and Codex executes only that brief.
- Clarified that Codex must not infer, continue, or expand work from prior chat context when a current brief exists.
- Clarified authority boundaries:
  - Batu owns creative and product decisions.
  - ChatGPT owns critique, decision-support framing, and next-brief authoring.
  - Codex owns execution of the current brief only.
- Updated short references in process docs instead of duplicating the full workflow everywhere.
- Kept Phase 3.6 docs-only buildability/scalability planning as the next executable Codex task.

Rationale:
- The project now uses an explicit Baton pass between Codex execution and ChatGPT critique/briefing.
- `docs/CURRENT_EXECUTION_BRIEF.md` prevents Codex from advancing by momentum from prior chat, historical task trackers, or stale phase notes.
- The split preserves Batu's creative/product authority while keeping Codex focused on small, reviewable execution packets.

Constraints preserved:
- Docs-only.
- No app/source/package/config/tooling/CI/deployment/public-interface changes.
- No generated images.
- No production asset changes.
- No commit.
- No final visual-direction, production-buildability, implementation, real-place-card, or exact real-place-geometry approval.

Owner:
- Creative and product decisions: Batu
- Critique, decision support, and next-brief authoring: ChatGPT
- Current-brief execution and documentation alignment: Codex

Status:
- Active workflow / Phase 3.6 remains the current executable brief / no implementation approval

## 2026-05-27 - Phase 3.5 Production-System Proof Defined For Review

Decision:
- Defined `docs/visual-artifacts/phase-3-5-production-system-proof/README.md` as the Phase 3.5 production-system proof plan for the Inked Indie / Compact Corner direction.
- The proof plan documents facade module rules, storefront bay construction rules, signage types, awning/window/door/roll-gate variants, prop categories, marker/card rules, texture and linework rules, density limits, truth-handling rules, and constraints against exact real-place claims.
- The proof plan proposes 3 smaller derivative storefront examples: Narrow Fictional Service Bay, Two-Bay Fictional Retail Pair, and Symbolic Transit-Edge Micro Corner.
- No derivative visual artifacts were produced.
- The next Batu decision is whether this proposed proof is the right test for buildability and scalability.
- This decision does not approve final visual direction, production visual language, production assets, app implementation, architecture setup, package/build tooling, CI, deployment, public interfaces, real-place cards, exact real-place claims, or exact station geometry claims.

Rationale:
- Phase 3 passed as static style-frame gate evidence only.
- A single polished hero frame does not prove that the direction can be repeated as a production system.
- The next review should test repeatable construction rules and truth handling before any architecture or implementation gate opens.

Owner:
- Proof-plan review and any buildability/scalability judgment: Batu
- Proof-plan drafting, documentation sync, and guardrail preservation: Codex

Status:
- Phase 3.5 proof defined for Batu review / no buildability or scalability approval / no final visual approval / no implementation approval

## 2026-05-27 - Phase 3 Static Style Frame Approved As Gate Evidence Only

Decision:
- Batu approved `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/inked-indie-compact-corner-style-frame-revision-a.png` as Phase 3 static style-frame gate evidence only.
- The artifact proves that the Inked Indie / Compact Corner direction has promise as a visual direction for the MVP.
- The artifact does not prove that the direction can be built, scaled, systematized, or implemented.
- This approval does not approve final visual direction.
- This approval does not approve production visual language.
- This approval does not approve production assets.
- This approval does not approve app implementation, architecture setup, package/build tooling, CI, deployment, public interfaces, or real-place cards.
- The next approved batch is a production-system proof for the Inked Indie / Compact Corner direction.

Rationale:
- Revision A is the first high-fidelity raster PNG/JPG style-frame evidence that satisfies the Phase 3 artifact-format gate.
- Batu can use it as gate evidence that the direction is promising enough to test as a repeatable visual system.
- A single polished hero frame is not enough to prove production scalability, repeatable construction rules, derivative storefront handling, or implementation readiness.

Owner:
- Gate approval and future production-system judgment: Batu
- Decision recording, next-batch framing, and documentation alignment: Codex

Status:
- Phase 3 passed as static style-frame gate evidence only / production-system proof approved as next batch / no final visual approval / no implementation approval

## 2026-05-27 - Phase 3 Revision A Raster Style Frame Created

Decision:
- Revised the Phase 3 Inked Indie / Compact Corner artifact after adding the Visual Artifact Fidelity Gate.
- The previous SVG is superseded as the primary Phase 3 evidence because it satisfied the checklist but failed as visual-direction evidence: it read as a planning diagram, not a high-fidelity style frame.
- Created `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/inked-indie-compact-corner-style-frame-revision-a.png` as the primary Phase 3 review artifact.
- Updated the Phase 3 README, static style-frame spec, and self-audit to identify Revision A as the primary raster artifact.
- Revision A remains a review artifact only.
- Final visual direction remains unapproved.
- App implementation, package tooling, public interfaces, architecture, deployment, production assets, and real-place cards remain blocked.

Rationale:
- Phase 3 requires a high-fidelity raster PNG/JPG static style frame unless Batu explicitly requests SVG.
- The decision depends on line quality, texture, storefront personality, isometric map craft, UI/world integration, and emotional tone that cannot be proven by an SVG planning diagram.
- Revision A is intended to let Batu judge whether Inked Indie / Compact Corner passes Phase 3 visual-direction review.

Owner:
- Creative review and Phase 3 pass/fail decision: Batu
- Revision A raster artifact generation, documentation update, and self-audit: Codex

Status:
- Revision A raster generated / recommended for Batu Phase 3 pass review / no final visual approval / no implementation approval

## 2026-05-27 - Phase 3 Static Style Frame Production Approved And Review Artifact Created

Decision:
- Batu approved Phase 3 static style-frame production for one Inked Indie frame using Batch 16 `Option 1: Compact Corner Anchor`, as revised with the scored rubric and spatial blockout constraints.
- This approval is limited to producing one static review artifact.
- Created `docs/visual-artifacts/phase-3-static-style-frame-inked-indie-compact-corner/`.
- Created one SVG review artifact: `inked-indie-compact-corner-style-frame.svg`.
- Added `README.md`, `STATIC_STYLE_FRAME_SPEC.md`, `REVIEW_RUBRIC.md`, and `SELF_AUDIT.md`.
- The frame uses hybrid real-plus-placeholder representation.
- Peter Pan and Greenpoint Av G station are treated only as symbolic/exploratory anchors.
- Final visual direction remains unapproved.
- Static style-frame approval remains pending Batu review of the produced artifact.
- App implementation, real-place cards, production assets, public interfaces, architecture, package tooling, build tooling, CI, deployment, and real-place representation remain blocked.

Rationale:
- Batch 16 established a constrained, decision-grade gate package for one Inked Indie / Compact Corner Anchor static style frame.
- Batu approved only the production of that review artifact, not broader production or implementation.
- The produced artifact gives Batu concrete visual evidence to judge map readability, Inked Indie distinctiveness, UI/world hierarchy, truth handling, people/dog/bike/vehicle scale, and MVP usefulness.

Owner:
- Creative direction, static-frame review, and any Phase 3 exit approval: Batu
- Review artifact production, documentation, and self-audit: Codex

Status:
- Phase 3 review artifact generated / self-audited / Batu review pending / no final visual approval / no implementation approval

## 2026-05-27 - Inked Indie Selected As Lead Direction And Batch 16 Gate Brief Created

Decision:
- Batu selected Inked Indie Graphic Novel as the lead visual direction after reviewing Batch 15 Raster Production Proof.
- This is a lead-direction selection only. It is not final visual direction approval and not final production approval.
- Created `docs/visual-artifacts/batch-16-inked-indie-static-style-frame-gate/` as a docs-only planning and decision package.
- Batch 16 defines the proposed Phase 3 static style-frame target, Inked Indie style rules, three composition options, a decision rubric, and a recommended composition path.
- Codex recommends `Option 1: Compact Corner Anchor` as the strongest next composition path for one Phase 3 static style frame.
- Phase 3 Static Style Frame remains blocked until Batu explicitly approves static style-frame production.
- No final visual direction, production visual language, production assets, real-place cards, app implementation, public interfaces, module boundaries, package tooling, build tooling, CI, deployment, or real-place representation was approved.

Rationale:
- Batch 15 gave enough high-fidelity raster evidence for Batu to choose Inked Indie as the lead direction while preserving the distinction between lead-direction selection and final production approval.
- The next useful decision is not to implement or produce assets, but to decide whether one constrained Inked Indie static style frame should be produced under Phase 3.
- The Phase 2 hybrid real-plus-placeholder outcome still governs the next visual gate, so Peter Pan and the Greenpoint Av G station remain symbolic/exploratory anchors unless separately verified.

Owner:
- Creative direction, gate approval, and final visual approval: Batu
- Gate brief, composition options, recommendation, and documentation alignment: Codex

Status:
- Inked Indie lead direction selected / Batch 16 docs-only gate brief created / Phase 3 blocked pending explicit approval / no implementation approval

## 2026-05-27 - Batch 15 Raster Production Proof Generated

Decision:
- Generated exactly four high-fidelity raster proof images in `docs/visual-artifacts/batch-15-raster-production-proof/generated/`:
  - `II-assembled-mini-scene.png`;
  - `SP-assembled-mini-scene.png`;
  - `II-life-integration-crop.png`;
  - `SP-life-integration-crop.png`.
- Updated the Batch 15 README and artifact plan to reference the actual generated files.
- Added `REVIEW_GUIDE.md` and `SELF_AUDIT.md`.
- The four outputs are high-fidelity raster proofs visually comparable to Batch 13, not schematic SVG placeholders.
- The outputs provide decision-grade evidence for Batu to compare distinctiveness, scalability, people/dog/vehicle handling, UI/world integration, and MVP viability.
- The documentation does not select a final winner and does not approve final visual direction, production visual language, app implementation, public interfaces, module boundaries, package tooling, build tooling, CI, deployment, or real-place representation.

Rationale:
- Batch 14's SVGs failed the decision-grade bar because they required Batu to imagine missing raster fidelity.
- Batch 15 directly tests the production question in finished raster form: whether Inked Indie can preserve its authored richness under product-density pressure and whether Soft Pixel remains a safer scalable path without becoming generic.

Owner:
- Creative direction, tradeoff judgment, and final decision: Batu
- Raster evidence generation, review framing, and verification: Codex

Status:
- Generated raster evidence exists / ready for Batu review / no winner selected / no final visual approval / no implementation approval

## 2026-05-27 - Batch 14 SVG Audit Failed Decision-Grade Bar

Decision:
- Audited the six Batch 14 generated SVG artifacts against the decision-grade visual bar.
- Determined that Batu cannot make a real production scalability decision from the SVG artifacts without mentally imagining missing fidelity.
- Batch 14 preserves broad production-structure questions, but it does not preserve Batch 13 art-direction fidelity, raster texture, atmosphere, material richness, storefront detail, UI integration, or people/dog/vehicle finish.
- People, dogs, bikes/e-bikes, and vehicles are directionally map-scale, but simplified SVG symbols do not prove finished map-scale readability.
- The assembled mini-scenes are density diagrams, not visual peers of the Batch 13 hero/development frames.
- Batch 14 can support preliminary technical/cost hypotheses only. It is schematic/planning-grade, not decision-grade production scalability evidence.
- Created `docs/visual-artifacts/batch-15-raster-production-proof/` as the required follow-up plan for high-fidelity raster proof.
- No winner, final visual direction, production visual language, app implementation, public interfaces, module boundaries, package tooling, build tooling, CI, deployment, or real-place representation was approved.

Rationale:
- The original Batch 14 goal required decision-grade visual evidence. SVG placeholders make reuse logic visible, but avoid the central production-cost question: whether Batch 13-level finished art can be repeated without becoming too bespoke.
- Batu needs raster artifacts comparable to Batch 13 before deciding whether Inked Indie is worth the added production burden.

Owner:
- Creative direction and production tradeoff decision: Batu
- Audit, documentation correction, and Batch 15 planning: Codex

Status:
- Batch 14 downgraded to schematic/planning-grade evidence / Batch 15 raster proof planned / no final visual approval / no implementation approval

## 2026-05-27 - Batch 14 Production Scalability Visual Evidence Generated

Decision:
- Generated six SVG visual artifacts in `docs/visual-artifacts/batch-14-production-scalability-spike/generated/`.
- Generated artifacts:
  - `II-modular-storefront-sheet.svg`;
  - `SP-modular-storefront-sheet.svg`;
  - `II-life-motion-compatibility-sheet.svg`;
  - `SP-life-motion-compatibility-sheet.svg`;
  - `II-assembled-mini-scene.svg`;
  - `SP-assembled-mini-scene.svg`.
- Updated the Batch 14 README, matrices, decision rubric, and self-audit to reference the actual generated files.
- The generated evidence suggests Soft Pixel is more scalable and lower-cost, while Inked Indie remains visually viable but has materially higher production risk for MVP.
- This is evidence for Batu review only. No winner, final visual direction, production visual language, app implementation, public interfaces, module boundaries, package tooling, build tooling, CI, deployment, or real-place representation was approved.

Rationale:
- The docs-only Batch 14 plan needed concrete visual evidence before Batu could evaluate whether Inked Indie's distinctiveness justifies its added production burden.
- The generated sheets test storefront reuse, map-scale life elements, and assembled product density for both survivor directions.

Owner:
- Creative direction, tradeoff judgment, and decision whether Inked Indie continues: Batu
- Visual evidence generation, review framing, and verification: Codex

Status:
- Generated evidence exists / no winner selected / no final visual approval / no implementation approval

## 2026-05-27 - Batch 14 Production Scalability Spike Defined

Decision:
- Created `docs/visual-artifacts/batch-14-production-scalability-spike/` as a docs-only production scalability spike definition.
- The spike compares Inked Indie Graphic Novel and Soft Pixel Neighborhood Sim without deciding a winner.
- The test is structured to determine whether Inked Indie can scale into a repeatable production system for map-mode places, people, dogs, bikes, and vehicles without becoming too expensive or bespoke.
- Defined a modular asset test for both directions:
  - 6 storefront variants per direction;
  - 8 street props per direction;
  - 4 signage/flyer variants per direction;
  - 3 marker/card UI states per direction.
- Defined a future-life test for both directions at actual map scale:
  - 6 pedestrian figures;
  - 2 dogs;
  - 2 bikes/e-bikes;
  - 1 parked vehicle.
- Added production-cost and technical-feasibility matrices plus a decision rubric for future review.
- No visual artifact generation, final visual direction approval, production asset approval, app implementation, public interfaces, module boundaries, package tooling, build tooling, CI, or deployment were introduced.

Rationale:
- Batch 13 showed the two survivor directions under UI/world integration pressure.
- The next useful question is production scalability, especially whether Inked Indie's authored quality can justify its likely higher art-direction burden.
- Batu needs a fair, comparable test that exposes reuse, map-scale life compatibility, UI readability, and production cost before any direction advances toward a static style-frame path.

Owner:
- Creative direction, taste calls, and approval of whether to run the spike: Batu
- Spike definition, review framing, and documentation alignment: Codex

Status:
- Docs-only spike defined / no winner selected / no final visual approval / no implementation approval

## 2026-05-26 - Agentic Game-Dev Guardrails Integrated

Decision:
- Integrated selected agentic game-development practices as documentation guardrails only.
- Adopted now:
  - Creative authority model with Batu owning visual direction, taste calls, approvals, and tradeoff decisions.
  - Codex role clarity: propose, generate, critique, verify, and document without silently converting suggestions into decisions.
  - Small scoped batches with reviewable artifact entry/exit criteria, acceptance criteria, direct verification, and synchronized docs.
  - Visual validation ladder from references/moodboard through MVP implementation, with prose-only direction explicitly not decision-grade.
  - Future truth/data versus rendering separation for place facts, cards, markers, and stylized representation.
  - Modular diorama asset strategy and readability-first interaction principles.
  - Verification review checklist for docs, artifacts, scope, and truth/rendering consistency.
- Deferred:
  - Delight/funsies such as G-train rumble, flickering signs, flapping awnings, steam vents, flyer peel, dog walker, or stoop detail.
  - Parameterized storefronts, procedural helpers, pitch/GIF-style validation artifacts, object pooling, and performance tactics until later gates justify them.
- Rejected for current MVP scope:
  - Autonomous NPC memory/mood agents, avatars, interiors, quests, click-to-move, live data dependencies, Unreal/Godot/MCP engine workflows, world generation, and broad autonomous multi-agent game-creator workflows.
- Batch 13 may be cited only as current visual development evidence because the corresponding files exist; it is not final visual approval.
- No implementation gates were cleared.
- No app code, package tooling, generated assets, implementation scaffolding, public interfaces, architecture implementation, production visual assets, or real-place representation were approved.

Rationale:
- The recommendation included useful game-development discipline, but several ideas were premature or directly outside the map-mode MVP.
- The project benefits from stronger artifact validation, creative authority, modularity, readability, and verification language while preserving Batu's creative direction authority and the current preproduction gates.
- Location truth remains active and important, so rendering and UI planning must not blur verified place facts with stylized representation.

Owner:
- Creative direction, taste calls, scope approval, and tradeoff decisions: Batu
- Documentation integration, guardrail framing, verification, and audit discipline: Codex

Status:
- Integrated as docs-only guardrails / no visual approval / no implementation approval

## 2026-05-26 - Batch 13 Survivor Development Test Approved

Decision:
- Batu approved the next test step, not final visual direction approval.
- Soft Pixel Neighborhood Sim and Inked Indie Graphic Novel are selected for focused development testing.
- Xerox-Riso Street Zine, Tilt-Shift Toy Block Greenpoint, Civic Atlas Deluxe, and Weird Hyperlocal Magical Realism are not advancing as full directions.
- Limited accent borrowing is allowed:
  - Soft Pixel may borrow Civic Atlas clarity and a small amount of Xerox sticker/flyer texture.
  - Inked Indie may borrow Civic Atlas hierarchy and limited Xerox surface pressure.
- Created `docs/visual-artifacts/batch-13-survivor-direction-development/` as a planning and prompt package for the next generated development artifacts.
- Batch 13 will test UI/world integration, marker/card systems, style-system tiles, and production viability for the two survivor directions.
- Final visual direction, production visual language, app implementation, public interfaces, package tooling, build tooling, CI, deployment, and real-place representation remain blocked.

Rationale:
- Batch 11 produced six generated hero directions and enough visual evidence for survivor selection.
- The next useful question is not broader divergence; it is whether either survivor can become a usable visual system for the map-mode MVP.
- The development test must prove clickability, map readability, UI native-ness, local specificity, repeatability, and production survivability.

Owner:
- Creative direction, survivor selection, and final approval: Batu
- Development-batch planning, prompt preparation, and review framing: Codex

Status:
- Approved next test step / no final direction approved / no app implementation approved

## 2026-05-26 - Batch 11 Hero Frames Integrated For Direction Selection

Decision:
- Converted `docs/visual-artifacts/batch-11-radical-art-direction-concept-sprint/` from a prompt-ready concept sprint into a direction-selection review package.
- Integrated the six generated hero frames from `docs/visual-artifacts/batch-12-radical-hero-style-frames/` as the visual evidence for Batch 11 review.
- Created a frame index, comparison board, review guide, decision memo, self-critique, and next-batch brief.
- Updated the Batch 11 rubric, matrix, self-audit, README, and next-step note so they no longer describe the package as missing raster hero frames.
- Recommended two survivor directions for deeper development:
  - Soft Pixel Neighborhood Sim;
  - Inked Indie Graphic Novel.
- Parked Xerox-Riso Street Zine, Tilt-Shift Toy Block Greenpoint, Civic Atlas Deluxe, and Weird Hyperlocal Magical Realism as full directions for now, with limited accent-borrowing opportunities noted.
- Final visual direction, production visual language, UI system, static style-frame approval, real-place representation, app implementation, public interfaces, package tooling, build tooling, CI, and deployment remain blocked.

Rationale:
- The six hero frames resolved the previous blocker: Batu can now compare real visual evidence instead of prose-only territories.
- Soft Pixel Neighborhood Sim best supports immediate clickability, map readability, and MVP product fit.
- Inked Indie Graphic Novel best supports authored Greenpoint specificity, taste level, and local storefront character.
- The other four directions are valuable but currently show stronger risks: poster/collage over map usability, generic toy-town drift, overly restrained atlas polish, or fantasy/mood-art drift.

Next batch:
- Run a focused development batch for Batu-selected survivor directions, not another six-way divergence sprint.
- For each survivor, test one UI/world integration frame, one place-card / hover-state / marker integration frame, one style tile or visual system tile, and production viability notes.
- The next batch should learn whether UI overlays coexist with the world, whether the direction remains readable at map scale, and whether the style can become a repeatable system.

Owner:
- Creative direction, survivor selection, and final approval: Batu
- Review packaging, critique, and next-batch framing: Codex

Status:
- Review package prepared / survivor recommendation only / no direction approved

## 2026-05-26 - Return To Radical Art-Direction Concept Sprint

Decision:
- Rejected the recent three-direction visual artifact as non-decision-grade.
- Superseded the current three-direction visual batch with `batch-11-radical-art-direction-concept-sprint`.
- The next process returns to divergent art-direction exploration before any style approval.
- Batch 11 must define six concept territories: Soft Pixel Neighborhood Sim, Xerox-Riso Street Zine, Tilt-Shift Toy Block Greenpoint, Inked Indie Graphic Novel, Civic Atlas Deluxe, and Weird Hyperlocal Magical Realism.
- Batch 11 should produce concept territory briefs, image-generation prompt kits, a divergence matrix, a decision rubric, and a production plan for decision-grade raster/image style frames.
- Batch 11 must not produce another minor SVG comparison board.
- Final visual direction, static style-frame production, production visual assets, app code, public interfaces, architecture implementation, package tooling, build tooling, CI, and deployment remain blocked.

Rationale:
- The recent artifact showed insufficient divergence.
- The variants mostly changed palette, density, and iconography while reusing a base composition.
- The artifact risked confusing exterior map-mode browsing with interiors or venue scenes.
- Batu needs radically distinct visual-world hypotheses before approving any direction.

Owner:
- Creative direction and style approval: Batu
- Documentation process correction and next-batch framing: Codex

Status:
- Active process correction / no visual direction approved

## 2026-05-26 - Curated Isometric Reference Set Integrated As Directional Input

Decision:
- Integrated Batu's curated Image A-G isometric reference set into `docs/ART_DIRECTION.md`.
- Recorded the target visual thesis: "Greenpoint street-corner sim with Bushwick creative mess and HD pixel clarity."
- Structured the references by role, core/accent status, what to use, and what not to copy.
- Added weighted influence guidance:
  - 30% isometric camera / map readability;
  - 25% Greenpoint / NYC architectural specificity;
  - 25% Bushwick / Gen Z creative culture;
  - 10% pixel / retro charm;
  - 10% cinematic lighting / mood.
- Added translation rules and negative constraints so the set cannot be flattened into a generic isometric moodboard.
- Added a proposed docs/artifact-only style-frame batch to `docs/archive/governance/TASKS.md` requiring three concrete directions. This proposal was later superseded by `batch-11-radical-art-direction-concept-sprint`:
  - HD Pixel Storefront;
  - DIY Flyer Maximalist;
  - Clean Isometric Civic.
- The proposed batch requires visible artifacts with storefronts, curb/crosswalk geometry, sidewalk props, social cues, surface layering, and marker/card treatment. It cannot be satisfied by prose-only direction.
- Final visual direction, production art, static style-frame approval, public interfaces, app implementation, package tooling, build tooling, CI, and deployment remain blocked.

Rationale:
- Batu provided curated references with specific use and anti-copy instructions.
- The useful next step is to turn those references into decision-making artifacts while preserving Batu as creative director.
- Core influences must protect storefront readability, map clickability, Greenpoint/NYC specificity, and truth-safe composition.
- Accent influences should add warmth, surface culture, and HD pixel charm without causing graffiti overload, cyberpunk drift, fantasy architecture, Japanese typology, or pure retro nostalgia.

Owner:
- Creative direction, reference approval, and final visual decision: Batu
- Documentation translation and proposed artifact-batch framing: Codex

Status:
- Integrated as directional input / not final visual approval

## 2026-05-26 - Batch 9 Revision B Created

Decision:
- Created Batch 9 Revision B in `docs/visual-artifacts/batch-9-hybrid-composition-style-frame-revision-b/`.
- Revision B contains exactly two visual artifacts:
  - `balanced-plus-target.svg`;
  - `community-forward-stress-test.svg`.
- No quiet variant was produced for Revision B.
- Revision B accepts the same-base composition structure, truth-status system, Peter Pan plus G station symbolic-anchor logic, and hybrid placeholder strategy from Revision A.
- Revision B does not approve final visual direction, Revision A storefront specificity, Revision A UI/card hierarchy, or Revision A emotional-volume differentiation.
- Balanced-plus uses the current balanced composition as the base and increases storefront specificity, symbolic Peter Pan prominence, controlled Greenpoint street texture, and product-like marker/card hierarchy.
- Community-forward pushes DIY flyer, sticker, pixel, signage, visual layering, and marker/card assertiveness harder as an upper-bound stress test.
- Truth constraints remain unchanged: Peter Pan and G station are symbolic anchors only; other storefronts are fictionalized, placeholder, or unresolved; real-place cards and exact placement claims remain blocked.
- App implementation, public interfaces, package tooling, build tooling, CI, deployment, production visual assets, production placement, and final visual approval remain blocked.

Rationale:
- Batu accepted Revision A only as a partial pass, not a visual-direction approval.
- The next useful comparison is not another three-way emotional-volume set; it is a two-way decision between a plausible target direction and a sufficiently pushed community-forward upper bound.

Owner:
- Creative direction and review decision: Batu
- Revision B artifact production and documentation alignment: Codex

Status:
- Created / needs Batu review

## 2026-05-26 - Batch 9 Artifacts Revised For Decision Usefulness

Decision:
- Revised the Batch 9 visual-preproduction package because the first pass was too mechanically similar across variants.
- Kept exactly three variants: quiet, balanced, and community-forward.
- Preserved the same base hybrid slice across all three variants.
- Upgraded the drawing language with more storefront detail, street context, stronger symbolic Peter Pan anchoring, integrated symbolic Greenpoint Av G station treatment, and variant-specific marker/card hierarchy.
- Community-forward now intentionally stress-tests density through heavier signage, stickers, posters, markers, and card pressure.
- Quiet now tests calm documentary specificity rather than emptiness.
- Balanced now acts as the plausible target-direction test.
- All real-place cards, exact placement claims, production visual approval, app implementation, public interfaces, package tooling, build tooling, CI, and deployment remain blocked.

Rationale:
- Batu needs artifacts that can be chosen or rejected from the visual evidence itself.
- If variants differ mainly by color or require prose to imagine storefront/UI/detail differences, they do not support the needed creative decision.

Owner:
- Creative direction and review decision: Batu
- Revised artifact production and documentation alignment: Codex

Status:
- Revised / needs Batu review

## 2026-05-26 - Batch 9 Hybrid Composition Artifacts Created

Decision:
- Created a Batch 9 exploratory visual-preproduction package in `docs/visual-artifacts/batch-9-hybrid-composition-style-frame/`.
- The package contains exactly three comparable variants:
  - quiet;
  - balanced;
  - community-forward.
- All three variants use the same hybrid compact Peter Pan plus Greenpoint Av G station slice constraints.
- Peter Pan and the Greenpoint Av G station remain symbolic / exploratory anchors only.
- Other storefronts are placeholder, fictionalized, or unresolved.
- Real-place cards, final visual language, production placement, exact storefront geometry, exact station access geometry, app implementation, public interfaces, package tooling, build tooling, CI, and deployment remain blocked.

Rationale:
- Batu needs concrete visual artifacts to judge whether the hybrid slice still feels worth continuing after the Phase 2 truth gate selected a real-plus-placeholder composition.
- Holding the slice constant across three variants makes the review about emotional volume, marker/card hierarchy, signage density, and trust in the hybrid approach rather than three unrelated compositions.

Owner:
- Creative direction and review decision: Batu
- Artifact production and documentation alignment: Codex

Status:
- Created / needs Batu review

## 2026-05-26 - Phase 2 Gate Outcome Selected

Decision:
- Batu selected `hybrid real-plus-placeholder composition` as the Phase 2 / Batch 8.5 gate outcome.
- The Manhattan Ave / Greenpoint Ave slice is not verified enough to proceed as-is.
- Peter Pan Donut & Pastry Shop and Greenpoint Av G station may continue as symbolic / exploratory anchors only.
- Other businesses and storefronts in the compact slice must be treated as placeholders, fictionalized storefronts, omitted, or unresolved until manual verification clears them.
- Real-place cards are not approved.
- The next artifact is a static hybrid composition/style-frame brief, not app implementation.
- No React/Vite/Pixi setup, `package.json`, `src/`, build tooling, implementation scaffolding, production visual assets, or real-place card production is approved.

Rationale:
- Current evidence supports local mood and a promising compact slice, but not production-accurate storefront placement, real-place adjacency, or real-place cards.
- A hybrid composition lets visual preproduction continue without pretending unresolved businesses, storefront order, entrances, or station access points are verified.
- The next useful review artifact should let Batu judge composition, emotional volume, marker/card hierarchy, and whether the slice still feels worth continuing.

Owner:
- Gate outcome, creative direction, public representation approval: Batu
- Next-artifact brief and documentation alignment: Codex

Status:
- Approved Phase 2 gate outcome / implementation still blocked

## 2026-05-26 - Phase 2 Gate Review Tightened

Decision:
- Tightened Phase 2 / Batch 8.5 documentation as a decision gate, not an open-ended research bucket.
- Made the Phase 2 gate decision explicit:
  - proceed with the current slice as-is;
  - proceed with fewer verified real places;
  - use a hybrid real-plus-placeholder composition;
  - revise or expand the slice boundary;
  - pause visual advancement until manual verification is stronger.
- Confirmed current evidence does not support proceeding with the current slice as-is.
- Confirmed compact Peter Pan + G station visual work may continue only as symbolic / placeholder exploration until source-backed placement clears and Batu approves representation.
- Narrowed active blockers to the factual uncertainties around 718, 723/725, 726, 727 Manhattan Ave, exact Greenpoint Av G station access placement, Peter Pan / Sweetgreen storefront order, Captured storefront/entrance relationship, Polka Dot status, and Karczma / Brouwerij boundary relevance.
- Confirmed real-place cards, production placement, static style-frame production, final visual direction approval, React/Vite/Pixi setup, and app implementation remain blocked.

Rationale:
- The previous docs correctly described the gate but spread the actual decision and blocker list across several sections.
- Future work needs a clear Batu decision point before visual or implementation work can advance.

Owner:
- Gate outcome, creative direction, and public representation approval: Batu
- Documentation cleanup and feasibility framing: Codex

Status:
- Active orientation / no gate changes / no implementation approval

## 2026-05-26 - Documentation Audit Cleanup Implemented

Decision:
- Implemented the P1 documentation audit cleanup as orientation and state-alignment only.
- Clarified Batch 8B as the latest exploratory visual-preproduction package, not an active gate or production placement source.
- Clarified Phase 2 / Batch 8.5 as the current active required gate.
- Confirmed Batch 8.5 remains active and uncleared, with findings still needing Batu review.
- Confirmed no gates were loosened and no visual direction was approved.

Rationale:
- The docs needed tighter current-state language after the audit so future agents do not treat Batch 8B as approved, Batch 8.5 as merely future/proposed, or the conceptual place schema as an implementation interface.

Owner:
- Project direction and gate approval: Batu
- Documentation state alignment: Codex

Status:
- Active orientation / no gate changes

## 2026-05-26 - Project Phase Roadmap Added

Decision:
- Added a high-level project phase roadmap to `docs/PLAN.md`.
- Added compact phase orientation to `docs/archive/governance/TASKS.md`.
- Clarified that Phase 1 Visual Preproduction started but is paused / partially blocked pending Location & Representational Truth Feasibility.
- Confirmed Phase 2 / Batch 8.5 is the current active required gate.
- Confirmed static style frame, architecture, React/Vite/Pixi, and app implementation remain blocked.

Rationale:
- Batu needs an orientation layer that shows how the current batch fits into the larger multi-phase path without turning that path into a new implementation plan.
- Visual preproduction produced exploratory artifacts, but it has not exited and should not be described as complete while truth constraints remain unresolved.

Owner:
- Project direction and gate approval: Batu
- Documentation orientation: Codex

Status:
- Active orientation / no gate changes

## 2026-05-26 - Batch 8.5B Parcel And Adjacency Review Needs Manual Follow-Up

Decision:
- Compact Peter Pan + G station composition may continue only as symbolic/placeholder visual exploration unless Batch 8.5B clears enough production placement facts.
- Real-place placement and real-place cards remain blocked until parcel, storefront, side-of-street, and adjacency checks are resolved.
- Greenpoint Av G station is source-reviewed as an intersection-level transit anchor, but exact stair and elevator drawing remains manual-review-required.
- Peter Pan, Sweetgreen, and the former Meserole Theater / 723-725 Manhattan Ave are promising symbolic anchors, but production storefront placement remains blocked by unresolved facade, frontage, and footprint details.
- Captured Record Shop remains an address-backed active candidate, but its storefront/basement/entrance relationship must be manually reviewed before visual representation.
- Karczma and Brouwerij Lane require a slice-boundary decision before inclusion in the compact frame.
- Polka Dot remains unresolved and blocked as an active business representation unless its current status is manually verified.
- Batch 8.5 remains uncleared.

Rationale:
- The 8.5B source pass found enough evidence to keep exploring the compact Peter Pan + G station frame symbolically, but not enough to support production placement or real-place cards.
- Reviewed sources support several addresses and parcel identifiers, but official city parcel interfaces were not fully readable in this environment.
- Storefront order, side-of-street depiction, exact station access points, and business status conflicts remain public-representation risks.

Owner:
- Public representation, slice approval, and manual overrides: Batu
- Documentation and source-review framing: Codex

Status:
- Proposed / review needed

## 2026-05-26 - Location Truth Feasibility Gate Proposed

Decision:
- Location and representational truth must be promoted to a formal preproduction gate.
- Batch 8.5 must prove whether the Manhattan Ave / Greenpoint Ave slice can accurately support real businesses, buildings, addresses, and source-backed place cards before static style-frame approval, final visual direction approval, React/Vite/Pixi implementation, production visual assets, or real-place card production.
- Batch 8.5 permits parallel exploratory visual work only when it is clearly labeled and does not make unresolved real-world truth claims.
- Exploratory work may test mood, palette, marker/card hierarchy, emotional volume, symbolic storefronts, and composition studies with explicitly marked unresolved geography.
- Final visual direction approval, static style-frame production approval, production visual assets, real-place cards, and claims about accurate real-world relationships remain blocked until Batch 8.5 clears.
- Spatial coherence now has concrete allowed/not-allowed rules: authored projection, scale, symbolic details, and clearly labeled placeholders may be approximate, but wrong-street placement, wrong-side-of-intersection placement, false adjacency, unsupported card facts, and active-status claims for closed/unknown businesses are blocked without explicit Batu approval.
- Slice revision is an acceptable outcome of feasibility review, not a failure.
- Cannoneyed Isometric NYC is a required structural reference for density, abstraction, compression, and representational tradeoffs, not a style source.
- Git/version-control setup is a future implementation guardrail before app implementation or production asset work.
- Codex may propose source policies, conceptual schemas, and feasibility findings.
- Codex must not silently resolve ambiguous real-world truth with guesses.
- Uncertainty must be documented as unresolved, placeholder, omitted, or manual-review-required.
- Batu owns approval of public representation, manual overrides, visual direction, product direction, and any decision to proceed with real-place production.

Rationale:
- The current plan accounted for source-backed places, static local place data, source URLs, `lastVerified` dates, and truthful placement rules.
- It did not yet require feasibility proof before visual/style-frame advancement.
- Treating location truth as a later implementation or QA concern risks approving a visual direction around a fake or unsupported map substrate.
- Visual exploration can continue during feasibility only if it remains honest about unresolved geography.
- The project needs a path to revise or replace the first slice if the intended density cannot be represented truthfully.
- A structural reference can help frame isometric abstraction tradeoffs without approving a copied visual direction.
- Verification commands need actual repository metadata before implementation maturity.

Required artifacts:
- `docs/reference/DATA_FEASIBILITY.md`
- `docs/reference/PLACE_SOURCE_POLICY.md`
- `docs/reference/PLACE_SCHEMA.md`
- `docs/archive/governance/TASKS.md` update
- `docs/PLAN.md` update

Acceptance criteria:
- 6-10 candidate places/buildings from the Manhattan Ave / Greenpoint Ave slice are evaluated before the gate is cleared.
- Each candidate has an address, source notes, verification status, and placement confidence.
- No business is placed on the wrong street.
- No false adjacency is introduced.
- Any uncertain placement is marked unresolved until manual review or omission.
- The project can decide whether to proceed as-is, proceed with fewer verified real places, use hybrid placeholders, revise or expand the boundary, or pause for stronger manual verification.

Valid slice outcomes:
- Proceed with the current slice as-is.
- Proceed with fewer verified real places.
- Use a hybrid real-plus-placeholder composition.
- Revise or expand the slice boundary.
- Pause visual advancement until manual verification is stronger.

Owner:
- Creative direction and public representation: Batu
- Documentation and feasibility framing: Codex

Status:
- Proposed / needs Batu approval

## 2026-05-26 - Governance Hardening Batch Approved

Decision:
- Governance hardening is approved as a docs-only batch.
- `AGENTS.md` becomes the primary repo-level operating contract for Codex and other coding agents.
- `docs/PLAN.md` becomes the primary current-state project plan.
- `docs/IMPLEMENTATION_PLAN.md` is superseded by `docs/PLAN.md` for current project state and retained only for historical context.
- No final visual direction is approved.
- No implementation may begin until visual and architecture gates are cleared.

Rationale:
- The project needs a compact source of truth before feature development continues.
- Future agents need explicit authority boundaries, visual approval gates, small-batch rules, and implementation preflight requirements.
- Current-state planning should be separated from historical planning notes to reduce drift.

Alternatives considered:
- Continue using the existing implementation plan as the current plan.
- Keep governance rules distributed across existing docs.

Rejected because:
- The existing implementation plan is stale relative to the Batch 7 state.
- Distributed governance makes it easier for future agents to miss gates or treat unapproved directions as approved.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Approved / active

## 2026-05-26 - Batch 13 Survivor Development Images Generated

Decision:
- Generate the six approved Batch 13 survivor-direction development images from `docs/visual-artifacts/batch-13-survivor-direction-development/PROMPT_MANIFEST.md`.
- Save the new Batch 13 outputs in `docs/visual-artifacts/batch-13-survivor-direction-development/generated/`:
  - `SP-A-ui-world-integration.png`
  - `SP-B-place-card-marker-hover-state.png`
  - `SP-C-style-system-tile.png`
  - `II-A-ui-world-integration.png`
  - `II-B-place-card-marker-hover-state.png`
  - `II-C-style-system-tile.png`
- Keep the Batch 12 survivor hero frames as references only, not new Batch 13 outputs.
- Update the Batch 13 review docs to reference the actual generated files and add a generated-output self-critique.
- Do not approve final visual direction, production assets, app implementation, public interfaces, or architecture boundaries.

Rationale:
- The batch tests whether Soft Pixel Neighborhood Sim and Inked Indie Graphic Novel can support map-mode UI, hover/selected states, place-card behavior, and repeatable visual-system elements.
- The generated images provide product-usefulness evidence rather than only mood evidence.
- The outputs are decision-grade for survivor review, with caveats around over-literal generated labels, controls, and legends.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Generated / needs Batu review

## 2026-05-26 - Batch 8B Higher-Fidelity Style-Frame Test Created

Decision:
- Batu directed a new Batch 8B package because Batch 8 was useful as intent scaffolding but did not meet the fidelity threshold required for creative-direction feedback.
- Codex created a higher-fidelity docs-only visual-preproduction package in `docs/visual-artifacts/batch-8b-community-pixel-storefront-style-frame-test/`.
- The package uses the compact Peter Pan + G station composition only.
- The package compares three controlled emotional-volume variants:
  - Quiet storefront-led.
  - Balanced warm.
  - Community-forward.
- The package includes:
  - `README.md`
  - `REVIEW_GUIDE.md`
  - `REFERENCE_LOG.md`
  - `reference-board.html`
  - three source style-frame variants
  - exported PNG review artifacts
  - a comparison board PNG
- Batch 8 remains preserved and explicitly unapproved.
- Community Pixel Storefront remains a test path only, not an approved final visual direction.
- Final visual direction remains unapproved.
- Static style-frame production remains blocked.
- React/Vite/Pixi implementation remains blocked.

Rationale:
- Batch 8 answered intent and composition questions at a rough level, but it was not visually reliable enough for creative-direction judgment.
- Batu asked for decision artifacts with enough fidelity to judge emotional volume, marker/card plausibility, and storefront/world leadership from the visuals alone.
- The compact Peter Pan + G station composition keeps the test focused and avoids false-adjacency pressure from Karczma.
- Separating the reference board from the style frames keeps the sourcing visible without contaminating the actual decision images.
- Flattened, explicit-color source assets avoid the Batch 8 palette-rendering bug.

Questions answered:
- Batch 8 should not be treated as approved direction.
- The next useful test should be higher fidelity, not broader scope.
- The first decision should be made on the compact Peter Pan + G station composition only.
- Emotional volume should be compared through tightly controlled variants instead of changing composition at the same time.
- Actual Greenpoint and OCCII references should be visible in the package and logged explicitly.

Remaining approvals:
- Batu reviews the three Batch 8B variants.
- Batu decides which emotional-volume direction, if any, best balances Greenpoint specificity and community warmth.
- Batu decides whether the marker/card system feels believable and not too gamey.
- Batu decides whether Community Pixel Storefront is viable for a later proposed static style-frame production pass.
- Static style-frame production remains blocked until Batu explicitly approves visual direction and composition.

Alternatives considered:
- Treat Batch 8 Balanced hybrid as sufficient for creative-direction review.
- Move directly to final static style-frame production.
- Reopen Karczma-in-frame testing during the same batch.
- Start React/Vite/Pixi implementation.

Rejected because:
- Batch 8 lacked the fidelity needed for the decision being asked.
- Final production art would still be premature before Batu chooses a direction from visible options.
- Reintroducing Karczma would mix geography stress-testing into a batch meant to isolate emotional volume.
- React/Vite/Pixi remains blocked until an approved static style frame exists.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Created / needs Batu review

## 2026-05-26 - Tighten MVP To One Authored Scene

Decision:
- The MVP is a desktop/tablet-primary interactive diorama, not a full map product or game system.
- Scope is limited to one authored scene with pan, zoom, pointer/tap feedback, clickable hotspots, and place cards.

Rationale:
- The prototype should prove visual distinctiveness, local specificity, and click-worthiness before investing in larger systems.

Alternatives considered:
- Broader neighborhood map.
- Avatar walk mode.
- Event, NPC, interior, notebook, and quest systems.

Rejected because:
- These would force the prototype to prove too many things at once and risk a generic or unfinished result.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Approved

## 2026-05-26 - Use Greenpoint DIY Sim As Proposed Visual Thesis

Decision:
- The proposed visual thesis is Greenpoint DIY Sim: Greenpoint-native architecture and street texture with chunky, playful, flyer-influenced UI treatment.

Rationale:
- This balances local specificity with expressive interaction energy.
- It avoids both generic Bushwick chaos and overly tasteful documentary realism.

Alternatives considered:
- Pure Greenpoint realism.
- Bushwick / Gen Z creative overlay as the dominant world style.
- Generic late-90s isometric game homage.

Rejected because:
- Pure realism may feel too dry.
- Pure creative overlay may lose Greenpoint specificity.
- Generic nostalgia risks becoming an isometric toy rather than a local diorama.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed

## 2026-05-26 - Start With Docs And Static Style Frame Before App

Decision:
- The project starts with documentation and a static style-frame plan before any React/Pixi app implementation.

Rationale:
- Visual taste is the product risk.
- Building systems before approving the visual language can lock weak art direction into code.

Alternatives considered:
- Start immediately with the PixiJS prototype.
- Build a generic clickable map first and style it later.

Rejected because:
- Both approaches would bias the project toward technical output before proving the visual world.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Approved

## 2026-05-26 - First Geography Anchor

Decision:
- The first scene is proposed around Manhattan Ave / Greenpoint Ave, anchored by Peter Pan Donuts, Karczma, and the Greenpoint Ave G station.

Rationale:
- This area provides recognizable Greenpoint identity, transit orientation, food/retail texture, and a compact intersection logic.

Alternatives considered:
- Franklin / India.
- Franklin / Greenpoint.
- A larger multi-block district.

Rejected because:
- Franklin / India would shift away from the chosen anchors.
- Franklin / Greenpoint may require more invented filler.
- A larger district would dilute polish.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Approved for planning; final scene composition still requires style-frame approval

## 2026-05-26 - Batch 2 Visual Territories Proposed

Decision:
- Codex proposed three visual territories under the Greenpoint DIY Sim thesis:
  - Storefront Sticker Diorama.
  - Corner Flyer Overprint.
  - Civic Pixel Miniature.
- Codex recommends Storefront Sticker Diorama for the MVP.

Rationale:
- The project needs sharper visual pre-production before any static style-frame production.
- Distinct territories make the creative decision explicit instead of letting visual language drift during implementation.
- Storefront Sticker Diorama best balances Greenpoint specificity, DIY energy, screenshot appeal, and MVP restraint.

Alternatives considered:
- Keep one broad Greenpoint DIY Sim direction.
- Move directly into static style-frame production.
- Start the React/Pixi app and style later.

Rejected because:
- One broad direction leaves too much visual ambiguity.
- Producing a style frame before territory approval violates the human-led creative protocol.
- Starting code first risks making a generic isometric toy before proving taste.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed

## 2026-05-26 - Batch 2 Approval Gates Proposed

Decision:
- Phase 2 static style-frame production may begin only after:
  - OCCII flyer is visually inspected by Codex or explicitly waived by Batu.
  - Batu approves one visual territory.
  - Batu approves the static style-frame composition.
  - Composition/style approval is supported by at least one lo-fi exploratory visual artifact or reference board.

Rationale:
- The OCCII flyer is the strongest stated mood reference and remains uninspected in the current workspace context.
- Visual territory approval protects Batu's creative ownership.
- Composition approval prevents premature production art with the wrong geography, anchors, or framing.
- Lo-fi visual material makes taste feedback concrete before polished style-frame work begins.

Alternatives considered:
- Proceed using only the written flyer description.
- Let Codex pick the recommended visual territory.
- Combine territory approval and composition approval into one implicit step.
- Approve visual direction from prose-only territory descriptions.

Rejected because:
- The protocol says Batu owns final taste decisions.
- The flyer may contain important visual information not captured in text.
- Separate gates reduce drift before production begins.
- Visual approval from prose alone can hide mismatched assumptions.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed

## 2026-05-26 - Open Creative Questions

Decision:
- The following questions remain open before style-frame production:
  - Which visual territory does Batu approve, if any?
  - Should Territory A, B, or C be revised before approval?
  - Should the OCCII flyer be reattached for visual inspection, or explicitly waived?
  - Should the first static composition include Karczma in the same frame, or hold it if truthful street placement makes the scene too wide?
  - How loud should the UI layer be in the first frame: subtle marker, medium sticker language, or bold flyer-card presence?
  - Should the first frame represent morning bakery energy, neutral daytime, or slightly late-afternoon neighborhood warmth?

Rationale:
- These choices materially affect visual production and should be made by Batu before Codex creates imagery.

Alternatives considered:
- Codex chooses defaults and proceeds.

Rejected because:
- These are taste and composition decisions, not implementation-only decisions.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed / needs Batu input

## 2026-05-26 - Unresolved Reference Gaps

Decision:
- The OCCII community drinks flyer is still unavailable for direct visual inspection in the workspace context.
- Current docs rely only on Batu's written description of that flyer.

Rationale:
- The flyer is a direct mood reference for chunky pixel fonts, plumbob-adjacent cues, isometric simulation energy, and warm DIY community-event feeling.
- Without seeing it, Codex can preserve the described qualities but cannot responsibly extract exact visual lessons.

Alternatives considered:
- Treat the written description as sufficient.
- Replace the flyer with adjacent web references.

Rejected because:
- The prompt identifies this flyer as the direct mood reference.
- Adjacent references may push the project away from Batu's actual taste target.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Reattach or waive before Phase 2

## 2026-05-26 - Visual Approval Requires Visual Artifacts

Decision:
- Meaningful visual approvals cannot rely on prose alone when a rough visual artifact can clarify the choice.
- Codex must provide lo-fi exploratory visual material before asking Batu to approve visual direction, composition, palette, UI marker/card language, or other meaningful taste decisions.
- Acceptable artifacts include rough mockups, reference boards, style tiles, palette strips, annotated sketches, UI marker/card samples, blockout compositions, and quick throwaway prototypes.
- These artifacts must be labeled "lo-fi / exploratory / not final."

Rationale:
- Taste decisions need visible material.
- Rough artifacts reduce ambiguity, expose mismatches earlier, and prevent visual drift.
- Disposable visual aids help Batu give concrete feedback without treating them as final production art.

Alternatives considered:
- Prose-only approval.
- Jumping straight to a polished static style frame.
- Codex choosing visual defaults and proceeding.

Rejected because:
- Prose-only approval hides visual ambiguity.
- A polished style frame is too expensive to use as the first visible decision aid.
- Codex must not make autonomous final visual language decisions.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Approved by Batu / active protocol

## 2026-05-26 - Batch 4 Territory A Lo-Fi Artifact Package Created

Decision:
- Codex created a lo-fi exploratory artifact package for evaluating Territory A: Storefront Sticker Diorama.
- Artifacts are stored in `docs/visual-artifacts/batch-4/`.
- The package includes:
  - `composition-blockout.svg`
  - `style-tile.svg`
  - `ui-sample-board.svg`
  - `README.md`

Rationale:
- Batu clarified that meaningful visual choices require visual material, not prose-only approval.
- Territory A needs visible tests for composition, world/UI balance, sign/storefront treatment, and medium sticker UI loudness before static style-frame production.

Questions answered:
- Lo-fi artifacts are allowed before the final static style frame if labeled "lo-fi / exploratory / not final."
- Territory A can be evaluated through disposable SVG blockouts without initializing React/Pixi.
- Karczma remains conditional: include it only if street composition stays truthful.
- Medium sticker UI can be evaluated visually against too-subtle and too-loud alternatives.

Remaining approvals:
- Batu must choose whether Territory A remains the working direction, needs revision, or should be replaced.
- Batu must choose composition Option A or Option B, or request a revised blockout.
- Batu must choose a hotspot marker direction or request alternatives.
- Batu must confirm whether medium sticker UI is the right loudness.
- OCCII flyer remains required before final static style-frame production unless Batu explicitly waives it.
- Static style-frame production remains blocked until Batu approves composition/style.
- React/Pixi implementation remains blocked until the approved static style frame exists.

Alternatives considered:
- Ask Batu to approve Territory A from prose only.
- Produce a polished static style frame directly.
- Initialize a React/Pixi prototype and test visuals in-app.

Rejected because:
- Prose-only approval violates the current visual-artifact protocol.
- A polished static frame would be premature before visible rough choices are reviewed.
- React/Pixi remains blocked until the approved static style frame exists.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed / needs Batu review

## 2026-05-26 - Batch 5 Creative Research Moodboard Package Created

Decision:
- Codex created a broader creative research moodboard package before any visual territory approval.
- Artifacts are stored in `docs/visual-artifacts/batch-5-moodboard/`.
- The package includes:
  - `MOODBOARD.md`
  - `moodboard.html`
  - `DIRECTION_SYNTHESIS.md`
- Territory A / Storefront Sticker Diorama is paused as a working hypothesis, not an approved direction.
- Final visual territory approval is blocked pending Batu's moodboard review.

Rationale:
- Batu clarified that Batch 4 was useful scaffolding but pushed toward a visual direction too early.
- The project needs broader external creative research before narrowing.
- Visual language decisions should be grounded in actual reference material and visible contrast, not just prose or internally invented mocks.

OCCII flyer status:
- Visually inspected from `/Users/batusayici/Desktop/OCCII Visual Reference.png`.
- Key observed traits:
  - Chunky white/navy event typography.
  - Isometric late-90s/early-2000s sim interior energy.
  - Community/social invitation.
  - Green attention markers.
  - Bold flyer hierarchy.
- OCCII should remain one important reference, not the only north star.

Questions answered:
- Territory A should not be approved yet.
- Moodboard review must happen before revising or selecting the final visual direction.
- External references should include sim/tycoon readability, pixel density, DIY print language, local storefront texture, and map-adjacent UI systems.
- React/Pixi remains blocked.
- Final static style-frame production remains blocked.

Revised directions proposed for Batu reaction:
- Community Sim Storefront.
- Printed Neighborhood Toy.
- Civic Pixel Guide.

Remaining approvals:
- Batu reviews the moodboard clusters.
- Batu reacts to the revised directions before any one direction is approved.
- Batu decides whether OCCII should remain a strong reference, a light accent, or a reference to move away from.
- Batu decides whether the next batch should revise the moodboard, create more lo-fi direction boards, or prepare a static style-frame brief.

Alternatives considered:
- Continue toward approving Territory A.
- Produce the static style frame from Batch 4.
- Start the React/Pixi prototype.

Rejected because:
- Territory A was too abstract and internally invented.
- Static style-frame production would be premature before broader research review.
- React/Pixi remains blocked until the approved static style frame exists.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed / needs Batu review

## 2026-05-26 - Batch 6 Moodboard Review Package Created

Decision:
- Codex created a decision-ready critique package for the Batch 5 moodboard.
- Artifact is stored at `docs/visual-artifacts/batch-6-moodboard-review/MOODBOARD_REVIEW.md`.
- No visual direction is approved.
- Territory A / Storefront Sticker Diorama remains paused as a working hypothesis.
- Final visual territory approval remains blocked pending Batu review of the critique package.

Rationale:
- Batu needs a sharper read on the moodboard before deciding what direction to explore next.
- The critique package identifies strongest references, references to reject or use cautiously, repeated visual patterns, unresolved tensions, and implications for world detail, UI loudness, saturation, line weight, texture, signage, charm, realism, and map clarity.
- The decision matrix compares Community Sim Storefront, Printed Neighborhood Toy, and Civic Pixel Guide without treating the scores as final taste decisions.

Recommendation from Codex:
- Do not approve a final direction yet.
- Next path should merge Community Sim Storefront and Civic Pixel Guide into a sharper hybrid test path called Community Pixel Storefront.
- Next visual artifacts should compare style tile variants, UI marker/card experiments, and palette studies.

Remaining approvals:
- Batu reviews `MOODBOARD_REVIEW.md`.
- Batu decides whether to test the Community Pixel Storefront hybrid, request more moodboard references, or ask for comparison artifacts for a different direction.
- Static style-frame production remains blocked.
- React/Pixi implementation remains blocked until the approved static style frame exists.

Alternatives considered:
- Approve Community Sim Storefront directly.
- Approve Civic Pixel Guide directly.
- Continue with Territory A from Batch 4.
- Move to static style-frame production.

Rejected because:
- The visual direction is still unresolved.
- Batu asked not to treat any direction as approved.
- The biggest unresolved tension is emotional/OCCII volume versus map/storefront clarity, which should be tested visibly before approval.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed / needs Batu review

## 2026-05-26 - Batch 7 Community Pixel Storefront Hybrid Tests Created

Decision:
- Batu approved Community Pixel Storefront only as the next test path, not as a final visual direction.
- Codex created lo-fi exploratory hybrid style-test artifacts in `docs/visual-artifacts/batch-7-hybrid-style-tests/`.
- The package includes:
  - `README.md`
  - `style-tile-variants.svg`
  - `ui-marker-card-experiments.svg`
  - `palette-studies.svg`
- Final visual direction remains unapproved.
- Static style-frame production remains blocked.
- React/Vite/Pixi implementation remains blocked.

Rationale:
- Community Pixel Storefront lets the project test the productive tension from Batch 6:
  - Emotional warmth, social invitation, and chunky UI confidence from Community Sim Storefront / OCCII.
  - Clarity, restraint, and factual-place discipline from Civic Pixel Guide.
  - Only light sticker tactility / print imperfection from Printed Neighborhood Toy.
- Batu asked to focus on visual language before layout or composition blockouts.

Questions answered:
- Printed Neighborhood Toy should not be the dominant direction.
- Batch 7 should test style tile variants, UI marker/card hierarchy, and palette studies.
- Composition blockouts should wait unless needed for style tile context.
- These artifacts are lo-fi / exploratory / not final.

Remaining approvals:
- Batu reviews A. Community-heavy, B. Balanced hybrid, and C. Civic-heavy.
- Batu chooses whether the next pass should favor community energy, balanced hybrid, or civic restraint.
- Batu reacts to green attention marker options and confirms whether any marker feels too character/social-system-like.
- Batu chooses whether the place card should be factual, community flyer, or hybrid.
- Batu chooses or rejects the palette direction.
- Final visual direction remains blocked pending Batu review of these style tests.

Codex read:
- Strongest current variant is B. Balanced hybrid.
- Biggest tradeoff is emotional warmth versus factual/map clarity.

Alternatives considered:
- Move directly to composition blockouts.
- Approve Community Sim Storefront as final direction.
- Approve Civic Pixel Guide as final direction.
- Start React/Vite/Pixi implementation.

Rejected because:
- Batu approved only the test path, not a final direction.
- The current unresolved issue is visual language volume, not layout.
- React/Vite/Pixi remains blocked until the approved static style frame exists.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Proposed / needs Batu review

## 2026-05-26 - Batch 8 Context Visual Tests Created

Decision:
- Batu approved execution of a lo-fi exploratory Batch 8 visual package for Community Pixel Storefront context testing.
- Codex created visual decision aids in `docs/visual-artifacts/batch-8-community-pixel-storefront-context-tests/`.
- The package includes:
  - `README.md`
  - `REVIEW_GUIDE.md`
  - `mini-composition-tests.svg`
  - `applied-style-tiles.svg`
  - `marker-card-in-context.svg`
  - `palette-application-studies.svg`
- Community Pixel Storefront remains a test path only, not an approved final visual direction.
- Final visual direction remains unapproved.
- Static style-frame production remains blocked.
- React/Vite/Pixi implementation remains blocked.

Rationale:
- Batch 7 tested visual-language volume in isolation; Batch 8 tests the strongest read, Balanced hybrid, in small storefront/sidewalk context.
- The package compares compact Peter Pan + G station composition against a Karczma-included stress test without treating Karczma as approved for the first frame.
- The artifacts test whether storefront/place clarity can remain dominant while OCCII/community energy appears only in markers, labels, cards, and selective accents.

Questions answered:
- Batch 8 should use concrete scene fragments rather than abstract swatches alone.
- Balanced hybrid is the default test emphasis, not an approved style.
- Marker/card hierarchy should be tested in context before static style-frame briefing.
- Palette studies should be applied to the same tiny storefront fragment.

Remaining approvals:
- Batu reviews the Batch 8 package.
- Batu decides whether Balanced hybrid should continue, become warmer, become quieter, or be replaced.
- Batu decides whether the green marker is usable, needs revision, or should be replaced.
- Batu decides whether the hybrid card direction has the right volume.
- Batu decides whether the first static composition should stay compact with Peter Pan + G station or keep testing Karczma only if spatial truthfulness holds.
- Static style-frame production remains blocked until Batu approves visual direction and composition.

Alternatives considered:
- Move directly to a static style frame.
- Treat Batch 7 Balanced hybrid as approved.
- Start React/Vite/Pixi implementation.

Rejected because:
- No final visual direction is approved.
- Batch 7 produced isolated style tests, not an in-context proof.
- React/Vite/Pixi remains blocked until an approved static style frame exists.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Created / needs Batu review

## 2026-05-26 - Minimal Agentic Tooling Governance Approved

Decision:
- Adopt a docs-only agentic tooling policy before further Batch 8 visual work.
- Create `docs/AGENTIC_TOOLING.md` as the detailed tooling policy.
- Add compact skills/plugins governance to `AGENTS.md`.
- Update `docs/PLAN.md` and `docs/archive/governance/TASKS.md` so tooling is a governed preproduction support layer, not a creative, product, architecture, or public-interface authority layer.
- Do not create project-specific Codex skills or install plugins in this batch.
- Pause further Batch 8 visual execution, review follow-up, or next-pass planning until Batu approves this tooling plan.

Rationale:
- The project benefits from clearer guidance on how agents may use tools without drifting into creative or product authority.
- Docs-first tooling avoids plugin sprawl and prevents skills from becoming premature process machinery.
- Batu remains the owner of creative direction, product direction, public module/interface approval, final visual language, architecture boundaries, and scope changes.
- The repo already contains Batch 8 artifacts and records; the honest reconciliation is to preserve those files and pause further Batch 8 work pending tooling approval.

Adopted now:
- `docs/AGENTIC_TOOLING.md`.
- Compact `AGENTS.md` skills/plugins governance.
- Tightened `docs/PLAN.md` agentic tooling strategy.
- Updated `docs/archive/governance/TASKS.md` current-batch tracker.
- This decision-log entry.

Deferred:
- `visual-direction-review`, `design-decision-log`, and `greenpoint-reference-discipline` skills remain optional future preproduction candidates only.
- `isometric-map-implementation` skill.
- `frontend-game-prototype-qa` skill.
- GitHub PR review setup.
- GitHub Actions / CircleCI.
- Render.
- Remotion.
- Superpowers.
- CodeRabbit.
- Broad plugin stack installation.

Alternatives considered:
- Create preproduction skills immediately.
- Install or configure a broader plugin stack.
- Treat Batch 8 review as the next active task without resolving tooling governance.

Rejected because:
- Existing docs and Plan Mode may be enough without new skills.
- Tooling should not create pressure toward implementation or autonomous creative decisions.
- Batch 8 state needs a clear pause point before further visual work resumes.

Owner:
- Creative direction: Batu
- Implementation: Codex

Status:
- Approved / active
