# Hero Facade Build Log

Append-only ledger of every hero facade we build, so the pipeline gets cheaper
as we scale. Pair with the **Registration Playbook** in `GENERATION_KIT.md`.

**The loop (every building):**
1. **Before:** read the Registration Playbook + this whole log.
2. **Build** per the playbook.
3. **After:** append an entry below — render version, derive settings, the
   building's quirks, what went wrong + **iteration count**, and the one-line
   lesson. Promote any *durable* lesson up into the playbook (and, if
   cross-session-critical, into agent memory).

**Score to beat (fix commits / re-derive rounds):** Premier ~10 · Sonny's ~15
→ **target ≤2.** If a build approaches the old numbers, stop and check whether
a banked fix regressed or a playbook rule was skipped.

---

## Standing checklist (distilled — run top to bottom)

- [ ] **Photos cover every face** the render must draw (a face not photographed
      is a face the render invents). Wide per face + a corner shot.
- [ ] **Render once**; audit the raw render against the photos (storey count,
      columns/face, ground-floor openings in order, corner condition).
      Re-render only for content/structure, never for a few-percent placement.
- [ ] **Derive on the FLAT texture; gate on a 2× overlay**, not 3D, not
      downscaled. Vertical misalignment is never parallax.
- [ ] **Measure every opening individually** (density/brightness profiles).
      Each window full lintel→sill; no uniform-grid or uniform-height guesses.
- [ ] **Spec the ground floor too** (storefront top, awning band, doors), not
      just windows.
- [ ] **In-engine: inspect the corner + every camera-visible return at zoom.**
      Flat-color-where-texture-expected = geometry/wiring bug.
- [ ] **For any artifact: name the mesh before editing** (query the scene).
- [ ] **Ornate openings? Use them to check the fold.** An arch/oculus split by
      the kink means the fold is wrong (see 144 Franklin). Tag `shape` + seed
      `springY`, then register curves in the editor — never hand-author them.
      Capability and full pixel-registration are two passes; mark partial
      registration in the spec `status`, don't claim "done."

## Reusable scene-graph inspector (paste into preview_eval)

```js
// Find meshes near a world point [X,Y,Z]; reports color/map/slot/bbox.
(() => { let s=null; for(const k of Object.keys(window)){const v=window[k]; if(v&&v.isScene){s=v;break;}}
  s.updateMatrixWorld(true); const out=[];
  s.traverse(o=>{ if(!o.isMesh||!o.geometry) return;
    const g=o.geometry.clone(); g.applyMatrix4(o.matrixWorld); g.computeBoundingBox(); const b=g.boundingBox;
    if(b.max.x>X-0.15&&b.min.x<X+0.15&&b.max.y>Y-0.15&&b.min.y<Y+0.15&&b.max.z>Z-0.15&&b.min.z<Z+0.15){
      const m=o.material; out.push({col:m&&m.color?m.color.getHexString():'?', map:!!(m&&m.map), slot:o.userData&&o.userData.facadeSlot||null,
        bx:[+b.min.x.toFixed(2),+b.max.x.toFixed(2)], by:[+b.min.y.toFixed(2),+b.max.y.toFixed(2)], bz:[+b.min.z.toFixed(2),+b.max.z.toFixed(2)]}); }});
  return JSON.stringify(out); })()
// To confirm: set the suspect o.visible=false, then force a render with a 1px drag:
// const c=document.querySelector('canvas'); ['pointerdown','pointermove','pointerup'].forEach((t,i)=>c.dispatchEvent(new PointerEvent(t,{clientX:400+i,clientY:400,buttons:t==='pointerup'?0:1,bubbles:true,pointerId:1})));
```

---

## Per-building entries

### Premier / Franklin Organic — BIN 3322608 (SW corner) — SHIPPED
- **Texture:** `premier-franklin-organic--corner-v4.png`. Fold `PREMIER_KINK=0.478`.
- **Quirks:** facade group (Premier + Pizza sister); the contract said the
  corner was at 0.52, photos said 0.478 — photos won (DECISION_LOG 2026-06-12).
- **Cost:** ~4 renders, ~10 fix commits. The expensive lesson: specs were
  *authored from a contract*, not measured from the render → built the whole
  "derive from the render" doctrine and `derive-facade-spec.mjs`.

