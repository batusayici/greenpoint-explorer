# Shop Small Greenpoint — July 2026 Newsletter (facts + Track V seed data)

Source: inaugural *Shop Small Greenpoint (SSG)* newsletter, received 2026-07-01 (first Wednesday cadence). Seed data for Track V (`2026-07-02-spatial-demand-test-design.md`). Addresses are as printed in the newsletter — **geocode/verify before publishing** (truth rule: real-world claims, attribute SSG as source).

## What SSG is (positioning input)

Volunteer-run initiative organized by local shop owners to support independent brick-and-mortar businesses in Greenpoint. Based **141 India St, Brooklyn NY 11222**. Monthly newsletter (1st Wed), mascot "Baggy," Instagram **@shopsmallgreenpoint** (daily event/news reposts to stories), a directory, a sponsorship program, and G-train advocacy. **→ Track V treats SSG as a content source we amplify spatially, not a partner-dependency** (`DECISION_LOG.md` 2026-07-02, Q1).

## New on the Map (→ `new_business` cards)

| Name | Address | Type | Note |
|---|---|---|---|
| Sailor + Siren | 817 Manhattan Ave | seafood / lobster roll | Grand opening Jul 3–5 |
| Core Press | 211 Franklin St | reformer Pilates / juice bar | wellness |
| Pooch's Parlor | 128 India St | pet grooming | appointment-only, strong brand personality |
| Giggles & Wiggles | 42 West St, Unit 103 | children's shoes / toys | entrance on Noble; family/kids |
| Cookies N' Cream | 963 Manhattan Ave | dessert / late-night sweets | cookies, milkshakes, sundaes |
| Sotteatery | 685 Manhattan Ave | plant-based Dominican-Caribbean seafood | dine-in / takeout / delivery / catering |
| Socceria | 46 Norman Ave | soccer sports cantina | World Cup relevance |
| Dreams on Command | 42 West St, Suite 105 | contemporary art gallery | social/political art focus |

## Extracurriculars (→ `event` cards)

- **Watch the World Cup** (through Jul 19) — event cluster across: Broken Land, Panzon, Rounders, Greenpoint Palace, Threes Brewing, Box House Hotel, Zumschneider, Socceria, Warsaw, Good Bar.
- **Sticker Buffet @ Yoseka Land** — Jul 4–12, retail event.
- **Summer Guest Series @ Threes Brewing Greenpoint** — from Jul 6. Lineup: Jul 6 Dante + NYC Cocktail Co · Jul 13 The Irish Exit Pub · Jul 20 Nomwah.

## Community Opportunities (→ `job` cards — parked layer, build only if demand shown)

Jubilee Marketplace (multiple) · Cafe Grumpy (assistant roaster) · Greenpoint Optometric Group (receptionist) · Greenpoint YMCA (part-time lifeguard) · Comic Book Station (e-commerce) · Keg & Lantern (line cook) · Beacon's Closet (multiple) · Glory (sales associate).

## Shop Talk — shopkeeper profile (→ outreach target)

**Perri — Owner & Curator of The WonderMart; lead organizer of SSG.** Key commerce signal: *"I participated in my first Shop Small Greenpoint crawl in Spring 2023 — and my sales doubled that week."* **→ named Track V tester** (Q6): show her the map as "a spatial layer that amplifies your issue — useful?"

## G-Train Advocacy (→ `g_train_support` layer, the hook)

SSG's asks (mirror as card actions):
1. Commit to spending locally on shutdown weekends; post about visits; encourage friends to "adopt" a favorite business.
2. If you can't visit — order pickup/delivery or buy gift cards for immediate cash flow.
3. File targeted MTA complaints (and contact electeds Lincoln Restler, Emily Gallagher, Kristen Gonzales) asking for: non-consecutive weekend closures · overnight-only disruptions · better shuttle frequency · clearer signage · recognition of retail-corridor economic impact.

**Live G-line closures through Greenpoint** (Court Sq↔Bedford-Nostrand incl. Greenpoint Av + Nassau Av; T403 shuttle):
- Fri Jul 10 9:45 PM → Mon Jul 13 5 AM (full weekend).
- Mon Jul 13 → Fri Jul 17, overnights 9:45 PM–5 AM (Mon–Thu).
- Later (reported, MTA-unconfirmed): Aug 8/15, Sep 12, Dec 5/12/19.

## Beyond SSG — hidden business engagement exemplars (Batu, 2026-07-02; non-SSG sources)

Events/subscriptions invisible unless you follow the business's own Instagram/email — the map surfaces them spatially, by day, with one-tap signup:

| Business | Address | Pattern | Facts |
|---|---|---|---|
| **Dandelion Wine** | 153 Franklin St (on the Franklin spine) | Same-day micro-event (→ `event` + Today lens) | Free in-store tasting "The New American Sparkling Wine," Jul 2 6–8 PM, announced by email only — founder pouring, Mongers Palate cheese, She Wolf Bakery bread, vinyl DJ, scratch-offs for first 20; wines $45–$105, delivery, 347-689-4563. Exemplar of the recurring tasting-email pattern; source fresh events at build time. |
| **Falu House** | 34 Norman Ave | Membership signup (→ `subscription` + `join` action) | Scandinavian deli, 8 AM–5 PM daily, (718) 554-3796. **Tinned Fish Club**: curated monthly box of cans + pairings; members get boxes, events, updates. Signup: faluhouse.com/tinned-fish-club-sign-up. |

## `GreenpointMapCard` schema (Track V shape — throwaway JSON, graduate later)

```ts
type GreenpointMapCard = {
  id: string;
  title: string;
  category:
    | "new_business" | "food_drink" | "shopping" | "service" | "event"
    | "arts_culture" | "family_kids" | "job" | "shopkeeper_profile"
    | "g_train_support" | "civic_action" | "discount" | "support_local"
    | "subscription";                       // hidden-engagement addendum
  startsAt?: string; endsAt?: string;       // ISO datetime on events → "Today" lens
  sourceCampaign?: "shop_small_greenpoint_july_2026" | string;
  locationName: string;
  address?: string; lat?: number; lng?: number; corridor?: string;
  summary: string; whyItMatters?: string;
  audience: Array<"resident"|"business"|"visitor"|"creator"|"family"|"job_seeker"|"civic_actor">;
  actions: Array<{ label: string; url?: string;
    type: "visit"|"learn_more"|"rsvp"|"buy_gift_card"|"order"|"apply"|"signup"|"join"|"file_complaint"|"share"|"submit_update"; }>;
  sourceLinks?: Array<{ title: string; url?: string; publisher?: string; date?: string; }>;
  relatedCardIds?: string[];                // place graph (moat) — sparse in v1
  timeline?: Array<{ date: string; title: string; summary?: string; sourceUrl?: string; }>; // dossiers are v2; field carried now
  evidenceStrength: "high"|"medium_high"|"medium"|"low";
  trustRisk: "low"|"medium"|"high";         // restored 2026-07-03
  monetizationRelevance: "direct"|"indirect"|"none";
  partnerRelevance: "high"|"medium"|"low";
  createdAt: string; updatedAt: string;
};
// Shape is neighborhood-agnostic by design — don't brand-lock to Greenpoint.
```
