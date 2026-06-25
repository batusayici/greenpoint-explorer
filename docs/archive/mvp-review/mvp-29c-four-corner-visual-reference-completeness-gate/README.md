# MVP-29C Four-Corner Visual Reference Completeness Gate

Status: Complete for Batu review  
Date: 2026-05-31  
Scope: Docs-only visual-reference completeness review  
Exit verdict: `proceed-to-mvp-29d-with-limits`

## Decision Summary

Batu accepted MVP-29B with one revision: the active NW candidate label going forward is `Grillpoint Deli`.

`Greenpoint Deli` is historical / archival / prior conflicting candidate language only. Do not treat `Greenpoint Deli` as the current active public label. Do not claim Greenpoint Deli and Grillpoint Deli are legally the same entity unless source evidence supports that specific claim.

Post-review Batu decisions:

- SW Dunkin visual treatment is no longer blocked solely because the current SW references appear Google-derived. Batu approved a narrow MVP-only exception for the SW Dunkin reference gap, limited to human-reviewed, stylized, truth-safe, non-production review/demo-scale visual approximation.
- The Dunkin exception does not change the general Google/Street View/3D Tiles policy. It does not approve production use, texture extraction, tracing, stored facade asset reuse, training input, generation input, or exact trade-dress reproduction.
- Greenpoint G subway cue placement is no longer blanket symbolic/context-only if supplied/approved reference photos clearly verify a cue's corner/orientation relationship. If a specific cue is not verified from those photos, it remains symbolic, context-only, omitted, or blocked.
- JPG re-exports are expected inputs for the next MVP-29C reference review. Do not rely on undecodable HEICs if the environment cannot read them.

Reference-inventory reconciliation before visual review:

- `southeast-citizens-facadeA.jpeg` exists and is a readable JPEG; it remains an active SE Citizens reference.
- The following replacements are recorded as intentional current paths for MVP-29C review: `northeast-mcdonalds-facadeA.jpg`, `northeast-mcdonalds-wide.jpg`, `southeast-citizens-facadeB.jpg`, `southeast-citizens-wide.jpg`, and `southeast-subwayB.jpg`.
- The deleted `.jpeg` versions of those five files must not be referenced by active docs.

Visual-reference review outcome:

- The reconciled JPG/JPEG inventory is enough to support an MVP-29D four-corner composition brief with explicit limits.
- This is not an unqualified visual clearance. MVP-29D must preserve the limits below for NW HEIF gaps, SW Dunkin exception handling, branded/trade-dress simplification, and subway cue placement.

MVP-29C evaluates whether the available owned/approved/non-Google visual references, plus Batu's narrow SW Dunkin MVP exception, are sufficient for true-to-life review/demo-scale storefront, sign, facade, corner massing, neighboring context, and Greenpoint G subway cue treatment for the revised four-corner MVP.

No rendering, raster regeneration, app source edit, `src/` touch, target addition, card-copy change, screenshot, implementation, staging, or commit is opened by this packet.

## Active Candidate Set

- NW: Grillpoint Deli, 903 Manhattan Ave.
- NE: McDonald's, 904 Manhattan Ave.
- SW: Dunkin', 893 Manhattan Ave.
- SE: Citizens Bank, 896 Manhattan Ave.
- Station context: Greenpoint G subway.

## Review Method

Reviewed existing local reference inventory in `docs/mvp-reference-images/` plus accepted MVP-22/MVP-29B review evidence.

The review distinguishes:

- User-supplied / likely user-owned field photos that can support review/demo-scale translation after provenance remains accepted.
- HEIC files stored with `.jpeg` extensions that are present and dimension-readable, but must not be relied on if the environment cannot visually inspect them.
- JPG re-exports supplied for MVP-29C reference review.
- Google/Street View-derived images, which remain blocked for visual translation, extraction, tracing, texture reuse, training input, generation input, and production use except for Batu's narrow MVP-only SW Dunkin exception described above.

