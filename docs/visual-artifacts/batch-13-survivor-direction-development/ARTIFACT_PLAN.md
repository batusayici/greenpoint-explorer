# Artifact Plan

Label: **visual artifact plan / generated outputs exist**
Date: 2026-05-26

## Status

This file defines the exact artifacts requested for Batch 13. The six generated Batch 13 development images now exist in `generated/`:

- `generated/SP-A-ui-world-integration.png`
- `generated/SP-B-place-card-marker-hover-state.png`
- `generated/SP-C-style-system-tile.png`
- `generated/II-A-ui-world-integration.png`
- `generated/II-B-place-card-marker-hover-state.png`
- `generated/II-C-style-system-tile.png`

## Shared Generation Setup

Both survivor directions should use the same product scenario:

- Exterior near-isometric Greenpoint / Brooklyn storefront block.
- Map-mode browsing.
- One default clickable place.
- One hovered place.
- One selected place.
- One selected place card.
- Light UI affordances only.
- No full app chrome.
- Fictionalized storefronts and symbolic local cues unless separately verified.

The two directions must remain visually separate.

## Soft Pixel Neighborhood Sim

### A. UI / World Integration Frame

Purpose:

Show whether Soft Pixel can host multiple map interaction states without becoming cluttered or game-HUD-heavy.

Required visual contents:

- Same invented isometric block structure as the Soft Pixel hero-frame family.
- Three readable storefronts with distinct facades.
- One default clickable place with a quiet pixel-sticker marker.
- One hovered place with a restrained outline or glow on the storefront.
- One selected place with a stronger entrance marker and a small active card.
- Light UI affordances only, anchored to storefronts.

Decision value:

Batu should be able to judge whether Soft Pixel remains clickable and locally specific once product states are introduced.

### B. Place-Card / Marker / Hover-State Frame

Purpose:

Stress-test the selected-state system at closer range.

Required visual contents:

- One selected storefront with enough neighboring context to read it as a map.
- Entrance marker.
- Hover label.
- Selected place card.
- Visible connection between card and storefront.
- Pixel texture, signage, stickers, flyers, sidewalk, curb, and nearby street props.

Decision value:

Batu should be able to judge whether marker, hover, and card language feel native to the pixel world.

### C. Style-System Tile

Purpose:

Make the visual system rules explicit enough to evaluate repeatability.

Required visual contents:

- Palette swatches.
- Pixel edge and texture logic.
- Brick, awning, glass, roll gate, sidewalk, curb, tree pit, stickered pole, flyer, planter, bike rack, community board, and sign examples.
- Marker states: default, hover, selected, unavailable/unknown.
- Card shape/material.
- Icon direction.
- Type feel.
- Density rules showing calm, normal, and high-texture surface zones.

Decision value:

Batu should be able to judge whether the Soft Pixel look can scale beyond one hero image.

### D. Production Viability Notes

Can be modularized:

- Facade widths and heights.
- Brick clusters and window modules.
- Awnings, sign bands, doors, roll gates, sidewalk slabs, curbs, tree pits, poles, planters, bike racks, trash cans, mailboxes, and community boards.
- Marker and card components.

Hard to scale:

- Bespoke storefront personality.
- Pixel-level facade detail.
- Textured local clutter without noise.
- Maintaining charm at multiple zoom levels.

Needs human design oversight:

- Final marker/card hierarchy.
- Pixel density rules.
- Local specificity versus generic retro charm.
- How much Xerox sticker/flyer pressure is allowed.

Must be tested before production:

- Small-size readability.
- Hover and selected-state contrast.
- Card legibility.
- Modular storefront assembly.
- Distinction from older Community Pixel-adjacent work.

## Inked Indie Graphic Novel

### A. UI / World Integration Frame

Purpose:

Show whether Inked Indie can host map UI while remaining a browsable exterior map, not a one-off illustration.

Required visual contents:

- Same invented isometric block structure as the Inked Indie hero-frame family.
- Three readable storefronts with distinct facades.
- One default clickable place with a quiet inked callout marker.
- One hovered place with a drawn bracket, wash, or facade outline.
- One selected place with a precise entrance marker and caption-panel card.
- Light UI affordances only, integrated into the inked world.

Decision value:

Batu should be able to judge whether the linework supports click precision and UI hierarchy.

### B. Place-Card / Marker / Hover-State Frame

Purpose:

Stress-test the selected-state system over dense linework and local surface detail.

Required visual contents:

- One selected storefront with neighboring facade and sidewalk context.
- Entrance marker.
- Hover label.
- Selected place card.
- Visible connection between card and storefront.
- Inked texture, hatching, signage, stickers, flyers, awning, sidewalk marks, bikes, and pole details.

Decision value:

Batu should be able to judge whether the UI feels designed into the illustration rather than pasted on top.

### C. Style-System Tile

Purpose:

Make the authored illustration system explicit enough to evaluate repeatability.

Required visual contents:

- Palette swatches.
- Line-weight samples.
- Hatching density samples.
- Paper texture and shadow-shape examples.
- Brick, awning, glass, roll gate, sidewalk, curb, stickered pole, flyer wall, planter, bike rack, bench, mailbox, and sign examples.
- Marker states: default, hover, selected, unavailable/unknown.
- Caption-panel card shape/material.
- Icon direction.
- Type feel.
- Density rules showing clear, detailed, and high-texture zones.

Decision value:

Batu should be able to judge whether Inked Indie can become a controlled visual system rather than only an attractive frame.

### D. Production Viability Notes

Can be modularized:

- Base facade geometry.
- Window and door placements.
- Sign bands, awnings, roll gates, sidewalk modules, street props, marker states, and card layout.
- Texture brushes and hatching patterns if art-directed tightly.

Hard to scale:

- Authored line quality.
- Storefront personality.
- Controlled hatching around UI.
- Maintaining local specificity without custom illustration everywhere.

Needs human design oversight:

- Line-weight system.
- Hatching density.
- Card and marker hierarchy.
- Balance of editorial taste and product clarity.
- How much Xerox surface pressure is allowed.

Must be tested before production:

- Legibility at map scale.
- UI/card clarity over linework.
- Repeatable facade rules.
- Cost of custom illustration.
- Whether the style stays map-first rather than story-panel-first.
