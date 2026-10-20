"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitDefinition = void 0;
exports.gitDefinition = {
    id: 'git',
    name: 'Git & DevOps Essentials',
    vscodeLanguageIds: ['git-commit', 'shellscript', 'ignore'],
    fileExtensions: ['.gitignore', '.gitmodules'],
    description: 'Sistema de controle de versão distribuído essencial para colaboração em equipe e pipelines CI/CD.',
    badge: 'Git 2.40+',
    color: '#f05032',
    snippets: [
        // ==========================================
        // REBASE VS MERGE
        // ==========================================
        {
            id: 'git-rebase-vs-merge',
            title: 'Rebase vs Merge: Histórico Linear vs Preservação de Contexto',
            category: 'git_workflow',
            level: 'Intermediário',
            summary: 'Como atualizar sua branch de feature com a main sem criar commits de merge poluídos.',
            keywords: ['rebase', 'merge', 'git rebase', 'git merge', 'historico linear'],
            completionTrigger: 'git-rebase-flow',
            code: `# 1. Atualizando sua branch de feature com Git Rebase (Histórico Linear Limpo):
git switch main
git pull origin main
git switch feature/minha-tarefa
git rebase main

# Em caso de conflitos durante o rebase:
# 1. Resolva os conflitos nos arquivos
# 2. git add .
# 3. git rebase --continue
# (Se desejar desistir: git rebase --abort)

# 2. Merge Tradicional (Cria um commit explícito de mesclagem):
git switch main
git merge --no-ff feature/minha-tarefa`,
            explanation: 'O "git rebase" pega os seus commits da feature e os "reaplica" um a um em cima do commit mais recente da main, gerando uma linha do tempo reta e fácil de inspecionar com git log ou git bisect.',
            bestPractices: [
                'Regra de Ouro: NUNCA faça rebase em branches públicas compartilhadas (como main/master).',
                'Use rebase em suas branches locais de feature antes de abrir o Pull Request.'
            ]
        },
        // ==========================================
        // STASH (SALVAMENTO TEMPORÁRIO)
        // ==========================================
        {
            id: 'git-stash-essentials',
            title: 'Git Stash: Guardar Alterações Temporárias sem Commitar',
            category: 'git_workflow',
            level: 'Iniciante',
            summary: 'Ideal quando você precisa trocar de branch com urgência sem sujar o histórico com commits provisórios.',
            keywords: ['stash', 'git stash', 'pop', 'apply', 'wip'],
            completionTrigger: 'git-stash-flow',
            code: `# 1. Guarda alterações de arquivos rastreados e não rastreados com mensagem:
git stash push -u -m "WIP: trabalhando na regra de desconto"

# 2. Lista os stashes armazenados na pilha:
git stash list
# Saída: stash@{0}: On feature: WIP: trabalhando na regra de desconto

# 3. Recupera o último stash e o remove da pilha:
git stash pop

# Dica: Se quiser aplicar as alterações mas MANTER o stash salvo na pilha:
# git stash apply`,
            explanation: 'O stash guarda seu estado de trabalho modificado na pasta oculta .git e limpa o diretório de trabalho, permitindo dar pull ou alternar branches sem conflitos.',
            bestPractices: [
                'Sempre use a flag -m "mensagem" ao dar stash para saber o que guardou semanas depois.',
                'Use a flag -u (--include-untracked) para guardar também arquivos recém-criados.'
            ]
        },
        // ==========================================
        // DESFAZER & CORRIGIR ERROS
        // ==========================================
        {
            id: 'git-undo-mistakes',
            title: 'Desfazer e Corrigir Erros no Git com Segurança',
            category: 'git_workflow',
            level: 'Intermediário',
            summary: 'Como emendar commits esquecidos, retirar arquivos da staging area e voltar no tempo.',
            keywords: ['amend', 'reset', 'restore', 'revert', 'desfazer'],
            completionTrigger: 'git-undo-flow',
            code: `# 1. Esqueci de um arquivo ou errei a mensagem do último commit (antes do push):
git add arquivo_esquecido.java
git commit --amend --no-edit # Inclui o arquivo no último commit sem alterar a mensagem

# 2. Tirei um arquivo da staging area (sem perder o código digitado):
git restore --staged arquivo.java

# 3. Desfazer o último commit mas PRESERVAR todo o código alterado (Soft Reset):
git reset --soft HEAD~1

# 4. Desfazer commit que JÁ FOI ENVIADO para o GitHub (Seguro para equipe):
git revert <hash_do_commit>`,
            explanation: 'git revert cria um NOVO commit que aplica exatamente o inverso das alterações do commit problemático, sendo 100% seguro para histórico compartilhado.',
            bestPractices: [
                'Use git revert para código já publicado na branch remota.',
                'Evite git reset --hard a menos que queira descartar irreversivelmente alterações locais.'
            ]
        },
        // ==========================================
        // CONVENTIONAL COMMITS
        // ==========================================
        {
            id: 'git-conventional-commits',
            title: 'Conventional Commits: Padrão da Indústria para Mensagens',
            category: 'git_workflow',
            level: 'Iniciante',
            summary: 'Convenção semântica legível por humanos e ferramentas de automação (Semantic Release, changelogs).',
            keywords: ['conventional commits', 'feat', 'fix', 'chore', 'refactor', 'docs'],
            completionTrigger: 'git-conventional-template',
            code: `# Estrutura Geral:
# <tipo>(<escopo_opcional>): <descrição no imperativo e minúsculo>

# Exemplos Práticos:
git commit -m "feat(auth): adiciona autenticação JWT e refresh token"
git commit -m "fix(pagamento): corrige cálculo de juros em boletos vencidos"
git commit -m "refactor(usuario): migra injeção de campo para construtor"
git commit -m "docs(readme): adiciona instruções de execução com Docker Compose"
git commit -m "test(pedido): adiciona testes unitários para cálculo de frete"
git commit -m "chore(deps): atualiza versão do Spring Boot para 3.2.5"`,
            explanation: 'Seguir o padrão Conventional Commits viabiliza a geração automatizada de Changelogs, bumping de versão semântica (SemVer) e facilita auditorias de código.',
            bestPractices: [
                'Escreva a mensagem no tempo presente/imperativo ("adiciona", não "adicionado").',
                'Limite o assunto do commit a 50-72 caracteres.'
            ]
        }
    ]
};
//# sourceMappingURL=git.js.map