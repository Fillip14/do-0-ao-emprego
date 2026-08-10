# Estudo — Formulários controlados e efeitos (Temas 5 + 6)

> **Temas mesclados em 07/08.** O T5 (Formulários controlados) e o T6 (Efeitos e ciclo de vida) viraram um arquivo só. O motivo é de conteúdo, não de pressa: o efeito escolhido para o T6 — **persistir as tarefas no `localStorage`** — só tem material depois que o formulário do T5 existir, e a lição central do T6 ("quando **não** usar `useEffect`") só fica visível quando há um formulário por perto para tentar sincronizar errado. Separados, o T6 seria teoria sobre um app que não pede efeito nenhum.
>
> Os tópicos mantêm a numeração do `plano.md` (A1 = T5 1–12, A2 = T6 1–12), porque é essa numeração que o simulado de entrevista usa. A **A3** é nova e só existe por causa da mescla.

> **O tema, em uma frase:** o T5 entrega ao React o controle de cada tecla digitada; o T6 abre uma porta para o mundo fora do React — e ensina que quase sempre a resposta certa é manter essa porta fechada.

**Onde o app está antes deste tema.** `Content` é dono de `useState<Task[]>(mockTasks)` e dos três handlers (`handleChangeTask`, `handleDeleteTask`, `handleAddTask`). `InputTask` já é um input controlado — um campo só, `title`, com `trim()` e `<form onSubmit>`. `ItemTask` só avisa. Nada persiste: F5 volta ao `mockTasks`.

---

# Parte A — Os tópicos

## A1 · Formulários controlados

### 1. Controlado × não controlado

**O que é.** A pergunta é uma só: **quem é a fonte da verdade do valor do campo?** No campo _controlado_, é o estado do React — o `value` do input é ditado por ele a cada render. No _não controlado_, é o DOM: o input guarda o próprio valor e você só o lê na hora do envio (por `ref` ou pelo `FormData`).

**Para que serve.** Controlado é o padrão quando o valor precisa ser lido **enquanto** se digita: validar em tempo real, habilitar botão, formatar, espelhar em outro lugar da tela. Não controlado é mais barato (zero render por tecla) e é a resposta honesta para o formulário que só interessa no submit — e é o único caminho para `<input type="file">`, cujo valor o React não pode ditar.

**Exemplo.**

```tsx
const [text, setText] = useState('');
<input value={text} onChange={(e) => setText(e.target.value)} />; // controlado

<input defaultValue="" ref={inputRef} />; // não controlado — `defaultValue`, não `value`
```

O `InputTask` de hoje já é controlado. O que muda no tema não é a técnica, é a escala: um campo vira três.

### 2. `value` + `onChange`: o loop completo

**O que é.** A volta inteira: você digita → o navegador dispara `change` → o handler chama o setter → o React re-renderiza → o input recebe `value` novo. A letra aparecendo na tela é **resultado do render**, não do teclado.

**Para que serve.** Entender isso explica os dois erros clássicos:

- `value` **sem** `onChange` → campo congelado. O React reescreve o valor a cada render e nada nunca muda o estado. O console avisa.
- `value={undefined}` no primeiro render e `value="algo"` depois → o React acusa "changing an uncontrolled input to be controlled". A cura é inicializar com `''`, nunca `undefined`.

**Exemplo.**

```tsx
<input value={text} />                                 // ❌ congelado
<input value={text} readOnly />                        // ✅ congelado de propósito
<input defaultValue={text} />                          // ✅ não controlado
<input value={text} onChange={(e) => setText(e.target.value)} /> // ✅ o loop
```

Consequência de projeto: como o React manda no valor, dá para interferir no caminho — `setText(e.target.value.toUpperCase())` funciona. Cuidado com o que **atrapalha digitação** (mascarar CPF na tecla, cortar espaço no meio da frase): o cursor pula.

### 3. Um handler para vários campos

**O que é.** Em vez de um `useState` e um handler por campo, um objeto de estado e um handler só, que usa o atributo `name` do input como chave.

**Para que serve.** Com três campos (`title`, `status`, `term`), três `useState` ainda são legíveis; com seis já não são. O corte é o tópico 10 do T4 aplicado: **agrupe o que muda junto**. Os campos de um formulário mudam pelo mesmo motivo (o usuário está preenchendo aquilo) e são limpos no mesmo instante — são um grupo.

