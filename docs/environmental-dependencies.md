# Environmental dependencies

**What this is:** every capability the product assumes the visitor's browser will provide, what
happens when it isn't there, and what stops that from taking the page down.

**Why it exists (2026-08-13).** A reader on a browser with GPU rendering disabled lost the *entire*
product — MapLibre threw, the only error boundary was app-wide, and the feed, filters, banner and
footer all went with the map. The review process was not missing a rule; `design_crit` already
says *"every reachable state designed, including the ugly ones"*. The word doing the damage was
**reachable**: a design crit is performed by looking at the running product, so it can only judge
states the reviewer's environment can produce. Nobody's browser could produce "no WebGL", so that
state was never rendered, never seen, never critiqued. Meanwhile the automated suite is pure logic
by design and never renders anything at all.

The gap was the intersection — **states that require rendering AND cannot occur in a normal
browser** — and nothing in the portfolio could see into it. Adding reviewers would not have helped;
every prior reviewer ran a normal browser with a GPU. One test from a genuinely different
environment found it in a single pass.

This file is the fix: it converts an *unreachable-state* problem into an ordinary checklist. States
you cannot reach by looking must be **enumerated deliberately**.

## The rule

> Every browser capability the product depends on gets a row here, and every row names what the
> reader sees when it is missing. A dependency with no containment and no test is a blank page
> waiting for the right visitor.

Two corollaries, both learned the hard way:

1. **Guard the access, not just the use.** `window.localStorage` throws on the *property read*, not
   on `getItem`. `returnVisit.js` and `firstVisitOrientation.js` both had try/catch around their
   use of storage — one layer too deep to help, which is exactly why it survived review.
2. **Containment has phases.** An error boundary only covers React's render. Anything that runs
   *before* the render is past its reach; anything *asynchronous* is outside it too. Ask which phase
   a dependency fails in before deciding what protects it.

## The inventory

| Capability | Used by | If missing | Containment | Proof |
|---|---|---|---|---|
| **WebGL** | MapLibre (`MapView.jsx`) | Map cannot render at all | try/catch on construction → `onUnavailable`; `FeatureBoundary` for later throws; `map.on("error")` for async death. Map zone leaves the layout, feed goes full width, one line says so | `mapContainment.test.jsx` (8 tests, both failure shapes) + **`npm run verify:agent-browser`** (real browser, real bundle, WebGL stubbed off) |
| **localStorage / sessionStorage** | `returnVisit.js` (R0 retention), `firstVisitOrientation.js` | Property read throws (`SecurityError`) when site data is blocked → module dies before `createRoot` → **blank page**, no boundary can help | `safeStorage()` guards the read; consumers fail closed on `null`; `bootSafely()` isolates the step | `boot.test.mjs` + **`npm run verify:agent-browser`** (storage getter throws) |
| **localStorage *persistence* past 7 days** (Safari ITP) | `returnVisit.js` (R0 retention — the demand gate's own instrument) | Storage is present and writable, so nothing throws and no test fails — but Safari **deletes all script-written storage after ~7 days of browser use without a first-party visit**. A weekly-cadence product sits exactly on that edge: a reader returning on day 8 arrives with `gl_first_seen` gone and re-registers as a **brand-new visitor with `weekIndex` 0, forever**. Silent, one-directional, and it under-counts precisely the behaviour the gate measures, on the audience's dominant browser | **Open (D5, 2026-08-17).** Planned: mirror first-seen into a **server-set** cookie via Vercel routing middleware — server-set cookies are not subject to the script-storage cap. Home-screen install (also D5) exempts a user entirely | **None yet — needs a real iPhone**, which is the point of the row. No stub can reproduce a 7-day eviction, so this is the first dependency here whose proof must be a device, not a test |
| **Any boot side-effect** (analytics `inject()`, PostHog init, `URLSearchParams`) | `main.jsx` | Throw at module scope → render never runs → blank page | `bootSafely()` per step, so one dead vendor cannot cost another step | `boot.test.mjs` ("one failing boot step does not skip the steps after it") |
| **`matchMedia`** | `JulyApp.jsx` (mobile breakpoint), `CardPanel.jsx` (reduced motion) | Layout flag defaults to desktop; motion guard defaults to animated | Already safe — every call site uses `window.matchMedia?.(…)`, and optional chaining short-circuits the whole chain | Covered indirectly by the jsdom suite (stubbed in `testSetup.dom.js`) |
| **`navigator.share`** | `CardPanel.jsx` share action | Falls back to clipboard | Explicit `if (navigator.share)` branch | — |
| **`navigator.clipboard`** | share fallback | Requires a secure context; fails on plain-http LAN builds (hit 2026-07-25) | try/catch → legacy `textarea` + `execCommand` → `window.prompt` as last resort | — |
| **`MutationObserver`** | `MapView.jsx` attribution collapse | Attribution could re-open over the map's bottom edge | Runs only after a successful map load; cosmetic if absent | — |
| **`Intl.DateTimeFormat`** | 26 call sites — every date, time and day grouping | Dates would throw or format wrongly | None. Baseline in every browser that runs React 19; timezone correctness is covered by the TZ-pinned suite | `npm test` (TZ-pinned to `America/New_York`) |
| **JavaScript at all** | the whole SPA | Home page shows no prose — `dist/index.html` ships a **51-byte body**; its AEO injection is JSON-LD only (now carrying full `Event` items, so it can at least be *parsed* for answers). Only `/e/<slug>` pages carry prerendered visible text | None for the home page's prose; structured data covers the machine case | `npm run verify:aeo` |

## Known gaps

- **The home page has no no-JS fallback.** Card pages prerender real text; the home page prerenders
  only JSON-LD. An agent or crawler that does not execute JS gets structured data and no prose.
  Whether that matters is an open question tied to the answer-engine goal, not a bug.
- **`Intl` and `MutationObserver` have no containment.** Judged baseline, deliberately — noted here
  so the judgement is visible rather than implied.
- **No real-device matrix.** Everything is verified via stubs, jsdom, or one browser pane. Older
  Safari, Firefox and real mobile hardware are unsampled. **Two open items now depend on this
  gap directly** (both D5, 2026-08-17): the Safari 7-day eviction row above, and the **Facebook
  in-app webview** — ~100% of the Q2 parents post's arrivals will come through it, and it is the
  same hostile-context class as the 2026-08-13 WebGL bug. Both need a phone, not a test.

- **A capability can be *present* and still fail you.** Every other row here asks "what if this is
  missing?" The ITP row is the first that asks "what if this works, but not for as long as we
  assumed?" — storage that exists, accepts writes, reads back correctly, and is deleted on a
  timer we don't control. Nothing in the suite could have caught it, because nothing was broken.
  Worth carrying forward when adding rows: **duration and quota are dependencies too, not just
  existence.**

## When adding a dependency

Add the row *with* the change, the way a new source domain goes into `.claude/settings.json` in the
same commit. Answer three questions: which phase does it fail in (boot / render / async), what does
the reader see, and what proves it. If the answer to the third is "nothing", say so in **Known
gaps** rather than leaving the row looking finished.
