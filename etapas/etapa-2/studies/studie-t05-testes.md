# Estudo — Testes a fundo (Tema 5)

> **Aberto em 28/07, congelado no meio, retomado em 11/08.** A Parte A ficou inteira; da Parte B **nada chegou na `api/`** — não existe `vitest.config.ts`, a suíte ainda é o `src/app.test.ts` de 300 linhas com `DELETE FROM tasks` e `pool.end()` soltos no topo. O trabalho começa do zero, o estudo não.
>
> **Formato realinhado em 11/08 à regra 6 reescrita** (a mesma da Etapa 3): **Parte A** = manual de consulta por tópico · **Parte B** = aplicação na `api/`, em preparação de ambiente + **dois blocos** (obrigatório, depois sugestões) · **Parte C** = as **três verificações**, e só elas. O questionário que ocupava a Parte C virou o [Apêndice](#apêndice--banco-de-perguntas-insumo-do-simulado): pela regra 8 ele não trava o fechamento do tema, é munição do simulado de entrevista do fim da etapa.
>
> **A API ganha:** suíte reorganizada — banco de teste isolado, fixtures e factories no lugar do improviso do Tema 4, cobertura medida.

---

# Parte A — Manual de consulta

## 1. A pirâmide: unitário × integração × e2e

**O que resolve?** Decide **onde** cada teste mora. Unitário testa uma função pura, sem I/O, em milissegundos. Integração testa peças reais conversando (rota + Express + banco). E2e sobe o sistema inteiro pela porta e ataca por fora, como um cliente.
**Quando usar?** Muita base (unitário: regra de negócio, validadores), meio razoável (integração: rota→banco), pouquíssimo topo (e2e: um caminho feliz por fluxo).
**Exemplo:** na sua suíte de hoje já existem os dois primeiros andares misturados no mesmo arquivo:

```ts
expect(isNewTask({ banana: 'x' })).toBe(false);   // unitário: função pura, sem banco
await request(app).post('/tasks').send({...});    // integração: Express + pg + Postgres
```

**Armadilhas:** `supertest(app)` **não é e2e** — ele não abre porta, chama o app em memória; e2e de verdade é `fetch` contra o servidor no ar (Tema 9). A pirâmide invertida (só e2e) dá suíte lenta e instável que ninguém roda; a pirâmide sem topo nenhum passa verde com o sistema quebrado. "Unitário" com mock de tudo testa o mock, não o código. E o rótulo importa menos que a pergunta: **se este teste falhar, eu sei onde ir olhar?**

## 2. Padrão AAA

**O que resolve?** Dá forma ao corpo do teste: **Arrange** (prepara), **Act** (executa a coisa sob teste), **Assert** (verifica). Quem lê acha em 2 segundos o que está sendo testado.
**Quando usar?** Sempre. É convenção de leitura, não ferramenta.
**Exemplo:**

```ts
it('responde 404 quando a task não existe', async () => {
  const id = randomUUID();                                  // arrange
  const res = await request(app).get(`/tasks/${id}`);       // act
  expect(res.status).toBe(404);                             // assert
});
```

**Armadilhas:** o pecado comum é **act no meio do assert** (`expect((await request(app).get(...)).status)`) — quando quebra, você não sabe se falhou o pedido ou a expectativa. Vários act no mesmo `it` significam vários testes disfarçados de um: o primeiro a falhar esconde os outros. Assert dentro do arrange (como o seu `postTask()`, que faz `expect(201)` antes do teste começar) é aceitável como **guarda** — mas quando ele falha, a mensagem acusa o teste errado; `it.fails` no lugar certo, ou uma factory que não asserta, resolve isso.

## 3. Hooks de ciclo de vida

**O que resolve?** `beforeAll` / `afterAll` (uma vez por arquivo) e `beforeEach` / `afterEach` (a cada teste) tiram a repetição de preparo e garantem limpeza mesmo quando o teste falha.
**Quando usar?** `beforeAll`: coisa cara e imutável (aplicar schema, abrir conexão). `beforeEach`: estado que cada teste suja (limpar tabela). `afterAll`: fechar o que segura o processo (pool).
**Exemplo:**

```ts
beforeAll(async () => { await applySchema(); });
beforeEach(async () => { await truncateAll(); });
afterAll(async () => { await pool.end(); });
```

**Armadilhas:** hook `async` sem `await` dentro do teste vira corrida silenciosa — o Vitest espera a Promise que o hook **retorna**, então esquecer o `return`/`async` mata a garantia. `afterEach` não roda se o processo morrer no meio: limpeza defensiva vai no **`beforeEach`**, não no `afterEach` (limpar antes é idempotente; limpar depois depende de chegar lá). Hook no escopo raiz vale para o arquivo **todo**, inclusive `describe`s que não precisam dele — e ordem é: hooks de fora para dentro no `before`, de dentro para fora no `after`. Estado compartilhado criado em `beforeAll` e mutado por um teste vaza para o vizinho: é a fonte nº 1 de teste que passa sozinho e falha na suíte.

## 4. Fixtures e factories

**O que resolve?** **Fixture** é dado pronto e fixo; **factory** é uma função que fabrica o dado com valores padrão e deixa você sobrescrever só o que o teste discute. Elimina o `{ title: 'Teste', status: 'todo', term: 'term test' }` copiado 20 vezes.
**Quando usar?** Factory sempre que o objeto tiver mais de dois campos ou aparecer em mais de dois testes.
**Exemplo:**

```ts
const makeTask = (over: Partial<NewTask> = {}): NewTask => ({
  title: 'Comprar pão', status: 'todo', term: null, ...over,
});

const res = await request(app).post('/tasks').send(makeTask({ status: 'done' }));
// o teste grita só o que importa: status
```

**Armadilhas:** factory que **assevera** (o seu `postTask` faz `expect(201)`) mistura preparo com verificação. Factory que devolve sempre o mesmo `title` esconde bug de unicidade; factory 100% aleatória (`faker`) dá teste que falha uma vez por mês e ninguém reproduz — o meio-termo é padrão fixo + campo único onde precisa (contador, `randomUUID`). Objeto de fixture **compartilhado e mutável** entre testes é veneno: devolva sempre um objeto novo (é por isso que factory é função, não `const`). E factory que insere no banco é outra coisa que factory que só monta o payload — nomeie diferente (`makeTask` × `createTask`).

## 5. `it.each`

**O que resolve?** Uma tabela de casos vira N testes independentes, cada um com nome próprio, em vez de um `for` dentro de um `it` (onde o primeiro `expect` que falha aborta o resto).
**Quando usar?** Mesma asserção, entradas diferentes — exatamente os seus 8 testes de "responde 400 em post com X inválido".
**Exemplo:**

```ts
it.each([
  ['body vazio',        {}],
  ['title não string',  { title: 42 }],
  ['chave desconhecida',{ banana: 'x' }],
  ['status inválido',   { status: 'Teste' }],
])('responde 400 em POST com %s', async (_label, body) => {
  const res = await request(app).post('/tasks').send(body);
  expect(res.status).toBe(400);
});
```

**Armadilhas:** a tabela vira dump — 40 linhas de caso e ninguém sabe qual regra cada uma prova; se o **motivo** do 400 muda por caso, o motivo tem que estar na tabela, não no corpo. Nome sem `%s`/`$campo` gera N testes com o mesmo nome e o relatório fica inútil. Objeto compartilhado dentro da tabela e mutado no teste contamina as outras linhas. E `it.each` **não** serve para casos que só se parecem por acidente: se o corpo precisa de `if`, são testes diferentes.

## 6. Dublês: mock, spy, stub

**O que resolve?** Substituir uma dependência que você não quer executar de verdade. **Spy** observa (envolve o original e registra chamadas), **stub** responde um valor combinado, **mock** faz as duas coisas e ainda serve de asserção ("foi chamado com isto").
**Quando usar?** Quando a dependência é lenta, cara, não determinística ou impossível de forçar ao erro: relógio, rede, e-mail, `pool.query` falhando com o banco fora do ar.
**Exemplo:**

```ts
const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
// ...act...
expect(spy).toHaveBeenCalledOnce();

vi.mock('./db.js', () => ({ queryDb: vi.fn().mockRejectedValue(new Error('ECONNREFUSED')) }));
```

**Armadilhas:** **mockar o banco na sua suíte de rotas destrói o valor dela** — o que você quer provar é justamente que a query certa roda no Postgres de verdade; mock ali só prova que o TypeScript compila. Mock sem restauração vaza para o arquivo inteiro: `vi.restoreAllMocks()` no `afterEach` (ou `restoreMocks: true` no config). `vi.mock` é **içado** para o topo do arquivo — a fábrica não enxerga variáveis declaradas depois (daí o `vi.hoisted`). Assertar "foi chamado com X" trava o **como** em vez do **o quê**: o teste passa a quebrar em refatoração que não muda comportamento. Regra prática: **mocke a borda que sai do seu processo, nunca o meio do seu próprio código.**

## 7. Tempo falso

**O que resolve?** `created_at`, timeout, expiração de token (Tema 8) — tudo que depende de "agora" é intestável com o relógio real. O fake timer congela o tempo e te deixa avançar por comando.
**Quando usar?** Teste que precisa de data previsível ou de esperar um intervalo sem esperar de verdade.
**Exemplo:**

```ts
vi.useFakeTimers();
vi.setSystemTime(new Date('2026-07-28T12:00:00Z'));
// ...act...
vi.advanceTimersByTime(60_000);
vi.useRealTimers();          // sempre desfazer
```

**Armadilhas:** esquecer `useRealTimers` deixa o próximo teste pendurado — `await` de coisa real nunca resolve com o relógio congelado. Fake timer **não altera o `now()` do Postgres**: o banco tem o relógio dele, e um teste que compara `created_at` do banco com `Date.now()` mockado quebra. Congelar o tempo com resolução de milissegundo faz duas linhas inseridas no "mesmo instante" empatarem no `ORDER BY created_at` — o desempate por `id` deixa de ser luxo. Alternativa que evita o problema todo: não asserte o valor, asserte o **formato**/a existência (`expect.any(String)`, `expect(new Date(x).getTime()).toBeGreaterThan(0)`).

## 8. Testar o tratador de erro

**O que resolve?** O middleware de erro centralizado é o único lugar por onde passa **toda** falha da API — e é o mais fácil de ficar sem teste, porque nenhuma rota feliz encosta nele.
**Quando usar?** Um teste por classe de saída: erro de domínio (`AppError` → status e corpo certos), erro inesperado (`throw new Error('boom')` → 500 genérico, sem vazar `stack` nem mensagem interna), erro assíncrono (Express 5 + `async`), 404 de rota e 405 de método.
**Exemplo:**

```ts
it('não vaza detalhe interno em erro inesperado', async () => {
  vi.spyOn(db, 'queryDb').mockRejectedValueOnce(new Error('senha do banco no texto'));
  const res = await request(app).get('/tasks');
  expect(res.status).toBe(500);
  expect(JSON.stringify(res.body)).not.toContain('senha');
});
```

**Armadilhas:** esta é a exceção legítima do tópico 6 — para forçar o 500 você **precisa** do dublê, porque não dá para derrubar o Postgres no meio da suíte. Testar o middleware chamando-o direto (`errorHandler(err, req, res, next)` com objetos falsos) prova menos do que parece: não passa pela ordem real dos middlewares, que é onde o bug mora. E o teste de 500 tem que checar o **corpo**, não só o status — o valor está em provar que a mensagem interna não vazou.

## 9. `.skip` / `.only` / `.todo`

**O que resolve?** `.only` isola um teste enquanto você depura; `.skip` desliga temporariamente; `.todo` registra um teste que falta escrever e aparece no relatório como pendência.
**Quando usar?** `.only` sempre em trânsito, nunca em commit. `.todo` para não perder a ideia do caso de borda que apareceu no meio do trabalho.
**Exemplo:**

```ts
it.todo('rejeita title com 10.000 caracteres');
it.skip('depende do endpoint de auth (Tema 8)', () => {});
```

**Armadilhas:** **`.only` commitado é o acidente clássico** — a suíte fica verde rodando 1 de 60 testes e o CI aprova tudo (por isso `--allowOnly=false` no CI, que é o padrão do `vitest run` em CI). `.only` é por **arquivo**: com vários arquivos, os outros continuam rodando e a falsa sensação é parcial. `.skip` sem comentário do porquê é lixo permanente; `.skip` que ninguém revisita é pior que teste deletado, porque parece cobertura. `.todo` com corpo é ignorado silenciosamente.

## 10. Snapshot testing

**O que resolve?** Grava a saída inteira num arquivo `.snap` e compara nas próximas rodadas. Bom para estrutura grande e estável.
**Quando usar?** Pouquíssimo numa API: no máximo o **formato do corpo de erro**, que você quer travar contra mudança acidental. `toMatchInlineSnapshot` mantém o valor no próprio teste e é mais honesto.
**Exemplo:**

```ts
expect(res.body).toMatchInlineSnapshot(`{ "errors": [ { "field": "id", "message": "Not Found" } ] }`);
```

**Armadilhas:** snapshot com dado volátil (`id` UUID, `created_at`) quebra a cada rodada. `vitest -u` vira reflexo: você atualiza o snapshot sem ler o diff e o teste passa a documentar o bug. Snapshot **não diz o que deveria ser**, só o que era — quem lê não aprende a regra. Snapshot gigante ninguém revisa em PR. Prefira asserção explícita do que importa (`toMatchObject`) quase sempre.

## 11. Cobertura

**O que resolve?** Mede **quais linhas/branches foram executadas** pela suíte. Serve para achar o que ninguém testou — o arquivo com 0%, o `catch` nunca exercitado.
**Quando usar?** Como mapa de buracos, e no Tema 10 como número no CI.
**Exemplo:**

```bash
npx vitest run --coverage        # provider v8; precisa de @vitest/coverage-v8
```

Ler as quatro colunas: `% Stmts` (linhas), `% Branch` (caminhos do `if`/`??`/`&&`), `% Funcs`, `% Lines`, e a coluna final **`Uncovered Line #s`** — é essa que vale.
**Armadilhas:** **cobertura mede execução, não verificação**: um teste sem nenhum `expect` que só chama a função dá 100%. Perseguir 100% produz teste de getter e teste de `server.ts`; o alvo útil é o **branch** não coberto que representa uma regra real. `% Branch` é sempre menor que `% Stmts` e é a coluna que denuncia caso de borda esquecido. Arquivo nunca importado **não aparece** no relatório se você não configurar `coverage.all` — o 0% mais perigoso é o invisível. E cobertura de arquivo de teste, `dist/` e config tem que ser excluída, senão o número é ficção.

## 12. TDD

**O que resolve?** Escrever o teste **antes**: vermelho (o teste falha pelo motivo certo) → verde (o mínimo para passar) → refatorar (com a rede montada). O ganho real é de **desenho**: código difícil de testar é código com dependência escondida.
**Quando usar?** Regra de negócio nova com contrato claro — e no Tema 6, quando a lógica sair da rota para o serviço, é onde TDD fica natural.
**Exemplo:** ciclo curto — `it('rejeita title só com espaços')` → roda e vê **falhar** → implementa o `btrim` → verde → limpa.
**Armadilhas:** pular o vermelho é o erro que anula o método: teste que nunca falhou pode estar testando nada (asserção invertida, `expect` que nunca roda dentro de um `catch`). TDD não substitui pensar no desenho, e para exploração ("como é mesmo a API do `pg`?") ele atrapalha — explore, depois teste. Aplicar TDD retroativamente ao Tema 4 inteiro não é TDD, é escrever teste — e escrever teste depois é legítimo, só não chame de TDD.

## 13. O que NÃO testar

**O que resolve?** Suíte é custo: cada teste é código para manter, e teste ruim trava refatoração. Não se testa **biblioteca de terceiros** (que o Express roteia, que o `pg` conecta), **tipo que o TS já garante** em código interno, **getter/setter trivial**, **detalhe de implementação** (nome de função privada, quantas queries rodaram) e **configuração**.
**Quando usar?** Como filtro antes de escrever: *este teste quebraria se o comportamento visível mudasse — ou só se o código interno mudasse?* Se for o segundo, não escreva.
**Exemplo:** não testar `isNewTask` **e** o 400 da rota com a mesma tabela de entradas inválidas — o unitário cobre a regra em detalhe, a rota cobre que a regra está **ligada** ali (um caso basta).
**Armadilhas:** o oposto também é armadilha: "não testo porque é óbvio" costuma cobrir o `catch` do banco e o formato de erro, que são exatamente os que quebram em produção. Teste que espelha a implementação linha a linha (mesmo `if`, mesma ordem) só duplica o bug. E o critério final não é o rótulo, é: **quando este teste ficar vermelho, o que ele vai ter me contado?**

## 14. Property-based

**O que resolve?** Em vez de N exemplos escolhidos por você, a ferramenta gera centenas de entradas aleatórias e verifica uma **propriedade** que deve valer sempre — e, ao falhar, **encolhe** (shrink) o contraexemplo até o menor caso que ainda quebra.
**Quando usar?** Validador e função pura com espaço de entrada grande: "`isNewTask` nunca lança, para qualquer entrada"; "todo `title` que passa na validação volta idêntico do banco".
**Exemplo (com `fast-check`, opcional neste tema):**

```ts
fc.assert(fc.property(fc.anything(), (input) => {
  expect(() => isNewTask(input)).not.toThrow();     // propriedade: nunca explode
}));
```

**Armadilhas:** a propriedade errada é fácil de escrever — reimplementar a função dentro do teste ("oráculo espelho") só duplica o bug. Sem `seed` fixo, a falha é irreprodutível; anote o seed que a ferramenta imprime. Teste aleatório contra **banco** é lento e polui dados. E é a última prioridade deste tema: só depois que fixtures, isolamento e cobertura estiverem de pé.

## 15. Testes contra banco: banco de teste, limpeza e isolamento

**O que resolve?** Teste de integração precisa de um banco **descartável e determinístico**: mesmo schema do dev, dados zerados a cada teste, e que rodar duas vezes seguidas dê o mesmo resultado.
**Quando usar?** É o coração deste tema — sua suíte já bate no Postgres desde o T4, mas com o mínimo improvisado.

**As três decisões:**

1. **Onde:** banco separado (`tasks_test`, já criado) com o schema aplicado por script — nunca o `tasks_dev`. O alvo precisa ser **provado** em runtime, não presumido: uma checagem que aborta a suíte se `PGDATABASE` não for o de teste custa 3 linhas e evita o dia em que você trunca o banco de desenvolvimento.
2. **Como limpar:** `TRUNCATE tasks RESTART IDENTITY CASCADE` no `beforeEach` (mais rápido que `DELETE` e reseta a sequência) ou cada teste dentro de uma transação com `ROLLBACK` no fim (mais rápido ainda, mas exige que a rota use **a mesma conexão** do teste — e com pool ela não usa; por isso, aqui, `TRUNCATE` é a escolha honesta).
3. **Paralelismo:** o Vitest roda **arquivos** de teste em paralelo, cada um no seu worker. Um `TRUNCATE` no arquivo A apaga as linhas que o arquivo B acabou de inserir. Enquanto for um arquivo só, você não vê o problema — e este tema vai **quebrar a suíte em vários arquivos**, então a hora de decidir é agora: serializar (`fileParallelism: false` / `poolOptions.forks.singleFork`) ou isolar por worker (banco/schema por `VITEST_POOL_ID`). Serializar é mais simples e correto; isolar é mais rápido e mais trabalhoso. Escolha uma e **defenda a escolha**.

**Exemplo:**

```ts
// vitest.config.ts — globalSetup roda uma vez, antes de tudo
export default defineConfig({
  test: { globalSetup: ['./test/global-setup.ts'], setupFiles: ['./test/setup.ts'] },
});
```

**Armadilhas:** `pool.end()` no `afterAll` de **cada** arquivo com pool compartilhado fecha o pool para os outros (`Cannot use a pool after calling end`) — pool aberto, por outro lado, segura o processo e o Vitest reclama de handle vazando. Aplicar o schema dentro do `beforeEach` transforma 1s de suíte em 30s. Teste que depende de dado deixado pelo teste anterior passa na ordem atual e quebra quando você reordena — o sintoma é "passa sozinho, falha na suíte" (ou o contrário). `RESTART IDENTITY` não faz diferença no seu caso, já que o `id` é UUID gerado — mas o dia que houver `serial`, faz. E o `.env` do dev carregado dentro do teste pode apontar o pool para `tasks_dev` sem avisar: quem ganha, a variável do script ou a do arquivo, é coisa que você **testa**, não supõe.

---

# Parte B — Aplicação na `api/`

### 1. Preparação do ambiente

Só isto é mastigado; o resto é seu.

```bash
cd etapas/etapa-2/api
npm i -D @vitest/coverage-v8          # cobertura (tópico 11)
npm i -D fast-check                   # opcional, só se for fazer o tópico 14
```

O banco de teste (`tasks_test`) e o `npm run db:schema` já existem do Tema 4 — nada de novo aqui além de lembrar do `sudo service postgresql start` a cada sessão do WSL.

Esqueleto de config, para você preencher (hoje **não existe `vitest.config.ts`** na `api/` — a suíte roda no default):

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // globalSetup: [...]      // uma vez por rodada: schema
    // setupFiles: [...]       // uma vez por arquivo: hooks comuns
    // restoreMocks: true,
    // coverage: { provider: 'v8', exclude: [...] },
    // fileParallelism / poolOptions  ← a decisão do tópico 15
  },
});
```

Referência das opções: `vitest.dev/config`. Qual delas você usa e por quê é escolha sua.

### 2. Os blocos

#### Bloco 1 — obrigatório

Está em ordem de dependência: os três primeiros são infraestrutura e têm que vir **antes** de dividir a suíte.

- **Infra de teste em um lugar só:** aplicar schema, limpar tabela, abrir/fechar pool. Hoje isso está solto no topo do `app.test.ts` (`process.loadEnvFile('.env')`, `DELETE FROM tasks`, `pool.end()`) e não sobrevive ao segundo arquivo de teste — o `pool.end()` do primeiro arquivo a terminar derruba o pool dos outros. Resolva antes de dividir.
- **Guarda do banco alvo:** a suíte aborta se `PGDATABASE` não for `tasks_test`. Prove que a guarda funciona (rode uma vez apontando para o dev e veja falhar).
- **`TRUNCATE` no lugar do `DELETE FROM tasks`**, e a decisão de paralelismo do tópico 15 tomada explicitamente.
- **A suíte sai de um arquivo só.** Hoje `src/app.test.ts` tem 300 linhas misturando teste de função pura, teste de rota e teste de erro. Separe por natureza (unitário × integração) e por assunto, com um lugar óbvio para o próximo teste cair. Onde os arquivos moram (`src/` ao lado do código × `test/`) é decisão sua — registre no `api/README.md`.
- **Factories** substituindo os literais repetidos e o `postTask()` que asserta: `makeTask(over)` monta payload, `createTask(over)` insere e devolve. Os UUIDs escritos à mão nos testes de PATCH (`75316765-...`) viram `randomUUID()` — hoje eles funcionam por acaso.
- **`it.each`** nos blocos de 400 do POST e do PATCH, com o motivo do erro na tabela.
- **`vitest run` volta à mesa.** Na revisão do T4 você adiou isso pro T10; este é o tema de testes, então a decisão se revisita aqui: o script `test` atual roda em watch e nunca termina. Se mantiver o adiamento, o motivo fica escrito — mas cobertura e "verde duas vezes seguidas" pedem uma passada que encerra.
- **Testes do tratador de erro** que hoje não existem: 500 sem vazar detalhe interno, e o caminho de erro assíncrono do Express 5. Aqui o dublê é legítimo (tópico 8).
- **Cobertura medida e lida:** rode, olhe a coluna `Uncovered Line #s`, e **escolha** o que vale cobrir — parte das linhas descobertas não deve virar teste (tópico 13). Registre no devlog o número e o que você decidiu ignorar.
- **`api/README.md`** atualizado: como rodar a suíte, o que é banco de teste, a decisão de paralelismo, o número de cobertura.

