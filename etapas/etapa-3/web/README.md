# web — Do 0 ao Emprego

Front-end do gerenciador de tarefas: SPA em React + TypeScript que vai consumir a [API da Etapa 2](../../etapa-2/api/README.md). Este README é o contrato do front.

## O que faz hoje

Quadro de tarefas em três colunas por status — concluídas, em andamento e a fazer — com **interação real e persistência local**:

- **Criar** tarefa por um formulário no rodapé: título, status e prazo. O rodapé começa como um campo rápido de título e **expande ao receber foco**, revelando status e prazo; fecha ao enviar
- **Validação no cliente:** título vazio não cria tarefa e mostra a mensagem no próprio campo, amarrada por `aria-describedby`; o que foi digitado é preservado
- **Editar o título na linha:** clicar no título troca por um campo; **Enter** salva, **Esc** cancela
- **Alterar** o status pelo botão da tarefa, em ciclo `todo → doing → done → todo`; a tarefa troca de coluna na hora
- **Apagar** tarefa pelo botão no canto do item
- Coluna sem tarefa mostra mensagem própria em vez de espaço branco
- Estado vazio próprio quando não existe nenhuma tarefa — e é o primeiro acesso de todo mundo
- Layout responsivo para mobile e desktop

**As tarefas sobrevivem ao F5.** Tudo é guardado no `localStorage` do navegador, sob a chave `do-0-ao-emprego:tasks`. Isso significa que o dado é **daquele navegador** — não acompanha o usuário, some ao limpar os dados do site, e não existe em nenhum servidor. A API entra no Tema 7 e substitui esta camada.

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

| Pasta         | O que mora                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------- |
| `assets/`     | Imagens a serem utilizadas no app                                                            |
| `components/` | Componentes reutilizáveis, sem domínio: `Card`, `Button`, `Typography`, `TaskField`          |
| `layout/`     | Layouts genéricos usados em mais de uma página ou estado: `header/`                          |
| `pages/`      | `home/` onde ficam as páginas do app; `home/content/` guarda os componentes de tarefa        |
| `types/`      | Tipos do TypeScript: `Task`, `Status`, `TaskForm`, `FieldErrors`                             |
| `utils/`      | `taskStorage` (ler e gravar no navegador), `taskRules` (transição e validação), `classNames` |

## Decisões

**Tailwind** Usar tailwind para estilização do app. Mais rápido de visualizar as alterações de estilização, não precisa ficar viajando entre arquivos.

**Começou em CSS Modules e migrou para Tailwind — de propósito.** O app foi todo estilizado em CSS Modules primeiro e depois migrado, para resolver os mesmos problemas duas vezes e poder comparar em vez de escolher por indicação.

**Sem biblioteca de classe condicional.** `utils/classNames` junta as classes à mão. `clsx` (filtrar valor falso, aceitar objeto) e `tailwind-merge` (resolver utilitário em conflito) resolvem problemas reais e entram quando aparecerem — hoje todas as listas de classe são fixas.

**Ler o `localStorage` é inicializador do `useState`; gravar é `useEffect`.** A assimetria é deliberada. Ler na montagem por efeito faria o primeiro render pintar a lista vazia e o segundo pintar as tarefas — pisca. Com `useState(loadTasks)` (a função, não a chamada) o primeiro render já está certo. Gravar, sim, é sincronização com algo fora do React, e mora num efeito com `[tasks]`.

**O botão "Alterar" cicla o status: `todo → doing → done → todo`.** As alternativas eram um `<select>` de status (mais explícito, mas antecipa o formulário do Tema 5) e um botão único de "marcar como feita" (mais simples, mas sem caminho de volta). O ciclo foi escolhido porque o botão **sempre faz algo** — não existe estado em que ele fique clicável e morto — e porque fechar o ciclo em `todo` dá como desfazer um clique errado sem precisar de tela de edição.

## Limitações

- **O dado vive no navegador, não num servidor.** Não acompanha o usuário entre máquinas, some ao limpar os dados do site, e o que sai do `localStorage` é aceito sem validação — se o conteúdo estiver corrompido, o app volta ao estado vazio em vez de quebrar, mas um objeto com o formato errado passaria.
- Sem API, rotas, testes ou deploy.
- Só o título é editável depois de criada — status muda pelo botão, e o prazo não muda.
- A edição na linha rejeita título vazio **sem avisar**; só o formulário de criar mostra mensagem.
