/*
===============================================
TECHFLOW OS
CRIAÇÃO DO PRIMEIRO ADMINISTRADOR

Executar somente na instalação inicial.

Comando:
node scripts/criar-admin-inicial.js
===============================================
*/

require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env")
});

const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");

const conexao = require("../database/conexao");

const terminal = readline.createInterface({
    input: stdin,
    output: stdout
});

// ============================================
// VALIDAR CPF
// ============================================

function cpfValido(valor) {
    const cpf = String(valor).replace(/\D/g, "");

    if (!/^\d{11}$/.test(cpf)) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    for (let digito = 9; digito < 11; digito++) {

        let soma = 0;

        for (let i = 0; i < digito; i++) {
            soma += Number(cpf[i]) * (digito + 1 - i);
        }

        const resto = (soma * 10) % 11;
        const verificador = resto === 10 ? 0 : resto;

        if (verificador !== Number(cpf[digito])) {
            return false;
        }
    }

    return true;
}

// ============================================
// CRIAR ADMINISTRADOR
// ============================================

async function criarAdministrador() {

    let db;

    try {

        console.log("\n================================");
        console.log(" TECHFLOW - PRIMEIRO ADMIN");
        console.log("================================\n");

        db = await conexao.getConnection();

        await db.beginTransaction();

        // Bloquear criação se já existir
        // qualquer administrador no sistema.

        const [administradores] = await db.execute(
            `SELECT idUsuario
             FROM Usuarios
             WHERE perfil = 'administrador'
             LIMIT 1
             FOR UPDATE`
        );

        if (administradores.length > 0) {

            await db.rollback();

            console.log(
                "Já existe um administrador cadastrado."
            );

            console.log(
                "Nenhum registro foi alterado."
            );

            return;
        }

        // ====================================
        // DADOS DO ADMINISTRADOR
        // ====================================

        const nomeCompleto = (
            await terminal.question(
                "Nome completo: "
            )
        ).trim();

        const email = (
            await terminal.question(
                "E-mail: "
            )
        ).trim().toLowerCase();

        const cpf = (
            await terminal.question(
                "CPF (somente números): "
            )
        ).replace(/\D/g, "");

        // ====================================
        // VALIDAÇÕES
        // ====================================

        if (nomeCompleto.length < 3) {
            throw new Error(
                "Informe um nome válido."
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error(
                "Informe um e-mail válido."
            );
        }

        if (!cpfValido(cpf)) {
            throw new Error(
                "Informe um CPF válido."
            );
        }

        // Verificar CPF ou e-mail duplicado.

        const [existentes] = await db.execute(
            `SELECT idUsuario
             FROM Usuarios
             WHERE email = ? OR cpf = ?
             LIMIT 1`,
            [email, cpf]
        );

        if (existentes.length > 0) {
            throw new Error(
                "CPF ou e-mail já cadastrado."
            );
        }

        // ====================================
        // GERAR SENHA SEGURA
        // ====================================

        const senhaTemporaria = crypto
            .randomBytes(24)
            .toString("base64url");

        const senhaHash = await bcrypt.hash(
            senhaTemporaria,
            12
        );

        // ====================================
        // CADASTRAR ADMINISTRADOR
        // ====================================

        const [resultado] = await db.execute(
            `INSERT INTO Usuarios (
                nomeCompleto,
                cpf,
                email,
                senha,
                perfil,
                ativo,
                tentativasLogin,
                bloqueadoAte
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nomeCompleto,
                cpf,
                email,
                senhaHash,
                "administrador",
                1,
                0,
                null
            ]
        );

        await db.commit();

        // ====================================
        // EXIBIR CREDENCIAIS
        // ====================================

        console.log("\n================================");
        console.log(" ADMINISTRADOR CRIADO!");
        console.log("================================");

        console.log(
            "ID:",
            resultado.insertId
        );

        console.log(
            "E-mail:",
            email
        );

        console.log(
            "Senha inicial:",
            senhaTemporaria
        );

        console.log("\nIMPORTANTE:");

        console.log(
            "Guarde essa senha em local seguro."
        );

        console.log(
            "Ela não será exibida novamente."
        );

        console.log(
            "Não compartilhe as credenciais."
        );

    } catch (erro) {

        if (db) {
            try {
                await db.rollback();
            } catch (_) {
                // A conexão pode já ter sido encerrada.
            }
        }

        console.error(
            "\nErro:",
            erro.message
        );

    } finally {

        terminal.close();

        if (db) {
            db.release();
        }

        await conexao.end();
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

criarAdministrador();