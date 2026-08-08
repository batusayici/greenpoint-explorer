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

Roster additions are human-gated (`CLAUDE.md`) — this doc is the proposal, not the change. Adding all 24 would have grown the roster by half while contributing near-zero supply: **16 of the 24 are dead, empty, walled, or misfiled**, and the SSG "event calendar" field is not a reliable proxy for public dated programming.
