# Estudo — Motion e interação (Tema 14)

> **O último tema da etapa.** Depois dele vem o simulado de entrevista (regra 8) e a avaliação. Não sobra tema para pagar dívida deixada aqui.

> **O tema, em uma frase:** até agora o app **mudava**; a partir daqui ele **se move de um estado para o outro**, e a diferença entre as duas coisas é a única que o usuário percebe sem saber explicar.

**Onde o app está antes deste tema.** Nada anima. Toda mudança de tela é um corte seco: a tarefa criada aparece do nada, a apagada some do nada, ciclar o status faz o item **teletransportar** de coluna, e trocar de rota pisca. O único movimento existente no app inteiro é o `hover`/`active` que o `Button` herdou do Tailwind no T3 (`active:bg-neutral-300`) — mudança de cor, não de movimento.

**Por que só agora, e a razão é material e não gosto.** Animação anima **coisa que entra e sai**. Item entrando e saindo da lista chegou no T8 (o CRUD de verdade), troca de rota chegou no T9, a coluna de destino de um item chegou no T4. Antes disso, animar seria enfeitar uma tela estática. E por ser o último, ele herda duas cobranças que nenhum tema anterior teve as duas juntas: a **regra 7** (o que fecha vai para o ar, e o bundle é medido contra a linha de base do T10) e a **suíte do T13**, que precisa continuar verde depois do movimento.

**A mudança de eixo.** As perguntas dos temas anteriores foram "o que o app faz", "quem é dono do estado" e "como eu provo que funciona". A deste é: **como o app explica, sem texto, o que acabou de acontecer?** Quando uma tarefa sai da coluna "a fazer" e aparece em "em andamento", o corte seco obriga o usuário a procurar onde ela foi parar. O movimento responde essa pergunta antes de ela ser feita — e é essa a régua do tema inteiro: **animação que não comunica nada é firula, e firula custa frame.**

**A frase que o plano guardou para este dia:** _"segurar carrega, soltar arremessa"_ — a intuição de interação que abriu a etapa, agora com vocabulário React para escrevê-la.

## Decisões tomadas na abertura

1. **Motion (o ex-Framer Motion), e não GSAP** — escolha sua, 11/08, e era a decisão reservada para você desde 28/07. O motivo que decidiu: os dois problemas difíceis deste tema — animar a **saída** de um elemento que o React já desmontou (tópico 5) e animar o item **mudando de posição** entre colunas (tópico 8) — são recurso de primeira classe no Motion (`AnimatePresence` e `layout`) e código seu no GSAP. GSAP ganharia em coreografia longa com timeline, que este app não tem. Fica registrado no `web/README.md` com o gatilho para trocar de ideia.
   - **O nome mudou e isso importa na hora de instalar:** a lib saiu da Framer e virou projeto independente. O pacote é **`motion`**, o import é **`motion/react`**, e `framer-motion` continua publicado como alias do mesmo código, para não quebrar projeto antigo. Todo tutorial que você achar vai dizer `framer-motion` — **é a mesma lib**. Confirmar a versão no ato (`npm view motion version`) e travar no `package.json`, como toda a stack.
2. **O gesto de arrastar é para apagar, não para reordenar** (tópico 10) — escolha minha, e o motivo é o contrato, não a dificuldade. **A API não tem campo de ordem.** `Task` é `{ id, title, status, term }`, e a `api/` está congelada. Reordenar por arrasto criaria uma ordem que existe só na tela e **some no F5** — que é literalmente o item de reprova "o estado da UI mente sobre o que está no banco". Arrastar para apagar age sobre algo que a API tem (`DELETE`), então o gesto e o banco concordam.
   - **E o botão "X" continua existindo.** Arrasto é **atalho**, nunca o único caminho: gesto sem alternativa de teclado seria regressão direta do T3, e "navego só pelo teclado" é item da prova prática.
3. **`prefers-reduced-motion` é respeitado globalmente, não caso a caso** (tópico 13) — uma linha de `<MotionConfig reducedMotion="user">` no topo. A alternativa (checar a preferência em cada componente animado) daria o mesmo resultado com quatro lugares para esquecer.
4. **A mesma chave desliga o movimento nos testes.** O T13 tópico 11 previu três saídas e a terceira era esta: um stub de `matchMedia` no `src/test/setup.ts` devolvendo `matches: true` para `prefers-reduced-motion`. Com isso, **nenhum dos 25 testes precisa saber que o app anima** — e o T13 já tinha anotado que o jsdom não tem `matchMedia`. Sem isso, a `AnimatePresence` segura o item no DOM durante a saída e o `expect(...).toBeNull()` do teste de apagar quebra por motivo errado.
5. **Os tokens de movimento nascem aqui, num módulo, e não no CSS.** O T3 tópico 3 dizia que duração e curva sairiam dos tokens — mas os tokens de cor **não sobreviveram à migração para Tailwind** (a paleta virou a escala do próprio Tailwind, e não há bloco `@theme` no `style.css`). Como quem lê duração e curva agora é JavaScript (o Motion), o lugar honesto é `src/utils/motion.ts`. É a promessa do T3 sendo cumprida no formato que a decisão do Tailwind deixou.

