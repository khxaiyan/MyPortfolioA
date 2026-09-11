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

  const updatedConfig = Object.assign({}, baseConfig, {
    github: env.GITHUB_USERNAME || baseConfig.github || 'khxaiyan',
    x: env.X_USERNAME || baseConfig.x || 'khxaiyan',
    telegram: env.TELEGRAM_USERNAME || baseConfig.telegram || 'khxaiyan',
    email: env.CONTACT_EMAIL || baseConfig.email || 'ayankhan84510@gmail.com',
    logo: env.AVATAR_URL || baseConfig.logo || 'https://avatars.githubusercontent.com/u/225553218?v=4',
    avatar_url: env.AVATAR_URL || baseConfig.avatar_url || 'https://avatars.githubusercontent.com/u/225553218?v=4',
    favicon_url: env.FAVICON_URL || baseConfig.favicon_url || 'https://res.cloudinary.com/dqxccz5bn/image/upload/favicon_jzygcw.png',
    site_name: env.SITE_NAME || baseConfig.site_name || 'khxaiyan',
    accent_letter: env.ACCENT_LETTER || baseConfig.accent_letter || 'x',
    accent_color: env.ACCENT_COLOR || baseConfig.accent_color || '#00ff00',
    default_theme: env.DEFAULT_THEME || baseConfig.default_theme || 'dark',
    theme_config: Object.assign({
      mode: 'dark',
      accent_color: '#ff2a5f',
      bg_preset: 'midnight'
    }, baseConfig.theme_config || {}, {
      mode: env.DEFAULT_THEME || (baseConfig.theme_config && baseConfig.theme_config.mode) || baseConfig.default_theme || 'dark',
      accent_color: env.ACCENT_COLOR || (baseConfig.theme_config && baseConfig.theme_config.accent_color) || baseConfig.accent_color || '#ff2a5f',
      bg_preset: (baseConfig.theme_config && baseConfig.theme_config.bg_preset) || 'midnight'
    }),
    site_desc: baseConfig.site_desc || 'khxaiyan | developer in active building mode. crafting clean web tools & digital experiences.',
    seo_desc: baseConfig.seo_desc || 'khxaiyan | developer in active building mode. crafting clean web tools & digital experiences.',
    intro: baseConfig.intro || '',
    projects: baseConfig.projects || [],
    project_links: baseConfig.project_links || {},
    cf_analytics: env.CF_ANALYTICS === 'true' ? true : (env.CF_ANALYTICS && env.CF_ANALYTICS !== 'false' ? env.CF_ANALYTICS : false),
    web3forms_access_key: env.WEB3FORMS_ACCESS_KEY || baseConfig.web3forms_access_key || 'd36ee933-00cb-453e-aa38-b18ee60ce5d1',
    hcaptcha_sitekey: env.HCAPTCHA_SITEKEY || baseConfig.hcaptcha_sitekey || '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
    clerk_publishable_key: env.CLERK_PUBLISHABLE_KEY || baseConfig.clerk_publishable_key || 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk',
    clerk_frontend_api: env.CLERK_FRONTEND_API || baseConfig.clerk_frontend_api || 'https://shining-turkey-1325.clerk.accounts.dev',
    authorized_users: (env.AUTHORIZED_USERS || (baseConfig.authorized_users ? baseConfig.authorized_users.join(',') : 'ayankhan84510@gmail.com'))
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean),
    cloudinary_cloud_name: env.CLOUDINARY_CLOUD_NAME || baseConfig.cloudinary_cloud_name || '',
    cloudinary_upload_preset: env.CLOUDINARY_UPLOAD_PRESET || baseConfig.cloudinary_upload_preset || ''
  });

  const outputCode = `if (typeof window !== 'undefined') {\n  window.CONFIG = Object.assign(window.CONFIG || {}, ${JSON.stringify(updatedConfig, null, 2)});\n}\nvar CONFIG = (typeof window !== 'undefined' && window.CONFIG) ? window.CONFIG : ${JSON.stringify(updatedConfig, null, 2)};\n`;
  fs.writeFileSync(configPath, outputCode, 'utf-8');
  console.log('✓ Successfully synchronized live config into frontend/config.js!');
  process.exit(0);
}

runSync().catch(err => {
  console.error('sync-env error:', err);
  process.exit(0);
});
