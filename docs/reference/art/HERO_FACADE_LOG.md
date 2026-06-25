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
  - **Oriel width (Batu caught):** the 4 bays were each one column too wide,
    folding an adjacent FLAT window into the oriel. An oriel bay rect must bound
    EXACTLY the painted 3-window canted group (center pane + two narrow canted
    side panes), nothing more; the extra column belongs to the flat rhythm. Re-cut
    to ~0.055 wide, symmetric about face-center, freed columns → flat windows.
    **Rule: a bay rect that includes a 4th column smears a flat window onto a
    return — size oriel rects to the 3-window group only.**
  - **Red panels above recessM ~0.14 (the frontage-hero gotcha):** deepening a
    window recess past ~0.14m made flat base-color (red) panels appear in the
    openings. Cause: the frontage chord is drawn only ~0.02 units proud of a
    redundant **typological wall** built on the same Franklin edges; a recess
    deeper than that proud gap sank the textured pane BEHIND that wall, so its
    flat color showed through. Fix: skip the typological wall on the franklin
    edges a `composite.frontage` covers (the hero assembly's panes+reveals
    enclose each opening). **Rule for every frontage-plane hero: don't build a
    typological wall under the frontage, or deep recesses punch through to it.**
  - **Open (editor pass):** offline grid is rough → windows GHOST (recess pane vs
    painted opening misalign); pixel-register in `?facadeedit=1`. Bay caps read as
    prominent dark shelves (they end just below the arcade, not under a cornice);
    center pavilion is a seed; India/Java faces unbuilt. Spec `status` marks it
    firstpass, not done. **Auto-derive + offline grid both FAIL on this inked,
    fire-escape-dense facade** — the editor is the registration tool here.
  - **Cost:** ~3 commits (build + 2 fixes), 0 re-renders after v2. Bay-width and
    red-panel both caught at the in-engine/Batu review, not by tests.
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
- **Update (2026-06-24, India + Java side faces wired + recess seed):** brought
  in the re-rendered side textures (`astral-apartments--india-full.png` 1774×887
  ≈2:1 full ~38m N wall; `astral-apartments--java-full.png` 1227×1281 ≈1:1 v3
  ~19.6m S corner). Java was already in `composite.sides`; **wired India** as a
  second side (role `other`, axis `greenpoint`, band 3m). In-engine bbox proved
  India locked onto the **full 38m north wall** (sx 2.83 = 37.7m), NOT the West-St
  rear it shares `other` with — the 3m frontage band rejects the rear (projects
  ~0 onto greenpointAxis, sits centre-N). **The feared axis+normal selector was
  unnecessary.** Both faces verified rendering at two angles with carving recesses.
  - **Recess seed (the "pass"):** the shipped blob deriver and a luminance
    bright-mask BOTH failed (muted, muntin-split inked panes + fire escapes — as
    predicted). **What worked: a red-channel-dominance detector** (brick R≫B,
    glass R≈B) — `r-b<28 && lum>55`, banded into cols×rows, sash-halves merged.
    Clean regular grids (India 71 windows over 15 cols×5 floors; Java 24 + a
    corner `oriel3` seed), overlay-verified on the texture before wiring. Tool:
    `scripts/seed-window-grid.mjs`. **Bank: for red-brick inked facades, detect
    windows by REDNESS (R−B), not luminance — it ignores fire escapes and muntins.**
  - **NOT pixel-registered** — seed grids ghost slightly; spec `status` says so.
    Batu finalizes in `?facadeedit=1`. **Finalize tail:** top-floor arched windows
    (both faces) + India oculus + India ground-floor round arches + Java
    COFFEE/WINES storefronts + Java central arch entrance need `shape` tags;
    confirm India corner-pavilion projection; confirm Java oriel3 fold extents.
  - **Cost:** ~0 re-renders, 0 fix commits — wired + seeded + verified in one pass.
    No engine change (spec data + one composite entry); 230/230 tests green.
