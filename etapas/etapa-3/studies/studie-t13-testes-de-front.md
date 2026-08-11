# Estudo — Testes de front (Tema 13)

> **Tema solo.** Depois de quatro mesclas seguidas, este não mescla com nada: o T14 (motion) tem material próprio e, mais importante, **a suíte precisa existir antes do movimento** para que o T14 seja cobrado por ela. Um tema que testa o que o outro vai mexer só funciona nessa ordem.

> **O tema, em uma frase:** até aqui a prova de que o app funciona foi você clicando; a partir daqui é um comando que roda em segundos e reclama sozinho.

**Onde o app está antes deste tema.** Zero testes. `package.json` não tem `vitest`, não existe `npm test`, e a limitação está escrita no `web/README.md` com todas as letras: _"Sem testes. Testes de front são o Tema 13; até lá a verificação é manual, pelas provas registradas no devlog."_ Doze temas de verificação a olho, e a lista de provas de cada tema anterior é exatamente a suíte que nunca foi escrita — releia o Bloco 1 do T11/T12: "duplo clique manda um `PATCH`", "`PATCH` em tarefa apagada por fora vira aviso", "rollback devolve a tarefa para a coluna anterior". Cada um daqueles bullets é um `it(...)`.

**O que o T11 deixou pronto sem que fosse o objetivo dele.** O `tasksReducer` é função pura: entra estado e action, sai estado, sem React no meio. Dá para testar as cinco transições sem renderizar um pixel. E o `useTasks` tirou `AbortController`, `ApiError` e `fetch` de dentro da página — a `TasksPage` hoje só decide o que pintar, que é a única coisa que um teste de componente sabe verificar.

**A mudança de eixo.** As perguntas dos temas anteriores foram "o que o app faz" e "quem é dono do estado". A deste é outra: **como eu provo, sem abrir o navegador, que continua funcionando?** E a resposta tem um custo que o tema inteiro persegue — teste que quebra quando você renomeia uma classe CSS é pior que teste nenhum, porque ele cobra manutenção sem dar segurança.

**Decisões tomadas na abertura**

1. **jsdom, não o Browser Mode do Vitest.** A escolha foi minha, porque não havia material para você decidir — você não conhecia nenhum dos dois. jsdom é DOM simulado em Node: instala um pacote, roda em segundos, é o que a documentação da Testing Library assume e é o que aparece em 90% dos projetos que você vai encontrar. O Browser Mode roda em Chromium de verdade (mais fiel em foco, layout e eventos), mas instala Playwright, é mais lento e tem menos material. **A limitação do jsdom é conteúdo do tema, não um detalhe escondido:** ele não implementa `window.confirm`, não tem `matchMedia`, não faz layout — e você vai esbarrar nos três (tópico 2).
2. **O escopo obrigatório é o caminho crítico** (escolha sua): o `tasksReducer` puro, os quatro estados da `TasksPage` com MSW, criar tarefa ponta a ponta e o erro que ninguém testa. **Não** é "um teste por componente" — o tópico 13 diz por quê.
3. **MSW, não mock de `fetch`.** Já estava no plano (tópico 8) e continua: substituir `fetch` por `vi.fn()` testaria o seu `request<T>`, não o app. MSW intercepta na borda da rede — o `http.ts` roda de verdade, incluindo o ramo do `204` e a tradução de `ApiError`.

---

# Parte A — Os tópicos

### 1. Testar interface é testar comportamento visível

**O que é.** A regra que decide tudo o que vem depois: o teste interage com a tela como uma pessoa (acha um botão pelo texto, clica, procura o resultado) e **nunca** olha para dentro do componente — nada de estado, nada de nome de prop, nada de "o `useTasks` foi chamado".

