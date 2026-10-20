# 📘 Syntax Mentor: Guia Didático de Sintaxe & Autocompletador em Tempo Real

Uma extensão profissional para o **Visual Studio Code** desenvolvida para acelerar o aprendizado e a produtividade em múltiplas linguagens de programação. Ela reúne um **guia didático interativo na barra lateral** e um **analisador de autocompletar em tempo real** diretamente no editor.

---

## 🌟 Funcionalidades Principais

### 1. Seletor de Linguagens & Catálogo Didático na Barra Lateral
- **Multilinguagem Completo:** Suporte aprofundado para **Java**, **Python**, **TypeScript / JavaScript**, **C# (.NET)**, **Go (Golang)** e **Rust**.
- **Sintaxe Além do Básico:**
  - **Strings & Texto:** Como cada linguagem trata imutabilidade, memória (String Pool no Java, heap vs `&str` no Rust, fatias de bytes UTF-8 no Go), concatenação eficiente (`StringBuilder`, `strings.Builder`), interpolações (`f-strings`, template literals, raw strings `"""`).
  - **Arrays & Coleções:** Diferença fundamental entre arrays estáticos contíguos e coleções dinâmicas (`ArrayList`, slices, vectors, maps, list comprehensions, Streams API, LINQ).
  - **Tipos & Memória:** Primitivos vs Wrappers, inferência com `var`, Dataclasses, Records, Ownership & Borrowing no Rust.
  - **Controle de Fluxo:** Pattern Matching moderno, Switch Expressions com flecha (`->`), `match-case`.
  - **Tratamento de Erros:** Filosofia de exceções checadas, Try-with-Resources com `AutoCloseable`, padrão EAFP, retorno de erros idiomático (`if err != nil` em Go) e o operador `?` com `Result<T, E>` no Rust.
  - **Concorrência & Assincronia:** CompletableFuture & Virtual Threads no Java 21, corrotinas com `asyncio`, Promises concorrentes com `Promise.allSettled`, Tasks com `CancellationToken`, Goroutines & Canais.

### 2. Painel Webview Interativo
- **Busca em Tempo Real:** Filtre instantaneamente por tópicos, termos (ex: `string`, `array`, `loop`, `builder`, `pool`) ou explicações.
- **Abas de Categorias:** Navegue rapidamente por *Tipos & Variáveis*, *Strings*, *Arrays & Coleções*, *Controle de Fluxo*, *POO & Estruturas*, *Tratamento de Erros* e *Assíncrono*.
- **Inserção Direta no Editor:** Botão **"⚡ Inserir no Editor"** que injeta o exemplo pronto e comentado diretamente na posição atual do seu cursor.
- **Área de Transferência:** Botão **"📋 Copiar"** com feedback instantâneo.
- **Boas Práticas & Armadilhas:** Checklist de convenções ideais e alertas sobre pegadinhas comuns (ex: nunca comparar Strings com `==` em Java).
- **Sincronização com o Editor Ativo:** Ao abrir ou trocar para um arquivo `.java`, `.py`, `.ts`, `.cs`, `.go` ou `.rs`, o painel pode sincronizar automaticamente.

### 3. Analisador e Autocompletador em Tempo Real (`CompletionItemProvider`)
- Enquanto você digita no editor de código:
  - Digite prefixos diretos como `java-string-pool`, `java-string-builder`, `py-list-comprehension`, `ts-array-functional`, `go-slice-ops` ou `rust-ownership-rules`.
  - Digite palavras-chave como `string`, `array`, `stream`, `map` ou `mentor-` para receber sugestões de código prontas.
  - O painel de documentação do autocompletar exibe a explicação didática completa, exemplo com syntax highlight, boas práticas e avisos.

### 4. Guia Didático por Hover (`HoverProvider`)
- Passe o mouse sobre tipos ou conceitos no seu código (ex: `String`, `StringBuilder`, `ArrayList`, `Stream`, `record`, `goroutine`, `slice`) para ver uma janela explicativa com botão de inserir exemplo.

---

## 🚀 Como Executar e Testar a Extensão no VS Code

1. Abra esta pasta no VS Code:
   ```bash
   code C:\Users\renan\.gemini\antigravity\scratch\syntax-mentor
   ```

2. Pressione a tecla **`F5`** (ou vá em **Run and Debug** -> **Run Extension (Syntax Mentor)**).
   - Uma nova janela intitulada **`[Extension Development Host]`** será aberta com a extensão carregada.

3. Na barra lateral esquerda (Activity Bar), clique no ícone do **Syntax Mentor** (ícone de livro com código `</>`).

4. Selecione a linguagem desejada no menu dropdown (ex: **Java**).
   - Explore as categorias: clique em **Strings & Formatação** ou **Arrays & Coleções**.
   - Abra um novo arquivo `Teste.java` no editor.
   - Clique em **"⚡ Inserir no Editor"** em qualquer cartão didático para ver o código sendo inserido em tempo real!
   - No editor, digite `java-string` ou `mentor-` e pressione `Ctrl + Espaço` para ver o autocompletador didático em ação.

---

## 📁 Estrutura do Projeto

```
syntax-mentor/
├── .vscode/
│   ├── launch.json              # Configuração para rodar com F5 no VS Code
│   └── tasks.json               # Tarefa de build contínuo (watch)
├── resources/
│   └── icon.svg                 # Ícone da extensão na barra lateral
├── src/
│   ├── data/
│   │   └── languages/
│   │       ├── index.ts         # Registro central e buscas por linguagem/extensão
│   │       ├── java.ts          # Base didática Java (Strings, Arrays, Records, etc.)
│   │       ├── python.ts        # Base didática Python (F-strings, Lists, Asyncio, etc.)
│   │       ├── typescript.ts    # Base didática TypeScript (Generics, Functional, etc.)
│   │       ├── csharp.ts        # Base didática C# (LINQ, Pattern Matching, Raw Strings)
│   │       ├── go.ts            # Base didática Go (Slices, Maps Comma-Ok, Goroutines)
│   │       └── rust.ts          # Base didática Rust (String vs &str, Vec, Ownership)
│   ├── providers/
│   │   ├── HoverProvider.ts     # Exibe explicações ao passar o mouse sobre palavras-chave
│   │   ├── RealTimeCompletionProvider.ts # Autocompletador e analisador didático
│   │   └── SidebarWebviewProvider.ts     # Provedor do painel Webview na barra lateral
│   ├── webview/
│   │   └── webviewContent.ts    # Interface HTML/CSS/JS moderna integrada ao tema
│   ├── extension.ts             # Ponto de entrada e ativação da extensão
│   └── types.ts                 # Tipagens e interfaces TypeScript
├── package.json                 # Manifesto da extensão VS Code
├── tsconfig.json                # Configuração do TypeScript
└── README.md                    # Documentação do projeto
```

---

## 📦 Como Gerar o Pacote `.vsix` para Instalação Permanente

Caso queira instalar a extensão diretamente no seu VS Code do dia a dia sem precisar do modo de desenvolvimento:

1. Instale o empacotador oficial do VS Code (caso não tenha):
   ```bash
   npm install -g @vscode/vsce
   ```

2. Gere o pacote `.vsix`:
   ```bash
   npx @vscode/vsce package
   ```

3. No VS Code, abra o painel de Extensões (`Ctrl + Shift + X`), clique no menu `...` (canto superior direito) e selecione **"Install from VSIX..."**, escolhendo o arquivo `.vsix` gerado.
