"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_LANGUAGES = void 0;
exports.getLanguageById = getLanguageById;
exports.getLanguageByVsCodeId = getLanguageByVsCodeId;
exports.getLanguageByFilename = getLanguageByFilename;
const java_1 = require("./java");
const python_1 = require("./python");
const typescript_1 = require("./typescript");
const csharp_1 = require("./csharp");
const go_1 = require("./go");
const rust_1 = require("./rust");
exports.ALL_LANGUAGES = [
    java_1.javaDefinition,
    python_1.pythonDefinition,
    typescript_1.typescriptDefinition,
    csharp_1.csharpDefinition,
    go_1.goDefinition,
    rust_1.rustDefinition
];
function getLanguageById(id) {
    return exports.ALL_LANGUAGES.find(lang => lang.id.toLowerCase() === id.toLowerCase());
}
function getLanguageByVsCodeId(vscodeLangId) {
    return exports.ALL_LANGUAGES.find(lang => lang.vscodeLanguageIds.includes(vscodeLangId.toLowerCase()));
}
function getLanguageByFilename(filename) {
    const lower = filename.toLowerCase();
    return exports.ALL_LANGUAGES.find(lang => lang.fileExtensions.some(ext => lower.endsWith(ext)));
}
//# sourceMappingURL=index.js.map