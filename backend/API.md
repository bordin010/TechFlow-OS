# TechFlow — Documentação da API REST

**Projeto:** TechFlow OS — Sistema de Gerenciamento de Ordens de Serviço  
**Versão da API:** 1.0  
**Etapa:** Sprint 2 — Implementação Funcional  
**Tecnologias:** Node.js, Express, MySQL, BCrypt e JWT  
**Formato de comunicação:** JSON

---

## 1. Apresentação

O TechFlow OS é um sistema web desenvolvido para auxiliar no gerenciamento de uma assistência técnica de computadores e celulares.

A aplicação permite cadastrar clientes, técnicos, equipamentos e Ordens de Serviço, além de acompanhar o andamento dos atendimentos.

O sistema possui três perfis de acesso:

- Administrador: gerencia cadastros e Ordens de Serviço.
- Técnico: realiza os atendimentos que lhe foram atribuídos.
- Cliente: solicita serviços e acompanha suas próprias Ordens de Serviço.

O projeto utiliza uma API REST desenvolvida com Node.js e Express, integrada a um banco de dados MySQL.

O front-end foi desenvolvido utilizando HTML, CSS e JavaScript.

---

## 2. Organização do projeto

A estrutura principal está dividida em três diretórios:

- `frontend/`: páginas, estilos e scripts da interface.
- `backend/`: servidor, API REST, validações e acesso ao banco.
- `banco-de-dados/`: scripts SQL para estrutura do MySQL.

### Estrutura principal do back-end

```text
backend/
├── database/
│   └── conexao.js
├── middlewares/
│   ├── verificarToken.js
│   └── verificarPerfil.js
├── routes/
│   ├── agendamentos.js
│   ├── atribuicoes.js
│   ├── autenticacao.js
│   ├── categorias.js
│   ├── clientes.js
│   ├── equipamentos.js
│   ├── historicoOS.js
│   ├── ocorrencias.js
│   ├── ordensServico.js
│   ├── tecnicos.js
│   └── tiposServico.js
├── tests/
│   ├── autenticacao.test.js
│   ├── permissoes.test.js
│   ├── server.test.js
│   ├── tokenExpirado.test.js
│   └── usuarioDesativado.test.js
├── utils/
│   └── validacoes.js
├── .env.example
├── API.md
├── package.json
├── package-lock.json
└── server.js
```

---

## 3. Configuração do ambiente

### 3.1 Requisitos

Para executar o projeto, são necessários:

- Node.js e npm.
- MySQL.
- Navegador web.
- Editor de código, como Visual Studio Code.

### 3.2 Instalar dependências

Abra o terminal na pasta `backend` e execute:

```bash
npm install
```

### 3.3 Configurar variáveis de ambiente

Crie o arquivo `.env` na pasta `backend`, utilizando o `.env.example` como referência.

As configurações incluem:

| Variável | Descrição |
|---|---|
| `DB_PASSWORD` | Senha de conexão com o MySQL |
| `JWT_SECRET` | Chave de assinatura dos tokens JWT |

As configurações de conexão também são utilizadas pelo módulo `database/conexao.js`.

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

### 3.4 Iniciar o servidor

Na pasta `backend`, execute:

```bash
node server.js
```

O servidor será disponibilizado em:

```text
http://localhost:3000
```

Para consultar a rota inicial:

```http
GET http://localhost:3000/
```

Resposta:

```json
{
  "mensagem": "API do TechFlow funcionando!"
}
```

O front-end é disponibilizado pelo próprio Express através do caminho `/frontend`.

---

## 4. Banco de dados

O TechFlow utiliza MySQL para armazenar permanentemente as informações.

### Tabelas principais

| Tabela | Finalidade |
|---|---|
| `Usuarios` | Clientes, técnicos e administradores |
| `Equipamentos` | Equipamentos cadastrados |
| `Categorias` | Categorias de equipamentos |
| `TiposServico` | Tipos de serviços oferecidos |
| `OrdensServico` | Registros dos atendimentos |
| `HistoricoAtribuicoes` | Histórico de técnicos atribuídos |
| `HistoricoStatus` | Histórico de alterações de status |
| `OcorrenciasOS` | Ocorrências dos atendimentos |
| `AgendamentosOS` | Agendamentos dos serviços |

### Relacionamentos

