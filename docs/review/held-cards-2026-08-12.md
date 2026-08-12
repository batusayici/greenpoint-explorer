# Held cards — daily thin run, 2026-08-12

Two cards were authored and held. Neither shipped; both are in the ledger's
`watchItems` so they cannot go quietly dark.

`holds: 0 new-judgment · 0 rule-miss · 2 source-blocked`

Everything else from this run shipped to `main` as `f5b6db9`.

---

## 1. Lockwood — Spark Session Night, Tue 8/25, 5–8pm

**Reason held: source-blocked.** The source states *when* and nothing else.

The whole item, as the SociableKit feed carries it:

```
name: Spark Session Night
start_date_raw: 2026-08-25
start_time: 5:00 pm
end_date_raw: 2026-08-25
end_time: 8:00 pm
html_link: https://www.facebook.com/events/1059709796558490
```

No venue, no address, and nothing that says what the session *is* — so neither
the map pin nor the lens can be read off the source. Lockwood's own address
(98 Greenpoint Ave) is in the roster, but R3 is explicit that a precedent
never supplies a fact, and "an event listed on a shop's feed happens at the
shop" is an inference, not a statement.

**R1 attempted and blocked.** The only link is a `facebook.com` event page.
Naming the host per the 2026-08-10 rule: **facebook.com** — but note that an
egress allowlist entry would *not* settle this one, because the page is
login-walled. The realistic fallbacks are an interactive session or Lockwood
publishing the listing on `lockwoodshop.com/pages/events`.

**What would resolve it:** the widget or Lockwood's own events page stating the
venue and what the session is.

This is the same shape as the "Tote-ally 20 Sale!" hold carried forward from
2026-08-10; the source's `coverageExplanations` entry now covers both.

---

## 2. Greek Kitchen — daily specials rota

**Reason held: source-blocked.** The rota is fully stated; which *location* it
belongs to is not.

`greekkitchen.nyc/specials` carries a complete Saturday-through-Thursday rota
with prices and times:

> Daily Lunch Special! Any Pita Sandwich with choice of Fries or Rice and Can Soda. $14.95
> 11:00 AM - 04:00 PM
> Complete Dinner Special – $24.95 at Greek Kitchen
> 06:00 PM - 10:00 PM

But the page's own header reads:

> Specials vary by location.

and the business runs a Brooklyn store (912 Manhattan Ave, the one on the
roster) and a Queens store, with nothing on the page attributing the rota to
either. Pinning it at the Greenpoint storefront would infer the single fact
that decides whether the card is true.

**R1 attempted and exhausted.** Fetched the page directly (200, 86 KB) and read
its own `href`s: the site has exactly one `/specials` URL and no per-location
variant. `/locations` exists but is a store list, not a specials page.

**R2/R3:** no standing rule fills a location, and no live card can supply one.

**What would resolve it:** the page labelling the location, a per-location
specials URL appearing, or the Brooklyn store stating the rota directly.

Note this leaves `greek-kitchen` — a `standing: true` source — with no card.
The coverage script does not flag it (it publishes no dated items), so the
gate stays green; that is the correct outcome here, not a hole to paper over.

---

## Also worth Batu's eye — not a held card

**`macha-studio` is still `UNMARKED STANDING?`** and resolves to a roster
change this run cannot make (roster edits are human-gated). Its Atom feed was
`unchanged` again this run; the two entries are still titled "Summer Fridays
listening party" and "Summer Fridays After Hours" with no date, no time and no
recurrence sentence in either body. "Fridays" appears only inside the titles,
which is too thin for `recurrence.days`. The page states a series but never a
schedule, so nothing is cardable without inventing a time. It needs either
`standing: true` plus a schedule line, or `standing: false` with a note that
the recurring phrase is incidental.
