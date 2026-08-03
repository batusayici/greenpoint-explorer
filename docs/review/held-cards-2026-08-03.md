# Held cards — Monday full refresh, 2026-08-03

Nine cards from this run were **authored but not shipped**. Each one tripped a
step-3 hold condition (SKILL.md §3): a claim the source doesn't actually carry,
a lens that had to be *chosen* rather than read off the source, or a missing
field that could only be filled by inference.

They live here rather than in `cards.json` on purpose: one of them (the ranger
fishing session) is lens-less, and the repo's own `no card is lens-less` test
would fail the branch if it sat in the deck. This file keeps the work intact and
CI green, so each card can be resolved and pasted in individually.

The clean cards from the same run already shipped in `f2d1f17` — a doubtful card
never delays the good ones.

---

## 1. Urban Park Rangers saltwater fishing — Sun 8/9

**Hold reason:** no lens can be assigned without inferring one. NYC Parks files
it under `Category: Urban Park Rangers, Fishing` and never calls it family or
kids programming, so `family_kids` would be a guess. Shipped lens-less, it fails
the repo's `no card is lens-less` test — which is exactly the gate working.

**What resolves it:** pick the lens. `family_kids` is the closest precedent
(`mcgolrick-bird-club-0808` earned it because Go Green Brooklyn tagged that walk
"Family Fun"). With a lens set, everything else about this card is ship-ready —
exact start and end times, exact meeting point, and free-ness all stated.

```json
{
  "id": "transmitter-saltwater-fishing-0809",
  "category": "event",
  "title": "Saltwater fishing with the Urban Park Rangers",
  "kicker": "Free ranger-led saltwater fishing",
  "startsAt": "2026-08-09T11:00:00-04:00",
  "endsAt": "2026-08-09T12:30:00-04:00",
  "locationName": "WNYC Transmitter Park",
  "address": "Greenpoint Ave & West St, Brooklyn, NY 11222",
  "geocodeQuery": "WNYC Transmitter Park, Brooklyn, NY",
  "lat": 40.729855,
  "lng": -73.960729,
  "filters": [],
  "free": true,
  "summary": "Meet the rangers at the West Street entrance. NYC Parks files the session under its free Urban Park Rangers programming.",
  "audience": ["resident", "family"],
  "actions": [
    { "label": "Event details", "type": "learn_more", "url": "https://www.nycgovparks.org/parks/transmitter-park/events" }
  ],
  "sourceLinks": [
    { "title": "WNYC Transmitter Park events", "url": "https://www.nycgovparks.org/parks/transmitter-park/events", "publisher": "NYC Parks", "date": "2026-08-03" }
  ],
  "sourceQuote": "Saltwater Fishing\n11:00 a.m. – 12:30 p.m.\nLocation: Entrance-West Street and Greenpoint Avenue (in WNYC Transmitter Park)\nCategory: Urban Park Rangers, Fishing Free!",
  "relatedCardIds": ["transmitter-park-restaurant-marina"],
  "evidenceStrength": "high",
  "monetizationRelevance": "none",
  "partnerRelevance": "medium",
  "trustRisk": "low",
  "createdAt": "2026-08-03",
  "updatedAt": "2026-08-03"
}
```

---

## 2–5. Brooklyn Craft Company workshops — location not stated per date

**Hold reason (all four):** the 7/31 newsletter lists each class with its dates
and then the line **"In Greenpoint and Lower Manhattan"** — it never says *which
date is at which location*. Brooklyn Craft Company is running a Lower Manhattan
"Summer in the City" pop-up concurrently (the same newsletter puts the drop-in
collage crafts at 225 Broadway). Pinning these at 165 Greenpoint Ave would be
inventing the venue, and a resident who shows up in Greenpoint for a Manhattan
class is the exact failure the geography gate exists to prevent.

Suggestive but **not** sufficient: the Needle Felted Pets booking URL slug is
`greenpoint-workshop-needle-felted-pets`. A URL slug is not a stated claim, and
the quote that carries the date doesn't carry the location.

**What resolves them:** open each booking URL — the product page states the
location per session. Any date confirmed as Greenpoint ships as authored; any
date that turns out to be Lower Manhattan gets dropped.

No time of day is stated for any of the four either, so each currently carries a
`00:00` start that must be corrected from the booking page before shipping.

