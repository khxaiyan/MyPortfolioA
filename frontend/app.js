(function () {
  'use strict';

  /* ── Universal Premium Glassmorphism Popup / Dialog System ── */
  function showCustomPopup(opts) {
    if (typeof opts === 'string') {
      opts = { message: opts };
    }
    opts = opts || {};
    var backdrop = document.getElementById('custom-app-popup');
    if (!backdrop) {
      console.warn('[Popup]', opts.message || opts.title);
      return;
    }

    var tagEl = document.getElementById('app-popup-tag');
    var iconEl = document.getElementById('app-popup-icon');
    var titleEl = document.getElementById('app-popup-title');
    var bodyEl = document.getElementById('app-popup-body');
    var actionsEl = document.getElementById('app-popup-actions');
    var closeBtn = document.getElementById('app-popup-close-btn');

    var type = opts.type || 'info';
    if (tagEl) {
      tagEl.textContent = opts.tag || ('// ' + (type === 'document' ? 'CV SYSTEM' : type.toUpperCase()));
      if (type === 'error' || type === 'warning' || type === 'document') {
        tagEl.style.color = 'var(--red, #ff2a5f)';
        tagEl.style.borderColor = 'var(--border-accent, rgba(255, 42, 95, 0.35))';
        tagEl.style.background = 'var(--red-dim, rgba(255, 42, 95, 0.12))';
      } else if (type === 'success') {
        tagEl.style.color = '#10b981';
        tagEl.style.borderColor = 'rgba(16, 185, 129, 0.35)';
        tagEl.style.background = 'rgba(16, 185, 129, 0.12)';
      }
    }

    if (titleEl) titleEl.textContent = opts.title || (type === 'document' ? 'No Document Uploaded' : 'Notice');
    if (bodyEl) bodyEl.innerHTML = opts.message || '';

    // Icon generation
    var iconSvg = '';
    if (type === 'document') {
      iconSvg = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';
    } else if (type === 'warning' || type === 'error') {
      iconSvg = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else if (type === 'success') {
      iconSvg = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else {
      iconSvg = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }
    if (iconEl) {
      iconEl.innerHTML = opts.customIcon || iconSvg;
      if (type === 'success') {
        iconEl.style.color = '#10b981';
        iconEl.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        iconEl.style.background = 'rgba(16, 185, 129, 0.12)';
        iconEl.style.boxShadow = '0 0 24px rgba(16, 185, 129, 0.2)';
      } else {
        iconEl.style.color = 'var(--red, #ff2a5f)';
        iconEl.style.borderColor = 'var(--border-accent, rgba(255, 42, 95, 0.35))';
        iconEl.style.background = 'var(--red-dim, rgba(255, 42, 95, 0.12))';
        iconEl.style.boxShadow = '0 0 24px var(--border-accent-glow, rgba(255, 42, 95, 0.2))';
      }
    }

    function closePopup() {
      backdrop.classList.remove('active');
      setTimeout(function () {
        backdrop.style.display = 'none';
      }, 220);
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Escape') closePopup();
    }
    document.addEventListener('keydown', onKey);

    if (closeBtn) closeBtn.onclick = closePopup;
    backdrop.onclick = function (e) {
      if (e.target === backdrop) closePopup();
    };

    if (actionsEl) {
      actionsEl.innerHTML = '';
      if (Array.isArray(opts.buttons) && opts.buttons.length > 0) {
        opts.buttons.forEach(function (btn) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'app-popup-btn ' + (btn.primary ? 'app-popup-btn-primary' : 'app-popup-btn-secondary');
          b.innerHTML = btn.text;
          b.onclick = function (e) {
            closePopup();
            if (typeof btn.onClick === 'function') btn.onClick(e);
          };
          actionsEl.appendChild(b);
        });
      } else {
        var okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'app-popup-btn app-popup-btn-primary';
        okBtn.textContent = opts.buttonText || 'Understood';
        okBtn.onclick = function () {
          closePopup();
          if (typeof opts.onConfirm === 'function') opts.onConfirm();
        };
        actionsEl.appendChild(okBtn);
      }
    }

    backdrop.style.display = 'flex';
    void backdrop.offsetHeight; // force reflow for smooth transition
    backdrop.classList.add('active');
  }

  // Intercept native browser alert
  window.alert = function (msg) {
    showCustomPopup({
      title: 'Notice',
      tag: '// NOTICE',
      message: String(msg || ''),
      type: 'info'
    });
  };

  /* ─── Theme & Accent Customization ─── */
  var root = document.documentElement;
  var aw = document.getElementById('avatar-wrap');
  var metaClr = document.getElementById('meta-theme-color');

  var currentThemeMode = 'dark';
  var currentAccentColor = (typeof CONFIG !== 'undefined' && ((CONFIG.theme_config && CONFIG.theme_config.accent_color) || CONFIG.accent_color)) || '#ff2a5f';
  var currentBgPreset = 'midnight';

  var BG_PRESETS = {
    midnight: { bg: '#0a0a0e', surface: '#131319', surfaceHover: '#191a22', rail: '#363a63' },
    oled: { bg: '#000000', surface: '#0a0a0a', surfaceHover: '#141414', rail: '#262630' },
    navy: { bg: '#070a13', surface: '#0d1322', surfaceHover: '#141d33', rail: '#223252' },
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
    return '#' + (0x1000000 + (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1);
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
      try {
        var c = accent.replace('#', '');
        if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        var n = parseInt(c, 16);
        var lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
        root.style.setProperty('--btn-text-color', lum > 165 ? '#0a0a0e' : '#ffffff');
      } catch (_) {
        root.style.setProperty('--btn-text-color', '#ffffff');
      }
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
  try { customCfg = JSON.parse(localStorage.getItem('portfolio_custom_config')); } catch (_) { }
  var themeCfg = (customCfg && customCfg.theme_config) || (typeof CONFIG !== 'undefined' && CONFIG.theme_config) || {};
  currentThemeMode = themeCfg.mode || (customCfg && customCfg.default_theme) || (typeof CONFIG !== 'undefined' && CONFIG.default_theme) || 'dark';
  currentAccentColor = themeCfg.accent_color || (customCfg && customCfg.accent_color) || (typeof CONFIG !== 'undefined' && ((CONFIG.theme_config && CONFIG.theme_config.accent_color) || CONFIG.accent_color)) || '#ff2a5f';
  currentBgPreset = themeCfg.bg_preset || (typeof CONFIG !== 'undefined' && CONFIG.theme_config && CONFIG.theme_config.bg_preset) || 'midnight';

  var currentFontFamily = themeCfg.font_family || (customCfg && customCfg.font_family) || (typeof CONFIG !== 'undefined' && (CONFIG.font_family || (CONFIG.theme_config && CONFIG.theme_config.font_family))) || 'Space Grotesk';
  var currentFontScope = themeCfg.font_scope || (customCfg && customCfg.font_scope) || (typeof CONFIG !== 'undefined' && (CONFIG.font_scope || (CONFIG.theme_config && CONFIG.theme_config.font_scope))) || 'display';

  function applySiteFont(fontName, scope) {
    if (!fontName) fontName = 'Space Grotesk';
    fontName = fontName.trim();
    var slug = fontName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    var linkId = 'dyn-font-' + slug;
    if (!document.getElementById(linkId)) {
      var l = document.createElement('link');
      l.id = linkId;
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(fontName).replace(/%20/g, '+') + ':wght@400;500;600;700&display=swap';
      document.head.appendChild(l);
    }
    var isMono = fontName.toLowerCase().indexOf('mono') !== -1 || fontName.toLowerCase().indexOf('code') !== -1;
    var isSerif = fontName.toLowerCase().indexOf('serif') !== -1 || fontName.toLowerCase().indexOf('playfair') !== -1 || fontName.toLowerCase().indexOf('cinzel') !== -1;
    var fallback = isMono ? 'ui-monospace, monospace' : (isSerif ? 'Georgia, serif' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    var fontRule = '"' + fontName + '", ' + fallback;
    var rootEl = document.documentElement;
    rootEl.style.setProperty('--font-display', fontRule);
    if (scope === 'all') {
      rootEl.style.setProperty('--font-mono', fontRule);
    } else {
      rootEl.style.setProperty('--font-mono', "'IBM Plex Mono', ui-monospace, monospace");
    }
  }

  applyTheme(currentThemeMode);
  applySiteFont(currentFontFamily, currentFontScope);

  function syncThemeIfAdmin(newMode) {
    var cfg = Object.assign({}, typeof CONFIG !== 'undefined' ? CONFIG : {});
    try {
      var saved = localStorage.getItem('portfolio_custom_config');
      if (saved) Object.assign(cfg, JSON.parse(saved));
    } catch (_) { }
    cfg.default_theme = newMode;
    if (!cfg.theme_config) cfg.theme_config = {};
    cfg.theme_config.mode = newMode;
    cfg.theme_config.accent_color = currentAccentColor;
    cfg.theme_config.bg_preset = currentBgPreset;
    cfg.font_family = currentFontFamily;
    cfg.font_scope = currentFontScope;
    cfg.theme_config.font_family = currentFontFamily;
    cfg.theme_config.font_scope = currentFontScope;
    try { localStorage.setItem('portfolio_custom_config', JSON.stringify(cfg)); } catch (_) { }
    if (typeof CONFIG !== 'undefined') Object.assign(CONFIG, cfg);
  }

  if (aw) {
    aw.addEventListener('click', function () {
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      syncThemeIfAdmin(nextTheme);
    });
    aw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aw.click(); }
    });
  }

  /* ─── Dynamic Timeline Node & Terminator Engine ─── */
  function updateTimelineLastRow() {
    var rows = document.querySelectorAll('.sheet > .rail-row:not(.rail-row--root)');
    var lastVisible = null;
    rows.forEach(function (row) {
      row.classList.remove('rail-row--last');
      if (row.style.display !== 'none' && window.getComputedStyle(row).display !== 'none') {
        lastVisible = row;
      }
    });
    if (lastVisible) {
      lastVisible.classList.add('rail-row--last');
    }
  }


  /* ─── CV / Document In-Page Preview Modal Logic ─── */
  function fetchDocumentText(targetUrl) {
    if (targetUrl.startsWith('data:')) {
      try {
        var commaIdx = targetUrl.indexOf(',');
        var meta = targetUrl.slice(0, commaIdx);
        var payload = targetUrl.slice(commaIdx + 1);
        if (meta.includes('base64')) {
          var binary = atob(payload);
          var bytes = new Uint8Array(binary.length);
          for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          var decoded = new TextDecoder('utf-8').decode(bytes);
          return Promise.resolve(decoded);
        }
        return Promise.resolve(decodeURIComponent(payload));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return fetch(targetUrl).then(function (res) {
      if (!res.ok) throw new Error('Network error: ' + res.status);
      return res.text();
    });
  }

  function renderMarkdownDocument(raw) {
    if (!raw) return '<p style="color:var(--ink-dim);">Empty document</p>';
    var escaped = String(raw)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    // Code blocks: ```lang ... ```
    escaped = escaped.replace(/```([\w-]*)\n([\s\S]*?)```/g, function (m, lang, code) {
      return '<pre style="background:var(--bg); border:1px solid var(--line); border-radius:8px; padding:16px; margin:16px 0; overflow-x:auto; font-family:var(--font-mono); font-size:0.84rem; color:var(--ink);"><code>' + code.trim() + '</code></pre>';
    });

    var lines = escaped.split('\n');
    var out = [];
    var inList = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      if (/^(\*\*\*|---|___)$/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<hr style="border:none; border-top:1px solid var(--line); margin:20px 0;">');
        continue;
      }
      if (/^###\s+/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:700; color:var(--ink); margin:18px 0 8px 0;">' + trimmed.replace(/^###\s+/, '') + '</h3>');
        continue;
      }
      if (/^##\s+/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<h2 style="font-family:var(--font-display); font-size:1.35rem; font-weight:700; color:var(--ink); margin:24px 0 10px 0; padding-bottom:6px; border-bottom:1px solid var(--line);">' + trimmed.replace(/^##\s+/, '') + '</h2>');
        continue;
      }
      if (/^#\s+/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<h1 style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; color:var(--ink); margin:22px 0 12px 0;">' + trimmed.replace(/^#\s+/, '') + '</h1>');
        continue;
      }
      if (/^&gt;\s?/.test(trimmed)) {
        if (inList) { out.push('</ul>'); inList = false; }
        out.push('<blockquote style="border-left:3px solid var(--red); padding:8px 16px; margin:12px 0; background:var(--red-dim); color:var(--ink); font-style:italic; border-radius:0 6px 6px 0;">' + trimmed.replace(/^&gt;\s?/, '') + '</blockquote>');
        continue;
      }
      if (/^[-*]\s+/.test(trimmed)) {
        if (!inList) { out.push('<ul style="margin:8px 0 12px 22px; padding:0; display:flex; flex-direction:column; gap:6px;">'); inList = true; }
        out.push('<li style="color:var(--ink);">' + trimmed.replace(/^[-*]\s+/, '') + '</li>');
        continue;
      } else if (inList) {
        out.push('</ul>');
        inList = false;
      }
      if (!trimmed) continue;

      out.push('<p style="margin:8px 0; color:var(--ink); line-height:1.7;">' + trimmed + '</p>');
    }
    if (inList) out.push('</ul>');

    var html = out.join('\n');
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--red); text-decoration:underline;">$1</a>');
    html = html.replace(/\{([^}]+)\}/g, '<span class="glyph-5">$1</span>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<u>$1</u>');
    html = html.replace(/(?:^|\s)\*([^*\s][^*]*[^*\s]|[^*])\*(?=\s|$|[.,!?:;])/g, ' <em>$1</em>');
    html = html.replace(/(?:^|\s)_([^_\s][^_]*[^_\s]|[^_])_(?=\s|$|[.,!?:;])/g, ' <em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code style="background:var(--surface-hover); border:1px solid var(--line); border-radius:4px; padding:2px 6px; font-family:var(--font-mono); font-size:0.85em; color:var(--red);">$1</code>');

    return html;
  }

  function openCvPreviewModal(url, label) {
    var modal = document.getElementById('cv-preview-modal');
    if (!modal) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    var titleEl = document.getElementById('cv-modal-title');
    var filenameEl = document.getElementById('cv-modal-filename');
    var downloadBtn = document.getElementById('cv-modal-download-btn');
    var closeBtn = document.getElementById('cv-modal-close-btn');
    var loadingEl = document.getElementById('cv-modal-loading');
    var canvasContainer = document.getElementById('cv-pdf-canvas-container');
    var iframeEl = document.getElementById('cv-modal-iframe');
    var imgEl = document.getElementById('cv-modal-img');
    var textContainer = document.getElementById('cv-modal-text-container');

    var cleanPath = (url || 'document').split('?')[0].split('#')[0];
    var isDataUrl = url && url.startsWith('data:');
    var filename = isDataUrl
      ? (label ? label.replace(/\{([^}]+)\}/g, '$1') : 'CV') + '.pdf'
      : (cleanPath.split('/').pop() || (label || 'CV'));
    var plainLabel = label ? label.replace(/\{([^}]+)\}/g, '$1') : 'CV';

    if (titleEl) titleEl.textContent = '// preview - ' + plainLabel;
    if (filenameEl) {
      if (isDataUrl) {
        filenameEl.style.display = 'none';
      } else {
        filenameEl.style.display = '';
        filenameEl.textContent = filename;
      }
    }
    if (downloadBtn) {
      downloadBtn.href = url;
      downloadBtn.setAttribute('download', filename);
    }

    // Reset viewer elements
    if (loadingEl) loadingEl.style.display = 'flex';
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      canvasContainer.style.display = 'none';
    }
    if (iframeEl) {
      iframeEl.src = '';
      iframeEl.style.display = 'none';
    }
    if (imgEl) {
      imgEl.src = '';
      imgEl.style.display = 'none';
    }
    if (textContainer) {
      textContainer.innerHTML = '';
      textContainer.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (iframeEl) iframeEl.src = '';
    }

    var cancelBtn = document.getElementById('cv-modal-cancel-btn');

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    modal.onclick = function (e) {
      if (e.target === modal) closeModal();
    };
    function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        window.removeEventListener('keydown', escHandler);
      }
    }
    window.addEventListener('keydown', escHandler);

    var lowerPath = cleanPath.toLowerCase();
    var isPdf = lowerPath.endsWith('.pdf') || (url && url.startsWith('data:application/pdf'));
    var isImg = /\.(png|jpe?g|webp|gif|svg|bmp|ico)$/i.test(lowerPath) || (url && url.startsWith('data:image/'));
    var isMarkdown = /\.(md|markdown)$/i.test(lowerPath) || (url && url.startsWith('data:text/markdown'));
    var isPlainText = /\.(txt|rtf|json|csv|log)$/i.test(lowerPath) || (url && (url.startsWith('data:text/plain') || url.startsWith('data:text/rtf')));
    var isHtml = /\.(html?|htm)$/i.test(lowerPath) || (url && url.startsWith('data:text/html'));
    var isDocx = /\.(docx?|doc)$/i.test(lowerPath) || (url && (url.startsWith('data:application/vnd.openxmlformats') || url.startsWith('data:application/msword')));

    if (isImg && imgEl) {
      imgEl.src = url;
      imgEl.style.display = 'block';
      if (loadingEl) loadingEl.style.display = 'none';
    } else if (isPdf) {
      if (window.pdfjsLib && canvasContainer) {
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          var pdfSource = url;
          if (typeof url === 'string' && url.startsWith('data:application/pdf;base64,')) {
            try {
              var rawB64 = url.split(',')[1];
              var binStr = window.atob(rawB64);
              var bLen = binStr.length;
              var u8 = new Uint8Array(bLen);
              for (var bi = 0; bi < bLen; bi++) {
                u8[bi] = binStr.charCodeAt(bi);
              }
              pdfSource = { data: u8 };
            } catch (b64Err) {
              console.warn('Base64 decode error:', b64Err);
              pdfSource = url;
            }
          }
          var loadingTask = pdfjsLib.getDocument(pdfSource);
          loadingTask.promise.then(function (pdf) {
            canvasContainer.innerHTML = '';
            canvasContainer.style.display = 'flex';
            if (loadingEl) loadingEl.style.display = 'none';

            for (var i = 1; i <= pdf.numPages; i++) {
              (function (pageNum) {
                pdf.getPage(pageNum).then(function (page) {
                  var scale = 1.5;
                  var viewport = page.getViewport({ scale: scale });
                  var canvas = document.createElement('canvas');
                  canvas.className = 'cv-pdf-page-canvas';
                  canvas.style.maxWidth = '96%';
                  canvas.style.height = 'auto';
                  canvas.style.borderRadius = '4px';
                  canvas.style.boxShadow = '0 8px 24px rgba(0,0,0,0.55)';
                  canvas.style.background = '#ffffff';
                  var ctx = canvas.getContext('2d');
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  page.render({ canvasContext: ctx, viewport: viewport });
                  canvasContainer.appendChild(canvas);
                });
              })(i);
            }
          }).catch(function (err) {
            console.warn('[PDF.js] Canvas render failed, fallback to iframe:', err);
            if (loadingEl) loadingEl.style.display = 'none';
            if (iframeEl) {
              iframeEl.src = (url.startsWith('data:') ? url : (url + '#toolbar=0'));
              iframeEl.style.display = 'block';
            }
          });
        } catch (err) {
          if (loadingEl) loadingEl.style.display = 'none';
          if (iframeEl) {
            iframeEl.src = (url.startsWith('data:') ? url : (url + '#toolbar=0'));
            iframeEl.style.display = 'block';
          }
        }
      } else {
        if (loadingEl) loadingEl.style.display = 'none';
        if (iframeEl) {
          iframeEl.src = (url.startsWith('data:') ? url : (url + '#toolbar=0'));
          iframeEl.style.display = 'block';
        }
      }
    } else if (isMarkdown && textContainer) {
      fetchDocumentText(url).then(function (mdText) {
        textContainer.innerHTML = renderMarkdownDocument(mdText);
        textContainer.style.display = 'block';
        if (loadingEl) loadingEl.style.display = 'none';
      }).catch(function (err) {
        textContainer.innerHTML = '<p style="color:var(--red);">Could not load markdown preview: ' + escapeHtml(err.message) + '</p>';
        textContainer.style.display = 'block';
        if (loadingEl) loadingEl.style.display = 'none';
      });
    } else if (isPlainText && textContainer) {
      fetchDocumentText(url).then(function (plainText) {
        textContainer.innerHTML = '<pre style="font-family:var(--font-mono); font-size:0.86rem; color:var(--ink); white-space:pre-wrap; background:var(--surface); padding:24px; border-radius:8px; border:1px solid var(--line); line-height:1.65; max-width:100%; overflow-x:auto;">' + escapeHtml(plainText) + '</pre>';
        textContainer.style.display = 'block';
        if (loadingEl) loadingEl.style.display = 'none';
      }).catch(function (err) {
        textContainer.innerHTML = '<p style="color:var(--red);">Could not load text preview: ' + escapeHtml(err.message) + '</p>';
        textContainer.style.display = 'block';
        if (loadingEl) loadingEl.style.display = 'none';
      });
    } else if (isHtml && iframeEl) {
      if (url.startsWith('data:')) {
        iframeEl.src = url;
      } else {
        iframeEl.src = url;
      }
      iframeEl.style.display = 'block';
      if (loadingEl) loadingEl.style.display = 'none';
    } else if (isDocx) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Embed via Microsoft Office Online Viewer
        iframeEl.src = 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(url);
        iframeEl.style.display = 'block';
        if (loadingEl) loadingEl.style.display = 'none';
      } else if (textContainer) {
        textContainer.innerHTML = '<div style="text-align:center; padding:48px 24px; display:flex; flex-direction:column; align-items:center; gap:12px;"><div style="font-size:3.2rem; line-height:1;">📑</div><h4 style="font-family:var(--font-display); font-size:1.2rem; font-weight:700; color:var(--ink); margin:0;">' + escapeHtml(filename) + '</h4><p style="font-size:0.84rem; color:var(--ink-dim); margin:0; font-family:var(--font-mono);">Word Document Ready to View</p><div style="display:flex; gap:10px; margin-top:8px;"><a href="' + url + '" download="' + filename + '" class="toolbar-btn" style="padding:10px 22px; font-size:0.84rem; font-weight:600; background:var(--red-solid); color:#fff; border-radius:8px; display:inline-flex; align-items:center; gap:8px; text-decoration:none;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg><span>Download / Open Document</span></a></div></div>';
        textContainer.style.display = 'block';
        if (loadingEl) loadingEl.style.display = 'none';
      }
    } else {
      // External link or other format
      if (loadingEl) loadingEl.style.display = 'none';
      if (iframeEl) {
        iframeEl.src = url;
        iframeEl.style.display = 'block';
      }
    }
  }

  /* ── Avatar & Favicon helpers ── */
  function applyPageFavicon(url) {
    if (!url || url === 'favicon.svg' || url === 'favicon.png' || url === 'favicon.ico' || url === 'profile_icon.svg') {
      url = 'https://res.cloudinary.com/dqxccz5bn/image/upload/favicon_jzygcw.png';
    }
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
    if (!wrap) return;
    var currentEl = wrap.querySelector('.avatar-img, video.avatar-img, .avatar-placeholder');
    var isWebm = isWebmSource(url);
    if (isWebm) {
      if (currentEl && currentEl.tagName && currentEl.tagName.toLowerCase() === 'video') {
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
      var finalImgSrc = (url && url !== 'avatar.svg' && url !== 'Diluc.svg' && url !== 'profile_icon.svg') ? url : 'https://res.cloudinary.com/dqxccz5bn/image/upload/profile_icon_wf7thb.svg';
      if (currentEl && currentEl.tagName && currentEl.tagName.toLowerCase() === 'img') {
        currentEl.src = finalImgSrc;
        currentEl.setAttribute('draggable', 'false');
      } else {
        var img = document.createElement('img');
        img.className = 'avatar-img';
        img.src = finalImgSrc;
        img.alt = (typeof CONFIG !== 'undefined' && CONFIG.site_name) ? CONFIG.site_name : 'Avatar';
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

  /* ─── Universal Live Configuration Hydration ─── */
  function applyFullConfig(cfg) {
    if (!cfg || typeof cfg !== 'object') return;

    // 1. Update in-memory objects
    if (typeof CONFIG !== 'undefined') {
      Object.assign(CONFIG, cfg);
    }
    if (typeof window !== 'undefined') {
      window.CONFIG = Object.assign(window.CONFIG || {}, cfg);
    }

    // 2. Persist to localStorage
    try {
      localStorage.setItem('portfolio_custom_config', JSON.stringify(cfg));
    } catch (_) { }

    // 3. Theme mode, Accent color & Background preset
    var themeCfg = cfg.theme_config || {};
    var mode = themeCfg.mode || cfg.default_theme || currentThemeMode || 'dark';
    var accent = themeCfg.accent_color || cfg.accent_color || currentAccentColor || '#ff2a5f';
    var bgPreset = themeCfg.bg_preset || (cfg.theme_config && cfg.theme_config.bg_preset) || currentBgPreset || 'midnight';

    currentThemeMode = mode;
    currentAccentColor = accent;
    currentBgPreset = bgPreset;

    applyTheme(currentThemeMode);
    applyThemeColors(currentAccentColor, currentBgPreset, currentThemeMode);

    // 4. Font family & scope
    var fontFam = themeCfg.font_family || cfg.font_family || (cfg.theme_config && cfg.theme_config.font_family) || 'Space Grotesk';
    var fontScope = themeCfg.font_scope || cfg.font_scope || (cfg.theme_config && cfg.theme_config.font_scope) || 'display';
    applySiteFont(fontFam, fontScope);

    // 5. Favicon
    if (cfg.favicon_url) {
      applyPageFavicon(cfg.favicon_url);
    }

    // 6. Avatar / Profile picture
    var avatarUrl = cfg.avatar_url || cfg.logo;
    if (avatarUrl) {
      setPageAvatar(avatarUrl);
    } else {
      setPageAvatar('https://res.cloudinary.com/dqxccz5bn/image/upload/profile_icon_wf7thb.svg');
    }

    // 7. Wordmark & Corner Tag
    var siteName = cfg.site_name || 'khxaiyan';
    var accentLetter = cfg.accent_letter !== undefined ? cfg.accent_letter : 'x';
    var wordmark = document.querySelector('.wordmark');
    if (wordmark) {
      wordmark.innerHTML = formatWordmark(siteName, accentLetter);
    }
    var cornerTag = document.getElementById('corner-tag');
    if (cornerTag) {
      cornerTag.innerHTML = '@' + formatWordmark(siteName, accentLetter);
      cornerTag.style.display = '';
    }
    var modalDevTitle = document.getElementById('modal-dev-title');
    if (modalDevTitle) {
      modalDevTitle.innerHTML = formatWordmark(siteName, accentLetter);
    }

    // 7.5 CV Download Button (Supports .pdf, .docx, .doc, images, or online drive/notion links)
    var cvBtn = document.getElementById('cv-download-btn');
    if (cvBtn) {
      var cvTarget = (cfg.cv_url && typeof cfg.cv_url === 'string' && cfg.cv_url.trim()) ? cfg.cv_url.trim() : '';
      var isCvEnabled = cfg.cv_enabled === true;
      if (!isCvEnabled || !cvTarget) {
        cvBtn.style.display = 'none';
        cvBtn.removeAttribute('href');
      } else {
        cvBtn.style.display = 'inline-flex';
        var isDataUrl = cvTarget.startsWith('data:');
        cvBtn.href = isDataUrl ? '#' : cvTarget;
        var cvLabelText = (cfg.cv_label && cfg.cv_label.trim()) ? cfg.cv_label.trim() : 'CV';
        var cvAction = (cfg.cv_action === 'download') ? 'download' : 'preview';
        var cleanPath = cvTarget.split('?')[0].split('#')[0];
        var isExternalWeb = !isDataUrl && /^(https?:\/\/)/i.test(cvTarget) && !/\.(pdf|docx?|rtf|txt|md|markdown|html?|png|jpe?g|webp)$/i.test(cleanPath);

        var PREVIEW_ICON_SVG = '<svg class="cv-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px; color:var(--red);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>';
        var DOWNLOAD_ICON_SVG = '<svg class="cv-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px; color:var(--red);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>';

        var formattedLabel = formatWordmark(cvLabelText, accentLetter);
        var plainLabel = cvLabelText.replace(/\{([^}]+)\}/g, '$1');

        if (cvAction === 'download' && !isExternalWeb) {
          var cleanName = (isDataUrl ? (plainLabel + '.pdf') : (cleanPath.split('/').pop() || (plainLabel + '.pdf')));
          cvBtn.setAttribute('download', cleanName);
          cvBtn.innerHTML = DOWNLOAD_ICON_SVG + '<span>' + formattedLabel + '</span>';
          cvBtn.title = 'Download ' + plainLabel;
          cvBtn.setAttribute('aria-label', 'Download ' + plainLabel);
          cvBtn.onclick = function (e) {
            if (isDataUrl) {
              e.preventDefault();
              var a = document.createElement('a');
              a.href = cvTarget;
              a.download = cleanName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              return false;
            }
          };
        } else {
          cvBtn.removeAttribute('download');
          cvBtn.innerHTML = PREVIEW_ICON_SVG + '<span>' + formattedLabel + '</span>';
          cvBtn.title = (isExternalWeb ? 'Open ' : 'Preview ') + plainLabel;
          cvBtn.setAttribute('aria-label', (isExternalWeb ? 'Open ' : 'Preview ') + plainLabel);
          cvBtn.onclick = function (e) {
            if (isExternalWeb) return true;
            e.preventDefault();
            e.stopPropagation();
            openCvPreviewModal(cvTarget, cvLabelText);
            return false;
          };
        }
      }
    }

    // 8. Headline Bio & Intro text
    var bioEl = document.querySelector('.bio');
    if (bioEl) {
      if (cfg.site_desc && typeof cfg.site_desc === 'string' && cfg.site_desc.trim()) {
        bioEl.innerHTML = parseRichText(cfg.site_desc.trim());
      } else {
        bioEl.innerHTML = '';
      }
    }
    var introRow = document.getElementById('rail-row-intro');
    var hasIntro = !!(cfg.intro && typeof cfg.intro === 'string' && cfg.intro.trim());
    if (introRow) {
      introRow.style.display = (cfg.intro_enabled !== false && hasIntro) ? '' : 'none';
    }
    var introEl = document.getElementById('intro-text');
    if (introEl) {
      introEl.innerHTML = hasIntro ? parseRichText(cfg.intro.trim()) : '';
    }

    // 9. Document Title & SEO meta
    if (siteName) {
      document.title = siteName;
      var metaTitles = document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]');
      metaTitles.forEach(function (m) { m.content = siteName; });
    }
    if (cfg.seo_desc || cfg.site_desc) {
      var descContent = cfg.seo_desc || cfg.site_desc;
      var metaDescs = document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]');
      metaDescs.forEach(function (m) { m.content = descContent; });
    }

    // 9.5 Skills
    var skillsRow = document.getElementById('rail-row-skills');
    var isSkillsEnabled = (cfg.skills_enabled !== false);
    var skillsList = Array.isArray(cfg.skills) ? cfg.skills : [];
    if (skillsRow) {
      if (isSkillsEnabled && skillsList.length > 0) {
        skillsRow.style.display = '';
        renderSkills(skillsList);
      } else {
        skillsRow.style.display = 'none';
      }
    }

    // 9.8 Qualifications
    var qualRow = document.getElementById('rail-row-qualifications');
    var isQualEnabled = (cfg.qualifications_enabled !== false);
    var qualList = Array.isArray(cfg.qualifications) ? cfg.qualifications : [];
    if (qualRow) {
      if (isQualEnabled && qualList.length > 0) {
        qualRow.style.display = '';
        renderQualifications(qualList);
      } else {
        qualRow.style.display = 'none';
      }
    }

    // 10. Projects
    var projectsRow = document.getElementById('rail-row-projects');
    if (projectsRow) {
      projectsRow.style.display = (cfg.projects_enabled !== false) ? '' : 'none';
    }
    if (Array.isArray(cfg.projects) && cfg.projects.length > 0) {
      renderProjects(cfg.projects);
    }

    // 10.5 Devices
    var devicesRow = document.getElementById('rail-row-devices');
    var devicesList = Array.isArray(cfg.devices) ? cfg.devices : [];
    if (devicesRow) {
      if (cfg.devices_enabled !== false && devicesList.length > 0) {
        devicesRow.style.display = '';
        renderDevices(devicesList);
      } else {
        devicesRow.style.display = 'none';
      }
    }

    // 11. Channel / Social links (Reach)
    var reachRow = document.getElementById('rail-row-reach');
    if (reachRow) {
      reachRow.style.display = (cfg.reach_enabled !== false) ? '' : 'none';
    }
    renderChannelList(cfg);

    // 12. Message
    var messageRow = document.getElementById('rail-row-message');
    if (messageRow) {
      messageRow.style.display = (cfg.message_enabled !== false) ? '' : 'none';
    }

    // 13. Apply custom section order if set
    if (Array.isArray(cfg.section_order) && cfg.section_order.length > 0) {
      var anyRow = document.getElementById('rail-row-intro');
      var railParent = anyRow && anyRow.parentNode;
      if (railParent) {
        cfg.section_order.forEach(function (key) {
          var el = document.getElementById('rail-row-' + key);
          if (el && el.parentNode === railParent) {
            railParent.appendChild(el);
          }
        });
        // Footer (and corner-tag button) must always be placed last at the end of the page
        var footerEl = railParent.querySelector('.footer-row, footer');
        if (footerEl && footerEl.parentNode === railParent) {
          railParent.appendChild(footerEl);
        }
      }
    }

    // Dynamic timeline terminator update
    updateTimelineLastRow();
  }

  /* ─── Load Local Customizer Overrides if present ─── */
  try {
    var savedCustom = localStorage.getItem('portfolio_custom_config');
    if (savedCustom) {
      var parsedCustom = JSON.parse(savedCustom);
      var needsSave = false;
      if (parsedCustom.avatar_url === 'avatar.svg' || parsedCustom.avatar_url === 'Diluc.svg' || parsedCustom.logo === 'avatar.svg' || parsedCustom.logo === 'Diluc.svg' || parsedCustom.avatar_url === 'profile_icon.svg' || parsedCustom.logo === 'profile_icon.svg') {
        parsedCustom.avatar_url = 'https://res.cloudinary.com/dqxccz5bn/image/upload/profile_icon_wf7thb.svg';
        parsedCustom.logo = 'https://res.cloudinary.com/dqxccz5bn/image/upload/profile_icon_wf7thb.svg';
        needsSave = true;
      }
      if (parsedCustom.favicon_url === 'favicon.svg' || parsedCustom.favicon_url === 'favicon.png' || parsedCustom.favicon_url === 'favicon.ico' || parsedCustom.favicon_url === 'profile_icon.svg') {
        parsedCustom.favicon_url = 'https://res.cloudinary.com/dqxccz5bn/image/upload/favicon_jzygcw.png';
        needsSave = true;
      }
      if (parsedCustom && typeof parsedCustom.intro === 'string' && (parsedCustom.intro.includes('{{{{') || parsedCustom.intro.includes('hjvhkv'))) {
        delete parsedCustom.intro;
        needsSave = true;
      }
      if (needsSave) {
        try { localStorage.setItem('portfolio_custom_config', JSON.stringify(parsedCustom)); } catch (_) { }
      }
      if (typeof CONFIG !== 'undefined') {
        Object.assign(CONFIG, parsedCustom);
      }
    }
  } catch (_) { }

  /* ─── Sync Live Config from MongoDB (background sync) ─── */
  fetch('/api/get-config')
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (res && res.success && res.config) {
        var remoteCfg = res.config;
        var localRaw = localStorage.getItem('portfolio_custom_config');
        if (localRaw !== JSON.stringify(remoteCfg)) {
          applyFullConfig(remoteCfg);
        }
      }
    })
    .catch(function () { });

  /* ─── Wordmark & Accent Highlighting ─── */
  function formatWordmark(name, accent) {
    if (!name) return '';
    if (/\{([^}]+)\}/.test(name)) {
      return name.replace(/\{([^}]+)\}/g, '<span class="glyph-5">$1</span>');
    }
    var target = (accent !== undefined && accent !== null)
      ? String(accent).trim()
      : ((typeof CONFIG !== 'undefined' && CONFIG.accent_letter) ? String(CONFIG.accent_letter).trim() : 'x');
    if (!target) {
      return highlightCapitals(name);
    }

    // Support inverted syntax: e.g. "!x", "^x", "-x", "not x", "except x"
    var invertMatch = target.match(/^(!|\^|-|not\s+|except\s+)(.+)$/i);
    if (invertMatch) {
      var excludedLetters = invertMatch[2].toLowerCase();
      var outInvert = '';
      for (var i = 0; i < name.length; i++) {
        var ch = name[i];
        if (excludedLetters.indexOf(ch.toLowerCase()) === -1 && /[a-zA-Z0-9]/.test(ch)) {
          outInvert += '<span class="glyph-5">' + ch + '</span>';
        } else {
          outInvert += ch;
        }
      }
      return outInvert;
    }

    // Exact contiguous match (e.g. single letter "x" or exact substring)
    var escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var exactRegex = new RegExp('(' + escaped + ')', 'i');
    if (exactRegex.test(name)) {
      return name.replace(exactRegex, '<span class="glyph-5">$1</span>');
    }

    // Character set matching (e.g. user typed "khaiyan" to color all letters in khaiyan while leaving x white)
    var cleanTarget = target.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (cleanTarget.length > 0) {
      var targetSet = {};
      for (var t = 0; t < cleanTarget.length; t++) {
        targetSet[cleanTarget[t]] = true;
      }
      var outSet = '';
      var hasAnyMatch = false;
      for (var k = 0; k < name.length; k++) {
        var c = name[k];
        if (targetSet[c.toLowerCase()]) {
          outSet += '<span class="glyph-5">' + c + '</span>';
          hasAnyMatch = true;
        } else {
          outSet += c;
        }
      }
      if (hasAnyMatch) {
        return outSet;
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
    { id: 'LinkedIn', label: 'LinkedIn', icon: 'simple-icons:linkedin', url: 'https://linkedin.com/in/username' },
    { id: 'Instagram', label: 'Instagram', icon: 'simple-icons:instagram', url: 'https://instagram.com/username' },
    { id: 'YouTube', label: 'YouTube', icon: 'simple-icons:youtube', url: 'https://youtube.com/@channel' },
    { id: 'Discord', label: 'Discord', icon: 'simple-icons:discord', url: 'https://discord.gg/invitecode' },
    { id: 'Spotify', label: 'Spotify', icon: 'simple-icons:spotify', url: 'https://open.spotify.com/user/username' },
    { id: 'Steam', label: 'Steam', icon: 'simple-icons:steam', url: 'https://steamcommunity.com/id/username' },
    { id: 'TikTok', label: 'TikTok', icon: 'simple-icons:tiktok', url: 'https://tiktok.com/@username' },
    { id: 'Twitch', label: 'Twitch', icon: 'simple-icons:twitch', url: 'https://twitch.tv/username' },
    { id: 'Reddit', label: 'Reddit', icon: 'simple-icons:reddit', url: 'https://reddit.com/user/username' },
    { id: 'Bluesky', label: 'Bluesky', icon: 'simple-icons:bluesky', url: 'https://bsky.app/profile/username.bsky.social' },
    { id: 'Medium', label: 'Medium', icon: 'simple-icons:medium', url: 'https://medium.com/@username' },
    { id: 'Substack', label: 'Substack', icon: 'simple-icons:substack', url: 'https://username.substack.com' },
    { id: 'WhatsApp', label: 'WhatsApp', icon: 'simple-icons:whatsapp', url: 'https://wa.me/phonenumber' },
    { id: 'Facebook', label: 'Facebook', icon: 'simple-icons:facebook', url: 'https://facebook.com/username' },
    { id: 'Threads', label: 'Threads', icon: 'simple-icons:threads', url: 'https://threads.net/@username' },
    { id: 'Pinterest', label: 'Pinterest', icon: 'simple-icons:pinterest', url: 'https://pinterest.com/username' },
    { id: 'Kick', label: 'Kick', icon: 'simple-icons:kick', url: 'https://kick.com/username' },
    { id: 'Patreon', label: 'Patreon', icon: 'simple-icons:patreon', url: 'https://patreon.com/username' },
    { id: 'Snapchat', label: 'Snapchat', icon: 'simple-icons:snapchat', url: 'https://snapchat.com/add/username' },
    // Lucide Icons (Web, Tools & General)
    { id: 'Website', label: 'Website', icon: 'lucide:globe', url: 'https://yourwebsite.com' },
    { id: 'Portfolio', label: 'Portfolio', icon: 'lucide:briefcase', url: 'https://yourportfolio.com' },
    { id: 'Blog', label: 'Blog / RSS', icon: 'lucide:rss', url: 'https://yourblog.com' },
    { id: 'Code', label: 'Code / Dev', icon: 'lucide:code-2', url: 'https://...' },
    // Custom Option (Any Simple Icon or Lucide Icon)
    { id: 'Custom', label: 'Custom', icon: 'lucide:link', url: 'https://...' }
  ];

  var ICON_SWITCH_MAP = {
    'instagram': { simple: 'simple-icons:instagram', lucide: 'lucide:instagram' },
    'youtube': { simple: 'simple-icons:youtube', lucide: 'lucide:youtube' },
    'linkedin': { simple: 'simple-icons:linkedin', lucide: 'lucide:linkedin' },
    'facebook': { simple: 'simple-icons:facebook', lucide: 'lucide:facebook' },
    'twitch': { simple: 'simple-icons:twitch', lucide: 'lucide:twitch' },
    'github': { simple: 'simple-icons:github', lucide: 'lucide:github' },
    'twitter': { simple: 'simple-icons:x', lucide: 'lucide:twitter' },
    'x': { simple: 'simple-icons:x', lucide: 'lucide:twitter' },
    'discord': { simple: 'simple-icons:discord', lucide: 'lucide:message-square' },
    'spotify': { simple: 'simple-icons:spotify', lucide: 'lucide:music' },
    'steam': { simple: 'simple-icons:steam', lucide: 'lucide:gamepad-2' },
    'tiktok': { simple: 'simple-icons:tiktok', lucide: 'lucide:video' },
    'reddit': { simple: 'simple-icons:reddit', lucide: 'lucide:bot' },
    'bluesky': { simple: 'simple-icons:bluesky', lucide: 'lucide:cloud' },
    'medium': { simple: 'simple-icons:medium', lucide: 'lucide:book-open' },
    'substack': { simple: 'simple-icons:substack', lucide: 'lucide:mail' },
    'whatsapp': { simple: 'simple-icons:whatsapp', lucide: 'lucide:phone' },
    'threads': { simple: 'simple-icons:threads', lucide: 'lucide:at-sign' },
    'pinterest': { simple: 'simple-icons:pinterest', lucide: 'lucide:pin' },
    'kick': { simple: 'simple-icons:kick', lucide: 'lucide:play' },
    'patreon': { simple: 'simple-icons:patreon', lucide: 'lucide:heart' },
    'snapchat': { simple: 'simple-icons:snapchat', lucide: 'lucide:ghost' },
    'website': { simple: 'simple-icons:googlechrome', lucide: 'lucide:globe' },
    'portfolio': { simple: 'simple-icons:notion', lucide: 'lucide:briefcase' },
    'blog': { simple: 'simple-icons:rss', lucide: 'lucide:rss' },
    'code': { simple: 'simple-icons:visualstudiocode', lucide: 'lucide:code-2' }
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
      var lucideNames = ['globe', 'link', 'code', 'code-2', 'rss', 'terminal', 'briefcase', 'mail', 'heart', 'sparkles', 'coffee', 'zap', 'music', 'camera', 'cpu', 'shield', 'compass', 'at-sign', 'book', 'layers', 'external-link'];
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
        var lucideList = ['globe', 'link', 'code', 'code-2', 'rss', 'terminal', 'briefcase', 'mail', 'heart', 'sparkles', 'coffee', 'zap', 'music', 'camera', 'cpu', 'shield', 'compass', 'at-sign', 'book', 'layers', 'external-link'];
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

  /* ─── Custom Brand Icons Registration (Inngest, Clerk, etc.) ─── */
  var INNGEST_ICON_DATA = {
    body: '<path d="M21.4072 129.294C19.0746 129.294 16.9123 127.809 16.17 125.48C12.2674 113.258 15.1639 103.03 25.2893 93.2902L66.5214 54.0973C72.8173 48.0347 81.6973 46.4807 89.7012 50.0448C97.6725 53.5967 102.419 61.177 102.106 69.8471V74.061C102.106 77.0843 99.6441 79.5303 96.6097 79.5303C93.5753 79.5303 91.1129 77.0802 91.1129 74.061V69.7421C91.1129 69.6655 91.1129 69.5928 91.1169 69.5202C91.2914 65.3022 89.0845 61.7542 85.2104 60.0307C81.3363 58.3072 77.2066 59.0297 74.1641 61.9681C74.156 61.9762 74.1439 61.9883 74.1358 61.9964L32.9159 101.177C25.8816 107.946 24.0602 114.037 26.6565 122.166C27.5774 125.044 25.9749 128.12 23.0825 129.036C22.5268 129.21 21.9669 129.294 21.4152 129.294H21.4072Z" fill="currentColor"/><path d="M112.284 144.019C109.371 144.019 106.41 143.397 103.562 142.13C95.591 138.578 90.8447 130.998 91.1571 122.328V118.142C91.1571 115.119 93.6195 112.673 96.6539 112.673C99.6883 112.673 102.151 115.123 102.151 118.142V122.433C102.151 122.509 102.151 122.582 102.147 122.659C101.972 126.877 104.179 130.425 108.053 132.148C111.927 133.872 116.057 133.149 119.099 130.211L160.031 91.0136C167.195 84.1195 169.025 78.0569 166.335 70.0972C165.37 67.2314 166.915 64.1315 169.796 63.1668C172.676 62.2062 175.791 63.744 176.761 66.6098C180.797 78.5574 177.824 89.1165 167.67 98.8885L126.746 138.077C122.698 141.985 117.566 144.023 112.284 144.023V144.019Z" fill="currentColor"/><path d="M42.9197 143.918C39.6662 143.918 36.4209 143.333 33.3338 142.126C33.0336 142.009 32.7334 141.888 32.4373 141.758C29.6463 140.564 28.3603 137.347 29.5611 134.57C30.7619 131.793 33.9951 130.513 36.786 131.708C36.9727 131.789 37.1592 131.865 37.3458 131.938C42.8994 134.102 49.4266 132.818 54.392 128.592C54.6272 128.378 55.4021 127.655 55.5075 127.555L129.485 57.4512C129.485 57.4512 131.075 55.9578 131.42 55.6712C136.45 51.4532 142.162 48.9264 147.939 48.3654C149.164 48.2443 150.405 48.208 151.626 48.2524C154.356 48.3452 157.35 48.6358 160.604 50.1333C163.358 51.4048 164.559 54.654 163.281 57.3987C162.003 60.1394 158.738 61.3342 155.979 60.0627C154.576 59.4169 153.18 59.2514 151.237 59.1868C150.49 59.1586 149.748 59.1828 149.01 59.2555C145.472 59.5985 141.862 61.2373 138.56 63.9941C138.296 64.2323 137.237 65.2171 137.067 65.3746L63.0895 135.482C63.0895 135.482 61.8765 136.62 61.6088 136.85C56.2012 141.484 49.5442 143.918 42.9197 143.922V143.918Z" fill="currentColor"/>',
    width: 192,
    height: 192
  };
  var CLERK_ICON_DATA = {
    body: '<g fill="none"><circle cx="64" cy="64" r="20" fill="#6c47ff"/><path fill="#bab1ff" d="M99.572 10.788c1.999 1.34 2.17 4.156.468 5.858L85.424 31.262c-1.32 1.32-3.37 1.53-5.033.678A35.85 35.85 0 0 0 64 28c-19.882 0-36 16.118-36 36a35.85 35.85 0 0 0 3.94 16.391c.851 1.663.643 3.712-.678 5.033L16.646 100.04c-1.702 1.702-4.519 1.531-5.858-.468C3.974 89.399 0 77.163 0 64C0 28.654 28.654 0 64 0c13.163 0 25.399 3.974 35.572 10.788"/><path fill="#6c47ff" d="M100.04 111.354c1.702 1.702 1.531 4.519-.468 5.858C89.399 124.026 77.164 128 64 128s-25.399-3.974-35.572-10.788c-2-1.339-2.17-4.156-.468-5.858l14.615-14.616c1.322-1.32 3.37-1.53 5.033-.678A35.85 35.85 0 0 0 64 100a35.85 35.85 0 0 0 16.392-3.94c1.662-.852 3.712-.643 5.032.678z"/></g>',
    width: 128,
    height: 128
  };
  window.IconifyPreload = window.IconifyPreload || [];
  window.IconifyPreload.push({ prefix: 'custom', icons: { 'inngest': INNGEST_ICON_DATA, 'clerk': CLERK_ICON_DATA } });
  window.IconifyPreload.push({ prefix: 'logos', icons: { 'inngest': INNGEST_ICON_DATA, 'clerk': CLERK_ICON_DATA } });
  window.IconifyPreload.push({ prefix: 'simple-icons', icons: { 'clerk': CLERK_ICON_DATA } });
  function registerCustomIcons() {
    try {
      var el = window.customElements && window.customElements.get('iconify-icon');
      if (el && typeof el.addIcon === 'function') {
        el.addIcon('custom:inngest', INNGEST_ICON_DATA);
        el.addIcon('logos:inngest', INNGEST_ICON_DATA);
        el.addIcon('thesvg-color:inngest-dark', INNGEST_ICON_DATA);
        el.addIcon('thesvg-color:inngest-light', INNGEST_ICON_DATA);
        el.addIcon('custom:clerk', CLERK_ICON_DATA);
        el.addIcon('logos:clerk', CLERK_ICON_DATA);
        el.addIcon('simple-icons:clerk', CLERK_ICON_DATA);
      }
    } catch (e) {}
  }
  registerCustomIcons();
  if (window.customElements && window.customElements.whenDefined) {
    window.customElements.whenDefined('iconify-icon').then(registerCustomIcons);
  }

  /* ─── Skill Icon Resolver (Original Full-Color Brand Logos) ─── */
  var SKILL_ICON_MAP = {
    // Web & Frameworks
    'javascript': 'logos:javascript',
    'js': 'logos:javascript',
    'typescript': 'logos:typescript-icon',
    'ts': 'logos:typescript-icon',
    'react': 'logos:react',
    'react.js': 'logos:react',
    'reactjs': 'logos:react',
    'next.js': 'logos:nextjs-icon',
    'nextjs': 'logos:nextjs-icon',
    'vue': 'logos:vue',
    'vue.js': 'logos:vue',
    'vuejs': 'logos:vue',
    'angular': 'logos:angular-icon',
    'svelte': 'logos:svelte-icon',
    'astro': 'logos:astro-icon',
    'remix': 'logos:remix-icon',
    'nuxt': 'logos:nuxt-icon',
    'nuxt.js': 'logos:nuxt-icon',
    'html': 'logos:html-5',
    'html5': 'logos:html-5',
    'css': 'logos:css-3',
    'css3': 'logos:css-3',
    'sass': 'logos:sass',
    'scss': 'logos:sass',
    'tailwind': 'logos:tailwindcss-icon',
    'tailwind css': 'logos:tailwindcss-icon',
    'tailwindcss': 'logos:tailwindcss-icon',
    'bootstrap': 'logos:bootstrap',
    'jquery': 'logos:jquery-mobile',
    // Backend & Runtime
    'node': 'logos:nodejs-icon',
    'node.js': 'logos:nodejs-icon',
    'nodejs': 'logos:nodejs-icon',
    'express': 'skill-icons:expressjs-light',
    'express.js': 'skill-icons:expressjs-light',
    'fastapi': 'logos:fastapi-icon',
    'django': 'logos:django-icon',
    'flask': 'logos:flask',
    'laravel': 'logos:laravel',
    'spring': 'logos:spring-icon',
    'graphql': 'logos:graphql',
    'rest': 'lucide:globe',
    'restapi': 'lucide:globe',
    'websocket': 'lucide:activity',
    'socket.io': 'logos:socket-io',
    // Languages
    'python': 'logos:python',
    'java': 'logos:java',
    'c': 'logos:c',
    'c++': 'logos:c-plusplus',
    'cpp': 'logos:c-plusplus',
    'c#': 'logos:c-sharp',
    'csharp': 'logos:c-sharp',
    'go': 'logos:go',
    'golang': 'logos:go',
    'rust': 'logos:rust',
    'ruby': 'logos:ruby',
    'php': 'logos:php',
    'swift': 'logos:swift',
    'kotlin': 'logos:kotlin-icon',
    'dart': 'logos:dart',
    'r': 'logos:r-lang',
    'scala': 'logos:scala',
    'elixir': 'logos:elixir-icon',
    'haskell': 'logos:haskell-icon',
    // Databases
    'mongodb': 'logos:mongodb-icon',
    'postgres': 'logos:postgresql',
    'postgresql': 'logos:postgresql',
    'mysql': 'logos:mysql-icon',
    'sqlite': 'logos:sqlite',
    'redis': 'logos:redis',
    'firebase': 'logos:firebase',
    'supabase': 'logos:supabase-icon',
    'prisma': 'logos:prisma',
    'dynamodb': 'logos:aws-dynamodb',
    'elasticsearch': 'logos:elasticsearch',
    // DevOps & Cloud & Auth
    'cloudinary': 'logos:cloudinary-icon',
    'clerk': 'logos:clerk',
    'clerk auth': 'logos:clerk',
    'clerk.dev': 'logos:clerk',
    'clerk.com': 'logos:clerk',
    'inngest': 'custom:inngest',
    'inggest': 'custom:inngest',
    'ingest': 'custom:inngest',
    'docker': 'logos:docker-icon',
    'kubernetes': 'logos:kubernetes',
    'k8s': 'logos:kubernetes',
    'aws': 'logos:aws',
    'azure': 'logos:azure-icon',
    'gcp': 'logos:google-cloud',
    'google cloud': 'logos:google-cloud',
    'vercel': 'logos:vercel-icon',
    'netlify': 'logos:netlify-icon',
    'heroku': 'logos:heroku-icon',
    'nginx': 'logos:nginx',
    'terraform': 'logos:terraform-icon',
    'ansible': 'logos:ansible',
    'jenkins': 'logos:jenkins',
    'github actions': 'logos:github-actions',
    'ci/cd': 'lucide:git-branch',
    // Tools & Other
    'git': 'logos:git-icon',
    'github': 'logos:github-icon',
    'gitlab': 'logos:gitlab',
    'linux': 'logos:linux-tux',
    'ubuntu': 'logos:ubuntu',
    'bash': 'logos:bash-icon',
    'shell': 'lucide:terminal',
    'terminal': 'lucide:terminal',
    'vscode': 'logos:visual-studio-code',
    'vs code': 'logos:visual-studio-code',
    'figma': 'logos:figma',
    'photoshop': 'logos:adobe-photoshop',
    'illustrator': 'logos:adobe-illustrator',
    'blender': 'logos:blender',
    // Mobile
    'react native': 'logos:react',
    'flutter': 'logos:flutter',
    'android': 'logos:android-icon',
    'ios': 'logos:apple',
    // AI/ML
    'tensorflow': 'logos:tensorflow',
    'pytorch': 'logos:pytorch-icon',
    'openai': 'logos:openai-icon',
    'machine learning': 'lucide:cpu',
    'ai': 'lucide:sparkles',
    'ml': 'lucide:cpu',
    'llm': 'lucide:sparkles',
    // Testing
    'jest': 'logos:jest',
    'cypress': 'logos:cypress-icon',
    'vitest': 'logos:vitest',
    'testing': 'lucide:check-circle',
    // Other popular
    'wordpress': 'logos:wordpress-icon',
    'shopify': 'logos:shopify',
    'stripe': 'logos:stripe',
    'threejs': 'logos:threejs',
    'three.js': 'logos:threejs',
    'webgl': 'logos:webgl',
    'blockchain': 'lucide:link',
    'solidity': 'logos:solidity',
    'web3': 'logos:web3js',
    'arduino': 'logos:arduino',
    'raspberrypi': 'logos:raspberry-pi'
  };

  function getSkillIcon(skillName) {
    var key = (skillName || '').toLowerCase().trim();
    var icon = SKILL_ICON_MAP[key] || null;
    if (!icon) {
      // Fuzzy: partial match (only for keys with >= 3 characters to avoid false matches like 'c' matching 'clerk')
      for (var k in SKILL_ICON_MAP) {
        if (k.length >= 3 && key.length >= 3 && (key.indexOf(k) !== -1 || k.indexOf(key) !== -1)) {
          icon = SKILL_ICON_MAP[k];
          break;
        }
      }
    }
    return icon || 'lucide:code-2';
  }

  /* ─── Skill Official Website Resolver ─── */
  var SKILL_URL_MAP = {
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'js': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'typescript': 'https://www.typescriptlang.org/',
    'ts': 'https://www.typescriptlang.org/',
    'react': 'https://react.dev/',
    'react.js': 'https://react.dev/',
    'reactjs': 'https://react.dev/',
    'next.js': 'https://nextjs.org/',
    'nextjs': 'https://nextjs.org/',
    'vue': 'https://vuejs.org/',
    'vue.js': 'https://vuejs.org/',
    'vuejs': 'https://vuejs.org/',
    'angular': 'https://angular.dev/',
    'svelte': 'https://svelte.dev/',
    'astro': 'https://astro.build/',
    'remix': 'https://remix.run/',
    'nuxt': 'https://nuxt.com/',
    'nuxt.js': 'https://nuxt.com/',
    'html': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'html5': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'css': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'css3': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'sass': 'https://sass-lang.com/',
    'scss': 'https://sass-lang.com/',
    'tailwind': 'https://tailwindcss.com/',
    'tailwind css': 'https://tailwindcss.com/',
    'tailwindcss': 'https://tailwindcss.com/',
    'bootstrap': 'https://getbootstrap.com/',
    'jquery': 'https://jquery.com/',
    'node': 'https://nodejs.org/',
    'node.js': 'https://nodejs.org/',
    'nodejs': 'https://nodejs.org/',
    'express': 'https://expressjs.com/',
    'express.js': 'https://expressjs.com/',
    'fastapi': 'https://fastapi.tiangolo.com/',
    'django': 'https://www.djangoproject.com/',
    'flask': 'https://flask.palletsprojects.com/',
    'laravel': 'https://laravel.com/',
    'spring': 'https://spring.io/',
    'graphql': 'https://graphql.org/',
    'socket.io': 'https://socket.io/',
    'python': 'https://www.python.org/',
    'java': 'https://www.java.com/',
    'c++': 'https://isocpp.org/',
    'cpp': 'https://isocpp.org/',
    'c#': 'https://learn.microsoft.com/dotnet/csharp/',
    'csharp': 'https://learn.microsoft.com/dotnet/csharp/',
    'go': 'https://go.dev/',
    'golang': 'https://go.dev/',
    'rust': 'https://www.rust-lang.org/',
    'ruby': 'https://www.ruby-lang.org/',
    'php': 'https://www.php.net/',
    'swift': 'https://www.swift.org/',
    'kotlin': 'https://kotlinlang.org/',
    'dart': 'https://dart.dev/',
    'r': 'https://www.r-project.org/',
    'scala': 'https://www.scala-lang.org/',
    'mongodb': 'https://www.mongodb.com/',
    'postgres': 'https://www.postgresql.org/',
    'postgresql': 'https://www.postgresql.org/',
    'mysql': 'https://www.mysql.com/',
    'sqlite': 'https://www.sqlite.org/',
    'redis': 'https://redis.io/',
    'firebase': 'https://firebase.google.com/',
    'supabase': 'https://supabase.com/',
    'prisma': 'https://www.prisma.io/',
    'cloudinary': 'https://cloudinary.com/',
    'clerk': 'https://clerk.com/',
    'clerk auth': 'https://clerk.com/',
    'clerk.dev': 'https://clerk.com/',
    'clerk.com': 'https://clerk.com/',
    'inngest': 'https://www.inngest.com/',
    'inggest': 'https://www.inngest.com/',
    'ingest': 'https://www.inngest.com/',
    'docker': 'https://www.docker.com/',
    'kubernetes': 'https://kubernetes.io/',
    'k8s': 'https://kubernetes.io/',
    'aws': 'https://aws.amazon.com/',
    'azure': 'https://azure.microsoft.com/',
    'gcp': 'https://cloud.google.com/',
    'google cloud': 'https://cloud.google.com/',
    'vercel': 'https://vercel.com/',
    'netlify': 'https://www.netlify.com/',
    'heroku': 'https://www.heroku.com/',
    'nginx': 'https://nginx.org/',
    'git': 'https://git-scm.com/',
    'github': 'https://github.com/',
    'gitlab': 'https://gitlab.com/',
    'linux': 'https://www.linux.org/',
    'ubuntu': 'https://ubuntu.com/',
    'vscode': 'https://code.visualstudio.com/',
    'vs code': 'https://code.visualstudio.com/',
    'figma': 'https://www.figma.com/',
    'photoshop': 'https://www.adobe.com/products/photoshop.html',
    'flutter': 'https://flutter.dev/',
    'android': 'https://developer.android.com/',
    'tensorflow': 'https://www.tensorflow.org/',
    'pytorch': 'https://pytorch.org/',
    'openai': 'https://openai.com/',
    'jest': 'https://jestjs.io/',
    'cypress': 'https://www.cypress.io/',
    'vitest': 'https://vitest.dev/',
    'wordpress': 'https://wordpress.org/',
    'shopify': 'https://www.shopify.com/',
    'stripe': 'https://stripe.com/',
    'threejs': 'https://threejs.org/',
    'three.js': 'https://threejs.org/',
    'solidity': 'https://soliditylang.org/',
    'web3': 'https://web3js.readthedocs.io/'
  };

  function getSkillUrl(skillName, customUrl) {
    if (customUrl && typeof customUrl === 'string' && customUrl.trim()) return customUrl.trim();
    var key = (skillName || '').toLowerCase().trim();
    if (SKILL_URL_MAP[key]) return SKILL_URL_MAP[key];
    for (var k in SKILL_URL_MAP) {
      if (k.length >= 3 && key.length >= 3 && (key.indexOf(k) !== -1 || k.indexOf(key) !== -1)) {
        return SKILL_URL_MAP[k];
      }
    }
    return 'https://www.google.com/search?q=' + encodeURIComponent(skillName + ' official website');
  }

  /* ─── Interactive Skills Pills Display (Clickable Links) ─── */
  function renderSkills(skills) {
    var container = document.getElementById('skills-container');
    if (!container) return;

    var list = Array.isArray(skills) ? skills : [];
    if (list.length === 0) {
      container.innerHTML = '<div style="padding:16px 18px; font-size:0.78rem; color:var(--ink-faint); font-family:var(--font-mono);">No skills listed yet.</div>';
      return;
    }

    var html = '<div class="skills-pills-wrap">';
    list.forEach(function (s) {
      var name = (typeof s === 'string' ? s : (s && s.name ? s.name : '')).trim();
      var customUrl = (s && typeof s === 'object' && s.url) ? s.url : '';
      if (!name) return;
      var icon = getSkillIcon(name);
      var url = getSkillUrl(name, customUrl);
      html += '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="skill-pill" title="Visit ' + escapeHtml(name) + ' website" aria-label="' + escapeHtml(name) + '">' +
        '<iconify-icon icon="' + escapeHtml(icon) + '" class="skill-pill-icon" width="14" height="14" aria-hidden="true"></iconify-icon>' +
        '<span class="skill-pill-name">' + escapeHtml(name) + '</span>' +
        '</a>';
    });
    html += '</div>';

    container.innerHTML = html;
  }

  /* ─── Qualifications Display ─── */
  function renderQualifications(qualifications) {
    var container = document.getElementById('qualifications-container');
    if (!container) return;

    var list = Array.isArray(qualifications) ? qualifications : [];
    if (list.length === 0) {
      container.innerHTML = '<div style="padding:16px 18px; font-size:0.78rem; color:var(--ink-faint); font-family:var(--font-mono);">No qualifications listed yet.</div>';
      return;
    }

    var html = '<div class="qualifications-list">';
    list.forEach(function (q) {
      var title = (q.title || '').trim();
      var issuer = (q.issuer || q.institution || '').trim();
      var year = (q.year || q.duration || '').trim();
      var tag = (q.tag || q.type || 'Degree').trim();
      var desc = (q.description || '').trim();
      var url = (q.url || '').trim();

      html += '<div class="qual-item">';
      html += '  <div class="qual-main">';
      html += '    <div class="qual-top-row">';
      html += '      <span class="qual-tag">' + escapeHtml(tag) + '</span>';
      html += '    </div>';
      if (title) {
        html += '    <h3 class="qual-title">' + escapeHtml(title) + '</h3>';
      }
      if (issuer) {
        html += '    <div class="qual-issuer">';
        html += '      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>';
        html += '      <span>' + escapeHtml(issuer) + '</span>';
        html += '    </div>';
      }
      if (desc) {
        html += '    <p class="qual-desc">' + parseRichText(desc) + '</p>';
      }
      html += '  </div>';
      if (year || url) {
        html += '  <div class="qual-right-col">';
        if (year) {
          html += '    <span class="qual-year">' + escapeHtml(year) + '</span>';
        }
        if (url) {
          html += '    <a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="qual-link-btn" title="Verify Credential">';
          html += '      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
          html += '      <span>Link</span>';
          html += '    </a>';
        }
        html += '  </div>';
      }
      html += '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
  }

  /* ─── Devices Display ─── */
  function getDeviceIcon(typeOrIcon) {
    var raw = (typeOrIcon || '').toLowerCase().trim();
    if (raw.indexOf(':') !== -1) return raw;
    if (raw.indexOf('laptop') !== -1 || raw.indexOf('notebook') !== -1 || raw.indexOf('macbook') !== -1) return 'lucide:laptop';
    if (raw.indexOf('phone') !== -1 || raw.indexOf('mobile') !== -1 || raw.indexOf('android') !== -1 || raw.indexOf('iphone') !== -1) return 'lucide:smartphone';
    if (raw.indexOf('monitor') !== -1 || raw.indexOf('display') !== -1 || raw.indexOf('screen') !== -1) return 'lucide:monitor';
    if (raw.indexOf('keyboard') !== -1) return 'lucide:keyboard';
    if (raw.indexOf('mouse') !== -1) return 'lucide:mouse';
    if (raw.indexOf('audio') !== -1 || raw.indexOf('headphone') !== -1 || raw.indexOf('earbud') !== -1) return 'lucide:headphones';
    if (raw.indexOf('tablet') !== -1 || raw.indexOf('ipad') !== -1) return 'lucide:tablet';
    if (raw.indexOf('watch') !== -1) return 'lucide:watch';
    if (raw.indexOf('desktop') !== -1 || raw.indexOf('pc') !== -1 || raw.indexOf('rig') !== -1 || raw.indexOf('tower') !== -1) return 'lucide:cpu';
    return 'lucide:laptop';
  }

  function renderDevices(devices) {
    var container = document.getElementById('devices-container');
    if (!container) return;

    var list = Array.isArray(devices) ? devices : [];
    if (list.length === 0) {
      container.innerHTML = '<div style="padding:16px 18px; font-size:0.78rem; color:var(--ink-faint); font-family:var(--font-mono);">No devices listed yet.</div>';
      return;
    }

    var html = '<div class="devices-list">';
    list.forEach(function (d) {
      var name = (d.name || d.title || '').trim();
      var type = (d.type || d.category || 'Device').trim();
      var specs = (d.specs || d.model || '').trim();
      var tag = (d.tag || type || 'Gear').trim();
      var desc = (d.description || '').trim();
      var url = (d.url || '').trim();
      var icon = getDeviceIcon(d.icon || type);

      html += '<div class="device-card">';
      html += '  <div class="device-icon-box">';
      html += '    <iconify-icon icon="' + escapeHtml(icon) + '" width="22" height="22"></iconify-icon>';
      html += '  </div>';
      html += '  <div class="device-content">';
      html += '    <div class="device-title-area">';
      if (name) {
        html += '      <h3 class="device-name">' + escapeHtml(name) + '</h3>';
      }
      if (specs) {
        html += '      <div class="device-specs"><span>' + escapeHtml(specs) + '</span></div>';
      }
      html += '    </div>';
      if (desc) {
        html += '    <p class="device-desc">' + parseRichText(desc) + '</p>';
      }
      html += '  </div>';
      if (tag || url) {
        html += '  <div class="device-right-col">';
        if (tag) {
          html += '    <span class="device-tag">' + escapeHtml(tag) + '</span>';
        }
        if (url) {
          html += '    <a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="qual-link-btn" title="View Specs">';
          html += '      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
          html += '      <span>Link</span>';
          html += '    </a>';
        }
        html += '  </div>';
      }
      html += '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
  }

  /* ─── Sync Config Links, Bio & Analytics ─── */
  if (typeof CONFIG !== 'undefined') {
    var siteName = CONFIG.site_name || 'khxaiyan';
    var accentLetter = CONFIG.accent_letter !== undefined ? CONFIG.accent_letter : 'x';

    var wordmark = document.querySelector('.wordmark');
    if (wordmark) {
      wordmark.innerHTML = formatWordmark(siteName, accentLetter);
    }

    var cornerTag = document.getElementById('corner-tag');
    if (cornerTag) {
      cornerTag.innerHTML = '@' + formatWordmark(siteName, accentLetter);
      cornerTag.style.display = '';
    }

    var modalDevTitle = document.getElementById('modal-dev-title');
    if (modalDevTitle) {
      modalDevTitle.innerHTML = formatWordmark(siteName, accentLetter);
    }

    var bioEl = document.querySelector('.bio');
    if (bioEl) {
      if (CONFIG.site_desc && typeof CONFIG.site_desc === 'string' && CONFIG.site_desc.trim()) {
        bioEl.innerHTML = parseRichText(CONFIG.site_desc.trim());
      } else {
        bioEl.innerHTML = '';
      }
    }

    var introRow = document.getElementById('rail-row-intro');
    var hasIntro = !!(CONFIG.intro && typeof CONFIG.intro === 'string' && CONFIG.intro.trim());
    if (introRow) {
      introRow.style.display = (CONFIG.intro_enabled !== false && hasIntro) ? '' : 'none';
    }

    var introEl = document.getElementById('intro-text');
    if (introEl) {
      introEl.innerHTML = hasIntro ? parseRichText(CONFIG.intro.trim()) : '';
    }

    /* Apply skills */
    var skillsRow = document.getElementById('rail-row-skills');
    var isSkillsEnabled = (CONFIG.skills_enabled !== false);
    var skillsList = Array.isArray(CONFIG.skills) ? CONFIG.skills : [];
    if (skillsRow) {
      if (isSkillsEnabled && skillsList.length > 0) {
        skillsRow.style.display = '';
        renderSkills(skillsList);
      } else {
        skillsRow.style.display = 'none';
      }
    }

    /* Apply qualifications */
    var qualRow = document.getElementById('rail-row-qualifications');
    var isQualEnabled = (CONFIG.qualifications_enabled !== false);
    var qualList = Array.isArray(CONFIG.qualifications) ? CONFIG.qualifications : [];
    if (qualRow) {
      if (isQualEnabled && qualList.length > 0) {
        qualRow.style.display = '';
        renderQualifications(qualList);
      } else {
        qualRow.style.display = 'none';
      }
    }

    /* Apply projects */
    var projectsRow = document.getElementById('rail-row-projects');
    if (projectsRow && CONFIG.projects_enabled === false) {
      projectsRow.style.display = 'none';
    }

    /* Apply devices */
    var devicesRow = document.getElementById('rail-row-devices');
    var devicesList = Array.isArray(CONFIG.devices) ? CONFIG.devices : [];
    if (devicesRow) {
      if (CONFIG.devices_enabled !== false && devicesList.length > 0) {
        devicesRow.style.display = '';
        renderDevices(devicesList);
      } else {
        devicesRow.style.display = 'none';
      }
    }

    /* Apply reach */
    var reachRow = document.getElementById('rail-row-reach');
    if (reachRow && CONFIG.reach_enabled === false) {
      reachRow.style.display = 'none';
    }

    /* Apply message */
    var messageRow = document.getElementById('rail-row-message');
    if (messageRow && CONFIG.message_enabled === false) {
      messageRow.style.display = 'none';
    }

    /* Apply custom section order if set */
    if (Array.isArray(CONFIG.section_order) && CONFIG.section_order.length > 0) {
      var anyRow = document.getElementById('rail-row-intro');
      var railParent = anyRow && anyRow.parentNode;
      if (railParent) {
        CONFIG.section_order.forEach(function (key) {
          var el = document.getElementById('rail-row-' + key);
          if (el && el.parentNode === railParent) {
            railParent.appendChild(el);
          }
        });
        var footerEl = railParent.querySelector('.footer-row, footer');
        if (footerEl && footerEl.parentNode === railParent) {
          railParent.appendChild(footerEl);
        }
      }
    }

    updateTimelineLastRow();

    /* Apply saved avatar/profile picture */
    if (CONFIG.avatar_url && CONFIG.avatar_url.trim()) {
      setPageAvatar(CONFIG.avatar_url.trim());
    } else {
      setPageAvatar('https://res.cloudinary.com/dqxccz5bn/image/upload/profile_icon_wf7thb.svg');
    }

    /* Apply saved favicon */
    if (CONFIG.favicon_url && CONFIG.favicon_url.trim()) {
      applyPageFavicon(CONFIG.favicon_url.trim());
    }

    /* Apply dynamic and core channel links */
    renderChannelList(CONFIG);

    /* Apply CV button (Supports .pdf, .docx, .doc, images, or online links) */
    var cvBtn = document.getElementById('cv-download-btn');
    if (cvBtn) {
      var cvTarget = (CONFIG.cv_url && typeof CONFIG.cv_url === 'string' && CONFIG.cv_url.trim()) ? CONFIG.cv_url.trim() : '';
      var isCvEnabled = CONFIG.cv_enabled === true;
      if (!isCvEnabled || !cvTarget) {
        cvBtn.style.display = 'none';
        cvBtn.removeAttribute('href');
      } else {
        cvBtn.style.display = 'inline-flex';
        var isDataUrl = cvTarget.startsWith('data:');
        cvBtn.href = isDataUrl ? '#' : cvTarget;
        var cvLabelText = (CONFIG.cv_label && CONFIG.cv_label.trim()) ? CONFIG.cv_label.trim() : 'CV';
        var cvAction = (CONFIG.cv_action === 'download') ? 'download' : 'preview';
        var cleanPath = cvTarget.split('?')[0].split('#')[0];
        var isExternalWeb = !isDataUrl && /^(https?:\/\/)/i.test(cvTarget) && !/\.(pdf|docx?|rtf|txt|md|markdown|html?|png|jpe?g|webp)$/i.test(cleanPath);

        var PREVIEW_ICON_SVG = '<svg class="cv-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px; color:var(--red);"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>';
        var DOWNLOAD_ICON_SVG = '<svg class="cv-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px; color:var(--red);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>';

        var accentLetter = CONFIG.accent_letter !== undefined ? CONFIG.accent_letter : 'x';
        var formattedLabel = formatWordmark(cvLabelText, accentLetter);
        var plainLabel = cvLabelText.replace(/\{([^}]+)\}/g, '$1');

        if (cvAction === 'download' && !isExternalWeb) {
          var cleanName = (isDataUrl ? (plainLabel + '.pdf') : (cleanPath.split('/').pop() || (plainLabel + '.pdf')));
          cvBtn.setAttribute('download', cleanName);
          cvBtn.innerHTML = DOWNLOAD_ICON_SVG + '<span>' + formattedLabel + '</span>';
          cvBtn.title = 'Download ' + plainLabel;
          cvBtn.setAttribute('aria-label', 'Download ' + plainLabel);
          cvBtn.onclick = function (e) {
            if (isDataUrl) {
              e.preventDefault();
              var a = document.createElement('a');
              a.href = cvTarget;
              a.download = cleanName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              return false;
            }
          };
        } else {
          cvBtn.removeAttribute('download');
          cvBtn.innerHTML = PREVIEW_ICON_SVG + '<span>' + formattedLabel + '</span>';
          cvBtn.title = (isExternalWeb ? 'Open ' : 'Preview ') + plainLabel;
          cvBtn.setAttribute('aria-label', (isExternalWeb ? 'Open ' : 'Preview ') + plainLabel);
          cvBtn.onclick = function (e) {
            if (isExternalWeb) return true;
            e.preventDefault();
            e.stopPropagation();
            openCvPreviewModal(cvTarget, cvLabelText);
            return false;
          };
        }
      }
    }

    if (CONFIG.cf_analytics && typeof CONFIG.cf_analytics === 'string') {
      var cfScript = document.createElement('script');
      cfScript.defer = true;
      cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      cfScript.setAttribute('data-cf-beacon', JSON.stringify({ token: CONFIG.cf_analytics }));
      document.head.appendChild(cfScript);
    }
  }

  /* ─── Android-Style Developer Settings Unlock (10 Taps) & Sign-In Redirect ─── */
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

  function getRequiredDevClicks() {
    try {
      var custom = JSON.parse(localStorage.getItem('portfolio_custom_config'));
      if (custom && custom.dev_trigger_clicks != null) {
        var n = parseInt(custom.dev_trigger_clicks, 10);
        if (!isNaN(n) && n > 0) return n;
      }
    } catch (_) { }
    if (typeof CONFIG !== 'undefined' && CONFIG.dev_trigger_clicks != null) {
      var n2 = parseInt(CONFIG.dev_trigger_clicks, 10);
      if (!isNaN(n2) && n2 > 0) return n2;
    }
    return 10;
  }

  function getDeveloperUrl() {
    return window.location.origin + '/developer';
  }

  function redirectToDeveloper() {
    showDevToast('redirecting to developer settings...');
    setTimeout(function () {
      window.location.href = getDeveloperUrl();
    }, 350);
  }

  function openDevModal() {
    // If Clerk is loaded and user is already authenticated, go directly to /developer
    if (window.Clerk && window.Clerk.user) {
      redirectToDeveloper();
      return;
    }

    if (!devModalOverlay) return;
    devModalOverlay.classList.add('open');
    devModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    mountClerkSignIn();
  }

  function closeDevModal() {
    if (!devModalOverlay) return;
    devModalOverlay.classList.remove('open');
    devModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function mountClerkSignIn() {
    var signInTarget = document.getElementById('modal-clerk-sign-in');
    if (!signInTarget) return;

    if (!window.Clerk) {
      signInTarget.innerHTML = '<div style="color:var(--ink-faint); font-size:0.82rem; padding:24px 10px; font-family:var(--font-mono); text-align:center;">loading authentication...</div>';
      var checkClerk = setInterval(function () {
        if (window.Clerk) {
          clearInterval(checkClerk);
          signInTarget.innerHTML = '';
          mountClerkSignIn();
        }
      }, 150);
      return;
    }

    // If user is already signed in, close modal and redirect immediately
    if (window.Clerk.user) {
      closeDevModal();
      redirectToDeveloper();
      return;
    }

    if (!signInTarget.hasChildNodes() && typeof window.Clerk.mountSignIn === 'function') {
      try {
        window.Clerk.mountSignIn(signInTarget, {
          afterSignInUrl: getDeveloperUrl(),
          fallbackRedirectUrl: getDeveloperUrl(),
          afterSignUpUrl: getDeveloperUrl(),
          signUpFallbackRedirectUrl: getDeveloperUrl(),
          routing: 'hash'
        });
      } catch (err) {
        console.warn('Clerk mount error:', err);
      }
    }
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

      var requiredClicks = getRequiredDevClicks();

      if (cornerClicks >= requiredClicks) {
        cornerClicks = 0;
        // If user is already signed in, redirect directly to /developer
        if (window.Clerk && window.Clerk.user) {
          redirectToDeveloper();
          return;
        }

        showDevToast('developer authentication required');
        setTimeout(function () {
          openDevModal();
        }, 300);
        return;
      }

      // If user is within 3 taps from unlocking, provide friendly progress feedback
      if (requiredClicks > 2 && cornerClicks >= Math.max(1, requiredClicks - 3)) {
        var remaining = requiredClicks - cornerClicks;
        showDevToast(remaining + (remaining === 1 ? ' tap' : ' taps') + ' away from developer settings');
      }

      cornerClickTimer = setTimeout(function () {
        cornerClicks = 0;
      }, 3000);
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


  // Initialize Clerk on page load
  window.addEventListener('load', async function () {
    var pubKey = (typeof CONFIG !== 'undefined' && CONFIG.clerk_publishable_key)
      ? CONFIG.clerk_publishable_key
      : 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk';

    if (window.Clerk) {
      try {
        await window.Clerk.load({
          publishableKey: pubKey,
          afterSignInUrl: getDeveloperUrl(),
          afterSignUpUrl: getDeveloperUrl(),
          afterSignOutUrl: window.location.origin + '/',
          appearance: {
            variables: {
              colorPrimary: currentAccentColor || '#ff2a5f',
              colorBackground: '#131319',
              colorText: '#eef0f4',
              colorInputBackground: '#0a0a0e',
              colorInputText: '#eef0f4'
            }
          }
        });

        window.Clerk.addListener(function () {
          if (window.Clerk && window.Clerk.user) {
            if (devModalOverlay && devModalOverlay.classList.contains('open')) {
              closeDevModal();
              redirectToDeveloper();
            }
          }
        });
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
      if (ghTarget.indexOf('GetWeb-Screenshot') !== -1) {
        ghTarget = ghTarget.replace(/GetWeb-Screenshot/gi, 'GetWeb_Screenshot');
      }
      if (ghTarget.indexOf('CarryOn-E-Commerce') !== -1 && ghTarget.indexOf('CarryOn-E-Commerce-Website') === -1) {
        ghTarget = ghTarget.replace(/CarryOn-E-Commerce/gi, 'CarryOn-E-Commerce-Website');
      }
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
        // Auto-populate skills from GitHub repo languages if no custom skills configured
        var skillsContainer = document.getElementById('skills-container');
        if ((!window.CONFIG || !window.CONFIG.skills || !window.CONFIG.skills.length) && skillsContainer) {
          var autoLangs = [];
          if (Array.isArray(reposData)) {
            reposData.forEach(function (r) {
              if (r && r.language && typeof r.language === 'string') {
                var l = r.language.trim();
                if (l && autoLangs.indexOf(l) === -1) autoLangs.push(l);
              }
            });
          }
          if (Array.isArray(pinnedData)) {
            pinnedData.forEach(function (p) {
              if (p && p.language && typeof p.language === 'string') {
                var l = p.language.trim();
                if (l && autoLangs.indexOf(l) === -1) autoLangs.push(l);
              }
            });
          }
          if (autoLangs.length) {
            renderSkills(autoLangs);
          }
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

  /* ─── Dynamic Contact Form Mount ─── */
  function renderContactForm() {
    var wrap = document.getElementById('msg-card-wrap');
    if (!wrap) return;

    wrap.innerHTML =
      '<div class="msg-field">' +
        '<textarea id="cf-message" rows="5" placeholder="Write your message..."></textarea>' +
      '</div>' +
      '<p class="msg-hint">leave an email id if you want a reply</p>' +
      '<input type="checkbox" name="botcheck" id="botcheck" style="display:none;" tabindex="-1" aria-hidden="true">' +
      '<div id="hcaptcha-container" class="h-captcha" data-sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2" data-captcha="true"></div>' +
      '<button class="send-btn" id="cf-submit" type="button">' +
        '<span>Send message</span>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M5 12h14" />' +
          '<path d="m12 5 7 7-7 7" />' +
        '</svg>' +
      '</button>' +
      '<p id="contact-status" class="status-msg" role="status" aria-live="polite"></p>';

    setupContactFormHandler();
    renderHcaptcha(currentThemeMode);
  }

  function setupContactFormHandler() {
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
  }

  renderContactForm();

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