### Sonny's Corner — BIN 3064811 (SE corner) — SHIPPED (v3)
- **Texture:** `sonnys-corner--corner-v3.png`. Fold `SONNYS_KINK=0.734`.
- **Derive settings:** mauve-on-mauve, so blob detection failed. Used
  `--wall 138,93,99`; columns from not-wall density in the top row band; rows
  from a per-row brightness profile down a clean column; each window snapped to
  its full lintel→sill extent. Only the greenpoint face is camera-visible.
- **Quirks (each a first for the pipeline):** split collinear Greenpoint
  frontage (1.47m off-cut + 19.95m); back-facing Franklin return at the corner;
  corner-wrapping bar storefront; ALTER BROOKLYN is a *separate* neighbor
  (excluded); irregular AI render (windows drift vertically per column, ~0.17
  tall double-hung).
- **Cost:** ~15+ rounds. Where it went and the lessons (all now in playbook):
  - v1 render wrong (dropped floor, flat strip, neighbor) → reusable
    photo-truth prompt + subject isolation.
  - Brown corner wall → collinear edge merge (engine, banked).
  - Corner "wedge" → ~6 guesses before naming the mesh → **name-the-mesh rule**;
    real causes: awning caps, storefront top-reveal, back-facing wall (all banked).
  - Windows: 5 rounds → blob-fail → phantom column → rows too high → boxes too
    short. **Verify on 2× flat overlay; measure every opening full-height.**
- **Net new durable assets:** engine fixes (collinear merge, back-face cull,
  awning caps, storefront `revealTop`); the scene-graph inspector above.
- **Multi-angle pass (2026-06-15):** rotation (3.2) exposed two corner defects
  the fixed NE camera hid. (1) **Cornice corner notch + non-flush Franklin
  return:** the Franklin face had no cornice spec, so it fell back to the
  geometric parapet ring while Greenpoint carried a drawn cornice — they didn't
  meet, leaving a light top-cap (`REVEAL.bottom`) notch at the fold. Fix: give
  the Franklin face its own cornice entry **and** add `cornerRight`/`cornerLeft`
  to both cornices so the crown extends past the fold and samples the
  neighbour's artwork (same trick Premier uses). **Rule:** every camera-visible
  return of a corner hero needs its own cornice + matching corner-wrap flag, or
  rotation reveals a parapet-ring/cornice mismatch. (2) **Window wrapping the
  corner:** v3 painted the C5 Greenpoint column hard against the fold (glass
  faceX 0.921-1.012, straddling onto the Franklin return) — no brick pier. The
  recess follows the paint, so the box couldn't just be moved (it would land on
  blank brick while the painted window stayed). Fix without a re-render: a
  **surgical texture patch** — snapshot the PNG, shift the C5 brick-wall band
  left 110px (~1.6m), clone clean pier brick into the vacated corner strip
  (full-height vertical move keeps mortar lines continuous), then shift the
  recess rects by the same 110px. **Rule:** a window painted across the fold is
  a *render* error; for a one-column setback a snapshot-based pixel move beats a
  full re-render (git keeps the original). For multi-column drift, re-render.
  **Cost:** ~1 pass each, caught and fixed live at angle 2/4.
- **Cornice "white band" follow-up:** a bright cream band read along the Franklin
  cornice from the elevated angles. Two layered causes: (a) the cornice **top cap**
  used `REVEAL.bottom` (lit-stone tan) — fine grazed by the fixed NE camera, but a
  bright slab when looked down on; switched it to `CROWN` (dark) so a Brooklyn
  cornice top reads as tar/metal. (b) the render left a **light coping/sky strip at
  the texture top** (faceY ~0.985-1.0, thicker on the Franklin slice) — geometry
  top is taller than the painted molding, so the cornice front face sampled it.
  Darkened that top strip in the PNG (repaint light pixels in the top ~18 rows to
  the molding tone). **Rule:** the cornice top cap should be dark, and the painted
  cornice must reach the texture top — a light margin there becomes a "roof higher
  than texture" band once the camera can look down on the roofline.

### Sereneco — BIN 3337033 (NW corner) — greenpoint shipped (flat), franklin stable
- **Faces:** franklin (east, 57m Franklin St) keeps `sereneco--corner.png`
  (`coverMeters: 12`, `SERENECO_KINK=0.496`) — Batu confirmed accurate, left
  untouched. **greenpoint (south, 22.6m Greenpoint Ave)** — the green
  "Dinner·Brunch·Bar" awning frontage — was never drawn right and never shown
  (back-facing at the old fixed camera). The multi-angle rig (3.2) exposed it.
