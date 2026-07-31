# Estudo — Estilos, layout e acessibilidade (Tema 3)

> **O app ganha:** deixa de ser HTML cru — sistema de estilo escolhido, tokens definidos, layout responsivo e a lista apresentável, com os primeiros componentes de UI (`ui/`) separados do domínio. **É o tema que paga o combustível da etapa inteira.**

> **A decisão é sua.** A Parte A existe para você escolher **um** sistema de estilo sabendo o que está comprando. Nenhum tópico daqui decide por você — mas a escolha tem que estar escrita no `web/README.md` no fim do dia, com o porquê.

---

# Parte A — Manual de consulta

## 1. As quatro opções de estilo, e o que cada uma resolve

**O que resolve?** Todas resolvem o mesmo problema de base — botar cor e espaço na tela — e diferem em **como evitam que o estilo de um componente vaze no outro**. Esse é o eixo verdadeiro da escolha, não "qual é mais bonita de escrever". Hoje o seu `App.css` tem `p { color: gray }`: isso pinta **todo parágrafo do app inteiro**, para sempre, inclusive os que ainda não existem. É esse o problema.

**Quando usar?** Escolha agora, uma só, e registre. Trocar depois é caro porque cada componente novo nasce amarrado na decisão.

**As quatro, honestamente:**

**CSS global** (o que você tem). Um ou dois arquivos `.css`, seletores por classe, importados no `main.tsx`. Zero ferramenta, zero conceito novo. Escala mal por um motivo mecânico: o nome da classe é global, então `.header` só pode existir uma vez no projeto e você acaba inventando convenções na mão (BEM: `.task-item__title--done`) para simular escopo.

**CSS Modules** (nativo no Vite, nada a instalar). Você escreve `TaskItem.module.css` e importa: `import styles from './TaskItem.module.css'`. O Vite reescreve `.title` para `.TaskItem_title_a3f9x` no build e te entrega um objeto com o mapeamento. É CSS de verdade — tudo que você aprender aqui vale fora do React — com colisão de nome resolvida na origem. Custo: um arquivo irmão por componente, e `styles.taskTitle` em vez de `class="task-title"`.

**CSS-in-JS** (styled-components, Emotion). O estilo vira JavaScript: você cria um componente já estilizado e interpola props dentro do CSS. Resolve escopo e estilo dinâmico no mesmo lugar. Custo real em 2026: runtime a mais no navegador, e o ecossistema andou para *zero-runtime* — é a opção que envelheceu pior das quatro.

**Tailwind.** Você não escreve CSS: compõe classes utilitárias direto no JSX (`className="flex items-center gap-4"`). Escopo deixa de ser problema porque não existem nomes seus. É rápido depois que entra no dedo, e é o que mais aparece em vaga hoje. Custo: JSX verborrágico, uma linguagem nova para aprender por cima do CSS (e você **ainda precisa saber CSS** — `flex` e `gap` são as mesmas propriedades), e a tentação de nunca extrair componente porque copiar 12 classes é fácil.

**O critério para o seu caso, não para o caso genérico.** Três perguntas suas:

1. **O Tema 10 é Motion.** Duração e curva de animação vêm de tokens CSS. Todas as quatro convivem com variáveis CSS — nenhuma te bloqueia, mas em CSS Modules e CSS global os tokens ficam onde você já sabe olhar; em Tailwind eles moram na config dele.
2. **O Tema 14 é Testing Library**, que consulta por papel e rótulo, **nunca por classe**. A escolha é neutra aqui — nenhum teste seu vai olhar `className`. Isso é bom: significa que errar essa decisão não contamina os testes.
3. **Você quer aprender CSS ou entregar tela rápido?** Você está numa etapa de formação e o CSS é conhecimento vitalício, portável entre framework. Tailwind é conhecimento de ferramenta, muito empregável e substituível. **E, dado que o vocabulário de CSS acabou de nascer no `base-css.md`, aprender uma abstração por cima de uma base fresca tem um custo real** — não é argumento definitivo, é um peso a considerar.

**Armadilhas:** não misture duas. "CSS Modules para componente e um global para reset" é misturar do jeito certo (o global fica só para reset e tokens); "CSS Modules aqui, Tailwind ali" é dívida imediata. Escolher por popularidade sem saber o que a alternativa resolvia é exatamente o que a avaliação pergunta (*"por que você escolheu esse sistema de estilo"*) — e "vi num vídeo" reprova. E, escolha o que escolher, **`style={{ }}` inline não é sistema de estilo**: ele é o último recurso, cabe em valor calculado em runtime (uma altura medida no Tema 10) e em nada mais. O `style={{ color: 'gray' }}` do seu `AddTaskField` morre hoje.

## 2. O problema que o escopo resolve — mecanicamente

**O que resolve?** CSS não tem módulo. Todo seletor que você escreve entra num único espaço de nomes compartilhado por todo arquivo que o navegador carregar, e quem ganha o empate é decidido por **especificidade** e **ordem de importação** (seção 7 do `base-css.md`). Duas pessoas — ou você em duas semanas — escrevem `.title` para coisas diferentes e uma sobrescreve a outra sem erro nenhum: nada quebra, só fica errado.

**Quando usar?** O conceito importa sempre. A técnica (Modules) importa se você escolheu ela no tópico 1.

**Exemplo:** o mesmo componente, sem e com escopo.

```tsx
// ❌ global — `.title` é do projeto todo, não deste componente
import './TaskItem.css';
<span className="task-title">{task.title}</span>
```

```tsx
// ✅ CSS Modules — o nome é local, o Vite gera um único de verdade
import styles from './TaskItem.module.css';
<span className={styles.title}>{task.title}</span>
```

```css
/* TaskItem.module.css */
.title { font-weight: 600; }   /* vira .TaskItem_title_a3f9x no build */
```

