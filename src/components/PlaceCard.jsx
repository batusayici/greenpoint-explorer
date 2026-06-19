// src/components/PlaceCard.jsx
// Presentational II-C "place card" — paper caption panel (ART_DIRECTION §9).
// Trimmed IA: SELECTED PLACE -> name -> category -> tags -> address ->
// description -> verification/disclaimer footer -> close. No Save/Share, no
// hours (v0). Display-only; all data comes from props.
const PAPER = "#eae1ce";
const INK = "#2a241c";

export default function PlaceCard({ place, story, disclaimer, onClose }) {
  if (!place) return null;
  const unverified = place.verificationStatus && place.verificationStatus !== "verified";
  const closed = place.status === "closed";
  const unknown = place.status === "unknown";

  return (
    <div
      style={{
        width: 300,
        background: PAPER,
        color: INK,
        border: `1.5px solid ${INK}`,
        boxShadow: "0 6px 22px rgba(28,22,14,0.32)",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "14px 16px 12px",
        position: "relative",
        borderRadius: 2,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute", top: 8, right: 8, width: 22, height: 22,
          background: "transparent", border: `1px solid ${INK}`, color: INK,
          cursor: "pointer", lineHeight: "18px", fontSize: 13, borderRadius: 2,
        }}
      >×</button>

      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>
        Selected place
      </div>
      <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.1, marginTop: 4 }}>
        {place.name}
      </div>
      <div style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", opacity: 0.75, marginTop: 2 }}>
        {place.category}
      </div>

      {Array.isArray(place.tags) && place.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {place.tags.map((t) => (
            <span key={t} style={{ fontSize: 11, border: `1px solid ${INK}`, padding: "2px 7px", borderRadius: 2, opacity: 0.85 }}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div style={{ fontSize: 12.5, marginTop: 10, display: "flex", gap: 6 }}>
        <span aria-hidden>📍</span><span>{place.address}</span>
      </div>

      {place.description && (
        <div style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.45, opacity: 0.9 }}>
          {place.description}
        </div>
      )}

      {(unverified || closed || unknown) && (
        <div style={{ fontSize: 10.5, marginTop: 10, padding: "4px 7px", border: `1px dashed ${INK}`, opacity: 0.85, borderRadius: 2 }}>
          {closed ? "Reported closed — unconfirmed." : unknown ? "Current status unconfirmed." : "Details under review — unverified."}
        </div>
      )}

      {story && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid rgba(42,36,28,0.25)` }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}>
            Story · {String(story.storyType || "").replace(/_/g, " ")}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.15, marginTop: 4 }}>
            {story.title}
          </div>
          {story.summary && (
            <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.45, opacity: 0.9 }}>
              {story.summary}
            </div>
          )}
          {story.body && (
            <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.45, opacity: 0.9 }}>
              {story.body}
            </div>
          )}
          {Array.isArray(story.imageUrls) && story.imageUrls[0] && (
            <img
              src={story.imageUrls[0]}
              alt={story.title}
              style={{ width: "100%", marginTop: 8, border: `1px solid ${INK}`, borderRadius: 2, display: "block" }}
            />
          )}
          {story.audioUrl && (
            <audio controls src={story.audioUrl} style={{ width: "100%", marginTop: 8 }} />
          )}
          {story.verificationStatus && story.verificationStatus !== "verified" && (
            <div style={{ fontSize: 10.5, marginTop: 8, padding: "4px 7px", border: `1px dashed ${INK}`, opacity: 0.85, borderRadius: 2 }}>
              Local lore — unverified.
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: 10, marginTop: 10, paddingTop: 8, borderTop: `1px solid rgba(42,36,28,0.25)`, opacity: 0.7, lineHeight: 1.4 }}>
        {disclaimer}
        {place.lastVerified && <> · Reviewed {place.lastVerified}</>}
      </div>
    </div>
  );
}
