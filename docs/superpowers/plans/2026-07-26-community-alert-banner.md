# Community Alert Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the sourced Film Noir Cinema "Keep Us Alive" fundraiser (existing card `film-noir-support`) so residents can't miss it: a tappable community-alert banner under the header that deep-opens the card, plus the card pinned to the top of the feed while the campaign runs.

**Architecture:** A new `communityAlert.js` module (mirroring `gtrainBanner.js`: frozen sourced config + pure time-derived state that self-hides on expiry) feeds a new banner in `JulyApp.jsx`; `groupByDay` gains an optional `pinnedId` that hoists one card into a top-of-feed group. One new locked analytics event, `alert_tap`.

**Tech Stack:** React 19 + Vite, `node --test` unit tests, plain CSS (`july.css`).

## Global Constraints

- **Truth rules:** alert copy comes from the cinema's own public ask (filmnoircinema.com "Keep Us Alive" banner, sourced 2026-07-16 on the card); alert self-hides at `expiresAt` unless renewed from a fresh source check, and self-hides if its card ever leaves the deck (banner must never point nowhere).
- **II-C palette only:** banner colors from `july.css` `:root` tokens (`--brick #a04432` bed, `--paper-lift` text — 4.9:1, AA at 13px).
- **Eligibility charter (decision log):** existential + publicly self-declared + time-bound + one at a time + leaves when done. Tappable is a deliberate revision of the 2026-07-23 "plain status, not a control" call — justified because this banner has a destination card.
- Never push without Batu (push = production deploy).
- Charter + this exception to the pre-launch feature freeze get a DECISION_LOG entry (Task 5).

---

### Task 1: `communityAlert.js` module

**Files:**
- Create: `src/demand-test/communityAlert.js`
- Test: `src/demand-test/communityAlert.test.mjs`

**Interfaces:**
- Produces: `COMMUNITY_ALERT` (frozen `{cardId, headline, detail, cta, sourcedAt, expiresAt}`) and `activeCommunityAlert(now, cardsById, alert = COMMUNITY_ALERT) → alert | null`. `cardsById` is a `Map` keyed by card id (JulyApp already builds `CARDS_BY_ID`).

- [x] **Step 1: Write the failing test** (`src/demand-test/communityAlert.test.mjs`)

```js
import test from "node:test";
import assert from "node:assert/strict";
import seed from "../data/demand-test/july-2026-cards.json" with { type: "json" };
import { COMMUNITY_ALERT, activeCommunityAlert } from "./communityAlert.js";

const CARDS_BY_ID = new Map(seed.cards.map((c) => [c.id, c]));
const A = {
  cardId: "film-noir-support",
  expiresAt: "2026-08-24T00:00:00-04:00",
};

test("before expiry, with the card in the deck → the alert shows", () => {
  assert.equal(activeCommunityAlert(new Date("2026-07-26T12:00:00-04:00"), CARDS_BY_ID, A), A);
});

test("at and after expiresAt → null (alert hides itself, gtrainBanner lesson)", () => {
  assert.equal(activeCommunityAlert(new Date("2026-08-24T00:00:00-04:00"), CARDS_BY_ID, A), null);
  assert.equal(activeCommunityAlert(new Date("2026-09-01T09:00:00-04:00"), CARDS_BY_ID, A), null);
});

test("card gone from the deck → null (banner must never point nowhere)", () => {
  const without = new Map(CARDS_BY_ID);
  without.delete("film-noir-support");
  assert.equal(activeCommunityAlert(new Date("2026-07-26T12:00:00-04:00"), without, A), null);
});

test("shipped alert targets a real card and is frozen", () => {
  assert.ok(CARDS_BY_ID.has(COMMUNITY_ALERT.cardId));
  assert.ok(Object.isFrozen(COMMUNITY_ALERT));
  assert.ok(Date.parse(COMMUNITY_ALERT.expiresAt) > Date.parse(COMMUNITY_ALERT.sourcedAt));
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test src/demand-test/communityAlert.test.mjs`
Expected: FAIL — Cannot find module `communityAlert.js`.

- [x] **Step 3: Write the module** (`src/demand-test/communityAlert.js`)

