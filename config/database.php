<?php
/**
 * Configuração do banco de dados MySQL.
 *
 * Na HostGator, preencha estes dados com as informações criadas no cPanel:
 * - DB_HOST: normalmente "localhost"
 * - DB_NAME: nome completo do banco, geralmente algo como "usuario_banco"
 * - DB_USER: usuário completo do banco, geralmente algo como "usuario_user"
 * - DB_PASS: senha do usuário do banco
 */

const DB_HOST = 'localhost';
const DB_NAME = 'COLOQUE_AQUI_O_NOME_DO_BANCO';
const DB_USER = 'COLOQUE_AQUI_O_USUARIO_DO_BANCO';
const DB_PASS = 'COLOQUE_AQUI_A_SENHA_DO_BANCO';
const DB_CHARSET = 'utf8mb4';

function getDatabaseConnection(): PDO
{
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_NAME,
        DB_CHARSET
    );

    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}
