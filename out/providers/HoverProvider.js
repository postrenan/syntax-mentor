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
exports.DidacticHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const languages_1 = require("../data/languages");
class DidacticHoverProvider {
    provideHover(document, position, token) {
        const lang = (0, languages_1.getLanguageByVsCodeId)(document.languageId);
        if (!lang) {
            return null;
        }
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }
        const word = document.getText(range).toLowerCase();
        if (word.length < 3) {
            return null;
        }
        // Find snippet matching this word in keywords or titles
        const matches = lang.snippets.filter(s => s.keywords.some(k => k.toLowerCase() === word || word.includes(k.toLowerCase())) ||
            s.title.toLowerCase().includes(word));
        if (matches.length === 0) {
            return null;
        }
        const snippet = matches[0];
        const md = new vscode.MarkdownString();
        md.isTrusted = true;
        md.supportHtml = true;
        md.appendMarkdown(`### 📘 Guia Didático: ${snippet.title} (${lang.name})\n\n`);
        md.appendMarkdown(`${snippet.summary}\n\n`);
        md.appendMarkdown(`**Explicação Didática:**\n\n${snippet.explanation}\n\n`);
        if (snippet.bestPractices && snippet.bestPractices.length > 0) {
            md.appendMarkdown(`**✅ Boas Práticas:**\n`);
            for (const bp of snippet.bestPractices) {
                md.appendMarkdown(`- ${bp}\n`);
            }
            md.appendMarkdown(`\n`);
        }
        md.appendMarkdown(`[Inserir Exemplo no Editor](command:syntax-mentor.insertSnippet?${encodeURIComponent(JSON.stringify(snippet.code))})`);
        return new vscode.Hover(md, range);
    }
}
exports.DidacticHoverProvider = DidacticHoverProvider;
//# sourceMappingURL=HoverProvider.js.map