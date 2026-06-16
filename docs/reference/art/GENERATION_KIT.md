# Franklin Hero Facade Generation Kit

## Registration Playbook — render once, measure, register

Locked in after the Premier Organic retro (2026-06-12: 4 renders and ~10 fix
commits; root cause = spec coords authored from a contract instead of measured
from the render). The order of truth per hero building:

**Photos decide structure → render once → derive the spec from the render →
overlay gate → one in-engine check.**

> **Learning loop (do this every building).** BEFORE starting a building, read
> this playbook AND `HERO_FACADE_LOG.md` (the per-building ledger). AFTER
> finishing, append an entry to the log: render version, derive settings used
> (`--wall`/`--erode`/etc.), the building's structural quirks, what went wrong
> + iteration count, and the one-line lesson. If a lesson is durable (applies
> to all buildings), promote it up into this playbook. The point is that each
> building makes the next cheaper — the log is how we compound. The score to
> beat is on record: Premier ~10 fix commits, Sonny's ~15+ across the window
> rounds; the target is ≤2.

1. **Pre-render (photos first).** Gather evidence photos that fully cover the
   building — at least one wide shot per street face and one corner shot; the
   photos ARE the structural truth the model copies from, so a face the
   photos don't show is a face the render will invent. Fill the reusable
   prompt scaffold's mechanical slots only (street names, fold % from real
   wall meters, canvas px) — never describe the architecture in prose; the
   prompt makes the model count floors/openings from the photos itself.
2. **Render once, audit before accepting.** Run the scaffold's audit checklist
   on the raw render against the photos (window-row count, column count per
   face, ground-floor openings in order, corner condition). Re-render only
   for truthfulness or style failures — the checklist is the gate. **Never
   re-render to fix feature placement by a few percent** — that loop never
   converges; it burned the Premier v2→v3→v4 cycle.
3. **Derive the spec mechanically:**
   ```bash
   node scripts/derive-facade-spec.mjs assets/textures/franklin/<file>.png \
     --face "BIN:role=u0:u1" [--face ...]
   ```
   Face u-ranges are the `FACADE_COMPOSITES` numbers from `src/SceneView.jsx`.
   The script replicates the runtime trim exactly, detects the painted
   openings (not-wall mask → erosion to cut linework → connected components),
   and writes a derived-spec JSON **plus an overlay PNG** to
   `docs/visual-artifacts/facade-derivation/`.
4. **Gate on the overlay, not the browser.** Every painted opening must be
   boxed in the right place before any rect reaches the runtime spec. Known
   detector gaps to fix by hand against the overlay: wall-toned doors (brick
   door on brick wall) are missed; fire-escape ironwork can merge neighboring
   windows into one box; bay oriels come out as stacked windows rather than
   one bay rect.
5. **Promote** the reviewed rects into
   `src/data/facade-specs/<placeId>.v0.1.json` (schema `facade-spec.v0.5`),
   explicit `windows.rects` only — never `rows×cols`, which manufactures
   windows at empty grid cells. Then a `?specdebug=1` screenshot in-engine
   confirms, and done.
   **Verify the window grid on the FLAT texture, not in 3D — at HIGH
   resolution.** Draw the spec rects back onto the trimmed face image (a
   throwaway overlay script) and eyeball them against the painted openings.
   Two hard-won rules from Sonny's v3 (which took THREE wrong window passes):
   - **Crop to 2x and inspect individual windows.** A downscaled full-face
     overlay hides a 0.03–0.05 vertical offset (~30px in the texture, ~7px
     on screen) — it looks aligned but isn't. The error is only visible
     zoomed in.
   - **Vertical misalignment is NEVER parallax.** The recess normal is
     horizontal, so the iso recess parallax is purely horizontal. If rects
     look vertically off, they ARE off — do not rationalize it as a viewing
     artifact (this is exactly the mistake that shipped a broken grid twice).
   - Measure the grid by **density/brightness profiles**, not even-spacing
     guesses: columns from not-wall density in a clean row band (top row,
     clear of fire escapes); rows from a per-row brightness profile down a
     clean column (lintel = dark bar, glass = bright/dim block, sill = dark
     bar). The profile gives true per-row extents; an even-spacing assumption
     anchored on one row drifts and lands rects on AC units and doors.
   - **A window rect is a window, not a door/AC/storefront.** At the ground
     floor, columns may align with entrance doors or the storefront, not
     windows — place a window rect only where the profile shows glass.
   - **Measure each window's FULL extent (lintel→sill); never force a uniform
     height.** Sonny's windows are double-hung (~0.17 tall); forcing every
     box to 0.13 put the recess bottom on the *meeting rail*, so the reveal
     read mid-window instead of at the sill (the v3 round-4 bug). Snap each
     box down until it hits true wall below the sill. Only fall back to the
     median height for outliers where the fire escape / AC / cornice corrupts
     the measurement — and cap the top row below the cornice.