**Exemplo.**

```tsx
type TaskForm = { title: string; status: Status; term: string };

const empty: TaskForm = { title: '', status: 'todo', term: '' };
const [form, setForm] = useState<TaskForm>(empty);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.currentTarget;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

**Os dois pedágios.** (1) Esquecer o `...prev` apaga os outros campos em silêncio — `useState` não faz merge, ao contrário do `setState` de classe. (2) `[name]: value` é chave computada: o TypeScript não consegue provar que `name` é chave de `TaskForm`, e com `status` tipado como união o `value: string` não encaixa. Sai um `as` — e um `as` é uma **afirmação**, a mesma lição do `queryDb<T>` do T4 da Etapa 2. A alternativa honesta é um handler por campo para os campos de união e o genérico só para os de texto.

### 4. Cada tipo de campo tem sua peculiaridade

**O que é.** "Controlado" não significa a mesma coisa em todo input. O que muda é **qual prop** é o valor e **o que** `e.target` entrega.

**Para que serve.** É a lista que evita meia hora de tentativa e erro:

| Campo               | Prop de valor              | O que se lê                     | Pegadinha                                                         |
| ------------------- | -------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `input type="text"` | `value`                    | `e.target.value`                | `null`/`undefined` torna não controlado                           |
| `textarea`          | `value` (não `children`)   | `e.target.value`                | no HTML o valor fica dentro da tag; no JSX, não                   |
| `select`            | `value` no `<select>`      | `e.target.value`                | `selected` na `<option>` é ignorado pelo React                    |
| `select multiple`   | `value` é **array**        | percorrer `selectedOptions`     | esquecer o array quebra em silêncio                               |
| `checkbox`          | **`checked`**, não `value` | `e.target.checked` (boolean)    | usar `value` faz o campo não responder                            |
| `radio`             | `checked` por opção        | `e.target.value` do selecionado | o grupo é o mesmo `name`; o estado é um só                        |
| `input type="date"` | `value`                    | `e.target.value`                | string **`'YYYY-MM-DD'`**, sempre; vazio é `''`, e `null` estoura |

**Para o app.** `term` é `string \| null` no contrato, e o `<input type="date">` não sabe o que fazer com `null`. Então o formulário guarda `''` e a conversão acontece na saída: `term: form.term || null`. É uma tradução de fronteira, e o lugar dela é a borda — não o estado.

O formato `'YYYY-MM-DD'` do input casa por sorte com o `term` da API ser `text`, não `timestamptz` (decisão do T4 da Etapa 2). Isso é bilhete premiado, não projeto: se um dia virar data de verdade, a conversão aparece aqui.

### 5. `onSubmit` no `<form>` × `onClick` no botão

**O que é.** O formulário submete de três jeitos: clique no botão `type="submit"`, **Enter** num campo de texto, ou `form.requestSubmit()`. Pendurar a lógica no `onClick` do botão cobre só o primeiro.

**Para que serve.** É a resposta certa por quatro motivos ao mesmo tempo: Enter funciona de graça; leitor de tela anuncia "formulário"; o navegador dá validação nativa (`required`, `type="email"`); e o Testing Library do T13 procura `getByRole('form')` e dispara submit — teste que clica no botão testa o botão, não o formulário.

**Exemplo.**

```tsx
<form onSubmit={handleSubmit}>
  ...
  <Button type="submit">Adicionar</Button>
