# Greenpoint Landmark Strategy — v1 Context

## Purpose

This document defines the recommended landmark, address, and information-layer strategy for v1 of the Greenpoint Isometric Explorer. The goal is not to map every historically notable building. The goal is to launch with a curated set of places that are visually recognizable, story-dense, locally meaningful, and useful for differentiated map layers beyond Google Maps.

## Product thesis

Greenpoint's strongest v1 content is at the intersection of:

1. **Official history** — LPC-designated landmarks, historic districts, civic buildings, industrial sites.
2. **Local lore** — places residents talk about, remember, debate, or use as informal neighborhood reference points.
3. **Then/now visual contrast** — locations with strong archival-photo potential or clear architectural continuity.
4. **Industrial / environmental identity** — shipbuilding, factories, Newtown Creek, water infrastructure, contamination, and waterfront reuse.

Do not treat landmarks as static POIs. Each should become a tappable story object with one or more layers: history, architecture, local memory, old photo, environmental context, or business/community relevance.

## Recommended v1 geography

Use a tight, story-dense spine rather than broad neighborhood coverage:

**Franklin St / Greenpoint Ave → Franklin St / Java St → Kent St / Greenpoint Ave → Manhattan Ave / Norman Ave → McGolrick Park / Monitor St → Newtown Creek / Paidge Ave.**

This gives v1 a walkable narrative arc:

- Historic residential Greenpoint
- Industrial Greenpoint
- Civic / commercial Manhattan Avenue
- McGolrick Park and Monitor memory
- Newtown Creek and industrial ecology

## Layer model

### Layer 1 — Official Landmarks / Historic District

Use this layer for LPC-designated landmarks and district boundaries. These are high-confidence anchors for credibility.

### Layer 2 — Stories Locals Tell

Use this layer for informal landmarks, beloved businesses, odd architecture, and Reddit/local-memory leads. These need verification before public copy is written.

### Layer 3 — Then/Now + Industrial Ecology

Use this layer for archival images, vanished industries, environmental history, waterfront reuse, and infrastructure stories.

## v1 landmark priorities

### 1. Astral Apartments

- **Address:** 184 Franklin Street, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Architecture; Social History
- **Why it matters:** One of the strongest single landmark stories in Greenpoint. Charles Pratt built it as model worker housing for Astral Oil Works employees. It has strong visual identity, strong social-history value, and clear map presence.
- **Content angle:** Worker housing, industrial paternalism, early apartment reform, Queen Anne architecture, Pratt's Greenpoint footprint.
- **Implementation note:** Make this a hero pin with archival image potential and a short “why this building looks different” explainer.
- **Source leads:** LPC landmark report; Greenpointers official landmark list; walking-tour sources.

### 2. Eberhard Faber Pencil Factory Historic District

- **Primary addresses:**
  - 37 Greenpoint Avenue
  - 39–45 Greenpoint Avenue
  - 47–61 Greenpoint Avenue
  - 58–76 Kent Street
  - 59–63 Kent Street
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Industrial History; Then/Now
- **Why it matters:** Best v1 anchor for Greenpoint's manufacturing identity. The pencil factory is visually iconic, easy to explain, and highly suited to old-photo overlays and adaptive-reuse storytelling.
- **Content angle:** Pencil manufacturing, German Renaissance Revival / Art Deco factory architecture, star-and-diamond motif, giant pencil facade elements, industrial reuse.
- **Implementation note:** Treat as a small district cluster, not a single pin. The 47–61 Greenpoint Avenue building can be the visual hero.
- **Source leads:** LPC Eberhard Faber report; Greenpointers official landmark list; Atlas Obscura; Historic Districts Council.

### 3. Greenpoint Historic District Core

- **Address / boundary:** Not a single address. The district includes parts of Java, Franklin, Kent, Milton, Noble, Calyer, Leonard, Oak, Guernsey, Lorimer, Greenpoint Avenue, Manhattan Avenue, and Clifford Place.
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Historic District Boundary; Architecture
- **Why it matters:** This should be the base historic layer for v1. It explains why parts of Greenpoint feel architecturally coherent and gives context for the residential fabric around the MVP area.
- **Content angle:** Shipbuilding-era residential growth, 19th-century houses, protected district boundaries, streetscape continuity.
- **Implementation note:** Render as a translucent district overlay, not a pin. Include individual pins only where a specific building has a strong story.
- **Source leads:** LPC district map; LPC designation report; Wikipedia overview; Greenpointers official landmark list.

