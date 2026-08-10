# Base — HTML

> **O que é este arquivo.** O **Tema 0** da Etapa 3, parte 1 de 2: o vocabulário de HTML que devia estar de pé antes de o React começar e não estava. A Etapa 1 deu HTML/CSS em umas duas horas de um dia dividido com orientação a objetos e DOM — isto aqui é a dívida sendo paga.

---

## 0. O que o HTML é — e o que ele não é

HTML **não é** linguagem de programação: não tem variável, condição, laço nem função. É uma linguagem de **marcação** — você pega texto e o envolve em marcas que dizem **o que aquilo é**. "Este trecho é um parágrafo." "Este é um botão." "Estes cinco são uma lista."

O que ele **não** faz: aparência (é o CSS) e comportamento (é o JavaScript). A divisão clássica da web, e ela é real:

```
HTML  →  o que a coisa É            (estrutura e significado)
CSS   →  como a coisa PARECE        (apresentação)
JS    →  o que a coisa FAZ          (comportamento)
```

**Por que "o que a coisa é" importa tanto**, e é o fio que amarra o T3 inteiro: o navegador, o leitor de tela, o Google e a Testing Library (T13) **só sabem o que você marcou**. Se você marca um botão como `<div>`, para todos eles aquilo é uma caixa sem função — e cada um dos quatro te cobra depois. Marcação certa é informação; marcação errada é informação errada, não ausência de informação.

**O navegador é permissivo, e isso é uma armadilha.** HTML mal escrito não dá erro: o navegador **conserta do jeito dele** e segue. Tag não fechada, aninhamento inválido, atributo inventado — nada disso quebra. Mesma lógica do CSS que falha em silêncio (seção 0 do `base-css.md`), e a mesma consequência: a única forma de saber o que existe de verdade é **abrir o DevTools e olhar** (seção 11).

---

## 1. Anatomia: tag, elemento, conteúdo

```html
<p class="intro">Olá, mundo</p>
│ │            │ │        │ │
│ └ abertura ──┘ └ conteúdo└ fechamento
└──────────────── elemento ──────────┘
```

**Tag** é a marca (`<p>`). **Elemento** é a coisa inteira: abertura + conteúdo + fechamento. A tag de fechamento repete o nome com uma barra: `</p>`. Nome de tag não diferencia maiúscula de minúscula, mas a convenção é minúscula sempre.

**Elementos vazios fecham sozinhos.** Alguns não têm conteúdo por natureza, então não têm fechamento:

```html
<input type="text">        <!-- um campo: o conteúdo dele é o que o usuário digita -->
<img src="/foto.png" alt="Uma foto">
<br>                       <!-- quebra de linha -->
<hr>                       <!-- linha divisória -->
<meta charset="utf-8">
```

**No JSX isso muda e é obrigatório:** JSX exige a barra final — `<input />`, `<img />`, `<br />`. Sem ela é erro de sintaxe, porque JSX não é HTML (seção 10).

**Armadilhas:** tag não fechada não dá erro, mas o navegador decide onde ela termina — e a decisão dele pode não ser a sua, o que produz uma árvore diferente da que você imaginou. `<p>` não pode conter `<div>` (regra de aninhamento, seção 3), e quando você tenta, o navegador **fecha o `<p>` sozinho** antes da `div`. Isso é invisível no código e visível no DevTools.

---

## 2. Atributos: a configuração do elemento

Atributo é o `nome="valor"` que vive **dentro da tag de abertura**, e é como se configura o elemento. Vários, separados por espaço:

```html
<input type="email" id="email" name="email" placeholder="voce@exemplo.com" required>
```

**Os que valem em qualquer elemento:**

| Atributo | Para quê |
|---|---|
| `class` | etiqueta para o CSS achar. Várias, separadas por espaço: `class="item destaque"` |
| `id` | identificador **único no documento**. Serve para `<label for>`, âncora e JS |
| `style` | CSS inline — último recurso (seção 1 do `base-css.md`) |
| `data-*` | dado seu, de nome livre: `data-status="done"`. Não faz nada sozinho; é para o CSS e o JS lerem |
| `hidden` | esconde o elemento |
| `title` | tooltip ao passar o mouse. Não é acessível, não conte com ele |

**Atributos booleanos: a presença é o valor.** Não existe `disabled="false"` — ou o atributo está lá (verdadeiro) ou não está (falso):

```html
<button disabled>Salvar</button>     <!-- desabilitado -->
<button>Salvar</button>              <!-- habilitado   -->
<input type="checkbox" checked>
<input required>
```

É daí que vem aquele detalhe do T2: `<TaskItem done />` em JSX significa `done={true}` — herança direta desta regra do HTML.

