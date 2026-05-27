# Art Direction

Status: Current guidance / no final visual direction approved  
Date: 2026-05-26  
Creative direction owner: Batu  
Implementation owner: Codex

## Current Visual State

No final visual direction is approved yet.

Community Pixel Storefront is historical/exploratory only. It is not the current approval path and not final production direction.

Older territories in this document are historical references unless Batu explicitly reactivates one. They should not be treated as current approval candidates or production direction.

Current working read:

- OCCII/community-sim energy is useful for warmth, confidence, and attention cues.
- That energy must not overwhelm storefront, place, and map clarity.
- The world should remain Greenpoint/storefront-led.
- UI and marker language should support discovery without implying a character system, quest system, social sim, or full game HUD.
- The newest curated reference thesis is: "Greenpoint street-corner sim with Bushwick creative mess and HD pixel clarity."
- The curated reference set is directional input only. It does not approve a final visual direction, palette, UI system, production art style, or implementation path.

Next visual decisions require concrete artifacts, not prose labels. The corrected path is:

1. Radical Art Direction Concept Sprint.
2. Batu review of distinct visual-world hypotheses.
3. Decision-grade raster/image style frames for selected territories only.
4. Static style frame only after Batu approves the relevant direction and composition gates.

React/Vite/Pixi implementation remains blocked until the approved static style frame exists.

## Visual Exploration Rules

- References are directional inputs, not approved style.
- The goal is to generate world hypotheses, not palette, density, marker, or icon variants.
- Exterior-only map mode is mandatory: storefront facades, sidewalks, street corner, signage, street furniture, markers, and place cards.
- No interiors, cutaways, indoor venue scenes, or poster-only compositions.
- Thumbnail divergence rule: options must look like different games at 20% zoom.
- Decision-grade artifacts must be visual enough for Batu to judge without prose.
- Reusing one base composition is allowed only for controlled later refinement, not for radical concept selection.

## Informal Environment-As-Character Working Principle

The environment should carry the project's personality through storefront rhythm, street furniture, signage, surface texture, transit cues, sidewalk life, and authored local detail.

This is an informal working principle, not an approved formal design pillar. Batu must explicitly approve any named design pillar or final visual thesis.

## Modular Diorama Asset Strategy

Future visual systems should be evaluated for whether they can support reusable diorama parts without losing Greenpoint specificity.

Likely reusable categories:

- Facades, windows, doors, roll gates, awnings, sign bands, and storefront widths.
- Street furniture, utility poles, bike racks, trash cans, mailboxes, benches, tree planters, stoops, and sidewalk modules.
- Corner conditions, curb cuts, crosswalk edges, subway-anchor elements, and controlled sticker/flyer surfaces.

The goal is not bespoke modeling for every building. The goal is a repeatable authored kit that can carry local specificity through combinations, material rules, signage treatment, and carefully chosen hero details.

Parameterized storefront identity may be useful later, but it is deferred until visual direction and architecture boundaries are approved.

## Readability And Interaction Principle

Orthographic/isometric clarity matters more than decorative density.

- Users must understand what is clickable, what is place data, and what is atmosphere.
- Local specificity must support map usability, not obscure it.
- Storefront entrances, marker placement, hover states, selected states, and place-card attachment must remain legible at review size.
- Hover, click, and card hierarchy must be tested visually before implementation.
- Texture, signage, flyers, and ambient detail should frame click targets, not camouflage them.

## Curated Isometric Reference Set

Status: Batu-curated directional input / not final visual approval  
Decision authority: Batu  
Codex role: translate, structure, propose testable artifacts

Target visual thesis:

> Greenpoint street-corner sim with Bushwick creative mess and HD pixel clarity.

This thesis should not be interpreted as an equal blend of all references. The project needs a clear hierarchy: map readability and Greenpoint/NYC truth stay core, while Bushwick / Gen Z creative culture supplies controlled surface and social cues. Pixel charm and cinematic mood are supporting accents, not a license to drift into generic retro nostalgia or cyberpunk atmosphere.

### Weighted Influence Guidance

