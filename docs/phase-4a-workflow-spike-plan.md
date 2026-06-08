# Phase 4A Workflow Spike Plan

Status: Supporting detail. Primary Phase 4 execution roadmap: `docs/phase-4-execution-roadmap.md`.
Date: 2026-06-05
Name: Phase 4A: Workflow Spike - Compiler vs Export vs Reality-Capture Reference
Target corridor: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Goal

Compare three candidate workflow lanes on the same small corridor before committing Phase 4B implementation effort.

Phase 4A output is a decision document and supporting notes. It is not a production system, runtime implementation, schema-file batch, compiler-script batch, source-ingestion batch, asset-kit batch, or public-interface approval.

## Lanes To Evaluate

1. Deterministic compiler lane
   - Use a bounded NYC/Open or OSM-style footprint/source fixture already allowed by repo policy.
   - Evaluate whether source truth can become normalized records, stable IDs, primitive massing, semantic scene manifest shape, and inspectable interaction anchors.
   - A primitive browser preview is allowed only if a later brief explicitly opens it; otherwise Phase 4A stays docs/evidence only.

2. 3D map/export shortcut lane
   - Evaluate whether tools like 3D Mapper or similar exports can accelerate terrain, buildings, or GLB reference creation.
   - Assess structure preservation, stable IDs, editability, licensing clarity, reproducibility, and whether exported geometry can remain subordinate to source truth.

3. Reality-capture/reference lane
   - Evaluate whether reference photos, Google Photorealistic 3D Tiles, Marble/world-model outputs, Gaussian splats, or Street View/photo-to-3D workflows can improve facade, landmark, or corridor recognizability review.
   - Keep these outputs as reference/QA only. They must not become canonical truth, production textures, stored third-party imagery, training input, or exact facade/frontage evidence without later approval.

## Questions Phase 4A Must Answer

- Which lane becomes the core workflow?
- Which lane becomes a reference or acceleration lane?
- Which lane is rejected or deferred?
- Which lane supports semantic interaction and cards?
- Which lane supports reproducibility and stable IDs?
- Which lane supports art direction and modular assets?
- Which lane has licensing, cache, attribution, or runtime risk?
- What is the smallest proof needed before Phase 4B can begin?

## Success Criteria

- The same Manhattan-to-Franklin corridor is evaluated across all three lanes.
- The deterministic compiler lane is judged against shortcut/reference lanes rather than assumed in isolation.
- Storefront anchoring and business-to-storefront matching are evaluated as first-class risks.
- Art direction is evaluated as a modular style/asset-system problem, not only a color/material recipe.
- The result is a clear recommendation before Phase 4B implementation.
- No full-neighborhood scope, PostGIS, dynamic spatial streaming, canonical splats/world models, Blender-as-layout-source, or Phase 4B runtime work is opened by this spike.

## Batch 4A-1 Ready-To-Run Checklist

Status: Complete pending Batu review. This checklist prepares the spike lanes; it does not approve 4A-2, source fixture creation, exports, captures, runtime work, or Phase 4B implementation.

Corridor target:

- Use one shared evaluation corridor: Greenpoint Ave from Manhattan Ave toward Franklin Ave.
- Treat the corridor as a Phase 4A comparison target, not a production map area.
- Keep Manhattan-to-Franklin storefront anchoring, frontage/order, entrances, facade appearance, exact address placement, business identity, and active status unresolved unless a later lane records approved evidence.

Shared evaluation criteria:

- Semantic interaction and card support.
- Reproducibility and stable IDs.
- Art-direction and modular asset-system support.
- Licensing, cache, attribution, runtime, and storage risk.
- Editability and manual override burden.
- Storefront-anchor and business-to-storefront matching support.
- Corridor recognizability and facade/reference usefulness.
- Implementation complexity for the smallest Phase 4B proof.

Deterministic compiler lane inputs to confirm in 4A-2:

- Approved existing NYC/Open, OSM-style, or repo-local source references that may be inspected without creating new source fixtures in Phase 4A.
- Required metadata for source provenance, feature IDs, transforms, blocked claims, and manual-review notes.
- Minimal questions for primitive massing, semantic manifest shape, storefront-anchor candidates, confidence levels, and manual overrides.
- Stop if fixture shape, schema boundary, stable-ID contract, source storage, cache, or attribution requires Batu approval.

