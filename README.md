# 📘 Syntax Mentor: Guia Didático de Sintaxe, Autocompletador & Tradutor Poliglota

Uma extensão profissional para o **Visual Studio Code** desenvolvida para acelerar o aprendizado, a produtividade e a transição entre diferentes linguagens e tecnologias. Ela reúne um **guia didático interativo na barra lateral**, um **analisador em tempo real com Quick Fixes**, um **tradutor poliglota de código** e suporte a **criação de tips personalizados**.

---

## 🌟 Funcionalidades Principais

### 1. Seletor de Linguagens & Tecnologias
- **Multilinguagem Abrangente:** Suporte aprofundado para:
  - **Java (JDK 17/21+)**
  - **Spring Boot 3** (REST, Injeção por Construtor, Spring Data JPA, Global Exception Handling)
  - **Docker & Compose** (Dockerfile Multi-Stage leve, Compose App+Postgres+Redis, CLI)
  - **SQL & Banco de Dados** (JOINs visuais, Índices B-Tree, Transações ACID)
  - **Git & DevOps** (Rebase vs Merge, Stash, Conventional Commits, Desfazer Erros)
  - **Python** (F-strings, Lists & Comprehensions, Asyncio, Pattern Matching)
  - **TypeScript / JavaScript** (Generics, Utility Types, Async/Await, Métodos Funcionais)
  - **C# (.NET 8+)** (LINQ, Relational Pattern Matching, Raw Strings, Tasks)
  - **Go (Golang)** (Slices, Maps Comma-Ok, Goroutines & Channels CSP)
  - **Rust** (Ownership & Borrowing, String vs &str, Iterators, Result com ?)

### 2. Tags e Categorias Dinâmicas & Contextuais
- Ao selecionar uma linguagem, apenas as tags relevantes para ela são exibidas.
  - Ao selecionar **SQL**, exibe apenas *Banco de Dados & JPA* (oculta POO, Strings, etc.).
  - Ao selecionar **Git**, exibe apenas *Git & Versionamento*.

### 3. Cards Retráteis (Iniciam Fechados) & Fixar no Topo (Pinning)
- **Modo Enxuto:** Todos os cards iniciam **fechados** por padrão para uma navegação limpa, com botão para expandir/recolher todos.
- **Fixar no Topo (📌):** Fixe seus conceitos e snippets mais importantes no topo da lista. O estado de fixação é persistido permanentemente no VS Code.

### 4. Criação de Tips Personalizados pelo Usuário (⭐ Meu Tip)
- Crie e salve seus próprios snippets e anotações didáticas com formulário integrado (`➕ Criar Tip`).
- Seus tips personalizados integram-se automaticamente ao **IntelliSense de autocompletar e ao Hover do editor de código**!

### 5. 🔄 Tradutor de Código Poliglota (Code Transcriber)
- Escreva ou cole código na linguagem que você já domina (ex: Python) e transcreva-o instantaneamente para a linguagem objetivo (ex: Java, TypeScript, C#, Go ou Rust).
- Acompanha **notas didáticas comparativas** explicando as diferenças de tipagem, controle de fluxo e convenções entre as linguagens.
- Botão **`📥 Do Editor`** para puxar o código selecionado diretamente do arquivo ativo no VS Code.

### 6. Analisador em Tempo Real com Quick Fixes (Lâmpada 💡)
- Detecta anti-padrões enquanto você digita no editor:
  - **Java:** Alerta sobre comparação de Strings com `==` e blocos catch vazios, oferecendo Quick Fix automático (`Ctrl + .`).
  - **Python:** Alerta sobre `== None`, `except:` genérico e `range(len(...))`.
  - **TypeScript:** Alerta sobre igualdade solta `==` e uso de `any`.

---

## 🚀 Como Executar e Testar a Extensão no VS Code

1. Clone o repositório:
   ```bash
   git clone https://github.com/postrenan/syntax-mentor.git
   cd syntax-mentor
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Pressione **`F5`** no VS Code para abrir a janela `[Extension Development Host]`.

4. Na Activity Bar à esquerda, clique no ícone **Syntax Mentor** (livro com `</>`).

---

## 📦 Como Instalar Diretamente o Pacote `.vsix`

Se preferir instalar diretamente no seu VS Code do dia a dia:

```powershell
code --install-extension syntax-mentor-1.0.0.vsix
```

Ou no VS Code, abra o painel de Extensões (`Ctrl + Shift + X`) -> clique no menu `...` -> **"Install from VSIX..."** e selecione o arquivo `syntax-mentor-1.0.0.vsix`.

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
