# TechFlow — Documentação da API REST

**Projeto:** TechFlow OS — Sistema de Gerenciamento de Ordens de Serviço  
**Versão da API:** 1.0  
**Etapa:** Sprint 2 — Implementação Funcional  
**Tecnologias:** Node.js, Express, MySQL, BCrypt e JWT  
**Formato de comunicação:** JSON  
**Protocolo:** HTTP

---

## 1. Apresentação

O **TechFlow OS** é um sistema web desenvolvido para auxiliar no gerenciamento de uma assistência técnica especializada em computadores e celulares.

A aplicação permite cadastrar clientes, técnicos, equipamentos e Ordens de Serviço (OS), além de acompanhar o andamento dos atendimentos, registrar diagnósticos e soluções e preservar o histórico das operações.

O sistema possui três perfis de acesso:

- **Administrador:** gerencia os cadastros, os técnicos e as Ordens de Serviço.
- **Técnico:** realiza os atendimentos atribuídos a ele e registra diagnósticos e soluções.
- **Cliente:** solicita serviços e acompanha suas próprias Ordens de Serviço.

O projeto utiliza uma API REST desenvolvida com Node.js e Express, integrada a um banco de dados MySQL.

O front-end utiliza HTML5, CSS3 e JavaScript para consumir a API e apresentar as informações aos usuários.

---

## 2. Organização do projeto

A estrutura principal está dividida em três diretórios:

- `frontend/`: páginas HTML, estilos CSS e scripts JavaScript.
- `backend/`: servidor, API REST, autenticação, validações e conexão com o banco.
- `banco-de-dados/`: scripts SQL para criação da estrutura e preparação dos dados.

### 2.1. Estrutura principal do back-end

```text
backend/
├── database/
│   └── conexao.js
│
├── middlewares/
│   ├── verificarToken.js
│   └── verificarPerfil.js
│
├── routes/
│   ├── agendamentos.js
│   ├── atribuicoes.js
│   ├── autenticacao.js
│   ├── categorias.js
│   ├── clientes.js
│   ├── equipamentos.js
│   ├── exclusaoOS.js
│   ├── historicoOS.js
│   ├── ocorrencias.js
│   ├── ordensServico.js
│   ├── tecnicos.js
│   └── tiposServico.js
│
├── scripts/
│   └── criar-admin-inicial.js
│
├── tests/
│   ├── autenticacao.test.js
│   ├── permissoes.test.js
│   ├── server.test.js
│   ├── tokenExpirado.test.js
│   └── usuarioDesativado.test.js
│
├── utils/
│   └── validacoes.js
│
├── .env.example
├── API.md
├── package.json
├── package-lock.json
└── server.js
```

O arquivo `server.js` inicializa o Express e registra os módulos de rotas da API.

O arquivo `database/conexao.js` estabelece a comunicação com o MySQL.

Os middlewares verificam os tokens JWT e as permissões dos usuários.

O arquivo `exclusaoOS.js` implementa a exclusão lógica das Ordens de Serviço e é integrado ao módulo de rotas de OS.

---

## 3. Configuração do ambiente

### 3.1. Requisitos

Para executar o projeto, são necessários:

- Node.js e npm.
- MySQL.
- Navegador web.
- Editor de código, como Visual Studio Code.
- Git, para controle de versões.

### 3.2. Instalar dependências

Abra o terminal na pasta `backend` e execute:

```bash
npm install
```

Esse comando instala as dependências informadas no arquivo `package.json`.

### 3.3. Configurar variáveis de ambiente

Crie o arquivo `.env` na pasta `backend`, utilizando o arquivo `.env.example` como referência.

Exemplo de configuração:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SENHA_DO_MYSQL
DB_NAME=techflow