**Para que serve.** Substitui a verificação manual **sem** substituir a confiança por uma nova dívida. O critério prático é uma pergunta: _se eu refatorar o app inteiro sem mudar a tela, meus testes continuam passando?_ No T11 você trocou `useState` por `useReducer` e a `TasksPage` caiu de 215 para 86 linhas — a tela ficou idêntica. **Um bom teste de front não teria mudado uma linha nessa refatoração.** Um teste ruim (que olhasse `state.tasks` ou o número de renders) teria quebrado inteiro, e você teria passado a tarde consertando teste em vez de código.

**Exemplo — a mesma verificação, das duas formas:**

```tsx
// ❌ implementação: quebra na refatoração, não pega bug nenhum
expect(result.current.state.tasks).toHaveLength(3);

// ✅ comportamento: sobrevive a qualquer refatoração que não mude a tela
expect(await screen.findByRole('heading', { name: 'Comprar pão' })).toBeVisible();
```

### 2. Vitest no front: `jsdom`, `setupFiles`, e o que o navegador simulado não é

**O que é.** O mesmo Vitest da Etapa 2, com três diferenças de configuração:

| Chave | O que faz |
| --- | --- |
| `environment: 'jsdom'` | cria `window`, `document`, `localStorage` — um DOM em memória, sem navegador |
| `setupFiles` | um arquivo que roda **antes de cada suíte**: registra matchers, liga o MSW, limpa o DOM |
| `css: false` (padrão) | o Tailwind **não** é processado; classe é string, e é por isso que testar classe é inútil (tópico 13) |

**Para que serve.** Rodar teste de componente em milissegundos, sem abrir Chrome. O preço é saber onde a simulação acaba — e isso não é teoria, são três coisas que este app usa hoje:

- **`window.confirm` não existe de verdade.** O jsdom loga "Not implemented" e devolve `undefined` (ou seja: falso). O `handleDeleteTask` da `TasksPage` faz `if (!window.confirm(...)) return` — sem mock, **o teste de apagar nunca chega a apagar** e você vai passar meia hora achando que o `DELETE` está quebrado.
- **Não há layout.** Tudo tem largura e altura zero. `IntersectionObserver`, `scrollIntoView` e `getBoundingClientRect` são nada — anote isto para o T14: **animação não se testa em jsdom**, e o tópico 11 é sobre o que fazer em vez disso.
- **Não há `matchMedia`.** O `prefers-reduced-motion` do T14 tópico 13 precisa de um stub no `setup.ts`.

**Exemplo — a cura do primeiro caso, e ela é uma linha:**

```ts
vi.spyOn(window, 'confirm').mockReturnValue(true);
```

### 3. Testing Library: `render`, `screen`, e "consulte como o usuário consulta"

**O que é.** Três peças: `render(<Componente />)` monta no DOM do jsdom, `screen` é o objeto por onde você procura elementos, e `cleanup` (automático no Vitest) desmonta entre os testes.

**Para que serve.** Ela **não** é um framework de teste — é uma camada de busca que te empurra para o tópico 1 por construção. Repare no que a API **não** tem: não existe `getByClassName`, não existe `getByComponent`, não existe `wrapper.state()`. O que ela não oferece é a metade do valor dela.

**Exemplo — o formato de todo teste desta suíte:**

```tsx
render(<TasksPage />);                                  // arranjo
await user.click(screen.getByRole('button', { name: 'Adicionar' }));  // ação
expect(await screen.findByRole('alert')).toHaveTextContent('Título obrigatório'); // asserção
```

É o mesmo **AAA** do T5 da Etapa 2, com "arranjo" virando `render` e "ação" virando um clique.

### 4. Prioridade de queries: `getByRole` primeiro, `getByTestId` com culpa

**O que é.** A ordem recomendada, e ela não é gosto — é o quanto cada query se parece com a forma como uma pessoa (ou um leitor de tela) acha a coisa:

1. `getByRole` — papel + nome acessível. **O primeiro por larga margem.**
2. `getByLabelText` — campos de formulário.
3. `getByPlaceholderText`, `getByText` — quando não há papel nem label.
4. `getByTestId` — quando nada mais funciona, e isso é um sintoma.

