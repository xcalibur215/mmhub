#!/usr/bin/env node
// Lightweight SPA static server with HTML5 history API fallback
import http from 'http';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, 'dist');
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

async function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

async function serveFile(filePath, res) {
  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    await send(res, 200, data, { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' });
  } catch (e) {
    if (e.code === 'ENOENT') return false; // signal not found
    console.error('[static] error serving', filePath, e);
    await send(res, 500, 'Internal Server Error');
  }
  return true;
}

const indexHtmlPromise = readFile(path.join(DIST_DIR, 'index.html')).catch(() => null);

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURI((req.url || '/').split('?')[0]);
  // Security: prevent path traversal
  if (urlPath.includes('..')) {
    return send(res, 400, 'Bad Request');
  }

  // Try to map to file
  let filePath = path.join(DIST_DIR, urlPath);
  try {
    const stats = await stat(filePath).catch(() => null);
    if (stats && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch {/* ignore */}

  // Serve static asset if exists
  if (await serveFile(filePath, res)) return;

  // Fallback to index.html for SPA routes
  const indexContent = await indexHtmlPromise;
  if (indexContent) {
    return send(res, 200, indexContent, { 'Content-Type': 'text/html; charset=utf-8' });
  }
  return send(res, 404, 'index.html not found');
});

server.listen(PORT, () => {
  console.log(`SPA server listening on http://localhost:${PORT}`);
});
