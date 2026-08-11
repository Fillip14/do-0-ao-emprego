# Estudo — Rotas e Build/Deploy (Temas 9 + 10)

> **Temas mesclados em 10/08.** O T9 (Rotas) e o T10 (Build e deploy) viraram um arquivo só. **Terceira mescla da etapa**, e o motivo continua sendo de conteúdo: o T9 **termina deixando uma dívida escrita** — o tópico 12 diz "deploy de SPA e a rota que dá 404 ao recarregar (resolvido no Tema 10)" — e o T10 tópico 5 existe só para pagá-la. Separá-los é configurar o roteador, deixar um bug conhecido de pé por um dia, e voltar ao mesmo assunto. Na outra direção vale o mesmo: o T10 tópico 2 (medir o bundle) e o tópico 3 (`lazy` + `Suspense`) **não têm material sem rotas** — não há o que dividir num app de uma tela só.
>
> Foi por isso que o plano foi reordenado em 10/08 (deploy subiu de 11 para 10, colando em rotas). O arquivo é a consequência dessa reordenação.
>
> Os tópicos mantêm a numeração do `plano.md` (**A1 = T9 1–14**, **A2 = T10 1–12**), porque é essa numeração que o simulado de entrevista da regra 8 usa. A **A3** é nova e só existe por causa da mescla. Continuam contando como **dois temas** para efeito de avaliação e de oral — duas perguntas, não uma.

> **O tema, em uma frase:** o app deixa de ser uma tela e vira um **lugar** — cada estado dele ganha endereço, e o endereço passa a existir para outras pessoas.

**Onde o app está antes deste tema.** Uma tela só. `App` monta `HomePage` direto, sem roteador; `HomePage` monta `Header` e `Content`; o `Content` é dono de tudo — estado de tela em união discriminada, busca no `useEffect`, quatro handlers `async`, `pendingIds`, aviso de erro. A lista vem do `GET /tasks` e o CRUD inteiro vai até o Postgres. Não existe `<a href>` em lugar nenhum, não existe segunda tela, e o `web/README.md` diz, na seção Rotas: _"Nenhuma. React Router entra no Tema 9."_ Não existe build de produção rodado uma única vez — tudo que você viu do app até hoje foi `npm run dev`.

**A mudança de eixo.** Até aqui o estado morava **só** na memória do componente. A partir daqui ele mora em três lugares com durabilidades diferentes: no componente (some no F5), na **URL** (sobrevive ao F5, ao botão voltar, e ao envio por WhatsApp), e no **banco** (sobrevive a tudo). Escolher qual estado vai para onde é o tema. E, no fim dele, o app para de ser um processo na sua máquina e vira um endereço.

---

# Parte A — Os tópicos

## A1 · Rotas

### 1. O que o roteador de SPA faz

**O que é.** Uma página HTML só (`index.html`) e um JavaScript que **troca o que está montado** conforme a URL, sem pedir nada novo ao servidor. A peça do navegador que permite isso é a **History API**: `history.pushState()` muda a barra de endereço e empilha uma entrada no histórico **sem recarregar a página**; o evento `popstate` avisa quando o usuário aperta voltar.

**Para que serve.** Entender que o roteador não é mágica nem um servidor em miniatura: é `pushState` + um estado que guarda a URL atual + um `switch` que escolhe qual componente renderizar. Sabendo isso, dois comportamentos deixam de ser misteriosos — por que o botão voltar funciona (é o histórico do navegador de verdade) e por que o F5 quebra (aí a URL vai para o servidor, e é o A2 tópico 5).

**Exemplo — o roteador de brinquedo, em dez linhas:**

```tsx
const [path, setPath] = useState(window.location.pathname);

useEffect(() => {
  const onPop = () => setPath(window.location.pathname);
  window.addEventListener('popstate', onPop);
  return () => window.removeEventListener('popstate', onPop); // limpeza do T6
}, []);

const navigate = (to: string) => {
  window.history.pushState({}, '', to);
  setPath(to);
};

return path === '/tasks' ? <TasksPage /> : <NotFoundPage />;
```

Isso **funciona**. O que o React Router acrescenta é tudo o que falta em volta: casar `/tasks/:id` com um padrão, rota aninhada, layout que não desmonta, a âncora que não recarrega, query string, e o `*`.

### 2. React Router: `BrowserRouter`, `Routes`, `Route`, `Outlet`

**O que é.** Quatro peças com papéis distintos:

| Peça            | Papel                                                                 |
| --------------- | --------------------------------------------------------------------- |
| `BrowserRouter` | envolve o app e liga o roteador à History API. Um só, na raiz          |
| `Routes`        | o seletor: olha a URL e escolhe **uma** rota filha, a que casar melhor |
| `Route`         | o par `path` → `element`                                              |
| `Outlet`        | o buraco no layout onde a rota filha é renderizada                     |

**Para que serve.** É a tradução direta do `switch` do tópico 1 para declarativo — a mesma virada de chave do T1 (`document.createElement` × JSX), agora aplicada à navegação: você **descreve** o mapa de rotas em vez de escrever os `if`.

**Exemplo — o mapa deste app:**