**Armadilhas:** `id` repetido é HTML inválido e não dá erro nenhum — quebra `<label for>` e `getElementById` em silêncio. É exatamente a dívida do `id="task"` chumbado no seu `AddTaskField`: hoje só aparece um por vez, com dois na tela o `for` aponta para o campo errado. Atributo com nome inventado (`colr="red"`) é ignorado, igual ao CSS. E valor sempre entre aspas: sem elas funciona em alguns casos e falha em outros, então use sempre.

---

## 3. Aninhamento: HTML é uma árvore

Elemento dentro de elemento. É isso que faz do HTML uma **árvore**, com pai, filho e irmão:

```html
<section>                      <!-- pai            -->
  <h2>Tarefas</h2>             <!-- filho, irmão do ul -->
  <ul>                         <!-- filho          -->
    <li>Estudar CSS</li>       <!-- neto           -->
    <li>Estudar HTML</li>      <!-- neto, irmão do de cima -->
  </ul>
</section>
```

**A regra: quem abre por último fecha primeiro.** Como parênteses em código.

```html
<p><strong>ok</strong></p>     <!-- ✅ -->
<p><strong>errado</p></strong> <!-- ❌ o navegador vai "consertar" do jeito dele -->
```

**A árvore não é decorativa** — ela decide quatro coisas que você já viu:

1. **Herança no CSS:** `color` no pai desce para os filhos (seção 7 do `base-css.md`).
2. **Seletores:** `.card p` significa literalmente "`<p>` que está **dentro** de `.card`".
3. **Layout:** `display: flex` no pai arruma os **filhos**.
4. **Ordem do `Tab`:** o foco segue a ordem da árvore, não a ordem visual (tópico 9 do T3).

**Algumas tags só aceitam filhos específicos**, e é aqui que se erra sem perceber: `<ul>` só aceita `<li>`; `<tr>` só aceita `<td>`/`<th>`; `<p>` não aceita elemento de bloco dentro (seção 5). Quebrar isso não dá erro — dá árvore diferente.

**Indentação não significa nada para o navegador** (é só para humanos), mas o **espaço em branco entre elementos inline conta** como um espaço de verdade — é a razão de aparecerem "gaps" misteriosos entre dois `<span>`, e a razão de flex/grid com `gap` ter matado esse problema.

---

## 4. O esqueleto de um documento — e o que sobra dele numa SPA

```html
<!DOCTYPE html>                          <!-- "leia como HTML moderno" -->
<html lang="pt-BR">                      <!-- lang: o leitor de tela escolhe a voz -->
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Do 0 ao Emprego</title>
    <link rel="icon" href="/favicon.svg">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**`<head>` × `<body>`:** o `head` é **sobre** a página e não aparece na tela (título da aba, codificação, favicon, CSS, metadados). O `body` é a página.

**As duas linhas do `head` que importam para o T3:**

- **`<meta name="viewport">`** — sem ela o celular finge ter 980px de largura e **todo o seu CSS responsivo é ignorado**. O template do Vite já põe; confira.
- **`<meta charset="utf-8">`** — sem ela acento e emoji viram lixo.

**O que sobra numa SPA (T1):** o seu `index.html` é uma **casca**. Ele tem uma `<div id="root">` vazia e um `<script>`, e o React monta a árvore inteira dentro dessa div em runtime. Ou seja: **o HTML que você escreve à mão neste projeto é só este arquivo**; todo o resto é JSX. Por isso "ver o código-fonte" da página mostra dez linhas e nada do app — e por isso a seção 11 (olhar o DOM no DevTools, não o fonte) é a que você vai usar de verdade.

---

## 5. Block × inline: o comportamento padrão

Todo elemento nasce com um comportamento de exibição. São dois, e conhecê-los evita a frustração clássica:

**Block** — ocupa a **linha inteira**, empilha verticalmente, aceita `width`/`height`/margem vertical. São `div`, `p`, `section`, `h1`–`h6`, `ul`, `li`, `form`, `header`, `main`, `footer`.

**Inline** — fica **na linha do texto**, um ao lado do outro, e **ignora** `width`, `height` e margem vertical. São `span`, `a`, `strong`, `em`, `img`, `label`.

```html
<p>Um <strong>trecho</strong> em negrito continua na mesma linha.</p>
<div>Esta div</div><div>e esta ficam uma embaixo da outra.</div>
```

**A frustração que isso causa:** você põe `width: 200px` num `<span>` e nada acontece. Não é bug — é `inline`. A saída é `display: inline-block` ou pôr o pai em `flex`/`grid`.

E é a ponte para a seção 6 do `base-css.md`: **`display` no CSS serve justamente para sobrescrever esse padrão.** `display: flex` num `<ul>` está mudando o comportamento block dele e o dos filhos.

---

## 6. As tags que importam — o inventário útil

Não são 100. São estas:

**Estrutura e regiões (landmarks)**

| Tag | Papel |
|---|---|
| `<div>` | caixa sem significado. Legítima quando o papel é **só** agrupar/estilizar |
| `<span>` | igual à div, mas inline |
| `<header>` `<footer>` | topo e rodapé (da página ou de uma seção) |
| `<main>` | o conteúdo principal. **Um por página** |
| `<nav>` | um grupo de links de navegação |
| `<section>` | uma seção temática. Idealmente com um título dentro |
| `<article>` | conteúdo que faz sentido sozinho (um post, um card completo) |
| `<aside>` | conteúdo lateral/tangencial |

As cinco do meio são **landmarks**: o leitor de tela lista elas e pula direto para uma. É navegação de graça, e é o ganho concreto de não usar `div` para tudo.

**Texto**

`<h1>`…`<h6>` títulos · `<p>` parágrafo · `<ul>`/`<ol>` + `<li>` lista sem/com ordem · `<a href>` link · `<strong>` importante · `<em>` ênfase · `<small>` · `<time>` · `<code>`

**Títulos são a espinha do documento, não tamanhos de fonte.** Um `<h1>` por página; não pule níveis (h2 → h4 é erro). Quem usa leitor de tela navega pelo sumário de títulos — pular nível é capítulo faltando no índice. Se você quer só "letra menor", isso é CSS.

**Mídia**

`<img src alt>` · `<svg>` · `<video>` · `<picture>`

**`alt` não é opcional.** Descreve a imagem para quem não a vê e para quando ela falha. Imagem puramente decorativa leva `alt=""` — vazio de propósito, o que diz "ignore isto"; **sem** o atributo, o leitor de tela lê o nome do arquivo em voz alta.

**Formulário** (a base do T5)

`<form>` · `<label>` · `<input>` · `<textarea>` · `<select>` + `<option>` · `<button>` · `<fieldset>` + `<legend>`

**Tabela** (você vai decidir sobre ela no T3, tópico 8)

`<table>` · `<thead>` · `<tbody>` · `<tr>` linha · `<th>` célula de cabeçalho · `<td>` célula

---

## 7. Semântica: `<div>` clicável é dívida

A tag certa te entrega, de graça e correto, o que você teria que reimplementar mal. Compare:

```html
<!-- ✅ um botão -->
<button>Change</button>