- 30% isometric camera / map readability.
- 25% Greenpoint / NYC architectural specificity.
- 25% Bushwick / Gen Z creative culture.
- 10% pixel / retro charm.
- 10% cinematic lighting / mood.

Practical read:
- Storefront readability, sidewalk/crossing logic, click targets, and scene clarity must win over texture and mood.
- Greenpoint/NYC specificity must appear through proportions, corner geometry, building rhythm, storefront bands, awnings, curb cuts, crosswalks, signage density, transit cues, and neighborhood clutter.
- Bushwick / Gen Z culture should show through controlled cues: flyers, stickers, wheatpaste, bikes, e-bikes, handmade signs, thrifted fashion, pop-up tables, zines, small social clusters, and layered-but-readable sidewalk life.
- Pixel charm should mean crisp HD pixel clarity, blocky simplification, and legible silhouettes, not low-res imitation or pure 1990s nostalgia.
- Cinematic mood should provide warmth, glow, and emotional invitation without obscuring map function or turning the scene into a night-life illustration.

### Reference Matrix

| Reference | Role | Core / Accent | Use For | Do Not Copy |
| --- | --- | --- | --- | --- |
| Image A - Pixel NYC corner with pizza / pawn / news | Primary structural read for game-space composition | Core | Isometric camera angle, stacked storefront rhythm, sidewalk/curb readability, street-corner composition, clear click-scale building bases | Final palette, generic retro simplification, suburban/cartoon tone, direct sign or business mimicry |
| Image B - Tokyo night storefront | Mood and light reference | Accent | Warm storefront glow, intimate street mood, atmospheric lighting, emotional tone, inviting threshold contrast | Japanese architecture, Japanese signage, exact urban typology, cyberpunk drift, night mood that hides map clarity |
| Image C - Clean 3D isometric tile | Production-clarity and modular construction reference | Core support | Modular asset thinking, sidewalk/building construction, curb and tile readability, scene clarity, production-friendly geometry | Sterile final style, generic mobile-game polish, empty environment feeling, decorative lawns as Greenpoint default |
| Image D - Aerial NYC corner photo | Spatial truth reference | Core | Actual NYC corner proportions, crosswalk geometry, curb/lane/intersection truth, pedestrian-scale spatial grounding, overhead compression lessons | Photorealism, top-down literal translation, realistic color palette, unfiltered traffic-photo busyness |
| Image E - Busy NYC deli / neighborhood illustration | Social-density and lived-in energy reference | Core support | Neighborhood energy, sidewalk life, urban vignettes, social density, local specificity, clustered micro-scenes around storefronts | Exact line style, overcrowding, full-frame chaos, turning every inch into a gag or event |
| Image F - Graffiti alley | Surface-culture texture reference | Accent | Sticker/flyer/graffiti layering, subcultural edge, controlled visual grit, worn surfaces, utility-box/pole detail | Overall scene composition, abandoned/dangerous atmosphere, graffiti overload, making graffiti the main premise |
| Image G - Storefront row on plain background | Facade-rhythm and silhouette simplification reference | Core support | Storefront rhythm, facade variation, silhouette simplification, sign/awning diversity, compact row readability | Flat front-facing composition as the main scene, overly cute toy-town simplification, isolated object-sheet feeling |

### Translation Rules

- Start from Image A and Image D for camera, corner composition, sidewalk/crosswalk truth, and storefront clickability.
- Use Image C as a construction discipline: sidewalks, curbs, facades, planters, poles, signs, and street objects should feel modular enough to build consistently later, even in static preproduction artifacts.
- Use Image G to design storefront rhythm: each facade needs a clear silhouette, sign band, entry, window logic, awning or frontage variation, and a readable business-scale zone.
- Use Image E to decide where social detail clusters belong: near entrances, curb corners, bikes, pop-up tables, stoops, and transit edges, not evenly sprinkled across the whole image.
- Use Image F only as surface seasoning: posters on poles, wheatpaste panels, stickers on utility boxes, tagged roll gates, tape residue, and worn doorframes. Keep the main scene safe, lived-in, and navigable.
- Use Image B for warmth at thresholds: lit interiors, sign glow, vending/window highlights, wet or reflective accents if useful, and evening warmth. Do not let it dictate architecture or signage language.
- Storefronts must remain individually clickable at a glance. Surface texture must frame click targets, not camouflage them.
- Bushwick / Gen Z creative cues should appear as lived behaviors and surfaces: bikes, e-bikes, zines, handmade signs, thrifted clothing silhouettes, tote bags, pop-up tables, small social clusters, and sticker/flyer layering.
- HD pixel clarity means crisp edges, simplified planes, chunky readable props, and controlled texture density. It does not require visible low-resolution pixels everywhere.
- Every future visual artifact using this set must state what is core, what is accent, and what is intentionally excluded.

