# TechFlow OS

### Sistema de Gerenciamento de Ordens de Serviço

**Projeto acadêmico — Sprint 2: Implementação Funcional**

---

## 1. Sobre o projeto

O **TechFlow OS** é um sistema web desenvolvido para auxiliar no gerenciamento de uma assistência técnica especializada em computadores e celulares.

O projeto busca organizar os atendimentos, permitindo o cadastro de clientes, técnicos, equipamentos e Ordens de Serviço.

Através do sistema, os clientes podem solicitar serviços e acompanhar seu andamento, enquanto os administradores gerenciam as solicitações e os técnicos registram os procedimentos realizados.

O sistema foi desenvolvido como projeto acadêmico, com foco na implementação de uma aplicação web integrada a uma API REST e a um banco de dados relacional.

## 2. Objetivo da Sprint 2

O objetivo desta etapa é implementar a estrutura funcional do TechFlow OS, incluindo:

- Organização dos projetos front-end e back-end.
- Criação e integração do banco de dados.
- Desenvolvimento de uma API REST.
- Implementação das operações CRUD.
- Desenvolvimento das principais interfaces.
- Validação dos dados e tratamento de erros.
- Documentação dos endpoints.
- Versionamento do código utilizando Git e GitHub.

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
| JWT | Autenticação de usuários |
| Jest | Testes automatizados |
| Git e GitHub | Versionamento do projeto |

## 4. Funcionalidades principais

### Clientes

- Cadastro de clientes.
- Login e autenticação.
- Atualização de informações cadastrais.
- Cadastro de equipamentos.
- Abertura de Ordens de Serviço.
- Consulta e acompanhamento dos próprios atendimentos.

### Administrador

- Visualização do dashboard inicial.
- Consulta e gerenciamento de clientes.
- Cadastro e gerenciamento de técnicos.
- Consulta das Ordens de Serviço.
- Atribuição de técnicos aos atendimentos.
- Acompanhamento dos status das OS.

### Técnicos

- Login no painel do técnico.
- Consulta das Ordens de Serviço atribuídas.
- Registro de diagnóstico.
- Registro da solução aplicada.
- Atualização do status dos serviços.
- Conclusão dos atendimentos.

O projeto também possui funcionalidades auxiliares de calendário, agendamentos, ocorrências e consulta de informações logísticas.

## 5. Estrutura de pastas

O projeto está organizado da seguinte forma:

```text
TechFlow-OS/
│
├── backend/
│   ├── database/
│   ├── middlewares/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── .env.example
│   ├── API.md
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── banco-de-dados/
│   ├── techflow.sql
│   └── dados-iniciais.sql
│
├── frontend/
│   ├── assets/
│   ├── img/
│   ├── techflow-Login-cliente/
│   ├── techflow-solicitacao/
│   ├── tela-admin/
│   ├── tela-login/
│   ├── tela-principal/
│   └── tela-tecnico/
│
├── .gitignore
├── INICIAR-TECHFLOW.md
└── README.md
```

**backend:** contém o servidor, as rotas da API, os middlewares, as validações e a conexão com o MySQL.

**frontend:** contém as interfaces HTML, CSS e JavaScript do sistema.

**banco-de-dados:** contém os scripts SQL utilizados na configuração do banco.

## 6. Banco de dados

O TechFlow utiliza o banco de dados MySQL.

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

Essas tabelas permitem armazenar os dados e manter os relacionamentos entre clientes, equipamentos, técnicos e atendimentos.

### Configuração inicial

1. Instale e configure o MySQL.
2. Abra o MySQL Workbench.
3. Utilize o script `banco-de-dados/techflow.sql` para preparar a estrutura do banco em um ambiente novo.
4. Configure a conexão no back-end.
5. Confira os dados iniciais necessários à execução do projeto.

**Atenção:** o script de criação do banco pode conter instruções de exclusão e recriação de tabelas. Não execute o script sobre um banco que contenha dados importantes sem realizar um backup.

O arquivo `dados-iniciais.sql` deve ser conferido antes da execução.

## 7. Como executar o projeto

### Requisitos

É necessário ter instalado:

- Node.js
- npm
- MySQL
- Um navegador web
- Um editor de código, como VS Code

### Passo 1 — Obter o projeto

Clone o repositório:

```bash
git clone https://github.com/bordin010/Projeto-TechFlow.git
```

Entre na pasta:

```bash
cd Projeto-TechFlow
```

### Passo 2 — Instalar as dependências

Acesse a pasta do back-end:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

### Passo 3 — Configurar o ambiente

Na pasta `backend`, crie um arquivo chamado `.env`, utilizando `.env.example` como referência.

Configure as informações necessárias à conexão com o MySQL e à autenticação JWT.

Entre as variáveis utilizadas estão:

```env
DB_PASSWORD=SENHA_DO_MYSQL
JWT_SECRET=CHAVE_SECRETA_DE_DESENVOLVIMENTO
```

Os valores acima são apenas exemplos e devem ser substituídos por configurações apropriadas.

**Nunca publique senhas reais ou chaves JWT no GitHub.**

### Passo 4 — Iniciar o servidor

Ainda na pasta `backend`, execute:

```bash
node server.js
```

