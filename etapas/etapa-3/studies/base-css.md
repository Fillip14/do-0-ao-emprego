# Base — CSS

> **O que é este arquivo.** O **Tema 0** da Etapa 3, parte 2 de 2: o vocabulário de CSS que devia estar de pé antes de o React começar e não estava. A Etapa 1 deu HTML/CSS em umas duas horas de um dia dividido com orientação a objetos e DOM — isto aqui é a dívida sendo paga.

---

## 0. Antes de tudo: ninguém decora CSS

A sua pergunta foi *"eu nem faço ideia que essas coisas existem, como você sabe?"*. A resposta honesta: **não sei de cabeça, eu consulto** — e consultar é a habilidade, não a memória. CSS tem umas 500 propriedades. Nenhum profissional sabe todas; todos sabem umas 40 e sabem procurar as outras. Os dois lugares:

**1 · O DevTools, e é aqui que se aprende de verdade.** `F12` → aba **Elements** → clique num elemento → painel **Styles** à direita. Ali você vê **todo** o CSS que está agindo naquele elemento, de onde cada regra veio, e o que foi sobrescrito (aparece riscado). Clique em qualquer valor e digite outro: **a tela muda na hora**. Clique no `+` e comece a digitar: ele autocompleta a lista inteira de propriedades. Nada que você mexer ali é permanente — recarregar desfaz tudo. É um laboratório sem consequência, e é o caminho mais rápido para CSS entrar no dedo. Você respondeu melhor no T1 quando olhou a aba Network em vez de deduzir; aqui é a mesma coisa.

**2 · A MDN** — `developer.mozilla.org`. Busque `mdn css` + o nome. Cada propriedade tem página com os valores aceitos, exemplo editável e compatibilidade. É a documentação de referência da web, mantida pela Mozilla, e é o que profissional abre dez vezes por dia. Se um resultado de busca não é MDN nem a doc oficial da ferramenta, desconfie: CSS acumulou uma década de conselho velho na internet.

**A regra de ouro que muda o seu jeito de depurar:** CSS **falha em silêncio**. Propriedade com nome errado, valor inválido, unidade faltando — nada disso dá erro. O navegador lê, não entende, **descarta a linha** e segue. Não existe "quebrou": existe "não fez nada". Então quando o CSS não funciona, o primeiro passo nunca é reescrever — é **abrir o DevTools e olhar se a sua regra está lá**. Se estiver riscada, outra ganhou (seção 7). Se não estiver, o seletor não casou. Se estiver com triângulo amarelo, você escreveu algo que não existe.

---

## 1. Como o CSS chega no elemento

Três peças, nesta ordem:

```tsx
// 1. no JSX você escreve className
<span className="task-title">{task.title}</span>
```

```html
<!-- 2. o React põe no HTML o atributo class -->
<span class="task-title">Estudar React</span>
```

```css
/* 3. o CSS procura por esse nome com um ponto na frente */
.task-title { color: black; }
```

**`className` é uma palavra do React, `class` é do HTML.** O motivo é bobo e histórico: `class` é palavra reservada do JavaScript, e JSX vira JavaScript (T1), então usar `class` ali daria erro de sintaxe. Mesma razão de `htmlFor` em vez de `for`. Só esses dois são estranhos; o resto dos atributos tem o nome normal.

**Atributo** é aquele `nome="valor"` dentro da tag. `class` é o atributo que serve para **etiquetar** um elemento para o CSS achar. Um elemento pode ter várias etiquetas, separadas por espaço: `class="item destaque"` casa com `.item` **e** com `.destaque`.

**Os três lugares onde CSS pode morar** — e por que só um presta:

```html
<!-- ❌ atributo style: só naquele elemento, vence quase tudo, impossível reaproveitar -->
<span style="color: gray">...</span>

<!-- ❌ tag <style> no HTML: melhor, mas fora do componente que ele estiliza -->
<style> .task-title { color: black; } </style>

<!-- ✅ arquivo .css importado: reaproveitável, cacheável, versionado, e o navegador otimiza -->
```

```tsx
// no React o import é assim, e o Vite cuida do resto
import './App.css';                       // CSS global
import styles from './Item.module.css';   // CSS Modules (tópico 2 do T3)
```