### 4. Manhattan Avenue Sidewalk Clock

- **Address:** 753 Manhattan Avenue, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Local Icons; Oddities
- **Why it matters:** Small but memorable. It is exactly the kind of tappable micro-landmark that makes the product feel local rather than encyclopedic.
- **Content angle:** Cast-iron sidewalk clock, old commercial streetscape, Manhattan Avenue identity.
- **Implementation note:** Include as a small illustrated object/pin rather than just a building card.
- **Source leads:** Greenpointers official landmark list; Historic Districts Council.

### 5. P.S. 34 / The Oliver H. Perry School

- **Address:** 131 Norman Avenue, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Civic History; Architecture
- **Why it matters:** One of the strongest civic-history anchors. It is often described as Brooklyn's oldest continuously operating public school.
- **Content angle:** Public education, Romanesque Revival school architecture, neighborhood continuity.
- **Implementation note:** Good candidate for a “still in use” history card.
- **Source leads:** Greenpointers official landmark list; Historic Districts Council; walking-tour sources.

### 6. St. Anthony–St. Alphonsus Church

- **Address:** 862 Manhattan Avenue, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Architecture; Religious / Community History; Skyline Landmark
- **Why it matters:** Tall, recognizable, visually useful for orientation. Strong architectural and community-history value.
- **Content angle:** Gothic Revival church, Catholic immigrant communities, Patrick Charles Keely, spire as neighborhood marker.
- **Implementation note:** Use as a vertical orientation landmark in the isometric scene if the geography reaches this far.
- **Source leads:** Brooklyn Eagle winter walk; Greenpoint tour sources.

### 7. Shelter Pavilion and Attached Buildings, Monsignor McGolrick Park

- **Address / location:** Monsignor McGolrick Park, bounded by Driggs Avenue, Russell Street, Nassau Avenue, and Monitor Street, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Parks; Architecture
- **Why it matters:** Park anchor with official landmark status and a strong architectural object. Helps expand the map beyond Franklin/Manhattan into a second neighborhood node.
- **Content angle:** Public park history, shelter pavilion, landscape architecture, neighborhood gathering place.
- **Implementation note:** Pair with the USS Monitor Memorial nearby to make McGolrick a story cluster.
- **Source leads:** Greenpointers official landmark list; Historic Districts Council.

### 8. Greenpoint Monitor Memorial / USS Monitor Story

- **Memorial address / location:** Monsignor McGolrick Park, near Monitor Street, Brooklyn, NY 11222
- **Continental Iron Works historic site:** Foot of West Street and Calyer Street / Bushwick Inlet area, Greenpoint waterfront, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Industrial History; National History; Waterfront History
- **Why it matters:** The USS Monitor is one of Greenpoint's strongest national-history stories. It connects local shipbuilding to Civil War naval history and explains Monitor Street / McGolrick memorial context.
- **Content angle:** Continental Iron Works, Thomas Fitch Rowland, John Ericsson, Civil War ironclads, waterfront shipbuilding.
- **Implementation note:** Represent as a linked story with two map anchors: the memorial in McGolrick Park and the approximate historic construction/launch area near West/Calyer/Bushwick Inlet.
- **Source leads:** Brooklyn Eagle; Bowery Boys; Greenpointers Monitor article; NOAA Monitor Museum; Atlas Obscura.

### 9. McCarren Play Center

- **Address:** 776 Lorimer Street, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Public Works; Contested History
- **Why it matters:** Big public-space story with visual scale, Robert Moses/WPA context, and complicated social history.
- **Content angle:** 1936 public pool, WPA-era infrastructure, Robert Moses, public recreation, segregation and environmental contradictions.
- **Implementation note:** Good candidate for a deeper card rather than a short factoid.
- **Source leads:** Greenpointers official landmark list; NYC Parks/LPC references.

### 10. Former 19th Police Precinct Station House and Stable

- **Address:** 43 Herbert Street, Brooklyn, NY 11222
- **Priority:** Tier 1 / launch
- **Layer:** Official Landmarks; Civic History; Architecture
- **Why it matters:** Hidden civic relic with a strong “I walk by this but never knew” quality.
- **Content angle:** Former police precinct, stable building, Romanesque Revival civic architecture, late-19th-century municipal Greenpoint.
- **Implementation note:** Use as a discovery pin rather than a hero landmark.
- **Source leads:** Greenpointers official landmark list; Historic Districts Council.

### 11. Keramos Hall / CVS Chalet Building

