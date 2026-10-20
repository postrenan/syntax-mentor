"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescriptDefinition = void 0;
exports.typescriptDefinition = {
    id: 'typescript',
    name: 'TypeScript / JavaScript',
    vscodeLanguageIds: ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'],
    fileExtensions: ['.ts', '.tsx', '.js', '.jsx'],
    description: 'Superset tipado de JavaScript que compila para JavaScript puro e roda no Node.js e navegadores.',
    badge: 'TS 5.x / ES2024',
    color: '#3178c6',
    snippets: [
        // ==========================================
        // STRINGS & FORMATAÇÃO
        // ==========================================
        {
            id: 'ts-template-literals',
            title: 'Template Literals & Template Literal Types',
            category: 'strings',
            summary: 'Interpolação de expressões com crase (`...`) e tipos literais em nível de tipo.',
            keywords: ['template literal', 'interpolação', 'string type', 'crase'],
            completionTrigger: 'ts-template-string',
            code: `// 1. Interpolação e Strings Multi-linha:
const usuario = "Renan";
const role = "Admin";
const saudacao = \`Bem-vindo, \${usuario}!
Seu nível de acesso é: \${role.toUpperCase()}.\`;

// 2. TypeScript Superpower: Template Literal Types (Nível de Tipo):
type Evento = "click" | "hover" | "focus";
type Manipulador = \`on\${Capitalize<Evento>}\`; 
// Manipulador resulta em: "onClick" | "onHover" | "onFocus"

// 3. Métodos Essenciais de String:
const arquivo = "documento-final.pdf";
const ehPdf = arquivo.endsWith(".pdf");       // true
const contem = arquivo.includes("final");     // true
const limpo = "  texto  ".trim();             // "texto"
const partes = "A,B,C".split(",");            // ["A", "B", "C"]`,
            explanation: 'Template literals usam crases e suportam interpolação segura de variáveis e quebras de linha nativas sem precisar de \\n. No TypeScript, tipos literais de template permitem modelar eventos e rotas com verificação estática total.',
            bestPractices: [
                'Prefira template strings a concatenações com +.',
                'Use métodos modernos como .includes(), .startsWith() e .endsWith() em vez de .indexOf() !== -1.'
            ]
        },
        // ==========================================
        // ARRAYS & COLEÇÕES
        // ==========================================
        {
            id: 'ts-arrays-functional',
            title: 'Arrays: Métodos Funcionais (map, filter, reduce, flatMap)',
            category: 'arrays_and_collections',
            summary: 'Transformações declarativas e imutáveis sobre coleções em JavaScript/TypeScript.',
            keywords: ['array', 'map', 'filter', 'reduce', 'flatmap', 'find'],
            completionTrigger: 'ts-array-functional',
            code: `interface ItemPedido {
  id: number;
  produto: string;
  preco: number;
  qtd: number;
}

const itens: ItemPedido[] = [
  { id: 1, produto: "Teclado", preco: 250, qtd: 2 },
  { id: 2, produto: "Mouse", preco: 120, qtd: 1 },
  { id: 3, produto: "Monitor", preco: 1200, qtd: 2 },
];

// 1. Filter + Map (pipeline imutável):
const produtosCaros = itens
  .filter(item => item.preco > 200)
  .map(item => item.produto); // ["Teclado", "Monitor"]

// 2. Reduce (Acumulador para total):
const totalGeral = itens.reduce((acumulador, item) => {
  return acumulador + (item.preco * item.qtd);
}, 0); // 3020

// 3. Find e Some / Every:
const monitor = itens.find(item => item.id === 3); // Retorna ItemPedido | undefined
const temMuitoCaro = itens.some(item => item.preco > 1000); // true

// 4. Spread Operator para clonagem rasa e imutabilidade:
const novoItem: ItemPedido = { id: 4, produto: "Cabo HDMI", preco: 45, qtd: 1 };
const listaAtualizada = [...itens, novoItem];`,
            explanation: 'Métodos funcionais de array não alteram o array original; eles criam e retornam novos arrays ou valores acumulados, sendo fundamentais para código previsível e reativo (React, Node, etc.).',
            bestPractices: [
                'Evite mutações diretas com .push() ou .splice() quando estiver em paradigmas reativos.',
                'Sempre forneça o valor inicial no .reduce(fn, inicial) para evitar erros com arrays vazios.',
                'Use readonly T[] ou ReadonlyArray<T> em TypeScript para garantir imutabilidade estática.'
            ]
        },
        // ==========================================
        // TIPOS & GENÉRICS
        // ==========================================
        {
            id: 'ts-types-generics-utilities',
            title: 'Tipagem Avançada: Generics & Utility Types',
            category: 'variables_and_types',
            summary: 'Tipos genéricos reutilizáveis e tipos utilitários nativos (Partial, Pick, Omit, Record).',
            keywords: ['types', 'interface', 'generics', 'partial', 'omit', 'record'],
            completionTrigger: 'ts-generics-utility',
            code: `interface Usuario {
  id: string;
  nome: string;
  email: string;
  idade?: number;
}

// 1. Utility Types essenciais:
type UsuarioAtualizacao = Partial<Usuario>;          // Todos os campos viram opcionais
type Credenciais = Pick<Usuario, "email">;           // Apenas 'email'
type UsuarioSemId = Omit<Usuario, "id">;             // Todos exceto 'id'
type MapaUsuarios = Record<string, Usuario>;        // Objeto dicionário { [id: string]: Usuario }

// 2. Função Genérica Reutilizável:
function primeiroElemento<T>(lista: T[]): T | undefined {
  return lista.length > 0 ? lista[0] : undefined;
}

const n = primeiroElemento([10, 20, 30]);      // Tipo inferido: number | undefined
const s = primeiroElemento(["a", "b", "c"]);  // Tipo inferido: string | undefined`,
            explanation: 'Generics viabilizam código flexível e reutilizável mantendo a segurança estrita de tipos sem recorrer a "any". Utilitários como Partial e Omit evitam redundância de interfaces em APIs REST.',
            bestPractices: [
                'Nunca use any em código de produção; se o tipo for desconhecido, prefira unknown com checagem.',
                'Aproveite Partial<T> para payloads de atualização (PATCH).'
            ]
        },
        // ==========================================
        // CONTROLE DE FLUXO & CHECAGEM NULA
        // ==========================================
        {
            id: 'ts-optional-chaining-nullish',
            title: 'Optional Chaining (?.) e Nullish Coalescing (??)',
            category: 'control_flow',
            summary: 'Acesso seguro a propriedades profundamente aninhadas e fallback apenas para null ou undefined.',
            keywords: ['optional chaining', 'nullish coalescing', 'undefined', 'segurança'],
            completionTrigger: 'ts-optional-nullish',
            code: `interface Perfil {
  endereco?: {
    cidade?: string;
  };
  pontos?: number;
}

const perfil: Perfil = {
  pontos: 0 // Valor falsy em JS, mas válido matematicamente!
};

// 1. Optional Chaining (não dispara erro se endereco for undefined):
const cidade = perfil.endereco?.cidade ?? "Cidade não informada";

// 2. Nullish Coalescing (??) vs Operador OU (||):
// Com ||: 0 é considerado false, portanto pontosPadrao seria 100 (ERRADO!)
const pontosErrado = perfil.pontos || 100; // 100 (Bug!)

// Com ??: Só substitui se for estritamente null ou undefined!
const pontosCorreto = perfil.pontos ?? 100; // 0 (Correto!)`,
            explanation: 'O operador || trata valores falsy como 0, "" e false como inválidos. O operador ?? (Nullish Coalescing) avalia APENAS null e undefined, tornando-o ideal para valores numéricos e booleanos.',
            bestPractices: [
                'Prefira ?? no lugar de || para atribuir valores padrão seguros.',
                'Use ?. antes de invocar métodos opcionais: callback?.()'
            ]
        },
        // ==========================================
        // ASSÍNCRONO & PROMISES
        // ==========================================
        {
            id: 'ts-async-await-promise-all',
            title: 'Async/Await e Promise.allSettled',
            category: 'async_concurrency',
            summary: 'Tratamento moderno de operações assíncronas concorrentes sem quebrar em caso de falha parcial.',
            keywords: ['async', 'await', 'promise', 'allsettled', 'try-catch'],
            completionTrigger: 'ts-async-allsettled',
            code: `interface DadosAPI {
  status: string;
}

async function buscarServico(url: string): Promise<DadosAPI> {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(\`Falha na requisição: \${resposta.status}\`);
  }
  return resposta.json();
}

async function carregarDashboard() {
  try {
    // Promise.allSettled não quebra se um dos endpoints falhar!
    const resultados = await Promise.allSettled([
      buscarServico("https://api.exemplo.com/vendas"),
      buscarServico("https://api.exemplo.com/usuarios"),
    ]);

    resultados.forEach((res, index) => {
      if (res.status === "fulfilled") {
        console.log(\`Serviço \${index} sucesso:\`, res.value);
      } else {
        console.error(\`Serviço \${index} falhou:\`, res.reason);
      }
    });
  } catch (erro) {
    console.error("Erro inesperado:", erro);
  }
}`,
            explanation: 'Promise.all falha imediatamente se qualquer uma das promises for rejeitada (comportamento "short-circuit"). Já Promise.allSettled aguarda todas concluírem e devolve o status individual de cada uma com segurança.',
            bestPractices: [
                'Use Promise.allSettled quando as chamadas forem independentes entre si.',
                'Sempre cheque resposta.ok ao usar fetch nativo, pois erros 404 e 500 não rejeitam a promise automaticamente.'
            ]
        }
    ]
};
//# sourceMappingURL=typescript.js.map