</form>
```

`e.preventDefault()` é obrigatório na primeira linha do handler: sem ele o navegador recarrega a página, e numa SPA isso é a morte do estado.

**Detalhe do nosso `Button`.** Ele escreve `type="button"` **antes** do `{...rest}`, então `<Button type="submit">` sobrescreve — funciona porque a ordem do spread é essa. Inverter a ordem quebra o formulário sem quebrar o typecheck. Vale um comentário no arquivo.

### 6. Validação no cliente é conveniência; a que vale é a do servidor

**O que é.** Duas validações com papéis diferentes. A do cliente existe para dar resposta rápida e evitar viagem inútil. A do servidor existe porque **o cliente é território do usuário** — `curl`, DevTools e extensão passam por cima de qualquer `required`.

**Para que serve.** Define o que fazer quando as duas discordarem: quem manda é o servidor. E define como não duplicar regra: o cliente valida o que é **barato e óbvio** (campo vazio, formato, tamanho absurdo) e deixa o resto — unicidade, permissão, regra de negócio — chegar como erro de resposta.

**Exemplo.** A API valida `title` obrigatório e não vazio, `status` num dos três valores, `term` string ou `null`. O front repete só o "não vazio" (que o `trim()` do `InputTask` já faz) e confia no resto. A duplicação aqui é **deliberada e assimétrica** — mesmo desenho do `isNewTask` no TS + `CHECK` no schema, do T4 da Etapa 2.

O que **não** fazer: escrever no front uma regra que o servidor não tem. Aí o front vira o único guardião de algo, e a regra some quando alguém chamar a API direto.

### 7. Erro por campo, no formato da sua API

**O que é.** A API responde `{ "errors": [{ "field": "title", "message": "título é obrigatório" }] }`, com `field` opcional. O front precisa de uma estrutura que mapeie campo → mensagem e de um lugar para o erro que **não** é de campo nenhum.

**Para que serve.** Modelar isso agora, com erro fabricado em memória, faz o T8 (erro de validação do servidor caindo no campo certo) ser plugar a resposta numa estrutura que já existe. Modelar depois é reescrever o formulário.

**Exemplo.**

```tsx
type FieldErrors = Partial<Record<keyof TaskForm, string>>;
const [errors, setErrors] = useState<FieldErrors>({});
const [formError, setFormError] = useState<string | null>(null); // erro sem `field`
```

`Partial<Record<...>>` diz o que precisa ser dito: **pode** haver erro em qualquer campo, não **há** em todos.

**A divergência que este tema expôs — e fechou (07/08).** A API chama o campo de **`title`**; o front tinha copiado como **`description`**. Enquanto nada conversa é só um nome, mas no T8 o erro do servidor chega com `field: 'title'` e precisa achar o input correspondente — ou alguém escreve uma tabela de tradução e passa a mantê-la. **O front foi renomeado para `title`** em `types/task.ts`, `mockTasks.ts`, `content/index.tsx` e `ItemTask.tsx`, antes de o formulário existir. O critério: a `Task` do front é **cópia deliberada do contrato** (decisão do T2) — cópia que renomeia campo deixa de ser cópia e vira tradução, e tradução é trabalho que não acaba.

Sobra uma inconsistência de nome só de estilo: o `Typography` tem `titleTask` (que é o título da **coluna**) e `descriptionTask` (que agora é o `title` da tarefa). São nomes de variante, não de dado — não quebram nada, mas mentem. Anotado para o bloco 4.

### 8. `label` ligado ao input

**O que é.** `<label htmlFor="term">` apontando para `<input id="term">`. Ou o input dentro do label, sem `id` — funciona, mas atrapalha o layout.

**Para que serve.** Três coisas de uma vez: clicar no rótulo foca o campo (alvo de toque maior); leitor de tela anuncia o rótulo junto do campo, em vez de "campo de edição, em branco"; e `getByLabelText` do T13 passa a funcionar. É o tópico 4 do T3 pagando dividendo — e a razão de "acessibilidade é comportamento, não enfeite".

**Exemplo.**

```tsx
<label htmlFor="task-term">Prazo</label>
<input id="task-term" name="term" type="date" value={form.term} onChange={handleChange} />
```

`placeholder` **não** é rótulo: some quando se digita, tem contraste ruim e nem todo leitor de tela lê. O `InputTask` de hoje resolve com `aria-label="Nova tarefa"` — aceitável para um campo solto, insuficiente para um formulário de três campos visíveis. Para amarrar a mensagem de erro ao campo: `aria-describedby` apontando para o `id` do parágrafo de erro, mais `aria-invalid`.

### 9. Limpar depois do sucesso, manter depois do erro

**O que é.** Duas regras opostas, e a assimetria é o ponto: sucesso limpa o formulário; erro **preserva tudo que foi digitado**.

**Para que serve.** Formulário que se apaga no erro é a forma mais rápida de fazer alguém desistir. E limpar cedo demais — antes de confirmar — é mentira quando o envio falha (o T8 volta nisso com atualização otimista).

**Exemplo.**

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const problems = validate(form);
  if (Object.keys(problems).length > 0) {
    setErrors(problems); // form intacto
    return;
  }
  onAddTask(form);
  setForm(empty);
  setErrors({});
};
```

