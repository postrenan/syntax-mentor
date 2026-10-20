import * as vscode from 'vscode';
import { DidacticSnippet } from '../types';

export class CustomTipsManager {
  private static readonly CUSTOM_TIPS_KEY = 'syntaxMentor.customTips';
  private static readonly PINNED_TIPS_KEY = 'syntaxMentor.pinnedTips';

  private static instance: CustomTipsManager;
  private context: vscode.ExtensionContext;
  private customTips: DidacticSnippet[] = [];
  private pinnedTips: string[] = [];

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.load();
  }

  public static initialize(context: vscode.ExtensionContext): CustomTipsManager {
    if (!CustomTipsManager.instance) {
      CustomTipsManager.instance = new CustomTipsManager(context);
    }
    return CustomTipsManager.instance;
  }

  public static getInstance(): CustomTipsManager {
    return CustomTipsManager.instance;
  }

  public load() {
    this.customTips = this.context.globalState.get<DidacticSnippet[]>(CustomTipsManager.CUSTOM_TIPS_KEY, []);
    this.pinnedTips = this.context.globalState.get<string[]>(CustomTipsManager.PINNED_TIPS_KEY, []);
  }

  public getCustomTips(languageId?: string): DidacticSnippet[] {
    if (!languageId) {
      return this.customTips;
    }
    return this.customTips.filter(t => t.languageId === languageId);
  }

  public getPinnedTips(): string[] {
    return this.pinnedTips;
  }

  public async togglePin(snippetId: string): Promise<boolean> {
    const index = this.pinnedTips.indexOf(snippetId);
    let isPinned = false;

    if (index >= 0) {
      this.pinnedTips.splice(index, 1);
      isPinned = false;
    } else {
      // Add to front so most recently pinned appears first
      this.pinnedTips.unshift(snippetId);
      isPinned = true;
    }

    await this.context.globalState.update(CustomTipsManager.PINNED_TIPS_KEY, this.pinnedTips);
    return isPinned;
  }

  public async saveCustomTip(tip: DidacticSnippet): Promise<void> {
    tip.isCustom = true;
    tip.createdAt = tip.createdAt || Date.now();

    const existingIndex = this.customTips.findIndex(t => t.id === tip.id);
    if (existingIndex >= 0) {
      this.customTips[existingIndex] = tip;
    } else {
      this.customTips.unshift(tip);
    }

    await this.context.globalState.update(CustomTipsManager.CUSTOM_TIPS_KEY, this.customTips);
  }

  public async deleteCustomTip(snippetId: string): Promise<void> {
    this.customTips = this.customTips.filter(t => t.id !== snippetId);
    this.pinnedTips = this.pinnedTips.filter(id => id !== snippetId);

    await this.context.globalState.update(CustomTipsManager.CUSTOM_TIPS_KEY, this.customTips);
    await this.context.globalState.update(CustomTipsManager.PINNED_TIPS_KEY, this.pinnedTips);
  }
}
