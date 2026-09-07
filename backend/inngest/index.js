const { inngest } = require("./client");
const { EVENTS } = require("./events");
const { helloWorld } = require("./functions/hello-world");
const { syncGitHubProjects } = require("./functions/sync-github");
const { handleContactSubmission } = require("./functions/contact-notify");

/**
 * Array of all registered Inngest functions.
 * Add new function modules here to have them automatically served by /api/inngest.
 */
const functions = [
  helloWorld,
  syncGitHubProjects,
  handleContactSubmission,
];

module.exports = {
  inngest,
  EVENTS,
  functions,
  helloWorld,
  syncGitHubProjects,
  handleContactSubmission,
};
