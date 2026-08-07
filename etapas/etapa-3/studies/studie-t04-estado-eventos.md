# Estudo — Estado e eventos (Tema 4)

> Refeito em 07/08 no formato da **regra 5** do `plano.md` (Parte A / Parte B / Parte C). A v1 (`studie-t04-estado-eventos.md`) seguia o formato antigo e fica como histórico.

> **O tema, em uma frase:** até o T3 o React desenhou o que você deu a ele; a partir daqui ele desenha o que o **usuário fez**.

---

# Parte A — Os tópicos

## 1. Estado

**O que é.** Um valor que o React guarda **fora** da função do componente, devolve a cada render, e cuja troca **agenda** um novo render. Uma variável comum (`const tasks = mockTasks`) nasce e morre dentro de um render.

**Para que serve.** É o que permite a tela mudar sem você tocar no DOM. Substitui o `document.querySelector(...).textContent = x` da Etapa 1: você troca o dado, o React descobre o que redesenhar.

**Exemplo.**

```tsx
let count = 0;
const Counter = () => <button onClick={() => count++}>{count}</button>; // ❌ muda, tela não sabe

const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>; // ✅
};
```

## 2. `useState`

**O que é.** Hook que devolve um par: `[valor, setter]`. O argumento é o valor **inicial** — usado na primeira montagem e ignorado depois. Se o valor inicial custa caro, passa-se uma função (`useState(() => calcular())`) e ela roda uma vez só.

**Para que serve.** Dá memória ao componente. E o setter **agenda**, não altera: `count` é constante daquele render, então `console.log(count)` logo depois do setter mostra o valor antigo — não é bug, é o modelo.

**Exemplo.**

```tsx
const [tasks, setTasks] = useState<Task[]>(mockTasks);
//     ↑ valor deste render  ↑ pede o próximo render
```

## 3. Imutabilidade

**O que é.** Nunca alterar o objeto/array que está no estado — sempre criar um novo. `[...arr]`, `{...obj}`, `map`, `filter`. Os métodos que **mutam** e não servem: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`.

**Para que serve.** O React compara a referência antiga com a nova por `Object.is`. `tasks.push(x)` devolve o mesmo array — mesma referência, nenhum render. Não é boa prática, é mecânica.

**Exemplo.**

```tsx
setTasks([...tasks, nova]); // adicionar
setTasks(tasks.filter((t) => t.id !== id)); // remover
setTasks(tasks.map((t) => (t.id === id ? { ...t, status: 'done' } : t))); // trocar um
```

No `map`, os itens não alterados voltam **por referência** — é isso que deixa o React saber que só uma linha mudou.

## 4. Atualização funcional

**O que é.** `setX(prev => novo)` em vez de `setX(novo)`. Passa uma receita, não um valor; o React aplica sobre o mais recente da fila.

**Para que serve.** Remove a classe de bug em que duas atualizações no mesmo evento leem o mesmo valor velho. Obrigatória quando o novo depende do antigo, quando é assíncrono, ou dentro de `useEffect` com deps enxutas.

**Exemplo.**

```tsx
setCount(count + 1);
setCount(count + 1); // resultado: +1
setCount((p) => p + 1);
setCount((p) => p + 1); // resultado: +2
```

## 5. Eventos

**O que é.** `onClick`, `onChange`, `onSubmit` no JSX. O objeto que chega ao handler é **sintético** — normalização do React com a mesma API do nativo (`e.target`, `e.currentTarget`, `e.preventDefault()`).

**Para que serve.** Substitui `addEventListener` espalhado. `e.currentTarget` é onde você pendurou o handler (e vem bem tipado); `e.target` é quem originou o evento e pode ser um filho.

**Exemplo.**

```tsx
<Button onClick={handleClick}>Alterar</Button>                    // ✅ passa a função
<Button onClick={handleClick()}>Alterar</Button>                  // ❌ chama no render
<Button onClick={() => onChangeTask(task.id)}>Alterar</Button>    // ✅ precisa de argumento
```

## 6. Função como prop

**O que é.** Uma prop cujo valor é função. O filho a chama quando algo acontece; quem decide o que fazer é o pai.

**Para que serve.** Props descem, eventos sobem. Sem isso, a regra de negócio vaza para o componente de apresentação e ele deixa de ser reutilizável e testável. Convenção: a prop é `onAlgo` (o que aconteceu), a função no pai é `handleAlgo` (o que se faz).

**Exemplo.**

```tsx
// pai decide
const handleChangeTask = (id: string) => setTasks((prev) => prev.map(/* ... */));