6. **Don't spec only the windows.** The Sonny's v3 pass measured the window
   grid carefully but eyeballed the ground floor, and the storefront recess
   cut bare wall above the painted shopfront while the awning read flat.
   Measure the **storefront band top** and **awning band** explicitly
   (dark-fraction-per-row, as for the window grid) — recess the storefront
   only to the painted shopfront top, and add an `awnings` component so a
   painted valance projects instead of being recessed flat.
7. **In-engine, inspect the corner and EVERY camera-visible edge — not just
   the main frontage.** Sonny's looked fine head-on but the corner showed a
   bare brown wall (a collinear footprint off-cut that wasn't textured; now
   merged in `sceneFrame.js`). Orbit-equivalent: pan to the building corner
   and each return face at zoom before calling a facade done. A face that
   renders flat-color instead of textured is a geometry/wiring bug, not a
   spec bug.
8. **Name the mesh before you fix an artifact.** The Sonny's corner "wedge"
   cost ~6 guess-and-reload edits because I changed code hoping to fix it
   (awning canopy? Franklin face? storefront jamb?) before identifying what
   it actually was. The moment I queried the scene graph for the mesh at that
   exact world location it resolved in one. **Rule:** for any unexplained
   visual artifact, query the scene first — walk meshes, print color / map /
   `userData.facadeSlot` / world-bbox near the artifact, and hide-to-confirm
   (`o.visible=false` + a 1px pointer-drag to force a render) — *then* edit.
   The snippet that worked is in `docs/reference/art/HERO_FACADE_LOG.md`.

### What the engine now handles structurally (banked — don't re-derive per building)

Sonny's was the first building to exercise these; the fixes are permanent, so
the whole "corner artifact" class should be **zero iterations** on the next
corner. If you hit one of these, it's a regression, not new work:

- **Collinear split frontages** — `sceneFrame.js` merges consecutive same-role
  edges that are parallel, so a footprint's extra mid-wall vertices don't
  leave an untextured off-cut at the corner (the brown-wall bug).
- **Back-facing return walls** — `SceneView.jsx` skips walls whose outward
  normal faces away from the fixed NE camera (the Franklin return showing its
  mirrored dark texture as a wedge). FrontSide culling is unreliable here
  because adjacent faces wind oppositely — test the real normal vs the camera.
- **Awning end-caps** — `awnings[].capLeft/capRight: false` suppresses the dark
  side panel where an awning meets the corner instead of terminating.
- **Storefront top reveal** — `storefronts[].revealTop: false` drops the dark
  soffit where the awning already covers the storefront head; combine with a
  shallow `recessM` (~0.2, not 0.35) so the soffit isn't a deep dark wedge.
- **Reveal weight** — window `recessM ~0.06` reads as a thin shadow line;
  0.14 reads as a thick lit ledge. Default shallow.

### Shaped openings — arch / oculus (banked v0.6, from 144 Franklin)

