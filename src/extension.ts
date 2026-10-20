import * as vscode from 'vscode';
import { ALL_LANGUAGES, getLanguageByFilename, getLanguageById, getLanguageByVsCodeId } from './data/languages';
import { CustomTipsManager } from './data/CustomTipsManager';
import { SidebarWebviewProvider } from './providers/SidebarWebviewProvider';
import { RealTimeCompletionProvider } from './providers/RealTimeCompletionProvider';
import { DidacticHoverProvider } from './providers/HoverProvider';
import { RealTimeAnalyzer } from './analyzer/RealTimeAnalyzer';
import { DidacticCodeActionProvider } from './providers/CodeActionProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Syntax Mentor está ativo com Analisador Didático em Tempo Real!');

  // 0. Initialize Custom Tips & Pins Persistence
  CustomTipsManager.initialize(context);

  // 1. Sidebar Webview Provider
  const sidebarProvider = new SidebarWebviewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SidebarWebviewProvider.viewType,
      sidebarProvider
    )
  );

  // 2. Real-Time Analyzer & Diagnostics
  const analyzer = new RealTimeAnalyzer();
  context.subscriptions.push(analyzer.getDiagnosticCollection());

  // Analyze active editor on start
  if (vscode.window.activeTextEditor) {
    analyzer.analyzeDocument(vscode.window.activeTextEditor.document);
  }

  // Listen to document changes in real time
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      analyzer.analyzeDocument(event.document);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(document => {
      analyzer.analyzeDocument(document);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument(document => {
      analyzer.clearDocument(document);
    })
  );

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

  const codeActionProvider = new DidacticCodeActionProvider();
  for (const langId of supportedLanguages) {
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        langId,
        codeActionProvider,
        {
          providedCodeActionKinds: DidacticCodeActionProvider.providedCodeActionKinds
        }
      )
    );
  }

  // 4. Real-Time Completion & Hover Providers
  const completionProvider = new RealTimeCompletionProvider();
  const hoverProvider = new DidacticHoverProvider();

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

  // 5. Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('syntax-mentor.openGuide', () => {
      vscode.commands.executeCommand('syntax-mentor.sidebarView.focus');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('syntax-mentor.createTestFile', async (languageId?: string) => {
      await sidebarProvider.createScratchTestFile(languageId || sidebarProvider.getCurrentLanguageId());
    })
  );

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

  context.subscriptions.push(
    vscode.commands.registerCommand('syntax-mentor.insertSnippet', async (code?: string) => {
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
