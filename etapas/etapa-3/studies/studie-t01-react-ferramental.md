# Estudo — React e ferramental (Tema 1)

> **O app ganha:** ele nasce aqui — projeto Vite com React + TypeScript rodando em `localhost:5173`, com a primeira árvore de componentes na tela.

---

# Parte A — Manual de consulta

## 1. O problema que o React resolve

**O que resolve?** Na Etapa 1 você tinha uma verdade em dois lugares: o array de tarefas na memória e os nós do DOM na tela. Toda mudança exigia que **você** descrevesse o caminho — achar o `<li>`, trocar o `textContent`, remover a classe, reordenar. Quanto mais estados a tela tem, mais combinações de transição existem, e o bug clássico aparece: a tela e o dado discordam. O React inverte isso — você escreve uma função que, **dado o estado, devolve como a tela deve estar**, e a biblioteca calcula a diferença entre o que está pintado e o que você descreveu (reconciliação) e aplica só o delta.
**Quando usar?** Interface com muitos estados que se cruzam (carregando × erro × vazio × filtro × item sendo salvo). Uma landing page estática não precisa disso.
**Exemplo:** a mesma tarefa, dos dois jeitos.

```js
// Etapa 1: você descreve o CAMINHO
const li = document.querySelector(`[data-id="${id}"]`);
li.classList.toggle('done');
li.querySelector('.check').checked = true;
counter.textContent = tasks.filter(t => t.status === 'done').length;
```

```tsx
// React: você descreve o DESTINO
<li className={task.status === 'done' ? 'done' : ''}>...</li>
// mudou o estado → o React refaz a descrição e reconcilia
```

**Armadilhas:** o React **não** é rápido por mágica — ele troca trabalho seu por trabalho dele, e em troca ganha previsibilidade. Achar que "React resolve estado" é o erro seguinte: ele resolve **sincronizar a tela com o estado**; modelar o estado direito continua sendo seu trabalho (Tema 4). E o pecado mortal do ex-usuário de DOM: continuar chamando `document.querySelector` dentro de componente para "dar um jeitinho" — isso rompe o contrato e o React vai sobrescrever você no próximo render.

## 2. SPA × páginas servidas

**O que resolve?** A SPA (Single Page Application) manda **uma** casca HTML praticamente vazia; o JavaScript monta o resto no navegador e, dali em diante, trocar de tela não recarrega a página — o servidor vira só uma fonte de JSON. Ganha-se navegação instantânea, estado que sobrevive entre telas e uma separação limpa entre front e back (exatamente a sua `web/` × sua `api/`).
**Quando usar?** App atrás de interação — painel, editor, gerenciador de tarefas. Conteúdo público que precisa aparecer no Google pede renderização no servidor.
**Exemplo:** o que o servidor devolve numa SPA é isto, e mais nada:

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

**Armadilhas:** o custo é real e você vai pagar cada um deles nesta etapa — **primeiro carregamento** (tela branca até o JS baixar e executar; volta no Tema 11 com bundle e code splitting), **SEO** (o robô que não executa JS vê a `div` vazia), **botão voltar e F5** (o histórico do navegador deixa de funcionar sozinho: é o Tema 9, e o F5 numa rota interna dá 404 no servidor até você configurar o fallback, Tema 11). Nada disso é defeito do React, é consequência da escolha — e saber recitar essa lista é resposta de entrevista.

## 3. Declarativo × imperativo

**O que resolve?** Imperativo é a receita (**como** chegar lá); declarativo é a foto do prato pronto (**o que** deve existir). O código declarativo é legível de cima para baixo porque cada trecho descreve um resultado, não uma sequência de mutações — e por isso você consegue olhar um componente e saber o que a tela mostra sem simular a execução na cabeça.
**Quando usar?** Como padrão dentro do React. Imperativo continua existindo nas bordas — focar um input, medir um elemento, tocar um vídeo — e para isso existe o `useRef` (Tema 12).
**Exemplo:**

```js
const li = document.createElement('li');   // imperativo
li.className = 'task';
li.textContent = task.title;
list.appendChild(li);
```

```tsx
<li className="task">{task.title}</li>     {/* declarativo */}
```

**Armadilhas:** "declarativo" não quer dizer "sem lógica" — quer dizer que a lógica calcula **o que exibir**, não **como alterar o que já está exibido**. E existe um custo escondido: quando algo dá errado no declarativo, você não tem uma linha para colocar `console.log` no meio da mutação; a depuração muda de lugar (vai para o estado e para o DevTools, tópico 11).

