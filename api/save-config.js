const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Universal Configuration Save Endpoint (/api/save-config)
 * 
 * Works seamlessly in both environments:
 * 1. Localhost (Node.js dev server):
 *    - Updates `frontend/config.js` on local disk.
 *    - Automatically commits and pushes to GitHub `main` branch.
 *    - Pushing to `main` triggers Vercel auto-deploy and GitHub Pages workflow!
 * 
 * 2. Vercel (Serverless Function):
 *    - Uses GitHub API to commit `frontend/config.js` directly to GitHub repository.
 *    - Requires GITHUB_TOKEN or PAGES_TOKEN in Vercel Environment Variables.
 */
module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const newConfig = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration payload.' });
    }

    // Safety: ensure sensible defaults
    if (!newConfig.site_name) newConfig.site_name = 'khxaiyan';
    if (!newConfig.accent_letter) newConfig.accent_letter = 'x';
    if (!newConfig.logo || newConfig.logo === 'avatar.svg' || newConfig.logo === 'Diluc.svg' || newConfig.logo === 'profile_icon.svg') newConfig.logo = 'https://res.cloudinary.com/dqxccz5bn/image/upload/profile_icon_wf7thb.svg';
    if (!newConfig.avatar_url || newConfig.avatar_url === 'avatar.svg' || newConfig.avatar_url === 'Diluc.svg' || newConfig.avatar_url === 'profile_icon.svg') newConfig.avatar_url = 'https://res.cloudinary.com/dqxccz5bn/image/upload/profile_icon_wf7thb.svg';
    if (!newConfig.favicon_url || newConfig.favicon_url === 'favicon.svg' || newConfig.favicon_url === 'favicon.png' || newConfig.favicon_url === 'favicon.ico' || newConfig.favicon_url === 'profile_icon.svg') newConfig.favicon_url = 'https://res.cloudinary.com/dqxccz5bn/image/upload/favicon_jzygcw.png';

    const formattedConfig = `const CONFIG = ${JSON.stringify(newConfig, null, 2)};\n`;

    const isVercel = Boolean(process.env.VERCEL);
    const githubToken = process.env.GITHUB_TOKEN || process.env.PAGES_TOKEN || process.env.GH_TOKEN;
    const repoOwner = process.env.GITHUB_REPOSITORY_OWNER || 'khxaiyan';
    const repoName = process.env.GITHUB_REPOSITORY_NAME || 'MyPortfolioA';

    // ── Localhost execution: Write file directly & push git ──
    if (!isVercel) {
      const configPath = path.join(process.cwd(), 'frontend', 'config.js');
      fs.writeFileSync(configPath, formattedConfig, 'utf8');

      let gitPushed = false;
      let gitMessage = '';

      try {
        // Stage config.js
        execSync('git add frontend/config.js', { stdio: 'pipe' });

        // Check if there are changes to commit
        const diff = execSync('git status --porcelain frontend/config.js', { stdio: 'pipe' }).toString().trim();
        if (diff) {
          execSync('git commit -m "chore: update portfolio configuration"', { stdio: 'pipe' });
          try {
            execSync('git push origin main', { stdio: 'pipe' });
            gitPushed = true;
            gitMessage = 'Pushed to GitHub main branch! Vercel is now deploying universally.';
          } catch (pushErr) {
            gitMessage = `Committed locally, but git push failed: ${pushErr.message}`;
          }
        } else {
          gitMessage = 'Configuration saved locally (no changes detected).';
        }
      } catch (gitErr) {
        gitMessage = `Saved locally, git error: ${gitErr.message}`;
      }

      return res.status(200).json({
        success: true,
        mode: 'local',
        pushed: gitPushed,
        message: gitMessage || 'Configuration successfully saved and synced!'
      });
    }

    // ── Vercel Serverless execution: Commit directly via GitHub REST API ──
    if (isVercel && githubToken) {
      const apiBase = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/frontend/config.js`;
      
      // 1. Get current file SHA
      const getRes = await fetch(apiBase, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Config-Updater'
        }
      });

      let fileSha = null;
      if (getRes.ok) {
        const fileData = await getRes.json();
        fileSha = fileData.sha;
      }

      // 2. Commit updated file to GitHub
      const putRes = await fetch(apiBase, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-Config-Updater'
        },
        body: JSON.stringify({
          message: 'chore: update portfolio configuration via web customizer',
          content: Buffer.from(formattedConfig).toString('base64'),
          sha: fileSha,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        const errJson = await putRes.json();
        return res.status(502).json({
          error: `GitHub API error: ${errJson.message || putRes.statusText}`
        });
      }

      return res.status(200).json({
        success: true,
        mode: 'vercel_github_api',
        pushed: true,
        message: 'Successfully committed to GitHub! Vercel is automatically deploying your changes universally.'
      });
    }

    // Fallback if on Vercel but GITHUB_TOKEN is not set yet
    return res.status(200).json({
      success: true,
      mode: 'vercel_without_github_token',
      pushed: false,
      message: 'Configuration received. To enable direct live GitHub commits from Vercel, add GITHUB_TOKEN to Vercel Environment Variables.'
    });
  } catch (err) {
    console.error('Error saving config:', err);
    return res.status(500).json({ error: err.message || 'Internal server error while saving config.' });
  }
};
