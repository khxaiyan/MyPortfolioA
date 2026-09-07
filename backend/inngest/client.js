const { Inngest } = require("inngest");

/**
 * Inngest client initialization.
 * - `id`: Unique identifier for your portfolio app inside the Inngest dashboard.
 * - Environment variables INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY are automatically
 *   picked up by the SDK when running locally or on Vercel.
 */
const inngest = new Inngest({
  id: process.env.INNGEST_APP_ID || "khxaiyan-portfolio",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

module.exports = { inngest };
