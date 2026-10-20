import * as vscode from 'vscode';
import { getLanguageByFilename, getLanguageById, getLanguageByVsCodeId } from '../data/languages';
import { getSidebarHtml } from '../webview/webviewContent';

export class SidebarWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'syntax-mentor.sidebarView';

  private _view?: vscode.WebviewView;
  private _currentLanguageId: string = 'java';

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    // Auto-detect language from active editor on initial view load
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const detected = getLanguageByVsCodeId(activeEditor.document.languageId) ||
                       getLanguageByFilename(activeEditor.document.fileName);
      if (detected) {
        this._currentLanguageId = detected.id;
      }
    }

    webviewView.webview.html = getSidebarHtml(this._currentLanguageId);

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
        case 'createTestFile': {
          await this.createScratchTestFile(data.languageId || this._currentLanguageId);
          break;
        }
      }
    });
  }

  public setLanguage(languageId: string) {
    this._currentLanguageId = languageId;
    if (this._view) {
      this._view.webview.postMessage({
        command: 'setLanguage',
        languageId: languageId
      });
    }
  }

  public getCurrentLanguageId(): string {
    return this._currentLanguageId;
  }

  public async createScratchTestFile(languageId: string) {
    const lang = getLanguageById(languageId);
    if (!lang) return;

    const vscodeLangId = lang.vscodeLanguageIds[0] || 'plaintext';
    const sampleSnippet = lang.snippets[0];

    const initialContent = [
      `// ========================================================`,
      `// 🎓 Arquivo de Teste Didático - Syntax Mentor (${lang.name})`,
      `// Dica: Experimente o autocompletar digitando prefixos como:`,
      `//       "${sampleSnippet.completionTrigger || 'mentor-'}" ou "string", "array"`,
      `// ========================================================\n`,
      sampleSnippet.code
    ].join('\n');

    const doc = await vscode.workspace.openTextDocument({
      language: vscodeLangId,
      content: initialContent
    });

    await vscode.window.showTextDocument(doc, { preview: false });
    vscode.window.showInformationMessage(
      `Arquivo de teste para ${lang.name} criado! Teste a edição e o autocompletar em tempo real.`
    );
  }

  private async insertCodeIntoEditor(code: string, title?: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      // If no editor is open, offer to create one!
      await this.createScratchTestFile(this._currentLanguageId);
      return;
    }

    const selection = editor.selection;
    const success = await editor.edit(editBuilder => {
      if (selection.isEmpty) {
        editBuilder.insert(selection.active, code + '\n');
      } else {
        editBuilder.replace(selection, code);
      }
    });

    if (success) {
      vscode.window.showInformationMessage(
        title ? `Snippet "${title}" inserido com sucesso!` : 'Código inserido com sucesso!'
      );
    }
  }
}