---

# Parte A — Os tópicos

### 1. `transition` no CSS: duração, atraso e o que a curva comunica

**O que é.** Uma propriedade que diz ao navegador: quando **este valor** mudar, não pule para o novo — percorra o caminho em tanto tempo, com esta curva.

```css
transition: background-color 150ms ease-out;
/*          ↑ o quê          ↑ quanto  ↑ como */
```

**Para que serve.** É o piso do tema: metade do que se anima num app real não precisa de biblioteca nenhuma. E a **curva é a parte que comunica**, não a duração:

| Curva | Como se lê | Onde usar |
| --- | --- | --- |
| `linear` | mecânico, robótico | barra de progresso, e quase nada mais |
| `ease-out` | rápido no começo, freia no fim | **o padrão para coisa que entra** — parece que chegou e assentou |
| `ease-in` | começa devagar, acelera | coisa que **sai** — parece que foi embora |
| `cubic-bezier(...)` | curva sua, inclusive com passar do ponto (_overshoot_) | o quique que dá sensação de peso |

E a duração tem faixa útil estreita: **abaixo de ~100 ms ninguém percebe** (é corte seco com passo extra), **acima de ~400 ms o app parece lento**. O `Button` do app hoje muda de cor **instantaneamente** — nem 1 ms de transição — e essa é a correção mais barata do tema inteiro.

**Exemplo — o mesmo botão, antes e depois, em uma classe:**

```tsx
// hoje: bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300  → salta
// com:  ... transition-colors duration-150 ease-out                → assenta
```

### 2. `transform` e `opacity` animam de graça; `top`, `width` e `box-shadow` travam

**O que é.** A regra mais importante de performance de animação na web, e ela tem uma explicação mecânica, não uma superstição. O navegador desenha uma tela em três fases:

| Fase | O que faz | Custo |
| --- | --- | --- |
| **Layout** | calcula onde cada elemento fica e que tamanho tem | caro — mexer em um elemento pode reposicionar todos os outros |
| **Paint** | pinta os pixels de cada elemento | médio |
| **Composite** | junta as camadas já pintadas na tela | **barato — roda na GPU** |

`transform` e `opacity` **só** mexem no composite: a camada já está pintada, o compositor só a coloca em outro lugar ou com outra transparência. `top`, `left`, `width`, `height` e `margin` disparam **layout** — a cada quadro, 60 vezes por segundo. `box-shadow` e `filter` disparam **paint**.

**Para que serve.** Decide entre 60fps e um app que engasga no celular — e é a pergunta oral do tema ("por que `transform` anima e `top` trava"). Não é micro-otimização: é a diferença entre recalcular o layout da página inteira 60 vezes por segundo e não recalcular nada.

**Exemplo — mover 100px para a direita, das duas formas:**

```css
/* ❌ layout a cada quadro: o navegador recalcula a posição de tudo em volta */
.item { position: relative; left: 0; transition: left 200ms; }
.item:hover { left: 100px; }

/* ✅ só composite: a GPU desloca uma camada já pronta */
.item { transition: transform 200ms; }
.item:hover { transform: translateX(100px); }
```

**A consequência prática para este app:** o item mudando de coluna não pode ser animado mexendo em posição — tem que virar `transform`. Fazer essa conversão à mão é o que o tópico 8 chama de FLIP, e é exatamente o que a prop `layout` do Motion faz por você.

### 3. `@keyframes` e `animation`: quando a `transition` não dá conta

**O que é.** `transition` interpola **entre dois estados** e precisa de um gatilho (hover, classe trocada, estado do React). `@keyframes` descreve uma sequência com pontos intermediários, e `animation` a executa — inclusive sem gatilho nenhum e em repetição.

**Para que serve.** Três casos que a `transition` não cobre: **mais de dois estados** (entra, dá um quique, assenta), **repetição infinita** (o spinner do carregando) e **começar sozinha ao montar** — a `transition` precisa de uma mudança, e um elemento que acabou de nascer não mudou nada.

