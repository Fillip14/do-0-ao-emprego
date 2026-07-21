# Tema 1 — Node · Enunciados

> Pasta: `etapas/etapa-2/tema-01-node/` · Projeto autocontido: `npm install` + `npm start` + `npm test` funcionam aqui dentro.
> Regra da etapa: **fase REVISOR** — nada de código pronto. Você escreve, roda, e só depois eu reviso (antes→depois).
> **Nomes de arquivo em inglês** (regra do projeto); o conteúdo — enunciados, comentários, respostas — continua em português.
> **Commit por exercício.** Mensagem no formato `s1: ex03 servidor http cru` (mensagem pode ser PT).

## Antes de começar — ambiente (checklist)

Marque cada item só depois de ver a saída com os próprios olhos:

- [X] Projeto **dentro do WSL** (`pwd` começa com `/home/`, nunca `/mnt/c/`)
- [X] Node LTS via **nvm** — `which node` aponta pra dentro de `~/.nvm/`, não pra `/mnt/c/Program Files/`
- [X] VS Code com extensão **WSL** (canto inferior esquerdo mostra `WSL: Ubuntu`)
- [X] `git status` funciona na pasta e `.gitignore` tem `node_modules/`

Se `which node` mostrar caminho do Windows, pare e resolva — metade dos bugs esquisitos da semana nascem aí.

---

## Ex 01 — 📖 O que é um servidor · ✅ (feito 20/07)

**Arquivo:** `ex01-server.md`

Escreva no arquivo:

1. Um desenho em texto (ASCII, setas, o que preferir) do caminho completo: **navegador → porta → processo → resposta → navegador**.
2. Em cada seta, uma legenda dizendo *o que viaja ali*.
3. Uma frase respondendo: **onde exatamente "mora" a porta?** No cabo? No processo? No sistema operacional? Justifique.
4. Uma frase: o que acontece se dois processos tentarem escutar a mesma porta?

Você vai conferir o item 4 na prática no Ex 03 — escreva a previsão **antes**.

---

## Ex 02 — 📖 Anatomia do HTTP · ✅ (feito 20/07)

**Arquivo:** `ex02-http.md`

1. Rode `curl -i https://example.com` e cole a saída no arquivo.
2. Marque na saída (com comentários seus, tipo `<-- linha inicial`) as **três partes**: linha inicial, headers, corpo.
3. Rode de novo com `-I` (maiúsculo) e explique em uma frase a diferença entre `-i` e `-I`.
4. Tabela sua: as **5 famílias de status** (1xx…5xx), com uma frase cada dizendo *de quem é a culpa / o que significa*.
5. Liste os métodos que você conhece e marque quais têm corpo na requisição.

---

## Ex 03 — 🔨 `node:http` cru · ✅ (feito 21/07)

**Arquivo:** `ex03-raw-http.js`

Servidor sem nenhuma dependência (`node:http` só) que:

- responde **JSON** em `/` — algo como `{ "message": "..." }`, com o `Content-Type` correto
- responde **texto puro** em `/about`
- responde **404** em qualquer outra rota

Rode com `node ex03-raw-http.js` e comprove com `curl -i` nas três situações. Cole as três saídas de `curl -i` no fim do arquivo, como comentário.

**Checagens obrigatórias:**

- O `Content-Type` do `/` está `application/json` e o do `/about` não? Confira no `curl -i`, não no navegador.
- Abra um **segundo terminal** e rode o mesmo arquivo de novo. Qual erro aparece? Confere com a sua previsão do Ex 01?

---

## Ex 04 — 🔨 Streams · ✅ (feito 21/07)

**Arquivo:** `ex04-streams.js`

Servidor que, num `POST`, escuta `req.on('data', ...)` e loga **cada pedaço** que chega (tamanho do chunk e o contador), e no `req.on('end')` loga o total.

Para provocar vários chunks, mande um corpo grande:

```bash
node -e "process.stdout.write('x'.repeat(2000000))" > large-body.txt
curl -X POST --data-binary @large-body.txt http://localhost:3000/
```

**Responda no fim do arquivo (comentário):**

- Quantos chunks chegaram? Qual o tamanho deles?
- Por que o Node não te entrega o corpo inteiro de uma vez? Dê um motivo prático (pense em um upload de 4 GB).
- Se você quisesse o corpo inteiro como string, o que teria que fazer? (Só descreva — o Express faz isso por você na S2.)

