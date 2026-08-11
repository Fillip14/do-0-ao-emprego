import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { renderWithProviders } from '../../test/renderWithProviders';
import { COLUMN, column } from '../../test/columns';
import { TasksPage } from './TasksPage';

// Há dois campos "Status" na tela (filtro e formulário): achar o form primeiro.
const taskForm = () => screen.getByRole('button', { name: 'Adicionar' }).closest('form')!;

describe('TasksPage — criar tarefa', () => {
  it('cria a tarefa, coloca na coluna do status escolhido e limpa o campo', async () => {
    const user = userEvent.setup(); // sempre antes do render
    renderWithProviders(<TasksPage />);

    await screen.findByRole('button', { name: 'Comprar pão' }); // espera a lista carregar

    const field = screen.getByLabelText('Tarefa');
    await user.click(field); // o foco é o que expande o rodapé com status e prazo
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
    expect(posts).toBe(0); // validação que deixa a requisição passar não é validação
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
    // Contrato da API: um erro só, com `field: 'task'`, para qualquer dado inválido.
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

    // Não é `role="alert"`: erro do servidor vai para a região `aria-live` do rodapé.
    expect(await screen.findByText('Título muito longo')).toBeVisible();

    expect(screen.getByLabelText('Tarefa')).toHaveValue('Estudar MSW');
    expect(screen.queryByRole('button', { name: 'Estudar MSW' })).toBeNull(); // criar é pessimista
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeEnabled();
  });
});