**Para que serve.** É onde o **T3 paga dividendo**, e dá para ver isso arquivo por arquivo neste app:

- `Typography variant="titleTask"` renderiza `<h2>` → `getByRole('heading', { name: 'Carregando suas tarefas' })`.
- `ItemTask` tem `aria-label={\`Alterar status de ${task.title}\`}` → `getByRole('button', { name: 'Alterar status de Comprar pão' })` acha **o botão daquela linha**, não os três da tela.
- `TaskField` amarra `label htmlFor={id}` ao `input id={id}` via `useId` (T11) → `getByLabelText('Tarefa')`.
- `ErrorTasks` e o `<p role="alert">` do erro de campo → `getByRole('alert')`.
- `Toast` tem `role="status"` → `getByRole('status')`.

**Exemplo — o mesmo `aria-label` servindo duas causas:**

```tsx
// no app, escrito no T3 por acessibilidade:
<Button aria-label={`Excluir task de ${task.title}`}>X</Button>

// no teste, de graça:
await user.click(screen.getByRole('button', { name: 'Excluir task de Comprar pão' }));
```

Sem o `aria-label`, o nome acessível daquele botão é `"X"` — e três tarefas na tela dariam três botões chamados `X`, com o teste tendo que escolher pelo índice. **Teste difícil de escrever é quase sempre denúncia de acessibilidade ruim**, e essa é a frase do tópico 12 do T3 se cumprindo.

### 5. `getBy` × `queryBy` × `findBy`

**O que é.** Três prefixos, três comportamentos quando o elemento **não** está lá:

| Prefixo | Não achou | Assíncrono? | Para que |
| --- | --- | --- | --- |
| `getBy` | **estoura** na hora | não | "isto tem que estar aqui agora" |
| `queryBy` | devolve `null` | não | "isto **não** pode estar aqui" |
| `findBy` | estoura depois do timeout | **sim** (Promise) | "isto vai aparecer daqui a pouco" |

**Para que serve.** Evitar os dois erros clássicos. O primeiro: usar `getBy` para provar ausência — `expect(() => getBy(...)).toThrow()` é feio e mente quando a query está errada. O segundo, e é o que mais vai te pegar: usar `getBy` logo depois de um clique que dispara requisição — o dado ainda não chegou, e o teste falha por motivo errado.

**Exemplo — os três no mesmo fluxo deste app:**

```tsx
expect(screen.getByRole('heading', { name: 'Carregando suas tarefas' })).toBeVisible(); // agora
expect(await screen.findByRole('heading', { name: 'Comprar pão' })).toBeVisible();       // depois do fetch
expect(screen.queryByRole('heading', { name: 'Carregando suas tarefas' })).toBeNull();   // sumiu
```

### 6. `user-event` × `fireEvent`

**O que é.** Dois jeitos de interagir. `fireEvent.click(el)` dispara **um** evento. `userEvent.click(el)` simula a **sequência inteira** que uma pessoa produz: `pointerdown`, `mousedown`, `focus`, `pointerup`, `mouseup`, `click`.

**Para que serve.** A diferença aparece exatamente onde este app mora. O `InputTask` abre os campos de status e prazo com `onFocus` — `fireEvent.click` no input **não dispara foco**, então status e prazo nunca aparecem e o teste de criar tarefa completa é impossível de escrever. Com `userEvent.click`, o foco vem junto e o formulário expande como expande no navegador.

E `userEvent.type` digita **tecla por tecla**, disparando um `onChange` por caractere — que é o que valida de verdade um campo controlado (T5) e o que faria um `useDebounce` na busca ser testável.

**Exemplo — o setup obrigatório, que quase todo mundo esquece:**

```tsx
const user = userEvent.setup(); // ← uma vez por teste, ANTES do render
await user.type(screen.getByLabelText('Tarefa'), 'Comprar pão');
await user.click(screen.getByRole('button', { name: 'Adicionar' }));
```