O `style={{ color: 'gray' }}` que você escreveu no `AddTaskField` é a primeira forma, em versão React (objeto JavaScript em vez de string). Funciona, e é por isso que é tentador. É o último recurso: cabe em valor **calculado em runtime** (uma altura medida, no T14) e em nada mais.

---

## 2. A regra: seletor, propriedade, valor — e propriedade **não** é método

```css
.task-item        {  color  :  gray  ;  }
/* └─ seletor ─┘     └ prop ┘  └ val ┘        */
/*                └──── declaração ─────┘     */
/* └────────────── regra (rule) ───────────┘  */
```

**Seletor** = *quem* recebe. **Propriedade** = *qual característica*. **Valor** = *quanto*. Declaração termina em `;`. O conjunto entre `{ }` é uma regra.

**`color`, `border`, `padding` não são métodos — são propriedades.** A diferença importa. Método é algo que você **chama** e que **executa**, e que você pode criar. Propriedade é uma **característica de nome fixo**, de uma lista que **o navegador define** e você não amplia. Você não está chamando nada e não está programando: está preenchendo um formulário de umas 500 linhas, onde só valem as que você escreve e o resto fica no padrão.

Daí a consequência da seção 0: `colr: red` não dá erro, só não faz nada.

**CSS tem funções, e é onde os parênteses aparecem.** Essas são chamadas de verdade, sempre no lugar do **valor**, nunca da propriedade:

```css
color: rgb(47 111 79);              /* monta uma cor a partir de números       */
padding: var(--space-2);            /* lê o valor guardado numa variável CSS   */
width: calc(100% - 2rem);           /* faz conta, inclusive misturando unidade */
transition-timing-function: cubic-bezier(0.2, 0, 0, 1);  /* desenha uma curva  */
```

**As propriedades que resolvem quase tudo.** "500 propriedades" paralisa; esta tabela não:

| Grupo | Propriedades | O que fazem |
|---|---|---|
| Texto | `color` `font-size` `font-weight` `font-family` `line-height` `text-align` | cor e forma da letra |
| Caixa | `padding` `margin` `border` `border-radius` `background` | espaço dentro, espaço fora, contorno, cantos, fundo |
| Tamanho | `width` `height` `max-width` `min-width` | quanto o elemento ocupa |
| Layout | `display` `gap` `flex-direction` `align-items` `justify-content` `grid-template-columns` | como os filhos se arrumam |
| Estado/efeito | `opacity` `cursor` `outline` `transition` `transform` | transparência, ponteiro, anel de foco, movimento |

**Armadilhas.** `;` faltando derruba **a declaração seguinte** também, não a atual — erro que parece aleatório. `background: red` é **atalho** de várias propriedades ao mesmo tempo (`background-color`, `background-image`, `background-position`...), e a forma curta **zera** as que você não mencionou: é assim que um atalho apaga silenciosamente um valor que você tinha posto antes. `padding`, `margin`, `border` e `font` também são atalhos.

---

## 3. Os seletores que importam

```css
p            { }   /* toda tag <p> do documento              */
.task-item   { }   /* todo elemento com class="task-item"     */
#task        { }   /* o elemento com id="task" (único)        */
*            { }   /* todos                                  */

.card p      { }   /* <p> em qualquer lugar DENTRO de .card   */
.card > p    { }   /* <p> filho DIRETO de .card               */
.a.b         { }   /* tem as duas classes ao mesmo tempo      */
.a, .b       { }   /* uma OU outra (duas regras de uma vez)   */

[data-status='done'] { }   /* por atributo — útil no T3        */
```

Espaço entre dois seletores significa **"dentro de"**. Vírgula significa **"ou"**. Confundir os dois é erro de estreia: `.a .b` e `.a, .b` fazem coisas completamente diferentes.

**O que você vai usar 95% do tempo: classe.** Tag nua é regra global e fraca (é o problema do seu `p { color: gray }`, seção 7). `id` no CSS é desnecessariamente forte e o id é melhor gastado em acessibilidade (`htmlFor`). Seletor aninhado com três níveis (`.a .b .c`) é dívida: ele amarra o CSS à estrutura do HTML, e mudar a estrutura quebra o estilo sem aviso.

