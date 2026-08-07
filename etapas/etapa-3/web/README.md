# web — Do 0 ao Emprego

Front-end do gerenciador de tarefas: SPA em React + TypeScript que vai consumir a [API da Etapa 2](../../etapa-2/api/README.md). Este README é o contrato do front.

## O que faz hoje

Quadro de tarefas em três colunas por status — concluídas, em andamento e a fazer — com **interação real, em memória**:

- **Criar** tarefa pelo campo fixo no rodapé (nasce como `todo`; espaço em branco não vira tarefa)
- **Alterar** o status pelo botão da tarefa, em ciclo `todo → doing → done → todo`; a tarefa troca de coluna na hora
- **Apagar** tarefa pelo botão no canto do item
- Coluna sem tarefa mostra mensagem própria em vez de espaço branco
- Estado vazio próprio quando não existe nenhuma tarefa
- Layout responsivo para mobile e desktop

Os dados ainda saem de um array fixo (`src/data/mockTasks.ts`) e **nada persiste** — recarregar a página volta ao estado inicial. A API entra no Tema 7.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b --noEmit
```

O `-b` é obrigatório: o `tsconfig.json` da raiz é _solution-style_, e sem ele o `tsc` lê zero arquivo e sai limpo sempre.

**Variáveis de ambiente:** nenhuma. `VITE_API_URL` entra no Tema 7, quando o front passar a falar com a API.

## Rotas

Nenhuma. O app é uma tela só (`HomePage`) montada direto no `App`. React Router entra no Tema 9.

## Stack

React 19.2.7 · TypeScript 6.0.2 · Vite 8.1.1 · Tailwind CSS 4.3.3 · lucide-react 1.28. Fonte da verdade é o `package.json`.

## Estrutura

| Pasta         | O que mora                                                                            |
| ------------- | ------------------------------------------------------------------------------------- |
| `assets/`     | Imagens a serem utilizadas no app                                                     |
| `components/` | Componentes reutilizáveis no app: `Card`, `Button`, `Typography`                      |
| `data/`       | Dados mocados para simulação do back-end                                              |
| `layout/`     | Layouts genéricos usados em mais de uma página ou estado: `header/`                   |
| `pages/`      | `home/` onde ficam as páginas do app; `home/content/` guarda os componentes de tarefa |
| `types/`      | Types do typescript utilizados no app `task`                                          |
| `utils/`      | Utilitários para o app                                                                |

## Decisões

**Tailwind** Usar tailwind para estilização do app. Mais rápido de visualizar as alterações de estilização, não precisa ficar viajando entre arquivos.

**Começou em CSS Modules e migrou para Tailwind — de propósito.** O app foi todo estilizado em CSS Modules primeiro e depois migrado, para resolver os mesmos problemas duas vezes e poder comparar em vez de escolher por indicação.

**Sem biblioteca de classe condicional.** `utils/classNames` junta as classes à mão. `clsx` (filtrar valor falso, aceitar objeto) e `tailwind-merge` (resolver utilitário em conflito) resolvem problemas reais e entram quando aparecerem — hoje todas as listas de classe são fixas.

**O botão "Alterar" cicla o status: `todo → doing → done → todo`.** As alternativas eram um `<select>` de status (mais explícito, mas antecipa o formulário do Tema 5) e um botão único de "marcar como feita" (mais simples, mas sem caminho de volta). O ciclo foi escolhido porque o botão **sempre faz algo** — não existe estado em que ele fique clicável e morto — e porque fechar o ciclo em `todo` dá como desfazer um clique errado sem precisar de tela de edição.

## Limitações

- Dados fixos em memória: recarregar a página desfaz tudo.
- Sem API, rotas, testes ou deploy.
- Sem edição da descrição nem do prazo — só status.