## Reference Inventory

| File | Candidate | Corner | What the image appears to support | Inspection status |
| --- | --- | --- | --- | --- |
| `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg` | Grillpoint Deli / Greenpoint G subway context | NW | Grillpoint sign band, corner storefront, building massing, adjacent storefront order, Greenpoint Ave station cue nearby, crosswalk/corner context. | Inspected; JPEG with iPhone 15 Pro EXIF. |
| `docs/mvp-reference-images/northwest-grillpoint-deli-facade.jpg` | Grillpoint Deli | NW | Filename suggests facade/storefront support. | Later normalized from HEIF-wrapped `.jpeg` to readable `.jpg`; original MVP-29C visual verdict did not rely on it. |
| `docs/mvp-reference-images/northwest-grillpoint-deli-wide.jpg` | Grillpoint Deli / corner context | NW | Filename suggests wide corner/storefront/context support. | Later normalized from HEIF-wrapped `.jpeg` to readable `.jpg`; original MVP-29C visual verdict did not rely on it. |
| `docs/mvp-reference-images/northwest-subwayA.jpg` | Greenpoint G subway | NW / station context | Filename suggests station cue near NW/Greenpoint Ave context. | Later normalized from HEIF-wrapped `.jpeg` to readable `.jpg`; original MVP-29C visual verdict did not rely on exact NW subway cue placement. |
| `docs/mvp-reference-images/northeast-mcdonalds-closeup.jpeg` | McDonald's | NE | McDonald's sign/arches, facade panels, storefront entry, corner edge, crosswalk/curb context, neighboring mural/building context. | Inspected; JPEG with iPhone 15 Pro EXIF. |
| `docs/mvp-reference-images/northeast-mcdonalds-facadeA.jpg` | McDonald's | NE | Sign, facade band, window order, entry zone, corner edge, crosswalk/street relationship. | Inspected; readable JPG export. Supersedes deleted/uninspectable `.jpeg` version. |
| `docs/mvp-reference-images/northeast-mcdonalds-wide.jpg` | McDonald's / NE context | NE | Wide NE massing, building relationship, mural/sign context, corner relationship, street/crosswalk context. | Inspected; readable JPG export. Supersedes deleted/uninspectable `.jpeg` version. |
| `docs/mvp-reference-images/southwest-dunkin-facadeA.jpeg` | Dunkin' / Greenpoint G subway context | SW | Dunkin sign, corner storefront, crosswalk/street relationship, and station context. | Inspected; readable JPEG governed by Batu's narrow MVP-only Google-derived reference exception. |
| `docs/mvp-reference-images/southwest-subway-wide.jpeg` | Greenpoint G subway / Dunkin' context | SW | SW corner massing, Dunkin storefront, station stair/rail cue, crosswalk/context. | Inspected; readable JPEG governed by Batu's narrow MVP-only Google-derived reference exception for SW Dunkin visual approximation only. |
| `docs/mvp-reference-images/southwest-subwayC.jpeg` | Greenpoint G subway / Dunkin' context | SW | SW storefront, subway railing/cue, Greenpoint Ave relationship, and broader facade context. | Inspected; readable JPEG governed by Batu's narrow MVP-only Google-derived reference exception for SW Dunkin visual approximation only. |
| `docs/mvp-reference-images/southeast-citizens-facadeA.jpeg` | Citizens Bank / Greenpoint G subway context | SE | Citizens sign/entry, facade texture, station stair/rail cue, sidewalk/corner context, neighboring context. | Inspected; restored readable JPEG. |
| `docs/mvp-reference-images/southeast-citizens-facadeB.jpg` | Citizens Bank | SE | Citizens sign/entry, facade, corner relationship, neighboring Vibe/McDonald's context, crosswalk/street relationship. | Inspected; readable JPG export. Supersedes deleted/uninspectable `.jpeg` version. |
| `docs/mvp-reference-images/southeast-citizens-wide.jpg` | Citizens Bank / SE context | SE | Wide SE corner massing, Citizens frontage, Greenpoint Ave street/crosswalk relationship, church/neighbor context. | Inspected; readable JPG export. Supersedes deleted/uninspectable `.jpeg` version. |
| `docs/mvp-reference-images/southeast-subwayB.jpg` | Greenpoint G subway / SE context | SE | Citizens entry, station stair/rail cue, Greenpoint Ave/Manhattan Ave orientation, crosswalk/corner context. | Inspected; readable JPG export. Supersedes deleted/uninspectable `.jpeg` version. |

