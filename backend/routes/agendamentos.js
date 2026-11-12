/* ==========================================
   TECHFLOW - AGENDAMENTOS
   Integração do calendário com o MySQL
   Proteção contra OS excluídas logicamente
   ========================================== */

const express = require("express");
const conexao = require("../database/conexao");

const router = express.Router();

// ==========================================
// VALIDAÇÕES
// ==========================================

const idValido = (id) =>
    /^[1-9]\d*$/.test(String(id)) &&
    Number.isSafeInteger(Number(id));

function dataValida(data) {

    if (
        typeof data !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data)
    ) {
        return false;
    }

    const [ano, mes, dia] = data.split("-").map(Number);

    const dataVerificada = new Date(
        Date.UTC(ano, mes - 1, dia)
    );

    return (
        dataVerificada.getUTCFullYear() === ano &&
        dataVerificada.getUTCMonth() === mes - 1 &&
        dataVerificada.getUTCDate() === dia
    );
}

function horaValida(hora) {

    return (
        typeof hora === "string" &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(hora)
    );
}

// ==========================================
// GET /api/agendamentos
// LISTAR AGENDAMENTOS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const usuario = req.usuario;

        if (
            !["administrador", "tecnico", "cliente"]
                .includes(usuario.perfil)
        ) {
            return res.status(403).json({
                mensagem: "Acesso não permitido."
            });
        }

        let sql = `
            SELECT
                ag.idAgendamento,
                ag.idOS,
                ag.dataAgendamento,
                ag.horaAgendamento,
                ag.observacao,
                ag.dataCadastro,

                os.statusOS,
                os.descricaoProblema,

                cliente.nomeCompleto AS nomeCliente,
                cliente.endereco AS enderecoCliente,

                equipamento.nomeEquipamento,
                equipamento.marca AS marcaEquipamento,
                equipamento.modelo AS modeloEquipamento,

                tecnico.nomeCompleto AS nomeTecnico

            FROM AgendamentosOS AS ag

            INNER JOIN OrdensServico AS os
                ON os.idOS = ag.idOS

            INNER JOIN Usuarios AS cliente
                ON cliente.idUsuario = os.idCliente

            INNER JOIN Equipamentos AS equipamento
                ON equipamento.idEquipamento = os.idEquipamento

            LEFT JOIN Usuarios AS tecnico
                ON tecnico.idUsuario = os.idTecnico

            WHERE os.excluidaEm IS NULL
        `;

        const parametros = [];

        // Técnico vê somente os agendamentos
        // das ordens atribuídas a ele.
        if (usuario.perfil === "tecnico") {

            sql += " AND os.idTecnico = ?";
            parametros.push(usuario.idUsuario);

        } else if (usuario.perfil === "cliente") {

            // Cliente vê somente seus agendamentos.
            sql += " AND os.idCliente = ?";
            parametros.push(usuario.idUsuario);
        }

        sql += `
            ORDER BY
                ag.dataAgendamento ASC,
                ag.horaAgendamento ASC,
                ag.idAgendamento ASC
        `;

        const [agendamentos] = await conexao.execute(
            sql,
            parametros
        );

        return res.json(agendamentos);

    } catch (erro) {

        console.error(
            "Erro ao listar agendamentos:",
            erro.message
        );

        return res.status(500).json({
            mensagem: "Erro ao consultar agendamentos."
        });
    }
});

// ==========================================
// POST /api/agendamentos
// CADASTRAR AGENDAMENTO
// ==========================================

router.post("/", async (req, res) => {

    // Apenas administradores podem agendar.
    if (req.usuario.perfil !== "administrador") {

        return res.status(403).json({
            mensagem:
                "Somente administradores podem agendar atendimentos."
        });
    }

    const {
        idOS,
        dataAgendamento,
        horaAgendamento,
        observacao
    } = req.body || {};

    // ======================================
    // VALIDAR DADOS
    // ======================================

    if (!idValido(idOS)) {

        return res.status(400).json({
            mensagem: "Informe uma OS válida."
        });
    }

    if (!dataValida(dataAgendamento)) {

        return res.status(400).json({
            mensagem:
                "Informe uma data válida no formato AAAA-MM-DD."
        });
    }

    if (!horaValida(horaAgendamento)) {

        return res.status(400).json({
            mensagem:
                "Informe um horário válido no formato HH:MM."
        });
    }

    if (
        observacao !== undefined &&
        observacao !== null &&
        (
            typeof observacao !== "string" ||
            observacao.length > 500
        )
    ) {

        return res.status(400).json({
            mensagem:
                "A observação deve ter no máximo 500 caracteres."
        });
    }

    // Impedir agendamentos em datas passadas.
    const dataHora = new Date(
        `${dataAgendamento}T${horaAgendamento}:00`
    );

    if (dataHora.getTime() <= Date.now()) {

        return res.status(400).json({
            mensagem:
                "O agendamento deve ter uma data e hora futuras."
        });
    }

    let db;

    try {

        db = await conexao.getConnection();
        await db.beginTransaction();

        // ======================================
        // VERIFICAR A OS NO MYSQL
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
            [idOS]
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
        // PROTEÇÃO DA EXCLUSÃO LÓGICA
        // ======================================

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
                    "Não é possível agendar uma OS finalizada."
            });
        }

        // ======================================
        // EXIGIR TÉCNICO RESPONSÁVEL
        // ======================================

        if (!os.idTecnico) {

            await db.rollback();

            return res.status(400).json({
                mensagem:
                    "Atribua um técnico antes de agendar."
            });
        }

        // ======================================
        // REGISTRAR AGENDAMENTO
        // ======================================

        const [resultado] = await db.execute(
            `INSERT INTO AgendamentosOS
                (
                    idOS,
                    dataAgendamento,
                    horaAgendamento,
                    observacao
                )
             VALUES (?, ?, ?, ?)`,
            [
                idOS,
                dataAgendamento,
                horaAgendamento,
                observacao?.trim() || null
            ]
        );

        await db.commit();

        return res.status(201).json({
            mensagem:
                "Agendamento cadastrado com sucesso!",
            idAgendamento: resultado.insertId,
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
            "Erro ao cadastrar agendamento:",
            erro.message
        );

        return res.status(500).json({
            mensagem:
                "Erro ao cadastrar agendamento."
        });

    } finally {

        if (db) {
            db.release();
        }
    }
});

// ==========================================
// EXPORTAR ROTAS
// ==========================================

module.exports = router;