## 4. JSX de verdade

**O que resolve?** JSX é **açúcar sintático para chamada de função**. `<Button color="red">oi</Button>` vira `jsx(Button, { color: 'red', children: 'oi' })`. Não é HTML dentro do JS e não é template string: é expressão JavaScript que devolve um objeto descrevendo o que renderizar. Todas as regras "estranhas" caem quando você lembra disso.
**Quando usar?** Sempre. `React.createElement` na mão é para entender, não para escrever.
**Exemplo:** as regras e o motivo de cada uma.

```tsx
// 1. className, não class → `class` é palavra reservada do JS
<div className="card" />

// 2. htmlFor, não for → mesma razão
<label htmlFor="title">Título</label>

// 3. chaves = "aqui volta a ser JavaScript"
<p>{task.title.toUpperCase()}</p>
<img src={url} style={{ marginTop: 8 }} />   // objeto, camelCase, número vira px

// 4. um só nó raiz → uma função devolve UM valor
return (
  <>
    <h1>Tarefas</h1>
    <ul />
  </>
);
```

**Armadilhas:** dentro das chaves só cabe **expressão** — `if`, `for` e `const` são declarações e não entram (use ternário, `&&`, `map`, ou calcule antes do `return`). Comentário dentro do JSX é `{/* assim */}`. `{}` renderiza `string`/`number`/JSX/array, **ignora** `null`, `undefined`, `false` e `true`, e **estoura** com objeto (`Objects are not valid as a React child` — o erro mais comum do primeiro dia; quase sempre é uma data ou um objeto que você esqueceu de formatar). `return` seguido de quebra de linha sem parênteses devolve `undefined` — o ASI do JavaScript te morde aqui. E atenção ao TypeScript: em `.tsx`, `<T>(x: T) => x` é ambíguo com uma tag; o arquivo precisa da extensão `.tsx` justamente porque o parser muda.

## 5. Componente é função que devolve JSX

**O que resolve?** A unidade de reuso e de leitura. Uma função que recebe dados e devolve descrição de tela — com nome, testável, e que aparece nomeada na árvore do DevTools.
**Quando usar?** Sempre; o critério de **quando quebrar em dois** é assunto do Tema 2.
**Exemplo:**

```tsx
function TaskCounter() {
  return <p>3 tarefas</p>;
}

// uso
<TaskCounter />
```

**Armadilhas:** a **maiúscula não é estética, é semântica**: no JSX compilado, `<taskCounter />` vira a string `'taskCounter'` (elemento HTML desconhecido, some da tela sem erro) e `<TaskCounter />` vira a referência à sua função. Perder meia hora com uma tela em branco por causa disso é rito de passagem — pule. Outros dois: componente declarado **dentro** de outro componente é recriado a cada render e o React o trata como um tipo novo (destrói e remonta a subárvore, perdendo estado — volta no Tema 12); e chamar `Componente()` como função comum "funciona", mas não cria um nó na árvore, então hooks e estado se comportam de forma diferente — invoque sempre via `<Componente />`.

## 6. Vite: dev server × build

**O que resolve?** Duas coisas diferentes com uma ferramenta só. Em **desenvolvimento**, o Vite não empacota nada: serve seus arquivos como módulos ES nativos, transformando cada um sob demanda — por isso o servidor sobe instantaneamente por maior que o projeto fique. Em cima disso vem o **HMR** (Hot Module Replacement): ao salvar, ele troca só o módulo alterado no navegador, **preservando o estado da tela** (o formulário não zera). Em **produção**, roda um build de verdade (Rollup) que gera arquivos estáticos otimizados, minificados e com hash no nome.
**Quando usar?** `npm run dev` para trabalhar; `npm run build` + `npm run preview` para conferir o que vai para o ar (Tema 11).
**Exemplo:**

```bash
npm run dev       # servidor em http://localhost:5173, HMR ligado
npm run build     # gera dist/ — é isso que vai para a hospedagem
npm run preview   # serve o dist/ localmente, para você ver a versão real
```