**O que continua global mesmo com Modules** — e isso é a parte que quase todo mundo erra: apenas o **nome da classe** é escopado. Continuam globais: `id` de elemento, seletor de tag (`p { }` dentro de um module ainda pinta todo `<p>` que casar), `@keyframes` (o Vite escopa, mas a referência precisa bater), variáveis CSS em `:root`, e o próprio cascade — herança de `color` e `font` atravessa escopo alegremente. **É por isso que a dívida do `id="task"` do Tema 2 não é resolvida por CSS Modules**: `id` é global em qualquer sistema de estilo, e a resposta continua sendo `useId` no Tema 12.

**Armadilhas:** `styles.taskTitle` com hífen no CSS (`.task-title`) não funciona direto — `styles['task-title']` funciona, e a convenção é **camelCase no arquivo `.module.css`** para evitar a feiura. Classe escrita errada vira `undefined`, que o React renderiza como `class="undefined"` — silenciosamente sem estilo, e é o bug número um de quem começa com Modules. E `:global(.algo)` existe como escapatória: se você precisou dele duas vezes, a decisão do tópico 1 está sendo contornada.

## 3. Variáveis CSS como design tokens

**O que resolve?** O `#f5ead8` está hoje em **dois lugares** no seu código: no `--bg` do `index.css` e chumbado no `background-color` do `.change-status`. Isso já é a duplicação começando. Token é a resposta: um nome (`--color-surface`), um valor, um lugar. Trocar a paleta do app inteiro passa a ser editar cinco linhas em vez de caçar hexadecimal com `Ctrl+F`.

**Quando usar?** Para tudo que se repete e tem significado: cor, espaçamento, raio, peso e tamanho de fonte, sombra, e — a partir do Tema 10 — **duração e curva de animação**. Valor que aparece uma vez só e não significa nada não precisa de token.

**Exemplo:** um conjunto pequeno e suficiente para hoje.

```css
/* index.css — global de propósito: token é para ser global */
:root {
  /* cor */
  --color-bg: #f5ead8;
  --color-surface: #fffaf0;
  --color-text: #2b2b2b;
  --color-text-muted: #6b6b6b;
  --color-accent: #2f6f4f;
  --color-danger: #a33;

  /* espaço — escala, não números aleatórios */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;

  --radius: 8px;
  --font-size-sm: 0.875rem;

  /* já plantado para o Tema 10 */
  --duration-fast: 120ms;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
}
```

```css
.item {
  background: var(--color-surface);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  transition: background var(--duration-fast) var(--ease-out);
}
```

**Nomeie pelo papel, não pela aparência.** `--color-danger` sobrevive à decisão de trocar vermelho por laranja; `--color-red` vira mentira no dia da troca. Mesma regra do nome de variável em TypeScript.

**Armadilhas:** variável CSS é **herdada** e resolvida em runtime pelo navegador — por isso ela funciona para tema escuro (redefinir num seletor pai) e por isso `var(--nao-existe)` não dá erro, só ignora a declaração (passe um fallback quando importar: `var(--x, 1rem)`). Espaçamento em escala fechada é o que impede o app de ficar com 13px aqui e 14px ali; se você precisou de um valor fora da escala, ou a escala está errada ou o layout está. E não faça token de tudo no dia 1: token sem uso é peso morto — os que estão acima existem porque a tela de hoje precisa deles.

## 4. Classe condicional por prop, sem sopa de ternário

**O que resolve?** A mesma tarefa tem cara diferente quando está `done`. Você já resolveu isso no Tema 2 com o `Record<Status, string>` do ícone — e a solução aqui é **exatamente a mesma ideia**, aplicada a classe. Sem isso, o JSX vira `className={a ? (b ? 'x y' : 'x') : ''}` e ninguém mais lê.

**Quando usar?** Sempre que a variação é **fechada** (um status entre três, um tamanho entre dois): mapa. Quando é uma soma de sinalizadores independentes (`isSelected` + `isSaving`): lista de classes filtrada.

**Exemplo:** os dois padrões, e nenhum precisa de biblioteca.

```tsx
// variação fechada — mapa, e o TS te cobra quando um status novo entrar
const statusClass: Record<Status, string> = {
  todo: styles.todo,
  doing: styles.doing,
  done: styles.done,
};

<li className={`${styles.item} ${statusClass[task.status]}`}>
```

```tsx
// sinalizadores independentes — junta e filtra o que não veio
const cls = [styles.item, isSelected && styles.selected, isSaving && styles.saving]
  .filter(Boolean)
  .join(' ');

<li className={cls}>
```

**Tailwind é o mesmo raciocínio** com strings de utilitário no lugar de `styles.x` — e é onde a biblioteca `clsx`/`cva` ganha sentido de verdade. Sem Tailwind, `clsx` é três linhas que você acabou de escrever à mão; não instale por hábito.

**Armadilhas:** o padrão preferível é **`data-*` atributo em vez de classe** quando o estado é do domínio: `<li data-status={task.status}>` e no CSS `[data-status='done'] { }`. Ganho duplo — o CSS fica declarativo e o **Testing Library consegue afirmar sobre o estado sem olhar classe** (Tema 14). Considere seriamente. Fora isso: `styles.naoExiste` é `undefined` e vira `"undefined"` na classe; e `className` construída por concatenação sem espaço (`${a}${b}`) cola dois nomes num só, que é um bug invisível — só falta estilo, nada avisa.

## 5. Flexbox e Grid — o suficiente para esta tela

> Pré-requisito: seção 6 do `base-css.md` (`display`, e a regra "flex para uma dimensão, grid para duas").

**O que resolve?** Posicionar sem gambiarra. Hoje: um cabeçalho, uma lista com colunas alinhadas entre linhas, um campo com rótulo, e o container central da página.

**Exemplo:** os três layouts do app de hoje.

```css
/* fileira: rótulo, conteúdo, botão */
.row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* colunas alinhadas entre linhas — o seu caso, agora flexível */
.item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: var(--space-2);
  align-items: center;
}

/* container da página */
.page {
  max-width: 60ch;
  margin-inline: auto;
  padding: var(--space-3);
}
```

