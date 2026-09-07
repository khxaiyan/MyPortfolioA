const { inngest } = require("../client");
const { EVENTS } = require("../events");

/**
 * Verification & onboarding function.
 * Can be triggered directly from the Inngest dashboard or via sending the `test/hello.world` event.
 */
const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    name: "Portfolio: Hello World Handshake",
  },
  { event: EVENTS.HELLO_WORLD },
  async ({ event, step }) => {
    // 1. Log receipt
    await step.run("log-trigger", async () => {
      return {
        receivedAt: new Date().toISOString(),
        payload: event.data || {},
      };
    });

    // 2. Demonstrate durable sleep step
    await step.sleep("wait-a-second", "1s");

    // 3. Final handshake result
    return {
      success: true,
      message: `Inngest is fully integrated into khxaiyan portfolio! Hello ${event.data && event.data.name ? event.data.name : "Khxaiyan"}!`,
      timestamp: new Date().toISOString(),
    };
  }
);

module.exports = { helloWorld };
