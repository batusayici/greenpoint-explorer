import React, { useCallback, useEffect, useRef, useState } from "react";
import { FILTERS, pinKind, partitionFilters } from "./filterCards.js";
import { actionHref, withShareAction, sharePayload } from "./cardActions.js";
import { gcalEventUrl } from "./calendarLink.js";
import { todayPillNeeded, scrolledAwayFromPill } from "./todayPill.js";
import { formatWindow } from "./eventWindow.js";
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
// conversion funnel). Business/event submissions are an optional field INSIDE
// the form ("July in Greenpoint — weekly map" on Batu's Tally), not a second button.
const SIGNUP_URL = "https://tally.so/r/44daZo";

// Limited-launch feedback channel (2026-07-15): hosted form only — Batu's
// email stays private (2026-07-15 review note), so no mailto anywhere.
// Dedicated feedback form created 2026-07-21 ("Greenpoint Life — what's
// missing or wrong?"): two optional text boxes + optional email, so error
// reports stay anonymous-friendly and the signup form's count stays a clean
// commitment metric.
const FEEDBACK_FORM_URL = "https://tally.so/r/LZqEj1";
const FEEDBACK_HREF = FEEDBACK_FORM_URL || SIGNUP_URL;

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
// saved event's return visit is attributable. Label stays one word so card
// action rows hold to a single line.
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
      Calendar <span aria-hidden="true">↗</span>
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
  const when = card.recurring ? null : formatWindow(card);
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
    </div>
  );
}

// The Today pill is viewport-fixed on mobile, so it must yield whenever the
// feed's end chrome (signup prompt, footer CTA) is on screen — Batu's phone
// test caught it parked on top of the signup button. Desktop's pill is
// panel-absolute in the same bottom zone, so the same guard applies there.
function feedEndVisible(ownScroller) {
  const end = document.querySelector(".july-prompt") ?? document.querySelector(".july-ctas");
  if (!end) return false;
  const top = end.getBoundingClientRect().top;
  if (!ownScroller) return top < window.innerHeight;
  // Desktop: prompt/footer sit below the list inside the panel — the pill
  // (bottom: 88px) only collides with the taller signup prompt.
  return end.classList.contains("july-prompt");
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

export default function CardPanel({ groups, cardsById, deadLinkNotice, onDismissDeadLink, filter, onFilter, filterCounts, focus, onClearFocus, selectedId, onSelect, onRelated, showSignupPrompt, onSignupPromptDone }) {
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
          <p>
            <strong>{focus.name}</strong> &middot; {focus.count} on the map here
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
            {(groups.length > 1 || group.key !== "ongoing") && (
              <li className="july-day">{group.label}</li>
            )}
            {group.cards.map((card) => {
              const open = card.id === selectedId;
              return (
                <li key={card.id} className={`july-card${open ? " is-open" : ""}`}>
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
                  {open && <CardDetail card={card} cardsById={cardsById} onFilter={onFilter} onFilterAction={onFilterAction} onRelated={onRelated} />}
                </li>
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
          </li>
        )}
        {/* Feedback is a standing row at the end of every layer's feed — the
            reader who scrolled the list is exactly who knows what's missing.
            ONE affordance only (2026-07-15 review: two read as redundant). */}
        <li className="july-feedback">
          <a
            href={FEEDBACK_HREF}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent(EVENTS.FEEDBACK_TAP, { placement: "list" })}
          >
            Something missing or wrong? Tell us &rarr;
          </a>
        </li>
      </ol>
      {showSignupPrompt && (
        <div className="july-prompt" role="status">
          <p>Finding this useful? Get next week&rsquo;s edition in your inbox.</p>
          <div className="july-prompt-row">
            <a
              className="july-cta july-cta--primary"
              href={SIGNUP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackEvent(EVENTS.CTA_TAP, { cta: "signup", placement: "postvalue" });
                onSignupPromptDone();
              }}
            >
              Get next week&rsquo;s map
            </a>
            <button type="button" className="july-prompt-dismiss" onClick={onSignupPromptDone}>
              Not now
            </button>
          </div>
        </div>
      )}
      {/* The post-value prompt above is the same ask with a better hook
          ("Finding this useful?") — showing both stacked read as the app
          asking twice in a row (Batu, phone test). The footer is the
          fallback for readers who scroll past without ever tripping the
          post-value gate; it steps aside whenever the prompt is up. */}
      {!showSignupPrompt && (
        <footer className="july-ctas">
          <a
            className="july-cta july-cta--primary"
            href={SIGNUP_URL}
            target={SIGNUP_URL.startsWith("http") ? "_blank" : undefined}
            rel={SIGNUP_URL.startsWith("http") ? "noreferrer" : undefined}
            onClick={() => trackEvent(EVENTS.CTA_TAP, { cta: "signup", placement: "footer" })}
          >
            {/* Q3-A: the ask is an email signup — say so before the form does. */}
            Get next week&rsquo;s map by email
          </a>
        </footer>
      )}
    </aside>
  );
}
