# Track V Validation Prep (Instrumentation + Countable CTAs + Schema Catch-up) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the live Track V demand test measurable before the Jul 10–13 G-closure weekend — custom analytics events on every meaningful tap, countable Tally forms replacing the mailto CTAs, and the place-graph schema fields (`trustRisk`/`relatedCardIds`/`timeline`) landed in `cardSchema.js` + seed.

**Architecture:** One new pure module (`trackEvents.js`) is the seam between UI tap handlers and `@vercel/analytics`' `track()` — the vendor import lives only in `main.jsx`, so the module stays testable under `node --test` and the transport stays swappable if Hobby-plan gating blocks custom events. CTA URLs move to a tested constants module. Schema fields extend `validateCard` in place, and the seed gains `trustRisk` on all 26 cards plus a sparse `relatedCardIds` link between the two G-train action cards.

**Tech Stack:** React 19 + Vite MPA (`/july.html` entry), `@vercel/analytics` (new dep), Tally (hosted forms, decided 2026-07-03), `node --test` + `node:assert/strict`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-02-spatial-demand-test-design.md` — events to instrument are "pin/filter/action/CTA taps"; schema fields are `relatedCardIds?: string[]`, `timeline?: Array<{date, title, summary?, sourceUrl?}>`, `trustRisk: "low"|"medium"|"high"`.
- The demand-test page must never import the 3D runtime (`src/demand-test/` stays zero-Three.js).
- All UI colors come from the II-C palette — this plan changes no colors, adds no visual elements beyond swapping `href`s.
- Tests: `node --test "src/**/*.test.mjs"` via `npm run test`; full gate is `npm run verify` (291 tests green at plan time).
- Analytics must never break a tap for a tester: transport errors are caught and logged, never rethrown.
- Event data properties must be primitives (string/number/boolean) — Vercel aggregates on low-cardinality values.
- Run `git status --short` before editing; commit per task with the repo's `feat(track-v):` / `content(track-v):` / `docs(track-v):` style.
- **Never `git push` and never `npx vercel deploy --prod` without Batu's explicit approval** (Task 5 checkpoint).
- Task 3 is blocked on Batu creating ONE Tally form and providing its share URL (spec in Task 3, Step 0; single-CTA revision per Batu's commit `3455063`). Tasks 1, 2, 4 do not depend on it.

## File structure

```
package.json                                 # modified: + @vercel/analytics dependency
src/demand-test/trackEvents.js               # new: event-name registry + transport seam
src/demand-test/trackEvents.test.mjs         # new: module tests
src/demand-test/main.jsx                     # modified: inject() + bindTransport(track)
src/demand-test/CardPanel.jsx                # modified: filter/today/card-open/action/CTA events; Tally hrefs
src/demand-test/MapView.jsx                  # modified: pin_tap events on pin + venue-dot clicks
src/demand-test/ctaLinks.js                  # new: Tally URL constants
src/demand-test/ctaLinks.test.mjs            # new: URL-shape regression guard (no mailto backslide)
src/demand-test/cardSchema.js                # modified: trustRisk / relatedCardIds / timeline validation
src/demand-test/cardSchema.test.mjs          # modified: fixture + new field tests
src/demand-test/julyCards.test.mjs           # modified: referential-integrity + trust coverage tests
src/data/demand-test/july-2026-cards.json    # modified: trustRisk on all 26 cards; G-train cards linked
docs/superpowers/specs/2026-07-02-spatial-demand-test-design.md   # modified: status line
docs/DECISION_LOG.md                         # modified: instrumentation + Tally decision entry
```

---

### Task 1: `trackEvents.js` — event registry + transport seam

**Files:**
- Create: `src/demand-test/trackEvents.js`
- Test: `src/demand-test/trackEvents.test.mjs`
- Modify: `package.json` (via `npm install @vercel/analytics`)

**Interfaces:**
- Produces: `EVENTS` (frozen name map: `PIN_TAP: "pin_tap"`, `CARD_OPEN: "card_open"`, `FILTER_TAP: "filter_tap"`, `TODAY_TOGGLE: "today_toggle"`, `ACTION_TAP: "action_tap"`, `CTA_TAP: "cta_tap"`), `bindTransport(fn: (name, data) => void) => void`, `trackEvent(name: string, data?: Record<string, string|number|boolean>) => void`. Tasks 2–3 import all three.

- [ ] **Step 1: Install the analytics package**

Run: `npm install @vercel/analytics`
Expected: `package.json` gains `"@vercel/analytics"` under `dependencies`; lockfile updates.

- [ ] **Step 2: Write the failing test**

Create `src/demand-test/trackEvents.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { EVENTS, bindTransport, trackEvent } from "./trackEvents.js";

