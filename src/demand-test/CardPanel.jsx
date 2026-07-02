import React, { useEffect, useRef } from "react";
import { FILTERS, pinKind } from "./filterCards.js";

// Filters that map 1:1 onto a pin color get a matching swatch in their chip —
// the color key lives in the controls people already use, not a legend box.
const CHIP_KIND = { new: "business", events: "event", clubs_signups: "club", g_train: "gtrain" };

const SIGNUP_MAILTO =
  "mailto:bsayici@gmail.com?subject=Weekly%20Greenpoint%20updates&body=Sign%20me%20up%20for%20the%20weekly%20map.";
const SUBMIT_MAILTO =
  "mailto:bsayici@gmail.com?subject=Add%20to%20the%20Greenpoint%20map&body=Business%20%2F%20event%20%2F%20offer%20%2F%20update%3A%0A%0AName%3A%0AAddress%3A%0AWhat%20should%20the%20card%20say%3F%3A";

const WINDOW_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

function formatWindow(card) {
  if (!card.startsAt && !card.endsAt) return null;
  const from = card.startsAt ? WINDOW_FMT.format(new Date(card.startsAt)) : null;
  const to = card.endsAt ? WINDOW_FMT.format(new Date(card.endsAt)) : null;
  if (from && to) return `${from} → ${to}`;
  return from ? `From ${from}` : `Through ${to}`;
}

function ActionLink({ action }) {
  const cls = "july-action";
  if (action.type === "share") {
    const onShare = async () => {
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
      <a className={cls} href={action.url} target="_blank" rel="noreferrer">
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
          <ActionLink key={a.label} action={a} />
        ))}
      </div>
      <p className="july-source">Source: {card.sourceLinks.map((s) => s.title).join(" · ")}</p>
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
            onClick={() => onFilter(f.id)}
          >
            {CHIP_KIND[f.id] && <span className={`july-dot july-dot--${CHIP_KIND[f.id]}`} aria-hidden="true" />}
            {f.label}
          </button>
        ))}
        <button
          type="button"
          className={`july-chip july-chip--today${todayOnly ? " is-active" : ""}`}
          aria-pressed={todayOnly}
          onClick={() => onToday(!todayOnly)}
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
                onClick={() => onSelect(open ? null : card.id)}
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
        <a className="july-cta july-cta--primary" href={SIGNUP_MAILTO}>
          Get weekly Greenpoint updates
        </a>
        <a className="july-cta" href={SUBMIT_MAILTO}>
          Add your business or event
        </a>
      </footer>
    </aside>
  );
}