The recess system now models curved openings, not just rects. A window/door
rect gains an optional `shape: "arch" | "circle"` (default `"rect"` = unchanged);
arches take an optional `springY` (the rect-to-cap transition; defaults to the
box midpoint). The curve math lives in exactly one pure module —
`openingProfile` in `src/facadeProfiles.js` — and the cap is a half-ellipse in
**face-coords**, so it registers to *whatever arc the artwork painted* (round or
segmental) via the same `(x,y)→u` UV mapping; there is no forced geometric
semicircle. Accepted tradeoff (locked in the design spec): the curved pane meets
a flush filler with no bridging soffit, so a hairline seam can show at recess
depth — a curved archivolt/oculus ring is a clean follow-up, not a bug.

What the build taught (so the next ornate hero is cheaper):

- **A curved opening is a fold diagnostic.** An arch or oculus *bisected by the
  kink* is an unmistakable "the fold is wrong" tell that flat rects hid — 144's
  fold shipped at 0.155 (splitting the giant Franklin arch) before the
  single-face reference forced it to 0.29. When a hero has ornate openings,
  read the fold by which face owns each whole arch, then confirm against the
  single-face photo (per the Registration Playbook).
- **Don't hand-author `springY`/curve positions — they're SEEDs for the editor.**
  Same doctrine as window rects: tag the shape, take the midpoint default, then
  drag the spring line onto the painted spring in the recess editor
  (`?facadeedit=1`, shape selector + spring handle + SVG curve preview). 144's
  upper arches + oculi shipped as a first-pass *overlay-derived* registration
  and still owe an editor fine-tune — that's expected, not done.
- **Capability and full authoring are two passes, not one.** Building the shape
  system AND pixel-registering every opening on an ornate facade in a single
  plan overruns; land the capability + rough placement, then schedule a
  dedicated editor authoring pass. Mark partial registration honestly in the
  spec `status`.

The repeatable pattern behind the ~1-pass geometry: **design spec (lock scope +
tradeoffs) → task plan → subagents, with the new primitive's math isolated in a
pure, unit-tested module before any render/overlay/editor wiring.** Schema
changes are additive optional fields whose default reproduces current behavior
byte-for-byte (`complementRects` stayed untouched). Reuse this shape for any new
geometry primitive. **Tooling gap still open:** `derive-facade-spec.mjs` can't
seed `shape`/`springY`, so curved openings are fully manual — fold curve
auto-detection in alongside the density-profile work flagged in
`HERO_FACADE_LOG.md`.

### Coordinate convention (one truth)

- **Whole-u** is 0..1 across the runtime-**trimmed** composite image
  (`loadTrimmedTexture` crops the paper margins — never measure the raw PNG).
- Faces slice whole-u via `u0/u1` (`FACADE_COMPOSITES`, `src/SceneView.jsx`).
- Spec rects are **face-local**: `x0/x1` from the face's *left* edge
  (= `(u − u0)/(u1 − u0)`), `y0/y1` from the *ground up*.
- The derivation script emits face-local coords directly; no hand conversion.

### Orthographic render contract (structure, prompt-side)

Proven by the Premier v4 render; reuse for every composite corner:

- **One continuous head-on unwrap, strictly orthographic** — no 3/4
  perspective, no leaning window columns, no foreshortening.
- **Canvas split proportional to the real walls** (wall meters → % of canvas;
  e.g. Premier: Franklin 14.7m + Greenpoint 16.1m → corner asked at 47.7%).
  Expect the drawn fold to land within a few percent of the ask — **measure
  the actual fold from the render** (the kink constant), never assume the
  contract number, and settle disputes against the photos
  (see DECISION_LOG 2026-06-12, `PREMIER_KINK = 0.478`).
- **Continuous datums:** ground line at the bottom edge, parapet top at the
  top edge, sign band and cornice heights consistent across the full width.
