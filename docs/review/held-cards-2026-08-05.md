# Held cards — Wednesday Greenpointers pull, 2026-08-05

The 8/6-12 roundup produced 14 cardable items. **Ten shipped in `1fce47a`**; the
four below were authored and held. Ship first, then PR — a doubtful card never
delays the clean ones.

Source for all four: **"Film festival fun, Songwriter Sundays, and more—What's
Happening, Greenpoint? (8/6-12)"**, Greenpointers, 2026-08-05 —
<https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/>

`holds: 2 new-judgment · 0 rule-miss · 2 source-blocked`

R1/R2/R3 were run on all four before holding. R1 (follow the link) resolved four
*other* cards this run — PLAY Kids' time and price, the comedy club's address and
midnight end, Kirbee's 55 McGuinness Blvd, Paulie Gee's 110 Franklin St — and is
what kept those out of this file.

---

## 1. `mccarren-demo-garden-potluck-0806` — no lens survives the rules · **new-judgment**

**Hold reason:** the lens is a genuine coin-flip. `civic` is "civic action and
mutual aid ONLY … a gathering that is merely *social* does not qualify no matter
how community-flavored it sounds" — and the carded thing is a potluck. But the
potluck is attached to a **6pm volunteer gardening shift** at a community garden,
which is exactly the hands-on-with-neighborhood-stakes shape `civic` describes.
Neither reading is mechanical, and no live card has made this call before (R3
found none). Authored with `filters: []` — legal since 2026-07-25 — but that is a
third answer, not a resolution.

**What resolves it:** a one-line rule from Batu, proposed below.

```json
{
  "id": "mccarren-demo-garden-potluck-0806",
  "category": "event",
  "title": "Monthly potluck at the McCarren Demo Garden",
  "kicker": "Bring a dish after the gardening shift",
  "startsAt": "2026-08-06T19:00:00-04:00",
  "endsAt": "2026-08-06T23:59:00-04:00",
  "locationName": "McCarren Demo Garden",
  "address": "McCarren Park, Brooklyn, NY 11222",
  "geocodeQuery": "McCarren Park, Brooklyn, NY",
  "filters": [],
  "summary": "The garden's volunteer shift runs from 6pm and the table follows it. Open to anyone who turns up with something to share.",
  "audience": ["resident"],
  "actions": [
    {
      "label": "Roundup",
      "type": "learn_more",
      "url": "https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/"
    }
  ],
  "sourceLinks": [
    {
      "title": "Film festival fun, Songwriter Sundays, and more—What's Happening, Greenpoint? (8/6-12)",
      "url": "https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/",
      "publisher": "Greenpointers",
      "date": "2026-08-05"
    }
  ],
  "sourceQuote": "Potluck @ McCarren Demo Garden, 7 p.m.: After a 6 p.m. gardening shift, stick around for the Demo Garden's monthly potluck. Bring a dish, make a new friend!",
  "evidenceStrength": "medium_high",
  "monetizationRelevance": "none",
  "partnerRelevance": "low",
  "trustRisk": "low",
  "createdAt": "2026-08-05",
  "updatedAt": "2026-08-05"
}
```

---

## 2. `uzuki-gluten-free-parfait-0808` — event or menu item? · **source-blocked**

**Hold reason:** the category is not derivable from the line. The roundup files it
under Saturday at noon like an event, but what it *describes* is a new dessert
collaboration — which would be `news`, or nothing at all. No price, no end time,
no organiser link in the roundup (R1 has nothing to follow), and `uzukinyc.com`
does not resolve, so there is no venue channel to check. Shipping it as an event
would tell residents something happens at noon on Saturday that the source never
quite says.

Geography is **not** the problem: Uzuki is 95 Guernsey St, Greenpoint 11222.

**What resolves it:** Uzuki's own page or Instagram confirming whether Sat 8/8 at
noon is a one-time service or the day the parfait joins the standing menu.

```json
{
  "id": "uzuki-gluten-free-parfait-0808",
  "category": "event",
  "title": "Gluten-free parfait lands at Uzuki",
  "kicker": "New dessert made with Elekashi",
  "startsAt": "2026-08-08T12:00:00-04:00",
  "endsAt": "2026-08-08T23:59:00-04:00",
  "locationName": "Uzuki",
  "address": "95 Guernsey St, Brooklyn, NY 11222",
  "filters": ["food_drink"],
  "summary": "A collaboration between the Guernsey Street restaurant and Elekashi, listed by the roundup for Saturday afternoon.",
  "audience": ["resident"],
  "actions": [
    {
      "label": "Roundup",
      "type": "learn_more",
      "url": "https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/"
    }
  ],
  "sourceLinks": [
    {
      "title": "Film festival fun, Songwriter Sundays, and more—What's Happening, Greenpoint? (8/6-12)",
      "url": "https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/",
      "publisher": "Greenpointers",
      "date": "2026-08-05"
    }
  ],
  "sourceQuote": "Gluten-Free Afternoon Parfait @ Uzuki, 12 p.m. Uzuki has teamed up with Elekashi for some new dessert options.",
  "evidenceStrength": "medium",
  "monetizationRelevance": "indirect",
  "partnerRelevance": "medium",
  "trustRisk": "medium",
  "createdAt": "2026-08-05",
  "updatedAt": "2026-08-05"
}
```

---

## 3. `bqflea-meeker-0809` — no lens, and no point to pin · **new-judgment**

**Hold reason, two counts.**

1. **Lens.** `shopping` was retired 2026-07-26 and `deals_memberships` is "deals
   and standing memberships ONLY", so an outdoor market has no honest home. This
   will recur — BQFlea reads like a Sunday series, not a one-off.
