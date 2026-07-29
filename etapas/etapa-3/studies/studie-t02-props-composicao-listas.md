# Estudo — Props, composição e listas (Tema 2)

> **O app ganha:** a lista de tarefas na tela a partir de um array fixo em código — `TaskList` e `TaskItem` tipados, sem API ainda.

---

# Parte A — Manual de consulta

## 1. Props: a entrada da função

**O que resolve?** No Tema 1 seus componentes eram fixos: `Content` sempre mostrava o mesmo campo, `Header` sempre o mesmo título. Props são o que transforma um componente num **molde**: a mesma função, dados diferentes, saídas diferentes. Mecanicamente não há mistério nenhum — os atributos que você escreve no JSX viram as chaves de **um único objeto** que o React passa como primeiro argumento da sua função.

**Quando usar?** Sempre que a mesma estrutura visual precisa aparecer com conteúdo diferente. Se você está prestes a copiar e colar um bloco de JSX trocando duas palavras, é prop.

**Exemplo:** o que você escreve e o que o React chama.

```tsx
// você escreve
<TaskItem title="Estudar React" done={false} />

// o React chama, por baixo
TaskItem({ title: 'Estudar React', done: false })
```

```tsx
// e a função recebe UM objeto — o nome "props" é convenção, não regra
function TaskItem(props: TaskItemProps) {
  return <li>{props.title}</li>;
}

// desestruturar na assinatura é o padrão da comunidade e o que você vai usar
function TaskItem({ title, done }: TaskItemProps) {
  return <li>{title}</li>;
}
```

**Fluxo de mão única.** O dado desce: pai → filho → neto. O filho **não** tem como alcançar o pai nem o irmão. Isso parece limitação e é a principal garantia de depuração do React: quando um valor está errado na tela, ele só pode ter vindo de um lugar — de cima. Você sobe a árvore até achar quem o produziu, e o caminho é finito. (Quando o filho precisa **avisar** o pai, a resposta não é quebrar o fluxo: é o pai passar uma função para baixo — Tema 4.)

**Armadilhas:** `<TaskItem done />` sem valor significa `done={true}` (herança do HTML). Passar número, booleano, objeto ou array exige chaves — `count={3}`, não `count="3"`, que é a string `"3"`. Confundir os dois nomes na hora de desestruturar dá `undefined` silencioso, não erro de runtime — em TypeScript isso vira erro de compilação, e é por isso que o tópico 2 existe.

## 2. Tipar props com `interface`/`type`

**O que resolve?** Sem tipo, prop errada é um `undefined` que aparece como buraco na tela três componentes abaixo. Com tipo, o erro acontece **na linha em que você usou o componente**. É o mesmo ganho que você teve na API com `parseTask`, só que de graça e em tempo de compilação.

**Quando usar?** Em todo componente que recebe props. Sem exceção nesta etapa.

**Exemplo:** siga a convenção que você já usa na API — **entidade/modelo = `interface`, derivado/união = `type`**.

```tsx
export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  status: Status;
  term: string | null;
}

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  return <li>{task.title}</li>;
}
```

**Dois desenhos possíveis, e o critério.** Ou o componente recebe **o objeto inteiro** (`task: Task`) ou recebe **campos soltos** (`title: string; status: Status`). Objeto inteiro é mais curto de escrever e acopla o componente à forma da entidade; campos soltos deixam o componente reutilizável fora do contexto de tarefa e são muito mais fáceis de testar (Tema 14). Para `TaskItem`, receber a `Task` é honesto — ele existe para exibir uma tarefa. Para um `Badge` que pinta o status, receber `status: Status` é melhor que receber a tarefa toda. **Escolha por componente e saiba defender.**

**Armadilhas:** `React.FC` você vai ver em tutorial — não use; ele não acrescenta nada em 2026, e nas versões antigas embutia `children` implicitamente, que era exatamente o problema. `verbatimModuleSyntax` está ligado: importar um tipo exige `import { type Task } from './types'` ou `import type { Task } from './types'`; sem isso o build reclama. E tipo de prop **não valida runtime** — é a mesma lição do `queryDb<T>` do Tema 4 da Etapa 2: o compilador acredita em você. Com array fixo em código isso não te morde; no Tema 7, quando o dado vier de `res.json()`, morde.