// filho só avisa
<Button onClick={() => onChangeTask(task.id)}>Alterar</Button>;
```

## 7. Lifting state up

**O que é.** Mover o estado para o **ancestral comum mais próximo** de todos os componentes que leem ou mudam aquele valor.

**Para que serve.** Faz dois componentes concordarem sobre um valor sem duplicá-lo. Substitui a cópia local que diverge e o `useEffect` de sincronização que viria atrás dela.

**Exemplo.** No app: `Content` é o ancestral comum de `FilledTasks`, `EmptyTasks` e `InputTask` — o estado mora ali. `HomePage` e `App` não precisam saber da lista.

## 8. Estado derivado

**O que é.** Valor calculado durante o render a partir do que já é estado. Não usa `useState`.

**Para que serve.** Elimina duplicação de verdade. Contadores, listas filtradas/ordenadas/agrupadas, "o botão está habilitado" — tudo isso é conta, não informação nova.

**Exemplo.**

```tsx
const todo = tasks.filter((t) => t.status === 'todo');   // ✅ derivado
const [todo, setTodo] = useState(...);                   // ❌ precisa ser mantido em dia à mão
```

Pergunta que resolve o caso duvidoso: _se eu apagar esse `useState`, consigo recalcular o valor a partir do que sobrou?_

## 9. Estado impossível

**O que é.** Modelar o estado para que a combinação inválida **não seja representável**. Três booleanos independentes têm 8 combinações; se só 3 fazem sentido, você criou 5 estados impossíveis.

**Para que serve.** Troca uma pilha de `if` defensivos por uma união de tipos que o TypeScript cobra. Também troca escada de condicional por mapa exaustivo.

**Exemplo.**

```tsx
const [mostrarTodo, setMostrarTodo] = useState(true); // ❌ ×3
const [filtro, setFiltro] = useState<Status | 'all'>('all'); // ✅