JWT_SECRET=SUBSTITUA_POR_UMA_CHAVE_ALEATORIA_COM_32_CARACTERES_OU_MAIS
```

As principais variáveis são:

| Variável | Descrição |
|---|---|
| `PORT` | Porta utilizada pelo servidor Express |
| `DB_HOST` | Endereço do servidor MySQL |
| `DB_PORT` | Porta do MySQL |
| `DB_USER` | Usuário de conexão com o banco |
| `DB_PASSWORD` | Senha do usuário MySQL |
| `DB_NAME` | Nome do banco de dados |
| `JWT_SECRET` | Chave utilizada para assinar tokens JWT |

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

Nunca publique senhas, tokens JWT reais ou chaves de autenticação.

### 3.4. Preparar o banco de dados

Na pasta `banco-de-dados/`, utilize o arquivo:

```text
techflow.sql
```

Abra o MySQL Workbench e execute o script em um ambiente de instalação novo.

Confira os dados iniciais necessários ao funcionamento da aplicação.

**Atenção:** scripts que recriam tabelas podem apagar informações existentes. Não execute scripts de recriação sobre um banco de dados com informações importantes sem realizar um backup.

### 3.5. Criar o administrador inicial

Depois de configurar a conexão com o MySQL, abra um terminal na pasta `backend` e execute:

```bash
node scripts/criar-admin-inicial.js
```

O script solicita as informações necessárias ao cadastro do primeiro administrador e gera uma senha inicial.

Essa senha deve ser guardada em local seguro.

O script também verifica a existência de um administrador, impedindo a repetição do cadastro inicial quando já existe um administrador no banco.

### 3.6. Iniciar o servidor

Na pasta `backend`, execute:

```bash
node server.js
```

Por padrão, o servidor estará disponível em:

```text
http://localhost:3000
```

Para consultar a rota inicial:

```http
GET http://localhost:3000/
```

Exemplo de resposta:

```json
{
  "mensagem": "API do TechFlow funcionando!"
}
```

As interfaces são disponibilizadas pelo Express através do caminho `/frontend`.

**Não utilize o Live Server na porta 5500 para testar as requisições à API.**

---

## 4. Banco de dados

O TechFlow utiliza MySQL para armazenar permanentemente as informações do sistema.

### 4.1. Tabelas principais

| Tabela | Finalidade |
|---|---|
| `Usuarios` | Clientes, técnicos e administradores |
| `Equipamentos` | Equipamentos cadastrados |
| `Categorias` | Categorias de equipamentos |
| `TiposServico` | Tipos de serviços oferecidos |
| `OrdensServico` | Registros dos atendimentos |
| `HistoricoAtribuicoes` | Histórico dos técnicos atribuídos |
| `HistoricoStatus` | Histórico de alterações de status |
| `OcorrenciasOS` | Ocorrências relacionadas aos atendimentos |
| `AgendamentosOS` | Agendamentos dos serviços |

### 4.2. Relacionamentos

O banco permite representar os seguintes relacionamentos:

- Um cliente pode possuir vários equipamentos.
- Um cliente pode abrir várias Ordens de Serviço.
- Cada equipamento pertence a um cliente.
- Uma OS está vinculada a cliente, equipamento e tipo de serviço.
- Uma OS pode ser atribuída a um técnico.
- Uma OS pode possuir registros de histórico, ocorrências e agendamentos.

A persistência é realizada por consultas SQL executadas pelo back-end com o módulo `mysql2`.

### 4.3. Exclusão lógica das Ordens de Serviço

A tabela `OrdensServico` possui o campo:

```sql
excluidaEm DATETIME NULL DEFAULT NULL
```

Seu funcionamento é:

- `NULL`: Ordem de Serviço não excluída.
- Data e hora preenchidas: Ordem de Serviço excluída logicamente.

Os registros excluídos permanecem no MySQL, preservando os relacionamentos e o histórico, mas deixam de aparecer nas consultas normais da API.

---

## 5. Autenticação e autorização

A API utiliza **JWT (JSON Web Token)** para autenticar usuários e controlar o acesso às funcionalidades.

Após o login, o sistema gera um token que deve ser enviado nas requisições protegidas.

### 5.1. Cabeçalho de autenticação

```http
Authorization: Bearer SEU_TOKEN_JWT
```

### 5.2. Perfis disponíveis

| Perfil | Permissões principais |
|---|---|
| `administrador` | Gerenciamento geral do sistema |
| `tecnico` | Atendimento das OS atribuídas |
| `cliente` | Cadastro e acompanhamento dos próprios serviços |

### 5.3. Realizar login

**Método:** `POST`

**Endpoint:**

```http
POST /api/auth/login
```

**Autenticação:** Pública.

Exemplo de requisição:

```json
{
  "email": "usuario@exemplo.com",
  "senha": "SenhaDeExemplo123"
}
```

Exemplo de resposta HTTP 200:

```json
{
  "mensagem": "Login realizado com sucesso!",
  "token": "TOKEN_JWT_GERADO",
  "usuario": {
    "idUsuario": 3,
    "nomeCompleto": "Cliente Exemplo",
    "email": "usuario@exemplo.com",
    "perfil": "cliente"
  }
}
```

Os valores apresentados são ilustrativos.

### 5.4. Consultar sessão

```http
GET /api/auth/sessao
```

**Autenticação:** Obrigatória.

Exemplo de resposta HTTP 200:

```json
{
  "mensagem": "Sessão válida.",
  "usuario": {
    "idUsuario": 3,
    "nomeCompleto": "Cliente Exemplo",
    "perfil": "cliente"
  }
}
```

A estrutura exata do objeto `usuario` depende das informações retornadas pelo módulo de autenticação.

### 5.5. Regras de segurança

O sistema implementa:

- Senhas protegidas com BCrypt.
- Autenticação por JWT.
- Verificação de perfil do usuário.
- Bloqueio de acesso a recursos não autorizados.
- Controle de tentativas de login.
- Tratamento de tokens inválidos ou expirados.
- Restrição de acesso para usuários desativados.
- Consultas SQL parametrizadas.
- Validação de campos recebidos pela API.

As senhas não são retornadas nos endpoints de consulta de clientes e técnicos.

---

## 6. CRUD de clientes

**Endpoint base:**

```text
/api/clientes
```

### 6.1. Operações disponíveis

| Método | Endpoint | Descrição | Permissão |
|---|---|---|---|
| GET | `/api/clientes` | Listar clientes | Administrador |
| GET | `/api/clientes/:id` | Consultar cliente | Administrador ou proprietário |
| POST | `/api/clientes` | Cadastrar cliente | Público |
| PUT | `/api/clientes/:id` | Atualizar cliente | Administrador ou proprietário |
| PATCH | `/api/clientes/:id/desativar` | Desativar cliente | Administrador |
| PATCH | `/api/clientes/:id/reativar` | Reativar cliente | Administrador |

O parâmetro `:id` representa o identificador numérico do cliente.

### 6.2. Cadastrar cliente

```http
POST /api/clientes
```

Corpo da requisição:

```json
{
  "nomeCompleto": "Cliente Exemplo",
  "cpf": "CPF_VALIDO_NAO_CADASTRADO",
  "email": "cliente@exemplo.com",
  "telefone": "11999999999",
  "endereco": "Endereço de exemplo",
  "senha": "SenhaForte123"
}
```

Resposta HTTP 201:

```json
{
  "mensagem": "Cliente cadastrado com sucesso!",
  "idCliente": 8
}
```

O identificador apresentado é ilustrativo. Para realizar uma requisição real, substitua o CPF de exemplo por um CPF matematicamente válido e ainda não cadastrado.

### 6.3. Atualizar cliente

```http
PUT /api/clientes/8
```

Corpo:

```json
{
  "nomeCompleto": "Cliente Exemplo Atualizado",
  "email": "clienteatualizado@exemplo.com",
  "telefone": "11988888888",
  "endereco": "Novo endereço"
}
```

Resposta HTTP 200:

```json
{
  "mensagem": "Cliente atualizado com sucesso!"
}
```

### 6.4. Desativar cliente

```http
PATCH /api/clientes/8/desativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Cliente desativado com sucesso!"
}
```

### 6.5. Reativar cliente

```http
PATCH /api/clientes/8/reativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Cliente reativado com sucesso!"
}
```

### 6.6. Regras de negócio

- CPF válido é obrigatório.
- E-mail válido é obrigatório.
- CPF e e-mail não podem estar duplicados.
- A senha deve atender às regras de validação.
- A senha é armazenada com BCrypt.
- O perfil do usuário é definido como `cliente`.
- Clientes não podem consultar os cadastros de outros clientes.
- A desativação preserva o registro no MySQL.

---

## 7. CRUD de técnicos

**Endpoint base:**

```text
/api/tecnicos
```

Todas as operações exigem autenticação com perfil de administrador.

### 7.1. Operações disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/tecnicos` | Listar técnicos |
| GET | `/api/tecnicos/:id` | Consultar técnico |
| POST | `/api/tecnicos` | Cadastrar técnico |
| PUT | `/api/tecnicos/:id` | Atualizar técnico |
| PATCH | `/api/tecnicos/:id/desativar` | Desativar técnico |
| PATCH | `/api/tecnicos/:id/reativar` | Reativar técnico |

