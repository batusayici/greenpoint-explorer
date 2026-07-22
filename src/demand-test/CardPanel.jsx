import React, { useEffect, useRef, useState } from "react";
import { FILTERS, pinKind } from "./filterCards.js";
import { actionHref } from "./cardActions.js";
import { formatWindow } from "./eventWindow.js";
import { EVENTS, trackEvent } from "./trackEvents.js";

// Filters that map 1:1 onto a pin color get a matching swatch in their chip —
// the color key lives in the controls people already use, not a legend box.
const CHIP_KIND = {
  new: "business",
  events: "event",
  live_music: "event", // show nights are events; venues keep their business pin
  clubs_signups: "club",
  deals: "deal",
  news: "news",
  g_train: "gtrain",
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

function ActionLink({ action, card, onFilter }) {
  const cls = "july-action";
  const onTap = () => trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: action.type });
  if (action.type === "share") {
    return <ShareAction action={action} card={card} cls={cls} />;
  }
  // Internal action: switches the filter bar instead of leaving the page
  // (campaign cards open their layer — "see who's open nearby" → G-Train).
  if (action.filterId) {
    const onSwitch = () => {
      trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: action.type, filter: action.filterId });
      onFilter(action.filterId);
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
function ShareAction({ action, card, cls }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  const onShare = async () => {
    const done = () => trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: action.type });
    if (navigator.share) {
      await navigator.share({ title: "Greenpoint Life", url: window.location.href }).then(done).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        done();
      }).catch(() => {});
    }
  };
  return (
    <button type="button" className={cls} onClick={onShare} aria-live="polite">
      {copied ? "Link copied ✓" : action.label}
    </button>
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

function CardDetail({ card, cardsById, onFilter, onRelated }) {
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
        {card.actions.map((a) => (
          <ActionLink key={a.label} action={a} card={card} onFilter={onFilter} />
        ))}
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

export default function CardPanel({ groups, cardsById, filter, onFilter, todayOnly, onToday, selectedId, onSelect, onRelated, showSignupPrompt, onSignupPromptDone }) {
  const listRef = useRef(null);
  const firstScrollRef = useRef(true);

  // Tapping a pin brings its card to the top of the feed. The initial
  // deep-link scroll must be instant ("auto"): smooth scrolling is animation-
  // driven and never progresses in a hidden document, so a /e/ link opened in
  // a background tab would land unscrolled. In-session taps glide — except
  // under prefers-reduced-motion.
  useEffect(() => {
    const first = firstScrollRef.current;
    firstScrollRef.current = false;
    if (!selectedId) return;
    const el = listRef.current?.querySelector(".july-card.is-open");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ block: "start", behavior: first || reduce ? "auto" : "smooth" });
  }, [selectedId]);

  return (
    <aside className="july-panel">
      <nav className="july-filters" aria-label="Filter the map">
        {FILTERS.map((f) => (
          <button
            key={f.id}
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
        ))}
        <button
          type="button"
          className={`july-chip july-chip--today${todayOnly ? " is-active" : ""}`}
          aria-pressed={todayOnly}
          onClick={() => {
            trackEvent(EVENTS.TODAY_TOGGLE, { on: !todayOnly });
            onToday(!todayOnly);
          }}
        >
          {todayOnly ? "Today" : "This week"}
        </button>
      </nav>
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
                  {open && <CardDetail card={card} cardsById={cardsById} onFilter={onFilter} onRelated={onRelated} />}
                </li>
              );
            })}
          </React.Fragment>
        ))}
        {groups.length === 0 && <li className="july-empty">Nothing in this layer yet.</li>}
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
            Something missing or wrong? Tell me &rarr;
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
      <footer className="july-ctas">
        <a
          className="july-cta july-cta--primary"
          href={SIGNUP_URL}
          target={SIGNUP_URL.startsWith("http") ? "_blank" : undefined}
          rel={SIGNUP_URL.startsWith("http") ? "noreferrer" : undefined}
          onClick={() => trackEvent(EVENTS.CTA_TAP, { cta: "signup", placement: "footer" })}
        >
          Get next week&rsquo;s map
        </a>
      </footer>
    </aside>
  );
}
