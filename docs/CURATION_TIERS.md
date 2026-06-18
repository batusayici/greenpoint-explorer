# Curation Tiers — Hero & Landmark (Phase 6.1)

Status: **Approved 2026-06-18 (Batu)** — the authoritative hero/landmark curation for v1.
Owner: Batu (curation/taste) / Agent (execution).
Source of truth for: which buildings get bespoke inked craft (hero), which carry story content (landmark), and which stay typological. Feeds Phase 7 (asset kit), Phase 8 (spine expansion + stories). See `docs/PLAN.md` "Sequenced Roadmap" and `landmark-strategy-v1`.

## Framework — two independent axes

A building is scored on two axes, because they don't always coincide (the Sidewalk Clock is a tier-1 *landmark* but not a *hero building*; a striking corner café can be a *hero* with no deep story).

**Axis 1 — Visual treatment tier** (how much inked craft):
- **Hero** — bespoke inked craft, exact recognizability, all camera-revealed faces. Earned, not default.
- **Typological** — rendered through the asset kit: correct material family, storeys, bays, storefront. Reads as *a real Greenpoint building of its type*, not a portrait. The default for the spine.
- **Graybox** — cheap massing, quiet, beyond the focal radius.

**Axis 2 — Landmark / story-object tier** (carries `Landmark` / `PlaceStory` content): `tier1` / `tier1.5` / `tier2` / `hold`, per `landmark-strategy-v1` verification gates (lore stays unverified until address + photo + archival confirmation).

**Hero budget — ~10–12 for all of v1.** Curated density: most of the ~92 built buildings stay typological. Hero count is governed here, not per block.

## Hero roster (v1 target)

| # | Building | Address | Story tier | Build status | Notes |
|---|---|---|---|---|---|
| 1 | Premier / Franklin Organic | 111 Franklin St | tier2 (business) | **built** | bodega, verified |
| 2 | Sonny's Corner | 142 Franklin St | tier1.5 | **built** | occupies the former Pencil Factory *bar* space; opened Feb 2026 |
| 3 | Sereneco | 113 Franklin St | tier2 | **built** | restaurant/bar |
| 4 | Azure Gourmet | 113 Franklin St | tier2 | **built** | shares Sereneco's building |
| 5 | 144 Franklin (Romanesque) | 144 Franklin St | tier1.5 | **built** | architecturally distinctive corner |
| 6 | Black Rabbit | (east block) | tier2 | **built** (typological today → promote) | longtime Greenpoint bar; strong local memory |
| 7 | Brouwerij Lane | ~78 Greenpoint Ave (verify) | tier2 | **data missing → add** | Batu-designated hero; not in current roster; **confirm current status + address before render** |
| 8 | Eberhard Faber Pencil Factory (the building) | Greenpoint Ave / Kent St cluster | tier1 | **Phase 8** (Franklin-north spine) | the industrial-history landmark itself — distinct from the closed bar of the same name |
| 9 | Astral Apartments | 184 Franklin St | tier1 | **Phase 8** (short Franklin-north extension) | Pratt worker housing; Queen Anne; archival-photo potential |
| 10 | St. Anthony–St. Alphonsus Church | 862 Manhattan Ave | tier1 | **later node** (Manhattan Ave) | skyline / orientation marker |
| 11 | Keramos Hall / CVS Chalet | 857–861 Manhattan Ave | tier1.5 | **later node** (Manhattan Ave) | "CVS chalet" — memorable facade |

Total: **11** (within budget). Heroes 1–9 are the Franklin corridor (this expansion cycle); 10–11 are flagged for the Manhattan Avenue node (a later, disconnected second cluster — see decision below).

**Not promoted (stay typological):** Threes Brewing, Maman, Elder Greene, Vamos al Tequila, Madeline's, Seven Wonders Collective, Kennaland, Tania Kovalenko, Land of Barbers / The Land of Barbers, Big Night, Alter.

## Landmark spine (Group B — content targets, mostly unbuilt)

The `landmark-strategy-v1` 15-pin launch cut. Heroes among these are listed above; the rest are pins/overlays/clusters rather than hero *buildings*.

| Landmark | Tier | Form | In this cycle? |
|---|---|---|---|
| Astral Apartments (184 Franklin) | tier1 | hero building | **yes** (Franklin-north) |
| Eberhard Faber district (Greenpoint/Kent) | tier1 | hero + cluster | **yes** (Franklin-north) |
| Greenpoint Historic District | tier1 | translucent overlay | overlay |
| Manhattan Ave Sidewalk Clock (753) | tier1 | micro-pin | later node |
| P.S. 34 (131 Norman) | tier1 | pin | later |
| St. Anthony–St. Alphonsus (862 Manhattan) | tier1 | hero/skyline | later node |
| McGolrick Park Shelter Pavilion | tier1 | pin/cluster | later |
| USS Monitor / Continental Iron Works | tier1 | 2 linked anchors | later |
| McCarren Play Center (776 Lorimer) | tier1 | pin | later |
| Former 19th Precinct (43 Herbert) | tier1 | discovery pin | later |
| Keramos Hall / CVS Chalet (857–861 Manhattan) | tier1.5 | hero | later node |
| Newtown Creek Nature Walk | tier1.5 | pin | later |
| Peter Pan Donut (727 Manhattan) | tier2 | pin | later |
| Kingsland Wildflowers (520 Kingsland) | tier2 | pin | later |
| Historic photo layer | tier1.5 | overlay layer | later |
| Hold set (Oak St "haunted," Calyer leaning house, Green St gear, …) | hold | — | verify first |

## Locked decisions (2026-06-18)

1. **Group-A hero promotions:** Black Rabbit and Brouwerij Lane → hero. The Eberhard Faber **building** → hero + tier1 (the bar of the same name has closed). Threes/Maman stay typological.
2. **Spine reach this cycle:** **Franklin-north first** — extend along Franklin to Astral Apartments + the Eberhard Faber / Kent cluster (one corridor, two tier-1 landmarks). Manhattan Avenue (Clock / Church / Keramos) is a later, separate node.
3. **Hero budget:** ~10–12 total for v1.

## Data corrections / open items

- **Stale roster record:** `"The Pencil Factory"` in `block-greenpoint-east-storefronts.v0.1.json` is the **closed bar** (now Sonny's at 142 Franklin). Truth rule: don't render a closed business as active. Action: drop/remap that storefront record; keep the Pencil Factory *building* as the Eberhard Faber landmark (hero #8).
- **Brouwerij Lane:** confirm current operating status + exact address before rendering (hero #7). Designated by Batu; not yet in any data file.
- **Code tagging (next):** add a `tier` field so the renderer/kit reads visual tier from data rather than ad-hoc per-building code. Decide where it lives (hero data file vs a tier registry) as the first Phase 6.1 execution step.
