# Extraction Rules

Status: Review-only Phase 6 extraction guidance

## Palette Guidance

- Start from the approved corpus palette: warm brick, dark green, ochre, muted red, cream paper, charcoal ink, weathered teal, and restrained blue accents.
- Avoid one-note beige. Paper tones can support cards and boards, but the world must keep brick, green, red, black, metal, and plant variation.
- Avoid saturated toy colors and clean vector gradients.

## Line-Weight Guidance

- Use confident hand-inked outlines on primary forms.
- Use thinner broken lines for brick, hatching, stickers, and surface wear.
- Selected outlines should be readable but integrated, usually warm cream, ochre, or soft light stroke with a dark edge.

## Hatching / Texture Rules

- Hatching should reinforce material: brick courses, awning fabric, sidewalk cracks, curb wear, metal doors, and poster edges.
- Keep hatch density controlled so map-scale storefronts remain readable.
- Do not flatten texture into simple SVG-like fills.

## Shadow Rules

- Use warm directional shadows consistent with the isometric scene.
- Contact shadows under storefronts, props, cards, pins, and sidewalk objects should ground the module.
- Avoid dark cinematic blur that hides storefront detail.

## Density Rules

- Each storefront needs enough specificity to feel authored: sign, entry, display rhythm, prop cluster, decals, and material texture.
- Reuse should be visible through families, not through identical copy-paste repetition.
- Street slices should carry 3-5 storefront modules without becoming noisy.

## UI Hierarchy Rules

- Product-facing UI should sit on top of the raster world while sharing its paper, ink, and warm shadow language.
- Selected marker is highest priority.
- Selected building outline and tether are second priority.
- Place card is third priority and should not overpower the storefront.
- Index and controls are compact supporting UI.

## Normal vs QA Mode Separation

Normal product-facing UI:

- selected marker
- selected outline
- hover/selected card
- tether
- compact controls
- compact place index

QA/review-only UI:

- small proof title
- small review stamp
- documentation notes

Do not use Phase 5.2 beige QA-harness styling as product UI. Large beige panels, debug labels, and hit-region review scaffolds must remain out of the normal map view.

## Marker / Card / Tether Behavior

- The marker should attach to a visible storefront feature or roof/edge anchor.
- The selected outline should hug the chosen storefront module, not the whole block unless the whole block is selected.
- The tether should be slim and warm, with a visible endpoint on both card and building.
- Cards should feel paper-like and worn, but not generic beige rectangles.

## Avoiding Rejected Phase 5.2 Styling

- Do not make QA beige the dominant UI color.
- Do not make review labels larger than product-facing markers/cards.
- Do not turn compact controls into a debug panel.
- Do not use sterile vector strokes or flat icon-sheet composition as the main proof.

## Preserving Scene Specificity With Reusable Modules

- Vary shell width, awning type, display rhythm, sign band, prop cluster, and glyph family together.
- Keep local street texture: sidewalk seams, curb grime, utility boxes, planters, bikes, lamps, and poster residue.
- Let the module family be legible through shared proportions and parts, but require each recombination to have a distinct storefront read.
- Generated names and micro-text are placeholders only; production factual copy remains unresolved.
