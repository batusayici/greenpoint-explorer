import React, { useCallback, useEffect, useRef, useState } from "react";
import { FILTERS, pinKind, partitionFilters } from "./filterCards.js";
import { actionHref, withShareAction, sharePayload, correctionHref, submitHref, followHref } from "./cardActions.js";
import { followTarget, followRef } from "./postValue.js";
import { gcalEventUrl } from "./calendarLink.js";
import { todayPillNeeded, scrolledAwayFromPill } from "./todayPill.js";
import { formatWindow, isSpan } from "./eventWindow.js";
import { EVENTS, trackEvent } from "./trackEvents.js";

// Filters that map 1:1 onto a pin color get a matching swatch in their chip —
// the color key lives in the controls people already use, not a legend box.
// wellness/community/deals_memberships span mixed pin kinds (event + business
// + subscription cards), so they stay plain text like arts_culture/shopping.
const CHIP_KIND = {
  live_music: "event", // show nights are events; venues keep their business pin
  news: "news",
};

// ONE ask, lowest friction (lean test: the tap is the interest signal, the
// form response is the commitment signal — CTA_TAP vs Tally responses is the
// conversion funnel). Rebuilt as "Follow Greenpoint" 2026-07-29: one field
// (email) plus a hidden `follow` param, so the segment is captured without
// asking. The business question that used to live inside it moved to
// SUBMIT_FORM_URL below — it was 0-for-2 answered and it asked residents a
// business question.
const SIGNUP_URL = "https://tally.so/r/44daZo";

// Limited-launch feedback channel (2026-07-15): hosted form only — Batu's
// email stays private (2026-07-15 review note), so no mailto anywhere.
// Dedicated feedback form created 2026-07-21 ("Greenpoint Life — what's
// missing or wrong?"): two optional text boxes + optional email, so error
// reports stay anonymous-friendly and the signup form's count stays a clean
// commitment metric.
const FEEDBACK_FORM_URL = "https://tally.so/r/LZqEj1";
const FEEDBACK_HREF = FEEDBACK_FORM_URL || SIGNUP_URL;

// L5 (2026-07-28): business submission entry — the supply-gate sensor.
// Dedicated ultra-light form live 2026-07-29 ("Add your event"): business/org
// name · what's happening · email, all required, plus a hidden `ref` param.
const SUBMIT_FORM_URL = "https://tally.so/r/aQXzOB";

function ActionLink({ action, card, onFilter, onFilterAction }) {
  const cls = "july-action";
  const onTap = () => trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: action.type });
  if (action.type === "share") {
    return <ShareAction action={action} card={card} cls={cls} />;
  }
  // Internal action: switches the filter bar instead of leaving the page
  // (campaign cards open their layer — "see who's open nearby" → G-Train).
  // Routed through onFilterAction so the tap is always visibly answered
  // (bar flash + list to top) even when the layer is already active (Q7-A).
  if (action.filterId) {
    const onSwitch = () => {
      trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: action.type, filter: action.filterId });
      onFilterAction(action.filterId);
    };
    return (
      <button type="button" className={cls} onClick={onSwitch}>
        {action.label}
      </button>
    );
  }
  // url, or directions derived from the card's own address/coords (visit only) —
  // every action rendered here is tappable and therefore produces action_tap.
  const href = actionHref(action, card);
  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer" onClick={onTap}>
        {action.label} <span aria-hidden="true">↗</span>
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }
  return <span className={`${cls} july-action--static`}>{action.label}</span>;
}

