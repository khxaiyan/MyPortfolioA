/**
 * sync-env.js
 * Automatically loads keys from .env and synchronizes config.js
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

const envPath = path.join(__dirname, '.env');
const envLocalPath = path.join(__dirname, '.env.local');

const env = Object.assign({}, parseEnv(envPath), parseEnv(envLocalPath));

if (Object.keys(env).length === 0) {
  console.log('ℹ️ No .env found. Using existing config.js.');
  process.exit(0);
}

const configPath = path.join(__dirname, 'config.js');
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

const authorizedList = (env.AUTHORIZED_USERS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const updatedConfig = Object.assign({}, currentConfig, {
  github: env.GITHUB_USERNAME || currentConfig.github || 'khxaiyan',
  x: env.X_USERNAME || currentConfig.x || 'khxaiyan',
  telegram: env.TELEGRAM_USERNAME || currentConfig.telegram || 'khxaiyan',
  email: env.CONTACT_EMAIL || currentConfig.email || '[EMAIL_ADDRESS]',
  logo: 'logo.png',
  site_name: env.SITE_NAME || currentConfig.site_name || 'khxaiyan',
  accent_letter: env.ACCENT_LETTER || currentConfig.accent_letter || 'x',
  site_desc: currentConfig.site_desc || 'khxaiyan | developer in active building mode. crafting clean web tools & digital experiences.',
  seo_desc: currentConfig.seo_desc || 'khxaiyan | Web developer crafting clean tools, interfaces, and digital experiences.',
  intro: currentConfig.intro || 'Passionate developer specializing in building modern web applications, clean user interfaces, and dynamic digital tools. Focused on performance, aesthetics, and crafting clean, scalable code.',
  authorized_users: authorizedList.length > 0 ? authorizedList : (currentConfig.authorized_users || ['ayankhan84510@gmail.com', 'khxaiyan', 'afudubxi']),
  project_links: currentConfig.project_links || {},
  cf_analytics: env.CF_ANALYTICS === 'true' ? true : (env.CF_ANALYTICS && env.CF_ANALYTICS !== 'false' ? env.CF_ANALYTICS : false),
  web3forms_access_key: env.WEB3FORMS_ACCESS_KEY || currentConfig.web3forms_access_key || 'd36ee933-00cb-453e-aa38-b18ee60ce5d1',
  hcaptcha_sitekey: env.HCAPTCHA_SITEKEY || currentConfig.hcaptcha_sitekey || '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
  clerk_publishable_key: env.CLERK_PUBLISHABLE_KEY || currentConfig.clerk_publishable_key || 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk',
  clerk_frontend_api: env.CLERK_FRONTEND_API || currentConfig.clerk_frontend_api || 'https://shining-turkey-1325.clerk.accounts.dev'
});

const outputCode = `const CONFIG = ${JSON.stringify(updatedConfig, null, 2)};\n`;
fs.writeFileSync(configPath, outputCode, 'utf-8');
console.log('✓ Successfully synchronized .env keys into config.js!');
