/* ==========================================
   TECHFLOW OS
   EXCLUSÃO LÓGICA DE ORDENS DE SERVIÇO
   ========================================== */

const express = require("express");
const router = express.Router();

const conexao = require("../database/conexao");

// ==========================================
// VALIDAR ID
// ==========================================

function idValido(id) {
    return /^[1-9]\d*$/.test(String(id));
}

// ==========================================
// DELETE /api/ordens-servico/:id
// ==========================================

router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    // Apenas administradores podem excluir OS.
    if (
        !req.usuario ||
        req.usuario.perfil !== "administrador"
    ) {
        return res.status(403).json({
            mensagem:
                "Somente o administrador pode excluir uma Ordem de Serviço."
        });
    }

    // Validar identificador.
    if (!idValido(id)) {
        return res.status(400).json({
            mensagem: "ID da Ordem de Serviço inválido."
        });
    }

    let db;

    try {

        // Abrir conexão com o MySQL.
        db = await conexao.getConnection();

        // Iniciar transação.
        await db.beginTransaction();

        // Buscar e bloquear a OS durante a operação.
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

        // Verificar se a OS existe e não foi excluída.
        if (
            ordens.length === 0 ||
            ordens[0].excluidaEm !== null
        ) {
            await db.rollback();

            return res.status(404).json({
                mensagem:
                    "Ordem de Serviço não encontrada ou já excluída."
            });
        }

        const os = ordens[0];

        // ==========================================
        // REGRAS DE EXCLUSÃO
        // ==========================================

        // Não permitir exclusão de OS atribuídas.
        if (os.idTecnico !== null) {
            await db.rollback();

            return res.status(400).json({
                mensagem:
                    "Não é possível excluir uma OS que possui técnico atribuído."
            });
        }

        // Somente OS abertas ou canceladas.
        if (
            !["Aberta", "Cancelada"].includes(os.statusOS)
        ) {
            await db.rollback();

            return res.status(400).json({
                mensagem:
                    "Somente OS abertas ou canceladas podem ser excluídas."
            });
        }

        // ==========================================
        // EXCLUSÃO LÓGICA
        // ==========================================

        // Marcar data de exclusão, sem apagar o
        // registro ou seus relacionamentos.
        await db.execute(
            `UPDATE OrdensServico
             SET
                excluidaEm = NOW(),
                statusOS = 'Cancelada',
                dataCancelamento = COALESCE(
                    dataCancelamento,
                    NOW()
                ),
                justificativaCancelamento = COALESCE(
                    justificativaCancelamento,
                    'Exclusão lógica pelo administrador'
                )
             WHERE idOS = ?
               AND excluidaEm IS NULL`,
            [id]
        );

        // Registrar alteração no histórico,
        // caso a OS ainda não estivesse cancelada.
        if (os.statusOS !== "Cancelada") {

            await db.execute(
                `INSERT INTO HistoricoStatus
                    (
                        idOS,
                        statusAnterior,
                        statusNovo
                    )
                 VALUES (?, ?, ?)`,
                [
                    id,
                    os.statusOS,
                    "Cancelada"
                ]
            );

        }

        // Confirmar alterações no MySQL.
        await db.commit();

        // ==========================================
        // RESPOSTA DE SUCESSO
        // ==========================================

        return res.status(200).json({
            mensagem:
                "Ordem de Serviço excluída com sucesso!",
            idOS: Number(id),
            tipoExclusao: "logica"
        });

    } catch (erro) {

        // Desfazer alterações em caso de erro.
        if (db) {
            await db.rollback();
        }

        console.error(
            "Erro ao excluir Ordem de Serviço:",
            erro
        );

        return res.status(500).json({
            mensagem:
                "Erro interno ao excluir Ordem de Serviço."
        });

    } finally {

        // Liberar conexão MySQL.
        if (db) {
            db.release();
        }

    }

});

// ==========================================
// EXPORTAR ROTAS
// ==========================================

module.exports = router;