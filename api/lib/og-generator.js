/**
 * Code-based Open Graph SVG Template Generator
 * Dynamically builds a 1200x630 card from portfolio configuration
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateOgSvg(config = {}) {
  const siteName = config.site_name || 'khxaiyan';
  const accentLetter = config.accent_letter !== undefined ? config.accent_letter : 'x';
  const siteDesc = config.site_desc || 'Developer in active building mode.';
  const intro = config.intro || 'Crafting clean web tools, interactive interfaces & digital experiences.';
  const accentColor = (config.theme_config && config.theme_config.accent) || config.accent_color || '#ff2a5f';
  const avatarUrl = config.avatar_url || config.logo || 'https://avatars.githubusercontent.com/u/225553218?v=4';
  const domain = 'khxaiyan.vercel.app';

  // Format wordmark with custom bracket or accent highlighting
  let wordmarkSvg = '';
  if (siteName.includes('{') && siteName.includes('}')) {
    wordmarkSvg = escapeXml(siteName).replace(/\{([^}]+)\}/g, `<tspan fill="${accentColor}">$1</tspan>`);
  } else if (accentLetter && siteName.toLowerCase().includes(String(accentLetter).toLowerCase())) {
    const rawLower = siteName.toLowerCase();
    const accLower = String(accentLetter).toLowerCase();
    const idx = rawLower.indexOf(accLower);
    const before = escapeXml(siteName.slice(0, idx));
    const matched = escapeXml(siteName.slice(idx, idx + accLower.length));
    const after = escapeXml(siteName.slice(idx + accLower.length));
    wordmarkSvg = `${before}<tspan fill="${accentColor}">${matched}</tspan>${after}`;
  } else {
    wordmarkSvg = escapeXml(siteName);
  }

  // Generate skills badges (up to 4)
  let skills = [];
  if (Array.isArray(config.skills) && config.skills.length > 0) {
    skills = config.skills.slice(0, 4).map(s => (typeof s === 'string' ? s : (s.name || s.label || 'Code')));
  } else {
    skills = ['TypeScript', 'Node.js', 'React', 'Python'];
  }

  let badgesSvg = '';
  let badgeX = 0;
  skills.forEach(skill => {
    const label = escapeXml(skill);
    const width = Math.max(90, label.length * 11 + 32);
    badgesSvg += `
      <g transform="translate(${badgeX}, 0)">
        <rect width="${width}" height="42" rx="10" fill="#141622" stroke="#292c42" stroke-width="1.2" />
        <text x="${width / 2}" y="26" font-family="ui-monospace, monospace" font-size="16" font-weight="600" fill="#d0d4e8" text-anchor="middle">${label}</text>
      </g>`;
    badgeX += width + 14;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0e" />
      <stop offset="50%" stop-color="#0d0e15" />
      <stop offset="100%" stop-color="#141522" />
    </linearGradient>

    <radialGradient id="redGlow" cx="25%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#0a0a0e" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0" />
    </radialGradient>

    <clipPath id="avatarClip">
      <circle cx="950" cy="315" r="180" />
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#redGlow)" />
  <rect x="2" y="2" width="1196" height="626" rx="28" fill="none" stroke="#232638" stroke-width="3" />

  <path d="M 80 540 L 400 540 L 440 500 L 700 500" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.25" />
  <circle cx="80" cy="540" r="4" fill="${accentColor}" fill-opacity="0.4" />
  <circle cx="700" cy="500" r="4" fill="${accentColor}" fill-opacity="0.4" />

  <g transform="translate(90, 160)">
    <text font-family="'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="82" font-weight="800" fill="#ffffff" letter-spacing="-1.5">
      ${wordmarkSvg}
    </text>

    <text y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="600" fill="#e1e3ec" letter-spacing="-0.3">
      ${escapeXml(siteDesc)}
    </text>
    <text y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400" fill="#8e94ad">
      ${escapeXml(intro)}
    </text>

    <g transform="translate(0, 175)">
      ${badgesSvg}
    </g>

    <g transform="translate(0, 260)">
      <rect width="255" height="46" rx="23" fill="#131420" stroke="${accentColor}" stroke-width="1.4" stroke-opacity="0.75" />
      <circle cx="24" cy="23" r="6" fill="${accentColor}" />
      <text x="44" y="29" font-family="ui-monospace, monospace" font-size="18" font-weight="600" fill="#ffffff">${domain}</text>
    </g>
  </g>

  <g>
    <circle cx="950" cy="315" r="215" fill="url(#avatarGlow)" />
    <circle cx="950" cy="315" r="190" fill="none" stroke="${accentColor}" stroke-width="3" stroke-dasharray="12 8" />
    <circle cx="950" cy="315" r="180" fill="#181926" stroke="#2f334a" stroke-width="2" />
    <image href="${escapeXml(avatarUrl)}" x="770" y="135" width="360" height="360" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice" />
  </g>
</svg>`;
}

module.exports = { generateOgSvg, escapeXml };