Tudo é `await`. Esquecer um `await` num `user-event` é a causa nº 1 de teste que passa sozinho e falha na suíte cheia.

### 7. Testar assíncrono sem `sleep`

**O que é.** Duas ferramentas e uma proibição. `findBy*` espera **o elemento** aparecer; `waitFor(() => expect(...))` espera **uma asserção** passar. `await new Promise(r => setTimeout(r, 500))` é proibido.

**Para que serve.** `sleep` fixo é o pior dos dois mundos: lento quando a resposta chega em 5 ms e instável quando a máquina está ocupada. `findBy` e `waitFor` fazem *polling* — passam assim que der certo, e só falham depois do timeout.

**Exemplo — as duas formas, e quando cada uma:**

```tsx
// o elemento aparece → findBy
expect(await screen.findByRole('status')).toHaveTextContent('Esta tarefa não existe mais.');

// nada aparece, algo tem que ter acontecido → waitFor
await waitFor(() => expect(patchCalls).toBe(1));
```

**A regra que segura o resto:** nunca coloque um `expect` que já está satisfeito dentro de `waitFor` — ele passa no primeiro poll e não espera nada, e você fica com a ilusão de ter esperado.

### 8. MSW — interceptar na borda da rede

**O que é.** Uma biblioteca que registra um interceptador de rede: o seu código chama `fetch` normalmente, e o MSW responde no lugar do servidor, com o status e o corpo que **você** escreveu no handler.

**Para que serve.** É a alternativa a `vi.spyOn(globalThis, 'fetch')`, e a diferença é o que fica testado. Com `fetch` mockado, o `http.ts` inteiro é pulado: o `res.ok`, o `throw new ApiError(res.status, errorBody.errors)`, o ramo do `204`, o `AbortSignal.any` — nada disso roda, e são justamente as linhas onde os bugs do T7 estavam. Com MSW, **o seu código roda inteiro** e só o cabo de rede é falso.

Três handlers cobrem esta suíte: **sucesso**, **erro** (500 e 404) e **lentidão** (`await delay(...)` — é como o estado de carregando fica na tela tempo suficiente para ser visto).

**Exemplo — os handlers deste app (MSW v2):**

```ts
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('*/tasks', () => HttpResponse.json(tasksFixture)),

  http.post('*/tasks', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...body, id: crypto.randomUUID() }, { status: 201 });
  }),
];

// e, dentro de um teste, o handler que troca o cenário:
server.use(http.get('*/tasks', () => HttpResponse.json({ errors: [{ message: 'boom' }] }, { status: 500 })));
```

**O detalhe que vai te custar tempo se não souber agora:** o `BASE_URL` do `http.ts` vem de `import.meta.env.VITE_API_URL`. Em teste essa variável não existe, e a URL vira `"undefined/tasks"` — por isso os handlers usam `*/tasks`, ou você define a variável num `.env.test`. **Escolha uma das duas e escreva qual, no `web/README.md`.**

### 9. Testar os quatro estados de tela — inclusive o de erro

**O que é.** Os quatro estados do T7 (`loading`, `error`, `empty`, `success`) viram quatro testes da `TasksPage`, cada um com o seu handler.

**Para que serve.** É a espinha da suíte, e o de erro é o que ninguém escreve — porque no navegador é chato de provocar (você precisa derrubar a API no meio da sessão, que é literalmente um item da prova prática da avaliação). Com MSW, provocar erro é uma linha. **O teste torna barato exatamente o que era caro de verificar à mão.**

**Exemplo — o de vazio, que é o mais fácil de errar:**

```tsx
server.use(http.get('*/tasks', () => HttpResponse.json([])));
render(<TasksPage />);
expect(await screen.findByRole('heading', { name: /adiciona umas tarefinhas/i })).toBeVisible();
```