**Exemplo — o balanço do erro, que tem cinco pontos e nenhum gatilho de hover:**

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}
.field-error { animation: shake 200ms ease-in-out; }
```

**A régua:** dois estados e um gatilho → `transition`. Fora disso → `@keyframes` (ou o Motion, que resolve os dois com a mesma API).

### 4. Medir: a aba Performance, o que é uma queda de quadro, e por que "parece suave" não é medição

**O que é.** A tela redesenha ~60 vezes por segundo. Cada quadro tem **16,7 ms** para ficar pronto; passou disso, o quadro é perdido e o olho vê um tranco. A aba **Performance** do DevTools grava a sessão e mostra, quadro a quadro, quanto tempo foi para script, layout, paint e composite.

**Para que serve.** É o mesmo movimento do T11, com outra ferramenta: **medir antes de concluir**. Lá foi o Profiler do React medindo render (e o veredito com número foi "nada precisou de memoização, os seis cenários abaixo de 16 ms"); aqui é o Performance medindo **quadros**. As duas medições respondem perguntas diferentes: o Profiler diz se o React está trabalhando demais; o Performance diz se o **navegador** está.

E "parece suave" mente por dois motivos: sua máquina é rápida, e o `npm run dev` não é o que o usuário roda. **Medição de performance é em `npm run preview`**, com CPU estrangulada (_throttling_ 4× ou 6×) — é o T10 tópico 1 se repetindo.

**Exemplo — o roteiro exato da avaliação, que é onde isto vai ser cobrado:**

```
1. npm run build && npm run preview
2. DevTools → Performance → CPU: 4× slowdown
3. Gravar → criar e apagar cinco tarefas seguidas → parar
4. Ler a faixa de Frames: barra vermelha = quadro perdido
5. Se houver vermelho, clicar nele e ver qual fase estourou (Layout? Paint?)
```

### 5. Animar o que não existe mais — a razão de existir de uma lib de motion

**O que é.** O problema central do tema, e o mais fácil de entender pelo que ele quebra. Quando você apaga uma tarefa, o `useTasks` faz `dispatch({ type: 'removed', id })`, o array encolhe, o React re-renderiza e o `<li>` **sai do DOM no mesmo quadro**. Não existe mais elemento para animar. CSS não anima o vazio.

**Para que serve.** Explica por que entrada é fácil e saída é difícil — e por que quase todo app amador anima só a entrada:

| | Entrada | Saída |
| --- | --- | --- |
| O elemento existe? | sim, acabou de nascer | **não, o React já removeu** |
| Dá para fazer só com CSS? | sim | não |
| Solução na mão | `@keyframes` no mount | segurar o item num estado "saindo", animar, e só então remover de verdade |

**A solução da lib é conceitualmente simples:** `AnimatePresence` fica entre você e o React. Quando um filho seu **some da lista**, ela **não deixa** o React desmontá-lo — mantém o nó vivo, roda a animação de saída, e só aí solta.

**Exemplo — o item da lista deste app, com entrada e saída:**

```tsx
<AnimatePresence>
  {item.list.map((task) => (
    <motion.li
      key={task.id}                          // ← a key do T2: é ela que diz "este sumiu"
      initial={{ opacity: 0, y: -8 }}        // de onde entra
      animate={{ opacity: 1, y: 0 }}         // onde fica
      exit={{ opacity: 0, x: 40 }}           // para onde sai
    >
      …
    </motion.li>
  ))}
</AnimatePresence>
```

**O detalhe que quebra tudo se for errado:** `key={task.id}`. Com `key={index}`, apagar o primeiro item faz todos os outros trocarem de identidade — a `AnimatePresence` conclui que o **último** sumiu e anima a saída do item errado. É a lição do T2 cobrando o juro seis temas depois, e é por isso que o T8 decidiu que criar tarefa é **pessimista**: um item otimista teria id temporário, o id mudaria ao chegar a resposta, e a `key` mudando no meio do caminho tem o mesmo efeito.

### 6. Escolher a lib: Motion × GSAP

**O que é.** As duas respostas sérias para o tópico 5, e elas resolvem o mesmo problema com filosofias opostas.

| | **Motion** (ex-Framer Motion) | **GSAP** |
| --- | --- | --- |
| Como se escreve | **declarativo**: `<motion.div animate={{ opacity: 1 }}>` — você descreve o estado | **imperativo**: `gsap.to(ref.current, {…})` — você comanda o elemento |
| Parentesco | React nativo; pensa em montar/desmontar | agnóstico; pensa em elementos e tempo |
| Saída do elemento | `AnimatePresence`, embutido | você adia o desmonte na mão (`onComplete`) |
| Item mudando de posição | prop `layout` — FLIP embutido | plugin `Flip`, chamado por você |
| Coreografia longa | fraco (`staggerChildren` e pouco mais) | **timeline**: pausa, reverso, _scrub_ |
| Fora do React | não existe | roda em qualquer lugar |

**Para que serve.** É a mesma escolha do T3 (CSS Modules × Tailwind) com outro assunto: não existe resposta certa, existe **decisão registrada com o motivo**. E o motivo aqui é o mesmo do declarativo × imperativo do T1: o Motion fala a língua que a etapa inteira treinou — você descreve o estado e a lib reconcilia. GSAP é `document.createElement` com esteroides.

**Decidido: Motion** (decisão 1 da abertura). GSAP fica anotado com o gatilho: no dia em que houver coreografia com linha do tempo — uma abertura de landing page, um `scroll` sincronizado — a resposta muda.

**Exemplo — a mesma saída de item nas duas libs:**

```tsx
// Motion: a saída é uma prop
<motion.li exit={{ opacity: 0, x: 40 }} />