- Um cliente pode possuir vários equipamentos.
- Um cliente pode abrir várias Ordens de Serviço.
- Cada equipamento pertence a um cliente.
- Uma Ordem de Serviço está vinculada a um cliente, equipamento e tipo de serviço.
- Uma Ordem de Serviço pode ser atribuída a um técnico.
- Uma OS pode possuir registros de histórico, ocorrências e agendamentos.

A persistência é realizada através de consultas SQL executadas pelo back-end.

As consultas parametrizadas utilizam o módulo `mysql2`.

---

## 5. Autenticação e autorização

A API utiliza JWT para autenticar os usuários e controlar o acesso às funcionalidades.

O login gera um token, que deve ser enviado nas requisições protegidas.

### Cabeçalho de autenticação

```http
Authorization: Bearer SEU_TOKEN_JWT
```

### Perfis disponíveis

| Perfil | Permissões principais |
|---|---|
| `administrador` | Gerenciamento geral |
| `tecnico` | Atendimento das OS atribuídas |
| `cliente` | Cadastro e acompanhamento dos próprios serviços |

### 5.1 Realizar login

**Método:** `POST`

**Endpoint:**

```http
POST /api/auth/login
```

**Autenticação:** Pública.

Corpo da requisição:

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

O conteúdo apresentado é ilustrativo.

### 5.2 Consultar sessão

**Método:** `GET`

```http
GET /api/auth/sessao
```

**Autenticação:** Obrigatória.

Resposta HTTP 200:

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

A estrutura exata do objeto `usuario` segue as informações fornecidas pela autenticação.

### 5.3 Regras de segurança

O sistema implementa:

- Senhas armazenadas com hash BCrypt.
- Tokens JWT para autenticação.
- Verificação do perfil do usuário.
- Bloqueio de acesso a recursos não autorizados.
- Controle de tentativas de login.
- Tratamento de tokens inválidos ou expirados.
- Restrição de acesso para usuários desativados.
- Consultas SQL parametrizadas.

As senhas não são retornadas nos endpoints de consulta de clientes e técnicos.

---

## 6. CRUD de clientes

**Endpoint base:**

```text
/api/clientes
```

### Operações disponíveis

| Método | Endpoint | Descrição | Permissão |
|---|---|---|---|
| GET | `/api/clientes` | Listar clientes | Administrador |
| GET | `/api/clientes/:id` | Consultar cliente | Administrador ou proprietário |
| POST | `/api/clientes` | Cadastrar cliente | Público |
| PUT | `/api/clientes/:id` | Atualizar cliente | Administrador ou proprietário |
| PATCH | `/api/clientes/:id/desativar` | Desativar cliente | Administrador |
| PATCH | `/api/clientes/:id/reativar` | Reativar cliente | Administrador |

O parâmetro `:id` representa o identificador numérico do cliente.

### 6.1 Cadastrar cliente

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

O identificador é ilustrativo.

### 6.2 Atualizar cliente

```http
PUT /api/clientes/8
```

Corpo da requisição:

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

### 6.3 Desativar cliente

```http
PATCH /api/clientes/8/desativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Cliente desativado com sucesso!"
}
```

### 6.4 Reativar cliente

```http
PATCH /api/clientes/8/reativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Cliente reativado com sucesso!"
}
```

### Regras

- CPF válido é obrigatório.
- E-mail válido é obrigatório.
- CPF e e-mail não podem estar duplicados.
- A senha deve atender às regras de validação.
- A senha é protegida com BCrypt.
- O perfil é definido como `cliente`.
- Clientes não podem consultar os cadastros de outros clientes.
- A desativação preserva o registro no banco.

---

## 7. CRUD de técnicos

**Endpoint base:**

```text
/api/tecnicos
```

Todas as operações exigem autenticação com perfil de administrador.

### Operações disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/tecnicos` | Listar técnicos |
| GET | `/api/tecnicos/:id` | Consultar técnico |
| POST | `/api/tecnicos` | Cadastrar técnico |
| PUT | `/api/tecnicos/:id` | Atualizar técnico |
| PATCH | `/api/tecnicos/:id/desativar` | Desativar técnico |
| PATCH | `/api/tecnicos/:id/reativar` | Reativar técnico |

### 7.1 Cadastrar técnico

```http
POST /api/tecnicos
```

Corpo da requisição:

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

