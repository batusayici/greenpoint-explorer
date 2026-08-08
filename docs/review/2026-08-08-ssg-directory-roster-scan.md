# SSG Directory → roster expansion scan (2026-08-08)

**Source:** Shop Small Greenpoint directory, https://shopsmallgreenpoint.carrd.co/#ssg-directory
**Full dataset:** the carrd page renders only the first 50 of 145 listings (IntersectionObserver lazy-load).
The widget's backing API returns all 145 as plain JSON:

```
https://embeddirectory.com/api/widget/widget_h8j9mDfYJHdnhu6q/items
```

**Baseline at scan time:** 49 web sources (`ingest-sources.json`) + 28 email senders (`ingest-ledger.json`) = 77 registered sources; 139 live cards.

---

## The load-bearing finding

Only **30 of 145** SSG businesses declare an in-store event calendar (custom field `1753633324884`).
The other 115 publish no programming — they are **map-coverage** candidates, not **source** candidates. Adding them to the roster would add fetch cost and zero dated supply.

Of the 30, **6 are already on the roster** (Brooklyn Craft Company, Last Place on Earth, Word, Flower Cat, Kettl Tea, Troost) — so the real question is the remaining **24**.

Every one of those 24 was probed: plain fetch, then cheap-endpoint probe (`.atom` / `?format=json` / RSS), then a real browser check on anything that came back thin or date-free. **A 200 with no dates is not evidence of an empty calendar** — half of these are JS-hydrated, and the browser pass reversed several calls in both directions.

Net: **8 of 24 are worth adding. 14 are verified not worth adding. 2 belong in a different channel.**

---

## Tier A — add as web sources (5)

Cheap fetch strategy confirmed, forward-dated content confirmed.

| Source | URL | Strategy | Evidence |
|---|---|---|---|
| **Macha Studio** (135 Franklin) | `machastudio.com/blogs/events.atom` | `feed` | Feed updated 2026-08-05; live entries "Summer Fridays listening party", "Summer Fridays After Hours", "Summer Poetry Open-Mic". Strongest single find. |
| **Maison Jar** (566 Leonard) | `maisonjar.nyc/` | `auto` | 26 date hits on plain fetch; `class="event"` markup; real listing — workshop on queer botany & native seed balls with a plant-based dinner. |
| **Lockwood** (98 Greenpoint Ave) | `data.accentapi.com/feed/66424.json` | `json` | Events are a SociableKit Facebook-page-events widget. The rendered page is JS-only (plain fetch missed it entirely), but the widget's backing feed is plain JSON. Live event: Tote-ally 20 Sale, Aug 14–16 2026. |
| **Greek Kitchen** (912 Manhattan) | `greekkitchen.nyc/specials` | `auto` | 7 day-name hits, Sat–Thu daily specials. Recurring deal supply, not events. |
| **Sparrow Nesting** (159-161 Driggs) | `sparrowny.com/blogs/events.atom` | `feed` | Low volume (last update 2026-06-23) but a free feed — "A Gathering for End of Life Doulas", "GRASP Grief Recovery". Distinctive supply nothing else covers. |

## Tier B — add as `standing: true` (3)

Recurring programming. These produce **one undated card**, not a dated-card firehose — the exact shape the pulse ledger's `UNMARKED STANDING?` signal exists to catch.

| Source | Why standing | Gotcha |
|---|---|---|
| **Happy Medium** (224 Franklin) | Drop-in Art Cafe sessions, ~8–10 slots/day, continuous | **Runs two locations.** The feed interleaves Greenpoint and Market Street (Manhattan) sessions. Needs a per-item location gate exactly like the WORD Jersey City filter. |
| **Brooklyn Hearts Club** (117 Franklin) | Adult art club, **every second Wednesday**, hosted at Madeline's | Their own link is a linktr.ee (weak). The recurrence rule is stated in the SSG directory entry itself — cite that. |
| **Edy's Grocer** (136 Meserole) | Ticketed dinners sold as Squarespace commerce items (e.g. "Dinner at the Grocer with Silvia Barban", $95, sold out) | Dates live on the **product** page, not the collection page. `?format=json` works on the collection. |

## Tier C — email/IG channel, not web sources (2)

| Business | Finding |
|---|---|
| **Otis & Finn** (197 Franklin) | Runs real community events — annual free Back-to-School haircut event, Pride Party — but publishes **no dated calendar**; the page is an email signup only. Sender candidate, human-gated subscribe. Back-to-School timing is live right now. |
| **The Coffee Shop** (269 Nassau) | SSG's calendar link *is* their Instagram. Falls straight into the known IG gap — no action until Instagram coverage exists. |

## Tier D — verified NOT worth adding (14)

Each was browser-checked unless noted. Recording the reasons so this scan does not get re-run from scratch.

