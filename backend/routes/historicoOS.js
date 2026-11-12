/* ==============================================
   TECHFLOW OS
   HISTÓRICO DAS ORDENS DE SERVIÇO

   Consulta de alterações de status
   Proteção contra exclusão lógica
   ============================================== */

const express = require("express");
const conexao = require("../database/conexao");

const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

// ==============================================
// AUTENTICAÇÃO
// ==============================================

// Todas as consultas exigem autenticação JWT.
router.use(verificarToken);

// ==============================================
// VALIDAÇÕES
// ==============================================

function idValido(id) {
    return (
        /^[1-9]\d*$/.test(String(id)) &&
        Number.isSafeInteger(Number(id))
    );
}

// ==============================================
// VERIFICAR PERMISSÃO DE CONSULTA
// ==============================================

function podeConsultarHistorico(os, usuario) {

    // Administrador consulta qualquer OS
    // que não tenha sido excluída.
    if (usuario.perfil === "administrador") {
        return true;
    }

    // Cliente consulta somente suas OS.
    if (
        usuario.perfil === "cliente" &&
        Number(os.idCliente) === Number(usuario.idUsuario)
    ) {
        return true;
    }

    // Técnico consulta somente OS atribuídas.
    if (
        usuario.perfil === "tecnico" &&
        os.idTecnico !== null &&
        Number(os.idTecnico) === Number(usuario.idUsuario)
    ) {
        return true;
    }

    return false;
}

// ==============================================
// GET /api/ordens-servico/:id/historico
// CONSULTAR HISTÓRICO DA OS
// ==============================================

router.get("/:id/historico", async (req, res) => {

    const { id } = req.params;
    const usuario = req.usuario;

    // ======================================
    // VALIDAR ID DA OS
    // ======================================

    if (!idValido(id)) {

        return res.status(400).json({
            mensagem: "ID da OS inválido."
        });
    }

    try {

        // ======================================
        // VERIFICAR A ORDEM DE SERVIÇO
        // ======================================

        const [ordens] = await conexao.execute(
            `SELECT
                idOS,
                idCliente,
                idTecnico,
                excluidaEm

             FROM OrdensServico

             WHERE idOS = ?`,
            [id]
        );

        // ======================================
        // PROTEÇÃO DE EXCLUSÃO LÓGICA
        // ======================================

        // OS inexistentes ou excluídas
        // não podem ter o histórico consultado
        // pela API normal.
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

        if (!podeConsultarHistorico(os, usuario)) {

            return res.status(403).json({
                mensagem:
                    "Você não tem permissão para consultar o histórico desta OS."
            });
        }

        // ======================================
        // CONSULTAR HISTÓRICO NO MYSQL
        // ======================================

        const [historico] = await conexao.execute(
            `SELECT
                idHistorico,
                idOS,
                statusAnterior,
                statusNovo,
                dataAlteracao

             FROM HistoricoStatus

             WHERE idOS = ?

             ORDER BY
                dataAlteracao ASC,
                idHistorico ASC`,
            [id]
        );

        // ======================================
        // RESPOSTA DE SUCESSO
        // ======================================

        return res.status(200).json(historico);

    } catch (erro) {

        console.error(
            "Erro ao consultar histórico da OS:",
            erro.message
        );

        return res.status(500).json({
            mensagem:
                "Erro ao consultar histórico da Ordem de Serviço."
        });
    }
});

// ==============================================
// EXPORTAR ROTAS
// ==============================================

module.exports = router;