## 3. Props opcionais e `exactOptionalPropertyTypes` mordendo aqui também

**O que resolve?** Nem toda prop é obrigatória — um `TaskItem` pode ou não receber uma função de apagar. `?` marca isso. O que muda no seu projeto é que **`exactOptionalPropertyTypes` está ligado**, e ele separa duas coisas que a maioria dos projetos trata como iguais: **a chave ausente** e **a chave presente valendo `undefined`**.

**Quando usar?** Opcional é para o que realmente pode não existir. Se todo uso passa a prop, ela não é opcional — é obrigatória mal declarada.

**Exemplo:** o que compila e o que não compila.

```tsx
interface TaskItemProps {
  task: Task;
  highlight?: boolean;        // aqui o tipo é EXATAMENTE boolean | ausente
}

<TaskItem task={t} />                      // ✅ chave ausente
<TaskItem task={t} highlight={true} />     // ✅
<TaskItem task={t} highlight={undefined} /> // ❌ com exactOptionalPropertyTypes
```

```tsx
// se você PRECISA aceitar undefined explícito, declare:
highlight?: boolean | undefined;
```

**A confusão que vai aparecer no seu código:** repassar props com spread condicional. `{...(cond ? { highlight: true } : {})}` compila; `highlight={cond ? true : undefined}` não. Saiba dizer por quê.

**Armadilhas:** não confunda **prop opcional** (`highlight?: boolean`) com **campo nulável** (`term: string | null`). Sua `Task` tem `term: string | null` — o prazo **sempre existe como chave**, podendo valer `null`. `term?: string` seria um contrato diferente e **errado** em relação à API. Essa distinção cai na avaliação. E `null` no JSX não renderiza nada, então `{task.term}` com `term: null` some da tela em silêncio — se você quer "sem prazo" escrito, é decisão sua e vai de condicional (tópico 7).

## 4. Valor padrão de prop no TypeScript moderno

**O que resolve?** Dar um comportamento razoável quando a prop não veio, sem espalhar `?? 'algo'` pelo corpo do componente. A resposta em 2026 é **parâmetro com valor default na desestruturação** — JavaScript puro, sem API do React envolvida.

**Quando usar?** Prop opcional que tem um valor sensato por omissão.

**Exemplo:**

```tsx
interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = 'Nenhuma tarefa por aqui ainda.' }: EmptyStateProps) {
  return <p>{message}</p>;
}
```

**Armadilhas:** `defaultProps` **está removido** para componentes função no React 19 — se você achar em tutorial, o tutorial é velho. O default só dispara quando o valor é `undefined`: passar `null`, `0` ou `''` **não** aciona o default (e aí `0` vira zero mesmo, `''` vira string vazia; é o comportamento correto, mas surpreende). E cuidado com default de objeto ou array (`items = []`): ele é **recriado a cada render**, criando uma identidade nova toda vez — inofensivo hoje, mas é exatamente a causa de `React.memo` não funcionar e de `useEffect` entrar em loop, no Tema 12.

## 5. `children`: composição × configuração

**O que resolve?** `children` é a prop que o React preenche sozinho com o que estiver **entre** as tags de abertura e fechamento. Ela é o que permite um componente ter um "buraco" onde qualquer JSX cabe — e é a diferença entre um componente que envelhece bem e um que vira um painel de interruptores.

**Quando usar?** Sempre que o componente é um **invólucro**: card, painel, layout, modal. Ele cuida da moldura; quem chama decide o conteúdo.

**Exemplo:** o mesmo problema, resolvido dos dois jeitos.

```tsx
// ❌ CONFIGURAÇÃO — cada caso novo é uma prop nova
<Card title="Tarefas" showIcon iconName="check" showFooter footerText="3 itens" compact />

// ✅ COMPOSIÇÃO — o componente segura a moldura, você passa o conteúdo
<Card>
  <h2>Tarefas</h2>
  <TaskList tasks={tasks} />
  <footer>3 itens</footer>
</Card>
```

```tsx
interface CardProps {
  children: React.ReactNode;   // o tipo certo: aceita JSX, string, número, array, null
}

function Card({ children }: CardProps) {
  return <section className="card">{children}</section>;
}
```

