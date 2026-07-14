# Resumo — o que você aprendeu na Etapa 0 (Rigor + Git)

## Terminal (D0)

| Comando | Serve para | Exemplo |
|---|---|---|
| `pwd` | mostrar em que pasta você está | `/home/fillip/projects` |
| `ls` | listar o conteúdo da pasta | `ls etapa-0/` |
| `mkdir` | criar pasta | `mkdir docs` |
| `mv origem destino` | mover OU renomear | `mv ex06.js ex05.js` |
| `*` | curinga: casa qualquer sequência | `mv *.md docs/` |
| `Tab` | autocompletar caminho/comando | — |
| `nano arquivo` | editar no terminal | `Ctrl+O` salva, `Ctrl+X` sai |

## Git básico (D1)

| Comando | Serve para | Detalhe que importa |
|---|---|---|
| `git config --global` | assinar seus commits (nome + email) | `--global` vale pra máquina toda |
| `git init` | transformar a pasta em repositório | — |
| `.gitignore` | listar o que NUNCA entra em commit | `node_modules/` sempre |
| `git add .` | escolher o que entra no próximo commit | add ≠ salvar; é "colocar na caixa" |
| `git commit -m` | salvar um SNAPSHOT das mudanças no histórico local | a mensagem é etiqueta, não o commit |
| `git push` | enviar seus COMMITS pro GitHub | commit sem push = só na sua máquina |
| `git status` | ver o estado: modificado, staged, untracked, ahead | leia ele ANTES de commitar |
| `git log --oneline` | histórico enxuto, um commit por linha | — |

## Git intermediário (D5)

| Comando | Serve para | Detalhe que importa |
|---|---|---|
| `git switch -c nome` | criar branch e já mudar pra ela | branch = linha do tempo paralela |
| `git switch main` | voltar pra main | suas mudanças "somem" — estão na outra branch |
| `git merge nome` | trazer os commits da branch pra atual | fast-forward quando a main não andou |
| `git branch -d nome` | apagar branch já mesclada | — |
| `git restore arquivo` | descartar mudanças NÃO commitadas (volta ao último commit) | mexe nos ARQUIVOS |
| `git reset HEAD~1` | desfazer o último COMMIT — as mudanças FICAM nos arquivos | mexe nos COMMITS |
| `git commit --amend --no-edit` | consertar o último commit (ex: arquivo esquecido) | se já deu push, NÃO use — faça outro commit |
| `git mv a b` | renomear arquivo rastreado | só funciona se o arquivo já entrou em commit |

> **Git É o backup.** `reset HEAD~1` não apaga nada dos arquivos, e commit "perdido" se recupera com `git reflog`. Backup manual de arquivo nunca é necessário.

## O método de trabalho (o coração da etapa)

| Passo | O que fazer | Por que existe |
|---|---|---|
| 1. Checklist do enunciado | ANTES de codar: nome exato, o que retorna, formato, casos especiais | seu erro nº 1 na avaliação (5 de 9 ex.) |
| 2. Código | só depois do checklist preenchido | — |
| 3. Fronteiras | testar EM CIMA do limite (6.9 / 7 / 7.1; o "8 exato" do mínimo 8) | seu erro nº 2 — e escapou 2x no validarSenha |
| 4. Casos inválidos | entrada inválida com resposta CERTA esperada (o teste PASSA) | caso inválido ≠ assert quebrado |
| 5. Releitura final | comparar código × enunciado palavra por palavra | foi aqui que `valid/errors` escapou onde era `valida/erros` |
| 6. Commits pequenos | um commit por parte funcionando, não um commitão | ficou devendo no D6 — cobrança na E1 |

## Testes com node:assert (D4)

| Ferramenta | Serve para | Exemplo |
|---|---|---|
| `assert.strictEqual(atual, esperado)` | comparar valores com `===` | `assert.strictEqual(aprovado(7), true)` |
| `assert.deepStrictEqual(atual, esperado)` | comparar CONTEÚDO de objetos/arrays | `strictEqual` compara referência, não conteúdo |
| Quebrar de propósito | trocar `>=` por `>` e ver o teste pegar | prova que o teste protege o código |
| Ler o erro | `actual` = o que veio; `expected` = o que devia; `arquivo:linha` aponta o assert | o stack trace embaixo pode ignorar |

## JavaScript que ficou da etapa

| Conceito | O essencial | Exemplo |
|---|---|---|
| Arrow function | com `{}` o `return` é obrigatório; sem `{}` o return é implícito | `const aprovado = (nota) => nota >= 7;` |
| `return` vs `console.log` | return entrega valor PRO CÓDIGO (variável, assert); log só MOSTRA pro humano | 3 exercícios da avaliação erraram isso |
| `===` vs `==` | `===` compara valor E tipo; `==` converte antes | `'7' == 7` → true; `'7' === 7` → false. Use `===` |
| Escopo | variável declarada FORA da função guarda estado entre chamadas | o bug do `counter` que acumulava |
| `let`/`const`/`var` | `let` vive no bloco; `const` não reatribui; `var` vaza — evite | aprofunda na E1 |
| Loop + flag | varrer string/array e marcar `true` quando achar | `if ('0123456789'.includes(s[i])) temNumero = true;` |
| `a.includes(b)` | pergunta se **b está dentro de a** — cuidado com a ordem | `'0123456789'.includes(senha)` era a pergunta INVERTIDA |
| CommonJS vs ESM | `require`/`module.exports` OU `import`/`export` — nunca misturar | `export` + `require` no mesmo arquivo = ReferenceError |
| `require.main === module` | bloco só roda quando o arquivo é executado direto | logs não aparecem quando importado pelo testes.js |

## Conceitos corrigidos da avaliação inicial

| Antes você achava | Agora você sabe |
|---|---|
| commit = comentário | commit = snapshot das mudanças; a mensagem é só a etiqueta |
| commit já salva no GitHub | commit é local; `push` é o que envia pro remoto |
