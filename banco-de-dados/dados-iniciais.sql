-- ============================================
-- TECHFLOW OS
-- DADOS INICIAIS - SPRINT 2
-- ============================================
--
-- Objetivo:
-- Cadastrar categorias e tipos de serviço
-- necessários ao funcionamento inicial.
--
-- Seguro para executar novamente:
-- evita inserir registros duplicados.
--
-- Este script NÃO apaga registros existentes.
-- ============================================

USE techflow;

-- ============================================
-- 1. CATEGORIAS
-- ============================================

INSERT INTO Categorias (
    nomeCategoria,
    descricao,
    ativo
)
SELECT
    'Informática',
    'Computadores e notebooks',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM Categorias
    WHERE nomeCategoria = 'Informática'
);

INSERT INTO Categorias (
    nomeCategoria,
    descricao,
    ativo
)
SELECT
    'Celulares e Smartphones',
    'Celulares e dispositivos móveis',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM Categorias
    WHERE nomeCategoria = 'Celulares e Smartphones'
);

-- ============================================
-- 2. TIPOS DE SERVIÇO
-- ============================================

INSERT INTO TiposServico (
    nomeServico,
    descricao,
    ativo
)
SELECT
    'Manutenção',
    'Manutenção de computadores e celulares',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM TiposServico
    WHERE nomeServico = 'Manutenção'
);

INSERT INTO TiposServico (
    nomeServico,
    descricao,
    ativo
)
SELECT
    'Troca de Tela de Celular',
    'Substituição ou reparo de tela',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM TiposServico
    WHERE nomeServico = 'Troca de Tela de Celular'
);

INSERT INTO TiposServico (
    nomeServico,
    descricao,
    ativo
)
SELECT
    'Diagnóstico Técnico',
    'Avaliação inicial para identificar o problema',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM TiposServico
    WHERE nomeServico = 'Diagnóstico Técnico'
);

-- ============================================
-- 3. CONFERÊNCIA DOS CADASTROS
-- ============================================

SELECT
    idCategoria,
    nomeCategoria,
    descricao,
    ativo
FROM Categorias
ORDER BY idCategoria;

SELECT
    idTipoServico,
    nomeServico,
    descricao,
    ativo
FROM TiposServico
ORDER BY idTipoServico;

-- ============================================
-- OBSERVAÇÃO
-- ============================================
--
-- O cadastro inicial de usuários ainda precisa
-- ser configurado.
--
-- As senhas devem ser armazenadas usando BCrypt,
-- conforme a autenticação do TechFlow.
--
-- Não inserir senhas em texto puro.
--
-- ============================================
-- FIM DOS DADOS INICIAIS
-- ============================================