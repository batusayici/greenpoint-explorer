// jsdom gaps the app touches. Each stub here is an API jsdom genuinely lacks,
// NOT a behaviour under test — if a stub ever has to grow logic, the thing it
// is standing in for probably belongs in a browser test instead.

// React 19 requires this flag before act() will flush effects.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom implements neither scrollTo (window or element) nor scrollIntoView.
// CardPanel calls all three while keeping the feed's scroll position sane.
window.scrollTo = () => {};
Element.prototype.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

// jsdom's matchMedia is missing entirely in some versions and partial in
// others; the app reads .matches plus add/removeEventListener for the mobile
// breakpoint and the reduced-motion guard. Report desktop, motion allowed.
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
});
