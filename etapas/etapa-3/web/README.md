# web — Do 0 ao Emprego

Front-end do gerenciador de tarefas: SPA em React + TypeScript que vai consumir a [API da Etapa 2](../../etapa-2/api/README.md). Este README é o contrato do front.

## O que faz hoje

Lista de tarefas a partir de um array fixo (`src/data/mockTasks.ts`), com estado vazio próprio e layout responsivo para mobile e desktop. Sem interação ainda: os botões e o campo existem como estrutura (estado entra no Tema 4).

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b --noEmit
```

O `-b` é obrigatório: o `tsconfig.json` da raiz é _solution-style_, e sem ele o `tsc` lê zero arquivo e sai limpo sempre.

## Stack

React 19.2.7 · TypeScript 6.0.2 · Vite 8.1.1 · Tailwind CSS 4.3.3 · lucide-react 1.28. Fonte da verdade é o `package.json`.

## Estrutura

| Pasta         | O que mora                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------- |
| `assets/`     | Imagens a serem utilizadas no app                                                           |
| `components/` | Componentes reutilizáveis no app: `Card`, `Button`, `Typography`                            |
| `data/`       | Dados mocados para simulação do back-end                                                    |
| `layout/`     | Layouts genéricos que são utilizados em mais de um página ou estado: `header/`, `InputTask` |
| `pages/`      | `home/` onde ficam as páginas do app                                                        |
| `types/`      | Types do typescript utilizados no app `task`                                                |
| `utils/`      | Utilitários para o app                                                                      |

## Decisões

**Tailwind** Usar tailwind para estilização do app. Mais rápido de visualizar as alterações de estilização, não precisa ficar viajando entre arquivos.

**Começou em CSS Modules e migrou para Tailwind — de propósito.** O app foi todo estilizado em CSS Modules primeiro e depois migrado, para resolver os mesmos problemas duas vezes e poder comparar em vez de escolher por indicação. O que a migração mostrou na prática:

- **Ganhou:** estilo e marcação no mesmo lugar, sem pular de arquivo, e o resultado aparece no mesmo movimento da edição.
- **Perdeu:** o nome do elemento. `.item`, `.title` diziam o que a coisa era; a lista de utilitários não diz nada, e em alguns componentes ela ficou longa o suficiente para esconder a estrutura do JSX.
- **A armadilha:** utilitário inválido ou em conflito não dá erro — só não faz nada, e quando dois conflitam (`truncate` com `text-wrap`, `overflow-hidden` com `overflow-y-auto`) quem vence é a ordem do CSS gerado, não a ordem escrita. É o mesmo modo de falhar do CSS puro, com um vocabulário maior para errar.
- **Consequência assumida:** a paleta própria em `:root` saiu e o app passou a usar as escalas do Tailwind.

**Sem biblioteca de classe condicional.** `utils/classNames` junta as classes à mão. `clsx` (filtrar valor falso, aceitar objeto) e `tailwind-merge` (resolver utilitário em conflito) resolvem problemas reais e entram quando aparecerem — hoje todas as listas de classe são fixas. `lucide-react` é a única dependência de UI instalada, pelos ícones.

## Limitações

- Dados fixos, nada persiste. Sem interação, rotas, testes ou deploy.
