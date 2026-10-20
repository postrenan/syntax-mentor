"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSidebarHtml = getSidebarHtml;
const languages_1 = require("../data/languages");
const types_1 = require("../types");
function getSidebarHtml(currentLangId) {
    const currentLang = (0, languages_1.getLanguageById)(currentLangId) || languages_1.ALL_LANGUAGES[0];
    const languagesJson = JSON.stringify(languages_1.ALL_LANGUAGES);
    const categoriesJson = JSON.stringify(types_1.CATEGORIES);
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Syntax Mentor</title>
  <style>
    :root {
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --code-font: "JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      font-size: 13px;
      color: var(--vscode-editor-foreground);
      background-color: var(--vscode-sideBar-background, var(--vscode-editor-background));
      padding: 12px;
      line-height: 1.5;
    }

    /* Top Controls */
    .header-bar {
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .selector-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .lang-select {
      flex: 1;
      padding: 7px 10px;
      border-radius: 4px;
      background: var(--vscode-dropdown-background);
      color: var(--vscode-dropdown-foreground);
      border: 1px solid var(--vscode-dropdown-border, var(--vscode-input-border));
      font-size: 13px;
      font-weight: 600;
      outline: none;
      cursor: pointer;
    }

    .lang-select:focus {
      border-color: var(--vscode-focusBorder);
    }

    .btn-create-test {
      padding: 7px 10px;
      border-radius: 4px;
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #ffffff);
      border: none;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }

    .btn-create-test:hover {
      filter: brightness(1.2);
    }

    .search-box {
      width: 100%;
      padding: 8px 10px;
      border-radius: 4px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      font-size: 12px;
      outline: none;
    }

    .search-box:focus {
      border-color: var(--vscode-focusBorder);
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 6px;
      padding: 0 2px;
    }

    /* Category Pills */
    .categories-bar {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 6px;
      margin-bottom: 12px;
      scrollbar-width: thin;
    }

    .categories-bar::-webkit-scrollbar {
      height: 4px;
    }
    .categories-bar::-webkit-scrollbar-thumb {
      background: var(--vscode-scrollbarSlider-background);
      border-radius: 2px;
    }

    .cat-pill {
      white-space: nowrap;
      padding: 4px 9px;
      font-size: 11px;
      border-radius: 12px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      cursor: pointer;
      border: 1px solid transparent;
      user-select: none;
      transition: all 0.15s ease;
    }

    .cat-pill.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      font-weight: bold;
    }

    .cat-pill:hover:not(.active) {
      filter: brightness(1.2);
    }

    /* Cards */
    .snippets-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border, rgba(128, 128, 128, 0.25));
      border-radius: 8px;
      padding: 14px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .card:hover {
      border-color: var(--vscode-focusBorder);
    }

    .card-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
      gap: 8px;
    }

    .card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--vscode-editor-foreground);
      line-height: 1.3;
    }

    .badges-group {
      display: flex;
      gap: 5px;
      align-items: center;
      flex-wrap: wrap;
    }

    .badge-pill {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      font-weight: 500;
    }

    .badge-cat {
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .badge-level-iniciante {
      background: rgba(46, 125, 50, 0.2);
      color: #4caf50;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }

    .badge-level-intermediario {
      background: rgba(239, 108, 0, 0.2);
      color: #ff9800;
      border: 1px solid rgba(255, 152, 0, 0.3);
    }

    .badge-level-avancado {
      background: rgba(156, 39, 176, 0.2);
      color: #ba68c8;
      border: 1px solid rgba(186, 104, 200, 0.3);
    }

    .card-summary {
      font-size: 12.5px;
      opacity: 0.92;
      margin-bottom: 10px;
      color: var(--vscode-descriptionForeground);
    }

    .card-explanation {
      background: rgba(127, 127, 127, 0.08);
      border-left: 3px solid var(--vscode-button-background);
      padding: 9px 12px;
      border-radius: 0 6px 6px 0;
      font-size: 12px;
      margin-bottom: 12px;
    }

    /* Code View Tabs (Idiomático vs Anti-padrão) */
    .code-tabs {
      display: flex;
      border-bottom: 1px solid var(--vscode-panel-border, #333);
      margin-bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px 6px 0 0;
      overflow: hidden;
    }

    .code-tab-btn {
      padding: 6px 12px;
      font-size: 11px;
      border: none;
      background: transparent;
      color: var(--vscode-descriptionForeground);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
    }

    .code-tab-btn.active {
      color: var(--vscode-editor-foreground);
      background: var(--vscode-textCodeBlock-background, #1e1e1e);
      border-bottom: 2px solid var(--vscode-button-background);
      font-weight: 600;
    }

    .code-container {
      position: relative;
      margin-bottom: 12px;
      border-radius: 0 0 6px 6px;
      overflow: hidden;
      background: var(--vscode-textCodeBlock-background, #1e1e1e);
      border: 1px solid var(--vscode-panel-border, #333);
      border-top: none;
    }

    .code-actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 6px;
      padding: 6px 10px;
      background: rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid rgba(128, 128, 128, 0.15);
    }

    .action-btn {
      padding: 4px 9px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: none;
      outline: none;
      font-weight: 500;
      transition: filter 0.15s;
    }

    .btn-insert {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }

    .btn-insert:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .btn-copy {
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #ffffff);
    }

    .btn-copy:hover {
      filter: brightness(1.2);
    }

    pre {
      padding: 12px;
      overflow-x: auto;
      font-family: var(--code-font);
      font-size: 12px;
      line-height: 1.5;
      color: var(--vscode-editor-foreground);
      white-space: pre;
    }

    /* Syntax Highlighting Colors */
    .hl-kw { color: #569cd6; font-weight: bold; }
    .hl-type { color: #4ec9b0; }
    .hl-str { color: #ce9178; }
    .hl-num { color: #b5cea8; }
    .hl-com { color: #6a9955; font-style: italic; }
    .hl-fn { color: #dcdcaa; }

    /* Checklist & Warnings */
    .section-title {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 10px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .best-practices-list {
      list-style: none;
      margin-bottom: 8px;
    }

    .best-practices-list li {
      position: relative;
      padding-left: 20px;
      font-size: 11.5px;
      margin-bottom: 4px;
      color: var(--vscode-editor-foreground);
    }

    .best-practices-list li::before {
      content: "✔";
      position: absolute;
      left: 0;
      color: #4caf50;
      font-weight: bold;
    }

    .pitfall-box {
      background: rgba(244, 67, 54, 0.08);
      border-left: 3px solid #f44336;
      padding: 8px 10px;
      border-radius: 0 4px 4px 0;
      font-size: 11.5px;
      margin-top: 6px;
      margin-bottom: 8px;
    }

    .trigger-hint {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .trigger-code {
      font-family: var(--code-font);
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 15px;
      color: var(--vscode-descriptionForeground);
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="selector-row">
      <select id="langSelect" class="lang-select">
        ${languages_1.ALL_LANGUAGES.map(lang => `
          <option value="${lang.id}" ${lang.id === currentLang.id ? 'selected' : ''}>
            ${lang.name} (${lang.badge})
          </option>
        `).join('')}
      </select>
      <button id="btnCreateTest" class="btn-create-test" title="Criar arquivo de rascunho para testar">
        📄 Testar
      </button>
    </div>

    <input type="text" id="searchInput" class="search-box" placeholder="🔍 Filtrar tópicos (ex: string, array, stream, loop)..." />

    <div class="stats-bar">
      <span id="topicCountPill">Carregando tópicos...</span>
      <span id="analyzerActivePill">⚡ Analisador em Tempo Real Ativo</span>
    </div>
  </div>

  <div class="categories-bar" id="categoriesBar">
    <div class="cat-pill active" data-cat="all">Todos</div>
    ${types_1.CATEGORIES.map(cat => `
      <div class="cat-pill" data-cat="${cat.id}">${cat.label}</div>
    `).join('')}
  </div>

  <div class="snippets-container" id="snippetsContainer"></div>

  <script>
    const vscode = acquireVsCodeApi();
    const languages = ${languagesJson};
    const categories = ${categoriesJson};

    let currentLanguageId = "${currentLang.id}";
    let activeCategory = "all";
    let searchQuery = "";
    // State of snippet active tab: snippetId -> "good" | "bad"
    const activeTabs = new Map();

    const langSelect = document.getElementById("langSelect");
    const searchInput = document.getElementById("searchInput");
    const categoriesBar = document.getElementById("categoriesBar");
    const container = document.getElementById("snippetsContainer");
    const topicCountPill = document.getElementById("topicCountPill");
    const btnCreateTest = document.getElementById("btnCreateTest");

    btnCreateTest.addEventListener("click", () => {
      vscode.postMessage({
        command: "createTestFile",
        languageId: currentLanguageId
      });
    });

    langSelect.addEventListener("change", (e) => {
      currentLanguageId = e.target.value;
      vscode.postMessage({ command: "changeLanguage", languageId: currentLanguageId });
      render();
    });

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      render();
    });

    categoriesBar.addEventListener("click", (e) => {
      const pill = e.target.closest(".cat-pill");
      if (!pill) return;
      document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.cat;
      render();
    });

    function escapeHtml(text) {
      if (!text) return "";
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Lightweight client-side syntax highlighter
    function highlightCode(code) {
      if (!code) return "";
      let html = escapeHtml(code);

      // Comments
      html = html.replace(/(\\/{2}.*?$|#.*?$)/gm, '<span class="hl-com">$1</span>');
      // Strings
      html = html.replace(/(&quot;[\\s\\S]*?&quot;|&#039;[\\s\\S]*?&#039;|\\x60[\\s\\S]*?\\x60)/g, '<span class="hl-str">$1</span>');
      // Numbers
      html = html.replace(/\\b(\\d+(?:\\.\\d+)?(?:[fLmd])?)\\b/g, '<span class="hl-num">$1</span>');
      // Keywords
      const keywords = "\\b(public|private|protected|static|final|class|record|interface|enum|void|return|new|import|package|def|fn|func|let|const|var|mut|struct|impl|match|case|switch|if|else|for|while|try|catch|finally|throw|throws|async|await|select)\\b";
      html = html.replace(new RegExp(keywords, "g"), '<span class="hl-kw">$1</span>');
      // Common Types
      const types = "\\b(String|StringBuilder|List|ArrayList|Map|HashMap|Set|HashSet|Integer|Double|Boolean|Task|Promise|Vec|Option|Result|int|double|boolean|char|byte|long|float)\\b";
      html = html.replace(new RegExp(types, "g"), '<span class="hl-type">$1</span>');

      return html;
    }

    function render() {
      const lang = languages.find(l => l.id === currentLanguageId) || languages[0];
      let filtered = lang.snippets;

      if (activeCategory !== "all") {
        filtered = filtered.filter(s => s.category === activeCategory);
      }

      if (searchQuery) {
        filtered = filtered.filter(s => {
          return s.title.toLowerCase().includes(searchQuery) ||
                 s.summary.toLowerCase().includes(searchQuery) ||
                 s.explanation.toLowerCase().includes(searchQuery) ||
                 s.code.toLowerCase().includes(searchQuery) ||
                 s.keywords.some(k => k.toLowerCase().includes(searchQuery));
        });
      }

      topicCountPill.textContent = \`📚 \${filtered.length} tópicos em \${lang.name}\`;

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <p>Nenhum exemplo didático encontrado para os filtros selecionados.</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = filtered.map(snippet => {
        const catInfo = categories.find(c => c.id === snippet.category);
        const catLabel = catInfo ? catInfo.label : snippet.category;
        const currentTab = activeTabs.get(snippet.id) || "good";
        const hasBadCode = !!snippet.badCode;

        let levelClass = "badge-level-iniciante";
        if (snippet.level === "Intermediário") levelClass = "badge-level-intermediario";
        if (snippet.level === "Avançado") levelClass = "badge-level-avancado";

        const codeToDisplay = (currentTab === "bad" && hasBadCode) ? snippet.badCode : snippet.code;

        return \`
          <div class="card" id="card-\${snippet.id}">
            <div class="card-top-row">
              <div class="card-title">\${escapeHtml(snippet.title)}</div>
              <div class="badges-group">
                \${snippet.level ? \`<span class="badge-pill \${levelClass}">\${escapeHtml(snippet.level)}</span>\` : ''}
                <span class="badge-pill badge-cat">\${escapeHtml(catLabel)}</span>
              </div>
            </div>

            <div class="card-summary">\${escapeHtml(snippet.summary)}</div>

            <div class="card-explanation">
              <strong>💡 Conceito Didático:</strong> \${escapeHtml(snippet.explanation)}
            </div>

            \${hasBadCode ? \`
              <div class="code-tabs">
                <button class="code-tab-btn \${currentTab === 'good' ? 'active' : ''}" onclick="switchSnippetTab('\${snippet.id}', 'good')">
                  ✅ Código Recomendado
                </button>
                <button class="code-tab-btn \${currentTab === 'bad' ? 'active' : ''}" onclick="switchSnippetTab('\${snippet.id}', 'bad')">
                  ❌ O Que Evitar (Anti-padrão)
                </button>
              </div>
            \` : ''}

            <div class="code-container" style="\${!hasBadCode ? 'border-radius: 6px; border-top: 1px solid var(--vscode-panel-border, #333);' : ''}">
              <div class="code-actions-bar">
                <button class="action-btn btn-copy" onclick="copySnippetCode('\${snippet.id}', '\${currentTab}')">
                  📋 Copiar
                </button>
                <button class="action-btn btn-insert" onclick="insertSnippetCode('\${snippet.id}', '\${currentTab}')">
                  ⚡ Inserir no Editor
                </button>
              </div>
              <pre><code>\${highlightCode(codeToDisplay)}</code></pre>
            </div>

            \${currentTab === 'bad' && snippet.badCodeExplanation ? \`
              <div class="pitfall-box">
                <strong>Por que evitar:</strong> \${escapeHtml(snippet.badCodeExplanation)}
              </div>
            \` : ''}

            \${snippet.bestPractices && snippet.bestPractices.length > 0 ? \`
              <div class="section-title">Boas Práticas</div>
              <ul class="best-practices-list">
                \${snippet.bestPractices.map(bp => \`<li>\${escapeHtml(bp)}</li>\`).join('')}
              </ul>
            \` : ''}

            \${snippet.commonPitfalls && snippet.commonPitfalls.length > 0 ? \`
              <div class="section-title" style="color: #f44336;">Atenção & Pegadinhas</div>
              \${snippet.commonPitfalls.map(cp => \`
                <div class="pitfall-box">⚠️ \${escapeHtml(cp)}</div>
              \`).join('')}
            \` : ''}

            \${snippet.completionTrigger ? \`
              <div class="trigger-hint">
                <span>Atalho no editor:</span>
                <span class="trigger-code">\${escapeHtml(snippet.completionTrigger)}</span>
              </div>
            \` : ''}
          </div>
        \`;
      }).join('');
    }

    window.switchSnippetTab = function(snippetId, tab) {
      activeTabs.set(snippetId, tab);
      render();
    };

    window.copySnippetCode = function(snippetId, tab) {
      const lang = languages.find(l => l.id === currentLanguageId);
      const snippet = lang?.snippets.find(s => s.id === snippetId);
      if (!snippet) return;

      const code = (tab === 'bad' && snippet.badCode) ? snippet.badCode : snippet.code;
      navigator.clipboard.writeText(code).then(() => {
        vscode.postMessage({ command: "notify", text: "Código copiado para a área de transferência!" });
      });
    };

    window.insertSnippetCode = function(snippetId, tab) {
      const lang = languages.find(l => l.id === currentLanguageId);
      const snippet = lang?.snippets.find(s => s.id === snippetId);
      if (!snippet) return;

      const code = (tab === 'bad' && snippet.badCode) ? snippet.badCode : snippet.code;
      vscode.postMessage({
        command: "insertCode",
        code: code,
        title: snippet.title
      });
    };

    window.addEventListener("message", event => {
      const message = event.data;
      if (message.command === "setLanguage") {
        currentLanguageId = message.languageId;
        langSelect.value = message.languageId;
        render();
      }
    });

    render();
  </script>
</body>
</html>`;
}
//# sourceMappingURL=webviewContent.js.map