**O critério.** Pergunte: *"a próxima variação vai exigir uma prop booleana nova?"* Se sim, o componente está sendo **configurado** e vai acumular `showX`, `hideY`, `variantZ` até ninguém entender a combinação. Composição não tem esse teto — o número de conteúdos possíveis é infinito e o componente não muda. E existe o meio-termo: **múltiplos buracos** (`header`, `footer` como props do tipo `ReactNode`), útil quando os buracos têm posições fixas.

**Armadilhas:** `React.ReactNode` é o tipo certo; `JSX.Element` é estreito demais (recusa string, array e `null`) e vai te forçar a `as` desnecessário. `children` é uma prop como outra qualquer — `<Card children={<p>oi</p>} />` funciona e é feio; não escreva. E composição não é sempre a resposta: prop simples de dado (`title="Tarefas"`) continua sendo prop simples — o alerta é contra prop **booleana de comportamento** se multiplicando.

## 6. `map` e a razão de existir da `key`

**O que resolve?** Renderizar N itens sem escrever N vezes. `map` transforma o array de dados num array de JSX, e o React sabe renderizar array. A parte que **importa de verdade** é a `key`: entre um render e o próximo, o React precisa decidir, para cada elemento da lista nova, **qual elemento da lista velha ele é**. Sem identidade estável, a única coisa que ele tem é a posição — e posição muda quando você insere, remove ou reordena.

**Quando usar?** `map` em toda lista. `key` em todo `map` — não é opcional, o React avisa no console.

**Exemplo:**

```tsx
<ul>
  {tasks.map(task => (
    <TaskItem key={task.id} task={task} />
  ))}
</ul>
```

**O que quebra com `key={index}`.** Imagine a lista `[A, B, C]` com `key` sendo 0, 1, 2. Você apaga o **A**. Agora a lista é `[B, C]`, com `key` 0 e 1. O React compara: a `key` 0 antes era A e agora é B — para ele, **o item 0 não sumiu, ele mudou de conteúdo**. Ele mantém o mesmo nó do DOM e o mesmo estado interno, e só troca o texto. Consequências reais: o `<input>` que você digitou fica com o valor do item errado, o checkbox marcado se cola no item de baixo, o item que estava com foco continua focado no lugar errado. E, no Tema 10, a animação de saída anima o item errado — porque, do ponto de vista do React, ninguém saiu.

**Por que o id do banco é a boa chave aqui.** Sua `Task` tem `id` uuid gerado pelo Postgres: único, estável, e o mesmo antes e depois de qualquer reordenação ou filtro. É exatamente o que a `key` pede.

**Armadilhas:** `key={index}` **não** é sempre errado — é aceitável quando a lista nunca reordena, nunca recebe inserção no meio, nunca remove e os itens não têm estado. Sua lista de tarefas viola as quatro condições, então aqui é errado. A `key` vai no **elemento devolvido pelo `map`**, não dentro do componente filho. `key` **não é uma prop** — `props.key` é `undefined` dentro do componente; se você precisa do id lá dentro, passe `id={task.id}` também. `Math.random()` como `key` é o pior caso possível: identidade nova a cada render, o React destrói e recria tudo sempre. E a `key` só precisa ser única **entre irmãos**, não no app inteiro.

## 7. Renderização condicional

**O que resolve?** Mostrar ou esconder parte da tela conforme o dado. Como JSX é expressão, você usa os operadores do próprio JavaScript — não existe `v-if` nem `*ngIf`.

**Quando usar?** As três formas, cada uma no seu lugar: `&&` para "mostra ou não mostra"; ternário para "mostra A ou B"; **early return** quando o componente inteiro muda de cara.

**Exemplo:**

```tsx
// && — um caminho só
{task.term && <span className="term">Prazo: {task.term}</span>}

// ternário — dois caminhos
{task.status === 'done' ? <s>{task.title}</s> : <span>{task.title}</span>}

// early return — o componente inteiro é outro
function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) return <EmptyState />;
  return <ul>{tasks.map(t => <TaskItem key={t.id} task={t} />)}</ul>;
}
```

