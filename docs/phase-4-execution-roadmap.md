# Phase 4 Execution Roadmap

Status: Primary Phase 4 operational roadmap
Date: 2026-06-05
Scope: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Objective

Phase 4 moves the project toward this production-shaped path:

```text
real spatial/business data
-> normalized source truth
-> deterministic scene compiler
-> semantic manifest
-> style/asset rules
-> interactive browser runtime
```

The compiler and semantic manifest are the center. Blender is an asset foundry/offline renderer, not a layout source. For the completed 4B-4 runtime manifest preview, completed 4B-4R legibility revision, completed 4B-5 context coverage expansion, completed 4B-6 recognizability QA batch, and Batu-reviewed 4B-6R corridor frame correction batch with CONDITIONAL PASS, the existing React + Vite app shell remains the app/build layer, and the minimal `three` dependency is used only as the renderer inside that shell. React Three Fiber, Drei, Cesium, Mapbox, deck.gl, GLB/glTF pipelines, backend/CMS/persistence/analytics, deployment tooling, broad map systems, reference imagery, splats, and world-model outputs are not authorized for 4B-4, 4B-4R, 4B-5, 4B-6, or 4B-6R. Batch 4C-1 was docs-only planning. Batch 4C-2 completed geometry-only cue fixture/verifier/runtime QA overlay work. Batch 4C-4 completed a bounded QA-mode/manual-draft/non-factual recognizable facade slice using existing building geometry for placement only. Batch 4C-5 tuned that same slice for street feel, still QA-only and non-factual, and was committed as `eaf3418`. Batch 4D-1 completed a review-only geometry validation/gap report and QA confidence visibility for existing 4B/4C geometry. Batch 4D-2 completed the claim ladder/matching contract in `docs/phase-4d-claim-ladder-matching-contract.md`. 4C-4/4C-5 proved the QA-only fictional facade lane, but that lane is now closed for generic tuning. The next proposed direction is candidate POI enrichment only after Batu review, with facade imagery, storefront anchors, and asset registry/visual-system work still blocked.

The first visual proof after the primitive compiler must validate the actual 3D architecture: a deterministic, navigable, interactive graybox/isometric corridor scene generated from source geometry and the semantic manifest. It must not be a static image, 2D map, raster composition, hand-arranged illustration, or manifest-only artifact.

## Batch Plan

Agents must execute only the current batch named in `docs/CURRENT_EXECUTION_BRIEF.md` or the next batch already named in that brief's pre-authorized queue. This roadmap is the operating plan for the current/queued named batches, not permission to invent or skip later batches. Codex may update `docs/CURRENT_EXECUTION_BRIEF.md` and related execution docs to move from a completed current batch into the next queued batch only when the completed batch stayed within scope, required verification passed or failures are documented as non-blocking, the next batch is already listed in the pre-authorized queue, and no hard Batu review gate intervenes. At every hard Batu review gate, agents must stop for review and may continue only after explicit Batu approval or an updated current brief/queue names the next batch.

## Phase 4 Operating Model

Approval governs boundaries, not every action.

Batu approval defines the active work packet, allowed scope, hard stop conditions, truth gates, verification expectations, commit behavior, and final review gate. A bounded packet may contain one to four small sequential batches, should name allowed files or areas where possible, and must define explicit stop conditions.

Inside an approved bounded packet, Codex may self-advance through explicitly authorized steps only when the prior batch is clean and verified. Codex should proceed without re-asking for approval when a change is geometry-only, deterministic, verified, and inside the packet, or when a change is QA-only, status-labeled, non-factual, verified, and inside the packet. Codex must stop when a boundary, truth gate, verification failure, dirty-tree issue, unresolved ambiguity, or packet-end review gate is hit.

Truth gates remain strict: no real business/storefront/tenant/facade/frontage/entrance/signage claims without approved evidence, no source expansion without approval, and no claim-level escalation without approval. Codex must not self-open new packets, new phases, or new claim classes.

Commit-after-batch behavior is allowed only when the packet explicitly says so, only allowed files changed, verification passes, final status is clean except intended changes, and the commit message clearly names the batch.

