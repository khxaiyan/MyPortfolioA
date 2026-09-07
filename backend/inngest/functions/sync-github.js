const { inngest } = require("../client");
const { EVENTS } = require("../events");

/**
 * Background workflow to query GitHub API and sync project star counts
 * without impacting client page load times.
 *
 * Triggers:
 * 1. Event: `portfolio/github.sync`
 * 2. Cron schedule: every 6 hours automatically
 */
const syncGitHubProjects = inngest.createFunction(
  {
    id: "sync-github-projects",
    name: "Portfolio: Sync GitHub Projects & Stars",
    triggers: [
      { event: EVENTS.GITHUB_SYNC },
      { cron: "0 */6 * * *" },
    ],
    retries: 2,
  },
  async ({ event, step }) => {
    const username = (event.data && event.data.username) || process.env.GITHUB_USERNAME || "khxaiyan";

    // Step 1: Fetch user repositories from GitHub
    const repos = await step.run("fetch-github-repos", async () => {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`, {
        headers: {
          "User-Agent": "khxaiyan-portfolio-inngest",
          "Accept": "application/vnd.github.v3+json",
        },
      });

      if (!res.ok) {
        throw new Error(`GitHub API returned HTTP ${res.status}`);
      }

      const list = await res.json();
      return list.map((r) => ({
        name: r.name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
        description: r.description,
        updated_at: r.updated_at,
      }));
    });

    // Step 2: Format & return synced snapshot
    const summary = await step.run("summarize-sync", async () => {
      const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
      return {
        syncedRepos: repos.length,
        totalStars,
        topProjects: repos.slice(0, 3).map((r) => `${r.name} (★ ${r.stars})`),
        syncedAt: new Date().toISOString(),
      };
    });

    return summary;
  }
);

module.exports = { syncGitHubProjects };
