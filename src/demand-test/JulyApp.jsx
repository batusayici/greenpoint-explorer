import React, { useMemo, useState, useCallback, useEffect } from "react";
import seed from "../data/demand-test/cards.json";
import { matchesFilter, sortTodayFirst, isExpiredCard, isActiveOn, groupByDay, liveFilterCounts, feedSignature } from "./filterCards.js";
import { EVENTS, trackEvent, onEvent } from "./trackEvents.js";
import { nextGtrainWindow, bannerPhase } from "./gtrainBanner.js";
import { activeCommunityAlert } from "./communityAlert.js";
import { bannerSlot } from "./bannerSlot.js";
import { assessFreshness } from "./freshness.js";
import stamp from "../data/demand-test/freshness-stamp.json";
import { resolveDeepLink, deepLinkUrl } from "./deepLink.js";
import { editionLabel } from "./eventWindow.js";
import MapView from "./MapView.jsx";
import CardPanel from "./CardPanel.jsx";

const CARDS_BY_ID = new Map(seed.cards.map((c) => [c.id, c]));

// "verified through Jul 27" — day precision; the exact hour is ops detail.
function formatVerifiedThrough(iso) {
  if (!iso) return "recently";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "recently" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Deep link (/e/<slug>): open that card on load if it's live. A dead link
// (expired or unknown) falls back to the plain feed WITH a notice — the
// person who clicked a friend's link must not wonder what happened (Q1-A).
function initialDeepLink() {
  return resolveDeepLink(window.location.pathname, CARDS_BY_ID, new Date());
}

// Track V — "July in Greenpoint + G-Train Support". Standalone 2D demand-test
// page; must never import the 3D runtime.
export default function JulyApp({ showOrientation = false } = {}) {
  const [filter, setFilter] = useState("all");
  const [{ id: initialId, dead: deadLink }] = useState(initialDeepLink);
  const [selectedId, setSelectedId] = useState(initialId);
  const [showDeadLinkNotice, setShowDeadLinkNotice] = useState(deadLink);
  // Lens ids the reader has waved off this visit. In memory on purpose — see
  // onDismissFollow: a reload is the undo.
  const [dismissedLenses, setDismissedLenses] = useState(() => new Set());
  // Mobile map peek (UX eval F3, decision B): the list owns the first screen;
  // the map starts compact and grows on request. Desktop ignores this.
  const [mapExpanded, setMapExpanded] = useState(false);
  // Location focus (2026-07-23): tapping a multi-card pin filters the FEED to
  // that location — the fan-out it replaces cluttered the dense mobile map.
  // { key, name, count, ids:Set }
  const [pinFocus, setPinFocus] = useState(null);
  // Bumped by revealCard so the panel scrolls the revealed card into view.
  // A counter, not a boolean: revealing the SAME card twice must still scroll.
  const [revealTick, setRevealTick] = useState(0);

  // Chip-fold input (F16-B): live counts per layer, fixed at mount — they only
  // drift at expiry boundaries, and the bar must not reshuffle mid-session.
  const [filterCounts] = useState(() => liveFilterCounts(seed.cards, new Date()));

  // Mobile layout flag for the peek-pin filter below (crit round 2, #7).
  const [smallViewport, setSmallViewport] = useState(
    () => window.matchMedia?.("(max-width: 760px)").matches ?? false,
  );
  useEffect(() => {
    const mq = window.matchMedia?.("(max-width: 760px)");
    if (!mq) return;
    const onChange = (e) => setSmallViewport(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keep the address bar on the card's shareable path (?src= rides along).
  // replaceState, not pushState: back should leave the page, not unwind taps.
  useEffect(() => {
    window.history.replaceState(null, "", deepLinkUrl(selectedId, window.location.search));
  }, [selectedId]);

  // The Follow row is dismissed PER LENS, and only for this visit (Batu,
  // 2026-07-30). Two complaints drove both halves: one dismiss used to spend a
  // single global key, so declining on News silently killed the ask on every
  // other category — "dismissed from other categories as well which i didn't
  // have a way to undo". Per-lens fixes the collateral damage; keeping the set
  // in memory rather than storage makes a reload the undo, so no single tap
  // can cost a category permanently.
  const onDismissFollow = useCallback((lensId) => {
    setDismissedLenses((prev) => {
      if (prev.has(lensId)) return prev;
      const next = new Set(prev);
      next.add(lensId);
      return next;
    });
  }, []);

  // Escape closes the open card (UX eval, F27).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── The page clock (2026-08-08) ─────────────────────────────────────────
  // One instant, shared by every dated surface below. It used to be a scatter
  // of `new Date()` calls in the render body, which is only ever as fresh as
  // the last render — and nothing re-renders a page nobody is touching. So a
  // tab left open since morning kept serving the morning's feed, and the
  // banner comment that used to sit here ("must flip phase on the day
  // boundaries even in a long-lived tab") was a claim the code couldn't keep.
  //
  // Every 30 minutes (Batu, 2026-08-08), plus a refresh whenever the tab comes
  // back to the foreground: background timers are throttled and unreliable, so
  // the refocus is what actually covers the phone that reopens the next
  // morning — the interval is the floor for a tab you're watching.
  //
  // The clock only ADVANCES when the page would change. MapView rebuilds every
  // marker when the cards array identity changes and re-flies to the selected
  // card, so a blind tick would flash the map and yank a panned view back on
  // the half hour to say nothing new. Signature equal → keep the old Date, no
  // re-render.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const pageSignature = (d) =>
      `${feedSignature(seed.cards, d)}#${bannerPhase(d, nextGtrainWindow(d))}#${editionLabel(d)}`;
    const tick = () =>
      setNow((prev) => {
        const next = new Date();
        return pageSignature(prev) === pageSignature(next) ? prev : next;
      });
    const timer = setInterval(tick, 30 * 60000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Multi-window since 2026-08-02: the slot tracks the next sourced closure,
  // never the whole schedule.
  const gtrainWindow = nextGtrainWindow(now);
  const gtrainPhase = bannerPhase(now, gtrainWindow);
  const communityAlert = activeCommunityAlert(now, CARDS_BY_ID);
  // L11 (2026-07-28): staleness computed per render like the banner phase —
  // the stamp is written at build time from the ingest ledger, so a site
  // whose deploys have stopped ages into "verified through <date>" honestly.
  const freshness = assessFreshness({ lastRunAt: stamp.lastRunAt, now, cards: seed.cards });
  // One banner at a time (2026-07-26): most consequential takes the slot.
  const slot = bannerSlot(gtrainPhase, communityAlert, freshness);

  const { visible, groups } = useMemo(() => {
    const live = seed.cards.filter((c) => !isExpiredCard(c, now));
    const shown = live.filter((c) => matchesFilter(c, filter));
    // Map keeps the flat set (full context even while focused); the list
    // scans as a calendar (day groups), narrowed to the focused location.
    // The community-alert card rides in its natural day group — the banner
    // already carries the campaign, and the duplicate pinned row cost 87px of
    // first-screen feed (punch list P2 #13).
    const feed = pinFocus ? live.filter((c) => pinFocus.ids.has(c.id)) : shown;
    return { visible: sortTodayFirst(shown, now), groups: groupByDay(feed, now) };
  }, [filter, pinFocus, now]);

  // Peek-pin filter (crit round 2, #7): the 203px peek rendered all 53 pins
  // at a size where the color key can't be read. In the peek, dated pins
  // narrow to today's; ongoing/recurring cards (the map's stable geography)
  // stay. Expanding the map — or any desktop viewport — shows everything.
  const mapCards = useMemo(() => {
    if (!smallViewport || mapExpanded) return visible;
    return visible.filter(
      (c) => (c.startsAt == null && c.endsAt == null) || c.recurring || isActiveOn(c, now),
    );
  }, [visible, smallViewport, mapExpanded, now]);

  const onFilter = useCallback((id) => {
    setPinFocus(null); // any chip tap exits location focus
    setFilter(id);
    setSelectedId((sel) => {
      const still = seed.cards.find((c) => c.id === sel && matchesFilter(c, id));
      return still ? sel : null;
    });
  }, []);

  // Reveal = land the card in the visible feed no matter the current lens:
  // exit location focus, widen the filter if it hides the target, and SCROLL
  // to it. Shared by related-chip taps, the community-alert banner, and
  // single-card pin taps.
  // The scroll is the fix for 2026-07-30: opening the card is not revealing it
  // — the alert's card sits ~2400px down the mobile page, so the banner tap
  // read as a dead link on an iPhone. Reveal is a deliberate destination, so
  // it moves the view; ordinary list taps still never yank it (CardPanel).
  const revealCard = useCallback(
    (cardId) => {
      const target = CARDS_BY_ID.get(cardId);
      if (!target) return;
      setPinFocus(null);
      if (!matchesFilter(target, filter)) setFilter("all");
      setSelectedId(cardId);
      setRevealTick((n) => n + 1);
    },
    [filter],
  );

  // Pin tap (from MapView): a MULTI-card location focuses the feed on it —
  // the chip bar resets to All so the bar never lies about what the feed
  // shows, and the focus row announces the narrowing. A single-card location
  // is just its card (Batu's phone review 2026-08-08, #2: "1 here · Show
  // everything" on a one-card pin was chrome with nothing to announce), so it
  // routes through revealCard: open + scroll into view, no focus row, and the
  // lens is only widened if it actually hides the card.
  const onFocusLocation = useCallback(
    (group) => {
      if (!group) {
        setPinFocus(null);
        return;
      }
      if (group.cards.length === 1) {
        revealCard(group.cards[0].id);
        return;
      }
      setFilter("all");
      setSelectedId(null);
      setPinFocus({
        key: group.key,
        name: group.cards[0].locationName,
        count: group.cards.length,
        ids: new Set(group.cards.map((c) => c.id)),
      });
    },
    [revealCard],
  );

  // Place-graph traversal: tapping a related chip must always land somewhere
  // visible, so widen the lens if the target card is filtered out right now.
  const onRelated = useCallback(
    (fromCardId, toCardId) => {
      if (!CARDS_BY_ID.has(toCardId)) return;
      trackEvent(EVENTS.RELATED_TAP, { fromCardId, toCardId });
      revealCard(toCardId);
    },
    [revealCard],
  );

  const onAlertTap = useCallback(() => {
    trackEvent(EVENTS.ALERT_TAP, { cardId: communityAlert.cardId });
    revealCard(communityAlert.cardId);
  }, [communityAlert?.cardId, revealCard]);

  return (
    <div className="july-shell">
      <header className="july-header">
        <div className="july-header-text">
          {/* One brand only (Q4-B): the kicker slot carries the edition week —
              a freshness signal, computed per render like the banner phase. */}
          <span className="july-kicker">{editionLabel(now)}</span>
          <h1>Stoopwise Greenpoint</h1>
          {/* Two claims, six words (2026-08-02): the truth stake ("real"
              carries verified) then the participation beat. No enumeration —
              the chip bar right below lists the categories. */}
          <p>Know what’s real. Take part.</p>
          {/* First-visit orientation (2026-08-08 external-audit item 4): the
              tagline states values, not what the product IS. One line,
              first visit only — shouldShowOrientation flips the flag at
              boot in main.jsx, so this never reappears on a return visit. */}
          {showOrientation && (
            <p className="july-orientation">
              Events, openings, deals and neighborhood news — verified and sourced.
            </p>
          )}
        </div>
      </header>
      {/* ONE banner (bannerSlot precedence, 2026-07-26). G prominence still
          follows proximity (UX eval F24, decision A); the G status stays a
          plain status, not a control (2026-07-23). */}
      {slot?.kind === "gtrain" && slot.phase === "distant" && (
        <div className="july-gbanner july-gbanner--compact" role="status">
          <span className="july-gbadge">G</span>
          <span>
            <strong>G closure {gtrainWindow.shortDates}</strong> &middot; {gtrainWindow.shuttle}
          </span>
        </div>
      )}
      {/* L11 (2026-07-28): honest degradation — a stale feed says so instead
          of quietly presenting old data as current. Plain status like the G
          banner, no destination (the fix is ours, not the reader's). */}
      {slot?.kind === "freshness" && (
        <div className="july-gbanner july-gbanner--compact" role="status">
          <span>
            <strong>Listings verified through {formatVerifiedThrough(slot.verifiedThrough)}</strong> &middot; refresh
            delayed — updating soon
          </span>
        </div>
      )}
      {slot?.kind === "gtrain" && (slot.phase === "near" || slot.phase === "active") && (
        <div className="july-gbanner" role="status">
          <span className="july-gbadge">G</span>
          <span>
            <strong>{slot.phase === "active" ? "No G trains" : "Next G closure"}</strong>{" "}
            {gtrainWindow.dates} &middot; {gtrainWindow.stops} &middot; {gtrainWindow.shuttle}
          </span>
        </div>
      )}
      {/* Community alert (DECISION_LOG 2026-07-26): the slot's rare
          "neighborhood needs you" tier — sourced, time-bound, one at a time,
          and a control, not a status: it deep-opens the sourced card. */}
      {slot?.kind === "community" && (
        <button type="button" className="july-cbanner" onClick={onAlertTap}>
          <span className="july-gbadge july-cbadge">&hearts;</span>
          <span className="july-cbanner-text">
            <strong>{slot.alert.headline}</strong>
            <span className="july-cbanner-detail"> &middot; {slot.alert.detail}</span>
          </span>
          <span className="july-cbanner-cta">{slot.alert.cta} &rarr;</span>
        </button>
      )}
      <main className="july-main">
        <CardPanel
          groups={groups}
          cardsById={CARDS_BY_ID}
          deadLinkNotice={showDeadLinkNotice}
          onDismissDeadLink={() => setShowDeadLinkNotice(false)}
          filter={filter}
          onFilter={onFilter}
          filterCounts={filterCounts}
          focus={pinFocus}
          onClearFocus={() => setPinFocus(null)}
          selectedId={selectedId}
          revealTick={revealTick}
          onSelect={setSelectedId}
          onRelated={onRelated}
          dismissedLenses={dismissedLenses}
          onDismissFollow={onDismissFollow}
        />
        <div className={`july-mapzone${mapExpanded ? " is-expanded" : ""}`}>
          <MapView
            cards={mapCards}
            selectedId={selectedId}
            focusKey={pinFocus?.key ?? null}
            onSelect={setSelectedId}
            onFocusLocation={onFocusLocation}
          />
          <button
            type="button"
            className="july-mapexpand"
            aria-pressed={mapExpanded}
            aria-label={mapExpanded ? "Shrink map" : "Expand map"}
            onClick={() => setMapExpanded((x) => !x)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {mapExpanded ? (
                <path d="M6.5 2.5v4h-4M9.5 2.5v4h4M6.5 13.5v-4h-4M9.5 13.5v-4h4" />
              ) : (
                <path d="M2.5 6.5v-4h4M13.5 6.5v-4h-4M2.5 9.5v4h4M13.5 9.5v4h-4" />
              )}
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