- **Update (2026-06-24, second review pass — three integration fixes):**
  - **Crown cut off (India + Java):** the runtime content-density trim
    (`loadTrimmedTexture`, 8.5%) shaved the sparse stepped-gable rows (India
    ~46px, Java ~53px) — the SAME trap the Franklin frontage hit. Fix mirrors
    Franklin: pre-crop tight but crown-preserving (`scripts/pretrim-astral-side.mjs`),
    ship `.trim.png` in `PRETRIMMED_TEXTURES`, recompute `roofV` on the new crop
    (India 0.903, Java 0.929), regenerate recess seeds in crop coords.
    **Rule (promote): any hero whose render has a parapet/gable/finial above a
    sparse skyline MUST be pre-trimmed + PRETRIMMED_TEXTURES — the density trim
    shaves sparse crown rows. Don't ship the raw render and rely on runtime trim.**
  - **"Transparent backside" / red threads in light wells:** a full-block hero's
    street elevations are thin chord PLANES with no solid mass behind them at the
    courtyard, so the lenient `CULL_T -0.3` left their bare backs + recess reveals
    showing through the open wells as red lines. Fix: per-record cull threshold —
    chord faces use `CHORD_CULL_T 0.02` (hide the instant they turn away); solid
    masses keep the lenient default. **Rule: thin facade planes need a stricter
    back-cull than solid returns; a building assembled from planes (not a closed
    shell) shows plane-backs through any opening unless culled tight.**
  - **Open-rear regression (from wiring India to catch-all role `other`):** fixed
    earlier this day via `frontageBandEdges` (cover only the side's frontage-band
    edges, not the whole catch-all role) — banked.
  - **Corner seam strip:** the pretrim removed the pale cream texture-edge that the
    `cornerOverlap` extension dragged past the Franklin↔Java corner. **Tight crops
    keep corners clean — a cream margin at a texture edge becomes a white seam once
    a face is extended to close a corner.**
  - **Verification gotcha:** the preview viewport/screenshot scale got unreliable
    after repeated force-render pointer hacks; programmatic checks of mesh
    `.visible` per `?a=` step (via `window.__three`) verified the cull fix without
    screenshots. Bank: assert culling by reading `.visible`, not just by eye.
  - **Cost:** 1 commit, 0 re-renders; 236/236 tests green.