- **Render:** Batu re-rendered as `sereneco--corner-v2.png` (1916×821) — a
  corner UNWRAP. The real corner fold sits at **u≈0.585**: left `0..0.585` is
  the Greenpoint face (Dinner·Brunch·Bar awning → black door →
  WINE·BEER·COCKTAILS → BRUNCH·DINNER bays); everything right of it is the
  **Franklin return** (Sereneco green-tile corner ENTRANCE + wood door, then
  AZURE GOURMET — a *real separate* tenant, Batu-confirmed correct on Franklin).
  Wired as a **per-face texture**: the greenpoint face overrides `composite.key`
  with its own PNG, mapping `u0:0→u1:0.585` onto the 22.6m greenpoint edge;
  franklin keeps the original `corner.png` slice (`u0:0.496→1`), which begins
  exactly at the green-tile entrance — so the two walls meet at the corner with
  no gap or overlap. **Flat map, no recess spec yet** — depth is open polish.
- **Bug caught (2 fixes):** (1) first wired greenpoint at `u0:0→u1:1`, pulling
  AZURE GOURMET onto the Greenpoint face → duplicated the franklin slice.
  (2) Then cut to `u1:0.80` to drop AZURE GOURMET — but `0.80` still sat *past*
  the fold, so the **Sereneco green-tile entrance + wood door** (u≈0.585–0.66,
  derived) duplicated onto Greenpoint when they belong on Franklin (Batu: "the
  door is on the franklin side, not greenpoint"). Final cut `u1:0.585` lands on
  the brick corner right after BRUNCH·DINNER (bay ends u≈0.576; wood door
  u≈0.615–0.66 — now past the cut). Verified in-engine at angle 4.
  **Lesson:** the corner fold is where the *Greenpoint storefronts end*, not
  where AZURE GOURMET begins — find the fold by the last Greenpoint feature,
  cross-check that the franklin texture picks up at that same physical edge.
- **Quirks:** the two street faces are **separate textures meeting at the real
  90° brick corner** — no single-image unwrap needed, because Sereneco's
  storefronts don't wrap the chamfer (unlike Premier/Sonny's). `AZURE GOURMET`
  on the corner-end storefront is a **real, Batu-verified separate tenant**
  (2026-06-16) — upscale deli at 113 Franklin. It now has its own place card
  (`azure-gourmet`, active/verified) and its storefront `{x0:0.51,x1:0.834}`
  carries `placeId:"azure-gourmet"`, so clicking it selects Azure (not Sereneco)
  while the rest of the building stays Sereneco. (Earlier flagged as an invented
  sign — that flag is cleared.)
- **Cost:** ~1 iteration — green awning read correct and unmirrored on the
  first in-engine check (orientation `leftEnd:"west"` right first try).
- **Durable lesson (banked):** a face can carry its **own** texture via a
  `key` override on the composite face entry (`FACADE_COMPOSITES`), so one
  building can mix an accurate old slot with a fresh re-render without one
  regressing the other. Corner heroes whose storefronts **don't** wrap the
  chamfer can use two single-face textures instead of a corner unwrap.

### 144 Franklin Ave — BIN 3064675 (NE corner) — SHIPPED (facade-only, no card)
- **Texture:** `144-franklin-v2.png` (1491×1055). Fold `FRANKLIN_144_KINK=0.155`.
  One continuous unwrap: leftmost single bay = Franklin return (west face),
  the long 5-bay run = Greenpoint frontage (south). 1895 Romanesque Revival —
  rusticated brownstone base with arched openings, terracotta upper floors,
  giant round-arch 2nd-floor windows, oculi + rect windows at the 3rd floor.
- **Registration quirk (new):** standalone hero with NO entry in the R10G wrap
  truth fixture. Registered via `FACADE_GROUP_BINS["3064675"]="144-franklin"`
  — gives it a placeId + wall-by-wall hero build; the vertex-snap flush in
  `sceneFrame.js` skips it (no same-placeId hero in the fixture), so it keeps
  its own classified edges. Clean path for adding a hero without touching truth
  data or adding a place card. **Banked:** facade-group bins double as a
  standalone-hero registration hook.
