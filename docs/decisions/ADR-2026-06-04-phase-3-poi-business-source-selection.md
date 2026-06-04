# ADR: Phase 3 POI / Business Source Selection

Status: Proposed source strategy for Batu review
Date: 2026-06-04
Scope: Phase 3 Greenpoint Ave / Manhattan Ave to Greenpoint Ave / Franklin Ave review-only source strategy
Decision owner: Batu
Execution owner inside approved boundaries: Codex

## Context

Phase 3 needs a deterministic way to retrieve or record business/place evidence for non-west corridor targets such as Brouwerij Lane before any target is deepened beyond candidate/blocked status.

The source strategy must separate claim lanes:

- POI/business claims: business identity, public name, category, address, coordinates, freshness/status, source id, retrieved date, and provenance.
- Building/parcel/geometry claims: parcel, footprint, public building/address context, and street/intersection context.
- Facade/frontage/entrance claims: tenant frontage, storefront order, entrance placement, facade appearance, sign/window/door evidence, and visual-reference evidence.
- Raster readiness: whether a target has sufficient approved visual/reference material to appear in a corridor-specific raster/review surface.

Repo policy already warns that a source supporting one lane does not support another. POI/business data may support identity/address/category/coordinate/status claims, but it must not be used to infer facade, frontage, storefront order, entrance, exact geometry, or raster readiness.

## External Source References Reviewed

No live APIs were called, no scraping was performed, and no source records were retrieved for Brouwerij Lane in this ADR batch.

References reviewed for source-policy orientation:

- Google Places API policies and attribution: <https://developers.google.com/maps/documentation/places/web-service/policies>
- Google Places API usage and billing: <https://developers.google.com/maps/documentation/places/web-service/usage-and-billing>
- Foursquare Places API overview: <https://docs.foursquare.com/developer/docs/places-api>
- Foursquare Places API pricing: <https://foursquare.com/pricing/>
- Foursquare Places API PAYG terms: <https://foursquare.com/legal/terms/apilicenseagreement/>
- Foursquare Places OS schema orientation: <https://docs.foursquare.com/data-products/docs/places-os-data-schema>
- OSM attribution guidelines: <https://osmfoundation.org/wiki/Licence/Attribution_Guidelines>
- OSM API usage policy orientation: <https://operations.osmfoundation.org/policies/api/>
- NYC Open Data policy / technical standards manual: <https://a860-gpp.nyc.gov/downloads/5712m8144?locale=en>
- Live XYZ about page: <https://www.livexyz.com/aboutlive>

## Decision

Use separate source lanes instead of one merged "place truth" source.

Recommended Phase 3 lanes:

| Lane | Recommendation | Role |
| --- | --- | --- |
| Primary POI/business lane | LiveXYZ or Batu-approved local-directory/static export, if access, terms, caching, attribution, and fixture storage are approved | Best strategic fit for Greenpoint storefront visibility and front-door-oriented local business records. |
| Fallback POI/business lane | Foursquare Places API or Foursquare-provided export, after API key/billing/terms review | Practical commercial fallback for business identity, category, address, coordinate, and status/freshness fields when LiveXYZ/local-directory access is absent. |
| Open cross-check lane | OSM/Overpass or static OSM extract | Open corroboration for POI presence, names, tags, street/building context, and conflict discovery; not primary for active small-business status. |
| Geometry/context lane | NYC Open Data, official public records, and OSM geometry as supplemental | Building footprints, parcels, street/intersection context, and address containers only. |
| Facade/frontage/entrance evidence lane | Batu-supplied or Batu-approved manual evidence packets | Only lane allowed to support tenant frontage, storefront order, entrance placement, facade appearance, and visual-reference claims. |
| Manual override/review lane | Explicit manual evidence/override records | Conflict resolution, omitted/blocked fields, and review decisions; never hidden corrections. |

Google Places is not recommended as the primary Phase 3 deterministic fixture lane because its policy and attribution/caching restrictions are a poor fit for stored review fixtures and non-Google-map display. It may be used only as a restricted human review/cross-check lane after Batu approves terms, display limits, and what may be recorded.

## Source Comparison

