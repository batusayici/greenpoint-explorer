# Track V — Spatial Demand Test ("July in Greenpoint + G-Train Support")

Status: **v1 live (2026-07-02, updated 2026-07-03) — main (PR #4), deployed: <https://greenpoint-explorer.vercel.app/july.html>.** 26 cards (8 discovery · 15 events incl. the Greenpointers 7/2–7/8 week w/ one-tap ticket links · 1 subscription · 2 G-train actions). Plan: `docs/superpowers/plans/2026-07-02-track-v-spatial-demand-test.md`.
**Next (plan review, Batu + agent, 2026-07-03):** 1) instrumentation — DONE 2026-07-03 (named tap events via trackEvents.js + Vercel Web Analytics) · 2) forms — DECIDED (Tally, 2026-07-03); **BLOCKED on form URLs — CTAs still mailto, tap counts only**; swapping them is a pre-Jul-10 blocker (measurement note: pin_tap + card_open together = discovery interest; cta_tap counts intent, Tally responses count completions) · 3) schema catch-up — DONE 2026-07-03 (relatedCardIds/timeline/trustRisk in cardSchema.js, sparse seed links) · 4) factual review + Jul-10-weekend refresh · 5) distribute to cohort + Perri walkthrough over Jul 10–13 closure; **go/no-go review ~Jul 15**.
Branch: `feat/spatial-demand-test` (off `main`). Track R / `feat/r2-recognizable-storefronts` is **paused, not abandoned** (backed up to origin at `1f1c210`).
Owner: Batu (taste/approvals) / Agent (execution). Supersedes the near-term ordering of the 2026-06-23 "spine alive before expanding" decision.

## Why (the pivot)

Two strategy inputs reframe near-term priority:

1. **`docs/context/` — Greenpoint Unmet Needs & Opportunity Context.** The strongest opportunity is *neighborhood change intelligence* ("what changed here, and why should I care?"), and the mandate is to **validate demand cheaply before polishing the map further**. Central warning: *"A beautiful neighborhood map is not necessarily a useful product."*
2. **Shop Small Greenpoint (SSG) July 2026 newsletter.** SSG is a real, operating volunteer initiative (141 India St; monthly, first Wednesday; directory + events + jobs + shopkeeper profiles + G-train advocacy + Instagram reposting + sponsorship). It already owns the newsletter/directory space.

**Consequence:** don't build another newsletter/directory. Greenpoint Explorer's differentiated wedge is the **spatial + visual + action layer**. This track is a throwaway *demand test* of exactly that wedge — proving spatial context pulls real usage — before resuming container (Track R) craft.

## Positioning (locked in the 2026-07-02 interview; Greenpointers added 2026-07-03)

- **SSG is a content/information source layer we amplify spatially — not a partner-dependency, not a brand we sit under.** We add the spatial element; the value flows both ways. Independent, SSG-informed. (Interview Q1 = B.) **No "SSG companion" branding or partner CTA** — attribution on cards + Perri as tester, nothing more.
- **Greenpointers is the third actor** (added 2026-07-03, `docs/context/2026-07-03-greenpointers-differentiation.md`): the stronger incumbent in the "what's happening" lane. Treat as source / distribution partner / editorial authority / **potential map-embed customer** — never compete as a news product. Differentiation is structural: they answer *"what happened?"*; we answer *"where is it, how does it connect to my block, what changed over time, and what can I do?"* A generic news map is explicitly rejected — too easy to compare to Greenpointers, too easy for them to copy.
- **Moat = structure behind the pins, not pins.** Place graph (`relatedCardIds`), source-backed timelines, action workflows, measurable impact (clicks/signups/visits/orders). Pins alone are not defensible.

## Thesis to validate

> Greenpoint Explorer is the visual, spatial, and action layer for local campaigns, neighborhood change, and business support. Seeing *what's happening around you, where it is, why it matters, and what to do next* — on a map that is recognizably your neighborhood — is more useful than a list.

A flat card list would not test this. The artifact must **feel spatial and recognizably II-C**, or it fails to test the actual hypothesis.

### Sub-thesis: hidden business engagement (Batu, 2026-07-02 addendum)

Greenpoint businesses run **events and subscriptions that are invisible unless you already follow them** — buried in their Instagram accounts and email lists. Two live examples:

- **Dandelion Wine (153 Franklin St — on the Franklin spine):** a free same-day tasting ("TASTING TONIGHT 6–8: The New American Sparkling Wine," Jul 2 — founder pouring, Mongers Palate cheese, She Wolf bread, vinyl, scratch-offs) announced only via email newsletter. Pattern: **"happening today, near you"** — time-of-day-level event urgency no monthly newsletter or listing site surfaces.
- **Falu House (34 Norman Ave):** the **Tinned Fish Club** — a curated monthly membership box — lives only on their website/Instagram. Pattern: **subscription/membership signup** — a recurring relationship, not a one-time visit.

The map's job for businesses: **amplify these** — show what's happening in the area *that day* and where, and make subscription/signup one tap. This is the concrete shape of "business support flows" and directly serves the validation question *"would this help you get customers, signups, or event turnout?"*

## The artifact

**"July in Greenpoint + G-Train Support" — a standalone, independently deployable page.**

- **Separate route/entry in this repo, zero Three.js.** Stays lightweight; gets its own shareable URL (Vercel) for sending to 10–20 people. Decoupled from `Phase4BRuntimePreview` / the 46MB art pipeline.
- **Substrate:** a **real 2D Greenpoint map in the II-C inked identity** (Interview Q3 = B). Lead pick: **MapLibre GL JS** (open, no API key) with a custom II-C-palette style; **Leaflet + recolored basemap** fallback if vector styling fights us. Reuses existing II-C palette tokens (`palette.js`) for visual consistency.
- **Value proposition obvious in under 10 seconds; easy to screenshot or walk a business owner through.**

## v1 scope — static JSON seed (~15 cards)

**Discovery layer — 8 new businesses (SSG July issue), pinned by real address:**
Sailor + Siren (817 Manhattan Ave) · Core Press (211 Franklin St) · Pooch's Parlor (128 India St) · Giggles & Wiggles (42 West St, entrance on Noble) · Cookies N' Cream (963 Manhattan Ave) · Sotteatery (685 Manhattan Ave) · Socceria (46 Norman Ave) · Dreams on Command (42 West St, Suite 105).