```tsx
<BrowserRouter>
  <Routes>
    <Route element={<AppLayout />}>
      {' '}
      {/* sem path: só layout */}
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/:id" element={<TaskDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Nota de versão.** A partir do React Router 7 o pacote é `react-router` (o `react-router-dom` virou reexport) e existe uma segunda forma de declarar o mapa — objeto de rotas com `createBrowserRouter`, em vez de JSX. **Conferir o que o `package.json` gravar e registrar no `web/README.md`**; o `BrowserRouter` continua válido nas duas versões, e é o caminho mais curto para este app.

### 3. Rota aninhada e layout compartilhado

**O que é.** Uma `Route` dentro de outra. A rota mãe renderiza o que é comum (cabeçalho, navegação, rodapé) e um `<Outlet />`; as filhas renderizam só a parte que muda. Ao trocar de rota filha, **o componente da mãe não desmonta** — ele nem re-renderiza por causa disso.

**Para que serve.** É o que separa "SPA" de "site que troca de página rápido". O `Header` fica montado, o estado dele sobrevive, e não há flash de cabeçalho sumindo e voltando. É também o lugar certo para o que é global de verdade (e o gancho do T12: o Provider mora nesse nível).

**Exemplo.**

```tsx
export function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* TasksPage ou TaskDetailPage entram aqui */}
      </main>
    </>
  );
}
```

O critério de o que sobe para o layout é o mesmo do T3 (`components/` × domínio) em outra forma: **está em toda tela e não depende de qual tela é?** Sobe.

### 4. `Link`/`NavLink` × `<a href>`

**O que é.** `<a href="/tasks">` faz o navegador **pedir a página ao servidor de novo**: recarrega o bundle, refaz a árvore React, e todo estado em memória morre. `<Link to="/tasks">` renderiza um `<a>` de verdade no HTML, mas intercepta o clique e chama `pushState`.

**Para que serve.** É o erro que mata a SPA em silêncio: a tela pisca, tudo "funciona", e ninguém percebe que o app inteiro foi rebootado. O sintoma no DevTools é claro — na aba Network aparece uma requisição de **documento** e a lista de requisições zera.

**Exemplo.**

```tsx
<Link to={`/tasks/${task.id}`}>{task.title}</Link>

<NavLink to="/tasks" className={({ isActive }) => isActive ? 'font-bold' : ''}>
  Tarefas
</NavLink>
```

`NavLink` é o `Link` que **sabe se está ativo** — recebe `isActive` e aplica `aria-current="page"` sozinho, que é acessibilidade de graça (T3, tópico 8). E o detalhe que importa: como o `Link` renderiza um `<a href>` de verdade, **abrir em nova aba com Ctrl+clique continua funcionando**. Uma `<div onClick={navigate}>` quebraria isso — é a mesma dívida do "`div` clicável" do T3, agora com consequência visível.

### 5. `useParams` tipado e a validação do parâmetro

**O que é.** `useParams()` devolve os pedaços dinâmicos da URL. E devolve **`string | undefined`**, sempre — o TypeScript não tem como saber que a rota `/tasks/:id` garante um `id`, e com o `noUncheckedIndexedAccess` do plano essa incerteza chega até você.

**Para que serve.** O parâmetro da URL é **entrada do usuário**, não dado seu: qualquer um digita `/tasks/banana` na barra de endereço. Validar antes de chamar a API é o mesmo princípio de borda que a API aplica no `:id` uuid dela — e a resposta certa aqui não é deixar a API responder 400, é nem sair de casa.

**Exemplo.**

```tsx
const { id } = useParams<{ id: string }>();

if (!id || !isUuid(id)) return <NotFoundPage />; // não chega a bater na API
```

O `useParams<{ id: string }>()` **não valida nada** — é a mesma afirmação vazia do `as Task[]` do T7 tópico 4, terceira aparição da lição. O que vale é o `if`.

### 6. `useNavigate` e o `replace`

**O que é.** O hook que navega **por código**, para quando não há clique em link: depois de criar uma tarefa, depois de apagar a que estava aberta, depois de um `404` da API.

**Para que serve.** A opção `replace: true` é a parte que ninguém entende de primeira: ela **substitui** a entrada atual do histórico em vez de empilhar uma nova. Sem ela, o usuário que criou uma tarefa e apertou voltar retorna para o formulário de criação com tudo preenchido, cria de novo, volta, cria de novo — um histórico armadilha.

**Exemplo.**

```tsx
const navigate = useNavigate();

await deleteTask(id);
navigate('/tasks', { replace: true }); // voltar não leva ao detalhe de algo que não existe mais
```

A regra prática: **empilha** quando o usuário navegou de propósito e faz sentido voltar; **substitui** quando a tela de origem deixou de existir ou deixou de ser válida. O redirecionamento de `/` para `/tasks` (tópico 2) é `replace` pelo mesmo motivo — senão o botão voltar fica preso num pingue-pongue.

### 7. A URL é estado

**O que é.** Filtro e busca não moram em `useState` — moram na query string, lidos e escritos por `useSearchParams`, que tem exatamente a mesma cara de um `useState` (`[valor, setValor]`) e uma diferença enorme: **a barra de endereço é a fonte da verdade.**

**Para que serve.** Quatro ganhos que o `useState` não dá, nenhum deles estético:

- **F5 não perde o filtro.**
- **Botão voltar desfaz o filtro** — o usuário já espera isso.
- **A tela vira link.** `?q=relatorio&status=doing` mandado para outra pessoa abre a mesma tela.
- **Some um estado do componente.** Menos coisa para sincronizar, menos `useEffect` errado (T6, tópico 2).

**Exemplo.**

```tsx
const [searchParams, setSearchParams] = useSearchParams();

const q = searchParams.get('q') ?? '';
const status = searchParams.get('status'); // 'todo' | 'doing' | 'done' | null

const visible = tasks
  .filter((t) => (status ? t.status === status : true))
  .filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
