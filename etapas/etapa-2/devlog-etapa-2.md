# Devlog — Etapa 2 (Back-end: Node, Express, TypeScript e banco)

## 16/07 ao 20/07/2026

1. **v1 da etapa (arquivada)** e **v1 do tema 3 (arquivada)** — alterado metodologia de estudo para melhor compreensão e maior fluidez — arquivos em: [`etapas/etapa-2/archived/`](etapas/etapa-2/archived/)

> Reinício da etapa · 21/07/2026

## 21/07

- **🔨 Tema 1 (Node)** — Iniciado, pasta `t01-node/`.
- **✅ Tema 1 (Node)** — Fechado.
- **🔨 Tema 2 (Express)** — Iniciado, pasta `t02-express/`.

**Anotações**

1. Estudo, exercicios e respostas de perguntas nas pastas: [`etapas/etapa-2/studies/t01-node`](etapas/etapa-2/studies/t01-node); [`etapas/etapa-2/studies/t02-express`](etapas/etapa-2/studies/t02-express)

- Amanhã: continuar o Tema 2

## 22/07

- **✅ Tema 2 (Express)** — Fechado
- **🔨 Tema 3 (TypeScript)** — Iniciado, pasta `t03-typescript/`

**Anotações**

1. Estudo, exercicios e respostas de perguntas nas pastas: [`etapas/etapa-2/studies/t01-node`](etapas/etapa-2/studies/t01-node); [`etapas/etapa-2/studies/t02-express`](etapas/etapa-2/studies/t02-express)

- Amanhã: continuar o Tema 3

## 23/07

- **🔨 Tema 3 (TypeScript)** — Continuação

**Anotações**

1. Dia finalizado com poucas alterações de tipagem, refeito metodologia de estudo.

- O que aprendi: -
- Travei/faltou: -
- Amanhã: continuar o Tema 3

## 24/07

- **✅ Tema 3 (TypeScript)** — Fechado

**Anotações**

### T3
1. A principal diferença é em relação ao tempo, no ts ele pega o erro em compilação mas não quebra, já no runtime ele quebra e pode demorar para chegar ao erro.
2. Porque é feito uma build que converte tudo para .js, o TS é apenas para tipar durante a compilação.
3. Deixa inferir quando há valor inicial; anota em 3 casos: parâmetro (o TS nunca infere), variável sem valor inicial, e retorno que quer travar. "Quanto mais anotado melhor" é mito — anotar o que já se infere é ruído.
4. any determina que aquele tipo pode ser qualquer coisa, o código fica perigoso/quebravel, unknown é quando realmente não se sabe o dado a ser recebido, obriga a provar (narrowing) antes de usar.
5. let infere string, const infere "todo"pois const não pode ser alterada e "todo" é o que a const é, já em let ela pode ser alterada para qualquer string.
6. Quem faz extends e declaration merging é a interface (você usou isso no declare module do req.taskId!). type faz união/interseção. No hover, type expande a forma; interface mostra o nome.
7. Excess property checking: objeto literal com campo a mais dá erro — mas não dispara se o objeto passar por uma variável antes de ser atribuído.
8. Narrowing = estreitar o tipo com uma checagem, e o TS acompanha o fluxo. typeof não distingue objetos porque todos são "object".
9. Enum deixa o ambiente de produção mais pesado, união literal não gera nada de código.
10. Se todos os casos foram tratados, o default recebe never e compila; se falta um, o tipo restante não cabe em never e dá erro de compilação que nomeia o caso esquecido.
11. as não checa nada — só manda o TS confiar. Como o dado vem de fora e pode ser qualquer coisa, essa confiança é uma promessa não verificada; daí "mentira".
12. Ele garante que o valor repassado é do type que foi definido, sequencia de validações ficam true e determinam que é do type, ou false. O TS não confere se a tua checagem interna está certa — um predicate que faz return true sem validar nada compila do mesmo jeito.
13. Discriminated union: união de objetos com um campo literal diferente em cada; comparar esse campo estreita o objeto inteiro, e o estado impossível não é representável.
14. É pelo middleware que trata erro centralmente, assim o throw é enviado e capturado no middleware.
15. strictNullChecks: find() devolve T | undefined, e te obriga a tratar antes de acessar. 3 formas: early return (a que você usou, com 404), ?., ?? default.
16. Extends não adiciona campos — ele restringe o que T pode ser (um piso mínimo). Generic preserva o tipo que o any apagaria.
17. Pois assim se o type principal sofrer alguma alteração todos os outros se atualizam em cascata.
18. {} é TaskPatch válido porque Partial torna tudo opcional; a regra "pelo menos um campo" vive em runtime.
19. Desliga a checagem (não converte); satisfies valida sem trocar o tipo inferido. as legítimo só em as const, as unknown as T em teste, ou estreitar após checagem que o TS não segue.
20. Um é sobre a config utilizado em compilação, outro é para a hora de buildar.
21. type:module e module:nodenext têm que concordar, senão ERR_MODULE_NOT_FOUND; o import leva .js porque, com nodenext, o especificador é o caminho em runtime (onde o arquivo é .js).
22. tsc --noEmit vem antes porque o vitest não checa tipo — sem ele, um arquivo com erro de tipo passaria verde.
23. Testa o que o tipo não garante (os validadores com lixo). A borda ganha do compilador porque é onde entra dado que ele não controla.
24. Praticamente todo código tive que tipar mas as rotas, os middlewares e os erros. Não senti que nada ficou mal resolvido.

- O que aprendi: methods e tópicos sobre typescript.
- Travei/faltou: são muitos metódos de tipagem, acredito que eu não tenha abordado todos na API mas tipei ela toda.
- Amanhã: tema 4

## 25/07 - 28/07

- **🔨 Tema 4 (PostgreSQL)** — Iniciado
- **✅ Tema 4 (PostgreSQL)** — Fechado

**Anotações**

- O que aprendi:
- Travei/faltou:
- Amanhã: iniciar tema 5
