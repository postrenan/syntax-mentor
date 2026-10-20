import { LanguageDefinition } from '../../types';
import { javaDefinition } from './java';
import { pythonDefinition } from './python';
import { typescriptDefinition } from './typescript';
import { csharpDefinition } from './csharp';
import { goDefinition } from './go';
import { rustDefinition } from './rust';

export const ALL_LANGUAGES: LanguageDefinition[] = [
  javaDefinition,
  pythonDefinition,
  typescriptDefinition,
  csharpDefinition,
  goDefinition,
  rustDefinition
];

export function getLanguageById(id: string): LanguageDefinition | undefined {
  return ALL_LANGUAGES.find(lang => lang.id.toLowerCase() === id.toLowerCase());
}

export function getLanguageByVsCodeId(vscodeLangId: string): LanguageDefinition | undefined {
  return ALL_LANGUAGES.find(lang =>
    lang.vscodeLanguageIds.includes(vscodeLangId.toLowerCase())
  );
}

export function getLanguageByFilename(filename: string): LanguageDefinition | undefined {
  const lower = filename.toLowerCase();
  return ALL_LANGUAGES.find(lang =>
    lang.fileExtensions.some(ext => lower.endsWith(ext))
  );
}