---

## 4. Unidades: quatro famílias e um caso especial

Número puro quase nunca vale em CSS: `4` não significa nada, `4px` significa. **A unidade responde uma pergunta só: em relação a quê?**

**1 · Absoluta — `px`.** Um pixel de CSS, fixo. Não é o pixel físico: num celular retina, 1px de CSS são 2 ou 3 pixels reais, e o navegador cuida disso. Use no que não deve escalar — espessura de borda (`1px`), raio de canto.

**2 · Relativa à fonte — `rem`, `em`, `ch`.** A família que importa:

- **`rem`** = *root em* → a `font-size` do `<html>`, que por padrão é **16px**. Então `1rem = 16px`, `0.5rem = 8px`, `1.5rem = 24px`. Sempre a raiz, não importa a profundidade.
- **`em`** = a `font-size` **do próprio elemento**. Muda de significado conforme onde está e **compõe**: `1.5em` dentro de outro `1.5em` dá 2.25×. Poderoso e traiçoeiro.
- **`ch`** = a largura do caractere "0" na fonte atual. `max-width: 60ch` ≈ "60 caracteres por linha", que é a medida de legibilidade de coluna de texto.

**Por que `rem` e não `px` em fonte e espaço:** quem tem baixa visão aumenta a fonte padrão do navegador para 20px. Com `rem`, o app inteiro cresce junto e proporcional. Com `px`, **nada muda** e a configuração da pessoa é ignorada.

**3 · Relativa ao pai / à tela — `%`, `vw`, `vh`, `dvh`.** `50%` é metade **do pai** (de qual dimensão depende da propriedade — em `width` é a largura; em `padding` é **sempre** a largura, o que surpreende). `100vw`/`100vh` é a viewport inteira; `dvh` é a versão de `vh` que desconta a barra do navegador no celular.

**4 · Tempo — `ms` e `s`.** `ms` = milissegundo, 1/1000 de segundo. `120ms` = `0.12s`, a mesma coisa; a comunidade escreve `ms` porque duração de interface vive entre 100 e 400ms e ler `0.12s` é pior. Só aparece em `transition` e `animation`.

**E `fr`, o caso especial.** *Fraction*, e **só existe dentro de Grid** — não dá para escrever `width: 1fr`. Significa "uma fatia do espaço que **sobrou** depois de acomodar o resto". Em `grid-template-columns: auto 1fr auto auto`, as três `auto` pegam o tamanho do próprio conteúdo e o `1fr` fica com todo o restante. Com `1fr 2fr`, a segunda fica com o dobro da primeira.

```css
border: 1px solid;                      /* 1 pixel, não escala e não deve      */
font-size: 1.125rem;                    /* 18px — 22.5px se a pessoa aumentou  */
padding: 0.5rem 1rem;                   /* 8px em cima/baixo, 16px nos lados   */
max-width: 60ch;                        /* ~60 caracteres de largura           */
width: 100%;                            /* toda a largura disponível no pai    */
grid-template-columns: auto 1fr auto;   /* a do meio come o que sobrou         */
transition: opacity 120ms;              /* 0,12 segundo                        */
```

**Armadilhas.** Número sem unidade é inválido e ignorado em silêncio (`width: 40` não faz nada), com **três exceções** que você vai encontrar: `0` (não precisa), `line-height: 1.5` (sem unidade é *multiplicador da fonte*, e é a forma certa) e `opacity`/`flex`/`z-index`, que não são medidas. `%` em `height` só funciona se o pai tiver altura definida — a causa de quase todo "meu `height: 100%` não faz nada". E se algum CSS puser `html { font-size: 10px }` para "facilitar a conta de rem", ele quebrou o zoom de fonte de todo mundo: truque velho, não faça.

---

## 5. O box model: todo elemento é uma caixa

Esta é a seção que mais rende, porque **todo** elemento da página é uma caixa de quatro camadas, de dentro para fora:

