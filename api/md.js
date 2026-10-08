const fs = require('fs');
const path = require('path');

function renderEditorPage(filename, filepath, mdContent, repoName) {
  const escaped = mdContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  const safeContent = mdContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename} - Edit</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/codemirror.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      background: #0d1117;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    /* Top Nav */
    .topnav {
      background: #161b22;
      border-bottom: 1px solid #30363d;
      padding: 0 16px;
      height: 48px;
      display: flex;
      align-items: center;
      gap: 0;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 200;
    }
    .topnav-logo { color: #e6edf3; margin-right: 16px; flex-shrink: 0; }
    .breadcrumb {
      display: flex; align-items: center; gap: 4px;
      font-size: 14px; font-weight: 500; overflow: hidden; flex: 1;
    }
    .breadcrumb-link { color: #58a6ff; text-decoration: none; white-space: nowrap; }
    .breadcrumb-link:hover { text-decoration: underline; }
    .breadcrumb-sep { color: #8b949e; font-size: 18px; font-weight: 300; }
    .breadcrumb-file {
      background: transparent; border: 1px solid #30363d; border-radius: 6px;
      color: #e6edf3; font-size: 14px; font-weight: 500; padding: 4px 10px;
      outline: none; min-width: 120px; max-width: 280px;
    }
    .breadcrumb-file:focus { border-color: #58a6ff; box-shadow: 0 0 0 3px rgba(31,111,235,0.3); }
    .breadcrumb-in { color: #8b949e; font-size: 13px; white-space: nowrap; }
    .breadcrumb-branch {
      background: rgba(88,166,255,0.12); border: 1px solid rgba(88,166,255,0.3);
      color: #58a6ff; border-radius: 20px; font-size: 12px; font-weight: 600;
      padding: 2px 10px; white-space: nowrap;
    }
    .topnav-actions { display: flex; align-items: center; gap: 8px; margin-left: 16px; flex-shrink: 0; }
    .btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px;
      border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer;
      border: 1px solid transparent; transition: all 0.15s; white-space: nowrap;
      text-decoration: none; font-family: inherit;
    }
    .btn-ghost { background: transparent; border-color: #30363d; color: #e6edf3; }
    .btn-ghost:hover { background: rgba(255,255,255,0.06); border-color: #8b949e; }
    .btn-primary { background: #238636; border-color: rgba(240,246,252,0.1); color: #fff; }
    .btn-primary:hover { background: #2ea043; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    /* Editor container */
    .editor-container {
      flex: 1; display: flex; flex-direction: column;
      max-width: 1280px; width: 100%; margin: 24px auto; padding: 0 16px; gap: 0;
    }
    .editor-card {
      border: 1px solid #30363d; border-radius: 6px; overflow: hidden;
      background: #0d1117; flex: 1; display: flex; flex-direction: column;
    }
    /* Tab Bar */
    .tab-bar {
      background: #161b22; border-bottom: 1px solid #30363d;
      display: flex; align-items: center; padding: 0 12px; gap: 0;
    }
    .tab-group { display: flex; gap: 0; }
    .tab-btn {
      background: none; border: none; color: #8b949e; font-size: 13px; font-weight: 500;
      padding: 10px 16px; cursor: pointer; border-bottom: 2px solid transparent;
      transition: all 0.15s; position: relative; top: 1px; font-family: inherit;
    }
    .tab-btn:hover { color: #e6edf3; }
    .tab-btn.active { color: #e6edf3; border-bottom-color: #f78166; background: rgba(255,255,255,0.03); border-radius: 6px 6px 0 0; }
    .tab-bar-spacer { flex: 1; }
    .tab-options { display: flex; align-items: center; gap: 6px; }
    .tab-select {
      background: transparent; border: 1px solid #30363d; color: #8b949e;
      font-size: 12px; padding: 3px 8px; border-radius: 6px; cursor: pointer; outline: none;
    }
    .tab-select:hover { border-color: #8b949e; color: #e6edf3; }
    /* CodeMirror */
    .CodeMirror {
      height: auto; min-height: 500px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 13px; line-height: 20px; background: #0d1117; color: #e6edf3; border: none;
    }
    .CodeMirror-gutters { background: #0d1117; border-right: 1px solid #21262d; min-width: 50px; }
    .CodeMirror-linenumber { color: #3d444d; padding: 0 12px 0 8px; min-width: 34px; font-size: 12px; }
    .CodeMirror-selected { background: #264f78 !important; }
    .CodeMirror-cursor { border-left: 2px solid #58a6ff; }
    .CodeMirror-activeline-background { background: rgba(255,255,255,0.03) !important; }
    .CodeMirror-scroll { max-height: 75vh; }
    .cm-header { color: #79c0ff; font-weight: bold; }
    .cm-strong { color: #e6edf3; font-weight: bold; }
    .cm-em { color: #e6edf3; font-style: italic; }
    .cm-link, .cm-url { color: #58a6ff; }
    .cm-code { color: #ff7b72; }
    .cm-quote { color: #8b949e; font-style: italic; }
    .cm-tag { color: #7ee787; }
    .cm-attribute { color: #79c0ff; }
    .cm-comment { color: #8b949e; font-style: italic; }
    .cm-formatting { color: #8b949e; }
    /* Preview */
    #preview-panel { display: none; padding: 32px 40px; min-height: 500px; }
    #edit-panel { display: block; }
    .md-body { color: #e6edf3; font-size: 16px; line-height: 1.75; word-wrap: break-word; }
    .md-body h1,.md-body h2,.md-body h3,.md-body h4,.md-body h5,.md-body h6 {
      font-weight: 600; line-height: 1.25; margin-top: 24px; margin-bottom: 16px; color: #e6edf3;
    }
    .md-body h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 1px solid #21262d; }
    .md-body h2 { font-size: 1.5em; padding-bottom: 0.3em; border-bottom: 1px solid #21262d; }
    .md-body h3 { font-size: 1.25em; }
    .md-body h4 { font-size: 1em; }
    .md-body h5 { font-size: 0.875em; }
    .md-body h6 { font-size: 0.85em; color: #8b949e; }
    .md-body p { margin-bottom: 16px; }
    .md-body a { color: #58a6ff; text-decoration: none; }
    .md-body a:hover { text-decoration: underline; }
    .md-body strong { font-weight: 600; }
    .md-body em { font-style: italic; }
    .md-body ul,.md-body ol { padding-left: 2em; margin-bottom: 16px; }
    .md-body li { margin: 4px 0; }
    .md-body ul li { list-style: disc; }
    .md-body ol li { list-style: decimal; }
    .md-body hr { border: none; border-top: 1px solid #21262d; margin: 24px 0; }
    .md-body blockquote {
      border-left: 4px solid #3d444d; padding: 8px 16px; color: #8b949e;
      margin: 16px 0; background: rgba(255,255,255,0.03); border-radius: 0 6px 6px 0;
    }
    .md-body blockquote p { margin: 0; }
    .md-body code {
      background: rgba(110,118,129,0.15); border-radius: 4px; font-size: 85%;
      padding: 0.2em 0.4em; font-family: 'SFMono-Regular',Consolas,monospace; color: #ff7b72;
    }
    .md-body pre {
      background: #161b22; border: 1px solid #30363d; border-radius: 6px;
      padding: 16px; overflow-x: auto; margin-bottom: 16px;
    }
    .md-body pre code { background: none; padding: 0; font-size: 13px; color: #e6edf3; border-radius: 0; }
    .md-body table { border-collapse: collapse; width: 100%; margin-bottom: 16px; display: block; overflow-x: auto; }
    .md-body th,.md-body td { border: 1px solid #30363d; padding: 6px 13px; }
    .md-body th { background: rgba(255,255,255,0.04); font-weight: 600; }
    .md-body tr:nth-child(even) { background: rgba(255,255,255,0.02); }
    .md-body img { max-width: 100%; border-radius: 6px; }
    .md-body input[type="checkbox"] { margin-right: 6px; accent-color: #238636; }
    /* Drop bar */
    .drop-bar {
      background: #161b22; border-top: 1px solid #30363d; padding: 8px 16px;
      display: flex; align-items: center; gap: 8px; color: #8b949e; font-size: 12px; flex-shrink: 0;
    }
    .drop-bar kbd { background: #21262d; border: 1px solid #30363d; border-radius: 4px; padding: 1px 5px; font-family: monospace; font-size: 11px; color: #e6edf3; }
    #file-upload-input { display: none; }
    .saved-badge { display: none; align-items: center; gap: 6px; color: #3fb950; font-size: 12px; font-weight: 500; }
    .saved-badge.show { display: flex; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #0d1117; }
    ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #484f58; }
    @media (max-width: 640px) {
      .editor-container { padding: 0 8px; margin: 12px auto; }
      #preview-panel { padding: 20px 16px; }
      .breadcrumb-in,.breadcrumb-branch { display: none; }
      .tab-options { display: none; }
    }
  </style>
</head>
<body>
<nav class="topnav">
  <span class="topnav-logo">
    <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  </span>
  <div class="breadcrumb">
    <a href="/" class="breadcrumb-link">${repoName}</a>
    <span class="breadcrumb-sep">/</span>
    <input id="filename-input" class="breadcrumb-file" value="${filename}" spellcheck="false">
    <span class="breadcrumb-in">in</span>
    <span class="breadcrumb-branch">main</span>
  </div>
  <div class="topnav-actions">
    <div class="saved-badge" id="saved-badge">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>
      Saved
    </div>
    <button class="btn btn-ghost" onclick="handleCancel()">Cancel changes</button>
    <button class="btn btn-primary" id="commit-btn" onclick="handleSave()">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"/></svg>
      <span>Commit changes...</span>
    </button>
  </div>
</nav>

<div class="editor-container">
  <div class="editor-card" id="drop-zone">
    <div class="tab-bar">
      <div class="tab-group">
        <button class="tab-btn active" id="tab-edit" onclick="switchTab('edit')">Edit</button>
        <button class="tab-btn" id="tab-preview" onclick="switchTab('preview')">Preview</button>
      </div>
      <div class="tab-bar-spacer"></div>
      <div class="tab-options" id="editor-options">
        <select class="tab-select" id="indent-type" onchange="updateEditorOption()">
          <option value="spaces" selected>Spaces</option>
          <option value="tabs">Tabs</option>
        </select>
        <select class="tab-select" id="indent-size" onchange="updateEditorOption()">
          <option value="2" selected>2</option>
          <option value="4">4</option>
          <option value="8">8</option>
        </select>
        <select class="tab-select" id="soft-wrap" onchange="updateEditorOption()">
          <option value="nowrap">No wrap</option>
          <option value="wrap" selected>Soft wrap</option>
        </select>
      </div>
    </div>

    <div id="edit-panel">
      <textarea id="md-editor">${safeContent}</textarea>
    </div>
    <div id="preview-panel">
      <div class="md-body" id="preview-body"></div>
    </div>

    <div class="drop-bar">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z"/></svg>
      Attach files by <label for="file-upload-input" style="color:#58a6ff;cursor:pointer;margin: 0 3px">dragging &amp; dropping, selecting</label> or pasting them.
      <input type="file" id="file-upload-input" accept=".md,.markdown,.txt" onchange="handleFileUpload(this)">
      <div class="tab-bar-spacer"></div>
      <span><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> preview</span>
    </div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/mode/markdown/markdown.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/addon/edit/continuelist.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/addon/selection/active-line.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@9/marked.min.js"></script>
<script>
  const FILEPATH = ${JSON.stringify(filepath)};
  const ORIGINAL = \`${escaped}\`;
  let currentTab = 'edit';
  let isDirty = false;

  const editor = CodeMirror.fromTextArea(document.getElementById('md-editor'), {
    mode: 'markdown',
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    extraKeys: { 'Enter': 'newlineAndIndentContinueMarkdownList', 'Ctrl-Shift-M': () => switchTab(currentTab === 'edit' ? 'preview' : 'edit') },
    styleActiveLine: true,
    viewportMargin: Infinity,
  });

  editor.on('change', () => { isDirty = true; });

  function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tab-edit').classList.toggle('active', tab === 'edit');
    document.getElementById('tab-preview').classList.toggle('active', tab === 'preview');
    document.getElementById('edit-panel').style.display = tab === 'edit' ? 'block' : 'none';
    document.getElementById('preview-panel').style.display = tab === 'preview' ? 'block' : 'none';
    document.getElementById('editor-options').style.display = tab === 'edit' ? 'flex' : 'none';
    if (tab === 'preview') {
      document.getElementById('preview-body').innerHTML = marked.parse(editor.getValue(), { breaks: true, gfm: true });
    } else { editor.refresh(); }
  }

  function updateEditorOption() {
    const useTabs = document.getElementById('indent-type').value === 'tabs';
    const size = parseInt(document.getElementById('indent-size').value);
    editor.setOption('indentWithTabs', useTabs);
    editor.setOption('tabSize', size);
    editor.setOption('indentUnit', size);
    editor.setOption('lineWrapping', document.getElementById('soft-wrap').value === 'wrap');
  }

  async function handleSave() {
    const btn = document.getElementById('commit-btn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Saving...';
    try {
      const res = await fetch('/api/md-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: FILEPATH, content: editor.getValue() })
      });
      const data = await res.json();
      if (res.ok) {
        isDirty = false;
        const badge = document.getElementById('saved-badge');
        badge.classList.add('show');
        setTimeout(() => badge.classList.remove('show'), 3000);
      } else { alert('Save failed: ' + (data.error || 'Unknown error')); }
    } catch (e) { alert('Save failed: ' + e.message); }
    finally {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Commit changes...';
    }
  }

  function handleCancel() {
    if (isDirty && !confirm('Discard unsaved changes?')) return;
    editor.setValue(ORIGINAL);
    isDirty = false;
  }

  function handleFileUpload(input) {
    const file = input.files[0]; if (!file) return;
    new FileReader().addEventListener('load', (e) => {
      editor.setValue(e.target.result);
      document.getElementById('filename-input').value = file.name;
      isDirty = true;
    }, { once: true });
    (new FileReader()).readAsText(file);
    input.value = '';
  }

  // Proper file reader for upload
  document.getElementById('file-upload-input').onchange = function() {
    const file = this.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { editor.setValue(e.target.result); document.getElementById('filename-input').value = file.name; isDirty = true; };
    reader.readAsText(file);
    this.value = '';
  };

  // Drag & Drop
  const dz = document.getElementById('drop-zone');
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.style.boxShadow = '0 0 0 2px #58a6ff inset'; });
  dz.addEventListener('dragleave', () => { dz.style.boxShadow = ''; });
  dz.addEventListener('drop', (e) => {
    e.preventDefault(); dz.style.boxShadow = '';
    const file = e.dataTransfer.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { editor.setValue(ev.target.result); document.getElementById('filename-input').value = file.name; isDirty = true; };
    reader.readAsText(file);
  });

  document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); } });
  window.addEventListener('beforeunload', (e) => { if (isDirty) { e.preventDefault(); e.returnValue = ''; } });
</script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  const reqPath = req.query.path || '';
  const safePath = reqPath.replace(/^\/+/, '').replace(/\.\.\//g, '');
  if (!safePath.match(/\.(md|markdown)$/i)) {
    res.status(400).json({ error: 'Only .md files supported' });
    return;
  }
  const ROOT = path.join(__dirname, '..');
  const filePath = path.join(ROOT, safePath);
  if (!filePath.startsWith(ROOT)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  if (!fs.existsSync(filePath)) {
    res.status(404).send('File not found: ' + safePath);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const repoName = path.basename(ROOT);
  const html = renderEditorPage(filename, safePath, content, repoName);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(html);
};

module.exports._renderEditorPage = renderEditorPage;