Note que "vazio" chega como **sucesso** — `{ status: 'success', tasks: [] }`. O teste prova que o app trata os dois de forma diferente, que é a decisão do T7 escrita no `web/README.md`.

**Um cuidado:** a `TasksPage` usa `useSearchParams` e `ItemTask` usa `<Link>` — os dois estouram fora de um roteador, e o `useTasks` estoura fora do `ToastProvider` (o hook guardião do T12 fazendo o trabalho dele). Renderizar a página crua não funciona; é para isso que existe o helper `renderWithProviders` do Bloco 1.

### 10. Testar formulário de ponta a ponta

**O que é.** O teste que mais se parece com uso real: digitar, enviar, ver a lista mudar. Três cenários, nesta ordem de valor: **sucesso**, **validação do cliente** (título vazio), **erro do servidor** (a API devolve 400).

**Para que serve.** Cobre de uma vez o T5 (controlado, erro por campo), o T8 (`POST` e a tela atualizando com a resposta) e o `aria-describedby` do T3 — três temas num teste. E é o teste que pega a regressão mais provável do T14: mexer no formulário para animá-lo.

**Exemplo — o fluxo completo, com o detalhe do `onFocus`:**

```tsx
const user = userEvent.setup();
renderWithProviders(<TasksPage />);

await user.click(screen.getByLabelText('Tarefa'));       // ← foco: é ele que expande o rodapé
await user.type(screen.getByLabelText('Tarefa'), 'Comprar pão');
await user.selectOptions(screen.getByLabelText('Status'), 'doing');
await user.click(screen.getByRole('button', { name: 'Adicionar' }));

expect(await screen.findByRole('button', { name: 'Comprar pão' })).toBeVisible();
expect(screen.getByLabelText('Tarefa')).toHaveValue('');  // limpou depois do sucesso (T5, tópico 9)
```

**O que o teste de validação prova, e é uma linha do T5:** com o título vazio, aparece `role="alert"` **e** nenhuma requisição sai. A segunda metade é a que importa — validação no cliente que deixa a requisição passar não é validação, é decoração.

### 11. Testar componente que anima

**O que é.** A regra escrita **antes** de existir animação, para o T14 nascer obedecendo: **nenhum teste pode depender de a animação ter terminado.** Nada anima hoje; a regra nasce aqui e é cobrada lá.

**Para que serve.** Porque em jsdom animação **não acontece**: não há layout, não há `requestAnimationFrame` de verdade rodando contra um relógio de tela, e `transition` de CSS não é processado. Se um teste espera o item sumir "depois da animação de saída", ele vai esperar até o timeout e falhar — e a reação errada é adicionar `sleep`.

**As três saídas, em ordem de preferência:**

1. Testar o **estado final** com `findBy`/`waitFor` — o elemento sai do DOM, a duração é irrelevante.
2. `vi.useFakeTimers()` para adiantar o relógio quando houver timer de verdade (é o caso **hoje**: o `Toast` some sozinho em 4 s pelo `setTimeout` do `ToastProvider`).
3. Desligar o movimento no ambiente de teste (a lib de motion do T14 tem essa chave; `prefers-reduced-motion` do tópico 13 do T14 é a mesma porta).

**Exemplo — fake timers com `user-event`, que tem uma pegadinha:**

```tsx
vi.useFakeTimers();
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }); // ← sem isto, trava
// … dispara um aviso …
act(() => vi.advanceTimersByTime(4000));
expect(screen.getByRole('status')).toBeEmptyDOMElement();
```

Sem o `advanceTimers`, o `user-event` espera timers reais que ninguém vai adiantar, e o teste congela até o timeout.

### 12. Testar custom hook isoladamente

**O que é.** `renderHook(() => useTasks())` da Testing Library monta o hook dentro de um componente de mentira e devolve `result.current`.