// GSAP: a saída é um contrato entre você e o React
const remove = (el, done) => gsap.to(el, { opacity: 0, x: 40, onComplete: done });
// …e "done" é você chamando o dispatch de remoção depois. O React não espera ninguém.
```

### 7. Entrada e saída de item da lista — e a `key` decidindo tudo

**O que é.** A aplicação do tópico 5 no lugar mais visível do app: as três colunas da `FilledTasks`, cada uma com um `<ul>` de `ItemTask`.

**Para que serve.** É o movimento que responde "o que acabou de acontecer?". Hoje uma tarefa criada **materializa** no meio da coluna e uma apagada **evapora** — em uma lista de dez itens, o usuário não sabe qual sumiu. Com entrada e saída, ele sabe sem ler.

**Duas armadilhas que valem o tempo de saber antes:**

- **`AnimatePresence` só enxerga os filhos diretos.** Se o `map` estiver dentro de outro componente, ela não vê ninguém sumir e não anima nada — falha silenciosa, sem erro no console.
- **O elemento saindo ainda ocupa espaço.** Enquanto a saída roda, o `<li>` continua no fluxo e a lista não fecha o buraco. Ou você anima `height`/`margin` junto (e volta a disparar layout, tópico 2), ou aceita, ou tira o item do fluxo. **Aceitar é uma resposta legítima** para uma lista curta.

**Exemplo — a diferença que o `mode` faz, e é uma palavra:**

```tsx
<AnimatePresence>            {/* padrão: entrada e saída ao mesmo tempo — bom para lista */}
<AnimatePresence mode="wait"> {/* espera a saída terminar para começar a entrada — bom para troca de rota */}
```

### 8. Animação de layout: o item que muda de posição

**O que é.** O caso deste app: ciclar o status faz a tarefa **sair de uma coluna e aparecer em outra**, e filtrar pela busca faz os itens restantes subirem. Hoje os dois são teletransporte.

Animar isso à mão é a técnica chamada **FLIP**: **F**irst (medir onde estava), **L**ast (deixar ir para o lugar novo e medir), **I**nvert (aplicar um `transform` que o coloca visualmente de volta na posição antiga) e **P**lay (remover o transform com transição). O resultado é que o elemento **está** no lugar certo o tempo todo — só a aparência viaja, e por `transform`, que é de graça (tópico 2).

**Para que serve.** É o movimento que mais informa neste app. Ele responde "para onde foi minha tarefa?" sem uma palavra. E é o que a `prop layout` do Motion faz sozinha:

```tsx
<motion.li layout />   // é isso. A lib mede antes e depois e roda o FLIP.
```

**O detalhe que este app exige, e é o que torna o tópico interessante aqui:** a tarefa **muda de pai** — sai do `<ul>` da coluna "a fazer" e entra no `<ul>` de "em andamento". Para o React são um desmonte e uma montagem, dois elementos distintos. `layout` sozinho não atravessa isso; quem atravessa é **`layoutId`** — o mesmo identificador nos dois lugares faz a lib entender que é **a mesma coisa** mudando de endereço.

**Exemplo:**

```tsx
<motion.li layout layoutId={task.id} />
```

E há um preço a declarar: **`layout` mede o DOM a cada render** (`getBoundingClientRect`), e medir força o navegador a calcular layout. Numa lista curta é irrelevante; em centenas de itens é o próprio custo que o tópico 2 alerta. Medir depois (tópico 15) é o que resolve a discussão.

### 9. Transição entre rotas

**O que é.** Ligar o tópico 5 ao T9: quando a URL muda, a página velha desmonta e a nova monta. Mesma mecânica de entrada e saída, com a rota no lugar do item da lista.

**Para que serve.** Numa SPA, trocar de rota é instantâneo demais para ser percebido como navegação — o conteúdo pisca e o usuário não sabe se voltou, avançou ou recarregou. Uma transição curta (150–200 ms) dá a costura.

**Exemplo — o `AppLayout` deste app, com os dois detalhes que custam tempo:**

```tsx
const location = useLocation();

<AnimatePresence mode="wait">
  {/* 1. a key é o caminho: sem ela o React reaproveita o nó e nada "sai" */}
  <motion.div key={location.pathname} initial={…} animate={…} exit={…}>
    <Outlet />
  </motion.div>
</AnimatePresence>
```

**O segundo detalhe é do T10:** a `TaskDetailPage` é `lazy` e vive dentro de um `<Suspense>`. Na primeira visita, o que monta é o **fallback**, e a página real chega depois — então a transição roda no fallback, e não no conteúdo. Não é bug do Motion; é o que `lazy` significa. As saídas: `Suspense` **por dentro** do bloco animado, ou aceitar que a primeira navegação é diferente das seguintes.

E `mode="wait"` aqui não é gosto: sem ele, as duas páginas ficam montadas ao mesmo tempo por 200 ms — duas telas empilhadas, e a de baixo ainda buscando dado.

### 10. Gesto: `pointerdown` × `mousedown`, e o arrasto

**O que é.** Eventos de ponteiro (`pointerdown`/`pointermove`/`pointerup`) são a API unificada: **mouse, dedo e caneta** entram pelo mesmo evento, com um campo `pointerType` dizendo qual foi. `mousedown` é só mouse — no celular ele até dispara, por emulação, mas **atrasado** (~300 ms) e sem multitoque.

**Para que serve.** É o "segurar carrega, soltar arremessa" ganhando vocabulário. E a regra prática, que vale para a vida inteira: **`pointer*` cobre os três; `mouse*` cobre um.** Em um app que se diz responsivo (o do T3), usar `mouse*` é entregar metade.

**No Motion, isso vem embrulhado:** `drag="x"`, `dragConstraints`, `onDragEnd` com `info.offset` e `info.velocity` — e é o `velocity` que faz "arremessar" ser diferente de "empurrar devagar".

**Exemplo — arrastar para apagar, que é a decisão 2 da abertura:**

```tsx
<motion.li
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}   // volta sozinho se não passar do limite
  dragSnapToOrigin
  onDragEnd={(_, info) => {
    // distância OU velocidade: um empurrão rápido e curto conta tanto quanto um arrasto longo
    if (info.offset.x > 120 || info.velocity.x > 500) onDeleteTask(task.id);
  }}