**A armadilha do `0 &&`.** `a && b` devolve `a` quando `a` é falsy — ele **não** devolve `false`. O JSX ignora `false`, `null` e `undefined`, mas **renderiza `0`**, porque `0` é número e número aparece na tela. Então:

```tsx
{tasks.length && <p>Você tem tarefas</p>}   // ❌ com lista vazia, imprime um "0" solto na tela
{tasks.length > 0 && <p>Você tem tarefas</p>} // ✅ agora a esquerda é boolean de verdade
```

O mesmo vale para `''` (string vazia, que não aparece mas também não é o que você quis dizer). **Regra:** à esquerda do `&&` sempre uma expressão booleana explícita.

**Armadilhas:** ternário aninhado dentro de JSX é ilegível depois do segundo nível — extraia para uma função acima do `return` ou para um componente. `if` não entra dentro de chaves (é declaração, não expressão) — daí o early return. E, quando você usa o ternário para trocar **componentes diferentes na mesma posição**, o React destrói o estado do que saiu (Tema 1, tópico 10) — hoje é inofensivo, no Tema 5 vai apagar o que o usuário digitou.

## 8. Estado vazio como caso de primeira classe

**O que resolve?** A lista vazia é o **primeiro** estado que todo usuário novo vê, e é o mais fácil de esquecer porque durante o desenvolvimento o array sempre tem três itens fixos. Uma tela em branco não comunica nada: o usuário não sabe se carregou, se deu erro, se ele não tem nada ou se o app está quebrado.

**Quando usar?** Em toda tela que renderiza uma coleção. Hoje é um dos quatro estados; no Tema 7 os outros três (carregando, erro, sucesso) se juntam a ele.

**Exemplo:** o que um estado vazio decente tem.

```tsx
function EmptyState() {
  return (
    <div className="empty">
      <p>Nenhuma tarefa por aqui ainda.</p>
      <p>Crie a primeira e ela aparece nesta lista.</p>
    </div>
  );
}
```

Três partes: **diz o que está acontecendo** (não tem nada), **diz que isso é normal** (não é erro), e **diz o próximo passo** (o que fazer para sair daqui).

**Armadilhas:** "vazio" não é "erro" e não é "carregando" — três situações, três mensagens; misturá-las é o defeito que a avaliação testa (*"lista vazia e primeiro acesso: não pode ser tela em branco sem explicação"*). Não renderize um `<ul>` vazio achando que resolveu — HTML válido e inútil. E `<EmptyState />` ainda é um componente: vale a mesma decisão do tópico 9 sobre extrair ou não.

## 9. Quando quebrar um componente em dois — e o custo de quebrar cedo demais

**O que resolve?** Componente grande demais fica ilegível; componente pequeno demais te faz pular entre sete arquivos para entender uma tela. Não existe número mágico de linhas — existem **sinais**.

**Quebre quando:** o mesmo bloco aparece em dois lugares (reuso real, não imaginado); o componente tem dois motivos claros para mudar (a moldura e a linha da lista); você precisa de um nome para explicar o bloco para outra pessoa; ou o bloco vai precisar de estado próprio (Tema 4).

**Não quebre quando:** o único motivo é "o arquivo está grande"; o reuso é hipotético ("um dia posso precisar"); ou a separação exige passar seis props para reconstruir o contexto que o componente já tinha de graça.

**Exemplo:** o recorte deste tema.

```
TaskList   ← recebe o array, decide vazio × lista, faz o map, cuida da key
TaskItem   ← recebe UMA task, decide como uma tarefa se parece
```

Duas responsabilidades diferentes: uma é sobre a **coleção**, a outra é sobre o **item**. É por isso que este recorte é certo, não porque "list e item é o padrão".

**Armadilhas:** o custo de quebrar cedo é **prop drilling** — dado atravessando componentes que não o usam, só repassando (o sintoma que abre o Tema 13). Abstração criada antes do segundo caso de uso quase sempre é a abstração errada, e desfazê-la custa mais que ter esperado. E não confunda **arquivo** com **componente**: separar em arquivos é organização; separar em componentes é desenho.

## 10. Colocação de arquivos

