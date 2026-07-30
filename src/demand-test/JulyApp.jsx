import React, { useMemo, useState, useCallback, useEffect } from "react";
import seed from "../data/demand-test/cards.json";
import { matchesFilter, sortTodayFirst, isExpiredCard, isActiveOn, groupByDay, liveFilterCounts } from "./filterCards.js";
import { EVENTS, trackEvent, onEvent } from "./trackEvents.js";
import { GTRAIN_WINDOW, bannerPhase } from "./gtrainBanner.js";
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
export default function JulyApp() {
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

  // Computed per render, not memoized — the banner must flip phase on the
  // day boundaries even in a long-lived tab.
  const gtrainPhase = bannerPhase(new Date());
  const communityAlert = activeCommunityAlert(new Date(), CARDS_BY_ID);
  // L11 (2026-07-28): staleness computed per render like the banner phase —
  // the stamp is written at build time from the ingest ledger, so a site
  // whose deploys have stopped ages into "verified through <date>" honestly.
  const freshness = assessFreshness({ lastRunAt: stamp.lastRunAt, now: new Date(), cards: seed.cards });
  // One banner at a time (2026-07-26): most consequential takes the slot.
  const slot = bannerSlot(gtrainPhase, communityAlert, freshness);

  const { visible, groups } = useMemo(() => {
    const now = new Date();
    const live = seed.cards.filter((c) => !isExpiredCard(c, now));
    const shown = live.filter((c) => matchesFilter(c, filter));
    // Map keeps the flat set (full context even while focused); the list
    // scans as a calendar (day groups), narrowed to the focused location.
    // The community-alert card rides in its natural day group — the banner
    // already carries the campaign, and the duplicate pinned row cost 87px of
    // first-screen feed (punch list P2 #13).
    const feed = pinFocus ? live.filter((c) => pinFocus.ids.has(c.id)) : shown;
    return { visible: sortTodayFirst(shown, now), groups: groupByDay(feed, now) };
  }, [filter, pinFocus]);

  // Peek-pin filter (crit round 2, #7): the 203px peek rendered all 53 pins
  // at a size where the color key can't be read. In the peek, dated pins
  // narrow to today's; ongoing/recurring cards (the map's stable geography)
  // stay. Expanding the map — or any desktop viewport — shows everything.
  const mapCards = useMemo(() => {
    if (!smallViewport || mapExpanded) return visible;
    const now = new Date();
    return visible.filter(
      (c) => (c.startsAt == null && c.endsAt == null) || c.recurring || isActiveOn(c, now),
    );
  }, [visible, smallViewport, mapExpanded]);

  const onFilter = useCallback((id) => {
    setPinFocus(null); // any chip tap exits location focus
    setFilter(id);
    setSelectedId((sel) => {
      const still = seed.cards.find((c) => c.id === sel && matchesFilter(c, id));
      return still ? sel : null;
    });
  }, []);

  // Pin tap (from MapView): focus the feed on that location. The chip bar
  // resets to All so the bar never lies about what the feed shows — the
  // focus row in the panel announces the narrowing. A single-card location
  // also opens its card (a one-row feed of closed cards helps nobody).
  const onFocusLocation = useCallback((group) => {
    if (!group) {
      setPinFocus(null);
      return;
    }
    setFilter("all");
    setSelectedId(group.cards.length === 1 ? group.cards[0].id : null);
    setPinFocus({
      key: group.key,
      name: group.cards[0].locationName,
      count: group.cards.length,
      ids: new Set(group.cards.map((c) => c.id)),
    });
  }, []);

  // Reveal = land the card in the visible feed no matter the current lens:
  // exit location focus, widen the filter if it hides the target. Shared by
  // related-chip taps and the community-alert banner.
  const revealCard = useCallback(
    (cardId) => {
      const target = CARDS_BY_ID.get(cardId);
      if (!target) return;
      setPinFocus(null);
      if (!matchesFilter(target, filter)) setFilter("all");
      setSelectedId(cardId);
    },
    [filter],
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
          <span className="july-kicker">{editionLabel(new Date())}</span>
          <h1>Greenpoint Life</h1>
          {/* The verification stake only (punch list P2 #11): the chip bar
              right below already lists the categories — the old 12-word
              enumeration ran 2 lines restating it. */}
          <p>Every listing verified this week.</p>
        </div>
      </header>
      {/* ONE banner (bannerSlot precedence, 2026-07-26). G prominence still
          follows proximity (UX eval F24, decision A); the G status stays a
          plain status, not a control (2026-07-23). */}
      {slot?.kind === "gtrain" && slot.phase === "distant" && (
        <div className="july-gbanner july-gbanner--compact" role="status">
          <span className="july-gbadge">G</span>
          <span>
            <strong>G closure {GTRAIN_WINDOW.shortDates}</strong> &middot; {GTRAIN_WINDOW.shuttle}
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
            {GTRAIN_WINDOW.dates} &middot; {GTRAIN_WINDOW.stops} &middot; {GTRAIN_WINDOW.shuttle}
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
