(function () {
  'use strict';

  /* ─── Theme toggle ─── */
  var root = document.documentElement;
  var aw = document.getElementById('avatar-wrap');
  var metaClr = document.getElementById('meta-theme-color');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (metaClr) metaClr.content = t === 'dark' ? '#0a0a0e' : '#f7f5f1';
    renderHcaptcha(t);
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

  applyTheme(
    localStorage.getItem('theme') ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );

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

    var emailLink = document.getElementById('link-email');
    if (emailLink && CONFIG.email && CONFIG.email !== 'your@email.com') {
      emailLink.href = 'mailto:' + CONFIG.email;
    }

    var githubLink = document.getElementById('link-github');
    if (githubLink && CONFIG.github) {
      githubLink.href = 'https://github.com/' + CONFIG.github;
    }

    var xLink = document.getElementById('link-x');
    if (xLink && CONFIG.x) {
      xLink.href = 'https://x.com/' + CONFIG.x;
    }

    var tgLink = document.getElementById('link-telegram');
    if (tgLink && CONFIG.telegram) {
      tgLink.href = 'https://t.me/' + CONFIG.telegram;
    }

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

  /* ─── Clerk Authentication & Role-Based Authorization Check ─── */
  function isUserAuthorized(user) {
    if (!user) return false;

    var allowed = (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.authorized_users))
      ? CONFIG.authorized_users.map(function (u) { return String(u).toLowerCase().trim(); })
      : ['ayankhan84510@gmail.com', 'khxaiyan', 'afudubxi'];

    var emails = [];
    if (user.emailAddresses) {
      user.emailAddresses.forEach(function (e) {
        if (e.emailAddress) emails.push(e.emailAddress.toLowerCase().trim());
      });
    }
    if (user.primaryEmailAddress && user.primaryEmailAddress.emailAddress) {
      emails.push(user.primaryEmailAddress.emailAddress.toLowerCase().trim());
    }

    var username = (user.username || '').toLowerCase().trim();
    var userId = (user.id || '').toLowerCase().trim();
    var meta = user.publicMetadata || {};

    for (var i = 0; i < emails.length; i++) {
      if (allowed.indexOf(emails[i]) !== -1) return true;
    }
    if (username && allowed.indexOf(username) !== -1) return true;
    if (userId && allowed.indexOf(userId) !== -1) return true;
    if (meta.role === 'admin' || meta.authorized === true) return true;
    if (meta.access && allowed.indexOf(String(meta.access).toLowerCase()) !== -1) return true;

    return false;
  }

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
        loadModalCustomizer();
      } else {
        // Unauthorized: Deny access completely
        authView.style.display = 'none';
        customizerView.style.display = 'none';
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

  /* ─── Direct Google Sign-In & Clerk Modal Triggers ─── */
  async function triggerGoogleSignIn() {
    if (window.Clerk) {
      // 1. Direct Google OAuth flow via Clerk API (leads directly to Google accounts screen Pic 2)
      try {
        if (window.Clerk.client && window.Clerk.client.signIn) {
          var res = await window.Clerk.client.signIn.create({
            strategy: 'oauth_google',
            redirectUrl: window.location.href,
            actionCompleteRedirectUrl: window.location.href
          });
          if (res && res.firstFactorVerification && res.firstFactorVerification.externalVerificationRedirectURL) {
            window.location.href = res.firstFactorVerification.externalVerificationRedirectURL.href;
            return;
          }
        }
      } catch (err1) {
        console.warn('Google signIn.create attempt failed:', err1);
      }

      // 2. Direct authenticateWithRedirect
      try {
        if (typeof window.Clerk.authenticateWithRedirect === 'function') {
          await window.Clerk.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: window.location.href,
            redirectUrlComplete: window.location.href
          });
          return;
        }
      } catch (err2) {
        console.warn('authenticateWithRedirect failed:', err2);
      }

      // 3. Native Clerk Modal
      try {
        if (typeof window.Clerk.openSignIn === 'function') {
          closeDevModal();
          window.Clerk.openSignIn({
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
          return;
        }
      } catch (err3) {
        console.warn('openSignIn failed:', err3);
      }
    }

    window.location.href = 'login.html';
  }

  function triggerClerkSignIn() {
    closeDevModal();
    if (window.Clerk && typeof window.Clerk.openSignIn === 'function') {
      try {
        window.Clerk.openSignIn({
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
        return;
      } catch (_) { }
    }
    window.location.href = 'login.html';
  }

  var btnGoogleSignin = document.getElementById('btn-google-signin');
  if (btnGoogleSignin) {
    btnGoogleSignin.addEventListener('click', triggerGoogleSignIn);
  }

  var btnOpenClerk = document.getElementById('btn-open-clerk-popup');
  if (btnOpenClerk) {
    btnOpenClerk.addEventListener('click', triggerClerkSignIn);
  }

  /* ─── Modal Customizer Field Sync & Instant Apply ─── */
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
    var projEl = document.getElementById('m-cust-projectlinks');
    var ghEl = document.getElementById('m-cust-github');
    var tgEl = document.getElementById('m-cust-telegram');
    var xEl = document.getElementById('m-cust-x');
    var emailEl = document.getElementById('m-cust-email');

    if (siteNameEl) siteNameEl.value = cfg.site_name || '';
    if (accentEl) accentEl.value = cfg.accent_letter || 'x';
    if (bioEl) bioEl.value = cfg.site_desc || '';
    if (introEl) introEl.value = cfg.intro || '';
    if (projEl) projEl.value = JSON.stringify(cfg.project_links || {}, null, 2);
    if (ghEl) ghEl.value = cfg.github || '';
    if (tgEl) tgEl.value = cfg.telegram || '';
    if (xEl) xEl.value = cfg.x || '';
    if (emailEl) emailEl.value = cfg.email || '';

    updateModalPreviews();
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
  }

  ['m-cust-sitename', 'm-cust-accent', 'm-cust-bio', 'm-cust-intro'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', updateModalPreviews);
  });

  var btnModalSave = document.getElementById('m-btn-save');
  if (btnModalSave) {
    btnModalSave.addEventListener('click', function () {
      var projectLinks = {};
      try {
        projectLinks = JSON.parse((document.getElementById('m-cust-projectlinks') || {}).value || '{}');
      } catch (_) { }

      var updated = {
        github: (document.getElementById('m-cust-github') || {}).value.trim(),
        x: (document.getElementById('m-cust-x') || {}).value.trim(),
        telegram: (document.getElementById('m-cust-telegram') || {}).value.trim(),
        email: (document.getElementById('m-cust-email') || {}).value.trim(),
        logo: 'logo.png',
        site_name: (document.getElementById('m-cust-sitename') || {}).value.trim(),
        accent_letter: (document.getElementById('m-cust-accent') || {}).value.trim() || 'x',
        site_desc: (document.getElementById('m-cust-bio') || {}).value.trim(),
        seo_desc: (document.getElementById('m-cust-bio') || {}).value.trim(),
        intro: (document.getElementById('m-cust-intro') || {}).value.trim(),
        project_links: projectLinks,
        authorized_users: (typeof CONFIG !== 'undefined' && CONFIG.authorized_users) ? CONFIG.authorized_users : ['ayankhan84510@gmail.com', 'khxaiyan', 'afudubxi'],
        cf_analytics: (typeof CONFIG !== 'undefined' && CONFIG.cf_analytics) ? CONFIG.cf_analytics : false,
        web3forms_access_key: (typeof CONFIG !== 'undefined' && CONFIG.web3forms_access_key) ? CONFIG.web3forms_access_key : 'd36ee933-00cb-453e-aa38-b18ee60ce5d1',
        hcaptcha_sitekey: (typeof CONFIG !== 'undefined' && CONFIG.hcaptcha_sitekey) ? CONFIG.hcaptcha_sitekey : '50b2fe65-b00b-4b9e-ad62-3ba471098be2',
        clerk_publishable_key: (typeof CONFIG !== 'undefined' && CONFIG.clerk_publishable_key) ? CONFIG.clerk_publishable_key : 'pk_test_c2hpbmluZy10dXJrZXktMTMyNS5jbGVyay5hY2NvdW50cy5kZXYk',
        clerk_frontend_api: 'https://shining-turkey-1325.clerk.accounts.dev'
      };

      localStorage.setItem('portfolio_custom_config', JSON.stringify(updated));
      Object.assign(CONFIG, updated);

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
      var emailLink = document.getElementById('link-email');
      if (emailLink && updated.email) {
        emailLink.href = 'mailto:' + updated.email;
      }
      var githubLink = document.getElementById('link-github');
      if (githubLink && updated.github) {
        githubLink.href = 'https://github.com/' + updated.github;
      }
      var xLink = document.getElementById('link-x');
      if (xLink && updated.x) {
        xLink.href = 'https://x.com/' + updated.x;
      }
      var tgLink = document.getElementById('link-telegram');
      if (tgLink && updated.telegram) {
        tgLink.href = 'https://t.me/' + updated.telegram;
      }

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
    if (!projectsContainer || !projects || !projects.length) return;

    // Filter out profile readme repo 'khxaiyan' if other projects exist
    var valid = projects.filter(function (p) {
      return p && p.name && p.name.toLowerCase() !== 'khxaiyan';
    });
    if (!valid.length) valid = projects;

    var html = '';
    // Show up to 4 top pins
    valid.slice(0, 4).forEach(function (p) {
      var displayName = formatProjectName(p.name);
      var styledTitle = highlightCapitals(displayName);
      var desc = (p.description && p.description.trim())
        ? p.description
        : (p.name.toLowerCase().indexOf('portfolio') !== -1 ? 'Personal developer portfolio website' : 'Open-source project on GitHub');
      var stars = formatStars(p.stars || p.stargazers_count || 0);
      var tag = p.language || 'Project';
      var author = p.author || (typeof CONFIG !== 'undefined' && CONFIG.github ? CONFIG.github : 'khxaiyan');

      // Determine project URL: prioritize custom override in config, then live website (homepage), then github html_url
      var customLink = null;
      if (typeof CONFIG !== 'undefined' && (CONFIG.project_links || CONFIG.project_urls)) {
        var links = CONFIG.project_links || CONFIG.project_urls;
        customLink = links[p.name] || links[p.name.toLowerCase()] || links[displayName];
      }
      var targetUrl = customLink || p.homepage || p.website || p.url || p.html_url || ('https://github.com/' + author + '/' + p.name);
      var finalUrl = normalizeUrl(targetUrl);
      var icon = getProjectIcon(p.name);

      html += '<a class="org-row" href="' + finalUrl + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="project-avatar" aria-hidden="true">' + icon + '</div>' +
        '<div class="org-row-text">' +
        '<span class="org-row-name">' + styledTitle + '</span>' +
        '<span class="org-row-desc">' + desc + '</span>' +
        '</div>' +
        '<div class="org-row-stats">' +
        '<span class="org-row-star">' + stars + '</span>' +
        '<span class="org-row-repos">' + tag + '</span>' +
        '</div>' +
        '</a>';
    });

    projectsContainer.innerHTML = html;
  }

  function loadPinnedProjects() {
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
}());