| # | id | date | booking URL |
|---|----|------|-------------|
| 2 | `bcc-crochet-101-lil-bag-0806` | Thu 8/6 | https://www.brooklyncraftcompany.com/products/crochet-101-lil-bag |
| 3 | `bcc-sewing-101-tote-0809` | Sun 8/9 | https://www.brooklyncraftcompany.com/collections/all-workshops/products/sewing-101-tote-bag |
| 4 | `bcc-needle-felted-pets-0811` | Tue 8/11 | https://www.brooklyncraftcompany.com/products/greenpoint-workshop-needle-felted-pets |
| 5 | `bcc-crochet-101-lil-bag-0812` | Wed 8/12 | https://www.brooklyncraftcompany.com/products/crochet-101-lil-bag |

Shared card shape (substitute id, `startsAt`/`endsAt`, `title`, and the URL):

```json
{
  "id": "bcc-crochet-101-lil-bag-0806",
  "category": "event",
  "title": "Crochet 101: Lil' Bag",
  "kicker": "Beginner crochet, one small bag",
  "startsAt": "2026-08-06T00:00:00-04:00",
  "endsAt": "2026-08-06T23:59:00-04:00",
  "locationName": "Brooklyn Craft Company",
  "address": "165 Greenpoint Ave",
  "geocodeQuery": "165 Greenpoint Ave, Brooklyn, NY",
  "lat": 40.730461,
  "lng": -73.953114,
  "filters": ["arts_culture"],
  "summary": "A newly added session of the shop's beginner crochet class, which the same newsletter also runs at its Lower Manhattan pop-up.",
  "audience": ["resident", "creator"],
  "actions": [
    { "label": "Book", "type": "rsvp", "url": "https://www.brooklyncraftcompany.com/products/crochet-101-lil-bag" }
  ],
  "sourceLinks": [
    { "title": "Brooklyn Craft Company newsletter, 2026-07-31", "url": "https://www.brooklyncraftcompany.com/products/crochet-101-lil-bag", "publisher": "Brooklyn Craft Company", "date": "2026-07-31" }
  ],
  "sourceQuote": "Crochet 101 - Lil' Bag *New session added!* 8/6, 8/12, 8/22 In Greenpoint and Lower Manhattan",
  "relatedCardIds": ["bcc-kids-sewing-camp"],
  "evidenceStrength": "medium",
  "monetizationRelevance": "direct",
  "partnerRelevance": "high",
  "trustRisk": "medium",
  "createdAt": "2026-08-03",
  "updatedAt": "2026-08-03"
}
```

Source lines for the other three, verbatim:

- `bcc-sewing-101-tote-0809` — `Sewing 101 - Tote Bag 8/1, 8/9, 8/15, 8/20 In Greenpoint and Lower Manhattan`
- `bcc-needle-felted-pets-0811` — `Needle Felted Pets 8/11 & 8/23 In Greenpoint and Lower Manhattan`
- `bcc-crochet-101-lil-bag-0812` — same line as #2

---

## 6. Marianella Market 19th-anniversary sale

**Hold reason:** no end date anywhere. The email says the sale runs **"For a
little while"** — a `discount` card requires `endsAt`, and inventing a
verified-through window for a sale that explicitly ends at an unstated time
would put an expired offer in front of readers. The discount is also stated as a
range ("up to 60%", "up to 50% off sitewide"), which is a sitewide ecommerce
promotion rather than a neighborhood offer.

**What resolves it:** an end date from Marianella. With one, this ships as a
dated `discount` (not `recurring`).

```json
{
  "id": "marianella-19th-anniversary-sale",
  "category": "discount",
  "title": "Marianella's 19th-anniversary sale",
  "kicker": "Up to 50% off sitewide",
  "endsAt": null,
  "locationName": "Marianella Market",
  "address": "83 West St, Brooklyn, NY 11222",
  "geocodeQuery": "83 West St, Brooklyn, NY",
  "filters": ["deals_memberships"],
  "summary": "The shop is marking nineteen years with curated bundles alongside the sitewide markdown, plus free shipping.",
  "audience": ["resident"],
  "actions": [
    { "label": "Shop the sale", "type": "order", "url": "https://marianella.co/pages/store" }
  ],
  "sourceLinks": [
    { "title": "Marianella Market email, 2026-08-02", "url": "https://marianella.co/pages/store", "publisher": "Marianella Market", "date": "2026-08-02" }
  ],
  "sourceQuote": "Our anniversary sale continues, and we've added something special. Discover new curated bundles with savings up to 60%, alongside up to 50% off sitewide and free shipping. ... Thoughtfully made. Beautifully priced. For a little while.",
  "evidenceStrength": "medium",
  "monetizationRelevance": "direct",
  "partnerRelevance": "high",
  "trustRisk": "medium",
  "createdAt": "2026-08-03",
  "updatedAt": "2026-08-03"
}
```

