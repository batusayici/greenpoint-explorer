// G-train banner state (2026-07-21). The previous banner hard-coded its dates
// in JSX and went stale on the live page ("through Fri Jul 17" showing Jul 21).
// Now the banner derives its phase from the sourced window and hides itself
// when the window closes. Update ONLY from an MTA source (mta.info/alerts);
// truth rules — no extrapolated windows.
//
// Sourced 2026-07-21 from mta.info/alerts: next Greenpoint-affecting closure
// is Fri Aug 7 9:45 PM → Mon Aug 10 5 AM (Court Sq–Bedford-Nostrand, free
// T403 shuttle). The Jul 31–Aug 3 and Aug 14–17 G work stays south of
// Bedford-Nostrand and does not close Greenpoint Av / Nassau Av.
export const GTRAIN_WINDOW = Object.freeze({
  startsAt: "2026-08-07T21:45:00-04:00",
  endsAt: "2026-08-10T05:00:00-04:00",
  dates: "Fri Aug 7, 9:45 PM – Mon Aug 10, 5 AM",
  shortDates: "Aug 7–10",
  stops: "Greenpoint Av + Nassau Av",
  shuttle: "free T403 shuttle",
});

// Prominence follows proximity (UX eval F24, decision A): "distant" more than
// 7 days before the window (compact chip), "near" inside the final week (full
// banner), "active" inside it (alert), null once it has passed.
const NEAR_MS = 7 * 86400000;

export function bannerPhase(now, window = GTRAIN_WINDOW) {
  const t = now.getTime();
  if (t >= Date.parse(window.endsAt)) return null;
  if (t >= Date.parse(window.startsAt)) return "active";
  return Date.parse(window.startsAt) - t > NEAR_MS ? "distant" : "near";
}
