import React from "react";
import { FILTERS } from "./filterCards.js";

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
      {card.whyItMatters && <p className="july-detail-why">{card.whyItMatters}</p>}
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
      <ol className="july-list">
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
                <span className="july-card-title">{card.title}</span>
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