<!-- ❌ a mesma aparência, e nada mais -->
<div onclick="...">Change</div>
```

O `<button>` já vem com: focável por `Tab`, aciona com `Enter` **e** `Espaço`, se anuncia como "botão" para o leitor de tela, `:hover`/`:focus`/`:disabled` funcionando, e aparece em `getByRole('button')` no T13. A `<div>` tem **zero** disso, e cada item da sua lista seria uma reimplementação a mais — com `tabindex`, `keydown`, `role`, e três bugs.

**`<a>` × `<button>`:** `<a href>` **navega** para outro lugar; `<button>` **age** aqui. Link que não leva a lugar nenhum e botão que troca de página são os dois lados do mesmo erro (vira decisão de rota no T9).

**A cadeia inteira, e é o argumento do T3:**

```
<button> semântico   →  getByRole('button') funciona     (T13)
<label for>          →  getByLabelText funciona           (T13)
tag focável          →  navegar só por teclado funciona   (avaliação)
<th scope="col">     →  a célula sabe de que coluna é     (leitor de tela)
```

Semântica não é enfeite: é **literalmente** o que o teste vai consultar e o que o teclado vai alcançar.

**Armadilhas:** `<div>` e `<span>` não são proibidos — são certos quando o papel é só agrupar ou estilizar. O erro é `<div>` **interativa**. E `<section>` sem título dentro é quase uma `<div>` com nome bonito: se não há o que titular, use `div`.

---

## 8. Formulário por dentro — o mínimo que já vale hoje

```html
<form>
  <label for="title">Título da tarefa</label>
  <input id="title" name="title" type="text" required>

  <label for="status">Status</label>
  <select id="status" name="status">
    <option value="todo">A fazer</option>
    <option value="done">Feita</option>
  </select>

  <button type="submit">Criar</button>