- **Address:** 857–861 Manhattan Avenue, Brooklyn, NY 11222
- **Current retail anchor:** CVS at 859 Manhattan Avenue
- **Priority:** Tier 1.5 / verify and include if coverage reaches upper Manhattan Avenue
- **Layer:** Local Icons; Architecture; Industrial Patronage
- **Why it matters:** Strong local-recognition object. The “CVS chalet” framing is memorable, while the deeper story connects to Thomas C. Smith and Union Porcelain Works.
- **Content angle:** Swiss chalet-style architecture, ceramic/porcelain industry, adaptive reuse, strange Manhattan Avenue facade.
- **Implementation note:** This should bridge official-ish architectural history and local nickname/lore.
- **Source leads:** Historic Districts Council; Greenpointers; Brownstoner; Reddit/local-landmarks file.

### 12. Newtown Creek Nature Walk / Wastewater Resource Recovery Facility

- **Address / location:** Corner of Provost Street and Paidge Avenue, Brooklyn, NY 11222
- **Priority:** Tier 1.5 / launch if v1 includes industrial ecology layer
- **Layer:** Industrial Ecology; Environmental History; Infrastructure
- **Why it matters:** Greenpoint's industrial/environmental story is a differentiator. The Nature Walk gives visitors a legitimate place to experience that history, rather than just read about it.
- **Content angle:** Newtown Creek, Superfund context, wastewater infrastructure, industrial shoreline, public access, native planting/public art.
- **Implementation note:** Treat as the anchor for a creek/environment layer. Pair with Kingsland Wildflowers and historic industrial sites.
- **Source leads:** NYC DEP; NYC 311; Bowery Boys; Newtown Creek Alliance; Reddit/local-landmarks file.

### 13. Kingsland Wildflowers / Broadway Stages Green Roof

- **Address:** 520 Kingsland Avenue, Brooklyn, NY 11222
- **Priority:** Tier 2 / partner-source lead
- **Layer:** Industrial Ecology; Community Partners; Education
- **Why it matters:** Reddit/local-landmarks source specifically mentions its rooftop map/history of industrial buildings near the creek. Potential partnership or source for local interpretive content.
- **Content angle:** Green roof, creek ecology, industrial history mapping, community environmental education.
- **Implementation note:** Verify public access and permissions before making this a visitor-facing pin.
- **Source leads:** Reddit/local-landmarks file; Newtown Creek Alliance / Kingsland Wildflowers materials.

### 14. Peter Pan Donut & Pastry Shop

- **Address:** 727 Manhattan Avenue, Brooklyn, NY 11222
- **Priority:** Tier 2 / local culture layer
- **Layer:** Local Icons; Food / Commerce; Local Memory
- **Why it matters:** Not an official landmark, but a real neighborhood landmark. Strong visitor interest and local affection.
- **Content angle:** Long-running donut shop, Manhattan Avenue continuity, neighborhood memory.
- **Implementation note:** Include only if business-profile/content rights are handled. Potential business-card integration candidate.
- **Source leads:** Reddit/local-landmarks file; local press/business verification.

### 15. Greenpoint Manufacturing and Design Center

- **Address:** 1155 Manhattan Avenue, Brooklyn, NY 11222
- **Priority:** Tier 2 / industrial-adaptive reuse
- **Layer:** Industrial History; Adaptive Reuse; Local Economy
- **Why it matters:** Good north-end industrial reuse anchor. Mentioned in local-landmarks discussion as a must-have.
- **Content angle:** Manufacturing retention, industrial building reuse, makers/workspaces, north Greenpoint edge.
- **Implementation note:** Use if v1 extends to the end of Manhattan Avenue; otherwise hold for v2.
- **Source leads:** Reddit/local-landmarks file; GMDC materials; local history sources.

### 16. Greenpoint Savings Bank

- **Address:** 807 Manhattan Avenue, Brooklyn, NY 11222
- **Priority:** Tier 2 / verify for v1 if Manhattan Avenue cluster grows
- **Layer:** Architecture; Financial / Civic History; Local Icons
- **Why it matters:** Mentioned in the local-landmarks file as a classic building. Strong visual identity on Manhattan Avenue.
- **Content angle:** Bank architecture, neighborhood commercial prosperity, Manhattan Avenue civic/commercial spine.
- **Implementation note:** Needs source verification and current-use check before public copy.
- **Source leads:** Reddit/local-landmarks file; local architecture/history sources.

### 17. Home for the Aged / Red House / “Haunted House” Lead

