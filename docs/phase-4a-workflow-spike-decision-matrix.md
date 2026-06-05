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
| Semantic interaction support | Unknown; should become strong if generated objects keep stable IDs and card anchors. | Unknown; often weak if exports collapse structure or lose source IDs. | Weak for core interaction; useful only as reference unless semantic labels are separately authored. |
| Reproducibility | Unknown; expected strongest if source fixtures, transforms, and manual overrides are versioned. | Unknown; depends on export repeatability, tool settings, and source provenance. | Usually weak for canonical rebuilds; useful for visual QA snapshots only. |
| Art-direction support | Unknown; depends on style recipe and asset-kit assembly rules. | Mixed if GLB geometry is editable and can accept modular treatment. | Mixed for fidelity references; weak as an art-directed production system. |
| Licensing/runtime risk | Mixed; lower if using approved local/open fixtures. | Unknown; tool/export license and attribution must be checked. | High/unknown; Google/Street View/3D Tiles, splats, and world-model outputs require strict usage review. |
| Editability | Unknown; expected strong if generated primitives and overrides are explicit. | Unknown; depends on mesh hierarchy, instancing, and cleanup burden. | Weak/mixed; visual captures may be hard to edit semantically. |
| Stable ID support | Unknown; should be designed into compiler output. | Unknown; often weak unless export preserves feature IDs. | Weak unless IDs are manually layered afterward. |
| Storefront-anchor support | Unknown; must be tested as a first-class compiler problem. | Weak/mixed; building exports rarely solve storefront slots. | Mixed for visual clue review; not sufficient for canonical anchors. |
| Business-to-storefront matching | Unknown; requires explicit confidence and manual review model. | Weak without separate semantic data. | Weak for canonical matching; useful for human review only. |
| Reference/facade fidelity | Mixed initially; improves with approved imagery and asset kit. | Mixed if geometry massing helps visual alignment. | Strong as a reference/QA lane when usage is allowed, but not canonical truth. |
| Runtime fit | Unknown; depends on output size and browser rendering path. | Unknown; may require GLB optimization and asset rules. | Weak/high risk for core runtime unless a later brief approves a constrained use. |

## Recommendation Template

Use this output shape at the end of Phase 4A:

```text
Core lane:
Reference lane:
Rejected/deferred lanes:
Smallest Phase 4B proof:
Required approvals before implementation:
Remaining blockers:
```

## Non-Negotiables

- Source data defines metric truth.
- The compiler produces the semantic scene graph/manifest.
- Style recipes and asset kits produce visual interpretation.
- Browser runtime presents the interactive scene.
- Reference/capture tools support fidelity QA only.
- Storefront anchors and business-card semantics must not be baked into image pixels.
