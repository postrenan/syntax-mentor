"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSidebarHtml = getSidebarHtml;
const languages_1 = require("../data/languages");
const types_1 = require("../types");
function getSidebarHtml(currentLangId) {
    const currentLang = (0, languages_1.getLanguageById)(currentLangId) || languages_1.ALL_LANGUAGES[0];
    // Prepare JSON serialized language database for fast client-side searching and tab switching
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
      padding: 6px 10px;
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

    .search-box {
      width: 100%;
      padding: 7px 10px;
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
      gap: 14px;
    }

    .card {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border, rgba(128, 128, 128, 0.25));
      border-radius: 6px;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      transition: border-color 0.15s;
    }

    .card:hover {
      border-color: var(--vscode-focusBorder);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
      gap: 8px;
    }

    .card-title {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--vscode-editor-foreground);
      line-height: 1.3;
    }

    .card-category-badge {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      white-space: nowrap;
    }

    .card-summary {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 10px;
      color: var(--vscode-descriptionForeground);
    }

    .card-explanation {
      background: rgba(127, 127, 127, 0.08);
      border-left: 3px solid var(--vscode-button-background);
      padding: 8px 10px;
      border-radius: 0 4px 4px 0;
      font-size: 12px;
      margin-bottom: 10px;
    }

    /* Code block container */
    .code-container {
      position: relative;
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: hidden;
      background: var(--vscode-textCodeBlock-background, #1e1e1e);
      border: 1px solid var(--vscode-panel-border, #333);
    }

    .code-actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 6px;
      padding: 5px 8px;
      background: rgba(0, 0, 0, 0.15);
      border-bottom: 1px solid rgba(128, 128, 128, 0.15);
    }

    .action-btn {
      padding: 3px 8px;
      font-size: 11px;
      border-radius: 3px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: none;
      outline: none;
      font-weight: 500;
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
      padding: 10px;
      overflow-x: auto;
      font-family: var(--code-font);
      font-size: 12px;
      line-height: 1.45;
      color: var(--vscode-editor-foreground);
      white-space: pre;
    }

    /* Checklist & Warnings */
    .section-title {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 8px;
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
      padding-left: 18px;
      font-size: 11.5px;
      margin-bottom: 3px;
      color: var(--vscode-editor-foreground);
    }

    .best-practices-list li::before {
      content: "✔";
      position: absolute;
      left: 0;
      color: #388e3c;
      font-weight: bold;
    }

    .pitfall-box {
      background: rgba(244, 67, 54, 0.1);
      border-left: 3px solid #f44336;
      padding: 6px 10px;
      border-radius: 0 4px 4px 0;
      font-size: 11.5px;
      margin-top: 6px;
      margin-bottom: 8px;
    }

    .trigger-hint {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .trigger-code {
      font-family: var(--code-font);
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 10.5px;
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
    </div>

    <input type="text" id="searchInput" class="search-box" placeholder="🔍 Filtrar tópicos (ex: string, array, loop, erro)..." />
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

    const langSelect = document.getElementById("langSelect");
    const searchInput = document.getElementById("searchInput");
    const categoriesBar = document.getElementById("categoriesBar");
    const container = document.getElementById("snippetsContainer");

    // Initialize
    render();

    // Event Listeners
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

        return \`
          <div class="card" id="card-\${snippet.id}">
            <div class="card-header">
              <div class="card-title">\${escapeHtml(snippet.title)}</div>
              <span class="card-category-badge">\${escapeHtml(catLabel)}</span>
            </div>

            <div class="card-summary">\${escapeHtml(snippet.summary)}</div>

            <div class="card-explanation">
              <strong>💡 Conceito Didático:</strong> \${escapeHtml(snippet.explanation)}
            </div>

            <div class="code-container">
              <div class="code-actions-bar">
                <button class="action-btn btn-copy" onclick="copySnippet('\${snippet.id}')">
                  📋 Copiar
                </button>
                <button class="action-btn btn-insert" onclick="insertSnippet('\${snippet.id}')">
                  ⚡ Inserir no Editor
                </button>
              </div>
              <pre><code>\${escapeHtml(snippet.code)}</code></pre>
            </div>

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
                <span>Completar no editor:</span>
                <span class="trigger-code">\${escapeHtml(snippet.completionTrigger)}</span>
              </div>
            \` : ''}
          </div>
        \`;
      }).join('');
    }

    window.copySnippet = function(snippetId) {
      const lang = languages.find(l => l.id === currentLanguageId);
      const snippet = lang?.snippets.find(s => s.id === snippetId);
      if (!snippet) return;
      
      navigator.clipboard.writeText(snippet.code).then(() => {
        vscode.postMessage({ command: "notify", text: "Código copiado para a área de transferência!" });
      });
    };

    window.insertSnippet = function(snippetId) {
      const lang = languages.find(l => l.id === currentLanguageId);
      const snippet = lang?.snippets.find(s => s.id === snippetId);
      if (!snippet) return;

      vscode.postMessage({
        command: "insertCode",
        code: snippet.code,
        title: snippet.title
      });
    };

    // Receive messages from extension host
    window.addEventListener("message", event => {
      const message = event.data;
      if (message.command === "setLanguage") {
        currentLanguageId = message.languageId;
        langSelect.value = message.languageId;
        render();
      }
    });
  </script>
</body>
</html>`;
}
//# sourceMappingURL=webviewContent.js.map