QA mode may move faster than evidence-backed production layers: it may contain draft, non-factual, status-labeled approximations such as `manual_draft`, `fictional_safe`, or `not_verified`. Normal mode must remain protected.

Every implementation packet should produce visible scene progress, data/fixture progress, interaction/review progress, verifier/report progress, or deploy/review progress. Pure governance or docs-only updates should happen only when explicitly requested or when a next pointer/gate must be updated. After implementation, update only the brief, ledger, roadmap, and next pointer as needed; avoid broad rewrites and docs-only reconciliation loops.

| Batch | Expected outcome | Success criteria | Must not change | Verification | Commit boundary | Stop / decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| 4A-1: Workflow spike setup | Ready-to-run spike checklist for the Manhattan-to-Franklin corridor. | Corridor target, three lanes, required inputs, evaluation criteria, source/reference constraints, and evidence outputs are clear. | No source fixtures, schemas, compiler scripts, runtime changes, assets, package/tooling, or public interfaces. | `git status --short`, `git diff --check`, markdown/link sanity if available. | Docs-only commit. | Stop if required source/reference inputs are unclear or if a lane needs external access, licensing approval, or Batu decision. |
| 4A-2: Deterministic compiler lane assessment | Lane assessment for source geometry -> primitive massing/manifest feasibility. | Minimal source fixture requirements, stable ID needs, semantic interaction support, storefront-anchor risks, and implementation complexity are known. | No full compiler, generated manifest, source fixture, schema file, runtime refactor, or production architecture unless separately approved. | Markdown sanity; parse/check source samples only if an approved existing sample is read, not created. | Docs-only assessment commit. | Stop before implementation or if fixture/schema boundaries require approval. |
| 4A-3: 3D map/export shortcut assessment | Lane assessment for 3D Mapper or similar export tools. | IDs, editability, licensing, GLB usefulness, semantic structure, runtime usefulness, and source-truth limits are understood. | No canonical export adoption, GLB production asset, runtime loader, package/tooling, or broad import. | Markdown sanity; record evidence/source notes only. | Docs-only assessment commit. | Stop if tool terms, export rights, or ID/structure claims are uncertain. |
| 4A-4: Reality-capture/reference lane assessment | Lane assessment for reference photos, Google Photorealistic 3D Tiles, Marble/world-model outputs, splats, or photo-to-3D. | Recognizability benefit is weighed against canonical-data, licensing, storage, and runtime risk. | No stored restricted imagery, texture extraction, canonical splats/world models, training input, runtime capture path, or production facade evidence. | Markdown sanity; usage-policy notes if reviewed. | Docs-only assessment commit. | Stop before storing/reusing restricted reference material or treating capture output as truth. |
| 4A-5: Decision gate | Phase 4A decision note and completed matrix. | Core lane, reference/acceleration lanes, rejected/deferred lanes, smallest Phase 4B proof, and required approvals are decided. | No Phase 4B implementation, runtime work, schema/compiler/source fixture creation, asset files, or public interfaces. | Markdown sanity; `git diff --check`; no build unless runtime files changed, which this batch should avoid. | Decision-doc commit. | Stop for Batu approval before Phase 4B implementation. |
| 4B-1: Contract foundation | Lean planning contracts for source fixture, scene manifest, storefront anchors, stable IDs, manual overrides, style recipe, and asset registry. | Contracts are short, coherent, and implementation-ready without becoming doc sprawl. | No runtime code, compiler code, generated manifests, package/tooling, broad data model, or asset production. | Markdown sanity; schema parse only if schema files are explicitly approved and created. | Contract-doc commit. | Stop if public interfaces, module boundaries, or schema ownership need approval. |
| 4B-2: Minimal source fixture + verifier | One corridor source fixture and verifier, only after approval. | Required metadata, IDs, geometry presence, source traceability, and blocked claims validate. | No compiler, runtime changes, asset files, broad ingestion, live APIs, scraping, or unapproved source storage. | JSON/schema parse, verifier, determinism/hash checks, `git diff --check`. | Fixture/verifier commit. | Stop if source rights, cache/storage, attribution, or fixture shape are unresolved. |
| 4B-3: Primitive compiler | Minimal Python compiler, only after approval. | Source fixture compiles into semantic scene manifest with deterministic IDs, primitive massing, storefront anchor candidates, confidence levels, and explicit overrides. | No runtime preview, art asset library, production renderer, broad compiler architecture, live data, or visual-proof substitution. | Compiler determinism check, generated manifest validation, source metadata checks, `git diff --check`. | Compiler/generated-output commit. | Stop if generated manifest becomes a public/runtime interface without approval; 4B-3 alone is not a visual proof. |
| 4B-4: Runtime manifest preview | Deterministic interactive 3D graybox/isometric browser corridor scene. Complete pending Batu review. | Runtime loads manifest and referenced geometry fixture, renders source-derived primitive massing and corridor/context lines, supports constrained pan/zoom/orbit/home camera, exposes semantic object IDs, keeps hover/click hooks routed through invisible pick targets tied to semantic IDs, and keeps QA/provenance/blocked-claim states inspectable. | No static-only image, 2D map, raster composition, manually arranged scene, over-styling, polished hover/card visual language, production renderer, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, GLB/glTF pipelines/assets, exact facade/frontage/storefront-order claims without evidence, asset library buildout, production assets, business verification, new data sources, scraping, API calls, generic procedural city generation, infinite wrapping, public/deployment work, or business facts baked into images. | Source fixture verifier, compiler determinism check, frontend build, browser smoke, 3D camera interaction QA, semantic ID inspection, manifest validation, `git diff --check`. | Runtime-preview commit. | Stop at the 4B-4 decision gate; do not self-advance to 4B-5. Stop earlier if runtime boundary, public interface, visual styling, source-claim promotion, or package/tooling scope expands beyond minimal Three.js inside the existing React + Vite shell. |
| 4B-4R: Runtime preview legibility pass | Narrow revision to the existing 4B-4 runtime. Batu-reviewed and approved as complete pending final repo verification. | Initial framing shows corridor, building masses, and their relationship; centerline/context lines no longer dominate; footprint/base outlines and simple street-edge/corridor-guide QA cues improve placement/orientation; hover/click feedback is obvious in-scene; compact legend and lighter QA panel preserve provenance and blocked-claim visibility. | No new source data, source fixtures, generated manifests, compiler redesign, package dependencies, APIs, scraping, business verification, invented storefronts/entrances/facades/signage/active status/address placement, business cards, full art direction, raster/generated/stock/production assets, GLB/glTF assets, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, backend/CMS/persistence/analytics/routing/deployment, generic procedural city generation, random generation, infinite wrapping, or self-advancing to 4B-5. | Source fixture verifier, compiler determinism check, frontend build, browser smoke for initial legibility, camera controls, hover/click feedback, QA/provenance update, blocked state visibility, `git diff --check`. | Runtime-legibility revision commit. | Stop at the 4B-4R decision gate; do not self-advance to 4B-5 without Batu approval. |
| 4B-5: Context building coverage expansion | Broader source-backed graybox corridor context from eligible approved geometry fixture records. Batu-reviewed and accepted for purposes of opening 4B-6. | Runtime renders 142 primitive building massing objects, including 140 source-backed contextual promotions from approved geometry fixture records; every rendered building remains inspectable by semantic ID/source record/geometry reference/provenance/allowed and blocked claims; coverage status and left/right corridor side counts remain visible; corridor coverage reflects source geometry instead of invention. | No business verification, POI enrichment, APIs, scraping, LiveXYZ/Foursquare/local-directory calls, storefront segmentation, business cards, active-business claims, exact storefront/entrance/facade/signage/address claims, facade detail, windows/doors/signage, art-direction pass, GLB/glTF/raster/generated/stock/production assets, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, backend/CMS/persistence/analytics/routing/deployment, broad map systems, generic procedural city generation, random generation, infinite wrapping, or self-advancing beyond 4B-5. | Source fixture verifier, compiler determinism check, frontend build, browser smoke for expanded massing, camera controls, semantic hover/click inspection, QA/provenance update, blocked-claim visibility, coverage/gap status, `git diff --check`. | Context-coverage expansion commit. | 4B-5 stop gate satisfied for opening 4B-6 only; no post-4B-6 work is open. |
| 4B-6: Graybox corridor recognizability QA | Deterministic review/debug affordances for judging whether the expanded graybox corridor is spatially legible and recognizable. Batu-reviewed with result: Partial pass. | Preview remains interactive; QA/debug mode is separable from normal preview; camera presets support corridor review; click inspection makes building identity, side, source record, approximate dimensions, and role legible; review panel reports semantic object/building/source-backed/left-right counts; existing manifest anchor status remains visible without promoting storefront or business claims. Partial-pass defect: corridor QA tools work, but the scene still needs stronger path hierarchy, endpoint cues, building rhythm, camera framing, and selected-object identity visibility. | No new source data, source fixture/generated manifest changes, screenshot tooling dependencies, APIs, scraping, business verification, POI enrichment, storefront segmentation, business cards, active-business claims, exact storefront/entrance/facade/signage/address claims, anchor/facade semantics beyond reporting existing manifest anchor status, facade detail, windows/doors/signage, art-direction pass, GLB/glTF/raster/generated/stock/production assets, React Three Fiber, Drei, Cesium, Mapbox, deck.gl, backend/CMS/persistence/analytics/routing/deployment, broad map systems, generic procedural city generation, random generation, infinite wrapping, or self-advancing beyond 4B-6. | Source fixture verifier, compiler determinism check, frontend build, browser smoke for camera presets, QA/debug separation, semantic identity/side inspection, review panel counts, blocked-claim visibility, manual review steps documented, `git diff --check`. | Runtime-QA affordance commit. | 4B-6 stop gate satisfied with Partial pass; Batu approved opening the narrow 4B-6R correction batch only. |
| 4B-6R: Corridor frame and endpoint cue correction | Corrective runtime/docs batch to make the existing source-backed graybox read more clearly as a navigable Greenpoint Ave corridor before any storefront/facade/art/business work. Batu-reviewed with result: CONDITIONAL PASS. | With QA off, corridor path and endpoint direction are visibly understandable; with QA on, side assignment, path, endpoints, and object identity are easier to inspect; oblique shows a readable two-sided corridor with path hierarchy and building rhythm; M-to-F and F-to-M no longer collapse into unreadable extrusion bands but remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope; overhead confirms corridor alignment and side coverage; selected-object details are immediately legible after click; counts remain consistent unless a justified defect is found and documented. | No new source data, scraping, APIs, business verification, facade/storefront/anchor semantics, art-direction pass, new assets, broad map system, package dependencies without explicit authorization, source expansion, Phase 4C, or self-advancing beyond 4B-6R. | Source fixture verifier, compiler determinism check, frontend build, browser smoke for path/endpoint cues, camera presets, QA separation, selected identity visibility, counts, blocked-claim visibility, `git diff --check`. | Current Phase 4B stack commit. | 4B-6R cleared visual review with CONDITIONAL PASS; pre-authorized queue is empty, so do not open 4B-7, anchor semantics, facade semantics, storefront work, business verification, art direction, source expansion, or Phase 4C. |
| 4C-1: Recognizable facade cue planning | Docs-only plan for the smallest truth-safe path from deterministic graybox corridor massing toward recognizable corridor identity. Complete. | Defines geometry-only cues, evidence-approved cues, forbidden claims, allowed inputs, fixture requirements, landmark/special-treatment handling, business/storefront anchor dependency order, manual review gates, deferred work, and acceptance criteria for a later implementation batch. | No runtime changes, camera tuning, source fixture expansion, generated manifest changes, business/place overlays, storefront anchors, source acquisition, external APIs, scraping, capture workflow, generated assets, dependency changes, art-direction pass, production assets, or verified facade/business claims. | Required control-doc reread, topic-doc review, `git diff --check`, `git diff --stat`, `git status --short`. | Docs-only planning boundary; committed separately. | 4C-1 review gate superseded by the bounded Phase 4C Geometry-Only Facade Cue Work Packet. |
| 4C-2: Geometry-only facade cue fixture and QA overlay | Complete pending Batu review. | Added a deterministic geometry-only cue fixture with 142 cue records for existing 4B primitive building masses; verifier regenerates the fixture from existing 4B manifest/runtime geometry and checks provenance, claim status, blocked claims, deterministic IDs, and target ID resolution; runtime renders geometry-only review planes and cue tiers only in QA mode. | No evidence-approved facade detail, exact facade/storefront/frontage/entrance/sign/window/door/awning/material/color/address/active-business/card claims, business/place overlays, storefront anchors, source acquisition, external APIs, scraping, capture workflows, generated assets, new dependencies, unrelated camera tuning, or source expansion beyond existing manifest/geometry support. | Phase 4C cue verifier, existing source fixture verifier, compiler determinism check, frontend build, browser smoke, and `git diff --check` passed. | Fixture/verifier/runtime QA overlay commit; stop for Batu review. | 4C-3 was not started because no required narrow geometry-only cue tuning need was identified after verification. |
| 4C-3: Narrow geometry-only cue tuning pass | Conditionally pre-authorized queued batch only after 4C-2 passes all self-advance conditions. | Small cue readability tuning to the 4C-2 geometry-only fixture, verifier, or QA overlay; may improve label/status readability, cue grouping, cue counts, or geometry-only visual clarity. | No new cue families beyond geometry-only cue classes, evidence-approved facade cues, exact facade claims, storefront/business overlays, source expansion, art-direction changes, generated assets, new dependencies, unrelated camera tuning, 4C-4, or any later batch. | Relevant 4C-2 verifier/build/smoke checks for touched areas plus `git diff --check`. | Narrow tuning boundary; implementation commit only if Batu explicitly authorizes commit behavior. | Hard stop after 4C-3 for Batu review. Stop earlier if verification fails, source evidence is missing/uncertain, visual/product review is needed, or scope would expand. |
| 4C-4: QA-mode recognizable facade slice | Complete pending Batu review. | Added an 8-building Franklin-end QA facade slice with manual_draft, fictional_safe, and not_verified status labels; runtime renders generic bay divisions, upper/lower splits, window-row placeholders, sign-band placeholders, awning-like placeholders, parapet/cornice tiers, and generic endpoint emphasis only in QA mode. | No real business names, tenant claims, exact storefront/facade/frontage/entrance/sign/address/material/window/door claims, source expansion, new dependencies, production art direction, normal-mode facade layer, business/storefront anchors, or later batch self-advance. | QA facade slice verifier, Phase 4C geometry cue verifier, source fixture verifier, compiler determinism check, frontend build, browser smoke, and `git diff --check` passed. | Bounded runtime/fixture/verifier/docs commit. | Stop for Batu review of recognizable-street-feel result; no next batch is open or queued. |
| 4C-5: QA-mode street-feel facade tuning pass | Complete and committed as `eaf3418`. | Tuned the same 8-building Franklin-end QA slice with denser storefront base cadence, varied placeholder sign bands, darker base bands, muted brick-like draft blocks, glass/entry placeholders, stoop/step hints, cellar grates, poles/posts, curb ticks, crosswalk/curb-cut placeholders, generic corner anchor volumes, and a lower Street review camera preset. This proved the QA-only fictional facade lane; further generic tuning is closed. | No slice expansion, real business names, tenant claims, exact storefront/facade/frontage/entrance/sign/address/material/window/door claims, source expansion, new dependencies, production art direction, normal-mode facade layer, business/storefront anchors, or later batch self-advance. | QA facade slice verifier, Phase 4C geometry cue verifier, source fixture verifier, compiler determinism check, frontend build, browser smoke, and `git diff --check` passed. | Bounded runtime/fixture/verifier/docs commit. | Stop; next recommended authorization is 4D-1 geometry validation, not another generic facade tuning batch. |
| 4D-1: Geometry validation and gap audit | Complete and Batu-approved for purposes of opening 4D-2. | Added deterministic review-only geometry validation/gap report and QA-only confidence visibility for existing 4B/4C rendered buildings. Classified 142 buildings as 126 `safe`, 14 `uncertain`, and 2 `blocked`; each building can expose rendered object ID, source footprint/building/tax-lot IDs, corridor side, relative side order, source/review status, massing confidence, gap/block-break status, address/building ambiguity, and later POI/facade-evidence eligibility states. | No Foursquare, local-directory calls, POI overlay, facade imagery ingestion, storefront anchors, asset registry, visual-system work, new dependencies, source expansion, production claims, normal-mode confidence rendering, or claim promotion. | 4D report verifier, 4C geometry cue verifier, 4C QA facade slice verifier, 4B source fixture verifier, compiler determinism check, frontend build, browser smoke, and `git diff --check` passed. | Bounded report/verifier/runtime QA inspection commit. | 4D-1 review gate cleared by Batu approval. Later claim promotion still requires separate approved batches. |
| 4D-2: Claim ladder / matching contract | Complete pending Batu review. | Added `docs/phase-4d-claim-ladder-matching-contract.md`, defining claim states, nine claim levels, allowed/disallowed evidence, runtime/QA rules, matching rules, default blocked states, and promotion gates before candidate POIs are attached. | No live APIs, POI overlay, businesses, facade imagery ingestion, storefront anchors, tenant frontage matches, runtime visual changes, source expansion, production claims, or asset-system work. | Existing 4D/4C/4B verifiers, compiler determinism check, and `git diff --check` passed. Build was not run because implementation files were not touched. | Contract-doc commit. | Stop for Batu review. Do not self-open 4D-3 or turn candidate POI data into authoritative storefront assignment. |
| 4D-3: Candidate POI overlay | Proposed next authorization only; not executable yet. | Would attach Foursquare/local-directory/other approved POI sources as candidate enrichment only, with confidence and blocked storefront-assignment claims visible. | No authoritative storefront assignment, active-status finality, facade/frontage/entrance inference, Google/Street View asset pipeline, production cards, or source access without terms/cache/display approval. | Source readiness, terms/cache/display approval checks, deterministic fixture checks, and QA smoke only if authorized later. | Candidate source/overlay boundary. | Stop before any business-to-storefront promotion. |
| 4D-4: Batu-supplied facade evidence packet | Proposed later phase. | Would ingest Batu-supplied or project-owned storefront imagery/evidence with provenance, usage status, allowed uses, blocked uses, and target building candidates. | No Google/Street View default stored or derived source-of-truth pipeline, scraping, unprovenanced imagery, asset generation, or storefront anchors. | Evidence packet validation and provenance checks if authorized later. | Evidence-packet boundary. | Stop before evidence-backed facade/storefront anchor implementation. |
| 4D-5: Evidence-backed facade/storefront anchors | Proposed later phase. | Would create facade/storefront anchors only where geometry confidence, claim ladder, POI candidates, and Batu-approved facade evidence support the intended claim. | No inferred tenant frontage from POI coordinates, address strings, building footprints, or fictional facade cues; no production visual system yet. | Anchor verifier, provenance checks, QA inspection, and blocked-claim checks if authorized later. | Anchor fixture/runtime-inspection boundary. | Stop before asset registry / visual system work. |

