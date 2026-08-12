# Held cards — Wednesday Greenpointers pull, 2026-08-12

Roundup: [Enjoy nature, be healed, and more — What's Happening, Greenpoint? (8/13-19)](https://greenpointers.com/2026/08/12/enjoy-nature-be-healed-and-more-whats-happening-greenpoint-8-13-19/)

25 items parsed · 8 shipped in this PR · 6 duplicates skipped · 7 out-of-area or
gate-failing skips · **2 held, below.**

`holds: 1 new-judgment · 0 rule-miss · 1 source-blocked`

Both held items are time-critical — 8/13 and 8/15 — so neither survives to
Monday's full run.

---

## 1. Restorative Sound Journey @ Buffalo Firefly — Thu 8/13, 7pm · `source-blocked`

**Why held:** the roundup states everything except *where*. R1 on the linked
detail page was **denied at the proxy — `buffalofirefly.com` fails CONNECT with
403** — and Nominatim returns NO RESULT for `Buffalo Firefly, Brooklyn, NY`, so
the venue cannot be pinned and the Greenpoint-geography gate cannot be cleared.

That gate is doing real work on this particular roundup: **six of its 25 items
turned out to be Williamsburg**, several of them at venues whose names give no
hint (TALEA, Kings Co. Imperial, Marsha P. Johnson State Park). A venue nobody
has read an address for does not get assumed local.

**What would resolve it:** `buffalofirefly.com` on the routine's egress
allowlist, or one interactive-session fetch (egress is unrestricted there — the
fallback that settled `eventbrite.com` and `marianella.co` on 2026-08-10).

**Source line, verbatim:**

> Restorative Sound Journey @ Buffalo Firefly, 7 p.m.: Rest and restore with a bit of sound healing by way of Himalayan singing bowls, tuning forks, gongs, chimes, and bells led by trained healer Evie. $55, register here.

---

## 2. Flea Market @ Threes Brewing Greenpoint — Sat 8/15, 12–7pm · `new-judgment`

**Why held:** everything except the locally-owned gate is already settled. The
Eventbrite listing gives the address, the free-ness and the end time; 113
Franklin St geocodes inside the bbox; and the markets rule files it mechanically
(general-goods flea → no lens → `LENS_LESS_BY_DESIGN`).

The gate itself is what is ambiguous, and **the deck currently answers this
question both ways**:

| precedent | shape | outcome |
|---|---|---|
| `greek-kitchen` (2026-08-12) | independent, 2 locations (Brooklyn + Queens) | **dropped** under the gate |
| Brooklyn Craft Company | independent, 2 locations (Greenpoint + Lower Manhattan) | **ships weekly** — incl. `bcc-knitting-101-0817`, an item in this same roundup |

Threes Brewing is an independent Brooklyn brewery with two locations (Gowanus +
Greenpoint). Read one way it is Greek Kitchen; read the other it is BCC. That is
a choice between two plausible homes, so triage rule 2 says hold rather than
ship.

### Proposed rule (one line, for SKILL.md if approved)

> **The locally-owned gate turns on ATTRIBUTABILITY, not on counting locations.**
> An independently-owned business with more than one location passes when the
> claim being carded is unambiguously tied to the Greenpoint address; it fails
> when the source cannot attribute the claim to that address.

This reading keeps every existing precedent intact rather than overturning one.
Greek Kitchen's drop had a second leg that BCC and Threes both lack — its own
page opens *"Specials vary by location."* with separate Brooklyn and Queens
ordering links, so the rota was never attributable to 912 Manhattan Ave at all.
BCC's newsletter splits sessions under explicit `In Greenpoint:` /
`In Lower Manhattan:` headings, which is why its Greenpoint workshops ship. The
Threes listing names `Threes Brewing Greenpoint, 113 Franklin St.` outright.

Approving the rule ships this card and stops the question being re-argued the
next time a two-location local business appears.

**Source lines, verbatim:**

> Flea Market @ Threes Brewing, 12 p.m.: The brewery's first-ever flea market will feature art, vintage, books, and records from local vendors curated by Fig Shop, plus a live DJ and food from Grand Army. Plus, of course, drinks from Threes. Free, RSVP here.

> Threes Flea Market Tickets, Saturday, August 15  •  12 PM - 7 PM | Eventbrite
> Free to attend. Threes Brewing Greenpoint, 113 Franklin St.

**Card, authored and ready to ship on approval:**

```json
{
  "id": "threes-flea-market-0815",
  "category": "event",
  "title": "Threes Brewing's first flea market",
  "kicker": "Art, vintage and records, free entry",
  "summary": "Local vendors curated by Fig Shop, a live DJ, and food from Grand Army alongside the taproom's own beer. RSVP requested.",
  "startsAt": "2026-08-15T12:00:00-04:00",
  "endsAt": "2026-08-15T19:00:00-04:00",
  "filters": [],
  "free": true,
  "audience": ["resident", "visitor"],
  "locationName": "Threes Brewing Greenpoint",
  "address": "113 Franklin St, Brooklyn, NY 11222",
  "sourceQuote": "Flea Market @ Threes Brewing, 12 p.m.: The brewery's first-ever flea market will feature art, vintage, books, and records from local vendors curated by Fig Shop, plus a live DJ and food from Grand Army. Plus, of course, drinks from Threes. Free, RSVP here.\nThrees Flea Market Tickets, Saturday, August 15  •  12 PM - 7 PM | Eventbrite\nFree to attend. Threes Brewing Greenpoint, 113 Franklin St.",
  "actions": [
    {
      "label": "RSVP",
      "type": "learn_more",
      "url": "https://www.eventbrite.com/e/threes-flea-market-tickets-1995144108737"
    }
  ],
  "sourceLinks": [
    {
      "title": "Enjoy nature, be healed, and more — What's Happening, Greenpoint? (8/13-19)",
      "url": "https://greenpointers.com/2026/08/12/enjoy-nature-be-healed-and-more-whats-happening-greenpoint-8-13-19/",
      "publisher": "Greenpointers",
      "date": "2026-08-12"
    },
    {
      "title": "Threes Flea Market",
      "url": "https://www.eventbrite.com/e/threes-flea-market-tickets-1995144108737",
      "publisher": "Threes Brewing",
      "date": "2026-08-12"
    }
  ],
  "evidenceStrength": "high",
  "monetizationRelevance": "indirect",
  "partnerRelevance": "medium",
  "trustRisk": "low",
  "createdAt": "2026-08-12",
  "updatedAt": "2026-08-12",
  "lat": 40.7302402,
  "lng": -73.9578047
}
```

Shipping it also needs `"threes-flea-market-0815"` added to
`LENS_LESS_BY_DESIGN` in `julyCards.test.mjs`, and the deck-count and
`event`-count contract lines bumped by one.

---

## Not held — recorded so the reasoning is not re-derived next week

- **Morgan Craftz Pop-Up @ Pure Green Greenpoint, Sat 8/15** — skipped on the
  locally-owned gate. The vendor is a local artisan but the venue is a franchise
  location of a national juice-bar chain, and the gate is about the venue's
  operator. The roundup also states no price, no end time and no link.
- **Evolv Pros vs. Joes @ Vital Climbing Gym, Sat 8/15** — skipped on the
  locally-owned gate as a multi-state chain (not the two-location question
  above; this is the Warsaw/Live Nation shape). The only link is a Google Form,
  which is not a venue source.
