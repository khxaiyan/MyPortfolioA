const fs = require('fs');
const path = require('path');
const { connectToDatabase } = require('./lib/mongodb');

/**
 * Configuration Save Endpoint (/api/save-config)
 * 
 * Saves portfolio configuration directly into MongoDB (Atlas).
 * - Instant update without git push or Vercel rebuild delays.
 * - Updates local frontend/config.js on dev disk for offline fallback.
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

    // Safety defaults
    if (!newConfig.site_name) newConfig.site_name = 'khxaiyan';
    if (!newConfig.accent_letter) newConfig.accent_letter = 'x';
    if (!newConfig.logo || newConfig.logo === 'avatar.svg' || newConfig.logo === 'Diluc.svg' || newConfig.logo === 'profile_icon.svg') {
      newConfig.logo = 'https://avatars.githubusercontent.com/u/225553218?v=4';
    }
    if (!newConfig.avatar_url || newConfig.avatar_url === 'avatar.svg' || newConfig.avatar_url === 'Diluc.svg' || newConfig.avatar_url === 'profile_icon.svg') {
      newConfig.avatar_url = 'https://avatars.githubusercontent.com/u/225553218?v=4';
    }
    if (!newConfig.favicon_url || newConfig.favicon_url === 'favicon.svg' || newConfig.favicon_url === 'favicon.png' || newConfig.favicon_url === 'favicon.ico' || newConfig.favicon_url === 'profile_icon.svg') {
      newConfig.favicon_url = 'https://res.cloudinary.com/dqxccz5bn/image/upload/favicon_jzygcw.png';
    }


    try {
      const configPath = path.join(__dirname, '..', 'frontend', 'config.js');
      if (fs.existsSync(configPath)) {
        const coreKeys = [
          'cf_analytics',
          'web3forms_access_key',
          'hcaptcha_sitekey',
          'cloudinary_cloud_name',
          'cloudinary_upload_preset',
          'clerk_publishable_key',
          'clerk_frontend_api',
          'authorized_users',
          'cv_url',
          'cv_enabled',
          'cv_label',
          'cv_action'
        ];
        const strippedConfig = {};
        coreKeys.forEach(k => {
          if (newConfig[k] !== undefined) {
            strippedConfig[k] = newConfig[k];
          }
        });
        const formattedConfig = `var CONFIG = ${JSON.stringify(strippedConfig, null, 2)};\nif (typeof window !== 'undefined') {\n  window.CONFIG = Object.assign(window.CONFIG || {}, CONFIG);\n}\n`;
        fs.writeFileSync(configPath, formattedConfig, 'utf-8');
      }
    } catch (_) {}

    // 1. Save to MongoDB
    let savedToMongo = false;
    let mongoError = null;
    try {
      const { db } = await connectToDatabase();
      await db.collection('config').updateOne(
        { _id: 'portfolio_config' },
        {
          $set: {
            config: newConfig,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      savedToMongo = true;
    } catch (mErr) {
      console.warn('MongoDB save warning:', mErr.message);
      mongoError = mErr.message;
    }

    return res.status(200).json({
      success: true,
      mongodb: savedToMongo,
      pushed: false,
      message: savedToMongo
        ? '✓ Configuration saved to MongoDB instantly!'
        : (mongoError ? `Saved locally (MongoDB: ${mongoError})` : 'Saved successfully!')
    });
  } catch (err) {
    console.error('Error saving config:', err);
    return res.status(500).json({ error: err.message || 'Internal server error while saving config.' });
  }
};