- **Kink vs proportion (lesson confirmed):** real walls are 10.5m : 25.3m
  (proportional fold ≈0.29) but the render DREW the Franklin return as ~1 bay
  (fold ≈0.155). Per the playbook the drawn fold wins — and it was right: the
  single drawn Franklin bay maps onto the real wall as the giant-arch bay,
  matching `franklin-northeast-franklin.png` exactly. The feared horizontal
  stretch never materialised; don't pre-emptively add `coverMeters` to "fix" a
  proportion gap before checking the render in-engine.
- **Derive settings:** the default not-wall detector FAILED hard (picked the
  brownstone base rgb(149,103,77) as wall → whole red-brick run read as one
  blob). Switched to a **bright-glass detector** (lum>158 mask → 2× erode →
  connected components → consolidate sash splits within a floor by x-overlap +
  small vertical gap), plus a dark-on-brownstone pass for the base openings.
  Far better than the wall detector on a dense ornate facade. Regularised into
  two upper window bands + base openings; wrap-cornice on both faces.
- **Cost:** ~1 in-engine pass. Geometry/wiring correct first try (fold, faces,
  orientation, no mirroring). 165 textured recess meshes built.
- **Open polish:** (1) small light notch where the cornice wraps the corner
  (Sonny's "white cap" class — top cap wants CROWN tone). (2) recess rects are
  regularised, not pixel-perfect — refine in the recess editor. (3) per-view
  back-face cull doesn't toggle for 144 (`visTot` constant at 176 across
  angles) — harmless (solid box, no see-through) but means rear walls always
  render; wire 144 into the cull registry later.
- **Gotcha:** the `import.meta.glob` texture loader bundles EVERY png in
  `assets/textures/franklin/` — a superseded/faulty render left in the folder
  ships ~3MB of dead weight. Delete faulty textures, don't just stop
  referencing them.
- **Kink correction (2026-06-15, against the Franklin-face reference photo):**
  the first pass shipped `0.155`, which BISECTED the giant Franklin arch — half
  the Franklin bay (arch, 2nd-floor window, base door+window) spilled onto the
  Greenpoint slice. The reference made it obvious: the Franklin face is the
  whole giant-arch bay. Real fold is `0.29` (arch spans u0.03..0.28; matches the
  10.5m:25.3m wall proportion). **Lesson — the earlier "drawn-fold-wins" call
  was right in principle but I read the wrong pier:** an interior pilaster at
  0.155 is NOT the corner. Confirm the fold against the SINGLE-FACE reference
  photo (which face shows what), not just the unwrap — count the openings that
  belong to each face and put the fold after the last one. The px/m match
  (39 vs 40) is the tell that the fold is proportionally right.
