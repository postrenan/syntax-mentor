import * as vscode from 'vscode';
import { getLanguageByFilename, getLanguageById, getLanguageByVsCodeId } from '../data/languages';
import { CustomTipsManager } from '../data/CustomTipsManager';
import { CodeTranslator } from '../translator/CodeTranslator';
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

    const tipsManager = CustomTipsManager.getInstance();
    const pinned = tipsManager ? tipsManager.getPinnedTips() : [];
    const customTips = tipsManager ? tipsManager.getCustomTips() : [];

    webviewView.webview.html = getSidebarHtml(this._currentLanguageId, pinned, customTips);

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
        case 'togglePin': {
          if (tipsManager) {
            const isPinned = await tipsManager.togglePin(data.snippetId);
            vscode.window.showInformationMessage(
              isPinned ? '📌 Tip fixado no topo com sucesso!' : '📍 Tip desafixado do topo.'
            );
          }
          break;
        }
        case 'saveCustomTip': {
          if (tipsManager) {
            await tipsManager.saveCustomTip(data.tip);
            vscode.window.showInformationMessage(
              `⭐ Tip "${data.tip.title}" salvo com sucesso e disponível no catálogo e autocompletar!`
            );
          }
          break;
        }
        case 'deleteCustomTip': {
          if (tipsManager) {
            await tipsManager.deleteCustomTip(data.snippetId);
            vscode.window.showInformationMessage('🗑️ Tip personalizado removido com sucesso.');
          }
          break;
        }
        case 'translateCode': {
          const result = CodeTranslator.translate(data.sourceCode, data.fromLang, data.toLang);
          this._view?.webview.postMessage({
            command: 'translationResult',
            result: result
          });
          break;
        }
        case 'pullEditorSelection': {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const selectionText = editor.document.getText(editor.selection);
            const detectedLang = getLanguageByVsCodeId(editor.document.languageId) ||
                                 getLanguageByFilename(editor.document.fileName);

            this._view?.webview.postMessage({
              command: 'setEditorSelection',
              text: selectionText || editor.document.getText(), // Selection or full file if empty
              languageId: detectedLang ? detectedLang.id : undefined
            });

            if (!selectionText) {
              vscode.window.showInformationMessage('Como não havia texto selecionado, o arquivo inteiro foi carregado no tradutor.');
            }
          } else {
            vscode.window.showWarningMessage('Nenhum editor de texto ativo no momento.');
          }
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
        title ? `Código "${title}" inserido com sucesso!` : 'Código inserido no editor!'
      );
    }
  }
}
