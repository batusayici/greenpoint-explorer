# MVP-08 Place Evidence Packet For Current Scene

Status: Complete for Batu/ChatGPT review
Date: 2026-05-29
Verdict: `revise`

## Purpose

This packet applies the MVP-07 evidence taxonomy to the current MVP scene and determines what each active place is eligible for next:

- Real-inspired art translation.
- Generic placeholder.
- Fictional-safe treatment.
- Blocked until additional evidence.

This is a review packet only. It does not approve app/source changes, visual assets, screenshots, production data, exact addresses, exact facades, exact storefront order, exact station geometry, public card copy, live scraping, staging, or commit.

## Active Scene Confirmation

Current active scene/place set confirmed from `src/mvpPlaceData.js`:

- Greenpoint Deli.
- McDonald's.
- Dunkin'.
- Citizens Bank.
- Greenpoint G subway.

No mismatch was found between the active source data, MVP-06 review artifact, MVP-07 pipeline artifact, MVP scope, plan, and current brief.

## Eligibility Summary

| Place | Identity / presence | Address / location confidence | Facade / art-reference status | Recommended art treatment | Eligible for real-inspired art translation? |
| --- | --- | --- | --- | --- | --- |
| Greenpoint Deli | `partial` via LiveXYZ identity/presence only. | `low`; address, parcel, storefront, entrance, and frontage unresolved. | `missing`; Google/Street View-style imagery blocked; LiveXYZ not approved facade evidence. | Fictional-safe deli/storefront or generic placeholder. | No. |
| McDonald's | `partial` via LiveXYZ identity/presence only. | `low`; address, parcel, storefront, entrance, and frontage unresolved. | `missing`; branded facade/signage unapproved. | Fictionalized quick-service storefront or generic placeholder. | No. |
| Dunkin' | `partial` via LiveXYZ identity/presence only. | `low`; address, parcel, storefront, entrance, and frontage unresolved. | `missing`; branded facade/signage unapproved. | Fictionalized coffee storefront or generic placeholder. | No. |
| Citizens Bank | `partial` via LiveXYZ identity/presence only. | `low`; address, parcel, storefront, entrance, and frontage unresolved. | `missing`; bank facade/signage unapproved. | Fictionalized bank/corner storefront, context-only, or omit. | No. |
| Greenpoint G subway | `medium` for transit context via MTA sources in current data. | `low` for exact access-point geometry; station-area context only. | `style-only`; exact station geometry blocked. | Symbolic transit anchor only. | No for exact real-inspired station geometry; yes only for symbolic transit cue treatment. |

## Evidence Packets

### 1. Greenpoint Deli

Evidence taxonomy:

- `identityStatus`: `partial`.
- `businessStatus`: `active-candidate`.
- `addressStatus`: `unresolved`.
- `parcelStatus`: `unresolved`.
- `storefrontStatus`: `unresolved`.
- `placementStatus`: `authored-approximation`.
- `facadeReferenceStatus`: `missing`.
- `cardEligibility`: `fictionalize`.
- `confidence`: `low`.

Approved evidence:

- User-provided LiveXYZ link retained in current data as identity/presence evidence only: `https://embed.livexyz.com/venue/5526f8acd8ca7000030002e4`.
- MVP-06 active prototype card labels this as identity/presence only.

Blocked evidence:

- LiveXYZ is blocked for facade, address, storefront frontage, entrance, exact placement, production art, and public card-copy claims.
- Google/Street View-style imagery is blocked as facade/art reference.
- The current scaffold raster is blocked as exact storefront order, exact address placement, or production visual reference.

Missing evidence needed to move forward:

- Current address from an official/business source.
- NYC parcel/building linkage, preferably BBL/BIN or equivalent city record.
- Storefront frontage, entrance, side-of-street, and adjacency verification.
- Owned, supplied, licensed, public-domain, or otherwise explicitly approved non-Google storefront photo/reference.
- Batu decision on whether the named deli may appear as a real card or should remain fictional-safe.

