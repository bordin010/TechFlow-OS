/*
==========================================
TECHFLOW OS
CONEXÃO COM O BANCO DE DADOS MYSQL
==========================================
*/

const mysql = require("mysql2/promise");

// Carregar variáveis do arquivo .env.
// Funciona mesmo quando este módulo é
// utilizado fora do server.js.
require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env")
});

// ==========================================
// CONFIGURAÇÃO DA CONEXÃO
// ==========================================

const conexao = mysql.createPool({

    // Servidor MySQL
    host: process.env.DB_HOST || "localhost",

    // Porta do MySQL
    port: Number(process.env.DB_PORT || 3306),

    // Usuário do banco
    user: process.env.DB_USER || "root",

    // Senha do banco
    password: process.env.DB_PASSWORD,

    // Nome do banco
    database: process.env.DB_NAME || "techflow",

    // Suporte a caracteres especiais
    charset: "utf8mb4",

    // Pool de conexões
    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

// ==========================================
// EXPORTAR CONEXÃO
// ==========================================

module.exports = conexao;