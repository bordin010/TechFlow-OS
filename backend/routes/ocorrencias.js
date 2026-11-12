/* ==============================================
   TECHFLOW OS - ROTAS DE OCORRÊNCIAS

   Registro e consulta de ocorrências
   Proteção de exclusão lógica das OS
   ============================================== */

const express = require("express");
const conexao = require("../database/conexao");

const router = express.Router();

// ==============================================
// VALIDAÇÕES
// ==============================================

const idValido = (id) =>
    /^[1-9]\d*$/.test(String(id)) &&
    Number.isSafeInteger(Number(id));

function acessoNegado(res) {
    return res.status(403).json({
        mensagem:
            "Você não tem permissão para acessar esta OS."
    });
}

// Verificar se o usuário pode consultar a OS.
function podeConsultarOS(os, usuario) {
    return (
        usuario.perfil === "administrador" ||

        (
            usuario.perfil === "tecnico" &&
            Number(os.idTecnico) ===
            Number(usuario.idUsuario)
        ) ||

        (
            usuario.perfil === "cliente" &&
            Number(os.idCliente) ===
            Number(usuario.idUsuario)
        )
    );
}

// ==============================================
// POST /api/ocorrencias
// REGISTRAR UMA NOVA OCORRÊNCIA
// ==============================================

router.post("/", async (req, res) => {

    const { idOS, descricao } = req.body || {};

    // Apenas técnicos podem registrar ocorrências.
    if (
        !req.usuario ||
        req.usuario.perfil !== "tecnico"
    ) {
        return res.status(403).json({
            mensagem:
                "Somente técnicos podem registrar ocorrências."
        });
    }

    // Validar ID da OS.
    if (!idValido(idOS)) {
        return res.status(400).json({
            mensagem:
                "Informe uma Ordem de Serviço válida."
        });
    }

    // Validar descrição.
    if (
        typeof descricao !== "string" ||
        !descricao.trim()
    ) {
        return res.status(400).json({
            mensagem:
                "Informe a descrição da ocorrência."
        });
    }

    const descricaoLimpa = descricao.trim();

    if (descricaoLimpa.length > 800) {
        return res.status(400).json({
            mensagem:
                "A ocorrência deve ter no máximo 800 caracteres."
        });
    }

    let db;

    try {

        db = await conexao.getConnection();
        await db.beginTransaction();

        // ======================================
        // VERIFICAR A ORDEM DE SERVIÇO
        // ======================================

        // Bloquear o registro da OS durante a
        // transação para evitar alterações simultâneas.
        const [ordens] = await db.execute(
            `SELECT
                idOS,
                idCliente,
                idTecnico,
                statusOS,
                excluidaEm

             FROM OrdensServico

             WHERE idOS = ?

             FOR UPDATE`,
            [idOS]
        );

        // ======================================
        // PROTEÇÃO DE EXCLUSÃO LÓGICA
        // ======================================

        // Não permitir ocorrências em OS
        // inexistentes ou excluídas.
        if (
            ordens.length === 0 ||
            ordens[0].excluidaEm !== null
        ) {

            await db.rollback();

            return res.status(404).json({
                mensagem:
                    "Ordem de Serviço não encontrada."
            });
        }

        const os = ordens[0];

        // ======================================
        // VERIFICAR O TÉCNICO RESPONSÁVEL
        // ======================================

        if (
            Number(os.idTecnico) !==
            Number(req.usuario.idUsuario)
        ) {

            await db.rollback();

            return acessoNegado(res);
        }

        // ======================================
        // VERIFICAR STATUS DA OS
        // ======================================

        // Não permitir novas ocorrências quando
        // o atendimento estiver finalizado.
        if (
            ["Concluída", "Cancelada"].includes(
                os.statusOS
            )
        ) {

            await db.rollback();

            return res.status(400).json({
                mensagem:
                    "Não é permitido registrar ocorrências em uma OS finalizada."
            });
        }

        // ======================================
        // REGISTRAR OCORRÊNCIA NO MYSQL
        // ======================================

        const [resultado] = await db.execute(
            `INSERT INTO OcorrenciasOS
                (
                    idOS,
                    idTecnico,
                    descricao
                )

             VALUES (?, ?, ?)`,
            [
                idOS,
                req.usuario.idUsuario,
                descricaoLimpa
            ]
        );

        // Confirmar transação.
        await db.commit();

        return res.status(201).json({
            mensagem:
                "Ocorrência registrada com sucesso!",
            idOcorrencia: resultado.insertId,
            idOS: Number(idOS)
        });

    } catch (erro) {

        if (db) {
            try {
                await db.rollback();
            } catch (erroRollback) {
                console.error(
                    "Erro ao desfazer transação:",
                    erroRollback.message
                );
            }
        }

        console.error(
            "Erro ao registrar ocorrência:",
            erro.message
        );

        return res.status(500).json({
            mensagem:
                "Erro ao registrar ocorrência."
        });

    } finally {

        if (db) {
            db.release();
        }

    }
});

// ==============================================
// GET /api/ocorrencias/:idOS
// CONSULTAR OCORRÊNCIAS DA OS
// ==============================================

router.get("/:idOS", async (req, res) => {

    const { idOS } = req.params;

    // Validar identificador.
    if (!idValido(idOS)) {

        return res.status(400).json({
            mensagem:
                "ID da Ordem de Serviço inválido."
        });
    }

    try {

        // ======================================
        // CONSULTAR A ORDEM DE SERVIÇO
        // ======================================

        const [ordens] = await conexao.execute(
            `SELECT
                idOS,
                idCliente,
                idTecnico,
                statusOS,
                excluidaEm

             FROM OrdensServico

             WHERE idOS = ?`,
            [idOS]
        );

        // ======================================
        // PROTEÇÃO DE EXCLUSÃO LÓGICA
        // ======================================

        // Não permitir consultar ocorrências
        // de uma OS excluída.
        if (
            ordens.length === 0 ||
            ordens[0].excluidaEm !== null
        ) {

            return res.status(404).json({
                mensagem:
                    "Ordem de Serviço não encontrada."
            });
        }

        const os = ordens[0];

        // ======================================
        // VERIFICAR PERMISSÕES
        // ======================================

        if (!podeConsultarOS(os, req.usuario)) {
            return acessoNegado(res);
        }

        // ======================================
        // BUSCAR OCORRÊNCIAS NO MYSQL
        // ======================================

        const [ocorrencias] = await conexao.execute(
            `SELECT
                ocorrencia.idOcorrencia,
                ocorrencia.idOS,
                ocorrencia.idTecnico,

                tecnico.nomeCompleto AS nomeTecnico,

                ocorrencia.descricao,
                ocorrencia.dataRegistro

             FROM OcorrenciasOS AS ocorrencia

             INNER JOIN Usuarios AS tecnico
                ON tecnico.idUsuario =
                   ocorrencia.idTecnico

             WHERE ocorrencia.idOS = ?

             ORDER BY
                ocorrencia.dataRegistro DESC,
                ocorrencia.idOcorrencia DESC`,
            [idOS]
        );

        // ======================================
        // RETORNAR OCORRÊNCIAS
        // ======================================

        return res.status(200).json(ocorrencias);

    } catch (erro) {

        console.error(
            "Erro ao consultar ocorrências:",
            erro.message
        );

        return res.status(500).json({
            mensagem:
                "Erro ao consultar ocorrências."
        });

    }
});

// ==============================================
// EXPORTAR ROTAS
// ==============================================

module.exports = router;