**Para que serve.** Existe e é útil — para hook **genérico e reutilizável**, que não tem uma tela óbvia (`useDebounce`, `useLocalStorage`). Para o `useTasks`, **não**: ele existe para servir uma página só, e testá-lo por fora é testar implementação (tópico 1) — você acabaria afirmando `result.current.state.tasks`, que é exatamente o exemplo ❌ do primeiro tópico.

**A régua:** teste pelo componente sempre que houver um componente óbvio. `renderHook` quando o hook é a unidade de verdade.

**Exemplo — o que este app testa em cada nível:**

```
tasksReducer   → teste puro, sem render nenhum   ← é aqui que a lógica da lista se prova
useTasks       → pela TasksPage, com MSW
TasksPage      → os quatro estados + os fluxos
```

O `tasksReducer` é o presente do T11: função pura, cinco actions, e a guarda `state.status !== 'success'` num lugar só. Testá-lo custa cinco `it` de três linhas e cobre o coração do app. **Só falta uma coisa: ele não está exportado** — hoje é `const tasksReducer` privado dentro do `useTasks.ts`.

### 13. O que **não** testar no front

**O que é.** A lista das coisas que só geram manutenção:

| Não teste | Por quê |
| --- | --- |
| Cor, classe de CSS, estilo | com `css: false` a classe é uma string; e mudar de `bg-amber-100` para `bg-amber-200` não é regressão |
| Ordem de chamada interna | "o `dispatch` foi chamado com `created`" é implementação (tópico 1) |
| Biblioteca de terceiro | o React Router e o Tailwind têm os testes deles |
| Componente trivial | `Card`, `Typography` — sem lógica, sem condição, nada a quebrar |
| Detalhe de texto solto | mudar "Que tal iniciar essas?" não pode quebrar a suíte; use regex ou role + nome |

**Para que serve.** É o freio da opção "amplo, todo componente" que você recusou na abertura. Uma suíte que testa `Typography` custa manutenção em cada troca de layout e nunca pegou um bug — e o efeito colateral é pior que o custo: as pessoas param de confiar nos testes e começam a "consertar o teste" em vez de olhar o código.

**Exemplo — a mesma verificação, errada e certa:**

```tsx
// ❌ acopla à decisão de estilo
expect(item).toHaveClass('bg-amber-100');

// ✅ acopla ao comportamento
expect(screen.getByRole('button', { name: 'Adicionar' })).toBeDisabled();
```

### 14. Cobertura no front — por que o número mente mais aqui

**O que é.** `vitest --coverage` mede quantas linhas foram **executadas** durante os testes. Não mede se você verificou alguma coisa.

**Para que serve.** Saber ler o relatório em vez de perseguir a porcentagem. No front a distorção é maior que no back por um motivo mecânico: **renderizar um componente executa quase todas as linhas dele.** Um `render(<TasksPage />)` sem nenhum `expect` marca dezenas de linhas como cobertas — e todo o JSX conta como linha. Dá para chegar a 80% sem provar nada.

**Como usar mesmo assim:** de trás para a frente, procurando o **vermelho**. Um ramo `catch` nunca executado é uma pergunta de verdade: "eu testei o caminho de erro?". No `useTasks` há três ramos que só existem para dar errado (`AbortError`, `ApiError`, o `console.error` genérico) — o relatório é bom para lembrar que eles existem.

**Exemplo — a leitura correta:**

```
tasksReducer.ts   100%  ← esperado: cinco testes puros
useTasks.ts        62%  ← o vermelho está nos catch. Pergunta legítima.
Card.tsx          100%  ← não significa nada: nunca foi verificado, só renderizado
```

### 15. A pirâmide vista do front

**O que é.** A mesma pirâmide do T5 da Etapa 2, com outros nomes nos andares:

| Andar | Aqui é | Custo | Confiança |
| --- | --- | --- | --- |
| Base | função pura (`tasksReducer`, `taskRules`) | milissegundos | alta, escopo pequeno |
| Meio | componente/página com MSW | centenas de ms | **o melhor retorno no front** |
| Topo | e2e em navegador de verdade (Playwright) | segundos, frágil | alta, e cara |

