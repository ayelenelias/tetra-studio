/* ═══════════════════════════════════════════════════════
   TETRA STUDIO — Backend Server (Node.js puro, sin deps)
   Sirve la web + API REST para el CMS
   Persistencia: guarda los datos en data.json
   ═══════════════════════════════════════════════════════ */

'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 3000;
var ROOT = __dirname;
// En Render/otros hosting el disco efímero se borra en cada deploy.
// Montá un disco persistente y apuntá DATA_FILE a él con una variable de entorno.
// Ej.  DATA_FILE=/data/data.json   (con disco montado en /data)
var DATA_FILE = process.env.DATA_FILE || process.env.DATA_PATH || path.join(ROOT, 'data.json');

var MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
};

function extOf(p) {
    var i = String(p).toLowerCase().lastIndexOf('.');
    return i >= 0 ? String(p).slice(i) : '';
}

function tryRead(p) {
    try { return fs.readFileSync(p); } catch (e) { return null; }
}

function readData() {
    var raw = tryRead(DATA_FILE);
    if (raw == null) return null;
    try { return JSON.parse(raw.toString('utf8')); } catch (e) { return null; }
}

function writeData(obj) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf8');
    return true;
}

function sendJson(res, code, obj) {
    var body = JSON.stringify(obj);
    res.writeHead(code, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(body);
}

function sendStatic(res, filePath) {
    var buf = tryRead(filePath);
    if (buf == null) {
        sendJson(res, 404, { error: 'Archivo no encontrado' });
        return;
    }
    var type = MIME[extOf(filePath)] || 'application/octet-stream';
    res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': buf.length,
        'Cache-Control': 'no-store'
    });
    res.end(buf);
}

function safeResolve(urlPath) {
    var decoded;
    try { decoded = decodeURIComponent(urlPath); } catch (e) { decoded = urlPath; }
    var normalized = path.normalize(decoded).replace(/^\\|^\/+/, '');
    if (!normalized) normalized = 'index.html';
    var candidate = path.join(ROOT, normalized);

    var rel = path.relative(ROOT, candidate);
    if (rel.indexOf('..') === 0 || path.isAbsolute(rel) && rel.charAt(0) !== '.') {
        return null;
    }
    var stat;
    try { stat = fs.statSync(candidate); } catch (e) { stat = null; }
    if (stat && stat.isDirectory()) {
        candidate = path.join(candidate, 'index.html');
        try { stat = fs.statSync(candidate); } catch (e) { stat = null; }
        if (!stat) return null;
    }
    if (!stat || !stat.isFile()) return null;
    return candidate;
}

var server = http.createServer(function (req, res) {
    var url = req.url || '/';
    var q = url.indexOf('?');
    var urlPath = q >= 0 ? url.slice(0, q) : url;

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // API: GET /api/data
    if (urlPath === '/api/data' && req.method === 'GET') {
        var data = readData();
        if (data == null) {
            sendJson(res, 404, { error: 'Sin datos guardados aún' });
            return;
        }
        sendJson(res, 200, data);
        return;
    }

    // API: POST /api/data
    if (urlPath === '/api/data' && req.method === 'POST') {
        var body = [];
        req.on('data', function (chunk) { body.push(chunk); });
        req.on('end', function () {
            var raw = Buffer.concat(body).toString('utf8');
            var parsed;
            try { parsed = JSON.parse(raw); }
            catch (e) {
                sendJson(res, 400, { error: 'JSON inválido' });
                return;
            }
            try {
                writeData(parsed);
                console.log('CMS save OK · bytes:', raw.length);
                sendJson(res, 200, { ok: true });
            } catch (e) {
                console.error('CMS save error:', e.message);
                sendJson(res, 500, { error: 'Error al escribir data.json' });
            }
        });
        return;
    }

    // Estáticos
    var filePath = safeResolve(urlPath);
    if (filePath == null) {
        sendJson(res, 404, { error: 'Archivo no encontrado' });
        return;
    }
    sendStatic(res, filePath);
});

server.listen(PORT, function () {
    console.log('');
    console.log('  ╔═══════════════════════════════════════╗');
    console.log('  ║   TETRA STUDIO — Backend activo   ║');
    console.log('  ╠═══════════════════════════════════════╣');
    console.log('  ║  http://localhost:' + PORT + '            ║');
    console.log('  ╚═══════════════════════════════════════╝');
    console.log('');
    console.log('  Abrir:  http://localhost:' + PORT);
    console.log('  CMS:    http://localhost:' + PORT + '/# (Ctrl+Shift+A)');
    console.log('');
});
