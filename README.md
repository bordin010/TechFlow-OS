# TechFlow OS

### Sistema de Gerenciamento de Ordens de Serviço

**Projeto acadêmico — Sprint 2: Implementação Funcional**

---

## 1. Sobre o projeto

O **TechFlow OS** é um sistema web desenvolvido para auxiliar no gerenciamento de uma assistência técnica especializada em computadores e celulares.

O sistema organiza os atendimentos por meio do cadastro de clientes, técnicos, equipamentos e Ordens de Serviço (OS).

Os clientes podem solicitar serviços e acompanhar seus atendimentos. Os administradores gerenciam as solicitações e atribuem técnicos responsáveis. Os técnicos registram diagnósticos, soluções e atualizações dos serviços.

O projeto utiliza uma arquitetura composta por front-end web, API REST e banco de dados relacional MySQL.

## 2. Objetivo da Sprint 2

O objetivo desta etapa é implementar uma versão funcional do TechFlow OS, incluindo:

- Organização do front-end e back-end.
- Integração com o banco de dados MySQL.
- Desenvolvimento de uma API REST.
- Implementação das operações CRUD.
- Desenvolvimento das principais interfaces.
- Autenticação e controle de permissões.
- Validação dos dados e tratamento de erros.
- Acompanhamento de Ordens de Serviço.
- Documentação dos endpoints.
- Testes funcionais e automatizados.
- Versionamento com Git e GitHub.

## 3. Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript | Interatividade e integração com a API |
| Node.js | Ambiente de execução do back-end |
| Express | Desenvolvimento da API REST |
| MySQL | Banco de dados relacional |
| mysql2 | Comunicação entre Node.js e MySQL |
| BCrypt | Proteção das senhas |
| JWT | Autenticação dos usuários |
| Jest | Testes automatizados |
| Git e GitHub | Versionamento do código |

## 4. Funcionalidades principais

### 4.1. Clientes

- Cadastro de clientes.
- Login e autenticação.
- Atualização de informações cadastrais.
- Cadastro de equipamentos.
- Abertura de Ordens de Serviço.
- Consulta das próprias solicitações.
- Acompanhamento do andamento dos serviços.

### 4.2. Administrador

- Visualização do dashboard administrativo.
- Consulta e gerenciamento de clientes.
- Cadastro e gerenciamento de técnicos.
- Consulta e gerenciamento das OS.
- Atribuição de técnicos responsáveis.
- Acompanhamento dos status.
- Consulta do histórico dos atendimentos.
- Cancelamento de Ordens de Serviço.
- Exclusão lógica de OS, conforme as regras de negócio.

### 4.3. Técnicos

- Login no painel do técnico.
- Consulta de OS atribuídas.
- Registro de diagnósticos.
- Registro das soluções aplicadas.
- Atualização do status dos serviços.
- Conclusão dos atendimentos.
- Registro de ocorrências.

### 4.4. Funcionalidades auxiliares

O sistema também contempla funcionalidades relacionadas a:

- Calendário.
- Agendamentos.
- Histórico de status.
- Histórico de atribuições.
- Ocorrências dos atendimentos.
- Informações logísticas.

## 5. Estrutura de pastas

A estrutura principal do projeto é:

```text
TechFlow-OS/
|
|-- backend/
|   |-- database/
|   |-- middlewares/
|   |-- routes/
|   |   |-- ordensServico.js
|   |   |-- exclusaoOS.js
|   |   |-- atribuicoes.js
|   |   |-- historicoOS.js
|   |   |-- agendamentos.js
|   |   |-- ocorrencias.js
|   |
|   |-- tests/
|   |-- utils/
|   |-- .env.example
|   |-- API.md
|   |-- package.json
|   |-- package-lock.json
|   |-- server.js
|
|-- banco-de-dados/
|   |-- techflow.sql
|   |-- dados-iniciais.sql
|
|-- frontend/
|   |-- assets/
|   |-- img/
|   |-- techflow-Login-cliente/
|   |-- techflow-solicitacao/
|   |-- tela-admin/
|   |-- tela-login/
|   |-- tela-principal/
|   |-- tela-tecnico/
|
|-- .gitignore
|-- INICIAR-TECHFLOW.md
|-- README.md
```

