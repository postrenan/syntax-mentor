"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const languages_1 = require("./data/languages");
const SidebarWebviewProvider_1 = require("./providers/SidebarWebviewProvider");
const RealTimeCompletionProvider_1 = require("./providers/RealTimeCompletionProvider");
const HoverProvider_1 = require("./providers/HoverProvider");
const RealTimeAnalyzer_1 = require("./analyzer/RealTimeAnalyzer");
const CodeActionProvider_1 = require("./providers/CodeActionProvider");
function activate(context) {
    console.log('Syntax Mentor está ativo com Analisador Didático em Tempo Real!');
    // 1. Sidebar Webview Provider
    const sidebarProvider = new SidebarWebviewProvider_1.SidebarWebviewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(SidebarWebviewProvider_1.SidebarWebviewProvider.viewType, sidebarProvider));
    // 2. Real-Time Analyzer & Diagnostics
    const analyzer = new RealTimeAnalyzer_1.RealTimeAnalyzer();
    context.subscriptions.push(analyzer.getDiagnosticCollection());
    // Analyze active editor on start
    if (vscode.window.activeTextEditor) {
        analyzer.analyzeDocument(vscode.window.activeTextEditor.document);
    }
    // Listen to document changes in real time
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        analyzer.analyzeDocument(event.document);
    }));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        analyzer.analyzeDocument(document);
    }));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(document => {
        analyzer.clearDocument(document);
    }));
    // 3. QuickFix / CodeAction Provider (Lightbulb 💡)
    const supportedLanguages = [
        'java',
        'python',
        'typescript',
        'javascript',
        'typescriptreact',
        'javascriptreact',
        'csharp',
        'go',
        'rust',
        'dockerfile',
        'yaml',
        'sql',
        'properties'
    ];
    const codeActionProvider = new CodeActionProvider_1.DidacticCodeActionProvider();
    for (const langId of supportedLanguages) {
        context.subscriptions.push(vscode.languages.registerCodeActionsProvider(langId, codeActionProvider, {
            providedCodeActionKinds: CodeActionProvider_1.DidacticCodeActionProvider.providedCodeActionKinds
        }));
    }
    // 4. Real-Time Completion & Hover Providers
    const completionProvider = new RealTimeCompletionProvider_1.RealTimeCompletionProvider();
    const hoverProvider = new HoverProvider_1.DidacticHoverProvider();
    for (const langId of supportedLanguages) {
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(langId, completionProvider, '.', ' ', '(', '[', ':', '"', '>', '-'));
        context.subscriptions.push(vscode.languages.registerHoverProvider(langId, hoverProvider));
    }
    // 5. Commands
    context.subscriptions.push(vscode.commands.registerCommand('syntax-mentor.openGuide', () => {
        vscode.commands.executeCommand('syntax-mentor.sidebarView.focus');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('syntax-mentor.createTestFile', async (languageId) => {
        await sidebarProvider.createScratchTestFile(languageId || sidebarProvider.getCurrentLanguageId());
    }));
    context.subscriptions.push(vscode.commands.registerCommand('syntax-mentor.selectLanguage', async () => {
        const items = languages_1.ALL_LANGUAGES.map(lang => ({
            label: `$(code) ${lang.name}`,
            description: lang.badge,
            detail: lang.description,
            langId: lang.id
        }));
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecione a linguagem para consultar a sintaxe didática:'
        });
        if (selected) {
            sidebarProvider.setLanguage(selected.langId);
            vscode.commands.executeCommand('syntax-mentor.sidebarView.focus');
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('syntax-mentor.insertSnippet', async (code) => {
        if (!code) {
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            await sidebarProvider.createScratchTestFile(sidebarProvider.getCurrentLanguageId());
            return;
        }
        await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, code + '\n');
        });
    }));
    // 6. Automatic language synchronization with active editor
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (!editor) {
            return;
        }
        const detected = (0, languages_1.getLanguageByVsCodeId)(editor.document.languageId) ||
            (0, languages_1.getLanguageByFilename)(editor.document.fileName);
        if (detected && detected.id !== sidebarProvider.getCurrentLanguageId()) {
            sidebarProvider.setLanguage(detected.id);
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map