// The clipboard fallback (every desktop browser) used to succeed in total
// silence, under a label that promised a post (UX eval, F5). The button now
// confirms in place, and action_tap only fires for shares that actually
// happened — a cancelled share sheet is not a share.
// V1-A (first-visit test): the payload is the card — title + start time as the
// text, the /e/ deep link retagged ?src=share as the URL — so the group-chat
// forward reads as the event, not as "Greenpoint Life".
function ShareAction({ action, card, cls }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  const onShare = async () => {
    const done = () => trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: action.type });
    const { title, url } = sharePayload(card, { origin: window.location.origin, search: window.location.search });
    if (navigator.share) {
      // text carries the title too — several share targets drop `title`.
      await navigator.share({ title, text: title, url }).then(done).catch(() => {});
      return;
    }
    // navigator.share AND navigator.clipboard both require a secure context
    // (caught on the http LAN test build, 2026-07-25) — the tap must never die
    // silently, so fall through to the legacy textarea copy.
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      if (!ok) {
        window.prompt("Copy this link:", url);
        done();
        return;
      }
    }
    setCopied(true);
    done();
  };
  return (
    <button type="button" className={cls} onClick={onShare} aria-live="polite">
      {copied ? "Link copied ✓" : action.label}
    </button>
  );
}

// V2-A, revised 2026-07-25 (Batu's phone test): a Google Calendar template
// link — the prefilled new-event screen, no file handling. Dated,
// non-recurring cards only; the deep link inside is tagged ?src=calendar so a
// saved event's return visit is attributable. "Add to calendar" (punch list
// P2 #14): venue cards put "See the calendar" 6px away — two adjacent buttons
// both named "calendar" until each said which one it meant.
function CalendarAction({ card, cls }) {
  const { url } = sharePayload(card, {
    origin: window.location.origin,
    search: window.location.search,
    channel: "calendar",
  });
  const href = gcalEventUrl(card, { url });
  if (!href) return null;
  return (
    <a
      className={cls}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Add to Google Calendar"
      onClick={() => trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: "calendar" })}
    >
      Add to calendar <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in new tab)</span>
    </a>
  );
}

// Deals carry their deadline in the row itself — an offer you have to open to
// discover has expired is a trust miss. Date-only (the detail line has times).
const DEAL_END_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
});

// Row-level start time (2026-07-15 review: time-sensitive cards must scan
// without a tap). The day is carried by the group header; the row carries the
// clock. A 00:00 start is the all-day sentinel — no fake time reaches a row.
const ROW_TIME_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});
const CLOCK_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/New_York",
});

function rowTime(card) {
  if (card.startsAt == null || card.recurring) return null;
  const d = new Date(card.startsAt);
  if (CLOCK_FMT.format(d) === "00:00") return null; // all-day sentinel
  return ROW_TIME_FMT.format(d).replace(":00", "");
}

// List-row subline: the authored kicker (glanceability contract — the row must
// explain itself without a tap) plus the street address (sans city boilerplate)
// or venue name when it adds something the title doesn't.
function cardSubline(card) {
  // A venue already named in the title ("Sticker Buffet at Yoseka Land") is
  // not repeated in the row.
  const named = (s) => s && card.title.toLowerCase().includes(s.toLowerCase());
  const where = card.address
    ? card.address.replace(/,\s*Brooklyn.*$/i, "")
    : !named(card.locationName)
      ? card.locationName
      : null;
  // Recurring deals (standing happy hours): endsAt is only the verified-through
  // date, so printing "ends Jul 22" would state a deadline the source doesn't.
  const ends =
    card.category === "discount" && card.endsAt && !card.recurring
      ? `ends ${DEAL_END_FMT.format(new Date(card.endsAt))}`
      : null;
  return [rowTime(card), card.kicker, named(where) ? null : where, ends].filter(Boolean).join(" · ");
}

