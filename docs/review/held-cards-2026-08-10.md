# Held cards — 2026-08-10 Monday full run

Three items were authored-and-held rather than shipped. Each names the check it
failed. `holds: 2 new-judgment · 0 rule-miss · 1 source-blocked`

---

## 1. Lockwood — "Tote-ally 20 Sale!", 8/14 11am – 8/16 8pm — SOURCE-BLOCKED

**Why held:** the source carries no venue and no offer terms. The snapshot for
this item is six lines in full:

```
name: Tote-ally 20 Sale!
start_date_raw: 2026-08-14
start_time: 11:00 am
end_date_raw: 2026-08-16
end_time: 8:00 pm
html_link: https://www.facebook.com/events/1097877372807949
```

No address, no place field, no discount amount. R1 cannot resolve it — the only
link is a Facebook event page, which is not plain-fetchable and which we do not
scrape. Carding it would mean inventing both where it happens and what the offer
is; "Tote-ally 20" *suggests* 20% off totes, but that is a pun, not a source.

Note this is **not** the same as the single-venue-source precedent (Moon Bunny,
Acme). Those sources describe their own premises and the card says what the
event is. Here the offer itself is unstated, so pinning it at 98 Greenpoint Ave
would still leave a card that cannot say what it is for.

**What would resolve it:** any Lockwood-published description of the sale — an
Instagram post, a shop-page banner, or the SociableKit feed starting to carry
the `place`/`description` fields it omits for this entry.

---

## 2. Greek Kitchen — daily lunch & dinner specials — NEW-JUDGMENT

Fully priced and timed, and it would have been an easy ship but for one line.

```
Daily Lunch Special! Any Pita Sandwich with choice of Fries or Rice and Can Soda. $14.95
11:00 AM - 04:00 PM
Complete Dinner Special – $24.95 at Greek Kitchen
... 06:00 PM - 10:00 PM
```
(lunch runs all seven days; dinner Monday–Friday only, per the page's own rota)

**Why held — two reasons, and the first is decisive:**

1. **The page says `Specials vary by location.`** and its nav carries separate
   **Brooklyn** and **Queens** ordering links. So the source does not state that
   these specials apply to the Greenpoint store. A card claiming a 912 Manhattan
   Ave deal would be asserting something the source explicitly hedges. That is
   the "quote thinner than the card" hold.
2. **Locally-owned gate.** Two locations across two boroughs. Not obviously a
   PRESS-style chain (5 locations), not obviously a single local business
   either. The roster onboarded it on 8/8 without this surfacing, because the
   host was egress-denied and it had never actually been fetched until today.

**What would resolve it:** your call on (a) whether a two-location
Brooklyn+Queens restaurant clears the locally-owned gate, and (b) if it does,
whether we can attribute the specials to Greenpoint — ideally the page gaining a
per-location specials view, or a direct confirmation.

---

## 3. CIBONE O'TE — "HOZUBAG LIMITED EVENT", closes 8/13 — NEW-JUDGMENT (rule conflict)

Verbatim: `July 11 – August 13, 2026`. A retail pop-up of bags made from retired
paraglider fabric, at 50 Norman Ave. Real, sourced, in area, in window.

**Why held: the rules give an answer the test suite forbids.**

- SKILL.md's markets/vendor rule says a general-goods retail item **"carries no
  lens and shows in All only"**, and is explicit that "that absence is the
  answer, not a hold."
- The repo test `no card is lens-less` asserts `lensless === []` — zero
  lens-less cards, ever.

So the sanctioned filing cannot ship. The alternatives are both judgment calls:
`arts_culture` by the `cibone-restation-showcase-0815` precedent (but that one
is an *exhibition*; this is a product pop-up), or a lens change.

**What would resolve it:** reconciling those two rules. Either the markets rule
needs a real lens to point at, or the lens-less test needs an allowance for the
class of card the markets rule creates. This will recur — it is a rule defect,
not a property of this pop-up, and the next flea or vendor fair hits it again.

Given it closes 8/13, this specific card is likely moot by review time; the rule
conflict is the thing worth fixing.

---

## Also proposed here (human-gated, not a card)

**`macha-studio` — set `standing` in the roster.** The coverage check flags it
`UNMARKED STANDING?`, correctly. The Atom feed's two current entries are titled
"Summer Fridays listening party" (published 2026-08-05) and "Summer Fridays
After Hours". Their bodies state **no date, no time and no recurrence sentence**
— the first reads in full *"Join us for an evening of records, conversation and
try on's, discover something new or simply enjoy the tunes. RSVP"*, and the
second's body is empty. "Fridays" appears only inside the titles, which is far
too thin for `recurrence.days`.

So the page names a series but never publishes a schedule: nothing here is
cardable without inventing a time. Under the three-state field this is arguably
`standing: true` with a source note that the schedule lives off-site (Instagram)
— but it is a roster change, so it needs you.