### 7.2. Cadastrar técnico

```http
POST /api/tecnicos
```

Corpo:

```json
{
  "nomeCompleto": "Técnico Exemplo",
  "cpf": "CPF_VALIDO_NAO_CADASTRADO",
  "email": "tecnico@exemplo.com",
  "telefone": "11999999999",
  "endereco": "Endereço de exemplo",
  "senha": "SenhaForte123"
}
```

Os campos `telefone` e `endereco` são opcionais.

Resposta HTTP 201:

```json
{
  "mensagem": "Técnico cadastrado com sucesso!",
  "idTecnico": 9
}
```

### 7.3. Atualizar técnico

```http
PUT /api/tecnicos/9
```

Corpo:

```json
{
  "nomeCompleto": "Técnico Atualizado",
  "email": "tecnicoatualizado@exemplo.com",
  "telefone": "11988888888",
  "endereco": "Novo endereço"
}
```

Resposta HTTP 200:

```json
{
  "mensagem": "Técnico atualizado com sucesso!"
}
```

### 7.4. Desativar técnico

```http
PATCH /api/tecnicos/9/desativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Técnico desativado com sucesso!"
}
```

### 7.5. Reativar técnico

```http
PATCH /api/tecnicos/9/reativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Técnico reativado com sucesso!"
}
```

### 7.6. Regras de negócio

- Apenas administradores gerenciam técnicos.
- CPF, e-mail e senha são validados.
- CPF e e-mail não podem estar duplicados.
- A senha é armazenada com BCrypt.
- O perfil é definido como `tecnico`.
- O endpoint de atualização não modifica CPF, perfil ou senha.
- Técnicos podem ser desativados sem excluir o histórico de atendimentos.

---

## 8. Gerenciamento de equipamentos

**Endpoint base:**

```text
/api/equipamentos
```

### Operações disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/equipamentos` | Listar equipamentos permitidos |
| GET | `/api/equipamentos/:id` | Consultar equipamento |
| POST | `/api/equipamentos` | Cadastrar equipamento |
| PUT | `/api/equipamentos/:id` | Atualizar equipamento |
| PATCH | `/api/equipamentos/:id/desativar` | Desativar equipamento |
| PATCH | `/api/equipamentos/:id/reativar` | Reativar equipamento |

### 8.1. Cadastrar equipamento

```http
POST /api/equipamentos
```

Exemplo:

```json
{
  "idCliente": 3,
  "idCategoria": 1,
  "nomeEquipamento": "Notebook",
  "marca": "Dell",
  "modelo": "Inspiron 15"
}
```

Resposta HTTP 201:

```json
{
  "mensagem": "Equipamento cadastrado com sucesso!",
  "idEquipamento": 3
}
```

### 8.2. Regras de negócio

- O equipamento pertence a um cliente.
- O cliente deve estar ativo.
- A categoria deve estar ativa.
- Clientes não podem cadastrar equipamentos para terceiros.
- Clientes não podem consultar equipamentos de terceiros.
- Equipamentos são desativados em vez de excluídos fisicamente.

---

## 9. Categorias de equipamentos

**Endpoint base:**

```text
/api/categorias
```

### Operações disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/categorias` | Listar categorias |
| GET | `/api/categorias/:id` | Consultar categoria |
| POST | `/api/categorias` | Cadastrar categoria |
| PUT | `/api/categorias/:id` | Atualizar categoria |
| PATCH | `/api/categorias/:id/desativar` | Desativar categoria |
| PATCH | `/api/categorias/:id/reativar` | Reativar categoria |