**O que muda no seu `App.css`.** `grid-template-columns: 40px 200px 100px 120px` é o padrão "funciona no meu monitor": título com 200px fixos **corta ou estoura** com título longo — e a avaliação tem *"título de 5.000 caracteres"* na prova prática. `1fr` na coluna do título e `auto` nas outras é o mesmo layout sem a fragilidade. `gap` substitui `margin` entre itens e não deixa margem sobrando na borda.

**Armadilhas:** as três do `base-css.md` valem aqui e são as que vão te morder — `align-items` × `justify-content` trocados, `min-width: auto` deixando o texto longo empurrar o container (a correção é `min-width: 0` no item), e `gap` sendo a resposta em vez de `margin`. Além delas: `1fr` significa "uma fração do que sobrou", não "1 unidade de nada"; e `grid-template-columns` só existe no **container**, não no item — errar de lado é comum e não dá erro nenhum.

## 6. Responsivo mobile-first

**O que resolve?** A mesma tela em telefone e em desktop. **Mobile-first** significa escrever o CSS base para a tela estreita e usar `@media (min-width: ...)` para *adicionar* nas telas largas — não o contrário. A razão não é gosto: layout estreito é uma coluna, ou seja, quase todo o CSS base é "não fazer nada", e você só acrescenta complexidade onde há espaço.

**Quando usar?** Neste tema, num breakpoint só. Dois breakpoints numa tela de lista é inventar problema.

**Exemplo:**

```css
/* base = telefone: tudo empilhado, nada a declarar além do espaço */
.item {
  display: grid;
  gap: var(--space-1);
}

/* a partir de tablet: vira linha com colunas */
@media (min-width: 40rem) {
  .item {
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
  }
}
```

**A grade de 4 colunas com cabeçalho não sobrevive ao telefone** — e é bom que você descubra isso hoje: um "cabeçalho de colunas" só faz sentido quando as colunas existem. No estreito, ou o cabeçalho desaparece (`display: none` numa media query) ou cada linha passa a rotular o próprio dado. Decidir isso é parte do tema.

**Armadilhas:** teste no DevTools responsivo **e** estreitando a janela de verdade; e sem `<meta name="viewport" content="width=device-width, initial-scale=1">` no `index.html` o telefone finge ter 980px e todo o seu CSS responsivo é ignorado (o template do Vite já põe — **confira**). Breakpoint em `rem` respeita quem aumentou a fonte do sistema; em `px`, não. Escolha o breakpoint pelo ponto em que **o seu layout quebra**, não pelo tamanho do iPhone. E lembre da armadilha do `@` no `base-css.md`: media query escrita **antes** da regra base perde o empate e parece não funcionar.

## 7. Os estados visuais que a maioria esquece

**O que resolve?** Interface sem estado visual não responde: o usuário clica e não sabe se clicou. Seu `.change-status` hoje tem `cursor: pointer` e mais nada — nenhum `:hover`, nenhum `:focus-visible`, nenhum `:disabled`. Ele está mudo.

**Quando usar?** Todo elemento interativo precisa de **hover**, **foco** e **desabilitado**. Toda tela que busca dado precisa de **carregando**, **vazio** e **erro** — e a partir do Tema 7 os três são obrigatórios, com estilo pronto porque este tema veio antes.

**Exemplo:**

```css
.button {
  background: var(--color-accent);
  color: white;
  border: 0;
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);   /* padding, não margin: cresce o ALVO */
  cursor: pointer;
  transition: filter var(--duration-fast) var(--ease-out);
}

.button:hover { filter: brightness(1.08); }

/* foco só quando navegando por teclado — NÃO remova o outline, troque-o */
.button:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button:active { transform: scale(0.97); }   /* resposta tátil, Tema 10 */
```

**`:focus` × `:focus-visible`.** `:focus` pega também o clique de mouse, o que deixa um anel sobrando no botão depois de clicar — e é a razão pela qual meio mundo escreveu `outline: none` e destruiu a navegação por teclado do próprio site. `:focus-visible` é o navegador te dizendo "esta pessoa está usando teclado": use ele e o problema não existe.

**Armadilhas:** `outline: none` sem substituto é o **erro de acessibilidade mais comum da web** — e é testável em 10 segundos, o que faz dele o primeiro alvo de qualquer avaliação. `:hover` não existe em toque: nunca esconda informação necessária atrás dele. E estado visual não é decoração — a prova prática diz *"navego só pelo teclado: dá para criar e apagar uma tarefa sem mouse"*, e sem foco visível isso é impossível de fazer, não só desagradável.

## 8. HTML semântico: `div` clicável é dívida

**O que resolve?** A tag certa te dá de graça, e correto, o que você teria que reimplementar mal: `<button>` é focável por `Tab`, dispara em `Enter` e `Espaço`, se anuncia como botão para o leitor de tela e aparece no `getByRole('button')` do Tema 14. Uma `<div onClick>` não tem nada disso, e cada item da lista é uma reimplementação a mais.

**Quando usar?** Sempre. É de graça — o custo é escolher a tag no momento em que você já ia escrever uma.

**Exemplo:** o inventário da sua tela hoje.

```tsx
<header>            {/* Header — ✅ já semântico */}
<main>              {/* App — ✅ */}
<section>           {/* Section — ✅ */}
<ul> <li>           {/* TaskList / TaskItem — ✅ lista de coisas é lista */}
<button>Change</button>  {/* ✅ é botão de verdade */}
<label htmlFor> <input id>  {/* ✅ ligados */}
```

**O que está errado, e é o achado semântico do tema:** o `<li className="task-header">` com `<span>Status</span><span>Tarefa</span>...`. Isso não é um item da lista — é a **linha de cabeçalho de uma tabela**. Para o leitor de tela, a sua lista tem 6 itens e o primeiro se chama "Status Tarefa Previsão Alterar status". Duas saídas honestas, e escolher é seu: **assumir que é tabela** (`<table>` com `<thead>`/`<th scope="col">`, que dá associação cabeçalho-célula de graça) ou **assumir que é lista** e matar a linha de cabeçalho, deixando cada item rotular o próprio dado. Grade de 4 colunas com cabeçalho é tabela; se você quer tabela, use tabela — `<table>` não é "coisa velha de layout", o pecado dos anos 2000 era usar tabela **para layout**, e dado tabular é exatamente o uso correto dela.

