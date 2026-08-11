import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { renderWithProviders } from '../../test/renderWithProviders';
import { COLUMN, column } from '../../test/columns';
import { TasksPage } from './TasksPage';

const serverError = () =>
  HttpResponse.json({ errors: [{ message: 'boom' }] }, { status: 500 });

const notFound = () =>
  HttpResponse.json({ errors: [{ message: 'Tarefa não encontrada' }] }, { status: 404 });

describe('TasksPage — ciclo de status', () => {
  it('move a tarefa para a próxima coluna', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(await screen.findByRole('button', { name: 'Alterar status de Comprar pão' }));

    // 'Comprar pão' nasce em todo; um clique leva para doing (nextStatus).
    expect(
      await within(column(COLUMN.doing)).findByRole('button', { name: 'Comprar pão' }),
    ).toBeVisible();
  });

  it('devolve a tarefa para a coluna anterior quando o PATCH falha', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // o handleWriteError loga antes de avisar
    server.use(http.patch('*/tasks/:id', serverError));

    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(await screen.findByRole('button', { name: 'Alterar status de Comprar pão' }));

    // O role="status" está sempre no DOM: espera pelo TEXTO com waitFor, não pelo elemento.
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Não foi possível salvar. Tente de novo.'),
    );

    // Rollback: a tela mentiu por um instante (otimista) e voltou atrás.
    expect(within(column(COLUMN.todo)).getByRole('button', { name: 'Comprar pão' })).toBeVisible();
  });
});

describe('TasksPage — apagar', () => {
  it('tira a tarefa da tela quando o usuário confirma', async () => {
    // jsdom não implementa window.confirm: sem o mock o DELETE nunca sai.
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(await screen.findByRole('button', { name: 'Excluir task de Comprar pão' }));

    await waitFor(() => expect(screen.queryByRole('button', { name: 'Comprar pão' })).toBeNull());
  });

  it('avisa e tira da lista quando a tarefa já não existe no servidor', async () => {
    // O cenário da avaliação: alguém apagou a tarefa por fora, pelo psql.
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    server.use(http.delete('*/tasks/:id', notFound));

    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(await screen.findByRole('button', { name: 'Excluir task de Comprar pão' }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Esta tarefa não existe mais.'),
    );
    expect(screen.queryByRole('button', { name: 'Comprar pão' })).toBeNull();
  });
});

describe('TasksPage — editar título na linha', () => {
  it('salva o novo título com Enter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(await screen.findByRole('button', { name: 'Comprar pão' }));

    const input = screen.getByRole('textbox', { name: 'Editar título da tarefa' });
    await user.clear(input);
    await user.type(input, 'Comprar pão integral{Enter}');

    expect(await screen.findByRole('button', { name: 'Comprar pão integral' })).toBeVisible();
  });

  it('descarta a edição com Escape', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    await user.click(await screen.findByRole('button', { name: 'Comprar pão' }));

    const input = screen.getByRole('textbox', { name: 'Editar título da tarefa' });
    await user.clear(input);
    await user.type(input, 'texto que não deve ficar{Escape}');

    expect(screen.getByRole('button', { name: 'Comprar pão' })).toBeVisible();
    expect(screen.queryByRole('textbox', { name: 'Editar título da tarefa' })).toBeNull();
  });
});
