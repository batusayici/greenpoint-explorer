# Held cards — daily thin run, 2026-08-19

Twelve items from the Greenpointers *What's Happening, Greenpoint? (8/20-26)*
roundup were triaged and held. None shipped; all twelve are in the ledger's
`watchItems`, and their verbatim source lines are persisted in
`.ingest-cache/greenpointers.txt` under `[R1 PERSISTED 2026-08-19b]` so they
survive the REST window rolling.

`holds: 12 · 0 new-judgment · 0 rule-miss · 12 source-blocked`

Everything else from this run shipped to `main` as `ca818cd` — 9 adds, 8
updates, 1 correction-delete, 4 expiries, deck 158 → 162.

---

## The single cause

**The roundup never states a street address, and this run could not reach the
listing page that does.**

That first half is a known property of this source, already in its roster note:
`renderValue` runs `content.rendered` through `htmlToText`, which strips
`<a href>` and keeps only the anchor text. So the snapshot's twenty-odd "get
tickets **here**" lines carry no URLs at all, and the roundup body itself names
a venue but never an address.

The recovery worked as designed: the post's `content.rendered` was re-read from
`greenpointers.com/wp-json/wp/v2/posts?slug=…` with the roster's own browser UA
through the routine's proxy, and every outbound link was harvested. Six items
were settled that way and shipped.

The rest died at the proxy. **Only `eventbrite.com` answered.** Every other
listing host was refused — `TypeError: fetch failed … DOMException: Request was
cancelled`, and in one case a 502 whose entire body is `policy unavailable`.

### Hosts to allowlist (claude.ai/code)

Per the 2026-08-10 rule, R1 targets never appear in the fetcher's own
`EGRESS DENIED` block — that block is assembled from roster results, and a
listing page is not a roster entry. So this list has to come from the run:

| host | items it would unblock |
|---|---|
| `opentable.com` | La Contenta 1-Year Anniversary (8/20) |
| `portal.iclasspro.com` | Ms. J's Gymnastics Summer Bash (8/20) |
| `luma.com` | Reforester's Laboratory Paint & Sip (8/20); Birdie's Sporting Club mahjong (8/26) |
| `checkout.square.site` | Joy Flower Pot floral workshop (8/21) |
| `partiful.com` | Bouquet Wine Bar (8/21); Rise & Bark at Memorial Gore Plaza (8/22); Threes Brewing finale (8/24) |
| `themccarren.com` | Trivia at The McCarren (8/24) |

Nine of the twelve. **Three are blocked differently and an allowlist entry will
not touch them** — Panzon, Cloud City and Edith's have no link at all in the
roundup body.

The fallback for all twelve is the same one the skill already names: an
interactive session, where egress is unrestricted.

---

## 1–2. Thursday 8/20 — La Contenta, Ms. J's Gymnastics

> 1-Year Anniversary @ La Contenta, 3 p.m.: Celebrate the restaurant's first year in Greenpoint with a live DJ, all-day tattoos, and food and drink specials. Make your reservation via OpenTable here .

> Summer Bash @ Ms. J's Gymnastics, 3:30 p.m.: Enjoy the AC while your kiddos enjoy some free play during a fun indoor summer soirée with a bounce house, face painting, and arts and crafts. All ages welcome. $25 per child, register here .

**Reason held: source-blocked (address).** Both are otherwise complete — venue,
day, time, and for the Summer Bash a stated price. Both link slugs are
*suggestive* of Greenpoint (`/r/la-contenta-greenpoint-kings-county`,
`/msjsgreenpoint/`), and that is exactly why they are held rather than shipped:
a slug is not a stated address, and reading a neighborhood out of a URL is the
kind of inference the truth rules exist to stop.

**What would resolve it:** `opentable.com` / `portal.iclasspro.com` reachable,
or an interactive session.

## 3. Thursday 8/20 — Reforester's Laboratory, Paint & Sip

> Paint & Sip @ Reforester's Laboratory, 7 p.m.: This isn't your average paint-and-sip sesh. Perfect Days Collective is leading a 90-minute experiential journey exploring the two sides of the self through art with guided meditation and two canvases side by side. $55, get tickets here .

