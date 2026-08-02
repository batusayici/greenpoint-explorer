// G-train banner state. Two shipped lessons live here:
//  - 2026-07-21: a hard-coded "through Fri Jul 17" banner sat stale on the
//    live page. The banner derives its state from sourced windows and hides
//    itself when they close. Update ONLY from an MTA source (mta.info/alerts
//    or the G-line 2026 article); truth rules — no extrapolated windows.
//  - 2026-08-02: a single-window model went dark after its window even though
//    two more Greenpoint closures followed. Windows are now a LIST and the
//    banner tracks the next one.
//
// Banner charter (DECISION_LOG 2026-08-02): the slot shows the one message
// that changes how you use the neighborhood in a horizon you can act on.
// Nothing surfaces more than 7 days ahead; prominence ramps with proximity
// (chip inside the week, full banner inside 48h, alert while live); a window
// drops dead at endsAt and the banner rolls to the next window, re-gated by
// the same horizon. The slot never dumps the schedule — the g-train-closures
// card holds that.
//
// Sourced 2026-08-02 from mta.info/article/service-changes-g-line-2026
// (page updated Jul 23). Greenpoint-closing windows only: the Jul 31–Aug 3
// and Aug 14–17 weekends close Hoyt-Schermerhorn–Church Av and leave
// Greenpoint Av / Nassau Av open, so they are NOT windows here.
export const GTRAIN_WINDOWS = Object.freeze([
  Object.freeze({
    startsAt: "2026-08-07T21:45:00-04:00",
    endsAt: "2026-08-10T05:00:00-04:00",
    dates: "Fri Aug 7, 9:45 PM – Mon Aug 10, 5 AM",
    shortDates: "Aug 7–10",
    stops: "Greenpoint Av + Nassau Av",
    shuttle: "free T403 shuttle",
  }),
  Object.freeze({
    startsAt: "2026-08-17T21:45:00-04:00",
    endsAt: "2026-08-21T05:00:00-04:00",
    dates: "Mon Aug 17 – Fri Aug 21, nightly 9:45 PM – 5 AM",
    shortDates: "Aug 17–21 nights",
    stops: "Greenpoint Av + Nassau Av",
    shuttle: "free T403 shuttle",
  }),
  Object.freeze({
    startsAt: "2026-08-21T21:45:00-04:00",
    endsAt: "2026-08-24T05:00:00-04:00",
    dates: "Fri Aug 21, 9:45 PM – Mon Aug 24, 5 AM",
    shortDates: "Aug 21–24",
    stops: "Greenpoint Av + Nassau Av",
    shuttle: "free T403 shuttle",
  }),
]);

// The banner tracks exactly one window: the next one still in the future.
// Back-to-back windows (Aug 17–21 nights → Aug 21–24 weekend) roll over the
// moment the earlier one ends.
export function nextGtrainWindow(now, windows = GTRAIN_WINDOWS) {
  const t = now.getTime();
  return windows.find((w) => t < Date.parse(w.endsAt)) ?? null;
}

// Prominence follows proximity (UX eval F24 decision A, ramp re-cut by the
// 2026-08-02 charter): null beyond 7 days ("no need to show G disruptions
// two weeks ahead" — Batu), "distant" inside the week (compact chip), "near"
// inside 48h (full banner — when weekend plans get made), "active" while
// live, null again once it has passed.
const HORIZON_MS = 7 * 86400000;
const NEAR_MS = 2 * 86400000;

export function bannerPhase(now, window = nextGtrainWindow(now)) {
  if (!window) return null;
  const t = now.getTime();
  if (t >= Date.parse(window.endsAt)) return null;
  if (t >= Date.parse(window.startsAt)) return "active";
  const untilStart = Date.parse(window.startsAt) - t;
  if (untilStart > HORIZON_MS) return null;
  return untilStart > NEAR_MS ? "distant" : "near";
}