```js
// Community alert (2026-07-26) — the banner slot's rare "neighborhood needs
// you" tier. Charter (DECISION_LOG 2026-07-26): existential stakes publicly
// declared by the business itself, time-bound, ONE at a time, and the banner
// deep-opens the sourced card — it never carries the ask alone.
//
// Sourced 2026-07-16 from filmnoircinema.com ("Keep Us Alive" site banner);
// card film-noir-support holds the GoFundMe action. expiresAt is a re-verify
// deadline, not a campaign end: the weekly ingest re-checks the source and
// renews it, or the alert hides itself (the gtrainBanner staleness lesson).
export const COMMUNITY_ALERT = Object.freeze({
  cardId: "film-noir-support",
  headline: "Keep Film Noir Cinema alive",
  detail: "The indie cinema is asking the neighborhood for help",
  cta: "See how",
  sourcedAt: "2026-07-26",
  expiresAt: "2026-08-24T00:00:00-04:00",
});

export function activeCommunityAlert(now, cardsById, alert = COMMUNITY_ALERT) {
  if (now.getTime() >= Date.parse(alert.expiresAt)) return null;
  if (!cardsById.has(alert.cardId)) return null;
  return alert;
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `node --test src/demand-test/communityAlert.test.mjs`
Expected: PASS (4 tests).

- [x] **Step 5: Commit**

```bash
git add src/demand-test/communityAlert.js src/demand-test/communityAlert.test.mjs
git commit -m "feat(track-v): community-alert state module (Film Noir fundraiser)"
```

### Task 2: `alert_tap` in the locked event taxonomy

**Files:**
- Modify: `src/demand-test/trackEvents.js:7-18` (EVENTS registry)
- Test: `src/demand-test/trackEvents.test.mjs`

**Interfaces:**
- Produces: `EVENTS.ALERT_TAP === "alert_tap"` for Task 4.

- [x] **Step 1: Add failing test** to `trackEvents.test.mjs`:

```js
test("alert_tap is a locked event name (community alert banner, 2026-07-26)", () => {
  assert.equal(EVENTS.ALERT_TAP, "alert_tap");
  assert.doesNotThrow(() => trackEvent(EVENTS.ALERT_TAP, { cardId: "film-noir-support" }));
});
```

(Match the file's existing import/setup style when inserting.)

- [x] **Step 2: Run** `node --test src/demand-test/trackEvents.test.mjs` — expected FAIL (`ALERT_TAP` undefined → `trackEvent(undefined)` throws).

- [x] **Step 3: Implement** — in `EVENTS`, after `RELATED_TAP`:

```js
  ALERT_TAP: "alert_tap",
```

- [x] **Step 4: Run** `node --test src/demand-test/trackEvents.test.mjs` — expected PASS.

- [x] **Step 5: Commit** `git commit -m "feat(track-v): alert_tap event through the locked taxonomy"` (both files).

### Task 3: feed pin — `groupByDay` gains `pinnedId`

**Files:**
- Modify: `src/demand-test/filterCards.js:82-127` (`groupByDay`)
- Test: `src/demand-test/filterCards.test.mjs`

**Interfaces:**
- Consumes: nothing new.
- Produces: `groupByDay(cards, date, pinnedId = null)` — when a card with `id === pinnedId` is in `cards`, it is emitted as the FIRST group `{key: "pinned", order: -1 (any value sorting first), label: "Neighborhood needs you", cards: [card]}` and removed from its natural group. Absent/null `pinnedId` → behavior byte-identical to today.

- [x] **Step 1: Add failing tests** to `filterCards.test.mjs` (match the file's existing fixtures/imports style):

```js
test("groupByDay pins the alert card into a leading 'Neighborhood needs you' group", () => {
  const cards = [
    { id: "a", startsAt: null, endsAt: null },
    { id: "pin-me", startsAt: null, endsAt: null },
  ];
  const groups = groupByDay(cards, new Date("2026-07-26T12:00:00-04:00"), "pin-me");
  assert.equal(groups[0].key, "pinned");
  assert.equal(groups[0].label, "Neighborhood needs you");
  assert.deepEqual(groups[0].cards.map((c) => c.id), ["pin-me"]);
  assert.ok(!groups.some((g) => g.key !== "pinned" && g.cards.some((c) => c.id === "pin-me")));
});

