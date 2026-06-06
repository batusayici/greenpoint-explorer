# Current Execution Brief - Phase 4B Batch 4B-6R Corridor Frame And Endpoint Cue Correction Review Gate

Status: `Batch 4B-6R: Corridor frame and endpoint cue correction` has cleared Batu visual review with result: CONDITIONAL PASS. No post-4B-6R batch is authorized.

Current executable batch: none.

Proposed next batch for Batu review: `Batch 4C-1: Recognizable facade cue planning`.

Pre-authorized queue: none.

Hard Batu review gate: cleared for 4B-6R; next gate pending Batu approval of any later batch.

Self-advance allowed: no. Codex must stop because the pre-authorized queue is empty and no next executable batch is authorized.

4B-6R was a corrective runtime/docs batch only. The implementation improved the existing 4B runtime's corridor frame, endpoint cues, camera legibility, building rhythm cues, and selected-object inspector visibility using the already-approved source-backed manifest/runtime data. It did not expand source data, promote new claims, add assets, change package dependencies, or self-advance beyond the 4B-6R review gate. Conditional follow-up: M-to-F and F-to-M cameras remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope.

Owner boundary: Batu owns creative/product/scope approval, public-interface approval, architecture-boundary approval, source-authority decisions, production/public claims, visual acceptance, facade imagery approval, exact geometry/frontage/entrance approval, business verification approval, Phase 4B gate movement, and any later MVP gates.

## Proposed Next Step For Batu Review

Recommended next batch: `Batch 4C-1: Recognizable facade cue planning`.

Recommendation:

- Choose 4C-1 recognizable facade cue planning before additional runtime tuning or storefront-anchor contract work.
- Reason: 4B now proves deterministic source-backed massing and interaction, but local recognizability remains limited by the absence of safe facade/corridor identity cues. Planning the smallest safe cue layer clarifies what evidence, fixture fields, manual review gates, and blocked claims are needed before any visual or business overlay can responsibly render.
- Why not 4B-7 now: M-to-F and F-to-M camera tuning is useful but already recorded as a conditional follow-up, and the 4B-6R proof cleared visual review with CONDITIONAL PASS. Camera tuning should stay as a later narrow runtime batch only if Batu prioritizes it.
- Why not storefront anchor contract now: storefront/business anchoring still depends on frontage/facade evidence that does not exist yet. Defining anchor attachment before the recognizable facade cue plan risks over-specifying business semantics ahead of visual/source readiness.

Proposed scope:

- Define the smallest safe step from deterministic graybox toward recognizable corridor identity.
- Identify allowed inputs for facade/corridor identity cue planning, such as Batu-supplied or Batu-approved reference material, existing source-backed geometry context, manual review notes, and explicit status fields.
- Identify blocked claims that must remain blocked, including exact facade appearance, storefront order, tenant frontage, entrance placement, signage, exact address placement, business identity, active-business status, production/public readiness, and raster readiness.
- Define required fixture/status fields for future planning only, such as cue type, source/evidence reference, status, confidence, target building or side reference, manual reviewer, and blocked-claim notes.
- Define visual review entry/exit criteria for any later implementation batch without authorizing implementation.

Explicit non-scope:

- No runtime changes.
- No camera tuning.
- No source fixture expansion.
- No manifest schema changes.
- No business data overlay.
- No storefront-anchor implementation.
- No external APIs, scraping, or source acquisition.
- No art-direction pass, generated assets, textures, facade art, signage, windows, doors, or production visual assets.
- No dependency changes.

Acceptance criteria for the proposal:

- Batu can decide whether 4C-1 should open as a planning batch, be revised, or be replaced by 4B-7 camera tuning.
- The proposal preserves the existing 4B deterministic runtime proof and blocked-claim discipline.
- The proposal names a hard Batu approval gate before any implementation, source expansion, visual direction, public-interface, architecture, or business semantics work.

Stop gate:

- Stop for Batu review. `Batch 4C-1: Recognizable facade cue planning` is proposed only; it is not executable until Batu updates this brief or the pre-authorized queue.

## Current State

Docs authority routing:

- `docs/DOCS_INDEX.md`
- `docs/phase-4-execution-roadmap.md`

Phase 4 primary operational roadmap:

- `docs/phase-4-execution-roadmap.md`

Supporting detail docs:

- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/phase-3-closeout.md`

The Phase 3D review matte, app surface, screenshot evidence, reference inventory, self-audit, and evidence inventory remain preserved as review-only/non-production evidence. Sourced geometry remains provenance/layout underlay. Truth-state overlays remain QA/provenance overlays, not the primary visual deliverable.

Brouwerij/business/frontage/facade/entrance/signage/active-status/exact-storefront/exact-address claims remain blocked unless separately authorized through evidence gates.

## Current Gate

Name: `Batch 4B-6R: Corridor frame and endpoint cue correction conditional pass`

Execution state:

- Current executable batch: none.
- Pre-authorized queue: none.
- Hard Batu review gate: cleared for 4B-6R; next gate pending Batu approval of any later batch.
- Self-advance allowed: no.

Execution rule:

- 4B-6 has been reviewed by Batu with result: Partial pass.
- 4B-6R cleared Batu visual review with result: CONDITIONAL PASS.
- There are no pre-authorized queued batches after 4B-6R.
- Use `docs/phase-4-execution-roadmap.md` as the operating plan.
- Preserve the existing React + Vite + Three.js runtime boundary.
- Stop after committing the approved current 4B stack; no later batch is open.
- Do not self-advance into anchor semantics, facade semantics, storefront work, business verification, art direction, source expansion, Phase 4C, 4B-7, or any post-4B-6R work.

Purpose:

- Make the existing source-backed graybox read more clearly as a navigable Greenpoint Ave street corridor, even with QA mode off.
- Strengthen the corridor path hierarchy, endpoint direction, two-sided street-wall rhythm, camera preset usefulness, and selected-object identity visibility.
- Preserve deterministic rendering, semantic-ID interaction, invisible pick targets, QA/provenance visibility, blocked-claim visibility, and truthful source-backed/context labeling.

## 4B-6 Review Finding

Batu's visual review result for 4B-6: Partial pass.

4B-6 works as a technical QA foundation:

- Current 4B-6 UI loads at the active preview server.
- QA mode works.
- Left/right coloring works.
- Camera presets work.
- Review panel counts are correct: 144 semantic objects, 142 primitive buildings, 140 source-backed buildings, and 63 / 77 side counts.
- Click selection exposes semantic ID, source record, side, provenance, blocked claims, and approximate dimensions.
- No browser console errors were observed during review.

Observed 4B-6 defects to correct:

- Corridor is spatially legible as two-sided source-backed massing, but not yet recognizable enough as a corridor place.
- Manhattan-to-Franklin and Franklin-to-Manhattan presets compress buildings into narrow abstract walls.
- Building masses read like continuous walls instead of block-by-block street edges.
- Endpoint/intersection/cross-street cues are too weak.
- Corridor walk path exists but is visually quiet and overwhelmed by massing.
- Selected-object identity is partly buried when the inspector panel is scrolled.

## Required Inputs

- Existing source fixture and verifier from 4B-2.
- Existing 4B-3 primitive compiler and generated semantic scene manifest path.
- Existing Phase 3B NYC/Open geometry context fixture referenced by the source fixture/manifest.
- Existing 4B-4/4B-4R/4B-5/4B-6 React + Vite + Three.js runtime files.

## Authorized 4B-6R Scope

4B-6R may:

- Strengthen corridor path hierarchy in normal mode and QA mode using the existing runtime style and current manifest/runtime data.
- Add lightweight in-scene Manhattan Ave and Franklin Ave endpoint cues.
- Add cross-street or block-break cues only if they are derivable from existing manifest/fixture/runtime data.
- Add block/building rhythm cues using existing source-backed object boundaries, spacing, edge outlines, base pads, ground ticks, or separators.
- Refine Manhattan-to-Franklin, Franklin-to-Manhattan, overhead, and oblique camera presets if needed.
- Improve selected-object inspector visibility so selected semantic ID, source record, side, role, and approximate dimensions are immediately visible after click.
- Update docs to mark 4B-6 as Partial pass, document 4B-6R as the corrective runtime/docs batch, define corrected review criteria, and stop at the 4B-6R review gate.

## Runtime And Package Boundary

- The existing React + Vite app shell remains the app/build layer.
- The existing minimal `three` dependency remains the only authorized 3D renderer.
- Three.js remains authorized only as the renderer inside the existing React + Vite shell.
- 4B-6R does not authorize new package dependencies.
- React Three Fiber, Drei, Cesium, Mapbox, deck.gl, physics engines, ECS frameworks, GLB/glTF pipelines, backend services, CMS, persistence, analytics, routing systems, deployment tooling, and broad map systems are not authorized.

## Explicit Non-Authorization

4B-6R does not authorize:

- New source data.
- Source fixture changes unless a blocking defect is found, explicitly documented, and narrowly justified.
- Generated manifest changes unless a blocking defect is found, explicitly documented, and narrowly justified.
- Compiler redesign.
- Business verification.
- POI enrichment.
- New APIs.
- Scraping.
- LiveXYZ, Foursquare, or local-directory calls.
- Storefront segmentation.
- Business cards.
- Active-business claims.
- Exact storefront, entrance, facade, signage, or address placement claims.
- Anchor semantics or facade semantics.
- Facade detail.
- Windows, doors, or signage.
- Art-direction pass.
- GLB/glTF assets.
- Raster assets.
- Generated imagery.
- Stock assets.
- Production visual assets.
- React Three Fiber, Drei, Cesium, Mapbox, deck.gl.
- Backend, CMS, persistence, analytics, routing, deployment, or broad map systems.
- Generic procedural city generation.
- Random generation.
- Infinite wrapping.
- Phase 4C.
- Self-advancing to 4B-7 or any post-4B-6R batch.

## Claim Discipline

- NYC/Open geometry may support source-backed contextual building massing and corridor-side QA labels when the approved fixture/compiler/runtime path preserves provenance and claim status.
- NYC/Open geometry does not prove tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Storefront anchoring and business-to-storefront matching remain first-class unresolved Phase 4 problems.
- Business/place facts must remain semantic data and must not be baked into image pixels.
- Endpoint markers, path emphasis, side labels, building rhythm cues, camera presets, and visual guides must be framed as deterministic graybox review affordances, not sourced/exact curb, sidewalk, frontage, facade, address, business, or landmark truth.

## Stop Conditions

Stop and report before:

- Moving beyond 4B-6R, because the pre-authorized queue is empty.
- Opening 4B-7, Phase 4C, anchor semantics, facade semantics, storefront work, business verification, art direction, source expansion, or any later batch without Batu approval and an updated current brief/queue.
- Adding or broadening source data unless a blocking defect is found and narrowly justified.
- Changing the source fixture or generated manifest without a documented blocking defect.
- Adding package dependencies without explicit Batu approval and an updated current brief/queue.
- Adding business verification, POI enrichment, APIs, scraping, external imagery, raster/generative/stock assets, GLB/glTF assets, routing, deployment, backend/CMS/persistence/analytics, or broad map systems.
- Calling Foursquare, LiveXYZ, local-directory sources, or another business/POI API.
- Inventing building footprints, parcels, tenant frontage, storefront anchors, entrances, facade appearance, exact address placement, business identity, business active status, cross-streets, landmarks, or unsupported endpoint claims.
- Treating QA overlays, endpoint markers, labels, camera presets, path cues, block rhythm cues, or visual guides as sourced/exact geometry beyond their documented source status.
- Treating NYC/Open geometry as proof of tenant frontage, storefront order, entrance placement, facade appearance, active-business status, exact address placement, or raster readiness.
- Adding production/public readiness, full-neighborhood scope, dynamic spatial streaming, PostGIS, broad map systems, or full 3D runtime architecture.
- Self-advancing beyond 4B-6R.

## Execution Queue Template

Use this template for future execution-control updates:

```markdown
Current executable batch:

