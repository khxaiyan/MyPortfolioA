const { serve } = require("inngest/node");
const { inngest, functions } = require("../backend/inngest");

/**
 * Vercel Serverless Function serving Inngest at `/api/inngest`.
 * Uses inngest/node commHandler for Node.js (req, res) serverless execution.
 */
const handler = serve({
  client: inngest,
  functions,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  servePath: "/api/inngest",
});

module.exports = handler;