Os campos de telefone e endereço são opcionais para esse cadastro.

Resposta HTTP 201:

```json
{
  "mensagem": "Técnico cadastrado com sucesso!",
  "idTecnico": 9
}
```

### 7.2 Atualizar técnico

```http
PUT /api/tecnicos/9
```

Corpo da requisição:

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

### 7.3 Desativar técnico

```http
PATCH /api/tecnicos/9/desativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Técnico desativado com sucesso!"
}
```

### 7.4 Reativar técnico

```http
PATCH /api/tecnicos/9/reativar
```

Resposta HTTP 200:

```json
{
  "mensagem": "Técnico reativado com sucesso!"
}
```

### Regras

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

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/equipamentos` | Listar equipamentos permitidos |
| GET | `/api/equipamentos/:id` | Consultar equipamento |
| POST | `/api/equipamentos` | Cadastrar equipamento |
| PUT | `/api/equipamentos/:id` | Atualizar equipamento |
| PATCH | `/api/equipamentos/:id/desativar` | Desativar equipamento |
| PATCH | `/api/equipamentos/:id/reativar` | Reativar equipamento |

### Exemplo de cadastro

```http
POST /api/equipamentos
```

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

### Regras

- O equipamento pertence a um cliente.
- O cliente deve estar ativo.
- A categoria deve estar ativa.
- Clientes não podem cadastrar equipamentos para outros clientes.
- Clientes não podem consultar equipamentos de terceiros.
- Equipamentos são desativados em vez de excluídos fisicamente.

---

## 9. Categorias de equipamentos

**Endpoint base:**

```text
/api/categorias
```

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/categorias` | Listar categorias |
| GET | `/api/categorias/:id` | Consultar categoria |
| POST | `/api/categorias` | Cadastrar categoria |
| PUT | `/api/categorias/:id` | Atualizar categoria |
| PATCH | `/api/categorias/:id/desativar` | Desativar categoria |
| PATCH | `/api/categorias/:id/reativar` | Reativar categoria |

Exemplo:

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

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/tipos-servico` | Listar serviços |
| GET | `/api/tipos-servico/:id` | Consultar serviço |
| POST | `/api/tipos-servico` | Cadastrar serviço |
| PUT | `/api/tipos-servico/:id` | Atualizar serviço |
| PATCH | `/api/tipos-servico/:id/desativar` | Desativar serviço |
| PATCH | `/api/tipos-servico/:id/reativar` | Reativar serviço |

Exemplo:

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

As Ordens de Serviço representam a principal funcionalidade do TechFlow.

**Endpoint base:**

```text
/api/ordens-servico
```

### Operações disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/ordens-servico` | Listar OS permitidas |
| GET | `/api/ordens-servico/:id` | Consultar detalhes de uma OS |
| POST | `/api/ordens-servico` | Abrir uma OS |
| PUT | `/api/ordens-servico/:id` | Atualizar descrição |
| PATCH | `/api/ordens-servico/:id/status` | Alterar status |
| PATCH | `/api/ordens-servico/:id/diagnostico` | Registrar diagnóstico e solução |
| PATCH | `/api/ordens-servico/:id/cancelar` | Cancelar OS |
| PATCH | `/api/ordens-servico/:id/atribuir` | Atribuir técnico |
| GET | `/api/ordens-servico/:id/historico` | Consultar histórico |

### 11.1 Cadastrar Ordem de Serviço

```http
POST /api/ordens-servico
```

**Permissão:** Administrador ou cliente proprietário.

Corpo da requisição:

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

### 11.2 Listar Ordens de Serviço

```http
GET /api/ordens-servico
```

**Permissões:**

- Administrador: visualiza todas as OS.
- Técnico: visualiza somente as OS atribuídas.
- Cliente: visualiza somente suas próprias OS.

Resposta HTTP 200: lista JSON contendo as Ordens de Serviço permitidas ao usuário.

### 11.3 Consultar uma OS

```http
GET /api/ordens-servico/5
```

A API consulta a OS pelo identificador informado.

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

Usuários sem permissão recebem HTTP 403.

### 11.4 Atualizar descrição da OS

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

Ordens concluídas ou canceladas não permitem essa alteração.

### 11.5 Registrar diagnóstico e solução aplicada

```http
PATCH /api/ordens-servico/5/diagnostico
```

