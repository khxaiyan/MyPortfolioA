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
  'AUTHORIZED_USERS', 'FAVICON_URL'
];
const envFromProcess = {};
supportedKeys.forEach((key) => {
  if (process.env[key]) {
    envFromProcess[key] = process.env[key];
  }
});

const env = Object.assign({}, envFromProcess, parseEnv(envPath), parseEnv(envLocalPath));

if (Object.keys(env).length === 0) {
  console.log('ℹ️ No .env found. Using existing config.js.');
  process.exit(0);
}

const configPath = path.join(__dirname, '..', 'frontend', 'config.js');
let currentConfig = {};
if (fs.existsSync(configPath)) {
  try {
    const code = fs.readFileSync(configPath, 'utf-8');
    const match = code.match(/const\s+CONFIG\s*=\s*(\{[\s\S]*?\});/);
    if (match) {
      currentConfig = eval('(' + match[1] + ')');
    }
  } catch (_) {}
}

delete currentConfig.developer_pin;

const updatedConfig = Object.assign({}, currentConfig, {
  github: env.GITHUB_USERNAME || currentConfig.github || 'khxaiyan',
  x: env.X_USERNAME || currentConfig.x || 'khxaiyan',
  telegram: env.TELEGRAM_USERNAME || currentConfig.telegram || 'khxaiyan',
  email: env.CONTACT_EMAIL || currentConfig.email || 'ayankhan84510@gmail.com',
  logo: 'logo.png',
  favicon_url: env.FAVICON_URL || currentConfig.favicon_url || 'logo.png',
  site_name: env.SITE_NAME || currentConfig.site_name || 'khxaiyan',
  accent_letter: env.ACCENT_LETTER || currentConfig.accent_letter || 'x',
  site_desc: currentConfig.site_desc || 'khxaiyan | developer in active building mode. crafting clean web tools & digital experiences.',
  seo_desc: currentConfig.seo_desc || 'khxaiyan | Web developer crafting clean tools, interfaces, and digital experiences.',
  intro: currentConfig.intro || 'Passionate developer specializing in building modern web applications, clean user interfaces, and dynamic digital tools. Focused on performance, aesthetics, and crafting clean, scalable code.',
  projects: currentConfig.projects || [],
  project_links: currentConfig.project_links || {},
  cf_analytics: env.CF_ANALYTICS === 'true' ? true : (env.CF_ANALYTICS && env.CF_ANALYTICS !== 'false' ? env.CF_ANALYTICS : false),
  web3forms_access_key: env.WEB3FORMS_ACCESS_KEY || currentConfig.web3forms_access_key || 'd36ee933-00cb-453e-aa38-b18ee60ce5d1',
  hcaptcha_sitekey: env.HCAPTCHA_SITEKEY || currentConfig.hcaptcha_sitekey || '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
  clerk_publishable_key: env.CLERK_PUBLISHABLE_KEY || currentConfig.clerk_publishable_key || 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk',
  clerk_frontend_api: env.CLERK_FRONTEND_API || currentConfig.clerk_frontend_api || 'https://shining-turkey-1325.clerk.accounts.dev',
  authorized_users: (env.AUTHORIZED_USERS || (currentConfig.authorized_users ? currentConfig.authorized_users.join(',') : 'ayankhan84510@gmail.com'))
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
});

const outputCode = `const CONFIG = ${JSON.stringify(updatedConfig, null, 2)};\n`;
fs.writeFileSync(configPath, outputCode, 'utf-8');
console.log('✓ Successfully synchronized .env keys into config.js!');
