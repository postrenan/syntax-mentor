import { LanguageDefinition } from '../../types';

export const javaDefinition: LanguageDefinition = {
  id: 'java',
  name: 'Java',
  vscodeLanguageIds: ['java'],
  fileExtensions: ['.java'],
  description: 'Linguagem fortemente tipada, orientada a objetos e executada sobre a JVM.',
  badge: 'JDK 17/21+',
  color: '#e76f51',
  snippets: [
    // ==========================================
    // STRINGS & FORMATAÇÃO
    // ==========================================
    {
      id: 'java-string-immutability',
      title: 'String: Declaração, Imutabilidade e String Pool',
      category: 'strings',
      summary: 'No Java, objetos String são imutáveis e armazenados no String Pool para economia de memória.',
      keywords: ['string', 'equals', 'pool', 'imutavel', 'texto'],
      completionTrigger: 'java-string-pool',
      code: `// 1. Literais usam o String Pool (mesmo endereço de memória)
String str1 = "Olá, Mundo!";
String str2 = "Olá, Mundo!";

// 2. Criação explícita aloca novo objeto fora da deduplicação direta
String str3 = new String("Olá, Mundo!");

// ATENÇÃO: Nunca compare conteúdo de Strings com '=='!
boolean mesmaReferencia = (str1 == str2);   // true (mesma instância no pool)
boolean referenciaDiferente = (str1 == str3); // false (endereços de heap distintos)

// A FORMA CORRETA: Use .equals() ou .equalsIgnoreCase()
boolean mesmoConteudo = str1.equals(str3); // true!

// Proteção contra NullPointerException com Objects.equals ou literal primeiro:
boolean seguro = "Olá, Mundo!".equals(str3);`,
      explanation: 'Strings em Java são imutáveis: qualquer alteração (como .toUpperCase() ou concatenação com +) gera um novo objeto em memória em vez de modificar o original. O operador == compara referências de memória; use sempre .equals() para comparar o valor dos caracteres.',
      bestPractices: [
        'Sempre use .equals() ou Objects.equals() para comparar valores de String.',
        'Coloque o literal fixo à esquerda (ex: "ADMIN".equals(role)) para evitar NullPointerException se a variável for nula.',
        'Use String.intern() caso precise adicionar dinamicamente uma String calculada ao String Pool.'
      ],
      commonPitfalls: [
        'Comparar Strings com == resulta em bugs sutis que passam em testes locais mas falham em produção.'
      ]
    },
    {
      id: 'java-string-builder',
      title: 'StringBuilder: Concatenação Eficiente em Loops',
      category: 'strings',
      summary: 'Para concatenações repetitivas ou dentro de loops, use StringBuilder para evitar a criação de múltiplos objetos intermediários.',
      keywords: ['stringbuilder', 'concatenacao', 'loop', 'performance', 'buffer'],
      completionTrigger: 'java-string-builder',
      code: `// StringBuilder não é thread-safe, mas é o mais rápido para uso local
StringBuilder sb = new StringBuilder();
sb.append("Relatório de Vendas:").append("\\n");

for (int i = 1; i <= 5; i++) {
    sb.append("  - Pedido #")
      .append(i)
      .append(": R$ ")
      .append(String.format("%.2f", i * 99.90))
      .append("\\n");
}

String resultadoFinal = sb.toString();
System.out.println(resultadoFinal);`,
      explanation: 'O operador + simples fora de loops é otimizado pelo compilador (Java 9+ usa invokedynamic e StringConcatFactory). Porém, dentro de loops, o operador + ainda pode criar objetos intermediários indesejados. StringBuilder resolve isso acumulando bytes em um buffer expansível.',
      bestPractices: [
        'Use StringBuilder para acumular texto dentro de loops.',
        'Se o tamanho aproximado for conhecido, passe a capacidade inicial: new StringBuilder(1024).',
        'Use StringBuffer apenas se a concatenação precisar ser thread-safe (raramente necessário).'
      ]
    },
    {
      id: 'java-string-textblocks-format',
      title: 'Text Blocks (Java 15+) e Métodos Modernos de String',
      category: 'strings',
      summary: 'Strings multi-linha nativas sem necessidade de escapar aspas ou adicionar \\n manualmente.',
      keywords: ['text blocks', 'json', 'sql', 'strip', 'multiline', 'isBlank'],
      completionTrigger: 'java-string-textblocks',
      code: `// Text Blocks delimitados por 3 aspas duplas:
String queryJson = """
    {
        "usuario": "%s",
        "ativo": true,
        "pontos": %d
    }
    """.formatted("Carlos", 1500);

// Métodos modernos (Java 11+):
String entrada = "   Aprendendo Java Moderno   \\n";

boolean vaziaOuEspacos = entrada.isBlank();   // false (considera espaços)
String limpa = entrada.strip();              // "Aprendendo Java Moderno" (suporta unicode, superior a .trim())
String repetida = "Code! ".repeat(3);        // "Code! Code! Code! "
boolean contem = entrada.contains("Java");    // true`,
      explanation: 'Text Blocks preservam quebras de linha e indentação relativa automaticamente, eliminando concatenações incômodas para JSON, SQL ou HTML. .strip() é a versão moderna de .trim() com suporte total a espaços em branco do padrão Unicode.',
      bestPractices: [
        'Prefira .formatted(...) em Text Blocks em vez de constantes String.format(...).',
        'Use .isBlank() para validar se uma string não é nula/apenas espaços em vez de .trim().isEmpty().'
      ]
    },

    // ==========================================
    // ARRAYS & COLEÇÕES
    // ==========================================
    {
      id: 'java-arrays-basics',
      title: 'Arrays Estáticos: Declaração, Tamanho Fixo e Utilidades',
      category: 'arrays_and_collections',
      summary: 'Arrays em Java possuem tamanho imutável após a criação e alocação de memória contígua.',
      keywords: ['array', 'vetor', 'matriz', 'arrays.tostring', 'length'],
      completionTrigger: 'java-array-static',
      code: `import java.util.Arrays;

// 1. Declaração com inicialização direta (tam 4)
int[] numeros = { 10, 20, 30, 40 };

// 2. Declaração alocando tamanho fixo (valores padrão: 0, null ou false)
String[] nomes = new String[3];
nomes[0] = "Alice";
nomes[1] = "Bob";
nomes[2] = "Carol";

// Acessando propriedades
int tamanho = numeros.length; // ATENÇÃO: length é atributo, não método!
int primeiro = numeros[0];

// Imprimindo amigavelmente (evita printar [I@1b6d3586)
System.out.println("Nomes: " + Arrays.toString(nomes));

// Ordenação nativa (Dual-Pivot Quicksort)
int[] desordenado = { 5, 2, 8, 1 };
Arrays.sort(desordenado); // { 1, 2, 5, 8 }`,
      explanation: 'Arrays são estruturas de baixo nível de altíssima performance com acesso O(1) por índice. Contudo, seu tamanho não pode ser expandido nem reduzido. Para coleções que crescem dinamicamente, prefira List<T> (ArrayList).',
      bestPractices: [
        'Prefira int[] nomes a int nomes[] (convenção padrão Java).',
        'Use Arrays.toString(arr) para logar ou inspecionar o conteúdo do array.',
        'Use System.arraycopy() ou Arrays.copyOf() para clonar/redimensionar arrays rapidamente.'
      ],
      commonPitfalls: [
        'Tentar acessar um índice além de length - 1 gera ArrayIndexOutOfBoundsException.',
        'Chamar .toString() em um array imprime apenas a referência da JVM (ex: [Ljava.lang.String;@...).'
      ]
    },
    {
      id: 'java-collections-arraylist',
      title: 'Listas Dinâmicas (ArrayList e List.of)',
      category: 'arrays_and_collections',
      summary: 'List<T> é a coleção sequencial dinâmica mais utilizada em Java, substituindo arrays tradicionais.',
      keywords: ['list', 'arraylist', 'list.of', 'adicionar', 'remover'],
      completionTrigger: 'java-list-arraylist',
      code: `import java.util.ArrayList;
import java.util.List;

// 1. Lista Dinâmica Mutável:
List<String> frutas = new ArrayList<>();
frutas.add("Maçã");
frutas.add("Banana");
frutas.add("Laranja");

// Operações comuns:
frutas.remove("Banana");
boolean existe = frutas.contains("Maçã"); // true
int total = frutas.size();                 // 2 (size() é método)
String primeira = frutas.get(0);          // "Maçã"

// 2. Lista Imutável (Java 9+ List.of):
List<Integer> codigosFixos = List.of(200, 201, 204, 400, 404, 500);
// codigosFixos.add(502); // DISPARA UnsupportedOperationException!`,
      explanation: 'Sempre declare a variável com o tipo da interface (List<String>) e instancie com a classe concreta (ArrayList<String>). Isso garante baixo acoplamento e flexibilidade para trocar de implementação se necessário.',
      bestPractices: [
        'Programe para interfaces: List<T> lista = new ArrayList<>();',
        'Use List.of() para listas pequenas e constantes que não devem ser modificadas.',
        'Não use Vector nem ArrayList com sincronização manual desnecessária.'
      ]
    },
    {
      id: 'java-collections-map-hashmap',
      title: 'Mapas Chave-Valor (HashMap e Map.of)',
      category: 'arrays_and_collections',
      summary: 'Estrutura associativa ultra-rápida (O(1) médio) para busca por chave única.',
      keywords: ['map', 'hashmap', 'chave', 'valor', 'dicionario'],
      completionTrigger: 'java-map-hashmap',
      code: `import java.util.HashMap;
import java.util.Map;

// Mapa dinâmico
Map<String, Double> precos = new HashMap<>();
precos.put("Notebook", 4500.00);
precos.put("Mouse", 120.00);
precos.put("Teclado", 350.00);

// Busca segura com valor padrão se chave não existir:
Double valorMonitor = precos.getOrDefault("Monitor", 0.0);

// Atualização condicional elegante (Java 8+):
precos.computeIfAbsent("Headset", k -> 299.90);

// Iterando sobre chave e valor:
for (Map.Entry<String, Double> item : precos.entrySet()) {
    System.out.println(item.getKey() + " -> R$ " + item.getValue());
}

// Mapa imutável rápido (Java 9+):
Map<String, String> status = Map.of(
    "PENDENTE", "#FFCC00",
    "APROVADO", "#00CC66",
    "REJEITADO", "#FF0033"
);`,
      explanation: 'HashMap armazena pares chave/valor usando o hashCode() da chave para determinar a posição em buckets. Se você usar objetos customizados como chave, DEVE implementar tanto equals() quanto hashCode() coerentemente.',
      bestPractices: [
        'Sempre implemente equals() e hashCode() se utilizar classes próprias como chaves.',
        'Use getOrDefault() para evitar retornos nulos inesperados.'
      ]
    },
    {
      id: 'java-streams-api',
      title: 'Streams API: Filtros, Transformações e Agrupamento',
      category: 'arrays_and_collections',
      summary: 'Processamento funcional declarativo e elegante sobre coleções.',
      keywords: ['stream', 'filter', 'map', 'collect', 'lambda', 'reduce'],
      completionTrigger: 'java-stream-ops',
      code: `import java.util.List;
import java.util.stream.Collectors;

List<String> programadores = List.of("Ada Lovelace", "Alan Turing", "Grace Hopper", "Dennis Ritchie");

// Filtrar quem começa com 'A', transformar para maiúsculas e ordenar:
List<String> resultado = programadores.stream()
    .filter(nome -> nome.startsWith("A"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList()); // Ou .toList() no Java 16+

System.out.println(resultado); // [ADA LOVELACE, ALAN TURING]

// Cálculo numérico com Streams:
List<Integer> notas = List.of(7, 8, 9, 10, 6);
double media = notas.stream()
    .mapToInt(Integer::intValue)
    .average()
    .orElse(0.0);`,
      explanation: 'Streams não modificam a coleção original. Eles criam um fluxo sob demanda dividido em operações intermediárias (filter, map) e uma operação terminal (collect, forEach, reduce).',
      bestPractices: [
        'No Java 16+, prefira .toList() em vez de .collect(Collectors.toList()) quando não precisar alterar a lista retornada.',
        'Use mapToInt / mapToDouble para evitar custos de autoboxing em operações matemáticas.'
      ]
    },

    // ==========================================
    // TIPOS & VARIÁVEIS
    // ==========================================
    {
      id: 'java-variables-primitives-var',
      title: 'Tipos Primitivos, Wrappers e Inferência com "var"',
      category: 'variables_and_types',
      summary: 'Primitivos residem na pilha (stack) para velocidade; wrappers residem na heap e aceitam null.',
      keywords: ['var', 'int', 'double', 'primitivos', 'boxing', 'final'],
      completionTrigger: 'java-types-var',
      code: `// Primitivos (alta performance, não podem ser null)
int contador = 10;
double salario = 4500.50;
boolean ativo = true;
char letra = 'J';

// Wrappers correspondentes (podem ser null e usados em generics)
Integer contadorObj = 10; // Autoboxing automático
Double salarioObj = null; // Aceita null

// Inferência de Tipo com 'var' (Java 10+ para variáveis locais):
var mensagem = "Compilador infere como String";
var lista = new java.util.ArrayList<String>(); // Infere ArrayList<String>

// Constantes com 'final':
final double PI = 3.14159265359;
// PI = 3.14; // ERRO de compilação: não pode ser reatribuído`,
      explanation: 'A palavra-chave var NÃO torna o Java dinâmico: o compilador descobre o tipo no momento da compilação e o fixa. Use var para reduzir redundâncias longas na declaração.',
      bestPractices: [
        'Use tipos primitivos para cálculos intensivos e atributos numéricos padrão.',
        'Use wrappers quando precisar representar ausência de valor (null) ou com coleções (List<Integer>).',
        'Use var apenas quando o tipo for evidente pelo lado direito da atribuição.'
      ]
    },

    // ==========================================
    // CONTROLE DE FLUXO
    // ==========================================
    {
      id: 'java-switch-expressions',
      title: 'Switch Expressions e Pattern Matching (Java 14/17+)',
      category: 'control_flow',
      summary: 'Novo switch moderno com sintaxe de flecha (->) que retorna valores e dispensa break manual.',
      keywords: ['switch', 'pattern matching', 'case', 'yield', 'arrow'],
      completionTrigger: 'java-switch-modern',
      code: `String dia = "SEGUNDA";

// Switch Expression com retorno direto:
String tipoDia = switch (dia) {
    case "SABADO", "DOMINGO" -> "Final de Semana";
    case "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA" -> "Dia Útil";
    default -> throw new IllegalArgumentException("Dia inválido: " + dia);
};

// Pattern Matching com Switch (Java 21):
Object objeto = "Texto qualquer";
String descricao = switch (objeto) {
    case Integer i -> "Número inteiro: " + (i * 2);
    case String s  -> "String de tamanho: " + s.length();
    case null      -> "Objeto nulo!";
    default        -> "Tipo desconhecido: " + objeto.getClass().getSimpleName();
};`,
      explanation: 'O switch moderno elimina o infame problema de fallthrough (esquecer o break e executar casos seguintes). Quando usado como expressão que atribui a uma variável, o compilador exige que todos os casos possíveis sejam cobertos.',
      bestPractices: [
        'Prefira a sintaxe de flecha (->) para evitar a necessidade de breaks.',
        'Use o switch para retornar valores diretamente sem variáveis temporárias.'
      ]
    },

    // ==========================================
    // POO & ESTRUTURAS
    // ==========================================
    {
      id: 'java-oop-records',
      title: 'Records (Java 16+): DTOs Imutáveis sem Boilerplate',
      category: 'oop_and_structs',
      summary: 'Substitui classes de dados verbosas, gerando automaticamente getters, equals, hashCode e toString.',
      keywords: ['record', 'dto', 'imutavel', 'classe', 'construtor'],
      completionTrigger: 'java-record-dto',
      code: `// Declaração em uma única linha!
public record ClienteDTO(Long id, String nome, String email) {
    // Construtor compacto para validação de integridade:
    public ClienteDTO {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório!");
        }
    }
}

// Uso do Record:
ClienteDTO cliente = new ClienteDTO(1L, "Mariana", "mariana@email.com");

// Métodos de acesso gerados (sem o prefixo 'get'):
System.out.println(cliente.nome());  // "Mariana"
System.out.println(cliente.email()); // "mariana@email.com"

// Já possui toString, equals e hashCode implementados perfeitamente:
System.out.println(cliente); // ClienteDTO[id=1, nome=Mariana, email=mariana@email.com]`,
      explanation: 'Records são portadores de dados transparentes e imutáveis. Todos os campos são privados e final por padrão. Evitam dezenas de linhas de código repetitivo ou anotações externas como Lombok.',
      bestPractices: [
        'Use Records para transferências de dados (DTOs), respostas de API e chaves de mapas compostas.',
        'Não tente estender Records (eles são implicitamente final).'
      ]
    },

    // ==========================================
    // TRATAMENTO DE ERROS
    // ==========================================
    {
      id: 'java-error-try-with-resources',
      title: 'Try-with-Resources: Fechamento Seguro de Recursos',
      category: 'error_handling',
      summary: 'Garante que arquivos, conexões e fluxos sejam fechados automaticamente, prevenindo vazamentos de memória.',
      keywords: ['try', 'catch', 'autocloseable', 'recursos', 'excecoes'],
      completionTrigger: 'java-try-resources',
      code: `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

// Qualquer classe que implemente AutoCloseable pode ser declarada no try:
try (BufferedReader reader = new BufferedReader(new FileReader("dados.txt"))) {
    String linha;
    while ((linha = reader.readLine()) != null) {
        System.out.println(linha);
    }
} catch (IOException e) {
    System.err.println("Erro ao ler arquivo: " + e.getMessage());
    // Tratar adequadamente ou encapsular em RuntimeException
}
// O arquivo é fechado AQUI automaticamente, mesmo em caso de exceção!`,
      explanation: 'Antes do Java 7, era necessário fechar recursos dentro de um bloco finally com verificações nulas e novos try-catchs. O try-with-resources resolve isso garantindo invocação segura de .close().',
      bestPractices: [
        'Sempre use try-with-resources para I/O, JDBC Statements, ResultSets e Sockets.',
        'Nunca engula exceções com blocos catch vazios (catch (Exception e) {}).'
      ]
    },

    // ==========================================
    // ASSÍNCRONO & CONCORRÊNCIA
    // ==========================================
    {
      id: 'java-async-completablefuture',
      title: 'CompletableFuture e Threads Virtuais (Java 21)',
      category: 'async_concurrency',
      summary: 'Execução assíncrona não bloqueante e alta concorrência com Virtual Threads.',
      keywords: ['async', 'completablefuture', 'thread', 'virtual threads', 'executor'],
      completionTrigger: 'java-completable-future',
      code: `import java.util.concurrent.CompletableFuture;

// Execução assíncrona encadeada:
CompletableFuture.supplyAsync(() -> {
    // Simula chamada de rede / API externa
    return "Dados do Usuário #42";
})
.thenApply(dados -> dados.toUpperCase())
.thenAccept(resultado -> {
    System.out.println("Processado: " + resultado);
})
.exceptionally(ex -> {
    System.err.println("Falha no pipeline: " + ex.getMessage());
    return null;
});

// Java 21+: Disparando milhares de Threads Virtuais leves:
Thread.ofVirtual().start(() -> {
    System.out.println("Executando em Virtual Thread sobre a carrier thread!");
});`,
      explanation: 'CompletableFuture permite composição funcional de tarefas assíncronas. Com o Java 21, Virtual Threads introduzem corrotinas leves gerenciadas pela JVM que permitem milhões de requisições simultâneas sem consumir pilhas de memória do sistema operacional.',
      bestPractices: [
        'Forneça um ExecutorService customizado para CompletableFuture.supplyAsync() em ambientes de alta carga.',
        'Use Threads Virtuais para tarefas bloqueadas por I/O (rede, banco de dados).'
      ]
    }
  ]
};