**Armadilhas:** **dev não é produção** — medir performance, tamanho ou comportamento em `npm run dev` não vale nada (o React em dev tem checagens extras e o código não está minificado); essa lição volta cobrada no Tema 11. `create-react-app` está **descontinuado desde 2025** e a documentação oficial do React não o recomenda mais: era baseado em Webpack com bundle completo a cada start, lento e com dependências abandonadas — se você achar tutorial que o usa, o tutorial é velho e o resto dele provavelmente também. Sobre o TypeScript: o Vite **remove** os tipos sem checar (por isso é rápido); erro de tipo **não** quebra o `dev` nem, por padrão, o `build` — quem checa é o `tsc --noEmit`, e é por isso que o script `typecheck` existe e precisa entrar no seu fluxo desde hoje.

## 7. Anatomia do projeto: quem chama quem

**O que resolve?** Saber a cadeia de partida evita depurar às cegas. Ela é curta: `index.html` → `main.tsx` → `App.tsx`. O `index.html` **é o ponto de entrada** no Vite (diferente do Webpack, onde a entrada era um JS) e vive na raiz do projeto, não em `public/`.
**Quando usar?** No primeiro dia, e toda vez que algo "não aparece".
**Exemplo:** a cadeia inteira em três arquivos.

```html
<!-- index.html -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

```tsx
// main.tsx — a ponte entre o DOM e o React. Roda UMA vez.
createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
```

```tsx
// App.tsx — a raiz da SUA árvore. Daqui para baixo é tudo componente.
export default function App() { return <h1>Tarefas</h1>; }
```

**Armadilhas:** o `!` naquele `getElementById` é uma **afirmação** sua de que o elemento existe — o TypeScript acredita e não verifica (mesma lição do `as` do Tema 3 da Etapa 2); se você renomear o `id` no HTML, o erro só aparece em runtime. `public/` é para arquivos que devem ser servidos **sem passar pelo build** (referenciados por caminho absoluto, `/logo.svg`); tudo que você `import`a mora em `src/` e é processado. `vite.config.ts` é a configuração do **build/dev server** e não tem nada a ver com `tsconfig.json` — confundir os dois é rotina no começo. E `main.tsx` roda uma vez: código posto ali não é "código que roda sempre".

## 8. `tsconfig` do front × o da API

**O que resolve?** O ambiente é outro: no back você compila para Node e o alvo é `dist/`; no front quem transpila é o Vite e o `tsc` serve **só para checar**. Daí as opções que a API não tem — `"jsx": "react-jsx"` (como o JSX é transformado; `react-jsx` é o transform moderno, que dispensa `import React`), `"lib": ["DOM", "DOM.Iterable"]` (as tipagens de `document`, `window`, `HTMLInputElement`), `"moduleResolution": "bundler"` (resolve import como um empacotador resolve — sem exigir `.js` no fim do caminho, que era a chatice da sua API) e `"noEmit": true` (o `tsc` não gera arquivo nenhum).
**Quando usar?** Ler uma vez no dia 1, entender cada linha, e voltar quando o erro for do compilador e não do seu código.
**Exemplo:**

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "noEmit": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Armadilhas:** o Vite gera **mais de um** `tsconfig` (um para o código do app, com `lib: DOM`, e outro para os arquivos de configuração, que rodam em Node) ligados por `references` — editar o errado é a causa nº 1 de "mudei a opção e nada aconteceu". As três opções rígidas do TS 7 que você já conhece continuam valendo e vão morder mais aqui: `noUncheckedIndexedAccess` (todo `tasks[0]` é `Task | undefined`), `exactOptionalPropertyTypes` (prop opcional não aceita `{ campo: undefined }`, só a chave ausente — isso vai doer no Tema 2) e `verbatimModuleSyntax` (import de tipo exige `import { type X }`). E de novo: **rodar `npm run dev` não checa tipo nenhum**.

## 9. `StrictMode`

**O que resolve?** É um componente que não renderiza nada e só liga verificações extras **em desenvolvimento**. A principal: ele monta seu componente, desmonta, e monta de novo — chamando funções de render, inicializadores de estado e efeitos duas vezes. O objetivo é fazer barulho cedo quando o seu código **não é puro** (render com efeito colateral) ou quando um efeito **não sabe se limpar** (Tema 6). Um bug que aparece no StrictMode é um bug que apareceria em produção sob condições piores — navegação de ida e volta, ou o Fast Refresh remontando.
**Quando usar?** Sempre ligado. Em produção o React o ignora, custo zero.
**Exemplo:**

```tsx
<StrictMode><App /></StrictMode>
```

```tsx
let n = 0;
function Bug() { n++; return <p>{n}</p>; }   // render impuro: com StrictMode o número pula de 2 em 2
```

**Armadilhas:** a reação errada é remover o `StrictMode` para "parar de duplicar" — isso apaga o alarme e mantém o incêndio. A reação certa é perguntar por que o seu código se importa com ser chamado duas vezes. **Isso só acontece em desenvolvimento**, então não tente "consertar" com contador de execuções. E cuidado com o diagnóstico: com o transform moderno o console do React também deduplica alguns avisos, então "só vi um log" não prova nada — confirme no DevTools.

## 10. Renderização: o que dispara, o que o React faz

**O que resolve?** Desfaz a confusão que custa caro no Tema 12. Renderizar é **chamar a sua função de componente** para obter a descrição da tela; isso é barato e acontece o tempo todo. O ciclo tem três fases: **disparo** (o primeiro `render()`, ou uma mudança de estado), **render** (o React chama seus componentes e monta a nova descrição, comparando com a anterior — reconciliação), e **commit** (o React aplica no DOM real **apenas as diferenças encontradas**). Se a descrição nova é igual à velha, o commit não toca em nada — o navegador nem repinta.
**Quando usar?** Como modelo mental permanente; é o que separa "está lento" de "re-renderiza demais" (que nem sempre é o mesmo problema).
**Exemplo:** um `<input>` cujo valor não mudou não é recriado — o React reaproveita o mesmo nó do DOM, e por isso o foco e o texto digitado sobrevivem ao re-render do pai.
**Armadilhas:** **re-render ≠ redesenhar o DOM** — dizer "re-renderizou" não é dizer "ficou lento". O contrário também: um render barato pode virar caro se ele recalcula uma lista de 10 mil itens toda vez. Duas coisas dependem da **posição na árvore e da `key`**: se você renderiza um componente diferente na mesma posição, o React **destrói o estado** dele — é a base do Tema 2 (`key`) e do Tema 12 (perda de estado por `key` instável). E o estado não muda no meio do render: `setX` **agenda**, o React processa e refaz a passada (Tema 4).

## 11. React DevTools

**O que resolve?** Devolve a visibilidade que você tinha com o inspetor de elementos: mostra a **árvore de componentes** (não de nós do DOM), com as props e o estado de cada um, quem é o pai, e — na aba Profiler (Tema 12) — quem renderizou e quanto custou. É a resposta para "eu acho que o estado está X".
**Quando usar?** Instalar hoje, no dia 1, e abrir toda vez que a tela não bate com o que você espera. "Achar" não é depurar.
**Exemplo:** extensão do Chrome/Firefox → abre duas abas novas no DevTools: **Components** e **Profiler**. Clicar num componente mostra `props` e `hooks` do lado direito, e o `$r` no console vira uma referência a ele.
**Armadilhas:** ele só aparece em **build de desenvolvimento** — num site em produção as abas não aparecem (e é assim que deve ser). Editar props direto no painel muda a tela mas **não** muda o seu código: é sonda, não editor. E não confunda as duas árvores: um componente seu pode não gerar nó nenhum no DOM (fragmento), e um nó do DOM pode vir de um componente que você não escreveu.

## 12. Import de asset e CSS no Vite

**O que resolve?** No Vite, **importar** um arquivo é a forma de dizer ao build "isto faz parte do app": ele processa, otimiza, põe hash no nome e reescreve o caminho no bundle. `import './App.css'` injeta o CSS; `import logo from './logo.svg'` te devolve a **URL final** do arquivo.
**Quando usar?** Como padrão. `public/` só para o que precisa de caminho estável e literal (favicon, `robots.txt`, arquivo referenciado de fora).
**Exemplo:**

```tsx
import './App.css';                 // efeito colateral: o CSS entra na página
import logo from './assets/logo.svg';   // logo é uma string: a URL final

