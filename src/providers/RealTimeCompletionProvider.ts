import * as vscode from 'vscode';
import { getLanguageByVsCodeId } from '../data/languages';
import { CustomTipsManager } from '../data/CustomTipsManager';
import { DidacticSnippet } from '../types';

export class RealTimeCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const lang = getLanguageByVsCodeId(document.languageId);
    if (!lang) {
      return [];
    }

    const linePrefix = document.lineAt(position).text.substring(0, position.character).toLowerCase();
    const items: vscode.CompletionItem[] = [];

    // Combine built-in snippets with user custom tips
    const customTips = CustomTipsManager.getInstance() ? CustomTipsManager.getInstance().getCustomTips(lang.id) : [];
    const allSnippets = [...customTips, ...lang.snippets];

    for (const snippet of allSnippets) {
      // 1. Direct trigger completion (e.g. "java-string-pool" or "py-list-comprehension")
      const triggerItem = this.createCompletionItem(
        snippet.completionTrigger || snippet.id,
        snippet,
        lang.name,
        vscode.CompletionItemKind.Snippet,
        `📘 [Syntax Mentor] ${snippet.title}`
      );
      items.push(triggerItem);

      // 2. Generic prefix helpers: "mentor-", "syntax-", "didatico-"
      const mentorPrefixItem = this.createCompletionItem(
        `mentor-${snippet.category}-${snippet.id.split('-').pop()}`,
        snippet,
        lang.name,
        vscode.CompletionItemKind.Snippet,
        `💡 [Mentor] ${snippet.title}`
      );
      items.push(mentorPrefixItem);

      // 3. Keyword-based matching if user typed any snippet keyword
      for (const kw of snippet.keywords) {
        if (kw.length >= 3 && linePrefix.includes(kw)) {
          const keywordItem = this.createCompletionItem(
            `${kw}-${snippet.id.split('-').pop()}`,
            snippet,
            lang.name,
            vscode.CompletionItemKind.Reference,
            `📖 [Guia Didático] ${snippet.title}`
          );
          // High relevance priority
          keywordItem.sortText = `0_${snippet.title}`;
          items.push(keywordItem);
        }
      }
    }

    return items;
  }

  private createCompletionItem(
    label: string,
    snippet: DidacticSnippet,
    langName: string,
    kind: vscode.CompletionItemKind,
    detailTitle: string
  ): vscode.CompletionItem {
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