2. **Location.** The listing says only "@ Meeker Avenue … under the BQE". Meeker
   runs the length of the viaduct through both Greenpoint and Williamsburg; the
   cached geocode for "Meeker Avenue, Brooklyn, NY 11222" lands at 40.7144,
   -73.9530, which is inside the bbox but is a street, not the market. A pin
   there is a guess wearing coordinates.

Added to `watchItems` so next Wednesday's run does not re-author it blind.

**What resolves it:** the organiser's own page giving cross-streets, **and** a
lens ruling (proposed below).

```json
{
  "id": "bqflea-meeker-0809",
  "category": "event",
  "title": "BQFlea under the expressway",
  "kicker": "Sunday flea market on Meeker",
  "startsAt": "2026-08-09T10:00:00-04:00",
  "endsAt": "2026-08-09T17:00:00-04:00",
  "locationName": "BQFlea",
  "address": "Meeker Avenue, Brooklyn, NY 11222",
  "geocodeQuery": "Meeker Avenue, Brooklyn, NY 11222",
  "filters": [],
  "summary": "Vendors set up beneath the expressway for the day. The listing names no cross street, so the exact block is unconfirmed.",
  "audience": ["resident", "visitor"],
  "actions": [
    {
      "label": "Roundup",
      "type": "learn_more",
      "url": "https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/"
    }
  ],
  "sourceLinks": [
    {
      "title": "Film festival fun, Songwriter Sundays, and more—What's Happening, Greenpoint? (8/6-12)",
      "url": "https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/",
      "publisher": "Greenpointers",
      "date": "2026-08-05"
    }
  ],
  "sourceQuote": "BQFlea @ Meeker Avenue, 10 a.m. to 5 p.m: Buy some unlikely finds in an equally unlikely location—under the BQE!",
  "evidenceStrength": "medium",
  "monetizationRelevance": "indirect",
  "partnerRelevance": "medium",
  "trustRisk": "medium",
  "createdAt": "2026-08-05",
  "updatedAt": "2026-08-05"
}
```

---

## 4. `loft-story-whole-sky-0812` — venue address unreachable · **source-blocked**

**Hold reason:** the card cannot be pinned and the venue cannot be placed in or
out of Greenpoint. "Loft Story" returns **no Nominatim hit** at all, the roundup
states no address, and the only detail page is an Eventbrite listing — a domain
that is **not** on the WebFetch allowlist (adding one is a human-gated trust
decision), returns 403 to plain fetch, and is unreachable through the browser
path, which is down in this environment (`ERR_TUNNEL_CONNECTION_FAILED` on every
Chromium navigation this run; plain fetch is unaffected).

This is the same class as the Brooklyn Craft Company holds: the fact exists, the
run cannot reach it.

**What resolves it:** Loft Story's street address from any reachable source — or
a decision to allowlist `eventbrite.com` for detail-page reads, which would also
have supplied the North Brooklyn Chess and Jabberjaw pages this run.

```json
{
  "id": "loft-story-whole-sky-0812",
  "category": "event",
  "title": "The Whole Sky All Diamonds premiere",
  "kicker": "Immersive play, opening night",
  "startsAt": "2026-08-12T19:30:00-04:00",
  "endsAt": "2026-08-12T21:30:00-04:00",
  "locationName": "Loft Story",
  "address": "ADDRESS UNCONFIRMED — do not ship until resolved",
  "filters": ["arts_culture"],
  "summary": "Discount tickets are available for students and artists.",
  "audience": ["resident", "visitor"],
  "actions": [
    {
      "label": "Tickets",
      "type": "rsvp",
      "url": "https://www.eventbrite.com/e/the-whole-sky-all-diamonds-tickets-1994303628839"
    }
  ],
  "sourceLinks": [
    {
      "title": "Film festival fun, Songwriter Sundays, and more—What's Happening, Greenpoint? (8/6-12)",
      "url": "https://greenpointers.com/2026/08/05/film-festival-fun-songwriter-sundays-and-more-whats-happening-greenpoint-8-6-12/",
      "publisher": "Greenpointers",
      "date": "2026-08-05"
    }
  ],
  "sourceQuote": "The Whole Sky All Diamonds @ Loft Story, 7:30 p.m. to 9:30 p.m: Watch the premiere of an immersive play called The Whole Sky All Diamonds . Discount tickets for students and artists are available.",
  "evidenceStrength": "medium",
  "monetizationRelevance": "indirect",
  "partnerRelevance": "medium",
  "trustRisk": "medium",
  "createdAt": "2026-08-05",
  "updatedAt": "2026-08-05"
}
```

---

## Proposed rules (SKILL.md additions — a judgment call should be made once)

Two of the four holds above are the same kind of gap: the deck has no lens for
things that are neither culture-you-attend nor a deal. Approving these once ends
the re-review every week.

1. **Markets, fleas and vendor fairs file under `food_drink` only when the market
   *is* food (a smorgasbord, a night market); otherwise they carry no lens and
   live under All.** — resolves BQFlea and every future market listing.
2. **A community-garden or park work shift is `civic`; a purely social gathering
   attached to one (a potluck, a members' picnic) carries the shift's `civic`
   lens when the source states the shift, and no lens when it does not.** —
   resolves the Demo Garden potluck.

Neither is edited into `SKILL.md` here: gate 5's content-only file set forces a
skill edit into review, which is the point. Say the word and the next run writes
them in.

## Also worth a decision

**Domino Park.** The roundup carried two Domino Park items (Craft Night 8/10,
Salsa by the Water 8/12) and this run skipped both as Williamsburg-proper — but
`sunday-yoga-domino` has been live on the map since July, so the deck is
currently inconsistent about that park. Worth one ruling either way.
