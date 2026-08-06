import { Button } from '../components/Button';

export const InputTask = () => {
  return (
    <div className="flex w-fit mx-auto gap-2 sticky bottom-0 mt-2 z-1 p-2 bg-amber-200 rounded-xl">
      <input
        aria-label="Nova tarefa"
        className="w-27 sm:w-auto text-xs border-2 pb-px border-transparent outline-none focus-visible:border-black pl-3 rounded-full bg-amber-50"
        placeholder="Mais uma tarefinha?"
      />
      <Button>Adicionar</Button>
    </div>
  );
};