**O que resolve?** Onde a coisa mora. Duas escolas: **por tipo** (`components/`, `hooks/`, `types/`) e **por feature** (`tasks/` com componentes, hooks e tipos daquele domínio juntos). Por tipo é mais simples e funciona bem enquanto o app é pequeno; por feature escala melhor porque tudo que muda junto fica junto — e é o que você encontra em vaga de trabalho com codebase grande.

**Quando usar?** Hoje o app tem um domínio só (tarefas). Comece por tipo, com uma subpasta por área dentro de `components/`, e **registre a decisão no `web/README.md`**. Reorganizar depois é barato e você vai ter vivido o motivo.

**Exemplo:** um caminho razoável para hoje.

```
src/
├── components/
│   ├── Header.tsx
│   ├── Content.tsx
│   └── tasks/
│       ├── TaskList.tsx
│       ├── TaskItem.tsx
│       └── EmptyState.tsx
├── types/
│   └── task.ts
├── data/
│   └── mockTasks.ts     ← o array fixo, e ele MORRE no Tema 7
├── App.tsx
└── main.tsx
```

**Armadilhas:** um componente por arquivo, com o **nome do arquivo igual ao do componente** — `TaskItem.tsx` exporta `TaskItem`. Escolha entre `export default` e export nomeado e seja **consistente**: default permite renomear na importação (dois nomes para a mesma coisa, ruim para buscar no projeto); nomeado força o nome e ajuda o auto-import. Você já tem `export default` no `App`, `Header` e `Content` — mantenha ou converta tudo, não misture. E não crie `utils/` no dia 1: pasta sem critério vira depósito.

## 11. Onde mora a `interface Task` — e por que é cópia deliberada

**O que resolve?** O front precisa do tipo `Task`. A API já tem esse tipo escrito, em `api/src/`. A tentação é importar de lá — dois projetos, uma verdade, zero duplicação. **Não faça.** Escreva a `Task` de novo, na `web/src/types/task.ts`, a partir do que está no **`api/README.md`** — o contrato, não o código.

**Por quê?** Três razões, e as três são resposta de entrevista:

1. **O contrato entre front e back é HTTP e JSON, não TypeScript.** O tipo da API descreve a entidade **de dentro** — inclui coisas que o front nunca vê (a coluna `created_at` existe na tabela e **não é exposta em resposta nenhuma**). Copiar o tipo interno traria mentiras para o front.
2. **Acoplamento de build.** Importar de `../etapa-2/api/src` faria a `web/` depender do código-fonte da API para compilar — as duas passam a subir juntas, e o front deixa de poder ser publicado sozinho, que é exatamente o que o Tema 11 vai fazer.
3. **Independência de deploy é o ponto.** Front e back mudam em ritmos diferentes. A cópia deliberada é o que permite a API mudar por dentro sem quebrar o build do front — e o que faz uma mudança de contrato **doer visivelmente** em vez de passar despercebida.

**Exemplo:** o tipo do front, escrito a partir do contrato.

```ts
// src/types/task.ts — cópia deliberada de api/README.md
export type Status = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;            // uuid gerado pelo banco
  title: string;
  status: Status;
  term: string | null;   // prazo (data em texto) ou null — chave sempre presente
}
```

**Armadilhas:** cópia deliberada tem um custo real e honesto — se a API mudar o contrato, **nada avisa**, e o front descobre em runtime. É por isso que o `api/README.md` é a fonte de verdade e precisa ficar correto: ele é o que impede a cópia de virar divergência. O jeito profissional de fechar essa brecha é validar a resposta em runtime (zod) ou gerar o tipo de um contrato compartilhado (OpenAPI) — os dois ficam para depois, mas saber que existem é o que separa "eu copiei" de "eu escolhi copiar". E `term` é `string | null`, não `string | undefined` nem opcional: JSON não tem `undefined`.

---

# Parte B — Aplicação na `web/`

### 1. Preparação do ambiente

**Nada.** Este tema não precisa de ferramenta nova — o projeto do Tema 1 já tem tudo. É código seu do começo ao fim.

Uma única conferência antes de começar: o React DevTools tem que estar instalado (era do Tema 1). Você vai usá-lo neste tema para ver as props chegando em cada `TaskItem` — sem ele você vai depurar por `console.log`, que é mais lento e você já tem coisa melhor.

