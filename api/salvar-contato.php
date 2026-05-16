<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido.'
    ]);
    exit;
}

require_once __DIR__ . '/../config/database.php';

function responder(int $statusCode, bool $success, string $message, array $extra = []): void
{
    http_response_code($statusCode);
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message,
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function limparTexto(?string $valor, int $limite): string
{
    $valor = trim((string) $valor);
    $valor = preg_replace('/\s+/', ' ', $valor) ?? '';
    return mb_substr($valor, 0, $limite, 'UTF-8');
}

// Campo invisível anti-spam. Usuários reais não devem preenchê-lo.
$website = limparTexto($_POST['website'] ?? '', 120);
if ($website !== '') {
    responder(200, true, 'Contato recebido.');
}

$nome = limparTexto($_POST['nome'] ?? '', 120);
$email = strtolower(limparTexto($_POST['email'] ?? '', 180));
$telefone = limparTexto($_POST['telefone'] ?? '', 40);
$mensagem = trim((string) ($_POST['mensagem'] ?? ''));
$mensagem = mb_substr($mensagem, 0, 2000, 'UTF-8');
$privacidade = isset($_POST['privacidade']) ? 1 : 0;

if ($nome === '') {
    responder(422, false, 'Informe seu nome.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(422, false, 'Informe um e-mail válido.');
}

if ($privacidade !== 1) {
    responder(422, false, 'É necessário aceitar a Política de Privacidade.');
}

$ip = $_SERVER['REMOTE_ADDR'] ?? null;
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

try {
    $pdo = getDatabaseConnection();

    $sql = 'INSERT INTO contatos_site
        (nome, email, telefone, mensagem, privacidade_aceita, ip, user_agent, criado_em)
        VALUES
        (:nome, :email, :telefone, :mensagem, :privacidade_aceita, :ip, :user_agent, NOW())';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome' => $nome,
        ':email' => $email,
        ':telefone' => $telefone !== '' ? $telefone : null,
        ':mensagem' => $mensagem !== '' ? $mensagem : null,
        ':privacidade_aceita' => $privacidade,
        ':ip' => $ip,
        ':user_agent' => $userAgent ? mb_substr($userAgent, 0, 255, 'UTF-8') : null,
    ]);

    responder(200, true, 'Contato salvo com sucesso.');
} catch (Throwable $erro) {
    error_log('Erro ao salvar contato BR101: ' . $erro->getMessage());
    responder(500, false, 'Não foi possível salvar o contato agora. Tente novamente em instantes.');
}
