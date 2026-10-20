import { LanguageDefinition } from '../../types';

export const goDefinition: LanguageDefinition = {
  id: 'go',
  name: 'Go (Golang)',
  vscodeLanguageIds: ['go'],
  fileExtensions: ['.go'],
  description: 'Linguagem compilada de alto desempenho do Google, focada em simplicidade, concorrência nativa e robustez.',
  badge: 'Go 1.22+',
  color: '#00ADD8',
  snippets: [
    // ==========================================
    // STRINGS & RUNES
    // ==========================================
    {
      id: 'go-strings-runes-builder',
      title: 'Strings, Runes (Unicode) e strings.Builder',
      category: 'strings',
      summary: 'Strings em Go são fatias de bytes somente leitura (read-only UTF-8). Runes representam code points Unicode (int32).',
      keywords: ['string', 'rune', 'builder', 'utf8', 'bytes'],
      completionTrigger: 'go-string-builder',
      code: `package main

import (
	"fmt"
	"strings"
)

func main() {
	// 1. Strings e Runes (caracteres acentuados ocupam mais de 1 byte):
	frase := "Olá, Mundo! 🚀"
	fmt.Println("Bytes (len):", len(frase)) // Bytes em memória
	
	// Para contar caracteres visíveis reais, converta para slice de runes:
	runes := []rune(frase)
	fmt.Println("Runes reais:", len(runes))

	// 2. Concatenação de Alta Performance com strings.Builder:
	var sb strings.Builder
	for i := 1; i <= 3; i++ {
		sb.WriteString(fmt.Sprintf("Item %d\\n", i))
	}
	resultado := sb.String()
	fmt.Print(resultado)
}`,
      explanation: 'len(string) em Go retorna o número de bytes, NÃO a quantidade de caracteres! Para iterar sobre caracteres multibyte de forma segura, use um loop "for _, r := range string" ou converta para []rune.',
      bestPractices: [
        'Use for range ao iterar strings para decodificar runes Unicode automaticamente.',
        'Use strings.Builder para acumular texto em loops.'
      ]
    },

    // ==========================================
    // ARRAYS & SLICES
    // ==========================================
    {
      id: 'go-slices-arrays',
      title: 'Arrays vs Slices: Criação, Append e Capacidade',
      category: 'arrays_and_collections',
      summary: 'Arrays têm tamanho fixo na declaração de tipo. Slices são visões dinâmicas sobre arrays subjacentes.',
      keywords: ['slice', 'array', 'append', 'make', 'len', 'cap'],
      completionTrigger: 'go-slice-ops',
      code: `package main

import "fmt"

func main() {
	// 1. Array de tamanho fixo (tipo é [3]int, tamanho imutável):
	var fixo [3]int = [3]int{10, 20, 30}
	fmt.Println("Array fixo:", fixo)

	// 2. Slice Dinâmico (tipo é []int):
	// make([]tipo, tamanhoInicial, capacidade)
	numeros := make([]int, 0, 5)

	// Adicionando elementos com append:
	numeros = append(numeros, 100, 200, 300)
	fmt.Printf("Len: %d, Cap: %d\\n", len(numeros), cap(numeros))

	// 3. Fatiamento (sub-slice compartilhando memória):
	subSlice := numeros[1:3] // Elementos dos índices 1 e 2
	fmt.Println("Subslice:", subSlice) // [200, 300]
}`,
      explanation: 'Slices são cabeçalhos leves de 24 bytes contendo: ponteiro para o array, tamanho (len) e capacidade (cap). Quando o append ultrapassa a capacidade, o Go aloca um novo array dobrando a memória.',
      bestPractices: [
        'Sempre pré-aloque a capacidade com make([]T, 0, capEstimada) quando souber a quantidade aproximada para evitar realocações.',
        'Lembre-se que atribuir slices não copia os dados; ambos apontam para o mesmo array subjacente.'
      ]
    },

    // ==========================================
    // MAPS & IDIOMA COMMA-OK
    // ==========================================
    {
      id: 'go-maps-comma-ok',
      title: 'Maps: Estrutura Chave-Valor e Idioma Comma-Ok',
      category: 'arrays_and_collections',
      summary: 'Tabelas de dispersão rápidas e verificação segura de existência de chaves.',
      keywords: ['map', 'comma-ok', 'chave', 'valor', 'delete'],
      completionTrigger: 'go-map-ops',
      code: `package main

import "fmt"

func main() {
	// Inicialização com make ou literal:
	estoque := map[string]int{
		"teclado": 15,
		"mouse":   40,
	}

	// 1. Idioma Comma-Ok (Garante se a chave existe de verdade):
	// Em Go, se a chave não existir, ele retorna o valor padrão (0 para int)
	qtd, existe := estoque["monitor"]
	if !existe {
		fmt.Println("Monitor não cadastrado no estoque!")
	} else {
		fmt.Printf("Monitores em estoque: %d\\n", qtd)
	}

	// 2. Deletando uma chave com delete():
	delete(estoque, "teclado")
}`,
      explanation: 'Diferente de outras linguagens que disparam exceção ao acessar uma chave inexistente, Go retorna o zero-value do tipo. Por isso, a verificação com o segundo retorno (val, ok := map[key]) é padrão.',
      bestPractices: [
        'Sempre use a checagem comma-ok quando o valor zero puder ser uma entrada legítima.',
        'Maps em Go NÃO são seguros para escrita concorrente; use sync.RWMutex ou sync.Map se houver goroutines concorrentes.'
      ]
    },

    // ==========================================
    // TRATAMENTO DE ERROS IDIOMÁTICO
    // ==========================================
    {
      id: 'go-error-handling',
      title: 'Tratamento de Erros: Retorno Múltiplo e if err != nil',
      category: 'error_handling',
      summary: 'Erros em Go são valores comuns retornados na assinatura da função, sem exceções mágicas.',
      keywords: ['error', 'err != nil', 'wrap', 'fmt.errorf'],
      completionTrigger: 'go-error-check',
      code: `package main

import (
	"errors"
	"fmt"
)

var ErrSaldoInsuficiente = errors.New("saldo insuficiente para realizar a transação")

func sacar(saldoAtual, valor float64) (float64, error) {
	if valor <= 0 {
		return saldoAtual, fmt.Errorf("valor de saque inválido: %.2f", valor)
	}
	if valor > saldoAtual {
		return saldoAtual, ErrSaldoInsuficiente
	}
	return saldoAtual - valor, nil
}

func main() {
	novoSaldo, err := sacar(100.0, 150.0)
	if err != nil {
		if errors.Is(err, ErrSaldoInsuficiente) {
			fmt.Println("Aviso:", err)
			return
		}
		fmt.Printf("Erro crítico: %v\\n", err)
		return
	}
	fmt.Printf("Saque realizado. Novo saldo: R$ %.2f\\n", novoSaldo)
}`,
      explanation: 'Go trata erros explicitamente como parte do fluxo do programa. O compilador força você a decidir o que fazer com cada erro retornado, evitando quebras inesperadas em produção.',
      bestPractices: [
        'Retorne nil no campo de erro para indicar sucesso.',
        'Use fmt.Errorf("contexto: %w", err) com o verbo %w para empacotar o erro preservando a causa raiz para errors.Is/errors.As.'
      ]
    },

    // ==========================================
    // CONCORRÊNCIA: GOROUTINES & CANAIS
    // ==========================================
    {
      id: 'go-concurrency-goroutines-channels',
      title: 'Goroutines & Canais: Concorrência CSP Nativa',
      category: 'async_concurrency',
      summary: 'Threads ultraleves (poucos KB) que comunicam compartilhando mensagens por canais (Channels).',
      keywords: ['goroutine', 'channel', 'sync.waitgroup', 'concorrencia', 'go'],
      completionTrigger: 'go-goroutine-channel',
      code: `package main

import (
	"fmt"
	"sync"
	"time"
)

func trabalhador(id int, canalResultados chan<- string, wg *sync.WaitGroup) {
	defer wg.Done() // Garante decremento ao sair da função
	time.Sleep(100 * time.Millisecond) // Simula trabalho
	canalResultados <- fmt.Sprintf("Trabalhador #%d concluiu a tarefa!", id)
}

func main() {
	var wg sync.WaitGroup
	canal := make(chan string, 3) // Canal bufferizado de tamanho 3

	// Dispara 3 goroutines simultâneas:
	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go trabalhador(i, canal, &wg)
	}

	// Goroutine auxiliar para fechar o canal quando todos terminarem:
	go func() {
		wg.Wait()
		close(canal)
	}()

	// Consome resultados do canal conforme chegam:
	for msg := range canal {
		fmt.Println("Recebido:", msg)
	}
}`,
      explanation: '"Não se comunique compartilhando memória; em vez disso, compartilhe memória comunicando-se." Este é o lema do Go implementado via Canais e Goroutines.',
      bestPractices: [
        'Sempre garanta que quem envia no canal feche-o (close), ou que as goroutines não fiquem vazando na memória.',
        'Use sync.WaitGroup para aguardar o término de grupos de goroutines.'
      ]
    }
  ]
};