const proximo: Record<Status, Status> = { todo: 'doing', doing: 'done', done: 'todo' };
```

`Record<Status, Status>` é exaustivo por construção: esquecer um caso vira erro de compilação.

## 10. Um objeto × vários `useState`

**O que é.** A decisão de agrupar ou separar estados. Critério: **agrupe o que muda junto, separe o que muda por motivos diferentes.**

**Para que serve.** Vários `useState` pequenos é o padrão. Um objeto se justifica no formulário do T5, onde os campos mudam no mesmo evento. O custo do objeto: toda atualização vira `setX(p => ({ ...p, campo }))`, e esquecer o spread apaga os outros campos em silêncio — `useState` não faz merge.

**Exemplo.**

```tsx
const [tasks, setTasks] = useState<Task[]>(mockTasks); // muda por clique no item
const [filtro, setFiltro] = useState<Status | 'all'>('all'); // muda por clique no filtro
```

## 11. Estado local × estado que sobe

**O que é.** A pergunta prática: **quem mais precisa saber disso?**

**Para que serve.** Evita os dois extremos. Estado que sobe demais faz metade da árvore re-renderizar por causa de um clique (T12 vai medir isso); estado que fica preso embaixo obriga a duplicar.

**Exemplo.**

| Estado                     | Onde mora                                     |
| -------------------------- | --------------------------------------------- |
| lista de tarefas           | `Content` — vários dependem                   |
| menu do `Header`           | `Header` — ninguém mais precisa               |
| texto sendo digitado       | onde o campo está — rascunho é de quem digita |
| "salvando esta linha" (T8) | no item, não na página                        |

Regra: comece local, suba quando doer.

## 12. React DevTools

**O que é.** Aba **Components**: mostra o estado real de cada instância. `Highlight updates when components render` (engrenagem) pinta borda em quem re-renderizou.

**Para que serve.** Troca "acho que mudou" por "vi mudar". Os três diagnósticos que resolvem quase todo bug deste tema:

1. estado mudou, tela não → você mutou (tópico 3);
2. nem estado, nem tela → o handler não rodou (tópico 5);
3. mudou no pai, não chegou no filho → a prop não desceu.

---

# Parte B — Alterações no app

### 1. Preparação do ambiente

Nenhuma. `useState` vem no React já instalado — primeiro tema com atrito zero. Só abra o **React DevTools** na aba Components e deixe assim o tema inteiro.

### 2. Os blocos

#### Bloco 1 — Obrigatório

[X] `Content` com `useState<Task[]>(mockTasks)`; a linha `const tasks = mockTasks` não existe mais
[X] O botão **Alterar** muda o status de verdade e a tarefa troca de card
[X] `handleChangeTask` mora no `Content`; `ItemTask` só avisa que clicaram
[X] Prop tipada com assinatura completa (`(id: string) => void`), nomeada `onAlgo` / `handleAlgo`
[X] Atualização funcional e imutável: `setTasks(prev => prev.map(...))` com `{ ...t, status }`
[X] Contadores e listas por status continuam **derivados**, sem `useState`
[X] Ids únicos no `mockTasks`; console sem aviso de `key`
[X] Import comentado de `empty` removido do `Content`
[X] `npm run typecheck` limpo

#### Bloco 2 — Médio / avançado (sugestões)

[X] **Trocar a escada de `if` por `Record<Status, Status>`** na transição de status — exaustivo por construção, é o tópico 9 aplicado
[X] **Um filtro modelado como união** (`Status | 'all'`) ou `Set<Status>` — o único lugar do tema onde estado impossível aparece de verdade. Como a tela já agrupa por status, o filtro precisa fazer algo novo: colapsar num card só, alternar quais cards aparecem, ou filtrar por texto
[ ] **Extrair a regra de transição** para `utils/` ou `types/task.ts` — a regra é do domínio, não do componente
[ ] **`trim()` no `InputTask`** antes de criar: hoje dá para adicionar tarefa com descrição vazia
[X] **Botão desabilitado quando não há transição possível** — hoje "Alterar" numa tarefa `done` não faz nada e não avisa
[X] **Um `id` gerado num só lugar** — `crypto.randomUUID()` está inline no handler; quando o T7 chegar, o id passa a vir do banco e esse ponto muda
[X] **Mover `InputTask` de `layout/` para o domínio** — ele virou filho do `Content` e só existe para criar tarefa

#### Bloco 3 — Design e acessibilidade (sugestões)

[ ] **Card vazio ficou mudo:** `{done.length > 0 && <ListTasks />}` deixa título com espaço branco embaixo quando o card esvazia. Precisa de mensagem própria, e que diga o que fazer
[ ] **Botão "Alterar" não diz o quê:** `aria-label` com a descrição da tarefa. É o que o `getByRole('button', { name })` do T14 procura
[ ] **Botão "X" idem** — um leitor de tela lê "X, botão". `aria-label="Apagar <tarefa>"`
[ ] **Botão X está sobreposto ao conteúdo** (`absolute top-0 right-0`): conferir alvo de toque mínimo e se ele não cobre texto em telas estreitas
[ ] **Se o filtro entrar:** o estado ativo precisa ser perceptível **sem depender só de cor** (`aria-pressed`, ícone ou `<select>`)
[ ] **Se o filtro entrar:** "nenhuma tarefa passou no filtro" é diferente de "não existe tarefa" — `EmptyTasks` não serve para os dois
[ ] **`aria-live` na região das listas** para anunciar que a tarefa mudou de card sem o usuário ter visto
[ ] **Teclado:** `Tab` até o botão, `Enter`, status muda; `Tab` até o campo, `Enter` adiciona

---

# Parte C — Revisão do código

## O app foi migrado para o assunto do tema?

**Sim.** A cadeia completa existe e está correta: evento no filho → callback → atualização imutável no pai → re-render.

| Item                                                 | Estado             |
| ---------------------------------------------------- | ------------------ |
| `useState` no `Content`, ancestral comum certo       | ✅                 |
| Atualização funcional (`prev =>`) nos três handlers  | ✅                 |
| Imutabilidade (`map`, `filter`, spread)              | ✅                 |
| Regra de negócio no pai, `ItemTask` burro            | ✅                 |
| Props tipadas com assinatura, nomeadas `on`/`handle` | ✅                 |
| Estado derivado nos `filter` do `FilledTasks`        | ✅                 |
| Ids únicos no `mockTasks`                            | ✅                 |
| Input controlado no `InputTask`                      | ✅ (antecipa o T5) |
| Estado impossível — nenhum exemplo no código         | ⚠️                 |
| Import comentado de `empty` no `Content:3`           | ❌                 |

**Além do previsto:** adicionar (`InputTask`) e apagar (`handleDeleteTask`) foram feitos, o que antecipa parte do T5 e do T8. Fica registrado como antecipação consciente, não como escopo perdido.

## Typecheck e testes

- `npm run typecheck` — rodar e confirmar limpo. Ponto de atenção: no `handleChangeTask`, `{ ...task, status: 'doing' }` só compila porque o retorno do `map` recebe contexto de `Task[]` via `setTasks`. Se o handler for extraído para fora, o literal vira `string` e quebra.
- Testes — não existem ainda (T14). Nada a verificar.

## Correções pendentes

1. Apagar o import comentado de `empty` (`content/index.tsx:3`)
2. `aria-label` nos botões "Alterar" e "X"
3. Mensagem no card vazio
4. `trim()` no `InputTask`
5. Decidir o que "Alterar" faz numa tarefa `done` — ciclar, desabilitar, ou justificar por escrito

## Fechamento do tema (regra 6)

- [ ] Correções da Parte C aplicadas
- [ ] `npm run typecheck` limpo
- [ ] Console do navegador sem aviso
- [ ] Teclado: criar e alterar sem mouse
- [ ] `web/README.md` atualizado — "O que faz hoje", Limitações, Estrutura e as decisões do tema
- [ ] Devlog do dia escrito
- [ ] `plano.md` e README da raiz com T4 ✅
- [ ] Commit e push conferido em `.git/refs/remotes/origin/main`