| Business | Why rejected |
|---|---|
| **Madre** | `/events` is **private dining and venue-rental sales**, not public programming. Clean false positive from the SSG field. |
| **Clay Space** | `/events` lists only **past** events (Jun 12, May 31 — scan date Aug 8). The 46 date hits on plain fetch were stale. Real programming is class booking; re-probe `/classes` before reconsidering. |
| **UrbanCred** | "Upcoming Events" page renders empty. |
| **Goldies Bar** | `goldiesbrooklyn.square.site` is an unconfigured Square site — titles as "Home | My Site", zero content. |
| **The WonderMart** | Events page: "There are no scheduled events". Already covered as an email sender. |
| **Tula House** | Eventbrite org page, no upcoming events. |
| **Prospect Butcher Co. II** | Eventbrite org page, no dated content. |
| **Selformer** | Booking is **login-walled** (Wix auth). No public calendar. |
| **Exhibit Salon** | Rotating featured artist with **no dates at all**. |
| **Held Space** | SSG's URL (`/attend-an-offering`) **404s**; site is a practitioner-rental space. |
| **Blue Star Brothers** | One-off grand-opening page; returns 202 (bot challenge). |
| **Santa Fe Tailor Shop** | `share.google` redirect, no calendar behind it. |
| **Pueblo Querido** | Plain fetch thin (1047 chars), no dates. *Not browser-verified — low priority rather than proven empty.* |
| **Train with Miles** | 0 dates on both plain fetch and Squarespace JSON. *Not browser-verified.* |

---

## Two side findings

1. **Flower Cat URL — our roster is right, SSG is wrong.** SSG lists `flowercat.nyc/upcoming`, which **404s**. The roster's `flowercat.nyc/events` returns 200 and currently carries forward dates (Aug 8, 9, 16, 17, 23, 29). Related: the `LOW YIELD BY DESIGN` note on the Flower Cat sender looks **stale** — the web source is presently the productive one. Worth re-reading that note next run.

2. **141 Instagram handles, free.** The directory carries an IG handle for 141 of 145 businesses. If Instagram coverage is ever built, this is a ready-made seed list for the acknowledged IG gap — no re-scraping needed.

---

## Recommendation

Add **8** sources (Tier A + Tier B), taking the web roster 49 → 57. Subscribe to **Otis & Finn** separately.

---

# Part 2 — deals & memberships sweep (same day)

The scan above asked one question: *does this business publish dated events?* That is the wrong lens for
`discount` / `subscription` supply, and it produced **three false rejections**. Clay Space, Selformer and
Held Space were all written off in Tier D — and all three run **live, priced memberships**. The
event-calendar field measures events; it says nothing about whether a business sells a club.

Method: mine all 145 SSG descriptions for membership language (noisy — "classic" matches "class"), then
verify domains actually belong to the business and follow **the site's own** membership/deal links rather
than guessing paths.

Baseline: 23 `subscription`/`discount` cards already live. `discount` is schema-required to carry `endsAt`.

## Confirmed and cardable (6)

| Offer | Terms (verbatim from source) | URL |
|---|---|---|
| **WORD membership** | 4 tiers — Fan $5/mo, Friend $10/mo, Family $20/mo, Champion $100/mo. 5–25% off every purchase, event discounts, $10 birthday credit, free monthly ARC at Family+ | `withfriends.co/word/join` |
| **Held Space membership** | Community $129/month or $1029/year (2 months free), no minimum; higher tiers $329/mo and $396/mo. Unlimited members-only events ≥2×/week | `heldspacebk.com/membership` |
| **Selformer** | Summer Fling Unlimited $249/mo; Unlimited On-Demand Video $350/mo; packages $45–$399 | `selformer.com/plans-pricing` |
| **Clay Space membership** | $210–$650 by tier. **3-month minimum**, application-gated, requires 1+ year of consistent lessons | `clayspacebk.com/membership` |
| **Marianella subscription box** | $48/mo, auto-renews, skip or cancel anytime | `marianella.co/products/subscription-box` |
| **Driftaway Coffee subscriptions** | Coffee subscription roaster (85 Debevoise). Precedent: Kettl's mail-order tea subs are already carded | `store.driftaway.coffee/collections/subscriptions` |

**Two geography gates.** Selformer's unlimited plan reads "Williamsburg + Greenpoint" and WORD's membership
covers Brooklyn + Jersey City. Both are valid for the Greenpoint storefront, but the card copy must not
imply a Greenpoint-only benefit.

## RESOLVED — Brooklyn Winery has no wine club (Batu, 2026-08-08)

Held for a day as source-conflicted, now closed. **There is no wine club. Nothing ships, and nothing about
it should be carded from either page.**

The conflict was between two pages on the winery's own site:

- `/wine-club/` — "Stay tuned for more information about the future of our Wine Club by signing up for news."
- `/brooklyn-winery-specials-and-events/` — "Wine Club Wednesdays … First Wednesday of Every Month. Wine Club members can enjoy half-priced bottles for themselves and a guest."

**The specials page is the stale one.** That matters beyond this card: it advertises a standing, dated,
recurring member benefit in exactly the shape the ingest is built to card automatically — first Wednesday
of every month, a stated discount. If Brooklyn Winery is ever onboarded as a source, a run that reads only
the specials page will confidently card an offer that does not exist. **Do not trust
`/brooklyn-winery-specials-and-events/` for the wine club, and do not re-open this from that page alone.**

Worth keeping as the general lesson: the hold was correct. A single page read in isolation would have
shipped a false standing offer, and the only thing that caught it was two pages disagreeing.

## Already carded (1)

**Kettl Tea subscriptions** — `kettl-tea-subscriptions`. No action.

## Rejected, with reason (5)

| Business | Why |
|---|---|
| **Green Gooding** | False positive. The page states "no listing fees, **no monthly subscriptions**, and no hidden charges" — it is a peer-to-peer appliance-rental marketplace, and the hit was its seller-side page. |
| **Elevate BKLYN** | `/plans` renders only the headings "MEMBERSHIPS" and "PACKAGES" — no terms published (empty or broken Wix widget). Nothing citable. |
| **Minus Moonshine** | No club/membership page anywhere in the sitemap. (Also runs a Prospect Heights store — geography gate if revisited.) |
| **Dandelion Wine** | No membership or wine club found. Weekly tastings + free local delivery are perks, not a club. |
| **Brooklyn Craft Company** | The "join" hit was **Join our Team** — a recruiting page. |

## Weak / judgment call (1)

**WORD homeWORDbound Mystery Box** (`wordbookstores.com/homewordbound-mystery-box`) — a one-off curated
gift box, $25 minimum plus a $1 sign-up fee. **Not recurring**, so `subscription` is the wrong category.
The copy also reads as a COVID-era holdover ("get through the next few weeks"). Live and purchasable, but
confirm with WORD it is still current before carding.

---

# Part 3 — resolutions (Batu, 2026-08-08)

**Clay Space was rejected on the wrong page — corrected.** Part 1 dropped it because `/events` lists only
past items. Its live supply is elsewhere and plain-fetchable, and both pages are now on the roster:

- `/workshops` — one-off named workshops, forward-dated in prose ("Glaze Chemistry & Application … Upcoming dates: August 29-30 + Sept 2"). Entries reading "Fall 2026 (tba)" are **not** cardable until a date appears.
- `/semester-classes` — **Fall 2026 runs Sept 13–Dec 12, 12 weeks, $760 ($900 independent study), and public registration opens Aug 10 2026.** Winter 2027 releases late November. Term registration files as `subscription` on the audience lens, never deals_memberships.

The lesson generalises past this business: *a source was judged on one URL when its supply lived on another.*
The event scan's rejection list should be read as "this page had nothing", not "this business publishes nothing".

**Ruled on:**

| Item | Ruling |
|---|---|
| WORD homeWORDbound Mystery Box | Left out. Not recurring, copy reads COVID-era. |
| Brooklyn Winery wine club | **No wine club.** Closed. Its specials page still advertises "Wine Club Wednesdays" — that copy is stale and must not be carded. |
| Elevate BKLYN | No membership. Closed; do not re-probe. |
| Selformer "Summer Fling" $249/mo | Not carded — a deal that dies Aug 15 is not worth a slot. |
| Instagram coverage | Deferred. The 141 handles keep. |

**Sources added (57 → 65):** `held-space`, `selformer`, `clay-space-membership`, `clay-space-workshops`,
`clay-space-semester-classes`, `driftaway-subscriptions`, `marianella-subscription-box`, `otis-and-finn`.
All eight read over plain HTTP — 0 errors, no browser path. Six domains added to the tracked allowlist.

**WORD is the one gap left open deliberately.** `withfriends.co/word/join` carries its membership tiers over
a WebSocket — plain fetch returns 58KB of shell with zero signal — so watching it would mean a **fourth**
browser-dependent source. The existing `word-bookstore` entry already shares the host, so the card's
citation resolves; the tier prices simply are not machine-watched. Revisit only if the prices move.

## Housekeeping spotted en route

Two `discount` cards are at or past expiry: `poochs-parlor-first-groom` (`endsAt` 2026-08-08, today) and
`marianella-19th-anniversary-sale` (2026-08-09, tomorrow). Next `ingest:expire` run should clear them.

Roster additions are human-gated (`CLAUDE.md`) — this doc is the proposal, not the change. Adding all 24 would have grown the roster by half while contributing near-zero supply: **16 of the 24 are dead, empty, walled, or misfiled**, and the SSG "event calendar" field is not a reliable proxy for public dated programming.