## Phase 4A Success Criteria

Phase 4A succeeds when:

- The core lane is known.
- Reference/acceleration lanes are known.
- Rejected or deferred lanes are known.
- Each lane has been judged against semantic interaction, reproducibility, art direction, licensing/runtime risk, editability, stable IDs, storefront-anchor support, corridor recognizability, and implementation complexity.
- Phase 4B has not been implemented prematurely.

## Phase 4B Success Criteria

Phase 4B succeeds when:

- A file-based source fixture can be compiled into a generated semantic scene manifest.
- Building massing comes from source geometry.
- Storefront anchors are explicit semantic objects.
- Business-to-storefront matching is inspectable and includes confidence levels.
- Stable IDs are deterministic.
- Manual overrides are explicit and versioned.
- Style recipe and asset registry contracts exist without becoming bloated.
- Runtime can later consume the manifest.
- The first visual proof after the primitive compiler is a deterministic interactive 3D corridor scene, not a static or manually composed substitute.
- Hover, click, and business cards remain semantic runtime requirements, not decoration.
- Business/place facts are not baked into raster/image assets.

## Phase 4C Success Criteria

Phase 4C succeeds when:

- Recognizable corridor identity improves without treating geometry-only cues as facade truth.
- Geometry-only cues remain limited to street-facing plane, building-width rhythm, supported height tiers, corner/endpoint role, setback/depth tier, block breaks, side-of-corridor, and coverage status.
- Batu-authorized QA-mode synthetic facade rhythm may render only as `manual_draft`, `fictional_safe`, `not_verified`, and non-factual review scaffolding.
- Facade-module layout, entrances, windows, sign bands, awnings/canopies, materials/colors, local props, transit entrances, and landmark identity treatment require Batu-approved evidence.
- Exact facade reproduction, storefront order, tenant frontage, entrance placement, sign/brand claims, exact address placement, active-business status, production/public readiness, and raster readiness remain blocked until later evidence gates clear.
- Storefront/business anchors depend on frontage/facade/entrance evidence and are not inferred from business names, POI coordinates, address strings, building footprints, or geometry-only cues alone.
- QA exposes cue family, claim status, confidence, evidence/source refs, and blocked claims.