`.DS_Store` exists in `docs/mvp-reference-images/` and is not a visual reference.

## Provenance Status

| Reference group | Source/provenance | User-owned or approved? | Allowed for review/demo-scale visual translation? | Blocked for production use? | Decoding/inspection issue |
| --- | --- | --- | --- | --- | --- |
| NW Grillpoint inspected JPEG | User-supplied field photo evidence carried forward from MVP-19/MVP-22 and local reference folder. | Likely user-owned/approved; provenance should remain recorded in later packets. | Yes for review/demo planning, with no exact facade/tracing/texture claim. | Yes. Production use remains blocked. | None for inspected JPEG. |
| NW Grillpoint formerly HEIF-wrapped files | Local reference folder, likely user-supplied field-photo set. | Needs provenance confirmation before implementation. | No for this pass; later normalized to readable JPG after the original MVP-29C verdict. | Yes. Production use remains blocked. | Original MVP-29C pass did not rely on these for exact NW facade/frontage/cue claims. |
| NE McDonald's inspected JPEG | User-supplied field photo evidence in local reference folder. | Likely user-owned/approved; provenance should remain recorded in later packets. | Yes for review/demo planning, with brand/trade-dress limits. | Yes. Production use remains blocked. | None for inspected JPEG. |
| NE McDonald's JPG re-exports | Local reference folder, likely user-supplied field-photo set. | Needs provenance confirmation before implementation. | Yes for MVP-29D review/demo planning with brand/trade-dress limits. | Yes. Production use remains blocked. | No decoding issue for the recorded JPG exports. |
| SW Dunkin / SW subway JPEG files | Appear to be Google/Street View-derived; visible Google watermark on inspected images. | Not generally approved. | Yes only under `MVP-exception-allowed` stylized/non-production handling for the SW Dunkin reference gap. | Yes. Production use remains blocked. | Viewable; exception does not allow extraction, tracing, texture reuse, training input, generation input, stored facade reuse, or exact trade-dress reproduction. |
| SE Citizens JPEG/JPG files | User-supplied field photo evidence in local reference folder. | Likely user-owned/approved; provenance should remain recorded in later packets. | Yes for MVP-29D review/demo planning with brand/trade-dress limits. | Yes. Production use remains blocked. | No decoding issue for `southeast-citizens-facadeA.jpeg` or the recorded JPG exports. |
| SE Citizens / subway JPG re-exports | Local reference folder, likely user-supplied field-photo set. | Needs provenance confirmation before implementation. | Yes for MVP-29D review/demo planning with brand/trade-dress and station-cue limits. | Yes. Production use remains blocked. | No decoding issue for the recorded JPG exports. |
| Public directory imagery | Public webpages/directories cited in evidence packets. | No visual-use approval. | No. Corroboration only; not art source. | Yes. | Not used. |
| LiveXYZ-derived imagery | Not used. | No. | No. Blocked. | Yes. | Not used. |
| Google/Street View/3D Tiles imagery | SW files appear Google-derived. | No general approval. | Generally blocked. Narrow exception: SW Dunkin only, MVP-only, stylized/non-production approximation. | Yes. | Must not be used for extraction, tracing, texture reuse, stored facade reuse, training input, generation input, production use, or exact trade-dress reproduction. |

