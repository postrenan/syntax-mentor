"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTipsManager = void 0;
class CustomTipsManager {
    static CUSTOM_TIPS_KEY = 'syntaxMentor.customTips';
    static PINNED_TIPS_KEY = 'syntaxMentor.pinnedTips';
    static instance;
    context;
    customTips = [];
    pinnedTips = [];
    constructor(context) {
        this.context = context;
        this.load();
    }
    static initialize(context) {
        if (!CustomTipsManager.instance) {
            CustomTipsManager.instance = new CustomTipsManager(context);
        }
        return CustomTipsManager.instance;
    }
    static getInstance() {
        return CustomTipsManager.instance;
    }
    load() {
        this.customTips = this.context.globalState.get(CustomTipsManager.CUSTOM_TIPS_KEY, []);
        this.pinnedTips = this.context.globalState.get(CustomTipsManager.PINNED_TIPS_KEY, []);
    }
    getCustomTips(languageId) {
        if (!languageId) {
            return this.customTips;
        }
        return this.customTips.filter(t => t.languageId === languageId);
    }
    getPinnedTips() {
        return this.pinnedTips;
    }
    async togglePin(snippetId) {
        const index = this.pinnedTips.indexOf(snippetId);
        let isPinned = false;
        if (index >= 0) {
            this.pinnedTips.splice(index, 1);
            isPinned = false;
        }
        else {
            // Add to front so most recently pinned appears first
            this.pinnedTips.unshift(snippetId);
            isPinned = true;
        }
        await this.context.globalState.update(CustomTipsManager.PINNED_TIPS_KEY, this.pinnedTips);
        return isPinned;
    }
    async saveCustomTip(tip) {
        tip.isCustom = true;
        tip.createdAt = tip.createdAt || Date.now();
        const existingIndex = this.customTips.findIndex(t => t.id === tip.id);
        if (existingIndex >= 0) {
            this.customTips[existingIndex] = tip;
        }
        else {
            this.customTips.unshift(tip);
        }
        await this.context.globalState.update(CustomTipsManager.CUSTOM_TIPS_KEY, this.customTips);
    }
    async deleteCustomTip(snippetId) {
        this.customTips = this.customTips.filter(t => t.id !== snippetId);
        this.pinnedTips = this.pinnedTips.filter(id => id !== snippetId);
        await this.context.globalState.update(CustomTipsManager.CUSTOM_TIPS_KEY, this.customTips);
        await this.context.globalState.update(CustomTipsManager.PINNED_TIPS_KEY, this.pinnedTips);
    }
}
exports.CustomTipsManager = CustomTipsManager;
//# sourceMappingURL=CustomTipsManager.js.map