O servidor ficará disponível em:

```text
http://localhost:3000
```

### Passo 5 — Acessar o sistema

Abra o navegador e utilize os endereços:

**Página principal**

http://localhost:3000/frontend/tela-principal/index.html

**Cadastro e login de clientes**

http://localhost:3000/frontend/techflow-Login-cliente/index.html

**Solicitação de serviços**

http://localhost:3000/frontend/techflow-solicitacao/index.html

**Login de administradores e técnicos**

http://localhost:3000/frontend/tela-login/index.html

Os painéis administrativos e técnicos são acessados conforme o perfil autenticado.

**Importante:** utilize as páginas disponibilizadas pelo Express na porta `3000`. Não utilize o Live Server para testar as requisições da API.

## 8. Como utilizar o TechFlow

O funcionamento principal do sistema segue as etapas abaixo.

### Etapa 1 — Cliente

O cliente realiza seu cadastro, efetua login, informa seu equipamento e abre uma Ordem de Serviço descrevendo o problema.

### Etapa 2 — Administrador

O administrador consulta a nova solicitação no painel e atribui um técnico responsável pelo atendimento.

### Etapa 3 — Técnico

O técnico acessa seu painel, consulta a OS atribuída e registra o diagnóstico do equipamento.

Após executar o reparo, informa a solução aplicada e atualiza o status da OS.

### Etapa 4 — Conclusão

Quando o diagnóstico e a solução aplicada estão registrados, o técnico pode concluir a Ordem de Serviço.

### Etapa 5 — Acompanhamento

O cliente acessa sua conta e acompanha a situação de sua Ordem de Serviço.

## 9. Operações CRUD

A API implementa operações de cadastro, consulta e atualização dos registros.

Para clientes e técnicos, a exclusão é realizada através de **desativação lógica**.

Isso significa que os registros permanecem armazenados no banco, preservando os relacionamentos e históricos existentes.

Nas Ordens de Serviço, o sistema utiliza cancelamento controlado em vez de exclusão física.

O cancelamento modifica o status da OS e registra a justificativa, preservando os dados para consultas posteriores.

As rotas e os métodos HTTP estão documentados em `backend/API.md`.

## 10. Validações e segurança

O sistema implementa:

- Validação de campos obrigatórios.
- Validação de CPF e e-mail.
- Verificação de cadastros duplicados.
- Proteção de senhas com BCrypt.
- Autenticação com JWT.
- Controle de acesso por perfil.
- Restrição de acesso às OS de outros usuários.
- Tratamento de erros na API.

O cliente consulta apenas suas próprias Ordens de Serviço.

O técnico consulta e atende apenas as Ordens de Serviço atribuídas a ele.

O administrador possui permissões de gerenciamento do sistema.

## 11. Testes realizados

O projeto possui testes automatizados utilizando Jest.

Para executá-los, abra o terminal na pasta `backend`:

```bash
npm test
```

### Resultado obtido durante a Sprint 2

```text
Test Suites: 5 passed, 5 total
Tests:       12 passed, 12 total
```

Também foram realizados testes manuais, incluindo:

- Cadastro e login de clientes.
- Cadastro de técnicos.
- Abertura de Ordens de Serviço.
- Atribuição de técnicos.
- Registro de diagnóstico e solução aplicada.
- Atualização e conclusão dos serviços.
- Acompanhamento das OS pelo cliente.
- Verificação de permissões utilizando respostas HTTP 403.
- Consulta de agendamentos.
- Registro de ocorrências.

Os resultados demonstraram o funcionamento das operações verificadas durante o desenvolvimento.

## 12. Documentação da API

A documentação técnica completa está disponível no arquivo:

**`backend/API.md`**

Esse documento apresenta:

- Endpoints disponíveis.
- Métodos HTTP.
- Parâmetros utilizados.
- Exemplos de requisições.
- Exemplos de respostas.
- Códigos HTTP.
- Permissões e validações.

## 13. Versionamento

O projeto utiliza Git para controlar as versões do código-fonte.

O repositório está hospedado no GitHub:

https://github.com/bordin010/TechFlow-OS

A branch principal é `main`.

O arquivo `.gitignore` protege configurações privadas e impede o envio de dependências locais e arquivos temporários.

## 14. Considerações finais

O desenvolvimento do TechFlow OS na Sprint 2 teve como foco a implementação de uma versão funcional inicial do sistema.

Foram integrados o front-end, a API REST e o banco de dados MySQL, permitindo realizar as principais operações de gerenciamento de Ordens de Serviço.

O projeto demonstra a utilização de tecnologias de desenvolvimento web, persistência de dados, operações CRUD, validações e versionamento de código.

O resultado é uma aplicação acadêmica funcional, organizada e preparada para apresentação e avaliação.

---

**Projeto:** TechFlow OS  
**Etapa:** Sprint 2 — Implementação Funcional  
**Finalidade:** Projeto acadêmico

**Integrantes:** [Enzo Dominone Bordin, Enzo Predasoli, Davi Rodrigues Moreira da Silva e Enzo Miguel Ribeiro Farias]  
**Disciplina:** [Desenvolvimento de Sistemas (DS)]  
**Professor:** [Eduardo Falabella]