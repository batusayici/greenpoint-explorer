# Phase 4M-R6A Franklin Hero Decomposition + Grammar Spec

Status: implementation contract for 4M-R6B.

R5 proved the measured/procedural lane can reach directional recognizability. R6 should preserve the R5 measured trace as alignment scaffold, then place opaque Franklin-specific hero modules over it. The useful output is not only a better Franklin corner; it is also a small reusable facade/street grammar for later Manhattan and corridor use.

## 1. Overall Massing

- Broad fused corner building mass: `measured_from_existing_trace`, `art_directed_approximation`, `reusable_module_candidate`
  - Widen the hero read and visually fuse the front and side return into one building, not separate panels.
- Roof/parapet/cornice silhouette: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Use a heavy roof box, layered parapet, corner caps, and cornice teeth/bands.
- Attached neighbor relationship: `measured_from_existing_trace`, `art_directed_approximation`, `reusable_module_candidate`
  - Keep neighboring low side storefront/mass visible but subordinate.
- Side-return depth and integration: `measured_from_existing_trace`, `evidence_informed`, `reusable_module_candidate`
  - Add solid side wall, side storefront return, rear plane hierarchy, and roof wrap.

## 2. Facade Rhythm

- Floor count: `measured_from_existing_trace`
  - Keep three upper rows plus storefront base.
- Bay count: `measured_from_existing_trace`, `evidence_informed`
  - Preserve six-ish front bays, but shift the visual read toward broader real-building spacing.
- Taller/darker windows: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Replace pale UI tiles with darker inset glass, heavier frames, and deeper recesses.
- Arched/heavier top-row cue: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Use simplified arched caps or strong lintel caps where the evidence/benchmark supports the upper-row feel.
- Lintels/sills: `evidence_informed`, `reusable_module_candidate`
  - Make stone sills/lintels larger and darker, with consistent depth.
- AC boxes: `evidence_informed`, `reusable_module_candidate`
  - Add fewer but more legible boxes attached to specific bays, not a scatter of white squares.
- Masonry relief / brick banding: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Use horizontal relief strips, subtle darker brick panels, corner piers, and decorative row bands.

## 3. Storefront

- Wrapped black awning/canopy: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Make the awning a thick, sloped, wrapped volume with a front face and side return.
- Tan/wood sign-band zone: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Use tan/wood striping as a continuous band; no exact text or logos.
- Glass corner volume: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Add a darker inset glass corner/wrap with a slight chamfer feel.
- Denser mullions: `evidence_informed`, `reusable_module_candidate`
  - More thin vertical mullions and rails, not a few chunky bars.
- Recessed doors: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Indicate door depth with dark recess blocks and threshold shadows.
- Chamfer/wrap feel: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Use offset planes and angled-looking corner panels, even if approximated with rectangular meshes.
- Storefront-to-sidewalk contact: `art_directed_approximation`, `reusable_module_candidate`
  - Add dark base plinths and contact shadows at the sidewalk edge.

## 4. Side Return

- Brick side plane: `measured_from_existing_trace`, `evidence_informed`, `reusable_module_candidate`
  - Side wall must read as a solid continuation of the corner building.
- Side storefront return: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Wrap black awning, tan band, and glass bays around the side.
- Side bay projection: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Add a brown projecting bay volume with inset glass.
- Fire-escape lattice cue: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - Use thin black rails, platforms, and diagonal ladder strokes; keep it symbolic but readable.
- AC/window hierarchy: `evidence_informed`, `reusable_module_candidate`
  - Group AC boxes under/near specific side windows.
- Rear wall hierarchy: `art_directed_approximation`, `reusable_module_candidate`
  - Side-rear plane should be quieter and darker than the main corner face.

## 5. Street Grounding

- Broader sidewalk slab: `measured_from_existing_trace`, `art_directed_approximation`, `reusable_module_candidate`
  - Increase slab presence and make the corner platform feel weight-bearing.
- Curb radius / corner geometry: `art_directed_approximation`, `reusable_module_candidate`
  - Use stepped/chamfered curb pieces to imply the radius.
- Crosswalk scale: `measured_from_existing_trace`, `art_directed_approximation`, `reusable_module_candidate`
  - Wider, bolder stripes that sit at the intersection edge.
- Tactile pads: `evidence_informed`, `reusable_module_candidate`
  - Red pads at the curb ramps.
- Pole/sign stack: `evidence_informed`, `art_directed_approximation`, `reusable_module_candidate`
  - One dominant black pole with signal/sign blocks; no exact sign copy claims.
- Bikes/boxes/generic clutter: `art_directed_approximation`, `reusable_module_candidate`
  - Use non-claim context objects only if they improve scale and recognizability.
- Contact shadows: `art_directed_approximation`, `reusable_module_candidate`
  - Add dark strips under awning, storefront base, pole, boxes, and side objects.

## 6. Rendering Fidelity

- Opaque final-look QA modules dominate: `art_directed_approximation`, `reusable_module_candidate`
  - R6 should visually suppress legacy translucent Franklin planes in hero views.
- Translucent scaffold noise reduced: `art_directed_approximation`
  - Keep alignment context in corridor view, but not as the main Franklin close read.
- Material contrast: `art_directed_approximation`, `reusable_module_candidate`
  - Push red brick, cream/stone cornice, black awning, tan sign band, dark glass, and sidewalk contrast.
- Lighting/camera crop: `art_directed_approximation`
  - Use tighter Franklin cameras if needed so the review sees the benchmark closure, not the UI frame.

## Reusable Grammar To Extract In R6C

- Corner storefront wrap type A.
- Black awning/canopy type A.
- Tan sign-band type A.
- Brick window stack type A.
- Cornice/parapet family A.
- Side-return bay/fire-escape type A.
- Street grounding kit A.

## R6B Implementation Rule

Build the Franklin overlay as named helper modules inside the existing runtime path. If the runtime file starts becoming hard to navigate, stop and recommend extracting a dedicated Franklin hero module/component before adding more geometry.
