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
exports.DidacticCodeActionProvider = void 0;
const vscode = __importStar(require("vscode"));
const RealTimeAnalyzer_1 = require("../analyzer/RealTimeAnalyzer");
class DidacticCodeActionProvider {
    static providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];
    provideCodeActions(document, range, context, token) {
        const actions = [];
        for (const diagnostic of context.diagnostics) {
            if (diagnostic.source !== 'Syntax Mentor Didactic Analyzer' || !diagnostic.code) {
                continue;
            }
            const rule = RealTimeAnalyzer_1.DIDACTIC_RULES.find(r => r.id === diagnostic.code);
            if (!rule || !rule.codeActionTitle || !rule.fixReplacement) {
                continue;
            }
            const matchedText = document.getText(diagnostic.range);
            const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
            const match = regex.exec(matchedText);
            if (match) {
                const replacement = rule.fixReplacement(match);
                const action = new vscode.CodeAction(rule.codeActionTitle, vscode.CodeActionKind.QuickFix);
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
exports.DidacticCodeActionProvider = DidacticCodeActionProvider;
//# sourceMappingURL=CodeActionProvider.js.map