**Critérios de aceite do Bloco 1** — é por esta lista que a Parte C confere se a API migrou para o assunto do tema:

- A suíte fica verde **duas vezes seguidas** sem limpeza manual, e existe um jeito de rodá-la em uma passada que encerra (`vitest run`) — script próprio ou decisão registrada de deixar pro T10.
- A suíte está em mais de um arquivo e continua verde — inclusive rodando **um arquivo só** (`npx vitest run src/<arquivo>`).
- Apontar a suíte para `tasks_dev` **falha imediatamente**, com mensagem clara, sem tocar em nenhuma linha.
- Nenhum literal de task repetido: todo dado de teste sai de factory.
- Os blocos de 400 do POST e do PATCH viraram tabela, e cada linha nomeia a regra que prova.
- Existe teste que prova que um erro inesperado vira 500 sem vazar mensagem interna.
- `npx vitest run --coverage` roda e o relatório exclui `dist/`, config e os próprios testes.
- Zero `.only` no commit. Todo `.skip` tem motivo escrito ao lado.
- `api/README.md` atualizado e commits `t05: ...` no push.

#### Bloco 2 — sugestões (médio/avançado)

Nada aqui trava o fechamento do tema. Ordem sugerida de valor:

- **Tempo falso** (tópico 7) num teste que hoje não existe: congelar o relógio e provar que o `created_at` que você asserta é o do **Postgres**, não o do Node — a armadilha está descrita na Parte A.
- **`toMatchInlineSnapshot` no corpo de erro** (tópico 10), e só nele: trava o formato `{ errors: [{ field, message }] }` contra mudança acidental — que é justamente o formato que o front em `../etapa-3/web/` consome.
- **Um ciclo de TDD de verdade** (tópico 12), vermelho primeiro, numa regra pequena que ainda não existe (`title` só com espaços, por exemplo). Aqui é ensaio; no Tema 6, quando a lógica sair da rota para o serviço, vira o modo natural de trabalhar.
- **Property-based com `fast-check`** (tópico 14): `isNewTask` nunca lança, para qualquer entrada. Última prioridade do tema — só depois que fixtures, isolamento e cobertura estiverem de pé, e anote o `seed`.
- **Isolar por worker em vez de serializar** (tópico 15): banco ou schema por `VITEST_POOL_ID`. Mais rápido e mais trabalhoso — só encare se serializar já estiver funcionando e você quiser o ganho.
- **Limiar de cobertura no config** (`coverage.thresholds`) para a suíte falhar quando o número cair. É o gancho do Tema 10 (CI); pôr agora é adiantar trabalho, não requisito.