### 2. O que do tema deve aparecer na `web/`

Partindo da linha "O app ganha" e expandindo:

- **O tipo `Task` nasce na `web/`**, escrito por você a partir do `api/README.md` — `id`, `title`, `status`, `term`. Nada de importar da `api/`, nada de `created_at`. Um comentário de uma linha registrando que é cópia deliberada.
- **Um array fixo de tarefas** em módulo próprio, com **pelo menos 5 itens** cobrindo os três status e **pelo menos um com `term: null`**. Ids no formato uuid, não `"1"`, `"2"` — o formato tem que ser o mesmo que virá do banco no Tema 7, ou você vai descobrir os problemas de `key` tarde demais.
- **`TaskList` e `TaskItem` existindo de verdade**, com props tipadas e o recorte de responsabilidade do tópico 9: a lista cuida da coleção, o item cuida do item. `TaskList` recebe o array por prop — quem passa é o `App`. Nenhum dos dois importa o array fixo diretamente.
- **`key={task.id}`** e você sabendo dizer, em voz alta, o que quebraria com `key={index}` na sua lista.
- **O estado vazio funcionando**, e **provado**: passe `tasks={[]}` e veja a mensagem. Deve dizer o que aconteceu e qual é o próximo passo. Volte o array depois — mas essa alternância é a demonstração do tema.
- **Pelo menos uma condicional de cada tipo** usada com propósito: um `&&` (o prazo que só aparece quando existe — cuidado com o tópico 7), um ternário ou classe condicional (a tarefa `done` com cara diferente das outras), e um early return (o vazio).
- **Uma prop opcional com valor padrão**, exercitando o tópico 4 — e você conferindo que `exactOptionalPropertyTypes` recusa `prop={undefined}`. Provoque o erro de propósito, leia a mensagem, entenda, desfaça.
- **Uma composição com `children`** — um invólucro (`Card`, `Section`, `Panel`, o nome é seu) recebendo JSX em vez de mais uma prop booleana. Um só, bem feito; não force o app inteiro a virar composição.
- **A contagem de tarefas na tela** calculada a partir do array (`tasks.length`, ou quantas estão `done`) — o `{1 + 1}` chumbado do Tema 1 no `App.tsx` **morre aqui**.
- **Arquivos colocados com critério** e a decisão de organização escrita no `web/README.md`, junto com o mapa de pastas atualizado.
- **`npm run typecheck` limpo** e nenhum aviso no console do navegador — em especial nenhum `Each child in a list should have a unique "key" prop`.
- **`web/README.md` atualizado** (regra 5): o que o app faz agora, a estrutura nova, e as decisões deste tema — organização de pastas, e por que a `Task` é cópia e não import.
- **Commits `t02: ...`** e push conferido.

### 3. Critérios

- `TaskList` renderiza o array recebido por prop; trocar o array fixo muda a tela sem tocar em nenhum componente.
- Passar `tasks={[]}` mostra o estado vazio, não uma tela em branco nem um `<ul>` vazio.
- Nenhum `key={index}`, nenhum `key={Math.random()}`, nenhum aviso de `key` no console.
- Nenhum `&&` com número ou string à esquerda — as condições são booleanas explícitas.
- `Task` está definida na `web/`, com `term: string | null`, e não há import vindo de fora da `web/`.
- Zero mutação de prop: nenhum `props.x = ...`, nenhum `task.status = 'done'`, nenhum `tasks.push(...)`.
- `npm run typecheck` limpo — inclusive com `exactOptionalPropertyTypes` e `noUncheckedIndexedAccess` ligados.
- Na aba Components do DevTools aparecem N `TaskItem` sob um `TaskList`, cada um com a sua `task` nas props.
- Nenhum `document.querySelector`, nenhum estado ainda (`useState` é Tema 4 — se você sentiu falta dele, anote no devlog; é exatamente a lacuna que o próximo tema preenche).
- Você consegue explicar por que `TaskItem` recebe `task` inteira e não campos soltos — ou o contrário, se você escolheu o contrário.

### 4. Revisão do código

Me chama no fim; eu leio a `web/` inteira e aponto de forma simples onde estão os erros e o que faltou, pra você corrigir.