- **Update (2026-06-24, side-face integration fixes — Batu review):** the first
  wiring pass left four defects, all now fixed (engine, `buildHeroBuilding`):
  1. **Crown clipped + cream-paper band over the roof** (same class as 144/Sonny's
     white-cap). Side textures had no `roofV`, so `keyPaperAboveRoofline` never ran
     (cream showed) and the wall mapped 0..1 over full `building.height`, floating
     the cornice. Fix: each chord face now maps to **`faceHeight = wallTop /
     roofV`** so its painted roofline (India v≈0.91, Java v≈0.90) lands exactly at
     the shared roof; crown projects as silhouette, cream keys out. Frontage
     (`roofV === heroRoofV`) is unchanged by construction.
  2. **Ground-floor lines didn't match at the corner** — same root as (1); the
     `faceHeight` anchor lands floors/base consistently against the frontage.
  3. **Corner gap (sidewalk wedge ~0.4m)** — each chord plane was pushed `proud`
     0.02 along its OWN normal, so perpendicular planes missed at the corner. The
     band-filter (below) removed the typological wall the big proud gap protected
     against, so `proud`→**0.006** + each segment extended **`cornerOverlap` 0.02**
     along its run → perpendicular planes overlap, corners close crisp.
  4. **Open rear/courtyard** (regression from wiring India to catch-all role
     `other`): adding `other` to `chordCoveredRoles` made EVERY `other` edge skip
     its wall, but only the north India plane was drawn → rear + light courts
     undrawn. Fix: **`frontageBandEdges()`** computes the exact street-most band a
     side covers (mirrors `frontageChord`'s filter) and only those edges skip the
     wall (`chordCoveredEdges`); set-back rear/court edges keep structural walls.
  - **Plus:** interior light-court walls flashed as bright flat-red "threads" in
    the wells (flat MeshBasic shows full base color edge-on; short returns < 2m get
    no brick). Sank the whole back complex to a dim shaft tone on frontage heroes
    (`!isTextured && composite?.frontage` → ×0.32 short / ×0.5 long) — wells read as
    shadowed shafts; corner heroes' lit returns untouched.
  - **Durable rules (promoted):** (a) a bespoke SIDE texture needs its own
    `roofV`, and the wall must map to `wallTop/roofV` (not `building.height`) or
    its cornice/floors/crown float off the frontage at the corner. (b) Two
    perpendicular chord planes need `cornerOverlap` + small `proud` to close — a
    proud offset alone opens a corner wedge. (c) Wiring a side face to a CATCH-ALL
    role (`other`) must cover edges by BAND, never by role, or it strips the
    rear/court walls. (d) Frontage-hero back-of-building walls want a shadow tone,
    not the lit hero base. **Cost:** 1 review round, 0 re-renders; 230/230 green.

### Land of Barbers — BIN 3064676 (Franklin St, east side) — SHIPPED (firstpass)
- **Texture:** `land-of-barbers--franklin.png` (1122×1402, runtime-trimmed to
  1029×1383). Single WEST Franklin frontage (~7.4m), one lot north of the
  144-Franklin (3064675) corner. First MID-BLOCK single-face hero (vs corners).
- **Registration:** `FACADE_COMPOSITES["land-of-barbers"]` byBin single face
  `franklin {u0:0,u1:1,leftEnd:"north"}` (no coverMeters — texture covers the
  full frontage) + `FACADE_GROUP_BINS["3064676"]`. A plain block-extract context
  box (1 mesh) promoted to a hero by the group-bin registration alone.
- **Face classification was automatic & unambiguous:** centroid.x +0.94 ⇒
  classifyHeroEdges gives the WEST street edge role `franklin` (its normal.x<0
  points to the street) and the 7.4m EAST back edge role `other`. So the
  "longest edge per role" texturing has exactly one franklin edge — no
  front/back ambiguity to guard against. The south edge (toward 144) classifies
  `greenpoint` (party wall, untextured, occluded). **Bank: for a mid-block
  single-face hero, confirm the centroid-sign rule yields ONE edge of the target
  role before worrying about front/back disambiguation.**
- **Derive settings:** the shipped blob deriver over-grew the storefront to the
  bottom 60% (merged the dark middle-floor windows into the ground blob) and
  found only the top window row — the same low-contrast failure as Sonny's
  mauve / 144's brownstone. The redness seed (`seed-window-grid.mjs`, R−B<28)
  found both rows but fragmented panes on AC units / blinds. So the 3-col × 2-row
  upper grid + ground storefront were **hand-authored off the trimmed overlay and
  gated on a 2× overlay** (`/tmp/gate-lob.mjs` draws the authored rects per
  component colour). Windows recessM 0.1 (shallow → thin shadow, not a floating
  ledge, per [[window-decal-is-flush-not-recessed]]); doors real recess; two
  display `storefronts` (recessM 0.2, revealTop:false under the awning); one
  projecting `awning`; arched residential door (`shape:"arch"`).
- **The one fix (NaN that dropped the whole face):** the awning was authored with
  `yValance` + `yWall` but NO `yDrop`. The canopy geometry reads `awning.yDrop`
  DIRECTLY (`facadeAssembly.js` ~L221) — `??`-falls back to yValance only in the
  *opening* push (L99) and yMid (L77), NOT in the mesh build. Undefined yDrop →
  NaN positions → `computeBoundingBox/Sphere NaN` spam and the entire franklin
  assembly silently dropped (greenpoint/other walls still rendered, so it looked
  like a wiring bug, not a spec bug). **Rule (promoted below): an `awnings` entry
  needs all three of yWall (top) > yDrop (canopy front fold) > yValance (skirt
  bottom); yValance alone NaNs the face.** Diagnosed by traversing for NaN
  position attributes (0 after the fix) rather than chasing the stale console.
- **Cost: ~1 iteration** (the awning yDrop). Flat-texture + composite wiring
  landed correct first try (orientation non-mirrored — sign reads L→R — roofline
  clean, lands on the right face). 252/252 tests + overrides + conformance green.
- **Open polish (spec `status: firstpass_seed`):** micro-nudge the window rects +
  central shop-door x in `?facadeedit=1`; residential arch springY is a seed;
  cornice projection vs the 144 party wall unconfirmed. Camera note: an east-side
  Franklin frontage is back-facing at the DEFAULT angle (a=0 shows its roof) —
  it presents at **angle 3/4 (a=2)**, like every east-Franklin face.

### Oak & Iron — BIN 3064393 (Franklin St, west side) — SHIPPED (firstpass)
- **Texture:** `oak-and-iron--franklin.png` (1122×1402, trimmed 929×1359). Single
  EAST Franklin frontage (~7.65m, a 25ft tenement lot) on the WEST side of
  Franklin, ~174m north of the corner (block-franklin-north extract). 1930
  5-story: ground-floor slate bar storefront + 4 floors × 4 windows, central 2
  columns behind a fire escape.
- **Mirror of Land of Barbers' orientation:** WEST-side building ⇒ EAST frontage.
  centroid.x −3.22 ⇒ the east edge's normal points +x toward the street ⇒ role
  franklin (only that edge). `leftEnd: "south"` read non-mirrored first try (the
  opposite of Land of Barbers' east-side `north`). An east frontage is
  FRONT-facing at the DEFAULT angle (a=0) — opposite to east-side heroes.
- **Fire-escape-dense derive (the hard one):** both the blob deriver and the
  redness seed fragmented on the fire-escape ironwork + AC units (phantom column
  slivers, half-height rows, fire-escape ladder polluting any center-column
  brightness profile). **What worked: a gridded crop.** A throwaway
  `/tmp/crop.mjs` rendered the trimmed face with horizontal `fy` gridlines every
  0.05; reading the 4×4 grid + storefront bands off that BY EYE beat every
  detector. Took ~3 gate rounds (no re-renders, no in-engine fix commits): the
  storefront ran taller than first estimated (awning at fy≈0.15–0.20, not 0.11),
  and row D was ~0.03 low. **Bank: for a dense/occluded facade, a gridded crop
  (fy rules every 0.05) is the fastest registration tool — skip the profile
  scripts, read coordinates against the rules.** Windows recessM 0.1; the painted
  fire escape stays flat on the wall, drawn over the recessed panes.
- **Cost: ~3 gate rounds, 0 re-renders, 0 fix commits.** Awning carried all three
  Y fields from the start (Land of Barbers lesson held), so no NaN. 252/252 tests
  + overrides + conformance green; 0 NaN meshes confirmed by scene traverse.
- **Open polish (`firstpass_seed`):** micro-nudge fire-escape-occluded central
  columns + bar-window/door extents in `?facadeedit=1`; the slate storefront has
  more sub-elements (central bar door, Coors panel) than the 2-window+2-door seed.

### Verge — BIN 3064387 (Franklin & India corner) — IN PROGRESS (Franklin face + carve)
- **Texture:** `verge--franklin.png` (corner unwrap, trimmed 1292×965). 1931
  dark-brick corner building. Render reads VERGE storefront (fire escape + 3
  window cols + VERGE sign + "159" door) on the LEFT = the ~7m EAST Franklin
  frontage (u0:0→u1:0.60), then the corner fold, then the India return (yin-yang
  + door) on the RIGHT = the India (north, role "other") long wall.
- **Merged-footprint carve (the new capability):** BIN 3064387's single
  NYC-Open-Data footprint MERGES three real buildings — the tall Verge corner +
  two 1-story structures extending west along India (Batu's India-St Street View,
  2026-06-25). Rendered as-is it was one 13.7m mass with a too-tall cream India
  wall over the low buildings. Fix: `src/carveFootprint.js` (pure Sutherland–
  Hodgman half-plane clip, 5 tests) splits the footprint at x = xMax − frac·width;
  `sceneFrame.js` keeps the EAST `CARVE_EAST_FRACTION` (0.57) as the Verge hero
  mass and re-emits the WEST remainder as a 1-story (4.2m) context building.
  **Bank: a merged multi-building BIN can be split by a vertical half-plane clip
  in the block-extract promotion — keep the corner as the hero, re-emit the
  remainder low. Reusable for any over-merged corridor footprint.**
- **Done this pass:** Franklin face wired + carved massing verified in-engine
  (dark VERGE facade, fire escape, storefront, "159" — not mirrored, 0 NaN,
  257/257 tests). The east edge stays the only role-`franklin` edge after the
  carve (the new cut edge faces west ⇒ role `other`).
- **Done (2026-06-25 follow-up):** (1) **corner-line alignment** — Batu flagged
  the fold must sit on the DRAWN corner line (the "R" of VERGE, right of the 3rd
  window), not the eyeballed 0.60; cut u1=0.50 so the dark line lands on the
  building's corner edge (also cut window squish). **Rule: on a corner unwrap,
  read the fold off the drawn corner line in the render, not a proportional
  guess.** (2) **dark tone** — added `verge: 0x3e3a36` (sampled from the render)
  to `II_PALETTE.heroes` so the uncovered India wall reads dark charcoal, not the
  cream context fallback. **Rule: a hero whose uncovered returns show needs a
  hero base color or they fall back to cream context.** (3) **Franklin recesses**
  — 3-col×3-row grid derived cleanly (Verge glass is lit enough for the blob
  deriver) + storefront; recessM 0.1.
- **India wrap DONE (2026-06-25):** the yin-yang return now renders via the
  Astral `sides` role-"other" pattern — `sides:[{face:"india", selectRole:"other",
  axis:"greenpoint", segments:[{fromM:0, toM:16.09, leftEnd:"east", u0:0.5,
  u1:1.0}]}]`. So "VERGE" wraps the corner: **VE** on Franklin (u0..0.5), **RGE**
  on India (u0.5..1) — they meet at the drawn R-line, the corner. **Gotcha banked:
  `sides` skips the typological wall on every covered edge, so a PARTIAL cover
  (corner-adjacent only) punches a see-through hole — cover the WHOLE chord
  (fromM:0→toM:wallLength) for a single-edge side, or the uncovered run has no
  wall.** The render's sparse India half reads fine stretched across the 16m wall.
  `fromM` measures from the chord's `alongMin` (smallest greenpoint-axis
  projection) end; `leftEnd` orients the texture independently.
- **FOLLOW-UP (optional):** India-face recess spec (currently flat); confirm the
  0.57 carve fraction vs the real lot line; place card.

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