- [batch name]

Pre-authorized queue:

1. [optional next batch]
2. [optional next batch]

Hard review gate:

- [where Codex must stop]

Self-advance allowed:

- yes/no

Stop conditions:

- [list]
```

Queue rules:

- Codex may implement the current executable batch.
- Codex may self-open and execute the next queued batch only when the prior batch completed within scope, required verification passed or failures are documented as non-blocking, docs are updated to mark the prior batch complete, the next batch is already listed in the pre-authorized queue, and no hard Batu review gate intervenes.
- Codex must never invent a new batch, rename a batch, expand scope, skip a batch, or continue past a hard Batu review gate.
- Codex must stop and return results when the current batch says "stop at review gate", visual review by Batu is required, product/strategy judgment is required, source expansion is proposed, business verification is proposed, facade/storefront semantics are proposed for the first time, art direction is proposed, package/dependency addition is proposed, or the next step is not already in the pre-authorized queue.

## Required Acceptance Criteria For 4B-6R

- With QA mode off, the corridor path and endpoint direction are visibly understandable.
- With QA mode on, side assignment, path, endpoints, and object identity are easier to inspect.
- Oblique view shows a readable two-sided corridor with path hierarchy and building rhythm.
- Manhattan-to-Franklin and Franklin-to-Manhattan views no longer collapse into an unreadable extrusion band.
- Overhead confirms corridor alignment and side coverage.
- Selected-object details are immediately legible after click.
- Existing manifest/source-backed counts remain consistent unless a justified defect is found and documented.
- Preview remains interactive: pan, rotate, zoom, hover, and click still work.
- No new source data, scraping, APIs, business verification, assets, art-direction pass, broad map system, or post-4B-6R work occurs.
- Docs stop at a 4B-6R review gate and do not open 4B-7.

## Batu Review Gate For 4B-6R

Batu should inspect visually:

- Whether the corridor path is readable in normal mode without relying on QA colors.
- Whether Manhattan Ave and Franklin Ave endpoint direction is understandable from the scene itself.
- Whether building masses read as a two-sided corridor with block/building rhythm rather than one continuous extrusion canyon.
- Whether Manhattan-to-Franklin, Franklin-to-Manhattan, overhead, and oblique camera presets support quick corridor review.
- Whether clicked selected-object identity remains immediately visible and tied to semantic/source IDs.
- Whether QA mode makes side assignment, path, endpoints, and object identity easier to inspect without promoting unsupported claims.

Pass means:

- Batu can use the graybox preview to judge corridor recognizability without mentally reconstructing path, endpoint direction, side rhythm, or source identity.
- The correction improves runtime legibility while staying visibly graybox/source-backed.
- Blocked storefront/business/facade/address claims remain clearly blocked.

Fail means:

- The corridor still reads as an abstract wall of masses rather than a navigable spatial corridor.
- Directional camera presets still collapse the scene into unreadable extrusion bands.
- Endpoint direction, side rhythm, semantic identity, source record, or blocked-claim status remains hard to inspect.
- The proof appears to imply final architecture, storefronts, facades, businesses, signage, exact addresses, or production art.

Known acceptable limitations:

- Buildings remain primitive source-backed graybox extrusions.
- QA guide geometry is deterministic review guidance, not exact curb, sidewalk, frontage, facade, cross-street, or survey geometry.
- Storefront anchors remain `blocked_no_candidates`; no business cards or storefront/facade semantics are expected.
- Screenshot automation is not required; manual browser review remains acceptable unless existing repo tooling already supports screenshots.

## Verification Expectations For 4B-6R

- `git status --short` before implementation.
- `node scripts/verify-phase-4b-source-fixture.mjs`.
- `node scripts/compile-phase-4b-scene-manifest.mjs --check`.
- `npm run build` (the existing large-chunk warning from Three.js/runtime bundle size is acceptable).
- Browser smoke on a fresh/current localhost preview: app loads, corridor path and endpoint cues render, camera presets work, QA/debug affordances are separable, click inspection resolves semantic IDs, QA/provenance updates, blocked claims remain visible, and coverage/side status remains visible.
- `git diff --check`.
- `git diff --stat`.
- `git status --short` after implementation.
