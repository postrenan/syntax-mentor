import * as vscode from 'vscode';
import { getLanguageByVsCodeId } from '../data/languages';

export class DidacticHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const lang = getLanguageByVsCodeId(document.languageId);
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
    const matches = lang.snippets.filter(s =>
      s.keywords.some(k => k.toLowerCase() === word || word.includes(k.toLowerCase())) ||
      s.title.toLowerCase().includes(word)
    );

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
