/**
 * Express / Node.js & Vercel Compatible Server (`server.js`)
 *
 * Serves static files locally OR when invoked as a Vercel serverless handler,
 * and handles `/api/gemini` POST calls using `process.env.GEMINI_API_KEY`.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const geminiHandler = require('./api/gemini');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function requestListener(req, res) {
  const safeUrl = (req.url || '/').split('?')[0];

  // Route /api/gemini to our serverless function handler
  if (safeUrl === '/api/gemini') {
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk.toString();
    });
    req.on('end', async () => {
      req.body = rawBody;
      // Polyfill Express/Vercel helper methods if running on raw http.Server
      if (!res.status) {
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
      }
      if (!res.json) {
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(obj));
        };
      }
      await geminiHandler(req, res);
    });
    return;
  }

  // Serve static files from project root or public/
  const relPath = safeUrl === '/' ? 'index.html' : safeUrl.replace(/^\/+/, '');
  const candidatePaths = [
    path.join(__dirname, relPath),
    path.join(__dirname, 'public', relPath),
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      });
      return fs.createReadStream(filePath).pipe(res);
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

// Export for Vercel serverless runtime AND listen locally when run directly
module.exports = requestListener;

if (require.main === module) {
  const server = http.createServer(requestListener);
  server.listen(PORT, () => {
    console.log(`NEON PIXEL ACADEMY running at http://localhost:${PORT}`);
  });
}