| Source | Greenpoint small-business coverage | Freshness/current status | Address precision | Coordinate precision | Category quality | Licensing/cache/display risk | Provenance/citation support | Cost/rate limits | Deterministic fixture fit | Review burden | Facade/frontage/entrance support | Raster readiness support |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LiveXYZ / local-directory path | Potentially strongest strategic fit if access covers Greenpoint storefronts; claims storefront/front-door orientation | Unknown until access/export cadence and update policy are reviewed | Potentially strong if storefront records include addresses | Potentially strong if front-door or storefront coordinates are present | Unknown; likely local-directory categories may need normalization | Unknown until Batu reviews partner/export terms, storage, attribution, display, and cache rules | Good if export supplies stable ids, source dates, and source links; blocked if only browser-only access exists | Unknown; partner/export terms needed | Strong only if a static export or deterministic response packet can be checked in or hashed | Medium to high until schema/terms are known | Possible only if the source itself contains reviewed frontage/front-door evidence, but still needs Batu approval; cannot infer facade appearance | No by itself; visual/raster evidence still needed |
| Foursquare Places | Strong broad POI coverage; likely good for restaurants/bars/retail, but local storefront completeness must be tested | Good candidate because provider tracks POI status/freshness signals, but must verify response fields and closed/status semantics | Good for listed POIs; user-entered/source-normalized address quality still needs cross-check | Good for POI lat/lng; provider schema notes front-door/rooftop where available, but exact tenant frontage still not guaranteed | Strong category taxonomy; may need mapping to project categories | Medium/high: paid API terms, attribution, no material data exposure, cache/rate limits by account/terms | Good if provider id, response timestamp, endpoint, query, fields, attribution, and hash are recorded | Paid after free/low-volume tier; API key/billing required | Good if terms allow storing a bounded static response fixture or normalized excerpt; otherwise blocked | Medium: must inspect matches, closed/status, category mapping, and conflicts | No; POI coordinate is not tenant frontage/order/entrance proof | No; photos/tips are premium/restricted and still not production raster evidence |
| Google Places | Excellent broad coverage; likely strong for active businesses | Strong freshness/status signals | Strong address coverage | Strong point coordinates | Strong type/category coverage, though types may be coarse for local flavor | High: caching/storage/display/Google-map/attribution restrictions are mismatched with stored deterministic fixtures and custom non-Google display | Good ids and response fields, but recordable content is restricted; place id storage is the safer durable field | Billing and SKU complexity; key and billing required | Poor as primary fixture lane; acceptable only for restricted manual review/cross-check if approved | High legal/display review burden | No; Places data/photos must not imply facade/frontage/entrance permission or evidence | No; Google imagery/photos cannot become raster/reference input without a later explicit exception |
| OSM / Overpass | Variable; small businesses may be missing, stale, or unevenly tagged | Weak for current business status unless recently edited and corroborated | Variable; address tags may be absent or partial | Variable; node/way placement may be approximate | Variable tags; useful for open taxonomy/cross-check | Medium: ODbL attribution/share-alike considerations and public-service usage limits | Good open ids, tags, geometry, and retrieved dates can be recorded | Public endpoints have usage limits; static extracts preferred for determinism | Good for static extracts/hashes; weaker for live Overpass dependency | Medium: must inspect tags, dates, conflicts, and attribution | No by itself; building/POI geometry does not prove tenant frontage or entrance | No |
| NYC Open Data / official public records | Weak for active small-business POIs; strong for official context | Good for maintained public datasets, but not active tenant status | Strong for official address/public-record context when dataset supports it | Strong for footprints/parcels/geospatial datasets | Weak for business category unless using specific agency records | Low/medium: public-data terms and dataset-specific metadata still need recording | Strong dataset metadata, agency owner, update date, and stable dataset ids | Usually public, with possible portal rate limiting/app-token benefits | Strong for checked-in static exports and official dataset metadata | Medium: must join carefully and avoid overclaiming tenant facts | No; footprints/parcels do not prove storefront order, entrance, or facade | No |
| Manual evidence packets | Strong if Batu supplies current field photos/notes/approved references | Strong if captured/reviewed date is current | Strong if packet records address and reviewed basis | Strong only if coordinates or mapped context are included | Strong if category is explicitly reviewed | Depends on owner/licensing/allowed uses; must be explicit | Strong if packet includes owner, date, allowed/blocked uses, claims supported, and claims not supported | No API cost; high human time cost | Strong if packet files and hashes are checked in | High but honest; best for ambiguous storefront claims | Yes, if the packet explicitly supports those claims | Yes, if approved raster/reference evidence exists; still review-only unless later approved |

## Claim-Lane Rules

### POI / Business Claims

May be supported by LiveXYZ/local-directory, Foursquare, restricted Google cross-check, OSM corroboration, official business pages, or manual packets.

Allowed Phase 3 claims:

- Public business/place name.
- Provider/source id.
- Address as source-returned and normalized.
- Category/business type as source-returned and project-normalized.
- WGS84 coordinate as source-returned, with coordinate basis when known.
- Freshness/status only when the source explicitly provides it, with source semantics recorded.
- Retrieval timestamp, source URL/path/endpoint, query, fields requested, response hash, and usage/attribution status.

Not allowed from POI data alone:

- Tenant frontage.
- Storefront order.
- Entrance placement.
- Exact facade/window/door/sign geometry.
- Exact building footprint, parcel boundary, or scene placement.
- Raster readiness.
- Production/public card finality.

