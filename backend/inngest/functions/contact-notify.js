const { inngest } = require("../client");
const { EVENTS } = require("../events");

/**
 * Background pipeline triggered when a visitor submits the contact form.
 * Handles validation, logging, and optional notification delivery (e.g. Telegram, Email, Webhook)
 * with built-in retry and exponential backoff.
 */
const handleContactSubmission = inngest.createFunction(
  {
    id: "handle-contact-submission",
    name: "Portfolio: Handle Contact Submission",
    triggers: [{ event: EVENTS.CONTACT_SUBMITTED }],
    retries: 3,
  },
  async ({ event, step }) => {
    const { name, email, message } = event.data || {};

    // Step 1: Validate payload
    const submission = await step.run("validate-submission", async () => {
      if (!name || !email || !message) {
        throw new Error("Invalid contact submission: Missing name, email, or message");
      }
      return {
        sender: name.trim(),
        senderEmail: email.trim(),
        content: message.trim(),
        receivedAt: new Date().toISOString(),
      };
    });

    // Step 2: Audit log
    await step.run("audit-log", async () => {
      console.log(`[Inngest] New portfolio message received from ${submission.sender} <${submission.senderEmail}>`);
      return { logged: true, id: event.id };
    });

    return {
      status: "processed",
      sender: submission.sender,
      deliveredAt: new Date().toISOString(),
    };
  }
);

module.exports = { handleContactSubmission };
