# Asset Kit Manifest v1

Status: Review-only kit manifest  
Scope: Spec and proof visibility only, not production exports

## Generated Raster Files

- `generated/module-sheet-v1.png`
- `generated/storefront-recombination-a.png`
- `generated/storefront-recombination-b.png`
- `generated/storefront-recombination-c.png`
- `generated/street-slice-recombination-v1.png`
- `generated/ui-integrated-recombination-v1.png`

## Kit Items

| id | family | item | actual generated file | source references | intended reuse role | known limitations |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | facade archetype | Narrow service bay | Not separately exported; visible in `module-sheet-v1.png`, `storefront-recombination-a.png`, `street-slice-recombination-v1.png`, `ui-integrated-recombination-v1.png` | ARC-008, ARC-026, ARC-027, ARC-030 | Compact repair/service storefront module | Generated micro-text and numeric marks are review-only; not production-safe copy. |
| F-02 | facade archetype | Two-bay retail pair | Not separately exported; visible in `module-sheet-v1.png`, `storefront-recombination-b.png`, `street-slice-recombination-v1.png`, `ui-integrated-recombination-v1.png` | ARC-009, ARC-005, ARC-027, ARC-028 | Wider storefront rhythm for retail pairs | Needs later production grid and exact part boundaries. |
| F-03 | facade archetype | Compact corner / kiosk / symbolic edge | Not separately exported; visible in `module-sheet-v1.png`, `storefront-recombination-c.png`, `street-slice-recombination-v1.png` | ARC-010, ARC-007, ARC-026, ARC-029 | Alternate geometry and symbolic edge condition | Symbolic transit cue remains non-factual and must not become exact station geometry. |
| A-01 | awning variant | Green/cream striped cloth | Not separately exported; visible across generated outputs | ARC-009, ARC-020, ARC-023, ARC-028 | Warm retail frontage variation | Stripe rhythm needs production normalization. |
| A-02 | awning variant | Red/ochre striped cloth | Not separately exported; visible in `storefront-recombination-b.png`, `street-slice-recombination-v1.png` | ARC-005, ARC-007, ARC-027, ARC-030 | Warmer alternate retail identity | Can become repetitive if overused. |
| A-03 | awning variant | Short canopy / kiosk cover | Not separately exported; visible in `storefront-recombination-c.png` and module sheet | ARC-010, ARC-026, ARC-027 | Compact edge or kiosk cover | Needs clearer production separability. |
| S-01 | sign-band variant | Painted lintel band | Not separately exported; visible across outputs | ARC-008, ARC-026, ARC-027 | Main fictional storefront identity | Generated text not final copy. |
| S-02 | sign-band variant | Larger two-bay sign band | Not separately exported; visible in `storefront-recombination-b.png` | ARC-009, ARC-005, ARC-028 | Wider retail pair identity | Needs constraints to avoid samey wide signs. |
| S-03 | sign-band variant | Blade sign / glyph sign | Not separately exported; visible across outputs | ARC-004, ARC-026, ARC-030 | Secondary identity and wayfinding detail | Small glyphs can accidentally look like brands. |
| D-01 | door/entry variant | Single service door | Not separately exported; visible in `storefront-recombination-a.png` | ARC-008, ARC-026 | Narrow bay entry | Needs production hit-area decisions later. |
| D-02 | door/entry variant | Paired retail entries | Not separately exported; visible in `storefront-recombination-b.png` | ARC-009, ARC-028 | Two-bay storefront access rhythm | Not a final accessibility or floor-plan model. |
| D-03 | door/entry variant | Corner/kiosk hatch | Not separately exported; visible in `storefront-recombination-c.png` | ARC-010, ARC-007 | Alternate compact entry | Needs clearer world-scale rules later. |
| W-01 | window/display variant | Narrow display window | Not separately exported; visible in `storefront-recombination-a.png` | ARC-008, ARC-030 | Small service/retail frontage | Display contents are review-only. |
| W-02 | window/display variant | Paired wide displays | Not separately exported; visible in `storefront-recombination-b.png` | ARC-009, ARC-005, ARC-028 | Retail density and rhythm | Needs reusable display-content library. |
| W-03 | window/display variant | Roll gate / shutter display | Not separately exported; visible in module sheet and `storefront-recombination-a.png` | ARC-008, ARC-026, ARC-027 | Service bay and off-hour texture | Gate glyphs are not final identity assets. |
| P-01 | street prop | Planter cluster | Not separately exported; visible across outputs | ARC-020, ARC-023, ARC-028 | Softens storefront base and adds local texture | Could repeat too visibly. |
| P-02 | street prop | Bike / bike rack | Not separately exported; visible in street/UI outputs | ARC-005, ARC-020, ARC-028 | Sidewalk scale and street specificity | Needs production simplification at small scale. |
| P-03 | street prop | Trash can | Not separately exported; visible across outputs | ARC-008, ARC-009, ARC-020 | Sidewalk utility rhythm | Should not dominate foreground. |
| P-04 | street prop | Mailbox / utility box | Not separately exported; visible in street/UI outputs | ARC-020, ARC-023, ARC-028 | Street edge anchor | Color needs palette guardrail. |
| P-05 | street prop | Sandwich board | Not separately exported; visible across outputs | ARC-008, ARC-009, ARC-023 | Fictional-safe storefront detail | Micro-copy is not product copy. |
| P-06 | street prop | Lamp / pole / bollard | Not separately exported; visible in `storefront-recombination-b.png`, `storefront-recombination-c.png`, street/UI outputs | ARC-001, ARC-007, ARC-020 | Vertical rhythm and curb scale | Production collision rules unresolved. |
| M-01 | marker state | Default marker | Not separately exported; visible in module sheet and UI proof | ARC-002, ARC-003, ARC-004, ARC-029 | Base map marker | Exact interaction API not defined. |
| M-02 | marker state | Hover marker | Not separately exported; visible in module sheet and UI proof | ARC-003, ARC-022, ARC-024 | Hover/focus preview | Needs final accessibility behavior later. |
| M-03 | marker state | Selected marker | Not separately exported; visible in `ui-integrated-recombination-v1.png` | ARC-024, ARC-029 | Primary selected state | Visual only; no app behavior changed. |
| M-04 | marker state | Selected building outline | Not separately exported; visible in `ui-integrated-recombination-v1.png` and storefront outputs | ARC-024, ARC-029, ARC-030 | Connects selection to world object | Needs production masking/hit-region strategy. |
| M-05 | marker state | Card anchor / tether endpoint | Not separately exported; visible in `ui-integrated-recombination-v1.png` | ARC-002, ARC-024, ARC-029 | Links card to selected storefront | Tether collision rules unresolved. |
| C-01 | place-card variant | Compact selected card | Not separately exported; visible in `ui-integrated-recombination-v1.png` | ARC-002, ARC-024, ARC-029 | Product-facing selected summary | Copy is placeholder and fictional. |
| C-02 | place-card variant | Hover preview card | Spec only; implied by UI references and marker family | ARC-003, ARC-022, ARC-024 | Lightweight preview state | Not separately rendered in Phase 6. |
| C-03 | place-card variant | Dense comparison/list card | Spec only; place-index and card pressure shown in UI proof | ARC-004, ARC-029 | Future index/card scaling option | Not a public interface. |
| U-01 | compact controls | Map controls pattern | Not separately exported; visible in `ui-integrated-recombination-v1.png` | ARC-002, ARC-024, ARC-029 | Product-facing compact controls | No app behavior or routing changed. |
| I-01 | place index | Compact place-index pattern | Not separately exported; visible in `ui-integrated-recombination-v1.png` | ARC-002, ARC-024, ARC-029 | Product-facing list selection pattern | No real data, distances, addresses, or factual metadata. |
| Q-01 | QA overlay | Review-only proof stamp | Not separately exported; visible in some proof boards | ARC-004, ARC-026, ARC-027 | Artifact status labeling only | Must remain separate from product UI. |