```
┌─────────────────── margin ────────────────────┐   espaço FORA, empurra vizinhos
│  ┌──────────────── border ─────────────────┐  │   a linha do contorno
│  │  ┌───────────── padding ─────────────┐  │  │   espaço DENTRO, entre borda e conteúdo
│  │  │                                   │  │  │
│  │  │            content                │  │  │   o texto / a imagem
│  │  │                                   │  │  │
│  │  └───────────────────────────────────┘  │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

**`padding` × `margin` é a confusão número um do CSS**, e a distinção é simples:

- **`padding`** empurra o conteúdo **para dentro**: a caixa fica maior, o fundo (`background`) cobre esse espaço, e a **área clicável cresce**. É como se aumenta um botão pequeno.
- **`margin`** empurra os **vizinhos**: é espaço vazio fora da caixa, o fundo não chega ali, e a área clicável **não** muda.

Botão pequeno demais se resolve com `padding`, nunca com `margin`. Botões grudados se resolvem com `gap` no pai (seção 6), melhor que `margin`.

**`box-sizing`, e por que uma linha resolve um problema histórico.** Por padrão, `width: 200px` mede **só o content**: com `padding: 16px` e `border: 1px`, a caixa ocupa 234px na tela. Isso surpreende todo mundo, sempre. A correção é universal e vai no topo do CSS de qualquer projeto:

```css
*, *::before, *::after { box-sizing: border-box; }
```

Com `border-box`, `width: 200px` significa 200px **na tela**, padding e borda incluídos. Ponha isso no seu `index.css` hoje e nunca mais pense nisso.

**Armadilhas.** `margin` vertical entre irmãos **colapsa**: 16px embaixo de um e 16px em cima do outro dão 16px, não 32 — comportamento antigo, esquisito, e é a razão de `gap` ter sido inventado. `margin: 0 auto` centraliza horizontalmente (a versão moderna é `margin-inline: auto`), mas só funciona com `width`/`max-width` definido. `outline` mora "junto" da borda mas **não ocupa espaço no layout** — é exatamente por isso que ele é o anel de foco: aparecer e desaparecer não move a tela um pixel. E o DevTools desenha esse diagrama para o elemento selecionado, com os números reais: aba Elements, painel Computed, a figura no topo.

---

## 6. `display`: o que decide o layout

Antes de posicionar qualquer coisa, o elemento precisa saber **como se comportar**. É o que `display` diz, e é o pré-requisito de Flexbox e Grid.

| Valor | Comportamento |
|---|---|
| `block` | ocupa a **linha inteira**, aceita `width`/`height`. Padrão de `div`, `p`, `section`, `li` |
| `inline` | fica **na linha do texto**, ignora `width`/`height` e margem vertical. Padrão de `span`, `a` |
| `inline-block` | fica na linha, **mas** aceita tamanho e padding. O meio-termo |
| `flex` | vira container e arruma os **filhos** em uma direção |
| `grid` | vira container e arruma os filhos em **linhas e colunas** |
| `none` | desaparece, e **sai do fluxo e da tabulação** (≠ `opacity: 0`, que fica lá invisível) |

Duas coisas para não errar:

**`display` muda o comportamento dos FILHOS, não do próprio elemento.** `display: flex` num `<ul>` não faz o `<ul>` virar nada de especial — ele faz os `<li>` se arrumarem em fileira. Isso confunde até quem já usa há anos.

**`span` ignorar `width` não é bug.** Se você puser `width: 200px` num `<span>` e nada acontecer, é porque ele é `inline`. Ou troque para `inline-block`, ou o pai é `flex`/`grid` (aí a regra muda de dono).

```css
/* fileira: rótulo, conteúdo, botão — uma dimensão → flex */
.row { display: flex; align-items: center; gap: 0.5rem; }

