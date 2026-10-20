"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeTranslator = void 0;
const LANG_META = {
    java: { name: 'Java', extension: '.java' },
    python: { name: 'Python', extension: '.py' },
    typescript: { name: 'TypeScript', extension: '.ts' },
    csharp: { name: 'C# (.NET)', extension: '.cs' },
    go: { name: 'Go (Golang)', extension: '.go' },
    rust: { name: 'Rust', extension: '.rs' },
    sql: { name: 'SQL', extension: '.sql' }
};
class CodeTranslator {
    static translate(sourceCode, fromLang, toLang) {
        fromLang = fromLang.toLowerCase();
        toLang = toLang.toLowerCase();
        const fromMeta = LANG_META[fromLang] || { name: fromLang, extension: '' };
        const toMeta = LANG_META[toLang] || { name: toLang, extension: '' };
        if (fromLang === toLang) {
            return {
                translatedCode: sourceCode,
                notes: ['A linguagem de origem e destino são as mesmas.'],
                sourceLangName: fromMeta.name,
                targetLangName: toMeta.name
            };
        }
        const notes = [];
        const lines = sourceCode.split('\n');
        const translatedLines = [];
        // Analyze high-level constructs
        const hasPrint = /print|System\.out\.println|Console\.WriteLine|console\.log|fmt\.Println|println!/.test(sourceCode);
        const hasList = /\[\]|ArrayList|List<|vec!|make\(\[\]/.test(sourceCode);
        const hasStringOps = /len\(|\.length|\.size\(|\.equals|\.append\(|f"|\$"/i.test(sourceCode);
        if (hasPrint) {
            notes.push(`Impressão no console convertida para o padrão de ${toMeta.name}.`);
        }
        if (hasList) {
            notes.push(`Estruturas de coleção e listas adaptadas para as convenções de ${toMeta.name}.`);
        }
        if (hasStringOps) {
            notes.push(`Operações de texto e strings adaptadas (atenção a imutabilidade e métodos nativos).`);
        }
        // Process line by line and construct idiomatic translation
        for (let line of lines) {
            let tLine = line;
            // 1. Convert Print statements
            tLine = CodeTranslator.convertPrint(tLine, fromLang, toLang);
            // 2. Convert Variable Declarations & Types
            tLine = CodeTranslator.convertVariables(tLine, fromLang, toLang);
            // 3. Convert String and List operations
            tLine = CodeTranslator.convertOperations(tLine, fromLang, toLang);
            // 4. Convert Functions
            tLine = CodeTranslator.convertFunctions(tLine, fromLang, toLang);
            // 5. Convert Loops & Conditions
            tLine = CodeTranslator.convertControlFlow(tLine, fromLang, toLang);
            translatedLines.push(tLine);
        }
        // Wrap in boilerplate class/main if required by the target language (Java/C#/Go)
        let finalCode = translatedLines.join('\n');
        finalCode = CodeTranslator.wrapBoilerplate(finalCode, fromLang, toLang, notes);
        // Language-specific notes
        CodeTranslator.addLanguageDifferences(fromLang, toLang, notes);
        return {
            translatedCode: finalCode,
            notes: notes,
            sourceLangName: fromMeta.name,
            targetLangName: toMeta.name
        };
    }
    static convertPrint(line, from, to) {
        // Matches print(x), System.out.println(x), console.log(x), Console.WriteLine(x), fmt.Println(x), println!(x)
        const printPattern = /(?:System\.out\.println|Console\.WriteLine|console\.log|fmt\.Println|println!|print)\s*\((.*)\)\s*;?/;
        const match = line.match(printPattern);
        if (match) {
            const content = match[1];
            const indent = line.match(/^\s*/)?.[0] || '';
            switch (to) {
                case 'java':
                    return `${indent}System.out.println(${content});`;
                case 'python':
                    return `${indent}print(${content.replace(/;/g, '')})`;
                case 'typescript':
                    return `${indent}console.log(${content});`;
                case 'csharp':
                    return `${indent}Console.WriteLine(${content});`;
                case 'go':
                    return `${indent}fmt.Println(${content})`;
                case 'rust':
                    return `${indent}println!("{}", ${content});`;
            }
        }
        return line;
    }
    static convertVariables(line, from, to) {
        let t = line;
        // Python variable: nome = "valor" or x: int = 10
        if (from === 'python') {
            const pyVar = line.match(/^(\s*)([a-zA-Z0-9_]+)(?:\s*:\s*([a-zA-Z0-9_]+))?\s*=\s*(.+)$/);
            if (pyVar && !line.trim().startsWith('def ') && !line.trim().startsWith('class ') && !line.trim().startsWith('if ')) {
                const indent = pyVar[1];
                const name = pyVar[2];
                const type = pyVar[3];
                const val = pyVar[4];
                switch (to) {
                    case 'java':
                        const jType = CodeTranslator.mapType(type, 'java', val);
                        return `${indent}${jType} ${name} = ${val};`;
                    case 'typescript':
                        return `${indent}const ${name} = ${val};`;
                    case 'csharp':
                        return `${indent}var ${name} = ${val};`;
                    case 'go':
                        return `${indent}${name} := ${val}`;
                    case 'rust':
                        return `${indent}let ${name} = ${val};`;
                }
            }
        }
        // Java / C# variable: int x = 10; or String s = "abc"; or var x = 10;
        if (from === 'java' || from === 'csharp') {
            const jVar = line.match(/^(\s*)(?:var|String|int|double|boolean|List<[^>]+>|Map<[^>]+>)\s+([a-zA-Z0-9_]+)\s*=\s*(.+?);?$/);
            if (jVar) {
                const indent = jVar[1];
                const name = jVar[2];
                const val = jVar[3];
                switch (to) {
                    case 'python':
                        return `${indent}${name} = ${val.replace(/new\s+[a-zA-Z0-9_<>]+(?:\(\))?/, '[]')}`;
                    case 'typescript':
                        return `${indent}const ${name} = ${val};`;
                    case 'go':
                        return `${indent}${name} := ${val}`;
                    case 'rust':
                        return `${indent}let ${name} = ${val};`;
                    case 'csharp':
                        return `${indent}var ${name} = ${val};`;
                    case 'java':
                        return `${indent}var ${name} = ${val};`;
                }
            }
        }
        // TypeScript: const x = 10; or let x: string = "abc";
        if (from === 'typescript') {
            const tsVar = line.match(/^(\s*)(?:const|let|var)\s+([a-zA-Z0-9_]+)(?:\s*:\s*[a-zA-Z0-9_<>]+)?\s*=\s*(.+?);?$/);
            if (tsVar) {
                const indent = tsVar[1];
                const name = tsVar[2];
                const val = tsVar[3];
                switch (to) {
                    case 'python':
                        return `${indent}${name} = ${val}`;
                    case 'java':
                        return `${indent}var ${name} = ${val};`;
                    case 'csharp':
                        return `${indent}var ${name} = ${val};`;
                    case 'go':
                        return `${indent}${name} := ${val}`;
                    case 'rust':
                        return `${indent}let ${name} = ${val};`;
                }
            }
        }
        return t;
    }
    static convertOperations(line, from, to) {
        let t = line;
        // List/Array appends:
        // .append(x) vs .add(x) vs .push(x) vs append(s, x)
        if (to === 'java') {
            t = t.replace(/\.append\((.*?)\)/g, '.add($1)');
            t = t.replace(/\.push\((.*?)\)/g, '.add($1)');
            t = t.replace(/len\((.*?)\)/g, '$1.size()');
            t = t.replace(/\.length\b/g, '.size()');
        }
        else if (to === 'python') {
            t = t.replace(/\.add\((.*?)\)/g, '.append($1)');
            t = t.replace(/\.push\((.*?)\)/g, '.append($1)');
            t = t.replace(/([a-zA-Z0-9_]+)\.(?:size\(\)|length\b|Count\b)/g, 'len($1)');
            t = t.replace(/true\b/g, 'True').replace(/false\b/g, 'False').replace(/null\b/g, 'None');
        }
        else if (to === 'typescript') {
            t = t.replace(/\.append\((.*?)\)/g, '.push($1)');
            t = t.replace(/\.add\((.*?)\)/g, '.push($1)');
            t = t.replace(/len\((.*?)\)/g, '$1.length');
            t = t.replace(/\.size\(\)/g, '.length');
        }
        else if (to === 'rust') {
            t = t.replace(/\.append\((.*?)\)/g, '.push($1)');
            t = t.replace(/\.add\((.*?)\)/g, '.push($1)');
            t = t.replace(/len\((.*?)\)/g, '$1.len()');
            t = t.replace(/\.size\(\)/g, '.len()');
        }
        // String formatting
        if (from === 'python' && to === 'java') {
            // f"Texto {var}" -> String.format("Texto %s", var) or "Texto " + var
            t = t.replace(/f"([^"]*?)\{([a-zA-Z0-9_]+)\}([^"]*?)"/g, '"$1" + $2 + "$3"');
        }
        else if (from === 'python' && to === 'typescript') {
            t = t.replace(/f"([^"]*?)\{([a-zA-Z0-9_]+)\}([^"]*?)"/g, '`$1\${$2}$3`');
        }
        else if (from === 'python' && to === 'csharp') {
            t = t.replace(/f"/g, '$"');
        }
        return t;
    }
    static convertFunctions(line, from, to) {
        const indent = line.match(/^\s*/)?.[0] || '';
        const trimmed = line.trim();
        // Python function: def nome_funcao(arg1, arg2):
        if (from === 'python' && trimmed.startsWith('def ')) {
            const match = trimmed.match(/def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*(?:->\s*([a-zA-Z0-9_]+))?:/);
            if (match) {
                const fnName = match[1];
                const params = match[2];
                const returnType = match[3] || 'void';
                switch (to) {
                    case 'java':
                        return `${indent}public static ${CodeTranslator.mapType(returnType, 'java')} ${fnName}(${CodeTranslator.mapParams(params, 'java')}) {`;
                    case 'typescript':
                        return `${indent}function ${fnName}(${CodeTranslator.mapParams(params, 'typescript')}): ${CodeTranslator.mapType(returnType, 'typescript')} {`;
                    case 'csharp':
                        return `${indent}public static ${CodeTranslator.mapType(returnType, 'csharp')} ${fnName}(${CodeTranslator.mapParams(params, 'csharp')}) {`;
                    case 'go':
                        return `${indent}func ${fnName}(${CodeTranslator.mapParams(params, 'go')}) ${CodeTranslator.mapType(returnType, 'go')} {`;
                    case 'rust':
                        return `${indent}fn ${fnName}(${CodeTranslator.mapParams(params, 'rust')}) -> ${CodeTranslator.mapType(returnType, 'rust')} {`;
                }
            }
        }
        // Java / C# / TS function: public int calcular(int a, int b) { or function calcular(...) {
        if ((from === 'java' || from === 'typescript' || from === 'csharp') && (trimmed.includes('(') && trimmed.endsWith('{'))) {
            const match = trimmed.match(/(?:public|private|static|function|\s)*\s*(?:[a-zA-Z0-9_<>]+)?\s*([a-zA-Z0-9_]+)\s*\((.*?)\)/);
            if (match && !trimmed.startsWith('if') && !trimmed.startsWith('for') && !trimmed.startsWith('while') && !trimmed.startsWith('switch')) {
                const fnName = match[1];
                const params = match[2];
                if (to === 'python') {
                    const cleanParams = params.split(',').map(p => {
                        const parts = p.trim().split(/\s+/);
                        return parts[parts.length - 1]; // pega o nome do parâmetro
                    }).join(', ');
                    return `${indent}def ${fnName}(${cleanParams}):`;
                }
            }
        }
        return line;
    }
    static convertControlFlow(line, from, to) {
        const indent = line.match(/^\s*/)?.[0] || '';
        const trimmed = line.trim();
        // Python 'if' / 'elif' -> Java / TS / C#
        if (from === 'python') {
            if (trimmed.startsWith('if ') && trimmed.endsWith(':')) {
                const cond = trimmed.substring(3, trimmed.length - 1).trim();
                return to === 'python' ? line : `${indent}if (${cond}) {`;
            }
            if (trimmed.startsWith('elif ') && trimmed.endsWith(':')) {
                const cond = trimmed.substring(5, trimmed.length - 1).trim();
                return `${indent}else if (${cond}) {`;
            }
            if (trimmed === 'else:') {
                return `${indent}else {`;
            }
        }
        // Java / TS 'if' -> Python
        if (to === 'python') {
            if (trimmed.startsWith('if (') && trimmed.endsWith('{')) {
                const cond = trimmed.match(/^if\s*\((.*?)\)\s*\{$/)?.[1] || '';
                return `${indent}if ${cond}:`;
            }
            if (trimmed.startsWith('else if') || trimmed.startsWith('} else if')) {
                const cond = trimmed.match(/else\s+if\s*\((.*?)\)/)?.[1] || '';
                return `${indent}elif ${cond}:`;
            }
            if (trimmed === '} else {' || trimmed === 'else {') {
                return `${indent}else:`;
            }
            if (trimmed === '}') {
                return ''; // Python usa indentação, não fecha chaves
            }
        }
        return line;
    }
    static wrapBoilerplate(code, from, to, notes) {
        // Java requires class and main method for standalone execution
        if (to === 'java' && !code.includes('class ') && !code.includes('public class')) {
            notes.push('Estrutura de classe pública e método main() adicionada para execução válida em Java.');
            return [
                'import java.util.*;',
                '',
                'public class ProgramaTraduzido {',
                '    public static void main(String[] args) {',
                code.split('\n').map(l => '        ' + l).join('\n'),
                '    }',
                '}'
            ].join('\n');
        }
        // C# requires namespace/class/Main or top-level statements
        if (to === 'csharp' && !code.includes('using System;') && from === 'python') {
            return ['using System;', 'using System.Collections.Generic;', '', code].join('\n');
        }
        // Go requires package main and main function
        if (to === 'go' && !code.includes('package main')) {
            notes.push('Pacote main e importações adicionados para compatibilidade com o compilador Go.');
            return [
                'package main',
                '',
                'import (',
                '    "fmt"',
                ')',
                '',
                'func main() {',
                code.split('\n').map(l => '    ' + l).join('\n'),
                '}'
            ].join('\n');
        }
        // Rust requires fn main()
        if (to === 'rust' && !code.includes('fn main()')) {
            notes.push('Função fn main() adicionada para criar um ponto de entrada Rust válido.');
            return [
                'fn main() {',
                code.split('\n').map(l => '    ' + l).join('\n'),
                '}'
            ].join('\n');
        }
        return code;
    }
    static mapType(type, target, sampleVal) {
        if (!type) {
            if (sampleVal) {
                if (/^".*"$/.test(sampleVal))
                    return target === 'rust' ? '&str' : (target === 'java' || target === 'csharp' ? 'String' : 'string');
                if (/^\d+$/.test(sampleVal))
                    return target === 'rust' ? 'i32' : (target === 'typescript' ? 'number' : 'int');
                if (/^\d+\.\d+$/.test(sampleVal))
                    return target === 'rust' ? 'f64' : (target === 'typescript' ? 'number' : 'double');
                if (/^(true|false|True|False)$/.test(sampleVal))
                    return target === 'rust' ? 'bool' : 'boolean';
                if (/^\[.*\]$/.test(sampleVal))
                    return target === 'java' ? 'List<Object>' : (target === 'typescript' ? 'any[]' : 'var');
            }
            return target === 'rust' ? 'i32' : (target === 'typescript' ? 'any' : (target === 'java' ? 'var' : 'var'));
        }
        const t = type.toLowerCase();
        if (t === 'int' || t === 'integer')
            return target === 'rust' ? 'i32' : (target === 'typescript' ? 'number' : 'int');
        if (t === 'str' || t === 'string')
            return target === 'rust' ? '&str' : (target === 'typescript' ? 'string' : 'String');
        if (t === 'float' || t === 'double')
            return target === 'rust' ? 'f64' : (target === 'typescript' ? 'number' : 'double');
        if (t === 'bool' || t === 'boolean')
            return target === 'rust' ? 'bool' : 'boolean';
        if (t === 'void')
            return target === 'rust' ? '()' : (target === 'go' ? '' : 'void');
        return type;
    }
    static mapParams(paramsStr, target) {
        if (!paramsStr.trim())
            return '';
        const params = paramsStr.split(',').map(p => p.trim()).filter(Boolean);
        return params.map(p => {
            const parts = p.split(/\s*:\s*|\s+/);
            const name = parts[0];
            const type = parts[1] || 'int';
            switch (target) {
                case 'java':
                case 'csharp':
                    return `${CodeTranslator.mapType(type, target)} ${name}`;
                case 'typescript':
                    return `${name}: ${CodeTranslator.mapType(type, target)}`;
                case 'go':
                    return `${name} ${CodeTranslator.mapType(type, target)}`;
                case 'rust':
                    return `${name}: ${CodeTranslator.mapType(type, target)}`;
                default:
                    return name;
            }
        }).join(', ');
    }
    static addLanguageDifferences(from, to, notes) {
        if (from === 'python' && to === 'java') {
            notes.push('💡 Tipagem: Python possui tipagem dinâmica com Duck Typing; Java exige tipagem estática e forte.');
            notes.push('💡 Strings: Em Java, Strings usam o String Pool e devem ser comparadas com .equals(), nunca com ==.');
        }
        else if (from === 'java' && to === 'python') {
            notes.push('💡 Sintaxe: Python dispensa ponto e vírgula (;) e chaves ({}), controlando blocos estritamente por indentação (4 espaços).');
            notes.push('💡 Variáveis: Em Python não é necessário declarar o tipo da variável antes do nome.');
        }
        else if (to === 'rust') {
            notes.push('💡 Memória: Rust não possui Garbage Collector; variáveis seguem as regras estritas de Ownership e Borrowing (&).');
        }
        else if (to === 'go') {
            notes.push('💡 Declarações: Go utiliza o operador de inferência := para variáveis locais.');
        }
    }
}
exports.CodeTranslator = CodeTranslator;
//# sourceMappingURL=CodeTranslator.js.map