**Armadilhas:** `<div>` e `<span>` não são proibidos — são o certo quando o papel é só agrupar ou estilizar. O erro é `<div>` **interativa**. `<a>` navega, `<button>` age: link que não leva a lugar nenhum e botão que troca de página são os dois lados do mesmo erro (e no Tema 9 isso vira decisão de rota). Landmark repetida sem nome (`<nav>` duas vezes) confunde em vez de ajudar. E semântica **não é enfeite**: é literalmente o que o Tema 14 vai consultar — `getByRole('button', { name: /change/i })` só existe porque a tag é `<button>` e tem nome.

## 9. Foco: para onde ele vai, e quando isso é problema seu

**O que resolve?** Quem navega por teclado (ou leitor de tela) tem um "cursor" — o foco. Ele segue a ordem do DOM sozinho, o que já resolve o caso normal. O que **não** se resolve sozinho é o que acontece quando o elemento focado **deixa de existir**: apagar a tarefa que estava focada joga o foco para o `<body>`, e a pessoa é teletransportada para o topo da página, sem aviso.

**Quando usar?** O conhecimento é de hoje. A aplicação de verdade é do Tema 8 (apagar item) e do Tema 9 (trocar de rota) — hoje você **desenha para não sabotar** e anota a dívida.

**Exemplo:** ordem de tabulação vem do DOM, não do CSS.

```tsx
// a ordem visual mudou com row-reverse — a ordem do Tab NÃO mudou.
// Divergência entre as duas é bug de acessibilidade.
<div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
  <button>Primeiro no Tab, último na tela</button>
  <button>Último no Tab, primeiro na tela</button>
</div>
```

**O teste, agora:** clique na barra de endereço, depois `Tab` até o fim da página. Você consegue **ver** onde está a cada passo? Chega em todo elemento interativo? A ordem faz sentido? Se sim, o tema está pago. Se você perde o foco de vista em algum ponto, é o tópico 7 faltando ali.

**Armadilhas:** `tabindex` positivo (`tabindex="3"`) quebra a ordem natural do documento inteiro e é quase sempre erro; `tabindex="0"` (torna focável) e `tabindex="-1"` (focável só por código, para você mandar o foco depois de apagar um item) são os dois que se usam. Elemento escondido com `display: none` sai do Tab — mas `opacity: 0` e `visibility: hidden` **não saem** do mesmo jeito, então um menu "fechado" mal escondido continua tabulável e invisível. E foco não é `:hover` com outro nome: dá para focar sem apontar e apontar sem focar.

## 10. `aria-live` para a mudança que ninguém clicou

**O que resolve?** Leitor de tela narra o que a pessoa faz. Quando o **app** muda algo sozinho — o contador do `TaskSummary` mudando, "salvando..." aparecendo, uma mensagem de erro surgindo — nada é narrado: para quem não vê a tela, a mudança não aconteceu. `aria-live` marca uma região como "avise quando o conteúdo daqui mudar".

**Quando usar?** Em **uma ou duas** regiões do app: a área de mensagem/erro e a de status. Hoje o candidato é o `TaskSummary`; no Tema 7 é o "carregando"/"erro"; no Tema 8, o "salvando".

**Exemplo:**

```tsx
// polite = espera a pessoa terminar de falar. É o padrão certo.
<p aria-live="polite">{doing} tarefas em andamento</p>

// erro que precisa interromper: assertive, com parcimônia
<p aria-live="assertive" role="alert">{error}</p>
```

**A regra que faz funcionar:** o elemento com `aria-live` precisa **existir na tela antes** da mudança. Se ele nasce junto com o texto (`{error && <p aria-live="polite">{error}</p>}`), o leitor de tela frequentemente não anuncia — ele observa a região, e a região acabou de aparecer. O padrão é o container vazio fixo, com o conteúdo entrando dentro.

**Armadilhas:** `assertive` interrompe a pessoa no meio da frase — usar em contador é grosseria técnica. Múltiplas regiões live competindo viram ruído e as pessoas desligam. `aria-live` numa lista inteira anuncia a lista toda a cada mudança. E a regra de ouro do ARIA: **nenhum ARIA é melhor que ARIA errado** — `aria-label` num `<button>` que já tem texto visível *substitui* o texto para o leitor de tela e, se divergirem, você criou uma interface que diz duas coisas diferentes (e quebra o `getByRole` do Tema 14).

## 11. Contraste e tamanho de alvo — os dois testes de 30 segundos

**O que resolve?** A maior parte dos problemas reais de acessibilidade não é ARIA exótico: é texto cinza-claro em fundo claro e botão pequeno demais para um dedo. Dois números pegam quase tudo.

**Quando usar?** Uma vez, no fim do tema, com o DevTools.

**Exemplo — contraste.** O mínimo (WCAG AA) é **4.5:1** para texto normal e **3:1** para texto grande (24px+, ou 19px+ negrito) e para bordas de componente. No DevTools: inspecione o elemento, abra o seletor de cor no `color`, e o painel mostra a razão de contraste com um ✓ ou ✗ ao lado — não precisa de site externo.

O seu `p { color: gray }` sobre `#f5ead8`: `gray` é `#808080`, e essa combinação fica **abaixo de 4.5:1**. Todo texto secundário do seu app hoje reprova nesse teste — inclusive a mensagem do estado vazio, que é justamente a que a pessoa nova precisa ler. `--color-text-muted` do tópico 3 existe para resolver isso.

