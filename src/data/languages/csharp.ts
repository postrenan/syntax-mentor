import { LanguageDefinition } from '../../types';

export const csharpDefinition: LanguageDefinition = {
  id: 'csharp',
  name: 'C# (.NET)',
  vscodeLanguageIds: ['csharp'],
  fileExtensions: ['.cs'],
  description: 'Linguagem moderna, orientada a objetos e fortemente tipada criada pela Microsoft para a plataforma .NET.',
  badge: 'C# 12 / .NET 8+',
  color: '#178600',
  snippets: [
    // ==========================================
    // STRINGS & FORMATAÇÃO
    // ==========================================
    {
      id: 'cs-strings-raw-interpolation',
      title: 'Strings: Interpolação ($), Verbatim (@) e Raw String Literals (""")',
      category: 'strings',
      summary: 'Interpolação moderna, caminhos com verbatim e strings brutas sem necessidade de escapar aspas.',
      keywords: ['string', 'interpolacao', 'verbatim', 'raw string', 'isnullorwhitespace'],
      completionTrigger: 'cs-string-interpolation',
      code: `string cliente = "Ana Souza";
decimal total = 1450.50m;

// 1. Interpolação de String com formato monetário:
string resumo = $"Cliente: {cliente}, Total: {total:C2}";

// 2. Verbatim String (@): ideal para caminhos de arquivo ou regex:
string caminhoWindows = @"C:\\Arquivos\\Sistema\\logs.txt";

// 3. Raw String Literals (C# 11+): três ou mais aspas duplas:
string jsonQuery = """
    {
        "nome": "Notebook Pro",
        "ativo": true
    }
    """;

// 4. Verificação de nulidade ou vazia segura:
string? entrada = "   ";
bool invalida = string.IsNullOrWhiteSpace(entrada); // true`,
      explanation: 'No C#, Raw String Literals permitem colar blocos de JSON, XML ou SQL sem precisar de sequências de escape como \\" ou \\n. O compilador remove automaticamente a indentação comum.',
      bestPractices: [
        'Use string.IsNullOrWhiteSpace() para validar dados de formulários e inputs.',
        'Prefira raw string literals para JSON e consultas em vez de concatenações.'
      ]
    },

    // ==========================================
    // ARRAYS & COLEÇÕES (LINQ)
    // ==========================================
    {
      id: 'cs-collections-linq',
      title: 'Coleções & LINQ: Consultas Expressivas sobre Dados',
      category: 'arrays_and_collections',
      summary: 'LINQ (Language Integrated Query) traz poder funcional com Where, Select, GroupBy e FirstOrDefault.',
      keywords: ['linq', 'list', 'where', 'select', 'firstordefault', 'dictionary'],
      completionTrigger: 'cs-linq-queries',
      code: `using System;
using System.Collections.Generic;
using System.Linq;

record Produto(int Id, string Nome, decimal Preco, string Categoria);

var produtos = new List<Produto>
{
    new(1, "Mouse Gamer", 150.00m, "Periféricos"),
    new(2, "Monitor 4K", 2800.00m, "Monitores"),
    new(3, "Teclado Mecânico", 350.00m, "Periféricos"),
};

// 1. LINQ: Filtro, ordenação e projeção
var resultado = produtos
    .Where(p => p.Preco > 200)
    .OrderByDescending(p => p.Preco)
    .Select(p => new { p.Nome, p.Preco })
    .ToList();

// 2. Busca de elemento único com fallback seguro:
Produto? monitor = produtos.FirstOrDefault(p => p.Id == 2);

// 3. Dicionário para acesso O(1):
Dictionary<int, Produto> mapaProdutos = produtos.ToDictionary(p => p.Id);`,
      explanation: 'LINQ utiliza execução adiada (deferred execution): filtros como .Where() só executam de verdade quando você consome os dados através de .ToList(), .ToArray() ou um loop foreach.',
      bestPractices: [
        'Cuidado com múltiplas enumerações de IEnumerable; chame .ToList() se for iterar mais de uma vez.',
        'Use FirstOrDefault() em vez de First() para evitar exceções caso o elemento não exista.'
      ]
    },

    // ==========================================
    // CONTROLE DE FLUXO & PATTERN MATCHING
    // ==========================================
    {
      id: 'cs-pattern-matching',
      title: 'Switch Expressions e Relational Pattern Matching',
      category: 'control_flow',
      summary: 'Expressões switch concisas com checagem de tipos, intervalos e guards lógicos.',
      keywords: ['switch', 'pattern matching', 'relational', 'when'],
      completionTrigger: 'cs-switch-expression',
      code: `int pontuacao = 85;

// Expressão switch com padrões relacionais (and, or, >, <):
string classificacao = pontuacao switch
{
    >= 90 => "Excelente (A)",
    >= 80 and < 90 => "Muito Bom (B)",
    >= 70 and < 80 => "Bom (C)",
    _ => "Necessita Melhoria" // _ funciona como descarte/default
};

// Pattern matching de tipos e propriedades:
object dado = "12345";
string tipoFormatado = dado switch
{
    int numero => $"Número inteiro: {numero}",
    string { Length: > 0 } texto => $"Texto não-vazio com {texto.Length} caracteres",
    null => "Nulo!",
    _ => "Tipo desconhecido"
};`,
      explanation: 'O C# moderno possui um dos sistemas de Pattern Matching mais avançados do mercado, permitindo inspecionar propriedades internas de objetos e faixas numéricas diretamente no switch.',
      bestPractices: [
        'Use expressões switch com a sintaxe de descarte _ no lugar de switch clássico com múltiplos breaks.'
      ]
    },

    // ==========================================
    // ASSÍNCRONO & TASKS
    // ==========================================
    {
      id: 'cs-async-task-whenall',
      title: 'Async/Await e Task.WhenAll no .NET',
      category: 'async_concurrency',
      summary: 'Programação assíncrona não-bloqueante baseada no modelo TAP (Task-based Asynchronous Pattern).',
      keywords: ['async', 'task', 'await', 'whenall', 'cancellationtoken'],
      completionTrigger: 'cs-async-task',
      code: `using System;
using System.Threading;
using System.Threading.Tasks;

public async Task ProcessarPedidosAsync(CancellationToken cancellationToken = default)
{
    Console.WriteLine("Iniciando requisições paralelas...");

    Task<string> tarefa1 = ObterCotacaoAsync("Dolar", 1000, cancellationToken);
    Task<string> tarefa2 = ObterCotacaoAsync("Euro", 800, cancellationToken);

    // Aguarda ambas terminarem sem bloquear a thread principal:
    string[] resultados = await Task.WhenAll(tarefa1, tarefa2);

    foreach (var res in resultados)
    {
        Console.WriteLine(res);
    }
}

private async Task<string> ObterCotacaoAsync(string moeda, int atrasoMs, CancellationToken ct)
{
    await Task.Delay(atrasoMs, ct);
    return $"{moeda}: OK";
}`,
      explanation: 'No .NET, async/await libera a thread de volta para o ThreadPool durante operações de E/S. Sempre aceite CancellationToken para permitir cancelamento gracioso de requisições web ou operações longas.',
      bestPractices: [
        'Retorne Task ou Task<T>; evite async void a menos que seja um manipulador de eventos de UI.',
        'Sempre propague CancellationToken em APIs e serviços corporativos.'
      ]
    }
  ]
};