</form>
```

**`<label for>` ↔ `<input id>` é a ligação mais importante do HTML acessível**, e ela paga três coisas de uma vez: clicar no rótulo **foca o campo**; o leitor de tela anuncia "Título da tarefa, campo de texto" em vez de "campo de texto"; e `getByLabelText('Título da tarefa')` funciona no T13. É por isso que o seu `AddTaskField` já estava certo nesse ponto — e por isso o `id` fixo é dívida de verdade, não perfeccionismo.

**O que o `<form>` faz de graça** e você perde escrevendo `onClick` num botão solto: `Enter` num campo envia; o navegador anuncia o conjunto como formulário; e a validação nativa (`required`, `type="email"`) entra. No T5 isso vira `onSubmit`.

**`type` do botão importa mais do que parece:** dentro de um `<form>`, botão **sem** `type` é `submit` por omissão — então aquele botão de "cancelar" vai enviar o formulário. `type="button"` é o que impede. Detalhe que morde no T5.

**`name` × `id`:** `id` é para o `<label>` e para o CSS/JS achar; `name` é o nome do campo quando o dado é enviado. Coisas diferentes com valores geralmente iguais.

---

## 9. Tabela por dentro — porque o T3 vai te fazer escolher

O seu `TaskList` tem hoje um `<li class="task-header">` com "Status / Tarefa / Previsão / Alterar status" e quatro colunas alinhadas. Isso é **cabeçalho de tabela**, e a alternativa honesta é escrever uma:

```html
<table>
  <thead>
    <tr>
      <th scope="col">Status</th>
      <th scope="col">Tarefa</th>
      <th scope="col">Previsão</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>⬜</td>
      <td>Estudar CSS</td>
      <td>Sem prazo</td>
    </tr>
  </tbody>
</table>
```

`<th>` é célula de **cabeçalho**; `scope="col"` diz que ela manda na coluna. Com isso, o leitor de tela anuncia **"Tarefa: Estudar CSS"** ao chegar na célula, em vez de só "Estudar CSS" — a associação que o seu `<li>` de cabeçalho não dá de jeito nenhum.

**Tabela não é "coisa velha".** O pecado dos anos 2000 era usar tabela **para layout** (grade de página feita de `<tr>`). Dado tabular em `<table>` é o uso correto, e continua sendo em 2026.

---

## 10. Onde o HTML acaba: o DOM, e por que JSX não é HTML

**HTML é o texto. O DOM é a árvore viva.** O navegador lê o texto uma vez, monta uma estrutura de objetos na memória (o **D**ocument **O**bject **M**odel) e a partir daí é **ela** que manda na tela. Mudar o DOM muda a tela; o HTML original nunca muda.

Consequência que resolve uma confusão sua garantida: no seu projeto, **o React não escreve HTML.** Ele opera o DOM direto. "Ver código-fonte" mostra o `index.html` de dez linhas para sempre, não importa quantas tarefas apareçam na tela. Quem mostra a verdade é o DevTools.

**JSX se parece com HTML e não é.** É JavaScript (T1), e as diferenças são as que te morderam:

| HTML | JSX | Por quê |
|---|---|---|
| `class="x"` | `className="x"` | `class` é palavra reservada do JS |
| `for="x"` | `htmlFor="x"` | `for` é palavra reservada do JS |
| `onclick="..."` | `onClick={...}` | camelCase, e recebe função, não string |
| `<input>` | `<input />` | JSX exige o fechamento |
| `<div>` `<p>` soltos | um só nó raiz, ou `<>...</>` | função devolve um valor |
| `style="color: red"` | `style={{ color: 'red' }}` | objeto JS, propriedades em camelCase |

O que **não** muda: a árvore, o significado das tags, os atributos comuns, e tudo do `base-css.md`. Aprender HTML aqui não é aprender React — é aprender o que o React produz.

---

## 11. Como conferir: DevTools mostra o DOM, não o seu arquivo

`F12` → aba **Elements**. O que está ali é **o DOM agora**, com tudo que o React montou, consertado e expandido — não o texto que você escreveu. Três coisas para fazer hoje:

1. **Olhe a árvore do seu app.** Expanda a `<div id="root">` e ache os seus `<li>`. Compare com o JSX: é o mesmo desenho, e ver isso mata metade da mágica.
2. **Confira o que o navegador consertou.** Se você aninhou algo inválido, aqui aparece a árvore de verdade — não a que você quis.
3. **Ache o `<button>`**, e no painel de acessibilidade (aba **Accessibility**, ao lado de Styles) leia o **role** e o **name** dele. É literalmente o que o `getByRole` do T13 vai procurar, e o que o leitor de tela vai falar. Faça o mesmo no `<li class="task-header">` e você vai ver o problema do tópico 8 do T3 com os próprios olhos.

O terceiro é o que vale mais: você destrava olhando, não deduzindo. Ver o `name` de um botão vazio na aba Accessibility ensina mais sobre acessibilidade que três parágrafos meus.

---

## O que **não** está aqui, e por quê

Este arquivo é fechado. O que ficou de fora ficou de propósito:

- **Estilo, unidades, layout, seletores** → [`base-css.md`](base-css.md), a parte 2 do Tema 0.
- **Manipular o DOM na mão** (`querySelector`, `addEventListener`) → foi a Etapa 1 e o React substitui; se precisar, volta no T11 com `useRef`.
- **Formulário a fundo** (controlado × não controlado, validação) → T5.
- **Rotas e `<a>` × `Link`** → T9.