Adicione `large-body.txt` ao `.gitignore`.

---

## Ex 05 — 🔨 Event loop · ✅ (feito 21/07)

**Arquivo:** `ex05-event-loop.js`

Servidor com duas rotas:

- `/slow` — trava a thread por ~5 segundos num `while` **síncrono** (loop comparando `Date.now()`, sem `setTimeout`)
- `/fast` — responde na hora

**A prova:** com dois terminais, chame `/slow` no primeiro e, imediatamente, `/fast` no segundo. Use `curl -w "\ntempo: %{time_total}s\n"` pra medir.

No fim do arquivo, registre os dois tempos medidos e responda:

- Por que `/fast` demorou, se ele não faz nada?
- Refaça `/slow` usando `await` num `setTimeout` de 5s (versão assíncrona) e meça de novo. O que mudou e **por quê**?
- Uma frase: qual a diferença entre "o Node é single-thread" e "o Node não faz duas coisas ao mesmo tempo"?

---

## Ex 06 — 🔨 Erros não tratados · ✅ (feito 21/07)

**Arquivo:** `ex06-errors.js`

Servidor com duas rotas que quebram de formas diferentes:

- `/throw` — lança um `Error` **fora** de qualquer try/catch, de forma síncrona
- `/promise` — cria uma Promise rejeitada **sem** `.catch()` / sem `await` em try

Chame cada uma e observe:

1. O processo **morre**? Em qual dos dois casos?
2. O cliente (curl) recebe alguma resposta ou fica pendurado?
3. O que aparece no stdout do servidor?

Depois registre handlers de `process.on('uncaughtException')` e `process.on('unhandledRejection')`, logue algo neles e repita os testes.

**Responda no fim:**

- O que mudou com os handlers registrados?
- Por que **continuar rodando** depois de um `uncaughtException` é considerado perigoso? (Uma frase — vai voltar na S9, no deploy.)

---

## Ex 07 — 🔨 `process.env` · ⚠️ refazer · ✅ (feito 21/07)

**Arquivo:** `ex07-env.js`

Servidor que escuta na porta vinda de `process.env.PORT`, com **default 3000** quando a variável não existe.

Comprove os três casos, colando os comandos e as saídas:

```bash
node ex07-env.js                 # 3000
PORT=4000 node ex07-env.js       # 4000
PORT=abc node ex07-env.js        # ???
```

**Responda:**

- Qual o `typeof` de `process.env.PORT`? Isso importa pro `listen`?
- O que aconteceu com `PORT=abc`? Isso é aceitável? O que você faria a respeito?
- Uma frase: por que a porta é **ambiente** e não **código**?

---

## Ex 08 — 🔨 Projeto npm de verdade · ✅ (feito 21/07)

**Arquivos:** `package.json` na raiz da pasta da semana + `ex08-package.md`

Até aqui você rodou arquivos soltos. Agora transforme a pasta num projeto:

1. `npm init` (responda as perguntas — não use `-y` desta vez).
2. Crie os scripts `start` (roda um dos servidores) e `dev` (o mesmo, com `node --watch`).
3. Instale **uma** dependência de desenvolvimento — o `vitest` do Ex 12 serve.
4. Rode `npm start` e `npm run dev`; no `dev`, edite o arquivo e veja o restart.

Em `ex08-package.md`, **explique linha por linha o seu package.json**. Todas. Se tiver uma linha que você não sabe explicar, essa é a linha importante.

E responda:

- `dependencies` × `devDependencies`: o que acontece com uma devDep em produção?
- `^1.2.3` — quais versões isso aceita? E `~1.2.3`? E `1.2.3`?
- O `package-lock.json` vai pro git? Por quê?

---

## Ex 09 — 📖 ESM vs CommonJS · ✅ (feito 21/07)

**Arquivo:** `ex09-modules.md`

1. **Antes de rodar qualquer coisa**, escreva sua previsão: o que quebra se você adicionar `"type": "module"` ao package.json? Liste os arquivos e o erro que espera em cada um.
2. Agora adicione. Rode tudo. Cole os erros reais.
3. Compare previsão × realidade — acertos e surpresas.
4. Converta **um** dos exercícios anteriores para ESM (`import`/`export`) e deixe funcionando.
5. Responda: por que `require` é síncrono e `import` não? O que é a extensão `.mjs`/`.cjs` e quando ela salva?

