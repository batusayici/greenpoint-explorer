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

The compiler and semantic manifest are the center. Blender is an asset foundry/offline renderer, not a layout source. Three.js / React Three Fiber remains the likely runtime direction after approval. GLB/glTF remains the likely runtime asset format after approval. Reference imagery, splats, and world-model outputs are QA/reference only.

## Batch Plan

Agents must execute only the current batch named in `docs/CURRENT_EXECUTION_BRIEF.md`. This roadmap is the operating plan for that named batch, not permission to self-advance through later batches. At every stop/decision gate, agents must stop for review and may continue only after explicit Batu approval or an updated current brief names the next batch.

| Batch | Expected outcome | Success criteria | Must not change | Verification | Commit boundary | Stop / decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| 4A-1: Workflow spike setup | Ready-to-run spike checklist for the Manhattan-to-Franklin corridor. | Corridor target, three lanes, required inputs, evaluation criteria, source/reference constraints, and evidence outputs are clear. | No source fixtures, schemas, compiler scripts, runtime changes, assets, package/tooling, or public interfaces. | `git status --short`, `git diff --check`, markdown/link sanity if available. | Docs-only commit. | Stop if required source/reference inputs are unclear or if a lane needs external access, licensing approval, or Batu decision. |
| 4A-2: Deterministic compiler lane assessment | Lane assessment for source geometry -> primitive massing/manifest feasibility. | Minimal source fixture requirements, stable ID needs, semantic interaction support, storefront-anchor risks, and implementation complexity are known. | No full compiler, generated manifest, source fixture, schema file, runtime refactor, or production architecture unless separately approved. | Markdown sanity; parse/check source samples only if an approved existing sample is read, not created. | Docs-only assessment commit. | Stop before implementation or if fixture/schema boundaries require approval. |
| 4A-3: 3D map/export shortcut assessment | Lane assessment for 3D Mapper or similar export tools. | IDs, editability, licensing, GLB usefulness, semantic structure, runtime usefulness, and source-truth limits are understood. | No canonical export adoption, GLB production asset, runtime loader, package/tooling, or broad import. | Markdown sanity; record evidence/source notes only. | Docs-only assessment commit. | Stop if tool terms, export rights, or ID/structure claims are uncertain. |
| 4A-4: Reality-capture/reference lane assessment | Lane assessment for reference photos, Google Photorealistic 3D Tiles, Marble/world-model outputs, splats, or photo-to-3D. | Recognizability benefit is weighed against canonical-data, licensing, storage, and runtime risk. | No stored restricted imagery, texture extraction, canonical splats/world models, training input, runtime capture path, or production facade evidence. | Markdown sanity; usage-policy notes if reviewed. | Docs-only assessment commit. | Stop before storing/reusing restricted reference material or treating capture output as truth. |
| 4A-5: Decision gate | Phase 4A decision note and completed matrix. | Core lane, reference/acceleration lanes, rejected/deferred lanes, smallest Phase 4B proof, and required approvals are decided. | No Phase 4B implementation, runtime work, schema/compiler/source fixture creation, asset files, or public interfaces. | Markdown sanity; `git diff --check`; no build unless runtime files changed, which this batch should avoid. | Decision-doc commit. | Stop for Batu approval before Phase 4B implementation. |
| 4B-1: Contract foundation | Lean planning contracts for source fixture, scene manifest, storefront anchors, stable IDs, manual overrides, style recipe, and asset registry. | Contracts are short, coherent, and implementation-ready without becoming doc sprawl. | No runtime code, compiler code, generated manifests, package/tooling, broad data model, or asset production. | Markdown sanity; schema parse only if schema files are explicitly approved and created. | Contract-doc commit. | Stop if public interfaces, module boundaries, or schema ownership need approval. |
| 4B-2: Minimal source fixture + verifier | One corridor source fixture and verifier, only after approval. | Required metadata, IDs, geometry presence, source traceability, and blocked claims validate. | No compiler, runtime changes, asset files, broad ingestion, live APIs, scraping, or unapproved source storage. | JSON/schema parse, verifier, determinism/hash checks, `git diff --check`. | Fixture/verifier commit. | Stop if source rights, cache/storage, attribution, or fixture shape are unresolved. |
| 4B-3: Primitive compiler | Minimal Python compiler, only after approval. | Source fixture compiles into semantic scene manifest with deterministic IDs, primitive massing, storefront anchor candidates, confidence levels, and explicit overrides. | No runtime preview, art asset library, production renderer, broad compiler architecture, or live data. | Compiler determinism check, generated manifest validation, source metadata checks, `git diff --check`. | Compiler/generated-output commit. | Stop if generated manifest becomes a public/runtime interface without approval. |
| 4B-4: Runtime manifest preview | Inspectable primitive browser scene, only after approval. | Runtime loads manifest, renders primitive massing and semantic storefront anchors, and keeps QA/provenance visible. | No over-styling, large refactor, production renderer, asset library buildout, or business facts baked into images. | Frontend build, browser smoke, manifest validation, `git diff --check`. | Runtime-preview commit. | Stop if runtime boundary, renderer choice, or public interface expands. |
| 4B-5: Semantic interaction/art-direction foundation | Interactive proof with semantic hover/click/card behavior and initial deterministic style rules. | Hover/click/cards connect to semantic IDs; style recipe/asset rules apply without hiding source truth; business cards remain semantic data. | No production asset direction, large asset library, factual public release, broad coverage, live data, or hidden manual overrides. | Frontend build, browser smoke, interaction QA, manifest/source checks, `git diff --check`. | Interaction/style commit. | Stop for Batu visual/product review before any production-readiness claim. |

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
- Hover, click, and business cards remain semantic runtime requirements, not decoration.
- Business/place facts are not baked into raster/image assets.

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
- `docs/CURRENT_EXECUTION_BRIEF.md` names the only Phase 4 batch agents may execute.
- Stop at every roadmap stop/decision gate; do not self-advance to the next Phase 4 batch.
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

Next batch: `Batch 4A-1: Workflow spike setup`, proposed unless repo docs already mark it approved.

Expected output: a ready-to-run Phase 4A spike checklist that confirms the corridor target, evaluation criteria, required inputs, evidence format, stop gates, and decision-matrix update path.