## Phase 4D Success Criteria

Phase 4D succeeds when:

- Geometry confidence is inspectable before POI or facade matching.
- Every rendered building can be classified as safe, uncertain, or blocked for later POI/facade matching.
- "Correct geometry" is represented as confidence-labeled review of stylized/normalized geometry, not survey-grade correctness.
- Foursquare and local directories are candidate enrichment only, not authoritative storefront assignment.
- Google/Street View is not used as a default stored or derived source-of-truth asset pipeline without a separate terms/source-policy gate.
- Batu-supplied or project-owned storefront imagery is the preferred first facade evidence path.
- Asset registry and visual-system work waits until evidence and anchor models are defined.

## First Visual Proof Guardrail

After 4B-3, the first renderer/visual-proof batch must validate the actual 3D architecture at graybox fidelity:

- Extruded building footprints or primitive massing from source geometry and the semantic manifest.
- Simple materials only; no final art direction, production assets, GLB asset library, exact facades, exact storefront ordering/frontage claims, polished hover/card visual language, or business cards.
- Pan, zoom, and orbit/rotate camera controls.
- Corridor orientation and the next intersection recognizable enough for QA.
- Semantic object IDs inspectable, with hover/click hooks resolving through those IDs.
- Storefront-anchor placeholders visible only when evidence/status allows.
- QA, provenance, and blocked-claim states inspectable.

