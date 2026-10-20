"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pythonDefinition = void 0;
exports.pythonDefinition = {
    id: 'python',
    name: 'Python',
    vscodeLanguageIds: ['python'],
    fileExtensions: ['.py'],
    description: 'Linguagem de alto nível, interpretada, multiparadigma e com ênfase em legibilidade.',
    badge: 'Python 3.10+',
    color: '#3572A5',
    snippets: [
        // ==========================================
        // STRINGS & FORMATAÇÃO
        // ==========================================
        {
            id: 'py-strings-formatting',
            title: 'Strings: F-Strings, Slicing e Imutabilidade',
            category: 'strings',
            summary: 'Strings em Python são imutáveis e suportam f-strings avançadas e fatiamento (slicing) expressivo.',
            keywords: ['string', 'f-string', 'slicing', 'fatiamento', 'format'],
            completionTrigger: 'py-string-fstring',
            code: `# 1. F-Strings (Interpolação moderna e rápida):
nome = "Mariana"
saldo = 1250.758
print(f"Olá {nome}, seu saldo é R$ {saldo:.2f}") # Duas casas decimais

# Depuração rápida com f'{variavel=}' (Python 3.8+):
taxa = 0.15
print(f"{taxa=}") # Imprime: taxa=0.15

# 2. Fatiamento (Slicing): [inicio : fim : passo]
texto = "Python Moderno"
print(texto[0:6])   # "Python"
print(texto[-7:])   # "Moderno" (últimos 7 caracteres)
print(texto[::-1])  # "onredoM nohtyP" (inversão rápida)

# 3. Métodos Essenciais de Texto:
entrada = "  laranja, banana, maçã  "
frutas = [item.strip() for item in entrada.split(",")] # ['laranja', 'banana', 'maçã']
unido = " | ".join(frutas)                             # "laranja | banana | maçã"`,
            explanation: 'Strings em Python são sequências imutáveis. F-strings (f"...") são avaliadas em tempo de execução e são muito mais rápidas e limpas do que % ou .format(). O slicing cria novas substrings de forma ultra eficiente em C subjacente.',
            bestPractices: [
                'Prefira f-strings a .format() ou concatenação com +.',
                'Use str.join() para concatenar listas de strings; evite somar strings dentro de loops com +=.',
                'Aproveite f"{valor=}" durante o desenvolvimento para debugar sem esforço.'
            ]
        },
        // ==========================================
        // ARRAYS & COLEÇÕES
        // ==========================================
        {
            id: 'py-lists-comprehensions',
            title: 'Listas & List Comprehensions: Manipulação Idiomática',
            category: 'arrays_and_collections',
            summary: 'Listas são dinâmicas e mutáveis. Comprehensions oferecem sintaxe limpa e rápida para transformar dados.',
            keywords: ['list', 'lista', 'comprehension', 'array', 'append', 'filter'],
            completionTrigger: 'py-list-comprehension',
            code: `# 1. Lista Básica e Métodos Comuns:
numeros = [1, 2, 3, 4, 5]
numeros.append(6)       # Adiciona ao final O(1)
numeros.pop()           # Remove e retorna o último O(1)

# 2. List Comprehension (Pythonic way para map + filter):
# Exemplo: Quadrado apenas dos números pares
quadrados_pares = [n ** 2 for n in numeros if n % 2 == 0]
print(quadrados_pares)  # [4, 16]

# 3. Enumerate & Zip (Evite usar range(len(lista))):
nomes = ["Alice", "Bob", "Carol"]
for indice, nome in enumerate(nomes, start=1):
    print(f"{indice}. {nome}")

idades = [25, 30, 28]
for nome, idade in zip(nomes, idades):
    print(f"{nome} tem {idade} anos")`,
            explanation: 'List Comprehensions são executadas no bytecode interno do Python em velocidade de C, sendo mais rápidas e legíveis que loops for tradicionais com .append().',
            bestPractices: [
                'Use List Comprehensions quando a lógica for concisa (1 linha); se for muito complexa, prefira um loop for normal.',
                'Nunca faça append dentro de um loop se uma comprehension puder resolver.',
                'Use deque de collections para filas/pilhas com remoção O(1) na ponta esquerda.'
            ]
        },
        {
            id: 'py-dict-mapping',
            title: 'Dicionários & Dict Comprehensions',
            category: 'arrays_and_collections',
            summary: 'Tabelas hash chave-valor mantendo a ordem de inserção (Python 3.7+).',
            keywords: ['dict', 'dicionario', 'map', 'get', 'hash'],
            completionTrigger: 'py-dict-ops',
            code: `usuario = {
    "id": 101,
    "nome": "Guido",
    "cargo": "Tech Lead"
}

# Busca segura com valor padrão (evita KeyError):
email = usuario.get("email", "contato@padrao.com")

# Dict Comprehension:
produtos = {"monitor": 1500, "mouse": 120, "teclado": 300}
produtos_com_imposto = {k: v * 1.10 for k, v in produtos.items()}

# Fusão moderna de dicionários com operador | (Python 3.9+):
config_padrao = {"tema": "escuro", "notificacoes": True}
config_usuario = {"tema": "claro"}
config_final = config_padrao | config_usuario # Sobrescreve com valores da direita`,
            explanation: 'O operador | introduzido no Python 3.9 permite unir dicionários de forma elegante e expressiva, substituindo {**a, **b} e a.update(b).',
            bestPractices: [
                'Sempre use dict.get(chave, default) quando a existência da chave for incerta.',
                'Use o operador | para mesclar dicionários no Python 3.9+.'
            ]
        },
        // ==========================================
        // TIPOS & VARIÁVEIS
        // ==========================================
        {
            id: 'py-type-hints',
            title: 'Type Hints & Dataclasses',
            category: 'variables_and_types',
            summary: 'Anotações de tipos estáticos para checagem por linters (mypy) e classes de dados limpas.',
            keywords: ['type hints', 'typing', 'dataclass', 'tipagem', 'model'],
            completionTrigger: 'py-dataclass',
            code: `from dataclasses import dataclass
from typing import Optional

# Dataclass gera automaticamente __init__, __repr__ e __eq__:
@dataclass
class Produto:
    id: int
    nome: str
    preco: float
    descricao: Optional[str] = None

    def calcular_desconto(self, porcentagem: float) -> float:
        return self.preco * (1 - porcentagem / 100)

prod = Produto(id=1, nome="Teclado Mecânico", preco=350.0)
print(prod)  # Produto(id=1, nome='Teclado Mecânico', preco=350.0, descricao=None)`,
            explanation: 'Type hints não afetam a execução do Python em tempo de execução, mas habilitam checagem estática poderosa (mypy, Pyright) e autocompletion preciso em IDEs.',
            bestPractices: [
                'Use @dataclass para modelos de dados puros.',
                'Use Optional[T] ou T | None (Python 3.10+) para valores que podem ser nulos.'
            ]
        },
        // ==========================================
        // CONTROLE DE FLUXO
        // ==========================================
        {
            id: 'py-match-case',
            title: 'Structural Pattern Matching (match-case - Python 3.10+)',
            category: 'control_flow',
            summary: 'Muito mais poderoso que um switch clássico: desestrutura tuplas, listas e objetos dinamicamente.',
            keywords: ['match', 'case', 'pattern matching', 'switch'],
            completionTrigger: 'py-match-case',
            code: `comando = ("MOVER", 10, 20)

match comando:
    case ("PARAR",):
        print("Parando execução imediata.")
    case ("MOVER", x, y) if x > 0 and y > 0:
        print(f"Movendo para quadrante positivo: ({x}, {y})")
    case ("MOVER", x, y):
        print(f"Movendo para: ({x}, {y})")
    case _:
        print("Comando não reconhecido!")`,
            explanation: 'O comando match do Python 3.10 avalia o padrão estrutural e pode capturar variáveis e checar guards condicionais (if) no mesmo passo.',
            bestPractices: [
                'Use case _ como curinga padrão no final do bloco match.',
                'Aproveite desestruturação direta de sequências e dicionários.'
            ]
        },
        // ==========================================
        // TRATAMENTO DE ERROS
        // ==========================================
        {
            id: 'py-try-except-else-finally',
            title: 'Try / Except / Else / Finally e Context Managers',
            category: 'error_handling',
            summary: 'Filosofia EAFP (Easier to Ask for Forgiveness than Permission) e gerenciadores com "with".',
            keywords: ['try', 'except', 'finally', 'with', 'context manager', 'eafp'],
            completionTrigger: 'py-try-except',
            code: `# 1. Tratamento Robusto com Else e Finally:
try:
    valor = int("123")
    resultado = 100 / valor
except ValueError as e:
    print(f"Erro de conversão numérica: {e}")
except ZeroDivisionError:
    print("Divisão por zero não permitida!")
else:
    # Executado APENAS se nenhuma exceção ocorrer no try
    print(f"Sucesso absoluto: resultado = {resultado}")
finally:
    # Executado SEMPRE (com ou sem erro)
    print("Limpeza finalizada.")

# 2. Context Manager 'with' (Fecha arquivos automaticamente):
with open("arquivo.txt", "w", encoding="utf-8") as f:
    f.write("Conteúdo salvo com segurança!")`,
            explanation: 'O bloco else é ideal para colocar o código que só deve rodar se o try for 100% bem-sucedido, evitando capturar exceções indesejadas dentro do próprio bloco try.',
            bestPractices: [
                'Nunca use except: sem especificar a exceção; capture pelo menos Exception.',
                'Prefira "with" para gerenciar recursos externos (arquivos, locks, conexões).'
            ]
        },
        // ==========================================
        // ASSÍNCRONO & CONCORRÊNCIA
        // ==========================================
        {
            id: 'py-asyncio-gather',
            title: 'Asyncio: Concorrência Assíncrona com Corrotinas',
            category: 'async_concurrency',
            summary: 'Execução de I/O não bloqueante com event loop nativo.',
            keywords: ['async', 'await', 'asyncio', 'gather', 'corrotina'],
            completionTrigger: 'py-async-gather',
            code: `import asyncio

async def buscar_preco(loja: str, tempo: float) -> str:
    print(f"Consultando {loja}...")
    await asyncio.sleep(tempo) # Simula requisição HTTP
    return f"{loja}: R$ 199,90"

async def main():
    # Dispara múltiplas tarefas em paralelo cooperativo:
    resultados = await asyncio.gather(
        buscar_preco("Loja A", 1.5),
        buscar_preco("Loja B", 0.8),
        buscar_preco("Loja C", 1.2)
    )
    for r in resultados:
        print(r)

# Inicia o Event Loop:
asyncio.run(main())`,
            explanation: 'asyncio utiliza um event loop de thread única para alternar entre tarefas quando uma operação de E/S estiver aguardando (await), proporcionando alto throughput com baixo consumo de memória.',
            bestPractices: [
                'Nunca utilize chamadas síncronas bloqueantes (como time.sleep ou requests.get) dentro de funções async; use asyncio.sleep e aiohttp/httpx.'
            ]
        }
    ]
};
//# sourceMappingURL=python.js.map