**Exemplo — alvo.** Elemento clicável com pelo menos **24×24px** (o mínimo da WCAG 2.2), e 44×44 é o conforto real no dedo. `padding` é o jeito certo de crescer o alvo sem crescer o texto (seção 5 do `base-css.md`: `padding` aumenta a área clicável, `margin` não). Seu `.change-status` é `border: 0` com texto pequeno e nenhum padding — é um alvo de uns 16px de altura.

**Armadilhas:** contraste vale para **texto sobre o fundo real**, então texto sobre imagem ou gradiente tem que ser testado no pior ponto. Placeholder e texto desabilitado costumam reprovar (`opacity: 0.5` no `:disabled` derruba o contraste — e é aceito, porque o estado comunica indisponibilidade). Ícone sozinho sem texto precisa de `aria-label`, senão o botão não tem nome. E o Lighthouse do Tema 11 vai medir isso automaticamente: o que você arrumar hoje é nota que você não vai ter que caçar depois.

## 12. Acessibilidade é comportamento, não enfeite

**O que resolve?** A tentação, no seu perfil declarado, é tratar a11y como imposto — coisa invisível que não dá retorno na tela. O reenquadramento que vale: **a11y é o comportamento da interface quando o mouse não existe**. Não é "para deficientes"; é a mesma pergunta de sempre — o que a tela **faz** — feita sem o atalho do ponteiro.

**Quando usar?** Como critério de leitura do seu próprio código, sempre.

**A cadeia que fecha o argumento**, e é o motivo real de este tópico estar no Tema 3:

```
<button> semântico  →  getByRole('button') funciona    (Tema 14)
<label htmlFor>     →  getByLabelText funciona          (Tema 14)
:focus-visible      →  navegar só por teclado funciona  (avaliação)
aria-live           →  o erro é percebido               (Temas 7 e 8)
```

Os três itens da avaliação — *"navego só pelo teclado"*, *"ligo `prefers-reduced-motion`"*, *"o erro tem que chegar no campo certo"* — são todos comportamento, e todos nascem aqui. Testing Library **não tem** query por classe de CSS de propósito: a filosofia dela é consultar como o usuário consulta. Se a sua tela é inacessível, ela é **intestável** pelo caminho bom, e você vai acabar em `getByTestId` com culpa, exatamente como o Tema 14 avisa.

**Armadilhas:** a11y não é passar num checador automático — `axe` e Lighthouse pegam contraste e atributo faltando, não pegam "o foco foi para o lugar errado" nem "a ordem do Tab não faz sentido". O teste de teclado é manual e leva um minuto. E não caia no oposto: encher o JSX de ARIA para se sentir cumpridor é pior que não ter ARIA nenhum (tópico 10).

## 13. Componente de UI × componente de domínio — auditando a sua `web/`

**O que resolve?** `components/` vira depósito quando o único critério é "é componente". O critério que funciona é um só: **componente de UI não sabe nada do domínio.** `Button` não sabe o que é tarefa; `TaskItem` sabe e deve saber.

**O teste prático:** *se eu copiasse este arquivo para outro projeto, funcionaria sem alteração?* Se sim, é `ui/`. Se ele importa `Task`, fala de status, ou tem texto sobre tarefa dentro, é domínio.

**Quando usar?** Agora, uma vez, sobre o que já existe — antes de o app dobrar de tamanho.

**Exemplo — a auditoria da sua `web/` hoje:**

| Arquivo | Importa `Task`? | Sabe do domínio? | Onde está | Onde devia estar |
|---|---|---|---|---|
| `Header.tsx` | não | é a casca do app | `components/` | `components/` (layout) ✅ |
| `Content.tsx` | **sim** | decide vazio × lista | `components/` | `components/tasks/` |
| `Section.tsx` | não | nada — é uma moldura com `children` | `components/` | **`components/ui/`** |
| `AddTaskField.tsx` | não | **só no nome e no texto** | `components/tasks/` | **`components/ui/`** |
| `TaskList` `TaskItem` `TaskSummary` `EmptyTask` | sim | sim | `components/tasks/` | ✅ |

Dois casos merecem parada:

**`Section`** é um invólucro genérico (`<section>` + `children`) que não tem a menor ideia do que carrega. É `ui/` de manual — e provavelmente quer se chamar `Card` ou `Panel` quando ganhar estilo, porque "Section" descreve a tag, não o papel.

**`AddTaskField`** é o caso interessante. Olhe o que ele **é**: um `<label>` + `<input>` ligados por `htmlFor`/`id`, recebendo o texto do rótulo por prop. Isso é um **`TextField` genérico** com nome de domínio colado por acidente — e o nome mentiroso é o que fez ele aterrissar na pasta errada. Ele vira `ui/TextField` (label + input + espaço para mensagem de erro, que o Tema 5 vai preencher), e quem sabe de tarefa é quem o **usa**, passando o rótulo. Note que isso resolve metade da dívida do `id="task"`: um `TextField` genérico não pode ter id chumbado — ou o id vem por prop hoje, ou vem do `useId` no Tema 12. Escolha e anote.

**Armadilhas:** não crie `ui/` com dez arquivos hoje — ela nasce com o que **já existe** e o que a tela **de hoje** pede. Componente que importa `Task` "só para tipar uma prop" não é genérico: é domínio com disfarce. E o inverso do erro também existe: mover `TaskItem` para `ui/` porque "é reutilizável" é fingir reuso que não existe.

## 14. Quando encapsular a tag crua — e quando é custo puro

**O que resolve?** `Button` que só faz `<button {...props} />` é um arquivo, um import e um nome a mais para zero ganho. Encapsular vale quando existe **decisão repetida** para guardar dentro: estilo, os estados visuais do tópico 7, e a acessibilidade. **É por isso que este tópico é do Tema 3 e não do Tema 2** — antes de existir estilo não havia decisão nenhuma a encapsular.

**Quando usar?** Quando você está prestes a **repetir a mesma decisão** na segunda ocorrência. Não na primeira, não na hipotética.

