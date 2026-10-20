import * as vscode from 'vscode';
import { DIDACTIC_RULES } from '../analyzer/RealTimeAnalyzer';

export class DidacticCodeActionProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== 'Syntax Mentor Didactic Analyzer' || !diagnostic.code) {
        continue;
      }

      const rule = DIDACTIC_RULES.find(r => r.id === diagnostic.code);
      if (!rule || !rule.codeActionTitle || !rule.fixReplacement) {
        continue;
      }

      const matchedText = document.getText(diagnostic.range);
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      const match = regex.exec(matchedText);

      if (match) {
        const replacement = rule.fixReplacement(match);
        const action = new vscode.CodeAction(
          rule.codeActionTitle,
          vscode.CodeActionKind.QuickFix
        );

        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new vscode.WorkspaceEdit();
        action.edit.replace(document.uri, diagnostic.range, replacement);

        actions.push(action);
      }
    }

    return actions;
  }
}
