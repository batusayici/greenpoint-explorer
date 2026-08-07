# Held cards — daily thin run, 2026-08-07

Two cards were authored and held. Neither shipped; neither was dropped.

**Both have the same root cause**, and it is not an editorial one: the routine's
proxy refuses browser/CONNECT traffic to the exact page that would settle each
card. `curl` to both hosts returns `CONNECT tunnel failed, response 403`. This is
the same failure that took the browser fetch path down for the whole run (see the
run report), so fixing the egress fixes both holds at once.

`holds: 0 new-judgment · 0 rule-miss · 2 source-blocked`

---

## 1. `nb-chess-challengers-corner-0813` — Challenger's Corner, Thu 8/13

**Hold reason (source-blocked):** the live recurring card
`nb-chess-parkhouse-0806` already covers chess at McCarren Parkhouse every
Thursday 7–11pm, which includes 8/13. Greenpointers gives Challenger's Corner a
date but no time and no price, so whether this is a *distinct ticketed event* or
a *named feature of a night already on the map* cannot be read off the source —
and a second card for the same venue on the same night would duplicate a live one
if it is the latter.

**R1 attempted and blocked.** The article links "Tickets can be purchased here" to
`https://www.eventbrite.com/e/north-brooklyn-chess-parkhouse-summer-residency-tickets-1990656783025`,
which is the organizer's own listing (so the aggregator rule does not bar it) and
would carry both the start time and the price. It is unreachable:
`CONNECT tunnel failed, response 403`.

**What would resolve it:** the Eventbrite listing becoming reachable from the
routine, or the club publishing the night on a plain-fetchable page. If it turns
out Challenger's Corner *is* just the 8/13 instance of the weekly night, the right
outcome is no new card — enrich `nb-chess-parkhouse-0806` instead.

```json
{
  "id": "nb-chess-challengers-corner-0813",
  "category": "event",
  "title": "Challenger's Corner at the McCarren Parkhouse",
  "kicker": "The chess club's ticketed showcase night",
  "startsAt": "2026-08-13T19:00:00-04:00",
  "endsAt": "2026-08-13T23:00:00-04:00",
  "locationName": "McCarren Parkhouse",
  "address": "855 Lorimer St",
  "geocodeQuery": "855 Lorimer St, Brooklyn, NY",
  "filters": ["games"],
  "summary": "Advanced players get a table against top competition; the club runs it inside its summer residency at the parkhouse.",
  "audience": ["resident"],
  "free": false,
  "actions": [
    {
      "label": "Get tickets",
      "type": "signup",
      "url": "https://www.eventbrite.com/e/north-brooklyn-chess-parkhouse-summer-residency-tickets-1990656783025"
    }
  ],
  "sourceLinks": [
    {
      "title": "Checkmate: North Brooklyn Chess Club Sets Up Summer Residency at the McCarren Parkhouse",
      "url": "https://greenpointers.com/2026/08/06/checkmate-north-brooklyn-chess-club-sets-up-summer-residency-at-the-mccarren-parkhouse/",
      "publisher": "Greenpointers",
      "date": "2026-08-06"
    }
  ],
  "sourceQuote": "For those looking to see what the club is all about, head to the Parkhouse on August 13 to experience the club's signature \"Challenger's Corner.\" Tickets can be purchased here .",
  "evidenceStrength": "medium",
  "monetizationRelevance": "indirect",
  "partnerRelevance": "medium",
  "trustRisk": "medium",
  "createdAt": "2026-08-07",
  "updatedAt": "2026-08-07",
  "relatedCardIds": ["nb-chess-parkhouse-0806"]
}
```

**The `startsAt`/`endsAt` above are NOT shippable as written.** They carry the
weekly residency's 7–11pm window, which the same article states for Thursdays in
general — not for this date specifically. That inference is exactly why the card
is held. Confirm at the ticket page before shipping.

---

## 2. `marianella-face-oil-collection` — 5 face oils for $97

**Hold reason (source-blocked):** the offer itself is stated plainly and
verbatim. The problem is the live card `marianella-19th-anniversary-sale`, whose
own 2026-08-02 source email advertised "new curated bundles with savings up to
60%" alongside the sitewide markdown. The $97 five-oil box may be a *distinct
this-week offer* or may be *one of those bundles* — i.e. a promotion already on
the map. Neither email says which, so shipping risks two cards for one offer.

**R1 attempted and blocked.** `https://marianella.co/products/face-oil-collection`
(the link the email's SHOP NOW button points to) would show whether $97 is a
standalone price or a sale price under the anniversary markdown. It is
unreachable: `CONNECT tunnel failed, response 403`. Note that `marianella.co` is
not a roster source, so it has never needed egress before.

**What would resolve it:** that product page becoming reachable, or a Marianella
email that names the two offers separately. If it is part of the anniversary sale,
the right outcome is to fold the detail into the live card, not to add this one.

```json
{
  "id": "marianella-face-oil-collection",
  "category": "discount",
  "title": "Marianella's five-oil box",
  "kicker": "Five full-size face oils for $97",
  "endsAt": "2026-08-09T23:59:00-04:00",
  "recurring": true,
  "locationName": "Marianella Market",
  "address": "83 West St, Brooklyn, NY 11222",
  "geocodeQuery": "83 West St, Brooklyn, NY 11222",
  "lat": 40.729398,
  "lng": -73.959338,
  "filters": ["deals_memberships"],
  "summary": "Squalane, marula, sea buckthorn, rosehip and plum. The shop sells the box on its own site; no closing date was given beyond this week.",
  "audience": ["resident"],
  "free": false,
  "actions": [
    {
      "label": "Shop the box",
      "type": "order",
      "url": "https://marianella.co/products/face-oil-collection"
    }
  ],
  "sourceLinks": [
    {
      "title": "Marianella Market email, 2026-08-06 (\"Five oils. One box. $97.\")",
      "url": "https://marianella.co/products/face-oil-collection",
      "publisher": "Marianella Market",
      "date": "2026-08-06"
    }
  ],
  "sourceQuote": "THE FACE OIL STACKER COLLECTION Five full size, 100% pure face oils. … THIS WEEK ONLY all 5 Oils for $97!",
  "evidenceStrength": "medium",
  "monetizationRelevance": "direct",
  "partnerRelevance": "high",
  "trustRisk": "medium",
  "createdAt": "2026-08-07",
  "updatedAt": "2026-08-07",
  "relatedCardIds": ["marianella-19th-anniversary-sale"]
}
```

`endsAt` follows the standing rule for an offer with no stated end date —
`recurring: true` plus verified-through the end of the edition week. That part is
not the hold; the duplicate question is.

---

## Not held, but worth Batu's eye

- **BCC Sewing 101: Tote Bag, Thu 8/13, Greenpoint** — fully sourced and
  shippable, deferred only by the 2-per-venue cap inside the live 7-day window.
  Queued in `watchItems`; the next run should card it.
- **Two newsletters publish their listings as images.** GUNK's entire "AUG SHOWS"
  calendar and Shop Small Greenpoint's "Extracurriculars" block are image graphics
  with empty or fragmentary alt text — zero extractable dates, venues or prices.
  Both are recorded as source facts in `watchItems`. Shop Small in particular
  teases real supply in its subject line ("Sticker Sale! BBQ! Movie Night!"), so
  it may be worth asking them for a text version.
