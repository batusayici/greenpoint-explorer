# Track V Limited Launch Kit — 2026-07-15

The free-MVP validation launch of `greenpoint-explorer.vercel.app/july.html`. Plan of record: the 2026-07-15 interview decisions (see DECISION_LOG entry of same date). This doc is the operational kit: prerequisites, invites, measurement.

## Launch surface (what's new this ship)

- **Content types under test:** Events · Memberships · **Deals** (new) · **News** (new) — plus discovery + G-train layers.
- **Feedback channel:** "Something missing or wrong? Tell me →" at the end of every feed + quiet footer link (`feedback_tap` in analytics). Currently a mailto to bsayici@gmail.com — swap in a Tally form URL at `FEEDBACK_FORM_URL` in `src/demand-test/CardPanel.jsx` when created.
- **Post-value email prompt:** appears once per browser after the 2nd card open or 1st action tap (`cta_tap` with `placement: "postvalue"`). No accounts/login by design — decision rationale in the DECISION_LOG entry.
- **Channel attribution:** every invite link carries `?src=`; all events segment by it.

## Prerequisites (Batu)

1. **Reconnect the Gmail connector with read access** (it currently errors on search) — required before the ingest skill can read newsletters.
2. **Create the Tally feedback form** (3 questions max: what's missing / what's wrong / may I follow up + email) and paste its URL into `FEEDBACK_FORM_URL`.
3. **Subscribe to the starter newsletter set** (below) from bsayici@gmail.com.

## Newsletter subscription starter list

Businesses/orgs on or near the map. Sign up on their sites (or IG link-in-bio); the ingest skill's discovery pass will pick up senders as they arrive.

| Source | Why | Where to subscribe |
|---|---|---|
| Greenpointers (The Weekly) | baseline roundup + news | greenpointers.com (homepage signup) |
| Shop Small Greenpoint | org campaigns, member deals | via Perri / SSG site |
| Falu House | Tinned Fish Club + events (already on map) | faluhouse.com |
| Dandelion Wine | same-day tastings exemplar (153 Franklin) | dandelionwinebrooklyn.com |
| Archestratus Books + Foods | events-heavy program | archestrat.us |
| WORD Bookstore (126 Franklin) | readings/events | wordbookstores.com |
| Brouwerij Lane | releases, tastings | brouwerijlane.com |
| Threes Brewing Greenpoint | events (on map this week) | threesbrewing.com |
| Di An Di | pop-ups (on map this week) | diandi.nyc / IG |
| El Born | weekly specials (deal on map) | elbornnyc.com |
| Greenpoint Fish & Lobster | specials/raw-bar (deal on map) | greenpointfish.com |
| Film Noir Cinema | screenings | filmnoircinema.com / IG |
| Choplet Ceramics | workshops (on map this week) | choplet.com |
| Greenpoint Library / BPL | free programming | bklynlibrary.org events alerts |
| McCarren Tennis Association | Light Up McCarren updates | via their site/IG |
| Town Greenpoint / local parents' orgs | camps & kids (Laura/Edmond wedge) | ask Perri for intros |

## Launch sequence

**Wave 1 — warm network (~20–50), target: this weekend.** Personal messages, one specific ask: *check it twice this week, reply with the one thing that's missing.* Links:
- Friends/neighbors: `https://greenpoint-explorer.vercel.app/july.html?src=wave1`
- Michael: `?src=michael` · Laura & Edmond: `?src=laura-edmond` (they asked for star/save + time filter — tell them what's new since their session)

Draft (personalize the first line per person):

> Hey — I shipped the next version of that Greenpoint map I showed you. It now covers this week's events, memberships, deals, and neighborhood news, all on one map — every business locally owned. Two small favors: check it twice this week (it refreshes weekly), and reply with the one thing that's missing or wrong. Takes 2 min: https://greenpoint-explorer.vercel.app/july.html?src=wave1

**Wave 2 — org distribution, ~3–4 days after wave 1** (after first fixes land). Perri/SSG note, link `?src=perri`:

> Hi Perri — the July map is now weekly and self-updating from local newsletters. This edition: 16 events (Jul 16–22), member clubs, 3 deals at locally-owned spots, and neighborhood news, each with sources. If it'd be useful to Shop Small Greenpoint, feel free to share this link with your list: https://greenpoint-explorer.vercel.app/july.html?src=perri — and if any member business wants on the map (free), the feedback link on the page reaches me directly.

**Never send from the assistant** — Batu sends every message.

## Measurement (weekly, Vercel Analytics → custom events)

Check every Monday alongside the ingest run:

1. **Content-type pull:** `card_open` + `action_tap` grouped by card category (card ids are prefixed sensibly; the filter taps — `filter_tap` by `filter` — give the layer-level read: events vs clubs_signups vs deals vs news).
2. **Commitment:** `cta_tap` split by `placement` (`postvalue` vs `footer`) vs Tally responses; `feedback_tap` volume.
3. **Channels:** any event grouped by `src` (wave1 / michael / laura-edmond / perri).
4. **Traversal:** `related_tap` (place-graph value), `source_tap` (credibility checks).

**Success bar (2-week checkpoint, ~Jul 29):**
- ≥5 people say they'd check a weekly version (replies or feedback)
- ≥3 post-value email signups (Tally responses attributable to `placement=postvalue` window)
- ≥2 businesses ask to be included
- ≥1 unprompted share (a `src`-less or forwarded-link visit spike, or someone tells us)
- A clear content-type pull ranking across events / memberships / deals / news
- Qualitative: feedback messages actually arrive and say something

Log the verdict in `docs/DECISION_LOG.md`; then either scale distribution (wave 3) or reframe.
