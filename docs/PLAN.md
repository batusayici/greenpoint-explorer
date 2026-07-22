# Greenpoint Life — Plan

Status: Active roadmap · 2D pivot locked 2026-07-22 · Owner: Batu (taste/product/approvals), Agent (execution)

> **Roadmap only — milestone granularity.** Detail lives where it belongs: decisions & rationale → `docs/DECISION_LOG.md` · launch/PMF ops → `docs/launch/` · per-task designs → `docs/superpowers/specs/` · strategy → `docs/context/` · parked 3D track → `docs/parked/3d-explorer/`. Completed-work specifics (commits, files, tests) live in git history, not here.

## Product Goal

**Greenpoint Life is a hyperlocal map + feed for Greenpoint, Brooklyn** — the week's events, new openings, deals, memberships, and neighborhood news, verified and sourced, on a 2D map in the II-C inked identity. The sole goal is **real value and PMF**: residents return weekly because it's genuinely useful, and businesses/orgs want on it.

- **Product = the structured, trustworthy content layer.** Truth rules are non-negotiable: nothing invented, everything sourced, review-gated before ship.
- **Naming (2026-07-21):** consumer product is **Greenpoint Life**; the bought domain **greenpoint.life** becomes canonical only if the Jul 29 checkpoint passes. Repo keeps the `greenpoint-explorer` name.
- **Entry (2026-07-22):** the app serves at the site root (`index.html` → `src/demand-test/`); the old `/july.html` URL redirects with query params preserved.
- **Look:** II-C palette carries over from the parked art direction (`docs/parked/3d-explorer/ART_DIRECTION.md`) via `src/demand-test/iiMapStyle.js`. Out-of-palette color is a hard miss.

## Strategy (in brief — full frame in `docs/context/`)

- **Platform, not directory** — but validated one layer at a time. The live layer is events/openings/deals/news; stories, history, and routes are deferred until the utility loop proves itself.
- **Positioning:** Greenpointers answers *what happened*; we answer *where, what's connected, what changed, what can I do*. They are a source / distribution partner / potential embed customer — never a competitor as a news product.
- **Moat = structure behind the pins:** place graph (`relatedCardIds`/`timeline`/`trustRisk` in the card schema), verified sources, weekly freshness. This same structure is the answer-engine wedge (2026-07-21 decision): Greenpoint Life must be the source humans **and AIs** cite for Greenpoint events.
- **Coverage bar (2026-07-21):** 100% of on-concept local events + openings on the map, measured by twice-weekly coverage scans diffed against live cards.
- **Monetization sequencing (post-PMF only):** sponsored campaign maps → partner tooling → evidence-gated featured cards; never charge small businesses first. Unclaimed businesses show category labels, not brands (claim model).

## Operating regime (2026-07-21 → `docs/launch/2026-07-21-pmf-ops-plan.md`)

Weekly loop: **Mon** `/ingest-newsletters` (review-gated) + analytics pull → **Tue** readout + top-3 proposals → **Wed–Fri** approved ships (TDD, preview-verified, gated deploy). Batu sends every outbound message; nothing user-visible deploys unapproved; decisions land in `DECISION_LOG.md`.

## Roadmap

- **Now — checkpoint week:** both invite waves out; scorecard pre-registered (`docs/launch/2026-07-29-checkpoint-readout.md`); Mon Jul 27 ingest → **~Jul 29 checkpoint** against the 2026-07-15 kit bar (weekly-check intents, postvalue signups, business asks, unprompted shares, content-type ranking), segmented by `?src=`.
- **Next (gated on checkpoint pass) — public cut + greenpoint.life:** OG tags + per-card deep links as real `/e/<slug>` paths · save/star + day filter (validated Laura/Edmond asks) · business submission path · **answer-engine surface** (prerendered per-event HTML + schema.org JSON-LD, sitemap, RSS/ICS, `llms.txt` — ops plan §3.6) · domain cutover · Reddit/local-groups + II-C QR window card. De-July reframe ships by Aug 1 regardless.
- **Then — weekly PMF loop (Aug → ~mid-Sep):** retention sensor, iterate from observed pull. **Two-sided PMF bar:** ≥30 locals at ≥2 visits/week for 3 consecutive weeks by ~Sep 15, majority unprompted; ≥5 supply-side actors proactively in, ≥1 recurring.
- **Fail at checkpoint → no public push:** ~5 qualitative interviews with warmest users; wedge-reframe proposal.

## Open items & known gaps

- **Post-validation follow-ups:** reconcile the card schema with `PlaceStory`/`Landmark` into one canonical content model; v2 shape = **living place dossiers** (articles → linked spatial objects with timelines/claims/actions); business submission pipeline; refresh seed from the ~Aug 5 SSG issue. (Spec: `2026-07-02-spatial-demand-test-design.md` · context: `2026-07-03-greenpointers-differentiation.md`.)
- **Newsletter/calendar source audit (opened 2026-07-21):** roster additions + monthly discovery sweep are in `ingest-newsletters/SKILL.md`; still unswept: retail & services categories, additional civic/nonprofit orgs. Manual-only signups Batu finishes by hand: Warsaw, PLAY Kids Greenpoint (forms unreachable under automation). Coverage scans write gap reports to `docs/launch/coverage-scans/`; scans audit only — all card changes go through the review gate.
- **De-July design (by Aug 1):** evergreen "this week in Greenpoint" frame; `july-2026-cards.json` → month-agnostic filename with ingest-skill migration note.

## Parked: 3D isometric explorer (indefinite, 2026-07-22)

The original goal — a lifelike, hand-inked, isometric 3D Greenpoint — is **parked indefinitely** (DECISION_LOG 2026-07-22). It remains exciting and may be picked up later; resuming is an explicit Batu decision, not a milestone unlock. Everything is preserved:

- **Docs:** `docs/parked/3d-explorer/` (art direction, component inventory, curation tiers, scaling log, reference corpus).
- **Code:** parked in place on `main` — entry `explorer.html` → `src/main.jsx`; verifiers via `npm run verify`.
- **State at park:** container ~85% built along the Franklin spine (geometry, inked look, facades, multi-angle camera, place cards, block scaling); content layers ~5%. Paused branch: `feat/r2-recognizable-storefronts`.
