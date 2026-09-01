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
      : '4e42ae9a-c9a2-4a7a-b9ae-0526a248f402';

    if (window.hcaptcha && typeof window.hcaptcha.render === 'function') {
      try {
        container.innerHTML = '';
        hcaptchaWidgetId = window.hcaptcha.render('hcaptcha-container', {
          sitekey: sitekey,
          theme: theme === 'light' ? 'light' : 'dark',
          size: 'normal'
        });
      } catch (_) {}
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

  /* ─── Sync Config Links & Analytics ─── */
  if (typeof CONFIG !== 'undefined') {
    var emailLink = document.getElementById('link-email');
    if (emailLink && CONFIG.email && CONFIG.email !== 'your@email.com') {
      emailLink.href = 'mailto:' + CONFIG.email;
    }

    if (CONFIG.cf_analytics && typeof CONFIG.cf_analytics === 'string') {
      var cfScript = document.createElement('script');
      cfScript.defer = true;
      cfScript.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      cfScript.setAttribute('data-cf-beacon', JSON.stringify({ token: CONFIG.cf_analytics }));
      document.head.appendChild(cfScript);
    }
  }

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
      var url = 'https://github.com/' + author + '/' + p.name;
      var icon = getProjectIcon(p.name);

      html += '<a class="org-row" href="' + url + '" target="_blank" rel="noopener noreferrer">' +
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

    fetch('https://pinned.berrysauce.me/get/' + username + cacheBuster, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (Array.isArray(data) && data.length) {
          renderProjects(data);
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
              stars: r.stargazers_count
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
      try { captchaVal = window.hcaptcha.getResponse(hcaptchaWidgetId); } catch (_) {}
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
            try { window.hcaptcha.reset(hcaptchaWidgetId); } catch (_) {}
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