Recommended art treatment:

- Use a fictional-safe deli/storefront or generic corner-shop placeholder.
- Do not use real name/signage, exact facade cues, exact color/material cues, or exact placement until the missing evidence clears.

### 2. McDonald's

Evidence taxonomy:

- `identityStatus`: `partial`.
- `businessStatus`: `active-candidate`.
- `addressStatus`: `unresolved`.
- `parcelStatus`: `unresolved`.
- `storefrontStatus`: `unresolved`.
- `placementStatus`: `authored-approximation`.
- `facadeReferenceStatus`: `missing`.
- `cardEligibility`: `fictionalize`.
- `confidence`: `low`.

Approved evidence:

- User-provided LiveXYZ link retained in current data as identity/presence evidence only: `https://embed.livexyz.com/venue/5511c3063d42bd0003001146`.
- MVP-06 active prototype card labels this as identity/presence only.

Blocked evidence:

- LiveXYZ is blocked for facade, address, storefront frontage, entrance, exact placement, production art, and public card-copy claims.
- Google/Street View-style imagery is blocked as facade/art reference.
- Branded chain signage and trade dress are unapproved for current real-place art treatment.
- The current scaffold raster is blocked as exact storefront order, exact address placement, or production visual reference.

Missing evidence needed to move forward:

- Current address and active-status confirmation from official or approved sources.
- NYC parcel/building linkage.
- Storefront frontage, entrance, side-of-street, and adjacency verification.
- Approved non-Google facade/reference evidence.
- Batu decision on whether literal chain identity/signage is acceptable inside the fictional-safe visual direction.

Recommended art treatment:

- Use a fictionalized quick-service storefront or generic placeholder.
- Avoid literal brand marks, trade dress, exact signage, and real-inspired facade detail until brand and source evidence are approved.

### 3. Dunkin'

Evidence taxonomy:

- `identityStatus`: `partial`.
- `businessStatus`: `active-candidate`.
- `addressStatus`: `unresolved`.
- `parcelStatus`: `unresolved`.
- `storefrontStatus`: `unresolved`.
- `placementStatus`: `authored-approximation`.
- `facadeReferenceStatus`: `missing`.
- `cardEligibility`: `fictionalize`.
- `confidence`: `low`.

Approved evidence:

- User-provided LiveXYZ link retained in current data as identity/presence evidence only: `https://embed.livexyz.com/venue/5b50eecca3e3ee0003e4e0db`.
- MVP-06 active prototype card labels this as identity/presence only.

Blocked evidence:

- LiveXYZ is blocked for facade, address, storefront frontage, entrance, exact placement, production art, and public card-copy claims.
- Google/Street View-style imagery is blocked as facade/art reference.
- Branded chain signage and trade dress are unapproved for current real-place art treatment.
- The current scaffold raster is blocked as exact storefront order, exact address placement, or production visual reference.

Missing evidence needed to move forward:

- Current address and active-status confirmation from official or approved sources.
- NYC parcel/building linkage.
- Storefront frontage, entrance, side-of-street, and adjacency verification.
- Approved non-Google facade/reference evidence.
- Batu decision on whether literal chain identity/signage is acceptable or should be fictionalized.

Recommended art treatment:

- Use a fictionalized coffee storefront or generic placeholder.
- Avoid literal brand marks, trade dress, exact signage, and real-inspired facade detail until brand and source evidence are approved.

### 4. Citizens Bank

Evidence taxonomy:

- `identityStatus`: `partial`.
- `businessStatus`: `active-candidate`.
- `addressStatus`: `unresolved`.
- `parcelStatus`: `unresolved`.
- `storefrontStatus`: `unresolved`.
- `placementStatus`: `authored-approximation`.
- `facadeReferenceStatus`: `missing`.
- `cardEligibility`: `context-only` or `fictionalize`.
- `confidence`: `low`.

