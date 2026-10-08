const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { _renderEditorPage } = require('../api/md');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.rtf': 'application/rtf',
  '.md': 'text/markdown; charset=utf-8',
  '.markdown': 'text/markdown; charset=utf-8'
};

// Load API handlers
const saveConfigHandler = require('../api/save-config');
const getConfigHandler = require('../api/get-config');
const dynamicConfigHandler = require('../api/config');
let inngestHandler = null;
try {
  inngestHandler = require('../api/inngest');
} catch (_) {}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Helper response wrappers
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  res.send = (data) => {
    res.end(data);
  };

  // ── Handle /api/config.js & /api/config ──
  if (pathname === '/api/config.js' || pathname === '/api/config') {
    await dynamicConfigHandler(req, res);
    return;
  }

  // ── Handle /api/get-config ──
  if (pathname === '/api/get-config') {
    await getConfigHandler(req, res);
    return;
  }

  // ── Handle /api/save-config ──
  if (pathname === '/api/save-config') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      req.body = body;
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
      await saveConfigHandler(req, res);
    });
    return;
  }

  // ── Handle /api/inngest ──
  if (pathname.startsWith('/api/inngest') && inngestHandler) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      req.body = body;
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
      try {
        await inngestHandler(req, res);
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ── Handle /api/md-save (save .md file to disk) ──
  if (pathname === '/api/md-save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { path: filePath, content } = JSON.parse(body);
        if (!filePath || typeof content !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing path or content' }));
          return;
        }
        const safePath = filePath.replace(/^\/+/, '').replace(/\.\.\//g, '');
        if (!safePath.match(/\.(md|markdown)$/i)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Only .md files allowed' }));
          return;
        }
        const ROOT = path.join(__dirname, '..');
        const absPath = path.join(ROOT, safePath);
        if (!absPath.startsWith(ROOT)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Forbidden' }));
          return;
        }
        fs.writeFileSync(absPath, content, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, saved: safePath }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }



  // ── Markdown editor: serve .md files as GitHub-style Edit+Preview page ──
  const mdExtensions = ['.md', '.markdown'];
  const possibleMdPath = path.join(__dirname, '..', pathname);
  const possibleMdExt = path.extname(pathname).toLowerCase();
  if (mdExtensions.includes(possibleMdExt) && fs.existsSync(possibleMdPath)) {
    try {
      const mdContent = fs.readFileSync(possibleMdPath, 'utf-8');
      const filename = path.basename(possibleMdPath);
      const repoName = path.basename(path.join(__dirname, '..'));
      // pathname starts with '/', strip the leading slash for the relative path
      const relPath = pathname.replace(/^\//, '');
      const html = _renderEditorPage(filename, relPath, mdContent, repoName);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(html);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error rendering markdown: ' + e.message);
    }
    return;
  }

  // ── Static Files in frontend/ ──
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Clean URLs support: /developer -> /developer.html
  let filePath = path.join(FRONTEND_DIR, pathname);
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      // 404 fallback
      filePath = path.join(FRONTEND_DIR, '404.html');
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Check if directory
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (_) {}

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const responseHeaders = {
    'Content-Type': contentType,
    'Cache-Control': ext === '.html' || ext === '.js' || ext === '.json' ? 'no-store, no-cache, must-revalidate, max-age=0' : 'public, max-age=3600',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  if (['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.txt', '.html', '.htm', '.md', '.markdown'].includes(ext)) {
    responseHeaders['Content-Disposition'] = 'inline';
  }

  res.writeHead(200, responseHeaders);

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev server running at: http://localhost:${PORT}`);
  console.log(`📁 Serving frontend with universal API support at: http://localhost:${PORT}/api/save-config\n`);
});
