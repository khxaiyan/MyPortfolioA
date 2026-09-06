(function () {
  'use strict';

  /* ─── Theme & Accent Customization ─── */
  var root = document.documentElement;
  var aw = document.getElementById('avatar-wrap');
  var metaClr = document.getElementById('meta-theme-color');

  var currentThemeMode = 'dark';
  var currentAccentColor = '#ff2a5f';
  var currentBgPreset = 'midnight';

  var BG_PRESETS = {
    midnight: { bg: '#0a0a0e', surface: '#131319', surfaceHover: '#191a22', rail: '#363a63' },
    oled:     { bg: '#000000', surface: '#0a0a0a', surfaceHover: '#141414', rail: '#262630' },
    navy:     { bg: '#070a13', surface: '#0d1322', surfaceHover: '#141d33', rail: '#223252' },
    charcoal: { bg: '#101114', surface: '#17181d', surfaceHover: '#1f2027', rail: '#383947' }
  };

  function hexToRgba(hex, alpha) {
    var c = hex.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var num = parseInt(c, 16);
    return 'rgba(' + ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255) + ',' + alpha + ')';
  }

  function shadeColor(color, percent) {
    var c = color.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var num = parseInt(c, 16);
    var amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt, G = ((num >> 8) & 255) + amt, B = (num & 255) + amt;
    return '#' + (0x1000000 + (R<255?(R<0?0:R):255)*0x10000 + (G<255?(G<0?0:G):255)*0x100 + (B<255?(B<0?0:B):255)).toString(16).slice(1);
  }

  function applyThemeColors(accent, bgPreset, mode) {
    var isDark = mode === 'dark';

    if (accent) {
      root.style.setProperty('--red', accent);
      root.style.setProperty('--red-solid', shadeColor(accent, -18));
      root.style.setProperty('--red-solid-hov', shadeColor(accent, -30));
      root.style.setProperty('--red-dim', hexToRgba(accent, 0.16));
      root.style.setProperty('--border-accent', hexToRgba(accent, 0.45));
      root.style.setProperty('--border-accent-glow', hexToRgba(accent, 0.12));
    }

    if (isDark && bgPreset && BG_PRESETS[bgPreset]) {
      var p = BG_PRESETS[bgPreset];
      root.style.setProperty('--bg', p.bg);
      root.style.setProperty('--surface', p.surface);
      root.style.setProperty('--surface-hover', p.surfaceHover);
      root.style.setProperty('--rail', p.rail);
    } else if (!isDark) {
      root.style.removeProperty('--bg');
      root.style.removeProperty('--surface');
      root.style.removeProperty('--surface-hover');
      root.style.removeProperty('--rail');
    }
  }

  function applyTheme(t) {
    currentThemeMode = t === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', currentThemeMode);
    localStorage.setItem('theme', currentThemeMode);
    if (metaClr) metaClr.content = currentThemeMode === 'dark' ? (BG_PRESETS[currentBgPreset] ? BG_PRESETS[currentBgPreset].bg : '#0a0a0e') : '#f7f5f1';
    renderHcaptcha(currentThemeMode);
    applyThemeColors(currentAccentColor, currentBgPreset, currentThemeMode);
    updateModalThemeUI();
  }

  /* ─── Dynamic Themeable hCaptcha ─── */
  var hcaptchaWidgetId = null;

  function renderHcaptcha(theme) {
    var container = document.getElementById('hcaptcha-container');
    if (!container) return;

    var sitekey = (typeof CONFIG !== 'undefined' && CONFIG.hcaptcha_sitekey)
      ? CONFIG.hcaptcha_sitekey
      : '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

    if (window.hcaptcha && typeof window.hcaptcha.render === 'function') {
      try {
        container.innerHTML = '';
        hcaptchaWidgetId = window.hcaptcha.render('hcaptcha-container', {
          sitekey: sitekey,
          theme: theme === 'light' ? 'light' : 'dark',
          size: 'normal'
        });
      } catch (_) { }
    } else {
      container.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    }
  }

  window.initHcaptcha = function () {
    var curTheme = root.getAttribute('data-theme') || 'dark';
    renderHcaptcha(curTheme);
  };

  function updateModalThemeUI() {
    var isDark = currentThemeMode === 'dark';
    var darkRadio = document.getElementById('m-radio-theme-dark');
    var lightRadio = document.getElementById('m-radio-theme-light');
    var darkCard = document.getElementById('m-card-theme-dark');
    var lightCard = document.getElementById('m-card-theme-light');
    var pill = document.getElementById('m-theme-status-pill');

    if (darkRadio) darkRadio.checked = isDark;
    if (lightRadio) lightRadio.checked = !isDark;

    if (darkCard) {
      darkCard.style.borderColor = isDark ? 'var(--red)' : 'var(--line)';
      darkCard.style.background = isDark ? 'var(--red-dim)' : 'var(--bg)';
    }
    if (lightCard) {
      lightCard.style.borderColor = !isDark ? 'var(--red)' : 'var(--line)';
      lightCard.style.background = !isDark ? 'var(--red-dim)' : 'var(--bg)';
    }
    if (pill) {
      pill.textContent = isDark ? 'Dark Mode Active' : 'Light Mode Active';
    }

    // Swatches active state
    var swatches = document.querySelectorAll('#m-accent-swatches-container .accent-swatch-btn');
    swatches.forEach(function (btn) {
      var c = (btn.getAttribute('data-color') || '').toLowerCase();
      if (c === (currentAccentColor || '').toLowerCase()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Inputs
    var picker = document.getElementById('m-accent-color-picker');
    var hexInp = document.getElementById('m-accent-hex-input');
    var hexInd = document.getElementById('m-accent-hex-indicator');
    if (picker && currentAccentColor) picker.value = currentAccentColor;
    if (hexInp && currentAccentColor) hexInp.value = currentAccentColor;
    if (hexInd && currentAccentColor) hexInd.textContent = currentAccentColor;

    // Presets
    var bgBtns = document.querySelectorAll('#m-bg-presets-container .bg-preset-btn');
    bgBtns.forEach(function (btn) {
      var p = btn.getAttribute('data-preset');
      if (p === currentBgPreset) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  var customCfg = null;
  try { customCfg = JSON.parse(localStorage.getItem('portfolio_custom_config')); } catch (_) {}
  var themeCfg = (customCfg && customCfg.theme_config) || {};
  currentThemeMode = themeCfg.mode || (customCfg && customCfg.default_theme) || localStorage.getItem('theme') || 'dark';
  currentAccentColor = themeCfg.accent_color || (customCfg && customCfg.accent_color) || '#ff2a5f';
  currentBgPreset = themeCfg.bg_preset || 'midnight';

  applyTheme(currentThemeMode);

  if (aw) {
    aw.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    aw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aw.click(); }
    });
  }

  /* ─── Load Local Customizer Overrides if present ─── */
  try {
    var savedCustom = localStorage.getItem('portfolio_custom_config');
    if (savedCustom && typeof CONFIG !== 'undefined') {
      Object.assign(CONFIG, JSON.parse(savedCustom));
    }
  } catch (_) { }

  /* ─── Wordmark & Accent Highlighting ─── */
  function formatWordmark(name, accent) {
    if (!name) return '';
    if (/\{([^}]+)\}/.test(name)) {
      return name.replace(/\{([^}]+)\}/g, '<span class="glyph-5">$1</span>');
    }
    var target = accent !== undefined && accent !== null ? accent : ((typeof CONFIG !== 'undefined' && CONFIG.accent_letter) ? CONFIG.accent_letter : 'x');
    if (target && target.trim()) {
      var letter = target.trim();
      var escaped = letter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp('(' + escaped + ')', 'i');
      if (regex.test(name)) {
        return name.replace(regex, '<span class="glyph-5">$1</span>');
      }
    }
    return highlightCapitals(name);
  }

  /* ─── Rich Text Parser (Bold, Italic, Underline, Code, Quote, Links, Accent, \n) ─── */
  function parseRichText(raw) {
    if (!raw) return '';
    var s = String(raw)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    s = s.replace(/\\n/g, '\n');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="rich-link">$1</a>');
    s = s.replace(/\{([^}]+)\}/g, '<span class="glyph-5">$1</span>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<u>$1</u>');
    s = s.replace(/(?:^|\s)\*([^*\s][^*]*[^*\s]|[^*])\*(?=\s|$|[.,!?:;])/g, ' <em>$1</em>');
    s = s.replace(/(?:^|\s)_([^_\s][^_]*[^_\s]|[^_])_(?=\s|$|[.,!?:;])/g, ' <em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code class="rich-code">$1</code>');

    var lines = s.split('\n');
    var parsedLines = lines.map(function (line) {
      var trimmed = line.trim();
      if (trimmed.indexOf('&gt; ') === 0 || trimmed.indexOf('&gt;') === 0) {
        return '<blockquote class="rich-quote">' + trimmed.replace(/^&gt;\s?/, '') + '</blockquote>';
      }
      return line;
    });

    return parsedLines.join('<br>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ─── Comprehensive Platform Presets (Simple Icons + Lucide Icons) ─── */
  var SOCIAL_PRESETS = [
    // Popular Simple Icons (Brands)
    { id: 'LinkedIn',   label: 'LinkedIn',   icon: 'simple-icons:linkedin',   url: 'https://linkedin.com/in/username' },
    { id: 'Instagram',  label: 'Instagram',  icon: 'simple-icons:instagram',  url: 'https://instagram.com/username' },
    { id: 'YouTube',    label: 'YouTube',    icon: 'simple-icons:youtube',    url: 'https://youtube.com/@channel' },
    { id: 'Discord',    label: 'Discord',    icon: 'simple-icons:discord',    url: 'https://discord.gg/invitecode' },
    { id: 'Spotify',    label: 'Spotify',    icon: 'simple-icons:spotify',    url: 'https://open.spotify.com/user/username' },
    { id: 'Steam',      label: 'Steam',      icon: 'simple-icons:steam',      url: 'https://steamcommunity.com/id/username' },
    { id: 'TikTok',     label: 'TikTok',     icon: 'simple-icons:tiktok',     url: 'https://tiktok.com/@username' },
    { id: 'Twitch',     label: 'Twitch',     icon: 'simple-icons:twitch',     url: 'https://twitch.tv/username' },
    { id: 'Reddit',     label: 'Reddit',     icon: 'simple-icons:reddit',     url: 'https://reddit.com/user/username' },
    { id: 'Bluesky',    label: 'Bluesky',    icon: 'simple-icons:bluesky',    url: 'https://bsky.app/profile/username.bsky.social' },
    { id: 'Medium',     label: 'Medium',     icon: 'simple-icons:medium',     url: 'https://medium.com/@username' },
    { id: 'Substack',   label: 'Substack',   icon: 'simple-icons:substack',   url: 'https://username.substack.com' },
    { id: 'WhatsApp',   label: 'WhatsApp',   icon: 'simple-icons:whatsapp',   url: 'https://wa.me/phonenumber' },
    { id: 'Facebook',   label: 'Facebook',   icon: 'simple-icons:facebook',   url: 'https://facebook.com/username' },
    { id: 'Threads',    label: 'Threads',    icon: 'simple-icons:threads',    url: 'https://threads.net/@username' },
    { id: 'Pinterest',  label: 'Pinterest',  icon: 'simple-icons:pinterest',  url: 'https://pinterest.com/username' },
    { id: 'Kick',       label: 'Kick',       icon: 'simple-icons:kick',       url: 'https://kick.com/username' },
    { id: 'Patreon',    label: 'Patreon',    icon: 'simple-icons:patreon',    url: 'https://patreon.com/username' },
    { id: 'Snapchat',   label: 'Snapchat',   icon: 'simple-icons:snapchat',   url: 'https://snapchat.com/add/username' },
    // Lucide Icons (Web, Tools & General)
    { id: 'Website',    label: 'Website',    icon: 'lucide:globe',           url: 'https://yourwebsite.com' },
    { id: 'Portfolio',  label: 'Portfolio',  icon: 'lucide:briefcase',       url: 'https://yourportfolio.com' },
    { id: 'Blog',       label: 'Blog / RSS', icon: 'lucide:rss',             url: 'https://yourblog.com' },
    { id: 'Code',       label: 'Code / Dev', icon: 'lucide:code-2',          url: 'https://...' },
    // Custom Option (Any Simple Icon or Lucide Icon)
    { id: 'Custom',     label: 'Custom',                             icon: 'lucide:link', url: 'https://...' }
  ];

  var ICON_SWITCH_MAP = {
    'instagram':  { simple: 'simple-icons:instagram',   lucide: 'lucide:instagram' },
    'youtube':    { simple: 'simple-icons:youtube',     lucide: 'lucide:youtube' },
    'linkedin':   { simple: 'simple-icons:linkedin',    lucide: 'lucide:linkedin' },
    'facebook':   { simple: 'simple-icons:facebook',    lucide: 'lucide:facebook' },
    'twitch':     { simple: 'simple-icons:twitch',      lucide: 'lucide:twitch' },
    'github':     { simple: 'simple-icons:github',      lucide: 'lucide:github' },
    'twitter':    { simple: 'simple-icons:x',           lucide: 'lucide:twitter' },
    'x':          { simple: 'simple-icons:x',           lucide: 'lucide:twitter' },
    'discord':    { simple: 'simple-icons:discord',     lucide: 'lucide:message-square' },
    'spotify':    { simple: 'simple-icons:spotify',     lucide: 'lucide:music' },
    'steam':      { simple: 'simple-icons:steam',       lucide: 'lucide:gamepad-2' },
    'tiktok':     { simple: 'simple-icons:tiktok',      lucide: 'lucide:video' },
    'reddit':     { simple: 'simple-icons:reddit',      lucide: 'lucide:bot' },
    'bluesky':    { simple: 'simple-icons:bluesky',     lucide: 'lucide:cloud' },
    'medium':     { simple: 'simple-icons:medium',      lucide: 'lucide:book-open' },
    'substack':   { simple: 'simple-icons:substack',    lucide: 'lucide:mail' },
    'whatsapp':   { simple: 'simple-icons:whatsapp',    lucide: 'lucide:phone' },
    'threads':    { simple: 'simple-icons:threads',     lucide: 'lucide:at-sign' },
    'pinterest':  { simple: 'simple-icons:pinterest',   lucide: 'lucide:pin' },
    'kick':       { simple: 'simple-icons:kick',        lucide: 'lucide:play' },
    'patreon':    { simple: 'simple-icons:patreon',     lucide: 'lucide:heart' },
    'snapchat':   { simple: 'simple-icons:snapchat',    lucide: 'lucide:ghost' },
    'website':    { simple: 'simple-icons:googlechrome',lucide: 'lucide:globe' },
    'portfolio':  { simple: 'simple-icons:notion',      lucide: 'lucide:briefcase' },
    'blog':       { simple: 'simple-icons:rss',         lucide: 'lucide:rss' },
    'code':       { simple: 'simple-icons:visualstudiocode', lucide: 'lucide:code-2' }
  };

  function switchIconLibrary(currentIcon, targetLib, currentPlatform) {
    var raw = (currentIcon || '').trim().toLowerCase();
    var plat = (currentPlatform || '').trim().toLowerCase();

    if (plat && ICON_SWITCH_MAP[plat]) {
      return targetLib === 'lucide' ? ICON_SWITCH_MAP[plat].lucide : ICON_SWITCH_MAP[plat].simple;
    }

    var iconName = raw.indexOf(':') !== -1 ? raw.split(':')[1] : raw;
    if (iconName && ICON_SWITCH_MAP[iconName]) {
      return targetLib === 'lucide' ? ICON_SWITCH_MAP[iconName].lucide : ICON_SWITCH_MAP[iconName].simple;
    }

    for (var k in ICON_SWITCH_MAP) {
      if (ICON_SWITCH_MAP[k].simple === raw || ICON_SWITCH_MAP[k].lucide === raw) {
        return targetLib === 'lucide' ? ICON_SWITCH_MAP[k].lucide : ICON_SWITCH_MAP[k].simple;
      }
    }

    if (targetLib === 'lucide') {
      return 'lucide:' + (iconName || 'globe');
    } else {
      return 'simple-icons:' + (iconName || 'simpleicons');
    }
  }

  function resolveIconKey(platform, customIcon) {
    if (customIcon && customIcon.trim()) {
      var val = customIcon.trim().toLowerCase();
      if (val.indexOf(':') !== -1) return val;
      var lucideNames = ['globe','link','code','code-2','rss','terminal','briefcase','mail','heart','sparkles','coffee','zap','music','camera','cpu','shield','compass','at-sign','book','layers','external-link'];
      if (lucideNames.indexOf(val) !== -1) return 'lucide:' + val;
      return 'simple-icons:' + val;
    }
    for (var i = 0; i < SOCIAL_PRESETS.length; i++) {
      if (SOCIAL_PRESETS[i].id.toLowerCase() === (platform || '').toLowerCase()) {
        return SOCIAL_PRESETS[i].icon;
      }
    }
    return 'lucide:globe';
  }

  /* ─── Social Media Icons & Dynamic Channel List ─── */
  function getSocialIcon(item) {
    if (!item) {
      return '<iconify-icon icon="lucide:globe" class="channel-icon" width="18" height="18"></iconify-icon>';
    }

    var platform = (typeof item === 'string' ? item : (item.platform || '')).toLowerCase();
    var customIcon = (typeof item === 'object' && item.icon) ? String(item.icon).trim() : '';

    if (customIcon) {
      var ic = customIcon.toLowerCase();
      if (ic.indexOf(':') === -1) {
        var lucideList = ['globe','link','code','code-2','rss','terminal','briefcase','mail','heart','sparkles','coffee','zap','music','camera','cpu','shield','compass','at-sign','book','layers','external-link'];
        ic = (lucideList.indexOf(ic) !== -1) ? ('lucide:' + ic) : ('simple-icons:' + ic);
      }
      return '<iconify-icon icon="' + escapeHtml(ic) + '" class="channel-icon" width="18" height="18"></iconify-icon>';
    }

    var resolved = resolveIconKey(platform, '');
    return '<iconify-icon icon="' + escapeHtml(resolved) + '" class="channel-icon" width="18" height="18"></iconify-icon>';
  }

  var channelArrowSvg = '<svg class="channel-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>';

  function renderChannelList(cfg) {
    var container = document.getElementById('channels-container');
    if (!container || !cfg) return;

    var html = '';

    // 1. GitHub
    if (cfg.github) {
      html += '<a class="channel-row" id="link-github" href="https://github.com/' + encodeURIComponent(cfg.github) + '" target="_blank" rel="noopener noreferrer">' +
        '<svg class="channel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />' +
        '<path d="M9 18c-4.51 2-5-2-7-2" />' +
        '</svg>' +
        '<span class="channel-name">GitHub</span>' +
        channelArrowSvg +
        '</a>';
    }

    // 2. Telegram
    if (cfg.telegram) {
      html += '<a class="channel-row" id="link-telegram" href="https://t.me/' + encodeURIComponent(cfg.telegram) + '" target="_blank" rel="noopener noreferrer">' +
        '<svg class="channel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="m22 2-7 20-4-9-9-4Z" />' +
        '<path d="M22 2 11 13" />' +
        '</svg>' +
        '<span class="channel-name">Telegram</span>' +
        channelArrowSvg +
        '</a>';
    }

    // 3. X (Twitter)
    if (cfg.x) {
      html += '<a class="channel-row" id="link-x" href="https://x.com/' + encodeURIComponent(cfg.x) + '" target="_blank" rel="noopener noreferrer">' +
        '<svg class="channel-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />' +
        '</svg>' +
        '<span class="channel-name">X</span>' +
        channelArrowSvg +
        '</a>';
    }

    // 4. Email
    if (cfg.email && cfg.email !== 'your@email.com') {
      html += '<a class="channel-row" id="link-email" href="mailto:' + encodeURIComponent(cfg.email) + '">' +
        '<svg class="channel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="2" y="4" width="20" height="16" rx="3" />' +
        '<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />' +
        '</svg>' +
        '<span class="channel-name">Email</span>' +
        channelArrowSvg +
        '</a>';
    }

    // 5. Dynamic Additional Social Links (Simple Icons & Lucide Icons)
    if (Array.isArray(cfg.social_links) && cfg.social_links.length > 0) {
      cfg.social_links.forEach(function (link) {
        if (!link || !link.url) return;
        var href = link.url.trim();
        if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) {
          href = 'https://' + href;
        }
        var label = (link.title || link.platform || 'Link').trim();
        var iconSvg = getSocialIcon(link);
        html += '<a class="channel-row" href="' + href + '" target="_blank" rel="noopener noreferrer">' +
          iconSvg +
          '<span class="channel-name">' + escapeHtml(label) + '</span>' +
          channelArrowSvg +
          '</a>';
      });
    }

    container.innerHTML = html;
  }

  /* ─── Sync Config Links, Bio & Analytics ─── */
  if (typeof CONFIG !== 'undefined') {
    var wordmark = document.querySelector('.wordmark');
    if (wordmark && CONFIG.site_name) {
      wordmark.innerHTML = formatWordmark(CONFIG.site_name, CONFIG.accent_letter);
    }

    var cornerTag = document.getElementById('corner-tag');
    if (cornerTag && CONFIG.site_name) {
      cornerTag.innerHTML = '@' + formatWordmark(CONFIG.site_name, CONFIG.accent_letter);
    }

    var bioEl = document.querySelector('.bio');
    if (bioEl && CONFIG.site_desc) {
      bioEl.innerHTML = parseRichText(CONFIG.site_desc);
    }

    var introEl = document.getElementById('intro-text');
    if (introEl && CONFIG.intro) {
      introEl.innerHTML = parseRichText(CONFIG.intro);
    }

    /* Apply saved avatar/profile picture */
    if (CONFIG.avatar_url && CONFIG.avatar_url.trim()) {
      setPageAvatar(CONFIG.avatar_url.trim());
    }

    /* Apply saved favicon */
    if (CONFIG.favicon_url && CONFIG.favicon_url.trim()) {
      applyPageFavicon(CONFIG.favicon_url.trim());
    }

    /* Apply dynamic and core channel links */
    renderChannelList(CONFIG);

    if (CONFIG.cf_analytics && typeof CONFIG.cf_analytics === 'string') {
      var cfScript = document.createElement('script');
      cfScript.defer = true;
      cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      cfScript.setAttribute('data-cf-beacon', JSON.stringify({ token: CONFIG.cf_analytics }));
      document.head.appendChild(cfScript);
    }
  }

  /* ─── Android-Style Developer Settings Unlock & Modal Popup (10 Taps) ─── */
  var cornerClicks = 0;
  var cornerClickTimer = null;
  var toastTimer = null;
  var cornerTagEl = document.getElementById('corner-tag');
  var devToast = document.getElementById('dev-toast');
  var devModalOverlay = document.getElementById('dev-modal-overlay');
  var btnModalClose = document.getElementById('btn-modal-close');

  function showDevToast(msg) {
    if (!devToast) return;
    devToast.textContent = msg;
    devToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      devToast.classList.remove('show');
    }, 2200);
  }

  function openDevModal() {
    if (!devModalOverlay) return;
    devModalOverlay.classList.add('open');
    devModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    refreshClerkAuthState();
  }

  function closeDevModal() {
    if (!devModalOverlay) return;
    devModalOverlay.classList.remove('open');
    devModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btnModalClose) {
    btnModalClose.addEventListener('click', closeDevModal);
  }

  if (devModalOverlay) {
    devModalOverlay.addEventListener('click', function (e) {
      if (e.target === devModalOverlay) {
        closeDevModal();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && devModalOverlay && devModalOverlay.classList.contains('open')) {
      closeDevModal();
    }
  });

  if (cornerTagEl) {
    cornerTagEl.addEventListener('click', function (e) {
      if (e) e.preventDefault();
      cornerClicks++;
      clearTimeout(cornerClickTimer);

      if (cornerClicks >= 10) {
        cornerClicks = 0;
        showDevToast('developer settings unlocked');
        setTimeout(function () {
          openDevModal();
        }, 600);
        return;
      }

      cornerClickTimer = setTimeout(function () {
        cornerClicks = 0;
      }, 3000);
    });
  }

  /* ─── Global Modal Rich Formatting Helper ─── */
  window.applyModalFormat = function (textareaId, prefix, suffix) {
    var el = document.getElementById(textareaId);
    if (!el) return;
    var start = el.selectionStart;
    var end = el.selectionEnd;
    var val = el.value;
    var selected = val.substring(start, end) || 'text';
    var replacement = prefix + selected + suffix;
    el.value = val.substring(0, start) + replacement + val.substring(end);
    el.focus();
    el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    el.dispatchEvent(new Event('input'));
  };

  /* ─── Strictly Role-Based Access Control: ONLY users with role: "admin" or verified owner email can access ─── */
  function isUserAuthorized(user) {
    if (!user) return false;

    var meta = user.publicMetadata || {};
    var metaRole = String(meta.role || '').toLowerCase().trim();
    if (metaRole === 'admin') return true;

    var userEmail = (user.primaryEmailAddress && user.primaryEmailAddress.emailAddress)
      ? user.primaryEmailAddress.emailAddress.toLowerCase().trim()
      : '';

    var allowedUsers = [];
    if (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.authorized_users) && CONFIG.authorized_users.length > 0) {
      allowedUsers = CONFIG.authorized_users.map(function (u) { return String(u).toLowerCase().trim(); });
    }
    var adminEmail = (typeof CONFIG !== 'undefined' && CONFIG.email)
      ? CONFIG.email.toLowerCase().trim()
      : 'ayankhan84510@gmail.com';

    if (adminEmail && allowedUsers.indexOf(adminEmail) === -1) {
      allowedUsers.push(adminEmail);
    }

    if (userEmail && allowedUsers.indexOf(userEmail) !== -1) {
      return true;
    }

    return false;
  }

  var isModalFormLoadedForUserId = null;

  function refreshClerkAuthState() {
    var authView = document.getElementById('modal-auth-view');
    var deniedView = document.getElementById('modal-denied-view');
    var customizerView = document.getElementById('modal-customizer-view');
    var userBtnTarget = document.getElementById('modal-clerk-user-btn');
    var deniedUserName = document.getElementById('denied-user-name');
    var sessionText = document.getElementById('modal-session-text');

    if (!authView || !deniedView || !customizerView) return;

    if (window.Clerk && window.Clerk.user) {
      var user = window.Clerk.user;
      var identifier = user.primaryEmailAddress
        ? user.primaryEmailAddress.emailAddress
        : (user.username || 'User');

      if (userBtnTarget && !userBtnTarget.hasChildNodes()) {
        window.Clerk.mountUserButton(userBtnTarget);
      }

      if (isUserAuthorized(user)) {
        // Authorized: Unlock full customizer
        authView.style.display = 'none';
        deniedView.style.display = 'none';
        customizerView.style.display = 'block';
        if (sessionText) sessionText.textContent = 'Authorized: ' + identifier;

        // Only populate the modal fields once when the admin logs in.
        // Do NOT overwrite user inputs when Clerk listener fires on tab switch or window focus!
        if (isModalFormLoadedForUserId !== user.id) {
          loadModalCustomizer();
          isModalFormLoadedForUserId = user.id;
        }
      } else {
        isModalFormLoadedForUserId = null;
        // Unauthorized: Deny access completely
        authView.style.display = 'none';
        customizerView.style.display = 'none';
        // Security: clear all inputs in modal customizer
        var modalInputs = customizerView.querySelectorAll('input, textarea');
        modalInputs.forEach(function (inp) { inp.value = ''; });

        deniedView.style.display = 'flex';
        if (deniedUserName) deniedUserName.textContent = identifier;

        var signoutBtn = document.getElementById('btn-denied-signout');
        if (signoutBtn) {
          signoutBtn.onclick = function () {
            window.Clerk.signOut().then(function () {
              refreshClerkAuthState();
            });
          };
        }
      }
    } else {
      isModalFormLoadedForUserId = null;
      // Signed Out: Render Clerk sign in popup
      customizerView.style.display = 'none';
      deniedView.style.display = 'none';
      authView.style.display = 'flex';

      var signInTarget = document.getElementById('modal-clerk-sign-in');
      if (window.Clerk && signInTarget && !signInTarget.hasChildNodes() && typeof window.Clerk.mountSignIn === 'function') {
        try {
          window.Clerk.mountSignIn(signInTarget);
        } catch (_) { }
      }
    }
  }



  /* ─── Modal Customizer Field Sync & Instant Apply ─── */

  /* Holds the base64 data-URL of a newly picked avatar (or null = no change) */
  var pendingAvatarData = null;

  function parseGitHubRepo(input) {
    if (!input) return null;
    var s = input.trim().replace(/\.git$/i, '').replace(/\/+$/, '');
    var m = s.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\s#?]+)\/([^\/\s#?]+)/i);
    if (m) {
      return { owner: m[1], repo: m[2] };
    }
    var m2 = s.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
    if (m2) {
      return { owner: m2[1], repo: m2[2] };
    }
    return null;
  }

  function autoFetchGitHubRepo(card) {
    var ghInput = card.querySelector('.m-proj-input-github');
    var statusEl = card.querySelector('.m-gh-status');
    if (!ghInput) return;
    var val = ghInput.value.trim();
    if (!val) return;

    var repoInfo = parseGitHubRepo(val);
    if (!repoInfo) {
      if (statusEl) {
        statusEl.textContent = 'Invalid GitHub URL';
        statusEl.style.color = 'var(--red)';
        statusEl.style.display = 'inline';
      }
      return;
    }

    if (statusEl) {
      statusEl.textContent = 'fetching repo details...';
      statusEl.style.color = 'var(--ink-faint)';
      statusEl.style.display = 'inline';
    }

    fetch('https://api.github.com/repos/' + repoInfo.owner + '/' + repoInfo.repo)
      .then(function (r) {
        if (!r.ok) throw new Error('Repo not found or private');
        return r.json();
      })
      .then(function (data) {
        var titleInp = card.querySelector('.m-proj-input-title');
        var tagInp = card.querySelector('.m-proj-input-tag');
        var urlInp = card.querySelector('.m-proj-input-url');
        var descInp = card.querySelector('.m-proj-input-desc');

        if (titleInp) {
          titleInp.value = formatProjectName(data.name);
        }

        if (descInp && data.description) {
          descInp.value = data.description;
        }

        if (tagInp && data.language) {
          tagInp.value = data.language;
        }

        if (urlInp) {
          if (data.homepage && data.homepage.trim()) {
            urlInp.value = data.homepage.trim();
          } else if (!urlInp.value || !urlInp.value.trim()) {
            urlInp.value = data.html_url;
          }
        }

        if (statusEl) {
          statusEl.textContent = '✓ Auto-filled!';
          statusEl.style.color = '#22c07d';
          statusEl.style.display = 'inline';
          setTimeout(function () {
            statusEl.style.display = 'none';
          }, 3500);
        }
      })
      .catch(function () {
        if (statusEl) {
          statusEl.textContent = 'Could not fetch (not found / rate-limited)';
          statusEl.style.color = 'var(--red)';
          statusEl.style.display = 'inline';
        }
      });
  }

  function createProjectCardElement(proj, index) {
    var p = proj || {};
    var card = document.createElement('div');
    card.className = 'm-proj-card';
    card.innerHTML =
      '<div class="m-proj-card-header">' +
        '<span class="m-proj-card-title">PROJECT #' + (index + 1) + '</span>' +
        '<button type="button" class="m-proj-del-btn" title="Remove this project">✕ Remove</button>' +
      '</div>' +
      '<div class="m-field-group" style="margin-bottom:8px;">' +
        '<div style="display:flex; align-items:center; justify-content:space-between;">' +
          '<label class="m-field-label">GitHub Repo URL (Paste to auto-fill ✨)</label>' +
          '<span class="m-gh-status" style="font-size:0.72rem; display:none;"></span>' +
        '</div>' +
        '<div style="display:flex; gap:6px;">' +
          '<input type="text" class="m-field-input m-proj-input-github" placeholder="https://github.com/owner/repository" style="flex:1;">' +
          '<button type="button" class="m-toolbar-btn m-btn-fetch-gh" style="white-space:nowrap; padding:0 10px; font-size:0.75rem; border-color:var(--red); color:var(--ink);">Fetch</button>' +
        '</div>' +
      '</div>' +
      '<div class="m-grid-2">' +
        '<div class="m-field-group" style="margin-bottom:6px;">' +
          '<label class="m-field-label">Title / Name</label>' +
          '<input type="text" class="m-field-input m-proj-input-title" placeholder="Project Name">' +
        '</div>' +
        '<div class="m-field-group" style="margin-bottom:6px;">' +
          '<label class="m-field-label">Tag / Tech</label>' +
          '<input type="text" class="m-field-input m-proj-input-tag" placeholder="e.g. React, Next.js, CSS">' +
        '</div>' +
      '</div>' +
      '<div class="m-field-group" style="margin-bottom:6px;">' +
        '<label class="m-field-label">Live Website / Demo URL</label>' +
        '<input type="text" class="m-field-input m-proj-input-url" placeholder="https://your-site.vercel.app">' +
      '</div>' +
      '<div class="m-field-group" style="margin-bottom:0;">' +
        '<label class="m-field-label">Description</label>' +
        '<input type="text" class="m-field-input m-proj-input-desc" placeholder="Short description of your project">' +
      '</div>';

    var ghInp = card.querySelector('.m-proj-input-github');
    var fetchBtn = card.querySelector('.m-btn-fetch-gh');
    var titleInp = card.querySelector('.m-proj-input-title');
    var tagInp = card.querySelector('.m-proj-input-tag');
    var urlInp = card.querySelector('.m-proj-input-url');
    var descInp = card.querySelector('.m-proj-input-desc');

    if (ghInp) {
      ghInp.value = p.github_url || p.html_url || '';
      ghInp.addEventListener('paste', function () {
        setTimeout(function () { autoFetchGitHubRepo(card); }, 80);
      });
      ghInp.addEventListener('change', function () {
        autoFetchGitHubRepo(card);
      });
    }

    if (fetchBtn) {
      fetchBtn.addEventListener('click', function () {
        autoFetchGitHubRepo(card);
      });
    }

    if (titleInp) titleInp.value = p.title || p.name || '';
    if (tagInp) tagInp.value = p.tag || p.language || 'Project';
    if (urlInp) urlInp.value = p.url || p.homepage || '';
    if (descInp) descInp.value = p.description || '';

    var delBtn = card.querySelector('.m-proj-del-btn');
    if (delBtn) {
      delBtn.addEventListener('click', function () {
        card.remove();
        refreshProjectCardNumbers();
      });
    }

    return card;
  }

  function refreshProjectCardNumbers() {
    var cards = document.querySelectorAll('#m-projects-list .m-proj-card');
    cards.forEach(function (c, idx) {
      var titleEl = c.querySelector('.m-proj-card-title');
      if (titleEl) titleEl.textContent = 'PROJECT #' + (idx + 1);
    });
  }

  function renderModalProjectList(projects) {
    var container = document.getElementById('m-projects-list');
    if (!container) return;
    container.innerHTML = '';
    var list = (Array.isArray(projects) && projects.length) ? projects : [];
    list.forEach(function (proj, idx) {
      container.appendChild(createProjectCardElement(proj, idx));
    });
  }

  /* ── Dynamic Additional Social Media Links in Modal ── */
  function createModalSocialLinkCard(link, index) {
    var item = link || {};
    var platform = item.platform || 'LinkedIn';
    var title = item.title || platform;
    var url = item.url || '';
    var icon = item.icon || resolveIconKey(platform, '');

    var card = document.createElement('div');
    card.className = 'm-social-card';
    card.style.cssText = 'padding:10px 12px; background:var(--bg); border:1px solid var(--line); border-radius:var(--radius-sm); display:flex; flex-direction:column; gap:8px;';

    var optionsHtml = '';
    var customOptionsHtml = '';
    var found = false;
    var selectedLabel = platform;
    var selectedIcon = resolveIconKey(platform, '');

    SOCIAL_PRESETS.forEach(function (p) {
      var isSel = (platform === p.id);
      if (isSel) {
        found = true;
        selectedLabel = p.label;
        selectedIcon = p.icon;
      }
      optionsHtml += '<option value="' + p.id + '"' + (isSel ? ' selected' : '') + '>' + p.label + '</option>';
      customOptionsHtml +=
        '<div class="custom-select-option ' + (isSel ? 'selected' : '') + '" data-val="' + p.id + '">' +
          '<div class="opt-left">' +
            '<iconify-icon icon="' + p.icon + '" width="14" height="14"></iconify-icon>' +
            '<span>' + p.label + '</span>' +
          '</div>' +
          '<span class="opt-check">' + (isSel ? '✓' : '') + '</span>' +
        '</div>';
    });
    if (!found) {
      optionsHtml += '<option value="Custom" selected>Custom</option>';
      selectedLabel = 'Custom';
      selectedIcon = 'lucide:link';
      customOptionsHtml +=
        '<div class="custom-select-option selected" data-val="Custom">' +
          '<div class="opt-left">' +
            '<iconify-icon icon="lucide:link" width="14" height="14"></iconify-icon>' +
            '<span>Custom</span>' +
          '</div>' +
          '<span class="opt-check">✓</span>' +
        '</div>';
    }

    var isLucide = (icon.indexOf('lucide:') === 0);
    var isSimple = !isLucide;
    var qName = icon.indexOf(':') !== -1 ? icon.split(':')[1] : icon;
    var browseUrl = isLucide
      ? 'https://lucide.dev/icons/?search=' + encodeURIComponent(qName)
      : 'https://simpleicons.org/?q=' + encodeURIComponent(qName);

    card.innerHTML =
      '<div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">' +
        '<div style="display:flex; align-items:center; gap:8px; flex:1;">' +
          '<div class="m-social-icon-badge" title="Live Icon Preview">' +
            '<iconify-icon icon="' + icon + '" width="18" height="18"></iconify-icon>' +
          '</div>' +
          '<div class="custom-select-wrap">' +
            '<select class="m-field-input m-social-select-platform" style="display:none;" tabindex="-1">' +
              optionsHtml +
            '</select>' +
            '<button type="button" class="custom-select-trigger" aria-haspopup="listbox" aria-expanded="false" title="Choose platform">' +
              '<span class="custom-select-label">' +
                '<iconify-icon icon="' + selectedIcon + '" width="14" height="14" class="custom-select-icon"></iconify-icon>' +
                '<span class="custom-select-text">' + escapeHtml(selectedLabel) + '</span>' +
              '</span>' +
              '<svg class="custom-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="m6 9 6 6 6-6"/>' +
              '</svg>' +
            '</button>' +
            '<div class="custom-select-dropdown" role="listbox" style="display:none;">' +
              customOptionsHtml +
            '</div>' +
          '</div>' +
          '<input type="text" class="m-field-input m-social-input-title" placeholder="Display Title" value="' + escapeHtml(title) + '" style="padding:6px 10px; font-size:0.78rem; flex:1;">' +
        '</div>' +
        '<button type="button" class="m-social-del-btn m-toolbar-btn" style="color:var(--red); border-color:rgba(255,42,95,0.3); padding:4px 8px; font-size:0.72rem; cursor:pointer;" title="Remove this link">✕ Remove</button>' +
      '</div>' +
      '<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
        '<input type="text" class="m-field-input m-social-input-url" placeholder="https://..." value="' + escapeHtml(url) + '" style="padding:6px 10px; font-size:0.78rem; flex:2; min-width:180px;">' +
        '<div style="display:flex; align-items:center; gap:6px; flex:1.2; min-width:260px;">' +
          '<input type="text" class="m-field-input m-social-input-icon" placeholder="Icon ID" value="' + escapeHtml(icon) + '" style="padding:6px 10px; font-size:0.75rem; flex:1; font-family:var(--font-mono);" title="Simple Icons or Lucide icon identifier">' +
          '<div class="icon-pack-switch" title="Switch icon style: Simple Icons (official glyph) vs Lucide Icons (clean stroke)">' +
            '<button type="button" class="pack-switch-btn btn-pack-simple ' + (isSimple ? 'active' : '') + '" title="Switch to Simple Icons official brand glyph (https://simpleicons.org)">' +
              '<iconify-icon icon="simple-icons:simpleicons" width="11" height="11"></iconify-icon>' +
              '<span>Simple</span>' +
            '</button>' +
            '<button type="button" class="pack-switch-btn btn-pack-lucide ' + (isLucide ? 'active' : '') + '" title="Switch to Lucide modern outline icon (https://lucide.dev/icons/)">' +
              '<iconify-icon icon="lucide:feather" width="11" height="11"></iconify-icon>' +
              '<span>Lucide</span>' +
            '</button>' +
          '</div>' +
          '<a href="' + browseUrl + '" target="_blank" rel="noopener noreferrer" class="pack-browse-link" title="Open icon catalog in new tab">' +
            '<span>↗</span>' +
          '</a>' +
        '</div>' +
      '</div>';

    var badge = card.querySelector('.m-social-icon-badge');
    var sel = card.querySelector('.m-social-select-platform');
    var titleInp = card.querySelector('.m-social-input-title');
    var urlInp = card.querySelector('.m-social-input-url');
    var iconInp = card.querySelector('.m-social-input-icon');
    var delBtn = card.querySelector('.m-social-del-btn');
    var btnSimple = card.querySelector('.btn-pack-simple');
    var btnLucide = card.querySelector('.btn-pack-lucide');
    var browseLink = card.querySelector('.pack-browse-link');

    var cWrap = card.querySelector('.custom-select-wrap');
    var cTrigger = card.querySelector('.custom-select-trigger');
    var cDropdown = card.querySelector('.custom-select-dropdown');
    var cText = card.querySelector('.custom-select-text');
    var cIcon = card.querySelector('.custom-select-icon');

    function toggleCustomDropdown(open) {
      var isOpen = (typeof open === 'boolean') ? open : (cDropdown.style.display === 'none');
      if (isOpen) {
        document.querySelectorAll('.custom-select-wrap.open').forEach(function (w) {
          if (w !== cWrap) {
            w.classList.remove('open');
            var d = w.querySelector('.custom-select-dropdown');
            if (d) d.style.display = 'none';
            var pCard = w.closest('.m-social-card');
            if (pCard) pCard.style.zIndex = '';
          }
        });
        cDropdown.style.display = 'block';
        cWrap.classList.add('open');
        cTrigger.setAttribute('aria-expanded', 'true');
        card.style.zIndex = '200';
      } else {
        cDropdown.style.display = 'none';
        cWrap.classList.remove('open');
        cTrigger.setAttribute('aria-expanded', 'false');
        card.style.zIndex = '';
      }
    }

    if (cTrigger) {
      cTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleCustomDropdown();
      });
    }

    cDropdown.querySelectorAll('.custom-select-option').forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.stopPropagation();
        var val = this.getAttribute('data-val');
        sel.value = val;

        cDropdown.querySelectorAll('.custom-select-option').forEach(function (o) {
          var isThis = (o.getAttribute('data-val') === val);
          o.classList.toggle('selected', isThis);
          var chk = o.querySelector('.opt-check');
          if (chk) chk.textContent = isThis ? '✓' : '';
        });

        var optText = this.querySelector('.opt-left span') ? this.querySelector('.opt-left span').textContent : val;
        var optIconEl = this.querySelector('iconify-icon');
        var optIcon = optIconEl ? optIconEl.getAttribute('icon') : 'lucide:globe';
        cText.textContent = optText;
        cIcon.setAttribute('icon', optIcon);

        toggleCustomDropdown(false);
        sel.dispatchEvent(new Event('change'));
      });
    });

    function syncCustomTrigger(val) {
      cDropdown.querySelectorAll('.custom-select-option').forEach(function (o) {
        var isThis = (o.getAttribute('data-val') === val);
        o.classList.toggle('selected', isThis);
        var chk = o.querySelector('.opt-check');
        if (chk) chk.textContent = isThis ? '✓' : '';
        if (isThis) {
          var optText = o.querySelector('.opt-left span');
          var optIcon = o.querySelector('iconify-icon');
          if (optText) cText.textContent = optText.textContent;
          if (optIcon) cIcon.setAttribute('icon', optIcon.getAttribute('icon'));
        }
      });
    }

    function updateBadge() {
      var ic = resolveIconKey(sel.value, iconInp.value);
      badge.innerHTML = '<iconify-icon icon="' + ic + '" width="18" height="18"></iconify-icon>';
      var curIsLucide = (ic.indexOf('lucide:') === 0);
      var q = ic.indexOf(':') !== -1 ? ic.split(':')[1] : ic;
      if (btnLucide && btnSimple) {
        if (curIsLucide) {
          btnLucide.classList.add('active');
          btnSimple.classList.remove('active');
          if (browseLink) {
            browseLink.href = 'https://lucide.dev/icons/?search=' + encodeURIComponent(q);
            browseLink.title = 'Browse "' + q + '" on lucide.dev/icons/';
          }
        } else {
          btnSimple.classList.add('active');
          btnLucide.classList.remove('active');
          if (browseLink) {
            browseLink.href = 'https://simpleicons.org/?q=' + encodeURIComponent(q);
            browseLink.title = 'Browse "' + q + '" on simpleicons.org';
          }
        }
      }
    }

    if (btnSimple) {
      btnSimple.addEventListener('click', function () {
        var newIcon = switchIconLibrary(iconInp.value, 'simple-icons', sel.value);
        iconInp.value = newIcon;
        updateBadge();
      });
    }

    if (btnLucide) {
      btnLucide.addEventListener('click', function () {
        var newIcon = switchIconLibrary(iconInp.value, 'lucide', sel.value);
        iconInp.value = newIcon;
        updateBadge();
      });
    }

    if (sel) {
      sel.addEventListener('change', function () {
        var selectedId = this.value;
        syncCustomTrigger(selectedId);
        for (var j = 0; j < SOCIAL_PRESETS.length; j++) {
          if (SOCIAL_PRESETS[j].id === selectedId) {
            if (selectedId !== 'Custom') {
              titleInp.value = SOCIAL_PRESETS[j].label;
              var baseIcon = SOCIAL_PRESETS[j].icon;
              if (btnLucide && btnLucide.classList.contains('active')) {
                iconInp.value = switchIconLibrary(baseIcon, 'lucide', selectedId);
              } else {
                iconInp.value = switchIconLibrary(baseIcon, 'simple-icons', selectedId);
              }
              if (!urlInp.value || urlInp.value.indexOf('http') === -1) {
                urlInp.placeholder = SOCIAL_PRESETS[j].url;
              }
            }
            break;
          }
        }
        updateBadge();
      });
    }

    if (iconInp) {
      iconInp.addEventListener('input', updateBadge);
    }

    if (delBtn) {
      delBtn.addEventListener('click', function () {
        card.remove();
      });
    }

    return card;
  }

  function renderModalSocialList(links) {
    var container = document.getElementById('m-social-links-list');
    if (!container) return;
    container.innerHTML = '';
    var list = (Array.isArray(links) && links.length) ? links : [];
    list.forEach(function (link, idx) {
      container.appendChild(createModalSocialLinkCard(link, idx));
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.custom-select-wrap')) {
      document.querySelectorAll('.custom-select-wrap.open').forEach(function (w) {
        w.classList.remove('open');
        var d = w.querySelector('.custom-select-dropdown');
        if (d) d.style.display = 'none';
        var pCard = w.closest('.m-social-card');
        if (pCard) pCard.style.zIndex = '';
      });
    }
  });

  var btnAddModalSocial = document.getElementById('m-btn-add-social');
  if (btnAddModalSocial) {
    btnAddModalSocial.addEventListener('click', function () {
      var container = document.getElementById('m-social-links-list');
      if (!container) return;
      var count = container.querySelectorAll('.m-social-card').length;
      var newCard = createModalSocialLinkCard({ platform: 'LinkedIn', title: 'LinkedIn', url: '' }, count);
      container.appendChild(newCard);
      var urlInp = newCard.querySelector('.m-social-input-url');
      if (urlInp) urlInp.focus();
    });
  }

  function getActiveProjects() {
    var custom = null;
    try {
      var saved = localStorage.getItem('portfolio_custom_config');
      if (saved) custom = JSON.parse(saved);
    } catch (_) { }

    if (custom && Array.isArray(custom.projects) && custom.projects.length > 0) {
      return custom.projects;
    }
    if (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.projects) && CONFIG.projects.length > 0) {
      return CONFIG.projects;
    }
    return null;
  }

  function loadModalCustomizer() {
    var cfg = Object.assign({}, typeof CONFIG !== 'undefined' ? CONFIG : {});
    try {
      var saved = localStorage.getItem('portfolio_custom_config');
      if (saved) Object.assign(cfg, JSON.parse(saved));
    } catch (_) { }

    var siteNameEl = document.getElementById('m-cust-sitename');
    var accentEl = document.getElementById('m-cust-accent');
    var bioEl = document.getElementById('m-cust-bio');
    var introEl = document.getElementById('m-cust-intro');
    var ghEl = document.getElementById('m-cust-github');
    var tgEl = document.getElementById('m-cust-telegram');
    var xEl = document.getElementById('m-cust-x');
    var emailEl = document.getElementById('m-cust-email');

    if (siteNameEl) siteNameEl.value = cfg.site_name || '';
    if (accentEl) accentEl.value = cfg.accent_letter || 'x';
    if (bioEl) bioEl.value = cfg.site_desc || '';
    if (introEl) introEl.value = cfg.intro || '';
    if (ghEl) ghEl.value = cfg.github || '';
    if (tgEl) tgEl.value = cfg.telegram || '';
    if (xEl) xEl.value = cfg.x || '';
    if (emailEl) emailEl.value = cfg.email || '';

    /* Render projects in visual manager */
    var activeProjs = getActiveProjects() || [];
    renderModalProjectList(activeProjs);

    /* Render additional social links */
    var activeSocial = [];
    if (cfg.social_links && Array.isArray(cfg.social_links) && cfg.social_links.length > 0) {
      activeSocial = cfg.social_links;
    } else if (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.social_links) && CONFIG.social_links.length > 0) {
      activeSocial = CONFIG.social_links;
    }
    renderModalSocialList(activeSocial);

    /* Restore saved avatar into modal preview */
    pendingAvatarData = null;
    setModalAvatarPreview((cfg.avatar_url && cfg.avatar_url.trim()) ? cfg.avatar_url.trim() : 'Diluc.svg');

    /* Restore saved favicon into modal preview */
    pendingFaviconData = null;
    setModalFaviconPreview((cfg.favicon_url && cfg.favicon_url.trim()) ? cfg.favicon_url.trim() : 'favicon.png');

    updateModalPreviews();

    var themeCfg = cfg.theme_config || {};
    currentThemeMode = themeCfg.mode || root.getAttribute('data-theme') || (cfg.default_theme || 'dark');
    currentAccentColor = themeCfg.accent_color || cfg.accent_color || '#ff2a5f';
    currentBgPreset = themeCfg.bg_preset || 'midnight';
    applyThemeColors(currentAccentColor, currentBgPreset, currentThemeMode);
    updateModalThemeUI();
  }

  function setModalAccentColor(hex) {
    if (!hex || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return;
    currentAccentColor = hex.toLowerCase();
    applyThemeColors(currentAccentColor, currentBgPreset, currentThemeMode);
    updateModalThemeUI();
  }

  function setModalBgPreset(presetName) {
    if (!BG_PRESETS[presetName]) return;
    currentBgPreset = presetName;
    applyThemeColors(currentAccentColor, currentBgPreset, currentThemeMode);
    updateModalThemeUI();
  }

  var mRadioDark = document.getElementById('m-radio-theme-dark');
  if (mRadioDark) {
    mRadioDark.addEventListener('change', function () {
      if (this.checked) applyTheme('dark');
    });
  }
  var mRadioLight = document.getElementById('m-radio-theme-light');
  if (mRadioLight) {
    mRadioLight.addEventListener('change', function () {
      if (this.checked) applyTheme('light');
    });
  }

  var mSwatchesContainer = document.getElementById('m-accent-swatches-container');
  if (mSwatchesContainer) {
    mSwatchesContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.accent-swatch-btn');
      if (!btn) return;
      var c = btn.getAttribute('data-color');
      if (c) setModalAccentColor(c);
    });
  }

  var mColorPicker = document.getElementById('m-accent-color-picker');
  if (mColorPicker) {
    mColorPicker.addEventListener('input', function () {
      setModalAccentColor(this.value);
    });
    mColorPicker.addEventListener('change', function () {
      setModalAccentColor(this.value);
    });
  }

  var mHexInput = document.getElementById('m-accent-hex-input');
  if (mHexInput) {
    mHexInput.addEventListener('input', function () {
      var val = this.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val)) {
        setModalAccentColor(val);
      }
    });
  }

  var mBgContainer = document.getElementById('m-bg-presets-container');
  if (mBgContainer) {
    mBgContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.bg-preset-btn');
      if (!btn) return;
      var p = btn.getAttribute('data-preset');
      if (p) setModalBgPreset(p);
    });
  }

  var mResetBtn = document.getElementById('m-btn-reset-theme');
  if (mResetBtn) {
    mResetBtn.addEventListener('click', function () {
      currentAccentColor = '#ff2a5f';
      currentBgPreset = 'midnight';
      applyTheme('dark');
    });
  }

  function updateModalPreviews() {
    var name = (document.getElementById('m-cust-sitename') || {}).value || 'khxaiyan';
    var accent = (document.getElementById('m-cust-accent') || {}).value || 'x';
    var wordmarkPrev = document.getElementById('m-wordmark-preview');
    if (wordmarkPrev) {
      wordmarkPrev.innerHTML = formatWordmark(name, accent);
    }

    var bioVal = (document.getElementById('m-cust-bio') || {}).value || '';
    var bioPrev = document.getElementById('m-bio-preview');
    if (bioPrev) {
      bioPrev.innerHTML = parseRichText(bioVal || 'developer in active building mode.');
    }

    var introVal = (document.getElementById('m-cust-intro') || {}).value || '';
    var introPrev = document.getElementById('m-intro-preview');
    if (introPrev) {
      introPrev.innerHTML = parseRichText(introVal || 'Passionate developer specializing in web apps.');
    }

    var favTabTitle = document.getElementById('m-favicon-tab-title');
    if (favTabTitle) {
      favTabTitle.textContent = name;
    }
  }

  ['m-cust-sitename', 'm-cust-accent', 'm-cust-bio', 'm-cust-intro'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateModalPreviews);
  });

  /* ── Add Project Button Handler ── */
  var btnAddProject = document.getElementById('m-btn-add-project');
  if (btnAddProject) {
    btnAddProject.addEventListener('click', function () {
      var container = document.getElementById('m-projects-list');
      if (!container) return;
      var count = container.querySelectorAll('.m-proj-card').length;
      var newCard = createProjectCardElement({ title: '', tag: 'Project', url: '', github_url: '', description: '' }, count);
      container.appendChild(newCard);
      var ghInp = newCard.querySelector('.m-proj-input-github');
      if (ghInp) ghInp.focus();
    });
  }

  /* ── Avatar helpers & format handling ── */
  function applyPageFavicon(url) {
    if (!url) url = 'favicon.png';
    var links = document.querySelectorAll("link[rel*='icon']");
    if (!links || links.length === 0) {
      var link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
      links = [link];
    }
    var type = 'image/png';
    if (url.startsWith('data:image/svg') || /\.svg(\?.*)?$/i.test(url)) {
      type = 'image/svg+xml';
    } else if (url.startsWith('data:image/x-icon') || /\.ico(\?.*)?$/i.test(url)) {
      type = 'image/x-icon';
    } else if (url.startsWith('data:image/gif') || /\.gif(\?.*)?$/i.test(url)) {
      type = 'image/gif';
    } else if (url.startsWith('data:image/png') || /\.png(\?.*)?$/i.test(url)) {
      type = 'image/png';
    }
    links.forEach(function (l) {
      l.type = type;
      l.href = url;
    });
    var appleLink = document.querySelector("link[rel='apple-touch-icon']");
    if (appleLink) appleLink.href = url;
  }

  function emojiToSvgDataUrl(emoji) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">' + emoji + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function isWebmSource(url) {
    return typeof url === 'string' && (url.startsWith('data:video/webm') || /\.webm(\?.*)?$/i.test(url));
  }

  function setPageAvatar(url) {
    var wrap = document.getElementById('avatar-wrap');
    var currentEl = wrap ? wrap.querySelector('.avatar-img, video.avatar-img') : null;
    if (!wrap) return;
    var isWebm = isWebmSource(url);
    if (isWebm) {
      if (currentEl && currentEl.tagName.toLowerCase() === 'video') {
        currentEl.src = url;
      } else {
        var video = document.createElement('video');
        video.className = 'avatar-img';
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('draggable', 'false');
        video.style.pointerEvents = 'none';
        if (currentEl && currentEl.parentNode) {
          currentEl.parentNode.replaceChild(video, currentEl);
        } else {
          wrap.insertBefore(video, wrap.firstChild);
        }
      }
    } else {
      if (currentEl && currentEl.tagName.toLowerCase() === 'img') {
        currentEl.src = url || 'Diluc.svg';
        currentEl.setAttribute('draggable', 'false');
      } else {
        var img = document.createElement('img');
        img.className = 'avatar-img';
        img.src = url || 'Diluc.svg';
        img.alt = 'khxaiyan';
        img.setAttribute('width', '88');
        img.setAttribute('height', '88');
        img.setAttribute('loading', 'eager');
        img.setAttribute('draggable', 'false');
        img.style.pointerEvents = 'none';
        if (currentEl && currentEl.parentNode) {
          currentEl.parentNode.replaceChild(img, currentEl);
        } else {
          wrap.insertBefore(img, wrap.firstChild);
        }
      }
    }
  }

  function setModalAvatarPreview(url) {
    var wrap = document.getElementById('m-avatar-upload-wrap');
    var currentEl = document.getElementById('m-avatar-preview');
    if (!wrap) return;
    var isWebm = isWebmSource(url);
    if (isWebm) {
      if (currentEl && currentEl.tagName.toLowerCase() === 'video') {
        currentEl.src = url;
      } else {
        var v = document.createElement('video');
        v.id = 'm-avatar-preview';
        v.src = url;
        v.autoplay = true;
        v.loop = true;
        v.muted = true;
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.setAttribute('draggable', 'false');
        v.style.cssText = 'width:88px; height:88px; border-radius:50%; object-fit:cover; border:2.5px solid var(--line); display:block; pointer-events:none; -webkit-user-drag:none; user-select:none;';
        if (currentEl && currentEl.parentNode) {
          currentEl.parentNode.replaceChild(v, currentEl);
        } else {
          wrap.insertBefore(v, wrap.firstChild);
        }
      }
    } else {
      if (currentEl && currentEl.tagName.toLowerCase() === 'img') {
        currentEl.src = url || 'Diluc.svg';
        currentEl.setAttribute('draggable', 'false');
      } else {
        var img = document.createElement('img');
        img.id = 'm-avatar-preview';
        img.src = url || 'Diluc.svg';
        img.alt = 'Profile picture';
        img.setAttribute('draggable', 'false');
        img.style.cssText = 'width:88px; height:88px; border-radius:50%; object-fit:cover; border:2.5px solid var(--line); display:block; pointer-events:none; -webkit-user-drag:none; user-select:none;';
        if (currentEl && currentEl.parentNode) {
          currentEl.parentNode.replaceChild(img, currentEl);
        } else {
          wrap.insertBefore(img, wrap.firstChild);
        }
      }
    }
  }

  /* ── Avatar file upload (Instagram-style) ── */
  var pendingAvatarData = null;
  var avatarFileInput = document.getElementById('m-cust-avatar-file');
  var avatarWrap = document.getElementById('m-avatar-upload-wrap');
  var avatarOverlay = document.getElementById('m-avatar-overlay');

  if (avatarWrap && avatarOverlay) {
    avatarWrap.addEventListener('mouseenter', function () {
      avatarOverlay.style.opacity = '1';
    });
    avatarWrap.addEventListener('mouseleave', function () {
      avatarOverlay.style.opacity = '0';
    });
  }

  function processAvatarFile(file, callback) {
    if (!file) return;
    var type = (file.type || '').toLowerCase();
    var name = (file.name || '').toLowerCase();

    // 1. Vector (SVG), Animated (GIF), Video (WEBM): preserve directly without canvas flattening
    var isDirect = type === 'image/svg+xml' ||
                   type === 'image/gif' ||
                   type === 'video/webm' ||
                   /\.(svg|gif|webm)$/i.test(name);

    if (isDirect) {
      var directReader = new FileReader();
      directReader.onload = function (e) { callback(e.target.result); };
      directReader.readAsDataURL(file);
      return;
    }

    // 2. Raster images: JPG, PNG, WEBP, AVIF (auto center-crop 1:1, max 512x512)
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var maxDim = 512;
        var w = img.width;
        var h = img.height;
        var size = Math.min(w, h);
        var sx = (w - size) / 2;
        var sy = (h - size) / 2;
        var canvas = document.createElement('canvas');
        var outDim = Math.min(size, maxDim);
        canvas.width = outDim;
        canvas.height = outDim;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, outDim, outDim);

        var compressed;
        try {
          if (type === 'image/png' || type === 'image/webp' || type === 'image/avif') {
            compressed = canvas.toDataURL('image/webp', 0.92);
            if (!compressed || !compressed.startsWith('data:image/webp')) {
              compressed = canvas.toDataURL(type || 'image/png', 0.92);
            }
          } else {
            compressed = canvas.toDataURL('image/jpeg', 0.88);
          }
        } catch (err) {
          compressed = canvas.toDataURL('image/jpeg', 0.88);
        }
        callback(compressed || e.target.result);
      };
      img.onerror = function () {
        callback(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', function () {
      var file = avatarFileInput.files && avatarFileInput.files[0];
      if (!file) return;
      processAvatarFile(file, function (dataUrl) {
        pendingAvatarData = dataUrl;
        setModalAvatarPreview(pendingAvatarData);
      });
      avatarFileInput.value = '';
    });
  }

  /* ── Favicon file upload & management ── */
  var pendingFaviconData = null;
  var faviconFileInput = document.getElementById('m-cust-favicon-file');
  var faviconWrap = document.getElementById('m-favicon-upload-wrap');
  var faviconOverlay = document.getElementById('m-favicon-overlay');
  var faviconSyncAvatarBtn = document.getElementById('m-favicon-sync-avatar-btn');

  if (faviconWrap && faviconOverlay) {
    faviconWrap.addEventListener('mouseenter', function () {
      faviconOverlay.style.opacity = '1';
    });
    faviconWrap.addEventListener('mouseleave', function () {
      faviconOverlay.style.opacity = '0';
    });
  }

  function setModalFaviconPreview(url) {
    var thumb = document.getElementById('m-favicon-preview');
    var tabImg = document.getElementById('m-favicon-tab-img');
    var tabTitle = document.getElementById('m-favicon-tab-title');
    var siteNameVal = (document.getElementById('m-cust-sitename') || {}).value || 'khxaiyan';
    if (tabTitle) tabTitle.textContent = siteNameVal;

    var finalUrl = url || 'favicon.png';
    if (thumb) thumb.src = finalUrl;
    if (tabImg) tabImg.src = finalUrl;
    applyPageFavicon(finalUrl);
  }

  function processFaviconFile(file, callback) {
    if (!file) return;
    var type = (file.type || '').toLowerCase();
    var name = (file.name || '').toLowerCase();

    var isDirect = type === 'image/svg+xml' ||
                   type === 'image/x-icon' ||
                   type === 'image/vnd.microsoft.icon' ||
                   type === 'image/gif' ||
                   /\.(svg|ico|gif)$/i.test(name);

    if (isDirect) {
      var directReader = new FileReader();
      directReader.onload = function (e) { callback(e.target.result); };
      directReader.readAsDataURL(file);
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var size = Math.min(img.width, img.height);
        var sx = (img.width - size) / 2;
        var sy = (img.height - size) / 2;
        var canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 128, 128);
        var compressed = canvas.toDataURL('image/png');
        callback(compressed || e.target.result);
      };
      img.onerror = function () {
        callback(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (faviconFileInput) {
    faviconFileInput.addEventListener('change', function () {
      var file = faviconFileInput.files && faviconFileInput.files[0];
      if (!file) return;
      processFaviconFile(file, function (dataUrl) {
        pendingFaviconData = dataUrl;
        setModalFaviconPreview(pendingFaviconData);
      });
      faviconFileInput.value = '';
    });
  }

  if (faviconSyncAvatarBtn) {
    faviconSyncAvatarBtn.addEventListener('click', function () {
      var avatarSrc = pendingAvatarData;
      if (!avatarSrc) {
        var currentAvatarImg = document.getElementById('m-avatar-preview');
        avatarSrc = currentAvatarImg ? currentAvatarImg.src : 'Diluc.svg';
      }
      if (avatarSrc) {
        pendingFaviconData = avatarSrc;
        setModalFaviconPreview(pendingFaviconData);
      }
    });
  }

  var btnModalSave = document.getElementById('m-btn-save');
  if (btnModalSave) {
    btnModalSave.addEventListener('click', function () {
      if (!window.Clerk || !window.Clerk.user || !isUserAuthorized(window.Clerk.user)) {
        alert('Access Denied: Only authorized administrators can save changes.');
        return;
      }

      /* Collect projects from visual cards */
      var projCards = document.querySelectorAll('#m-projects-list .m-proj-card');
      var projectsList = [];
      var projectLinks = {};
      projCards.forEach(function (card) {
        var ghUrl = (card.querySelector('.m-proj-input-github') || {}).value || '';
        var title = (card.querySelector('.m-proj-input-title') || {}).value || '';
        var url = (card.querySelector('.m-proj-input-url') || {}).value || '';
        var desc = (card.querySelector('.m-proj-input-desc') || {}).value || '';
        var tag = (card.querySelector('.m-proj-input-tag') || {}).value || 'Project';
        if (title.trim()) {
          var trimmedTitle = title.trim();
          var slug = trimmedTitle.replace(/[^a-zA-Z0-9_-]+/g, '-');
          projectsList.push({
            title: trimmedTitle,
            name: slug,
            url: url.trim(),
            github_url: ghUrl.trim(),
            description: desc.trim(),
            tag: tag.trim() || 'Project',
            stars: 1
          });
          if (url.trim()) {
            projectLinks[slug] = url.trim();
            projectLinks[trimmedTitle] = url.trim();
          }
        }
      });

      /* Collect additional social links */
      var socialCards = document.querySelectorAll('#m-social-links-list .m-social-card');
      var socialLinks = [];
      socialCards.forEach(function (card) {
        var sel = card.querySelector('.m-social-select-platform');
        var titleInp = card.querySelector('.m-social-input-title');
        var urlInp = card.querySelector('.m-social-input-url');
        var iconInp = card.querySelector('.m-social-input-icon');
        var title = (titleInp && titleInp.value) ? titleInp.value.trim() : (sel ? sel.value : '');
        var url = (urlInp && urlInp.value) ? urlInp.value.trim() : '';
        var icon = (iconInp && iconInp.value) ? iconInp.value.trim() : '';
        var platform = sel ? sel.value : title;
        if (url) {
          if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
            url = 'https://' + url;
          }
          socialLinks.push({
            platform: platform,
            title: title || platform,
            url: url,
            icon: icon || resolveIconKey(platform, '')
          });
        }
      });

      /* Resolve avatar: use newly picked file data, or keep existing saved one */
      var existingAvatarUrl = (typeof CONFIG !== 'undefined' && CONFIG.avatar_url) ? CONFIG.avatar_url : 'Diluc.svg';
      var resolvedAvatar = (pendingAvatarData !== null) ? pendingAvatarData : existingAvatarUrl;

      /* Resolve favicon: newly picked file, or existing saved one */
      var existingFaviconUrl = (typeof CONFIG !== 'undefined' && CONFIG.favicon_url) ? CONFIG.favicon_url : 'favicon.png';
      var resolvedFavicon = (pendingFaviconData !== null) ? (pendingFaviconData || 'favicon.png') : existingFaviconUrl;

      var updated = {
        github: (document.getElementById('m-cust-github') || {}).value.trim(),
        x: (document.getElementById('m-cust-x') || {}).value.trim(),
        telegram: (document.getElementById('m-cust-telegram') || {}).value.trim(),
        email: (document.getElementById('m-cust-email') || {}).value.trim(),
        social_links: socialLinks,
        logo: 'Diluc.svg',
        avatar_url: resolvedAvatar,
        favicon_url: resolvedFavicon,
        site_name: (document.getElementById('m-cust-sitename') || {}).value.trim(),
        accent_letter: (document.getElementById('m-cust-accent') || {}).value.trim() || 'x',
        site_desc: (document.getElementById('m-cust-bio') || {}).value.trim(),
        seo_desc: (document.getElementById('m-cust-bio') || {}).value.trim(),
        intro: (document.getElementById('m-cust-intro') || {}).value.trim(),
        projects: projectsList,
        project_links: projectLinks,
        default_theme: currentThemeMode,
        accent_color: currentAccentColor,
        theme_config: {
          mode: currentThemeMode,
          accent_color: currentAccentColor,
          bg_preset: currentBgPreset
        },
        cf_analytics: (typeof CONFIG !== 'undefined' && CONFIG.cf_analytics) ? CONFIG.cf_analytics : false,
        web3forms_access_key: (typeof CONFIG !== 'undefined' && CONFIG.web3forms_access_key) ? CONFIG.web3forms_access_key : 'd36ee933-00cb-453e-aa38-b18ee60ce5d1',
        hcaptcha_sitekey: (typeof CONFIG !== 'undefined' && CONFIG.hcaptcha_sitekey) ? CONFIG.hcaptcha_sitekey : '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
        clerk_publishable_key: (typeof CONFIG !== 'undefined' && CONFIG.clerk_publishable_key) ? CONFIG.clerk_publishable_key : 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk',
        clerk_frontend_api: 'https://shining-turkey-1325.clerk.accounts.dev'
      };

      localStorage.setItem('portfolio_custom_config', JSON.stringify(updated));
      Object.assign(CONFIG, updated);
      applyThemeColors(currentAccentColor, currentBgPreset, currentThemeMode);
      applyPageFavicon(resolvedFavicon);
      pendingAvatarData = null; /* clear pending after save */
      pendingFaviconData = null;

      // Live update portfolio UI without reloading
      var wordmark = document.querySelector('.wordmark');
      if (wordmark && updated.site_name) {
        wordmark.innerHTML = formatWordmark(updated.site_name, updated.accent_letter);
      }
      var cornerTag = document.getElementById('corner-tag');
      if (cornerTag && updated.site_name) {
        cornerTag.innerHTML = '@' + formatWordmark(updated.site_name, updated.accent_letter);
      }
      var bioEl = document.querySelector('.bio');
      if (bioEl && updated.site_desc) {
        bioEl.innerHTML = parseRichText(updated.site_desc);
      }
      var introEl = document.getElementById('intro-text');
      if (introEl && updated.intro) {
        introEl.innerHTML = parseRichText(updated.intro);
      }
      renderChannelList(updated);

      /* Live apply projects directly to portfolio */
      if (projectsList.length > 0) {
        renderProjects(projectsList);
      } else {
        loadPinnedProjects();
      }

      /* Live apply avatar to page */
      setPageAvatar(updated.avatar_url || 'Diluc.svg');

      var saveStatus = document.getElementById('m-save-status');
      if (saveStatus) {
        saveStatus.style.display = 'block';
        setTimeout(function () {
          saveStatus.style.display = 'none';
        }, 3000);
      }
    });
  }

  // Initialize Clerk on page load
  window.addEventListener('load', async function () {
    var pubKey = (typeof CONFIG !== 'undefined' && CONFIG.clerk_publishable_key)
      ? CONFIG.clerk_publishable_key
      : 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk';

    if (window.Clerk) {
      try {
        await window.Clerk.load({
          publishableKey: pubKey,
          appearance: {
            variables: {
              colorPrimary: '#ff2a5f',
              colorBackground: '#131319',
              colorText: '#eef0f4',
              colorInputBackground: '#0a0a0e',
              colorInputText: '#eef0f4'
            }
          }
        });

        window.Clerk.addListener(function () {
          refreshClerkAuthState();
        });

        refreshClerkAuthState();
      } catch (err) {
        console.warn('Clerk load error:', err);
      }
    }
  });

  /* ─── Live GitHub Pinned Projects ─── */
  var projectsContainer = document.getElementById('projects-container');

  function formatStars(n) {
    if (!n) return '\u2605 0';
    if (n >= 1000) return '\u2605 ' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return '\u2605 ' + n;
  }

  function highlightCapitals(text) {
    return (text || '').replace(/([A-Z])/g, '<span class="glyph-5">$1</span>');
  }

  function formatProjectName(name) {
    if (!name) return '';
    return name
      .replace(/-Website$/i, '')
      .replace(/_/g, ' ')
      .replace(/-/g, ' ');
  }

  function normalizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    url = url.trim();
    if (!url) return '';
    // Security: Block javascript:, data:, vbscript: URIs to prevent stored/DOM XSS
    if (/^(javascript|data|vbscript):/i.test(url)) return '';
    if (/^(https?:\/\/|mailto:|\/\/)/i.test(url)) return url;
    return 'https://' + url;
  }

  function getProjectIcon(name) {
    var lower = (name || '').toLowerCase();
    if (lower.indexOf('screen') !== -1 || lower.indexOf('shot') !== -1 || lower.indexOf('cam') !== -1) {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>' +
        '<circle cx="12" cy="13" r="4"/>' +
        '</svg>';
    }
    if (lower.indexOf('commerce') !== -1 || lower.indexOf('shop') !== -1 || lower.indexOf('carry') !== -1 || lower.indexOf('store') !== -1) {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>' +
        '<path d="M3 6h18"/>' +
        '<path d="M16 10a4 4 0 0 1-8 0"/>' +
        '</svg>';
    }
    if (lower.indexOf('portfolio') !== -1 || lower.indexOf('web') !== -1 || lower.indexOf('site') !== -1) {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect width="20" height="16" x="2" y="4" rx="2"/>' +
        '<path d="M10 4v4"/>' +
        '<path d="M2 8h20"/>' +
        '</svg>';
    }
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="16 18 22 12 16 6"/>' +
      '<polyline points="8 6 2 12 8 18"/>' +
      '</svg>';
  }

  function renderProjects(projects) {
    var container = document.getElementById('projects-container');
    if (!container || !projects || !projects.length) return;

    // Filter out profile readme repo 'khxaiyan' if other projects exist
    var valid = projects.filter(function (p) {
      var n = (p && (p.title || p.name)) ? (p.title || p.name).toLowerCase() : '';
      return n !== 'khxaiyan';
    });
    if (!valid.length) valid = projects;

    var html = '';
    valid.forEach(function (p) {
      var rawName = p.title || p.name || 'Project';
      var displayName = p.title ? p.title : formatProjectName(rawName);
      var styledTitle = highlightCapitals(displayName);
      var desc = (p.description && p.description.trim())
        ? p.description
        : (rawName.toLowerCase().indexOf('portfolio') !== -1 ? 'Personal developer portfolio website' : 'Open-source project on GitHub');
      var stars = formatStars(p.stars || p.stargazers_count || 1);
      var tag = p.tag || p.language || 'Project';
      var author = p.author || (typeof CONFIG !== 'undefined' && CONFIG.github ? CONFIG.github : 'khxaiyan');

      // Determine project URL: prioritize explicit url property, then custom override in config, then live website (homepage), then github html_url
      var customLink = null;
      if (typeof CONFIG !== 'undefined' && (CONFIG.project_links || CONFIG.project_urls)) {
        var links = CONFIG.project_links || CONFIG.project_urls;
        customLink = links[p.name] || links[rawName] || links[rawName.toLowerCase()];
      }
      var targetUrl = p.url || customLink || p.homepage || p.website || p.html_url || ('https://github.com/' + author + '/' + (p.name || rawName));
      var finalUrl = normalizeUrl(targetUrl);
      var icon = getProjectIcon(rawName);

      // Determine GitHub Repo URL
      var ghTarget = p.github_url || p.html_url || (p.author ? 'https://github.com/' + p.author + '/' + (p.name || rawName) : ('https://github.com/' + author + '/' + (p.name || rawName)));
      var finalGhUrl = normalizeUrl(ghTarget);

      var ghBtnHtml = '';
      if (finalGhUrl) {
        ghBtnHtml = '<a class="org-row-github-btn" href="' + finalGhUrl + '" target="_blank" rel="noopener noreferrer" title="View Source on GitHub" aria-label="View Source on GitHub" onclick="event.stopPropagation();">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>' +
          '<path d="M9 18c-4.51 2-5-2-7-2"/>' +
          '</svg>' +
          '</a>';
      }

      html += '<div class="org-row" role="link" tabindex="0" data-href="' + finalUrl + '" data-repo="' + (p.name || rawName) + '">' +
        '<div class="project-avatar" aria-hidden="true">' + icon + '</div>' +
        '<div class="org-row-text">' +
        '<span class="org-row-name">' + styledTitle + '</span>' +
        '<span class="org-row-desc">' + desc + '</span>' +
        '</div>' +
        '<div class="org-row-stats">' +
        '<span class="org-row-star">' + stars + '</span>' +
        '<span class="org-row-repos">' + tag + '</span>' +
        ghBtnHtml +
        '</div>' +
        '</div>';
    });

    container.innerHTML = html;

    container.querySelectorAll('.org-row[data-href]').forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('.org-row-github-btn')) return;
        var href = row.getAttribute('data-href');
        if (href) window.open(href, '_blank', 'noopener,noreferrer');
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('.org-row-github-btn')) return;
          e.preventDefault();
          var href = row.getAttribute('data-href');
          if (href) window.open(href, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  /* Re-apply project_links to already-rendered cards without a full reload */
  function reapplyProjectLinks(links) {
    var container = document.getElementById('projects-container');
    if (!container || !links) return;
    var cards = container.querySelectorAll('.org-row[data-repo]');
    cards.forEach(function (card) {
      var repoName = card.getAttribute('data-repo');
      var override = links[repoName] || links[(repoName || '').toLowerCase()];
      if (override) {
        card.setAttribute('data-href', normalizeUrl(override));
      }
    });
  }

  function loadPinnedProjects() {
    var active = getActiveProjects();
    if (active && active.length) {
      renderProjects(active);
      return;
    }

    var username = (typeof CONFIG !== 'undefined' && CONFIG.github) ? CONFIG.github : 'khxaiyan';
    var cacheBuster = '?_t=' + Date.now();

    function fetchPins() {
      return fetch('https://pinned.berrysauce.dev/get/' + username + cacheBuster, { cache: 'no-store' })
        .then(function (r) {
          if (r.ok) return r.json();
          throw new Error('primary pin endpoint failed');
        })
        .catch(function () {
          return fetch('https://pinned.berrysauce.me/get/' + username + cacheBuster, { cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .catch(function () { return null; });
        });
    }

    var userReposPromise = fetch('https://api.github.com/users/' + username + '/repos?sort=pushed&per_page=100&_t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });

    Promise.all([fetchPins(), userReposPromise])
      .then(function (results) {
        var pinnedData = results[0];
        var reposData = results[1];

        var repoMap = {};
        if (Array.isArray(reposData)) {
          reposData.forEach(function (r) {
            if (r && r.name) {
              repoMap[r.name.toLowerCase()] = r;
              if (r.full_name) repoMap[r.full_name.toLowerCase()] = r;
            }
          });
        }

        if (Array.isArray(pinnedData) && pinnedData.length) {
          // Render initial list immediately
          var initialList = pinnedData.map(function (p) {
            var author = p.author || username;
            var key = (author + '/' + p.name).toLowerCase();
            var r = (p && p.name) ? (repoMap[key] || repoMap[p.name.toLowerCase()]) : null;
            return {
              author: author,
              name: p.name,
              description: p.description || (r ? r.description : ''),
              language: p.language || (r ? r.language : ''),
              stars: p.stars || (r ? r.stargazers_count : 0),
              homepage: r ? r.homepage : null,
              html_url: (r && r.html_url) || ('https://github.com/' + author + '/' + p.name)
            };
          });
          renderProjects(initialList);

          // Resolve full repository details (including homepage / website URL) for every pinned repository
          var detailFetches = pinnedData.map(function (p) {
            var author = p.author || username;
            var key = (author + '/' + p.name).toLowerCase();
            if (repoMap[key] && repoMap[key].homepage) {
              return Promise.resolve(repoMap[key]);
            }
            return fetch('https://api.github.com/repos/' + author + '/' + p.name + '?_t=' + Date.now(), { cache: 'no-store' })
              .then(function (res) { return res.ok ? res.json() : null; })
              .catch(function () { return null; });
          });

          Promise.all(detailFetches).then(function (detailsList) {
            var updated = pinnedData.map(function (p, idx) {
              var author = p.author || username;
              var key = (author + '/' + p.name).toLowerCase();
              var r = detailsList[idx] || repoMap[key] || (p && p.name ? repoMap[p.name.toLowerCase()] : null);
              return {
                author: author,
                name: p.name,
                description: (r && r.description) || p.description || '',
                language: (r && r.language) || p.language || '',
                stars: (r && typeof r.stargazers_count === 'number') ? r.stargazers_count : (p.stars || 0),
                homepage: r ? r.homepage : null,
                html_url: (r && r.html_url) || ('https://github.com/' + author + '/' + p.name)
              };
            });
            renderProjects(updated);
          });
        } else if (Array.isArray(reposData) && reposData.length) {
          renderProjects(reposData.map(function (r) {
            return {
              author: username,
              name: r.name,
              description: r.description,
              language: r.language,
              stars: r.stargazers_count,
              homepage: r.homepage,
              html_url: r.html_url
            };
          }));
        } else {
          fallbackPinnedFetch(username);
        }
      })
      .catch(function () {
        fallbackPinnedFetch(username);
      });
  }

  function fallbackPinnedFetch(username) {
    var cacheBuster = '&_t=' + Date.now();
    fetch('https://api.github.com/users/' + username + '/repos?sort=pushed&per_page=6' + cacheBuster, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (repos) {
        if (Array.isArray(repos) && repos.length) {
          renderProjects(repos.map(function (r) {
            return {
              author: username,
              name: r.name,
              description: r.description,
              language: r.language,
              stars: r.stargazers_count,
              homepage: r.homepage,
              html_url: r.html_url
            };
          }));
        }
      })
      .catch(function () { });
  }

  loadPinnedProjects();

  /* ─── Contact form ─── */
  var btn = document.getElementById('cf-submit');
  var status = document.getElementById('contact-status');
  var msgArea = document.getElementById('cf-message');

  if (!btn) return;

  btn.addEventListener('click', function () {
    if (btn.disabled) return;

    var msg = (msgArea ? msgArea.value : '').trim();
    if (!msg) {
      status.textContent = 'please write a message first.';
      status.style.color = 'var(--red)';
      return;
    }

    var captchaVal = '';
    if (window.hcaptcha && hcaptchaWidgetId !== null) {
      try { captchaVal = window.hcaptcha.getResponse(hcaptchaWidgetId); } catch (_) { }
    }
    if (!captchaVal) {
      var captchaEl = document.querySelector('textarea[name="h-captcha-response"]');
      captchaVal = captchaEl ? captchaEl.value : '';
    }
    if (!captchaVal) {
      status.textContent = 'please complete the captcha.';
      status.style.color = 'var(--red)';
      return;
    }

    btn.disabled = true;
    btn.querySelector('span').textContent = 'sending...';
    status.textContent = '';
    status.style.color = 'var(--ink-faint)';

    var accessKey = (typeof CONFIG !== 'undefined' && CONFIG.web3forms_access_key)
      ? CONFIG.web3forms_access_key
      : 'd36ee933-00cb-453e-aa38-b18ee60ce5d1';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        message: msg,
        'h-captcha-response': captchaVal
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.success) {
          status.textContent = 'message sent!';
          status.style.color = 'var(--success)';
          if (msgArea) msgArea.value = '';
          if (window.hcaptcha && hcaptchaWidgetId !== null) {
            try { window.hcaptcha.reset(hcaptchaWidgetId); } catch (_) { }
          }
        } else {
          status.textContent = d.message || 'something went wrong. try again.';
          status.style.color = 'var(--red)';
        }
      })
      .catch(function () {
        status.textContent = 'network error. check connection.';
        status.style.color = 'var(--red)';
      })
      .finally(function () {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'send message';
      });
  });

  /* ─── Slim Theme-Based Scroll Progress Bar ─── */
  var scrollProgressBar = document.getElementById('scroll-progress');
  if (scrollProgressBar) {
    var isTicking = false;
    function updateScrollProgress() {
      var doc = document.documentElement;
      var body = document.body;
      var scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
      var scrollHeight = (doc.scrollHeight || body.scrollHeight) - window.innerHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      scrollProgressBar.style.width = pct + '%';
      isTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!isTicking) {
        window.requestAnimationFrame(updateScrollProgress);
        isTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  /* Global non-draggable image & video guard */
  document.addEventListener('dragstart', function (e) {
    if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) {
      e.preventDefault();
      return false;
    }
  }, false);
}());