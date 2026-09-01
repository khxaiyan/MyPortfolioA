(function () {
  'use strict';

  /* ─── Theme toggle ─── */
  var root    = document.documentElement;
  var aw      = document.getElementById('avatar-wrap');
  var metaClr = document.getElementById('meta-theme-color');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (metaClr) metaClr.content = t === 'dark' ? '#0a0a0e' : '#f7f5f1';
  }

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

  /* ─── Sync Config Links ─── */
  if (typeof CONFIG !== 'undefined') {
    var emailLink = document.getElementById('link-email');
    if (emailLink && CONFIG.email && CONFIG.email !== 'your@email.com') {
      emailLink.href = 'mailto:' + CONFIG.email;
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
    valid.slice(0, 4).forEach(function (p) {
      var displayName = formatProjectName(p.name);
      var styledTitle = highlightCapitals(displayName);
      var desc = p.description || 'Open source project on GitHub';
      var stars = formatStars(p.stars || p.stargazers_count || 0);
      var tag = p.language || 'GitHub';
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

    fetch('https://pinned.berrysauce.me/get/' + username)
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
    fetch('https://api.github.com/users/' + username + '/repos?sort=pushed&per_page=6')
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
      .catch(function () {});
  }

  loadPinnedProjects();

  /* ─── Contact form ─── */
  var btn     = document.getElementById('cf-submit');
  var status  = document.getElementById('contact-status');
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

    var captchaEl  = document.querySelector('textarea[name="h-captcha-response"]');
    var captchaVal = captchaEl ? captchaEl.value : '';
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
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key:           accessKey,
        message:              msg,
        'h-captcha-response': captchaVal
      })
    })
    .then(function (r)  { return r.json(); })
    .then(function (d)  {
      if (d.success) {
        status.textContent = 'message sent!';
        status.style.color = 'var(--success)';
        if (msgArea) msgArea.value = '';
        if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (_) {} }
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