**Exemplo — o seu caso concreto.** Hoje o `.change-status` aparece uma vez. Nos Temas 4, 5 e 8 entram: alternar status, criar, salvar edição, cancelar, apagar, confirmar. Meia dúzia de botões, todos precisando de hover, `:focus-visible`, `:disabled` e — no Tema 8 — estado de "salvando". Essa repetição é conhecida e certa, não hipotética. `Button` se paga.

```tsx
// ui/Button.tsx — genérico de verdade: herda tudo de <button>, acrescenta decisão
type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'ghost' | 'danger';
};

export const Button = ({ variant = 'primary', className, ...rest }: ButtonProps) => (
  <button className={`${styles.button} ${styles[variant]} ${className ?? ''}`} {...rest} />
);
```

Três coisas para entender linha a linha antes de usar (regra 1 da etapa): `React.ComponentProps<'button'>` faz o seu componente aceitar `onClick`, `type`, `disabled`, `aria-label` — tudo que um `<button>` aceita — sem você listar nada; `...rest` repassa isso para a tag; e `type` **não** tem default aqui, o que importa no Tema 5, porque botão dentro de `<form>` é `submit` por omissão e vai enviar o formulário sem você pedir.

**Os habitantes típicos de `ui/`:** `Button`, `TextField`, `Select`, `Modal`, `Card`, `Badge`, `Spinner`, `Alert`. **Quantos entram hoje:** os que a tela de hoje usa. `Modal` sem modal na tela é pasta enfeitada.

**Armadilhas:** o encapsulamento ruim é o que **esconde** a tag em vez de acrescentar — `Button` que não aceita `onClick` porque você esqueceu o `...rest`, `TextField` sem `htmlFor` ligado. Não reimplemente o que a tag faz de graça: `<div role="button" tabIndex={0} onKeyDown={...}>` é três bugs esperando, use `<button>`. E `variant` é prop de dado, não sinalizador booleano: `primary`/`ghost`/`danger` numa união é a versão certa de `isPrimary`+`isGhost`+`isDanger` (tópico 5 do Tema 2 voltando).

## 15. Quando o componente vira pasta

**O que resolve?** `Button.tsx` solto × `Button/` com `Button.tsx` + `Button.module.css` + (no Tema 14) `Button.test.tsx`. O gatilho é objetivo: **o arquivo irmão**. Enquanto o componente é um arquivo só, pasta é cerimônia — um nível de profundidade a mais para navegar, sem nada dentro além do que já estava.

**Quando usar?** Quando o segundo arquivo daquele componente nasce. Se você escolheu CSS Modules no tópico 1, isso acontece hoje para vários componentes — o `.module.css` é o irmão. Se você escolheu Tailwind, não acontece hoje e vai acontecer no Tema 14 com o teste.

**Exemplo:**

```
# um arquivo só → sem pasta
components/ui/Badge.tsx

# dois ou mais → pasta, com index para o import não ficar Button/Button
components/ui/Button/
├── Button.tsx
├── Button.module.css
└── index.ts          ← export { Button } from './Button';
```

**O `index.ts` é opcional e tem um custo:** ele deixa o import limpo (`from '../ui/Button'`), e em troca cria um arquivo de uma linha por componente e um lugar a mais onde o nome pode divergir. Muita gente boa não usa. Escolha e seja consistente — é a mesma disciplina do "export nomeado em todos" que você já registrou no README.

**Armadilhas:** não converta tudo em pasta de uma vez "para ficar uniforme" — uniformidade que custa 8 pastas vazias de conteúdo não é organização. `index.ts` em toda pasta, encadeado, dificulta rastrear de onde a coisa vem (e atrapalha o *tree-shaking* do Tema 11, quando o `index` reexporta o que ninguém usa). E co-locar CSS ao lado do componente é justamente o argumento a favor da pasta: o estilo daquele componente é dele, e sumir junto quando ele sumir é a propriedade que você quer.

## 16. Tailwind — o modelo, para a migração que vem depois do tema

**O que resolve?** O mesmo problema do tópico 2 (escopo), por outro caminho: em vez de escopar os **seus** nomes, ele acaba com a ideia de você ter nomes. Você compõe utilitários prontos direto no JSX. Colisão de classe deixa de existir porque não há classe sua.

**Quando usar?** Aqui: migrando um app que já funciona, para resolver os mesmos problemas duas vezes e poder comparar.

**As cinco coisas que você precisa saber para migrar:**

**1 · Utilitário é uma propriedade, uma classe.** `flex` é `display: flex`. `gap-4` é `gap: 1rem`. Os números são passos de uma escala, não rem — `4` = `1rem`, `2` = `0.5rem`.

**2 · `@theme` é onde os seus tokens continuam morando** — e passam a **gerar** utilitários. `--color-done` no `@theme` cria `text-done`, `bg-done`, `border-done` de graça. O trabalho de token que você fez não é jogado fora; ele muda de bloco.

**3 · Estado e responsivo são prefixos.** `hover:`, `focus-visible:`, `disabled:`, `active:` — e `sm:`, `md:`, que são `min-width`, mobile-first igual ao que você já escreveu. Detalhe feliz: o `sm` padrão do Tailwind é **40rem**, exatamente o breakpoint que você escolheu.

**4 · Valor arbitrário entre colchetes**, para o que não tem utilitário: `grid-cols-[2rem_1fr_6rem_5rem]`, `w-[37px]`. Underscore no lugar do espaço.

**5 · `@apply` existe e é armadilha.** Ele deixa você juntar utilitários num nome — ou seja, reinventar CSS Modules por dentro do Tailwind, ficando com as desvantagens dos dois. Se você sentir vontade de usar, o que você quer é um componente, não uma classe.

**O mapa do seu CSS de hoje**, que é o roteiro da migração:

```
.li           grid items-center gap-4  +  sm:grid-cols-[2rem_1fr_6rem_5rem]
.title        min-w-0 break-words
.card         shadow-sm m-4 p-4
.content      flex flex-col gap-4
.listTasks    list-none m-0 p-0
.field        flex items-center gap-2
```