Decisão sua (justificada, uma frase no arquivo): **o resto da etapa vai em ESM ou CommonJS?**

---

## Ex 10 — 🔨 Módulos nativos · ⚠️ refazer (feito 21/07)

**Arquivo:** `ex10-core-modules.js`

Script (não servidor) que:

1. Gera um UUID com `crypto.randomUUID()`
2. Monta o caminho de um arquivo com `path.join` — nunca com `'/'` na mão
3. Grava um JSON nesse caminho com `fs/promises` (`writeFile`)
4. Lê de volta (`readFile`), faz `JSON.parse` e imprime
5. Comprova que o objeto lido é igual ao gravado

**Responda no fim:**

- Por que `path.join` em vez de concatenar strings? (Pense em Windows — e no seu `.md` da S1 rodando em WSL.)
- Qual a diferença entre `__dirname` / `import.meta.url` e o diretório de onde você **rodou** o comando (`process.cwd()`)? Prove rodando o script de outra pasta.
- `fs/promises` × `fs` com callback: qual você usa e por quê?

---

## Ex 11 — 🔨 Debugging com `--inspect` · ✅ (feito 21/07)

**Arquivo:** `ex11-debug.md` (+ `.vscode/launch.json` se você criar)

1. Suba um dos seus servidores com `node --inspect`.
2. Conecte o debugger do VS Code (ou `chrome://inspect`).
3. Ponha um **breakpoint dentro do handler**, faça um request e deixe o processo pausar.
4. Com ele pausado, inspecione: `req.url`, `req.method`, `req.headers`. **Tire um print** e salve na pasta.
5. Use o console do debugger pra avaliar uma expressão em runtime (ex.: `Object.keys(req.headers).length`).

**Responda:**

- O que acontece com o `curl` do outro lado enquanto o processo está pausado? Por quê? (Ligue isso ao Ex 05.)
- Cite uma situação em que o breakpoint te diz algo que 10 `console.log` não diriam.

---

## Ex 12 — 🔨 Testes com Vitest · ⚠️ refazer · ✅ feito 21/07

**Arquivos:** `ex12-functions.js` + `ex12-functions.test.js`

Duas **funções puras** (sem I/O, sem rede, sem data/hora) — sugestões, escolha ou invente:

- `parsePort(value)` — recebe string/undefined, devolve número válido ou o default (é o Ex 07 virando função testável)
- `slugify(title)` — texto → slug minúsculo com hífens

Para **cada** função: um teste de **caso feliz** e um de **caso de borda** (vazio, `undefined`, tipo errado, acentos, string gigante — o que fizer sentido).

1. Instale o vitest como devDep, configure o script `test`.
2. `npm test` **verde**.
3. Depois quebre a função de propósito e veja o teste **vermelho** — um teste que nunca falhou não prova nada. Cole as duas saídas no fim do arquivo de teste.

**Responda (comentário no fim do teste):**

- Por que função **pura** é fácil de testar? O que teria que mudar pra testar o servidor inteiro? (É a S2 — supertest.)
- `expect(a).toBe(b)` × `toEqual`: qual quebra com objetos e por quê?

---

## Fechamento da semana

**Arquivo:** `README.md` na pasta da semana

- O que cada arquivo `exNN` faz, em uma linha
- Como rodar (`npm start`, `npm test`)
- **3 coisas que te surpreenderam** nesta semana
- **1 coisa que ficou mal resolvida** — eu uso isso no checkpoint

**Checkpoint semanal** (verde/amarelo/vermelho) contra a âncora de 28/09: me chame quando os 12 estiverem commitados. Aí eu faço o **code review de tudo**, em formato antes→depois.

---

## Como pedir ajuda nesta fase

✅ "Me explica o que é backpressure em stream" · "Meu Ex 05 tá dando esse erro: [erro]" · "Terminei o Ex 03, revisa"
❌ "Escreve o servidor do Ex 03 pra mim" · "Me dá o código do teste"

Travou mais de 30 min no mesmo ponto? Aí sim me chame — mas descrevendo **o que você já tentou**.
