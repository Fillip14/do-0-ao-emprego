# Etapa 0 — Rigor + Git (08 a 14/07/2026)

**Objetivo:** corrigir os 4 padrões encontrados na avaliação e montar sua base Git/GitHub. Sem conteúdo novo de programação — o foco é COMO você trabalha.

**Os 4 padrões a matar nesta etapa:**

1. Não seguir o enunciado à risca (aconteceu em 5 de 9 exercícios)
2. Erros de fronteira (`>` vs `>=`)
3. Não testar casos que devem falhar
4. Confundir `console.log` com `return`

**Regras da etapa (Trilha de IA — fase TUTOR):**

- IA só para explicar conceitos e revisar código DEPOIS de pronto. Proibido pedir código.
- Commit diário no GitHub (mínimo 5 dos 7 dias).
- Devlog: 3 linhas por dia no fim do `devlog.md` (o que fiz / o que travou / amanhã).
- Todos os exercícios em JavaScript (Node), na pasta `etapa-0/`.
- Todo exercício termina com chamadas de verificação (`console.log`) no próprio arquivo: **uma para cada item do checklist**, com o valor esperado em comentário (ex: `// esperado: 3`). Elas ficam no arquivo commitado. (Regra adicionada em 08/07 a pedido do Fillip.)

---

## Dia 1 — Ter 08/07 — Setup Git

- Criar conta no GitHub (se não tiver).
- No WSL: configurar `git config --global user.name` e `user.email`.
- `git init` nesta pasta, criar `.gitignore` com `node_modules/`.
- Criar repo `do-0-ao-emprego` no GitHub e fazer o primeiro push.
- Aprender (IA como tutora): o que fazem `status`, `add`, `commit`, `push`, `log`. Anotar com suas palavras no devlog.
- **Também hoje:** decidir a rotina (uber ou laboratório) e me contar.

## Dia 2 — Qua 09/07 — Ler enunciado à risca

Antes de rodar qualquer código, escreva um checklist do enunciado (o que ele pede EXATAMENTE: nome da função, o que retorna, formato da saída).

- **Ex 0.1** — Função `classificarIdade(idade)` que RETORNA (não imprime): `"criança"` se idade < 12, `"adolescente"` se 12 até 17, `"adulto"` se 18 ou mais. Se idade for negativa, retornar `null`.
- **Ex 0.2** — Função `contarVogais(texto)` que retorna a QUANTIDADE de vogais (número, não lista). Maiúsculas contam. String vazia retorna 0.
- Commit: `dia 2: exercicios de leitura de enunciado`

## Dia 3 — Qui 10/07 — Fronteiras

- **Ex 0.3** — `aprovado(nota)`: retorna `true` se nota >= 7, senão `false`. Teste com 6.9, 7 e 7.1 — os três, obrigatoriamente.
- **Ex 0.4** — `dentroDoIntervalo(n, min, max)`: `true` se n está entre min e max INCLUSIVE. Teste exatamente nos limites.
- Para cada função: escreva num comentário quais valores testou e por quê.
- Commit diário.

## Dia 4 — Sex 11/07 — Testes que devem falhar

- Aprender `node:assert` (IA como tutora: pedir explicação, não código).
- Escrever `testes.js` com asserts para os Ex 0.1 a 0.4, incluindo pelo menos **1 caso inválido por função** (idade negativa, string vazia, n fora do intervalo…).
- Rodar, ver passar, quebrar de propósito uma função e ver o teste pegar.

## Dia 5 — Sáb 12/07 — Git intermediário

- Criar uma branch `experimento`, mudar algo, fazer merge na main.
- Aprender a desfazer: `git restore` e `git reset` (testar num arquivo de rascunho).
- Escrever `README.md` do repo: quem é você, o que é o projeto, o que tem em cada pasta.

## Dia 6 — Dom 13/07 — Mini-desafio integrador

- **Ex 0.5** — `validarSenha(senha)`: retorna objeto `{ valida: boolean, erros: string[] }`. Regras: mínimo 8 caracteres, pelo menos 1 número, pelo menos 1 letra maiúscula. `erros` lista o que faltou (vazio se válida).
- Fluxo completo: checklist do enunciado → código → testes com casos que falham → commit pequeno a cada parte funcionando.

## Dia 7 — Seg 14/07 — Revisão e entrega

- Reler os 5 exercícios comparando com os enunciados, palavra por palavra.
- Devlog final da semana.
- **Me avisar aqui no chat** → farei a avaliação da Etapa 0.

---

## Critérios da avaliação (o que vou cobrar)

- Todos os enunciados seguidos à risca (nomes, return vs print, formatos).
- Fronteiras testadas nos Ex 0.3 e 0.4.
- `testes.js` com pelo menos 1 caso negativo por função, rodando.
- Repo no GitHub com commits em pelo menos 5 dias e README.
- Explicar com suas palavras (sem consultar): commit vs push, return vs console.log.

**Aprovado →** Etapa 1 (fundamentos JS a fundo). **Pendências →** ajustamos antes de avançar.
