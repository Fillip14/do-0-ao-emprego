# web — Do 0 ao Emprego

Front-end do gerenciador de tarefas: SPA em React + TypeScript que vai consumir a
[API da Etapa 2](../../etapa-2/api/README.md). Este README é o contrato do front — o que
o app faz, como rodar e as decisões tomadas.

## O que o app faz hoje

Lista de tarefas na tela, a partir de um **array fixo em código** (`src/data/mockTasks.ts`).
Cada tarefa mostra status, título e prazo; lista vazia cai num estado vazio próprio, com
mensagem e chamada para ação. Ainda **não** há interação: os botões e o campo de texto
existem como estrutura, não respondem a clique (estado entra no Tema 4).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b --noEmit — tem que sair limpo antes de commitar
```

O `-b` é obrigatório: o `tsconfig.json` da raiz é *solution-style* (`"files": []` +
`references`), e sem ele o `tsc` lê zero arquivo e sai limpo sempre.

## Stack

| | |
|---|---|
| React | 19.2.7 |
| TypeScript | 6.0.2 |
| Vite | 8.1.1 |

Fonte da verdade é o `package.json`.

## Onde as coisas moram

Organização **por tipo**, com subpasta por área dentro de `components/`:

- `src/components/` — componentes de uso geral (`Header`, `Content`, `Section`).
- `src/components/tasks/` — tudo que é do domínio de tarefas (`TaskList`, `TaskItem`,
  `TaskSummary`, `AddTaskField`, `EmptyTask`).
- `src/types/` — os tipos do domínio (`Task`, `Status`).
- `src/data/` — dados fixos de desenvolvimento. **Some no Tema 7**, quando a lista passar a
  vir da API.

Um componente por arquivo, nome do arquivo igual ao do componente. Export **nomeado** em
todos, com uma exceção: `App` é `export default`, por ser o ponto de entrada.

## Decisões

**Organização por tipo, não por feature.** O app tem um domínio só (tarefas); pasta por
feature resolve um problema que ele ainda não tem. Revisitar se aparecer um segundo domínio.

**A `interface Task` é uma cópia deliberada do contrato, não um import da `api/`.** Ela é
escrita a partir do [`api/README.md`](../../etapa-2/api/README.md), e não importada de
`api/src/`. Três motivos:

1. O contrato entre front e back é **HTTP e JSON**, não TypeScript. O tipo interno da API
   descreve a entidade por dentro e inclui o que o front nunca vê — a coluna `created_at`
   existe na tabela e não é exposta em resposta nenhuma.
2. Importar de fora da `web/` acoplaria o **build** dos dois projetos, e o front precisa
   poder ser publicado sozinho (Tema 11).
3. Front e back mudam em ritmos diferentes; a cópia é o que permite a API mudar por dentro
   sem quebrar o build do front.

O custo é real e assumido: se o contrato mudar, nada avisa e o front descobre em runtime.
É por isso que o `api/README.md` é a fonte da verdade. Fechar essa brecha é validação em
runtime (zod) ou tipo gerado de um contrato compartilhado (OpenAPI) — nenhum dos dois entra
agora.

**`term` é `string | null`, não opcional.** A chave sempre existe e pode valer `null` —
JSON não tem `undefined`. `exactOptionalPropertyTypes` está ligado e trata `campo?: string`
e `campo: string | undefined` como coisas diferentes.

**Sem biblioteca de estilo ainda.** Estilo é o Tema 3, e a decisão (CSS Modules, Tailwind,
etc.) vai ser registrada aqui.

## Limitações conhecidas

- Não conversa com API: os dados são fixos, nada persiste.
- Sem interação — nenhum botão faz nada (Tema 4).
- Sem rotas, sem testes, sem deploy. O app cresce a cada tema.