**backend:** contém o servidor, as rotas REST, a autenticação, as validações e a comunicação com o MySQL.

**frontend:** contém as interfaces HTML, CSS e JavaScript do sistema.

**banco-de-dados:** contém os scripts SQL de estrutura e dados iniciais.

**tests:** contém os testes automatizados do projeto.

## 6. Banco de dados

O TechFlow utiliza MySQL para armazenar as informações do sistema.

As principais tabelas são:

- `Usuarios`
- `Equipamentos`
- `Categorias`
- `TiposServico`
- `OrdensServico`
- `HistoricoAtribuicoes`
- `HistoricoStatus`
- `OcorrenciasOS`
- `AgendamentosOS`

Os relacionamentos entre as tabelas permitem associar clientes, equipamentos, técnicos e atendimentos, preservando a integridade dos registros.

### 6.1. Configuração inicial

1. Instale e configure o MySQL.
2. Abra o MySQL Workbench.
3. Prepare o banco utilizando o script `banco-de-dados/techflow.sql`, em um ambiente novo.
4. Confira as instruções e os dados de `dados-iniciais.sql`.
5. Configure as credenciais de conexão no back-end.

**Atenção:** scripts que recriam tabelas podem apagar dados existentes. Não execute scripts de recriação sobre um banco com informações importantes sem realizar um backup.

### 6.2. Exclusão lógica de Ordens de Serviço

A tabela `OrdensServico` possui o campo:

```sql
excluidaEm DATETIME NULL DEFAULT NULL
```

Esse campo identifica quando uma Ordem de Serviço foi excluída logicamente.

- `NULL`: a OS não foi excluída.
- Data e hora preenchidas: a OS foi excluída logicamente.

Os registros excluídos permanecem armazenados no MySQL, mas deixam de aparecer nas consultas normais da API.

## 7. Como executar o projeto

### 7.1. Requisitos

É necessário ter instalado:

- Node.js e npm.
- MySQL.
- Navegador web.
- Editor de código, como VS Code.
- Git, para clonar o repositório.

### 7.2. Obter o projeto

Clone o repositório:

```bash
git clone https://github.com/bordin010/Projeto-TechFlow.git
```

Entre na pasta criada:

```bash
cd Projeto-TechFlow
```

### 7.3. Instalar as dependências

Acesse a pasta do back-end:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

### 7.4. Configurar as variáveis de ambiente

Na pasta `backend`, crie um arquivo chamado `.env`, utilizando `.env.example` como referência.

Configure as informações necessárias à conexão com o MySQL e à autenticação JWT.

Exemplos de variáveis utilizadas:

```env
DB_PASSWORD=SENHA_DO_MYSQL
JWT_SECRET=CHAVE_SECRETA_SEGURA_COM_32_CARACTERES_OU_MAIS
```

Consulte o arquivo `.env.example` e o módulo de conexão para identificar as demais variáveis necessárias.

**Importante:**

- Utilize credenciais válidas do banco local.
- Configure uma chave JWT segura.
- Não publique o arquivo `.env` no GitHub.
- Nunca compartilhe senhas ou chaves reais.

### 7.5. Iniciar o servidor

Na pasta `backend`, execute:

```bash
node server.js
```

O servidor utiliza a porta 3000:

```text
http://localhost:3000
```

Mantenha o terminal aberto enquanto utiliza o sistema.

### 7.6. Acessar as interfaces

**Página principal:**

```text
http://localhost:3000/frontend/tela-principal/index.html
```

**Cadastro e login de clientes:**

```text
http://localhost:3000/frontend/techflow-Login-cliente/index.html
```

**Solicitação de serviços:**

```text
http://localhost:3000/frontend/techflow-solicitacao/index.html
```

**Login de administradores e técnicos:**

```text
http://localhost:3000/frontend/tela-login/index.html
```

Os usuários são direcionados às funcionalidades correspondentes ao perfil autenticado.

**Atenção:** para utilizar as funcionalidades da API, abra as páginas pelo servidor Express na porta 3000. Não utilize o Live Server na porta 5500 para testar essas requisições.