// Timeline dates are date-only ISO strings — format in UTC so "2026-07-10"
// doesn't roll back to Jul 9 in New York.
const TIMELINE_DAY_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function CardDetail({ card, cardsById, onFilter, onFilterAction, onRelated }) {
  // Recurring deals carry their schedule in kicker/summary (sourced wording);
  // the window formatter would misread verified-through as "Through Jul 22".
  // Spans only (punch list P1 #3): a same-day card's when-line restated what
  // the day header + row clock already carry — keep it for "Through Aug 15".
  const when = card.recurring || !isSpan(card) ? null : formatWindow(card);
  const related = (card.relatedCardIds ?? [])
    .map((id) => cardsById.get(id))
    .filter(Boolean);
  // Publisher only — full issue titles live in data as the citation of record
  // but read as noise at label size. First URL per publisher makes it tappable
  // (credibility via links, and the tap is source_tap evidence).
  const sources = [];
  for (const s of card.sourceLinks) {
    const name = s.publisher || s.title;
    const seen = sources.find((x) => x.name === name);
    if (!seen) sources.push({ name, url: s.url });
    else if (!seen.url && s.url) seen.url = s.url;
  }
  return (
    <div className="july-detail">
      {when && <p className="july-detail-when">{when}</p>}
      <p className="july-detail-summary">{card.summary}</p>
      {/* card.whyItMatters is data-only (editorial/partner context) — cut from
          the reader UI 2026-07-02: it read as the product pitching itself */}
      {(card.venues ?? []).length > 0 && (
        <p className="july-detail-venues">{card.venues.map((v) => v.name).join(" · ")}</p>
      )}
      {(card.timeline ?? []).length > 0 && (
        <ol className="july-timeline">
          {card.timeline.map((t) => (
            <li key={t.date + t.title}>
              <span className="july-timeline-date">{TIMELINE_DAY_FMT.format(new Date(t.date))}</span>
              <span>
                <strong>{t.title}</strong>
                {t.summary && <> — {t.summary}</>}
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="july-actions">
        {withShareAction(card.actions).map((a) => (
          <ActionLink key={a.label} action={a} card={card} onFilter={onFilter} onFilterAction={onFilterAction} />
        ))}
        {card.startsAt != null && !card.recurring && <CalendarAction card={card} cls="july-action" />}
      </div>
      {related.length > 0 && (
        <p className="july-related">
          <span className="july-related-label">Connected</span>
          {related.map((r) => (
            <button
              key={r.id}
              type="button"
              className="july-related-chip"
              onClick={() => onRelated(card.id, r.id)}
            >
              {r.title}
            </button>
          ))}
        </p>
      )}
      <p className="july-source">
        Source:{" "}
        {sources.map((s, i) => (
          <React.Fragment key={s.name}>
            {i > 0 && " · "}
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent(EVENTS.SOURCE_TAP, { cardId: card.id, publisher: s.name })}
              >
                {s.name}
              </a>
            ) : (
              s.name
            )}
          </React.Fragment>
        ))}
      </p>
      {/* L10 (2026-07-28): the correction entry point — "verified" needs a
          route in for disputes that isn't Batu's inbox (email stays private,
          2026-07-15). Prefilled card id → targeted report; SLA in AGENTS.md
          (ack <24h, unpublish first).
          Moved out of the source line 2026-07-28: sharing that paragraph's
          `·` separator and micro-caps styling made it parse as another
          source name. It is an action, so it reads in sentence case, on its
          own line, at a tappable size. */}
      <p className="july-report-line">
        <a
          className="july-report"
          href={correctionHref(FEEDBACK_FORM_URL, card.id)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent(EVENTS.FEEDBACK_TAP, { placement: "card_correction", cardId: card.id })}
        >
          Report an error
        </a>
      </p>
    </div>
  );
}

// The resident CTA (DECISION_LOG 2026-07-28: Follow replaced the Monday
// digest). One ask, one rung — it appears once, after the post-value gate, and
// names what the reader was just doing so the object is concrete. Copy
// deliberately under-promises: sends are permanently manual (growth-engine §7),
// so "when something new lands" is a promise we can keep and "alerts" is not.
// The Follow banner (2026-07-30). Three passes to get here, and the last two
// failures were both about the CONTAINER, not the contents:
//   · v1 wrapped a full-width ink button in a bordered box → "the whole thing
//     looks like a button";
//   · v2 kept the box and fixed its insides → still read as a button, because
//     the box's fill (--paper-lift) is the open card's own background, so only
//     its 1px ink border and radius were visible — a treatment identical to
//     `.july-action`. It also sat on two left edges (x=12 box, x=27 text)
//     against the card body's x=16.
//   · v3 moved it INSIDE the card body to fix those edges — rejected by Batu:
//     the ask then becomes part of a card's content, and since any card can
//     become the anchor it gets stitched into arbitrary cards repeatedly.
// So it is no longer inside anything. It is a full-bleed band rendered as a
// PEER of the cards — its own row in the feed, directly after the card that
// earned it. That is the app's existing interjection vocabulary (.july-gbanner
// for G-train status, .july-cbanner for the civic ask): edge-to-edge,
// zero-radius, saturated bed. Full-bleed + square is unambiguously not a
// button, because every control on this surface is content-sized with a radius.
function FollowPrompt({ filter, onDone, placement }) {
  const target = followTarget({ filterId: filter });
  // Lens-only (Batu, 2026-07-30): no lens selected, no ask. The footer's
  // ungated "Follow Greenpoint" covers that reader — see the footer's note.
  if (!target) return null;
  const ref = followRef(target);
  return (
    <div className="july-fbanner">
      <div className="july-fbanner-body">
        {/* The promise precedes the action because it informs the decision, and
            it has to be one we can KEEP: sends are permanently manual
            (growth-engine §7) and a per-item email would be spam (Batu). Weekly
            and scoped to the lens is both keepable and the actual
            differentiator — the personalization is the product, not the
            cadence. Channel is deliberately unpromised; the form asks how
            they'd want it, which is how we learn whether this should be SMS or
            a notification rather than mail at all. */}
        <p className="july-fbanner-terms">One email a week, just {target.label}.</p>
        <a
          className="july-fbanner-cta"
          href={followHref(SIGNUP_URL, ref)}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackEvent(EVENTS.CTA_TAP, { cta: "follow", placement, object: ref });
            onDone();
          }}
        >
          Follow {target.label}
        </a>
      </div>
      {/* Same dismiss vocabulary as the dead-link notice: a glyph, labelled. */}
      <button
        type="button"
        className="july-fbanner-dismiss"
        onClick={onDone}
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}

// The Today pill is viewport-fixed on mobile, so it must yield whenever a
// competing call-to-action shares its zone — Batu's phone test caught it
// parked on top of the signup button. Desktop's pill is panel-absolute in the
// same bottom zone, so the same guard applies there.
//
// The two competitors are measured differently on purpose (2026-07-30). The
// footer is END chrome: it only ever rises from below, so "has its top entered
// the viewport" is the right test. The Follow banner is now a FEED ROW and can
// sit anywhere in the list, so it needs real intersection — the old top-only
// test stayed true once the element had scrolled above the fold, which would
// have hidden the pill permanently after the reader scrolled past the banner.
function feedEndVisible(ownScroller) {
  const banner = document.querySelector(".july-fbanner");
  if (banner) {
    const r = banner.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) return true;
  }
  // Desktop: the footer sits below the list inside the panel, so the pill
  // (bottom: 88px) never reaches it — only the banner above can collide.
  if (ownScroller) return false;
  const footer = document.querySelector(".july-ctas");
  return footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
}