/* colunas alinhadas entre linhas diferentes → grid */
.item { display: grid; grid-template-columns: auto 1fr auto; gap: 0.5rem; align-items: center; }
```

**A regra de bolso:** **Flex para uma dimensão** (uma fileira ou uma coluna), **Grid para duas** — ou quando você quer as colunas **alinhadas entre linhas diferentes**, que é o caso da sua lista de tarefas.

**Armadilhas.** `align-items` alinha no eixo **transversal**, `justify-content` no principal — trocar os dois é o erro mais comum de flex e você vai cometer; o DevTools tem um editor visual de flex/grid que mostra o efeito de cada valor, use. Item de flex/grid tem `min-width: auto` por padrão, então **texto longo empurra o container** em vez de encolher: a correção é `min-width: 0` no item, e sem ela o layout arrebenta com título grande. `gap` funciona em flex desde 2021 — tutorial com `margin-right` + `:last-child { margin: 0 }` é velho.

---

## 7. Herança, cascade e especificidade: quem ganha o empate

Duas regras mandando na mesma propriedade do mesmo elemento. O navegador não sorteia.

**Herança primeiro:** algumas propriedades **descem** para os filhos sem você pedir — `color`, `font-*`, `line-height`, `text-align`. Outras não — `padding`, `border`, `background`, `display`. É por isso que definir `color` no `body` pinta o texto do app inteiro, e é por isso que herança é difícil de rastrear: o valor não está escrito em lugar nenhum perto do elemento.

**Depois especificidade** — quão preciso é o seletor:

```
tag           p { }              → mais fraco
classe        .task-item { }     → vence tag
id            #task { }          → vence classe
inline        style={{ }}        → vence id
!important                       → vence tudo (e é sintoma, não solução)
```

**No empate, ordem:** a última escrita ganha. Só isso.

Isso explica o seu `p { color: gray }`: seletor de tag, o mais fraco que existe, e **qualquer classe vence**. Soa conveniente até você não entender por que aquele parágrafo específico está cinza — regra global, fraca e invisível.

**Armadilhas.** `!important` funciona, e é armadilha: ele vence, e o próximo problema só se resolve com outro `!important`, até o arquivo estar em guerra consigo mesmo. Se você precisou dele, o seletor está errado. A saída sadia é **baixar a especificidade de todo mundo**: uma classe por componente, nada de `.a .b .c`. E o DevTools mostra isso de graça — regra perdedora aparece **riscada** no painel Styles, com o arquivo e a linha de quem ganhou ao lado.

---

## 8. O `@`: at-rules — instrução, não estilo

`@algo` não pinta nada. É uma instrução para o próprio motor de CSS: "só aplique isto se tal condição valer", "carregue tal coisa", "guarde esta receita com este nome". O `@` é o sinal de que a linha fala *sobre* CSS em vez de *ser* CSS.

```css
/* @media — condição. "Só valha quando a tela tiver ao menos 40rem de largura." */
@media (min-width: 40rem) {
  .item { grid-template-columns: auto 1fr auto auto; }
}

/* @media também consulta preferências do sistema, não só tamanho */
@media (prefers-reduced-motion: reduce) { /* T14 */
  * { transition-duration: 0.01ms; }
}