### 9.1. Exemplo de cadastro

```http
POST /api/categorias
```

```json
{
  "nomeCategoria": "Celulares",
  "descricao": "Smartphones e aparelhos celulares"
}
```

Resposta HTTP 201:

```json
{
  "mensagem": "Categoria cadastrada com sucesso!",
  "idCategoria": 2
}
```

Somente administradores podem modificar categorias.

---

## 10. Tipos de serviço

**Endpoint base:**

```text
/api/tipos-servico
```

### Operações disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/tipos-servico` | Listar serviços |
| GET | `/api/tipos-servico/:id` | Consultar serviço |
| POST | `/api/tipos-servico` | Cadastrar serviço |
| PUT | `/api/tipos-servico/:id` | Atualizar serviço |
| PATCH | `/api/tipos-servico/:id/desativar` | Desativar serviço |
| PATCH | `/api/tipos-servico/:id/reativar` | Reativar serviço |

### 10.1. Exemplo de cadastro

```http
POST /api/tipos-servico
```

```json
{
  "nomeServico": "Troca de Tela",
  "descricao": "Substituição de telas danificadas"
}
```

Resposta HTTP 201:

```json
{
  "mensagem": "Tipo de serviço cadastrado com sucesso!",
  "idTipoServico": 2
}
```

Somente administradores podem cadastrar, atualizar, desativar e reativar tipos de serviço.

---

## 11. Ordens de Serviço

As Ordens de Serviço representam a principal funcionalidade do TechFlow OS.

**Endpoint base:**

```text
/api/ordens-servico
```

### Operações disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/ordens-servico` | Listar OS permitidas |
| GET | `/api/ordens-servico/:id` | Consultar uma OS |
| POST | `/api/ordens-servico` | Abrir uma OS |
| PUT | `/api/ordens-servico/:id` | Atualizar descrição |
| PATCH | `/api/ordens-servico/:id/status` | Alterar status |
| PATCH | `/api/ordens-servico/:id/diagnostico` | Registrar diagnóstico e solução |
| PATCH | `/api/ordens-servico/:id/cancelar` | Cancelar OS |
| PATCH | `/api/ordens-servico/:id/atribuir` | Atribuir técnico |
| GET | `/api/ordens-servico/:id/historico` | Consultar histórico |
| DELETE | `/api/ordens-servico/:id` | Excluir logicamente uma OS |

### 11.1. Cadastrar Ordem de Serviço

```http
POST /api/ordens-servico
```

**Permissão:** Administrador ou cliente proprietário.

Corpo:

```json
{
  "idCliente": 3,
  "idEquipamento": 2,
  "idTipoServico": 1,
  "descricaoProblema": "Notebook apresentando lentidão."
}
```

Resposta HTTP 201:

```json
{
  "mensagem": "Ordem de Serviço cadastrada com sucesso!",
  "idOS": 5
}
```

A OS é criada inicialmente com status `Aberta`.

O sistema também registra o primeiro histórico de status.

### 11.2. Listar Ordens de Serviço

```http
GET /api/ordens-servico
```

Permissões:

- **Administrador:** visualiza as OS não excluídas logicamente.
- **Técnico:** visualiza as OS atribuídas a ele.
- **Cliente:** visualiza suas próprias OS.

Ordens excluídas logicamente não aparecem na listagem normal.

Resposta HTTP 200: lista JSON contendo as Ordens de Serviço permitidas ao usuário.

### 11.3. Consultar uma OS

```http
GET /api/ordens-servico/5
```

A resposta pode incluir:

- Número da OS.
- Cliente responsável.
- Equipamento.
- Tipo de serviço.
- Descrição do problema.
- Técnico responsável.
- Diagnóstico.
- Solução aplicada.
- Status atual.
- Datas do atendimento.

A API verifica se o usuário possui permissão para consultar o registro.

Os testes de segurança confirmaram respostas HTTP 403 para consultas não autorizadas.

Uma OS excluída logicamente retorna HTTP 404 na consulta normal.

### 11.4. Atualizar descrição da OS

```http
PUT /api/ordens-servico/5
```

**Permissão:** Administrador ou cliente proprietário.

Corpo:

```json
{
  "descricaoProblema": "Notebook apresenta lentidão ao iniciar o Windows."
}
```

Resposta HTTP 200:

```json
{
  "mensagem": "Ordem de Serviço atualizada com sucesso!"
}
```

Ordens concluídas, canceladas ou excluídas logicamente não permitem essa alteração.

### 11.5. Registrar diagnóstico e solução aplicada

```http
PATCH /api/ordens-servico/5/diagnostico
```

**Permissão:** Administrador ou técnico responsável.

O sistema permite registrar o diagnóstico antes da solução aplicada.

Exemplo de registro inicial:

```json
{
  "diagnostico": "Excesso de programas iniciados com o Windows."
}
```

Depois do reparo:

```json
{
  "diagnostico": "Excesso de programas iniciados com o Windows.",
  "solucaoAplicada": "Desativação de programas desnecessários e otimização do sistema."
}
```

Resposta HTTP 200:

```json
{
  "mensagem": "Diagnóstico e solução registrados com sucesso!"
}
```

Regras:

- O diagnóstico é obrigatório.
- A solução aplicada pode ser registrada posteriormente.
- Uma solução já salva é preservada quando uma nova solução não é informada.
- Apenas administrador ou técnico responsável pode alterar as informações.
- OS concluídas, canceladas ou excluídas logicamente não permitem novas alterações.

**Para concluir uma OS, é obrigatório possuir diagnóstico e solução aplicada.**

### 11.6. Alterar status

```http
PATCH /api/ordens-servico/5/status
```

**Permissão:** Administrador ou técnico responsável.

Corpo:

```json
{
  "novoStatus": "Em andamento"
}
```

Resposta HTTP 200:

```json
{
  "mensagem": "Status atualizado com sucesso!",
  "statusAnterior": "Aberta",
  "novoStatus": "Em andamento"
}
```

### Status disponíveis

| Status | Significado |
|---|---|
| `Aberta` | Solicitação registrada |
| `Em análise` | Equipamento em avaliação |
| `Em andamento` | Atendimento em execução |
| `Aguardando peça` | Serviço aguardando componente |
| `Concluída` | Atendimento finalizado |
| `Cancelada` | Atendimento cancelado |

O status inicial `Aberta` é definido automaticamente.

O cancelamento possui um endpoint específico.

Toda mudança de status válida é registrada em `HistoricoStatus`.

### 11.7. Concluir Ordem de Serviço

Para concluir:

```http
PATCH /api/ordens-servico/5/status
```

Corpo:

```json
{
  "novoStatus": "Concluída"
}
```

Condições:

- A OS não pode estar finalizada.
- Deve possuir diagnóstico.
- Deve possuir solução aplicada.
- O usuário deve possuir permissão para atender a OS.
- A OS não pode estar excluída logicamente.

Ao concluir:

- O status é atualizado para `Concluída`.
- A data de conclusão é registrada.
- O histórico recebe a alteração.
- A OS deixa de aceitar novas alterações de atendimento.

### 11.8. Cancelar Ordem de Serviço

```http
PATCH /api/ordens-servico/5/cancelar
```

**Permissão:** Administrador ou cliente proprietário.

Corpo:

```json
{
  "justificativa": "Cliente desistiu do serviço."
}
```

Resposta HTTP 200:

```json
{
  "mensagem": "OS cancelada e histórico registrado!"
}
```

Regras:

- Somente OS `Aberta` ou `Em análise` podem ser canceladas.
- A justificativa é obrigatória.
- O status passa para `Cancelada`.
- A data de cancelamento é registrada.
- O histórico de status é preservado.
- A OS continua armazenada e consultável, respeitando as permissões.

**Cancelar não é o mesmo que excluir logicamente.**

### 11.9. Excluir logicamente Ordem de Serviço

```http
DELETE /api/ordens-servico/:id
```

**Autenticação:** JWT obrigatório.

**Permissão:** Somente administrador.

A exclusão lógica é utilizada para ocultar administrativamente uma OS sem remover fisicamente seus dados do MySQL.

#### Condições obrigatórias

- A OS deve existir.
- O usuário deve estar autenticado como administrador.
- A OS deve estar `Aberta` ou `Cancelada`.
- A OS não pode possuir técnico atribuído.
- Uma OS concluída não pode ser excluída.
- Uma OS já excluída não pode ser excluída novamente.

#### Funcionamento

Ao executar a operação:

1. O campo `excluidaEm` recebe a data e hora da exclusão.
2. O status da OS é definido como `Cancelada`.
3. Uma justificativa administrativa é registrada quando ainda não existe.
4. A mudança de status é registrada no histórico quando necessária.
5. O registro continua armazenado no MySQL.
6. A OS deixa de aparecer nas consultas normais.
7. A API impede alterações posteriores na OS.

#### Exemplo de requisição

```http
DELETE /api/ordens-servico/9
Authorization: Bearer TOKEN_JWT
```

#### Resposta de sucesso — HTTP 200

```json
{
  "mensagem": "Ordem de Serviço excluída com sucesso!",
  "idOS": 9,
  "tipoExclusao": "logica"
}
```

#### Respostas possíveis

| HTTP | Significado |
|---|---|
| 200 | Exclusão realizada |
| 400 | ID inválido ou OS não atende às regras |
| 401 | Token ausente, inválido ou expirado |
| 403 | Usuário sem permissão |
| 404 | OS inexistente ou já excluída |
| 500 | Erro interno |

#### Diferença entre cancelar e excluir

| Característica | Cancelamento | Exclusão lógica |
|---|---|---|
| Método | PATCH | DELETE |
| Endpoint | `/cancelar` | `/:id` |
| Status | Cancelada | Cancelada |
| Registro preservado | Sim | Sim |
| Histórico preservado | Sim | Sim |
| Continua nas consultas normais | Sim | Não |
| Campo `excluidaEm` preenchido | Não | Sim |
| Exclusivo do administrador | Não | Sim |

**O TechFlow não remove fisicamente as Ordens de Serviço nessa operação.**

---

## 12. Atribuição de técnicos

**Método:** `PATCH`

```http
PATCH /api/ordens-servico/5/atribuir
```

**Permissão:** Somente administrador.

Corpo:

```json
{
  "idTecnico": 2
}
```

Resposta HTTP 200:

```json
{
  "mensagem": "Técnico atribuído com sucesso!",
  "idOS": 5,
  "idTecnico": 2
}
```

### Validações

- A OS deve existir.
- O técnico deve existir.
- O técnico deve estar ativo.
- A OS não pode estar concluída, cancelada ou excluída logicamente.
- A mesma atribuição não pode ser repetida.
- A atribuição deve ser registrada no histórico.