**Reason held: source-blocked (address).** Everything but the address is
stated, including the 90-minute duration. `luma.com/d2cgma9q` refused.

## 4. Friday 8/21 — Joy Flower Pot, Floral Arrangement Workshop

> Floral Arrangement Workshop @ Joy Flower Pot, 6:30 p.m.: Daisies are quintessentially summer, so learn how to work with them in a beginner-friendly, hands-on workshop resulting in a bouquet to take home. $125, get tickets here .

**Reason held: source-blocked (address).** `checkout.square.site` refused, and
a Square checkout page is not certain to carry a venue address even once
reachable — this one may need the shop's own site instead.

## 5. Friday 8/21 — Bouquet Wine Bar, Meet Your Wine Soulmate

> Meet Your Wine Soulmate @ Bouquet Wine Bar, 6:30 p.m.: Get off the apps and into a glass. Let your favorite blend lead you to a new fling during a wine-tasting and singles-event hybrid with lite bites and curated bottles. $45, get tickets here .

**Reason held: source-blocked (address).** `partiful.com` refused.

Note for whoever resolves it: the lens is already settled and does **not** need
re-deciding. A singles event built around a stated activity earns
`arts_culture` (Batu, 2026-08-12, `flowercat-love-unfolded-0823`) — a
wine tasting is that activity. Only the address is missing.

## 6. Saturday 8/22 — Memorial Gore Plaza, Rise & Bark

> Rise & Bark @ Memorial Gore Plaza, 8 a.m.: Calling all pawrents and dog lovers. North Brooklyn Dogs, NYC Pet, and Aunt Hilda Pet Care are throwing a fundraiser, info session, community market, and more dedicated to furry friends. Learn how to support the local dog community and dog parks, raise funds for the Cooper Park dog run, meet fellow pup parents, and shop from local pet brands and makers. Free, RSVP here .

**Reason held: source-blocked (address), and the geography is genuinely
uncertain** — the item's own text points at the *Cooper Park* dog run, which is
East Williamsburg, while the named venue is a plaza the roundup does not
locate. This one needs the address before it can be pinned or dismissed, not
just to satisfy the schema. `partiful.com` refused.

## 7. Saturday 8/22 — Panzon, Backyard Summer BBQ

> Backyard Summer BBQ @ Panzon, 2 p.m.: Summer may be (unofficially) winding down if the upcoming Labor Day Weekend is any indication, but that doesn't mean cutting back on celebrations. Come together for dancing, frozen drinks, and a special barbecue menu. No reservation needed.

**Reason held: source-blocked (address), no link.** The roundup gives this item
no outbound link at all, so there is nothing for R1 to follow. An allowlist
round will not reach it.

## 8. Saturday 8/22 — Cloud City, Pigeons! An Art Show

> Pigeons! An Art Show @ Cloud City, 4 p.m.: Art takes flight during a show dedicated to one of our most notorious local muses. The exhibition will feature 26 artists exploring pigeons across photography, painting, collage, sculpture, and more, with works available for purchase. There will also be a draw-your-own-pigeon station, photo opps, a live pigeon feeding, and more. Free, no RSVP needed.

**Reason held: source-blocked (address), no link.** Same shape as Panzon.

Worth flagging because it is the better card of the two: a 26-artist opening
with a stated free admission is real supply, and this is an opening night — the
dated happening the 2026-08-12 exhibition rule explicitly keeps cardable, not
the standing run it folds into a venue card.

## 9. Monday 8/24 — Threes Brewing, Summer Guest Series Finale

> Summer Guest Series Finale @ Threes Brewing, 5 p.m.: The local brewery is partnering with Peter Luger for a Brats and Beers takeover featuring Peter Luger-curated decor, menu, and music, plus Luger Lager, a special collaboration brew available while supplies last. Walk-in only. RSVP here .

**Reason held: source-blocked (address) *plus* attributability.** Threes Brewing
runs more than one Brooklyn location, and the 2026-08-12 rule turns on whether
the source ties the claim to the Greenpoint address — not on counting
locations. Here it does not: the roundup says only "the local brewery."