### 3. Aguardar execução

Você constrói, ponta a ponta. Eu fico quieto. Se travar, a pergunta é sua e eu respondo o conceito.

### 4. Revisão do código

Me chama no fim; eu leio a suíte inteira e aponto de forma simples onde estão os erros e o que faltou, pra você corrigir. O que cair aqui vira linha marcada com ⚠️ no devlog — e essa lista é a ordem de ataque do simulado (regra 8).

---

# Parte C — Revisão do código

> As três verificações, e só elas. O tema **não fecha** com nenhuma delas em aberto — e nenhuma pergunta trava o fechamento (regra 8).

1. **A API migrou para o assunto do tema?** Confira contra os *Critérios de aceite do Bloco 1*: infra centralizada, guarda do banco, `TRUNCATE`, suíte em mais de um arquivo, factories, `it.each`, teste do 500 e cobertura rodando.
2. **`npm run typecheck` limpo?**
3. **Testes verdes?** — e neste tema a barra é mais alta que "passou": verde **duas vezes seguidas**, sem limpeza manual, e verde também rodando **um arquivo isolado**.

Fechando: `api/README.md` atualizado, `plano.md` e README da raiz marcados, commits `t05: ...` no push conferido.

---

# Apêndice — banco de perguntas (insumo do simulado)

