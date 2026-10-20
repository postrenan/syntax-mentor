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
exports.SidebarWebviewProvider = void 0;
const vscode = __importStar(require("vscode"));
const languages_1 = require("../data/languages");
const webviewContent_1 = require("../webview/webviewContent");
class SidebarWebviewProvider {
    _extensionUri;
    static viewType = 'syntax-mentor.sidebarView';
    _view;
    _currentLanguageId = 'java';
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        // Auto-detect language from active editor on initial view load
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const detected = (0, languages_1.getLanguageByVsCodeId)(activeEditor.document.languageId) ||
                (0, languages_1.getLanguageByFilename)(activeEditor.document.fileName);
            if (detected) {
                this._currentLanguageId = detected.id;
            }
        }
        webviewView.webview.html = (0, webviewContent_1.getSidebarHtml)(this._currentLanguageId);
        // Message handler from webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.command) {
                case 'insertCode': {
                    await this.insertCodeIntoEditor(data.code, data.title);
                    break;
                }
                case 'notify': {
                    vscode.window.showInformationMessage(`Syntax Mentor: ${data.text}`);
                    break;
                }
                case 'changeLanguage': {
                    this._currentLanguageId = data.languageId;
                    break;
                }
            }
        });
    }
    setLanguage(languageId) {
        this._currentLanguageId = languageId;
        if (this._view) {
            this._view.webview.postMessage({
                command: 'setLanguage',
                languageId: languageId
            });
        }
    }
    getCurrentLanguageId() {
        return this._currentLanguageId;
    }
    async insertCodeIntoEditor(code, title) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('Nenhum editor de texto ativo para inserir o código.');
            return;
        }
        const selection = editor.selection;
        const success = await editor.edit(editBuilder => {
            if (selection.isEmpty) {
                editBuilder.insert(selection.active, code + '\n');
            }
            else {
                editBuilder.replace(selection, code);
            }
        });
        if (success) {
            vscode.window.showInformationMessage(title ? `Snippet "${title}" inserido com sucesso!` : 'Código inserido com sucesso!');
        }
    }
}
exports.SidebarWebviewProvider = SidebarWebviewProvider;
//# sourceMappingURL=SidebarWebviewProvider.js.map