A operação utiliza transação no MySQL para manter a consistência dos dados.

---

## 13. Histórico das Ordens de Serviço

**Método:** `GET`

```http
GET /api/ordens-servico/5/historico
```

**Autenticação:** Obrigatória.

### Permissões

- Administrador: OS permitidas ao seu perfil.
- Técnico: somente OS atribuídas.
- Cliente: somente OS de sua propriedade.

Ordens excluídas logicamente não podem ser consultadas pelo endpoint normal de histórico.

### Exemplo de resposta HTTP 200

```json
[
  {
    "idHistorico": 1,
    "idOS": 5,
    "statusAnterior": null,
    "statusNovo": "Aberta",
    "dataAlteracao": "2026-11-11T10:00:00.000Z"
  },
  {
    "idHistorico": 2,
    "idOS": 5,
    "statusAnterior": "Aberta",
    "statusNovo": "Em andamento",
    "dataAlteracao": "2026-11-11T11:00:00.000Z"
  }
]
```

Os valores são ilustrativos.

O histórico utiliza a tabela `HistoricoStatus` para preservar as alterações realizadas durante o atendimento.

Tentativas de acesso sem autorização podem receber HTTP 403.

---

## 14. Agendamentos

**Endpoint base:**

```text
/api/agendamentos
```

Os agendamentos são utilizados para organizar os atendimentos dos técnicos.

### Operações documentadas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/agendamentos` | Listar agendamentos |
| POST | `/api/agendamentos` | Cadastrar agendamento |

### 14.1. Consultar agendamentos

```http
GET /api/agendamentos
```

**Autenticação:** Obrigatória.

Permissões:

- Administrador: consulta todos.
- Técnico: consulta agendamentos das suas OS.
- Cliente: consulta agendamentos das suas OS.

Resposta HTTP 200: lista JSON dos agendamentos permitidos.

### 14.2. Cadastrar agendamento

```http
POST /api/agendamentos
```

**Permissão:** Somente administrador.

Corpo:

```json
{
  "idOS": 7,
  "dataAgendamento": "2026-11-21",
  "horaAgendamento": "09:00",
  "observacao": "Verificação do sistema de refrigeração."
}
```

Resposta HTTP 201:

```json
{
  "mensagem": "Agendamento cadastrado com sucesso!",
  "idAgendamento": 1,
  "idOS": 7
}
```

### 14.3. Regras de negócio

- A OS deve existir.
- A OS deve possuir técnico responsável.
- A OS não pode estar concluída, cancelada ou excluída logicamente.
- A data e a hora precisam ser futuras.
- A data deve utilizar `AAAA-MM-DD`.
- O horário deve utilizar `HH:MM`.
- A observação é opcional e aceita até 500 caracteres.
- O agendamento é armazenado na tabela `AgendamentosOS`.

A interface do calendário do técnico consulta esses registros através da API.

---

## 15. Ocorrências

**Endpoint base:**

```text
/api/ocorrencias
```

O módulo de ocorrências permite registrar informações adicionais sobre situações identificadas durante os atendimentos.

Os registros são vinculados às Ordens de Serviço e armazenados na tabela `OcorrenciasOS`.

As rotas utilizam autenticação JWT e verificações específicas de permissão.

O registro de ocorrências foi validado na interface do técnico, incluindo sua permanência após a atualização da página.

### Regras gerais

- A ocorrência deve estar relacionada a uma OS existente.
- O acesso é controlado pelo perfil autenticado.
- O usuário deve possuir permissão para realizar a operação.
- Ordens excluídas logicamente não podem receber novas ocorrências.
- As informações são preservadas no banco.

**Observação:** os métodos, parâmetros e formatos individuais do módulo de ocorrências devem ser consultados em `backend/routes/ocorrencias.js`. A documentação anterior não apresentava esses contratos completos; por isso, não são especificados endpoints individuais sem confirmação da implementação.

---

## 16. Exclusão lógica e preservação de dados

O TechFlow utiliza mecanismos de desativação e exclusão lógica para preservar os relacionamentos e o histórico dos atendimentos.

### 16.1. Clientes

A desativação de clientes é realizada por:

```http
PATCH /api/clientes/:id/desativar
```

O campo `ativo` passa para `0`.

O cadastro permanece no banco de dados.

### 16.2. Técnicos

A desativação de técnicos utiliza:

```http
PATCH /api/tecnicos/:id/desativar
```

O técnico permanece registrado no banco, preservando seus vínculos históricos com as Ordens de Serviço.

### 16.3. Ordens de Serviço

As Ordens de Serviço possuem duas operações distintas.

**Cancelamento:**

```http
PATCH /api/ordens-servico/:id/cancelar
```

Cancela o atendimento e mantém a OS disponível para consultas autorizadas.

**Exclusão lógica:**

```http
DELETE /api/ordens-servico/:id
```

Registra a exclusão administrativa e oculta a OS das consultas normais.

### 16.4. Justificativa técnica

A utilização dessas operações permite:

- Preservar registros históricos.
- Evitar perda de relacionamentos.
- Manter a rastreabilidade dos atendimentos.
- Proteger a integridade dos dados.
- Impedir alterações indevidas após a exclusão lógica.

A operação HTTP DELETE das OS não executa exclusão física do atendimento.

---

## 17. Validações

A API possui validações para proteger os dados e impedir operações inválidas.

Entre as verificações estão:

