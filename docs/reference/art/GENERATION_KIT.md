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

- **Format:** PNG, flat orthographic storefront elevation. No perspective, no
  sky, no street, no figures — the facade fills the full canvas edge to edge.
- **Style:** II-C Inked Indie (anchor on `II-C-style-system-tile.png` and
  `II-assembled-mini-scene.png` in this folder): confident linework, controlled
  hatching, muted warm palette, paper grain, drawn signage lettering.
- **Naming:** `<placeId>--<street>.png` — exact names below.
- **Resolution:** long edge 2048px at the aspect ratio listed per slot.

## Prompt Scaffold (image-to-image, GPT-5.5)

> Redraw this storefront photo as a flat orthographic facade elevation in the
> attached hand-inked editorial illustration style (II-C system: confident
> 1–4px linework, controlled hatching for shadow, muted warm palette, paper
> texture). Keep the real architecture: floor count, window rhythm, cornice,
> storefront base, awning shape, and signage lettering as drawn type. Facade
> only, full bleed, no perspective, no sky, no sidewalk, no people.

Attach: (1) the evidence photo(s), (2) the II-C system tile, (3) one assembled
scene for tone.

## Slots

Evidence photos: `docs/mvp-reference-images/greenpoint franklin  corner/`

### Premier / Franklin Organic — BIN 3322608 (southwest corner)

Red-brick grocery corner: brick upper with window rhythm, cream cornice, dark
storefront base, awning band. Photos: `franklin-southwest-wide.jpeg`,
`franklin-southwest-zoom.jpeg`, `franklin-southwest1.jpeg`, `franklin-southwest2.jpeg`.

| File | Real size (w × h) | Aspect | Pixels |
|---|---|---|---|
| `premier-franklin-organic--greenpoint.png` | 16.1m × 14.0m | 1.15 | 2048 × 1781 |
| `premier-franklin-organic--franklin.png` | 6.1m × 14.0m | 0.44 | 896 × 2048 |

### Sonny's Corner — BIN 3064811 (southeast corner)

Dark brick bar corner: dark awned base wrapping both streets, upper window
rhythm. Photos: `franklin-southeast-wide.jpeg`, `franklin-southeast-zoom.jpeg`,
`franklin-southeast-1.jpeg`.

| File | Real size (w × h) | Aspect | Pixels |
|---|---|---|---|
| `sonnys-corner--greenpoint.png` | 19.9m × 13.2m | 1.52 | 2048 × 1344 |
| `sonnys-corner--franklin.png` | 7.2m × 13.2m | 0.55 | 1126 × 2048 |

### Sereneco — BIN 3337033 (northwest corner)

Low weathered-brick restaurant corner with glass base. Photos:
`franklin-northwest1.jpeg` through `franklin-northwest4.jpeg`.

| File | Real size (w × h) | Aspect | Pixels |
|---|---|---|---|
| `sereneco--greenpoint.png` | 11.8m × 7.0m | 1.70 | 2048 × 1204 |
| `sereneco--franklin.png` | 57.1m × 7.0m | 8.22 | optional — see note |

**Note:** Sereneco's source footprint (the full BIN parcel) runs 57m down
Franklin; most of it is muted context mass (R10G finding). For the spike,
either skip this slot or generate only the corner-adjacent ~12m return and
we'll size the plane down to match.

## Review Loop

1. Drop PNGs into `assets/textures/franklin/`
2. `npm run dev` → Scene mode is the default view
3. Compare against `II-assembled-mini-scene.png` and the benchmark image
4. Phase 2 gate: II-C in-engine vs reference boards vs GPT-render fallback