- **Address:** TBD; likely Oak Street area, Brooklyn, NY 11222
- **Priority:** Tier 2 / verification required before inclusion
- **Layer:** Stories Locals Tell; Architecture; Local Lore
- **Why it matters:** Local lore items like this are exactly what can differentiate the product from Google Maps. But it must be verified before publishing.
- **Content angle:** Haunted-house lore, old residential/institutional architecture, memory vs documented history.
- **Implementation note:** Do not publish as fact until exact address, name, archival record, and photo evidence are confirmed.
- **Source leads:** Reddit/local-landmarks file; Greenpoint local historians; library archives; old maps.

### 18. Former Leaning House on Calyer Street

- **Address:** TBD; Calyer Street, Brooklyn, NY 11222
- **Priority:** Tier 2 / verification required before inclusion
- **Layer:** Stories Locals Tell; Oddities; Then/Now
- **Why it matters:** Strong visual/local-memory lead if there are photos. Good example of a “locals remember this” pin.
- **Content angle:** Leaning facade, neighborhood change, old-photo comparison.
- **Implementation note:** Needs exact address and visual evidence. If the condition changed, this may work better as a then/now archive story than a current landmark.
- **Source leads:** Reddit/local-landmarks file; local photo archives.

### 19. Huge Gear on Green Street

- **Address:** TBD; Green Street, Brooklyn, NY 11222
- **Priority:** Tier 2 / micro-landmark candidate
- **Layer:** Oddities; Industrial Memory; Local Lore
- **Why it matters:** Small, strange industrial artifact. Good for delight and discovery.
- **Content angle:** Industrial remnant, street object, “why is this here?” local curiosity.
- **Implementation note:** Verify whether it still exists, exact location, and whether it is publicly visible.
- **Source leads:** Reddit/local-landmarks file; field capture.

### 20. Historic Photo Cluster Streets

- **Addresses / street segments:**
  - Franklin Street near Calyer Street
  - Kent Street historic district blocks
  - Milton Street historic district blocks
  - Banker Street industrial blocks
  - Leonard Street historic district blocks
  - Clay Street industrial / residential edges
  - North Henry Street industrial edges
- **Priority:** Tier 1.5 / content layer, not individual landmark pins
- **Layer:** Then/Now; Archival Images; Streetscape History
- **Why it matters:** Old photos may become one of the highest-engagement layers. They let users compare the isometric present with historic Greenpoint.
- **Content angle:** Archival street views, demolished buildings, changed storefronts, industrial-to-residential transition.
- **Implementation note:** Build as a photo-overlay layer keyed to geocoded archival images. Do not over-pin until the exact photo locations are confirmed.
- **Source leads:** Greenpointers archive post; NYPL Digital Collections; OldNYC.

## v1 launch cut

Limit the public v1 to about **15 pins / clusters**. Recommended launch set:

1. Astral Apartments — 184 Franklin Street
2. Eberhard Faber Pencil Factory Historic District — 37, 39–45, 47–61 Greenpoint Avenue; 58–76 and 59–63 Kent Street
3. Greenpoint Historic District overlay — multi-street LPC boundary
4. Manhattan Avenue Sidewalk Clock — 753 Manhattan Avenue
5. P.S. 34 — 131 Norman Avenue
6. St. Anthony–St. Alphonsus Church — 862 Manhattan Avenue
7. McGolrick Park Shelter Pavilion — Driggs/Russell/Nassau/Monitor block
8. USS Monitor / Continental Iron Works story — McGolrick Park memorial + West/Calyer waterfront site
9. McCarren Play Center — 776 Lorimer Street
10. Former 19th Police Precinct Station House and Stable — 43 Herbert Street
11. Keramos Hall / CVS Chalet — 857–861 Manhattan Avenue
12. Newtown Creek Nature Walk — Provost Street and Paidge Avenue
13. Peter Pan Donut & Pastry Shop — 727 Manhattan Avenue
14. Kingsland Wildflowers — 520 Kingsland Avenue
15. Historic photo layer — Franklin/Kent/Milton/Banker/Leonard/Clay/North Henry clusters

## Hold / verify before public launch

These are promising, but should not ship without exact location and evidence:

- Red house / “haunted house” on Oak Street — address TBD
- Former leaning house on Calyer Street — address TBD
- Huge gear on Green Street — address TBD
- Former National Grid storage tanks visible from Kosciuszko Bridge — outside strict Greenpoint core; consider as “regional memory” later
- Old Carnegie library / prior Greenpoint library iterations — needs address and archival image packet
- Glass works / Glasserie-related industrial site on Commercial Street — needs exact building/source verification

