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
exports.RealTimeCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
const languages_1 = require("../data/languages");
class RealTimeCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        const lang = (0, languages_1.getLanguageByVsCodeId)(document.languageId);
        if (!lang) {
            return [];
        }
        const linePrefix = document.lineAt(position).text.substring(0, position.character).toLowerCase();
        const items = [];
        for (const snippet of lang.snippets) {
            // 1. Direct trigger completion (e.g. "java-string-pool" or "py-list-comprehension")
            const triggerItem = this.createCompletionItem(snippet.completionTrigger || snippet.id, snippet, lang.name, vscode.CompletionItemKind.Snippet, `📘 [Syntax Mentor] ${snippet.title}`);
            items.push(triggerItem);
            // 2. Generic prefix helpers: "mentor-", "syntax-", "didatico-"
            const mentorPrefixItem = this.createCompletionItem(`mentor-${snippet.category}-${snippet.id.split('-').pop()}`, snippet, lang.name, vscode.CompletionItemKind.Snippet, `💡 [Mentor] ${snippet.title}`);
            items.push(mentorPrefixItem);
            // 3. Keyword-based matching if user typed any snippet keyword
            for (const kw of snippet.keywords) {
                if (kw.length >= 3 && linePrefix.includes(kw)) {
                    const keywordItem = this.createCompletionItem(`${kw}-${snippet.id.split('-').pop()}`, snippet, lang.name, vscode.CompletionItemKind.Reference, `📖 [Guia Didático] ${snippet.title}`);
                    // High relevance priority
                    keywordItem.sortText = `0_${snippet.title}`;
                    items.push(keywordItem);
                }
            }
        }
        return items;
    }
    createCompletionItem(label, snippet, langName, kind, detailTitle) {
        const item = new vscode.CompletionItem(label, kind);
        item.detail = detailTitle;
        item.insertText = new vscode.SnippetString(snippet.code);
        const doc = new vscode.MarkdownString();
        doc.isTrusted = true;
        doc.supportHtml = true;
        doc.appendMarkdown(`### 🎓 ${snippet.title} (${langName})\n\n`);
        doc.appendMarkdown(`**Categoria:** \`${snippet.category}\`\n\n`);
        doc.appendMarkdown(`${snippet.summary}\n\n`);
        doc.appendMarkdown(`---\n\n`);
        doc.appendCodeblock(snippet.code, snippet.id.split('-')[0]);
        doc.appendMarkdown(`\n**💡 Explicação Didática:**\n\n${snippet.explanation}\n\n`);
        if (snippet.bestPractices && snippet.bestPractices.length > 0) {
            doc.appendMarkdown(`**✅ Boas Práticas:**\n`);
            for (const bp of snippet.bestPractices) {
                doc.appendMarkdown(`- ${bp}\n`);
            }
            doc.appendMarkdown(`\n`);
        }
        if (snippet.commonPitfalls && snippet.commonPitfalls.length > 0) {
            doc.appendMarkdown(`**⚠️ Armadilhas Comuns:**\n`);
            for (const cp of snippet.commonPitfalls) {
                doc.appendMarkdown(`- ${cp}\n`);
            }
            doc.appendMarkdown(`\n`);
        }
        doc.appendMarkdown(`---\n*Pressione Enter ou Tab para inserir o código didático no arquivo ativo.*`);
        item.documentation = doc;
        return item;
    }
}
exports.RealTimeCompletionProvider = RealTimeCompletionProvider;
//# sourceMappingURL=RealTimeCompletionProvider.js.map