- Campos obrigatórios.
- Formato dos e-mails.
- Validade matemática dos CPFs.
- Requisitos mínimos das senhas.
- Identificadores numéricos válidos.
- Duplicidade de CPF e e-mail.
- Existência de registros relacionados.
- Permissões dos usuários.
- Situação atual da OS.
- Datas e horários de agendamento.
- Restrições de atualização de registros finalizados.
- Bloqueio de operações em OS excluídas logicamente.

As validações são realizadas no back-end, independentemente das verificações existentes nas páginas HTML.

---

## 18. Tratamento de erros HTTP

A API utiliza códigos HTTP para identificar o resultado das operações.

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Registro criado |
| 400 | Dados inválidos ou operação não permitida pelas regras de negócio |
| 401 | Usuário não autenticado |
| 403 | Acesso proibido |
| 404 | Registro ou rota não encontrada |
| 409 | Conflito ou cadastro duplicado |
| 423 | Conta temporariamente bloqueada |
| 429 | Limite de requisições excedido |
| 500 | Erro interno do servidor |

### 18.1. Erro de permissão

HTTP 403:

```json
{
  "mensagem": "Você não tem permissão para realizar esta ação nesta OS."
}
```

### 18.2. Registro não encontrado

HTTP 404:

```json
{
  "mensagem": "Ordem de Serviço não encontrada."
}
```

### 18.3. Dados inválidos

HTTP 400:

```json
{
  "mensagem": "Preencha todos os campos obrigatórios."
}
```

As mensagens específicas podem variar conforme a rota.

---

## 19. Exemplo de consumo da API

O front-end utiliza JavaScript e `fetch()` para realizar requisições ao back-end.

Exemplo de consulta às Ordens de Serviço:

```javascript
async function consultarOrdens(token) {
    const resposta = await fetch("/api/ordens-servico", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || "Erro ao consultar ordens."
        );
    }

    return dados;
}
```

O token é obtido após o login.

O back-end verifica o usuário e retorna somente os registros permitidos ao seu perfil.

### 19.1. Exemplo de exclusão lógica

