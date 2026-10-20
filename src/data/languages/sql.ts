import { LanguageDefinition } from '../../types';

export const sqlDefinition: LanguageDefinition = {
  id: 'sql',
  name: 'SQL & Banco de Dados Relacional',
  vscodeLanguageIds: ['sql'],
  fileExtensions: ['.sql'],
  description: 'Linguagem padrão para consultas, criação e manipulação em bancos de dados relacionais (PostgreSQL, MySQL).',
  badge: 'ANSI SQL / PostgreSQL',
  color: '#e38c00',
  snippets: [
    // ==========================================
    // JOINS DIDÁTICOS
    // ==========================================
    {
      id: 'sql-joins-explained',
      title: 'JOINs: INNER, LEFT, RIGHT e FULL com Casos Práticos',
      category: 'database_sql',
      level: 'Iniciante',
      summary: 'Como combinar registros entre tabelas relacionadas sem perder dados.',
      keywords: ['join', 'inner join', 'left join', 'right join', 'on', 'relacionamento'],
      completionTrigger: 'sql-join-examples',
      code: `-- 1. INNER JOIN: Retorna APENAS registros que possuem correspondência em ambas as tabelas
SELECT 
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    p.id AS pedido_id,
    p.valor_total
FROM clientes c
INNER JOIN pedidos p ON p.cliente_id = c.id;

-- 2. LEFT JOIN: Retorna TODOS os clientes, mesmo aqueles que NUNCA fizeram nenhum pedido!
SELECT 
    c.id,
    c.nome,
    COALESCE(SUM(p.valor_total), 0) AS total_gasto
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nome;

-- Dica Pro: Encontrar clientes inativos (que nunca compraram):
SELECT c.id, c.nome
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL; -- Filtra quem não tem nenhum pedido correspondente`,
      explanation: 'INNER JOIN funciona como a intersecção de conjuntos (A ∩ B). LEFT JOIN preserva 100% dos dados da tabela da esquerda (A), preenchendo com NULL onde não houver correspondência na direita (B).',
      bestPractices: [
        'Sempre use aliases curtos e claros (ex: c para clientes, p para pedidos).',
        'Use LEFT JOIN quando a relação puder ser opcional ou zero-para-muitos.',
        'Use COALESCE(coluna, valor_padrao) para substituir valores nulos por zeros em relatórios.'
      ]
    },

    // ==========================================
    // ÍNDICES & PERFORMANCE
    // ==========================================
    {
      id: 'sql-indexes-performance',
      title: 'Índices B-Tree, Otimização e o Perigo do SELECT *',
      category: 'database_sql',
      level: 'Intermediário',
      summary: 'Como índices transformam buscas lentas (Seq Scan O(N)) em buscas logarítmicas rápidas (Index Scan O(log N)).',
      keywords: ['index', 'create index', 'explain analyze', 'performance', 'btree'],
      completionTrigger: 'sql-index-opt',
      code: `-- 1. Criação de Índice B-Tree para buscas exatas e ordenação rápida:
CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data_pedido DESC);

-- 2. Índice Único (garante integridade de negócio além de acelerar busca):
CREATE UNIQUE INDEX idx_usuarios_cpf ON usuarios (cpf);

-- 3. Inspecionando o Plano de Execução do Banco de Dados:
EXPLAIN ANALYZE
SELECT id, status, valor_total
FROM pedidos
WHERE cliente_id = 42
ORDER BY data_pedido DESC
LIMIT 10;`,
      badCode: `-- ❌ Anti-padrão de performance: Buscar todas as colunas
SELECT * FROM pedidos WHERE UPPER(email) = 'TESTE@EMAIL.COM';`,
      badCodeExplanation: "Usar SELECT * transfere dados desnecessários pela rede e impede o uso de Covering Indexes. Além disso, aplicar funções em colunas indexadas (ex: UPPER(email)) invalida o índice B-Tree convencional, forçando um Scan sequencial completo na tabela.",
      explanation: 'Índices são estruturas balanceadas que guardam ponteiros ordenados para as linhas da tabela. Se você aplicar uma função sobre a coluna no WHERE (ex: WHERE YEAR(data) = 2024), o banco não consegue usar o índice tradicional a menos que exista um Functional Index.',
      bestPractices: [
        'Especifique apenas as colunas que você realmente precisa em vez de SELECT *.',
        'Crie índices nas chaves estrangeiras (Foreign Keys) e colunas usadas em WHERE e ORDER BY frequentes.'
      ]
    },

    // ==========================================
    // TRANSAÇÕES ACID
    // ==========================================
    {
      id: 'sql-acid-transactions',
      title: 'Transações ACID: Atomicidade e Consistência',
      category: 'database_sql',
      level: 'Intermediário',
      summary: 'Garante que um conjunto de operações bancárias ou críticas seja executado por completo ou desfeito 100%.',
      keywords: ['transaction', 'begin', 'commit', 'rollback', 'acid'],
      completionTrigger: 'sql-acid-tx',
      code: `-- Exemplo: Transferência de saldo entre duas contas bancárias
BEGIN TRANSACTION;

-- 1. Debita da conta de origem:
UPDATE contas 
SET saldo = saldo - 150.00 
WHERE id = 101 AND saldo >= 150.00;

-- 2. Credita na conta de destino:
UPDATE contas 
SET saldo = saldo + 150.00 
WHERE id = 202;

-- 3. Registra o extrato de auditoria:
INSERT INTO historico_transferencias (origem_id, destino_id, valor, data_hora)
VALUES (101, 202, 150.00, NOW());

-- Se todas as operações foram bem-sucedidas, confirma a transação:
COMMIT;

-- Caso ocorra qualquer erro em uma das etapas, desfaz tudo:
-- ROLLBACK;`,
      explanation: 'O "A" do ACID significa Atomicidade: todas as instruções SQL dentro do bloco BEGIN...COMMIT são tratadas como uma única unidade indivisível. Se o servidor cair no meio, o ROLLBACK desfaz qualquer alteração parcial.',
      bestPractices: [
        'Mantenha blocos de transação o mais curtos possível para evitar retenção de locks (travamentos) nas tabelas.',
        'Sempre valide condições de saldo (ex: saldo >= valor) na própria query UPDATE para evitar race conditions.'
      ]
    }
  ]
};