test("groupByDay without pinnedId, or with an id not in the deck, is unchanged", () => {
  const cards = [{ id: "a", startsAt: null, endsAt: null }];
  const now = new Date("2026-07-26T12:00:00-04:00");
  assert.deepEqual(groupByDay(cards, now), groupByDay(cards, now, "ghost"));
  assert.ok(!groupByDay(cards, now).some((g) => g.key === "pinned"));
});
```

- [x] **Step 2: Run** `node --test src/demand-test/filterCards.test.mjs` — expected FAIL.

- [x] **Step 3: Implement** — in `groupByDay`, add the third parameter and route the pinned card before the existing classification:

```js
export function groupByDay(cards, date, pinnedId = null) {
  ...
  for (const card of cards) {
    // Community alert (2026-07-26): the alert's card leads the feed in its own
    // group while the campaign runs — order -1 sorts ahead of Today (0).
    if (pinnedId != null && card.id === pinnedId) {
      put("pinned", -1, "Neighborhood needs you", card);
      continue;
    }
    ...
```

(`byClock` on a 1-card group is a harmless no-op — no sort special-case needed.)

- [x] **Step 4: Run** `node --test src/demand-test/filterCards.test.mjs` — expected PASS.

- [x] **Step 5: Commit** `git commit -m "feat(track-v): groupByDay pinnedId — alert card leads the feed"` (both files).

### Task 4: banner UI + wiring in JulyApp

**Files:**
- Modify: `src/demand-test/JulyApp.jsx` (imports; alert state; `revealCard` helper shared with `onRelated`; banner JSX after the G banner; pass `pinnedId` into `groupByDay`)
- Modify: `src/demand-test/july.css` (`.july-cbanner` block after `.july-gbadge`)

**Interfaces:**
- Consumes: `activeCommunityAlert`/`COMMUNITY_ALERT` (Task 1), `EVENTS.ALERT_TAP` (Task 2), `groupByDay(..., pinnedId)` (Task 3).

- [x] **Step 1: Wire state.** Import `{ activeCommunityAlert }` from `./communityAlert.js`. Next to `gtrainPhase` (line ~85, same per-render-not-memoized rationale):

```js
  const communityAlert = activeCommunityAlert(new Date(), CARDS_BY_ID);
```

In the `useMemo`, pass the pin through only when the alert is live:
`groupByDay(feed, now, communityAlert?.cardId ?? null)` — and add `communityAlert?.cardId` to the dependency array.

- [x] **Step 2: Factor `revealCard`.** Extract the shared "make this card visible and open it" body used by `onRelated`:

```js
  // Reveal = land the card in the visible feed no matter the current lens
  // (shared by related-chip taps and the community-alert banner).
  const revealCard = useCallback(
    (cardId) => {
      const target = CARDS_BY_ID.get(cardId);
      if (!target) return;
      setPinFocus(null);
      if (!matchesFilter(target, filter)) setFilter("all");
      if (todayOnly && !isActiveOn(target, new Date())) setTodayOnly(false);
      setSelectedId(cardId);
    },
    [filter, todayOnly],
  );
```

`onRelated` becomes track + `revealCard(toCardId)`. Add:

```js
  const onAlertTap = useCallback(() => {
    trackEvent(EVENTS.ALERT_TAP, { cardId: communityAlert.cardId });
    revealCard(communityAlert.cardId);
  }, [communityAlert, revealCard]);
```

- [x] **Step 3: Banner JSX** — directly after the G-banner blocks (line ~183), a real `<button>` (tappable IS the point; deliberate revision of 2026-07-23 "plain status", logged in Task 5):

```jsx
      {/* Community alert (DECISION_LOG 2026-07-26): the slot's rare
          "neighborhood needs you" tier — sourced, time-bound, one at a time,
          and a control, not a status: it deep-opens the sourced card. */}
      {communityAlert && (
        <button type="button" className="july-cbanner" onClick={onAlertTap}>
          <span className="july-gbadge july-cbadge">&hearts;</span>
          <span className="july-cbanner-text">
            <strong>{communityAlert.headline}</strong> &middot; {communityAlert.detail}
          </span>
          <span className="july-cbanner-cta">{communityAlert.cta} &rarr;</span>
        </button>
      )}
```

- [x] **Step 4: CSS** — after the `.july-gbadge` block in `july.css`:

```css
/* --- community alert banner (DECISION_LOG 2026-07-26) --- */
/* brick bed: paper-lift on #a04432 = 4.9:1, AA for this 13px line */
.july-cbanner {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 8px 22px;
  border: 0;
  border-bottom: 1px solid var(--ink);
  background: var(--brick);
  color: var(--paper-lift);
  font: inherit;
  font-size: 0.82rem;
  text-align: left;
  cursor: pointer;
}

.july-cbanner:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: -3px;
}

.july-cbadge {
  background: transparent;
  font-size: 0.7rem;
}

.july-cbanner-text {
  flex: 1;
  min-width: 0;
}

.july-cbanner-cta {
  flex: none;
  font-weight: 850;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
```

- [x] **Step 5: Full test suite + build.**

Run: `npm test` — expected: all pass. Run: `npm run build` — expected: clean build.

- [x] **Step 6: Commit** `git commit -m "feat(track-v): community-alert banner — Film Noir fundraiser front and center"`.

### Task 5: browser verification + decision log

**Files:**
- Modify: `docs/DECISION_LOG.md` (new entry, newest-first)

- [x] **Step 1: Verify in the browser** (preview_start `dev` config, port 5192): banner renders under the G chip in brick with the ♥ badge; tap opens/scrolls to the Film Noir card; feed shows "Neighborhood needs you" group first; check `alert_tap` in the console/network stream; screenshot desktop + mobile widths for Batu.

- [x] **Step 2: Decision log entry** — banner charter (priority ladder: active sourced disruption → upcoming → community alert → re-entry signal (future R2) → empty; eligibility bar: existential + self-declared + sourced + time-bound + one at a time + leaves when done; banned uses: ads/sponsorship pre-PMF, email capture, anything unsourced or evergreen), the "tappable when there's a destination" revision of 2026-07-23, and the scoped feature-freeze exception rationale (time-sensitive, tiny, mission-core).

- [x] **Step 3: Commit** `git commit -m "docs: banner charter + community-alert decision"` and report to Batu with screenshots; suggest push (his call).