## Visual Completeness Matrix

| Candidate | Sign treatment | Facade treatment | Storefront order/frontage | Corner massing | Neighboring context | Subway cue / station context |
| --- | --- | --- | --- | --- | --- | --- |
| Grillpoint Deli | `sufficient` | `partial` | `partial` | `partial` | `partial` | `partial` |
| McDonald's | `sufficient` | `sufficient` | `partial` | `sufficient` | `sufficient` | `not-applicable` |
| Dunkin' | `partial` | `partial` | `partial` | `partial` | `partial` | `partial` |
| Citizens Bank | `sufficient` | `sufficient` | `partial` | `sufficient` | `sufficient` | `sufficient` |
| Greenpoint G subway | `not-applicable` | `not-applicable` | `not-applicable` | `partial` | `partial` | `partial` |

Notes:

- Grillpoint has enough readable closeup and accepted MVP-22 evidence for MVP-29D planning, but not enough inspectable evidence to make exact facade/frontage or exact NW subway-cue claims.
- McDonald's has enough readable NE references for MVP-29D composition planning, with exact logo/trade-dress reproduction blocked.
- Dunkin' has enough SW references for MVP-29D only under Batu's narrow MVP-only exception and only as stylized/non-production approximation.
- Citizens Bank has enough readable SE references for MVP-29D composition planning, with exact logo/trade-dress/service claims blocked.
- Greenpoint G subway has one SE cue that is photo-verified enough for exact cue placement in MVP-29D planning at review/demo scale; NW and SW cues remain symbolic/context-only unless later verified by approved inspectable references.

## Candidate Readiness Decisions

| Candidate | Readiness | Reason |
| --- | --- | --- |
| Grillpoint Deli | `ready-with-limits` | Readable closeup plus accepted MVP-22 evidence supports sign, storefront, corner massing, and adjacent context at review/demo scale. HEIF-wrapped NW facade/wide/subway files limit exact facade, frontage, and NW cue claims. |
| McDonald's | `ready-with-limits` | Readable closeup/facade/wide references support NE massing, sign zone, facade rhythm, storefront relationship, and neighboring context. Exact logo/trade-dress reproduction remains blocked. |
| Dunkin' | `ready-with-limits` | SW references support sign, corner massing, frontage, crosswalk/street relationship, and station context only under Batu's narrow MVP-only Google-derived exception. |
| Citizens Bank | `ready-with-limits` | Readable facade/wide/subway references support SE sign, facade, corner massing, neighboring context, and the SE subway cue relationship. Exact logo/trade-dress/service claims remain blocked. |
| Greenpoint G subway | `ready-with-limits` | SE cue is eligible for exact cue placement in MVP-29D planning from supplied/approved photos. NW and SW cues remain symbolic/context-only or blocked unless separately verified. Exact station geometry remains blocked. |

## Brand / Trade-Dress Limits

### Grillpoint Deli

- Real label in cards: Allowed for review planning as `Grillpoint Deli`, pending later implementation-boundary approval.
- Real sign text in raster art: Potentially allowed in stylized, review/demo-scale form after MVP-29D/Batu approval.
- Safer visual approach: simplified sign band, broad color/placement cues, non-photoreal storefront rhythm, no exact texture reuse.
- Blocked: logo tracing, exact facade reproduction, texture extraction, production asset claim, legal sameness claim with Greenpoint Deli, exact active-status finality.

### McDonald's

- Real label in cards: Source-supported for review planning, pending later card/copy boundary approval.
- Real sign text in raster art: High-risk branded/trade-dress area; do not reproduce exact logos or trade dress without a later explicit decision.
- Safer visual approach: simplified/stylized cue, restrained arches/color reference, non-exact facade treatment.
- Blocked: logo tracing, exact brand-sign reproduction, texture extraction, exact trade-dress reproduction, endorsement/partnership implication, production asset claim.

