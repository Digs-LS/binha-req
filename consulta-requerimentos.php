<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
// Carregar variáveis de ambiente (em dev, use vlucas/phpdotenv; em produção, a PaaS injeta as variáveis)
$host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
$port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');
$dbname = getenv('DB_DATABASE') ?: ($_ENV['DB_DATABASE'] ?? 'app');
$user = getenv('DB_USERNAME') ?: ($_ENV['DB_USERNAME'] ?? 'user');
$password = getenv('DB_PASSWORD') ?: ($_ENV['DB_PASSWORD'] ?? '');

// Conectar com PDO
$dsn = "pgsql:host={$host};port={$port};dbname={$dbname};";
try {
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    error_log('DB connection failed: ' . $e->getMessage());
    http_response_code(500);
    echo 'Erro interno.';
    exit;
}

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT req_id as id, req_requerente_cpf as cpf, req_processo_sei as processo_sei,
                    req_data_protocolo::text as data_protocolo, rel_nome as relator,
                    req_situacao_doenca as situacao
            FROM req_requerimento
            LEFT JOIN rel_relator ON req_requerimento.req_relator_id = rel_relator.rel_id
            ORDER BY req_data_protocolo DESC";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
