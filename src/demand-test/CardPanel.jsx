import React, { useEffect, useRef } from "react";
import { FILTERS, pinKind } from "./filterCards.js";
import { EVENTS, trackEvent } from "./trackEvents.js";

// Filters that map 1:1 onto a pin color get a matching swatch in their chip —
// the color key lives in the controls people already use, not a legend box.
const CHIP_KIND = { new: "business", events: "event", clubs_signups: "club", g_train: "gtrain" };

// ONE ask, lowest friction (lean test: the tap is the interest signal, the
// form response is the commitment signal — CTA_TAP vs Tally responses is the
// conversion funnel). Business/event submissions are an optional field INSIDE
// the form ("July in Greenpoint — weekly map" on Batu's Tally), not a second button.
const SIGNUP_URL = "https://tally.so/r/44daZo";

const WINDOW_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

const DAY_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
});

const CLOCK_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/New_York",
});

// 23:59 endsAt is the card schema's end-of-day sentinel (the Today filter
// needs a real instant); readers get the date, not a fake closing time.
function fmtEnd(iso) {
  const d = new Date(iso);
  return (CLOCK_FMT.format(d) === "23:59" ? DAY_FMT : WINDOW_FMT).format(d);
}

function formatWindow(card) {
  if (!card.startsAt && !card.endsAt) return null;
  const from = card.startsAt ? WINDOW_FMT.format(new Date(card.startsAt)) : null;
  const to = card.endsAt ? fmtEnd(card.endsAt) : null;
  if (from && to) return `${from} → ${to}`;
  return from ? `From ${from}` : `Through ${to}`;
}

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

// List-row subline: prefer the street address (sans city boilerplate); fall
// back to locationName only when it adds something the title doesn't.
function cardSubline(card) {
  if (card.address) return card.address.replace(/,\s*Brooklyn.*$/i, "");
  return card.locationName !== card.title ? card.locationName : null;
}

function CardDetail({ card }) {
  const when = formatWindow(card);
  return (
    <div className="july-detail">
      {when && <p className="july-detail-when">{when}</p>}
      <p className="july-detail-summary">{card.summary}</p>
      {/* card.whyItMatters is data-only (editorial/partner context) — cut from
          the reader UI 2026-07-02: it read as the product pitching itself */}
      {(card.venues ?? []).length > 0 && (
        <p className="july-detail-venues">{card.venues.map((v) => v.name).join(" · ")}</p>
      )}
      <div className="july-actions">
        {card.actions.map((a) => (
          <ActionLink key={a.label} action={a} cardId={card.id} />
        ))}
      </div>
      {/* Publisher only — full issue titles live in data as the citation of
          record but read as noise at label size */}
      <p className="july-source">
        Source: {[...new Set(card.sourceLinks.map((s) => s.publisher || s.title))].join(" · ")}
      </p>
    </div>
  );
}

export default function CardPanel({ cards, filter, onFilter, todayOnly, onToday, selectedId, onSelect }) {
  const listRef = useRef(null);

  // Tapping a pin brings its card to the top of the feed.
  useEffect(() => {
    if (!selectedId) return;
    const el = listRef.current?.querySelector(".july-card.is-open");
    el?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [selectedId]);

  return (
    <aside className="july-panel">
      <nav className="july-filters" aria-label="Filter the map">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`july-chip${filter === f.id ? " is-active" : ""}`}
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
        {cards.map((card) => {
          const open = card.id === selectedId;
          return (
            <li key={card.id} className={`july-card${open ? " is-open" : ""}`}>
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
                </span>
                {cardSubline(card) && <span className="july-card-loc">{cardSubline(card)}</span>}
              </button>
              {open && <CardDetail card={card} />}
            </li>
          );
        })}
        {cards.length === 0 && <li className="july-empty">Nothing in this layer yet.</li>}
      </ol>
      <footer className="july-ctas">
        <a
          className="july-cta july-cta--primary"
          href={SIGNUP_URL}
          target={SIGNUP_URL.startsWith("http") ? "_blank" : undefined}
          rel={SIGNUP_URL.startsWith("http") ? "noreferrer" : undefined}
          onClick={() => trackEvent(EVENTS.CTA_TAP, { cta: "signup" })}
        >
          Get next week&rsquo;s map
        </a>
      </footer>
    </aside>
  );
}
