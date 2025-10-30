<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'postgres';      // ajuste para seu banco
$user = 'postgres';      // ajuste para seu usuário
$password = 'root';    // ajuste para sua senha

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