Detalhe que se esquece: depois de limpar, **devolver o foco** para o primeiro campo. Quem usa teclado ficou com o foco num botão, olhando um formulário vazio.

### 10. Botão desabilitado durante o envio e o duplo submit

**O que é.** Entre "usuário clicou" e "operação terminou" existe um intervalo. Sem estado que o represente, o botão aceita o segundo clique — e nascem duas tarefas.

**Para que serve.** Hoje o envio é síncrono e a janela é de milissegundos; no T8, com rede no meio, ela é de segundos. Modelar agora é barato. E o modelo certo não é um booleano solto: é o tópico 9 do T4 (estado impossível). `isSubmitting` + `hasError` + `isSuccess` são 8 combinações para 4 estados válidos.

**Exemplo.**

```tsx
type FormStatus = 'idle' | 'submitting' | 'error' | 'success';
const [status, setStatus] = useState<FormStatus>('idle');

<Button type="submit" disabled={status === 'submitting'}>
  {status === 'submitting' ? 'Salvando…' : 'Adicionar'}
</Button>;
```

`disabled` sozinho não basta: o botão desabilitado **sai da ordem de tabulação** e o foco cai no vazio. E `disabled` não impede Enter num campo de texto — a guarda de verdade é a primeira linha do handler (`if (status === 'submitting') return;`). Alternativa que preserva o foco: `aria-disabled` + a guarda no handler.

### 11. Quando `useState` por campo deixa de servir

**O que é.** O ponto em que espalhar `useState` vira ruído: muitos campos, ou — mais importante — quando um evento precisa mudar **vários pedaços do estado de uma vez** de forma coordenada.

**Para que serve.** É o gancho do `useReducer` (T11). O sintoma não é a quantidade de `useState`; é o handler que chama três setters seguidos e cujo nome é uma transição ("enviou", "servidor respondeu", "cancelou"). Quando o evento é uma transição, o modelo é máquina de estados.

**Exemplo.**

```tsx
setStatus('submitting');
setErrors({});
setFormError(null); // três setters, um evento → cheiro de reducer
```

Neste tema você **não** troca por `useReducer` — escreve o sintoma no devlog para o T11 encontrar. Trocar agora é otimizar antes de doer.

### 12. Bibliotecas de formulário existem — por que nenhuma agora

**O que é.** React Hook Form (não controlado por padrão, um render por campo em vez de um por tecla), Formik (o veterano controlado), Zod/Valibot (schema que valida e infere o tipo).

**Para que serve.** Saber **qual problema** cada uma resolve, para reconhecê-lo quando aparecer: re-render a cada tecla num formulário grande, validação declarativa em vez de `if` empilhado, campo dinâmico, formulário de vários passos.

**Por que não agora.** Três campos não têm nenhum desses problemas, e a biblioteca esconde exatamente o que este tema existe para ensinar. Mesma lógica do "por que existe TanStack Query e por que você vai passar sem ele" do T7. Numa entrevista, "não usei porque três campos não justificam, e sei o que o RHF resolveria" vale mais que o nome da lib.

**Anotação para o futuro:** Zod já é candidato conhecido do **T6 da Etapa 2** (validação na saída do banco). Se ele entrar dos dois lados, o schema vira o lugar único da regra — e o tópico 6 deste tema muda de resposta. Vai para o `ideias-depois.md`.

---

## A2 · Efeitos e ciclo de vida

### 1. O que é um efeito

**O que é.** `useEffect` sincroniza o componente com algo que **não é React**: `localStorage`, `document.title`, um `WebSocket`, um `setInterval`, um listener no `window`, a rede. O nome certo do que ele faz é _sincronizar_, não _executar depois_.

**Para que serve.** O React sabe reconciliar a árvore dele. Não sabe nada sobre o resto do navegador. O efeito é a fronteira declarada entre os dois mundos — e é por isso que ele tem função de limpeza: sincronizar implica saber **dessincronizar**.

**Exemplo.**

```tsx
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]); // o navegador passa a refletir o estado
```