```javascript
async function excluirOrdem(idOS, token) {
    const resposta = await fetch(
        `/api/ordens-servico/${idOS}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || "Erro ao excluir a OS."
        );
    }

    return dados;
}
```

Essa função é um exemplo de consumo do endpoint. Não significa que a interface administrativa tenha um botão DELETE implementado.

A autorização da operação é verificada pelo servidor.

---

## 20. Testes realizados

Durante o desenvolvimento da Sprint 2, foram realizados testes das principais funcionalidades.

### 20.1. Testes funcionais

Foram validados:

- Cadastro e login de clientes.
- Cadastro de equipamentos.
- Abertura de Ordens de Serviço.
- Consulta e acompanhamento das OS.
- Cadastro de técnicos pelo administrador.
- Atribuição de técnicos.
- Registro de diagnóstico.
- Registro posterior da solução aplicada.
- Atualização de status.
- Conclusão de uma OS.
- Consulta da conclusão pelo cliente.
- Cadastro e consulta de agendamentos.
- Registro e consulta de ocorrências.
- Busca de OS por número.
- Filtros por status no painel administrativo.

### 20.2. Testes de segurança

Foram realizados testes de acesso à API utilizando diferentes perfis.

Entre os cenários verificados:

1. Cliente tentando consultar OS de outro cliente: HTTP 403.
2. Técnico tentando consultar OS de outro técnico: HTTP 403.
3. Técnico tentando alterar diagnóstico de OS não atribuída a ele: HTTP 403.
4. Cliente tentando executar DELETE de OS: HTTP 403.

Esses resultados confirmam o bloqueio das operações específicas verificadas.

A aprovação desses testes não representa uma auditoria completa de segurança.

### 20.3. Testes automatizados

O projeto utiliza Jest.

Para executar os testes:

```bash
cd backend
npm test
```

Resultado confirmado durante a Sprint 2:

```text
Test Suites: 5 passed, 5 total
Tests:       12 passed, 12 total
```

As suítes verificadas incluem:

- Autenticação.
- Permissões.
- Servidor.
- Tokens expirados.
- Usuários desativados.

Os testes automatizados também foram executados novamente durante a revisão final da Sprint 2, com resultado positivo informado na validação.

**Observação:** os 12 testes automatizados não incluem uma suíte específica para o método DELETE. Essa funcionalidade foi validada manualmente.

### 20.4. Testes da exclusão lógica

Foi utilizada a OS **#9**, no banco principal do ambiente de desenvolvimento, para validar a operação DELETE.

Condições iniciais:

```text
OS: 9
Cliente: 16
Técnico: NULL
Status: Aberta
Excluída: NULL
```

Resultados observados:

| Teste | Resultado |
|---|---|
| DELETE pelo cliente | HTTP 403 |
| DELETE pelo administrador | HTTP 200 |
| Consulta individual após exclusão | HTTP 404 |
| Presença na listagem após exclusão | Não aparece |
| Tentativa de alteração após exclusão | HTTP 404 |
| Registro preservado no MySQL | Confirmado |
| Histórico preservado | Confirmado |

Após a exclusão:

```text
OS: 9
Status: Cancelada
excluidaEm: 2026-11-11 21:25:30
Justificativa: Exclusão lógica pelo administrador
```

O histórico registrou a criação da OS como `Aberta` e sua alteração para `Cancelada`.

Esses resultados demonstram o funcionamento da exclusão lógica nos cenários manuais executados.

### 20.5. Teste de instalação independente

Foi realizado também um teste de instalação utilizando um banco de dados separado:

```text
techflow_teste_instalacao
```

Esse teste permitiu validar uma instalação sem utilizar diretamente os registros do banco principal.

Foram verificados:

- Criação da estrutura do banco.
- Configuração independente do ambiente.
- Criação do administrador inicial.
- Cadastro e autenticação de cliente.
- Criação de Ordem de Serviço.
- Atribuição de técnico.
- Registro de diagnóstico e solução.
- Conclusão do atendimento.

A OS **#8** desse ambiente de teste foi concluída com sucesso.

**Importante:** a numeração das Ordens de Serviço é independente em cada banco. A OS #8 do banco de teste não é a mesma OS #8 do banco principal.

---

## 21. Versionamento com Git

O código-fonte do TechFlow é versionado com Git e armazenado no GitHub.

**Repositório:**

https://github.com/bordin010/Projeto-TechFlow

**Branch principal:** `main`

Para registrar alterações:

```bash
git status
git add .
git commit -m "Descricao das alteracoes"
git push origin main
```

O arquivo `.gitignore` é utilizado para impedir o versionamento de informações privadas e arquivos locais desnecessários, como:

- Arquivos `.env`.
- Dependências `node_modules/`.
- Arquivos de backup e logs, conforme as regras configuradas.
- Arquivos de configuração de ambientes de teste que contenham dados privados.

O código é versionado no GitHub, mas os registros locais do MySQL precisam de backup separado.

---

## 22. Atendimento aos requisitos da Sprint 2

| Requisito | Implementação |
|---|---|
| Repositório Git | Git e GitHub |
| Estrutura organizada | Diretórios frontend, backend e banco-de-dados |
| Ambiente de desenvolvimento | Node.js, npm e MySQL |
| Banco de dados | MySQL com tabelas relacionadas |
| Persistência | Consultas SQL executadas pela API |
| Back-end | Node.js e Express |
| CRUD de clientes | Cadastro, consulta, atualização e desativação |
| CRUD de técnicos | Cadastro, consulta, atualização e desativação |
| Operações de OS | Cadastro, consulta, atualização, cancelamento e DELETE lógico |
| Atribuição de técnicos | Endpoint PATCH específico |
| Status das OS | Atualização e histórico |
| Diagnóstico e solução | Registro e atualização dos atendimentos |
| Validações | Verificação de dados no servidor |
| Tratamento de erros | Respostas HTTP e mensagens JSON |
| Estrutura HTML | Interfaces principais |
| CSS responsivo | Estilização adaptável |
| Cadastro de OS | Tela de solicitação |
| Consulta de OS | Acompanhamento de atendimentos |
| Detalhes de OS | Informações do atendimento |
| Tela de técnicos | Painel e gerenciamento de técnicos |
| Dashboard | Painel administrativo |
| Busca e filtros | Pesquisa por OS e filtro de status |
| Segurança | JWT, BCrypt e verificação de perfis |
| Exclusão lógica | DELETE administrativo com preservação do registro |
| Documentação da API | Arquivo `backend/API.md` |
| Testes automatizados | Jest |
| Testes funcionais | Fluxos do administrador, técnico e cliente |
| Código versionado | Repositório GitHub |

A desativação de clientes e técnicos representa exclusão lógica de usuários.

Nas Ordens de Serviço, existem duas operações distintas:

- **Cancelamento:** realizado pelo método PATCH, mantendo a OS consultável.
- **Exclusão lógica administrativa:** realizada pelo método DELETE, ocultando a OS das consultas normais e impedindo novas alterações.

Ambas preservam os registros no MySQL, mas possuem finalidades e regras diferentes.

---

## 23. Considerações finais

A Sprint 2 do TechFlow OS teve como objetivo desenvolver uma versão funcional do sistema de gerenciamento de Ordens de Serviço.

O projeto integra:

- Banco de dados relacional MySQL.
- API REST desenvolvida com Node.js e Express.
- Autenticação por JWT.
- Controle de permissões por perfil.
- Gerenciamento de clientes e técnicos.
- Cadastro e acompanhamento de Ordens de Serviço.
- Atribuição de técnicos aos atendimentos.
- Registro de diagnósticos e soluções.
- Controle de status.
- Histórico de alterações.
- Agendamentos e ocorrências.
- Cancelamento de atendimentos.
- Exclusão lógica administrativa de OS.
- Interfaces HTML, CSS e JavaScript.
- Validações e tratamento de erros.
- Testes automatizados e funcionais.
- Documentação técnica.
- Versionamento no GitHub.

A implementação do método DELETE lógico representa uma melhoria importante, pois permite executar a operação de exclusão prevista no gerenciamento de registros sem comprometer os dados históricos.

Os principais fluxos foram implementados e testados durante o desenvolvimento.

O projeto está organizado para apresentação e avaliação acadêmica da Sprint 2, com possibilidades de evolução em etapas futuras.

---

**Projeto:** TechFlow OS  
**Etapa:** Sprint 2 — Implementação Funcional  
**Finalidade:** Projeto acadêmico  
**Documento:** Documentação Técnica da API REST

**Integrantes:**

- Enzo Dominone Bordin
- Enzo Predasoli
- Davi Rodrigues Moreira da Silva
- Enzo Miguel Ribeiro Farias

**Disciplina:** Desenvolvimento de Sistemas (DS)  
**Professor:** Eduardo Falabella