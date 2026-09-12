var CONFIG = {
  "cv_url": "",
  "cv_enabled": false,
  "cv_label": "CV",
  "cv_action": "preview"
};
if (typeof window !== 'undefined') {
  window.CONFIG = Object.assign(window.CONFIG || {}, CONFIG);
}