- Margins are fine (auto-trimmed); no sky, sidewalk, people, or vehicles.
- II-C inked style (anchor: II-C-style-system-tile.png).

Phase 2.3 working doc. Generate II-C-style facade textures from evidence photos
and drop them into `assets/textures/franklin/` — the Scene mode loads them by
filename automatically (no code change needed).

## Output Contract

- **Format:** PNG, strictly orthographic elevation. No perspective, no sky,
  no street, no figures — the facade fills the full canvas edge to edge.
- **Corner heroes render as ONE continuous corner unwrap** (both street faces
  in a single image, proportional split) — never as separate per-face PNGs.
  Separate faces can't hold datums or the corner seam consistent; this is the
  Premier v1→v4 lesson.
- **Style:** II-C Inked Indie (anchor on `II-C-style-system-tile.png` and
  `II-assembled-mini-scene.png` in this folder): confident linework, controlled
  hatching, muted warm palette, paper grain, drawn signage lettering.
- **Naming:** `<placeId>--corner.png` for corner composites (version suffix on
  re-renders, e.g. `--corner-v2.png`); `<placeId>--<street>.png` for true
  single-face slots.
- **Resolution:** long edge 2048px at the aspect ratio listed per slot.

## Prompt Scaffold (image-to-image, GPT-5.5) — REUSABLE

One prompt for every building. **The photos are the binding truth source, not
prose.** The prompt never describes the building's architecture — describing
it by hand is how transcription errors enter (and a hand-zone-listed prompt is
not reusable). Instead it forces the model to *count and copy* from the
attached photos, then audit its own draft against them.

The only fill-ins are mechanical facts that come from geometry/code, never
from looking at the photos:

| Fill-in | Source |
|---|---|
| `<subject>` — how to identify the one building | the slot (tenant/corner/address — never its architecture) |
| `<neighbors>` — the adjacent buildings to exclude | the slot (which side, what distinguishes them) |
| `<street A>`, `<street B>` | the slot |
| `<X>%` corner fold | real wall meters (slot table) |
| `<W>×<H>` / aspect | slot table |

Hardened against known failure modes: Premier v2's 3/4 lean (orthographic
clauses), Sonny's v1 dropped floor + flat-strip ground floor (count-first and
corner-condition clauses, self-audit), Sonny's v2 spilling into the next
building (subject-isolation + party-wall clauses).

> Redraw the building in the attached photos as a single continuous, strictly
> orthographic facade elevation in the attached hand-inked editorial
> illustration style (II-C system: confident 1–4px linework, controlled
> hatching for shadow, muted warm palette, paper texture). Head-on flat
> projection: every vertical edge plumb, no 3/4 view, no leaning window
> columns, no foreshortening.
>
> **Draw ONE building only — the subject: <subject>.** The photos show a
> continuous streetscape; the subject is flanked by separate neighbor
> buildings (<neighbors>). Render the subject alone, bounded by its two party
> walls — the vertical seams where its brick, cornice line, and roofline meet
> the differently-styled neighbors. The elevation starts at one party wall and
> ends at the other. Do NOT continue the facade past a party wall, and do NOT
> borrow a neighbor's windows, doors, cornice, materials, storefronts, or
> signage — a sign or shopfront on an adjacent building is not the subject's,
> even though it appears in the photos.
>
> **The photos are the only source of architectural truth.** Within the
> subject's party walls, read off from the photos:
> – the number of window rows above the ground floor — draw exactly that many,
>   no more, no fewer; the commercial/storefront band occupies the ground
>   floor only, below ALL of those rows;
> – the number and rhythm of window columns on each street face;
> – every ground-floor opening (door, display window, storefront) belonging to
>   the subject, in left-to-right order, each exactly once, in photo order;
> – the corner condition exactly as photographed: if the entrance sits on a
>   chamfered/cut corner, draw it there at the fold with whatever flanks it in
>   the photos — never relocate it onto a flat face or merge tenants into one
>   continuous shopfront strip;
> – materials, cornice, sills/hoods, awnings, fire escapes, and signage
>   lettering as drawn type, all as photographed. Do not invent, omit,
>   simplify, regularize, or rearrange anything.
>
> **[Corner heroes — unwrap]:** the image unwraps the subject's two street
> walls onto one canvas: the <street A> face occupies the left <X>%, the
> <street B> face the rest, the building corner at <X>% across. The canvas's
> left edge is the subject's far (non-corner) party wall on <street A>; the
> right edge is its far party wall on <street B>. Nothing beyond either party
> wall. Ground line at the bottom edge and roofline at the top edge run
> continuously across the full width; window-row and sign-band heights stay
> consistent across the fold.
>
> Keep windows and doors tonally distinct from the wall (no wall-colored
> doors). Facade only, full bleed, no sky, no sidewalk, no people, no street
> furniture. Output exactly <W>×<H> px — do not change the canvas proportions.
>
> **Before finalizing, audit your draft against the photos:** (1) it is ONE
> building, bounded by its party walls — no neighbor facade, windows, doors,
> or signage included; (2) window-row count matches; (3) window-column count
> per face matches; (4) every subject ground-floor opening appears exactly
> once, in order, and the corner condition matches; (5) nothing was added that
> is not on the subject in the photos. If any check fails, correct the draft
> before outputting.

