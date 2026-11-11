/*
=========================================
TECHFLOW - LOGIN E CADASTRO DO CLIENTE
=========================================

Cadastro:
- Salva o cliente no MySQL
- Não realiza login automático
- Limpa os formulários
- Retorna para a tela de login

Login:
- Valida e-mail e senha pela API
- Confere o perfil cliente
- Salva o token JWT
- Abre a página de solicitação
*/

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENTOS DA PÁGINA
    // =====================================

    const login = document.getElementById("formulario-login");
    const cadastro = document.getElementById("formulario-cadastro");

    const mensagemLogin = document.getElementById("mensagem-login");
    const mensagemCadastro = document.getElementById("mensagem-cadastro");

    const botaoLogin = document.getElementById("botao-login");
    const botaoCadastro = document.getElementById("botao-cadastro");


    // =====================================
    // COMUNICAÇÃO COM A API
    // =====================================

    async function solicitar(url, dados) {

        const resposta = await fetch(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        });

        const conteudo = await resposta.text();

        let resultado = {};

        try {

            resultado = conteudo
                ? JSON.parse(conteudo)
                : {};

        } catch {

            throw new Error(
                "Resposta inválida da API. Abra o TechFlow pela porta 3000."
            );

        }

        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                `Erro HTTP ${resposta.status}.`
            );

        }

        return resultado;
    }


    // =====================================
    // LOGIN DO CLIENTE
    // =====================================

    login.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const email = document
            .getElementById("email-login")
            .value.trim();

        const senha = document
            .getElementById("senha-login")
            .value;

        botaoLogin.disabled = true;

        mensagemLogin.textContent =
            "Verificando seus dados...";

        try {

            const dados = await solicitar(
                "/api/auth/login",
                {
                    email,
                    senha
                }
            );

            // Permitir somente clientes
            if (
                !dados.token ||
                !dados.usuario ||
                dados.usuario.perfil !== "cliente"
            ) {

                throw new Error(
                    "Esta área é exclusiva para clientes."
                );

            }

            // Salvar autenticação somente após login
            sessionStorage.setItem(
                "techflow_token",
                dados.token
            );

            sessionStorage.setItem(
                "techflow_usuario",
                JSON.stringify(dados.usuario)
            );

            // Abrir solicitação de serviços
            window.location.replace(
                "../techflow-solicitacao/index.html"
            );

        } catch (erro) {

            mensagemLogin.textContent = erro.message;

            console.error(
                "Erro no login do cliente:",
                erro
            );

        } finally {

            botaoLogin.disabled = false;

        }

    });


    // =====================================
    // CADASTRO DO CLIENTE
    // =====================================

    cadastro.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const nomeCompleto = document
            .getElementById("nome-cliente")
            .value.trim();

        const cpf = document
            .getElementById("cpf-cliente")
            .value.replace(/\D/g, "");

        const email = document
            .getElementById("email-cadastro")
            .value.trim();

        const telefone = document
            .getElementById("telefone-cliente")
            .value.trim();

        const endereco = document
            .getElementById("endereco-cliente")
            .value.trim();

        const senha = document
            .getElementById("senha-cadastro")
            .value;

        const confirmarSenha = document
            .getElementById("confirmar-senha")
            .value;


        // =====================================
        // VALIDAÇÕES
        // =====================================

        if (cpf.length !== 11) {

            mensagemCadastro.textContent =
                "Informe um CPF com 11 dígitos válidos.";

            return;
        }

        if (senha !== confirmarSenha) {

            mensagemCadastro.textContent =
                "As senhas não coincidem.";

            return;
        }


        // =====================================
        // ENVIAR CADASTRO
        // =====================================

        botaoCadastro.disabled = true;

        mensagemCadastro.textContent =
            "Criando sua conta...";

        try {

            await solicitar(
                "/api/clientes",
                {
                    nomeCompleto,
                    cpf,
                    email,
                    telefone,
                    endereco,
                    senha
                }
            );


            // =====================================
            // CADASTRO REALIZADO COM SUCESSO
            // =====================================

            // Limpar formulário de cadastro
            cadastro.reset();

            // Limpar formulário de login
            login.reset();

            // Garantir que e-mail fique vazio
            document.getElementById(
                "email-login"
            ).value = "";

            // Garantir que senha fique vazia
            document.getElementById(
                "senha-login"
            ).value = "";

            // Não fazer login automaticamente
            // Não criar sessão JWT no cadastro

            sessionStorage.removeItem(
                "techflow_token"
            );

            sessionStorage.removeItem(
                "techflow_usuario"
            );

            // Limpar mensagem antiga do cadastro
            mensagemCadastro.textContent = "";

            // Mostrar confirmação na tela de login
            mensagemLogin.textContent =
                "Conta criada com sucesso! Agora informe seu e-mail e senha para entrar.";

            // Retornar para o login
            window.location.hash = "area-entrar";

            // Posicionar cursor no e-mail
            document.getElementById(
                "email-login"
            ).focus();


        } catch (erro) {

            mensagemCadastro.textContent =
                erro.message;

            console.error(
                "Erro ao cadastrar cliente:",
                erro
            );

        } finally {

            botaoCadastro.disabled = false;

        }

    });

});