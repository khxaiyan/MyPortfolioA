/**
 * backend/sync-env.js
 * Reads keys from keys/.env (and keys/.env.local)
 * and writes them into frontend/config.js
 */
const fs = require('fs');
const path = require('path');

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = {};
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  });
  return result;
}

const envPath      = path.join(__dirname, '..', 'keys', '.env');
const envLocalPath = path.join(__dirname, '..', 'keys', '.env.local');

const supportedKeys = [
  'GITHUB_USERNAME', 'X_USERNAME', 'TELEGRAM_USERNAME', 'CONTACT_EMAIL',
  'SITE_NAME', 'ACCENT_LETTER', 'CF_ANALYTICS', 'WEB3FORMS_ACCESS_KEY',
  'HCAPTCHA_SITEKEY', 'CLERK_PUBLISHABLE_KEY', 'CLERK_FRONTEND_API',
  'AUTHORIZED_USERS', 'FAVICON_URL', 'AVATAR_URL', 'ACCENT_COLOR', 'DEFAULT_THEME',
  'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_UPLOAD_PRESET'
];
const envFromProcess = {};
supportedKeys.forEach((key) => {
  if (process.env[key]) {
    envFromProcess[key] = process.env[key];
  }
});

async function runSync() {
  const env = Object.assign({}, envFromProcess, parseEnv(envPath), parseEnv(envLocalPath));

  const configPath = path.join(__dirname, '..', 'frontend', 'config.js');
  let currentConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      const code = fs.readFileSync(configPath, 'utf-8');
      const match = code.match(/CONFIG\s*=\s*(\{[\s\S]*?\});/);
      if (match) {
        currentConfig = eval('(' + match[1] + ')');
      }
    } catch (_) {}
  }

  // 1. Try pulling live config from MongoDB Atlas
  let mongoConfig = null;
  try {
    const { connectToDatabase } = require('../api/lib/mongodb');
    const { db } = await connectToDatabase();
    const doc = await db.collection('config').findOne({ _id: 'portfolio_config' });
    if (doc && doc.config) {
      mongoConfig = doc.config;
      console.log('✓ Fetched latest live config from MongoDB Atlas');
    }
  } catch (mErr) {
    console.log('ℹ️ MongoDB build sync notice:', mErr.message);
  }

  // Base configuration merges: local config -> MongoDB live doc -> env overrides
  const baseConfig = Object.assign({}, currentConfig, mongoConfig || {});

  delete baseConfig.developer_pin;
  delete baseConfig.ping;

  const updatedConfig = {
    cf_analytics: env.CF_ANALYTICS === 'true' ? true : (env.CF_ANALYTICS && env.CF_ANALYTICS !== 'false' ? env.CF_ANALYTICS : (baseConfig.cf_analytics || false)),
    web3forms_access_key: env.WEB3FORMS_ACCESS_KEY || baseConfig.web3forms_access_key || 'd36ee933-00cb-453e-aa38-b18ee60ce5d1',
    hcaptcha_sitekey: env.HCAPTCHA_SITEKEY || baseConfig.hcaptcha_sitekey || '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
    cloudinary_cloud_name: env.CLOUDINARY_CLOUD_NAME || baseConfig.cloudinary_cloud_name || 'dqxccz5bn',
    cloudinary_upload_preset: env.CLOUDINARY_UPLOAD_PRESET || baseConfig.cloudinary_upload_preset || 'myportfolioa',
    clerk_publishable_key: env.CLERK_PUBLISHABLE_KEY || baseConfig.clerk_publishable_key || 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk',
    clerk_frontend_api: env.CLERK_FRONTEND_API || baseConfig.clerk_frontend_api || 'https://shining-turkey-1325.clerk.accounts.dev',
    authorized_users: (env.AUTHORIZED_USERS || (baseConfig.authorized_users ? (Array.isArray(baseConfig.authorized_users) ? baseConfig.authorized_users.join(',') : baseConfig.authorized_users) : 'ayankhan84510@gmail.com'))
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean),
    cv_url: env.CV_URL || baseConfig.cv_url || '',
    cv_enabled: baseConfig.cv_enabled === true,
    cv_label: env.CV_LABEL || baseConfig.cv_label || 'CV',
    cv_action: env.CV_ACTION || baseConfig.cv_action || 'preview'
  };

  const outputCode = `var CONFIG = ${JSON.stringify(updatedConfig, null, 2)};\nif (typeof window !== 'undefined') {\n  window.CONFIG = Object.assign(window.CONFIG || {}, CONFIG);\n}\n`;
  fs.writeFileSync(configPath, outputCode, 'utf-8');
  console.log('✓ Successfully synchronized live config into frontend/config.js!');
  process.exit(0);
}

runSync().catch(err => {
  console.error('sync-env error:', err);
  process.exit(0);
});
