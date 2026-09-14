# The weekly digest — mechanism, template, Thursday checklist

*Ratified 2026-09-13 (DECISION_LOG that date). This is the file the send is copied from. When
something about the email has to change, change it here first — a fix that lives only in a
readout is not a fix.*

## What it is

One email a week, Thursday at 7:00am New York, to everyone who tapped Follow on stoopwise.com.
Each person gets the edition that matches what they followed. Three picks, each a real card
with its own link, then one line pointing at everything else on the map. Nothing in it that is
not on a card, and nothing on a card that was not quoted from a source.

It exists because re-entry is the weakest edge of the content loop: nothing tells a resident it
is a new week. The email is the transport for the Follow promise ("stay up to date with one
weekly email"), not a second ask. Follow stays the one resident call to action.

## Editions

| Edition | Who gets it | `src` | Link the email carries |
|---|---|---|---|
| Family & Kids | followed Family & Kids | `follow-family-kids` | https://stoopwise.com/kids?src=follow-family-kids |
| Greenpoint | followed Greenpoint, signed up before the follow field existed, or followed a lens that is still below the threshold | `digest` | https://stoopwise.com/?src=digest |

**A lens earns its own edition at 5 subscribers.** Below that its followers get the Greenpoint
edition, and if their lens has a dated item that week, that item leads the Greenpoint edition.
When a lens crosses 5, add its `follow-<lens>` row to `docs/launch/channel-links.md` before the
first send (Food & Drink, Arts & Culture and News already have rows) and add it to
`DIGEST_SRCS` in `src/growth/compute.js` so the readout can count its readers.

**Density floor, per edition:** fewer than 3 dated, sourced items in the Thu–Wed window and that
edition is skipped. Never padded, never "a quiet week but here's something". The skip goes in the
next Tuesday readout.

Who is in which edition is computed, not remembered: `npm run digest:recipients` reads the Tally
signup form, dedupes by address (a lens choice beats Greenpoint; between two lens choices the
later wins), drops anyone in `.digest-unsubscribed`, applies the threshold, and prints each
edition's BCC line to the terminal. Addresses never go into a file that is committed.

## Picks

Three per edition. In order:

1. **A sourced deadline leads**, when one exists: registration closes, tickets go on sale, last
   week of something. It has to be on the card's `sourceQuote`, in those words. An authored
   expiry date is not a deadline.
2. **Weekend first**, then the rest of the window. The list is parents-majority and the email
   lands when the weekend is being planned.
3. **Different venues.** Three picks at one venue is a venue's newsletter, not the
   neighborhood's.
4. **Free beats paid at equal interest**, but a paid pick that is the best thing that week is
   fine. Say the price.

Each pick links its own card page: `https://stoopwise.com/e/<card id>?src=<edition src>`. The
`src` on a card link is attributed exactly like the `src` on the home link.

The closing line's count is every dated item in the edition's window minus the picks. It comes
from the deck the morning of the send, never from the draft (counts are true for about a day).

## Template

Plain text. No HTML, no images, no formatting. About 180–220 words. First person, from Batu.

```
Subject: <Lens> in Greenpoint this week: <pick>, <pick>, <pick>

<One line saying what this is, naming Stoopwise Greenpoint.>

<Deadline line, only when a sourced one exists.>

<Day Mon D, time> — <what>, <venue>, <address>. <One or two sourced facts: price, ages, what
happens, what to bring.>
https://stoopwise.com/e/<card-id>?src=<edition-src>

<pick 2>

<pick 3>

<N> more things <for families / in Greenpoint> on the map this week:
<edition link>

— Batu

You asked for one weekly email when you followed <Lens / Greenpoint> on stoopwise.com. Reply
"stop" and I'll take you off. Stoopwise LLC, <mailing address>.
```

## Voice

- Say the fact. Day, time, price, address, age range, what happens, what to bring. If the card
  does not state it, the email does not either.
- No adjectives of enthusiasm. Nothing is amazing, perfect, or not to be missed. No exclamation
  marks, no emoji, no "we're excited". The reader decides what is worth their Saturday.
- Every sentence has a verb and uses words a neighbor would say out loud.
- No headers, no bullets, no labels with colons. A pick is a sentence or two and a link.
- "Stoopwise Greenpoint" and the neighborhood appear in the body once. The link alone does not
  say where it goes.
- No summary at the end, no "that's it for this week", no sign-off beyond the name.
- The tagline ("Know what's real. Take part.") is not quoted. The email is the tagline.
- Links are bare, on their own line, copied from `channel-links.md` or built from the card id.
  Never inside code formatting, never inside a sentence, never hand-typed.

## Thursday checklist (6:30–7:00am)

1. `git pull` on `main`, then `npm run preflight:send` — links resolve, `src` survives, prod is
   serving the deck the counts come from.
2. `npm run digest:recipients` — copy each BCC line and its count.
3. Pick three cards per edition from `cards.json` at HEAD by the rules above. Check each one's
   `sourceQuote` carries every fact the sentence states.
4. Compute the closing count per edition (dated items in Thu–Wed window minus picks).
5. Create one Gmail draft per edition through the Gmail connector: a **new message**, never a
   reply or forward; BCC pasted; plain text; links bare on their own lines. Subject from the
   template.
6. Batu opens Gmail, reads, sends by 7:30, and confirms in chat. A send is recorded only when he
   confirms it (learning log L2026-09-13).
7. Friday: `npm run growth:pull` — `digestreaders` shows readers per edition. Tuesday readout
   divides by recipients.

Someone who replies "stop": add their address to `.digest-unsubscribed` (repo root, gitignored,
one per line). They disappear from the next run.

## R1 read

Three sends: Thu Sep 17, Sep 24, Oct 1. Read at the Tue Oct 6 readout. Family & Kids is the
segmented arm, Greenpoint the broadcast arm. The metric is readers per recipient, where a reader
is an arrival on the edition's `src` that produced at least one event beyond a pageview. Kill:
segmented does not beat broadcast by week 3. Contemporaneous, so the seasonal-confound rule does
not apply.

---

## Sep 17 drafts (from `cards.json` at 2026-09-13; re-check every fact and the counts Thursday morning)

Window Thu Sep 17 – Wed Sep 23. Family & Kids has 10 dated items in it, Greenpoint 56, so both
editions clear the floor. No sourced deadline exists in either window this week (the YMCA Fall 1
card's Sep 23 date is an authored expiry, not a quoted closing date), so neither edition carries
a deadline line. The one Deals & Memberships subscriber is in the Greenpoint edition; the only
deals card is undated, so nothing leads for them this week.

### Family & Kids — 20 recipients — BCC from `npm run digest:recipients`

Subject: Greenpoint kids this week: free canoe rides, the Y open house, Yom Kippur camps

Hi, this is the first weekly note from Stoopwise Greenpoint, the map of what's on in the
neighborhood. Three things for families this week, each with its own link, and everything else
at the bottom.

Saturday Sep 19, 12 to 3pm — free canoe rides on Newtown Creek from Manhattan Avenue Park.
Trained guides from the North Brooklyn Community Boathouse take you out for a 20-minute paddle.
They bring the boats and gear, no registration, first come first served, family-friendly.
https://stoopwise.com/e/nbcb-canoe-newtown-creek-0919?src=follow-family-kids

Saturday Sep 19, 10am to noon — open house at the Greenpoint YMCA, 99 Meserole Ave. Youth
basketball, soccer, karate, ballet and tap to look at, swim lessons and lap and rec swim to ask
about, adult Zumba at 11.
https://stoopwise.com/e/ymca-open-house-0919?src=follow-family-kids

Monday Sep 21 — schools are closed for Yom Kippur, and two studios run a 9am to 3pm day camp.
Ms. J's Gymnastics & Dance, 71 India St, takes ages 3 to 8 and books through its portal. Moon
Bunny Aerial, 394 McGuinness Blvd, lists one full-day sitting and no price.
https://stoopwise.com/e/msjs-yom-kippur-camp-0921?src=follow-family-kids
https://stoopwise.com/e/moon-bunny-yom-kippur-camp-0921?src=follow-family-kids

6 more things for families on the map this week, including Sensory Garden Hour on the library
roof Friday morning and Tunes for Tykes in McCarren Park Thursday and Saturday:
https://stoopwise.com/kids?src=follow-family-kids

— Batu

You asked for one weekly email when you followed Family & Kids on stoopwise.com. Reply "stop"
and I'll take you off. Stoopwise LLC, [mailing address — add before sending].

*Fact check against the cards: canoe — "FREE informal paddles … walk-up participants (no
registration is required) … trained canoe guides for 20-minute paddles … We provide the
equipment. First come, first served … family-friendly." YMCA — "Saturday, September 19th
10:00am - 12:00pm … Adult Zumba 11:00 AM … Youth Basketball, Soccer, Karate, Ballet, Tap & More
… Explore Lessons, Lap & Rec Swim". Ms. J's — "Yom Kippur: School Year Camp 9am-3pm (ages 3-
8yrs)"; the schools-closed fact is the card's summary. Moon Bunny — "Full Day Kids Camp - Yom
Kippur", 13:00–19:00Z, card summary states no price. Count: 10 dated family items in window
minus the 4 cards linked = 6.*

### Greenpoint — 9 recipients — BCC from `npm run digest:recipients`

Subject: Greenpoint this week: canoes on the creek, a pizza pilsner, dance at Triskelion

Hi, this is the first weekly note from Stoopwise Greenpoint, the map of what's on in the
neighborhood. Three things this week, each with its own link, and everything else at the bottom.

Saturday Sep 19, 12 to 3pm — free canoe rides on Newtown Creek from Manhattan Avenue Park.
Trained guides from the North Brooklyn Community Boathouse take you out for a 20-minute paddle.
They bring the boats and gear, no registration, first come first served.
https://stoopwise.com/e/nbcb-canoe-newtown-creek-0919?src=digest

Saturday Sep 19, 6 to 9pm — Threes Brewing, 113 Franklin St, launches a pilsner it made for New
York pizza, with slices and a DJ. It's the start of a month-long Slice + Pint Crawl. Tickets
through Eventbrite from the card.
https://stoopwise.com/e/threes-slice-pint-launch-0919?src=digest

Wednesday Sep 23, doors 6:30, show 7:30pm — Beyond the Black Box at Triskelion Arts, 106 Calyer
St, the first of three nights with a different line-up of dancers, choreographers and musicians
each night. $22 early, $26 at the door, $17 Hearts tickets, general admission.
https://stoopwise.com/e/triskelion-beyond-black-box-0923?src=digest

53 more things on the map this week, from a free bike repair clinic on the library roof Saturday
to Andrzej Piaseczny at the Polish & Slavic Center Saturday night:
https://stoopwise.com/?src=digest

— Batu

You asked for one weekly email when you followed Greenpoint on stoopwise.com. Reply "stop" and
I'll take you off. Stoopwise LLC, [mailing address — add before sending].

*Fact check against the cards: Threes — "Try the pilsner made for NY pizza. Slices, a DJ, and
the start of our month-long Slice + Pint Crawl. 6–9pm." Triskelion — "SEPTEMBER 23-25 DOORS:
6:30PM SHOW: 7:30PM EARLY BIRDS $22 … AT-THE-DOOR $26 … $17 HEARTS … All seating is general
admission"; the "different line-up each night" is the card's summary. Bike clinic — "free
community-based bicycle repair … Demonstration Garden"; the card's summary places it at the
library, the quote says the Demonstration Garden — say "at the library", not "on the roof", if
the garden is not the roof. Piaseczny — "19 Września, 177 Kent St, 7pm". Count: 56 dated items in
window minus 3 picks = 53.*
