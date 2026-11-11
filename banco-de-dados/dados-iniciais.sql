-- TechFlow: cadastros mínimos para BANCO NOVO (seguro para executar novamente).
-- Não altera nem apaga registros existentes.
USE techflow;

INSERT INTO Categorias (nomeCategoria, descricao, ativo)
SELECT 'Informática', 'Computadores e notebooks', 1
WHERE NOT EXISTS (SELECT 1 FROM Categorias WHERE nomeCategoria = 'Informática');

INSERT INTO Categorias (nomeCategoria, descricao, ativo)
SELECT 'Celulares e Smartphones', 'Celulares e dispositivos móveis', 1
WHERE NOT EXISTS (SELECT 1 FROM Categorias WHERE nomeCategoria = 'Celulares e Smartphones');

INSERT INTO TiposServico (nomeServico, descricao, ativo)
SELECT 'Manutenção', 'Manutenção de computadores e celulares', 1
WHERE NOT EXISTS (SELECT 1 FROM TiposServico WHERE nomeServico = 'Manutenção');

INSERT INTO TiposServico (nomeServico, descricao, ativo)
SELECT 'Troca de Tela de Celular', 'Substituição ou reparo de tela', 1
WHERE NOT EXISTS (SELECT 1 FROM TiposServico WHERE nomeServico = 'Troca de Tela de Celular');

INSERT INTO TiposServico (nomeServico, descricao, ativo)
SELECT 'Diagnóstico Técnico', 'Avaliação inicial para identificar o problema', 1
WHERE NOT EXISTS (SELECT 1 FROM TiposServico WHERE nomeServico = 'Diagnóstico Técnico');

SELECT idCategoria, nomeCategoria, ativo FROM Categorias;
SELECT idTipoServico, nomeServico, ativo FROM TiposServico;
