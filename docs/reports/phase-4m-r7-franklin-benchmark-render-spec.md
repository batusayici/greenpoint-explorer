# Phase 4M-R7 Franklin Benchmark Render Spec

Status: R7 benchmark-fidelity specification for Batu review
Date: 2026-06-09
Scope: Franklin-only QA Visual POC hero corner

## Purpose

Define the minimum hero asset groups needed for Franklin benchmark-level render fidelity. This spec is for a review-only, QA-gated hero corner and does not authorize production assets, factual facade claims, real business identity, or Manhattan expansion.

## Core Rule

Measured trace controls alignment. The hero kit controls visual fidelity. The runtime assembles, gates, and reviews.

## Required Hero Asset Groups

### 1. Massing / Roof / Cornice / Side Return

- Fused corner mass that reads as one building, not layered debug boxes.
- Roof slab with parapet depth and visible top plane.
- Multi-band cornice with projection, dentil rhythm, and side-wrap continuation.
- Side-return wall with depth, edge thickness, and visible corner wrap.
- Shadow/contact treatment at facade/side-return intersections.

### 2. Upper Facade / Windows / Lintels / Sills / AC / Brick Relief

- Red-brick upper facade with non-repeating brick relief or baked texture.
- Window grid with dark frames, glass inset, lintels, sills, and top-row variation.
- AC-unit boxes on selected lower upper-floor windows.
- Subtle mortar/brick color variation.
- Facade depth around window openings so windows do not read as flat stickers.

### 3. Storefront Wrap / Awning / Sign Band / Glass / Mullions / Recess / Chamfer

- Wrapped corner storefront mass continuing from front facade into side return.
- Black awning/canopy with underside depth and front lip.
- Tan sign band with generic/non-readable green panel cues only.
- Recessed storefront glass with mullions, door rhythm, dark interior silhouettes, and reflective variation.
- Corner chamfer or edge treatment so the storefront reads as a corner object.
- Lower dark base/kick panels and small generic decals or stickers.

### 4. Side Bay / Fire Escape

- Side-return bay/projection with its own window rhythm.
- Fire escape as simplified but spatially credible rail/platform/ladder geometry.
- Side windows and side storefront cues aligned to the side wall, not pasted on the front.
- AC units and small shadows that reinforce side-return depth.

### 5. Sidewalk / Curb / Crosswalk / Pole / Clutter / Contact Shadows

- Sidewalk slab with seams and curb edge.
- Asphalt strip with crosswalk bars or corner street marks.
- Traffic/street pole as generic geometry, not a real sign claim.
- Small generic clutter: board, box, bike-like silhouettes, or planter-like forms.
- Contact shadows under awning, storefront recess, poles, clutter, and building base.

## Required Materials

- Brick: warm red/brown variation, mortar relief, non-uniform roughness.
- Stone/cornice: lighter tan/cream stone with projected shadow.
- Glass: dark interior base plus muted green-gray highlights.
- Awning: near-black cloth/metal with underside depth.
- Sidewalk/asphalt: separate rough concrete and dark road materials.
- AO/shadows: baked or authored contact shadows sufficient to ground the corner.

## Allowed Generic Visual Detail

- Generic decals and sticker shapes.
- Non-readable sign blocks.
- Interior silhouettes.
- Generic produce/window clutter shapes if they do not imply a real operating business.
- Non-factual street clutter used only for scale and scene grounding.

## Blocked Visual Detail

- Real logos.
- Readable sign text.
- Business identity.
- Active-status cues or claims.
- Exact storefront/frontage/entrance/address claims.
- Production asset claims.
- Manhattan application.
- New source lane or external source intake.

## R7 Implementation Boundary

R7 may preserve the R6 visual baseline by extracting the current Three.js Franklin hero overlay into a QA-only module. Full benchmark closure should wait for an approved review-only GLB/GLTF asset path or a Batu-approved equivalent authoring path.