**Permissão:** Administrador ou técnico responsável.

O sistema permite registrar o diagnóstico inicialmente, sem exigir a solução aplicada.

Exemplo de registro inicial:

```json
{
  "diagnostico": "Excesso de programas iniciados com o Windows."
}
```

A solução aplicada é opcional nessa etapa.

Após realizar o reparo, o técnico pode atualizar o atendimento:

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

### Regras do diagnóstico

- O diagnóstico deve estar preenchido.
- A solução aplicada pode ser informada posteriormente.
- Uma solução já salva é preservada quando uma nova solução não é informada.
- Somente o administrador ou o técnico atribuído pode registrar essas informações.
- Ordens concluídas ou canceladas não permitem novas alterações.

**Para concluir uma OS, o diagnóstico e a solução aplicada são obrigatórios.**

### 11.6 Alterar status

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
| Aberta | Solicitação registrada |
| Em análise | Equipamento em avaliação |
| Em andamento | Atendimento em execução |
| Aguardando peça | Serviço aguardando componente |
| Concluída | Atendimento finalizado |
| Cancelada | Atendimento cancelado |

O status inicial `Aberta` é definido automaticamente.

A opção `Cancelada` possui um endpoint específico.

A alteração de status é registrada na tabela `HistoricoStatus`.

### 11.7 Concluir Ordem de Serviço

Para concluir a OS:

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
- O diagnóstico deve estar registrado.
- A solução aplicada deve estar registrada.
- O usuário deve possuir permissão para atender a OS.

Ao concluir:

- O status passa para `Concluída`.
- A data de conclusão é registrada.
- O histórico recebe a alteração.
- O atendimento não pode mais ser editado pelas operações de atendimento previstas.

### 11.8 Cancelar Ordem de Serviço

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

### Regras do cancelamento

- Somente OS com status `Aberta` ou `Em análise` podem ser canceladas.
- A justificativa é obrigatória.
- O status passa para `Cancelada`.
- A data de cancelamento é registrada.
- O histórico de status é preservado.
- O registro não é apagado do banco de dados.

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
- A OS não pode estar concluída ou cancelada.
- A mesma atribuição não pode ser repetida.
- O registro é salvo no histórico de atribuições.

A operação utiliza transação no MySQL para manter a consistência dos dados.

---

## 13. Histórico das Ordens de Serviço

**Método:** `GET`

```http
GET /api/ordens-servico/5/historico
```

**Autenticação:** Obrigatória.

### Permissões

- Administrador: qualquer OS.
- Técnico: somente OS atribuídas.
- Cliente: somente OS de sua propriedade.

Exemplo de resposta HTTP 200:

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

Os dados acima são ilustrativos.

O histórico utiliza a tabela `HistoricoStatus` para preservar as mudanças realizadas durante o atendimento.

Tentativas de consultar históricos sem autorização recebem HTTP 403.

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

### 14.1 Consultar agendamentos

```http
GET /api/agendamentos
```

**Autenticação:** Obrigatória.

Permissões:

- Administrador: consulta todos.
- Técnico: consulta os agendamentos de suas OS.
- Cliente: consulta os agendamentos de suas OS.

Resposta HTTP 200: lista JSON dos agendamentos permitidos.

### 14.2 Cadastrar agendamento

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

### Regras

- A OS deve existir.
- A OS deve possuir técnico responsável.
- A OS não pode estar concluída ou cancelada.
- A data e a hora precisam ser futuras.
- A data utiliza o formato `AAAA-MM-DD`.
- O horário utiliza o formato `HH:MM`.
- A observação é opcional e aceita até 500 caracteres.
- O agendamento é armazenado em `AgendamentosOS`.

A interface do calendário do técnico consulta esses registros através da API.

---

## 15. Ocorrências

**Endpoint base:**

```text
/api/ocorrencias
```

O módulo de ocorrências permite registrar informações adicionais sobre situações identificadas durante o atendimento.

Os registros são vinculados às Ordens de Serviço e armazenados na tabela `OcorrenciasOS`.

As rotas utilizam autenticação JWT e possuem verificações específicas de permissão.

O registro de uma ocorrência foi validado na interface do técnico, incluindo sua permanência após a atualização da página.