### Negative Constraints / Anti-Patterns

- Do not average the references into a generic isometric moodboard style.
- Do not approve a final direction from this prose.
- Do not let Bushwick cues replace Greenpoint/NYC architectural specificity.
- Do not use generic graffiti overload as shorthand for creative culture.
- Do not drift into cyberpunk, fantasy architecture, Japanese urban typology, or neon-night spectacle.
- Do not make pure 1990s retro nostalgia the dominant feeling.
- Do not make the street feel abandoned, dangerous, sterile, suburban, toy-town cute, or mobile-game generic.
- Do not overcrowd the frame until storefronts, sidewalks, signs, markers, or cards stop reading.
- Do not introduce new marker systems, UI card styles, palettes, or production visual language without Batu approval.
- Do not treat Community Pixel Storefront, Batch 8B, Batch 9, or this curated reference set as approved final style.

## Creative Direction Protocol

Batu owns taste. Codex owns production proposals and implementation.

Codex must not make autonomous final visual language decisions. For any meaningful visual decision, Codex should present options, explain tradeoffs, recommend when useful, and wait for Batu approval before implementation.

For meaningful visual decisions, Codex must provide low-fidelity visual material before requesting approval when a rough artifact can clarify the choice. Prose-only approval is not enough for visual taste decisions when a visible comparison can be made.

Allowed lo-fi visual decision aids:

- Rough mockups.
- Reference boards.
- Style tiles.
- Palette strips.
- Annotated sketches.
- UI marker/card samples.
- Blockout compositions.
- Quick throwaway prototypes.

All such artifacts must be clearly labeled:

> lo-fi / exploratory / not final

These artifacts are allowed before final static style-frame production. They are disposable decision aids and do not count as final production art. Batu still owns final taste decisions.

Current gate:

> Batu must approve the visual direction and static style-frame composition before any static style-frame image production.

## Historical Visual Thesis

Greenpoint DIY Sim:

> A Greenpoint-specific isometric diorama with a playful DIY graphic interface layer.

The world should feel like Greenpoint first: storefronts, street corners, Polish signage influence, subway entrance, awnings, older brick and vinyl textures, sidewalk clutter, stoops, bikes, dogs, and practical neighborhood density.

The UI layer should carry the more expressive energy: chunky labels, sticker-like markers, bold hover/tap feedback, card edges, flyer-informed color accents, and Sims-adjacent icon language without copying The Sims directly.

## Art Acceptance Bar

The first screenshot should read as a distinctive Greenpoint-inspired isometric diorama before any interaction is explained.

If someone needs the UI or a written explanation to understand why it is interesting, the style frame is not ready.

## Reference Digestion

### 1. Isometric NYC by Cannoneyed

Source: https://cannoneyed.com/projects/isometric-nyc

Borrow:
- Small, tested batches.
- Strong QA discipline.
- Micro-tools when useful.
- Respect for city-specific geometry and local detail.
- Awareness that visual consistency is hard.

Avoid:
- Giant tile-generation ambition.
- Automated image-generation dependency.
- Seam-heavy tiling problems.
- Treating scale as the main achievement.

Why it matters:
- It shows both the promise and traps of AI-assisted isometric city work. Our project should invert its emphasis: less scale, more authored density.

### 2. SimCity 2000

Source: https://www.ea.com/en-us/games/simcity/simcity-2000

