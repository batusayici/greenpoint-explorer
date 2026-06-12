# Franklin Hero Facade Generation Kit

## Premier corner v3 re-render contract (when ready)

The v2 composite works but has internal inconsistencies the renderer must
compensate for. A v3 drawn to this contract maps perfectly:

- **One continuous head-on unwrap, strictly orthographic** — no 3/4
  perspective, no leaning window columns, no foreshortening.
- **Canvas split proportional to the real walls:** Franklin St streetwall
  (Franklin Pizza + premier ORGANIC storefronts) = 14.7m, then the corner,
  then the Greenpoint Ave face (premier script, bay window, fire escapes,
  door, AC units) = 16.1m. So the corner column sits at **47.7%** across
  the artwork. Total real size 30.8m wide x 14.0m tall (aspect 2.2:1).
- **Continuous datums:** ground line at the bottom edge, parapet top at the
  top edge, sign band and cornice heights consistent across the full width.
- Pizza party-wall pier at ~29.5% of the Franklin section (4.35m from its
  south end).
- Margins are fine (auto-trimmed); no sky, sidewalk, people, or vehicles.
- Same II-C inked style as v2 (anchor: II-C-style-system-tile.png).

Save as `assets/textures/franklin/premier-franklin-organic--corner-v3.png`
and update `FACADE_COMPOSITES.key` + set `PREMIER_KINK = 0.477` in
`src/SceneView.jsx`; component rects in
`src/data/facade-specs/premier-franklin-organic.v0.1.json` then need one
re-measure pass (grid-overlay method).

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
