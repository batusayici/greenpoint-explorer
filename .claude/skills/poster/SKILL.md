---
name: poster
description: Turn photos of street posters, window flyers and light-pole ads into sourced Stoopwise Greenpoint cards. Transcribes each photo verbatim into committed evidence, triages it against date/geography/privacy gates, looks the venue up, writes the cards that pass, and proposes new roster sources for the venues behind the dead posters. Use when Batu pastes poster photos, or says "poster", "flyer", "I saw this on a pole", or /poster.
---

# Poster → card

Batu photographs posters around Greenpoint and pastes a batch into chat. Most of them are not cards — half are already past, some are out of area, some are illegible. **The batch has two products, and the second one is worth more: the cards that pass, and the venues behind every poster, dead or alive.** A poster for an event that happened three weeks ago is still proof that the venue programs events; that venue on the roster produces cards every week without another photograph.

Nothing is invented. The poster is the source, and its transcription is the evidence — see the evidence rule below, which is the whole reason this is allowed to ship.

## The evidence rule (why a poster can ship at all)

**Batu, 2026-09-10:** a street poster is first-party and may ship as the only source. It is the same allowance the ingest already makes for `detailsInImages` flyer sources, under the same condition — **the image read gets written down, or the card doesn't exist.**

A web source can be re-fetched forever. A poster is gone the day someone tapes another one over it, so its evidence cannot live in `.ingest-cache/` (gitignored, disposable). **Transcribe every poster into `src/data/demand-test/poster-evidence/<poster-slug>.txt`, committed, before writing its card.** One file per poster, not per card — a class-week sheet is one poster and three cards, and three copies of the same transcription is three things to keep in sync. A poster that is held rather than carded gets a file too, named `<slug>-HELD.txt`, so the next batch doesn't re-litigate it. That file is the snapshot the `sourceQuote` gate checks against, and it is the only thing that lets anyone — including a future run — re-check the claim.

Each evidence file opens with a provenance header, then the verbatim text:

```
# <what the poster is>
# Photographed by Batu, <YYYY-MM-DD>
# Seen at: <the pole/window/storefront, as specific as the photo allows>

<every line of the poster, verbatim, top to bottom>
```

Transcribe what is printed, including the parts the card won't use. Mark anything you cannot read as `[illegible]` rather than guessing — a guessed date is the exact fabrication this whole file exists to prevent. **Never resolve an illegible field by finding a plausible answer online and writing it in as if you read it off the poster**; corroborate separately and cite separately.

## Gates, in order

Run all of them on every photo before writing anything. A poster that fails one still goes to step 4 as a roster lead.