A future Phase 4B visual batch is not acceptable if it only produces a static image, 2D map, raster composition, manually arranged scene, or manifest with no navigable 3D proof.

## Non-Goals

- No full Greenpoint scope.
- No PostGIS unless separately approved.
- No dynamic streaming.
- No canonical splats/world models.
- No Blender layout source.
- No Cesium primary runtime.
- No fVDB/OpenVDB.
- No VLA/physics stack.
- No Houdini unless procedural complexity later demands it.
- No generic digital twin plan.
- No premature runtime refactor.
- No large asset library buildout.
- No doc sprawl.

## Repo Cleanliness Rules

- Use `docs/DOCS_INDEX.md` to route docs authority before reading historical or review-only Phase 2/3 files.
- `docs/phase-4-execution-roadmap.md` is the primary Phase 4 control surface.
- `docs/CURRENT_EXECUTION_BRIEF.md` names the current executable batch, any pre-authorized queued batches, and the next hard Batu review gate.
- Codex may self-open only the next batch already listed in the pre-authorized queue, only after completing and reconciling the prior batch, and only when no hard Batu review gate intervenes.
- Stop at every hard Batu review gate; do not self-advance to batches that are not listed in the pre-authorized queue.
- Existing Phase 4A/4B docs are supporting detail docs.
- Do not duplicate the full roadmap into supporting docs.
- Do not create new Phase 4 docs unless they remove ambiguity or directly support an implementation artifact.
- Keep docs short and operational.
- Prefer pointers over repeated rationale.
- Keep commit boundaries clean: docs-only, fixtures/schema, compiler, runtime, and assets should be separate commits/batches.
- Avoid touching old docs unless they create stale authority or confusion.

