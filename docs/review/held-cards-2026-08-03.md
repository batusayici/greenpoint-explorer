# Held cards — Monday full refresh, 2026-08-03

Nine cards from this run were authored but not shipped. On review (2026-08-03),
each hold was checked against its actual source rather than against the run's
reasoning. **Five resolved and shipped in `e19860a`. Four remain held**, all of
them the same Brooklyn Craft Company blocker.

The clean cards from the same run shipped earlier in `f2d1f17` — a doubtful card
never delays the good ones.

---

## Still held: Brooklyn Craft Company workshops ×4 — venue not stated per date

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

**The hold is correct. The originally stated fix does not work.** "Open each
booking URL" was checked and fails three ways:

- the product pages render sessions through a **BookThatApp** widget that
  `WebFetch` cannot see (it returns "Date & Time: select above");
- the widget does not load headless either — a **control** on
  `crafty-hour-tie-dye`, which is a live card on the map for 8/7 and therefore
  definitely has a session, shows the same empty "Notify Me When New Sessions
  are Added" state, so the empty state is the widget failing, not the schedule;
- Shopify's product JSON (`/products/<handle>.js`) carries a single
  `Default Title` variant — no date, time or location encoded.

**What actually resolves them:** a human in a normal browser selecting each date
in the booking widget (the page states "Your workshop location will be indicated
when selecting your workshop date above"), or an email to Brooklyn Craft Company.

No time of day is stated for any of the four either, so each currently carries a
`00:00` start that must be corrected from the booking page before shipping.

| # | id | date | booking URL |
|---|----|------|-------------|
| 1 | `bcc-crochet-101-lil-bag-0806` | Thu 8/6 | https://www.brooklyncraftcompany.com/products/crochet-101-lil-bag |
| 2 | `bcc-sewing-101-tote-0809` | Sun 8/9 | https://www.brooklyncraftcompany.com/collections/all-workshops/products/sewing-101-tote-bag |
| 3 | `bcc-needle-felted-pets-0811` | Tue 8/11 | https://www.brooklyncraftcompany.com/products/greenpoint-workshop-needle-felted-pets |
| 4 | `bcc-crochet-101-lil-bag-0812` | Wed 8/12 | https://www.brooklyncraftcompany.com/products/crochet-101-lil-bag |

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
- `bcc-crochet-101-lil-bag-0812` — same line as #1

**Open question this raises about live cards.** Five BCC cards are already on the
map pinned at 165 Greenpoint Ave, two of them (`bcc-knits-leggings-0804`,
`bcc-crafty-hour-tie-dye-0807`) created 2026-08-01 from the same newsletter
format, with exact times. Either an earlier run had a resolution method worth
writing into the ingest skill, or those cards carry the same unverified venue
assumption this hold exists to prevent. Worth a spot-check.

---

## Resolved and shipped (`e19860a`)

| Card | What the hold was | What resolved it |
|---|---|---|
| `transmitter-saltwater-fishing-0809` | Lens-less — the NYC Parks events index tags it only `Urban Park Rangers, Fishing`, never family, so `family_kids` looked like a guess (and the same page tags Summerstarz "Best for Kids", proving Parks *does* tag kid-suitability when it applies) | The run read the index, not the event. The **detail page** states *"Recommended for ages 8 and older"*, plus all equipment provided, no registration, free. `family_kids` is now read off the source. Card repointed at the detail URL and the quote widened. |
| `community-yoga-transmitter-tuesdays` | No time of day — a guessed hour sends people to an empty park | Go Green's detail page carries it: **7:00–8:00 AM**. It also shows this is a **series** (Aug 4/11/18/25), so it shipped `recurring` on the `sunday-yoga-domino` model instead of as the single 8/4 card the run drafted — a one-day item became a month of coverage. |
| `marianella-19th-anniversary-sale` | Sale runs "For a little while" — no `endsAt` | That is exactly what the recurring/verified-through rule is for: `endsAt` = end of edition week, re-checked next run (`poochs-parlor-first-groom` precedent). The real risk was different — it's a **sitewide online** promotion with free shipping, so the copy now says so rather than implying an in-store rack at the West St pin. |
| `bk-youth-ballet-adult-term` | `wellness` vs `arts_culture` | Not a choice in either direction. `cardSchema.js` defines wellness as "the movement cluster (yoga/pilates/**dance**/run)", and the enrollment rule names `family_kids`/`wellness`/`games` as the only audience lenses — `arts_culture` was never on the menu. Source says "Adult Ballet **Workout**", ages 18+. → `wellness`. |
| `bk-youth-ballet-trial-class` | A discounted trial (`deals_memberships`) at a youth school ("kids events go in kids") | The rules don't actually collide. `moon-bunny-back-to-school` is live carrying **both** `family_kids` and `deals_memberships`; the kids rule bars double-filing into `arts_culture`/`games`, not into a deals lens. Shipped with both, `recurring` verified-through. |

Both Brooklyn Youth Ballet `sourceQuote`s were re-fetched from
`bkyouthballet.com/calendar/` and confirmed **verbatim**.

---

## Not cards — findings that needed a decision

**Transmitter Park opposition — no action needed; the finding was wrong.** The
run reported that the live `transmitter-park-restaurant-marina` card "announces
the plan but not the opposition." It already carries it, and had since its
2026-08-01 update: kicker *"Neighborhood pushback on Parks plan"*, a summary
naming the opposition and the Parks follow-up, and the 7/31 opposition article
already in `sourceLinks`. The run compared against the article rather than
against the live deck — worth watching as a dedupe gap, since a re-report like
this is how a live card gets needlessly rewritten.

**G train August service changes — agreed, no card.** Greenpointers states more
changes are coming but gives no dates, times or segments. `g-train-closures`
already covers August generically. The specific weekend dates need the MTA page
or the article body.

---

## Roster-discovery sweep (first Monday) — all source additions are human-gated

Agreed: no senders added. **Pizza 4P's** is correctly excluded by the
locally-owned gate (international chain).

**But the sweep asked the wrong question of three of them.** Gallery ATARAH,
Balera and Christina's were evaluated only as candidate *newsletter senders* —
never as *cards*. They are locally owned Greenpoint openings with Greenpointers
articles behind them, openings file as `news` under the lens rules, and none of
the three appears in `cards.json` or in `ingest-ledger.json`. Three news cards
are on the table:

- **Gallery ATARAH** — "Gallery ATARAH Opens a New Summer Show This Weekend"
- **Balera** — "Italian Restaurant and Pizzeria, Balera, Opens Soon in Former
  Home of Da Francesco" (undated future opening — Swaine's precedent)
- **Christina's** — "Karczma's Owner Reopens Christina's as Retro Polish
  Restaurant This Weekend"

Candidate Gmail sender, not added: **Taku Sando** (`pr@takusando.com`) — sends
menu news; would need a companion events page to be worth a roster slot.

Explicitly *not* proposed: **Le Botaniste** (froyo pop-up, 7/29 email) — a
multi-location operator, excluded by the locally-owned gate, same call as PRESS.