### Dunkin'

- Real label in cards: Source-supported for review planning, pending later card/copy boundary approval.
- Real sign text in raster art: Only allowed, if later approved, as a stylized review/demo-scale cue under Batu's narrow MVP-only SW Dunkin exception.
- Safer visual approach: real label/card plus highly simplified corner cue, avoiding exact logo/trade-dress reproduction and avoiding any production claim.
- Blocked: production use, logo tracing, exact trade-dress reproduction, texture extraction, stored facade asset reuse, training input, generation input, production asset claim, and broadening the exception beyond the SW Dunkin MVP gap.

### Citizens Bank

- Real label in cards: Source-supported for review planning, pending later card/copy boundary approval.
- Real sign text in raster art: Potentially allowed as a simplified/stylized cue after MVP-29D/Batu approval; exact logo reproduction remains blocked.
- Safer visual approach: simplified green sign/branch-entry cue, broad facade/entrance placement, no exact logo/trade-dress reproduction.
- Blocked: logo tracing, exact brand-sign reproduction, texture extraction, exact trade-dress reproduction, ATM/branch-service claims, endorsement/partnership implication, production asset claim.

## Subway Cue Review

Available station/subway visual references:

- `docs/mvp-reference-images/northwest-grillpoint-deli-closeup.jpeg`
- `docs/mvp-reference-images/northwest-subwayA.jpg`
- `docs/mvp-reference-images/southeast-citizens-facadeA.jpeg`
- `docs/mvp-reference-images/southeast-subwayB.jpg`
- `docs/mvp-reference-images/southwest-subway-wide.jpeg`
- `docs/mvp-reference-images/southwest-subwayC.jpeg`

Current placement read:

- SE supplied/approved photos clearly show the station stair/rail cue adjacent to the Citizens corner context and verify enough corner/orientation relationship for MVP-29D exact cue placement planning at review/demo scale.
- NW readable Grillpoint closeup shows a nearby station cue, but direct `in front of Grillpoint` placement and exact NW station geometry remain blocked. `northwest-subwayA.jpg` was formerly HEIF-wrapped and was not relied on during the original MVP-29C verdict.
- SW subway images are still Google-derived. Batu's narrow exception applies only to the SW Dunkin visual-reference gap, not to exact station geometry clearance.
- MTA text can support station-area context but must not be used alone to infer exact station geometry.

Recommendation:

- In MVP-29D, allow exact SE cue placement from `southeast-citizens-facadeA.jpeg` and `southeast-subwayB.jpg` at review/demo scale, while avoiding exact station-geometry claims.
- Use NW and SW Greenpoint G cues as `symbolic` / `context-only`, omitted, or blocked unless later inspectable supplied/approved photos verify those specific cue placements.
- Keep direct `in front of Grillpoint` placement claims blocked.
- Keep exact station geometry blocked; do not infer exact station geometry from MTA text alone.

## Missing Reference List Before MVP-29D / MVP-29E

### Grillpoint Deli

- Not blocking MVP-29D with limits: re-export/inspect `northwest-grillpoint-deli-facade.jpg` and `northwest-grillpoint-deli-wide.jpg` only if MVP-29D needs stronger exact facade/frontage support than the readable closeup and accepted MVP-22 evidence provide.
- Re-export/inspect `northwest-subwayA.jpg` if MVP-29D proposes exact NW station-cue placement.
- Confirm provenance for all NW field photos.
- Keep direct `in front of Grillpoint` subway claims blocked unless stronger evidence and Batu approval support them.

### McDonald's

- No blocking photo gaps before MVP-29D.
- Confirm provenance for all NE field photos before implementation.
- Record which branded cues are safe to stylize and which are blocked.

### Dunkin'

