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
var crypto = require('crypto');

var PORT = process.env.PORT || 3000;
var ROOT = __dirname;
// En Render/otros hosting el disco efímero se borra en cada deploy.
// Montá un disco persistente y apuntá DATA_FILE a él con una variable de entorno.
// Ej.  DATA_FILE=/data/data.json   (con disco montado en /data)
var DATA_FILE = process.env.DATA_FILE || process.env.DATA_PATH || path.join(ROOT, 'data.json');
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
var ADMIN_SECRET = process.env.ADMIN_SECRET || (ADMIN_PASSWORD ? crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex') : '');
var CONTACT_TO = process.env.CONTACT_TO || 'tetra.studio26@gmail.com';
var CONTACT_FROM = process.env.CONTACT_FROM || '';
var RESEND_API_KEY = process.env.RESEND_API_KEY || '';
var SESSION_SECONDS = 8 * 60 * 60;
var loginAttempts = new Map();
var contactAttempts = new Map();
var revokedSessions = new Map();

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

function safeEqual(a, b) {
    var left = Buffer.from(String(a || ''), 'utf8');
    var right = Buffer.from(String(b || ''), 'utf8');
    if (left.length !== right.length) return false;
    return crypto.timingSafeEqual(left, right);
}

function base64Url(value) {
    return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signAdminSession(expiresAt) {
    var payload = String(expiresAt);
    var signature = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64')
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return base64Url(payload) + '.' + signature;
}

function parseCookies(req) {
    var cookies = {};
    String(req.headers.cookie || '').split(';').forEach(function (part) {
        var separator = part.indexOf('=');
        if (separator < 0) return;
        var key = part.slice(0, separator).trim();
        var value = part.slice(separator + 1).trim();
        if (key) cookies[key] = value;
    });
    return cookies;
}

function isAdminAuthenticated(req) {
    if (!ADMIN_SECRET) return false;
    var token = parseCookies(req).tetra_admin;
    if (!token) return false;
    var revokedUntil = revokedSessions.get(token) || 0;
    if (revokedUntil > Date.now()) return false;
    if (revokedUntil) revokedSessions.delete(token);
    var parts = token.split('.');
    if (parts.length !== 2) return false;
    var expiresText;
    try {
        var normalized = parts[0].replace(/-/g, '+').replace(/_/g, '/');
        while (normalized.length % 4) normalized += '=';
        expiresText = Buffer.from(normalized, 'base64').toString('utf8');
    } catch (e) {
        return false;
    }
    var expiresAt = parseInt(expiresText, 10);
    if (!expiresAt || expiresAt < Date.now()) return false;
    return safeEqual(signAdminSession(expiresAt), token);
}

function revokeAdminSession(req) {
    var token = parseCookies(req).tetra_admin;
    if (!token) return;
    var parts = token.split('.');
    if (parts.length !== 2) return;
    try {
        var normalized = parts[0].replace(/-/g, '+').replace(/_/g, '/');
        while (normalized.length % 4) normalized += '=';
        var expiresAt = parseInt(Buffer.from(normalized, 'base64').toString('utf8'), 10);
        if (expiresAt > Date.now()) revokedSessions.set(token, expiresAt);
    } catch (e) {}
}

function sessionCookie(req, value, maxAge) {
    var forwardedProto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
    var secure = forwardedProto === 'https' || !!(req.socket && req.socket.encrypted);
    return 'tetra_admin=' + value + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + maxAge + (secure ? '; Secure' : '');
}

function clientIp(req) {
    var forwardedParts = String(req.headers['x-forwarded-for'] || '').split(',');
    var forwarded = forwardedParts[forwardedParts.length - 1].trim();
    return forwarded || (req.socket && req.socket.remoteAddress) || 'unknown';
}

function consumeRateLimit(store, key, maxAttempts, windowMs) {
    var now = Date.now();
    if (store.size > 5000) {
        store.forEach(function (value, storedKey) {
            if (!value || now - value.startedAt >= windowMs) store.delete(storedKey);
        });
        if (store.size > 5000) store.delete(store.keys().next().value);
    }
    var state = store.get(key);
    if (!state || now - state.startedAt >= windowMs) {
        state = { count: 0, startedAt: now };
    }
    if (state.count >= maxAttempts) return false;
    state.count += 1;
    store.set(key, state);
    return true;
}

function readJsonBody(req, maxBytes, cb) {
    var chunks = [];
    var size = 0;
    var tooLarge = false;
    req.on('data', function (chunk) {
        size += chunk.length;
        if (size > maxBytes) {
            tooLarge = true;
            return;
        }
        chunks.push(chunk);
    });
    req.on('end', function () {
        if (tooLarge) return cb(Object.assign(new Error('Solicitud demasiado grande'), { statusCode: 413 }));
        var raw = Buffer.concat(chunks).toString('utf8');
        if (!raw) return cb(Object.assign(new Error('Cuerpo de solicitud vacío'), { statusCode: 400 }));
        try { cb(null, JSON.parse(raw), raw); }
        catch (e) { cb(Object.assign(new Error('JSON inválido'), { statusCode: 400 })); }
    });
    req.on('error', function (error) { cb(error); });
}

function cleanText(value, maxLength, allowNewlines) {
    var text = String(value == null ? '' : value).replace(/<[^>]*>/g, '').trim();
    text = allowNewlines
        ? text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
        : text.replace(/[\u0000-\u001F\u007F]/g, ' ');
    return text.slice(0, maxLength);
}

function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function sendContactEmail(contact) {
    return new Promise(function (resolve, reject) {
        if (!RESEND_API_KEY || !CONTACT_FROM) {
            return resolve({ ok: false, configuration: false, to: CONTACT_TO });
        }
        var text = [
            'Nueva solicitud recibida desde la web de Tetra Studio',
            '',
            'Marca: ' + contact.brand,
            'Email: ' + contact.email,
            'Tipo de contenido: ' + contact.contentType,
            'Categoría: ' + contact.category,
            'Cantidad de creators: ' + contact.creatorCount,
            'Presupuesto aproximado: ' + contact.budget,
            'Fecha: ' + (contact.date || '-'),
            '',
            'Descripción:',
            contact.description || '-'
        ].join('\n');
        var body = JSON.stringify({
            from: CONTACT_FROM,
            to: [CONTACT_TO],
            reply_to: contact.email,
            subject: 'Nueva solicitud de creator - ' + contact.brand,
            text: text
        });
        var request = https.request({
            hostname: 'api.resend.com',
            port: 443,
            path: '/emails',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + RESEND_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'User-Agent': 'Tetra-Studio/1.0'
            }
        }, function (response) {
            var chunks = [];
            response.on('data', function (chunk) { chunks.push(chunk); });
            response.on('end', function () {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    return resolve({ ok: true, to: CONTACT_TO });
                }
                var detail = Buffer.concat(chunks).toString('utf8').slice(0, 300);
                reject(new Error('Resend HTTP ' + response.statusCode + ': ' + detail));
            });
        });
        request.on('error', reject);
        request.setTimeout(15000, function () { request.destroy(new Error('Resend timeout')); });
        request.write(body);
        request.end();
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

function sendJson(res, code, obj, extraHeaders) {
    var body = JSON.stringify(obj);
    var headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
    Object.keys(extraHeaders || {}).forEach(function (key) { headers[key] = extraHeaders[key]; });
    res.writeHead(code, headers);
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
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    });
    res.end(buf);
}

function safeResolve(urlPath) {
    var decoded;
    try { decoded = decodeURIComponent(urlPath); } catch (e) { decoded = urlPath; }
    var normalized = path.normalize(decoded).replace(/^\\|^\/+/, '');
    if (!normalized) normalized = 'index.html';
    var lower = normalized.toLowerCase();
    var blockedFiles = {
        'server.js': true,
        'package.json': true,
        'package-lock.json': true,
        'render.yaml': true,
        'security-setup.md': true,
        'api.php': true,
        'config.local.php': true,
        'config.local.php.example': true
    };
    if (lower.split(/[\\/]/).some(function (part) { return part.charAt(0) === '.'; }) || blockedFiles[lower]) {
        return null;
    }
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
    var parsedUrl;
    try { parsedUrl = new URL(url, 'http://localhost'); }
    catch (e) { return sendJson(res, 400, { error: 'URL inválida' }); }
    var urlPath = parsedUrl.pathname;
    var action = String(parsedUrl.searchParams.get('action') || '').toLowerCase();

    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Allow': 'GET, POST, OPTIONS',
            'X-Content-Type-Options': 'nosniff'
        });
        res.end();
        return;
    }

    var isPhpApi = urlPath === '/api.php';
    var isLoginRoute = (isPhpApi && action === 'login') || urlPath === '/api/auth/login';
    var isSessionRoute = (isPhpApi && action === 'session') || urlPath === '/api/auth/session';
    var isLogoutRoute = (isPhpApi && action === 'logout') || urlPath === '/api/auth/logout';
    var isContactRoute = (isPhpApi && action === 'contact') || urlPath === '/api/contact';

    if (isLoginRoute) {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método no permitido' });
        if (!ADMIN_PASSWORD || !ADMIN_SECRET) return sendJson(res, 503, { error: 'El acceso administrativo no está configurado' });
        var loginKey = clientIp(req);
        if (!consumeRateLimit(loginAttempts, loginKey, 5, 15 * 60 * 1000)) {
            return sendJson(res, 429, { error: 'Demasiados intentos. Probá nuevamente en unos minutos' });
        }
        return readJsonBody(req, 4096, function (error, body) {
            if (error) return sendJson(res, error.statusCode || 400, { error: error.message });
            if (!body || !safeEqual(body.password, ADMIN_PASSWORD)) {
                return sendJson(res, 401, { error: 'Contraseña incorrecta' });
            }
            loginAttempts.delete(loginKey);
            var expiresAt = Date.now() + SESSION_SECONDS * 1000;
            sendJson(res, 200, { ok: true, authenticated: true }, {
                'Set-Cookie': sessionCookie(req, signAdminSession(expiresAt), SESSION_SECONDS)
            });
        });
    }

    if (isSessionRoute) {
        if (req.method !== 'GET') return sendJson(res, 405, { error: 'Método no permitido' });
        return sendJson(res, 200, { authenticated: isAdminAuthenticated(req) });
    }

    if (isLogoutRoute) {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método no permitido' });
        revokeAdminSession(req);
        return sendJson(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, '', 0) });
    }

    if (isContactRoute) {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método no permitido' });
        return readJsonBody(req, 32768, function (error, body) {
            if (error) return sendJson(res, error.statusCode || 400, { error: error.message });
            body = body && typeof body === 'object' ? body : {};
            if (body.website) return sendJson(res, 200, { ok: true });
            if (!consumeRateLimit(contactAttempts, clientIp(req), 5, 10 * 60 * 1000)) {
                return sendJson(res, 429, { error: 'Demasiadas solicitudes. Intentá nuevamente más tarde' });
            }
            var contact = {
                brand: cleanText(body.brand, 120, false),
                email: String(body.email || '').trim().toLowerCase(),
                contentType: cleanText(body.contentType, 80, false),
                category: cleanText(body.category, 80, false),
                creatorCount: Math.max(1, Math.min(100, parseInt(body.creatorCount, 10) || 1)),
                budget: cleanText(body.budget, 80, false),
                date: cleanText(body.date, 20, false),
                description: cleanText(body.description, 3000, true)
            };
            if (!contact.brand) return sendJson(res, 422, { error: 'Ingresá el nombre de la marca' });
            if (!validEmail(contact.email)) return sendJson(res, 422, { error: 'Ingresá un email válido' });
            if (contact.date && !/^\d{4}-\d{2}-\d{2}$/.test(contact.date)) {
                return sendJson(res, 422, { error: 'La fecha no es válida' });
            }
            sendContactEmail(contact).then(function (delivery) {
                if (!delivery.ok) {
                    return sendJson(res, 503, {
                        error: 'El formulario todavía no está configurado para enviar correos',
                        fallbackEmail: delivery.to
                    });
                }
                sendJson(res, 200, { ok: true, message: 'Solicitud enviada correctamente' });
            }).catch(function (sendError) {
                console.error('Contact email error:', sendError.message);
                sendJson(res, 503, { error: 'No pudimos enviar la solicitud en este momento', fallbackEmail: CONTACT_TO });
            });
        });
    }

    // API: GET /api/data y /api.php
    if ((urlPath === '/api/data' || isPhpApi) && !action && req.method === 'GET') {
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
    if ((urlPath === '/api/data' || isPhpApi) && !action && req.method === 'POST') {
        if (!isAdminAuthenticated(req)) return sendJson(res, 401, { error: 'Sesión de administrador requerida' });
        readJsonBody(req, 10 * 1024 * 1024, function (error, body, raw) {
            if (error) return sendJson(res, error.statusCode || 400, { error: error.message });
            writeData(body, function (err) {
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

    // Nunca servir archivos internos como contenido estático.
    if (isPhpApi || urlPath.indexOf('/api/') === 0) {
        return sendJson(res, 404, { error: 'Endpoint no encontrado' });
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