/>
```

**As três coisas a não esquecer, e todas são do T3:** o botão "X" **continua existindo** (gesto não é o único caminho); o arrasto precisa de `touch-action` no CSS, senão o navegador rola a página em vez de arrastar; e um gesto que apaga **sem confirmar** é mais perigoso que o botão, que ao menos tem o `window.confirm`.

### 11. Interação com fases: máquina de estados, não pilha de booleanos

**O que é.** Uma interação de arrastar tem fases — parado → arrastando → soltou → confirmando → apagado (ou voltou). A tentação é um booleano por fase: `isDragging`, `isConfirming`, `isDeleting`. Três booleanos são **oito** combinações, e cinco delas são impossíveis (`isDragging && isDeleting`?).

**Para que serve.** É a lição do **estado impossível** do T4 e a **união discriminada** do T11 aparecendo pela terceira vez — agora com o `useReducer` já na mão, escrito por você no `tasksReducer`. A cura é a mesma: **um** estado com os valores que existem, e transições nomeadas.

**Exemplo — o mesmo controle, das duas formas:**

```ts
// ❌ oito combinações, cinco impossíveis
const [isDragging, setIsDragging] = useState(false);
const [isConfirming, setIsConfirming] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

// ✅ quatro estados, e só eles existem
type Gesture = 'idle' | 'dragging' | 'confirming' | 'deleting';
```

E o `tasksReducer` já mostra o caminho: as ações têm nome (`created`, `updated`, `removed`) e a guarda de `success` mora em um lugar só.

### 12. Feedback tátil sem animação — 100 ms valem mais que 600

**O que é.** A parte do tema que **não** precisa de lib: `:hover`, `:focus-visible`, `:active` e um `transform: scale(0.97)` no clique. Resposta imediata ao toque, não animação de transição.

**Para que serve.** É o melhor retorno por linha do tema inteiro, e a hierarquia é contra-intuitiva: **um botão que responde em 100 ms parece mais rápido que um app com transições lindas de 600 ms**. O usuário não mede o tempo total — ele mede o intervalo entre a ação dele e o **primeiro** sinal de que o app viu.

Neste app, o `Button` já tem `hover:` e `active:` de cor, e o `focus-visible:border-black` do T3. **O que falta é a transição** (tópico 1) e o `scale` no toque.

**Exemplo — o `Button` do app, com o Motion e sem:**

```tsx
// sem lib: uma classe, e resolve 80% do valor
'transition-transform duration-100 ease-out active:scale-95'