Borrow:
- Fixed isometric readability.
- Chunky urban simplification.
- Clear silhouettes and terrain/building separation.
- Compact visual information density.

Avoid:
- Overly generic city tiles.
- Utility-map feeling.
- Over-mechanical zoning logic.

Why it matters:
- It sets the nostalgic foundation for a readable isometric urban scene.

### 3. RollerCoaster Tycoon / Classic Isometric Tycoon Language

Source: https://www.rollercoastertycoon.com/

Borrow:
- Tiny ambient loops.
- Legible micro-scenes.
- Buildings and paths that invite inspection.
- Dense but readable prop placement.

Avoid:
- Full tycoon interface complexity.
- Simulation-management expectations.
- Excessive novelty props.

Why it matters:
- It suggests how a static-ish scene can feel alive without requiring deep gameplay systems.

### 4. The Sims Social Cue Language

Source: https://www.ea.com/games/the-sims

Borrow:
- Immediate visual readability of attention markers.
- Human-scale charm.
- Playful UI confidence.

Avoid:
- Direct plumbob copying.
- Character simulation promises.
- Over-cute suburban domestic tone.

Why it matters:
- The project can borrow the idea of readable social/attention cues without becoming a Sims clone.

### 5. Greenpoint Historic District / Storefront Texture

Source: https://s-media.nyc.gov/agencies/lpc/lp/1248.pdf

Borrow:
- Brick massing.
- Older storefront rhythm.
- Ground-floor retail texture.
- Historic-but-lived-in building proportions.

Avoid:
- Museum-like preservation tone.
- Over-polished brownstone postcard treatment.

Why it matters:
- Greenpoint specificity should come from architectural rhythm and street texture, not just labels.

### 6. Manhattan Ave / Little Poland Context

Source: https://en.wikipedia.org/wiki/Manhattan_Avenue_%28Brooklyn%29

Borrow:
- Polish signage influence.
- Neighborhood commercial strip density.
- Practical, mixed storefront language.

Avoid:
- Reducing Greenpoint to a single ethnic signifier.
- Decorative stereotypes.

Why it matters:
- The scene needs to nod to Greenpoint's Polish identity without flattening it.

### 7. Peter Pan Donuts

Source: https://www.peterpandonuts.com/

Borrow:
- Long-running neighborhood-staple feeling.
- Classic storefront presence.
- Early-morning bakery energy as ambient mood.

Avoid:
- Overclaiming endorsement.
- Turning the place card into a review.

Why it matters:
- Peter Pan is a strong visual and cultural anchor for the first scene.

### 8. Karczma

Source: https://karczmabrooklyn.com/en/contact/

Borrow:
- Polish restaurant identity.
- Greenpoint Ave anchor.
- Warm, recognizable destination quality.

Avoid:
- Fictional stories attached to the business.
- False adjacency if the diorama compresses geography.

Why it matters:
- Karczma helps the first scene feel specifically Greenpoint rather than generic Brooklyn.

### 9. Greenpoint Ave G Station

Source: https://www.mta.info/press-release/mta-announces-greenpoint-av-g-station-now-fully-accessible

Borrow:
- Transit anchor.
- Street-level subway entrance/elevator/signage as orientation.
- Green G-line identity as a compact icon system.

Avoid:
- Turning the prototype into a transit map.
- Incorrect station entrance placement.

Why it matters:
- The station gives the diorama an immediate local anchor and a reason for pedestrian life.

### 10. User-Provided OCCII Community Drinks Flyer Mood

Source: User-provided visual reference, inspected during visual preproduction.

Borrow:
- Chunky pixel fonts.
- Warm DIY community-event feeling.
- Late-90s / early-2000s simulation energy.
- Plumbob-adjacent social marker inspiration.
- Isometric interior/composition mood.

Avoid:
- Direct mimicry.
- Copying specific layout, typography, or icon shapes.

Why it matters:
- This remains an important mood reference for emotional warmth and UI confidence, but it must not overwhelm storefront, place, or map clarity.

## Historical Visual Territories

