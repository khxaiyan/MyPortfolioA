const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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
  '.txt': 'text/plain; charset=utf-8'
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

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': ext === '.html' || ext === '.js' ? 'no-cache, must-revalidate' : 'public, max-age=3600'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev server running at: http://localhost:${PORT}`);
  console.log(`📁 Serving frontend with universal API support at: http://localhost:${PORT}/api/save-config\n`);
});
