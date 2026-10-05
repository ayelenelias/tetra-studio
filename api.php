<?php
/*
 * TETRA STUDIO — API REST (PHP + MySQL)
 * - Lectura pública de contenido
 * - Escritura del CMS protegida por sesión
 * - Formulario de contacto con validación y envío transaccional
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$localConfig = [];
$localConfigPath = __DIR__ . DIRECTORY_SEPARATOR . 'config.local.php';
if (is_file($localConfigPath)) {
    $loadedConfig = require $localConfigPath;
    if (is_array($loadedConfig)) $localConfig = $loadedConfig;
}

function configValue($envName, $localKey, $default = '') {
    global $localConfig;
    $envValue = getenv($envName);
    if ($envValue !== false && $envValue !== '') return $envValue;
    if (isset($localConfig[$localKey]) && $localConfig[$localKey] !== '') return $localConfig[$localKey];
    return $default;
}

function sendJsonResponse($status, $payload) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonBody($maxBytes = 32768) {
    $contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
    if ($contentLength > $maxBytes) sendJsonResponse(413, ['error' => 'Solicitud demasiado grande']);

    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') sendJsonResponse(400, ['error' => 'Cuerpo de solicitud vacío']);
    if (strlen($raw) > $maxBytes) sendJsonResponse(413, ['error' => 'Solicitud demasiado grande']);

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) sendJsonResponse(400, ['error' => 'JSON inválido']);
    return [$decoded, $raw];
}

function clientIp() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($parts[count($parts) - 1]);
    }
    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
}

function rateLimitPath($scope) {
    return sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'tetra-rate-' . $scope . '-' . hash('sha256', clientIp()) . '.json';
}

function consumeRateLimit($scope, $maxAttempts, $windowSeconds) {
    $path = rateLimitPath($scope);
    $now = time();
    $state = ['count' => 0, 'started_at' => $now];
    if (is_file($path)) {
        $stored = json_decode((string) @file_get_contents($path), true);
        if (is_array($stored)) $state = array_merge($state, $stored);
    }
    if (($now - (int) $state['started_at']) >= $windowSeconds) {
        $state = ['count' => 0, 'started_at' => $now];
    }
    if ((int) $state['count'] >= $maxAttempts) return false;
    $state['count'] = (int) $state['count'] + 1;
    @file_put_contents($path, json_encode($state), LOCK_EX);
    return true;
}

function clearRateLimit($scope) {
    $path = rateLimitPath($scope);
    if (is_file($path)) @unlink($path);
}

function startAdminSession() {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    session_name('tetra_admin');
    session_set_cookie_params([
        'lifetime' => 28800,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function isAdminAuthenticated() {
    startAdminSession();
    $expiresAt = isset($_SESSION['tetra_admin_expires']) ? (int) $_SESSION['tetra_admin_expires'] : 0;
    if (empty($_SESSION['tetra_admin_authenticated']) || $expiresAt < time()) {
        unset($_SESSION['tetra_admin_authenticated'], $_SESSION['tetra_admin_expires']);
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!isAdminAuthenticated()) sendJsonResponse(401, ['error' => 'Sesión de administrador requerida']);
}

function cleanText($value, $maxLength, $allowNewlines = false) {
    $value = trim(strip_tags((string) $value));
    $pattern = $allowNewlines ? '/[^\P{C}\n\r\t]+/u' : '/[^\P{C}\t]+/u';
    $value = preg_replace($pattern, '', $value);
    if (function_exists('mb_substr')) return mb_substr($value, 0, $maxLength);
    return substr($value, 0, $maxLength);
}

function sendContactEmail($contact) {
    $apiKey = configValue('RESEND_API_KEY', 'resend_api_key');
    $to = configValue('CONTACT_TO', 'contact_to', 'tetra.studio26@gmail.com');
    $from = configValue('CONTACT_FROM', 'contact_from');
    if ($apiKey === '' || $from === '') {
        return ['ok' => false, 'configuration' => false, 'to' => $to];
    }

    $subject = 'Nueva solicitud de creator - ' . $contact['brand'];
    $text = implode("\n", [
        'Nueva solicitud recibida desde la web de Tetra Studio',
        '',
        'Marca: ' . $contact['brand'],
        'Email: ' . $contact['email'],
        'Tipo de contenido: ' . $contact['contentType'],
        'Categoría: ' . $contact['category'],
        'Cantidad de creators: ' . $contact['creatorCount'],
        'Presupuesto aproximado: ' . $contact['budget'],
        'Fecha: ' . ($contact['date'] !== '' ? $contact['date'] : '-'),
        '',
        'Descripción:',
        $contact['description'] !== '' ? $contact['description'] : '-',
    ]);

    $payload = json_encode([
        'from' => $from,
        'to' => [$to],
        'reply_to' => $contact['email'],
        'subject' => $subject,
        'text' => $text,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if (function_exists('curl_init')) {
        $curl = curl_init('https://api.resend.com/emails');
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json',
                'User-Agent: Tetra-Studio/1.0',
            ],
            CURLOPT_POSTFIELDS => $payload,
        ]);
        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $error = curl_error($curl);
        curl_close($curl);
        if ($status >= 200 && $status < 300) return ['ok' => true, 'to' => $to];
        error_log('Resend error HTTP ' . $status . ': ' . ($error ?: substr((string) $response, 0, 300)));
        return ['ok' => false, 'configuration' => true, 'to' => $to];
    }

    $context = stream_context_create(['http' => [
        'method' => 'POST',
        'timeout' => 15,
        'ignore_errors' => true,
        'header' => "Authorization: Bearer {$apiKey}\r\nContent-Type: application/json\r\nUser-Agent: Tetra-Studio/1.0\r\n",
        'content' => $payload,
    ]]);
    $response = @file_get_contents('https://api.resend.com/emails', false, $context);
    $statusLine = isset($http_response_header[0]) ? $http_response_header[0] : '';
    if ($response !== false && preg_match('/\s2\d\d\s/', $statusLine)) return ['ok' => true, 'to' => $to];
    error_log('Resend error: ' . $statusLine);
    return ['ok' => false, 'configuration' => true, 'to' => $to];
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? strtolower(trim($_GET['action'])) : '';

if ($action === 'login') {
    if ($method !== 'POST') sendJsonResponse(405, ['error' => 'Método no permitido']);
    $adminPassword = configValue('ADMIN_PASSWORD', 'admin_password');
    if ($adminPassword === '') sendJsonResponse(503, ['error' => 'El acceso administrativo no está configurado']);
    if (!consumeRateLimit('login', 5, 900)) sendJsonResponse(429, ['error' => 'Demasiados intentos. Probá nuevamente en unos minutos']);

    list($body) = readJsonBody(4096);
    $password = isset($body['password']) ? (string) $body['password'] : '';
    if (!hash_equals($adminPassword, $password)) sendJsonResponse(401, ['error' => 'Contraseña incorrecta']);

    clearRateLimit('login');
    startAdminSession();
    session_regenerate_id(true);
    $_SESSION['tetra_admin_authenticated'] = true;
    $_SESSION['tetra_admin_expires'] = time() + 28800;
    sendJsonResponse(200, ['ok' => true, 'authenticated' => true]);
}

if ($action === 'session') {
    if ($method !== 'GET') sendJsonResponse(405, ['error' => 'Método no permitido']);
    sendJsonResponse(200, ['authenticated' => isAdminAuthenticated()]);
}

if ($action === 'logout') {
    if ($method !== 'POST') sendJsonResponse(405, ['error' => 'Método no permitido']);
    startAdminSession();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], '', $params['secure'], $params['httponly']);
    }
    session_destroy();
    sendJsonResponse(200, ['ok' => true]);
}

if ($action === 'contact') {
    if ($method !== 'POST') sendJsonResponse(405, ['error' => 'Método no permitido']);
    list($body) = readJsonBody(32768);

    // Campo invisible: los bots suelen completarlo. Se responde OK sin enviar nada.
    if (!empty($body['website'])) sendJsonResponse(200, ['ok' => true]);
    if (!consumeRateLimit('contact', 5, 600)) sendJsonResponse(429, ['error' => 'Demasiadas solicitudes. Intentá nuevamente más tarde']);

    $contact = [
        'brand' => cleanText(isset($body['brand']) ? $body['brand'] : '', 120),
        'email' => strtolower(trim(isset($body['email']) ? (string) $body['email'] : '')),
        'contentType' => cleanText(isset($body['contentType']) ? $body['contentType'] : '', 80),
        'category' => cleanText(isset($body['category']) ? $body['category'] : '', 80),
        'creatorCount' => max(1, min(100, (int) (isset($body['creatorCount']) ? $body['creatorCount'] : 1))),
        'budget' => cleanText(isset($body['budget']) ? $body['budget'] : '', 80),
        'date' => cleanText(isset($body['date']) ? $body['date'] : '', 20),
        'description' => cleanText(isset($body['description']) ? $body['description'] : '', 3000, true),
    ];

    if ($contact['brand'] === '') sendJsonResponse(422, ['error' => 'Ingresá el nombre de la marca']);
    if (!filter_var($contact['email'], FILTER_VALIDATE_EMAIL)) sendJsonResponse(422, ['error' => 'Ingresá un email válido']);
    if ($contact['date'] !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $contact['date'])) sendJsonResponse(422, ['error' => 'La fecha no es válida']);

    $delivery = sendContactEmail($contact);
    if (!$delivery['ok']) {
        $message = empty($delivery['configuration'])
            ? 'El formulario todavía no está configurado para enviar correos'
            : 'No pudimos enviar la solicitud en este momento';
        sendJsonResponse(503, ['error' => $message, 'fallbackEmail' => $delivery['to']]);
    }
    sendJsonResponse(200, ['ok' => true, 'message' => 'Solicitud enviada correctamente']);
}

if ($method === 'POST') requireAdmin();
if ($method !== 'GET' && $method !== 'POST') sendJsonResponse(405, ['error' => 'Método no permitido']);

$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: 'tetra_cms';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
if (!preg_match('/^[A-Za-z0-9_]+$/', $dbName)) sendJsonResponse(500, ['error' => 'Configuración de base de datos inválida']);

$dataFile = __DIR__ . DIRECTORY_SEPARATOR . 'data.json';
$pdo = null;
try {
    $pdoInit = new PDO("mysql:host={$dbHost};port={$dbPort};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdoInit->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec("CREATE TABLE IF NOT EXISTS `tetra_data` (
        `id` INT PRIMARY KEY DEFAULT 1,
        `data` LONGTEXT NOT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Exception $error) {
    error_log('Error conexión MySQL: ' . $error->getMessage());
}

if ($method === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query('SELECT data FROM tetra_data WHERE id = 1 LIMIT 1');
            $row = $stmt->fetch();
            if ($row && !empty($row['data'])) {
                echo $row['data'];
                exit;
            }
            if (is_file($dataFile)) {
                $initial = file_get_contents($dataFile);
                if ($initial) {
                    $ins = $pdo->prepare('INSERT INTO tetra_data (id, data, updated_at) VALUES (1, :data, NOW()) ON DUPLICATE KEY UPDATE data = :data, updated_at = NOW()');
                    $ins->execute([':data' => $initial]);
                    echo $initial;
                    exit;
                }
            }
        } catch (Exception $error) {
            error_log('Error leyendo MySQL: ' . $error->getMessage());
        }
    }
    if (is_file($dataFile)) {
        echo file_get_contents($dataFile);
        exit;
    }
    sendJsonResponse(404, ['error' => 'Sin datos guardados']);
}

list($decoded, $raw) = readJsonBody(10 * 1024 * 1024);
if ($pdo) {
    try {
        $stmt = $pdo->prepare('INSERT INTO tetra_data (id, data, updated_at) VALUES (1, :data, NOW()) ON DUPLICATE KEY UPDATE data = :data, updated_at = NOW()');
        $stmt->execute([':data' => $raw]);
        @file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        sendJsonResponse(200, ['ok' => true, 'source' => 'mysql']);
    } catch (Exception $error) {
        error_log('Error guardando MySQL: ' . $error->getMessage());
    }
}

if (@file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) === false) {
    sendJsonResponse(500, ['error' => 'No se pudieron guardar los datos']);
}
sendJsonResponse(200, ['ok' => true, 'source' => 'file_fallback']);
