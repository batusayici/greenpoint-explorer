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

### Sereneco — BIN 3337033 (NW corner) — greenpoint shipped (flat), franklin stable
- **Faces:** franklin (east, 57m Franklin St) keeps `sereneco--corner.png`
  (`coverMeters: 12`, `SERENECO_KINK=0.496`) — Batu confirmed accurate, left
  untouched. **greenpoint (south, 22.6m Greenpoint Ave)** — the green
  "Dinner·Brunch·Bar" awning frontage — was never drawn right and never shown
  (back-facing at the old fixed camera). The multi-angle rig (3.2) exposed it.
- **Render:** Batu re-rendered as `sereneco--corner-v2.png` (1916×821) — a
  corner UNWRAP: left `0..0.80` is the Greenpoint face (Dinner·Brunch·Bar →
  bays → Sereneco corner entrance), right `0.80..1` is the Franklin return
  (AZURE GOURMET, a *real separate* tenant — Batu-confirmed correct on
  Franklin). Wired as a **per-face texture**: the greenpoint face overrides
  `composite.key` with its own PNG, mapping only `u0:0→u1:0.80` onto the 22.6m
  greenpoint edge; franklin keeps the original `corner.png` slice. **Flat map,
  no recess spec yet** — windows/storefront depth is the open polish step.
- **Bug caught (1 fix):** first wired greenpoint at `u0:0→u1:1`, which pulled
  AZURE GOURMET (Franklin content) onto the Greenpoint face → it duplicated
  against the franklin slice. Fixed by cutting the greenpoint slice at the
  corner fold (`u1:0.80`, measured: AZURE GOURMET's bay starts at u≈0.82 in the
  derive overlay; 0.80 × the ~28.6m unwrap ≈ the real 22.6m greenpoint edge).
  **Lesson:** a "corner-vN" re-render is a two-face unwrap — split it at the
  fold, don't map full-width onto one face.
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

---

## Top pending tooling improvement

`derive-facade-spec.mjs` still ships the blob detector that failed on Sonny's;
the methods that worked (density-profile columns, per-window lintel→sill
frame-snap, 2× annotated overlay as the gate) were hand-rolled in throwaway
scripts. **Folding them into the tool is the highest-leverage change** — it
turns the ~5 window rounds into one (run → review overlay → ship). Do this
before/with Sereneco.
