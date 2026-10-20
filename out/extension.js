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
function activate(context) {
    console.log('Syntax Mentor está ativo e pronto para auxiliar no desenvolvimento!');
    // 1. Sidebar Webview Provider
    const sidebarProvider = new SidebarWebviewProvider_1.SidebarWebviewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(SidebarWebviewProvider_1.SidebarWebviewProvider.viewType, sidebarProvider));
    // 2. Real-Time Completion & Analyzer Provider
    const completionProvider = new RealTimeCompletionProvider_1.RealTimeCompletionProvider();
    const hoverProvider = new HoverProvider_1.DidacticHoverProvider();
    const supportedLanguages = [
        'java',
        'python',
        'typescript',
        'javascript',
        'typescriptreact',
        'javascriptreact',
        'csharp',
        'go',
        'rust'
    ];
    for (const langId of supportedLanguages) {
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(langId, completionProvider, '.', ' ', '(', '[', ':', '"', '>', '-'));
        context.subscriptions.push(vscode.languages.registerHoverProvider(langId, hoverProvider));
    }
    // 3. Command: Open Guide
    context.subscriptions.push(vscode.commands.registerCommand('syntax-mentor.openGuide', () => {
        vscode.commands.executeCommand('syntax-mentor.sidebarView.focus');
    }));
    // 4. Command: Select Language via Quick Pick
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
    // 5. Command: Insert Snippet (Used by Webview & Hovers)
    context.subscriptions.push(vscode.commands.registerCommand('syntax-mentor.insertSnippet', async (code) => {
        if (!code) {
            return;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('Nenhum editor de texto aberto para inserir o snippet.');
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