These were earlier production proposals for the Greenpoint DIY Sim thesis. They are not final creative decisions and are not current approval candidates unless Batu explicitly reactivates one.

Codex may recommend a territory, but Batu owns final approval.

### Territory A - Storefront Sticker Diorama

Visual thesis:
- A warm, compact Greenpoint corner rendered like a handmade isometric storefront model, with sticker-like UI cues layered on top.
- The world is grounded and locally specific; the interface provides the DIY/flyer attitude.

What to borrow:
- Greenpoint storefront density, awnings, mixed brick/vinyl surfaces, older sign bands, tree pits, bike racks, subway entrance hardware.
- Late-90s simulation readability: chunky silhouettes, clear clickable objects, restrained ambient motion.
- DIY flyer language for markers, labels, and cards: bold outlines, stamped shapes, imperfect alignment, high-contrast accent color.

What to avoid:
- Generic Brooklyn coffee-shop shorthand.
- Too-clean vector isometric assets.
- Full flyer chaos inside the architecture itself.
- Direct plumbob copying.

Camera/proportion rules:
- Fixed 2:1 isometric ground plane.
- Slightly compressed block depth so the scene reads as one handheld corner.
- Buildings are 2-3 stories visually, even when simplified from real proportions.
- Storefront bases should be oversized enough to make signs and doors legible.
- No camera rotation or perspective depth tricks.

Palette direction:
- Base: brick red, old cream, faded green, asphalt blue-gray, off-white, warm bakery yellow.
- Accent/UI: acid green, tomato red, electric blue, black ink.
- Keep saturation mostly in signage and UI; keep building mass warmer and slightly worn.

Line/surface/detail treatment:
- Medium dark silhouette lines on buildings and props.
- Light surface texture: brick rows, worn awning stripes, window highlights, sidewalk cracks.
- Details should be clustered near street level; upper floors stay simpler.
- Pixel-inspired crispness without true low-res pixel constraints.

Signage treatment:
- Signs are the main place identifiers.
- Real names appear only on correct businesses.
- Peter Pan can use classic bakery sign rhythm without copying exact branding pixel-for-pixel.
- Karczma can use warm Polish restaurant cues if placed truthfully.
- Placeholder storefronts must be clearly generic or labeled placeholder in production docs.

UI marker/card treatment:
- Hotspot marker: sticker-like diamond or angled tab, Sims-adjacent but not plumbob-shaped.
- Label chip: chunky, off-white fill, black outline, one accent corner or tape-strip detail.
- Card: sharp-ish rectangular flyer card with source/disclaimer footer; not SaaS-soft and not full game HUD.

What would make this direction fail:
- If the world looks like stock isometric buildings with Greenpoint labels pasted on.
- If the UI becomes louder than the map.
- If the scene feels tasteful but not playful.
- If the first screenshot lacks a clear local anchor.

### Territory B - Corner Flyer Overprint

Visual thesis:
- A more saturated, graphic treatment where the Greenpoint corner feels like it has been screenprinted, photocopied, and overlaid with local sticker/flyer energy.
- The architecture remains truthful, but the surface language is bolder and more poster-like.

What to borrow:
- DIY poster layering, risograph-like color overlap, sticker clusters, chunky type, slight registration offsets.
- Greenpoint street objects: taped flyers, handbills, sandwich boards, window posters, poles, utility boxes.
- Tycoon-era scene density, but with a flatter graphic punch.

What to avoid:
- Making Greenpoint look generically Bushwick.
- Overprinting so much texture that buildings and click targets become hard to read.
- Treating every surface as a poster.
- Turning the MVP into an event/flyer system.

Camera/proportion rules:
- Same fixed isometric camera as Territory A.
- Buildings can be flatter and more graphic, with stronger front-facing sign planes.
- Props may be slightly oversized for readability.
- Scene edge can feel like a printed cutout or zine panel.

Palette direction:
- Base: muted brick, asphalt, cream, bottle green.
- Overprint accents: fluorescent green, hot coral, cobalt, mustard, black.
- Use 2-3 loud accent colors only; avoid rainbow clutter.

