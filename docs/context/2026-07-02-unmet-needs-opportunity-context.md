# Greenpoint Unmet Needs & Opportunity Context (condensed)

Source: *Greenpoint Unmet Needs & Opportunity Context* (Batu, reviewed 2026-07-02). Feeds the 2026-07-02 Track V pivot (`DECISION_LOG.md`, spec `2026-07-02-spatial-demand-test-design.md`).

## Core question & frame

Can Greenpoint Explorer become a **local intelligence and discovery layer** for *what is changing* in the neighborhood? Strongest framing:

> Greenpoint has a local information gap around change — what is closing, opening, being built, disrupted, contested, or worth supporting, and how that affects residents, visitors, and businesses at the block level.

Stronger than a generic guide, directory, civic dashboard, or pretty map. Product shorthand: **Greenpoint Change Map** — spatial, source-backed cards, each answering: *what happened · where · why it matters · who is affected · what you can do · what sources support it.*

## Ranked opportunities (100-pt model)

| Rank | Opportunity | Score | Read |
|---|---|---|---|
| 1 | Neighborhood change intelligence (openings/closings/development/transit/civic) | 89 | Best overall |
| 2 | Small-business visibility + resilience | 86 | Strongest income-adjacent |
| 3 | Transit disruption / G-train impact | 84 | Most time-sensitive validation |
| 4 | Waterfront / development explainer | 78 | High salience, higher trust risk |
| 5 | Street safety / mobility / McGuinness | 76 | Strong but politically charged |
| 6 | Environmental health / Meeker Plume | 73 | Important but sensitive; rigorous sourcing only |
| 7 | Events / local discovery | 68 | Useful, less proven as pain |
| 8 | Sanitation / rats / cleanliness | 63 | Frequent but generic, weak monetization |
| 9 | Parks / waterfront access | 62 | Civic value, weak product pull |
| 10 | Real-estate / moving-to-Greenpoint intel | 60 | Monetizable but may distort mission |

## Validation model (adopted as Track V go/no-go)

**Continue if:** ≥5 would check a weekly version · ≥3 ask to subscribe · ≥2 businesses ask how to be included · ≥1 business provides an offer/event/signup/story · someone shares a card unprompted · a local connector suggests sources/intros.

**Pause/reframe if:** people say "cool" but do nothing · businesses see no customer value · residents find it redundant with Greenpointers/Reddit/Instagram/Google Maps · civic content creates unhandleable trust concerns · it reads as generic local media with no spatial advantage.

## What NOT to build (yet)

Broad pain-point dashboard · generic directory · generic event calendar · full civic-issue database · Meeker Plume/environmental layer without rigorous sourcing · monetization infrastructure before business pull · a polished map before validating information utility.

> Trap to avoid: *a beautiful neighborhood map is not necessarily a useful product.* It must help people act, decide, support, attend, visit, understand, or participate.

## Product implication

Shift the *near-term framing* from "an illustrated map of Greenpoint" to "a spatial layer for what is changing, contested, useful, and worth supporting." The inked visual style stays an advantage; the differentiated utility is local context. (This is a sequencing/validation shift — the `PLAN.md` platform thesis is unchanged.)

## Card schema (source of the Track V shape)

The doc proposed `GreenpointChangeCard`; the SSG update refined it to `GreenpointMapCard` (see the SSG seed doc). Track V uses the `GreenpointMapCard` shape as throwaway JSON, canonical reconciliation deferred.
