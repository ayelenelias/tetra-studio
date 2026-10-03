/* ═══════════════════════════════════════════════════════
   TETRA STUDIO — Backend Server (Node.js puro, sin deps)
   Sirve la web + API REST para el CMS
   Persistencia: guarda los datos en data.json
   ═══════════════════════════════════════════════════════ */

'use strict';

var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 3000;
var ROOT = __dirname;
// En Render/otros hosting el disco efímero se borra en cada deploy.
// Montá un disco persistente y apuntá DATA_FILE a él con una variable de entorno.
// Ej.  DATA_FILE=/data/data.json   (con disco montado en /data)
var DATA_FILE = process.env.DATA_FILE || process.env.DATA_PATH || path.join(ROOT, 'data.json');

/* ─── SUPABASE (Postgres persistente) ───
   Si definís SUPABASE_URL + SUPABASE_KEY, el CMS guarda/lee
   desde Supabase (persistente PARA SIEMPRE, hasta en Render free).
   De lo contrario usa data.json (disco).
   Tabla:  tetra_cms (columnas: id int primary key, data jsonb, updated_at timestamptz)
*/
var SUPABASE_URL = process.env.SUPABASE_URL || '';
var SUPABASE_KEY = process.env.SUPABASE_KEY || '';
var SUPABASE_TABLE = process.env.SUPABASE_TABLE || 'tetra_cms';
var SUPABASE_READY = !!(SUPABASE_URL && SUPABASE_KEY);

function supabaseReq(method, path, body, prefer) {
    return new Promise(function (resolve, reject) {
        var base = String(SUPABASE_URL).replace(/\/+$/, '');
        var url;
        try { url = new URL(base + '/rest/v1/' + SUPABASE_TABLE + path); }
        catch (e) { return reject(e); }
        var headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Accept': 'application/json'
        };
        if (body !== undefined) {
            body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(body);
            headers['Prefer'] = prefer || 'return=representation';
        }
        var req = https.request({
            hostname: url.hostname,
            port: url.port ? parseInt(url.port, 10) : 443,
            path: url.pathname + url.search,
            method: method,
            headers: headers
        }, function (res) {
            var chunks = [];
            res.on('data', function (c) { chunks.push(c); });
            res.on('end', function () {
                var text = Buffer.concat(chunks).toString('utf8');
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try { return resolve(text ? JSON.parse(text) : null); }
                    catch (e) { return reject(new Error('Supabase JSON inválido: ' + text.slice(0, 200))); }
                }
                reject(new Error('Supabase HTTP ' + res.statusCode + ': ' + text.slice(0, 300)));
            });
        });
        req.on('error', reject);
        req.setTimeout(20000, function () { req.destroy(new Error('Supabase timeout')); });
        if (body !== undefined) req.write(body);
        req.end();
    });
}

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

function readData(cb) {
    if (SUPABASE_READY) {
        supabaseReq('GET', '?select=data&order=id.asc&limit=1')
            .then(function (rows) {
                if (Array.isArray(rows) && rows[0] && rows[0].data) cb(null, rows[0].data);
                else cb(null, null);
            })
            .catch(function (e) {
                console.error('Supabase read error:', e.message);
                readLocal(cb);
            });
        return;
    }
    readLocal(cb);
}

function readLocal(cb) {
    var raw = tryRead(DATA_FILE);
    if (raw == null) return cb(null, null);
    try { return cb(null, JSON.parse(raw.toString('utf8'))); }
    catch (e) { return cb(null, null); }
}

function writeData(obj, cb) {
    if (SUPABASE_READY) {
        supabaseReq('POST', '?on_conflict=id', { id: 1, data: obj, updated_at: new Date().toISOString() }, 'resolution=merge-duplicates,return=representation')
            .then(function () { cb(null, true); })
            .catch(function (e) {
                console.error('Supabase write error:', e.message);
                writeLocal(obj, cb);
            });
        return;
    }
    writeLocal(obj, cb);
}

function writeLocal(obj, cb) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf8');
        cb(null, true);
    } catch (e) {
        cb(e);
    }
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

    // API: GET /api/data y /api.php
    if ((urlPath === '/api/data' || urlPath === '/api.php') && req.method === 'GET') {
        readData(function (err, data) {
            if (err || data == null) {
                sendJson(res, 404, { error: 'Sin datos guardados aún' });
                return;
            }
            sendJson(res, 200, data);
        });
        return;
    }

    // API: POST /api/data y /api.php
    if ((urlPath === '/api/data' || urlPath === '/api.php') && req.method === 'POST') {
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
            writeData(parsed, function (err) {
                if (err) {
                    console.error('CMS save error:', err.message);
                    sendJson(res, 500, { error: 'Error al escribir los datos' });
                    return;
                }
                console.log('CMS save OK · bytes:', raw.length);
                sendJson(res, 200, { ok: true });
            });
        });
        return;
    }

    // Redireccionamientos amigables y rutas de la web
    var cleanPath = urlPath.replace(/^\/+|\/+$/g, '').toLowerCase();

    // /admin -> /#admin
    if (cleanPath === 'admin') {
        res.writeHead(302, { 'Location': '/#admin' });
        res.end();
        return;
    }

    // Redirección de secciones a sus anclas correspondientes
    var SECTIONS = {
        'estudio': 'estudio',
        'about': 'about',
        'nosotros': 'about',
        'servicios': 'servicios',
        'services': 'servicios',
        'creators': 'creators',
        'proyectos': 'proyectos',
        'projects': 'proyectos',
        'manifiesto': 'manifiesto',
        'manifesto': 'manifiesto',
        'proceso': 'proceso',
        'process': 'proceso',
        'clientes': 'clientes',
        'clients': 'clientes',
        'contacto': 'contacto',
        'contact': 'contacto'
    };

    if (SECTIONS[cleanPath]) {
        res.writeHead(302, { 'Location': '/#' + SECTIONS[cleanPath] });
        res.end();
        return;
    }

    if (cleanPath === 'index' || cleanPath === 'home') {
        res.writeHead(302, { 'Location': '/' });
        res.end();
        return;
    }

    // Estáticos
    var filePath = safeResolve(urlPath);
    if (filePath == null) {
        // Si no tiene extensión y no es un archivo estático, servir index.html como fallback
        if (!extOf(urlPath)) {
            var indexFallback = path.join(ROOT, 'index.html');
            if (fs.existsSync(indexFallback)) {
                sendStatic(res, indexFallback);
                return;
            }
        }
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