Line/surface/detail treatment:
- Heavier black linework than Territory A.
- Selective halftone, dither, stamp, or photocopy grain on UI and posters.
- Surfaces can use flat color blocks with roughened edges.
- Fewer tiny architectural details; more bold shape contrast.

Signage treatment:
- Storefront signs can be bolder, flatter, and more poster-like.
- Window flyers and stickers are allowed as surface texture but must not imply real events.
- Polish signage influence comes through sign density and lettering rhythm, not caricature.

UI marker/card treatment:
- Hotspot marker: sticker burst, tape flag, or overprinted arrow tab.
- Label chip: looks pasted onto the scene, with slight offset shadow.
- Card: flyer/poster card with strong header block, source footer, and one loud accent stripe.

What would make this direction fail:
- If it loses Greenpoint specificity and becomes generic creative-neighborhood chaos.
- If interaction targets are visually noisy.
- If the screenshot feels like a poster rather than an explorable diorama.
- If it accidentally implies events/flyers are part of MVP functionality.

### Territory C - Civic Pixel Miniature

Visual thesis:
- A cleaner, more map-adjacent isometric miniature that emphasizes legibility, factual place representation, and civic/local-map clarity, with only a light DIY UI accent layer.
- This is the most restrained and scalable direction.

What to borrow:
- Isometric city-builder clarity, simple material blocks, readable street geometry, clean icons, source-backed place cards.
- Greenpoint architectural rhythm and transit anchor.
- Museum-map or neighborhood-guide restraint, but warmed up with pixel-inspired details.

What to avoid:
- Becoming a utility map.
- Looking like municipal wayfinding.
- Losing the playful DIY-sim identity.
- Being too tasteful, quiet, or generic.

Camera/proportion rules:
- Fixed 2:1 isometric camera.
- More spatially disciplined than Territories A/B.
- Less compression of distances.
- Buildings are less exaggerated; storefront row remains readable but not toy-like.

Palette direction:
- Base: warm gray, brick, cream, deep green, muted blue.
- Accent/UI: MTA green, black, off-white, one bright flyer accent.
- Lowest saturation of the three territories.

Line/surface/detail treatment:
- Clean outlines with fewer rough edges.
- Minimal texture; use detail only where it helps identify place.
- Street furniture is precise and readable.
- Animation, if later added, should be very restrained.

Signage treatment:
- Signs are accurate, simplified, and less expressive.
- Avoid stylized fake distressing.
- Place labels stay small and controlled.

UI marker/card treatment:
- Hotspot marker: compact map-pin/diamond hybrid.
- Label chip: tidy rectangular tag.
- Card: clear information panel with subtle flyer accent.

What would make this direction fail:
- If it feels like a polished local-services map instead of a playful diorama.
- If the screenshot lacks warmth and visual surprise.
- If the UI becomes too restrained to carry the DIY energy.
- If it optimizes for scalability before charm.

## Historical Codex Recommendation - Not A Final Decision

Codex recommends **Territory A - Storefront Sticker Diorama** for the MVP.

Why:
- It best matches the tightened objective: one screenshot and one click should feel distinctive, local, and expandable.
- It protects Greenpoint specificity by keeping the architecture grounded.
- It gives enough DIY/flyer energy through UI and signage without turning the whole scene into generic creative chaos.
- It is more visually memorable than Territory C and less likely to become noisy than Territory B.

Decision status:

> Historical recommendation only. No final visual direction is approved. Community Pixel Storefront is historical/exploratory and superseded by the Batch 11 radical concept sprint process.

## Approval Gate For Static Style Frame

Static style-frame production must not begin until:

- Batu approves a visual direction.
- Batu approves the static style-frame composition plan.
- The composition/style approval is supported by at least one lo-fi exploratory visual artifact or reference board clearly labeled "lo-fi / exploratory / not final."

If Batu approves a visual direction with edits, Codex must update this document and `docs/DECISION_LOG.md` before producing the style frame.

## Shared Style Rules

### Camera

- Fixed isometric camera.
- No rotation.
- Handheld diorama feel, not utility map.
- Scene framed as a miniature corner with visible edges or implied edges.