### Building / Parcel / Geometry Claims

Use NYC Open Data and official public records first, with OSM as supplemental context.

Allowed Phase 3 claims:

- Parcel/building/street/intersection context.
- Building footprint or public geometry as source geometry.
- Address container or public-record context where the dataset supports it.

Not allowed from geometry data alone:

- Current tenant identity.
- Active business status.
- Exact storefront segmentation.
- Entrance placement.
- Facade appearance.
- Raster readiness.

### Facade / Frontage / Entrance Claims

Use only Batu-supplied or Batu-approved evidence packets, with explicit ownership, reviewed date, usage rights, allowed uses, blocked uses, and claim support.

Allowed Phase 3 claims:

- Frontage/order, entrance, facade, sign/window/door cues, and visual-reference status only when evidence explicitly supports the claim.

Not allowed:

- Inferring facade/frontage/entrance from POI coordinates, address strings, building footprints, or category labels.

### Raster Readiness

Raster readiness requires approved corridor-specific visual/reference material and explicit review status.

Not allowed:

- Treating POI existence, address confidence, business popularity, source photos, map imagery, or building geometry as sufficient raster readiness.

## Normalized Deterministic Evidence Record Shape

This is a review-only normalized evidence shape for Phase 3 source packets. It is not a public interface or runtime schema approval.

```json
{
  "schemaVersion": "phase-3-poi-evidence.v0.1",
  "recordId": "poi-evidence-brouwerij-lane-YYYYMMDD-provider",
  "targetId": "brouwerij-lane-source-retrieval-candidate",
  "lane": "poi-business",
  "reviewOnly": true,
  "source": {
    "sourceType": "livexyz|foursquare|google-restricted|osm|nyc-open-data|business-official|manual-team-evidence|other",
    "providerName": "string",
    "providerRecordId": "string|null",
    "title": "string",
    "urlOrPath": "string",
    "accessMode": "static-export|api-response-fixture|manual-packet|restricted-review",
    "retrievedOrReviewedAt": "YYYY-MM-DD",
    "termsReviewedAt": "YYYY-MM-DD|null",
    "usageStatus": "public-data|attribution-required|approved-review-only|restricted|blocked|unknown",
    "attributionRequired": true,
    "cachePolicy": "checked-in-static-fixture-allowed|hash-only|place-id-only|ephemeral-review-only|blocked|unknown",
    "rawFixturePath": "string|null",
    "rawResponseHash": "sha256:..."
  },
  "query": {
    "queryText": "Brouwerij Lane Greenpoint Brooklyn",
    "locationBias": {
      "label": "Greenpoint Ave / Franklin Ave",
      "wgs84": null,
      "status": "candidate|blocked|unknown"
    },
    "fieldsRequested": [
      "id",
      "name",
      "address",
      "category",
      "coordinates",
      "status",
      "updated_or_freshness"
    ],
    "resultSelectionRule": "single-best-reviewed-match|manual-review-required|blocked"
  },
  "normalized": {
    "business": {
      "publicName": "string|null",
      "aliases": [],
      "categoryRaw": "string|null",
      "categoryNormalized": "string|null",
      "statusRaw": "string|null",
      "statusNormalized": "active|closed|unknown|blocked",
      "freshnessBasis": "string|null"
    },
    "address": {
      "rawAddress": "string|null",
      "normalizedAddress": "string|null",
      "borough": "Brooklyn",
      "city": "Brooklyn",
      "state": "NY",
      "postalCode": "string|null",
      "confidence": "high|medium|low|unknown"
    },
    "coordinates": {
      "wgs84": {
        "lat": null,
        "lng": null
      },
      "coordinateBasis": "front-door|rooftop|parcel|centroid|provider-point|unknown",
      "confidence": "high|medium|low|unknown"
    }
  },
  "claimSupport": [
    {
      "claimType": "identity|address|category|coordinates|freshness-status|geometry-context|facade|frontage|entrance|raster-readiness",
      "status": "verified|approximate|context-only|blocked|unknown|manual-review-required",
      "value": "string|null",
      "sourceField": "string|null",
      "confidence": "high|medium|low|unknown",
      "supports": [],
      "doesNotSupport": []
    }
  ],
  "crossChecks": [
    {
      "sourceRecordId": "string",
      "result": "match|conflict|missing|not-run",
      "notes": "string"
    }
  ],
  "blockedClaims": [
    "facade",
    "frontage",
    "entrance",
    "raster-readiness"
  ],
  "manualReview": {
    "required": true,
    "reviewedBy": "Batu|null",
    "reviewedAt": "YYYY-MM-DD|null",
    "approvalStatus": "proposed|approved|rejected|blocked",
    "notes": "string"
  }
}
```

