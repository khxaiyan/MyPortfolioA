/**
 * Central event definitions for the portfolio app.
 * Keeps event names consistent between frontend dispatches and backend workers.
 */
const EVENTS = {
  // Test / Health check
  HELLO_WORLD: "test/hello.world",

  // Portfolio data synchronization
  GITHUB_SYNC: "portfolio/github.sync",

  // Contact form submission / notification pipeline
  CONTACT_SUBMITTED: "portfolio/contact.submitted",
};

module.exports = { EVENTS };
