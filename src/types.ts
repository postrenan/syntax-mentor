export type CategoryKey =
  | 'variables_and_types'
  | 'strings'
  | 'arrays_and_collections'
  | 'control_flow'
  | 'functions_and_methods'
  | 'oop_and_structs'
  | 'error_handling'
  | 'async_concurrency'
  | 'framework_web'
  | 'database_sql'
  | 'devops_containers'
  | 'git_workflow';

export type DifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface CategoryInfo {
  id: CategoryKey;
  label: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'variables_and_types',
    label: 'Tipos & Variáveis',
    icon: 'symbol-variable',
    description: 'Declaração, inferência de tipo, primitivos vs objetos e imutabilidade.'
  },
  {
    id: 'strings',
    label: 'Strings & Formatação',
    icon: 'quote',
    description: 'Concatenação, interpolação, imutabilidade, regex e utilitários de texto.'
  },
  {
    id: 'arrays_and_collections',
    label: 'Arrays & Coleções',
    icon: 'symbol-array',
    description: 'Arrays estáticos, listas dinâmicas, mapas/dicionários, conjuntos e streams/iterações.'
  },
  {
    id: 'control_flow',
    label: 'Controle de Fluxo',
    icon: 'symbol-event',
    description: 'Condicionais (if/else/switch/pattern matching) e estruturas de repetição.'
  },
  {
    id: 'functions_and_methods',
    label: 'Funções & Métodos',
    icon: 'symbol-method',
    description: 'Assinaturas, parâmetros opcionais/rest, funções de alta ordem, lambdas e closures.'
  },
  {
    id: 'oop_and_structs',
    label: 'POO & Estruturas',
    icon: 'symbol-class',
    description: 'Classes, structs, interfaces/traits, construtores e herança/composição.'
  },
  {
    id: 'framework_web',
    label: 'Web & APIs (Spring)',
    icon: 'globe',
    description: 'Controladores REST, injeção de dependências, DTOs e validação.'
  },
  {
    id: 'database_sql',
    label: 'Banco de Dados & JPA',
    icon: 'database',
    description: 'Consultas SQL, JOINs, índices, transações ACID e Spring Data JPA.'
  },
  {
    id: 'devops_containers',
    label: 'Docker & DevOps',
    icon: 'package',
    description: 'Dockerfile multi-stage, Docker Compose, imagens leves e CLI.'
  },
  {
    id: 'git_workflow',
    label: 'Git & Versionamento',
    icon: 'git-branch',
    description: 'Rebase vs Merge, Stash, Cherry-pick, Undo e Conventional Commits.'
  },
  {
    id: 'error_handling',
    label: 'Tratamento de Erros',
    icon: 'warning',
    description: 'Exceções (checked/unchecked), blocos try/catch/finally e padrões Result/Option.'
  },
  {
    id: 'async_concurrency',
    label: 'Assíncrono & Concorrência',
    icon: 'symbol-misc',
    description: 'Promises, Async/Await, Threads, Tasks, Goroutines e canais.'
  }
];

export interface DidacticSnippet {
  id: string;
  title: string;
  summary: string;
  category: CategoryKey;
  level?: DifficultyLevel;
  code: string;
  badCode?: string;
  badCodeExplanation?: string;
  explanation: string;
  bestPractices: string[];
  commonPitfalls?: string[];
  completionTrigger?: string;
  keywords: string[];
}

export interface LanguageDefinition {
  id: string;
  name: string;
  vscodeLanguageIds: string[];
  fileExtensions: string[];
  description: string;
  badge: string;
  color: string;
  snippets: DidacticSnippet[];
}