Attach: (1) the evidence photos — at least one wide shot per street face that
shows the subject **from party wall to party wall** (so its boundaries are
visible) plus one corner shot, (2) the II-C system tile, (3) one assembled
scene for tone. If the only available shot crops a party wall, say so in
`<neighbors>` and name where the subject ends.

Feature *proportions* are the prompt's job; exact pixel placement is not — the
render lands a few percent off and `derive-facade-spec.mjs` absorbs that.
**Re-render for truthfulness failures** (spilled into a neighbor building,
window-row count off, openings missing/invented/reordered, corner condition
wrong, aspect changed) — run the same audit checklist yourself on the raw
render against the photos *before*
deriving a spec; a structurally wrong render makes the derived spec worthless.
**Never re-render for placement** (see Registration Playbook).

## Slots

Evidence photos: `docs/mvp-reference-images/greenpoint franklin  corner/`

### Premier / Franklin Organic — BIN 3322608 (southwest corner)

Red-brick grocery corner: brick upper with window rhythm, cream cornice, dark
storefront base, awning band. Photos: `franklin-southwest-wide.jpeg`,
`franklin-southwest-zoom.jpeg`, `franklin-southwest1.jpeg`, `franklin-southwest2.jpeg`.

**DONE** — shipped as the corner composite
`premier-franklin-organic--corner-v4.png` (30.8m × 14.0m unwrap: Franklin
14.7m then Greenpoint 16.1m, fold measured at u=0.478). The per-face slots
below are retired; kept for the size data only.

| Retired slot | Real size (w × h) |
|---|---|
| `premier-franklin-organic--greenpoint.png` | 16.1m × 14.0m |
| `premier-franklin-organic--franklin.png` | 6.1m × 14.0m |

### Sonny's Corner — BIN 3064811 (southeast corner)

**NEEDS RE-RENDER → v3.** v2 (reusable photo-truth prompt) fixed the v1 errors
— floor count and corner-wrap now match the photos — but **spilled past the
subject into the next building**: it rendered a long residential stretch +
the neighbor's frontage, so the elevation is ~1.5 buildings wide, the corner
no longer lands at the fold, and the width exceeds 2.05. The shipped
`sonnys-corner--corner.png` / `sonnys-corner.v0.1.json` stay
PROVISIONAL_INVALID until v3.

