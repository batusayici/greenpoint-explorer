# Place Source Policy

Status: Planning / proposed
Date: 2026-05-26
Creative direction owner: Batu
Implementation owner: Codex

## Purpose

This policy defines how Greenpoint Isometric Explorer treats public factual information about buildings, lots, addresses, businesses, and authored placement.

It applies before static style-frame approval, final visual direction approval, app implementation, production visual assets, and real-place card production.

## Source Hierarchy

Use the strongest available source for the claim being made.

For buildings, lots, and address context:

1. NYC Open Data / MapPLUTO or equivalent official city records.
2. Other official city or public agency records.
3. OpenStreetMap as a useful cross-check, not a sole authority for sensitive placement.
4. Manual street-level review.
5. Batu approval for any authored approximation or unresolved conflict.

For businesses:

1. The business's official website or official public profile.
2. Google Places or equivalent manual lookup for current identity, address, and operating status.
3. Other public directory or map references as secondary evidence.
4. Manual street-level review.
5. Batu approval for public representation when evidence is incomplete or conflicting.

## Source Freshness

Every real place candidate must include a `lastVerified` date.

`lastVerified` means the date Codex or Batu last reviewed the cited public sources. It does not mean the business is guaranteed current after that date.

Business status should be treated as stale or unknown if:

- Sources conflict.
- No current public source can be found.
- The only available source appears outdated.
- The place may have closed, relocated, or changed names.

## Conflict Resolution

Conflicts must be documented, not silently resolved.

If building, lot, address, or business sources disagree:

- Prefer official city records for lots, buildings, and address structure.
- Prefer official business sources for business identity and public description.
- Use map/directory sources as cross-checks for current status and address.
- Mark unresolved items as `unknown`, `placeholder`, `omitted`, or `manual-review-required`.
- Require Batu approval before representing a disputed real place in production visuals or cards.

## Public Factual Info Only

Place cards may use neutral public factual information only.

Allowed:

- Public name.
- Address.
- Broad category.
- Neutral factual description.
- Source URL or source label.
- `lastVerified`.
- Unofficial-map disclaimer.

Not allowed without explicit approval:

- Promotional claims.
- Private or sensitive information.
- Speculation about ownership, quality, popularity, politics, community role, or cultural meaning.
- AI-generated claims that are not grounded in cited sources.

## No Scraping Or Live Data For MVP

The MVP uses static local place data only.

Do not add:

- Scrapers.
- API clients.
- Live business status checks.
- Automated refresh jobs.
- Backend data services.
- User submissions.
- CMS flows.

Manual lookup and documented source review are allowed as preproduction research.

## Closed Or Unknown Businesses

Closed, relocated, renamed, stale, or unknown-status businesses must not be represented as active.

Use one of these outcomes:

- `active` only when current status is source-backed enough for MVP representation.
- `unknown` when the business may exist but current status is not confidently verified.
- `closed` when reliable public sources indicate closure.
- `placeholder` when the visual needs a generic storefront or non-real stand-in.
- `omitted` when representation would likely mislead.

## Unofficial-Map Disclaimer

Real-place cards must include an unofficial-map disclaimer.

The disclaimer should make clear that the project is an authored prototype, not an official map, directory, or real-time business listing.

## Manual Verification

Manual verification is required when:

- Source records conflict.
- A business is in a multi-tenant building.
- The storefront entrance is not obvious.
- The scene composition compresses or simplifies real geometry.
- Placement confidence is below the approved threshold.
- A real place would appear near another real place in a way that could imply false adjacency.

Manual verification notes must be recorded in the feasibility table or later approved data source.

## Field Photos And Manual Observations

Owned or explicitly approved field photos and manual observations may support facade cues, storefront/frontage notes, entrance-position notes, and manual verification.

They do not override:

- The source hierarchy for business identity, address, building, lot, or status claims.
- Conflict documentation.
- Stale or uncertain active-status handling.
- Storefront/frontage or adjacency uncertainty.
- Batu approval requirements for public representation, art translation, real-place cards, exact facades, exact addresses, exact station geometry, or implementation.

Missing or uncertain status, frontage, entrance, side-of-street, or adjacency must remain `unknown`, `placeholder`, `omitted`, `unresolved`, `blocked`, or `manual-review-required` until evidence and approval clear it.

## Batu Approval Requirements

Batu must approve:

- Final source hierarchy.
- Spatial coherence acceptance criteria.
- Manual overrides.
- Any disputed or approximate public representation.
- Any production use of real business cards.
- Any decision to use placeholders instead of real named places.

Codex may propose findings and policies, but Batu owns public representation approval.

## What Codex May Not Infer

Codex must not infer:

- A business is active without sufficient current public evidence.
- A business belongs to a building solely because it appears nearby on a map.
- A storefront entrance or tenant position without support.
- A corrected address without documenting the source.
- Cultural, quality, popularity, or community claims.
- Permission to move a real place for composition.
- Permission to imply adjacency that does not exist.

Uncertain claims must be labeled unknown, placeholder, omitted, unresolved, or manual-review-required.