<img src={logo} alt="" />
<img src="/favicon.svg" alt="" />   // veio de public/, caminho literal
```

**Armadilhas:** `<img src="./assets/logo.svg" />` escrito como string **não** passa pelo build — funciona no `dev` e quebra no deploy (o arquivo não foi copiado nem teve o caminho reescrito); é o bug clássico do Tema 11 aparecendo com três semanas de antecedência. CSS importado é **global**, mesmo estando ao lado do componente — o escopo é problema do Tema 3, não se iluda com a proximidade do arquivo. E arquivo em `public/` **não** ganha hash: cache velho é responsabilidade sua.

---

# Parte B — Aplicação na `web/`

### 1. Preparação do ambiente

Só isto é mastigado; o resto é seu. O scaffold é atrito, não aprendizado.

```bash
cd etapas/etapa-3
npm create vite@latest web
#   Framework: React
#   Variant:   TypeScript          ← TypeScript puro, não SWC/Babel-only
cd web
npm install
npm run dev                        # http://localhost:5173
```

Trave as versões que vierem e **registre no `web/README.md`** (React, Vite, TypeScript) — a partir de hoje o `web/package.json` é a fonte de verdade da stack do front, como o `api/package.json` é a do back.

Dois ajustes obrigatórios no `package.json` gerado, porque o Vite não checa tipo:

```jsonc
"scripts": {
  "typecheck": "tsc -b --noEmit"   // mesmo nome que na api/ — regra 4 do plano
}
```

O `-b` não é detalhe: o `tsconfig.json` que o Vite gera na raiz é *solution-style* (`"files": []` + `references` para o `tsconfig.app.json` e o `.node.json`). Sem `-b`, o `tsc` lê esse arquivo, encontra zero arquivos e sai limpo **sempre**.

E instale a extensão **React DevTools** no navegador antes de escrever a primeira linha.

Confira o `.gitignore` (o do Vite já cobre `node_modules/` e `dist/`) e garanta que ele está pegando — `web/node_modules` no commit é acidente comum quando existe `.gitignore` na raiz.

### 2. O que do tema deve aparecer na `web/`

Partindo da linha "O app ganha" e expandindo:

- **O app nasce e sobe.** `etapas/etapa-3/web/` existe, `npm run dev` abre em `localhost:5173` e o boilerplate do Vite (contador, logos, CSS de demonstração) **morre** — não sobra nada que você não tenha escrito ou lido linha a linha.
- **Uma árvore de componentes de verdade**, não tudo no `App.tsx`. O mínimo é um `App` com um cabeçalho e uma área de conteúdo em arquivos separados, e essa árvore tem que aparecer nomeada no DevTools. Nada de props e nada de estado ainda — isso é Tema 2 e Tema 4; aqui a lista, se existir, é JSX escrito na mão.
- **Cada regra do JSX exercitada de propósito, não por acaso:** um fragmento, uma expressão entre chaves, um atributo que mudou de nome (`className`/`htmlFor`), um `style` como objeto.
- **A cadeia de partida entendida.** Abra `index.html`, `main.tsx`, `App.tsx`, `vite.config.ts` e os `tsconfig`s e saiba dizer quem chama quem.
- **`StrictMode` ligado e comprovado.** Escreva um `console.log` no corpo de um componente, veja aparecer duas vezes, entenda por quê, e **apague o log** antes do commit.
- **Um asset importado** (o seu, não o do Vite) aparecendo na tela via `import`, e o CSS entrando por `import`.
- **HMR observado:** altere um texto com a página aberta e note o que **não** aconteceu (a página não recarregou).
- **`npm run typecheck` limpo** e rodado antes do commit — não é enfeite, é a regra 4(b).
- **`web/README.md` nasce hoje** (regra 5): o que o app é, como rodar, a stack com versões, a estrutura de pastas, e o aviso de que ele ainda não fala com a API. Ele cresce a cada tema; não deixe para escrever no Tema 11.
- **Commits `t01: ...`** e push conferido.

### 3. Critérios

- `npm run dev` sobe limpo, sem aviso no console do navegador e sem aviso no terminal.
- Zero resquício do template: nenhum `useState` de contador, nenhum `react.svg`, nenhum `App.css` que você não escreveu.
- A tela é montada por **mais de um componente seu**, e a hierarquia aparece nomeada na aba Components do DevTools.
- Você consegue apontar, no seu próprio projeto, a linha em que o React encontra o `<div id="root">`.
- `npm run typecheck` sai limpo — com o `-b`, senão ele está checando zero arquivo.
- Um asset seu carregado por `import` continua aparecendo depois de `npm run build && npm run preview`.
- `web/README.md` existe e responde: o que é, como rodar, qual a stack e o que ainda não funciona.
- Nada de `document.querySelector` no código.

### 4. Revisão do código

Me chama no fim; eu leio a `web/` inteira e aponto de forma simples onde estão os erros e o que faltou, pra você corrigir.