---

## 7. Brooklyn Youth Ballet — adult ballet workout term

**Hold reason:** the lens is a choice, not a reading. An adult ballet workout
term sits plausibly in `wellness` (a body-conditioning class you enroll in) or
`arts_culture` (dance instruction). The 2026-08-02 rule says a term enrollment
goes to its **audience** lens and never to `deals_memberships` — but it doesn't
settle which audience lens an adult dance class belongs to.

**What resolves it:** pick `wellness` or `arts_culture`. Everything else is
stated: the term runs Sep 14 2026 – Jun 25 2027.

```json
{
  "id": "bk-youth-ballet-adult-term",
  "category": "subscription",
  "title": "Adult ballet workout term at Brooklyn Youth Ballet",
  "kicker": "Adult ballet, pick your time slot",
  "endsAt": "2027-06-25T23:59:00-04:00",
  "locationName": "Brooklyn Youth Ballet",
  "address": "37 Greenpoint Ave",
  "geocodeQuery": "37 Greenpoint Ave, Brooklyn, NY",
  "lat": 40.729869,
  "lng": -73.959022,
  "filters": [],
  "summary": "The studio's adult track runs on the same September-to-June calendar as its youth classes, with several weekly slots to choose between.",
  "audience": ["resident"],
  "actions": [
    { "label": "See the calendar", "type": "learn_more", "url": "https://bkyouthballet.com/calendar/" }
  ],
  "sourceLinks": [
    { "title": "Brooklyn Youth Ballet calendar", "url": "https://bkyouthballet.com/calendar/", "publisher": "Brooklyn Youth Ballet", "date": "2026-08-03" }
  ],
  "sourceQuote": "Adult Ballet Workout\nExpert-led adult ballet workouts in Greenpoint, find a time based on your schedule\nRuns September 14, 2026 – June 25, 2027",
  "relatedCardIds": ["bk-youth-ballet-enrollment"],
  "evidenceStrength": "high",
  "monetizationRelevance": "direct",
  "partnerRelevance": "high",
  "trustRisk": "low",
  "createdAt": "2026-08-03",
  "updatedAt": "2026-08-03"
}
```

---

## 8. Brooklyn Youth Ballet — $40 new-student trial class

**Hold reason:** two rules collide. It is a discounted trial, which points at
`deals_memberships`; but it is a trial at a *youth* ballet school, and the
2026-08-02 "kids events go in kids" rule says anything authored for children is
`family_kids` and must not double-file. Nothing in the source settles which rule
wins. Separately, the offer states no expiration, so `endsAt` would have to be a
chosen verified-through date.

**What resolves it:** the lens call, plus a decision to treat it as a
`recurring` standing offer verified through the edition week.

```json
{
  "id": "bk-youth-ballet-trial-class",
  "category": "discount",
  "title": "$40 trial class at Brooklyn Youth Ballet",
  "kicker": "One trial class, credited to tuition",
  "endsAt": null,
  "recurring": true,
  "locationName": "Brooklyn Youth Ballet",
  "address": "37 Greenpoint Ave",
  "geocodeQuery": "37 Greenpoint Ave, Brooklyn, NY",
  "lat": 40.729869,
  "lng": -73.959022,
  "filters": ["deals_memberships"],
  "summary": "New students can take one class before committing to a semester, and the fee comes off tuition if they enroll. Limit one per student per semester.",
  "audience": ["resident", "family"],
  "actions": [
    { "label": "See the calendar", "type": "learn_more", "url": "https://bkyouthballet.com/calendar/" }
  ],
  "sourceLinks": [
    { "title": "Brooklyn Youth Ballet calendar", "url": "https://bkyouthballet.com/calendar/", "publisher": "Brooklyn Youth Ballet", "date": "2026-08-03" }
  ],
  "sourceQuote": "New to Brooklyn Youth Ballet? Try a single trial class before enrolling in a full semester — just $40, credited toward your tuition when you enroll. One trial class per student per semester.",
  "relatedCardIds": ["bk-youth-ballet-enrollment"],
  "evidenceStrength": "high",
  "monetizationRelevance": "direct",
  "partnerRelevance": "high",
  "trustRisk": "low",
  "createdAt": "2026-08-03",
  "updatedAt": "2026-08-03"
}
```