**Armadilhas:** `className` fica quilométrico, e é o custo real — releia o seu JSX depois e veja se ainda dá para achar a estrutura no meio das classes. Classe condicional fica **pior** que em CSS Modules, e é exatamente aí que `clsx` e `cva` passam a se pagar (no tópico 4 eu disse que não valiam; com Tailwind muda). E nem tudo tem utilitário — quando não tiver, é `@theme` ou CSS normal, não gambiarra com colchetes.

---

# Parte B — Aplicação na `web/`

### 1. Antes de começar

Leia [`base-html.md`](base-html.md) e [`base-css.md`](base-css.md), nessa ordem, e faça **duas** coisas lá que não são leitura (as duas no DevTools, `F12`):

1. **Aba Elements → seu `<button>` → painel Accessibility.** Leia o **role** e o **name** dele. É literalmente o que o `getByRole` do T14 vai procurar e o que o leitor de tela vai falar. Faça o mesmo no `<li class="task-header">` e você vê o problema do tópico 8 com os próprios olhos, antes de eu argumentar nada.
2. **Aba Elements → seu `.task-item` → painel Styles.** Mexa nos valores até a linha ficar do jeito que você quer. Recarregar desfaz tudo. Cinco minutos ali valem mais que cinquenta linhas de explicação minha — é o mesmo caminho que funcionou no T1 quando você olhou a aba Network em vez de deduzir.

Uma linha que vai no `index.css` antes de tudo, e que resolve um problema histórico de uma vez (seção 5 do `base-css.md`):

```css
*, *::before, *::after { box-sizing: border-box; }
```

**Preparação do ambiente — depende da sua escolha no tópico 1, e é só isso que eu entrego pronto:**

- **CSS Modules ou CSS global:** nada a instalar. O Vite reconhece `*.module.css` nativamente. Zero configuração — comece a escrever.
- **Tailwind:** `npm install tailwindcss @tailwindcss/vite`, plugin no `vite.config.ts`, `@import "tailwindcss";` no `index.css`. Me chame quando tiver escolhido e eu deixo isso rodando — instalação é atrito, não aprendizado.
- **CSS-in-JS:** se for esse o caminho, me chame e a gente conversa antes de instalar, porque a decisão tem consequência no Tema 11 (bundle) e no Tema 10 (runtime).

Uma conferência antes de começar, valendo para qualquer escolha: `<meta name="viewport">` no `index.html` (tópico 6). Sem ele o responsivo é decorativo.

### 2. Os blocos

Quatro blocos, e **a ordem em que eles estão é a ordem em que se faz** — não tem grafo de dependência para montar na cabeça. Cada um diz o que o app ganha e quando está pronto; como você chega lá é seu. Sem coluna de status: o estado vive no devlog e nos commits, e commit é livre dentro do bloco.

---

#### Bloco 1 — As decisões que travam o resto

**O app ganha** um sistema de estilo escolhido e registrado, um vocabulário visual num lugar só, e uma lista cuja estrutura é o que ela diz ser.

Os três andam juntos e vêm primeiro porque cada um decide a marcação dos outros. Pintar antes de saber se a lista é `<table>` ou `<ul>` é refazer componente e CSS depois — a estrutura decide se o alinhamento de coluna é nativo ou é `grid`.

**Pronto quando:**
- o projeto tem **um** sistema de estilo, aplicado em todo componente que você tocar — nenhuma mistura de dois;
- o `web/README.md` tem o porquê da escolha em três ou quatro linhas, e a justificativa não é "é popular" nem "vi num vídeo"; a seção "Sem biblioteca de estilo ainda" foi substituída;
- você consegue dizer, falando, o que cada uma das outras três opções resolvia e por que você recusou;
- `*, *::before, *::after { box-sizing: border-box; }` está no `index.css`, e você sabe dizer o que muda sem ele;
- `:root` tem tokens de cor, espaçamento e raio, mais `--duration-*` e uma curva (o T10 vai usar);
- o CSS novo usa `var()` em vez de literal, e `#f5ead8` existe **uma vez só** — hoje está no `--bg` e chumbado no `.change-status`;
- o `li.task-header` foi resolvido de uma das duas formas: virou `<table>` com `<th scope="col">`, **ou** a linha de cabeçalho morreu e cada item rotula o próprio dado — com o motivo no README;
- você conferiu no painel **Accessibility** do DevTools que o `role` e o `name` do que sobrou fazem sentido;
- existe uma região `aria-live="polite"` no `TaskSummary`, **preexistindo na tela** (o conteúdo é estático hoje, e é de propósito — o T7 põe a flor no vaso).

Deixar o `li.task-header` como está é a única opção que não vale.

**O que decide entre tabela e lista, e não é semântica:** `<table>` é a escolha semanticamente mais correta e dá `<th scope="col">` de graça. Ela cobra caro nos dois temas seguintes. `<tr>` tem `display: table-row`, não vira flex, `transform` nela é inconsistente entre navegadores e altura não anima direito — ou seja, o **T10** (item entrando e saindo da lista, animação de layout ao filtrar, arrastar para reordenar) briga com tabela do começo ao fim. E no responsivo, tabela de 4 colunas em 360px ou rola na horizontal ou vira o truque de `display: block` + `::before` com `data-label`. Lista com `grid` não tem nenhum desses dois problemas. O custo da lista é resolver, sem linha de cabeçalho, como se sabe que o ícone é status e a data é previsão — rótulo visível no estreito, `aria-label` no ícone, ou os dois.

---

#### Bloco 2 — A tela fica apresentável

**O app ganha** estilo próprio no lugar do CSS herdado do T2, texto legível, e um layout que não arrebenta com conteúdo real nem em celular.

Agora a estrutura já está decidida, então o CSS que você escrever aqui é o CSS que fica.

