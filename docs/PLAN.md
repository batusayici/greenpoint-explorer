# Greenpoint Life — Plan

Status: Active roadmap · 2D pivot locked 2026-07-22 · Owner: Batu (taste/product/approvals), Agent (execution)

> **Roadmap only — milestone granularity.** Detail lives where it belongs: decisions & rationale → `docs/DECISION_LOG.md` · launch/PMF ops → `docs/launch/` · growth strategy → `docs/growth/growth-engine.md` · per-task designs → `docs/superpowers/specs/` · strategy → `docs/context/` · parked 3D track → `docs/parked/3d-explorer/`. Completed-work specifics (commits, files, tests) live in git history, not here.

## Product Goal

**Greenpoint Life is a hyperlocal map + feed for Greenpoint, Brooklyn** — the week's events, new openings, deals, memberships, and neighborhood news, verified and sourced, on a 2D map in the II-C inked identity. The sole goal is **real value and PMF**: residents return weekly because it's genuinely useful, and businesses/orgs want on it.

- **Product = the structured, trustworthy content layer.** Truth rules are non-negotiable: nothing invented, everything sourced, review-gated before ship.
- **Naming (2026-07-21):** consumer product is **Greenpoint Life**; the bought domain **greenpoint.life** becomes canonical at the domain cutover — the launch moment on the readiness list (2026-07-26 reframe). Repo keeps the `greenpoint-explorer` name.
- **Entry (2026-07-22):** the app serves at the site root (`index.html` → `src/demand-test/`); the old `/july.html` URL redirects with query params preserved.
- **Look:** II-C palette carries over from the parked art direction (`docs/parked/3d-explorer/ART_DIRECTION.md`) via `src/demand-test/iiMapStyle.js`. Out-of-palette color is a hard miss.

## Strategy (in brief — full frame in `docs/context/`)

- **Platform, not directory** — but validated one layer at a time. The live layer is events/openings/deals/news; stories, history, and routes are deferred until the utility loop proves itself.
- **Positioning:** Greenpointers answers *what happened*; we answer *where, what's connected, what changed, what can I do*. They are a source / distribution partner / potential embed customer — never a competitor as a news product.
- **Moat = structure behind the pins:** place graph (`relatedCardIds`/`timeline`/`trustRisk` in the card schema), verified sources, weekly freshness. This same structure is the answer-engine wedge (2026-07-21 decision): Greenpoint Life must be the source humans **and AIs** cite for Greenpoint events.
- **Coverage bar (2026-07-21):** 100% of on-concept local events + openings on the map, measured by a weekly coverage scan (Thu, post-Greenpointers-pull; 2026-07-22 cadence decision) diffed against live cards.
- **Growth model (2026-07-25 → `docs/growth/growth-engine.md`):** three loops, not funnels — weekly content (metric: weekly returning locals), supply (proactive supply actors), answer-engine (organic sessions); build effort goes to a loop's weakest edge. Retention-first sequencing; experiments are pre/post with pre-written kill criteria (max 3 live, no A/B machinery); channel–model fit rules paid acquisition out permanently ($0 revenue/user → owned + earned only).
- **Business model (2026-07-28 → `docs/growth/business-model.md`, constraints only; numbers in the gitignored `docs/private/business-model.md`):** a **neighborhood economic utility** — free, complete, verified coverage for residents, funded by the institutions and businesses that benefit from a legible local economy. Governing rule: **payers buy function or presence, never truth.** Bootstrapped indie. Three layers in order: Founding Partners → self-serve business layer → spatial intelligence (year 2). **PMF gate reinterpreted: sell before, ship after** — anchor conversations open pre-verdict, no paid surface goes live until after it. Permanent: residents never pay · coverage is never for sale · news and community surfaces never monetize · every paid surface labeled · no payer influences coverage. **No anchor deal without a distribution deliverable** — the model doubles as the awareness strategy. *(Supersedes the claim model and the sponsored-maps sequencing.)*

## Operating regime (2026-07-21 → `docs/launch/2026-07-21-pmf-ops-plan.md`)

