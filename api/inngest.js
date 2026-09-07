const { serve } = require("inngest/next");
const { inngest, functions } = require("../backend/inngest");

/**
 * Vercel Serverless Function serving Inngest at `/api/inngest`.
 *
 * Handles:
 * - GET: Inngest schema discovery & handshake sync
 * - POST: Durable step execution
 * - PUT: Function registration
 */
const handler = serve({
  client: inngest,
  functions,
});

module.exports = handler;
module.exports.GET = handler.GET;
module.exports.POST = handler.POST;
module.exports.PUT = handler.PUT;