test("forwards a known event with its properties to the bound transport", () => {
  const calls = [];
  bindTransport((name, data) => calls.push({ name, data }));
  trackEvent(EVENTS.PIN_TAP, { cardId: "core-press", kind: "business" });
  assert.deepEqual(calls, [{ name: "pin_tap", data: { cardId: "core-press", kind: "business" } }]);
});

test("exposes the six agreed tap events by stable wire name", () => {
  assert.deepEqual(EVENTS, {
    PIN_TAP: "pin_tap",
    CARD_OPEN: "card_open",
    FILTER_TAP: "filter_tap",
    TODAY_TOGGLE: "today_toggle",
    ACTION_TAP: "action_tap",
    CTA_TAP: "cta_tap",
  });
});

test("throws on an unknown event name (typo guard)", () => {
  bindTransport(() => {});
  assert.throws(() => trackEvent("pin_tapp"), /unknown analytics event/);
});

test("throws on non-primitive event data (dashboard cardinality guard)", () => {
  bindTransport(() => {});
  assert.throws(() => trackEvent(EVENTS.CARD_OPEN, { card: { id: "x" } }), /primitive/);
});

test("is a safe no-op when no transport is bound", () => {
  bindTransport(null);
  trackEvent(EVENTS.CTA_TAP, { cta: "signup" }); // must not throw
});