> **Isto não é a Parte C.** Era o questionário do formato antigo; pela regra 8 a defesa oral acontece **uma vez, no fim da etapa**, no simulado de entrevista depois do Tema 10 — falado, curto, com contra-argumento em cima. Estas 35 perguntas ficam aqui como a munição do Tema 5 para aquele dia, com prioridade para o que estiver marcado com ⚠️ no devlog. Nenhuma delas precisa ser respondida agora, e nenhuma delas segura o fechamento do tema.

1. Unitário, integração e e2e: dê um exemplo de cada **na sua API**. Por que `supertest(app)` não é e2e?
2. Qual pergunta você faz para decidir em que andar um teste novo mora?
3. O que o AAA te dá na hora que um teste fica vermelho?
4. Seu `postTask()` fazia `expect(201)` dentro do preparo. Qual é o problema disso e como você resolveu?
5. Por que limpeza defensiva vai no `beforeEach` e não no `afterEach`?
6. O que muda entre `beforeAll` e `beforeEach` no custo da suíte? O que você pôs em cada um e por quê?
7. Fixture × factory: qual a diferença, e por que factory é função e não constante?
8. Por que os UUIDs escritos à mão nos testes de PATCH eram frágeis?
9. O que `it.each` resolve que um `for` dentro de um `it` não resolve?
10. Quando `it.each` é a ferramenta errada?
11. Spy, stub e mock: diferencie em uma linha cada.
12. Por que mockar `queryDb` na suíte de rotas destruiria o valor dela — e por que no teste do 500 ele é obrigatório?
13. "Mocke a borda que sai do seu processo, nunca o meio do seu próprio código." O que isso significa na sua API?
14. Que sintoma aparece quando um mock não é restaurado entre testes?
15. Por que `vi.useFakeTimers()` não muda o `now()` do Postgres? Que teste isso invalida?
16. Como testar o formato do corpo de erro sem depender de `id` e data?
17. Que classes de erro passam pelo seu middleware central, e qual delas não tinha teste antes deste tema?
18. Por que testar o middleware de erro chamando-o direto prova menos do que ir pela rota?
19. Por que `.only` commitado é pior que um teste faltando?
20. `.skip` sem comentário: por que é pior que deletar o teste?
21. Em que caso (se algum) snapshot vale a pena na sua API? Por que `vitest -u` é perigoso?
22. Cobertura mede o quê exatamente — e o que ela **não** mede?
23. Por que `% Branch` costuma ser menor que `% Stmts`, e por que é a coluna mais útil?
24. Qual foi o seu número de cobertura, e cite uma linha descoberta que você decidiu **não** testar. Justifique.
25. Descreva o ciclo do TDD. O que se perde ao pular o passo vermelho?
26. Cite três coisas que você deliberadamente não testa na sua API, e o motivo de cada uma.
27. Você testa a mesma regra no validador (unitário) e na rota (integração). Isso é duplicação ruim? Por quê?
28. O que property-based faz que uma tabela de `it.each` não faz? Por que o `seed` importa?
29. Como você garante que a suíte nunca roda contra `tasks_dev`? Como você **provou** isso?
30. `TRUNCATE` × `DELETE` × transação com `ROLLBACK`: o que você escolheu para limpar entre testes e por quê?
31. O Vitest roda arquivos em paralelo. Que bug isso causaria na sua suíte no momento em que ela virou mais de um arquivo? Como você resolveu?
32. Por que `pool.end()` no `afterAll` de cada arquivo quebra quando existe mais de um arquivo de teste?
33. `vitest` × `vitest run`: por que o script em watch atrapalha cobertura e CI? O que você decidiu e por quê?
34. Um teste que "passa sozinho e falha na suíte" está dizendo o quê sobre o seu isolamento?
35. **(fecho)** Qual teste da sua suíte tem mais chance de quebrar por refatoração sem que nada esteja errado? O que ficou mal resolvido para o Tema 6 (camadas) arrumar?
