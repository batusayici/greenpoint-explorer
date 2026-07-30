# Design Punch List — Pre-Launch (2026-07-29)

> **Status:** open. Diagnosis only — **no code was changed** producing this list; the working tree was verified clean before, during, and after both passes. Every item below is a proposal awaiting Batu's call.

Blocks the `greenpoint.life` cutover to the extent Batu decides. Launch-readiness context: `2026-07-27-launch-plan.md`. Regime: `docs/DECISION_LOG.md` 2026-07-22.

## Method (why two passes)

Two independent evaluations of the running app at 375/768/1440px, each deriving findings from source and live DOM measurement — no estimates:

1. **`product-designer` agent** (generator role) — brief: evaluate overall design including copy.
2. **`design_crit` skill** (critic role) — run in a **separate agent with clean context**, deliberately not given pass 1's findings, so convergence would mean something.

**The separation paid for itself: each pass found ship-relevant defects the other missed entirely.** Convergent findings (both derived independently) are high-confidence. Single-source findings are marked — they're not weaker, they're just unconfirmed by a second look.

Where the two conflicted, the conflict and its resolution are recorded in [§ Resolved conflict](#resolved-conflict).

---

## P0 — fix before cutover

### 1. The Follow CTA renders nonsense on ~18% of cards
*Source: crit pass. Highest user-impact finding in either run.*

`src/demand-test/postValue.js:47` puts `card.locationName` verbatim into the product's only conversion ask:

```js
if (card?.locationName) return { kind: "place", id: card.id, label: card.locationName };
```

Measured across `cards.json`: **33 of 57 distinct `locationName` values produce a CTA longer than 3 words**, and **17 cards** carry location names that are sites, not followable entities:

> **"Follow Meeker Avenue Plume area"** — a Superfund groundwater plume.
> `Follow Saint Vitus (former site)` — a venue that left the neighborhood.
> `Follow 577 Lorimer St (former Pomp and Circumstance)` — 52 chars.
> `Follow Greenpoint Avenue G station` · `Follow McCarren Park tennis courts`

Affected categories: `news` (×12), `civic_action` (×2), `g_train_support` (×1), `support_local` (×2).

**Why P0:** this is the single ask in the product, it fires **once per browser**, and it fires on whatever card happened to trip the gate. A resident's one impression of the CTA can be an invitation to follow a contamination site.

**Fix — needs a decision.** Two paths:
- **(a) Category allowlist** — only categories naming a followable business yield a place object; everything else falls back to `Greenpoint`. Cheapest, no schema change.
- **(b) Curated short label** — add an optional `followLabel` to the card schema, set at ingest for cards worth a place-level follow. More work, better ceiling.

Recommendation: **(a) now**, (b) later if place-follow conversion justifies it.

### 2. Inter is declared but never shipped
*Source: designer pass. **Verified directly** — not taken on the agent's word.*

`src/demand-test/july.css:22` declares `font-family: Inter, ui-sans-serif, system-ui, …`. There is **no `@font-face`, no font link in `index.html`, and no `@fontsource` dependency** anywhere in the repo; `document.fonts` is empty in the running page.

Consequence: on iOS Safari — the primary platform — every string renders in **SF Pro**, not Inter. On a machine with Inter installed it renders in Inter. The wordmark is set in whatever the device happens to have, and `font-weight: 850` maps to different faces per platform.

**This also invalidates one line of the crit pass**, which praised the "850-weight display type" as authored identity — it was critiquing type users never see. Noted as a method lesson below.

**Why P0:** typography is the layer where identity lives, and right now it is platform-dependent and unauthored. The designer pass's call: shipping **one display face** for the wordmark, kicker, and day headers moves the product further than every other item on this list combined.

**Fix:** decide the face, self-host it (no CDN — the source allowlist and offline story both favor local), ship `@font-face`, and re-check weight mapping.

---

## P1 — structural, fix before or with cutover

### 3. `kicker` and `summary` are contracted to say the same thing
*Source: designer pass. This is the root cause of "the app reads text-heavy."*

**67 of 95 cards (70%) repeat ≥50% of their kicker inside their summary.** Opening a card mostly re-reads the row you just tapped:

```
row:     7 PM · Live jazz with your wine · 593 Manhattan Ave
detail:  Jul 29, 7:00 PM
detail:  The weekly live-jazz night at the all-day cafe and bar.
```

Three restatements of one fact — and the day is already in the sticky header (`TODAY · WED, JUL 29`).

**No amount of string editing fixes a schema where two fields are contracted to overlap.** Fix at `cardSchema.js` + the ingest prompt: define what each field is *for* (kicker = the glanceable hook in the row; summary = what the row could not say), and enforce non-overlap at ingest.

Related, from the crit pass: summary lengths run p50 = 107 chars, **p90 = 258, max = 456**; 12 cards exceed 220. A **200-char ceiling at ingest** costs nothing and is independently worth doing.

Corollary: `.july-detail-when` (`Jul 29, 7:00 PM`) is redundant for dated cards once the day header and subline both carry it. Keep it only for spans (`Through Aug 15`).

### 4. Row template truncates the payload and wraps the filler
*Source: crit pass.*

`.july-card-title` is `white-space: nowrap` + ellipsis (`july.css:380`); `.july-card-loc` wraps freely. Measured across 80 rendered rows: **9 titles truncated, 22 sublines running 2+ lines.**

> `Monitor Point approved: 1,324 waterfront apartments` → **"Monitor Point approved: 1,324 waterfron…"**
> `McGuinness redesign construction is underway` → **"McGuinness redesign construction is un…"**
> `EPA keeps testing the Meeker Avenue Plume` → **"EPA keeps testing the Meeker Avenue Pl…"**

Three consecutive news rows in the ONGOING group all truncate. For a news card **the headline is the content** — the layout spends a second line on the address while cutting `1,324` out of the headline. The one-line contract exists to protect the FREE badge, which appears on 8 rows.

**Fix:** 2-line clamp on the title, `align-items: flex-start` on the title row, top-align the badge. **Trade to confirm:** taller rows.

Gate 1 scored this as an inverted hierarchy — 15.2px title truncated while the 12.16px subline gets two lines, a 1.25× ratio that reads as adjacency rather than hierarchy.

### 5. The active lens is invisible
*Convergent — both passes, independently.*

The chip bar is **975px wide in a 375px viewport**; only ~2.7 of 9 chips fit, hiding **62%** of its own content. Measured with Wellness active: **active chip at x = 886–969 while the bar sits at `scrollLeft: 0`** — 511px off-screen. The feed shows 2 rows and the bar shows no highlight anywhere.

Reachable in normal use: scroll right, tap a chip, scroll back.

**Fix:** scroll the active chip into view on every filter change (including the currently-dormant `action.filterId` path at `CardPanel.jsx:50-60`), plus an edge fade so the hidden lenses announce themselves.

Related: the `More +1` chip adds a *second* disclosure mechanism to a row that already solves overflow by scrolling.

---

## P2 — mechanical sweep (no design judgment required)

All measured, all with known fixes. Suitable for a single commit.

| # | Defect | Measured | Fix | Source |
|---|---|---|---|---|
| 6 | **Third-party map chrome out of palette** | `.maplibregl-ctrl-group` + `.maplibregl-ctrl-attrib` = `rgb(255,255,255)`, text `rgb(0,0,0)` | Override to `--paper-lift` / `--ink` with the ink border and `0 2px 0` shadow | crit |
| 7 | **`Show everything` reset target** | **110 × 16px** (`padding: 0`) — below WCAG 2.5.8's 24px floor | Add padding to ≥24px | designer |
| 8 | **Inactive chip border** | `--line #9b9079` on paper = **2.43:1**; WCAG 1.4.11 needs 3:1 for a control boundary | `#877d69` (3.13:1), same scoreline family | both |
| 9 | **Four controls missing focus rules** | `.july-todaypill`, `.july-mapexpand`, `.july-notice-dismiss`, `.july-prompt-dismiss` fall back to UA default | Add to the existing `:focus-visible` group | both |
| 10 | **Unguarded motion** | `MapView.jsx:188` `map.easeTo({duration: 500})` ignores `prefers-reduced-motion` | Guard it — everything else already is | designer |
| 11 | **Header subtitle** | 12 words, 2 lines, 29px; the chip bar below already lists the categories | `Your week in Greenpoint, verified: events, openings, deals, and neighborhood news.` → **`Every listing verified this week.`** | both |
| 12 | **Focus row wraps** | `Greenpoint Comedy Club · 6 on the map here` breaks with `map here` orphaned, at 375 *and* 768 | → `{name} · {count} here` | both |
| 13 | **Duplicate community CTA** | Banner and pinned feed row carry the same string to the same card, 296px apart | Drop the pinned row + its group header — buys **87px** | designer |
| 14 | **Two adjacent buttons named "calendar"** | `See the calendar ↗` (venue page) sits 6px from `Calendar ↗` (Google template) | Rename, don't explain: `Venue calendar` / `Add to calendar` | designer |
| 15 | **Follow prompt can orphan** | Prompt pins to `promptCardId`; opening another card closes the referent, leaving a CTA naming a business absent from the screen | Re-derive the object from the open card | designer |
| 16 | **Card expansion is instant and unbounded** | Monitor Point card expands to 631px with no transition; everything below jumps | 180–250ms ease-out on `.july-detail` — the continuity case | designer |
| 17 | **Follow prompt body restates its own button** | `Want the next one? We'll email you when something new lands in {X}.` (15 words, 3 lines, ~54px) | → `One email when they post.` (5), set below the button | designer |
| 18 | **CTA casing inconsistent** | `Tell us` / `add yours, free →` / `SEE HOW →` — three casings for three peer CTAs | Pick one | designer |

**Coupling warning (crit pass):** `july.css:797` hard-codes `--chrome: calc(var(--peek) + 53px)`, where 53 = 10+10 padding + 32px chip. **Any change to chip height silently floats the sticky day header** and must update this token in the same edit.

---

## Resolved conflict

**Touch targets — the two passes disagreed.**

- **Crit:** 32px chips are a Gate 0 **fail** against the 44pt guideline; proposed raising chips/actions to 44px.
- **Designer:** 32px **passes** WCAG 2.5.8 (24px floor) and was chosen deliberately per `DECISION_LOG.md` 2026-07-28.

**Resolution — the designer is right, and the crit's fix is rejected.** 44pt is a platform *guideline*, not the conformance bar; the project does not fail an accessibility standard here, and the proposed fix adds ~11px to a first screen that is already ~half chrome — it worsens the documented root problem to satisfy a bar we already clear.

**What survives from the crit's concern:** the real ergonomic risk is the **6px gutters between adjacent chips**, not the target height. If this is addressed, address it as spacing.

This distinction has been encoded into both the `product-designer` agent and the `design_crit` skill so the disagreement doesn't recur.

---

## Open structural question (no fix proposed)

**Both passes independently flagged the same thing, and nothing on this list resolves it.**

Chrome above the first card row measures **399–427px of an 812px viewport (49–53%)** — the delta between the two measurements is the community banner's presence. Only **4–5 card rows** are visible on the first screen.

| band | px |
|---|---|
| header | 104 |
| community banner | 39 |
| map peek (25vh) | 203 |
| chip bar | 53 |
| day header | 28 |
| **before any content** | **427** |

The 203px map allocation is **unconditional** — on the Wellness lens the map renders **one pin** and still takes a quarter of the screen.

Worth testing before cutover: **a 20vh peek against the current 25vh**, and/or a peek that responds to how many pins the active lens actually has. Decision belongs to Batu; recorded here so it isn't lost.

---

## Protected — do not touch in a cleanup pass

Both passes converged on what is genuinely well-built. A sweep should be fenced off from all of it:

1. **The color system and the shared pin-swatch key** (`--paper/--ink/--amber/--brick/--slate/--line`, `.july-dot--*` ↔ `.ii-pin--*`). One system speaking three times — map pins, chip dots, card rows. Every text pair measures AA or better; `--ink-soft` at 5.32:1 is deliberate and documented. Do not "adjust" it.
2. **The calendar spine** — sticky day headers under sticky map + chips, `--peek`/`--chrome` keeping offsets in sync, `scroll-margin-top` on cards. Structurally the smartest part of the build; the `--chrome` comment is load-bearing.
3. **The row subline contract** — `time · kicker · address` with venue-in-title suppression (`cardSchema` → `cardSubline`). The glanceability win is real; the redundancy is downstream in the detail view, not here.
4. **Pin hit-area technique** — `::after { inset: -8px }` with the standing "never set position/transform on marker elements" rule. Hard-won, easy to break.
5. **320px reflow.** Verified clean, no page horizontal scroll. Don't let a chip-bar fix regress it.
6. **The one-banner precedence slot** (`bannerSlot.js`) and the freshness-degradation banner. Correct restraint.
7. **Escape-closes-card, `replaceState` deep links, share/`.ics` plumbing, the `sr-only` containing-block fix.** All fixed for stated reasons; all fragile.
8. **The custom MapLibre style.** Building fills, road casings, and letterspaced labels drawn from the same palette tokens as the cards — the map reads as *part of the publication*, not a Google embed with branding bolted on. This is why the white control slab (#6) reads as damage rather than a nitpick: it's the one place the authorship visibly stops.

---

## Not verified

Stated plainly rather than assumed:

- **Real-device rendering on iOS Safari / Android Chrome.** The font finding (#2) is confirmed at the code level but its visible consequence on an actual iPhone is unconfirmed — worth one screenshot.
- **Touch ergonomics of 32px targets with 6px gutters** — measured, not thumb-tested.
- **The empty-lens state at 375px** — unreachable with current data (all 9 lenses hold ≥2 cards); assessed from source only.
- **The `action.filterId` card-action path** — no card in `cards.json` carries `filterId`, so that trigger in #5 is dormant, not live.

---

## Method lessons (for the next pass)

Recorded because they improve the tooling, not just this list:

1. **The crit pass praised type identity that does not ship.** It scored "850-weight display type" as authored while Inter was never loaded. A declared `font-family` proves nothing. → Both the `design_crit` skill and the `product-designer` agent now require verifying that a declared face actually loads (`document.fonts` + an `@font-face`/link/dependency) **before** scoring typography.
2. **The white MapLibre chrome sat in every screenshot across both passes and only one caught it.** Vendor-injected UI never appears in the project's own CSS, so palette audits miss it. → Both files now require sampling computed values on third-party chrome.
3. **Standards vs. guidelines.** The crit escalated a platform guideline to a hard accessibility failure and proposed a fix that worsened a documented root problem. → Both files now separate the WCAG floor (24px) from the 44pt guideline, and require checking the decision log before calling a deliberate choice a defect.
4. **Two independent passes beat one thorough pass.** Each caught P0-severity defects the other missed completely — the Follow CTA (crit only) and the unshipped font (designer only). Keep them separate and keep the critic's context clean.
