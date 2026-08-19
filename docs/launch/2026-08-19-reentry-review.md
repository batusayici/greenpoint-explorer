# Re-entry review — how a first-time visitor comes back (2026-08-19)

**Status: decided.** Batu ratified the rulings below on 2026-08-19; the durable record is the
DECISION_LOG entry of the same date (third entry). This doc holds the full reasoning, the idea sweep,
the verification that overturned the first recommendation, and the plan — so no idea from this round
is lost and no argument has to be re-had.

**The question (Batu):** re-entry is Loop A's weakest edge and the learning log's Q3 ("does anything
bring people back?") is unanswered — 2 weekly returning locals against a business bar of 30, with no
return mechanism ever built. Is the ratified Monday digest email (D2) really the strongest mechanism
in 2026, when newsletters feel like a 2020 answer? Diverge wide, converge to three, recommend one.

---

## The rulings

1. **The Monday email digest stands as ratified (D2) — first send Mon Aug 24, unchanged.**
   The verification round *strengthened* D2 rather than weakening it: neighborhood email is the
   best-performing email category that exists (Block Club neighborhood letters open above 50%,
   6AM City 41–48% across 1.3M subscribers, local beehiiv letters routinely over 50% against ~20%
   for generic marketing email). "Newsletters don't get opened" is true for brands and false for
   neighborhood letters. Caveat carried with it: Apple Mail Privacy Protection inflates all reported
   open rates (true readership runs roughly 15–35% lower), so the digest is judged on tagged clicks
   (`?src=digest`), never on opens — consistent with D1.

2. **The real weak link is the signup ask, and that's where the design work goes.**
   The post-value email prompt has converted 2 people out of the 18 who ever saw the form, all-time
   (L2026-07-29). However good the weekly send is, it goes to nobody until signing up converts.
   This survived all three verification passes untouched and is the single strongest finding of the
   round. It is a repair of a broken mechanism, not an experiment — per growth-engine §6 rule 6 it
   consumes no experiment slot.

3. **The digest adopts a "real news only" discipline.** Skip thin weeks (already the D2 density
   floor). New sharpening: when a true, sourced deadline exists — camp registration closes Friday,
   tickets go on sale today — it leads the send. A deadline about a thing you care about is the
   highest-legitimacy message a local product can send, and it is unfakeable under the truth rules.
   Thursday-vs-Monday send timing is a legitimate empirical question (the planning moment is
   pre-weekend; content is freshest post-Wednesday-Greenpointers-pull) — test it later on the send
   that exists; do not fork the Monday rhythm on argument alone.

4. **WhatsApp's shape of record is the week-sheet image posted into existing group chats — not a
   channel of our own.** This is the version the evidence actually supports (the one channel that
   ever converted was a personal WhatsApp message — L2026-08-13 — and the week sheet was built as a
   screenshot precisely because links get ignored on WhatsApp, `weekSheet.js`), and it is the version
   the 2026-08-15 strategy review already queued as a proposal. If a channel is ever tried anyway, it
   runs as a cross-post of the same three picks, own tag (`?src=wa-channel`), with a pre-registered
   kill: fewer tagged returns than the digest over 4 weeks → dead. A channel-join ask must never
   displace the post-value email ask — that would starve R1 again, right after D5 repaired its
   trigger.

5. **No permanent re-entry ruling until the Instagram carousel test reads.** The carousel
   (`src=ig`, running since D3) is the pre-registered instrument on Q1 — whether a website is the
   right form at all, the question we ourselves labeled as able to invalidate the product's form.
   Crowning any long-term mechanism before that instrument reads would invert our own rules. Rana
   named Instagram and Facebook as where she lives; nobody in the learning log has ever named
   WhatsApp.

---

## How the answer was verified (and why the first recommendation died)

The first converged recommendation was a WhatsApp channel carrying three weekly picks. Batu asked
how we'd make sure that was right and that no great idea was being killed. Three independent checks
ran in parallel:

- **A clean-room re-derivation** — an agent given only the evidence docs, never the shortlist,
  re-doing the diverge/converge from scratch. It landed on the same WhatsApp-channel answer —
  which turned out to prove only that the same two strategy docs produce the same wrong inference.
  Its lasting contribution was surfacing the signup-form numbers (ruling 2).
- **An adversarial pass** — given the shortlist verbatim, tasked to break the top three and make
  the strongest case for every killed idea. This is the pass that overturned the recommendation.
- **A fact-check pass** — external verification of every load-bearing claim.

What they caught, kept here as the record:

- **The evidence transfer failed.** Our one WhatsApp win (15 people, 39 card opens) was a personal
  message from Batu to friends. A broadcast channel strips the known sender and one-to-one
  obligation that made it work. If that evidence supports anything at scale, it is posting into
  existing group chats.
- **Channel posts don't arrive.** WhatsApp mutes every channel by default at the moment of follow
  and puts updates in a separate Updates tab; delivery is guaranteed, being seen is not. Every
  success in the D2 research (Front Porch Forum, Block Club, EveryBlock) was email — the pattern
  those products validate is a send that *arrives*.
- **The repo already knew things the recommendation missed.** `weekSheet.js` carries the earned
  read that WhatsApp is a surface where images move and links are ignored; `calendarLink.js` uses
  Google Calendar links (not `.ics` files) after Batu's own phone test, already tagged
  `?src=calendar` and pinned by tests. The recommendation's one concrete build item duplicated a
  live mechanism aimed at files that don't exist.
- **The Polish-community argument was unsupported.** The 2026-08-17 attention map found Polish
  Greenpoint on Facebook, radio, and print — no WhatsApp presence in the sweep.
- **US WhatsApp reach is ~32% of adults (~39% urban)** — real but far from universal; iMessage
  dominates the US-born segment that includes most of the parents wedge.
- **Per-lens calendar subscriptions are effectively iPhone-only** — the Google Calendar Android app
  cannot subscribe to a URL at all, and Google-side feeds refresh up to a day late. Fine for a
  weekly rhythm on iOS; not a general mechanism.

**Method lesson, adopted:** two passes agreeing means little when they read the same docs — the
passes that changed the answer were the ones that brought *new* evidence (the code, the attention
map, external facts). Any future strategy verification includes at least one pass that checks the
repo's code and ground-truth docs, and one that checks external facts.

---

## The idea sweep (for the record)

Eighteen-plus mechanisms considered across both ideation rounds, condensed. Where people already
look daily: WhatsApp channel · WhatsApp group posts (week sheet) · SMS picks line · per-lens
calendar subscriptions · a return link in calendar entries (already live as `?src=calendar`) ·
Instagram as the return surface (carousel running) · home-screen widget app · PWA install + web
push · email digest / personalized follow alerts (R1). Product-created reasons to return:
anonymous saves + "your saved thing is tomorrow" (R4) · "new since last visit" badges (R2) ·
deadline-led sends · a Sunday plan-your-week ritual ending in calendar adds. Other people bring
you back: two-person plan links · org leaders and parent-group admins forwarding a drafted weekly
block · window QR at partner storefronts (ratified, D4c). AI-native: a stable `/this-week` page
assistants can re-cite · MCP/live source for assistants · wallet passes. Rejected outright:
streaks/gamification (off-brand for a truth-first product).

## Parked, with revival triggers

Nothing above is killed permanently. Each parked idea keeps the condition that would revive it:

| Idea | Revive when |
|---|---|
| Native app / home-screen widget | The Instagram carousel test says the medium is wrong (Q1 answer argues "meet them where they are") |
| WhatsApp channel (our own) | Only as the pre-registered side test in ruling 4 — never as the default |
| SMS picks line | A messaging surface beats email on tagged returns and WhatsApp-group reach stalls |
| Per-lens calendar subscriptions | Already the P7 fallback (Oct 5 readout) — carry the iPhone-only and day-stale caveats into that decision |
| Scheduled weekly post in the 16K Facebook group | Tuesday proposal candidate — extends D4's answer posts; rented land, mod-removal risk priced in |
| `/this-week` stable page for AI assistants | Loop C hardening backlog; ship any time at zero booked value (the llms.txt treatment) |
| Two-person plan links · admin-forwarded weekly block · wallet passes | No trigger — recorded so they aren't re-invented, not scheduled |

## The plan

In order:

1. **Redesign the post-value signup ask** (the one visible ask, per the one-egg rule — this makes
   the existing ask worth taking; it adds no second ask). Non-trivial design work: product-designer
   pass + independent design_crit pass, staged on a feature branch with a Vercel preview
   (2026-08-08 rule), Batu reviews before merge. Success metric: form completion per prompt shown,
   before/after — currently 2 of 18 all-time. No experiment slot consumed (mechanism repair).
2. **First digest goes out Mon Aug 24 as already planned (D2),** with the real-news-only
   discipline from ruling 3. Drafted by the Monday routine, sent by Batu, judged on `?src=digest`
   clicks.
3. **Week-sheet group posts** ride the seeding calendar as queued in the 2026-08-15 review —
   Batu posts, per-group `src` tags per the 2026-08-19 parent-groups ruling (`parents-wgbk`,
   `parents-hui`).
4. **Deadline cards as editorial practice:** where a sourced registration/on-sale deadline exists,
   it ships as a card whose calendar link adds the deadline date — Google's own reminders then do
   the alerting at zero build. Applies within existing truth rules; no schema change.
5. **Read the head-to-head in the Tuesday readouts:** tagged returns per channel (`digest` vs
   `wa-*` vs `ig` vs group `src`s) on the same weeks. Contemporaneous comparison, so exempt from
   the seasonal-confound rule per §6 rule 2a's carve-out. The re-entry mechanism question closes
   with this data plus the Instagram test's Q1 read — not with another argument.

Evidence behind this doc: `docs/learning-log.md` (Q1, Q3, B3, B9, B10, L2026-07-29, L2026-08-13,
L2026-08-15), `docs/growth/growth-engine.md` (§0–§2, §6), `docs/launch/2026-08-17-launch-strategy-review.md`
(D1/D2/D5), `docs/launch/2026-08-17-greenpoint-attention-map.md`, `docs/launch/2026-08-15-strategy-review.md`
(WhatsApp groups proposal), `src/demand-test/weekSheet.js`, `src/demand-test/calendarLink.js`.
External sources are cited inline in the verification section where they change a ruling; the full
fact-check (WhatsApp Channels mechanics, Pew penetration data, calendar refresh behavior, hyperlocal
email benchmarks, iOS web push) lives in the 2026-08-19 session record.
