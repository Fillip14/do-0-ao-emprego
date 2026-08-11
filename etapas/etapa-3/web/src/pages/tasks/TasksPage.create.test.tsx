import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { renderWithProviders } from '../../test/renderWithProviders';
import { COLUMN, column } from '../../test/columns';
import { TasksPage } from './TasksPage';

// Há dois campos rotulados "Status" na tela: o do filtro e o do formulário.
// Pedir `getByLabelText('Status')` acharia os dois e estouraria — então
// primeiro se acha o formulário, depois se procura dentro dele.
const taskForm = () => screen.getByRole('button', { name: 'Adicionar' }).closest('form')!;

describe('TasksPage — criar tarefa', () => {
  it('cria a tarefa, coloca na coluna do status escolhido e limpa o campo', async () => {
    const user = userEvent.setup(); // sempre antes do render
    renderWithProviders(<TasksPage />);

    await screen.findByRole('button', { name: 'Comprar pão' }); // espera a lista carregar

    const field = screen.getByLabelText('Tarefa');
    // O clique é o que dá FOCO ao campo, e é o foco que expande o rodapé com
    // status e prazo. Com fireEvent.click não haveria foco, e este teste seria
    // impossível de escrever — é a diferença do tópico 6, em uma linha.
    await user.click(field);
    await user.type(field, 'Estudar MSW');
    await user.selectOptions(within(taskForm()).getByLabelText('Status'), 'doing');

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(
      await within(column(COLUMN.doing)).findByRole('button', { name: 'Estudar MSW' }),
    ).toBeVisible();
    expect(screen.getByLabelText('Tarefa')).toHaveValue('');
  });

  it('recusa título vazio sem mandar requisição nenhuma', async () => {
    let posts = 0;
    server.use(
      http.post('*/tasks', () => {
        posts++;
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    await screen.findByRole('button', { name: 'Comprar pão' });

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Escreva um título para a tarefa');
    // A metade que importa: validação que deixa a requisição passar não é
    // validação, é decoração.
    expect(posts).toBe(0);
  });

  it('não cria duas tarefas com dois cliques seguidos em Adicionar', async () => {
    let posts = 0;
    server.use(
      http.post('*/tasks', async ({ request }) => {
        posts++;
        const body = (await request.json()) as object;
        await delay(50); // segura a resposta para o segundo clique acontecer no meio
        return HttpResponse.json({ ...body, id: 'task-99' }, { status: 201 });
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    await screen.findByRole('button', { name: 'Comprar pão' });

    await user.click(screen.getByLabelText('Tarefa'));
    await user.type(screen.getByLabelText('Tarefa'), 'Estudar MSW');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    // O botão troca de nome e desabilita enquanto a requisição está no ar (isSubmitting, T5).
    const submitting = await screen.findByRole('button', { name: /adicionando/i });
    await waitFor(() => expect(submitting).toBeDisabled());
    await user.click(submitting); // o segundo clique, que não pode virar requisição

    expect(await screen.findByRole('button', { name: 'Estudar MSW' })).toBeVisible();
    expect(posts).toBe(1);
  });

  it('mostra o erro do servidor no formulário e preserva o que foi digitado', async () => {
    // O formato é o do contrato da API: um erro só, com `field: 'task'`, para
    // qualquer dado inválido. É por isso que ele vira mensagem de formulário e
    // não erro por campo — a divergência está escrita nas Limitações do README.
    server.use(
      http.post('*/tasks', () =>
        HttpResponse.json(
          { errors: [{ field: 'task', message: 'Título muito longo' }] },
          { status: 400 },
        ),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);
    await screen.findByRole('button', { name: 'Comprar pão' });

    await user.click(screen.getByLabelText('Tarefa'));
    await user.type(screen.getByLabelText('Tarefa'), 'Estudar MSW');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    // Não é `role="alert"`: aquele é o erro POR CAMPO do TaskField, que a
    // validação do cliente usa. O erro do servidor é a região `aria-live` do
    // rodapé — dois caminhos diferentes, de propósito.
    expect(await screen.findByText('Título muito longo')).toBeVisible();

    // A metade que a avaliação cobra: o erro não pode custar o que foi digitado.
    expect(screen.getByLabelText('Tarefa')).toHaveValue('Estudar MSW');
    // E o otimista não vale aqui — criar é pessimista, então nada entrou na lista.
    expect(screen.queryByRole('button', { name: 'Estudar MSW' })).toBeNull();
    // O botão volta a funcionar: erro não pode deixar o formulário travado.
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeEnabled();
  });
});