The tempting shortcut is that a Greenpoint roundup implies a Greenpoint venue.
**This same roundup disproves it.** Four of its items are outside the
neighborhood, and one of them — the prenatal workshop — links straight to
`barmethod.com/locations/new-york-city-**williamsburg**/schedule/`. So the
roundup's own scope is not attribution.

`partiful.com` refused. A reachable listing that names the Franklin Street
taproom would settle both blockers at once.

## 10. Monday 8/24 — The McCarren, Trivia

> Trivia @ The McCarren, 7:30 p.m.: Have a lot of knowledge burning a hole in your brain? Put it to good use as Trivia City kicks off their fall season at The McCarren featuring over 60 questions across five rounds. More info here .

**Reason held: source-blocked (address), and geography likely fails.** "The
McCarren" is a hotel venue, not the park, and the roundup does not locate it.
`themccarren.com/trivia` refused. Expect this one to resolve as a *skip* rather
than a card if the address lands south of the Greenpoint line — but that is a
call the address makes, not one to guess now.

## 11. Wednesday 8/26 — Birdie's Sporting Club, Not Your Mother's Mahjong

> Not Your Mother's Mahjong @ Birdie's Sporting Club, 6:30 p.m.: Whether you're a seasoned Mahjong player or completely new to the game, join an evening of slow, hands-on instruction and meaningful connection all about upping your game while celebrating the history, heritage, and traditions of the game. Starting at $25, get tickets here .

**Reason held: source-blocked (address).** `luma.com/c7tbp460` refused.

Lens is pre-settled and needs no review: mahjong is a game, so this is `games`
and must not also carry `arts_culture` (2026-08-02).

## 12. Undated — Edith's, Summer Sandwich Series

> Summer Sandwich Series @ Edith's: Try a taste of Palm Beach with a collab sandwich from Florida's Būccan Sandwich Shop—the Beef Carpaccio Sandwich is layered with beef carpaccio, arugula, Parmesan, crispy balsamic onions, mayo, and lemon vinaigrette on a baguette. For a limited time.

**Reason held: source-blocked (address), no link, no dates.** It sits under the
Wednesday 8/26 heading but the item text carries no date of its own, only "For
a limited time" — and taking a date from a section heading the item does not
claim is the same class of error as taking an event date from a Squarespace
slug (2026-08-08, Film Noir).

The missing end date alone would **not** hold this: R2 already answers it — an
offer with no stated end is `recurring` + verified-through to the edition week
(2026-08-03, PR #18). What holds it is the address, and Edith's is a name that
needs one: the business is not otherwise on the map and the roundup does not
locate it.

---

## Not held — skipped as out of area

Recorded here so a future run does not re-triage them:

- **Free Prenatal Workshop @ The Bar Method** (8/22) — the roundup's own link is
  `barmethod.com/locations/new-york-city-williamsburg/schedule/`. No fetch
  needed; the link names the location.
- **Benefit Dinner + Drag Show for Venezuela @ Lulla's** (8/21) — the Eventbrite
  listing states `169 graham ave, Brooklyn, NY 11206`. East Williamsburg.
  **This also closes the "Lulla's Venezuela earthquake relief hub" watchItem**,
  open since 2026-07-24 waiting on exactly this address — closed as out of
  area, not as a card.
- **Music Day @ Powers St. Garden** (8/22), **Step OUTside Festival @ Marsha P
  Johnson State Park** (8/22), **Kayaking @ Bushwick Inlet Park** (8/23) — all
  Williamsburg, all outside the bbox.

## Proposed rule for the skill

One line, for Batu to approve or reject:

> **A venue slug inside a ticketing URL is not a stated address.** When a
> roundup names a venue and the only Greenpoint evidence is a slug
> (`/r/la-contenta-greenpoint-…`, `/msjsgreenpoint/`), the item is held, not
> shipped — the slug is a merchant's own naming, it is not the geography gate,
> and a card pins a pin.

If that is already obvious enough not to need writing down, say so and it stays
out.
