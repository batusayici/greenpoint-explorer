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
  on the corner-end storefront is still the render's **invented/UNVERIFIED**
  sign (flag for the pre-launch truth pass).
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

---

## Top pending tooling improvement

`derive-facade-spec.mjs` still ships the blob detector that failed on Sonny's;
the methods that worked (density-profile columns, per-window lintel→sill
frame-snap, 2× annotated overlay as the gate) were hand-rolled in throwaway
scripts. **Folding them into the tool is the highest-leverage change** — it
turns the ~5 window rounds into one (run → review overlay → ship). Do this
before/with Sereneco.