**Para que serve.** Decidir onde parar. No back, o meio da pirâmide é a rota com supertest. No front, o meio é **a página com MSW**, e é onde quase toda a suíte deve morar: é o único nível que prova que a tela, o hook, a camada de API e o estado funcionam **juntos**.

**Exemplo — o que fica anotado e não entra agora:** Playwright rodaria o app real contra a API real, e pegaria o que MSW por definição não pega — CORS, o contrato da API mudando por baixo, o fallback de SPA da Vercel. É a resposta certa para a divergência de contrato registrada no `web/README.md` (a API devolve `field: 'task'` e o front espera erro por campo): **nenhum teste com MSW jamais vai achar isso**, porque o handler é escrito por você, com a sua crença sobre a API dentro. É o limite honesto desta suíte, e ele merece uma linha no README.

---

# Parte B — Alterações no app

### 1. Preparação do ambiente

- **Primeira instalação de peso desde o T9.** Tudo em `-D`:
  - `vitest` · `jsdom` · `@vitest/coverage-v8`
  - `@testing-library/react` · `@testing-library/user-event` · `@testing-library/jest-dom`
  - `msw`
- **`vite.config.ts`:** trocar o import de `defineConfig` de `'vite'` para `'vitest/config'` e acrescentar o bloco `test` — `environment: 'jsdom'`, `setupFiles: './src/test/setup.ts'`, `globals: false`.
- **`globals: false` de propósito:** importar `describe`/`it`/`expect` de `'vitest'` em cada arquivo, igual à `api/` (`src/app.test.ts`). Coerência entre os dois lados do projeto, e nada a acrescentar em `types` do `tsconfig.app.json`.
- **`package.json`:** `"test": "vitest run"` e `"test:watch": "vitest"`. A partir daqui, **`npm test` verde é condição de fechamento de tema** (e entra na avaliação).
- **`src/test/setup.ts`:** `import '@testing-library/jest-dom/vitest'` + `server.listen` / `resetHandlers` / `close` do MSW.
- **`.env.test` com `VITE_API_URL`**, ou handlers com `*/tasks`. Escolher **uma** e escrever qual (tópico 8).
- Nada de servidor de pé: **a `api/` e o Postgres não precisam rodar** para `npm test`. É a primeira verificação da etapa que não depende de três terminais.

### 2. Os blocos

#### Bloco 1 — o que o app tem que fazer agora

**A base (o que o T11 deixou pronto)**

- [ ] Exportar o `tasksReducer` — hoje é `const` privado dentro do `useTasks.ts`. Decidir: `export` no lugar, ou arquivo próprio `hooks/tasksReducer.ts`
- [ ] `tasksReducer.test.ts`: um `it` por action (`loaded`, `failed`, `created`, `updated`, `removed`)
- [ ] Mais dois: `updated`/`removed` com estado em `loading` **não** muda nada (a guarda de `success`), e o estado antigo **não** é mutado
- [ ] `taskRules.test.ts`: o ciclo `todo → doing → done → todo` do `nextStatus` e o `validateTaskForm` (título vazio, título só com espaço)

**A infraestrutura de teste**

- [ ] `src/test/setup.ts` — matchers do jest-dom + ciclo de vida do MSW
- [ ] `src/test/server.ts` + `handlers.ts` — sucesso do `GET`, `POST` (201), `PATCH` (200), `DELETE` (204)
- [ ] `src/test/renderWithProviders.tsx` — embrulha em `MemoryRouter` **e** `ToastProvider`. Sem ele a página não monta: `useSearchParams`/`Link` exigem roteador e `useTasks` chama `useToastActions`
- [ ] Uma fixture de tarefas com os **três** status, para a lista cair nas três colunas

**Os quatro estados da `TasksPage`**

