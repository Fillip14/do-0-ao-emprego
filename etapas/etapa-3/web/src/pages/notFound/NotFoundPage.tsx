import { Link } from 'react-router';
import { Typography } from '../../components/Typography';
import { classNames } from '../../utils/classNames';

export const NotFoundPage = () => {
  return (
    <main className="flex flex-col items-center gap-2">
      <Typography variant="titleHeader">Página não encontrada</Typography>
      <Link
        to="/tasks"
        className={classNames([
          'flex',
          'rounded-full',
          'px-2 py-1',
          'cursor-pointer',
          'border-2 outline-none border-transparent',
          'focus-visible:border-black',
          'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300',
          'text-xs',
        ])}
      >
        Voltar para as tarefas
      </Link>
    </main>
  );
};
