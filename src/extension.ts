import * as vscode from 'vscode';
import { ALL_LANGUAGES, getLanguageByFilename, getLanguageById, getLanguageByVsCodeId } from './data/languages';
import { SidebarWebviewProvider } from './providers/SidebarWebviewProvider';
import { RealTimeCompletionProvider } from './providers/RealTimeCompletionProvider';
import { DidacticHoverProvider } from './providers/HoverProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Syntax Mentor está ativo e pronto para auxiliar no desenvolvimento!');

  // 1. Sidebar Webview Provider
  const sidebarProvider = new SidebarWebviewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SidebarWebviewProvider.viewType,
      sidebarProvider
    )
  );

  // 2. Real-Time Completion & Analyzer Provider
  const completionProvider = new RealTimeCompletionProvider();
  const hoverProvider = new DidacticHoverProvider();

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
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        langId,
        completionProvider,
        '.', ' ', '(', '[', ':', '"', '>', '-'
      )
    );

    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        langId,
        hoverProvider
      )
    );
  }

  // 3. Command: Open Guide
  context.subscriptions.push(
    vscode.commands.registerCommand('syntax-mentor.openGuide', () => {
      vscode.commands.executeCommand('syntax-mentor.sidebarView.focus');
    })
  );

  // 4. Command: Select Language via Quick Pick
  context.subscriptions.push(
    vscode.commands.registerCommand('syntax-mentor.selectLanguage', async () => {
      const items = ALL_LANGUAGES.map(lang => ({
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
    })
  );

  // 5. Command: Insert Snippet (Used by Webview & Hovers)
  context.subscriptions.push(
    vscode.commands.registerCommand('syntax-mentor.insertSnippet', async (code?: string) => {
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
    })
  );

  // 6. Automatic language synchronization with active editor
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (!editor) {
        return;
      }
      const detected = getLanguageByVsCodeId(editor.document.languageId) ||
                       getLanguageByFilename(editor.document.fileName);

      if (detected && detected.id !== sidebarProvider.getCurrentLanguageId()) {
        sidebarProvider.setLanguage(detected.id);
      }
    })
  );
}

export function deactivate() {}