- [ ] **Carregando:** com `delay()` no handler, `getByRole('heading', { name: 'Carregando suas tarefas' })`
- [ ] **Erro:** handler devolvendo 500 → `findByRole('alert')` e o botão "Tentar de novo" na tela
- [ ] **Vazio:** handler devolvendo `[]` → a mensagem de estado vazio (que é um **sucesso**, não um erro)
- [ ] **Sucesso:** as três tarefas da fixture aparecem, cada uma na sua coluna

**Os fluxos (o caminho crítico)**

- [ ] **Criar:** focar o campo (é o `onFocus` que expande o rodapé), digitar, escolher status, enviar → a tarefa aparece e o campo limpa
- [ ] **Validação do cliente:** título vazio → `role="alert"` na tela **e nenhuma requisição sai**
- [ ] **Duplo submit:** dois cliques rápidos em "Adicionar" → **um** `POST` (o `isSubmitting` do T5)
- [ ] **Ciclar status:** clicar em "Alterar status de X" → a tarefa muda de coluna
- [ ] **Rollback do otimista:** `PATCH` respondendo 500 → a tarefa **volta** para a coluna anterior e o aviso aparece
- [ ] **Apagar:** `vi.spyOn(window, 'confirm').mockReturnValue(true)` → o item some da tela
- [ ] **O 404 na escrita:** `PATCH`/`DELETE` respondendo 404 → o item sai da lista e o `role="status"` diz "Esta tarefa não existe mais."
- [ ] **Editar o título na linha:** clicar no título, digitar, Enter → o novo título na tela; Esc → o antigo de volta

**Fechamento (regras 1, 6 e 7)**

- [ ] `npm test` **verde**, e o número de testes anotado no devlog
- [ ] `npm run typecheck` limpo — os `.test.tsx` estão em `src/` e entram no `tsc -b`
- [ ] `npm run build` rodado; comparar com a linha de base do T10 (a expectativa é **idêntico**: tudo entrou em `devDependencies` e nada é importado pelo app)
- [ ] Um teste **quebrado de propósito** para ver a suíte reclamar — teste que nunca falhou não provou nada
- [ ] `web/README.md`: sai "Sem testes" das Limitações; entra como rodar, o que a suíte cobre, e **o que ela não pega** (o limite do MSW, tópico 15)
- [ ] **Push na `main` e link público conferido** — regra 7

#### Bloco 2 — sugestões, médio/avançado

- Cobertura com `--coverage` e a leitura de trás para a frente, procurando `catch` vermelho (tópico 14)
- Teste da `TaskDetailPage`: uuid inválido, 404 do `GET`, exclusão de dentro do detalhe
- Teste de rota: `MemoryRouter initialEntries={['/tasks?q=pão&status=doing']}` provando que a URL é estado (T9)
- `it.each` para o ciclo de status e para as ações do reducer — a mesma ferramenta do T5 da Etapa 2
- Fake timers no `Toast`: provar que ele some em 4 s e que um aviso novo mata o timer do anterior (T11)
- Um `it` para o `AbortController`: trocar de rota no meio da requisição não pode logar erro
- Teste de acessibilidade automatizado com `jest-axe` — e olhar quanto do T3 ele confirma
- `renderHook` num hook genérico (um `useDebounce` para a busca), para comparar com o "teste pelo componente"
- Escrever **um** teste antes do código no T14 (a animação de saída) — TDD numa mordida, com o material do T5 da Etapa 2
- Playwright numa branch: um teste de ponta a ponta contra a API real, para achar o que o MSW nunca vai achar (a divergência de contrato do `field: 'task'`)

---

# Parte C — Revisão do código

> Preencher no fechamento do tema. **Regra 6: o tema só fecha quando esta parte estiver concluída** — e vale a **regra 7**: sem redeploy, o tema não fechou.

## O app foi migrado para o assunto do tema?

_(a preencher)_

## Typecheck

_(a preencher)_

## Testes

_(a preencher — a partir deste tema, é `npm test` e não mais a lista de provas manuais)_