// Layers with fewer live cards than this fold into "More" until the weekly
// ingest stocks them (UX eval F16, decision B).
const FOLD_THRESHOLD = 5;

function FilterChip({ f, filter, onFilter }) {
  return (
    <button
      type="button"
      className={`july-chip${filter === f.id ? " is-active" : ""}`}
      aria-pressed={filter === f.id}
      onClick={() => {
        trackEvent(EVENTS.FILTER_TAP, { filter: f.id });
        onFilter(f.id);
      }}
    >
      {CHIP_KIND[f.id] && <span className={`july-dot july-dot--${CHIP_KIND[f.id]}`} aria-hidden="true" />}
      {f.label}
    </button>
  );
}

export default function CardPanel({ groups, cardsById, deadLinkNotice, onDismissDeadLink, filter, onFilter, filterCounts, focus, onClearFocus, selectedId, onSelect, onRelated, showSignupPrompt, onSignupPromptDone, promptCardId }) {
  const listRef = useRef(null);
  const filtersRef = useRef(null);
  const firstScrollRef = useRef(true);
  const [moreOpen, setMoreOpen] = useState(false);
  // V3-B (first-visit test): lens changes keep your scroll position, so a
  // mid-scroll chip tap can hide today's rows above the viewport — the pill
  // offers the way back without yanking anyone who wanted to stay mid-week.
  const [showTodayPill, setShowTodayPill] = useState(false);
  const firstLensRef = useRef(true);
  const suppressPillRef = useRef(false);
  const pillOriginRef = useRef(0); // scroll position when the pill appeared
  const { shown, folded } = partitionFilters(FILTERS, filterCounts ?? {}, FOLD_THRESHOLD);
  // An active folded filter (e.g. reached through a card action) must stay
  // visible even while the fold is closed.
  const activeIsFolded = folded.some((f) => f.id === filter);
  const showFolded = moreOpen || activeIsFolded;
  // The ask anchors to the OPEN card, falling back to its trigger card (punch
  // list P2 #15): pinned only to the trigger, opening another card left the
  // CTA naming a business absent from the screen. If neither is in the feed,
  // the prompt falls back to the end of the list rather than disappearing.
  const promptAnchorId = selectedId ?? promptCardId;
  const promptVisible =
    promptAnchorId != null && groups.some((g) => g.cards.some((c) => c.id === promptAnchorId));
  // Lens-only: with no lens selected the ask renders nothing, and the footer's
  // ungated "Follow Greenpoint" has to step back IN to cover that reader.
  const hasFollowTarget = followTarget({ filterId: filter }) != null;
  const askShowing = showSignupPrompt && hasFollowTarget;

  // Location focus engaged (pin tap): bring the narrowed feed into view.
  // Desktop: the list is its own scroller — top it. Mobile page-flow: scroll
  // the page so the map peek sits at the top — map AND its cards visible
  // together (2026-07-23 live review, #6).
  useEffect(() => {
    if (!focus) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const list = listRef.current;
    if (list && list.scrollHeight > list.clientHeight + 1) {
      list.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } else {
      document.querySelector(".july-mapzone")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
  }, [focus]);

  // The active lens must stay visible (punch list P1 #5): at 375px the bar
  // holds ~2.7 of 9 chips, so a chip tapped at the bar's far end scrolled back
  // out of view and the feed showed a filtered list with no highlight anywhere.
  // Keying on `filter` covers every path — chip taps, card actions
  // (action.filterId via onFilterAction), and pin-focus resets to All.
  useEffect(() => {
    const nav = filtersRef.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth + 1) return; // desktop: bar wraps
    const active = nav.querySelector(".july-chip.is-active");
    if (!active) return;
    // Scroll the BAR only — scrollIntoView would also drag the page, and the
    // bar is sticky chrome. Center the active chip so its neighbors show.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const left = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [filter]);

  // Measure AFTER the lens change has rendered: is the feed's top (today)
  // offscreen? Desktop's list is its own scroller; mobile page flow compares
  // the list top against the anchored map+chips chrome. Location focus has
  // its own announcement row — no pill on top of it.
  useEffect(() => {
    if (firstLensRef.current) {
      firstLensRef.current = false;
      return;
    }
    if (suppressPillRef.current) {
      suppressPillRef.current = false;
      setShowTodayPill(false);
      return;
    }
    if (focus) {
      setShowTodayPill(false);
      return;
    }
    const list = listRef.current;
    if (!list) return;
    const ownScroller = list.scrollHeight > list.clientHeight + 1;
    const needed =
      !feedEndVisible(ownScroller) &&
      todayPillNeeded({
        ownScroller,
        scrollTop: list.scrollTop,
        listTop: list.getBoundingClientRect().top,
        chromeBottom: filtersRef.current?.getBoundingClientRect().bottom ?? 0,
      });
    if (needed) pillOriginRef.current = ownScroller ? list.scrollTop : window.scrollY;
    setShowTodayPill(needed);
  }, [filter, focus]);

  // The pill withdraws by itself: when the feed top scrolls back into view, or
  // once the reader scrolls meaningfully past where it appeared (their answer
  // — and a fixed pill parked at the feed end collides with the signup prompt).
  useEffect(() => {
    if (!showTodayPill) return;
    const list = listRef.current;
    const check = () => {
      if (!list) return;
      const ownScroller = list.scrollHeight > list.clientHeight + 1;
      const still = todayPillNeeded({
        ownScroller,
        scrollTop: list.scrollTop,
        listTop: list.getBoundingClientRect().top,
        chromeBottom: filtersRef.current?.getBoundingClientRect().bottom ?? 0,
      });
      const away = scrolledAwayFromPill(pillOriginRef.current, ownScroller ? list.scrollTop : window.scrollY);
      if (!still || away || feedEndVisible(ownScroller)) setShowTodayPill(false);
    };
    window.addEventListener("scroll", check, { passive: true });
    list?.addEventListener("scroll", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      list?.removeEventListener("scroll", check);
    };
  }, [showTodayPill]);

  // Instant, not smooth — same hidden-tab rule as the deep-link scroll.
  // Mobile page flow: the map+chips are sticky, so scrollIntoView on them is a
  // no-op — compute the page offset that seats the feed top under the chrome.
  const onTodayPill = useCallback(() => {
    setShowTodayPill(false);
    const list = listRef.current;
    if (!list) return;
    if (list.scrollHeight > list.clientHeight + 1) {
      list.scrollTo({ top: 0, behavior: "auto" });
    } else {
      const chromeBottom = filtersRef.current?.getBoundingClientRect().bottom ?? 0;
      const top = window.scrollY + list.getBoundingClientRect().top - chromeBottom;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    }
  }, []);

  // Filter-switch card actions must always answer visibly, even when their
  // layer is already active: flash the bar, bring the list to its top (Q7-A).
  const onFilterAction = useCallback(
    (id) => {
      suppressPillRef.current = true; // this path scrolls to top itself
      onFilter(id);
      const nav = filtersRef.current;
      if (nav) {
        nav.classList.remove("is-flash");
        void nav.offsetWidth; // restart the animation
        nav.classList.add("is-flash");
      }
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      listRef.current?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    },
    [onFilter],
  );

  // Selection scroll fires ONLY for the initial /e/ deep link. In-session
  // list taps never yank the view (2026-07-23 live review), and pin taps are
  // handled by the focus effect above. Instant ("auto") on purpose: smooth
  // scrolling never progresses in a hidden document, so a link opened in a
  // background tab would land unscrolled.
  useEffect(() => {
    const first = firstScrollRef.current;
    firstScrollRef.current = false;
    if (!first || !selectedId) return;
    const list = listRef.current;
    const el = list?.querySelector(".july-card.is-open");
    if (!list || !el) return;
    if (list.scrollHeight > list.clientHeight + 1) {
      // 28px = sticky day header; align the card just below it.
      const top = el.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop - 28;
      list.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    } else {
      // Mobile page-flow: the list isn't a scroller — scroll the page.
      el.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, [selectedId]);

  return (
    <aside className="july-panel">
      {/* Dead /e/ link greeting (Q1-A): the visitor followed a share whose
          event has passed — say so once, warmly, then get out of the way. */}
      {deadLinkNotice && (
        <div className="july-notice" role="status">
          <p>That one&rsquo;s wrapped &mdash; here&rsquo;s what&rsquo;s on this week.</p>
          <button type="button" className="july-notice-dismiss" onClick={onDismissDeadLink} aria-label="Dismiss">
            &times;
          </button>
        </div>
      )}
      <nav className="july-filters" aria-label="Filter the map" ref={filtersRef}>
        {shown.map((f) => (
          <FilterChip key={f.id} f={f} filter={filter} onFilter={onFilter} />
        ))}
        {/* Thin layers wait inside "More" until the ingest stocks them (F16-B). */}
        {folded.length > 0 && showFolded && folded.map((f) => (
          <FilterChip key={f.id} f={f} filter={filter} onFilter={onFilter} />
        ))}
        {folded.length > 0 && !showFolded && (
          <button type="button" className="july-chip july-chip--more" onClick={() => setMoreOpen(true)}>
            More +{folded.length}
          </button>
        )}
        {folded.length > 0 && moreOpen && !activeIsFolded && (
          <button type="button" className="july-chip july-chip--more" onClick={() => setMoreOpen(false)}>
            Less
          </button>
        )}
      </nav>
      {/* Location focus (pin tap): the feed is narrowed to one spot — say so,
          with the way back (the announce-the-narrowing pattern from F13). */}
      {showTodayPill && (
        <button type="button" className="july-todaypill" onClick={onTodayPill}>
          Today <span aria-hidden="true">↑</span>
        </button>
      )}
      {focus && (
        <div className="july-focus" role="status">
          {/* "{count} here", not "on the map here" — the longer line orphaned
              "map here" onto its own row at 375 AND 768 (punch list P2 #12). */}
          <p>
            <strong>{focus.name}</strong> &middot; {focus.count} here
          </p>
          <button type="button" className="july-empty-reset" onClick={onClearFocus}>
            Show everything
          </button>
        </div>
      )}
      <ol className="july-list" ref={listRef}>
        {groups.map((group) => (
          <React.Fragment key={group.key}>
            {/* Calendar scan (2026-07-15 review): a lone Ongoing group needs no
                header — headers appear once dated cards give days to scan.
                Not aria-hidden: the calendar exists for screen readers too
                (UX eval, F25). */}
            {/* h2 (crit round 2, #2): without it the outline was H1 → 77 H3s
                flat — the day header is the level that groups the cards. */}
            {(groups.length > 1 || group.key !== "ongoing") && (
              <li className="july-day">
                <h2>{group.label}</h2>
              </li>
            )}
            {group.cards.map((card) => {
              const open = card.id === selectedId;
              // The ask is a PEER of the cards, not part of one (Batu,
              // 2026-07-30): its own row in the feed, directly after the card
              // that earned it, so it never conflates with card content.
              // hasFollowTarget too, or the All lens (where the ask renders
              // nothing) would leave an empty <li> sitting in the feed.
              const askHere = askShowing && card.id === promptAnchorId;
              return (
                <React.Fragment key={card.id}>
                <li className={`july-card${open ? " is-open" : ""}`}>
                  <h3 className="july-card-heading">
                    <button
                      type="button"
                      className="july-card-head"
                      aria-expanded={open}
                      onClick={() => {
                        if (!open) trackEvent(EVENTS.CARD_OPEN, { cardId: card.id });
                        onSelect(open ? null : card.id);
                      }}
                    >
                      <span className="july-card-titlerow">
                        <span className={`july-dot july-dot--${pinKind(card)}`} aria-hidden="true" />
                        <span className="july-card-title">{card.title}</span>
                        {card.free && <span className="july-free">Free</span>}
                      </span>
                      {cardSubline(card) && <span className="july-card-loc">{cardSubline(card)}</span>}
                    </button>
                  </h3>
                  {/* reveal wrapper: eased height via the grid-track animation
                      in july.css (punch list P2 #16) */}
                  {open && (
                    <div className="july-detail-reveal">
                      <div>
                        <CardDetail
                          card={card}
                          cardsById={cardsById}
                          onFilter={onFilter}
                          onFilterAction={onFilterAction}
                          onRelated={onRelated}
                        />
                      </div>
                    </div>
                  )}
                </li>
                {askHere && (
                  <li className="july-fbanner-row">
                    <FollowPrompt filter={filter} onDone={onSignupPromptDone} placement="inline" />
                  </li>
                )}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}
        {/* Empty layer (Q2-C): plain words, one-tap recovery — no "layer" jargon. */}
        {groups.length === 0 && (
          <li className="july-empty">
            Nothing here this week.{" "}
            <button
              type="button"
              className="july-empty-reset"
              onClick={() => onFilter("all")}
            >
              Show all
            </button>
            {/* L5 echo: an empty lens is where "why isn't my thing here?"
                happens mid-feed — one quiet door, recovery stays primary. */}
            <span className="july-empty-submit">
              Run a business or org here?{" "}
              <a
                href={submitHref(SUBMIT_FORM_URL, "empty")}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent(EVENTS.SUBMIT_TAP, { placement: "empty" })}
              >
                Submit an event &rarr;
              </a>
            </span>
          </li>
        )}
        {/* One supply row, two audiences (Batu, 2026-07-28). It was two rows
            until the feed-end zone stacked three competing asks; merging them
            leaves the digest button unambiguously primary. The "or wrong?"
            half moved to the per-card "Report an error" link, which reports in
            context — so the remaining job here is the gap: something MISSING,
            whether a reader noticed it or the owner is the one telling us.
            Both links keep their own event so supply signal stays separable. */}
        <li className="july-supply">
          <span className="july-supply-q">Missing something?</span>{" "}
          <a
            href={FEEDBACK_HREF}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent(EVENTS.FEEDBACK_TAP, { placement: "list" })}
          >
            Tell us
          </a>
          {" or "}
          <a
            href={submitHref(SUBMIT_FORM_URL, "list")}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent(EVENTS.SUBMIT_TAP, { placement: "list" })}
          >
            submit an event &rarr;
          </a>
        </li>
      </ol>
      {/* Fallback only: the prompt renders beside its trigger card (above), but
          that card can leave the view — a lens change, a pin focus, the Today
          lens. Rather than lose the ask, it lands here, which is where it
          always used to be. */}
      {showSignupPrompt && !promptVisible && (
        <FollowPrompt filter={filter} onDone={onSignupPromptDone} placement="listend" />
      )}
      {/* The footer is the fallback for readers who scroll past without ever
          tripping the post-value gate; it steps aside whenever the prompt is
          up, since two stacked asks read as the app asking twice (Batu, phone
          test). No object — an ungated reader hasn't told us anything yet, so
          this is Follow at its widest (and R1's control arm: growth-engine §2
          reads unsegmented signups as the broadcast group).
          Since the ask went lens-only (2026-07-30) it also has to step back in
          when a gated reader is on the All lens: the personalized ask renders
          nothing there, and without this the surface would carry no ask at
          all — hence askShowing rather than showSignupPrompt. */}
      {!askShowing && (
        <footer className="july-ctas">
          <a
            className="july-cta july-cta--primary"
            href={followHref(SIGNUP_URL, "all")}
            target={SIGNUP_URL.startsWith("http") ? "_blank" : undefined}
            rel={SIGNUP_URL.startsWith("http") ? "noreferrer" : undefined}
            onClick={() => trackEvent(EVENTS.CTA_TAP, { cta: "follow", placement: "footer", object: "all" })}
          >
            Follow Greenpoint
          </a>
        </footer>
      )}
    </aside>
  );
}