```

**A decisão deste app: os dois — busca (`q`) e filtro (`status`) na mesma URL.** E repare no que a filtragem é: **estado derivado** (T4, tópico 8). Não existe `useState<Task[]>(filtradas)`; existe o array que veio da API e um cálculo na renderização. O que muda é só de onde vem o critério.

Dois cuidados: **`replace: true` ao digitar na busca**, senão cada tecla vira uma entrada no histórico e o botão voltar fica intransitável; e **parâmetro vazio some da URL** (`?q=` é sujeira) — quem escreve o `setSearchParams` limpa a chave quando o valor é vazio.

### 8. Rota `*` — o 404 do front

**O que é.** O padrão coringa: casa com qualquer URL que nenhuma outra rota pegou. É onde vive a página "não encontrado" **do seu app**.

**Para que serve.** Separar duas coisas com o mesmo número e diagnósticos opostos, que é a continuação direta do T8 tópico 11:

| 404                        | Quem responde      | O que significa                              |
| -------------------------- | ------------------ | -------------------------------------------- |
| `/tarefass` (rota errada)  | a rota `*` do front | a URL não existe neste app                   |
| `GET /tasks/:id` sem linha | a API              | a URL existe, o **recurso** é que não         |

**Exemplo.** A segunda é a mais fácil de errar: uma tarefa apagada por fora dá `404` da **API** dentro de uma rota **válida**. A resposta certa não é mandar para a rota `*` — é a `TaskDetailPage` mostrar "esta tarefa não existe mais" e oferecer a volta para `/tasks`, dentro do layout, com o cabeçalho de pé.

A página `*` tem uma obrigação a mais: **sempre um caminho de saída.** Um `<Link to="/tasks">` é o mínimo — 404 sem saída é beco.

### 9. `useLocation` e voltar para onde o usuário estava

**O que é.** O hook que devolve a localização atual inteira — `pathname`, `search`, `hash`, e um `state` que você pode carregar junto na navegação **sem que ele apareça na URL**.

**Para que serve.** É o que faz "voltar" ser voltar de verdade. Se o usuário filtrou (`/tasks?status=doing`), abriu um detalhe e fechou, ele espera cair no **quadro filtrado**, não no quadro cru. E é a peça que o tópico 11 (rota protegida) vai usar: o guarda precisa lembrar para onde a pessoa tentava ir antes do login.

**Exemplo.**

```tsx
const location = useLocation();

<Link to={`/tasks/${task.id}`} state={{ from: location }}>...</Link>

