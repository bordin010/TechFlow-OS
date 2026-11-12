/* ==========================================
   TECHFLOW OS
   ATRIBUIÇÃO DE TÉCNICOS
   COM PROTEÇÃO DE EXCLUSÃO LÓGICA
   ========================================== */

const express = require("express");
const router = express.Router();

const conexao = require("../database/conexao");
const verificarToken = require("../middlewares/verificarToken");
const verificarPerfil = require("../middlewares/verificarPerfil");

// ==========================================
// ATRIBUIR TÉCNICO A UMA ORDEM DE SERVIÇO
// PATCH /api/ordens-servico/:id/atribuir
// ==========================================

router.patch(
    "/:id/atribuir",
    verificarToken,
    verificarPerfil("administrador"),
    async (req, res) => {

        const { id } = req.params;
        const { idTecnico } = req.body || {};

        // ======================================
        // VALIDAR OS IDENTIFICADORES
        // ======================================

        const idValido = (valor) => {
            return (
                /^[1-9]\d*$/.test(String(valor)) &&
                Number.isSafeInteger(Number(valor))
            );
        };

        if (
            !idValido(id) ||
            !idValido(idTecnico)
        ) {
            return res.status(400).json({
                mensagem:
                    "Informe IDs válidos para a OS e o técnico."
            });
        }

        let db;

        try {

            db = await conexao.getConnection();
            await db.beginTransaction();

            // ======================================
            // VERIFICAR A ORDEM DE SERVIÇO
            // ======================================

            const [ordens] = await db.execute(
                `SELECT
                    idOS,
                    idTecnico,
                    statusOS,
                    excluidaEm
                 FROM OrdensServico
                 WHERE idOS = ?
                 FOR UPDATE`,
                [id]
            );

            if (ordens.length === 0) {

                await db.rollback();

                return res.status(404).json({
                    mensagem:
                        "Ordem de Serviço não encontrada."
                });
            }

            const os = ordens[0];

            // ======================================
            // PROTEÇÃO DE EXCLUSÃO LÓGICA
            // ======================================

            // Não permitir atribuição caso a OS
            // tenha sido excluída logicamente.

            if (os.excluidaEm !== null) {

                await db.rollback();

                return res.status(404).json({
                    mensagem:
                        "Ordem de Serviço não encontrada."
                });
            }

            // ======================================
            // VERIFICAR STATUS DA OS
            // ======================================

            if (
                ["Concluída", "Cancelada"].includes(
                    os.statusOS
                )
            ) {

                await db.rollback();

                return res.status(400).json({
                    mensagem:
                        "Não é possível atribuir técnico a uma OS finalizada."
                });
            }

            // ======================================
            // VERIFICAR O TÉCNICO
            // ======================================

            const [tecnicos] = await db.execute(
                `SELECT idUsuario
                 FROM Usuarios
                 WHERE idUsuario = ?
                   AND perfil = 'tecnico'
                   AND ativo = 1`,
                [idTecnico]
            );

            if (tecnicos.length === 0) {

                await db.rollback();

                return res.status(400).json({
                    mensagem:
                        "Técnico não encontrado ou inativo."
                });
            }

            // ======================================
            // IMPEDIR ATRIBUIÇÃO REPETIDA
            // ======================================

            if (
                Number(os.idTecnico) ===
                Number(idTecnico)
            ) {

                await db.rollback();

                return res.status(400).json({
                    mensagem:
                        "Este técnico já está atribuído à OS."
                });
            }

            // ======================================
            // ATUALIZAR TÉCNICO RESPONSÁVEL
            // ======================================

            await db.execute(
                `UPDATE OrdensServico
                 SET idTecnico = ?
                 WHERE idOS = ?
                   AND excluidaEm IS NULL`,
                [idTecnico, id]
            );

            // ======================================
            // REGISTRAR HISTÓRICO
            // ======================================

            await db.execute(
                `INSERT INTO HistoricoAtribuicoes
                    (
                        idOS,
                        idTecnico
                    )
                 VALUES (?, ?)`,
                [id, idTecnico]
            );

            // ======================================
            // CONFIRMAR TRANSAÇÃO
            // ======================================

            await db.commit();

            return res.status(200).json({
                mensagem:
                    "Técnico atribuído com sucesso!",
                idOS: Number(id),
                idTecnico: Number(idTecnico)
            });

        } catch (erro) {

            if (db) {
                await db.rollback();
            }

            console.error(
                "Erro ao atribuir técnico:",
                erro
            );

            return res.status(500).json({
                mensagem:
                    "Erro ao atribuir técnico à Ordem de Serviço."
            });

        } finally {

            if (db) {
                db.release();
            }

        }
    }
);

// ==========================================
// EXPORTAR ROTAS
// ==========================================

module.exports = router;