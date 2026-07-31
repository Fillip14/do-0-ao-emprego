# web — Do 0 ao Emprego

Front-end do gerenciador de tarefas: SPA em React + TypeScript que vai consumir a [API da Etapa 2](../../etapa-2/api/README.md). Este README é o contrato do front.

## O que faz hoje

Lista de tarefas a partir de um array fixo (`src/data/mockTasks.ts`), com estado vazio próprio e layout responsivo — item empilhado no celular, em linha a partir de 40rem. Sem interação ainda: os botões e o campo existem como estrutura (estado entra no Tema 4).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b --noEmit
```

O `-b` é obrigatório: o `tsconfig.json` da raiz é *solution-style*, e sem ele o `tsc` lê zero arquivo e sai limpo sempre.

## Stack

React 19.2.7 · TypeScript 6.0.2 · Vite 8.1.1 · CSS Modules. Fonte da verdade é o `package.json`.

## Estrutura

| Pasta | O que mora |
|---|---|
| `components/` | casca do app (`Header`) |
| `components/ui/` | não sabem nada do domínio: `Card`, `Heading`, `TextField`, `CustomButton` |
| `components/tasks/` | domínio: `TaskSection`, `FilledTasks`, `EmptyTasks`, `TaskItem`, `TaskSummary` |
| `types/` · `data/` | `Task` e `Status` · array fixo, some no Tema 7 |
| `reset.css` · `index.css` | os dois únicos CSS globais: reset de terceiro · `box-sizing` e a paleta em `:root` |

Um componente por arquivo, export nomeado (exceto `App`). Componente e módulo CSS lado a lado, sem pasta.

## Decisões

**CSS Modules.** Nome de classe em CSS é global — o `p { color: gray }` que existia aqui pintava todo parágrafo do app, inclusive os não escritos. Tailwind seria uma segunda linguagem por cima de um CSS recém-aprendido; CSS-in-JS custa runtime, e o Tema 11 mede bundle.

**`ui/` não importa `Task`.** O teste é copiar o arquivo para outro projeto: se funciona sem alteração, é `ui/`. Nome conta — `Card` e `TextField` nasceram como `TaskHeader` e `TaskField`, resíduo de onde vieram.

**Sem pasta por componente.** Com CSS Modules todo componente ganha um irmão no dia 1, então "tem irmão" não serve de gatilho. Vira pasta no terceiro arquivo — o teste, no Tema 14.

**`<ul>`, não `<table>`.** Tabela era semanticamente mais correta e daria `<th scope="col">` de graça. Recusada pelo que cobra depois: `<tr>` não vira flex, `transform` nela é inconsistente e altura não anima — briga de frente com o Tema 10 (entrada, saída e arrasto de item). Custo assumido: sem cabeçalho, cada item rotula o próprio dado.

**Status pelo ícone, sem cor de linha.** O `aria-label` leva "Em andamento" a quem não vê o emoji — sem ele o leitor de tela diria "hammer". Cor nunca é o único portador de significado.

**`Task` é cópia do contrato, não import da `api/`.** O contrato entre front e back é HTTP, não TypeScript, e o front precisa buildar sozinho (Tema 11). Custo: mudança de contrato não avisa, e o front descobre em runtime — fechar isso é zod ou OpenAPI, depois.

**`term` é `string | null`, não opcional.** JSON não tem `undefined`, e `exactOptionalPropertyTypes` trata os dois como coisas diferentes.

**Nada instalado.** `clsx` seriam três linhas já escritas à mão; primitivo de layout foi adiado porque só existe um lugar que empilha.

## Limitações

- Dados fixos, nada persiste. Sem interação, rotas, testes ou deploy.
- `id` do `TextField` vem por prop; dois campos na mesma tela exigiriam ids diferentes à mão. Resolve com `useId`, Tema 12.