// na volta:
const back = (location.state as { from?: Location })?.from;
navigate(back ?? '/tasks');
```

O `state` da localização é **memória do navegador**, não da URL: sobrevive ao botão voltar e **morre no F5** e no link colado. Por isso ele guarda conveniência, nunca informação necessária — o que precisa sobreviver vai para a query string (tópico 7).

### 10. Buscar dado ao trocar de rota

**O que é.** A `TaskDetailPage` busca `GET /tasks/:id` num `useEffect` com `[id]` nas dependências. Trocar de `/tasks/a` para `/tasks/b` **não desmonta** o componente — é a **mesma** rota casada com outro parâmetro. O React reaproveita a instância e só roda o efeito de novo.

**Para que serve.** É a race condition do T6 e do T7 voltando num disfarce novo, e o disfarce é o problema: como o componente não desmonta, quem espera "monta, busca, desmonta, busca" leva uma surpresa — as duas requisições convivem, e **a de `a`, mais lenta, pode chegar depois da de `b`**, pintando a tela com a tarefa errada e sem erro nenhum no console.

**Exemplo.** A cura já está escrita e é a mesma — a limpeza do efeito roda **antes** do próximo efeito, mesmo sem desmontagem:

```tsx
useEffect(() => {
  const ac = new AbortController();
  void run(ac.signal);
  return () => ac.abort(); // roda quando `id` muda, não só ao desmontar
}, [id]);
```

Detalhe de UX que fica evidente aqui: enquanto a nova busca corre, a tela mostra **a tarefa antiga**, não vazio — e é preciso decidir de propósito se ela fica com o dado velho, some, ou fica opaca. Estado de tela que não conta a verdade é o defeito do T7 tópico 5 em outra roupa.

### 11. Rota protegida — desenhada agora, ativada depois

**O que é.** Um componente-guarda: envolve as rotas privadas, pergunta se há usuário, e ou renderiza o `<Outlet />` ou redireciona para `/login` guardando de onde a pessoa veio (tópico 9).

**Para que serve.** A API **não tem auth** — é o T8 da Etapa 2, do outro lado da pausa. O que este tópico entrega é a **forma**, com a condição chumbada em uma constante e um comentário dizendo o que vai substituí-la. Quando o login chegar, muda uma linha e a estrutura já está de pé.

**Exemplo.**

```tsx
function RequireAuth() {
  const location = useLocation();
  const isAuthenticated = true; // ⚠️ chumbado: vira `useAuth()` no T8 da Etapa 2

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
```

Duas coisas para não sair errado da cabeça: o `replace` evita que voltar caia no guarda de novo, e **guarda de rota não é segurança**. Ele esconde tela; qualquer pessoa apaga isso no DevTools em cinco segundos. Quem protege dado é o servidor — o front só evita mostrar uma tela quebrada.

### 12. Deploy de SPA e a rota que dá 404 ao recarregar

**O que é.** A dívida que este tema cria de propósito. Navegar de `/tasks` para `/tasks/abc` **por dentro** funciona: é `pushState`, o servidor nem fica sabendo. Apertar **F5** em `/tasks/abc` é outra história — o navegador pede `GET /tasks/abc` ao servidor de arquivos, que procura um arquivo naquele caminho, não acha, e devolve **404**. O seu app nem chega a carregar para poder tratar a rota.

**Para que serve.** É o motivo de os dois temas estarem no mesmo arquivo. Em `npm run dev` você **não vê o problema**, porque o servidor do Vite já faz o fallback sozinho — o defeito só aparece depois do deploy, que é o A2. Item de avaliação: _"recarrego a página numa rota interna: tem que abrir"_.

**Exemplo.** A cura é uma regra no servidor de arquivos: para qualquer caminho que não seja um arquivo real, **entregue o `index.html`** e deixe o roteador do front decidir — inclusive decidir que é 404 (tópico 8). Feito no A2, tópico 5.

### 13. Decompor uma tela antes de escrever código

**O que é.** Desenhar a árvore de componentes **no papel** antes do editor. A mecânica (props para baixo, callback para cima) você já tem desde o T2; o difícil é **onde parar**.

**Para que serve.** As duas beiradas são reais e você já encostou nas duas: dividir demais gera prop drilling (foi o que aconteceu no T5, com seis props atravessando três andares — e a refatoração que apagou um andar inteiro foi a melhor coisa daquele dia); dividir de menos gera o arquivo de 300 linhas (é o `Content` de hoje, grande **de propósito**, guardado como material do T11).

**Exemplo — o desenho antes de mexer:**

```
AppLayout
├── Header
└── Outlet
    ├── TasksPage        ← dona da busca da lista e do estado de tela
    │   ├── TaskFilters  ← lê e escreve a query string (tópico 7)
    │   ├── InputTask
    │   └── Content → Card × 3 → ItemTask
    └── TaskDetailPage   ← dona da busca de UMA tarefa
```

O critério que decide: **quem é dono do dado**. `TasksPage` busca a lista porque a lista é dela; `TaskDetailPage` busca a tarefa porque a URL dela diz qual é. Componente que só recebe e mostra não precisa nascer — nasce quando repete, ou quando o arquivo passou do ponto de caber na cabeça.

### 14. `pages/` — e a honestidade sobre ela

**O que é.** O componente de página é o que **casa com uma rota**: orquestra os componentes de domínio, é dono da busca do dado daquela tela, e não é reutilizado em lugar nenhum. Por isso ele não podia existir no T1 — sem rota, "página" e "componente raiz" são a mesma coisa, e a pasta seria nome sem conteúdo.

**Para que serve.** Aqui vale corrigir o plano com o que o repositório mostra: **`pages/` já existe** desde o T3, com `pages/home/HomePage.tsx`. Ela chegou adiantada, exatamente como o plano previu que não deveria — e o resultado é o que estava escrito: a "página" de hoje é só o componente raiz com outro nome.

O que nasce neste tema, então, não é a pasta — é o **conteúdo** dela: pela primeira vez existe mais de uma página, e elas se distinguem por rota, não por posição na árvore.

**Exemplo — o que muda de nome e por quê:**

```
pages/
├── AppLayout.tsx          ← novo: o que é comum a todas as rotas
├── tasks/
│   ├── TasksPage.tsx      ← era home/HomePage.tsx
│   ├── TaskDetailPage.tsx ← novo
│   └── content/           ← segue onde está
└── NotFoundPage.tsx       ← novo
```

Renomear `home/` para `tasks/` não é organização por organização: `home` descreve **posição** ("a primeira"), `tasks` descreve **conteúdo** — e é o conteúdo que a rota `/tasks` afirma. É a mesma régua que separou `components/` de domínio no T3.

---

## A2 · Build e deploy

### 1. `dev` × `preview` × `build`

**O que é.** Três comandos, três coisas diferentes — e até hoje você só usou o primeiro:

| Comando           | O que faz                                                              | Serve para        |
| ----------------- | ---------------------------------------------------------------------- | ----------------- |
| `npm run dev`     | servidor com HMR, módulos servidos crus, sem minificar, source maps     | escrever código   |
| `npm run build`   | empacota, minifica, faz tree-shaking, gera `dist/` com hash no nome     | produzir o artefato |
| `npm run preview` | serve a pasta `dist/` num servidor estático local                        | conferir o artefato |

**Para que serve.** Duas consequências práticas. **Medir performance em `dev` não vale nada** — o que está rodando lá é código não minificado, com ferramenta de desenvolvimento, e o React em modo de desenvolvimento (que faz checagens que a build de produção não faz). E `preview` é onde você **descobre o que quebrou na build antes do deploy**: import com maiúscula errada, variável de ambiente que não existia, caminho de asset.

**Exemplo.** Um defeito clássico só aparece do lado direito: em `dev` o Vite serve os arquivos direto do disco, e no Linux o sistema de arquivos é **sensível a maiúscula** — `import Card from './card'` funcionando em `dev` e quebrando na build é um dos jeitos de perder uma hora.

### 2. Ler o resultado do `vite build` — e a linha de base

**O que é.** O `vite build` imprime cada arquivo gerado com o tamanho cru e o tamanho **gzipado** (que é o que trafega). O `rollup-plugin-visualizer` transforma isso num mapa clicável de quem ocupa o quê.

**Para que serve.** É a primeira vez na etapa inteira que você **mede** em vez de achar. E é medição com data marcada: **este número é a linha de base**, anotada no devlog, e o T14 vai repeti-la para responder "quanto custou a lib de motion?" com um número, não com uma impressão.

O React Router que acabou de entrar aparece aqui — e é para vê-lo. Saber que uma dependência tem tamanho, e qual, é o que separa escolher biblioteca de colecionar biblioteca.

**Exemplo.**

```
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-a1b2c3.css     12.30 kB │ gzip:  3.10 kB
dist/assets/index-d4e5f6.js     198.40 kB │ gzip: 62.70 kB
```

Ler assim: **o `gzip` é o número que importa**; o hash no nome é o assunto do tópico 9; e um único `.js` grande é o sintoma que o tópico 3 vem tratar.

### 3. `lazy` + `Suspense` — dividir o bundle por rota

**O que é.** `React.lazy(() => import('./TaskDetailPage'))` transforma o import num **import dinâmico**: o Rollup vê isso e gera um arquivo separado, baixado só quando aquela rota for visitada. O `<Suspense fallback={...}>` é obrigatório — é o que fica na tela durante o download.

**Para que serve.** É o pagamento direto do tópico 2: quem abre `/tasks` não deveria baixar o código de `/tasks/:id`. E, sendo honesto sobre a escala: neste app o ganho em kB é **pequeno**, porque as páginas são pequenas. O que se aprende é a mecânica e o critério — e o critério aparece na hora em que o `dist/` passa a ter mais de um `.js` e você tem que explicar cada um.

**Exemplo.**

```tsx
const TaskDetailPage = lazy(() => import('./pages/tasks/TaskDetailPage'));

<Suspense fallback={<LoadingTasks />}>
  <Routes>...</Routes>
</Suspense>;
```

O erro a não cometer: `lazy` **dentro** do corpo de um componente. Como ele cria um tipo novo a cada render, o React desmonta e remonta a página inteira a cada atualização — é o mesmo defeito de identidade da `key` instável do T8 tópico 10. `lazy` mora no topo do módulo.

### 4. Deploy de estático: o que sobe é a `dist/`

**O que é.** O front não é um servidor. O que vai para o ar são **arquivos**: um `index.html`, um punhado de `.js`, `.css` e imagens, servidos por uma CDN. Não há Node rodando do outro lado.

**Para que serve.** Explica de onde vêm todas as peculiaridades do tema: o 404 no F5 (tópico 5), a variável decidida no build (tópico 6), e o fato de que **nada é secreto** (T7, tópico 7). Também explica por que é de graça — servir arquivo é barato.

**A decisão deste app: Vercel.** No plano Hobby cabem até **200 projetos**, então já ter um site lá não atrapalha — e o plano é para uso pessoal e não comercial, que é exatamente o caso. O que se ganha: deploy por push (tópico 8), preview de branch, HTTPS e CDN sem configurar nada, e fallback de SPA que já vem pronto para projeto Vite.

**Exemplo.** O que a Vercel precisa saber, e que ela detecta sozinha em projeto Vite: `Build Command: npm run build`, `Output Directory: dist`. A única coisa que **não** dá para detectar é a variável de ambiente — tópico 6.

### 5. Fallback de SPA — pagando a dívida do A1

**O que é.** A regra de _rewrite_: qualquer caminho que não corresponda a um arquivo real na `dist/` é servido com o **`index.html`**, com status **200**. O app carrega, o roteador olha a URL e decide — inclusive decidir que é a rota `*`.

**Para que serve.** É a cura do A1 tópico 12 e um item da avaliação. Vale entender o que a regra faz e o que ela **não** faz: ela não cria a rota, ela só garante que o seu JavaScript chegue a rodar. Se `/tasks/abc` não estiver no mapa de `Routes`, o resultado continua sendo 404 — só que agora é o **seu** 404, dentro do seu layout.

**Exemplo.** Na Vercel isso costuma vir pronto no preset do Vite. **Testar primeiro** (deploy → abrir uma rota interna → F5). Se der 404, um `vercel.json` na raiz da `web/`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

O detalhe que separa de quem copiou: o status tem que ser **200**, não 301/302. Redirecionar `/tasks/abc` para `/` **apaga a URL** — o usuário aperta F5 e cai na home, o que é pior que o 404 porque parece que funcionou.

### 6. Variável de ambiente no build — e a descoberta que reescreve o tópico 7

**O que é.** `import.meta.env.VITE_API_URL` **não é lida em runtime**. O Vite **substitui o texto** durante o `build`: o valor entra no `.js` gerado, literalmente. Trocar de URL exige **rebuild**, não reiniciar nada.

**Para que serve.** Aqui a teoria do T7 tópico 7 encontra a realidade, e a realidade é mais dura do que parecia: **o link público não vai conseguir falar com a sua API local — nem na sua própria máquina.** Dois bloqueios independentes do navegador, e nenhum deles tem cura no seu código:

1. **Mixed content.** A página na Vercel é `https://`. Uma requisição para `http://localhost:3000` é conteúdo inseguro dentro de página segura, e o navegador recusa.
2. **Acesso à rede local.** Mesmo resolvido o primeiro, um site **público** pedindo algo para a **sua máquina** é exatamente o que o navegador foi ensinado a barrar — o Chrome exige hoje um preflight com permissão explícita do lado do servidor (e caminha para pedir permissão ao usuário também). A `api/` está **congelada** e não manda esse header.

**A consequência prática, escrita com todas as letras:**

| Onde                      | `VITE_API_URL`          | O que acontece                                    |
| ------------------------- | ----------------------- | ------------------------------------------------- |
| `localhost:5173` (dev)    | `http://localhost:3000` | funciona como hoje — http → http, CORS já liberado |
| link público da Vercel    | qualquer coisa          | **nunca** alcança a sua máquina                    |

Ou seja: o app **continua sendo desenvolvido e demonstrado em `localhost`**, e o link público é vitrine até a API subir (T9 da Etapa 2). Isso não é um contratempo do tema — é o tema. O tópico 6 existe para você descobrir que `VITE_API_URL` é uma decisão de **build**, e a descoberta veio inteira.

### 7. O front no ar sem API no ar — a decisão

**O que é.** O coração do tema: **o que a pessoa que abrir o link vai ver?** As três saídas eram mensagem honesta, dados de demonstração, ou modo somente-leitura.

**A decisão deste app: mensagem honesta.** Sem modo demo, sem dado falso. O motivo é o mesmo que matou o `localStorage` no T7: **uma fonte da verdade**. Dado de demonstração é uma segunda fonte com outro nome — e reintroduzi-la três temas depois de tê-la enterrado, para agradar um visitante que ainda não existe, é trocar honestidade por vitrine.

**Para que serve.** A decisão custa uma coisa e não sai de graça: **o `ErrorTasks` precisa dizer a verdade.** Hoje ele diz "erro ao carregar" — que, no link público, é falso: não há erro nenhum, o app está funcionando exatamente como projetado. É a diferença entre uma tela quebrada e uma tela que explica.

**Exemplo — o que o estado de erro precisa passar a distinguir:**

- **falhou de verdade** (a API caiu no meio) → "não conseguimos falar com o servidor" + **Tentar de novo**, como hoje;
- **é o link público** (nunca vai alcançar) → o que é o projeto, que a API roda local **de propósito** enquanto a Etapa 2 está pausada, e um link para o repositório. "Tentar de novo" ali é botão que mente.

Distinguir os dois é o T7 tópico 10 (erro de rede × erro de aplicação) cobrando a fatura numa terceira situação. E a mesma mensagem, mais curta, entra no topo do `web/README.md` (tópico 12) — quem clica no link tem que saber em dez segundos que aquilo é proposital.

### 8. Deploy automático a cada push, e o preview de branch

**O que é.** A Vercel observa o repositório: push na `main` → build → produção. Push em qualquer outra branch → build → **URL de preview própria**, que não toca a produção.

**Para que serve.** É a infraestrutura da **regra 7** ("o que está na `main` está no ar"). Sem automação, a regra vira disciplina, e disciplina falha; com ela, esquecer de publicar exige esforço. O preview de branch é o que permite quebrar coisa sem medo — o T14 vai mexer em animação de tudo, e vale ver isso numa URL antes da `main`.

**Exemplo.** O detalhe de configuração que morde primeiro: o repositório é um **monorepo de estudo**, e a `web/` está em `etapas/etapa-3/web`. Isso vai para o campo **Root Directory** da Vercel — sem ele, a build roda na raiz, não acha `package.json` nenhum, e falha antes de começar.

E a consequência que vale antecipar: **build quebrada agora é problema público**. Um typecheck vermelho que passava despercebido vira e-mail de deploy falhado.

### 9. Cache e hash no nome do arquivo

**O que é.** O Vite gera `index-d4e5f6.js` — o pedaço do meio é um hash do **conteúdo**. Conteúdo mudou, nome mudou. O `index.html` (que não tem hash) aponta para o nome novo.

**Para que serve.** É o que resolve o problema mais antigo da web: o usuário com a versão velha em cache. A CDN pode guardar os arquivos com hash **para sempre** (o nome nunca mente), enquanto o `index.html` é servido sem cache — então basta ele ser novo para todo o resto ser puxado novo.

**Exemplo.** O sintoma de quem não tem isso: "no meu computador está atualizado, no seu não" e a instrução de Ctrl+Shift+R para o usuário. Com hash no nome, esse pedido não existe. Vale conferir uma vez na aba Network, depois de um redeploy, que o `.js` novo tem nome diferente.

### 10. Imagem e fonte: o que pesa de verdade

**O que é.** Numa página simples, o JavaScript raramente é o vilão. Uma foto de 2 MB não redimensionada pesa mais que o React inteiro; uma família de fonte com seis pesos baixados sem necessidade custa mais que o React Router.

**Para que serve.** Manter a proporção depois de passar um tema medindo bundle. O app tem hoje um SVG (`check-task-manager.svg`) — que é leve por natureza — e usa fonte do sistema ou uma escolhida no T3: **conferir qual, e quantos pesos**. Se houver GIF do app no README (tópico 12), ele é candidato natural a ser o arquivo mais pesado do repositório.

**Exemplo.** As três medidas que resolvem quase tudo: servir a imagem **no tamanho em que ela aparece** (não a original), formato moderno (`webp`/`avif`), e `loading="lazy"` no que está abaixo da dobra. Para fonte: só os pesos usados, e `font-display: swap` para o texto não ficar invisível esperando o download.

### 11. Lighthouse: rodar, ler as quatro notas, corrigir o que é barato

**O que é.** Auditoria embutida no DevTools, em quatro eixos: **Performance**, **Acessibilidade**, **Boas práticas** e **SEO**. Roda **na URL pública ou no `preview`**, nunca em `dev` (tópico 1).

**Para que serve.** É a primeira devolutiva externa sobre decisões que você tomou lá atrás — e a nota de **Acessibilidade** é a que interessa mais aqui, porque ela audita justamente o que o T3 plantou (contraste, `label` ligado ao input, foco, semântica) e o que o T13 vai cobrar de novo (`getByRole` só funciona se o papel existir).

**Exemplo.** O que é barato e costuma aparecer: `<html lang="pt-BR">` faltando, `<title>` e `meta description` genéricos do template do Vite, contraste 4.3:1 onde precisava de 4.5:1, imagem sem `alt`. O que **não** vale perseguir agora: nota 100 de Performance num app que fala com uma API local. Anotar o número e o que sobrou é melhor que caçar ponto.

### 12. O `web/README.md` com link, GIF e a limitação escrita

**O que é.** O fechamento do tema, e a regra 4 aplicada com material novo: **link no topo**, print ou GIF do app funcionando, e a limitação da API local dita com todas as letras.

**Para que serve.** É o que faz o link contar como entregue. Vale lembrar o diagnóstico que abriu esta etapa — "sem link público não conta como terminado" — e o corolário incômodo: um link que abre e mostra uma tela de erro sem explicação é **pior** que link nenhum, porque quem chega conclui que você não terminou.

Por isso o GIF não é enfeite: **é a única prova que o visitante vai ter** de que o CRUD funciona, já que ele não vai conseguir usar (tópico 6). Ele mostra o que a tela não pode mostrar.

**Exemplo — o que entra no topo:**

- o link, em primeiro lugar;
- uma frase dizendo que a API roda local **de propósito**, com o endereço da dívida (retomada da Etapa 2);
- o GIF: criar, ciclar status, editar título, apagar, filtrar pela URL;
- como rodar localmente para ver funcionando de verdade — que já existe e continua valendo.

---

## A3 · Onde os dois temas se encontram

### 1. A dívida nasce e morre no mesmo arquivo

O A1 tópico 12 cria o 404 no F5; o A2 tópico 5 paga. É o ciclo mais curto de dívida técnica da etapa inteira, e o único em que dá para ver as duas pontas de uma vez — o resto das dívidas deste projeto (`localStorage`, erro por campo, validação em runtime) atravessa temas ou etapas.

Vale notar **por que** ela existe: em `npm run dev` o problema não aparece, porque o servidor do Vite já faz o fallback. É um defeito que só existe fora da sua máquina — a categoria inteira que este tema apresenta.

### 2. O bundle é o primeiro número da etapa

Até aqui tudo foi qualitativo: "ficou bom", "responde na hora". O `vite build` devolve um número em kB, e é o **primeiro** deles. O T10 mede a linha de base, o T11 mede re-render com o Profiler, o T14 mede frame rate — e a régua não muda: **medir antes, medir depois, comparar.**

O React Router entrando no bundle **no mesmo arquivo** em que o bundle é medido pela primeira vez não é coincidência de calendário: é a forma mais barata de aprender que dependência tem preço.

### 3. O link público é o app existindo fora da sua máquina

Os dois temas são a mesma virada, vista de dois ângulos: **o app ganha endereço**. Dentro dele, cada tela ganha o seu (A1); fora dele, o app inteiro ganha o dele (A2).

E é essa mudança que revela a limitação que estava escondida desde o T7: um app que depende de um processo rodando no seu computador **não existe** para mais ninguém. A decisão do A2 tópico 7 é responder a isso com honestidade em vez de com maquiagem — e deixar a cura no lugar certo, que é subir a API na retomada da Etapa 2.

---

# Parte B — Alterações no app

### 1. Preparação do ambiente

- **React Router:** `npm install react-router-dom` na `web/`. Conferir a versão que o `package.json` gravar e **registrar no `web/README.md`** — a partir da v7 o pacote é `react-router` e o `react-router-dom` é reexport.
- **Visualizador de bundle:** `npm install -D rollup-plugin-visualizer`, plugado no `vite.config.ts`. Ferramenta de desenvolvimento, não vai para o bundle.
- **Conta na Vercel** com o repositório conectado. **Root Directory: `etapas/etapa-3/web`** — é o que faz a build achar o `package.json`.
- **`VITE_API_URL` no painel da Vercel** (ambiente de produção). O valor é irrelevante para funcionar — ver A2 tópico 6 — mas **a chave precisa existir**, senão a build gera `undefined` na URL e o erro na tela fica ininteligível.
- **Rodar `npm run build` e `npm run preview` uma vez, antes de qualquer deploy.** É onde os defeitos de build aparecem com o log inteiro na sua frente, e não num painel.
- Os dois servidores de sempre para o desenvolvimento: `sudo service postgresql start` → `npm run dev` na `api/` → `npm run dev` na `web/`.

### 2. Os blocos

#### Bloco 1 — o que o app tem que fazer agora

**O mapa de rotas (T9)**

- [ ] `react-router-dom` instalado e `BrowserRouter` no `main.tsx` (ou no `App`), uma vez só
- [ ] `AppLayout` com `Header` + `<Outlet />`; o `Header` não desmonta ao trocar de rota
- [ ] `/tasks` → `TasksPage` (era `HomePage`); `/` redireciona para `/tasks` com `replace`
- [ ] `/tasks/:id` → `TaskDetailPage`, com `useParams`, validação do `id` e `GET /tasks/:id`
- [ ] Rota `*` → `NotFoundPage`, com caminho de saída para `/tasks`
- [ ] `pages/home/` vira `pages/tasks/`; `NotFoundPage` e `AppLayout` no lugar certo
- [ ] Nenhum `<a href>` interno — `Link`/`NavLink` em tudo que navega dentro do app
- [ ] `useNavigate` com `replace` depois de apagar a tarefa que está aberta no detalhe
- [ ] Busca de detalhe com `[id]` nas deps e `AbortController` na limpeza — a race entre rotas
- [ ] `404` da API dentro de rota válida vira mensagem na página, **não** a rota `*`
- [ ] `RequireAuth` desenhado, com a condição chumbada e o comentário do T8 da Etapa 2

**A URL como estado (T9)**

- [ ] Campo de busca por título, com `q` na query string via `useSearchParams`
- [ ] Filtro de status com `status` na query string
- [ ] A filtragem é **derivada** — nada de `useState` com a lista filtrada
- [ ] `replace: true` ao digitar na busca; parâmetro vazio é removido da URL
- [ ] `/tasks?q=x&status=doing` colado em outra aba abre a mesma tela

**Build e deploy (T10)**

- [ ] `npm run build` rodado e o resultado **colado no devlog** — a linha de base do T14
- [ ] `rollup-plugin-visualizer` configurado e o mapa olhado pelo menos uma vez
- [ ] `lazy` + `Suspense` na `TaskDetailPage`; o `dist/` passa a ter mais de um `.js`
- [ ] Projeto na Vercel, `Root Directory` apontado, build passando
- [ ] Fallback de SPA **testado com F5 numa rota interna** — `vercel.json` só se precisar
- [ ] `ErrorTasks` distingue "a API caiu" de "é o link público", com texto honesto e sem "Tentar de novo" no segundo caso
- [ ] Push na `main` publica sozinho; um push de teste para provar
- [ ] Lighthouse rodado **na URL pública**, as quatro notas anotadas no devlog
- [ ] `web/README.md`: link no topo, GIF do CRUD, limitação da API local escrita, rotas atualizadas, React Router na stack

**Provas (regra 1 — trecho gerado precisa de prova)**

- [ ] F5 em `/tasks/<id>` no link público: abre, não dá 404
- [ ] URL inexistente no link público: cai na `NotFoundPage`, dentro do layout
- [ ] `/tasks/banana`: não sai requisição nenhuma para a API (aba Network vazia)
- [ ] Trocar de detalhe para outro detalhe: a Network mostra a primeira requisição cancelada
- [ ] Link com `?q=` e `?status=` colado em janela anônima: mesma tela
- [ ] Botão voltar depois de filtrar, abrir um detalhe e fechar: volta para o quadro **filtrado**
- [ ] Ctrl+clique num link de tarefa abre em nova aba (prova de que é `<a href>` de verdade)
- [ ] Redeploy: o `.js` muda de hash e o navegador pega o novo sem Ctrl+Shift+R

#### Bloco 2 — sugestões, médio/avançado

- `createBrowserRouter` com objeto de rotas em vez de JSX — e comparar as duas formas
- `errorElement` / `ErrorBoundary` por rota: a tela que não fica branca quando um componente estoura
- _Debounce_ na busca antes de escrever na URL (e a diferença entre atrasar o filtro e atrasar a URL)
- Detalhe como **modal sobre a lista**, mantendo a URL — o padrão de rota com `state` de fundo
- `useSearchParams` embrulhado num hook (`useTaskFilters`) — é T11; se fizer, registrar que antecipou
- Ordenação também na URL (`?sort=term`), fechando a ideia de "a tela inteira cabe num link"
- `<title>` por rota, com a contagem de pendentes — o efeito honesto do T6 voltando com material
- Preview de branch usado de verdade: abrir o T14 numa branch e conferir pela URL de preview
- Domínio próprio na Vercel
- `manualChunks` para separar as dependências do seu código, e ver o efeito no cache
- Prefetch da rota de detalhe no `hover` do link
- `<meta>` de Open Graph, para o link ter cara ao ser compartilhado

---

# Parte C — Revisão do código

> Preencher no fechamento do tema. **Regra 6: o tema só fecha quando esta parte estiver concluída** — e, a partir daqui, vale a **regra 7**: sem redeploy, o tema não fechou.

## O app foi migrado para o assunto do tema?

**O mapa de rotas (T9)** — tudo entregue.

- `react-router-dom` 7.18.2 instalado; `BrowserRouter` no `main.tsx`, uma vez só. Todos os imports do projeto apontam para `react-router` (na v7 o `-dom` é reexport).
- `AppLayout` com `Header` + `<Outlet />`; o `Header` não desmonta ao navegar.
- `/tasks` → `TasksPage` (era `HomePage` → `Content`); `/` redireciona com `replace`.
- `/tasks/:id` → `TaskDetailPage`, com `useParams`, `isUuid` e `GET /tasks/:id`.
- `*` → `NotFoundPage`, com `Link` de volta para `/tasks`.
- `pages/home/` virou `pages/tasks/` e a subpasta `content/` foi achatada; nasceram `pages/taskDetail/`, `pages/notFound/` e `routes/`.
- Nenhum `<a href>` interno — `Link` em tudo que navega.
- `useNavigate` com `replace` depois de apagar a tarefa aberta no detalhe (e também no `404`, porque nesse caso o objetivo do usuário já foi cumprido).
- Busca do detalhe com `[validId]` nas deps e `AbortController` na limpeza.
- `404` da API dentro de rota válida vira mensagem na página, não a rota `*`.
- `RequireAuth` desenhado, condição chumbada, comentário apontando para o T8 da Etapa 2.

**A URL como estado (T9)** — tudo entregue: `q` e `status` no `useSearchParams`, filtragem derivada (nenhum `useState` com lista filtrada), `replace: true` ao digitar, parâmetro vazio removido da URL, e link com `?q=&status=` reabrindo a mesma tela.

**Build e deploy (T10)** — tudo entregue: linha de base do bundle medida e registrada no devlog, `rollup-plugin-visualizer` configurado (`dist/stats.html`), `lazy` + `Suspense` na `TaskDetailPage` (o `dist/` passou a ter dois `.js`), projeto na Vercel com `Root Directory` apontado, fallback de SPA pago com `vercel.json` depois do 404 no F5, `ErrorTasks` distinguindo "a API caiu" de "é o link público", publicação automática a cada push, Lighthouse rodado na URL pública (100 · 100 · 96 · 91) e `web/README.md` atualizado.

**Fora do escopo, anotado como dívida:** `isShowcase` na `TaskDetailPage`, `pendingIds` chegando ao `FilledTasks`, esconder coluna vazia sob filtro, e o GIF no topo do README.

## Typecheck

`npm run typecheck` (`tsc -b --noEmit`) — **limpo**. No caminho ele pegou duas coisas reais: `Suspense` importado e não usado no `App` depois de mudar de arquivo, e a prop `showcase` declarada no `ErrorTasks` sem ser lida no corpo.

## Testes

Nenhum, por plano: testes de front são o **Tema 13**. A verificação deste tema foi manual, pelas oito provas do Bloco 1 — todas passaram — mais a que só existe a partir de agora: **o link público abre e está atualizado** (regra 7).