Pergunta de triagem: _existe algo fora do React que precisa ficar igual ao meu estado?_ Se a resposta é não, não é efeito.

### 2. Quando **NÃO** usar `useEffect` — o tópico mais importante do tema

**O que é.** A maior parte dos `useEffect` que se escreve no começo é errada. Os quatro casos:

1. **Transformar dado para exibir** → calcule no render. É o estado derivado do T4, tópico 8.
2. **Responder a evento do usuário** → ponha no handler. "O usuário clicou" é informação que o efeito não tem: ele só vê que o estado mudou, não _por quê_.
3. **Sincronizar estado com prop** → normalmente é _lifting state up_ (T4, tópico 7) ou uma `key` diferente para remontar o componente.
4. **Inicializar a partir de algo externo** → inicializador preguiçoso do `useState`, não efeito.

**Para que serve.** Cada efeito indevido custa um render a mais, um estado a mais para divergir, e um instante em que a tela mostra o valor velho. Não é elegância — é bug em potencial.

**Exemplo.**

```tsx
// ❌ dois renders e um instante com o contador errado
const [total, setTotal] = useState(0);
useEffect(() => setTotal(tasks.length), [tasks]);

// ✅ um render, sempre certo
const total = tasks.length;

// ❌ efeito espiando o estado para descobrir que algo aconteceu
useEffect(() => {
  if (tasks.length > prev) toast('Tarefa criada');
}, [tasks]);

// ✅ o handler sabe o que aconteceu
const handleAddTask = (t: TaskForm) => {
  setTasks((prev) => [...prev, novo]);
  toast('Tarefa criada');
};
```

**Aplicado ao nosso caso.** Ler o `localStorage` na montagem é a armadilha 4: com efeito, o primeiro render pinta a lista vazia e o segundo pinta as tarefas — pisca. Com inicializador preguiçoso, o primeiro render já está certo.

```tsx
// ❌ pisca
const [tasks, setTasks] = useState<Task[]>([]);
useEffect(() => {
  const saved = localStorage.getItem('tasks');
  if (saved) setTasks(JSON.parse(saved));
}, []);

// ✅ certo no primeiro render
const [tasks, setTasks] = useState<Task[]>(loadTasks);
```

**Ler não é efeito; escrever é** — e mesmo escrever tem alternativa (A3, tópico 2).

### 3. O array de dependências

**O que é.** A lista de valores que, ao mudarem entre dois renders, mandam o efeito rodar de novo. O React compara com `Object.is`, um por um, exatamente como faz com o estado.

**Para que serve.** Entra **tudo** que o efeito lê e vem de fora dele: props, estado, e funções ou variáveis declaradas no corpo do componente. Não entram setters do `useState`, refs, nem valores importados de módulo — o React garante a estabilidade dos dois primeiros e o terceiro não muda.

**Exemplo.**

```tsx
useEffect(() => {
  localStorage.setItem(key, JSON.stringify(tasks));
}, [key, tasks]); // `key` também é lido dentro
```

O linter (`eslint-plugin-react-hooks`) cobra isso, e **omitir uma dependência para "consertar" um loop é a troca errada**: você troca um bug barulhento (loop) por um silencioso (valor velho congelado dentro do efeito, aparecendo só numa sequência específica de cliques). A cura do loop está no tópico 8, não no array.

### 4. Os três formatos

**O que é.**

| Formato   | Quando roda                        | Leitura honesta                                     |
| --------- | ---------------------------------- | --------------------------------------------------- |
| sem array | depois de **todo** render          | "não pensei nas dependências" — quase sempre engano |
| `[]`      | uma vez na montagem                | "isto não depende de nada que muda"                 |
| `[a, b]`  | na montagem e quando `a`/`b` mudam | "isto precisa ficar em dia com `a` e `b`"           |

**Para que serve.** Ler o array como **afirmação sobre o mundo**, não como controle de frequência. `[]` diz "nada aqui dentro muda". Se for mentira, o efeito trabalha com valor de museu.

**Exemplo.** `[]` mais comum e legítimo: assinar um evento global.

```tsx
useEffect(() => {
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [close]); // ⚠️ `close` entra; se ela for recriada a cada render, vira o tópico 8
```

### 5. Função de limpeza

**O que é.** O `return` do efeito. Roda **antes de cada nova execução** e uma última vez na desmontagem. Não é só "no unmount" — é o par de desfazer de cada execução.

