# Phase 4L-Prep QA Evidence Eligibility Contract

Status: Planning-only eligibility contract.

This contract defines what would make each current 4K cue category eligible, insufficient, or blocked for later evidence-backed QA facade/corridor cue work. It does not approve 4L render implementation.

Structured contract: `src/data/evidence-eligibility/greenpoint-ave-manhattan-to-franklin.phase-4l-prep-qa-evidence-eligibility-contract.v0.1.json`.

## Global Rules

- Eligible evidence must be Batu-supplied repo-local evidence already indexed for review, or future Batu-approved evidence opened in a later packet.
- External source candidates remain blocked until a later source-policy gate opens terms, access, cache/display, attribution, and allowed-use boundaries.
- Evidence must support a cue as review-only visual guidance, not exact storefront, frontage, facade, sign, entrance, address, height, roof, tenant, business, active-status, production, or public truth.
- Distinct evidence records are required per facade/cue target before a cue can leave generic QA status.
- POI, business, tenant, and sign linkage remain blocked and are not eligibility inputs for 4L-Prep.

## Cue Category Eligibility

| Cue category | Eligible | Insufficient | Blocked |
| --- | --- | --- | --- |
| `corner_composition_cue` | Repo-local or future-approved evidence shows corner composition, side return, or wrap relationship for review. | Only scaffold lineage or generic corner-wrap candidate exists. | Would require exact storefront, tenant, sign, entrance, active-status, restricted-source, or unapproved external-source claim. |
| `sidewalk_street_cue` | Evidence supports sidewalk/street-edge grounding as a review cue. | Cue is only inferred from scaffold side or corridor guide geometry. | Would imply exact sidewalk geometry, exact fixture placement, source use beyond approval, or normal-mode readiness. |
| `subway_or_street_furniture_cue` | Evidence distinguishes a generic subway/street-furniture cue from sidewalk context. | Marker is symbolic, unlocated, or unsupported by dedicated evidence. | Would imply exact entrance location, transit facility truth, business relation, restricted source use, or public-facing claim. |
| `facade_rhythm_cue` | Evidence supports repeated facade or bay rhythm as a non-exact visual cue. | Rhythm is only generic ticks or a frontage-density placeholder. | Would promote exact storefront order, tenant frontage, sign text, entrance placement, or business identity. |
| `material_color_family_cue` | Evidence supports broad material/color family as review-only guidance. | Evidence is absent, stale, ambiguous, lighting-distorted, or only a generic palette family. | Would assert exact material, exact paint color, trade dress, logo, production asset readiness, or normal-mode use. |
| `massing_silhouette_cue` | Evidence supports broad depth, setback, or silhouette relationships. | Cue is only from 4O scaffold massing or 4J setback-depth lineage. | Would promote exact height, roof form, parcel geometry, exact setback, production asset, or public claim. |
| `frontage_density_cue` | Evidence supports coarse frontage density or bay rhythm without tenant assignment. | Only 4J frontage-band or bay-rhythm candidate lineage exists. | Would assign tenants, businesses, POIs, exact frontage, sign text, entrance placement, or active status. |

## Review States

- `eligible_for_batu_review`: evidence appears use-bounded and cue-specific enough for Batu to review in a later packet.
- `insufficient_evidence`: evidence is missing, generic, overextended, or not distinct per cue/facade target.
- `blocked`: eligibility would require a forbidden claim, forbidden source action, normal-mode exposure, or production/public use.

## 4L-Prep Decision

The current state is `not_ready` for evidence-backed 4L QA corridor render. Missing evidence must be supplied or approved before 4L render work opens.