3D map/export shortcut lane inputs to confirm in 4A-3:

- Candidate export tool or workflow name, export format, terms/license status, attribution expectations, and storage limits.
- Evidence needed for hierarchy preservation, feature IDs, editability, repeatability, GLB usefulness, and runtime size/cleanup risk.
- Clear rule that exports may be acceleration/reference only unless a later approval makes them subordinate implementation inputs.
- Stop if export rights, tool terms, preserved IDs, source provenance, or canonical-use claims are unclear.

Reality-capture/reference lane inputs to confirm in 4A-4:

- Candidate reference classes: Batu-supplied/approved photos, allowed reference packets, policy-reviewed 3D Tiles/Street View notes, world-model outputs, splats, or photo-to-3D references.
- Evidence needed for recognizability value, facade cue usefulness, licensing/storage limits, attribution, and runtime inadmissibility.
- Clear rule that capture/reference outputs are QA/reference only and cannot become canonical truth, production textures, training input, or exact facade/frontage evidence without later approval.
- Stop before storing, extracting, tracing, training from, or reusing restricted third-party imagery or capture outputs.

Evidence output packet for each lane:

- One short lane note with source/reference assumptions, inspected evidence, blockers, and recommended score changes.
- Updates to `docs/phase-4a-workflow-spike-decision-matrix.md` using `strong`, `mixed`, `weak`, `blocked`, or `unknown`.
- A record of any external access, licensing, cache/display, source-storage, or Batu decision needed before the lane can continue.
- No source fixtures, schemas, compiler scripts, generated manifests, GLB files, screenshots, captured imagery, assets, runtime code, package/tooling changes, public interfaces, API calls, scraping, or production/public claims.

Decision-matrix update path:

1. Run 4A-2, 4A-3, and 4A-4 only when each batch is named by `docs/CURRENT_EXECUTION_BRIEF.md` or explicitly approved by Batu.
2. For each lane, update only the relevant matrix column and keep untested claims as `unknown`.
3. Reserve final core/reference/rejected-lane selection for the 4A-5 decision gate.
4. Stop after each lane assessment and again before Phase 4B implementation.

## Batch 4A-2 Deterministic Compiler Lane Assessment

Status: Complete pending Batu review. This assessment does not approve Phase 4B implementation, source fixture creation, schema files, compiler scripts, generated manifests, runtime changes, package/tooling changes, public interfaces, or production architecture.

Viability read:

- The deterministic compiler lane is viable as the likely core candidate for a future one-corridor Phase 4B proof, because the repo already separates source geometry, scene coordinates, provenance, QA, manual overrides, and semantic interaction concepts.
- The lane is not viable as an automatic full-corridor truth system yet. It cannot derive tenant frontage, exact entrances, facade appearance, exact address placement, active-business status, or raster readiness from current building footprints, street centerlines, POI coordinates, or address ranges alone.
- The lane should proceed only if future implementation keeps generated source truth, manual overrides, storefront anchors, visual-reference evidence, and scene presentation as separate inspectable layers.

Evidence inspected:

- `docs/reference/ARCHITECTURE.md`: records the source adapters -> normalized records -> canonical scene manifest -> rendering -> QA layer direction, while keeping generated truth and manual overrides separate.
- `docs/reference/SCENE_MANIFEST_SCHEMA.md`: defines planning contracts for provenance, geometry, places, businesses, addresses, storefronts, scene objects, scene anchors, transforms, manual overrides, and QA.
- `docs/reference/PROVENANCE_AND_QA.md`: defines the inspection loop, missing-data/ambiguity reports, hidden-manual-fix checks, and stop conditions.
- `docs/reference/DATA_SOURCES.md` and `docs/reference/PLACE_SOURCE_POLICY.md`: define source hierarchy and claim limits.
- `src/data/geometry-source/greenpoint-ave-manhattan-to-franklin.nyc-open-geometry-context.phase-3b.json`: existing review-only corridor geometry packet with 3 sources, 2 street centerline records, 4 sidewalk-line records, 291 footprint records, raw source hash, and explicit blocked claims.
- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json`: existing corridor scaffold with 3 targets and 4 layers, but `realWorldTransformStatus` remains `not_implemented`.
- `src/data/scenes/manhattan-greenpoint-ave-mvp.v0.1.json`: existing west-anchor manifest-shaped sample with sources, geometry, places, businesses, addresses, storefronts, scene transform/anchors/objects/assets, overrides, and QA fields.

Required future inputs:

- One approved file-based corridor source fixture derived from already allowed NYC/Open or OSM-style source records, with source IDs, retrieval/review dates, query/path metadata, license/attribution notes, raw packet hash, and claim support/claim-limit fields.
- Corridor boundary and coordinate-system metadata for WGS84 source records, local projected geometry, and stylized scene coordinates.
- Explicit source records for buildings, parcels/lots where available, street segments, address ranges, and any approved business/place evidence.
- Optional but likely necessary Batu-supplied or Batu-approved facade/frontage/entrance reference evidence for storefront anchors; without it, storefronts must remain candidate/manual-review or blocked.
- A versioned manual-override layer for scene placement, storefront candidates, business matching, and visual/content decisions.

Required future transforms:

- Normalize source geometry without overwriting raw source records.
- Derive deterministic stable IDs from source type, source record ID, corridor ID, geometry role, and versioned transform inputs.
- Convert WGS84/source geometry into a local projected coordinate layer, then into a separate stylized scene coordinate layer.
- Clip and select corridor-relevant buildings/streets in a repeatable way.
- Convert building footprints into primitive massing candidates while preserving source geometry and claim limits.
- Generate storefront-anchor candidates only as explicit semantic objects with confidence/status, not as exact frontage claims.
- Attach business/place candidates to addresses/buildings/storefront anchors through inspectable confidence rules and manual-review flags.

Required future outputs:

- Normalized source records with provenance and claim limits.
- Deterministic semantic scene manifest with geometry, places, businesses, addresses, storefront anchors, scene anchors, scene objects, assets/style references, transform metadata, manual overrides, and QA.
- QA report covering unprovenanced claims, hidden manual fixes, missing data, ambiguities, blocked claims, source/attribution status, stable-ID determinism, override counts, and human approval checklist.
- Review packet that states what changed, what stayed blocked, and whether the generated output is repeatable enough to continue.

Required future validation gates:

- JSON parse and schema/shape validation for source fixture and generated manifest after those files are explicitly approved.
- Source packet hash and raw/normalized record count checks.
- Deterministic rerun check that compares generated manifest hash, stable IDs, and object counts from the same inputs.
- Referential-integrity checks for source IDs, address IDs, building IDs, storefront IDs, scene anchors, assets, and overrides.
- Blocked-claim verifier to ensure footprints/centerlines do not promote tenant frontage, entrances, facades, exact address placement, business identity, active status, or raster readiness.
- Override audit that reports manual changes by category and fails hidden manual fixes.

Current repo support:

- Supports: planning contracts for manifest/provenance/QA; review-only corridor geometry packet; raw-source hash in the Phase 3B packet; west-anchor manifest-shaped sample; source hierarchy and claim-limit docs; existing source-evidence verification scripts that show the repo already values deterministic checks.
- Does not yet support: approved Phase 4B source fixture boundary, runtime schema file, compiler script, generated manifest, deterministic corridor transform implementation, corridor storefront segmentation evidence, business/source packet for the Manhattan-to-Franklin corridor, facade/frontage/entrance evidence, or a corridor-specific validation harness.

Decision implication:

- 4A-2 does not prove the compiler lane by implementation, but it does support carrying the deterministic compiler lane forward as the leading core-lane candidate for comparison against 4A-3 and 4A-4.
- The smallest credible future Phase 4B proof should be a file-based source fixture plus verifier before any compiler or runtime preview.
- Stop at this gate because fixture shape, schema ownership, stable-ID contract, compiler module boundary, source storage/attribution, and public-interface implications still require Batu approval before implementation.

## Batch 4A-3 3D Map/Export Shortcut Assessment

Status: Complete pending Batu review. This assessment does not approve canonical export adoption, GLB/glTF production assets, runtime loaders, package/tooling changes, broad imports, source fixtures, generated manifests, public interfaces, or production architecture.

Viability read:

- The 3D map/export shortcut lane is not viable as the core workflow under current repo conditions.
- It may become useful as a reference or acceleration lane only after Batu approves a specific tool/export source, export rights, attribution/storage rules, and at least one inspectable sample.
- No repo-local 3D export sample was found for this corridor, so hierarchy, IDs, editability, material cleanup burden, and GLB/glTF usefulness cannot be verified from evidence in this batch.
- Even if a future export is useful visually, it must remain subordinate to source truth and semantic manifest generation. It cannot become canonical Greenpoint truth, tenant frontage evidence, business matching evidence, or the runtime architecture by itself.

Evidence inspected:

- Repo file scan for `.glb`, `.gltf`, `.obj`, `.fbx`, `.dae`, and similar 3D export artifacts found no local export sample to inspect.
- `package.json` includes React, Vite, and Pixi dependencies only; it does not include an approved Three.js, React Three Fiber, glTF loader, or GLB optimization path.
- `docs/phase-4-execution-roadmap.md` names Three.js / React Three Fiber and GLB/glTF as likely later directions after approval, not current implementation authority.
- `docs/phase-4b-data-to-scene-workflow.md` and `docs/phase-4b-implementation-plan.md` keep Blender as an asset foundry/offline renderer and keep GLB/glTF production work deferred until explicit approval.
- Current Phase 3/4 source truth remains the review-only NYC/Open geometry packet and semantic/planning contracts, not a 3D export package.

Required future inputs:

- Specific export tool or source name, approved by Batu for assessment.
- Tool terms/license/export-rights notes, attribution requirements, cache/storage rules, and public-display limits.
- One small corridor export sample, if rights allow storing it in the repo, or a documented external inspection note if storage is not allowed.
- Export settings, source data lineage, coordinate system, scale/orientation, units, and repeatability notes.
- A comparison target against existing NYC/Open corridor geometry so the export can be checked against source truth instead of judged visually.

Required future inspection questions:

- Does the export preserve feature hierarchy, source IDs, building IDs, object names, or metadata that can map back to source records?
- Can exported meshes be edited or decomposed without losing semantic structure?
- Does it preserve units, orientation, georeference, and repeatable bounds?
- Does it contain textures or imagery with restricted usage?
- Can it be regenerated deterministically from the same input/source/tool settings?
- Does it reduce implementation work enough to justify cleanup, licensing, storage, and runtime risk?
- Can it remain an acceleration/reference artifact instead of becoming the layout source?

Required future outputs if the lane continues:

- Short source/terms note for the selected export tool.
- Export sample inventory or non-storage inspection note.
- Hierarchy/metadata/ID report.
- Editability and cleanup-burden report.
- Runtime-size and GLB/glTF usefulness note.
- Source-truth boundary note that records what the export can and cannot prove.

Required future validation gates:

- File presence and format validation only after an export sample is explicitly approved.
- Metadata/hierarchy inspection for object names, source IDs, feature IDs, units, coordinates, and material/texture references.
- License/usage check before storing, transforming, rendering, or referencing an export.
- Source-alignment check against approved NYC/Open or other source geometry.
- Blocked-claim check to ensure the export does not promote tenant frontage, entrances, facades, business identity, active status, exact address placement, or raster readiness.

Current repo support:

- Supports: clear source-truth hierarchy, review-only NYC/Open geometry context, Phase 4 planning stance that Blender/export tools are subordinate, and deferred GLB/glTF runtime direction after approval.
- Does not yet support: selected export tool, approved tool terms, repo-local export sample, GLB/glTF asset path, runtime loader, Three/R3F boundary, export metadata inspection harness, or storage/attribution policy for exported geometry.

Decision implication:

- 4A-3 should not displace the deterministic compiler lane as the leading core candidate.
- The export lane should remain deferred as a possible reference/acceleration lane until a specific approved export source and sample can be inspected.
- Stop at this gate because tool terms, export rights, sample storage, preserved IDs, source provenance, and canonical-use boundaries are uncertain.

## Batch 4A-4 Reality-Capture/Reference Lane Assessment

Status: Complete pending Batu review. This assessment does not approve stored restricted imagery, Google/Street View/3D Tiles extraction, texture extraction, tracing, training input, canonical splats/world models, runtime capture paths, production facade evidence, source fixtures, generated manifests, assets, public interfaces, or production architecture.

Viability read:

- The reality-capture/reference lane is viable only as a controlled reference and QA lane.
- It is not viable as the core workflow, canonical data source, production asset pipeline, runtime scene source, or proof of exact facades/frontage/entrances/business placement.
- Repo evidence supports the value of supplied or approved reference photos for review-only facade cue improvement: DTR-11 partially improved facade/sign/window/entrance reads while preserving geometry-first layout.
- Restricted capture classes such as Google/Street View/Photorealistic 3D Tiles, splats, world-model outputs, and photo-to-3D outputs remain blocked or unapproved for storage/reuse/extraction unless a later policy gate explicitly approves a narrow use.

Evidence inspected:

- `docs/MVP_SCOPE.md`: allows supplied/approved field-reference photos for review-only validation and MVP-only facade/source imagery, but blocks Google/Street View/3D Tiles storage, extraction, training, generation input, texture reuse, and production asset use except the narrow historical SW Dunkin exception.
- `docs/reference/DATA_SOURCES.md`: treats Google/Street View/Places as fallback/reference only until licensing is resolved and requires manual/team evidence to record provenance, usage/licensing status, supported claims, and unsupported claims.
- `docs/reference/PLACE_SOURCE_POLICY.md`: keeps general Google/Street View/3D Tiles facade-reference use blocked and allows owned/approved field photos/manual observations only as provenance-labeled support for facade/frontage/entrance review.
- `docs/reference/approved-reference-corpus/USAGE_RULES.md`: protects approved raster/reference outputs as visual alignment references, not production assets or exact Greenpoint factual evidence.
- `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/README.md`: records that supplied real facade imagery materially improved DTR-11 but did not prove full-fidelity deterministic facade reproduction.
- `docs/mvp-review/phase-2dtr-11-reference-image-facade-fidelity-pass/generated/reference-facade-fidelity-qa-report.json`: records `googleStreetViewOr3DTilesExtractionUsed: false`.

Required future inputs:

- Approved source class for each reference item: owned field photo, Batu-supplied photo, explicitly approved public/reference material, or restricted/capture output.
- Provenance metadata for each reference item: owner/source, captured/published/reviewed date, local path or non-storage note, usage/licensing status, allowed uses, blocked uses, supported claims, unsupported claims, and attribution needs.
- Clear distinction between human-readable reference notes, structured facade cue extraction, QA comparison crops/boards, and any generated or captured 3D artifact.
- Batu approval before any restricted source is viewed for a new purpose, stored, transformed, traced, extracted, used as generation/training input, or converted into a reusable asset.

Required future inspection questions:

- Does the reference improve corridor recognizability enough to justify its review burden?
- What claim can the reference actually support: facade cue, sign-band rhythm, material/color note, entrance cue, storefront order, or only broad visual mood?
- Is the reference owned/approved, public with clear rights, restricted, or blocked?
- Can the reference be stored in the repo, or must it remain a non-storage human review note?
- Does the method preserve source truth and manual overrides instead of baking facts into pixels?
- Does the reference introduce privacy, licensing, texture, trace, training, or public-display risk?

Required future outputs if the lane continues:

- Reference inventory with usage status, allowed/blocked uses, claim support, and claim limits.
- Facade/frontage/entrance cue checklist only where the source class supports it.
- QA comparison board or note that stays review-only and non-production.
- Human approval checklist for any claim that moves from visual cue to exact facade/frontage/entrance/storefront evidence.
- Explicit blocked-claim list for restricted imagery, capture outputs, splats, world models, and photo-to-3D artifacts.

Required future validation gates:

- Reference inventory completeness check before any reference-driven assessment continues.
- Usage/licensing gate before storing, transforming, rendering, extracting, tracing, training from, or reusing any reference or capture output.
- Claim-limit check to ensure reference/capture artifacts do not promote exact facades, frontage/order, entrances, active-business status, exact address placement, or production/public readiness.
- Pixel/data separation check to ensure business/place facts and storefront anchors remain semantic records rather than baked image content.
- Review-only label check for any QA board, crop, raster, or reference packet.

Current repo support:

- Supports: approved visual reference corpus, DTR-11 supplied-reference facade-fidelity evidence, policy docs that separate owned/approved photos from restricted capture, and existing QA report fields that record whether Google/Street View/3D Tiles extraction was used.
- Does not yet support: approved mid-corridor/Franklin reference imagery, approved capture storage/use terms, canonical splat/world-model path, runtime capture path, deterministic photo-to-facade transfer, production facade evidence, or a general reference/capture source policy.

Decision implication:

- 4A-4 supports keeping reference/capture as a reference/QA lane, not the core workflow.
- The deterministic compiler lane remains the leading core candidate; reference/capture may later help human review, facade cue extraction, recognizability QA, and art-direction calibration when the reference material is owned or explicitly approved.
- Restricted capture outputs should remain rejected/deferred for canonical data, production assets, runtime surfaces, training input, and exact facade/frontage evidence until a later explicit source-policy gate changes that.
- Stop at this gate because usage rights, storage policy, source class, and claim boundaries remain Batu-owned decisions.

## Batch 4A-5 Decision Gate Recommendation

Status: Complete pending Batu review. This recommendation closes Phase 4A assessment work only. It does not approve Phase 4B implementation, source fixture creation, schema files, compiler scripts, generated manifests, runtime changes, asset files, package/tooling changes, public interfaces, or production architecture.

Core lane:

- Deterministic compiler plus semantic manifest.
- Rationale: 4A-2 found this is the only lane that can plausibly keep source truth, stable IDs, manual overrides, storefront-anchor candidates, semantic interactions, QA, and future style/asset rules inspectable and reproducible.
- Constraint: the compiler lane cannot automatically solve tenant frontage, exact entrances, facade appearance, exact address placement, active-business status, business matching, or raster readiness from footprints, centerlines, POI points, or address ranges alone.

Reference lane:

- Controlled owned/approved reference material for facade cue extraction, recognizability QA, and art-direction calibration.
- Rationale: 4A-4 found supplied/approved references can materially improve human review and facade cue fidelity when usage and claim limits are recorded.
- Constraint: reference/capture outputs must remain QA/reference only. Business facts, storefront anchors, and card semantics must stay semantic data, not pixels.

Rejected/deferred lanes:

- 3D map/export shortcut as core workflow: deferred. It may become a reference/acceleration lane only after a specific tool, export rights, storage/attribution rules, and sample export are approved and inspected.
- Restricted capture outputs as canonical data, runtime surfaces, production assets, training input, or exact facade/frontage evidence: blocked/deferred pending a later explicit source-policy gate.
- Blender, manually composed scene files, screenshots, Figma, AI image generation, Cesium, splats, and world-model outputs as canonical layout/source truth: rejected for Phase 4A/4B core workflow.

Smallest Phase 4B proof:

- File-based one-corridor source fixture plus verifier first, before compiler or runtime work.
- The proof should validate required metadata, source IDs, source traceability, geometry presence, claim limits, blocked claims, stable-ID readiness, and manual-review requirements.
- The fixture/verifier proof should be narrow to Greenpoint Ave from Manhattan Ave toward Franklin Ave and should not include broad ingestion, live APIs, scraping, runtime preview, GLB assets, or generated manifests unless a later brief explicitly opens those steps.

Required approvals before implementation:

- Phase 4B batch approval in `docs/CURRENT_EXECUTION_BRIEF.md`.
- Source fixture boundary, source storage, attribution/cache/display rules, and allowed source classes.
- Schema ownership and public-interface implications before any schema or generated manifest is created.
- Stable-ID contract, verifier scope, and blocked-claim rules.
- Compiler module boundary before any compiler script is created.
- Storefront-anchor contract, confidence model, and manual override policy.
- Style recipe and asset-registry contract boundaries before any asset-kit or visual production work.
- Batu-supplied or Batu-approved facade/frontage/entrance references if the proof attempts facade or storefront-anchor evidence beyond contextual geometry.

Remaining blockers:

- Storefront anchoring and business-to-storefront matching remain first-class unresolved problems.
- Current repo geometry supports contextual street/building review only; it does not prove tenant frontage, storefront order, entrances, facades, exact address placement, active status, or raster readiness.
- Mid-corridor/Franklin business/source records and approved facade/frontage/entrance references are not available.
- Foursquare remains optional and blocked by missing credential plus terms/cache/display approval.
- Export/capture tool terms, sample storage, and restricted imagery/capture usage remain unapproved.
- Phase 4B architecture boundaries, public-interface implications, source fixture shape, schema ownership, verifier scope, compiler boundary, and runtime scope remain Batu approval items.

## Default Stance

The compiler lane is presumed to become the core unless Phase 4A evidence disproves it. Export and reality-capture lanes may accelerate geometry/reference/fidelity review, but they must remain subordinate to source truth and semantic scene compilation.

Blender may be an asset foundry or offline renderer later. It must not become the canonical layout source.