**Events layer — with a "Today" lens:**
World Cup watch-cluster (mapped across the listed bars: Broken Land, Panzon, Rounders, Greenpoint Palace, Threes Brewing, Box House Hotel, Zumschneider, Socceria, Warsaw, Good Bar — through Jul 19) · Yoseka sticker buffet (Jul 4–12) · Threes summer guest series (from Jul 6) · **1–2 same-day micro-events in the Dandelion Wine pattern** (in-store tasting/happening announced via a business's own channels; the Jul 2 tasting is the exemplar — source current ones at build time). Events carry date/time so the map can answer **"what's happening near me today"** — a simple Today/This-week toggle, not a calendar UI.

**Business engagement layer (subscriptions/signups):**
1–2 `subscription` cards making a hidden membership one tap — anchor: **Falu House Tinned Fish Club** (34 Norman Ave, curated monthly tinned-fish box, signup link). Candidate second: a CSA/club/membership from another corridor business if easily sourced; otherwise ship with one.

**G-Train Support layer (the hook):**
Closure context + per-business actions: adopt-a-business, buy gift card / order pickup-delivery, "still open this weekend," and a "file MTA complaint" action (echoing SSG's advocacy asks — non-consecutive/overnight closures, better shuttle frequency, clearer signage, recognition of retail-corridor impact).

**Filters:** New · Food & Drink · Shopping · Services · Arts/Culture · Family/Kids · Events (+ Today toggle) · Clubs & Signups · G-Train Support.

**CTAs:** "Get weekly Greenpoint updates" (signup) · "Add your business / event / offer / update" (submission) · SSG source attribution on cards.

## Card schema — disposable shape, canonical discipline (Interview Q4 = C)

Author cards as **plain static JSON now** (no backend, no DB). Shape them from a **graduate-able schema** based on ChatGPT's `GreenpointMapCard` (fields: `id`, `title`, `category`, `sourceCampaign`, `locationName`/`address`/`lat`/`lng`/`corridor`, `summary`, `whyItMatters?`, `audience[]`, `actions[]`, `sourceLinks[]?`, `evidenceStrength`, `monetizationRelevance`, `partnerRelevance`, `createdAt`/`updatedAt`), **extended for the hidden-engagement patterns**: add `"subscription"` to `category`, `"join"` to action types, and optional `startsAt`/`endsAt` (ISO datetime) on events so the Today lens works; **and for the place-graph moat** (2026-07-03): optional `relatedCardIds?: string[]`, `timeline?: Array<{date, title, summary?, sourceUrl?}>`, and `trustRisk: "low"|"medium"|"high"` restored. These graph/timeline fields are cheap to carry now and are what make cards durable objects rather than pins; v1 may populate them sparsely (e.g. related G-train cards) — full dossiers are v2. Keep the shape **neighborhood-agnostic** (don't brand-lock to Greenpoint).

**Reconciliation with `PlaceStory` / `Landmark` into one canonical content model is a documented follow-up — NOT v1 work.** v1 must not fragment the existing schemas; it just must not paint us into a corner.

## Timeline — hook, not hard gate (Interview Q5-timeline = B)

Authoritative MTA G-line 2026 service changes (closed segment **Court Sq ↔ Bedford-Nostrand Avs includes Greenpoint Av + Nassau Av**):

| Date | Disruption |
|---|---|
| **Fri Jul 10, 9:45 PM → Mon Jul 13, 5 AM** | Full weekend G closure; free T403 shuttle |
| **Mon Jul 13 → Fri Jul 17, overnights** (9:45 PM–5 AM, Mon–Thu) | Overnight closures, same segment |
| ~Aug 5 | SSG August issue (cadence) |
| Aug 8/15, Sep 12, Dec 5/12/19 | Further weekend closures — reported, MTA-unconfirmed |

**July 10–13 is the news hook, not the ship deadline.** Closures recur, so we build with urgency but aim the **polished, Perri-ready cut at an early recurring window** rather than betting on the first weekend. Refresh seed data from the ~Aug 5 SSG issue when it drops.

## Validation

- **Audience (Interview Q6 = B):** residents / businesses / visitors **and Perri (WonderMart; SSG lead organizer) among the testers** — framed as "here's a spatial layer that amplifies your issue — useful?" Tests the win-win directly.
- **Go/no-go bar (approved):** continue if ≥5 say they'd check a weekly version · ≥3 ask to subscribe · ≥2 businesses ask how to be included · ≥1 unprompted share · **and SSG signals they'd want it.**
- **Business-side question (hidden-engagement addendum):** for businesses like Dandelion Wine / Falu House — *"your tastings/club live in your email list and Instagram; would a map card that surfaces them to nearby people get you turnout or signups? What would you put on it this week?"* A business offering a real event/subscription for listing counts toward the "≥1 business provides an offer/event/signup" signal.
- **Interview scripts (2026-07-03):** full Perri/business/resident question sets in `docs/context/2026-07-03-greenpointers-differentiation.md` — highlights: *"what do merchants ask SSG for most often?"*, *"what should NOT be built because SSG already handles it well?"*, *"which card would you click first?"*
- **Sharpened bar:** the test must prove **action, not just interest** — pause if the spatial layer doesn't change behavior or the artifact reads as "a pretty version of existing content."
- **Pause/reframe if:** people say "cool" but do nothing · businesses see no customer value · residents find it redundant with SSG/Reddit/Instagram/Google Maps · civic content creates unhandleable trust concerns · it reads as generic local media with no spatial advantage.

## Explicitly out of scope for v1

Backend/infrastructure · a full change/civic database · the Meeker Plume/environmental layer · a jobs-map layer (parked until demand shown) · monetization infra · integration into the 3D runtime · schema reconciliation · **automated event/subscription ingestion** (scraping Instagram/email/websites) — v1 events and subscriptions are **hand-curated seed**; an ingestion/submission pipeline is a post-validation follow-up, and the business submission CTA is its manual precursor. Change/civic layers and the recognizable-container fusion are v2 concerns — **v2 now has a named shape: living place dossiers** ("encapsulate and go deeper" — turn Greenpointers articles into linked spatial objects with timeline, status, both sides' claims, meetings, related places, actions; journalism-respecting, not journalism-replacing). Also explicitly rejected for v1 (2026-07-03, superseded by the interview): "SSG companion" branding/partner CTA · Jobs filter · civic cards (Monitor Point/McGuinness). **Post-validation business-model sequence** (do not build now): no charging individual small businesses first — sponsored campaign maps → partner tooling for SSG/Greenpointers → featured action cards paid only after evidence of clicks/signups/turnout. Details: `docs/context/2026-07-03-greenpointers-differentiation.md`.

## Trust rules

All cards are real-world claims. Attribute SSG as source; keep the G-train/civic content **informational, not advocacy-partisan** ("here's what changed, where, when, how to navigate / support"). The publish-time factual review gate applies before any public sharing beyond the test cohort.

## Plan changes made with this spec

- `PLAN.md`: **Track V inserted ahead of Track R** in active sequencing; Track R marked paused; "Now" and "Where we are" updated.
- `DECISION_LOG.md`: 2026-07-02 pivot entry.
