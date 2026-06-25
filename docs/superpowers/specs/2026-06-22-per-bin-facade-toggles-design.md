# Per-BIN Facade Structural Toggles — Design

**Date:** 2026-06-22
**Status:** Approved (design), ready for implementation plan
**Branch:** feat/inked-facade-look

## Goal

Make six structural per-BIN facade edits authorable through the existing
per-BIN override loop (override JSON → `buildKitFacadeParams` →
`decorateInkedWall`), with no asset regeneration and click-to-edit parity
in the truth editor (`?facadeedit=1`):

a. cornice on/off
b. storefront awning add
c. door awning add
d. awning remove
e. door position left / center / right
f. fire escape add / remove (+ variant)

## Why this approach

The color fields (`tint`, `windowTint`, `doorTint`, `corniceTint`) already
flow declaratively: absent → fall through to family/heuristic defaults;
present → win field-by-field. Structural decisions, by contrast, are today
either **hardcoded** in the 6.2.1 per-BIN allowlist inside `SceneView.jsx`
(awning, door alignment) or **automatic** via heuristics (`wantsFireEscape`,
`isFoodTrade`, cornice-always). That split is the source of drift.

We extend the *same* declarative override mechanism to these toggles. The win
is consolidation: every BIN that sets a field collapses a hardcoded-table
entry or overrides an auto-decision into one place, click-editable, re-render
only (no regen). BINs that don't set a field keep today's auto behavior
exactly (byte-stable).

## Section 1 — Data & schema

New optional fields in `src/data/facade-overrides/greenpoint-corridor.v0.1.json`.
All absent-means-fall-through.

```jsonc
{
  "hasCornice": true | false,                      // gate the existing cornice draw
  "storefrontAwning": false | true | "0xRRGGBB",   // false=suppress, true=default fabric, hex=color
  "doorAwning": true | false,
  "doorAlign": "left" | "center" | "right",
  "fireEscape": false | "standard" | "lattice",     // unifies on/off + variant
  "hasStoop": true | false,                          // override wantsStoop heuristic; false => standard recessed door
  "fireEscapeColor": "0xRRGGBB"                       // iron tint, snapped to TRIM_TONES (deck = brighter face)
}
```

`buildKitFacadeParams` (`src/buildKitFacadeParams.js`) merges each onto the
resolved params object, mirroring the existing `corniceTint` / `fireEscapeVariant`
handling:

- Absent → `params.<field>` is `undefined` → renderer keeps today's
  heuristic / byte-stable behavior.
- `storefrontAwning` and `fireEscape` carry their color/variant **inline**
  (one field, one concept) rather than as separate fields.
- `fireEscape` supersedes the older `fireEscapeVariant` field: a string value
  implies "on" and selects the variant; `false` forces "off"; `true` /
  `"standard"` is the default variant. (Existing `fireEscapeVariant` entries
  remain readable for back-compat during migration.)

## Section 2 — Render wiring (`decorateInkedWall`, `SceneView.jsx`)

No new geometry — each field gates an existing draw site, sourcing the
decision from `params` instead of the heuristic/allowlist. Precedence
everywhere: **explicit override → existing hardcoded/heuristic default.**

- **cornice**: wrap the cornice draw in `if (params.hasCornice ?? <today's default>)`.
- **fire escape** (`SceneView.jsx:~2608`): change the gate from
  `wantsFireEscape(family, storeys)` to
  `params.fireEscape !== false && (params.fireEscape != null || wantsFireEscape(...))`;
  pass the resolved variant through to `buildFireEscapeGeometry`.
- **awning / doorAlign**: the storefront/sign renderer already accepts per-bay
  `awning` and `door`. Route them from `params` so precedence is
  override > 6.2.1 allowlist > `isFoodTrade` default.

Each gate gets a unit test asserting both branches (field set vs. unset),
following the existing `buildKitFacadeParams.test.mjs` pattern.

## Section 3 — Truth editor UI (`FacadeTruthEditor.jsx`)

Add below the existing color rows:

- **Toggle rows** (segmented on/off buttons): `hasCornice`, `storefrontAwning`,
  `doorAwning`.
- **Segmented controls**: `doorAlign` (L / C / R), `fireEscape`
  (none / standard / lattice).
- Seed from the truth registry like colors do; `save()` adds the fields to the
  override object and writes through the same `/__facade-override` endpoint.
- `facadeTruthRegistry.js` gains these fields so the panel reflects current
  resolved state per BIN.

Toggles, not eyedropper (these aren't colors). `storefrontAwning`'s optional
inline color is a **second-phase** add (reusing the existing color-row
pattern); ship the boolean toggle first.

## Non-goals / YAGNI

- No corner-wrap awning/cornice/fire-escape on kit buildings (geometric, out of
  scope here).
- No awning shape/valance variants — `storefrontAwning` is on/off (+ later color).
- No migration tooling to bulk-convert the 6.2.1 allowlist; entries migrate to
  override JSON opportunistically as BINs are touched.

## Testing

- `buildKitFacadeParams`: each field set vs. unset → expected params (extend
  `buildKitFacadeParams.test.mjs`).
- Render gates: both branches per field.
- Editor: existing `FacadeTruthEditor` test pattern extended for the new
  controls + save payload.
- Manual: `?facadeedit=1` → toggle each on a real BIN → Save → confirm
  re-render in scene (the established gate loop).