**Pronto quando:**
- o `style={{ color: 'gray' }}` do `AddTaskField` não existe mais;
- o `p { color: gray }` do `App.css` não existe mais — nenhum seletor de tag nua pinta componente, só reset e tokens no global;
- o texto secundário passa de **4.5:1** de contraste, medido no seletor de cor do DevTools e **anotado no devlog** (o valor antigo e o novo);
- a variação visual por status vem de mapa ou de `data-status` (tópico 4), não de ternário aninhado — e se você foi de `data-status`, o README diz por quê;
- a coluna do título é `1fr` e não `200px`;
- existe um `title` de umas 300 letras no `mockTasks`, ele **fica lá**, e não vaza o container nem esmaga as outras colunas (dica: `min-width: 0`, seção 6 do `base-css.md`);
- um breakpoint só, mobile-first, e em 360px de largura nada sai da viewport na horizontal nem fica ilegível;
- está decidido — e implementado — o que acontece com a linha de cabeçalho no estreito.

---

#### Bloco 3 — A tela responde

**O app ganha** resposta a mouse, teclado e estado desabilitado; e as pastas passam a separar o que sabe do domínio do que não sabe, com a decisão de botão guardada num lugar só.

A ordem interna aqui tem lógica: primeiro os estados visuais existem soltos, depois eles têm onde morar. Encapsular antes de existir decisão é encapsular o vazio (tópico 14).

**Pronto quando:**
- o botão de status tem `:hover`, `:focus-visible`, `:disabled` e `:active` visíveis;
- não existe `outline: none` sem substituto em lugar nenhum;
- `Tab` percorre a página do topo ao fim com o foco **sempre visível**, e a ordem bate com a ordem visual — feito de verdade, e o que você encontrou está no devlog;
- alvo clicável de no mínimo 24px, crescido com `padding` (não com `margin`);
- `Section` saiu de `components/` para `ui/`; `AddTaskField` virou campo genérico com nome honesto e foi para `ui/`; `Content` foi para `components/tasks/`, porque importa `Task`;
- nada em `ui/` importa `Task` nem fala de tarefa, e tudo que fala está em `tasks/`;
- componente virou pasta **só** onde tem arquivo irmão — nenhuma pasta com um arquivo só dentro;
- o critério `ui/` × domínio está escrito no README;
- existe `ui/Button` com os quatro estados dentro dele, usado no `change-status`;
- `variant` é união (`primary`/`ghost`/`danger`), não uma pilha de booleanos;
- ele **não esconde** a tag: `onClick`, `type`, `disabled` e `aria-label` continuam funcionando de fora;
- se você usou `React.ComponentProps<'button'>`, sabe explicar as três linhas (regra 1).

Se você discordar de algum dos três movimentos de pasta, o critério é o do tópico 13 e eu quero ouvir o argumento.

---

#### Bloco 4 — O tema fecha

**O app ganha** o que a regra 4 exige para o tema poder ser chamado de fechado.

**Pronto quando:**
- `npm run typecheck` limpo (`tsc -b --noEmit`);
- console do navegador sem aviso, e nenhum `class="undefined"` na tela — abra o inspetor e confira, é o bug clássico de CSS Modules;
- `web/README.md` atualizado: sistema de estilo e porquê, onde moram os tokens, critério `ui/` × domínio, decisão do cabeçalho;
- devlog do dia escrito, com o contraste medido e o achado do teste de teclado;
- revisão da Parte B feita comigo, correções aplicadas;
- tudo commitado e push conferido em `.git/refs/remotes/origin/main`.

---

### 3. Depois do tema — a migração para Tailwind

Isto **não é um bloco do T3**: o tema fecha no Bloco 4 e esta é a migração que vem em seguida. O mesmo app, mesma tela, mesmo comportamento — com Tailwind no lugar de CSS Modules. Estudo no tópico 16.

**Por que existe:** escolha sua, para aprender Tailwind. E a migração ensina mais que ter começado nele: você resolve os mesmos problemas duas vezes com ferramentas diferentes, e a pergunta *"por que você escolheu esse sistema de estilo"* passa a ter resposta de quem usou os dois.

> **Meia jornada.** Se passar disso, para e me chama — sete componentes e seis módulos triviais não justificam mais que isso, e passar do tempo é sinal de que algo está sendo feito do jeito difícil.

**Preparação do ambiente — você mesmo instala:**

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* index.css — o import substitui tudo que havia antes */
@import 'tailwindcss';

@theme {
  --color-bg: #f5ead8;
  --color-text: #6b5e4a;
  --color-done: #2f6f4f;
  --color-doing: #8a5000;
  --color-todo: firebrick;
}
```

Três notas: o Tailwind 4 **não usa `tailwind.config.js`** — a configuração é o `@theme`, dentro do CSS. O reset de `box-sizing` e a normalização de margem já vêm no `@import`, então as suas linhas de reset saem. E os `--space-*` e `--font-size-*` podem sair também: a escala de espaçamento e a tipográfica já existem como utilitários (`gap-4`, `text-2xl`).

**Pronto quando:**
- não existe nenhum arquivo `.module.css` no projeto;
- as cores vivem no `@theme` e não há hexadecimal solto no JSX;
- a tela é a mesma: confira em 360px e em desktop, lado a lado com um print de antes;
- o contraste foi **medido de novo** — token migrado errado é a falha mais provável aqui;
- o **teste de teclado dá o mesmo resultado de antes** do Bloco 3. Se mudou, a migração quebrou algo, e é o tipo de quebra que não aparece na tela;
- `npm run typecheck` limpo e console sem aviso;
- o README ganhou a **história**: a decisão de CSS Modules fica, com o porquê, seguida da de Tailwind e do que a migração te mostrou na prática;
- o devlog registra as duas ou três coisas que doeram — é a matéria-prima da resposta de entrevista e de um post.

---

### 4. Revisão do código

Me chama no Bloco 4. Eu leio a `web/` inteira, incluindo o CSS, que é o material novo, e aponto de forma simples onde estão os erros e o que faltou, pra você corrigir antes de fechar o tema.

Se quiser revisão parcial no meio do caminho, o corte natural é no fim do **Bloco 3**: aí o estilo e os componentes de UI já existem e ainda dá tempo de mudar de rumo.
