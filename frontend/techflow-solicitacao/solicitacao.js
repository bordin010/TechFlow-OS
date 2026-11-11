// Área do cliente: autenticação, equipamentos e solicitações reais da API.
document.addEventListener("DOMContentLoaded", async () => {
    const loginUrl = "../techflow-Login-cliente/index.html";
    const token = sessionStorage.getItem("techflow_token");
    const formulario = document.getElementById("formulario-servico");
    const mensagem = document.getElementById("mensagem-formulario");
    const botao = document.getElementById("botao-finalizar");
    const seletorEquipamentos = document.getElementById("equipamento-existente");
    const areaNovoEquipamento = document.getElementById("dados-novo-equipamento");
    const listaOrdens = document.getElementById("lista-ordens-cliente");
    const resumo = document.getElementById("resumo-pedido");
    let usuario;
    let equipamentos = [];
    let categorias = [];
    let servicos = [];

    function sair() {
        sessionStorage.removeItem("techflow_token");
        sessionStorage.removeItem("techflow_usuario");
        window.location.replace(loginUrl);
    }

    if (!token) { sair(); return; }

    async function api(caminho, opcoes = {}) {
        const resposta = await fetch(caminho, {
            ...opcoes,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
                ...(opcoes.headers || {})
            },
            cache: "no-store"
        });
        const corpo = await resposta.text();
        let dados = {};
        try { dados = corpo ? JSON.parse(corpo) : {}; }
        catch { throw new Error("Resposta inválida do servidor. Acesse a aplicação pela porta 3000."); }
        if (resposta.status === 401 || resposta.status === 403) {
            // Sessão inválida/desativada (a API deve confirmar o perfil, não só o navegador).
            sair();
            throw new Error("Sessão encerrada. Faça login novamente.");
        }
        if (!resposta.ok) throw new Error(dados.mensagem || `Erro HTTP ${resposta.status}.`);
        return dados;
    }

    function valor(id) { return document.getElementById(id).value.trim(); }
    function radio(nome) { return document.querySelector(`[name="${nome}"]:checked`)?.value; }
    function formatarData(data) {
        if (!data) return "Não informada";
        const trecho = String(data).slice(0, 10);
        const [ano, mes, dia] = trecho.split("-");
        return ano && mes && dia ? `${dia}/${mes}/${ano}` : trecho;
    }
    function textoSeguro(elemento, conteudo) { elemento.textContent = String(conteudo ?? ""); }

    function atualizarResumo() {
        const equip = equipamentos.find(e => String(e.idEquipamento) === seletorEquipamentos.value);
        textoSeguro(document.getElementById("resumo-modelo"), equip
            ? `${equip.nomeEquipamento} · ${equip.marca} ${equip.modelo}`
            : [valor("equipamento"), valor("marca"), valor("modelo")].filter(Boolean).join(" · ") || "Preencha os dados do equipamento");
        const partes = resumo.querySelectorAll(".detalhes-resumo dd");
        if (partes[2]) textoSeguro(partes[2], `${formatarData(valor("data"))} · ${valor("periodo") || "Período não escolhido"}`);
        if (partes[3]) textoSeguro(partes[3], `${valor("nome")} · ${valor("telefone")}`);
    }

    function alternarEquipamento() {
        const novo = !seletorEquipamentos.value;
        areaNovoEquipamento.hidden = !novo;
        areaNovoEquipamento.querySelectorAll("input").forEach(input => { input.required = novo; });
        const selecionado = equipamentos.find(e => String(e.idEquipamento) === seletorEquipamentos.value);
        if (selecionado) {
            const opcao = document.querySelector(`[name="categoria"][value="${selecionado.idCategoria}"]`);
            if (opcao) opcao.checked = true;
        }
        atualizarResumo();
    }

    function montarEquipamentos() {
        seletorEquipamentos.replaceChildren(new Option("Cadastrar novo equipamento", ""));
        for (const item of equipamentos.filter(e => Number(e.ativo) === 1)) {
            const opcao = new Option(`${item.nomeEquipamento} — ${item.marca} ${item.modelo}`, item.idEquipamento);
            seletorEquipamentos.add(opcao);
        }
        alternarEquipamento();
    }

    function mapearServicos() {
        const correspondencia = {
            diagnostico: "diagnóstic",
            manutencao: "manuten",
            tela: "tela"
        };
        document.querySelectorAll('[name="servico"]').forEach(input => {
            const termo = correspondencia[input.value];
            const existe = servicos.find(s => s.nomeServico?.toLocaleLowerCase("pt-BR").includes(termo));
            input.dataset.idServico = existe?.idTipoServico || "";
            input.disabled = !existe;
            const rotulo = input.closest("label");
            if (rotulo) rotulo.style.opacity = existe ? "1" : ".5";
        });
        if (!document.querySelector('[name="servico"]:checked:not(:disabled)')) {
            const primeira = document.querySelector('[name="servico"]:not(:disabled)');
            if (primeira) primeira.checked = true;
        }
    }

    async function carregarOrdens() {
        textoSeguro(listaOrdens, "Carregando atendimentos...");
        try {
            const ordens = await api("/api/ordens-servico");
            listaOrdens.replaceChildren();
            if (!ordens.length) { textoSeguro(listaOrdens, "Você ainda não tem Ordens de Serviço cadastradas."); return; }
            for (const os of ordens) {
                const cartao = document.createElement("article");
                cartao.className = "ordem-cliente";
                const titulo = document.createElement("strong");
                textoSeguro(titulo, `OS #${os.idOS} — ${os.statusOS}`);
                const nome = document.createElement("p");
                textoSeguro(nome, `Equipamento: ${os.nomeEquipamento || "Não informado"} (${os.marcaEquipamento || ""} ${os.modeloEquipamento || ""})`);
                const data = document.createElement("p");
                textoSeguro(data, `Aberta em: ${os.dataAbertura ? new Date(os.dataAbertura).toLocaleString("pt-BR") : "Não informado"}`);
                const descricao = document.createElement("p");
                textoSeguro(descricao, `Problema: ${os.descricaoProblema || ""}`);
                cartao.append(titulo, nome, data, descricao);
                listaOrdens.append(cartao);
            }
        } catch (erro) { textoSeguro(listaOrdens, erro.message); }
    }

    // A sessão deve ser validada antes de permitir operações.
    try {
        const sessao = await api("/api/auth/sessao");
        if (sessao.usuario?.perfil !== "cliente") { sair(); return; }
        usuario = (await api("/api/auth/perfil")).usuario;
        if (!usuario || usuario.perfil !== "cliente") { sair(); return; }
        document.getElementById("nome").value = usuario.nomeCompleto || "";
        document.getElementById("telefone").value = usuario.telefone || "";
        document.getElementById("email").value = usuario.email || "";
        document.getElementById("endereco").value = usuario.endereco || "";
        // Os dados de contato são provenientes da conta, não podem ser usados para trocar o dono da OS.
        for (const id of ["nome", "telefone", "email"]) {
            document.getElementById(id).readOnly = true;
        }
        [categorias, servicos, equipamentos] = await Promise.all([
            api("/api/categorias"),
            api("/api/tipos-servico"),
            api("/api/equipamentos")
        ]);
        const informat = categorias.find(c => /informática|informatica/i.test(c.nomeCategoria));
        const celular = categorias.find(c => /celular|smartphone/i.test(c.nomeCategoria));
        const radiosCategoria = document.querySelectorAll('[name="categoria"]');
        if (radiosCategoria[0]) {
            radiosCategoria[0].value = informat?.idCategoria || "";
            radiosCategoria[0].disabled = !informat;
        }
        if (radiosCategoria[1]) {
            radiosCategoria[1].value = celular?.idCategoria || "";
            radiosCategoria[1].disabled = !celular;
        }
        if (!document.querySelector('[name="categoria"]:checked:not(:disabled)')) {
            const primeira = document.querySelector('[name="categoria"]:not(:disabled)');
            if (primeira) primeira.checked = true;
        }
        mapearServicos();
        montarEquipamentos();
        await carregarOrdens();
    } catch (erro) {
        mensagem.textContent = erro.message;
        botao.disabled = true;
        return;
    }

    document.getElementById("data").min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    seletorEquipamentos.addEventListener("change", alternarEquipamento);
    formulario.addEventListener("input", atualizarResumo);
    formulario.addEventListener("change", () => {
        document.getElementById("endereco").required = radio("modalidade") === "domicilio";
        atualizarResumo();
    });
    document.getElementById("atualizar-ordens").addEventListener("click", carregarOrdens);
    document.getElementById("sair-cliente").addEventListener("click", sair);
    document.getElementById("enviar-resumo").addEventListener("click", () => {
        formulario.requestSubmit();
    });

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        if (!formulario.reportValidity()) return;
        const servico = document.querySelector('[name="servico"]:checked');
        if (!servico?.dataset.idServico) {
            mensagem.textContent = "Serviço indisponível. Confira os tipos de serviço cadastrados.";
            return;
        }
        const categoriaSelecionada = Number(radio("categoria"));
        if (!categorias.some(c => Number(c.idCategoria) === categoriaSelecionada)) {
            mensagem.textContent = "Categoria não encontrada. Atualize a página.";
            return;
        }
        if (radio("modalidade") === "domicilio" && !valor("endereco")) {
            mensagem.textContent = "Informe o endereço de atendimento.";
            return;
        }
        const data = valor("data");
        if (data < document.getElementById("data").min) {
            mensagem.textContent = "Escolha uma data de preferência válida.";
            return;
        }
        botao.disabled = true;
        document.getElementById("enviar-resumo").disabled = true;
        mensagem.textContent = "Registrando sua solicitação...";
        try {
            let idEquipamento = Number(seletorEquipamentos.value);
            if (!idEquipamento) {
                const nomeEquipamento = valor("equipamento");
                const marca = valor("marca");
                const modelo = valor("modelo");
                const existente = equipamentos.find(e => Number(e.ativo) === 1 &&
                    Number(e.idCategoria) === categoriaSelecionada &&
                    e.nomeEquipamento?.toLocaleLowerCase() === nomeEquipamento.toLocaleLowerCase() &&
                    e.marca?.toLocaleLowerCase() === marca.toLocaleLowerCase() &&
                    e.modelo?.toLocaleLowerCase() === modelo.toLocaleLowerCase());
                if (existente) {
                    idEquipamento = Number(existente.idEquipamento);
                } else {
                    const cadastrado = await api("/api/equipamentos", {
                        method: "POST", body: JSON.stringify({ idCategoria: categoriaSelecionada, nomeEquipamento, marca, modelo })
                    });
                    idEquipamento = Number(cadastrado.idEquipamento);
                    equipamentos = await api("/api/equipamentos");
                    montarEquipamentos();
                    seletorEquipamentos.value = String(idEquipamento);
                    alternarEquipamento();
                }
            }
            const modalidade = radio("modalidade") === "domicilio" ? "Em domicílio" : "Na assistência";
            // Preferências NÃO são agendamento confirmado; o administrador fará a confirmação.
            const descricaoProblema = `${valor("problema")}\n\nPreferência de atendimento (a confirmar): ${modalidade}; ${formatarData(data)}; ${valor("periodo")}.` +
                (modalidade === "Em domicílio" ? `\nEndereço solicitado: ${valor("endereco")}.` : "");
            const ordem = await api("/api/ordens-servico", {
                method: "POST",
                body: JSON.stringify({
                    idCliente: usuario.idUsuario,
                    idEquipamento,
                    idTipoServico: Number(servico.dataset.idServico),
                    descricaoProblema
                })
            });
            mensagem.textContent = `Solicitação registrada com sucesso! Protocolo OS #${ordem.idOS}.`;
            textoSeguro(document.getElementById("protocolo-criado"), `Guarde o protocolo: OS #${ordem.idOS}`);
            document.getElementById("problema").value = "";
            document.getElementById("confirmacao").checked = false;
            await carregarOrdens();
            document.getElementById("protocolo-criado").scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (erro) {
            mensagem.textContent = `Não foi possível concluir a solicitação: ${erro.message}`;
        } finally {
            botao.disabled = false;
            document.getElementById("enviar-resumo").disabled = false;
        }
    });
    atualizarResumo();
});