1. **Legible?** Anything the card rests on — date, time, address, price — that reads `[illegible]` holds the card. A missing month on a poster that says "Saturday the 12th" is not a date; it matched four different Saturdays in the last two years. **Batu can unblock one by supplying the fact himself** (he did, on that poster, on 2026-09-10) — he is a named source for what he knows about his own block, the same standing the `macha-studio` roster entry already gives him for a venue fact. Write it into the evidence file and into `watchItems` as permanently unverifiable by fetch, and hold every other claim to its own quote. Ask him; never infer it yourself.
2. **Still ahead?** Compare against today. Past-dated posters are extremely common in a batch (6 of the first 11 on 2026-09-10) because they stay taped up for months. No card. Straight to step 4.
3. **In Greenpoint?** The bbox in `cardSchema.js` rules. Posters travel: the founding batch carried a Ridgewood show and a Berry Street (Williamsburg) garden calendar, both photographed in Greenpoint. Bushwick Inlet Park is in scope per the ingest skill's standing ruling. Out of area is no card and, usually, no roster entry either.
4. **Anyone's private details on it?** **Never card a private individual's phone number, personal Venmo handle, or home address, and never put one in the evidence file** — redact it as `[personal contact redacted]` in the transcription. A business's own published phone is fine; a neighbor's cell taped to a tree is not, whatever the poster's author intended by printing it. This came up on the first batch: a Calyer Street block-party poster carried a resident's mobile number and Venmo tag under "suggested donation $25". A card can still ship without them if everything else passes.
5. **Is it an event at all?** Brand ads with no date and no address (the first batch's Lifeshop poster) are not cards and rarely roster material.

## Multi-date posters

**A poster listing several dates is several cards, never one span.** This is the 2026-08-13 sitting rule arriving by a new route, and posters are its most likely repeat offender because a season, a class week or a garden's whole year prints as one sheet. Salsa Pizzeria's "Class Week Sept 21–27" lists four different classes on four days at two different start times and two boroughs — that is up to three Greenpoint cards, and one card spanning 9/21→9/27 would be a data bug.

A poster listing a genuinely recurring series ("every Tuesday this summer") is one recurring card — but only after gate 2 is honestly applied to the season it states. A summer series photographed in September is a roster lead, not a card, until the venue confirms it is still running.

## Venue lookup — the step that pays for the batch

For every poster, dead or alive, find the venue's own site, calendar or Instagram. It does two jobs at once:

- **Corroboration**, when it exists. A poster card that a listing confirms gets `trustRisk: "low"`. A poster nobody else has published gets `trustRisk: "medium"` and a `watchItems` entry naming the claim as unre-checkable — same policy as the Instagram-only facts in the ingest skill. Do not downgrade the card for lacking corroboration; do record that it lacks it.
- **Roster assessment.** Does this venue publish a calendar a script could read, and does it program Greenpoint events regularly? If yes, propose it in the PR against the `ingest-sources.json` shape (prefer `feed`/`json` over `browser`, per the ingest skill's fetch-strategy rule). A venue whose schedule lives only on Instagram goes in `manualSources` with the measurement that settled it, so a later run does not re-onboard it. **Roster additions ship with the batch since 2026-09-10** — no longer proposed and held — provided the source passes the seven tests in `CLAUDE.md`, including a real fetch measured in this session and written into its `notes`. Name every one in the PR body and the commit subject. A source that fails a test, or that refuses automated readers in `robots.txt`, is written up for Batu instead of added.

**If a venue deliberately withholds its address, do not publish it.** Light & Sound Design Studios says "RSVP for location" on its poster and "L&SD (address with rsvp)" on its own ticketing page; the address is findable on third-party listings and is off limits anyway. The venue chose not to publish it, and this product does not out a neighbor to fill a lens. Card it with `locationPrivate: true` instead (settled 2026-09-10): no coords, no address, no venues — the schema rejects that combination, so the flag can never be used to smuggle a card someone just didn't geocode. The row and the card page both say the address comes with the RSVP.

The first batch's real yield was five of these: Maison Jar (566 Leonard, runs a recurring refill happy hour), Greenpoint Comedy Club (66 Greenpoint Ave), Culture House Greenpoint (807 Manhattan Ave), Light & Sound Design Studios, Salsa Pizzeria (monthly class week). Every one arrived on an expired poster.

## Card shape

Normal schema rules, plus:

- `sourceLinks` — one entry with no URL: `{ title: "Poster at <where>, photographed <date>", publisher: "<venue or organiser>", date: "<photo date>" }`. Add the venue's own listing as a second entry when it corroborates.
- `sourceQuote` — the verbatim lines from the evidence file that carry what/when/where/price. Must match the committed transcription exactly.
- `evidenceStrength` — `high` when every claim is stated outright by a named first-party source, the poster and the venue's own page counting equally; `medium_high` when a load-bearing detail is inferred or rests on a third party. Corroboration from the venue's site is a strengthening, not a discount.
- `trustRisk` — per the corroboration rule above.
- `endsAt` — posters go stale invisibly, so date-bounded cards must expire on their own. A `discount` needs `endsAt` (schema-enforced); give a recurring poster card a verified-through date no more than 30 days out, so the next run re-earns it rather than inheriting it.

## The run

1. Save and transcribe every photo into `src/data/demand-test/poster-evidence/`.
2. Run the gates. Keep a per-poster verdict: ships / holds / no card, with the gate that decided it.
3. Look up every venue. Corroborate what you can; assess each as a roster source. **Check the roster and the deck first** — on the first batch, four of the eleven posters were for venues the ingest already covers, and two were events already on the map. A poster whose event is already carded is not a miss, it is the pipeline working; say so and move on.
4. Write the passing cards, `npm run ingest:geocode`, `npm run verify`.
5. Open ONE branch and PR for the batch — cards, evidence files, and proposed roster entries together. **A poster batch always goes to a PR**, even when every card passes: roster proposals ride along, and Batu is in the conversation anyway, so review costs him a click and buys a look at the holds. Never push `main`.
6. Report in the PR body and in chat, in three sections: **what ships**, **what's held and what would unblock it**, **which venues to add to the roster**. Recommend a call on each hold rather than listing it neutrally.

## Batch report style

Plain words, consequence first — the repo's communication rule applies here like everywhere. Lead with what he got: how many cards, from how many photos, and which venues are now worth watching. The gate that killed each poster is a detail, not the headline.