**Para que serve.** Todo efeito que **cria** algo persistente precisa destruir: `setInterval`/`setTimeout`, `addEventListener`, assinatura, conexão, requisição em voo, observador. Sem isso: vazamento, handler duplicado a cada render, e o clássico "setar estado em componente desmontado".

**Exemplo.**

```tsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // sem isto, um timer novo por render
}, [tick]);
```

Regra prática: se dentro do efeito aparece um verbo de criar (`add`, `create`, `open`, `subscribe`, `set` de timer), o `return` é obrigatório. `localStorage.setItem` não cria nada persistente — este é um dos poucos efeitos legitimamente sem limpeza.

### 6. Ordem real: render → DOM → efeito

**O que é.** O React chama a função do componente (render, puro, sem tocar no DOM), aplica as diferenças no DOM (commit), o navegador pinta, e **depois** o efeito roda.

**Para que serve.** Explica por que medir elemento (`getBoundingClientRect`, `offsetHeight`) durante o render é errado: o nó ainda não está lá, ou é o do render anterior. Medição é dentro do efeito, com `ref`. É o que o T14 vai precisar para animar, e o T11 formaliza no `useRef` para nó do DOM.

**Exemplo.**

```tsx
const boxRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  console.log(boxRef.current?.offsetHeight); // ✅ o nó existe
}, []);
```

Corolário: efeito que muda estado imediatamente causa um segundo render que o usuário **pode** ver piscar. É por isso que "ler o `localStorage` num efeito" pisca e o inicializador preguiçoso não.

### 7. `StrictMode` monta–desmonta–monta em dev

**O que é.** Em desenvolvimento, `<StrictMode>` monta o componente, roda o efeito, roda a limpeza e roda o efeito de novo. De propósito, e só em dev.

**Para que serve.** É um detector: **o efeito que não sobrevive a isso está mal escrito.** Rodar duas vezes só quebra o que não tem limpeza correta. Dois cliques de contador, duas requisições sem cancelamento, dois listeners empilhados — todos são o mesmo defeito, encontrado de graça.

**Exemplo.** Um efeito bem escrito é **idempotente do lado de fora**: `setItem` duas vezes com o mesmo valor não faz diferença. `addEventListener` duas vezes faz — e é por isso que ele precisa do `return`.

O T1 já registrou o dobro de montagem como feature. Aqui ela ganha o uso prático.

### 8. Loop infinito: as três causas clássicas

**O que é.** Efeito roda → muda estado → render → efeito roda. As três origens:

1. **Setar estado sem dependências corretas** — sem array, ou com uma dependência que o próprio efeito altera.
2. **Objeto ou array recriado no render** dentro das deps: `{}` !== `{}` por `Object.is`, sempre.
3. **Função recriada no render** dentro das deps — o caso 2 com outra cara, e o mais comum.

**Para que serve.** Reconhecer a causa em vez de apagar o array de dependências. As curas, na ordem: mover o valor para dentro do efeito; `useMemo`/`useCallback` (T11); tirar o valor do componente (constante de módulo); ou usar a forma funcional do setter para não depender do estado.

**Exemplo.**

```tsx
// ❌ loop: `tasks` muda por causa do próprio efeito
useEffect(() => {
  setTasks(tasks.map(normalizar));
}, [tasks]);

// ❌ loop: objeto novo a cada render
useEffect(() => sync(options), [options]); // const options = { key: 'tasks' }

// ✅ constante de módulo, fora do componente
const OPTIONS = { key: 'tasks' };
```

O caso 1 quase sempre é o tópico 2 disfarçado: se o efeito só transforma estado em estado, ele não deveria existir.

### 9. Efeito com `async`

**O que é.** A função do efeito não pode ser `async`, porque `async` devolve uma Promise e o React espera **ou nada, ou a função de limpeza**. Devolver Promise faz o React tratá-la como limpeza e o TypeScript reclamar.

**Para que serve.** Fixa o formato certo: função assíncrona **declarada dentro** e chamada em seguida (ou IIFE). É o esqueleto que o T7 vai preencher com `fetch`.

**Exemplo.**

```tsx
useEffect(() => {
  const run = async () => {
    const data = await carregar();
    setTasks(data);
  };
  void run();
}, []);
```

