import React from "react";

// Scoped boundary for a NON-ESSENTIAL surface (2026-08-13). The app-wide
// ErrorBoundary is the last resort for the feed; this one keeps a passenger
// from taking the page with it.
//
// It exists because the map could do exactly that: a browser with no WebGL
// made `new maplibregl.Map()` throw out of MapView's mount effect, React
// walked up to the only boundary — the app-wide one — and the reader lost the
// feed, the filters, the banner and the footer over a map they may not have
// wanted. Reload offered no way out, since the cause was their environment.
//
// Contain-and-notify, not contain-and-render: on failure it calls onFail and
// renders nothing, leaving the parent to own the fallback. One source of truth
// for what a down surface looks like, instead of a fallback here competing
// with the layout change there.
export default class FeatureBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Same re-entry as ErrorBoundary: React 19 doesn't rethrow boundary-caught
    // errors to window.onerror, so PostHog's capture_exceptions would never
    // see this one. A contained failure must still be a VISIBLE failure to us
    // — silent containment is how a surface stays broken for months.
    if (typeof window !== "undefined" && typeof window.reportError === "function") {
      window.reportError(error);
    }
    this.props.onFail?.(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