Root cause (now fixed in the scaffold): the old prompt told the model to draw
"every ground-floor opening incl. **neighbor storefront**," and the v2 brief
named **ALTER BROOKLYN** as a tenant to include — but ALTER is on the
**separate unpainted red-brick building east of the subject**, not the
subject. So the model dutifully extended past the party wall. The scaffold now
draws ONE subject bounded by its party walls and excludes named neighbors.

The subject is the **mauve-painted corner building** with the chamfered-corner
bar entrance. Ground floor (let the photos govern, subject only): the corner
bar wrapping the chamfer with a display window per frontage, a vacant
commercial bay, and a residential entrance ("142") — **no ALTER**. Do not
hand-state the floor count; the photo-count instruction got it right in v2.

| File | Real size (w × h) | Aspect | Pixels |
|---|---|---|---|
| `sonnys-corner--corner-v3.png` | 27.1m × 13.2m (Greenpoint 19.9m + Franklin 7.2m) | 2.05 | 2048 × 998 |

**v3 re-render: reusable scaffold above**, fill-ins:
- `<subject>` = the mauve-painted corner building whose ground floor is the
  corner bar (chamfered-corner entrance).
- `<neighbors>` = **east on Greenpoint:** a separate unpainted red-brick
  building — the "ALTER BROOKLYN" hanging sign is on IT, exclude it.
  **west on Greenpoint:** the next storefront building. Exclude both.
- `<street A>` = Greenpoint Ave, `<street B>` = Franklin Ave (return),
  `<X>` = **73.4**, output **2048×998 px**.

Attach the southeast photos that show the subject from party wall to party
wall (the frontal `142` shot bounds it west; a corner shot shows where the
mauve meets the red-brick neighbor east). Unwrap matches the wired composite
(`SONNYS_KINK = 0.734`, Greenpoint-first, `leftEnd: "east"`): left edge =
Greenpoint east party wall, corner at 73.4%, Franklin return on the right.
**Confirm the BIN 3064811 footprint (19.9m Greenpoint) ends where the mauve
meets the red brick** — if ALTER's building is the same BIN, revisit before
re-rendering.

Audit v3 against the photos per the scaffold checklist — check (1)
(party-wall boundary, no neighbor) is the one v2 failed.

After v3 lands: re-derive with
`node scripts/derive-facade-spec.mjs assets/textures/franklin/sonnys-corner--corner-v3.png --face "3064811:greenpoint=0:0.734" --face "3064811:franklin=0.734:1"`
(retune `--wall`/`--erode`; the mauve wall is a minority surface), gate on the
overlay, then update `FACADE_COMPOSITES.key` to the v3 file.

### Sereneco — BIN 3337033 (northwest corner)

**DONE** — shipped as `sereneco--corner.png`, fold at u=0.496 on a drawn
brick seam (default derivation settings worked). Only the franklin face is
camera-visible; it maps with `coverMeters: 12` onto the corner-adjacent end
of the 57m footprint edge. Spec: `src/data/facade-specs/sereneco.v0.1.json`.

Low weathered-brick restaurant corner with glass base. Photos:
`franklin-northwest1.jpeg` through `franklin-northwest4.jpeg`.

| File | Real size (w × h) | Aspect | Pixels |
|---|---|---|---|
| `sereneco--corner.png` | ~23.8m × 7.0m (Greenpoint 11.8m + Franklin return ~12m) | 3.40 | 2048 × 602 |

**Note:** Sereneco's source footprint (the full BIN parcel) runs 57m down
Franklin; most of it is muted context mass (R10G finding). The composite
covers only the corner-adjacent ~12m return — the rest of the Franklin run
stays untextured context mass, so size the plane down to match. Corner asked
at ~50%; confirm reading order against the camera, measure the drawn fold
from the render.

## Review Loop

1. Drop PNGs into `assets/textures/franklin/`
2. `npm run dev` → Scene mode is the default view
3. Compare against `II-assembled-mini-scene.png` and the benchmark image
4. Phase 2 gate: II-C in-engine vs reference boards vs GPT-render fallback