Recommended default:
- 2:1 isometric tile logic for ground plane.
- Slightly exaggerated building height for charm and readability.

Requires approval:
- Exact camera angle and tile proportions.

### Pixel Density

- Pixel-inspired HD.
- Crisp blocky geometry.
- Readable at modern desktop/tablet sizes.
- Avoid true low-res pixel art constraints.

Recommended default:
- Draw at high resolution, use pixel-informed edges, simplified planes, chunky details, and crisp non-blurry scaling.

### Color

Base world:
- Brick reds.
- Aged creams.
- Weathered greens.
- Asphalt blue-grays.
- Bakery warm yellows.
- MTA green accent.

UI/flyer layer:
- Acid green accent.
- Tomato red.
- Electric blue.
- Warm off-white.
- Black ink.

Guardrail:
- Avoid a one-note beige, brown, or slate palette.
- Avoid dominant purple-blue gradients.

Requires approval:
- Final palette swatches.

### Building Proportions

- Slightly chunky and compressed.
- Strong storefront bases.
- Clear signage bands.
- Rooftop units and cornices simplified.
- Windows grouped for rhythm, not architectural exactness.

Guardrail:
- Do not make buildings toy-like enough to lose Greenpoint texture.

### Line Weight

- Medium-weight dark outlines on key silhouettes.
- Lighter interior detail lines.
- UI outlines can be chunkier than world outlines.

Guardrail:
- Avoid overly clean vector illustration.
- Avoid noisy pixel crust.

### Signage

- Storefront signs should be the strongest local identifiers after building shape.
- Use fictionalized rendering of sign shapes/colors where necessary, but keep real names only on correct businesses.
- Polish signage influence may appear through letter density, sign placement, and awning rhythm rather than stereotypes.

Guardrail:
- No fake endorsement or invented promotional claims.

### UI Style

- Chunky label chips.
- Sticker-like hover/tap marker.
- Rectangular card with sharp-ish corners, no overly rounded soft SaaS cards.
- Pixel/flyer-inspired hierarchy.
- Clear source/disclaimer area.

Guardrail:
- UI should not become a full game HUD.

### Animation Restraint

Use only small ambient loops:

- Steam puff.
- Subway entrance light blink.
- Sign flicker.
- Bike or tiny pedestrian loop.
- Dog tail/body wiggle as optional non-core detail.

Guardrail:
- No character system.
- No gameplay affordance implied by ambient props.

## Too Much / Too Little Guardrails

Too cute:
- Oversized smiling props.
- Toy-town proportions.
- Excessive bounce.
- Soft rounded UI everywhere.

Too generic:
- Unbranded rectangular storefronts.
- No Polish/Greenpoint texture.
- Generic Brooklyn coffee-shop shorthand.
- Stock isometric city assets.

Too gamey:
- XP-like feedback.
- Quests.
- Inventory.
- Character stats.
- HUD overload.

Too documentary:
- Literal map precision.
- Muted realism.
- No graphic attitude.
- Dry information cards.

## Static Style Frame Plan

Proposed frame:

- One 16:9 desktop screenshot composition.
- Manhattan Ave / Greenpoint Ave-inspired corner.
- Peter Pan Donuts on Manhattan Ave side.
- Karczma on Greenpoint Ave side if composition can preserve correct street logic.
- G station entrance/elevator/sign as transit anchor.
- 1-2 unnamed filler storefronts labeled as placeholder only.
- Sidewalk clutter: bike rack, trash bags, tree pit, utility pole, small sign, subtle steam.
- No interactive UI except optional one proposed hotspot marker and one closed label chip.

Purpose:

- Test visual language before app implementation.
- Prove screenshot appeal.
- Establish world/UI balance.

Approval gate:

- Batu must approve the visual direction and static style-frame composition before Codex creates the frame.
- The style-frame composition approval must be supported by at least one lo-fi exploratory visual artifact or reference board clearly labeled "lo-fi / exploratory / not final."
- React/Vite/Pixi implementation remains blocked until the static style frame is approved.
