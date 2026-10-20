import { LanguageDefinition } from '../../types';

export const rustDefinition: LanguageDefinition = {
  id: 'rust',
  name: 'Rust',
  vscodeLanguageIds: ['rust'],
  fileExtensions: ['.rs'],
  description: 'Linguagem de sistemas ultra-rápida, segura para memória sem coletor de lixo (Garbage Collector).',
  badge: 'Rust 2021 Edition',
  color: '#dea584',
  snippets: [
    // ==========================================
    // STRINGS & SLICES
    // ==========================================
    {
      id: 'rust-strings-string-vs-str',
      title: 'String vs &str: Alocação no Heap vs Fatias Emprestadas',
      category: 'strings',
      summary: 'Diferença essencial entre String própria alocada no Heap e &str como referência imutável.',
      keywords: ['string', '&str', 'borrow', 'heap', 'format!'],
      completionTrigger: 'rust-string-types',
      code: `fn main() {
    // 1. &str: String Slice (visualização de dados imutável, tamanho conhecido em tempo de compilação):
    let literal: &'static str = "Texto estático no binário";

    // 2. String: Alocada na heap, expansível, possui a propriedade (ownership) dos dados:
    let mut mensagem: String = String::from("Olá");
    mensagem.push_str(", Mundo!"); // Mutação segura

    // 3. format! macro (Cria uma nova String sem printar direto):
    let usuario = "Alice";
    let pontos = 42;
    let formatado: String = format!("Usuário: {usuario}, Pontos: {pontos}");

    // Convertendo String para &str:
    imprimir_slice(&mensagem);
}

// Boas práticas: Aceite sempre &str em parâmetros para máxima flexibilidade:
fn imprimir_slice(texto: &str) {
    println!("Lendo slice: {}", texto);
}`,
      explanation: '&str é uma referência (ponteiro + tamanho) para uma sequência válida de UTF-8 em qualquer lugar da memória. String é um vetor de bytes na heap com capacidade expansível.',
      bestPractices: [
        'Em assinaturas de funções que apenas leem o texto, aceite &str em vez de &String.',
        'Use format! para concatenar strings com valores arbitrários.'
      ]
    },

    // ==========================================
    // VETORES & COLEÇÕES
    // ==========================================
    {
      id: 'rust-vec-iterators',
      title: 'Vectors (Vec<T>) e Iterators Funcionais',
      category: 'arrays_and_collections',
      summary: 'Coleções contíguas dinâmicas na heap e processamento funcional com iteradores de custo zero.',
      keywords: ['vec', 'vector', 'iter', 'map', 'filter', 'collect'],
      completionTrigger: 'rust-vec-iter',
      code: `fn main() {
    // 1. Criando um vetor com a macro vec!:
    let mut numeros: Vec<i32> = vec![1, 2, 3, 4, 5];
    numeros.push(6);

    // 2. Iterators funcionais com Zero-Cost Abstraction:
    let pares_ao_quadrado: Vec<i32> = numeros
        .iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .collect(); // Coleta para novo Vec

    println!("Resultado: {:?}", pares_ao_quadrado); // [4, 16, 36]

    // 3. Acesso seguro com .get() (retorna Option<&T>, sem pânico!):
    match numeros.get(10) {
        Some(valor) => println!("Encontrado: {valor}"),
        None => println!("Índice fora dos limites de forma segura!"),
    }
}`,
      explanation: 'Diferente do operador [], o método .get() retorna Option<&T>, permitindo lidar com índices inválidos sem causar o término abrupto (panic) do programa.',
      bestPractices: [
        'Prefira .get() a indexação direta numeros[i] quando o índice for dinâmico.',
        'Iterators em Rust são compilados para assembly tão rápido ou mais rápido que loops manuais.'
      ]
    },

    // ==========================================
    // OWNERSHIP & BORROWING
    // ==========================================
    {
      id: 'rust-ownership-borrowing',
      title: 'Ownership e Borrowing: O Coração da Segurança de Memória',
      category: 'variables_and_types',
      summary: 'Regras estritas de posse e referências que impedem vazamentos e data races em tempo de compilação.',
      keywords: ['ownership', 'borrowing', 'mut', 'referencia', 'move'],
      completionTrigger: 'rust-ownership-rules',
      code: `fn main() {
    // 1. Move Semantics (Posse transferida):
    let s1 = String::from("Rust");
    let s2 = s1; // Posse movida para s2! s1 é invalidado aqui!
    // println!("{}", s1); // ERRO DE COMPILAÇÃO! s1 não pode mais ser usado!

    // 2. Empréstimo Imutável (&T): Vários leitores simultâneos permitidos:
    let tam = calcular_tamanho(&s2);
    println!("Texto '{}' tem tamanho {}", s2, tam); // s2 continua válido!

    // 3. Empréstimo Mutável (&mut T): Apenas UM escritor por vez:
    let mut texto_mut = String::from("Original");
    adicionar_sufixo(&mut texto_mut);
    println!("Modificado: {}", texto_mut);
}

fn calcular_tamanho(s: &String) -> usize {
    s.len()
}

fn adicionar_sufixo(s: &mut String) {
    s.push_str(" [Atualizado]");
}`,
      explanation: 'Regra de ouro do Rust: Você pode ter qualquer número de referências imutáveis (&T) OU exatamente UMA referência mutável (&mut T) ao mesmo tempo, nunca ambas.',
      bestPractices: [
        'Passe referências (&T) para funções sempre que não precisar da posse permanente do objeto.',
        'Evite clonar dados pesados (.clone()) apenas para agradar o compilador do Borrow Checker.'
      ]
    },

    // ==========================================
    // TRATAMENTO DE ERROS: RESULT, OPTION E '?'
    // ==========================================
    {
      id: 'rust-error-handling-result-operator',
      title: 'Result, Option e o Operador ?',
      category: 'error_handling',
      summary: 'Ausência de null e exceções: controle de fluxo explícito e propagação limpa com ?.',
      keywords: ['result', 'option', '?', 'unwrap', 'match', 'error'],
      completionTrigger: 'rust-result-operator',
      code: `use std::fs::File;
use std::io::{self, Read};

// Função que pode falhar retorna Result<TipoSucesso, TipoErro>:
fn ler_arquivo_config(caminho: &str) -> Result<String, io::Error> {
    // O operador ? desempacota se for Ok, ou retorna imediatamente o Err da função!
    let mut arquivo = File::open(caminho)?;
    let mut conteudo = String::new();
    arquivo.read_to_string(&mut conteudo)?;
    Ok(conteudo)
}

fn main() {
    match ler_arquivo_config("config.json") {
        Ok(dados) => println!("Configuração carregada com sucesso!"),
        Err(erro) => eprintln!("Falha ao ler arquivo: {}", erro),
    }
}`,
      explanation: 'O operador ? converte e propaga o erro para cima na pilha de chamadas instantaneamente se a expressão avaliar para Err. Caso contrário, ele extrai o valor de Ok.',
      bestPractices: [
        'Evite .unwrap() e .expect() em código de produção; use o operador ? ou match.',
        'Use crates como anyhow e thiserror para simplificar tipos de erro em Rust.'
      ]
    }
  ]
};