/* @keyframes — guarda uma receita de animação com nome (T14) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@import 'reset.css';       /* puxa outro CSS — é o que o Tailwind usa */
@font-face { }             /* registra uma fonte própria */
```

`@media (min-width: 40rem)` se lê literalmente: *"para este media (a tela), quando a largura mínima for 40rem, valem estas regras"*. Fora da condição, o bloco não existe. É o mecanismo inteiro do responsivo — não há outro.

**A lista completa.** São umas 15, não 4 — os exemplos acima são só as que o T3 usa. Triagem honesta:

**Você usa agora:**

| At-rule | O que faz |
|---|---|
| `@media` | condição de tela, de dispositivo ou de **preferência do sistema** |
| `@import` | puxa outro arquivo CSS (é o que o Tailwind usa) |
| `@font-face` | registra uma fonte própria |
| `@keyframes` | guarda uma receita de animação com nome (T14) |

**Sabe que existem, e três delas você vai querer:**

| At-rule | O que faz |
|---|---|
| `@supports` | condição de **suporte do navegador**: "se o navegador entende esta propriedade, use isto". É como se escreve CSS novo sem quebrar navegador velho |
| `@container` | condição pelo tamanho **do elemento pai**, não da tela. É o que `@media` sempre quis ser: um card que se reorganiza porque *ele* está estreito, não porque a janela está |
| `@layer` | camadas de cascade — decide qual **grupo** de regras vence, independente de especificidade. É a resposta profissional ao problema do `!important` (seção 7) |
| `@property` | registra uma variável CSS **com tipo**, o que a torna animável. Volta no T14 |
| `@starting-style` | o estado inicial de um elemento que acabou de aparecer, para ele poder animar a entrada. Também T14 |
| `@scope` | limita as regras a um pedaço da árvore. A mais nova das citadas aqui — confira suporte antes de usar |

**Existem e você provavelmente nunca vai tocar:** `@page` (impressão), `@counter-style` (marcador de lista customizado), `@charset` (codificação da folha — hoje se resolve no HTTP e no `<meta>`), `@namespace` (XML), `@font-feature-values` e `@font-palette-values` (detalhe tipográfico), `@view-transition` e `@position-try` (as mais recentes).

**Como ler qualquer `@` que você encontrar:** a estrutura é sempre a mesma — `@nome` + uma condição ou um nome + um bloco. Se tem condição, é *"só valha quando"*. Se tem nome, é *"guarde isto como"*. Não precisa conhecer a at-rule para saber o que ela está fazendo ali.

**Armadilhas.** `@media` **não aumenta especificidade**: a regra dentro dele vence a de fora só porque vem **depois** no arquivo. Media query no topo do arquivo perde, e você vai jurar que o navegador está quebrado — mobile-first também é ordem de escrita. `@import` no meio do CSS é ignorado (vale só no topo) e é lento. `@supports` testa **sintaxe**, não bug: o navegador dizer que entende `gap` não garante que a implementação seja boa. E não confunda `@media (min-width)` com `@container`: o primeiro pergunta o tamanho da janela, o segundo o tamanho do pai — num componente reutilizável, quase sempre a pergunta certa é a segunda.

---

## 9. O `:` e o `::` — pseudo-classe e pseudo-elemento

O seletor `.button` diz *qual* elemento. O que ele não diz é **em que situação**: o mouse está em cima? está desabilitado? é o primeiro da lista? Pseudo-classe é o sufixo que acrescenta essa condição — um `if` embutido no seletor.

```css
.button               { background: green; }
.button:hover         { background: darkgreen; }    /* mouse em cima          */
.button:disabled      { opacity: 0.5; }             /* tem o atributo disabled */
.button:active        { transform: scale(0.97); }   /* durante o clique        */
.button:focus-visible { outline: 2px solid; }       /* focado por teclado      */
```

Leia `.button:hover` como frase: *"elemento com classe button, **enquanto** o mouse está sobre ele"*. O navegador liga e desliga isso sozinho. **A força real:** `:hover` funciona sem uma linha de JavaScript — e é por isso que `:hover` em CSS é sempre melhor que `onMouseEnter` + `useState`, que causa re-render a cada movimento do mouse (volta no T11).

**Não é coisa de botão.** Usei `.button` nos exemplos porque é o que o T3 pede, mas pseudo-classe é um **sufixo que cola em qualquer seletor** — tag, classe, id, atributo:

```css
li:hover              { background: #eee; }   /* item de lista, sem botão nenhum */
li:first-child        { border-top: 0; }       /* o primeiro da lista            */
tr:nth-child(even)    { background: #f7f7f7; } /* zebra na tabela                */
a:visited             { color: purple; }       /* link já visitado               */
input:focus           { border-color: blue; }  /* campo em foco                  */
.item:not(:last-child){ border-bottom: 1px solid; } /* todos menos o último     */
.field:has(input:invalid) { border-color: red; }    /* o PAI de um campo inválido */
```

**A lista completa tem umas 60.** Ninguém decora — você reconhece as categorias e consulta a MDN. As cinco famílias:

**1 · Estado de interação** — `:hover` (ponteiro em cima; não existe no toque) · `:active` (no instante do clique) · `:focus` (focado) · `:focus-visible` (focado **por teclado**) · `:focus-within` (**algum descendente** está focado — ótimo para destacar o formulário inteiro enquanto se digita nele).

**2 · Link** — `:link` (não visitado) · `:visited` (visitado; o navegador limita o que se pode estilizar aqui, por privacidade) · `:any-link` · `:target` (o elemento apontado pelo `#hash` da URL).

**3 · Formulário** — `:disabled` / `:enabled` · `:checked` · `:indeterminate` · `:required` / `:optional` · `:valid` / `:invalid` · `:user-valid` / `:user-invalid` (só depois de a pessoa **interagir**, e é a versão que você quer no T5 — `:invalid` pinta o campo de vermelho antes de a pessoa digitar nada) · `:read-only` / `:read-write` · `:placeholder-shown` (o campo está vazio e mostrando o placeholder) · `:in-range` / `:out-of-range` · `:default`.

**4 · Estrutura (posição na árvore)** — `:root` (o `<html>`, onde os tokens moram) · `:first-child` / `:last-child` / `:only-child` · `:nth-child(n)` e `:nth-last-child(n)` (aceita `2`, `even`, `odd`, `3n+1`) · `:first-of-type` / `:last-of-type` / `:nth-of-type(n)` / `:only-of-type` · `:empty` (sem conteúdo nenhum dentro).

**5 · Lógicas — recebem outros seletores como argumento**, e são as quatro que mudaram o CSS moderno:

| Pseudo-classe | O que faz |
|---|---|
| `:not(x)` | tudo **menos** o que casar com `x` |
| `:is(a, b, c)` | atalho para "qualquer um destes" — `:is(h1,h2,h3) span` no lugar de três seletores |
| `:where(a, b, c)` | igual a `:is`, mas com **especificidade zero** — é como se escreve CSS de base que qualquer classe sua vence sem briga (seção 7) |
| `:has(x)` | **o seletor de pai**, que não existia até 2023: `.field:has(input:invalid)` seleciona o *campo* porque o *input dentro dele* é inválido. Inverte o sentido do CSS, que sempre foi de fora para dentro |

**Outras que existem:** `:lang()` · `:dir()` · `:defined` · `:open` (`<details>`/`<dialog>` aberto) · `:popover-open` · `:fullscreen` · `:modal`.

**`::` com dois pontos é outra coisa: pseudo-*elemento*.** Não é estado — é um pedaço que **não existe no seu HTML**. São poucos, e esses são todos os que importam: `::before` / `::after` (um filho fantasma onde cabe conteúdo e estilo) · `::placeholder` (o texto cinza dentro do input) · `::selection` (o trecho marcado com o mouse) · `::marker` (a bolinha ou o número do `<li>`) · `::first-line` / `::first-letter` · `::file-selector-button` (o botão do `input type="file"`, que só se estiliza assim) · `::backdrop` (o fundo escurecido atrás de um `<dialog>` — volta se você fizer modal). **Um `:` = estado do elemento; dois `::` = parte do elemento.** É a distinção inteira.

**Armadilhas.** Pseudo-classe é só estilo — ela não informa nada ao React, e o React não sabe que o mouse está em cima. Encadear em qualquer ordem funciona, e `.btn:hover:not(:disabled)` é a combinação certa para "hover, mas não em botão desabilitado". `:focus` pega clique de mouse também e `:focus-visible` não. `:nth-child` conta **todos** os irmãos e `:nth-of-type` conta só os da mesma tag — a diferença que faz `p:nth-child(2)` não selecionar o segundo parágrafo quando há uma `div` no meio. `:is()` assume a especificidade do argumento mais forte e `:where()` não assume nenhuma — escolher errado aí é briga de cascade de graça. E `::before` não funciona em elemento vazio por natureza (`<input>`, `<img>`): não há "dentro" onde inserir.

---

## O que **não** está aqui, e por quê

Este arquivo é fechado. O que ficou de fora ficou de propósito, e cada coisa tem dono:

- **Tags, atributos, árvore, semântica, formulário, tabela** → [`base-html.md`](base-html.md), a parte 1 do Tema 0.
- **`transition`, `transform`, `@keyframes` a fundo, curvas, compositor × layout × paint, `prefers-reduced-motion`** → Parte A do **T14**. É o assunto daquele tema.
- **`:invalid`, `:checked`, `:placeholder-shown`, estilizar `select` e `checkbox`** → **T5**.
- **O que o `vite build` faz com o CSS** (bundle, hash, minificação) → **T10**.

A regra: **base é o chão que faltou; sintaxe que um tema estreia é do tema.** Um arquivo que cresce para sempre não fecha nunca e vira depósito — a mesma razão de não existir uma pasta `utils/` no dia 1.