test("a throwing transport never breaks the calling tap handler", () => {
  bindTransport(() => {
    throw new Error("network down");
  });
  trackEvent(EVENTS.FILTER_TAP, { filter: "events" }); // must not throw
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `node --test src/demand-test/trackEvents.test.mjs`
Expected: FAIL — `Cannot find module ... trackEvents.js`

- [ ] **Step 4: Write the implementation**

Create `src/demand-test/trackEvents.js`:

```js
// Track V instrumentation — the one seam between UI taps and Vercel Web
// Analytics. The ~Jul 15 go/no-go needs *action* evidence (pin/filter/action/
// CTA taps), so event names are locked here: a typo'd name throws instead of
// silently creating a dashboard category nothing aggregates. The vendor import
// lives in main.jsx (bindTransport(track)) so this module runs under
// `node --test` and the transport stays swappable.
export const EVENTS = Object.freeze({
  PIN_TAP: "pin_tap",
  CARD_OPEN: "card_open",
  FILTER_TAP: "filter_tap",
  TODAY_TOGGLE: "today_toggle",
  ACTION_TAP: "action_tap",
  CTA_TAP: "cta_tap",
});

const NAMES = new Set(Object.values(EVENTS));

let transport = null;

export function bindTransport(fn) {
  transport = fn;
}

export function trackEvent(name, data = {}) {
  if (!NAMES.has(name)) throw new Error(`unknown analytics event "${name}"`);
  for (const [key, value] of Object.entries(data)) {
    const t = typeof value;
    if (t !== "string" && t !== "number" && t !== "boolean") {
      throw new Error(`event "${name}": property "${key}" must be a primitive`);
    }
  }
  try {
    transport?.(name, data);
  } catch (error) {
    // A dead analytics endpoint must never break a tester's tap.
    console.error("[trackEvent]", error);
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test src/demand-test/trackEvents.test.mjs`
Expected: PASS — 6/6.

- [ ] **Step 6: Run the full suite**

Run: `npm run test`
Expected: PASS — prior count plus the 6 new trackEvents tests, zero failures.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/demand-test/trackEvents.js src/demand-test/trackEvents.test.mjs
git commit -m "feat(track-v): event registry + transport seam for tap instrumentation"
```

---

### Task 2: Wire events into `main.jsx`, `CardPanel.jsx`, `MapView.jsx`

**Files:**
- Modify: `src/demand-test/main.jsx`
- Modify: `src/demand-test/CardPanel.jsx`
- Modify: `src/demand-test/MapView.jsx`

**Interfaces:**
- Consumes: `EVENTS`, `bindTransport`, `trackEvent` from Task 1; `inject`, `track` from `@vercel/analytics`.
- Produces: every meaningful tap on `/july.html` fires exactly one named event. No signature changes visible to other tasks (Task 3 edits the same CTA block it defines below).

There is no DOM test rig in this repo (`node --test`, no jsdom) — UI wiring is verified by build + dev-server tap-through (Step 6), which works because `@vercel/analytics` logs every event to the console in dev mode instead of sending it.

- [ ] **Step 1: Bind the real transport in `main.jsx`**

Replace the full contents of `src/demand-test/main.jsx` with:

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { inject, track } from "@vercel/analytics";
import { bindTransport } from "./trackEvents.js";
import JulyApp from "./JulyApp.jsx";
import "./july.css";

// Pageviews + custom tap events (Track V validation instrumentation).
// In dev, @vercel/analytics logs to the console instead of sending.
inject();
bindTransport(track);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JulyApp />
  </React.StrictMode>,
);
```

- [ ] **Step 2: Instrument `CardPanel.jsx`**

Five edits, exact anchors from the current file:

2a. Add the import after the existing `filterCards.js` import (line 2):

```jsx
import { FILTERS, pinKind } from "./filterCards.js";
import { EVENTS, trackEvent } from "./trackEvents.js";
```

2b. `ActionLink` gains a `cardId` prop and tracks both action shapes. Replace the whole `ActionLink` function with:

```jsx
function ActionLink({ action, cardId }) {
  const cls = "july-action";
  const onTap = () => trackEvent(EVENTS.ACTION_TAP, { cardId, actionType: action.type });
  if (action.type === "share") {
    const onShare = async () => {
      onTap();
      const data = { title: "July in Greenpoint", url: window.location.href };
      if (navigator.share) await navigator.share(data).catch(() => {});
      else await navigator.clipboard.writeText(window.location.href);
    };
    return (
      <button type="button" className={cls} onClick={onShare}>
        {action.label}
      </button>
    );
  }
  if (action.url) {
    return (
      <a className={cls} href={action.url} target="_blank" rel="noreferrer" onClick={onTap}>
        {action.label} ↗
      </a>
    );
  }
  return <span className={`${cls} july-action--static`}>{action.label}</span>;
}
```

2c. In `CardDetail`, pass the card id through (the `.map` inside `july-actions`):

```jsx
        {card.actions.map((a) => (
          <ActionLink key={a.label} action={a} cardId={card.id} />
        ))}
```

2d. Filter chips + Today toggle in the `<nav>`: replace the two `onClick`s:

```jsx
            onClick={() => {
              trackEvent(EVENTS.FILTER_TAP, { filter: f.id });
              onFilter(f.id);
            }}
```

and for the Today chip:

```jsx
          onClick={() => {
            trackEvent(EVENTS.TODAY_TOGGLE, { on: !todayOnly });
            onToday(!todayOnly);
          }}
```

2e. Card list head — track opens only (a close is not discovery interest). Replace the head `onClick`:

```jsx
                onClick={() => {
                  if (!open) trackEvent(EVENTS.CARD_OPEN, { cardId: card.id });
                  onSelect(open ? null : card.id);
                }}
```

2f. Footer CTAs — track taps (hrefs stay mailto until Task 3). Replace the `<footer>` block:

```jsx
      <footer className="july-ctas">
        <a
          className="july-cta july-cta--primary"
          href={SIGNUP_MAILTO}
          onClick={() => trackEvent(EVENTS.CTA_TAP, { cta: "signup" })}
        >
          Get weekly Greenpoint updates
        </a>
        <a
          className="july-cta"
          href={SUBMIT_MAILTO}
          onClick={() => trackEvent(EVENTS.CTA_TAP, { cta: "submit" })}
        >
          Add your business or event
        </a>
      </footer>
```

- [ ] **Step 3: Instrument `MapView.jsx`**

3a. Add the import after the `filterCards.js` import (line 5):

```jsx
import { pinKind } from "./filterCards.js";
import { EVENTS, trackEvent } from "./trackEvents.js";
```

3b. Venue-dot click handler (inside the `for (const v of card.venues ?? [])` loop):

```jsx
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          trackEvent(EVENTS.PIN_TAP, { cardId: card.id, kind: "venue" });
          onSelect(card.id);
        });
```

3c. Main pin click handler:

```jsx
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          trackEvent(EVENTS.PIN_TAP, { cardId: card.id, kind: pinKind(card) });
          onSelect(card.id);
        });
```

- [ ] **Step 4: Run the suite**

Run: `npm run test`
Expected: PASS, same count as Task 1 — pure-module tests are unaffected by JSX wiring.

- [ ] **Step 5: Production build check**

Run: `npm run build`
Expected: succeeds; `dist/july.html` emitted; no unresolved-import errors for `@vercel/analytics`.

- [ ] **Step 6: Dev-server tap-through (behavioral verification)**

Start the dev server (`npm run dev`, or the preview tooling if driving this from Claude Code) and open `http://127.0.0.1:5173/july.html`. Perform, and confirm a `[Vercel Web Analytics]` debug console line for each:

1. tap a map pin → `pin_tap` with `cardId` + `kind`
2. tap a World Cup venue dot → `pin_tap` with `kind: "venue"`
3. tap a card head in the list → `card_open`
4. tap a filter chip → `filter_tap`
5. tap the Today chip → `today_toggle`
6. open a card, tap an action link → `action_tap`
7. tap each footer CTA → `cta_tap` with `cta: "signup"` then `cta: "submit"`

Expected: 6 distinct event names observed, no console errors, all taps still perform their original behavior (selection, filtering, navigation).

- [ ] **Step 7: Commit**

```bash
git add src/demand-test/main.jsx src/demand-test/CardPanel.jsx src/demand-test/MapView.jsx
git commit -m "feat(track-v): instrument pin/filter/card/action/CTA taps with named events"
```

---

### Task 3: Tally CTA (countable signups) — **blocked on Batu's form URL**

> **REVISED 2026-07-03 (Batu, commit `3455063`):** one CTA, not two. The submission button was dropped; business/event intake is an optional field inside the signup form. `CardPanel.jsx` now has a single `SIGNUP_URL` constant (mailto interim) with conditional `target`/`rel` that activate for http(s) URLs.

**Files:**
- Create: `src/demand-test/ctaLinks.js`
- Test: `src/demand-test/ctaLinks.test.mjs`
- Modify: `src/demand-test/CardPanel.jsx`

**Interfaces:**
- Consumes: the single footer CTA anchor (already tracking `cta_tap {cta:"signup"}`) and its `SIGNUP_URL` constant in `CardPanel.jsx`.
- Produces: `SIGNUP_FORM_URL: string` from `ctaLinks.js`.

- [ ] **Step 0 (Batu, manual — ~10 min):** Create ONE Tally form at tally.so and provide its share URL (`https://tally.so/r/<id>`): **"Get next week's map"** — fields: Email (required) · "Where in Greenpoint are you?" (short text, optional) · "Got a business, event, or update for the map? Tell us" (long text, optional) · Link — Instagram/site/tickets (URL, optional).

  Tally response count = the "≥3 ask to subscribe" signal; responses with the business/event field filled = the "≥2 businesses ask to be included" signal.

- [ ] **Step 1: Write the failing test**

Create `src/demand-test/ctaLinks.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { SIGNUP_FORM_URL } from "./ctaLinks.js";

// Regression guard: the launch mailto was uncountable — the CTA target must
// stay a hosted form so the go/no-go signup signals are measurable.
test("the CTA points at a Tally share URL, not a mailto", () => {
  assert.match(SIGNUP_FORM_URL, /^https:\/\/tally\.so\/r\/[A-Za-z0-9]+$/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/demand-test/ctaLinks.test.mjs`
Expected: FAIL — `Cannot find module ... ctaLinks.js`

- [ ] **Step 3: Create `src/demand-test/ctaLinks.js`** (substitute the real URL from Step 0)

```js
// Countable CTA (Tally, decided 2026-07-03; single-ask funnel per 3455063) —
// replaced the launch mailto so the go/no-go signals ("≥3 ask to subscribe",
// "≥2 businesses ask in" via the optional intake field) are dashboard-countable
// instead of inbox-dependent. CTA_TAP = intent; Tally responses = commitment.
export const SIGNUP_FORM_URL = "https://tally.so/r/REPLACE_WITH_ID";
```

(The test's `[A-Za-z0-9]+$` pattern fails on `REPLACE_WITH_ID` because of the underscores — the task cannot pass with a placeholder URL left in.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/demand-test/ctaLinks.test.mjs`
Expected: PASS (only with real Tally ids substituted).

- [ ] **Step 5: Swap the CTA href in `CardPanel.jsx`**

5a. Delete the local `SIGNUP_URL` constant (and its interim-mailto comment block) and add the import next to the other local imports:

```jsx
import { SIGNUP_FORM_URL } from "./ctaLinks.js";
```

5b. In the footer anchor, replace the three `SIGNUP_URL` references with `SIGNUP_FORM_URL` (the conditional `target`/`rel` from `3455063` activate automatically once the value is https). Keep the label ("Get next week's map") and the `cta_tap` handler untouched.

- [ ] **Step 6: Verify**

Run: `npm run test` — expected PASS (+1 ctaLinks test), zero failures.
Run: `grep -rn "mailto" src/demand-test/` — expected: no matches.
Dev-server check: the footer CTA opens the Tally form in a new tab and logs a `cta_tap` debug event.

- [ ] **Step 7: Commit**

```bash
git add src/demand-test/ctaLinks.js src/demand-test/ctaLinks.test.mjs src/demand-test/CardPanel.jsx
git commit -m "feat(track-v): countable Tally CTAs replace the launch mailtos"
```

---

### Task 4: Schema catch-up — `trustRisk` / `relatedCardIds` / `timeline` + seed population

**Files:**
- Modify: `src/demand-test/cardSchema.js`
- Modify: `src/demand-test/cardSchema.test.mjs`
- Modify: `src/demand-test/julyCards.test.mjs`
- Modify: `src/data/demand-test/july-2026-cards.json`

**Interfaces:**
- Consumes: existing `validateCard(card) => { ok, errors }`, `str()` helper, error style `` err(`bad X`) ``.
- Produces: `TRUST_RISKS = ["low", "medium", "high"]` export; `validateCard` additionally rejects missing/bad `trustRisk`, malformed `relatedCardIds` (non-array, empty, non-string entries, self-reference), malformed `timeline` (entries need parseable `date` + `title`; `summary`/`sourceUrl` optional strings).

- [ ] **Step 1: Write the failing tests**

In `src/demand-test/cardSchema.test.mjs`: add `trustRisk: "low",` to the `good` fixture (after `partnerRelevance: "high",`), update the import to include `TRUST_RISKS`, and append:

```js
test("place-graph fields: trustRisk is required and enum-locked", () => {
  assert.deepEqual(TRUST_RISKS, ["low", "medium", "high"]);
  const { trustRisk, ...missing } = good;
  assert.equal(validateCard(missing).ok, false);
  assert.equal(validateCard({ ...good, trustRisk: "none" }).ok, false);
});

test("relatedCardIds: optional, but must be non-empty string ids without self-reference", () => {
  assert.deepEqual(validateCard({ ...good, relatedCardIds: ["other-card"] }).errors, []);
  assert.equal(validateCard({ ...good, relatedCardIds: [] }).ok, false);
  assert.equal(validateCard({ ...good, relatedCardIds: [42] }).ok, false);
  assert.equal(validateCard({ ...good, relatedCardIds: ["test-card"] }).ok, false, "self-reference");
});

test("timeline: optional, entries need an ISO date and a title", () => {
  const entry = { date: "2026-07-10", title: "Weekend closure begins", sourceUrl: "https://new.mta.info" };
  assert.deepEqual(validateCard({ ...good, timeline: [entry] }).errors, []);
  assert.equal(validateCard({ ...good, timeline: [] }).ok, false);
  assert.equal(validateCard({ ...good, timeline: [{ date: "not-a-date", title: "x" }] }).ok, false);
  assert.equal(validateCard({ ...good, timeline: [{ date: "2026-07-10" }] }).ok, false, "missing title");
});
```

In `src/demand-test/julyCards.test.mjs`, append:

```js
test("relatedCardIds resolve to real cards (place-graph integrity)", () => {
  const ids = new Set(seed.cards.map((c) => c.id));
  for (const c of seed.cards) {
    for (const rid of c.relatedCardIds ?? []) {
      assert.ok(ids.has(rid), `${c.id} links to unknown card "${rid}"`);
    }
  }
  // Sparse v1 seed (spec): the two G-train action cards reference each other.
  const adopt = seed.cards.find((c) => c.id === "adopt-a-business");
  const advocacy = seed.cards.find((c) => c.id === "g-advocacy-mta");
  assert.deepEqual(adopt.relatedCardIds, ["g-advocacy-mta"]);
  assert.deepEqual(advocacy.relatedCardIds, ["adopt-a-business"]);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test src/demand-test/cardSchema.test.mjs src/demand-test/julyCards.test.mjs`
Expected: FAIL — `cardSchema.test.mjs` fails wholesale at module link time (`TRUST_RISKS` is not yet an export); the julyCards integrity test fails on `adopt.relatedCardIds` being `undefined`.

- [ ] **Step 3: Extend `cardSchema.js`**

3a. After the `EVIDENCE_LEVELS` export (line 25), add:

```js
export const TRUST_RISKS = ["low", "medium", "high"];
```

3b. In `validateCard`, after the `partnerRelevance` check (line 84), add:

```js
  // Place-graph moat fields (2026-07-03 spec revision): cheap to carry now,
  // they make cards durable objects instead of pins. v1 populates sparsely.
  if (!TRUST_RISKS.includes(card.trustRisk)) err("bad trustRisk");
  if (card.relatedCardIds != null) {
    if (!Array.isArray(card.relatedCardIds) || card.relatedCardIds.length === 0) {
      err("relatedCardIds must be a non-empty array when present");
    } else {
      for (const rid of card.relatedCardIds) {
        if (!str(rid)) err("relatedCardIds entries must be card-id strings");
        else if (rid === card.id) err("relatedCardIds must not self-reference");
      }
    }
  }
  if (card.timeline != null) {
    if (!Array.isArray(card.timeline) || card.timeline.length === 0) {
      err("timeline must be a non-empty array when present");
    } else {
      for (const t of card.timeline) {
        if (Number.isNaN(Date.parse(t?.date))) err("timeline entry needs an ISO date");
        if (!str(t?.title)) err("timeline entry needs a title");
        if (t?.summary != null && !str(t.summary)) err("timeline summary must be a string");
        if (t?.sourceUrl != null && !str(t.sourceUrl)) err("timeline sourceUrl must be a string");
      }
    }
  }
```

3c. Update the header comment's extension list (lines 1–7) to mention the 2026-07-03 place-graph fields (`trustRisk`, `relatedCardIds`, `timeline`).

- [ ] **Step 4: Populate the seed**

In `src/data/demand-test/july-2026-cards.json`:
- Add `"trustRisk": "low"` to all 26 cards **except** the two G-train action cards (`adopt-a-business`, `g-advocacy-mta`), which get `"trustRisk": "medium"` — their claims (affected-business framing, advocacy asks echoed from SSG) are secondhand and time-sensitive, unlike the directly-sourced SSG/Greenpointers listings.
- Add `"relatedCardIds": ["g-advocacy-mta"]` to `adopt-a-business` and `"relatedCardIds": ["adopt-a-business"]` to `g-advocacy-mta`.
- Bump `"updatedAt"` to `"2026-07-03"` on every card touched (all 26).

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --test src/demand-test/cardSchema.test.mjs src/demand-test/julyCards.test.mjs`
Expected: PASS — every seed card revalidates with the new required field (the existing "every card validates" coverage in `julyCards.test.mjs` enforces `trustRisk` across all 26).

- [ ] **Step 6: Run the full suite**

Run: `npm run test`
Expected: PASS (+4 new tests over the pre-task count), zero failures.

- [ ] **Step 7: Commit**

```bash
git add src/demand-test/cardSchema.js src/demand-test/cardSchema.test.mjs src/demand-test/julyCards.test.mjs src/data/demand-test/july-2026-cards.json
git commit -m "feat(track-v): place-graph schema fields (trustRisk/relatedCardIds/timeline) + seed catch-up"
```

---

### Task 5: Docs, full verify, gated deploy + dashboard enablement

**Files:**
- Modify: `docs/superpowers/specs/2026-07-02-spatial-demand-test-design.md` (status block, lines 3–5)
- Modify: `docs/DECISION_LOG.md` (new entry at top)

**Interfaces:**
- Consumes: everything above, landed on `main`.

- [ ] **Step 1: Update the spec status block**

In the spec's "Next" line (line 4), mark items 1–3 done, e.g.: `1) instrumentation — DONE 2026-07-03 (named tap events via trackEvents.js + Vercel Web Analytics) · 2) forms — DONE 2026-07-03 (Tally; response counts = signup signals) · 3) schema catch-up — DONE 2026-07-03 · 4) factual review + Jul-10-weekend refresh · 5) distribute + Perri walkthrough over Jul 10–13; go/no-go ~Jul 15`. Keep the rest of the block intact. (If Task 3 is still blocked, mark it accordingly instead.)

- [ ] **Step 2: Add the DECISION_LOG entry**

Prepend (matching the log's existing entry format):

```markdown
## 2026-07-03 — Track V measurement: Vercel custom events + Tally forms