**Observação:** os métodos, parâmetros e formatos exatos de cada operação devem ser consultados no arquivo `backend/routes/ocorrencias.js`. Esta seção não especifica endpoints individuais que não foram conferidos nesta revisão documental.

---

## 16. Exclusão lógica e cancelamento

O TechFlow preserva o histórico dos atendimentos e evita apagar permanentemente dados que possam estar relacionados a Ordens de Serviço.

### Clientes

A exclusão é representada pela desativação:

```http
PATCH /api/clientes/:id/desativar
```

O campo `ativo` passa para `0`.

### Técnicos

A exclusão também é lógica:

```http
PATCH /api/tecnicos/:id/desativar
```

O técnico permanece registrado no banco de dados, preservando os vínculos históricos.

### Ordens de Serviço

As OS utilizam cancelamento controlado:

```http
PATCH /api/ordens-servico/:id/cancelar
```

O registro permanece no banco, com a justificativa e a data do cancelamento.

**Justificativa técnica:** essa estratégia preserva relacionamentos, históricos de atendimento e informações necessárias para consultas posteriores.

O sistema não utiliza exclusão física das OS como operação principal.

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
- Permissões de usuários.
- Situação atual da OS.
- Datas e horários de agendamento.
- Restrições de atualização de registros finalizados.

As validações são realizadas no back-end, independentemente das verificações existentes nas páginas HTML.

---

## 18. Tratamento de erros HTTP

A API utiliza códigos HTTP para identificar o resultado das requisições.

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Registro criado com sucesso |
| 400 | Dados inválidos ou operação não permitida |
| 401 | Usuário não autenticado |
| 403 | Acesso proibido |
| 404 | Registro ou rota não encontrada |
| 409 | Conflito ou cadastro duplicado |
| 423 | Conta temporariamente bloqueada |
| 429 | Limite de requisições excedido |
| 500 | Erro interno do servidor |

### Exemplo de erro de permissão

HTTP 403:

```json
{
  "mensagem": "Você não tem permissão para realizar esta ação nesta OS."
}
```

### Exemplo de registro não encontrado

HTTP 404:

```json
{
  "mensagem": "Ordem de Serviço não encontrada."
}
```

### Exemplo de dados inválidos

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

---

## 20. Testes realizados

Durante o desenvolvimento da Sprint 2, foram realizados testes das principais funcionalidades.

### Testes funcionais

- Cadastro e login de clientes.
- Cadastro de equipamentos.
- Abertura de Ordens de Serviço.
- Consulta e acompanhamento de OS.
- Cadastro de técnicos pelo administrador.
- Atribuição de técnicos às OS.
- Registro de diagnóstico.
- Registro posterior da solução aplicada.
- Atualização do status.
- Conclusão de uma OS.
- Consulta da conclusão pelo cliente.
- Cadastro e consulta de agendamentos.
- Registro e consulta de ocorrências.

### Testes de segurança

Foram realizados testes de acesso à API utilizando diferentes contas:

1. Um cliente tentou consultar a OS de outro cliente e recebeu HTTP 403.
2. Um técnico tentou consultar uma OS de outro técnico e recebeu HTTP 403.
3. Um técnico tentou alterar o diagnóstico de uma OS não atribuída a ele e recebeu HTTP 403.

Esses testes confirmaram o bloqueio das operações específicas verificadas.

### Testes automatizados

O projeto utiliza Jest.

Comando:

```bash
npm test
```

Resultado obtido durante os testes da Sprint 2:

```text
Test Suites: 5 passed, 5 total
Tests:       12 passed, 12 total
```

As suítes verificadas incluem autenticação, permissões, servidor, tokens expirados e usuários desativados.

A aprovação desses testes não substitui uma auditoria completa de segurança.

---

## 21. Versionamento com Git

O código-fonte do TechFlow está versionado utilizando Git e armazenado no GitHub.

**Repositório:**

https://github.com/bordin010/Projeto-TechFlow

**Branch principal:** `main`

Para registrar alterações:

```bash
git add .
git commit -m "Descricao das alteracoes"
git push
```

O arquivo `.gitignore` impede o versionamento de informações privadas e arquivos desnecessários, incluindo:

- `.env`
- `node_modules/`
- Arquivos de backup.
- Arquivos de log.

O código é versionado no GitHub, mas os registros locais do MySQL precisam de backup separado.

---

## 22. Atendimento aos requisitos da Sprint 2