Ingest runs as claude.ai cloud routines (2026-07-26 decision): Mon full + Tue–Sat daily thin + Wed Greenpointers pull, each landing as an `ingest/*` PR — **merging the PR is the review gate and the production deploy**; local scheduled tasks are disabled fallbacks. Weekly cadence on top: **Mon** analytics pull → **Tue** readout + live-experiment reads (growth-engine §6: continue / kill / graduate per pre-written rules) + top-3 proposals → **Wed–Fri** approved ships (TDD, preview-verified, gated deploy). The Tue readout is drafted by the **Growth Operator** (2026-07-27): a Tuesday cloud routine running `/growth-weekly` under the growth-engine §7 autonomy ladder — drafts and recommendations only, PR = review gate; created disabled, enabled at launch. Batu sends every outbound message; nothing user-visible deploys unapproved; decisions land in `DECISION_LOG.md`.

## Roadmap

- **Now — launch track (runbook of record: `docs/launch/2026-07-27-launch-plan.md` — cutover sequence, echo-chamber seeding waves, first experiment slate)** *(2026-07-26 reframe: Jul 15 was a friends feedback round, not a launch; the Jul 29 checkpoint gate is voided — exposure never happened — and Phase 3 is ungated)*: launch readiness in order — attribution kit (canonical tagged links, `?src=qr`) · de-July (shipped 2026-07-27: `cards.json` rename + evergreen meta) · OG tags + per-card deep links as real `/e/<slug>` paths (shipped; og.png LFS fix 2026-07-26) · business submission path · **answer-engine surface shipped 2026-07-26** (build-step prerender: per-event HTML + schema.org JSON-LD, sitemap, RSS/ICS, `llms.txt` — ops plan §3.6; prod curl + Rich Results acceptance after next deploy) · error monitoring (hard gate) · domain cutover = the launch moment · Reddit/local-groups + II-C QR window card. Jul 29 becomes a launch-readiness review. Lens re-cut shipped 2026-07-26 (things-to-do first, shopping folded into deals, live-music = dated gigs/ongoing programming only). R0 `return_visit` baseline collecting since 2026-07-26.
- **Then — weekly PMF loop (Aug → ~mid-Sep):** growth-engine experiment cadence (R1 weekly digest · R2 new-this-week marker · Q1 org seeding · Q2 parents-wedge post — §6 rules: max 3 live, pre/post reads only), iterate from observed pull. **Four validation gates** (re-registered pre-data 2026-07-28, `business-model.md` §4): demand (≥30 locals at ≥2 visits/week × 3 weeks, majority unprompted — ~Sep 15 provisional readout, firm verdict ~late Oct on two mature cohorts) · distribution (≥2 self-sustaining channels) · supply (≥5 proactive actors, ≥1 recurring) · commercial (3 paid pilots/LOIs — resident counts never open this gate).

## Open items & known gaps

- **Post-validation follow-ups:** reconcile the card schema with `PlaceStory`/`Landmark` into one canonical content model; v2 shape = **living place dossiers** (articles → linked spatial objects with timelines/claims/actions); business submission pipeline; refresh seed from the ~Aug 5 SSG issue. (Spec: `2026-07-02-spatial-demand-test-design.md` · context: `2026-07-03-greenpointers-differentiation.md`.)
- **Newsletter/calendar source audit (opened 2026-07-21):** roster additions + monthly discovery sweep are in `ingest-newsletters/SKILL.md`; still unswept: retail & services categories, additional civic/nonprofit orgs. Manual-only signups Batu finishes by hand: Warsaw, PLAY Kids Greenpoint (forms unreachable under automation). Coverage scans write gap reports to `docs/launch/coverage-scans/`; scans audit only — all card changes go through the review gate.
- **Jobs as a content category (Batu, 2026-07-26):** eventually test local hiring — "now hiring" cards from Greenpoint businesses — as a feed layer. Fits the supply loop (a reason for businesses to engage) and the utility thesis; needs a sourcing story that passes the truth rules before it ships. Not scheduled — candidate for a post-launch experiment slot.

## Parked: 3D isometric explorer (indefinite, 2026-07-22)

The original goal — a lifelike, hand-inked, isometric 3D Greenpoint — is **parked indefinitely** (DECISION_LOG 2026-07-22). It remains exciting and may be picked up later; resuming is an explicit Batu decision, not a milestone unlock. Everything is preserved:

- **Docs:** `docs/parked/3d-explorer/` (art direction, component inventory, curation tiers, scaling log, reference corpus).
- **Code:** parked in place on `main` — entry `explorer.html` → `src/main.jsx`; verifiers via `npm run verify`.
- **State at park:** container ~85% built along the Franklin spine (geometry, inked look, facades, multi-angle camera, place cards, block scaling); content layers ~5%. Paused branch: `feat/r2-recognizable-storefronts`.