- No blocking photo gaps before MVP-29D if Batu accepts the narrow exception and stylized/non-production treatment.
- Current Google-derived SW images may support only human-reviewed, stylized, truth-safe, non-production MVP visual approximation. They may not support production use, texture extraction, tracing, stored facade asset reuse, training input, generation input, or exact trade-dress reproduction.
- Owned/approved/non-Google field photos remain preferred if scaffolding clears, but lack of such photos is no longer by itself a blocker for MVP review/demo-scale stylized SW Dunkin treatment.
- Do not use the SW exception to clear exact station geometry.

### Citizens Bank

- No blocking photo gaps before MVP-29D.
- Confirm provenance for all SE field photos before implementation.
- Record whether branch entrance/ATM cues should be simplified, omitted, or represented only as non-service visual context.

### Greenpoint G Subway

- SE cue: no blocking photo gap before MVP-29D for review/demo-scale exact cue placement planning.
- NW cue: re-export/inspect `northwest-subwayA.jpg` or provide another approved photo if exact NW cue placement is desired.
- SW cue: provide owned/approved/non-Google photo evidence if exact SW cue placement is desired; current SW Google-derived references do not clear exact station geometry.
- MTA text alone may support station context, not exact station geometry.

## Treatment Readiness Recommendations

| Candidate | Recommendation | Rationale |
| --- | --- | --- |
| Grillpoint Deli | `ready-with-limits` | The inspected NW field photo plus accepted MVP-22 evidence supports sign, storefront, corner, and neighboring context at review scale. HEIF-wrapped NW files limit exact facade/frontage/NW cue claims. |
| McDonald's | `ready-with-limits` | Inspectable closeup/facade/wide photos support recognizable NE treatment, sign zone, massing, and street relationship. Exact logo/trade-dress reproduction remains blocked. |
| Dunkin' | `ready-with-limits` | SW references support MVP-29D planning only under Batu's narrow MVP-only exception for stylized/non-production approximation. |
| Citizens Bank | `ready-with-limits` | Inspectable SE photos support sign/facade/entrance/corner and neighboring context. Exact logo/trade-dress/service claims remain blocked. |
| Greenpoint G subway | `ready-with-limits` | The SE station cue is verified enough for exact cue-placement planning at review/demo scale; NW/SW cues remain symbolic/context-only or blocked unless later verified. |

## Exit Verdict

Verdict: `proceed-to-mvp-29d-with-limits`

Reason:

- The reconciled JPG/JPEG inventory has been reviewed.
- All four business candidates are visually ready for MVP-29D composition planning with explicit truth/style limits.
- Dunkin is ready only under Batu's narrow MVP-only SW Google-derived reference exception.
- Greenpoint G has one SE cue eligible for exact cue-placement planning at review/demo scale. NW/SW cues remain symbolic/context-only or blocked unless later verified.
- MVP-29D may open only if Batu accepts these limits. MVP-29D must not convert this verdict into production use, exact facade/frontage/address placement, exact station geometry, exact trade-dress reproduction, or public-release claims.

## Stop Conditions Before MVP-29D / MVP-29E

Stop before translation/composition, raster production, or app work if:

- MVP-29D is opened without Batu accepting the `proceed-to-mvp-29d-with-limits` verdict.
- Undecodable HEIC files are proposed as evidence despite the environment being unable to inspect them.
- Batu's SW Dunkin exception is broadened beyond the narrow MVP-only review/demo-scale gap.
- Any Google/Street View/3D Tiles-derived image is proposed for production use, art extraction, tracing, texture reuse, stored facade asset reuse, training input, generation input, or exact trade-dress reproduction.
- Any LiveXYZ-derived facade/art use is proposed.
- Exact facade, frontage, address placement, station geometry, or direct `in front of Grillpoint` subway claims are proposed without evidence and Batu approval.
- Branded sign/logo/trade-dress treatment is proposed as exact reproduction rather than simplified/stylized review/demo treatment.
- MVP-22 is treated as final MVP completion rather than one-corner proof evidence.
