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

  /* ─── GitHub repo stats (live fetch) ─── */
  function formatStars(n) {
    if (n >= 1000) return '\u2605 ' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return '\u2605 ' + n;
  }

  function fetchRepoStars(repoPath, starEl) {
    fetch('https://api.github.com/repos/' + repoPath, {
      headers: { Accept: 'application/vnd.github+json' }
    })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;
      if (starEl && typeof data.stargazers_count === 'number') {
        starEl.textContent = formatStars(data.stargazers_count);
      }
    })
    .catch(function () {});
  }

  fetchRepoStars('khxaiyan/CarryOn-E-Commerce-Website',
    document.getElementById('carryon-stars')
  );
  fetchRepoStars('khxaiyan/GetWeb_Screenshot',
    document.getElementById('getweb-stars')
  );

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