## Content design guidance

Each landmark card should answer four questions quickly:

1. **What am I looking at?** Plain-language identity.
2. **Why does it matter?** One-sentence significance.
3. **What changed here?** Then/now or historical transformation.
4. **What layer does this unlock?** Official landmark, local lore, old photo, industrial ecology, civic history, business story.

Avoid long encyclopedia copy. The interaction should feel like tapping into a neighborhood guide who knows the place.

## Data fields to use in implementation

Suggested landmark object shape:

```ts
type Landmark = {
  id: string;
  name: string;
  address: string;
  addressStatus: 'verified' | 'approximate' | 'tbd';
  lat?: number;
  lng?: number;
  priority: 'tier1' | 'tier1_5' | 'tier2' | 'hold';
  layers: Array<'official_landmark' | 'historic_district' | 'local_lore' | 'then_now' | 'industrial_history' | 'environmental_history' | 'architecture' | 'civic_history' | 'business_culture'>;
  summary: string;
  storyHooks: string[];
  sourceUrls: string[];
  verificationNotes?: string;
};
```

## Source list

Primary sources and leads reviewed:

- Greenpoint Historic District overview: https://en.wikipedia.org/wiki/Greenpoint_Historic_District
- LPC Greenpoint Historic District map: https://www.nyc.gov/assets/lpc/downloads/pdf/maps/HistoricDistrictMaps/Brooklyn/greenpoint.pdf
- Greenpointers official Greenpoint landmark list: https://greenpointers.com/2018/01/02/hist-list-every-official-historic-landmark-greenpoint/
- NY Like a Native Greenpoint tour: https://www.nylikeanative.com/greenpoint-tour.html
- LPC Greenpoint Historic District designation report: https://s-media.nyc.gov/agencies/lpc/lp/1248.pdf
- Bowery Boys Greenpoint history: https://www.boweryboyshistory.com/2016/02/greenpoint-brooklyn.html
- Brooklyn Eagle winter walk through landmarked Greenpoint: https://brooklyneagle.com/93950/take-a-winter-walk-through-landmarked-greenpoint/
- Greenpointers archival photo post: https://greenpointers.com/2017/12/28/from-the-archives-more-historical-photos-of-greenpoint/
- LPC Eberhard Faber report: https://s-media.nyc.gov/agencies/lpc/lp/2264.pdf
- Historic Districts Council Greenpoint pages: https://hdc.org/borough/greenpoint/
- Keramos Hall / Historic Districts Council: https://6tocelebrate.org/site/keramos-hall/
- Newtown Creek Nature Walk / NYC DEP: https://www.nyc.gov/site/dep/environment/newtown-creek-nature-walk.page
- The Clio Greenpoint historical tour ("From Pencils to the 'Other Smithsonian'"): https://theclio.com/tour/2151
  - Stop 1 — Eberhard Faber Pencil Factory: https://theclio.com/tour/2151/1
  - Stop 2 — Astral Apartments: https://theclio.com/tour/2151/2
  - Stop 3 — Smithsonian Hall: https://theclio.com/tour/2151/3
  - Stop 4 — Greenpoint Savings Bank: https://theclio.com/tour/2151/4
  - Stop 5 — McGolrick Park (WWI monument): https://theclio.com/tour/2151/5
- Brownstoner — 144 Franklin Street history: https://www.brownstoner.com/history/greenpoint-brooklyn-history-144-franklin-street/
- Brownstoner — Building of the Day, 144 Franklin Street: https://www.brownstoner.com/architecture/building-of-the-day-144-franklin-street/
- Brooklyn Relics — public bath on Huron Street, Greenpoint: https://brooklynrelics.blogspot.com/2013/12/public-bath-on-huron-street-greenpoint.html
- Local-landmarks Reddit export: `/mnt/data/local landmarks reddit`

## Strategic recommendation

For v1, lead with **curated density**, not coverage. The best initial experience is a layered walk through 10–15 places that feel handpicked, visually grounded, and story-rich. Official landmarks give authority; local lore gives differentiation; old photos and industrial ecology make the map feel alive.

The strongest first content cluster is:

**Astral Apartments + Greenpoint Historic District + Eberhard Faber + Sidewalk Clock + PS 34 + Keramos Hall + USS Monitor / McGolrick + Newtown Creek.**

That set gives Greenpoint a clear identity in v1: residential history, manufacturing, local oddities, waterfront industry, environmental memory, and neighborhood icons.
