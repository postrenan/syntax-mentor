import { ALL_LANGUAGES, getLanguageById } from '../data/languages';
import { CATEGORIES, DidacticSnippet } from '../types';

export function getSidebarHtml(
  currentLangId: string,
  pinnedIds: string[] = [],
  customTips: DidacticSnippet[] = []
): string {
  const currentLang = getLanguageById(currentLangId) || ALL_LANGUAGES[0];

  const languagesJson = JSON.stringify(ALL_LANGUAGES);
  const categoriesJson = JSON.stringify(CATEGORIES);
  const pinnedJson = JSON.stringify(pinnedIds);
  const customTipsJson = JSON.stringify(customTips);

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
      gap: 6px;
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

    .btn-action-top {
      padding: 7px 9px;
      border-radius: 4px;
      background: var(--vscode-button-secondaryBackground, #3a3d41);
      color: var(--vscode-button-secondaryForeground, #ffffff);
      border: none;
      cursor: pointer;
      font-size: 11.5px;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
      transition: filter 0.15s;
    }

    .btn-action-top:hover {
      filter: brightness(1.2);
    }

    .btn-create-tip {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
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

    /* Controls Bar: Collapse all toggle + Stats */
    .sub-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 8px;
      padding: 0 2px;
    }

    .btn-toggle-all {
      background: transparent;
      border: none;
      color: var(--vscode-textLink-foreground, #3794ff);
      cursor: pointer;
      font-size: 11px;
      text-decoration: underline;
      padding: 2px 0;
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

    /* Modal / Form para criar tip */
    .custom-modal {
      display: none;
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-focusBorder, #007acc);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .custom-modal.visible {
      display: block;
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-title {
      font-size: 13.5px;
      font-weight: bold;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--vscode-editor-foreground);
    }

    .form-group {
      margin-bottom: 10px;
    }

    .form-group label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--vscode-descriptionForeground);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 7px 9px;
      border-radius: 4px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      font-size: 12px;
      outline: none;
      font-family: inherit;
    }

    .form-textarea {
      font-family: var(--code-font);
      resize: vertical;
      min-height: 70px;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--vscode-focusBorder);
    }

    .modal-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 14px;
    }

    /* Cards */
    .snippets-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border, rgba(128, 128, 128, 0.25));
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.12);
      transition: border-color 0.15s, box-shadow 0.15s;
      overflow: hidden;
    }

    .card.is-pinned {
      border: 1.5px solid #e5c07b;
      box-shadow: 0 2px 8px rgba(229, 192, 123, 0.2);
    }

    .card:hover {
      border-color: var(--vscode-focusBorder);
    }

    /* Collapsible Card Header */
    .card-header-bar {
      padding: 12px 14px;
      cursor: pointer;
      user-select: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: rgba(255, 255, 255, 0.02);
      transition: background 0.15s;
    }

    .card-header-bar:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .card-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .card-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .collapse-icon {
      font-size: 11px;
      color: var(--vscode-descriptionForeground);
      transition: transform 0.2s ease;
      display: inline-block;
      width: 14px;
      text-align: center;
    }

    .card.is-open .collapse-icon {
      transform: rotate(90deg);
    }

    .card-title {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--vscode-editor-foreground);
      line-height: 1.3;
    }

    .card-actions-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-pin {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 13px;
      padding: 2px 5px;
      border-radius: 4px;
      color: var(--vscode-descriptionForeground);
      transition: transform 0.15s, color 0.15s;
      outline: none;
    }

    .btn-pin:hover {
      transform: scale(1.2);
      color: #e5c07b;
    }

    .btn-pin.pinned {
      color: #e5c07b;
      font-weight: bold;
    }

    .btn-delete-tip {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;
      color: #f44336;
      opacity: 0.7;
    }

    .btn-delete-tip:hover {
      opacity: 1;
      transform: scale(1.15);
    }

    .badges-group {
      display: flex;
      gap: 5px;
      align-items: center;
      flex-wrap: wrap;
      margin-left: 22px;
    }

    .badge-pill {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      font-weight: 500;
    }

    .badge-pinned {
      background: rgba(229, 192, 123, 0.25);
      color: #e5c07b;
      border: 1px solid rgba(229, 192, 123, 0.4);
      font-weight: 600;
    }

    .badge-custom {
      background: rgba(33, 150, 243, 0.25);
      color: #64b5f6;
      border: 1px solid rgba(33, 150, 243, 0.4);
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

    .card-preview-summary {
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
      margin-left: 22px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Collapsible Body */
    .card-body {
      display: none;
      padding: 0 14px 14px 14px;
      border-top: 1px solid var(--vscode-panel-border, rgba(128, 128, 128, 0.15));
      animation: expandAnim 0.15s ease-out;
    }

    .card.is-open .card-body {
      display: block;
    }

    @keyframes expandAnim {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .card-summary-full {
      font-size: 12.5px;
      margin-top: 12px;
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

    /* Semantic Highlighting Tokens */
    .hl-ctrl { color: #c586c0 !important; font-weight: 600; }
    .hl-decl { color: #569cd6 !important; font-weight: 600; }
    .hl-type { color: #4ec9b0 !important; }
    .hl-anno { color: #e5c07b !important; font-weight: 500; }
    .hl-str { color: #ce9178 !important; }
    .hl-num { color: #b5cea8 !important; }
    .hl-com { color: #6a9955 !important; font-style: italic; }
    .hl-dock-sql { color: #4fc1ff !important; font-weight: 700; }
    .hl-fn { color: #dcdcaa !important; }

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
        ${ALL_LANGUAGES.map(lang => `
          <option value="${lang.id}" ${lang.id === currentLang.id ? 'selected' : ''}>
            ${lang.name} (${lang.badge})
          </option>
        `).join('')}
      </select>
      <button id="btnOpenNewTipModal" class="btn-action-top btn-create-tip" title="Criar meu próprio tip para esta linguagem">
        ➕ Criar Tip
      </button>
      <button id="btnCreateTest" class="btn-action-top" title="Criar arquivo de rascunho para testar">
        📄 Testar
      </button>
    </div>

    <input type="text" id="searchInput" class="search-box" placeholder="🔍 Filtrar tópicos (ex: spring, string, array, erro)..." />

    <div class="sub-bar">
      <span id="topicCountPill">Carregando tópicos...</span>
      <button id="btnToggleAll" class="btn-toggle-all">🔽 Expandir Todos</button>
    </div>
  </div>

  <!-- Form Modal: Criar Novo Tip Personalizado -->
  <div id="customTipModal" class="custom-modal">
    <div class="modal-title">
      <span>➕ Novo Tip Personalizado</span>
      <button type="button" id="btnCloseModal" style="background:transparent; border:none; color:var(--vscode-descriptionForeground); cursor:pointer; font-size:16px;">✕</button>
    </div>

    <form id="customTipForm">
      <div class="form-group">
        <label>Título do Conceito / Tip:</label>
        <input type="text" id="tipTitle" class="form-input" placeholder="Ex: Utilitário de Data com LocalDate" required />
      </div>

      <div style="display:flex; gap:8px;">
        <div class="form-group" style="flex:1;">
          <label>Categoria:</label>
          <select id="tipCategory" class="form-select">
            ${CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
          </select>
        </div>

        <div class="form-group" style="flex:1;">
          <label>Nível de Dificuldade:</label>
          <select id="tipLevel" class="form-select">
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário" selected>Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Resumo Curto:</label>
        <input type="text" id="tipSummary" class="form-input" placeholder="Breve resumo em uma frase" required />
      </div>

      <div class="form-group">
        <label>Explicação Didática:</label>
        <textarea id="tipExplanation" class="form-textarea" placeholder="Explique como e por que usar este padrão..." required></textarea>
      </div>

      <div class="form-group">
        <label>Código Recomendado:</label>
        <textarea id="tipCode" class="form-textarea" style="min-height:90px;" placeholder="// Digite o código de exemplo..." required></textarea>
      </div>

      <div class="form-group">
        <label>O Que Evitar (Anti-Padrão - Opcional):</label>
        <textarea id="tipBadCode" class="form-textarea" placeholder="// Código anti-padrão a evitar..."></textarea>
      </div>

      <div class="form-group">
        <label>Por que evitar o anti-padrão (Opcional):</label>
        <input type="text" id="tipBadCodeExplanation" class="form-input" placeholder="Ex: Causa vazamento de memória ou lentidão..." />
      </div>

      <div class="form-group">
        <label>Boas Práticas (uma por linha):</label>
        <textarea id="tipBestPractices" class="form-textarea" placeholder="Use sempre...\nEvite chamar..."></textarea>
      </div>

      <div class="form-group">
        <label>Atalho de Autocompletar (Trigger):</label>
        <input type="text" id="tipTrigger" class="form-input" placeholder="Ex: meu-util-data" />
      </div>

      <div class="modal-buttons">
        <button type="button" id="btnCancelModal" class="action-btn btn-copy">Cancelar</button>
        <button type="submit" class="action-btn btn-insert">Salvar Meu Tip</button>
      </div>
    </form>
  </div>

  <div class="categories-bar" id="categoriesBar"></div>

  <div class="snippets-container" id="snippetsContainer"></div>

  <script>
    const vscode = acquireVsCodeApi();
    const languages = ${languagesJson};
    const categories = ${categoriesJson};
    let pinnedTipIds = ${pinnedJson};
    let userCustomTips = ${customTipsJson};

    let currentLanguageId = "${currentLang.id}";
    let activeCategory = "all";
    let searchQuery = "";

    // Card open state: snippetId -> boolean (DEFAULT: false = FECHADOS!)
    const cardOpenStates = new Map();
    // Snippet active tab: snippetId -> "good" | "bad"
    const activeTabs = new Map();

    const langSelect = document.getElementById("langSelect");
    const searchInput = document.getElementById("searchInput");
    const categoriesBar = document.getElementById("categoriesBar");
    const container = document.getElementById("snippetsContainer");
    const topicCountPill = document.getElementById("topicCountPill");
    const btnToggleAll = document.getElementById("btnToggleAll");
    const btnCreateTest = document.getElementById("btnCreateTest");

    // Modal elements
    const customTipModal = document.getElementById("customTipModal");
    const btnOpenNewTipModal = document.getElementById("btnOpenNewTipModal");
    const btnCloseModal = document.getElementById("btnCloseModal");
    const btnCancelModal = document.getElementById("btnCancelModal");
    const customTipForm = document.getElementById("customTipForm");

    btnOpenNewTipModal.addEventListener("click", () => {
      customTipModal.classList.add("visible");
      document.getElementById("tipTitle").focus();
    });

    function closeModal() {
      customTipModal.classList.remove("visible");
      customTipForm.reset();
    }

    btnCloseModal.addEventListener("click", closeModal);
    btnCancelModal.addEventListener("click", closeModal);

    customTipForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("tipTitle").value.trim();
      const category = document.getElementById("tipCategory").value;
      const level = document.getElementById("tipLevel").value;
      const summary = document.getElementById("tipSummary").value.trim();
      const explanation = document.getElementById("tipExplanation").value.trim();
      const code = document.getElementById("tipCode").value;
      const badCode = document.getElementById("tipBadCode").value.trim();
      const badCodeExplanation = document.getElementById("tipBadCodeExplanation").value.trim();
      const bpText = document.getElementById("tipBestPractices").value.trim();
      const trigger = document.getElementById("tipTrigger").value.trim();

      const bestPractices = bpText ? bpText.split("\\n").map(s => s.trim()).filter(Boolean) : [];
      const id = "custom-" + Date.now();

      const newTip = {
        id: id,
        languageId: currentLanguageId,
        title: title,
        summary: summary,
        category: category,
        level: level,
        code: code,
        badCode: badCode || undefined,
        badCodeExplanation: badCodeExplanation || undefined,
        explanation: explanation,
        bestPractices: bestPractices,
        completionTrigger: trigger || ("custom-" + title.toLowerCase().replace(/\\s+/g, '-')),
        keywords: [title.toLowerCase(), category, "meu tip", currentLanguageId],
        isCustom: true,
        createdAt: Date.now()
      };

      userCustomTips.unshift(newTip);
      // Auto-open newly created tip
      cardOpenStates.set(id, true);

      vscode.postMessage({
        command: "saveCustomTip",
        tip: newTip
      });

      closeModal();
      renderCategoriesBar();
      updateModalCategories();
      render();
    });

    btnCreateTest.addEventListener("click", () => {
      vscode.postMessage({
        command: "createTestFile",
        languageId: currentLanguageId
      });
    });

    langSelect.addEventListener("change", (e) => {
      currentLanguageId = e.target.value;
      activeCategory = "all";
      vscode.postMessage({ command: "changeLanguage", languageId: currentLanguageId });
      renderCategoriesBar();
      updateModalCategories();
      render();
    });

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      render();
    });

    categoriesBar.addEventListener("click", (e) => {
      const pill = e.target.closest(".cat-pill");
      if (!pill) return;
      activeCategory = pill.dataset.cat;
      renderCategoriesBar();
      render();
    });

    function renderCategoriesBar() {
      const lang = languages.find(l => l.id === currentLanguageId) || languages[0];
      const matchingCustom = userCustomTips.filter(t => t.languageId === currentLanguageId);
      const combined = [...matchingCustom, ...lang.snippets];

      const presentCatIds = new Set(combined.map(s => s.category));

      if (activeCategory !== "all" && !presentCatIds.has(activeCategory)) {
        activeCategory = "all";
      }

      const availableCategories = categories.filter(c => presentCatIds.has(c.id));

      let html = \`<div class="cat-pill \${activeCategory === 'all' ? 'active' : ''}" data-cat="all">Todos (\${combined.length})</div>\`;

      for (const cat of availableCategories) {
        const count = combined.filter(s => s.category === cat.id).length;
        const isActive = activeCategory === cat.id ? 'active' : '';
        html += \`<div class="cat-pill \${isActive}" data-cat="\${cat.id}">\${escapeHtml(cat.label)} (\${count})</div>\`;
      }

      categoriesBar.innerHTML = html;
    }

    function updateModalCategories() {
      const lang = languages.find(l => l.id === currentLanguageId) || languages[0];
      const matchingCustom = userCustomTips.filter(t => t.languageId === currentLanguageId);
      const combined = [...matchingCustom, ...lang.snippets];
      const presentCatIds = new Set(combined.map(s => s.category));

      const tipCategorySelect = document.getElementById("tipCategory");
      if (!tipCategorySelect) return;

      const present = categories.filter(c => presentCatIds.has(c.id));
      const others = categories.filter(c => !presentCatIds.has(c.id));

      let html = "";
      if (present.length > 0) {
        html += \`<optgroup label="Recomendadas para \${escapeHtml(lang.name)}">\`;
        for (const c of present) {
          html += \`<option value="\${c.id}">\${escapeHtml(c.label)}</option>\`;
        }
        html += \`</optgroup>\`;
      }

      if (others.length > 0) {
        html += \`<optgroup label="Outras Categorias">\`;
        for (const c of others) {
          html += \`<option value="\${c.id}">\${escapeHtml(c.label)}</option>\`;
        }
        html += \`</optgroup>\`;
      }

      tipCategorySelect.innerHTML = html;
    }

    let allExpanded = false;
    btnToggleAll.addEventListener("click", () => {
      allExpanded = !allExpanded;
      const currentList = getActiveSnippetsList();
      for (const s of currentList) {
        cardOpenStates.set(s.id, allExpanded);
      }
      btnToggleAll.textContent = allExpanded ? "🔼 Recolher Todos" : "🔽 Expandir Todos";
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

    function highlightCode(code) {
      if (!code) return "";
      let html = escapeHtml(code);

      // Comments
      html = html.replace(/(\\/{2}.*?$|#.*?$|--.*?$)/gm, '<span class="hl-com">$1</span>');
      // Strings
      html = html.replace(/(&quot;[\\s\\S]*?&quot;|&#039;[\\s\\S]*?&#039;|\\x60[\\s\\S]*?\\x60)/g, '<span class="hl-str">$1</span>');
      // Annotations
      html = html.replace(/(@[a-zA-Z0-9_]+)/g, '<span class="hl-anno">$1</span>');
      // Docker & SQL
      const dockerSql = "\\b(FROM|WORKDIR|COPY|RUN|EXPOSE|ENTRYPOINT|CMD|ENV|VOLUME|USER|ARG|HEALTHCHECK|SELECT|INSERT|INTO|UPDATE|DELETE|SET|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|BEGIN|COMMIT|ROLLBACK|TRANSACTION|CREATE|TABLE|INDEX|UNIQUE|DROP|ALTER|EXPLAIN|ANALYZE)\\b";
      html = html.replace(new RegExp(dockerSql, "g"), '<span class="hl-dock-sql">$1</span>');
      // Control flow
      const controlFlow = "\\b(if|else|switch|case|default|for|while|do|break|continue|return|throw|throws|try|catch|finally|yield|match|async|await)\\b";
      html = html.replace(new RegExp(controlFlow, "g"), '<span class="hl-ctrl">$1</span>');
      // Declarations
      const declarations = "\\b(public|private|protected|static|final|abstract|class|record|interface|enum|extends|implements|new|import|package|def|fn|func|var|let|const|mut|struct|impl|trait|type|namespace|using|services|networks|volumes)\\b";
      html = html.replace(new RegExp(declarations, "g"), '<span class="hl-decl">$1</span>');
      // Types
      const types = "\\b(String|StringBuilder|List|ArrayList|Map|HashMap|Set|HashSet|Integer|Double|Boolean|Long|Optional|ResponseEntity|ProblemDetail|UUID|JpaRepository|Task|Promise|Vec|Result|Option|int|double|boolean|char|byte|long|float|void)\\b";
      html = html.replace(new RegExp(types, "g"), '<span class="hl-type">$1</span>');
      // Numbers
      html = html.replace(/\\b(\\d+(?:\\.\\d+)?(?:[fLmd])?)\\b/g, '<span class="hl-num">$1</span>');

      return html;
    }

    function getActiveSnippetsList() {
      const lang = languages.find(l => l.id === currentLanguageId) || languages[0];
      const matchingCustom = userCustomTips.filter(t => t.languageId === currentLanguageId);
      const combined = [...matchingCustom, ...lang.snippets];

      let filtered = combined;

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

      // SORTING: Pinned items appear FIRST!
      filtered.sort((a, b) => {
        const aPinned = pinnedTipIds.includes(a.id);
        const bPinned = pinnedTipIds.includes(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        if (aPinned && bPinned) {
          return pinnedTipIds.indexOf(a.id) - pinnedTipIds.indexOf(b.id);
        }
        return 0;
      });

      return filtered;
    }

    function render() {
      const lang = languages.find(l => l.id === currentLanguageId) || languages[0];
      const filtered = getActiveSnippetsList();

      topicCountPill.textContent = \`📚 \${filtered.length} tópicos (\${pinnedTipIds.filter(id => filtered.some(s => s.id === id)).length} fixados)\`;

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
        const isOpen = cardOpenStates.get(snippet.id) === true; // DEFAULT: FECHADO!
        const isPinned = pinnedTipIds.includes(snippet.id);
        const currentTab = activeTabs.get(snippet.id) || "good";
        const hasBadCode = !!snippet.badCode;

        let levelClass = "badge-level-iniciante";
        if (snippet.level === "Intermediário") levelClass = "badge-level-intermediario";
        if (snippet.level === "Avançado") levelClass = "badge-level-avancado";

        const codeToDisplay = (currentTab === "bad" && hasBadCode) ? snippet.badCode : snippet.code;

        return \`
          <div class="card \${isOpen ? 'is-open' : ''} \${isPinned ? 'is-pinned' : ''}" id="card-\${snippet.id}">
            <!-- Collapsible Header -->
            <div class="card-header-bar" onclick="toggleCard('\${snippet.id}')">
              <div class="card-top-row">
                <div class="card-title-wrap">
                  <span class="collapse-icon">▶</span>
                  <div class="card-title">\${escapeHtml(snippet.title)}</div>
                </div>

                <div class="card-actions-right" onclick="event.stopPropagation()">
                  <button class="btn-pin \${isPinned ? 'pinned' : ''}" onclick="togglePinTip('\${snippet.id}')" title="\${isPinned ? 'Desafixar do topo' : 'Fixar no topo'}">
                    \${isPinned ? '📌' : '📍'}
                  </button>
                  \${snippet.isCustom ? \`
                    <button class="btn-delete-tip" onclick="deleteCustomTip('\${snippet.id}')" title="Excluir este tip personalizado">
                      🗑️
                    </button>
                  \` : ''}
                </div>
              </div>

              <div class="badges-group">
                \${isPinned ? '<span class="badge-pill badge-pinned">📌 Fixado</span>' : ''}
                \${snippet.isCustom ? '<span class="badge-pill badge-custom">⭐ Meu Tip</span>' : ''}
                \${snippet.level ? \`<span class="badge-pill \${levelClass}">\${escapeHtml(snippet.level)}</span>\` : ''}
                <span class="badge-pill badge-cat">\${escapeHtml(catLabel)}</span>
              </div>

              \${!isOpen ? \`
                <div class="card-preview-summary">\${escapeHtml(snippet.summary)}</div>
              \` : ''}
            </div>

            <!-- Collapsible Body Content -->
            <div class="card-body">
              <div class="card-summary-full">\${escapeHtml(snippet.summary)}</div>

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
          </div>
        \`;
      }).join('');
    }

    window.toggleCard = function(snippetId) {
      const current = cardOpenStates.get(snippetId) === true;
      cardOpenStates.set(snippetId, !current);
      render();
    };

    window.togglePinTip = function(snippetId) {
      const idx = pinnedTipIds.indexOf(snippetId);
      if (idx >= 0) {
        pinnedTipIds.splice(idx, 1);
      } else {
        pinnedTipIds.unshift(snippetId);
      }

      vscode.postMessage({
        command: "togglePin",
        snippetId: snippetId
      });

      render();
    };

    window.deleteCustomTip = function(snippetId) {
      userCustomTips = userCustomTips.filter(t => t.id !== snippetId);
      pinnedTipIds = pinnedTipIds.filter(id => id !== snippetId);
      cardOpenStates.delete(snippetId);

      vscode.postMessage({
        command: "deleteCustomTip",
        snippetId: snippetId
      });

      renderCategoriesBar();
      updateModalCategories();
      render();
    };

    window.switchSnippetTab = function(snippetId, tab) {
      activeTabs.set(snippetId, tab);
      render();
    };

    function findSnippet(snippetId) {
      const custom = userCustomTips.find(s => s.id === snippetId);
      if (custom) return custom;
      const lang = languages.find(l => l.id === currentLanguageId);
      return lang?.snippets.find(s => s.id === snippetId);
    }

    window.copySnippetCode = function(snippetId, tab) {
      const snippet = findSnippet(snippetId);
      if (!snippet) return;

      const code = (tab === 'bad' && snippet.badCode) ? snippet.badCode : snippet.code;
      navigator.clipboard.writeText(code).then(() => {
        vscode.postMessage({ command: "notify", text: "Código copiado para a área de transferência!" });
      });
    };

    window.insertSnippetCode = function(snippetId, tab) {
      const snippet = findSnippet(snippetId);
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
        activeCategory = "all";
        renderCategoriesBar();
        updateModalCategories();
        render();
      } else if (message.command === "updatePins") {
        pinnedTipIds = message.pinnedTipIds;
        render();
      } else if (message.command === "updateCustomTips") {
        userCustomTips = message.customTips;
        renderCategoriesBar();
        updateModalCategories();
        render();
      }
    });

    renderCategoriesBar();
    updateModalCategories();
    render();
  </script>
</body>
</html>`;
}