## 8. Como utilizar o TechFlow

### Etapa 1 — Cliente

O cliente realiza seu cadastro, efetua login, informa seu equipamento e abre uma OS descrevendo o problema.

### Etapa 2 — Administrador

O administrador consulta a solicitação recebida, verifica suas informações e atribui um técnico responsável.

### Etapa 3 — Técnico

O técnico acessa seu painel, consulta a OS atribuída e registra o diagnóstico do equipamento.

Após realizar o reparo, informa a solução aplicada e atualiza o status do atendimento.

### Etapa 4 — Conclusão

Com as informações necessárias registradas, o técnico pode concluir a Ordem de Serviço.

### Etapa 5 — Acompanhamento

O cliente acessa sua conta e consulta o andamento de suas solicitações.

## 9. Operações CRUD

A API disponibiliza operações de cadastro, consulta, atualização e gerenciamento dos registros.

### 9.1. Clientes e técnicos

Os registros de clientes e técnicos utilizam desativação lógica para preservar seus relacionamentos com as Ordens de Serviço.

### 9.2. Ordens de Serviço

As operações principais incluem:

| Método HTTP | Operação |
|---|---|
| POST | Cadastrar OS |
| GET | Consultar OS |
| PUT/PATCH | Atualizar informações ou status, conforme a rota |
| DELETE | Excluir logicamente uma OS |

As rotas completas e seus parâmetros estão documentados em `backend/API.md`.

### 9.3. Exclusão lógica

O método:

```http
DELETE /api/ordens-servico/:id
```

permite que um administrador realize a exclusão lógica de uma OS.

Condições implementadas:

- O usuário deve estar autenticado.
- Somente administradores podem executar a operação.
- A OS deve estar `Aberta` ou `Cancelada`.
- A OS não pode possuir técnico atribuído.
- Ordens concluídas não podem ser excluídas.
- Uma OS já excluída não pode ser excluída novamente.

Ao executar a exclusão:

1. O sistema preenche `excluidaEm`.
2. O status é definido como `Cancelada`.
3. A justificativa da exclusão é registrada quando ainda não existe.
4. A alteração de status é registrada no histórico, quando necessária.
5. A OS deixa de aparecer nas consultas normais.
6. Os dados continuam preservados no MySQL.

### 9.4. Diferença entre cancelar e excluir

**Cancelamento:** modifica o status da OS, mantendo-a disponível para consultas autorizadas.

**Exclusão lógica:** registra a exclusão administrativa e oculta a OS das consultas normais da API.

A exclusão lógica não utiliza o comando SQL `DELETE` para remover fisicamente o atendimento.

### 9.5. Resposta de sucesso

Exemplo de resposta da API:

```json
{
  "mensagem": "Ordem de Serviço excluída com sucesso!",
  "idOS": 9,
  "tipoExclusao": "logica"
}
```

## 10. Validações e segurança

O sistema implementa mecanismos de validação e proteção, incluindo:

- Verificação de campos obrigatórios.
- Validação de CPF.
- Validação de e-mail.
- Verificação de cadastros duplicados.
- Proteção das senhas com BCrypt.
- Autenticação JWT.
- Controle de permissões por perfil.
- Restrição de acesso às OS de outros usuários.
- Tratamento de erros da API.
- Bloqueio de alterações em OS excluídas.

### 10.1. Perfis de acesso

**Cliente:** pode consultar suas próprias Ordens de Serviço.

**Técnico:** pode consultar e atender as Ordens de Serviço atribuídas a ele.

**Administrador:** possui permissões de gerenciamento do sistema, respeitando as regras de negócio.

### 10.2. Respostas HTTP

A API utiliza códigos HTTP para indicar o resultado das operações.

| Código | Significado |
|---|---|
| 200 | Requisição realizada com sucesso |
| 201 | Recurso criado |
| 400 | Dados inválidos ou regra de negócio não atendida |
| 401 | Autenticação necessária ou inválida |
| 403 | Operação sem permissão |
| 404 | Recurso não encontrado |
| 409 | Conflito, quando aplicável |
| 500 | Erro interno do servidor |

## 11. Testes realizados

