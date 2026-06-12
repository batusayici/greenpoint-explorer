# Franklin Hero Facade Generation Kit

## Registration Playbook — render once, measure, register

Locked in after the Premier Organic retro (2026-06-12: 4 renders and ~10 fix
commits; root cause = spec coords authored from a contract instead of measured
from the render). The order of truth per hero building:

**Photos decide structure → render once → derive the spec from the render →
overlay gate → one in-engine check.**

1. **Pre-render (photos first).** From the evidence photos, fix the structural
   facts: corner-fold position, floor counts, storefront breaks, bay/fire
   escape presence. Bake them into the prompt with the proportional canvas
   split (real wall meters → % positions, per the orthographic contract
   below). The AI render will *still* not place features at the prescribed
   pixels — expected and fine: structure is the prompt's job, registration
   is the next step's.
2. **Render once.** Re-render only for content or style failures (wrong floor
   count, missing signage, perspective lean). **Never re-render to fix feature
   placement by a few percent** — that loop never converges; it burned the
   Premier v2→v3→v4 cycle.
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
   windows at empty grid cells. Then one `?specdebug=1` screenshot in-engine
   confirms, and done.

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

## Prompt Scaffold (image-to-image, GPT-5.5)

Premier v4-proven language. The orthographic clauses are load-bearing —
the weaker "no perspective" alone let v2 come back with a 3/4 lean that cost
a re-render and a day of diagnosis.

> Redraw this storefront photo as a single continuous, strictly orthographic
> facade elevation in the attached hand-inked editorial illustration style
> (II-C system: confident 1–4px linework, controlled hatching for shadow,
> muted warm palette, paper texture). Head-on flat projection: every vertical
> edge plumb, no 3/4 view, no leaning window columns, no foreshortening.
> [Corner heroes:] The image unwraps both street walls onto one canvas — the
> <street A> face occupies the left <N>% and the <street B> face the rest,
> with the corner at the <named landmark from photos, e.g. the storefront
> sign break>. Ground line at the bottom edge and parapet at the top edge run
> continuously across the full width; sign band and cornice heights stay
> consistent.
> Keep the real architecture: floor count, window rhythm, cornice, storefront
> base, awning shape, and signage lettering as drawn type. Keep windows and
> doors tonally distinct from the wall (no wall-colored doors). Facade only,
> full bleed, no sky, no sidewalk, no people.

Attach: (1) the evidence photo(s), (2) the II-C system tile, (3) one assembled
scene for tone.

The proportions are the prompt's job; exact placement is not. The render will
land features a few percent off the ask — that's what
`scripts/derive-facade-spec.mjs` absorbs. Re-render only for content or style
failures, never for placement (see Registration Playbook above).

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

**DONE** — shipped as `sonnys-corner--corner.png`, fold measured at u=0.734
(Greenpoint-first reading; only the greenpoint face is camera-visible).
Derivation needed `--wall 128,84,92 --wall-threshold 140 --erode 3`: the
mauve wall is only ~34% of the face (dense dark joinery defeats auto wall
estimation), and shadowed-mauve hatching bridges features at the default
threshold. Spec: `src/data/facade-specs/sonnys-corner.v0.1.json`.

Dark brick bar corner: dark awned base wrapping both streets, upper window
rhythm. Photos: `franklin-southeast-wide.jpeg`, `franklin-southeast-zoom.jpeg`,
`franklin-southeast-1.jpeg`.

| File | Real size (w × h) | Aspect | Pixels |
|---|---|---|---|
| `sonnys-corner--corner.png` | 27.1m × 13.2m (Franklin 7.2m + Greenpoint 19.9m) | 2.05 | 2048 × 998 |

Corner asked at 26.6% (Franklin-first reading) — **confirm the unwrap
reading order against the camera-visible faces** (fixed NE iso camera;
`faceFrame` `leftEnd` config) before prompting, then measure the actual
drawn fold from the render as always.

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