// com Motion, quando o componente já for motion por outro motivo:
<motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} />
```

**O `whileTap` tem uma vantagem escondida sobre o `:active`:** ele entende que arrastar o dedo para fora do botão **cancela** o toque, e desfaz. O `:active` do CSS é mais burro nisso.

### 13. `prefers-reduced-motion` — gente que passa mal com movimento

**O que é.** Uma preferência de sistema operacional (Windows, macOS, iOS, Android têm todas), exposta ao navegador por media query. Ela não é gosto: **movimento na tela provoca náusea, tontura e enxaqueca** em quem tem distúrbio vestibular. Deslocamento grande, paralaxe e zoom são os piores.

**Para que serve.** Respeitar **sem matar a interface** — e o erro comum é achar que respeitar é desligar tudo. Não é: quem liga a preferência ainda precisa entender o que aconteceu na tela. A troca certa é **movimento por opacidade**: o item não desliza, mas ainda aparece e some.

**Exemplo — as duas formas, e a segunda é a decisão 3 da abertura:**

```css
/* CSS, para o que não passa pelo Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

```tsx
/* Motion, uma vez, no topo: desliga transform/layout e mantém opacidade */
<MotionConfig reducedMotion="user">
```

E é **a mesma chave que desliga o movimento nos testes** (decisão 4): um stub de `matchMedia` no `setup.ts` devolvendo `matches: true`. O T13 tópico 11 já tinha escrito isso como a terceira saída, antes de existir animação.

### 14. Onde a animação atrapalha

**O que é.** A lista do que **não** animar, e ela é mais valiosa que a lista do que animar:

| Não anime | Por quê |
| --- | --- |
| O estado de **carregando** | um esqueleto que dança chama mais atenção que o conteúdo que vai chegar |
| A **mensagem de erro**, devagar | erro tem que ser lido **agora**; 400 ms de deslize é 400 ms sem informação |
| A **lista a cada tecla digitada** | o filtro por `q` roda a cada caractere (T9); com `layout` ligado, a lista inteira recalcula posição por tecla |
| Qualquer coisa **acima de ~400 ms** | vira espera, e espera repetida vira irritação |
| O que o usuário **repete** o dia todo | a animação que encanta na primeira vez cobra pedágio na centésima |

**Para que serve.** É a régua do tema aplicada ao contrário: **animação existe para comunicar mudança**. Onde não há mudança a comunicar, ela só custa quadro e paciência.

**O caso concreto deste app, e ele é real:** a busca escreve na URL a cada tecla (`replace: true`, T9) e a lista filtrada é derivada no render. Com `layout` em cada item, **cada tecla** dispara uma medição de DOM e uma animação de posição em todos os itens visíveis. Ou a busca ganha _debounce_, ou o `layout` é desligado enquanto há filtro ativo. **Isto é para descobrir medindo (tópico 4), não para decidir agora.**

### 15. Medir de novo depois de tudo pronto

**O que é.** O fechamento do tema, e ele tem **duas** medições, contra duas linhas de base diferentes:

1. **Bundle** — `npm run build` contra a linha de base do T10, que está escrita no `web/README.md`: `index.js` **248,29 kB (79,84 kB gzip)**. Esta é a única lib de peso que entra no app desde o React Router (T9), e o T10 tópico 2 escreveu, com antecedência, que a medição existia **para este dia**.
   - **Corrigido em 11/08, na abertura do Bloco 1:** o build rodado imediatamente antes de instalar o Motion deu **250,36 kB (80,43 gzip)** + CSS 12,16 (3,42). A diferença de +2,07 kB são o reducer, o Context e o `useTasks` do T11–T13, que entraram **depois** da medição do T10. Cobrar esses 2 kB do Motion seria mentir no veredito — a comparação do tópico 15 usa **250,36 / 80,43**.
2. **Quadros** — a aba Performance (tópico 4) no roteiro da avaliação: criar e apagar cinco tarefas seguidas, com CPU estrangulada, em `preview`.

**Para que serve.** É a regra do T11 (medir depois, para provar que resolveu) aplicada a um custo que agora é **inevitável**: diferente da memoização — onde a resposta honesta foi "nada precisou" — aqui a lib **vai** pesar. A pergunta não é se custou, é **quanto**, e se o que ela comprou vale.

**Exemplo — o formato do veredito, que é o que a avaliação cobra:**

```
Bundle antes:  248,29 kB (79,84 gzip)
Bundle depois:  ___ kB (___ gzip)   → +___ kB gzip
O que comprou: saída de item, troca de coluna, transição de rota, arrasto
Quadros perdidos em 5 criar+apagar, CPU 4×: ___
Veredito: ___
```

E há uma saída registrada caso o número não agrade: `LazyMotion` com `domAnimation`/`domMax` carrega só o subconjunto de recursos que o app usa. É o mesmo mecanismo do `lazy` do T10, dentro de uma lib.

---

# Parte B — Alterações no app

### 1. Preparação do ambiente

- **Instalar:** `npm i motion` — **não** `framer-motion` (mesmo código, nome antigo; ver decisão 1). Conferir a versão instalada com `npm view motion version` e travá-la no `package.json`, como o resto da stack.
- **Import:** `import { motion, AnimatePresence, MotionConfig } from 'motion/react'`. Todo tutorial que você achar vai importar de `'framer-motion'` — **é a mesma lib**, só o endereço mudou.
- **É a primeira dependência de _produção_ desde o `react-router-dom` (T9).** As sete do T13 entraram em `devDependencies` e não pesaram nada no bundle; esta entra no app e vai aparecer na medição do tópico 15. **Anotar a linha de base do T10 antes de instalar** — depois de instalado, não dá para medir "antes".
- **`src/test/setup.ts` ganha o stub de `matchMedia`** (decisão 4). Sem ele, os 25 testes do T13 passam a ver a `AnimatePresence` segurando o item durante a saída. **Fazer isto antes de animar qualquer coisa**, não depois de a suíte quebrar.
- **`src/utils/motion.ts`** (decisão 5): duração e curva em um lugar só, importados por quem anima. Nada de `0.2` solto em oito arquivos.

### 2. Os blocos

#### Bloco 1 — o que o app tem que fazer agora

**A base (antes de animar uma linha)**

- [ ] Rodar `npm run build` e **anotar a linha de base**: já está no `web/README.md` (248,29 kB / 79,84 gzip), confirmar que ainda bate
- [ ] Stub de `matchMedia` no `src/test/setup.ts`, e `npm test` continuando com **25 verdes** — o stub não pode mudar nada enquanto nada anima
- [ ] `<MotionConfig reducedMotion="user">` no topo (`main.tsx` ou `AppLayout`) — tópico 13, uma linha, antes de existir a primeira animação
- [ ] `src/utils/motion.ts` com as durações e curvas do app (entrada `ease-out`, saída `ease-in`, tátil 100 ms)

**O barato que não precisa de lib (tópicos 1 e 12)**

- [ ] `Button`: `transition-colors` + `active:scale-95` — o `hover`/`active` do T3 deixa de saltar
- [ ] Conferir que `focus-visible` continua visível **durante** a transição: foco que pisca é regressão de acessibilidade, e "navego só pelo teclado" é item da prova prática

**Entrada e saída de item (tópicos 5 e 7)**

- [ ] `AnimatePresence` em volta do `map` de `ItemTask` em cada coluna da `FilledTasks`, com `motion.li` no `ItemTask` — `key={task.id}`, que já está certa desde o T2
- [ ] `initial`/`animate`/`exit`: entra por cima com opacidade, sai para o lado
- [ ] Conferir na tela que a saída **do item certo** anima ao apagar o primeiro de uma coluna com três

**Troca de coluna e filtro (tópico 8)**

- [ ] `layout` + `layoutId={task.id}` no `ItemTask`, para o item **viajar** entre colunas ao ciclar o status em vez de teletransportar
- [ ] Olhar o que acontece ao digitar na busca (tópico 14): se a lista inteira dançar a cada tecla, decidir — _debounce_ ou `layout` desligado com filtro ativo — e **registrar a decisão**

**Transição de rota (tópico 9)**

- [ ] `AnimatePresence mode="wait"` com `key={location.pathname}` em volta do `<Outlet />` no `AppLayout`
- [ ] Resolver ou aceitar o cruzamento com o `Suspense` da `TaskDetailPage` (`lazy`, T10) — e escrever qual das duas foi

**O gesto (tópicos 10 e 11)**

- [ ] `drag="x"` no `ItemTask` com `dragSnapToOrigin`, disparando a exclusão por **distância ou velocidade** no `onDragEnd`
- [ ] O botão "X" **continua na tela** — arrasto é atalho, não substituto (decisão 2)
- [ ] `touch-action` no CSS do item, senão o celular rola a página em vez de arrastar
- [ ] As fases do gesto como **um** estado nomeado, não três booleanos (tópico 11)

**O Toast (tópico 5 aplicado no que já existe)**

- [ ] A mensagem entra e sai com `AnimatePresence` — **sem mexer no `<div role="status" aria-live="polite">`**, que precisa continuar sempre no DOM (é o comentário que já está escrito lá, e ele está certo)

**Fechamento (regras 1, 6 e 7)**

- [ ] `npm test` **verde**, os 25 — nenhum teste pode ter sido alterado para acomodar animação (T13, tópico 11)
- [ ] `npm run typecheck` limpo
- [ ] `npm run build` e o **veredito de bundle** no formato do tópico 15, escrito no `web/README.md`
- [ ] **Performance em `preview`, CPU 4×:** criar e apagar cinco tarefas seguidas, contar quadros perdidos (tópico 4)
- [ ] Ligar `prefers-reduced-motion` no sistema e conferir que a interface **continua usável**, não que ela ficou morta (tópico 13)
- [ ] Navegar e apagar uma tarefa **só pelo teclado**
- [ ] `web/README.md`: a decisão Motion × GSAP com o gatilho, o que anima e por quê, o veredito de bundle, e o que `prefers-reduced-motion` desliga
- [ ] **Push na `main` e link público conferido** — regra 7, a última vez que ela é cobrada

#### Bloco 2 — sugestões, médio/avançado

- `LazyMotion` com `domAnimation` se o veredito de bundle não agradar (tópico 15) — e medir de novo, para provar
- Um teste escrito **antes** do código para a animação de saída — o TDD de uma mordida que o Bloco 2 do T13 já sugeria
- `useReducedMotion()` para variar o **conteúdo**, e não só desligar o movimento (ex.: o item saindo por opacidade em vez de por deslocamento)
- `staggerChildren` na entrada da lista no primeiro carregamento — e medir se ela atrasa a percepção de "carregou"
- `useLayoutEffect` + `useRef` medindo um elemento antes de animar (T11, tópicos 5 e 11 do T6) — a animação na mão, para saber o que a lib esconde
- `AnimatePresence` na troca de estado da tela (`loading` → `success`), em vez de só nos itens
- **Consertar o `aria-live` do erro do servidor** — o `Typography` não repassa props e o atributo nunca chega ao DOM (achado no T13; está nas Limitações do `web/README.md`). O rodapé vai ser mexido neste tema de qualquer forma
- `dragListener` com alternativa de teclado para reordenar, no dia em que a API tiver campo de ordem
- Animar a barra de status / ícone do `ItemTask` na troca de status, não só a posição

---

# Parte C — Revisão do código

> **Regra 6: o tema só fecha quando esta parte estiver concluída** — e vale a **regra 7**: sem redeploy, o tema não fechou.

## O app foi migrado para o assunto do tema?

Sim. O que passou a se mover, e por qual tópico:

| Onde | O quê | Tópico |
| --- | --- | --- |
| `Button` | `transition-[background-color,transform] duration-100` + `active:scale-95` | 1 e 12 |
| `ItemTask` | entrada e saída pela `AnimatePresence`, com `key={task.id}` | 5 e 7 |
| `ItemTask` | `layout` + `layoutId={task.id}` — o item **viaja** entre colunas | 8 |
| `ItemTask` | `drag="x"` com `dragSnapToOrigin`, apagando por distância **ou** velocidade | 10 |
| `ItemTask` | as fases do gesto num `type Gesture = 'idle' \| 'dragging' \| 'deleting'` | 11 |
| `AppLayout` | `AnimatePresence mode="wait"` com `key={location.pathname}` | 9 |
| `Toast` | a mensagem entra e sai **por dentro** do `role="status"`, que nunca sai do DOM | 5 |
| `style.css` | `@media (prefers-reduced-motion: reduce)` para o que não passa pelo Motion | 13 |
| `utils/motion.ts` | duração e curva num lugar só | decisão 5 |

**Cinco decisões que a abertura não previu, e todas apareceram fazendo:**

1. **O `MotionConfig` mora no `AppLayout`, não no `main.tsx`.** A abertura deixou os dois como equivalentes; não são. O `renderWithProviders` **espelha o `AppLayout`** — no `main.tsx` os testes nunca seriam alcançados, e o stub de `matchMedia` da decisão 4 não desligaria nada.
2. **A decisão 4 estava incompleta.** `reducedMotion="user"` desliga `transform` e `layout`, mas **mantém a opacidade** de propósito (é o tópico 13: respeitar sem matar). Quem garante que nenhum teste espera movimento é `MotionGlobalConfig.skipAnimations = true`, a chave que a lib tem para isso. São coisas diferentes que a abertura tinha juntado.
3. **A entrada do item não usa opacidade.** Um teste quebrou e estava certo: `findByRole` resolve no quadro do `initial`, e nesse quadro o item estava no DOM com `opacity: 0` — o `toBeVisible` do jest-dom lê opacidade. Enquanto a entrada tiver estado inicial invisível, existe uma janela em que o item está na página e não pode ser visto. A correção foi tirar a janela (entrada só por `transform`), não esperar por ela.
4. **`layout` desligado enquanto há filtro ativo** (`animateLayout={!hideEmpty}`). É a decisão que o tópico 14 mandou tomar medindo. A alternativa era _debounce_ na busca — recusada porque mexeria na escrita da URL do T9 para resolver um problema de animação.
5. **`LazyMotion` entrou** (era Bloco 2, virou Bloco 1 por causa do número — ver Testes abaixo).

## Typecheck

`npm run typecheck` limpo. O `strict` do `LazyMotion` é o que garante que não sobrou `motion.*` no lugar de `m.*` — ele estoura em runtime, não em tipo, e a suíte é quem pega.

## Testes

**25 verdes**, os mesmos 25 do T13 — **nenhum teste foi alterado para acomodar animação**, que é a regra do T13 tópico 11.

Um quebrou no meio do caminho, e o diagnóstico é o conteúdo do tema: `TasksPage.create.test.tsx:76` afirma `toBeVisible()` logo depois do `findByRole`. Os testes de apagar, que usam `waitFor`, **não** quebraram — porque `waitFor` repete a asserção e dá tempo de a animação saltar. A diferença entre os dois é a lição: asserção síncrona logo depois de o nó aparecer lê o **primeiro quadro**, e o primeiro quadro é o `initial`.

O ambiente de teste ganhou três linhas, e nenhuma delas está dentro de um arquivo de teste:

- stub de `matchMedia` no `setup.ts` (o jsdom não tem, e o Motion chama);
- `MotionGlobalConfig.skipAnimations = true` no `setup.ts`;
- `LazyMotion features={domMax} strict` no `renderWithProviders` — com `domMax` **direto**, sem `import()`, porque em teste carregamento assíncrono só traria espera.

## O veredito de bundle (tópico 15)

A linha de base do T10 (248,29 / 79,84) estava **velha**: o build rodado antes de instalar deu **250,36 kB (80,43 gzip)**. Os +2,07 kB são o reducer, o Context e o `useTasks` do T11–T13. Cobrá-los do Motion seria mentir.

| | Baseline | Motion direto | Com `LazyMotion` |
| --- | --- | --- | --- |
| Caminho crítico (gzip) | 80,43 | 121,53 | **96,42** |
| Chunk assíncrono | — | — | 27,66 |
| **Total baixado** | 80,43 | 121,53 | **124,08** |

**A leitura, e ela é contra-intuitiva: o `LazyMotion` não economizou nada — piorou o total em 2,55 kB**, que é o preço de dividir. O que ele fez foi tirar **25,11 kB gzip do caminho crítico**: o app pinta com 96,42 e a lib chega depois, num chunk que não bloqueia a primeira tela. Contra a linha de base, o custo da animação no primeiro carregamento caiu de **+51% para +20%**.

E o motivo de o ganho não ser maior está no tópico 6: o app usa `drag` e `layout`, que **só existem no `domMax`** — o pacote quase completo. Um app que só faz entrada e saída caberia no `domAnimation` e cortaria mais.

**O que ela comprou:** saída de item, troca de coluna, transição de rota, arrasto para apagar e resposta tátil no clique.

**Veredito:** vale, com a ressalva registrada — é a maior dependência de produção do app depois do React, e o gatilho para revisar é a lista crescer a ponto de o `layout` medir DOM demais (tópico 8).