```tsx
useEffect(async () => { ... }, []); // ❌ não compila
```

### 10. Race condition

**O que é.** Duas execuções do mesmo efeito em voo; a **primeira** responde depois da segunda e sobrescreve o resultado novo com o velho. Não é raro: é o comportamento padrão de rede lenta com filtro digitado depressa.

**Para que serve.** É o bug que não aparece na sua máquina e aparece em produção. As duas curas, ambas na função de limpeza:

```tsx
// flag `ignore` — a resposta velha chega e é descartada
useEffect(() => {
  let ignore = false;
  buscar(id).then((data) => {
    if (!ignore) setTasks(data);
  });
  return () => {
    ignore = true;
  };
}, [id]);

// AbortController — a requisição velha é de fato cancelada
useEffect(() => {
  const ac = new AbortController();
  fetch(url, { signal: ac.signal }).catch((e) => {
    if (e.name !== 'AbortError') throw e;
  });
  return () => ac.abort();
}, [url]);
```

`ignore` é mais simples e resolve o estado errado; `AbortController` também economiza rede e é o certo para requisição. Sem `fetch` no app ainda, aqui a prática é com `setTimeout` — e o T7 troca por rede de verdade.

### 11. `useEffect` × `useLayoutEffect`

**O que é.** `useLayoutEffect` roda **depois** do DOM ser atualizado e **antes** do navegador pintar; `useEffect` roda depois da pintura. O primeiro bloqueia a pintura.

**Para que serve.** 99% dos casos são `useEffect`. `useLayoutEffect` só quando o usuário veria um estado intermediário errado: medir um elemento e reposicionar (tooltip, popover), restaurar scroll, fixar a posição inicial de uma animação. Fora disso, ele atrasa a tela.

**Exemplo mental.** Se você mede e move no `useEffect`, o usuário vê o elemento no lugar errado por um quadro. Com `useLayoutEffect`, nunca vê. **Volta no T14**, medindo elemento para animar.

### 12. Ordem de execução: pai × filho

**O que é.** O React monta a árvore de cima para baixo, mas roda os efeitos de **baixo para cima**: o efeito do filho antes do efeito do pai. Na limpeza, também filho antes do pai.

**Para que serve.** Explica o efeito do pai que tenta medir algo que o filho ainda não configurou — e o inverso: quando o efeito do filho roda, o DOM da árvore inteira já está no lugar, então ele pode contar com isso.

**Consequência prática:** não construa lógica que dependa dessa ordem. Precisando de coordenação entre pai e filho, o caminho é dado descendo (props) ou callback subindo (T4, tópico 6) — não a ordem dos efeitos.

---

## A3 · Onde os dois temas se encontram

### 1. Ler é inicializador; escrever é efeito

O par de persistência tem duas metades assimétricas, e essa assimetria **é** a mescla dos dois temas:

```tsx
const STORAGE_KEY = 'do-0-ao-emprego:tasks';

const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : mockTasks;
  } catch {
    return mockTasks; // JSON corrompido, storage bloqueado, modo privado
  }
};

const [tasks, setTasks] = useState<Task[]>(loadTasks); // ← função, não `loadTasks()`

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}, [tasks]);
```

Três coisas para não deixar passar:

- `useState(loadTasks)` passa a **função**; `useState(loadTasks())` executa em todo render e joga o resultado fora. Um caractere de diferença, um `localStorage.getItem` por render.
- O `try/catch` não é paranoia: `JSON.parse` de lixo estoura e derruba o app inteiro no primeiro render, e `localStorage` lança em algumas configurações de privacidade.
- `as Task[]` é **afirmação, não prova** — o storage pode ter o formato de ontem. Mesma lição do `queryDb<T>`. Anotar como dívida: validação de verdade só com schema (Zod, T6 da Etapa 2).

### 2. O efeito de persistir tem uma alternativa honesta

Escrever no `localStorage` dentro do handler, junto com o `setTasks`, também funciona — e é o que o tópico 2 do A2 mandaria fazer, já que salvar é consequência de um **evento**. O efeito ganha em outro critério: são três handlers hoje (`add`, `change`, `delete`), e o formulário e a edição inline vão criar mais. Um efeito em `[tasks]` cobre todos, inclusive os que ainda não existem; o handler exige lembrar em cada um.