Minimum deterministic acceptance for a future Brouwerij Lane POI record:

- Source access is approved and terms/usage/caching status are recorded.
- The raw response/export/manual packet is either checked in or represented by a stable local path plus SHA-256 hash.
- Provider id, source label, retrieval/review date, and attribution/display requirements are recorded.
- Each supported claim is listed separately from blocked claims.
- Geometry, facade, frontage, entrance, and raster-readiness fields remain blocked unless their own evidence lane supports them.

## Credentials / Access Needed

| Source lane | Required access | Blocked if missing |
| --- | --- | --- |
| LiveXYZ / local-directory | Batu-approved partner access, static export, API response packet, or local-directory evidence packet; terms covering storage/cache/display/attribution | Primary POI lane; Brouwerij identity/address/category/coordinates/freshness cannot be retrieved through the preferred lane |
| Foursquare | Developer account, API key, billing/payment setup if required, terms/caching/attribution review, approved endpoint/field list | Fallback POI lane; no deterministic fallback retrieval unless a bounded response fixture/export can be stored or hashed |
| Google Places | Google Cloud project, Places API enabled, API key/OAuth, billing, terms/privacy/display review, restricted-use approval | Restricted cross-check only; not primary fixture lane. Without approval, do not use or record Google-derived content beyond policy-safe references |
| OSM/Overpass | No credential for small manual/static extracts; use static extract or polite Overpass access if later authorized; ODbL attribution recorded | Open corroboration and OSM geometry/POI cross-check; does not block primary POI retrieval if LiveXYZ/Foursquare exists |
| NYC Open Data | Usually no credential; Socrata app token may help rate limits; dataset ids/metadata/update dates needed | Geometry/context lane; POI business identity remains blocked because NYC geometry/public records are not active-business sources |
| Manual packets | Batu-supplied files/notes, owner/source, captured/reviewed date, allowed/blocked uses, claim support, local path/hash | Facade/frontage/entrance/raster-readiness claims remain blocked |

## Narrow Brouwerij Lane Source-Spike Readout

Current repo state:

- `src/data/scenes/greenpoint-ave-manhattan-to-franklin.phase-3-scaffold.v0.1.json` tracks Brouwerij Lane only as a `blocked_source_retrieval` candidate under the Franklin endpoint.
- `docs/phase-3-brouwerij-source-retrieval-spike.md` records that no approved adapter, checked-in source response, endpoint contract, or credential exists.
- Historical local notes are not promoted into source-backed business data.

What can be source-retrieved once the chosen source/access exists:

- Business/place identity and provider id.
- Source-returned address and normalized address.
- Source-returned category/business type and project-normalized category.
- Source-returned WGS84 coordinates, with coordinate basis and confidence where available.
- Source freshness/status only if the provider returns explicit status/freshness semantics.
- Retrieval/provenance record: source type, title, endpoint or export path, retrieved date, query, fields, attribution, usage/caching status, and raw response hash.
- Cross-check result against OSM and/or NYC address/geometry context where available.

What remains blocked without separate facade/frontage/entrance evidence:

- Tenant frontage.
- Storefront order.
- Entrance placement.
- Facade appearance.
- Sign/window/door visual cues.
- Exact building-to-tenant segmentation.
- Raster readiness.
- Production/public card finality.

What must not be inferred from Brouwerij POI data:

- A point coordinate is not an entrance.
- A formatted address is not a storefront frontage.
- A business category is not facade appearance.
- A current/open status is not visual evidence.
- A provider photo, map link, or imagery availability is not permission to create raster assets.
- A building footprint or parcel join is not proof of tenant placement.

## Consequences

- Brouwerij Lane remains blocked for source-backed deepening until Batu supplies or approves one deterministic source packet/access path.
- If LiveXYZ/local-directory access is approved, it should be tried first because it aligns with local storefront coverage and the project's neighborhood-memory positioning.
- If LiveXYZ/local-directory access is absent, Foursquare is the preferred fallback for a narrow one-target retrieval, provided terms allow a bounded deterministic response fixture or normalized evidence record.
- OSM should be used as open corroboration, not as the authoritative active-business source.
- NYC Open Data should be used for geometry/context joins only.
- Manual evidence remains unavoidable for facade/frontage/entrance/raster readiness.

## Follow-Up

The next bounded batch should be one of:

1. Batu supplies/approves a LiveXYZ/local-directory Brouwerij Lane static source packet, and Codex normalizes it into the deterministic evidence shape.
2. Batu approves Foursquare credentials/terms and a bounded one-target response fixture/export path, and Codex performs a narrow Brouwerij Lane retrieval/normalization batch.
3. If neither source access path is available, Phase 3 records Brouwerij POI retrieval as blocked and shifts to a Batu-approved manual evidence packet or another bounded target/source decision.
