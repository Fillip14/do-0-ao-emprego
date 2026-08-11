import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { server } from '../../test/server';
import { renderWithProviders } from '../../test/renderWithProviders';
import { COLUMN, column } from '../../test/columns';
import { TasksPage } from './TasksPage';

describe('TasksPage — os quatro estados de tela', () => {
  it('mostra o carregando enquanto a resposta não chega', async () => {
    // O delay é o que segura a tela no estado de carregando tempo suficiente
    // para ser vista. Sem ele, a resposta chega antes do primeiro expect.
    server.use(
      http.get('*/tasks', async () => {
        await delay(50);
        return HttpResponse.json([]);
      }),
    );

    renderWithProviders(<TasksPage />);

    // getBy, não findBy: isto tem que estar na tela AGORA, no primeiro render.
    expect(screen.getByRole('heading', { name: 'Carregando suas tarefas' })).toBeVisible();

    // Esperar o fim antes de sair do teste: um setState depois do teste terminar
    // vira aviso de act() e, pior, vaza para o teste seguinte.
    expect(await screen.findByRole('heading', { name: /adiciona umas tarefinhas/i })).toBeVisible();
  });

  it('mostra a mensagem do servidor e o botão de tentar de novo quando o GET falha', async () => {
    server.use(
      http.get('*/tasks', () =>
        HttpResponse.json({ errors: [{ message: 'Deu ruim no servidor.' }] }, { status: 500 }),
      ),
    );

    renderWithProviders(<TasksPage />);

    // Este é o estado que ninguém testa à mão, porque provocá-lo no navegador
    // significa derrubar a API no meio da sessão. Aqui é uma linha de handler.
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Deu ruim no servidor.');
    expect(within(alert).getByRole('button', { name: 'Tentar de novo' })).toBeVisible();
  });

  it('mostra o convite de estado vazio quando a lista volta vazia', async () => {
    server.use(http.get('*/tasks', () => HttpResponse.json([])));

    renderWithProviders(<TasksPage />);

    // Vazio chega como SUCESSO, não como erro — é a decisão do T7. O teste prova
    // que os dois caminhos são tratados de forma diferente.
    expect(await screen.findByRole('heading', { name: /adiciona umas tarefinhas/i })).toBeVisible();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('distribui as tarefas nas três colunas por status', async () => {
    renderWithProviders(<TasksPage />);

    // A primeira asserção espera o fetch; as outras já podem ser síncronas.
    expect(await screen.findByRole('button', { name: 'Comprar pão' })).toBeVisible();

    expect(within(column(COLUMN.todo)).getByRole('button', { name: 'Comprar pão' })).toBeVisible();
    expect(within(column(COLUMN.doing)).getByRole('button', { name: 'Lavar louça' })).toBeVisible();
    expect(
      within(column(COLUMN.done)).getByRole('button', { name: 'Estudar testes' }),
    ).toBeVisible();
  });
});
