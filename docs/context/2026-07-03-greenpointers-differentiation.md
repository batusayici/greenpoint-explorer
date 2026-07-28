# Greenpointers Differentiation & Place-Graph Moat (condensed)

Source: *Greenpoint Explorer Differentiation vs Greenpointers* (ChatGPT context update, reviewed 2026-07-03). Feeds the Track V spec (`2026-07-02-spatial-demand-test-design.md`) and the 2026-07-03 `DECISION_LOG.md` entry. **Adopted items only** — see "Rejected" at the bottom for what Batu's 2026-07-02 interview decisions supersede.

> **Monetization section superseded 2026-07-28** by `docs/growth/business-model.md` (three-layer model; the claim model is retired). The Greenpointers *positioning* below — source, distribution partner, potential embed customer, never a news competitor — still holds and is now formalized as the distribution swap in that doc's §6.

## The third actor: Greenpointers

Greenpointers is the stronger incumbent in the "what's happening in Greenpoint" lane: local news, openings/closings, events, civic/development coverage, newsletter distribution, ad/sponsorship infrastructure, editorial trust, contributor infrastructure. **Greenpoint Explorer must not become "Greenpointers on a map"** — a generic neighborhood news map is too easy to compare to them and too easy for them to copy.

**Role framing (adopted):** treat Greenpointers as (1) source, (2) distribution partner, (3) editorial authority / credibility layer via links + attribution, (4) **potential customer for map embeds**. Not something to replace. (Parallel to SSG's role: merchant network, campaign partner, activation engine, seed-content provider, validation partner.)

**Differentiation, in one exchange each:**
- Greenpointers answers *"what happened?"* → we answer *"where is it, how does it connect to my block, what changed over time, and what can I do?"*
- SSG answers *"which businesses/events should I support?"* → we answer *"where are they, what campaign are they part of, what action do I take, and what's connected nearby?"*

## The moat: structure behind the pins

**"If the product is only pins on a map, it is not defensible."** Greenpointers, SSG, or Google could add pins. The moat is the combination: proprietary illustrated identity · **structured place graph** · source-backed change timelines · campaign/action workflows · multi-source synthesis · partner integrations · submissions · **measurable impact** (clicks, signups, visits, gift-card purchases, attendance). This is the concrete mechanics of the existing `PLAN.md` knowledge-graph defensibility thesis. Schema consequence (merged into the Track V card shape): `relatedCardIds?`, `timeline[]?` ({date, title, summary?, sourceUrl?}), and `trustRisk` restored.

## "Encapsulate and go deeper" — living place dossiers (named v2)

Leverage Greenpointers content without summarizing it: **turn local articles into linked spatial objects.** A Monitor Point article becomes a Monitor Point place card — location, timeline, current status, supporters'/opponents' claims, meeting dates, source links, related places, actions (read full article / attend / comment / share). A closure story becomes a business/building timeline card — what closed, why if known, what was there before, what's replacing it, who's affected, related nearby changes, support-local action. **Not a replacement for journalism — a living place dossier.** This is the structured form of the change/civic layer Track V deferred to v2 (interview Q2: v1 is discovery-forward).

## Business-model sequencing (adopted note — post-validation)

**Do not start by charging individual small businesses.** Earlier paths: (1) **sponsored campaign maps** (a local institution sponsors e.g. the G-Train Support Map) · (2) partner tooling for SSG/Greenpointers (they bring content/network/distribution; we bring the spatial interface, place graph, action layer) · (3) **featured action cards paid only after evidence** of clicks/signups/orders/turnout (proof-first trigger on the existing claim model) · (4) local-institution sponsorship of useful layers · (5) white-label neighborhood campaign maps, later, after Greenpoint proof.

## Expansion note

Greenpoint is the pilot; the repeatable concept is a *neighborhood spatial intelligence platform* (pilot → North Brooklyn adjacency → repeatable campaign/intelligence engine). **Don't brand-lock the data model to Greenpoint** — the card shape should be neighborhood-agnostic even while the product is Greenpoint-only.

## Validation interview scripts (adopted — for the Track V test)

**Perri / SSG:** Does a spatial companion make the newsletter easier to explore/share/act on? · Which section benefits most from being spatial? · Would this help during G-train shutdown campaigns? · Would merchants care about being included? · **What do merchants ask SSG for most often?** · What's hardest about running SSG? · Would a map make sponsor value clearer? · **What should NOT be built because SSG already handles it well?**

**Businesses:** Would this get you visitors/signups/orders/attendance/gift-card purchases? · What action would you want on your card? · Would you update it monthly / weekly / only during campaigns? · Would you pay, sponsor, or participate if SSG endorsed it? · What would make this better than Instagram, Google Maps, or the SSG newsletter?

**Residents/visitors:** Does the map help you decide where to go? · Would you use it during a shutdown weekend? · Would you subscribe to a weekly version? · Which card would you click first? · What feels missing?

**Sharpened bar:** the prototype must prove **action, not just interest** — pause if "the spatial layer does not change behavior" or it feels like "a pretty version of existing content."

## Rejected (superseded by Batu's 2026-07-02 interview — do not resurrect)

1. **"SSG Companion" positioning / partner CTA** ("a spatial companion concept for Shop Small Greenpoint") — conflicts with Q1: SSG is a **source layer we amplify**, independent, not a companion brand. Attribution on cards + Perri as tester stands; companion branding does not.
2. **Jobs filter in v1** — jobs layer stays parked until demand evidence (the doc's own predecessor said so).
3. **Civic cards (Monitor Point, McGuinness) in the near-term prototype** — v1 is discovery-forward (Q2); dossiers/civic explainers are v2. Adopt the *timeline schema* now, defer the *civic content*.
4. The doc predates the **hidden-engagement addendum** — `subscription` category, `join` action, Today lens (`startsAt`/`endsAt`) are kept in any schema merge.
