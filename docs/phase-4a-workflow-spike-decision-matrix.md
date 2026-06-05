# Phase 4A Workflow Spike Decision Matrix

Status: Supporting detail. Primary Phase 4 execution roadmap: `docs/phase-4-execution-roadmap.md`.
Date: 2026-06-05
Target corridor: Greenpoint Ave from Manhattan Ave toward Franklin Ave

## Scoring

Use this matrix during Phase 4A to compare candidate workflow lanes. Scores should be evidence-backed, not taste labels.

Suggested scale:

- `strong`: supports the criterion with low ambiguity.
- `mixed`: useful but requires manual review, constraints, or mitigation.
- `weak`: does not support the criterion well enough for the core workflow.
- `blocked`: cannot be used under current source, licensing, runtime, or governance constraints.
- `unknown`: requires spike evidence.

## Matrix

| Criterion | Deterministic compiler lane | 3D map/export shortcut lane | Reality-capture/reference lane |
| --- | --- | --- | --- |
| Semantic interaction support | Mixed; manifest/anchor planning and the west-anchor sample support semantic IDs and cards, but no Phase 4 compiler output or corridor runtime contract exists. | Weak; no local export sample proves preserved semantic IDs or card anchors, and any export would need a separate semantic layer. | Weak; references can guide human review but semantic labels, cards, and anchors must be authored as separate data. |
| Reproducibility | Mixed; existing corridor geometry preserves source metadata and raw-packet hash, but fixture shape, transform rules, compiler code, and determinism checks are not approved or implemented. | Blocked; no selected tool, export settings, source lineage, export sample, or terms approval exists for repeatable rebuild checks. | Weak; QA boards and inventories can be repeatable for approved local references, but capture outputs are not canonical rebuild inputs. |
| Art-direction support | Mixed; semantic manifests can feed style recipes and asset rules later, but this lane produces primitive massing and claim-status structure rather than final visual fidelity. | Mixed; a clean editable GLB could accelerate reference or asset work later, but no sample exists and exported geometry must not become the art system. | Mixed; supplied/approved references can calibrate facade cues and recognizability, but they do not define a production asset system. |
| Licensing/runtime risk | Mixed; NYC/Open-style file fixtures are the lowest-risk source path, but attribution, source-storage, schema ownership, and public-interface gates remain unapproved. | Blocked; tool terms, export rights, storage rules, attribution, textures/material rights, and runtime boundary are unapproved. | Blocked for restricted capture; owned/approved photos are usable only under recorded review-only provenance and claim limits. |
| Editability | Mixed; generated primitives plus explicit overrides should be reviewable, but current corridor transform and storefront/manual override burden are not measured. | Unknown; no sample exists to inspect hierarchy, mesh granularity, instancing, material cleanup, or decomposition burden. | Weak; captures and image references are hard to edit semantically and require explicit manual extraction/override records. |
| Stable ID support | Mixed; the lane can design deterministic IDs from source records and transform inputs, but no approved stable-ID contract or verifier exists yet. | Weak; no evidence shows preserved source IDs or stable feature IDs from an export path. | Weak; stable IDs must be layered in separate reference records and semantic scene objects. |
| Storefront-anchor support | Mixed; compiler output can represent storefront anchors as explicit candidates with confidence, but current geometry cannot derive exact frontage/order/entrances by itself. | Weak; building/map exports rarely solve storefront slots and no inspected sample proves frontage or entrance semantics. | Mixed; approved photos can support human storefront/frontage/entrance review, but capture/reference output alone is not canonical anchor truth. |
| Business-to-storefront matching | Mixed; the lane can expose confidence and manual-review states, but current corridor lacks approved business/source records and exact storefront evidence. | Weak; exports do not provide business matching without separate semantic/source records. | Weak; references may corroborate visual cues but cannot establish active business identity or matching without separate source records. |
| Reference/facade fidelity | Weak; deterministic geometry can support alignment and massing, but facade/frontage fidelity requires approved reference evidence or later asset rules. | Mixed; exports may help massing/reference alignment if rights and sample quality are approved, but cannot prove facade/frontage truth. | Strong for review-only fidelity when references are owned/approved; blocked for restricted storage/extraction or production facade evidence. |
| Runtime fit | Mixed; JSON manifest-shaped data already exists in the repo, but no approved Phase 4 runtime schema, loader, or renderer boundary exists. | Blocked; current app has no approved Three/R3F/glTF loader boundary, package/tooling change, or GLB asset path. | Blocked as runtime source; references/captures may inform QA only unless a later brief approves a constrained runtime use. |

## Phase 4A Recommendation

- Core lane: deterministic compiler plus semantic manifest.
- Reference lane: controlled owned/approved references for facade cue extraction, recognizability QA, and art-direction calibration.
- Rejected/deferred lanes: 3D map/export as core workflow; restricted capture outputs as canonical data, runtime surfaces, production assets, training input, or exact facade/frontage evidence.
- Smallest Phase 4B proof: file-based one-corridor source fixture plus verifier first, before compiler or runtime work.
- Required approvals before implementation: Phase 4B current brief, source fixture boundary, source storage/attribution/cache/display rules, schema/public-interface implications, stable-ID contract, verifier scope, compiler boundary, storefront-anchor/manual override policy, style/asset contract boundaries, and approved reference/source classes.
- Remaining blockers: storefront anchoring, business-to-storefront matching, mid-corridor/Franklin business/source records, approved facade/frontage/entrance references, Foursquare credential/terms gates, export/capture usage rights, and Phase 4B architecture/public-interface approval.

Detailed decision packet: `docs/phase-4a-workflow-spike-plan.md`.

## Non-Negotiables

- Source data defines metric truth.
- The compiler produces the semantic scene graph/manifest.
- Style recipes and asset kits produce visual interpretation.
- Browser runtime presents the interactive scene.
- Reference/capture tools support fidelity QA only.
- Storefront anchors and business-card semantics must not be baked into image pixels.
