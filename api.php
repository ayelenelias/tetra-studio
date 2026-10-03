<?php
/* ═══════════════════════════════════════════════════════
   TETRA STUDIO — API REST (PHP + MySQL XAMPP)
   Guarda y lee los datos del CMS en MySQL y sincroniza data.json
   ═══════════════════════════════════════════════════════ */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Configuración de MySQL (XAMPP por defecto)
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: 'tetra_cms';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';

$dataFile = __DIR__ . DIRECTORY_SEPARATOR . 'data.json';

// Conexión segura con PDO
try {
    // Asegurar que la base de datos exista
    $pdoInit = new PDO("mysql:host={$dbHost};port={$dbPort};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $pdoInit->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Asegurar tamaño de paquete suficiente para imágenes
    try { $pdo->exec("SET GLOBAL max_allowed_packet = 67108864"); } catch (Exception $ignore) {}

    // Asegurar que la tabla exista
    $pdo->exec("CREATE TABLE IF NOT EXISTS `tetra_data` (
        `id` INT PRIMARY KEY DEFAULT 1,
        `data` LONGTEXT NOT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

} catch (Exception $e) {
    // Si MySQL no responde, fallback a data.json
    error_log("Error conexión MySQL: " . $e->getMessage());
    handleJsonFallback($dataFile);
    exit;
}

// ─── GET: Obtener datos de MySQL ───
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT data FROM tetra_data WHERE id = 1 LIMIT 1");
        $row = $stmt->fetch();

        if ($row && !empty($row['data'])) {
            echo $row['data'];
            exit;
        }

        // Si la tabla está vacía, inicializar desde data.json si existe
        if (file_exists($dataFile)) {
            $initial = file_get_contents($dataFile);
            if ($initial) {
                $ins = $pdo->prepare("INSERT INTO tetra_data (id, data, updated_at) VALUES (1, :data, NOW()) ON DUPLICATE KEY UPDATE data = :data, updated_at = NOW()");
                $ins->execute([':data' => $initial]);
                echo $initial;
                exit;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Sin datos guardados']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al leer de la base de datos: ' . $e->getMessage()]);
    }
    exit;
}

// ─── POST: Guardar datos en MySQL ───
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        http_response_code(400);
        echo json_encode(['error' => 'Cuerpo de solicitud vacío']);
        exit;
    }

    // Validar JSON
    $decoded = json_decode($raw);
    if ($decoded === null) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido']);
        exit;
    }

    try {
        // 1. Guardar en MySQL
        $stmt = $pdo->prepare("INSERT INTO tetra_data (id, data, updated_at) VALUES (1, :data, NOW()) ON DUPLICATE KEY UPDATE data = :data, updated_at = NOW()");
        $stmt->execute([':data' => $raw]);

        // 2. Guardar también en data.json como respaldo
        @file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        echo json_encode(['ok' => true, 'source' => 'mysql']);
    } catch (Exception $e) {
        // Fallback: al menos guardar en data.json
        @file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar en MySQL: ' . $e->getMessage()]);
    }
    exit;
}

// ─── Fallback JSON si MySQL falla ───
function handleJsonFallback($dataFile) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (file_exists($dataFile)) {
            echo file_get_contents($dataFile);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Archivo no encontrado']);
        }
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $decoded = json_decode($raw);
        if ($decoded !== null) {
            file_put_contents($dataFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['ok' => true, 'source' => 'file_fallback']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
        }
        exit;
    }
}
