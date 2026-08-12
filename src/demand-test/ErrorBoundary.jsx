import React from "react";

// Last-resort net (2026-08-12 pre-seed QA): the app had no error boundary, so
// any render throw blanked #root — including over the prerendered static card
// HTML React had just replaced. A first-time user must never meet an empty
// beige page. The fallback is deliberately dependency-free (no CardPanel, no
// map): brand line, one apology sentence, a reload button, and the contact
// address — all II-C tokens via july.css class reuse.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // React 19 does NOT rethrow boundary-caught errors to window.onerror, so
    // PostHog's capture_exceptions would never see them. reportError re-enters
    // the global error pipeline the monitoring hard gate (L4) watches.
    if (typeof window !== "undefined" && typeof window.reportError === "function") {
      window.reportError(error);
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="july-shell">
        <header className="july-header">
          <div>
            <span className="july-kicker">Stoopwise</span>
            <h1>Stoopwise Greenpoint</h1>
          </div>
        </header>
        <main className="july-crash">
          <p className="july-crash-line">
            Something broke on our side — sorry. A reload usually fixes it.
          </p>
          <button
            type="button"
            className="july-crash-reload"
            onClick={() => window.location.reload()}
          >
            Reload the map
          </button>
          <p className="july-crash-contact">
            Still stuck? <a href="mailto:hello@stoopwise.com">hello@stoopwise.com</a>
          </p>
        </main>
      </div>
    );
  }
}