| Requisito | Implementação |
|---|---|
| Repositório Git | Git e GitHub |
| Estrutura do projeto | Pastas frontend, backend e banco-de-dados |
| Ambiente de desenvolvimento | Node.js, npm e MySQL |
| Banco de dados | MySQL com tabelas relacionadas |
| Persistência | Consultas SQL executadas pela API |
| Back-end | Node.js e Express |
| CRUD de clientes | Cadastro, consulta, atualização e desativação |
| CRUD de técnicos | Cadastro, consulta, atualização e desativação |
| Operações de OS | Cadastro, consulta, atualização e cancelamento |
| Status das OS | Alteração e histórico |
| Validações | Validação de dados no servidor |
| Tratamento de erros | Respostas HTTP e mensagens JSON |
| Estrutura HTML | Interfaces do front-end |
| CSS responsivo | Estilização adaptável |
| Cadastro de OS | Tela de solicitação |
| Consulta de OS | Acompanhamento de atendimentos |
| Detalhes de OS | Informações do atendimento |
| Tela de técnicos | Painel e gerenciamento de técnicos |
| Dashboard | Painel administrativo |
| Documentação da API | Arquivo API.md |
| Código versionado | Repositório GitHub |

A desativação de clientes e técnicos representa exclusão lógica.

Nas Ordens de Serviço, o cancelamento preserva o registro. Essa operação é a alternativa implementada à exclusão física, não um endpoint HTTP DELETE.

---

## 23. Considerações finais

A Sprint 2 do TechFlow teve como objetivo desenvolver uma versão funcional inicial de um sistema de gerenciamento de Ordens de Serviço.

O projeto possui:

- Banco de dados relacional.
- API REST.
- Gerenciamento de clientes e técnicos.
- Cadastro e acompanhamento de Ordens de Serviço.
- Controle de status dos atendimentos.
- Interfaces principais em HTML, CSS e JavaScript.
- Validações e tratamento de erros.
- Documentação técnica.
- Versionamento com Git.

As funcionalidades principais foram integradas e testadas durante o desenvolvimento.

O projeto foi estruturado para atender aos objetivos acadêmicos da Sprint 2, mantendo o foco no gerenciamento de Ordens de Serviço.

Melhorias futuras poderão ser avaliadas em outras etapas, sem necessidade de ampliar o escopo desta entrega.

---

**TechFlow OS — Sistema de Gerenciamento de Ordens de Serviço**

**Documentação Técnica da API REST — Sprint 2**

---

## Exclusão de Ordens de Serviço (DELETE)

**Endpoint:** `DELETE /api/ordens-servico/:id`

**Autenticação:** JWT obrigatório.

**Permissão:** Somente administrador.

### Funcionamento

O TechFlow utiliza exclusão lógica para preservar
o histórico dos atendimentos.

Ao executar o DELETE:
- A data da exclusão é registrada em `excluidaEm`.
- O status da OS passa para `Cancelada`.
- O registro permanece no banco de dados MySQL.
- O histórico da OS é preservado.
- A OS deixa de aparecer nas consultas normais.
- A API impede alterações posteriores.

### Regras

- A OS deve estar `Aberta` ou `Cancelada`.
- Não pode possuir técnico atribuído.
- Ordens concluídas não podem ser excluídas.
- Somente administradores podem executar a operação.

### Exemplo de requisição

DELETE /api/ordens-servico/9

Authorization: Bearer TOKEN_JWT

### Resposta de sucesso — HTTP 200

{
  "mensagem": "Ordem de Serviço excluída com sucesso!",
  "idOS": 9,
  "tipoExclusao": "logica"
}

### Possíveis respostas

| HTTP | Significado |
|---|---|
| 200 | Exclusão realizada |
| 400 | ID inválido ou OS não permite exclusão |
| 401 | Usuário não autenticado |
| 403 | Usuário sem permissão |
| 404 | OS inexistente ou já excluída |
| 500 | Erro interno |

### Diferença entre cancelar e excluir

PATCH /api/ordens-servico/:id/cancelar
Cancela o atendimento, mantendo a OS consultável.

DELETE /api/ordens-servico/:id
Realiza exclusão lógica administrativa e oculta a OS
das consultas normais.

A exclusão física não é utilizada para evitar a perda
dos dados e do histórico de atendimento.