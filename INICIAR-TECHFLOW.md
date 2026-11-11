# TechFlow OS — como executar

Esta versão mantém o layout HTML/CSS original e integra **cliente, administrador e técnico** com a mesma API Node.js/Express + MySQL.

## 1. Banco de dados

- Se o banco `techflow` **já existe e tem dados**, **não importe** `banco-de-dados/techflow.sql`, pois ele contém instruções `DROP TABLE` que apagariam seus registros.
- Se estiver criando uma instalação **nova**, crie o banco `techflow` no MySQL Workbench (`CREATE DATABASE IF NOT EXISTS techflow CHARACTER SET utf8mb4;`), selecione-o e importe `banco-de-dados/techflow.sql` (**somente estrutura**). Depois execute `banco-de-dados/dados-iniciais.sql` para cadastrar categorias e serviços.
- Para instalações já existentes, `dados-iniciais.sql` pode incluir itens faltantes sem duplicar nomes; antes, confira se os cadastros e status estão corretos.
- O SQL do ZIP é estrutura, **não contém usuários, senhas nem registros**. Em um banco novo, crie a primeira conta de cliente pelo cadastro público. Técnicos e administradores devem ser provisionados por um administrador autorizado, usando seu fluxo de administração existente.

## 2. Configurar Node.js

Abra o terminal na pasta `backend` e execute:

```cmd
npm install
```

Copie `backend/.env.example` para `backend/.env` e substitua os valores de exemplo pela senha **local** do MySQL e uma chave JWT segura (mínimo 32 caracteres). Gere uma chave no terminal com:

```cmd
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Depois execute:

```cmd
node server.js
```

Deixe o terminal aberto. Use as páginas **exclusivamente pela porta 3000**:

- Principal: `http://localhost:3000/frontend/tela-principal/index.html`
- Login de cliente: `http://localhost:3000/frontend/techflow-Login-cliente/index.html`
- Login da equipe: `http://localhost:3000/frontend/tela-login/index.html`

**Não abra pelo Live Server na porta 5500**: ele não disponibiliza `/api`, e o cadastro/login não funcionará.

## 3. Fluxo do cliente

1. Abra o **Login do cliente** e clique em **Cadastre-se**.
2. Preencha nome, CPF válido, e-mail, telefone, endereço e senha.
3. O sistema mostra **Conta criada com sucesso! Agora faça login...**. Não é realizado login automático.
4. Entre com e-mail e senha; a API valida a conta e a página de solicitação é aberta.
5. Na solicitação, escolha a categoria, o tipo de serviço, um equipamento já cadastrado ou um novo, informe o defeito e a preferência de atendimento.
6. O sistema cria a ordem de serviço no MySQL, mostra o número do protocolo e lista as OS do cliente com seus status.
7. A preferência de data/período é registrada na descrição da OS **como solicitação a confirmar**. Ela não se torna automaticamente um agendamento confirmado.

## 4. Fluxo da equipe

O login da equipe continua separado. O painel administrativo mantém o cadastro e a atribuição de OS, e o painel do técnico mantém seus scripts de perfil, ocorrências, calendário e logística.

## 5. Testes e observações

```cmd
cd backend
npm test
```

Esses testes verificam rotas e proteção HTTP, mas **não substituem um teste de ponta a ponta com MySQL e contas de teste**. Este ZIP foi validado estaticamente; o banco do seu computador não está acessível neste ambiente.

Se o cadastro retornar “CPF ou e-mail já cadastrado”, use uma conta existente ou verifique seu banco. Não exclua usuários com OS/equipamentos relacionados sem conferir as dependências.

### Segurança

Nunca compartilhe `backend/.env`, tokens JWT, senhas ou CPF real. `node_modules/` e `.env` estão ignorados pelo Git. O acesso às rotas privadas segue protegido pela API, independentemente das verificações do frontend.
