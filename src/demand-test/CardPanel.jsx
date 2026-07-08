import React, { useEffect, useRef } from "react";
import { FILTERS, pinKind } from "./filterCards.js";
import { actionHref } from "./cardActions.js";
import { formatWindow } from "./eventWindow.js";
import { EVENTS, trackEvent } from "./trackEvents.js";

// Filters that map 1:1 onto a pin color get a matching swatch in their chip —
// the color key lives in the controls people already use, not a legend box.
const CHIP_KIND = { new: "business", events: "event", clubs_signups: "club", g_train: "gtrain" };

// ONE ask, lowest friction (lean test: the tap is the interest signal, the
// form response is the commitment signal — CTA_TAP vs Tally responses is the
// conversion funnel). Business/event submissions are an optional field INSIDE
// the form ("July in Greenpoint — weekly map" on Batu's Tally), not a second button.
const SIGNUP_URL = "https://tally.so/r/44daZo";

function ActionLink({ action, card, onFilter }) {
  const cls = "july-action";
  const onTap = () => trackEvent(EVENTS.ACTION_TAP, { cardId: card.id, actionType: action.type });
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

// Timeline dates are date-only ISO strings — format in UTC so "2026-07-10"
// doesn't roll back to Jul 9 in New York.
const TIMELINE_DAY_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function CardDetail({ card, cardsById, onFilter, onRelated }) {
  const when = formatWindow(card);
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

export default function CardPanel({ cards, cardsById, filter, onFilter, todayOnly, onToday, selectedId, onSelect, onRelated }) {
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
              {open && <CardDetail card={card} cardsById={cardsById} onFilter={onFilter} onRelated={onRelated} />}
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