Approved evidence:

- User-provided LiveXYZ link retained in current data as identity/presence evidence only: `https://embed.livexyz.com/venue/64893028145f5b00018b86a7`.
- MVP-06 active prototype card labels this as identity/presence only.

Blocked evidence:

- LiveXYZ is blocked for facade, address, storefront frontage, entrance, exact placement, production art, and public card-copy claims.
- Google/Street View-style imagery is blocked as facade/art reference.
- Bank signage, real facade massing, and exact corner placement are unapproved.
- The current scaffold raster is blocked as exact storefront order, exact address placement, or production visual reference.

Missing evidence needed to move forward:

- Current address and active-status confirmation from official or approved sources.
- NYC parcel/building linkage.
- Storefront or building frontage, entrance, side-of-street, and corner-placement verification.
- Approved non-Google facade/reference evidence.
- Batu decision on whether a bank is valuable enough for MVP local specificity, or should become context-only, fictionalized, or omitted.

Recommended art treatment:

- Use a fictionalized bank/corner storefront only if it supports scene composition.
- Otherwise treat as context-only or omit.
- Do not use literal Citizens Bank signage, exact facade cues, or exact corner placement until evidence and brand treatment are approved.

### 5. Greenpoint G Subway

Evidence taxonomy:

- `identityStatus`: `verified` for station identity/context.
- `businessStatus`: `not-applicable`.
- `addressStatus`: `partial`.
- `parcelStatus`: `not-applicable`.
- `storefrontStatus`: `not-applicable`.
- `placementStatus`: `symbolic`.
- `facadeReferenceStatus`: `style-only`.
- `cardEligibility`: `context-only`.
- `confidence`: `medium` for transit identity/context; `low` for exact access-point geometry.

Approved evidence:

- MTA G line map source in current data supports Greenpoint Av station as a G line stop.
- MTA Greenpoint Av accessibility notice in current data supports station accessibility context.
- Approved reference corpus supports symbolic/stylistic treatment only.

Blocked evidence:

- Exact stair, elevator, access-point, station-footprint, and corner placement geometry are unresolved.
- Google/Street View-style imagery is blocked as station geometry or visual reference.
- The current scaffold raster is blocked as exact station geometry or production visual reference.

Missing evidence needed to move forward:

- Exact station access-point geometry from MTA neighborhood map, official station plans, owned field photos, or approved manual verification.
- Batu decision on whether the subway should remain a symbolic context anchor or receive a card.
- Approved visual-reference rule for any specific entrance, elevator, globe, stair, railing, or sign placement.

Recommended art treatment:

- Use a symbolic G subway anchor only.
- G-line color, civic transit cueing, and generic sign/globe language may support local readability as style-only cues.
- Do not draw exact stair/elevator/entrance geometry or imply official station mapping.

## Overall Verdict

Verdict: `revise`.

No current business is eligible for real-inspired art translation yet. Greenpoint G subway is eligible only for symbolic transit cue treatment, not exact real-inspired station geometry.

The current scene can proceed only with fictional-safe, generic, placeholder, or context-only treatment unless Batu/ChatGPT provide or approve additional address/location and facade/art-reference evidence.

## Recommended Next Task

Recommended next task: MVP-09 Current Scene Treatment Decision Brief.

The brief should ask Batu/ChatGPT to choose one path before any art translation or visual polish:

- Evidence acquisition path: gather/approve address, parcel/building, storefront/frontage, and non-Google facade-reference evidence for the current five places.
- Fictional-safe translation path: explicitly approve replacing current real-name facade ambitions with generic/fictional-safe storefront treatments while retaining only truth-safe identity/context labels where allowed.
- Cut/omit path: remove or downplay any current place that does not support MVP local specificity without overclaiming.

Visual Polish / Optional Ambient should remain blocked until that treatment decision is made.