---

## 9. Community Yoga in Transmitter Park — Tue 8/4

**Hold reason:** Go Green Brooklyn's listing gives the date and the venue but
**no time of day**. A dated event card with a guessed hour sends people to an
empty park.

**What resolves it:** the listing's own "Find out more" detail page carries the
time. This is a same-week item — if it can't be confirmed today it simply
expires.

```json
{
  "id": "community-yoga-transmitter-0804",
  "category": "event",
  "title": "Community yoga in Transmitter Park",
  "kicker": "Outdoor community yoga by the water",
  "startsAt": null,
  "endsAt": "2026-08-04T23:59:00-04:00",
  "locationName": "WNYC Transmitter Park",
  "address": "Greenpoint Ave & West St, Brooklyn, NY 11222",
  "geocodeQuery": "WNYC Transmitter Park, Brooklyn, NY",
  "lat": 40.729855,
  "lng": -73.960729,
  "filters": ["wellness"],
  "summary": "Go Green Brooklyn lists the session on its neighborhood environmental calendar; the organizer's detail page carries the start time.",
  "audience": ["resident"],
  "actions": [
    { "label": "Event details", "type": "learn_more", "url": "https://gogreenbk.org" }
  ],
  "sourceLinks": [
    { "title": "Go Green Brooklyn events", "url": "https://gogreenbk.org", "publisher": "Go Green Brooklyn", "date": "2026-08-03" }
  ],
  "sourceQuote": "04\nAugust\n2026\nCommunity Yoga in Transmitter Park\nFind out more",
  "evidenceStrength": "medium",
  "monetizationRelevance": "none",
  "partnerRelevance": "medium",
  "trustRisk": "medium",
  "createdAt": "2026-08-03",
  "updatedAt": "2026-08-03"
}
```

Note: a gig/event card with a null `startsAt` is blocked by the repo's
open-start regression test, so this one cannot ship until the time is filled in.

---

## Not cards — findings that need a decision, not a pin

**Transmitter Park opposition (update to a live card, not a new one).**
Greenpointers ran "Greenpoint Residents Voice Opposition to Planned Restaurant
and Marina at Transmitter Park" (7/31) and its newsletter adds, verbatim: *"The
proposal faces strong criticism from the neighborhood so far, and we followed up
with Parks to help clarify some concerns."* The live `transmitter-park-restaurant-marina`
card announces the plan but not the opposition. Proposed: add a timeline entry.
Held because rewriting a live news card's reader-facing copy is an editorial
call, and the front-page snapshot carried only the headline.

**G train August service changes.** Greenpointers: *"And in evergreen news, the
G train continues to frustrate straphangers with even more service changes
during August."* No dates, times, or segments stated anywhere in the available
text. The live `g-train-closures` card already covers August generically, so
nothing was added. The specific weekend dates need the MTA page or the article
body.

## Roster-discovery sweep (first Monday) — all source additions are human-gated

Candidate venues seen in Greenpointers headlines this month, none added:

- **Pizza 4P's** — "Pizza 4P's Opens in Greenpoint's 50 Norman Complex" (note: an
  international chain; the locally-owned gate likely excludes it)
- **Gallery ATARAH** — "Gallery ATARAH Opens a New Summer Show This Weekend"
- **Balera** — "Italian Restaurant and Pizzeria, Balera, Opens Soon in Former
  Home of Da Francesco"
- **Christina's** — "Karczma's Owner Reopens Christina's as Retro Polish
  Restaurant This Weekend"

Candidate Gmail sender, not added: **Taku Sando** (`pr@takusando.com`) — sends
menu news; would need a companion events page to be worth a roster slot.

Explicitly *not* proposed: **Le Botaniste** (froyo pop-up, 7/29 email) — a
multi-location operator, excluded by the locally-owned gate, same call as PRESS.