Não existe resposta única — existe **trade-off registrado**. O que não vale é escolher sem saber que havia escolha. A decisão vai para o `web/README.md`, com o motivo.

### 3. Rascunho de formulário não vai para o storage (por enquanto)

Persistir o que está sendo digitado é tentador e é outro tema: exige debounce, decidir quando descartar, e conviver com o formulário que "lembra" algo que o usuário quis abandonar. Fica anotado no `ideias-depois.md`.

---

# Parte B — Alterações no app

### 1. Preparação do ambiente

Nenhuma. `useEffect` vem no React, `localStorage` é do navegador. Deixar abertos o **React DevTools → Components** e o **DevTools → Application → Local Storage**.

### 2. Os blocos

#### Bloco 1 — o que o app tem que fazer agora

**Formulário de criar (T5)**

- [x] `description` → `title`, alinhado ao contrato da API
- [x] Três campos controlados: `title` (text), `status` (`select`), `term` (`date`)
- [x] Estado num objeto `TaskForm`, não em três `useState`
- [x] O rodapé expande ao focar; `status` e `term` saem da árvore quando fechado (`{isOpen && ...}`, não CSS)
- [x] `label htmlFor` ↔ `id` em cada campo
- [x] `onSubmit` no `<form>`, `preventDefault` na primeira linha, botão `type="submit"`
- [x] `term: ''` no estado, `|| null` na saída
- [x] Validação: `title` não vazio depois do `trim()`
- [x] `FieldErrors` + mensagem abaixo do campo, com `aria-invalid` e `aria-describedby`
- [x] Sucesso limpa o formulário; erro preserva o que foi digitado
- [x] `handleAddTask` recebe o objeto, não a string

**Edição do título na linha (T5)**

- [x] Clicar no título troca por input; Enter salva, Esc cancela
- [x] `editingId` no `Content`; o rascunho fica num componente que monta ao abrir
- [x] O gatilho é `<button>`, nunca `<div onClick>`

**Persistência (T6)**

- [x] `loadTasks()` com `try/catch`
- [x] `useState(loadTasks)` — a função, não a chamada
- [x] `useEffect(..., [tasks])` gravando; sem limpeza, e saber dizer por quê
- [x] Provar: criar, F5, continua lá; storage limpo abre vazio
- [ ] Provar o `StrictMode`: o efeito roda duas vezes em dev e nada quebra

#### Bloco 2 — sugestões, médio/avançado

- Efeito com limpeza de verdade: `Esc` global, com `removeEventListener` no `return` — sem isto o tópico 5 do A2 fica só teoria
- `document.title` com o número de tarefas pendentes
- Ensaiar a race condition com `setTimeout` e corrigir com a flag `ignore` — único jeito de o tópico 10 do A2 sair do papel antes do T7
- Provar o loop infinito de propósito (objeto recriado nas deps), ver e corrigir
- Devolver o foco ao primeiro campo depois do sucesso
- Título vazio na edição na linha também avisar — hoje só o formulário de criar avisa
- Guarda contra duplo submit — hoje o envio é síncrono; volta no T8
- Erro não depender só de cor
- Extrair `useLocalStorage` — é T11; se fizer, registrar que antecipou
- Animar a abertura do rodapé com `grid-template-rows: 0fr → 1fr` — é T14

---

# Parte C — Revisão do código

> Revisão de 08/08.

## O app foi migrado para o assunto do tema?

**Sim.** As duas cadeias obrigatórias existem e estão corretas: formulário controlado de ponta a ponta, com validação e erro amarrado ao campo; e o par ler-por-inicializador / gravar-por-efeito.

Duas coisas ficaram de fora **de propósito**, por não serem assunto do tema:

- **Devolver o foco depois do sucesso.** O tópico 9 do T5 pede limpar no sucesso e preservar no erro — os dois estão feitos. Foco não está no tópico.
- **A edição na linha avisar quando o título é vazio.** O tópico 7 pede erro por campo no formato da API, e isso existe no formulário de criar. Repetir na edição é consistência de app.

Ambas foram para o Bloco 2.

## Typecheck

`npm run typecheck` — limpo.

## Testes

Não existem ainda (T13). Nada a verificar.