O projeto utiliza Jest para executar testes automatizados.

Para executar os testes, abra um terminal na pasta `backend`:

```bash
npm test
```

### 11.1. Resultado dos testes automatizados

Último resultado confirmado durante a Sprint 2:

```text
Test Suites: 5 passed, 5 total
Tests:       12 passed, 12 total
```

Todos os 12 testes automatizados existentes passaram após as alterações realizadas.

### 11.2. Testes manuais

Foram realizados testes funcionais envolvendo:

- Cadastro e login de clientes.
- Cadastro de técnicos.
- Abertura de Ordens de Serviço.
- Atribuição de técnicos.
- Registro de diagnósticos e soluções.
- Atualização e conclusão de atendimentos.
- Acompanhamento das OS pelos clientes.
- Verificação de permissões.
- Consulta de agendamentos.
- Registro de ocorrências.

### 11.3. Testes da exclusão lógica

Foi criada a Ordem de Serviço **#9**, exclusivamente para testar a funcionalidade DELETE.

Condições iniciais:

```text
OS: 9
Cliente: 16
Técnico: NULL
Status: Aberta
Excluída: NULL
```

Os seguintes testes foram realizados:

| Teste | Resultado |
|---|---|
| DELETE pelo cliente | HTTP 403 |
| DELETE pelo administrador | HTTP 200 |
| Consulta individual após exclusão | HTTP 404 |
| Presença na listagem após exclusão | Não aparece |
| Tentativa de alteração após exclusão | HTTP 404 |
| Preservação do registro no MySQL | Confirmada |
| Preservação do histórico | Confirmada |

Após a exclusão, o registro apresentou:

```text
OS: 9
Status: Cancelada
excluidaEm: 2026-11-11 21:25:30
Justificativa: Exclusão lógica pelo administrador
```

O histórico registrou a criação da OS como `Aberta` e sua alteração de `Aberta` para `Cancelada`.

Esses resultados demonstram o funcionamento da exclusão lógica nos cenários manuais executados.

**Observação:** os 12 testes automatizados existentes passaram, mas ainda não incluem uma suíte específica para o método DELETE. Os testes dessa funcionalidade foram executados manualmente.

## 12. Documentação da API

A documentação técnica está disponível no arquivo:

```text
backend/API.md
```

O documento apresenta:

- Endpoints disponíveis.
- Métodos HTTP.
- Parâmetros utilizados.
- Exemplos de requisições.
- Exemplos de respostas.
- Códigos HTTP.
- Permissões e validações.
- Regras de exclusão lógica.

## 13. Versionamento

O projeto utiliza Git e GitHub para controlar as versões do código-fonte.

**Repositório:**

https://github.com/bordin010/Projeto-TechFlow

**Branch principal:** `main`

O arquivo `.gitignore` é utilizado para impedir o versionamento de dependências locais, configurações privadas e arquivos temporários.

As alterações relacionadas ao DELETE foram enviadas ao repositório após a validação dos testes.

## 14. Considerações finais

A Sprint 2 do TechFlow OS teve como objetivo desenvolver a estrutura funcional do sistema de gerenciamento de Ordens de Serviço.

Foram integrados o front-end, a API REST e o banco de dados MySQL, permitindo realizar as principais operações de gerenciamento dos atendimentos.

A aplicação contempla autenticação, permissões por perfil, validações, acompanhamento de serviços, histórico de alterações e exclusão lógica de Ordens de Serviço.

A implementação do método DELETE demonstra a aplicação de regras de negócio para preservar a integridade dos registros, evitando a perda de informações históricas.

O resultado é uma aplicação acadêmica funcional, organizada e preparada para apresentação e avaliação, com possibilidades de melhorias futuras.

---

**Projeto:** TechFlow OS

**Etapa:** Sprint 2 — Implementação Funcional

**Finalidade:** Projeto acadêmico

**Integrantes:**
- Enzo Dominone Bordin
- Enzo Predasoli
- Davi Rodrigues Moreira da Silva
- Enzo Miguel Ribeiro Farias

**Disciplina:** Desenvolvimento de Sistemas (DS)

**Professor:** Eduardo Falabella