## Supporting Detail Docs

- `docs/phase-4a-workflow-spike-plan.md`
- `docs/phase-4a-workflow-spike-decision-matrix.md`
- `docs/phase-4b-data-to-scene-workflow.md`
- `docs/phase-4b-implementation-plan.md`
- `docs/phase-3-closeout.md`

## Immediate Next Batch

Current work packet: post-4D-2 claim ladder review state.

Current executable batch: none.

Pre-authorized queue: none.

Self-advance allowed: no.

Closed gate: `Batch 4B-3: Primitive compiler`, reviewed, approved, and closed.

Completed 4B-5 output: the deterministic interactive 3D graybox/isometric browser corridor scene now renders 142 primitive building massing objects, including 140 compiler-promoted source-backed contextual building records from approved geometry fixture data. Coverage status, left/right corridor side counts, semantic hover/click, invisible pick targets, QA/provenance, and blocked-claim visibility remain intact.

Preserved boundary: the 4B-5 output keeps the React + Vite + Three.js runtime boundary and did not add business verification, APIs, scraping, POI enrichment, facade/storefront/address claims, assets, art direction, broad map systems, random/procedural city generation, infinite wrapping, or work beyond 4B-5.

Completed 4B-6 output: separable QA/debug review affordances, camera presets, side/identity inspection, existing manifest anchor-status reporting, review-panel counts, and manual browser review steps to help Batu judge graybox corridor recognizability. Batu reviewed 4B-6 with result: Partial pass.