Instrumentation for the demand test go/no-go: six named tap events
(pin_tap / card_open / filter_tap / today_toggle / action_tap / cta_tap)
through a transport seam (`trackEvents.js`) bound to @vercel/analytics —
vendor-swappable if plan gating blocks custom events. CTAs moved from
mailtos to Tally hosted forms so signup/submission counts are dashboard-
countable (own /api endpoint rejected as backend surface on a throwaway
test; Google Forms rejected as off-identity). Place-graph fields
(trustRisk required, relatedCardIds/timeline optional) landed in
cardSchema.js; sparse seed links the two G-train action cards.
```

- [ ] **Step 3: Full verification gate**

Run: `npm run verify`
Expected: all suites green (tests + conformance + visual + components + stories + kit-coverage + overrides). Report the exact count.

- [ ] **Step 4: CHECKPOINT — Batu approval required**

Show the change summary (commits since `3d3b142`). Do not proceed without explicit approval to (a) push `main` and (b) deploy production.

- [ ] **Step 5: Push and deploy (after approval)**

```bash
git push origin main
npx vercel deploy --prod
```

Expected: deploy completes (~5 min); prod URL serves `/july.html`.

- [ ] **Step 6 (Batu, manual): Enable Web Analytics on the Vercel project**

Vercel dashboard → project `greenpoint-explorer` → **Analytics** tab → Enable. (Without this, `inject()` 404s harmlessly and nothing records.)

- [ ] **Step 7: Production smoke test — do custom events actually land?**

On <https://greenpoint-explorer.vercel.app/july.html>: tap a pin, a filter, an action, both CTAs. Then in the dashboard's Analytics → Events pane (allow a few minutes), confirm the named events appear with their properties.

**Known risk:** custom events may be gated to paid plans (the docs' plan-limits table should be checked at run time — the API itself is plan-agnostic). If pageviews record but named events don't: **decision point for Batu** — (a) Pro trial/upgrade for the test month (~$20, simplest), or (b) point `bindTransport` at a tiny first-party `/api/event` collector (the seam makes this a one-line swap in `main.jsx` + one serverless function). Tally counts and pageviews still accrue either way.

- [ ] **Step 8: Commit docs**

```bash
git add docs/superpowers/specs/2026-07-02-spatial-demand-test-design.md docs/DECISION_LOG.md
git commit -m "docs(track-v): instrumentation + Tally decisions; spec status to validation-ready"
```

(Fold into the pre-push checkpoint if executing linearly — docs land before the Step 4 approval so one push carries everything.)