- **Cornice corner-notch (the "white notch" — same family as Sonny's cap):**
  a bright sliver at the fold was an **outer-miter GAP**, not a light texture
  pixel. Cause: the `cornerLeft`/`cornerRight` wrap flags were on the WRONG
  ends. The flag must sit on the **corner-adjacent face-local edge**: with the
  unwrap reading Franklin→Greenpoint, the corner is the Franklin slice's *right*
  edge (`cornerRight`) and the Greenpoint slice's *left* edge (`cornerLeft`).
  I'd set them inverted, so each crown extended at its OUTER end and the corner
  stayed open. **Rule:** corner edge = the slice edge at the kink; map it from
  `leftEnd` (leftEnd names which world end is texture-x0, so the *other* end is
  the kink/corner unless the neighbour slice begins at x0). Verify by querying
  the two cornice-front meshes — their corner ends must share a point (here
  they met at (0.612,-0.919) after the fix; before, 0.65 vs -0.96 = the gap).
  **Gotcha:** JSON-spec edits don't always hot-reload — the geometry kept the
  old flags until a full page reload. Reload before re-judging a spec change.
- **Curved recess profiles (arch + oculus) — capability build, 2026-06-15/16:**
  first hero to need non-rect openings (giant 2nd-floor round arches, 3rd-floor
  oculi, rusticated ground arches). Shipped via design-spec → 6-task plan →
  subagents (`docs/superpowers/{specs,plans}/2026-06-15-curved-recess-profiles*`).
  - **Cost: ~1 in-engine pass for the geometry.** What bought that: the curve
    math was isolated in one pure unit-tested module (`facadeProfiles.js`
    `openingProfile`) — closed-loop / crown-at-y1 / spring-tangent / circle
    symmetry asserted before any wiring — and the schema bump (v0.5→v0.6) was an
    additive optional `shape` field defaulting to `"rect"`, so `complementRects`
    and every existing building stayed byte-for-byte. **Bank the pattern for any
    new geometry primitive.** Durable rules promoted to the kit's "Shaped
    openings" section.
  - **Where iterations went (all now playbook rules):** fold read off the wrong
    pier (0.155 bisected the giant arch → 0.29, caught on the single-face photo)
    — *a bisected arch is the fold-error tell*; cornice corner-wrap flags on the
    wrong ends (open miter gap); JSON spec edits not hot-reloading.
  - **Open authoring tail (the lesson):** only the ground-floor arches are truly
    editor-registered; the giant arches + oculi are a first-pass *overlay-derived*
    placement (spec `status` says so) still owing an editor fine-tune. Building
    the shape *system* and pixel-registering an ornate facade in one plan
    overran — land capability + rough placement, then a dedicated editor pass.
  - **Accepted tradeoff (locked in spec, not a bug):** curved pane meets flush
    filler with no soffit bridge → hairline seam at recess depth; curved
    archivolt/oculus ring is the clean follow-up.

### Premier Organic — Greenpoint bay → 3-facet oriel (2026-06-16)

- **What:** the projecting bay was a flat rectangular box (one textured front
  quad + four perpendicular tinted cheeks) — it read as a billboard. Converted
  it to a real trapezoidal oriel: a flat center facet + two angled return
  facets, narrowing from the wall opening to a center front face.
- **Approach (zero re-render — the whole win):** the painted elevation already
  contains the bay's three window columns side-by-side, so the geometry just
  *folds* that flat texture. Each facet samples its own slice of the bay's
  texture u-range (`x0..xc0` left return, `xc0..xc1` center, `xc1..x1` right
  return); UVs are continuous at the `xc0`/`xc1` seams, so the side windows land
  on the angled returns foreshortened. Top/bottom close with flat-tinted dark
  trapezoidal caps (cornice-shadow / soffit) — never textured.
- **How it's authored:** opt-in per spec — `bay.plan: "oriel3"` +
  `centerFraction` (default 0.36, the reference-sheet ratio). Absent `plan` ⇒
  the old flat-box path, byte-identical (proven by the integration diff). Splay
  angle is *emergent* from `centerFraction` + `projectionM` + face width, not
  authored directly. Premier kept `projectionM: 0.6`.
- **Iterations: ~0 placement rounds.** Pure-math `oriel3Plan` unit-verified
  (`scripts/verify-oriel3-bay.mjs`: inset math, seam continuity, clamping,
  5-mesh count), then verified live in-engine — the angled left return with its
  folded side window read correctly on the first build, no z-fighting at the
  wall seam, dark caps tucked under the cornice.
- **Lesson (durable):** a faceted projection is a *texture fold*, not new
  artwork — partition the element's existing u-range across the facets and keep
  the seam UVs shared. Reusable for any future oriel/bow window.
- **Verification gotcha:** the runtime canvas has no `preserveDrawingBuffer`, so
  `canvas.toDataURL()` returns a blank frame — use `preview_screenshot` (the
  presented frame) for proof shots, not a DOM-side data URL.

### The Astral — BIN 3064408 (184 Franklin) — IN PROGRESS (first full-block hero)
- **Update (2026-06-23, v2 oriel/recess pass):** v1's full-facade render drew the
  oriels FLAT (single punched windows) → `oriel3` had no side-panes to fold (would
  smear grey). Re-rendered as `astral-apartments--franklin-full-v2.png` with the
  bays drawn as **3-window canted bays** (render pkg `astral-full-facade.v2.md`),
  2 per flank. Wired: composite→v2, `flush` removed, recessed windows
  (recessM 0.16, sill:false), 4 `oriel3` bays (projM 0.6, cf 0.36, floors 2-5),
  floor-6 arch arcade. **Engine:** added `spec.bays[]` (array) to facadeAssembly —
  a frontage carries several oriels; singular `spec.bay` unchanged (230 tests green).
  - **Bug nearly mis-fixed:** bays first read as thin dark shelves → I suspected an
    inverted frontage normal. An **exaggerate-depth test** (recessM 0.8 / projM 3)
    proved the direction is CORRECT (bays bulge toward the street) — they were just
    subtle at scene scale; the shelves are the (correct) dark top-caps. **Lesson:
    disambiguate depth direction by exaggerating, don't flip the normal on a hunch.**
  - **Open (editor pass):** offline grid is rough → windows GHOST (recess pane vs
    painted opening misalign); pixel-register in `?facadeedit=1`. Bay caps read as
    prominent dark shelves (they end just below the arcade, not under a cornice);
    center pavilion is a seed; India/Java faces unbuilt. Spec `status` marks it
    firstpass, not done. **Auto-derive + offline grid both FAIL on this inked,
    fire-escape-dense facade** — the editor is the registration tool here.
- **Status (2026-06-23):** center segment **BUILT (v1)** end-to-end — placed on
  the frontage chord, flat with hand-seeded arched recesses; verified in-engine
  at all four angles. Pending: recess-editor refinement of opening positions
  (approximate seed), centering confirm vs IMG_0971, flank renders + oriels,
  buildStatus→built. Render: `astral-apartments--franklin-center.png` (1161×1355).
  Design + status: `docs/superpowers/specs/2026-06-23-astral-frontage-plane-design.md`.
- **Build (frontage-plane model, 5 commits `b38ea6b`..`15ef9cf`):** pure
  `frontagePlane.js` (chord + segment u-map + oriel detect, TDD) → block-extract
  hero promotion in `sceneFrame.js` → `composite.frontage.segments` schema +
  chord placement in `buildHeroBuilding` → hand-seeded arched recess spec routed
  through `buildFacadeAssembly`. Auto-derive FAILED on the ornate facade (as
  predicted) → openings hand-seeded, editor-refined.
- **Durable lessons (promoted):**
  (1) A full-block hero from a **block extract** is unreachable by the bare
  `FACADE_GROUP_BINS` path — it's past the 130m main-loop radius cull; the block
  loop must promote it to a hero. Don't assume the 144-Franklin registration
  path scales to corridor heroes.
  (2) **Frontage chord must select the street-most edge band** — a U-shaped
  footprint's interior light-court walls also face the street axis and will drag
  an averaged plane metres backward. `frontageBandM` locks onto the real frontage.
  (3) The frontage-plane model (one flat chord plane, segment textures across its
  u-range, recesses via the standard spec/assembly path) is **reusable for every
  future block-front** — banked for H5.
- **Why different from every prior hero:** first full-block, not a corner.
  59-vertex segmented frontage (~5 long edges 39/22/20/19/18m + ~49 oriel
  facets). `buildHeroBuilding`'s "longest-edge-per-role" texturing (`:1845`)
  was built for clean 1–2-edge corners and cannot place a *segment* of a long
  frontage → needs the frontage-plane model (one flat plane along the chord,
  segment textures across its u-range, oriels as `oriel3` folds, arches as
  `shape:"arch"` recesses).
- **Approach (locked):** segmented high-res unwrap (one giant 65m render = ~24
  px/m, detail dies; ~18m segments = ~85 px/m). Vertical slice = center
  entrance pavilion (flat → only hard primitive is the curved recess, proven on
  144). Render package: `docs/reference/art/prompts/astral-center-segment.v1.md`.
- **Lesson (durable, pre-build):** a full-block hero is a different capability
  from a corner hero — don't assume the corner-unwrap pipeline scales. The
  frontage is a *plane*, the oriels fold off it, the bespoke texture is
  segmented for resolution. Bank the frontage-plane model for all future
  block-fronts (H5).

---

## Top pending tooling improvement

`derive-facade-spec.mjs` still ships the blob detector that failed on Sonny's;
the methods that worked (density-profile columns, per-window lintel→sill
frame-snap, 2× annotated overlay as the gate) were hand-rolled in throwaway
scripts. **Folding them into the tool is the highest-leverage change** — it
turns the ~5 window rounds into one (run → review overlay → ship). Do this
before/with Sereneco.

Second gap, surfaced by 144 Franklin: the tool emits **rects only** — it can't
detect or seed `shape: "arch"|"circle"`/`springY`, so every curved opening on an
ornate hero is hand-tagged and hand-seeded, then dragged in the editor. A
bright-glass + curvature pass that proposes a shape and a spring-line guess
(even rough) would remove the most manual step on Romanesque/arched buildings.
Fold it in alongside the density-profile work above.
