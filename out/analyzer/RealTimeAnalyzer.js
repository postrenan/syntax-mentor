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
exports.RealTimeAnalyzer = exports.DIDACTIC_RULES = void 0;
const vscode = __importStar(require("vscode"));
exports.DIDACTIC_RULES = [
    // ==========================================
    // JAVA RULES
    // ==========================================
    {
        id: 'java-string-equality-literal',
        languageId: 'java',
        pattern: /([a-zA-Z0-9_$.]+)\s*==\s*("[^"]*")/g,
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Comparação de String com '=='. Em Java, '==' compara referências de memória no String Pool/Heap.",
        explanation: "Use .equals() para comparar o conteúdo de Strings de forma segura.",
        codeActionTitle: "💡 Substituir por literal.equals(variavel)",
        fixReplacement: (match) => `${match[2]}.equals(${match[1]})`
    },
    {
        id: 'java-string-equality-literal-left',
        languageId: 'java',
        pattern: /("[^"]*")\s*==\s*([a-zA-Z0-9_$.]+)/g,
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Comparação de String com '=='. Em Java, '==' compara referências de memória no String Pool/Heap.",
        explanation: "Use .equals() para comparar o conteúdo de Strings de forma segura.",
        codeActionTitle: "💡 Substituir por literal.equals(variavel)",
        fixReplacement: (match) => `${match[1]}.equals(${match[2]})`
    },
    {
        id: 'java-empty-catch',
        languageId: 'java',
        pattern: /catch\s*\(\s*([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_]+)\s*\)\s*\{\s*\}/g,
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Bloco catch vazio detectado. Engolir exceções mascara erros graves em tempo de execução.",
        explanation: "Registre o erro com logger ou lance uma RuntimeException encapsulando a causa raiz.",
        codeActionTitle: "💡 Adicionar impressão de rastreio de pilha (printStackTrace)",
        fixReplacement: (match) => `catch (${match[1]} ${match[2]}) {\n            ${match[2]}.printStackTrace();\n        }`
    },
    // ==========================================
    // PYTHON RULES
    // ==========================================
    {
        id: 'py-equality-none',
        languageId: 'python',
        pattern: /([a-zA-Z0-9_$.]+)\s*==\s*None\b/g,
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Comparação com '== None'. Em Python, 'None' é um objeto singleton em memória.",
        explanation: "Use 'is None' para verificar identidade de singletons de acordo com a PEP 8.",
        codeActionTitle: "💡 Substituir por 'is None'",
        fixReplacement: (match) => `${match[1]} is None`
    },
    {
        id: 'py-inequality-none',
        languageId: 'python',
        pattern: /([a-zA-Z0-9_$.]+)\s*!=\s*None\b/g,
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Comparação com '!= None'.",
        explanation: "Use 'is not None' de acordo com a convenção PEP 8.",
        codeActionTitle: "💡 Substituir por 'is not None'",
        fixReplacement: (match) => `${match[1]} is not None`
    },
    {
        id: 'py-bare-except',
        languageId: 'python',
        pattern: /except\s*:/g,
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Cláusula 'except:' genérica captura até KeyboardInterrupt e SystemExit.",
        explanation: "Especifique 'except Exception:' para capturar apenas erros regulares do programa.",
        codeActionTitle: "💡 Substituir por 'except Exception:'",
        fixReplacement: () => "except Exception:"
    },
    {
        id: 'py-range-len',
        languageId: 'python',
        pattern: /for\s+([a-zA-Z0-9_]+)\s+in\s+range\s*\(\s*len\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*\)\s*:/g,
        severity: vscode.DiagnosticSeverity.Information,
        message: "Iteração não idiomática com 'range(len(...))'.",
        explanation: "Prefira 'for i, item in enumerate(colecao):' para acessar índice e elemento ao mesmo tempo.",
        codeActionTitle: "💡 Usar enumerate()",
        fixReplacement: (match) => `for ${match[1]}, item in enumerate(${match[2]}):`
    },
    // ==========================================
    // TYPESCRIPT / JAVASCRIPT RULES
    // ==========================================
    {
        id: 'ts-loose-equality',
        languageId: 'typescript',
        pattern: /([a-zA-Z0-9_$.]+)\s*==\s*([a-zA-Z0-9_$.]+)/g,
        severity: vscode.DiagnosticSeverity.Information,
        message: "Operador de igualdade flexível '=='. Pode causar coerção de tipos imprevisível.",
        explanation: "Sempre prefira o operador estrito '===' para garantir igualdade de valor e tipo.",
        codeActionTitle: "💡 Substituir por '==='",
        fixReplacement: (match) => `${match[1]} === ${match[2]}`
    },
    {
        id: 'ts-any-type',
        languageId: 'typescript',
        pattern: /:\s*\bany\b/g,
        severity: vscode.DiagnosticSeverity.Hint,
        message: "Uso do tipo 'any'. Ele desativa as checagens estáticas do TypeScript nesse ponto.",
        explanation: "Considere usar 'unknown' com checagem de tipos ou definir uma interface explícita.",
        codeActionTitle: "💡 Substituir por 'unknown'",
        fixReplacement: () => ": unknown"
    }
];
class RealTimeAnalyzer {
    diagnosticCollection;
    debounceTimers = new Map();
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('syntax-mentor');
    }
    getDiagnosticCollection() {
        return this.diagnosticCollection;
    }
    analyzeDocument(document) {
        // Clear previous timer for this document
        const uriKey = document.uri.toString();
        const existingTimer = this.debounceTimers.get(uriKey);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }
        // Debounce analysis by 250ms for buttery-smooth typing experience
        const timer = setTimeout(() => {
            this.doAnalyze(document);
            this.debounceTimers.delete(uriKey);
        }, 250);
        this.debounceTimers.set(uriKey, timer);
    }
    doAnalyze(document) {
        const langId = document.languageId;
        const rules = exports.DIDACTIC_RULES.filter(r => r.languageId === langId ||
            (r.languageId === 'typescript' && (langId === 'javascript' || langId === 'typescriptreact' || langId === 'javascriptreact')));
        if (rules.length === 0) {
            this.diagnosticCollection.delete(document.uri);
            return;
        }
        const text = document.getText();
        const diagnostics = [];
        for (const rule of rules) {
            const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
            let match;
            while ((match = regex.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);
                const diagnostic = new vscode.Diagnostic(range, `🎓 [Syntax Mentor] ${rule.message}\n💡 ${rule.explanation}`, rule.severity);
                diagnostic.code = rule.id;
                diagnostic.source = 'Syntax Mentor Didactic Analyzer';
                diagnostics.push(diagnostic);
            }
        }
        this.diagnosticCollection.set(document.uri, diagnostics);
    }
    clearDocument(document) {
        this.diagnosticCollection.delete(document.uri);
    }
    dispose() {
        this.diagnosticCollection.dispose();
        for (const timer of this.debounceTimers.values()) {
            clearTimeout(timer);
        }
        this.debounceTimers.clear();
    }
}
exports.RealTimeAnalyzer = RealTimeAnalyzer;
//# sourceMappingURL=RealTimeAnalyzer.js.map