Completed 4B-6R output: strengthened corridor path hierarchy, added lightweight Manhattan Ave / Franklin Ave endpoint cues, added block/building rhythm cues using existing manifest/runtime/source-backed object boundaries, refined M-to-F/F-to-M/overhead/oblique camera presets, improved selected-object inspector visibility, and updated docs to record the 4B-6R CONDITIONAL PASS.

Conditional follow-up: M-to-F and F-to-M cameras remain somewhat compressed and should be tuned in a later narrow batch only if Batu opens that scope.

Completed 4C-1 output: added `docs/phase-4c-recognizable-facade-cue-plan.md`, defining geometry-only cue classes, evidence-approved cue classes, forbidden claims, fixture requirements, landmark/special-treatment handling, business/storefront anchor dependencies, manual review gates, deferred work, and the proposed 4C-2 acceptance criteria.

Completed 4C-4 output: added a QA-mode/manual-draft/non-factual Franklin-end facade rhythm slice for 8 existing building masses, with generic bay divisions, upper/lower splits, window-row placeholders, sign-band placeholders, awning-like placeholders, parapet/cornice tiers, endpoint emphasis, and visible `manual_draft / fictional_safe / not_verified` labels. Normal mode remains protected.

Completed 4C-5 output: tuned the same 8-building slice with denser storefront base cadence, varied placeholder sign bands, darker bases, muted brick-like blocks, glass/entry placeholders, stoop/step hints, cellar-grate marks, poles/posts, curb ticks, crosswalk/curb-cut placeholders, corner anchor volumes, and a Street review camera preset. Normal mode remains protected.

Completed 4D-1 output: added a deterministic review-only geometry validation/gap report for the existing 4B/4C rendered buildings and QA-only inspector confidence visibility. The report classifies 142 buildings as 126 `safe`, 14 `uncertain`, and 2 `blocked`, while keeping POIs, facade evidence, storefront anchors, source expansion, new dependencies, and production claims blocked.

Completed 4D-2 output: added `docs/phase-4d-claim-ladder-matching-contract.md`, defining the claim ladder, evidence rules, matching rules, blocked states, and promotion gates for future POI, business, facade, storefront, entrance, signage, and landmark work.

Post-4D-2 direction: the proposed next authorization is `Batch 4D-3: Candidate POI overlay`, only after Batu reviews the 4D-2 output.

Hard review gate: stop for Batu review of 4D-2. Do not self-open 4D-3 or any later Phase 4 batch.
